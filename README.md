# ElTableWrapper

This component wraps component `ElTable` and `ElPagination` in `element-ui`.

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
|pre-handler|function|-|pre handle response data, then return a Array|
|local|Array|-|Local data, if this property is specified, it means use local data source|
|size|String/Number|10|Data amount per page|
|sizes|Array\<Number>|-|Change size displayed per page|
|auto-height|Boolean|false|Auto adjust component height, otherwise make height `100%`|
|type|String|s|Paginate type, available values: `l`(local), `i`(increment), `s`(server)|


## Methods

|name|arguments|return|description|
|---|---|---|---|
|clear|-|-|clear table data and reset pagination|
