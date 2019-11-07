---
title: Query Scripting
summary: Learn about querying for models with chainable filters.
---

Stacklane uses method chaining to define the criteria of returned query results.
In general with method chaining _order matters_ &mdash; for example, field filters must be defined
before calling `limit`.

The results of a query are generally "used" outside of the script itself.  
For example, a [Mustache endpoint](/🗄/Article/endpoints/mustache.md)
may iterate over a query given by a [supplier](/🗄/Article/scripting/suppliers.md)
to display results as HTML.

# All Results {#all}

To query all models of a type, without any filters, use the `all()` method. For example, `Article.all()`

Results will be returned in the model's [natural ordering](/🗄/Article/models/ordering.md#query).

# Contained Models {#containers}

Querying a model [contained](/🗄/Article/models/containers.md) by a parent model
is performed in much the same way as any other model query.
The main difference is that these queries must first specify a parent selector:

## Specific Parent

To query for models within a specific container, use the method by its lowercase name.
Given a container named `List` and its contained model named `Note`,
then a query for every `Note` in a specific `List` would be:

`Note.list(theListVar)`

## Any Parent

To query contained models across all of its containers, use the `any` prefix, followed by the name of the parent type:

`Note.anyList()`

## Additional Filters

After a parent container selector, any other field filters and query methods may be specified as usual.

# Field Filters {#field}

Queries besides `all()` start with a field filter.
Multiple field filters may be chained together.
Keep in mind that field filters are effectively **and** conditions.

### `eq`
        
`Article.title('theTitle')`

### `gt`

`Article.created_gt(new Date(2000))`

### `gte`

`Product.price_gte(30)`

### `lt`
        
`Article.created_gt(new Date(2000)).created_lt(new Date(2010))`

### `lte`
        
`Product.price_gte(30).price_lte(40)`

## Ordering and Limits

