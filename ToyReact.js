class ElementWraper {
    constructor (type) {
        this.root = document.createElement(type)
    }

    setAttribute (name, value) {
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
        this.root = document.createElement(content)
    }
    mountTo (parent) {
        parent.appendChild(this.root)
    }
}

export let ToyReact = {
    createElement (type, attributes, ...children) {
        let element = document.createElement(type)

        if (typeof type === 'string') {
            element = new ElementWraper(type)
        } else {
            element = new type
        }
        for (let name in attributes) {
            element.setAttribute(name, attributes[name])
        }
        for (let child of children) {
            if (typeof child === 'string') {
                child = document.createTextNode(child)
            }
            element.appendChild(child)
        }
        return element
    },
    render (vdom, element) {
        vdom.mountTo(element)
    }
}