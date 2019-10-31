# ElTableWrapper

此组件封装了 `element-ui` 中的 `ElTable` 和 `ElPagination` 组件，以提供表格与分页一体化的展示效果。

> 注: 后将此组件 `ElTableWrapper` 统称为 `组件`

组件支持多种分页方式，[点此查看](PAGINATION.md)

## 安装

```bash
npm istall @hyjiacan/eltable-wrapper
```
或
```bash
yarn add @hyjiacan/eltable-wrapper
```

## 快速上手

*main.js*
```javascript
import Vue from 'vue'
import ElTableWrapper from '@hyjiacan/ElTableWrapper'
import '@hyjiacan/eltable-wrapper/lib/eltable-wrapper.css'

// 设置组件的默认值
const defaults = {
    // ajax请求函数
    ajax: (e)=>{},
    // ajax请求method
    method: 'get',
    // 每页显示的数据量
    size: 10,
    // 分页类型
    type: 'l'
}
Vue.use(ElTableWrapper, defaults)
```

```vue
<el-table-wrapper
    url="/path/to/url"
    :params="{p0: 1}"
    @ajax-error="onAjaxError"
    >
  <el-table-column type="selection"></el-table-column>    
  <el-table-column prop="id"></el-table-column>    
  <el-table-column prop="name"></el-table-column>    
</el-table-wrapper>
<script>
export default {
  methods:{
    onAjaxError(e) {
      console.error(e)
    }
  }
}
</script>
```

## 属性

可以通过以下方式指定组件属性的默认值: 

```javascript
import Vue from 'vue'
import ElTableWrapper from '@hyjiacan/ElTableWrapper'

// 设置组件的默认值
const defaults = {
    // ajax请求函数
    ajax: (e)=>{},
    // ajax请求method
    method: 'get',
    // 每页显示的数据量
    size: 10,
    // 分页类型
    type: 'l'
}
Vue.use(ElTableWrapper, defaults)
```

### 公共属性

|名称|类型|默认值|描述|
|---|---|---|---|
|type|String|s|分页方式，可选值: `l`(本地分页), `i`(增量分页), `s`(服务器分页)，[去看看分页方式](PAGINATION.md)|
|auto-height|Boolean|false|是否自动调整高度，设置为`false`时会设置高度撑满父容器|
|custom-class|String|-|自定义的样式类|
|pager-position|String|bottom|分页条位置，可选值为 `bottom` `top` `both`|
|header-size|String/Number|48|`header` 高度，单位为`px`|
|footer-size|String/Number|40|`footer` 高度，单位为`px`|
|selection|String|-|指示表格选择模式，可选值为: 空, `single`, `multiple`，当表格列中指定了 `type="selection"` 时，会覆盖此值为 `multiple`|
|advance-selection|Boolean|false|是否启用高级选择，启用时支持跨页页面选择|
|id-field|String/Array/Function|id|数据项的标识字段，若标识不在顶层，则使用数组传递，也可以传入一个函数，函数接收一个行对象，函数的返回值将作为标识|
|size|String/Number|10|每页显示的数据量|
|sizes|Array|-|切换每页显示数据量的列表|
|index|String/Number|1|默认显示的页码|
|show-pager-summary|Boolean|true|是否显示总数据量|

