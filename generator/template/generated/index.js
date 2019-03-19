import MyComponent from './components/MyComponent'

function install (Vue, options = {}) {
  Vue.component(options.MyComponentName || 'MyComponent', MyComponent)
}

export default install

export {
  MyComponent
}
