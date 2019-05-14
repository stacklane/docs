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
// Because of error handling, 'list' is always defined at this point
let listTitle = list.title;
```

## Update

```javascript
let listId = '...';
List.get(listId).title = 'new title'; // field/property setter
new List().title('new title').otherField('value'); // fluent setter
```

## Delete

```javascript
let listId = '...';
List.get(listId).remove();
```

# Field Metadata

Every model field has static metadata properties.

## required

`Product.description.required` &mdash; true if the description field has been set to required.

`{{{ Product.description.html.required }}}` &mdash; Renders the HTML attribute `required` if true, otherwise renders nothing.
        
# Containers

Since [containers](/🗄/Article/models/containers.md) create a "scope" for
working with other data, a container must be selected
before any other operations on its contained data.

To execute code in the context of selected container, pass a function
to the container's variable.  The return value of the function
will be passed back as the return value of selecting the container.
Example:

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

# Common Error Handling {#errors}

In several examples above, note that `null` or `undefined`
is not used to represent the absence of a result -- for example `List.get` and
`Article.slug` never return a null/undefined value.

Instead, an exception is thrown if there is no result.  This exception can be left "uncaught"
and therefore propagated up to an [error endpoint](/🗄/Article/endpoints/errors.md).
Or it can be specifically caught using a special nomenclature:

```javascript
let thingId = '....';
let thing = null;
try {
    thing = Thing.get(thingId);
} catch ($NotFound){
    // At this point we've specifically caught $NotFound,
    // as opposed to catching an unrelated error/exception.
    thing = new Thing();
}
// At this point 'thing' is always defined.
thing.updateField = 'x';
```