class ElementWraper {
    constructor (type) {
        this.root = document.createElement(type)
    }

    setAttribute (name, value) {
        // 代理在this.root上
        this.root.setAttribute(name, value)
    }

    appendChild (vchild) {
        // console.log(vchild, this.root)
        vchild.mountTo(this.root)
    }

    mountTo (parent) {
        parent.appendChild(this.root)
    }
}

class TextWraper {
    constructor (content) {
        this.root = document.createTextNode(content)
    }
    mountTo (parent) {
        parent.appendChild(this.root)
    }
}

export class Component {
    constructor () {
        this.children = []
    }
    setAttribute (name, value) {
        this[name] = value
    }
    mountTo (parent) {
        let vdom = this.render()
        vdom.mountTo(parent)
    }
    // 对Component做appendChild
    appendChild (vchild) {
        this.children.push(vchild)
    }
}

export let ToyReact = {
    createElement (type, attributes, ...children) {
        console.log('create')
        let element
        if (typeof type === 'string') {
            element = new ElementWraper(type)
        } else {
            element = new type
        }
        for (let name in attributes) {
            element.setAttribute(name, attributes[name])
        }

        // 在组件中使用{this.children}传进来的是数组
        let insertChildren = (children) => {
            for (let child of children) {
                if (typeof child === 'object' && child instanceof Array) {
                    // 递归调用自己展开children
                    insertChildren(child)
                } else {
                    // 非三种实例，string强转保底
                    if (!child instanceof Component
                        && !child instanceof ElementWraper
                        && !child instanceof TextWraper) {
                        child = String(child)
                    }
                    if (typeof child === 'string') {
                        child = new TextWraper(child)
                    }
                    element.appendChild(child) // Component上要加appendChild方法
                }
            }
        }

        insertChildren(children)

        return element
    },
    render (vdom, element) {
        console.log('render')
        // 让vdom去做mountTo
        vdom.mountTo(element)
    }
}