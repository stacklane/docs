---
title: Scripting Helpers
summay: Learn about available helper modules available in server-side JavaScript.
---

# URL Parameters {#url}

Access URL query parameters via the `'&'` module.
If your query parameter is separated by dashes, 
such as `this-that`, then import it with camel case instead: `thisThat`.

```javascript
/* import all at a prefix */

import * as Params from '&';

/* or, individual parameters */

import {specific, param, here as Other} from '&';
```

# Form Parameters {#form}

Access form parameters via the `'form'` module, or the  `'form{}'` module.
If your form parameter is separated by dashes, 
such as `this-that`, then import it with camel case instead: `thisThat`.

```javascript
/* individual parameters */

import {specific, param, here as Other} from 'form';

/* import as hash or object literal */

import {Form} from 'form{}';

let theValue = Form.theParamName;
let theOtherValue = Form['theOtherParam'];
let hasAValue = Form.has('checkboxValue');
```

# Cookies {#cookies}

## Reading

Reading cookies may be done from any request or supplier.

```javascript
import {Cookies} from '🍪';

// May be null:
let theValue = Cookies.theValue;

/* ... */
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

- `name(string)` &mdash; Must not begin with "_" or equal "sid".
- `value(string)` &mdash; Sets the value of the cookie.
- `days(number)` &mdash; Creates a persistent cookie that expires.
- `clear()` &mdash; Adds a blank value.

For security purposes cookies use the `Secure`, `HttpOnly`, `SameSite=lax` flags.

# Redirect

The `Redirect` object is already imported.
The following examples show the available methods and their result.

```javascript
Redirect.home(); // Result: /
Redirect.dir('accounts').dir(accountId); // Result: /accounts/1234/
Redirect.dir('accounts').dir(accountId).name('settings'); // Result: /accounts/1234/settings
Redirect.home().name('place').params({this:'that'});  // Result: /place?this=that
Redirect.index().name('other'); // If current request is /here/there, result: /here/other
Redirect.home().hash('123'); // Result /#123
```

Redirects may also be used as JSON values:

```javascript
({redirect: Redirect.home().success('Going Home')});
```

Resulting in:

```javascript
{"redirect": {"path":"/", "messages":[{"type":"success", "value": "Going Home"}]}
```

## Messages

As convenience to using the [Messages](/🗄/Article/scripting/messages.md) object directly,
messages may "go with" the redirect being built.
For example, after adding a new Article:

```javascript
import {Article} from '📦';

let article = new Article().title('New');

Redirect.dir('articles')
        .dir(article.id)
        .success('New Article successfully created');
```

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

Utility for displaying relative date/times server-side, rather than resorting to a client-side library.
Relative date/times are designed to give a general sense of time, not precision.

```javascript
import {Post} from '📦';
import {RelativeDateTime} from 'util';

Post.all().map(p=>({
    createdAgo: RelativeDateTime.fromNow(p.created),
    title: p.title
}));
```

Examples of `RelativeDateTime.fromNow` output:

`now`\
`3 seconds ago`\
`6 hours ago`\
`1 day ago`\
`2 weeks ago`\
`4 months ago`\
`1.4 years ago`

Only the year resolution will use a single decimal fraction.



