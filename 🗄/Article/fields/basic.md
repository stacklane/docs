---
title: Primitive Fields
short: Primitives
summary: Learn about available primitive field types for your models.
order: 10
---

# string {#string}

Maximum length: 100 UTF-8 *characters*.
May be marked as "[unique: true](/🗄/Article/fields/overview.md#unique)".
Supports min/max characters via `max: N` and `min: N` on the
[field definition](/🗄/Article/models/definition.md).

# boolean {#boolean}

true/false boolean value.
Also accepts string input of "true"/"1", "false"/"0".
Other strings result in a validation error.

# integer {#integer}

Non-floating 64 bit integer (also considered *long*).
Accepts string input which does not contain a decimal point.
Other strings result in a validation error.
Supports min/max via `max: N` and `min: N` on the
[field definition](/🗄/Article/models/definition.md) (default minimum is **0**).

# double {#double}

Floating-point number (64-bit double precision, IEEE 754).
Accepts string input representing a decimal or non-decimal.
Other strings result in a validation error.
The default rounding scale is **2**, and rounding mode is "half to even".
Supports min/max via `max: N` and `min: N` on the
[field definition](/🗄/Article/models/definition.md) (default minimum is **0**).

# timestamp {#timestamp}

Date/time stored as UTC.
Keep in mind that every model comes with
automatically managed `created` and `modified` timestamp fields.
Initialize a timestamp field to the current date/time using `init: true`.
Accepts string input in ISO 8601 format, including partial formats such as "2000-01-01".
Other strings result in a validation error.

# date {#date}

Date only, with no time component.
Initialize a date field to the current date (based on UTC) using `init: true`.
Accepts string input in ISO 8601 format, including partial formats such as "2000-01-01".
Other strings result in a validation error.

# options {#options}

`options` are a special purpose string field, limited to pre-configured values.
The options / values must be entirely lower case, using single byte letters.

## Example {#options-example}

```yaml
status:
  type: options
  optional: true
  init: false
  values:
    - pending
    - disabled
    - active
```

## Initialization {#options-init}

To use the first listed value as a pre-initialized value for newly created models,
simply change `init` to `true`. Otherwise it will default to null.

## Type-Safe Access {#options-type-safe}

Available values may be assigned strings,
however whenever possible use the type-safe equivalent.
For example, given a `Product` model:

```javascript
new Product().status(Product.status.pending)
```

# country

Use the `country` field to store
[ISO 3166-1 alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) country codes.

# map

The `map` field type is a special case field that should be used sparingly.
Maps support free-form string, number, and boolean values.
_Maps are not indexed, and not queryable_.
They are only suitable for free-form fields that may vary widely for the same model type.
Maps are never null, and are always ready to be read/modified.
Use an optional map field if no values are required.

# geo

Use the `geo` field type to store latitude and longitude in a single field.
Valid geo points have latitudes >= -90 and <= 90, and longitudes >= -180 and <= 180.

Values may be assigned as strings such as "45.33670190996811,-75.8056640625".

Or, values may be assigned with an object:

```javascript
import {Post} from '📦';
import {lat,long} from 'form';

let geoPoint = new Post.location(lat, long);
new Post().location(geoPoint);
```

Getting/reading a geo value always results in an object with the properties:
`latitude` (double), `longitude` (double), `value` (string).
    
# hierarchy

`hierarchy` is a specialized field type which enables
custom ordering of the _Universal_ model type.

```yaml
order: hierarchy
```

This field may only be named "hierarchy" or "order",
and a model may only contain one field of this type.

For more information on using this field type see
[Models / Ordering](/🗄/Article/models/ordering.md#hierarchy).

# svg-icon {#svg-icon}

`svg-icon` is a purpose specific field for holding a web-safe, square SVG icon.
Typically these values are generated from the `Identicon`
[utility](/🗄/Article/scripting/helpers.md#util).
This field is highly constrained to valid and safe SVG.
No scripting or inline styles are allowed.
Maximum size: 2000 bytes.

## Example Definition

```yaml
projectIcon: svg-icon
```

To display an SVG field in Mustache, use triple brackets `{{{ model.textField }}}`

# String Lists {#string-lists}

Multi-valued lists may be defined for either simple values or complex embedded models.
To denote a list, add brackets "[]" after the field name.
If requirements don't call for the maximum of 20 entries,
then provision less entries by specifying a number (less than 20) between the brackets.
Capped/rolling/LRU lists are also [supported](/🗄/Article/scripting/models.md#rolling-lists).

`string` and `options` may be used for lists of values.
Only distinct values will be allowed in the list.
Define the field type as normal, but include brackets to denote a list.

```yaml
categories[]:
  type: options
  values:
    - one
    - two
```

For more information, see [String List Scripting](/🗄/Article/scripting/models.md#string-lists).

# UIDs {#uid}

`uid` is used for "user friendly" unique identifiers destined for URL paths (aka URL slugs).

This field is *always unique*, and is available for the [Universal](/🗄/Article/models/types.md#universal)
and [Content](/🗄/Article/models/types.md#content) type's.

To keep URLs formatted according to best practices, it must start and end with
a lower case character a-z, or 0-9.  Between the start and end, dash characters are also allowed.
Minimum length is 2 characters.  Maximum length is 100 characters.

UID's behave differently than other unique values.  Because they are destined
for URLs, when changing a unique value the previous unique value is retained
(otherwise any previously published URL would result in a broken link).
Therefore a single model field may have multiple unique UID values associated with it,
however at any given time only one is "current" or "primary".

In an ideal scenario from an SEO standpoint, if the visitor has reached a URL by an older UID,
then it's recommended you redirect to the current/primary UID value.
When using [dynamic endpoints](/🗄/Article/views/dynamic.md) backed by a UID field,
this redirection is handled automatically.

