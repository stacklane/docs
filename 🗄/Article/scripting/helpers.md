---
title: Scripting Helpers
summay: Learn about available helper modules available in server-side JavaScript.
---

# URL Parameters {#url}

Access URL query parameters via the `'&'` module.
If your query parameter contains a dash (or any other incompatible identifier character),
such as `this-that`, then import it with an underscore instead: `this_that`.

```javascript
/* import all at a prefix */

import * as Params from '&';

/* or, individual parameters */

import {specific, param, here as Other} from '&';
```

# Form Parameters {#form}

Access form parameters via the `'form'` module,
or the  `'form{}'` module.
If your form parameter contains a dash (or any other incompatible identifier character),
such as `this-that`, then import it with an underscore instead: `this_that`.

```javascript
/* individual parameters */

import {specific, param, here as Other} from 'form';

/* import as hash or object literal */

import {Form} from 'form{}';

let theValue = Form.theParamName;
let theOtherValue = Form['theOtherParam'];
let hasAValue = Form.has('checkboxValue');
```

# Redirect

The `Redirect` object is already imported.
The following examples show the available methods and their result.

```javascript
Redirect.home(); // Result: /
Redirect.dir('accounts').dir(accountId); // Result: /accounts/1234/
Redirect.dir('accounts').dir(accountId).name('settings'); // Result: /accounts/1234/settings
Redirect.home().name('place').params({this:'that');  // Result: /place?this=that
Redirect.index().name('other'); // If current request is /here/there, result: /here/other
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

## Encoding

```javascript
import {Encoding} from 'util';

Encoding.base64Url().encode('string');
Encoding.base64Url().encodeNum(1234);
Encoding.html().escape('&lt;p&gt;html&lt;/p&gt;');
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
