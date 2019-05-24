import ElTableWrapper from './Template.vue'

function setDefaultProps (customize) {
  for (let prop in customize) {
    if (!customize.hasOwnProperty(prop)) {
      continue
    }
    if (!ElTableWrapper.props.hasOwnProperty(prop)) {
      continue
    }
    let property = ElTableWrapper.props[prop]
    if (typeof property.default !== 'function') {
      property['default'] = customize[prop]
      continue
    }
    // 默认值为函数的，就是数组或对象
    // 组件定义的默认值
    let value = property.default()
    // 数组的话直接替换
    if (Array.isArray(value)) {
      property['default'] = customize[prop]
      continue
    }
    let defaults = property['default']()
    // 是对象的话就合并
    property['default'] = function () {
      return {
        ...defaults,
        ...customize[prop]
      }
    }
  }
}

/**
 *
 * @param Vue
 * @param defaults 通过 Vue.use 注册组件时，设置的组件默认值
 */
ElTableWrapper.install = function (Vue, defaults) {
  if (defaults) {
    setDefaultProps(defaults)
  }
  Vue.component(ElTableWrapper.name, ElTableWrapper)
}

export default ElTableWrapper
