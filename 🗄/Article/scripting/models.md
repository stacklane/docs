---
title: Model Scripting
summary: Learn about scripting with data models.
---

# CRUD

## Create

```javascript
let newList = new List().title('x');
```

## Read

```javascript
// Throws $ModelNotFound
let list = List.get(listId);
```

## Update

```javascript
// Field/property setter:
list.title = 'new title';

// Fluent setter:
list.title('new title')
    .otherField('value');
```

## Delete

```javascript
list.remove();
```

# Containers

Since [containers](/🗄/Article/models/containers.md) create a "scope" for
working with other data, a container must be selected
before any other operations on its contained data.

To execute code in the context of selected container, pass a function
to the container's variable.  The return value of the function
will be passed back as the return value of selecting the container.

## Create Child

```javascript
import {List,Note} from '📦';

let list = new List();

// Parent via constructor:
let childNote1 = new Note(list).title('Task1');

// Or, parent via callback scope:
let childNote2 = list(()=>{
  return new Note().title('Task2');
});

//...
```

## Query Children

```file-name
/list/{list}/tasks/GET.js
```
```javascript
import {list} from '🔗';

// JSON of Note titles for the list:
Note.list(list).map((n)=>n.title));
```

For more information see [querying containers](/🗄/Article/scripting/queries.md#containers).

# String Lists {#string-lists}

[String lists](/🗄/Article/models/fields.md#lists) are never null and contain the following properties/methods:

### `contains(value)` / `includes(value)`

Returns true if the list contains the string value.

### `add(value)` / `push(value)`

Adds a new value to the list.

### `remove(value)`

Returns true if the value was in the list and removed.

### `removeIf(value=>filter)`

Removes elements if matching the filter, and returns true if any where removed.

### `length`

Length of the list.

### `put(value)`

[Rolls off](/🗄/Article/scripting/models.md#rolling-lists) old values according to maximum list size.

### Streaming Methods

- `map(function)`
- `filter(function)`
- `limit(number)`
- `get()`

# Model Lists {#model-lists}

[Embedded model lists](/🗄/Article/models/fields.md#lists) are never null and contain the following properties/methods:

### `add(value) / push(value)`

Adds a new value to the list.

### `removeIf(value=>filter)`

Removes elements if matching the filter, and returns true if any where removed.

### `length`

Length of the list.

### `put(value)`

[Rolls off](/🗄/Article/scripting/models.md#rolling-lists) old values according to maximum list size.

### Streaming Methods

- `map(function)`
- `filter(function)`
- `limit(number)`
- `get()`

# Capped/Rolling Lists {#rolling-lists}

Lists of values may also be used to retain only `N` recent values,
where `N` is the maximum size defined for the embedded list.

This works in a way similar to circular buffers or an LRU cache:
once a list fills its allocated space,
it makes room for new embedded entries by overwriting the oldest value in the list.

Use the `put` method on the list to achieve this behavior.
Assuming an embedded value list with a maximum number of entries set to `2`:

```javascript
let p = new Post();
p.recentComments.put(new Post.Comment().content('a'));
p.recentComments.put(new Post.Comment().content('b'));
p.recentComments.put(new Post.Comment().content('c'));
```

The `Post` will now only contain comments `b` and `c`.
Putting the last comment `c` dropped off the older comment `a`,
since that exceeded the maximum of `2` entries for this embedded list field.

# Model Links {#model-links}

The [Model Link field type](/🗄/Article/models/fields.md#model-links)
allows linking to other models. Fields of this type never return null or undefined.
Keep in mind that links may be "broken" if the target of the link was deleted.

Model links have the following methods/properties:

### `get()`

Obtain a live instance of the model linked to.  Throws `$ModelNotFound` if it no longer exists.

### `exists()`

Returns true if the linked model still exists.

### `linked()`

Link fields are never null or undefined.  Returns true if the a link has been set.

### `id`

The unique ID of the model, or `null` if `linked() == false`.

# Error Handling {#errors}

In several examples above, note that `null` or `undefined`
is not used to represent the absence of a result &mdash; for example `List.get` and
`Article.slug` never return a null/undefined value.

Instead, an exception is thrown if there is no result.  This exception can be left unhandled,
and therefore propagated up to an [error endpoint](/🗄/Article/endpoints/errors.md).
Or it can be specifically caught using a special nomenclature:

```javascript
let thingId = '....';
let thing = null;
try {
    thing = Thing.get(thingId);
} catch ($ModelNotFound){
    // At this point we've specifically caught $ModelNotFound,
    // as opposed to catching an unrelated error/exception.
    thing = new Thing();
}
// At this point 'thing' is always defined.
thing.updateField = 'x';
```