Field filters are typically used to return a small number of specific results.
By default they return [_unordered_ results](/🗄/Article/models/ordering.md#query).
Unordered results are limited to 100 results by default, which may be explicitly raised to 500 results.

# Methods {#methods}

The following methods influence the query results.

### `asc()/desc()` {#order}

All model types have a [natural ordering](/🗄/Article/models/ordering.md).
It is recommended to minimize the use of `asc()` and `desc()`
and to typically rely on the [default ordering of various query types](/🗄/Article/models/ordering.md#query).

### `filter(function)` {#filter}

The callback function to `filter` returns a `boolean`
that indicates whether the item should be included in the results (return false to exclude an entry).
This should only be used if another field filter (eq, gt, gte, lt, lte) is not sufficient.

### `limit(number)` {#limit}

Limits the results of a query.

# Modifiers {#modifiers}

Modifiers transform the original results.

### `map(function)` {#map}

The callback function to `map` _transforms_ the current stream element
into a map or other value.  This is often used to transform a model to a JSON object literal.
        
```javascript
Article.all().map(article=>({title:article.title}));
```

### `flatMap(function)` {#flatMap}

The callback function to `flatMap` _transforms_ the current stream
element into another stream.

Return a single value, array, or other stream from the callback.
The results will be flattened into the resulting stream.
For example, given an `options[]` field, get only distinct options:

```javascript
Product.all().flatMap(product=>product.options).distinct();
```

### `insert(function)` {#insert}

Using the results from either `map` or `flatMap`, use `insert` to grow or inflate those results.
The insert method transforms the modified original results by *optionally* inserting new elements of the same format.
It may also take otherwise empty results and fill them.
To ensure predictable results, keep in mind the [default ordering of various query types](/🗄/Article/models/ordering.md#query).

> {.more}
>
> `insert` must only be used after `map`, and the results inserted must be the same type of value as were originally returned from `map`.
> at the beginning, between two elements (previous and next), or at the very end.
>
> This method is particularly useful for inserting points along sparsely populated time series data,
> in [conjunction with `Dates`](/🗄/Article/scripting/helpers.md#util) to help
> generate the missing points.
>
> The callback function uses a single parameter as an "iterator".
> The iterator exposes the optional/nullable fields `next` and `previous`, which will be null in specific cases.
> Those 3 cases are exposed as booleans fields `empty` (next/previous both null), `first` (previous is null), `last` (next is null).
>
> Returned values from the callback function are inserted into the results.
> Returnable values are null, a single value, arrays, or other streams.
>
> Keep in mind that returned results must be the same type of value as were originally returned from `map` (on the source).
> In other words, if the original `map` operation returned results like `{date: value.created}` then
> values being returned from the `insert` callback but also be in the format `{date: /* value */}`.

### `distinct()` {#distinct}

Using the results from `map`, `flatMap`, or `insert`,
creates new results which contain only unique values.
        
```javascript
let distinctTitleCount = Article.all()
    .map(article=>({title:article.title}))
    .distinct()
    .count();
```

# Execution {#exec}

Once a query is built up with various methods,
the query results are *executed and used* by including the query in JSON output, or Mustache HTML output.
The following methods also execute and use the results from a query:

### `count()` {#count}

Return the total number of results, after considering all other methods, such as `limit`.

### `get()` {#get}

Returns a single result (effectively `limit(1)`).
If there is no result, then a `$ModelNotFound`
exception is thrown, similar to loading a model by its ID.

### `optional()` {#optional}

Behaves similarly to `get()`, but returns `null` instead of throwing `$ModelNotFound`.

### `exists()` {#exists}

Returns `true` if there is at least 1 result for the query.

### `sum(field)` {#sum}

Must be called before a [modifier](#modifiers).
Returns the sum of a field (`integer` or `double`).

```javascript
Product.all().sum(Product.price);
```

The sum will be zero if there are no results (results are empty).

### `avg(field)` {#avg}

Must be called before a [modifier](#modifiers).

```javascript
Product.all().avg(Product.rating);
```

`avg` may return null if there are no results to average (results are empty).

### `modify(function)` {#modify}

The callback function to `modify` receives a Model instance as its parameter, and does not expect any return value.
This should only be used to update fields, or `remove()` models in bulk.
It is only available during `POST`, `PUT`, `DELETE`, and is limited to the quota on batch size for the request.

> {.more}
>
> It is not required that every Model be modified, for example if it doesn't satisfy some condition.
> However consider using `filter(...)` in the case where there are well defined conditions
> that must be met before updating a model.  This will also keep the modify function simpler.

# Embedded Models {#embedded}

Queries for embedded models are similar to equality queries.

The following assumes `Article` has a field named `metadata`.
The `metadata` field is an embedded model name `ArticleMetadata` with the field `title`.

```javascript
Article.metadata({title: 'The Title'}).get();
```

This will return an `Article` where `Article.metadata.title == 'The Title'`,
regardless of whether `ArticleMetadata` has other defined fields.

# Embedded Lists {#embedded-lists}

Queries for values in an embedded model list are similar to queries for embedded models.

However they carry the important limitation that all fields must match.

In general we do not recommend modeling with querying in mind for embedded lists.

# Unique Value Queries {#unique}

Query [unique fields](/🗄/Article/models/fields.md#unique) and
[UID fields](/🗄/Article/models/fields.md#uid)
as you would any other type of equality query.
Assuming a model named `Article` and a UID field named "slug":
        
```javascript
let slugId = '....';
let found = Article.slug(slugId).get();
// Because of error handling, 'found' is always defined at this point
```

# Mustache Use {#mustache}

The "all" query on a model type is available directly to [Mustache](/🗄/Article/endpoints/mustache.md).

```file-name
/index.html
```
```html
<!--TEMPLATE mustache-->
{{% import {List} from '📦' }}

{{#List.all as list}}
  {{list.title}}
{{/List.all}}
```

Simple contained model queries are also available directly to Mustache:

```file-name
/index.html
```
```html
<!--TEMPLATE mustache-->
{{% import {Note} from '📦' }}
{{% import {list} from '🔗' }}

{{#Note.list list as note}}
  {{note.title}}
{{/Note.list}}
```

Any other queries must be defined and built within a [supplier](/🗄/Article/scripting/suppliers.md) before importing them into Mustache.