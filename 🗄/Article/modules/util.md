---
title: Utilities
summary: Learn about helper modules for server-side JavaScript.
uid: scripting/helpers
order: 500
---

The utilities module is named `'util'` and exports the following objects and methods.
All utilities are safe and efficient to use during any HTTP method.

# ID

Generates a URL and HTML friendly globally unique ID.

```javascript
import {ID} from 'util';

let randomUnique = ID.generate();
```

# Encoding

```javascript
import {Encoding} from 'util';

Encoding.base64Url().encode('string');
Encoding.base64Url().encodeNum(1234);
Encoding.html().escape('<p>html</p>');
```

# Identicon

Identicons are a visual representation of any string value.
Stacklane provides a utility to generate SVG identicons.
These generated values may be stored in the
[SVG icon model field type](/🗄/Article/fields/basic.md#svg-icon).

```javascript
import {Identicon} from 'util';

let repeatableIcon = Identicon.of('any string value');

let randomIcon = Identicon.random();
```

# Dates

## `days(date, number)`

Returns a stream of `Date` objects, beginning from the first parameter and
spanning through the number of days in the second parameter.
The second parameter may be negative to return past dates (in descending order).

This is a streaming method generally followed by `map`.

## `months(date, number)`

Returns a stream of `Date` objects, beginning from the first parameter and
spanning through the number of months in the second parameter.
The second parameter may be negative to return past dates (in descending order).

This is a streaming method generally followed by `map`.

## `fromNow(date)`

Utility for displaying relative date/time messages server-side, rather than resorting to a client-side library.
Relative date/time messages are designed to give a general sense of time, not precision.
For example "now", ""3 seconds ago", "1.5 years ago", etc.

> {.more}
>
> ```javascript
> import {Post} from '📦';
> import {Dates} from 'util';
>
> Post.all().map(p=>({
>     createdAgo: Dates.fromNow(p.created),
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



