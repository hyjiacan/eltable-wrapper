# 分页方式

组件支持三种分页方式: 本地分页(local)，增量分页(increment)，服务器分页(server)

> 默认的分页方式为 **服务器分页** (`s`)

**当指定了 `p-disabled` 时，不会分页，也不会向服务器发送分页相关参数**

不分页时，可以接收返回的数据为数组或与服务器分页相同的结构。

## 本地分页
 
此时需要使用本地数据源，数据通过`append`方法传入:

*FooBar.vue*
```vue
<template>
  <el-table-wrapper type="l" ref="table"></el-table-wrapper>
</template>
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

此时，组件会根据数据量自动进行分页。

## 增量分页

- 每次向服务器请求指定 `pageSize` ，如果未获取到数据尾，那么返回比请求时多一条数据。
- 如果已获取到数据尾，那么返回剩下的数据。
- 每次的请求会携带上多返回的那项数据的 `lastId`，服务器通过此标识返回增量数据。

*FooBar.vue*
```vue
<template>
  <el-table-wrapper 
    type="i"
    url="http://path/to/data"
    method="get"
  ></el-table-wrapper>
</template>
<script>
export default {
  name: 'FooBar'
}
</script>
```

此时`ajax`请求的参数包含如下信息:
```json
{
  "lastId": "",
  "pageSize": 80
}
```

- `lastId` 是上次查询得到的数据的最后一条，首次查询时为空`''`(也可以通过属性`default-id`指定默认值)，此参数名可以通过属性`param-inc`指定
- `pageSize` 是每次请求的数据量，此参数名可以通过属性`param-size`指定

返回的数据结构:

```json
[]
```

如果返回的结构不是这样的，那么就需要通过指定`response-handler`来对响应的数据进行预处理

## 服务器分页

- 组件会带上`pageSize`和`pageIndex`向服务器请求数据，
- 服务器返回指定页的数据`list`，以及总的数据数量`total`。
此时`ajax`请求的参数包含如下信息:
```json
{
  "lastId": "",
  "pageSize": 80
}
```

- `pageIndex` 是请求的页码(从`0`开始)，此参数名可以通过属性`param-index`指定
- `pageSize` 是每次请求的数据量，此参数名可以通过属性`param-size`指定

响应的数据结构:
```json
{
  "list": [],
  "total": 0
}
```
- `list` 数据列表放在这个字段上，此参数名可以通过属性`list-field`指定
- `total` 数据总量放在这个字段上，此参数名可以通过属性`total-field`指定

如果返回的结构不是这样的，那么就需要通过指定`response-handler`来对响应的数据进行预处理
