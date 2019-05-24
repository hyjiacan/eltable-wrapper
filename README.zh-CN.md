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

|name|type|default|description|
|---|---|---|---|
|url|String|-|the url for requesting data|
|method|String|get|the method for requesting data|
|ajax|function|-|Function to load data, should return `Promise` object. Required if `source` is `i` or `s`|
|size|String/Number|10|Data amount per page|
|sizes|Array\<Number>|-|Change size displayed per page|
|auto-height|Boolean|false|Auto adjust component height, otherwise make height `100%`|
|source|String|s|Paginate source, available values: `l`(local), `i`(increment), `s`(server)|

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
