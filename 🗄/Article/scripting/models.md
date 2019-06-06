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

# Field Metadata

Every model field has static metadata utilities:

## required

`Product.description.required` &mdash; true if the description field has been set to required.

## html

Model fields have a number of conveniences for [working with HTML forms](/🗄/Article/models/forms.md).

# Containers

Since [containers](/🗄/Article/models/containers.md) create a "scope" for
working with other data, a container must be selected
before any other operations on its contained data.

To execute code in the context of selected container, pass a function
to the container's variable.  The return value of the function
will be passed back as the return value of selecting the container.

## Create Child

```javascript
import {List,Task} from '📦';

let list = new List();

let childNote = list(()=>{
  return new Task().title('My Task');
});
```

## Query Children

```javascript
// Load the container 'List'
let listId = '...';
let myList = List.get(listId);

// Select myList, and get all Note titles for myList:
let titleStream = myList(()=>{
   return Note.all().map((n)=>n.title));
});

// Assuming GET.js, this will result in JSON of Note titles:
titleStream;
```

Or, the most compact form of same above statements:

```javascript
let listId = '...';
List.get(listId)(()=>Note.all().map((n)=>n.title)));
```

Keep in mind that when working with containers from a
[dynamic endpoint path](/🗄/Article/endpoints/dynamic.md)
the container selection has already occurred.

# Transactions

All model operations (create, update, delete/remove), which happen
within a single request are committed together / atomically.
There is no way to end up in a state where the first few models have
been persisted, but later changes haven't.

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