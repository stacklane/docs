---
title: Ordering
short: Ordering
summary: Learn how models of various types are ordered and returned from query results.
order: 30
---

# Default

Every model type has a natural / default ordering field and direction.

Universal, Content, and User Profile types order by their `created`
timestamp, ascending from oldest to newest.

However keep in mind that ordered versus unordered results are also influenced by the
[type of query](/🗄/Article/models/ordering.md#query).

# Custom 

The Universal type supports custom ordering for the following field types:

`string`, `integer`, `double`, `timestamp`, `date`

To specify custom natural ordering on one of these field
types use the `order` attribute set to `true`.

```yaml
highScore:
  type: integer
  order: true
```

## Contained Models

If a model is a child within a [container](/🗄/Article/models/containers.md),
then the field _names_ which allow custom ordering are limited to
`title`, `name`, `order`, `hierarchy`.

# Query Ordering {#query}

The default ordering of results is impacted by the type of [query](/🗄/Article/modules/queries.md) performed.

## "All" / all() {#all-query}

Results are _ordered_ using the default natural order of the model type.
`all()` may also be explicitly ordered with `asc()` or `desc()`.

## Field Criteria {#field-query}

Results for field specific query criteria are _unordered_ by default.

Ordering of field queries may be activated with `asc()` or `desc()`.
However we recommend minimizing their use in this case, and relying on the _unordered_ behavior.
The typical goal of field specific query criteria is to return a relatively small set of results,
at which point client side ordering is also a possibility.

# Hierarchy

The [hierarchy](/🗄/Article/fields/primitives.md#hierarchy) field type
provides custom, manual ordering of the Universal model type.
When specified on a Universal model, it automatically changes the
natural ordering to use this field.

Hierarchy values may be used to represent simple custom ordering,
and optionally more complex *nested* ordering scenarios.

In contrast to a plain numeric field, hierarchy values provide efficient reordering of a single model value,
*without* causing all other model values before and after to be reordered / updated.

## Values

Hierarchy fields are ultimately represented as value objects
with various methods for traversing and manipulating the hierarchy.

However they may also be assigned and represented as plain strings.
For example, `/1/`, `/2/`, and so on.

Typically when working with hierarchy values it's not necessary to think about the resulting string value.
Instead use the available value methods to traverse and manipulate exiting hierarchy values relative to one another.

## Initialization

When using `init: true` with a hierarchy field, new models will
automatically be assigned the *next* hierarchy value.

The first initialized value of a hierarchy is `/0/`.
When creating new models where the hierarchy field has `init: true`,
then they will automatically be ordered after the last one.

## Reordering

The [Tasks example](https://github.com/stacklane-blueprints/tasks.git)
shows basic reordering functionality using a hierarchy field.

For example, given 3 existing Tasks, moving 1 of those Tasks
between two others:

```javascript
/**
 * Set 'moveTask' hierarchy value to a position
 * between 'afterTask' and 'beforeTask'
 */
moveTask.hierarchy = afterTask.hierarchy.before(
  beforeTask.hierarchy
);
```

## Properties

The following fields and methods are available on hierarchy values.

### `value`

Returns the string representation of the hierarchy, for example `/1/`.

### `hasParent`

Returns `true` if the hierarchy is nested, for example `/1/2/`.
Whereas `/1/` and `/2/` alone are top-level and would return `false`.

### `parent()`

Returns the parent if one exists, or null otherwise.

### `previous()`

Returns a sibling hierarchy value immediately *before* this hierarchy value.
For example if the hierarchy value is `/4/` its previous sibling is `/3/`.

### `next()`

Returns a sibling hierarchy value immediately *after* this hierarchy value.
For example if the hierarchy value is `/3/` its next sibling is `/4/`.

### `before(otherValue)`

The before method is used for reordering *between* two other known values.

For example, if this hierarchy value is `/4/`, then passing a larger sibling value of `/15/` results in `/5/`.
Similarly if this hierarchy value is `/3/`, then passing a larger sibling value of `/4/` results in `/3.1/`.

Each value must be a sibling of the other -- in other words there is no value
between `/2/` and `/2/4/` because these values are not on the same level.
