---
title: Cookies
summary: Access URL query parameters.
order: 202
---

# Reading

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

# Writing

Writing cookies may be done from non-GET requests, but not from suppliers.
Submitted cookies will only be included in the response if the script evaluates without exception.

```javascript
import {Cookie} from '🍪';

Cookie.name('token').value('123').days(30).submit();

/* ... */
```

- `name(string)` -- Lower or camel case, and must not begin with "_" or equal "sid".
- `value(string)` -- Sets the value of the cookie.
- `days(number)` -- Creates a persistent cookie that expires.
- `invalidate()` -- Sets an empty value, and an expires in the past.

# Security

For security purposes cookies use the `Secure`, `HttpOnly`, `SameSite=lax` flags.