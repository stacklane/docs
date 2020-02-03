---
title: Field Types
summary: Learn about available field types for your models.
---

# Default

Every non-embedded model type is pre-defined with a unique `id`, plus `created` and `modified` timestamp fields.
These are automatically managed.  All are available immediately after model creation, even prior to persisting.

# Primitives

## `string`

Maximum length: 100 UTF-8 *characters*.
May be marked as "[unique: true](/🗄/Article/models/fields.md#unique)".
Supports min/max characters via `max: N` and `min: N` on the
[field definition](/🗄/Article/models/types.md#definitions).

## `boolean`

true/false boolean value.
Also accepts string input of "true"/"1", "false"/"0".
Other strings result in a validation error.

## `integer`

Non-floating 64 bit integer (long).
Accepts string input which does not contain a decimal point.
Other strings result in a validation error.
Supports min/max via `max: N` and `min: N` on the
[field definition](/🗄/Article/models/types.md#definitions) (default minimum is **0**).

## `double`

Floating-point number (64-bit double precision, IEEE 754).
Accepts string input representing a decimal or non-decimal.
Other strings result in a validation error.
The default rounding scale is **2**, and rounding mode is "half to even".
Supports min/max via `max: N` and `min: N` on the
[field definition](/🗄/Article/models/types.md#definitions) (default minimum is **0**).

## `timestamp`

Date/time stored as UTC.
Keep in mind that every model comes with
automatically managed `created` and `modified` timestamp fields.
Initialize a timestamp field to the current date/time using `init: true`.
Accepts string input in ISO 8601 format, including partial formats such as "2000-01-01".
Other strings result in a validation error.

# Options {#options}

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

# Country Code

Use the `country` field to store
<a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3" target="_blank">ISO 3166-1 alpha-3</a> country codes.

# Map

The `map` field type is a special case field that should be used sparingly.
Maps support free-form string, number, and boolean values.
_Maps are not indexed, and not queryable_.
They are only suitable for free-form fields that may vary widely for the same model type.
Maps are never null, and are always ready to be read/modified.
Use an optional map field if no values are required.

# Geo Point

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

# Image

The `image` field type stores a single image. Supported image types are JPG, GIF, PNG.
For more information on uploading and displaying images, see [Models / Images](/🗄/Article/models/images.md).

## Example Definition

```yaml
coverImage: image
```
    
# Hierarchy

`hierarchy` is a specialized field type which enables
custom ordering of the _Universal_ model type.

This field may only be named "hierarchy" or "order",
and a model may only contain one field of this type.
For more information on using this field type see
[Models / Ordering](/🗄/Article/models/ordering.md).

## Example Definition

```yaml
order: hierarchy
```

# SVG Icon {#svg-icon}

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

# Markdown {#markdown}

Use the `markdown` field type for simple and safe rich text formatting.
Markdown is typically used for direct input from a standard input/textarea,
by semi-technical users (or users willing to read simple documentation).

This field accepts string input.

> {.more}
>
> The default maximum size is 2,000 *characters*, which may be increased up to 20,000 *characters*.
> Supports min/max *characters* via `max: N` and `min: N` on the
> [field definition](/🗄/Article/models/types.md#definitions).
>
> ## Initializing
>
> A string may be assigned directly to the model's field.
> Or a value object may be created using the static field method:
>
> `let value = new Product.summary('*Markdown* summary')`
>
> ## HTML Display
>
> To display as rendered HTML within Mustache, use triple brackets: `{{{ model.markdownField }}}`
>
> The value will not be rendered if `invalid`
>
> ## Configuration
>
> The following additional field configuration options are available:
>
> ### `render/autolink`
>
> Controls whether plain URLs found within text are automatically converted to links when the value is rendered to HTML.
>
> May be `true` or `blank`.  `blank` will ensure links are output with `target="_blank"`.
>
> ## Properties
>
> If defined, the markdown value object has the following fields:
>
> ### `value`
>
> String value which is never null, but may be empty.
>
> ### `empty`
>
> true if the value is empty (also checks for empty when all whitespace is removed)
>
> ### `length`
>
> Same as calling `value.length`
>
> ### `characterCount`
>
> The number of characters in the value, which counts against the min/max setting for the field.
> Depending on the kinds of characters, this may or may not be the same as the `length`.
>
> ### `valid`
>
> true if the value is valid according to the field settings.
>
> ### `invalid`
>
> true if the value is invalid according to the field settings.

# HTML {#html}

Use the `html` field type combined with a WYSIWYG client-side editor.
Allowed HTML is highly limited, and the client-side editor must take that into account.

The structure of the valid HTML is a series of block level elements:
`h1-h6`, `div`, `p`, `pre`, `blockquote`, `ul/li`, `ol/li`.

Within each supported block, the following inline elements are supported:
`a`, `br`, `code`, `em`, `s`, `strong`, `sub`, `sup`, `del`, `ins`.

This field accepts string input.

> {.more}
>
> The default maximum size is 2,000 *bytes*, which may be increased up to 20,000 *bytes*.
> Supports min/max *bytes* via `max: N` and `min: N` on the
> [field definition](/🗄/Article/models/types.md#definitions).
>
> ## Initializing
>
> A string may be assigned directly to the model's field.
> Or a value object may be created using the static field method:
>
> `let value = new Product.summary('<p>summary</p>')`
>
> ## HTML Display
>
> To display as rendered HTML within Mustache, use triple brackets: `{{{ model.htmlField }}}`
>
> The value will not be rendered if `invalid`
>
> ## Markdown
>
> HTML fields support markdown input via field-specific methods.
> Keep in mind that the markdown must ultimately resolve to valid HTML for the field type.
>
> ```javascript
> let markdown = 'My *markdown* string'
> new Product().summary(Product.summary.md(markdown));
> ```
>
> To later convert back to Markdown (potentially with minor formatting differences):
>
> ```javascript
> let markdown = theProduct.summary.md();
> ```
>
> ## Configuration
>
> The following additional field configuration options are available:
>
> ### `render/autolink`
>
> Controls whether plain URLs found within text are automatically converted to links when the value is rendered to HTML.
>
> May be `true` or `blank`.  `blank` will ensure links are output with `target="_blank"`.
>
> ## Properties
>
> If defined, the HTML value object has the following fields/methods:
>
> ### `value`
>
> String value which is never null, but may be empty.
>
> ### `empty`
>
> true if the value is empty (also checks for empty when all whitespace is removed)
>
> ### `length`
>
> Same as calling `value.length`
>
> ### `valid`
>
> true if the value is valid according to the field settings.
>
> ### `invalid`
>
> true if the value is invalid according to the field settings.
>
> ### `md()`
>
> Returns a Markdown representation of the HTML.
> It may be re-parsed back to HTML using the static method described above.
>
> ### `text()`
>
> Returns a plain text representation of the HTML (similar to Markdown),
> however there is no guarantee this form may be re-parsed back to HTML.

# Model Links {#model-links}

To link from one model to another, specify the model name for the field type:

```yaml
otherModel: TheOtherModelName
```

Fields of this type never return null or undefined.
Keep in mind that links may be "broken" if the target of the link was deleted.

For more information on methods and properties available see
[Model Link Scripting](/🗄/Article/scripting/models.md#model-links).

For [contained models](/🗄/Article/models/containers.md),
there is no need to add a link from the contained model back to the container.
There is already a method provided for this
[back reference](/🗄/Article/models/containers.md#container-link) to the container.

# Embedded

This is the field type corresponding to a complex value defined by an [Embedded](/🗄/Article/models/types.md#embedded) model type.

For more information on defining an embedded field, [click here](/🗄/Article/models/types.md#definitions).

# Lists {#lists}

Multi-valued lists may be defined for either simple values or complex embedded models.
To denote a list, add brackets "[]" after the field name.
If requirements don't call for the maximum of 20 entries,
then provision less entries by specifying a number (less than 20) between the brackets.
Capped/rolling/LRU lists are also [supported](/🗄/Article/scripting/models.md#rolling-lists).

## String Lists

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

## Model Lists

Whether defined [globally or locally](/🗄/Article/models/types.md#definitions),
embedded models can allow multiple values by adding "[]" after the field name:

```yaml
items[]:
  type:
    price: double

address[5]: Address
```

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
When using [dynamic endpoints](/🗄/Article/endpoints/dynamic.md) backed by a UID field,
this redirection is handled automatically.

# Unique Values {#unique}

> {.alert .is-warning .is-small}
>
> It is *not* recommended that an existing field be changed to unique after there is already live/production data for the field.
> A transaction will fail if trying to persist a duplicate unique value.
> If a unique value is being created or changed,
> first [query by the unique field](/🗄/Article/scripting/queries.md#unique)
> to check whether it's already used.

The `string` field type may be marked as `unique: true` for the [Universal](/🗄/Article/models/types.md#universal)
model type only. Unique values are constrained/scoped to the nearest [container](/🗄/Article/models/containers.md).

The [`uid` field type](/🗄/Article/models/fields.md#uid) is *always* unique (and retains previously used values).

Deleting a document will delete all associated unique values.

Within the directory "📦", and given a file name named `🌐Article.yaml`,
a "Universal" model named `Article` will be available to your scripts.

# Protected Fields {#protected}

Protected fields have values which are intended to be handled with more care and thought than regular fields.
Fields which may be protected are usually access tokens, identifiers, and other generated values.

A field may be marked as protected using `protected: true`

A protected field has the following properties:

- *Not* available for direct access in Mustache (but may be exposed via [suppliers](/🗄/Article/scripting/suppliers.md)).
- *Not* available for use in [forms](/🗄/Article/scripting/suppliers.md), including custom forms (their input may not come directly from a user).
- Available for direct access in server-side JavaScript, and exportable from [suppliers](/🗄/Article/scripting/suppliers.md) as usual.