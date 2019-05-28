# ElTableWrapper

This component wraps component `ElTable` and `ElPagination` from `element-ui`.

> [点击此处](README.zh-CN.md)查看中文文档

## Data source

Data source should always be `Array`.

You can provide data source in two ways:

1. Local data
2. Remote data

### Local data

### Remote data

You can provide remote data in two ways:

1. Load amount of data the property `size` specified and tell this component the total data count
2. Load plenty data over the property `size` specified, and paginate it by this component

## Props

|name|type|default|description|
|---|---|---|---|
|url|String|-|the url for requesting data|
|method|String|get|the method for requesting data|
|ajax|function|-|Function to load data, should return `Promise` object. Required if `source` is `i` or `s`|
|size|String/Number|10|Data amount per page|
|sizes|Array\<Number>|-|Change size displayed per page|
|auto-height|Boolean|false|Auto adjust component height, otherwise make height `100%`|
|source|String|s|Paginate source, available values: `l`(local), `i`(increment), `s`(server)|

You can customize the default values like this: 

```javascript
import Vue from 'vue'
import ElTableWrapper from '@hyjiacan/ElTableWrapper'
const defaults = {
    // set this for global ajax method
    ajax: (e)=>{},
    method: 'get',
    size: 10,
    sizes: () => [10, 20],
    autoHeight: false,
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
