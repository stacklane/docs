---
title: Dynamic Paths
summary: Learn how to create dynamic path parameters.
order: 20
uid: endpoints/dynamic
---

In many cases with data-driven content, URLs are dynamic &dash;
they are backed by a model field, such as its ID, or other
unique field.  To indicate that part of an endpoint path
is dynamic, use a named placeholder surrounded by brackets:

`/article/{article}/index.html`

Next tell Stacklane the types of values allowed for this dynamic path parameter.
Drop a settings file into `/article/{article}/🔗.yaml`.
This settings file indicates how the dynamic parameter `{article}`
is translated into an actual value.

For the value in this settings file, choose **one** of the following options.

# Model-Backed

> {.alert .is-warning .is-small}
>
> Imported path parameter models are slightly stale.
> Use the stale values if acceptable, or access the live model via `get()`.

A single model field may be referenced.
The field may be the model's unique ID, or a [UID field](/🗄/Article/fields/basic.md#uid).
When using a UID field type, old UID's are automatically redirected to the primary / current UID for proper SEO.
If the model can't be found, it will result in a standard [not found error](/🗄/Article/views/errors.md).

```file-name
/task/{task}/🔗.yaml
```
```yaml
field: 📦.Task.id
```

From a scripting and template standpoint, these are exported as "links" to the model.
These links are not a live model, but a pointer or reference to the model.
Basic properties from the live object are cached on the link for up to 1 minute.
If you only need to read properties, and a certain amount of staleness is acceptable,
then use these properties instead of loading the live model.
    
```javascript
import {task} from '🔗';

// Access the task's slightly stale 'title'
let title = task.title;

// Or get a live version of the task by calling get() on the link
title = task.get().title;
```

## Using With Containers

Often dynamic paths are used with [containers](/🗄/Article/models/containers.md).
In this case it's not necessary to load a live version to "use" the container.

```file-name
/list/{list}/🔗.yaml
```
```yaml
field: 📦.List.id
```

```file-name
/list/{list}/GET.js
```
```javascript
import {list} from '🔗';
import {Task} from '📦';

// Return all of the tasks for the list container
list(()=>Task.all());
```

However when containers are used in dynamic paths, they are automatically selected and in scope.
In other words the above example is redundant and for illustration only.
A simpler form is:

```javascript
import {Task} from '📦';

// Return all of the tasks for the list container
Task.all();
```

## Single Endpoint

In the above examples, the dynamic model-backed directory
applies to all endpoints, and all descendant directories/endpoints.

In certain scenarios it can be useful to have a single dynamic endpoint,
instead of an entire dynamic directory.
The setup is similar, however the bracketed placeholders are file based instead of directory based.

Given a dynamic Mustache endpoint named:

```file-name
{article}.html
```

```html
...
```

a corresponding settings file which describes the dynamic field would be:

```file-name
{article}🔗.yaml
```

```yaml
field: 📦.Article.uid
```

The end result is that this single endpoint responds only to valid Article uid's.

# Fixed Choice

Indicates that a set of strings are valid for this path parameter.
These must be valid URL identifiers (see more information on
[formatting URL identifiers](/🗄/Article/fields/basic.md#uid)).

```yaml
values:
  - option-one
  - another-option
  - etc
```

Fixed value paths are exposed to scripting and templates
in two different ways.
        
```javascript
import {thePathVar} from '🔗';

// Directly access the value
if (thePathVar.$value == 'option-one'){
    ...
}

// Boolean switch
if (thePathVar['option-one']){
    ...
}
```

Mustache example:

```html
<!--TEMPLATE mustache-->
{{ % import {thePathVar} from '🔗' }}

{{#thePathVar.option-one}}
    ....
{{/thePathVar.option-one}}
```

## Model Field Options

Alternatively the values may correspond to an
[options field type](/🗄/Article/fields/basic.md#options):

```yaml
values: 📦.Task.status
```
