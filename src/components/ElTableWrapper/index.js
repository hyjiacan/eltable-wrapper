import ElTableWrapper from './Template.vue'

function setDefaultProps (defaults) {
  for (let prop in defaults) {
    if (!defaults.hasOwnProperty(prop)) {
      continue
    }
    if (!ElTableWrapper.props.hasOwnProperty(prop)) {
      continue
    }
    ElTableWrapper.props[prop]['default'] = defaults[prop]
  }
}

ElTableWrapper.install = function (Vue, defaults) {
  if (defaults) {
    setDefaultProps(defaults)
  }
  Vue.component(ElTableWrapper.name, ElTableWrapper)
}

export default ElTableWrapper
