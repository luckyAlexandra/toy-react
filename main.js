import {ToyReact} from './ToyReact'

class MyComponent {
  render () {
    return <div>cool</div>
  }
  setAttribute (name, value) {
    this[name] = value
  }
  mountTo (parent) {
    let vdom = this.render()
    vdom.mountTo(parent)
  }
}

// let a = <MyComponent name="a"/>

let a = <MyComponent name="a" id="ida">
  <span>Hello</span>
  <span>world</span>
  <span>!</span>
</MyComponent>

console.log(a)

// document.body.appendChild(a)

ToyReact.render(
  a,
  document.body
)

