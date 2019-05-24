# ElTableWrapper

此组件封装了 `element-ui` 中的 `ElTable` 和 `ElPagination` 组件，以提供表格与分页一体化的展示效果。

> 注: 后将此组件统称为 `组件`

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
|disable-pager|Boolean|false|是否禁用分页|
|incSize|Number|80|增量分页时每次向服务器请求的数据量|
|paramInc|String|lastId|增量加载数据时，增量参数名|
|incId|String|-|增量加载数据时，数据项的标识字段，未指定时，使用 idField 的值,用法与 idField 相同|
|table-option|Object|-|ElTable 的[属性](OPTIONS.zh-CH.md#ElTable支持的属性)与[事件](OPTIONS.zh-CH.md#ElTable支持的事件))集合|
|pager-option|Object|-|ElPagination 的[属性](OPTIONS.zh-CH.md#ElPagination支持的属性)集合(不支持事件)|


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
    disablePager: false,
    source: 'l'
}
Vue.use(ElTableWrapper, defaults)
```

## Methods

|name|arguments|return|description|
|---|---|---|---|
|clear|-|-|clear table data and reset pagination|

## Events

|name|arguments|description|
|---|---|---|
|select|selected, prevSelected|Trigger while row click (single selection mode only)|
|selection-change|selection rows, type, changed rows|Trigger while row selected/deselected (multiple selection mode only)|
