---
title: Form Parameters
summary: Access simple form values.
order: 201
---

> {.alert .is-info .is-small}
>
> For model-based form handling check out [Model Forms](/🗄/Article/controllers/forms.md).

There are several different ways to access low-level form values.
Note: If your form parameter is separated by dashes,
such as `this-that`, then import it with camel case instead: `thisThat`.

# Single Values

```javascript
/* Specific parameters */

import {specific, param, here as Other} from 'form';

/* As hash / object */

import {Form} from 'form{}';

let theValue = Form.theParamName;
let theOtherValue = Form['theOtherParam'];
```

# Multiple Values

When accessing multiple values, the variable will always be a defined array,
even if the form submission did not include any value (empty array).

```javascript
/* Specific parameters */

import {selections} from 'form[]';

selections.forEach(v=>{ /*...*/ });

/* As hash / object */

import {Form} from 'form{}';

Form.values('selections').forEach(v=>{ /*...*/ });
```

# Form Object

The `Form` object imported from `'form{}'` has the following methods:

### keys()

Returns an array of submitted form values, which may be iterated with `.forEach(key=>{..})`

### has(keyName)

Returns true if keyName was submitted for the form, even if the submitted value is empty.

### values(keyName)

Returns an array of values for a same-named field, regardless of whether the form submission contained the value.
The returned value will never be null, but may be an empty array.