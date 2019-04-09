---
title: Ordering
summary: Learn how models of various types are ordered and returned from query results.
---

# Default

Every model type has a natural / default ordering field and direction.

Universal, Content, and User Profile types order by their `created`
timestamp, ascending from oldest to newest.

The natural ordering of query results may be reversed
using `asc()` and `desc()`
[query methods](/🗄/Article/scripting/queries.md).

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
<a href="https://github.com/stacklane-examples/tasks.git">example</a>
shows basic reordering functionality using a hierarchy field.