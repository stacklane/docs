---
title: Paths
summary: Access request URL and path information.
order: 199
---

Use the `'🔗'` module to access information about the current request and path.

# Dynamic Paths

For more information about dynamic paths, see [Dynamic Paths →](/🗄/Article/views/dynamic.md).

# Request {#request}

The `Request` object provides information about the current request.

## Properties

### `url`

Returns a `URL` representing the current request, with any query parameters or fragments removed.
For example: `https://example.com/the/path`

### `base`

Returns a `URL` representing the current scheme, host, and context (if any), without any trailing slash.
For example: `https://example.com/context`.
For non-nested root sites, this will be the domain only, without any trailing slash:
`https://example.com`

### `domain`

Returns a `string` of the current domain.  For example `'example.com'`.

## JavaScript Use

```javascript
import {Request} from '🔗';

const domain = Request.domain;
```

## Mustache Use

```html
<!--TEMPLATE mustache-->
{{% import {Request} from '🔗'}}

domain={{Request.domain}}
```
