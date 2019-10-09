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

To query all models of a type, without any filters, use the `all()` method. For example, `Note.all()`.

Results will be returned in the model's [natural ordering](/🗄/Article/models/ordering.md#query).

The "all" query on a model type is also available directly to [Mustache](/🗄/Article/endpoints/mustache.md).
Any other queries must be built within a [supplier](/🗄/Article/scripting/suppliers.md) before importing them into Mustache.

```file-name
/index.html
```
```html
<!--TEMPLATE mustache-->
{{% import {Note} from '📦' }}
{{#Note.all as note}}
  {{note.title}}
{{/Note.all}}
```

Keep in mind that for contained models, `all` will only include results for a
[given parent container in scope](#containers).

# Field Filters {#field}

All queries besides `all()` start with a field filter.
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
Unordered results are implicitly limited to 100 results, which may be explicitly raised to 500 results.

# Methods {#methods}

The following methods influence the query results.

### `asc()/desc()` {#order}

All model types have a [natural ordering](/🗄/Article/models/ordering.md).
It's recommended to minimize the use of `asc()` and `desc()`
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
exception is generated, similar to loading a model by its ID.

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

Queries for embedded models work in much the same as any equality query.
Use an instance of an embedded model to define the "example" criteria to search for.

The following assumes `Article` has a field named `metadata` with an embedded model as its value:

```javascript
Article.metadata(new Article.Metadata().title('The Title')).get();
```

This will return an `Article` where `Article.metadata.title == 'The Title'`

# Embedded Lists {#embedded-lists}

Lists of embedded models come with important limitations.
Chiefly they only match when the _entire_ embedded model in the list matches all given fields.
In other words, when embedded models are in a list, it's not possible to search for a
partial field match (unless querying a unique value field).

Therefore if needing to query against lists of embedded values, then it's recommended to
either keep the model limited to 1-2 fields, or keep the queries limited to a unique value.

Otherwise, use [contained models](/🗄/Article/models/containers.md), which provide more robust querying.

Assuming a simple single-valued embedded list model:

```javascript
Article.languages(new Article.Language().value('en'));
```

This will return all `Article`'s with "en" as one of its `Article.languages`.
Because `Article.languages` is an embedded list, it may have other languages besides "en".

# Contained Models {#containers}

For models which are [contained](/🗄/Article/models/containers.md) by a parent model,
querying is performed in much the same way as any other query.

The difference is that querying for a child model happens within the scope of a _selected_ container.
There are 4 ways to ensure a container is _selected_ and in-scope (before querying a child).

1. [Dynamic Paths](/🗄/Article/endpoints/dynamic.md) &mdash;
   If a container model is the target of a dynamic path,
   then it is automatically selected for all descendant endpoints and directories.
   This selection may be overridden by the other two methods.
2. Variable Selection &mdash; Every container variable is also a function.  Whatever happens in this function is
   done in the context of that container:  `let children = containerVar(()=>Child.all())`.
   Return values are optional.
3. Iteration &mdash; If a container is being iterated (for example in Mustache, as a part of `map()`, etc),
   then it is selected within the context of each iteration: `Container.all().map(c=>({children: Child.all()}))`.
4. Method Call &mdash; All children have an explicit method for querying the desired container `Child.container(containerVar)...`.

> {.more}
>
> ## Ancestor Scope
>
> In certain cases it may be necessary to query for children _across_ containers, up to 1 level deep.
> Take the following model containers and children:  `Project` / `List` / `Task`.
> The following queries are possible:
>
> 1. Single Container &mdash; Query for all `List`'s in a single `Project`, _or_ all `Task`'s in a single `List`.
> 2. Across Containers &mdash; Query for all `Task`'s in a single `Project` (across all `List`'s in 1 `Project`).
>
> The 3 selection rules still apply.
> When querying across containers the selected container in the example would be `Project` instead of `List`.

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