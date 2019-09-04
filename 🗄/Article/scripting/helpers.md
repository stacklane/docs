---
title: Scripting Helpers
summary: Learn about helper modules for server-side JavaScript.
---

# URL Params {#url}

Access URL query parameters via the `'&'` module.
If your query parameter is separated by dashes, 
such as `this-that`, then import it with camel case instead: `thisThat`.

```javascript
/* import all at a prefix */

import * as Params from '&';

/* or, individual parameters */

import {specific, param, here as Other} from '&';
```

# Form Params {#form}

> {.alert .is-info .is-small}
>
> For model-based form handling check out [Model Forms](/🗄/Article/endpoints/forms.md).

There are several different ways to access low-level form values.
Note: If your form parameter is separated by dashes,
such as `this-that`, then import it with camel case instead: `thisThat`.

## Single Values

```javascript
/* Specific parameters */

import {specific, param, here as Other} from 'form';

/* As hash / object */

import {Form} from 'form{}';

let theValue = Form.theParamName;
let theOtherValue = Form['theOtherParam'];
```

## Multiple Values

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

## Form Object

The `Form` object imported from `'form{}'` has the following methods:

### keys()

Returns an array of submitted form values, which may be iterated with `.forEach(key=>{..})`

### has(keyName)

Returns true if keyName was submitted for the form, even if the submitted value is empty.

### values(keyName)

Returns an array of values for a same-named field, regardless of whether the form submission contained the value.
The returned value will never be null, but may be an empty array.

# Cookies {#cookies}

## Reading

Reading cookies may be done from any request or supplier.
Keep in mind that cookie values may be null (may not exist).

```javascript
import {token} from '🍪';

if (token){
  Redirect.dir('has-token').params({t:token});
} else {
  Redirect.dir('no-token');
}
```

## Writing

Writing cookies may be done from non-GET requests, but not from suppliers.
There is no functional difference between an implicit or explicit submit.
Submitted cookies will only be included in the response if the script evaluates without exception.

```javascript
import {Cookie} from '🍪';

// Implicit submit
new Cookie().name('token').value('123').days(30);

// Explicit submit
Cookie.name('token').value('123').days(30).submit();

/* ... */
```

- `name(string)` &mdash; Lower or camel case, and must not begin with "_" or equal "sid".
- `value(string)` &mdash; Sets the value of the cookie.
- `days(number)` &mdash; Creates a persistent cookie that expires.
- `invalidate()` &mdash; Sets an empty value, and an expires in the past.

For security purposes cookies use the `Secure`, `HttpOnly`, `SameSite=lax` flags.

# Utilities

The utilities module is named `'util'` and exports the following objects and methods.
All utilities are safe and efficient to use during any HTTP method.

## ID

Generates a URL and HTML friendly globally unique ID.

```javascript
import {ID} from 'util';

let randomUnique = ID.generate();
```

## Encoding

```javascript
import {Encoding} from 'util';

Encoding.base64Url().encode('string');
Encoding.base64Url().encodeNum(1234);
Encoding.html().escape('<p>html</p>');
```

## Identicon

Identicons are a visual representation of any string value.
Stacklane provides a utility to generate SVG identicons.
These generated values may be stored in the
[SVG icon model field type](/🗄/Article/models/fields.md#svg-icon).

```javascript
import {Identicon} from 'util';

let repeatableIcon = Identicon.of('any string value');

let randomIcon = Identicon.random();
```

## RelativeDateTime

### `days(date, number)`

Returns a stream of `Date` objects, beginning from the first parameter and
spanning through the number of days in the second parameter.
The second parameter may be negative to return past dates (in descending order).

This is a streaming method generally followed by `map`.

### `months(date, number)`

Returns a stream of `Date` objects, beginning from the first parameter and
spanning through the number of months in the second parameter.
The second parameter may be negative to return past dates (in descending order).

This is a streaming method generally followed by `map`.

### `fromNow(date)`

Utility for displaying relative date/time messages server-side, rather than resorting to a client-side library.
Relative date/time messages are designed to give a general sense of time, not precision.
For example "now", ""3 seconds ago", "1.5 years ago", etc.

> {.more}
>
> ```javascript
> import {Post} from '📦';
> import {RelativeDateTime} from 'util';
>
> Post.all().map(p=>({
>     createdAgo: RelativeDateTime.fromNow(p.created),
>     title: p.title
> }));
> ```
>
> Example output:
>
> `now`\
> `3 seconds ago`\
> `6 hours ago`\
> `1 day ago`\
> `2 weeks ago`\
> `4 months ago`\
> `1.4 years ago`
>
> Only the year resolution will use a single decimal fraction.



