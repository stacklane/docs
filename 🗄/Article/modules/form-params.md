---
title: Form Parameters
summary: Access simple form values.
order: 201
---

# Overview

There are several different ways to access low-level form values.
For more expressive model-based form handling check out [Controllers → Forms](/🗄/Article/controllers/forms.md).

# Single Values

```javascript
/* Specific parameters */

import {specific, param, here as Other} from 'form';

/* As object */

import {Form} from 'form{}';

let theValue = Form.theParamName;
let theOtherValue = Form['theOtherParam'];
```

If the form parameter name is separated by dashes on the client-side,
such as `this-that`, then import it with camel case instead: `thisThat`.

# Multiple Values

When accessing multiple values, the variable will always be a defined array,
even if the form submission did not include any value (empty array).

```javascript
/* Specific parameters */

import {selections} from 'form[]';

selections.forEach(v=>{ /*...*/ });

/* As object */

import {Form} from 'form{}';

Form.values('selections').forEach(v=>{ /*...*/ });
```

# Form Object

The `Form` object imported from `'form{}'` has the following methods:

### `keys()`

Returns an array of submitted form values, which may be iterated with `.forEach(key=>{..})`

### `has(keyName)`

Returns true if keyName was submitted for the form, even if the submitted value is empty.

### `values(keyName)`

Returns an array of values for a same-named field, regardless of whether the form submission contained the value.
The returned value will never be null, but may be an empty array.