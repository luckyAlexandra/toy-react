import {ToyReact, Component} from './ToyReact'

class MyComponent extends Component {
  render () {
    return <div>
      <span>hello</span>
      <span>world</span>
      <span>{this.children}</span>
    </div>
  }
}

// let a = <MyComponent name="a"/>

let a = <MyComponent name="a" id="ida">
  <div>123</div>
</MyComponent>

// console.log(a)

ToyReact.render(
  a,
  document.body
)

