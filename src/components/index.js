import {Table, TableColumn} from 'element-ui'
import ElTableWrapper from './Template.vue'

import 'element-ui/lib/theme-chalk/table.css'
import 'element-ui/lib/theme-chalk/table-column.css'

function setDefaultProps(customize) {
  for (let prop in customize) {
    if (!customize.hasOwnProperty(prop)) {
      continue
    }
    // 处理带下划线格式成驼峰
    prop = prop.replace(/-[a-z]/g, match => {
      return match[1].toUpperCase()
    })
    if (!ElTableWrapper.props.hasOwnProperty(prop)) {
      continue
    }
    ElTableWrapper.props[prop]['default'] = customize[prop]
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
  Vue.component(Table.name, Table)
  Vue.component(TableColumn.name, TableColumn)
  Vue.component(ElTableWrapper.name, ElTableWrapper)
}

export default ElTableWrapper
