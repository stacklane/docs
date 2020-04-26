---
title: URL Query Parameters
short: URL Parameters
summary: Access URL query parameters.
order: 200
---

Access URL query parameters using the `'&'` module.
If your query parameter is separated by dashes,
such as `this-that`, then import it with camel case instead: `thisThat`.

```javascript
/* import all at a prefix */

import * as Params from '&';

/* or, individual parameters */

import {specific, param, here as Other} from '&';
```