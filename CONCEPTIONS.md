# Conceptions

## Data source 

### Local

For short value `l`, meant to use local data source.

In this situation, append all data and component will manage the pagination.

### Increment

For short value `i`, meant to use incremental increase data source.

In this situation: 

- Request plenty data (specified amount) from server, and server response one more records than request.
- Append data to component, component will cache them
- Component send load request only if paginate to the last page and got one more record (won't cache it) 
- Component will notify you via event `load` with the last record and request size while page changed

### Server

For short value 's', meant to use server pagination.

In this situation:

- Server response a fixed amount of data, and the total amount
- Component just show the data, and notify you via event `load` with the page index and page size  while page changed
