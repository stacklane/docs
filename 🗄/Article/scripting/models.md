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
let listId = '...';
let list = List.get(listId);

// Because of error handling,
// 'list' is always defined at this point
let listTitle = list.title;
```

## Update

```javascript
// field/property setter:
list.title = 'new title';

// fluent setter:
list.title('new title')
    .otherField('value');
```

## Delete

```javascript
let listId = '...';
List.get(listId).remove();
```

# Transactions

All model operations (create, update, delete/remove), which happen
within a single request are committed together / atomically.
There is no way to end up in a state where the first few models have
been persisted, but later changes haven't.

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

// Constructor
let childNote1 = new Note(list).title('Task1');

// Or, Block Scope
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

# Embedded Models {#embedded}

## Capped/Rolling Lists

Lists of embedded values may also be used to retain only `N` recent values,
where `N` is the maximum size defined for the embedded list.

This works in a way similar to circular buffers:
once a list fills its allocated space,
it makes room for new embedded entries by overwriting the oldest value in the list.

Use the `put` method on the list to achieve this behavior.
Assuming an embedded value list with a maximum number of entries set to `2`:

```javascript
let p = new Post();
p.recentComments.put(new Post.Comment().content('<p>a</p>'));
p.recentComments.put(new Post.Comment().content('<p>b</p>'));
p.recentComments.put(new Post.Comment().content('<p>c</p>'));
```
The `Post` will now only contain comments `b` and `c`.
Putting the last comment `c` dropped off the older comment `a`,
since that exceeded the maximum of `2` entries for this embedded list field.

# Error Handling {#errors}

In several examples above, note that `null` or `undefined`
is not used to represent the absence of a result -- for example `List.get` and
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