- `ElTable` 的原生属性支持见 [ElTable支持的属性](OPTIONS.md#ElTable支持的属性)
- `ElTable` 的原生事件支持见 [ElTable支持的事件](OPTIONS.md#ElTable支持的事件)
- `ElPagination` 的原生属性支持见 [ElPagination支持的属性](OPTIONS.md#ElPagination支持的属性)

> 多层的`id-field`使用数组而不是字符串，是为了便于处理某些字段中包含特殊字符(甚至是`.`符号)的情形

### AJAX属性

|名称|类型|默认值|描述|
|---|---|---|---|
|ajax|function|-|向服务器发送ajax请求的方法，需要返回一个 `Promise`对象。当 `type` 为`i` 或 `s` 时是必须的|
|url|String|-|向服务器请求数据的url|
|method|String|get|向服务器请求数据的method|
|params|Object|-|向服务器请求数据的参数|
|param-size|String|pageSize|向服务器发送请求时，数据量参数名|
|response-handler|Function|-|设置当服务器返回数据后，预处理函数，处理后的数据通过返回值提交|
|auto-load|Boolean|true|在使用服务器数据源时，是否在挂载后自动加载数据|
|check-params|Function|-|在组件向服务器发起请求前，可以通过此函数检查参数是否正确，将新的参数作为返回值，返回`false`以阻止继续执行|
|load-when-params-change|Boolean|false|是否在ajax参数改变时自动重新加载数据(此时会监听`params`变化)|
|loading|Boolean|false|是否显示loading状态|
|loading-text|Boolean|false|显示loading状态时的文本|
|loading-icon|Boolean|false|显示loading状态时的图标|
|loading-color|Boolean|false|显示loading状态时的背景色|

#### 增量分页特有属性

|名称|类型|默认值|描述|
|---|---|---|---|
|default-id|String/Number|''|默认的数据id，当未加载数据时，增量更新请求时使用此值|
|inc-size|String/Number|80|增量分页时每次向服务器请求的数据量|
|param-inc|String|lastId|增量加载数据时，增量参数名|
|inc-id|String|-|增量加载数据时，数据项的标识字段，未指定时，使用 `idField` 的值,用法与 `idField` 相同|


#### 服务器分页特有属性

|名称|类型|默认值|描述|
|---|---|---|---|
|param-index|String|pageIndex|向服务器发送请求时，页码参数名|
|total-field|String|total|服务器分页时，返回数据中的数据总量字段名称|
|list-field|String|list|服务器分页时，返回数据中的数据列表字段名称|

#### 本地分页特有属性

|名称|类型|默认值|描述|
|---|---|---|---|
|local-data|Array|-|本地分页时，设置本地数据。当此值变化时，本地数据会清空，然后再重新渲染|

## 方法

|名称|参数|返回值|描述|
|---|---|---|---|
|load|clear=true: Boolean|this|在使用服务器数据源时，调用此方法以从服务器加载数据|
|clear|-|this|清空数据并重置分页|
|info|-|Object(返回值见下方)|获取数据信息|
|append|data: Array/Object|this|向表格尾追加数据项|
|prepend|data: Array/Object|this|向表格头追加数据项|
|insert|data: Array/Object, index: Number|this|向表格指定位置追加数据项|
|update|data: Array/Object|this|从数据缓存中更新数据项|
|remove|data: Array/Object|this|从数据缓存中移除数据项|
|getDataId|row: Object, \[idField]: string|this|根配置的 idField 读取数据项的 id|
|select|rows: Object/Array|this|选中指定的行|
|selectAll|-|Array|全选，仅在多选时生效，返回选中的数据项|
|deselect|rows: Object/Array|this|取消选中指定的行|
|deselectAll|-|Array|取消全选，仅在多选时生效，返回取消选中的数据项|
|getSelection|-|Array/Object|获取选中的行，单选时返回选中的行对象，多选时返回行集合|
|clearSelection|-|this|清除所有选中|
|clearSort|-|this|`ElTable` 的 `clearSort` 方法|
|clearFilter|-|this|`ElTable` 的 `clearFilter` 方法|
|doLayout|-|this|`ElTable` 的 `doLayout` 方法|
|sort|-|this|`doLayout` 的 `sort` 方法|

`info()` 返回值:
```javascript
const data = {
    // 页码 
    pageIndex: Number,
    // 总页数
    pageCount: Number,
    // 每页的数据量
    pageSize: Number,
    // 总数据量
    dataSize: Number,
    // 选中数量
    selected: Number
}
```

## 事件

|名称|参数|描述|
|---|---|---|
|ajax-error|{data, message, response}|加载ajax数据失败的事件|
|data-size-change|size: Number|表格数据量变化|
|page-size-change|size: Number|表格每页显示的数据量变化|
|page-index-change|index: Number|表格的页码变化|
|select|selected: Object, prevSelected: Object|在单选时，行被点击后触发|
|selection-change|{selection: Array, type: String, changed: Array, allSelected: Boolean}|多选时，选中或取消选中行时触发；当没有数据项时，`allSelected`始终为`false`|
|cell-mouse-enter|-|ElTable 事件|
|cell-mouse-leave|-|ElTable 事件|
|cell-click|-|ElTable 事件|
|cell-dblclick|-|ElTable 事件|
|row-click|-|ElTable 事件|
|row-contextmenu|-|ElTable 事件|
|row-dblclick|-|ElTable 事件|
|header-click|-|ElTable 事件|
|header-contextmenu|-|ElTable 事件|
|sort-change|-|ElTable 事件|
|filter-change|-|ElTable 事件|
|header-dragend|-|ElTable 事件|
|expand-change|-|ElTable 事件|

## 插槽

|名称|数据|描述|
|---|---|---|
|header|data|可选的表格顶部插槽|
|default|-|`ElTable` 的列集合，用法与 `ElTable` 的默认插槽相同|
|empty|-|`ElTable` 的 `empty` 插槽|
|append|-|`ElTable` 的 `append` 插槽|
|pagerPrepend|data|分页插槽，默认放在分页左侧|
|pagerAppend|data|分页插槽，默认放在分页右侧|
|pagerSummary|data|自定义的分页信息统计|
|footer|data|分页左侧的文字|

注:
 
`header`, `footer` 有相同的作用域数据:

```javascript
const data = {
    // 页码 
    pageIndex: Number,
    // 总页数
    pageCount: Number,
    // 每页的数据量
    pageSize: Number,
    // 总数据量
    dataSize: Number,
    // 选中数量
    selected: Number
}
```

`pagerPrepend`, `pagerSummary`, `pagerAppend` 三个插槽有相同的作用域数据:

```javascript
const data = {
    pageIndex: Number,
    pageCount: Number,
    pageSize: Number,
    dataSize: Number,
    selected: Number,
    position: String['top', 'bottom']
}
```
