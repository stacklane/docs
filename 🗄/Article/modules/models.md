---
title: Model Scripting
summary: Learn about scripting with data models.
uid: scripting/models
short: Models
order: 10
---

# Create

```javascript
let newList = new List().title('x');
```

When creating contained child models, the parent container must be specified in the constructor:

```javascript
let note = new Note(newList).title('Note1');
```

# Read

### `get(id)`

Returns the model if it exists for the ID, otherwise throws a `$ModelNotFound` exception.

```javascript
// Throws $ModelNotFound
let list = List.get(listId);
```

### `optional(id)`

Returns the model if it exists for the ID, otherwise returns null.

```javascript
// May return null
let list = List.optional(listId);
```

### `exists(id)`

Returns true if the model exists for the ID, false otherwise.

```javascript
let listExists = List.exists(listId);
```

# Update

### Field Setter

```javascript
list.title = 'new title';
```

### Fluent Setter

```javascript
list.title('new title')
    .otherField('value');
```

# Delete

```javascript
list.remove();
```

## Query Method

When querying a child its parent may be explicitly passed using a method named after its container.
In this case the container model `List` uses the method name `list`.

```javascript
let noteTitles = Note.list(list).map(n=>n.title);
```

## Query Iteration

While a parent is being iterated it is selected for child queries.

```javascript
List.all().map(list=>(
  {noteTitles: Note.all().map(n=>n.title)}
));
```

# String Lists {#string-lists}

[String lists](/🗄/Article/fields/basic.md#string-lists) are never null and contain the following properties/methods:

### `contains(value)` / `includes(value)`

Returns true if the list contains the string value.

### `add(value)` / `push(value)`

Adds a new value to the end of the list.

### `remove(value)`

Returns true if the value was in the list and removed.

### `removeIf(value=>filter)`

Removes elements if matching the filter, and returns true if any where removed.

### `length`

Length of the list.

### `put(value)`

[Rolls off](/🗄/Article/modules/models.md#rolling-lists) old values according to maximum list size.

### Streaming Methods

- `map(function)`
- `filter(function)`
- `limit(number)`
- `get()`
- `exists()`
- `optional()`

# Model Lists {#model-lists}

[Embedded model lists](/🗄/Article/fields/models.md#model-lists) are never null and contain the following properties/methods:

### `add(value) / push(value)`

Adds a new value to the end of the list.

### `removeIf(value=>filter)`

Removes elements if matching the filter, and returns true if any where removed.

### `length`

Length of the list.

### `put(value)`

[Rolls off](/🗄/Article/modules/models.md#rolling-lists) old values according to maximum list size.

### Streaming Methods

- `forEach(function)`
- `map(function)`
- `filter(function)`
- `limit(number)`
- `get()`
- `exists()`
- `optional()`

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

The [Model Link field type](/🗄/Article/fields/models.md#model-links)
allows linking to other models. Fields of this type never return null or undefined.
Keep in mind that links may be "broken" if the target of the link was deleted.

Model links have the following methods/properties:

### `get()`

Obtain a live instance of the model linked to.  Throws `$ModelNotFound` if it no longer exists.

### `exists()`

Returns true if the linked model still exists.

### `optional()`

Returns the linked model if it exists, otherwise returns null.

### `linked()`

Link fields are never null or undefined.  Returns true if a link has been set.

### `id`

The unique ID of the linked model, or `null` if `linked() == false`.

# Error Handling {#errors}

In several examples above, note that `null` or `undefined`
is not used to represent the absence of a result -- for example `List.get` and
`Article.slug` never return a null/undefined value.

Instead, an exception is thrown if there is no result.  This exception can be left unhandled,
and therefore propagated up to an [error view](/🗄/Article/views/errors.md).
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