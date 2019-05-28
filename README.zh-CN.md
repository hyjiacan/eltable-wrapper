# ElTableWrapper

此组件封装了 `element-ui` 中的 `ElTable` 和 `ElPagination` 组件，以提供表格与分页一体化的展示效果。

> 注: 后将此组件统称为 `组件`

> [CLICK HERE](README.zh-CN.md) to view docs in English

## 用法

*main.js*
```javascript
import Vue from 'vue'
import ElTableWrapper from '@hyjiacan/ElTableWrapper'
const defaults = {
    // 设置全局的ajax请求方法
    ajax: (e)=>{},
    method: 'get',
    size: 10,
    autoHeight: false,
    source: 'l'
}
Vue.use(ElTableWrapper, defaults)
```

```vue
<el-table-wrapper
    ajax-url="/path/to/url"
    :ajax-params="{p0: 1}"
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

## 数据源(分页方式)

组件可使用两种数据源: 本地数据，服务器数据

三种分页方式: 本地分页，增量分页，服务器分页

### 本地数据

**本地分页** 时需要使用本地数据:

```vue
<el-table-wrapper source="l" ref="table"></el-table-wrapper>
<script>
export default {
  name: 'FooBar',
  mounted() {
    const data = []
    // 向表格添加本地数据
    this.$refs.table.append(data)
  }
}
</script>
```

此时，组件会自动进行分页。

### 服务器数据

**增量分页** 和 **服务器分页** 使用服务器数据。

- **增量分页**
    > 每次向服务器请求指定 `pageSize` ，如果未获取到数据尾，那么返回比请求时多一条数据。
    如果已获取到数据尾，那么返回剩下的数据。
    每次的请求会携带上多返回的那项数据的 `lastId`，服务器通过此标识返回增量数据。
- **服务器分页**
    > 这是传统的分页方式。组件会带上`pageSize`和`pageIndex`向服务器请求数据，
    服务器返回指定页的数据`list`，以及总的数据数量`total`。
    ```json
    {
      "list": [],
      "total": 0
    }
    ```

## 属性

|名称|类型|默认值|描述|
|---|---|---|---|
|source|String|s|分页类型，可选值: `l`(本地分页), `i`(增量分页), `s`(服务器分页)|
|id-field|String/Array/Function|id|数据项的标识字段，若标识不在顶层，则使用数组传递，也可以传入一个函数，函数接收一个行对象，函数的返回值将作为标识|
|auto-height|Boolean|false|是否自动调整高度，设置为`false`时会设置高度撑满父容器|
|advance-selection|Boolean|false|是否启用高级选择，启用时支持跨页页面选择|
|ajax|function|-|向服务器发送ajax请求的方法，需要返回一个 `Promise`对象。当 `source` 为`i` 或 `s` 时是必须的|
|ajax-url|String|-|向服务器请求数据的url|
|ajax-method|String|get|向服务器请求数据的method|
|ajax-params|Object|-|向服务器请求数据的参数|
|auto-load|Boolean|true|在使用服务器数据源时，是否在挂载后自动加载数据|
|param-index|String|pageIndex|向服务器发送请求时，页码参数名|
|param-size|String|pageSize|向服务器发送请求时，数据量参数名|
|total-field|String|total|服务器分页时，返回数据中的数据总量字段名称|
|list-field|String|list|服务器分页时，返回数据中的数据列表字段名称|
|size|Number|10|每页显示的数据量|
|sizes|Array|-|切换每页显示数据量的列表|
|index|Number|1|默认显示的页码|
|incSize|Number|80|增量分页时每次向服务器请求的数据量|
|paramInc|String|lastId|增量加载数据时，增量参数名|
|incId|String|-|增量加载数据时，数据项的标识字段，未指定时，使用 idField 的值,用法与 idField 相同|

- `ElTable` 的原生属性支持见 [ElTable支持的属性](OPTIONS.zh-CH.md#ElTable支持的属性)
- `ElTable` 的原生事件支持见 [ElTable支持的事件](OPTIONS.zh-CH.md#ElTable支持的事件)
- `ElPagination` 的原生属性支持见 [ElPagination支持的属性](OPTIONS.zh-CH.md#ElPagination支持的属性)


可以通过以下方式指定组件属性的默认值: 

```javascript
import Vue from 'vue'
import ElTableWrapper from '@hyjiacan/ElTableWrapper'
const defaults = {
    // 设置全局的ajax请求方法
    ajax: (e)=>{},
    method: 'get',
    size: 10,
    sizes: () => [10, 20],
    autoHeight: false,
    source: 'l'
}
Vue.use(ElTableWrapper, defaults)
```

## 方法

|名称|参数|返回值|描述|
|---|---|---|---|
|load|-|this|在使用服务器数据源时，调用此方法以从服务器加载数据|
|clear|-|this|清空数据并重置分页|
|append|data: Array/Object|this|向表格尾追加数据项|
|prepend|data: Array/Object|this|向表格头追加数据项|
|insert|data: Array/Object, index: Number|this|向表格指定位置追加数据项|
|update|data: Array/Object|this|从数据缓存中更新数据项|
|remove|data: Array/Object|this|从数据缓存中移除数据项|
|getDataId|row: Object, \[idField]: string|this|根配置的 idField 读取数据项的 id|
|select|rows: Object/Array|this|选中指定的行|
|deselect|rows: Object/Array|this|取消选中指定的行|
|getSelection|-|Array/Object|获取选中的行，单选时返回选中的行对象，多选时返回行集合|
|clearSelection|-|this|清除所有选中|
|clearSort|-|this|`ElTable` 的 `clearSort` 方法|
|clearFilter|-|this|`ElTable` 的 `clearFilter` 方法|
|doLayout|-|this|`ElTable` 的 `doLayout` 方法|
|sort|-|this|`doLayout` 的 `sort` 方法|

## 事件

|名称|参数|描述|
|---|---|---|
|ajax-error|{data, message, response}|加载jax数据失败的事件|
|select|selected: Object, prevSelected: Object|在单选时，行被点击后触发|
|selection-change|selection: Array, type: String, changed: Array|多选时，选中或取消选中行时触发|
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
|header|-|可选的表格顶部插槽|
|default|-|`ElTable` 的列集合，用法与 `ElTable` 的默认插槽相同|
|empty|-|`ElTable` 的 `empty` 插槽|
|append|-|`ElTable` 的 `append` 插槽|
|footer|selected: Number|分页左侧的文字，`selected`为选中项的数量|
