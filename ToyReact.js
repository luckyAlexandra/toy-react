class ElementWraper {
    constructor (type) {
        this.root = document.createElement(type)
    }

    setAttribute (name, value) {
        // 事件绑定
        // \s表示空白，\S表示非空白，加在一起表示所有字符
        if (name.match(/^on([\s\S/]+)$/)) {
            let eventName = RegExp.$1.replace(/^[\s\S]/, s => s.toLowerCase())
            this.root.addEventListener(eventName, value)
        }
        if (name === 'className') {
            this.root.setAttribute('class', name)
        }
        // 代理在this.root上
        this.root.setAttribute(name, value)
    }

    appendChild (vchild) {
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
        // 创建干净的props对象
        this.props = Object.create(null)
    }
    setAttribute (name, value) {
        this.props[name] = value
        this[name] = value
    }
    mountTo (parent) {
        let vdom = this.render()
        vdom.mountTo(parent)
       // todo range 50
        // // rerender
        // let range = document.createRange() //range会保证标签闭合
        // // 传node和offset, 如果是node文本节点，offset就是里面的文字，如果node是元素节点， offset就是里面的子元素或者子节点
        // range.setStartAfter(parent.lastChild)
        // range.setEndAfter(parent.lastChild)

    }
    // 对Component做appendChild
    appendChild (vchild) {
        this.children.push(vchild)
    }
    setState (state) {
        let merge = (oldState, newState) => {
            for (let p in newState) {
                if (typeof newState[p] === 'object') {
                    if (oldState[p] !== 'object') {
                        oldState = {}
                        merge(oldState[p], newState[p])
                    }
                } else {
                    oldState[p] = newState[p]
                }
            }
        }
        if (!this.state && this.state) {
            this.state = {}
        }
        merge(this.state, state)
        console.log(this.state)
    }

}

export let ToyReact = {
    createElement (type, attributes, ...children) {
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
                    if (!(child instanceof Component)
                        && !(child instanceof ElementWraper)
                        && !(child instanceof TextWraper)) {
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
        // 让vdom去做mountTo
        vdom.mountTo(element)
    }
}