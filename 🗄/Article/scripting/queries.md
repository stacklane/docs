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

# all()

To query all models of a type, without any filters, use the `all()` method. For example, `Note.all()`.

Results will be returned in the model's [natural ordering](/🗄/Article/models/ordering.md#query).

The "all" query on a model type is also available to [Mustache](/🗄/Article/endpoints/mustache.md).
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

# Field Filters

All queries besides `all()` start with a field filter.
Multiple field filters may be chained together.
Keep in mind that field filters are effectively **and** conditions.
By default field filters return [_unordered_ results](/🗄/Article/models/ordering.md#query).

## eq
        
`Article.title('theTitle')`

## gt

`Article.created_gt(new Date(2000))`

## gte

`Product.price_gte(30)`

## lt
        
`Article.created_gt(new Date(2000)).created_lt(new Date(2010))`

## lte
        
`Product.price_gte(30).price_lte(40)`

# asc()/desc()

All model types have a [natural ordering](/🗄/Article/models/ordering.md).
In general it's recommended to minimize the use of `asc()` and `desc()`
and to typically rely on the [default ordering of various query types](/🗄/Article/models/ordering.md#query).

# filter(function) 

The callback function to `filter` returns a `boolean`
that indicates whether the item should be included in the results (return false to exclude an entry).
This should only be used if another field filter (eq, gt, gte, lt, lte) is not sufficient.

# limit(number)

Limits the results of a query.

# map(function)

The callback function to `map` _transforms_ the current stream element
into a map.  This is often used to transform a model to a JSON object literal.
It should be the last method in a chain (or followed only by `get` / `distinct` / `count`).
        
```javascript
let titlesOnly = Article.all().map(article=>({title:article.title}));
```

# flatMap(function)

The callback function to `flatMap` _transforms_ the current stream element
into an array. It should be the last method in a chain (or followed only by `get` / `distinct` / `count`).
        
# distinct()

Using the results from either `map` or `flatMap`,
creates new results that contain only unique values.
        
```javascript
let distinctTitleCount = Article.all()
    .map(article=>({title:article.title}))
    .distinct()
    .count();
```

# get()

Returns a single result (effectively `limit(1)`).
If there is no result, then a `$ModelNotFound`
exception is generated, similar to loading a model by GUID.
        
# modify(function)

The callback function to `modify`
receives a Model instance as its parameter,
and does not expect any return value.
This should only be used to update fields, or `remove()` models in bulk.
It is only available during `POST`, `PUT`, `DELETE`.
        
It is not required that every Model be modified, for example if it doesn't satisfy some condition.
However consider using `filter(...)` in the case where there are well defined conditions
that must be met before updating a model.  This will also keep your modify function simpler.
        
This method works with full Model instances, and should therefore not be used in conjunction with
`map(..)`.
        
## Semi-Asynchronous
        
For bulk operations the first 10 updates will occur synchronously, before the method returns
(before the request ends).  From a user standpoint this means that up to 10 results will be modified
 before they view the results or next page.
Any results beyond the first 10 are processed asynchronously in batches, meaning there could be a
short delay for a user to see the result of changes to larger batches.
This "semi-asynchronous" approach strikes a balance between user expectations on more common (small) operations,
while making sure the request time is at a minimum for larger operations.

# Embedded Models {#embedded}

Queries for embedded models work in much the same as any equality query.
Use an instance of an embedded model to define the "example" criteria to search for.

The following assumes `Article` has a field named `metadata` with an embedded model as its value:

```javascript
Article.metadata(new Article.Metadata().title('The Title')).get();
```

This will return an `Article` where `Article.metadata.title == 'The Title'`;

## Embedded Lists

Lists of embedded models come with important limitations.
Chiefly they only match when the _entire_ embedded model in the list matches all given fields.
In other words, when embedded models are in a list, it's not possible search for a
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