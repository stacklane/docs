---
title: Click Actions
short: Click Actions
summary: Server-side handling of user interactions during a GET.
order: 40
---

# Overview

HTTP GET's are usually reserved for showing [views](/🗄/Article/views/overview.md) or handling redirects.
In those cases the request is designed to be free of any side effects,
and only for retrieving/displaying information.

However there are certain cases, especially when linking from an external site or email,
where it may be useful to have side effects, including updating models and writing cookies.

# Configuration

To configure a click action use the mouse prefix "🖱" to
designate the special GET endpoint which responds to such requests:

```file-name
/🖱verify.js
```
```javascript
import {Verify} from '📦';
import {Cookie} from '🍪';
import {t} from '&';

try {
  Verify.token(t).get().verified = true;
  new Cookie().name('verified').value(t).days(30);
  Redirect.dir('verified');
} catch ($ModelNotFound){
  Redirect.dir('unverified');
}
```

This example action would respond to GET requests at:

`https://example.com/verify?t=[token]`

When accessed, it will lookup a model named `Verify` by its `token` field, using a URL parameter named `t`.
If found, it will set the `verified` field to `true`, and also create a cookie.
Finally it will redirect the visit.

# Limitations

Click actions are a narrow case, and there are few limitations to be aware of:

- [Redirect](/🗄/Article/controllers/js.md#redirect) is the only valid response.
- [Suppliers](/🗄/Article/controllers/suppliers.md) are not supported.
- Models may be updated, but not created or deleted.

