---
title: Ordering
summary: Learn how models of various types are ordered and returned from query results.
---

# Default

Every model type has a natural / default ordering field and direction.

Universal, Content, and User Profile types order by their `created`
timestamp, ascending from oldest to newest.

However keep in mind that ordered versus unordered results are also influenced by the
[type of query](/🗄/Article/models/ordering.md#query).

# Custom 

The Universal type supports custom ordering for the following field types:

`string`, `integer`, `double`, `timestamp`

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

The default ordering of results is impacted by the type of [query](/🗄/Article/scripting/queries.md) performed.

The `all()` query returns results in the default natural order automatically. `all()` may also be explicitly `asc()` or `desc()`.

If specifying query filters, then by default the results are _unordered_.

If **both** query filters _and_ ordering are required, then explicitly specify `asc()` or `desc()`.

In general we recommend minimizing use of `asc()` and `desc()`,
using them only for specific cases, and therefore relying on
the default ordered/unordered behavior whenever possible.

# Hierarchy

The [hierarchy](/🗄/Article/models/fields.md#hierarchy) field type
provides custom, manual ordering of the Universal type.
When specified on a Universal model, it automatically changes the
natural ordering to use this field.

Hierarchy values may be thought of as a numerical value,
however for simplicity it's best to use them in relationship
to other hierarchy values, and other models that already exist.

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

The "tasks"
<a href="https://github.com/stacklane-blueprints/tasks.git">example</a>
shows basic reordering functionality using a hierarchy field.