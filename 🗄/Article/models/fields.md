---
title: Field Types
summary: Learn about available field types for your models.
---

# Default

Every non-embedded model type is pre-defined with a unique `id`, plus `created` and `modified` timestamp fields.
These are automatically managed.  They are available before persisting.

# Primitive

## `string`

Maximum length: 100 UTF-8 *characters*.
May be marked as <a href="#unique">unique: true</a>.
The maximum length may be lowered by defining `max: N` on the field definition.

## `boolean`

true/false boolean value.
Also accepts string input of "true"/"1", "false"/"0".
Other strings result in a validation error.

## `integer`

Non-floating 64 bit integer (long).
Accepts string input which does not contain a decimal point.
Other strings result in a validation error.

## `double`

Floating-point number (64-bit double precision, IEEE 754).
Accepts string input representing a decimal or non-decimal.
Other strings result in a validation error.

## `timestamp`

Date/time stored as UTC.
Keep in mind that every model comes with
automatically managed `created` and `modified` timestamp fields.
Initialize a timestamp field to the current date/time using `init: true`.
Accepts string input in ISO 8601 format, including partial formats such as "2000-01-01".
Other strings result in a validation error.

# Options {#options}

`options` are a special purpose string field, limited to pre-configured string values.
The options / values must be camel case (example, exampleOne, exampleTwoOther), using single byte letters.

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

Instead of referencing the available values by string, it's recommend to use
the type-safe version.  Given a `Product` model:

```javascript
let p = new Product().status(Product.status.pending);
```

# Speciality

Speciality fields provide validation, and often lower provisioned sizes.

## `country`

<a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3" target="_blank">ISO 3166-1 alpha-3</a> country code.

## `map`

Special case field that should be used sparingly.
Maps support free-form string, number, and boolean values.
_Maps are not indexed, and not queryable_.
They are only suitable for free-form fields that may vary widely for the same model type.

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
For more information on uploading and displaying images,
see [Models / Images](/🗄/Article/models/images.md).

## Maximum Size

Upload sizes of up to 10MB are accepted.
However images that exceed 2000px wide will be proportionally
re-sized to 2000px wide with a proportional height.
The size of an image does **not** contribute to the size of a model.

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
[utility](/🗄/Article/scripting/helpers.md#utilities).
This field is highly constrained to valid and safe SVG.
No scripting or inline styles are allowed.
Maximum size: 2000 bytes.

## Example Definition

```yaml
projectIcon: svg-icon
```

To display an SVG field in Mustache, use triple brackets `{{{ model.textField }}}`.

# Markdown {#markdown}

Use the `markdown` field type for simple and safe rich text formatting.
The default maximum size is 2,000 characters, which may be increased to 20,000 characters.
This field accepts string input.
The field is never null, and always returns a value object, even when the value is empty.

To display as rendered HTML within Mustache, use triple brackets:

`{{{ model.markdownField }}}`

The markdown string value is available on the never null `.value` field:

`model.markdownField.value.length == 0`

# Model Links {#model-links}

To link from one model to another, specify the model name for the field type:

```yaml
otherModel: TheOtherModelName
```

Keep in mind that links may be "broken" if the target of the link was deleted.

Fields of this type never return null or undefined.

Model links have the following methods/properties:

- `get()` &mdash; Obtain a live instance of the model linked to.  Throws `$ModelNotFound` if it no longer exists.
- `exists()` &mdash; Return true if the linked model still exists.
- `linked()` &mdash; Link fields are never null or undefined.  Returns true if the a link has been set.
- `id` &mdash; The ID of the model, or null if `linked() == false`.

For [contained models](/🗄/Article/models/containers.md),
there is no need to add a link from the contained model back to the container.
There is already a method provided for this
[back reference](/🗄/Article/models/containers.md#container-link) to the container.

# Embedded

This is the field type corresponding to a complex value defined by an [Embedded](/🗄/Article/models/types.md#embedded) model type.

It may be a many valued array/list, in which case there is a limit of **20** embedded entries.
Keep in mind that embedded lists carry [query limitations](/🗄/Article/scripting/queries.md#embedded)

For more information on defining an embedded field, [click here](/🗄/Article/models/types.md#embedded).

# Unique Values {#unique}

The `string` field type may be marked as unique for the [Universal](/🗄/Article/models/types.md#universal)
model type only.  Unique values are constrained/scoped to the nearest [container](/🗄/Article/models/containers.md).
        
Deleting a document will delete all associated unique values.

Warning: Commits will fail / throw an exception if there is a unique value violation.
Therefore it's highly recommended that if a unique value is being created or changing,
that there exists logic to check whether the unique value is available.

# URL Identifiers {#uid}

`uid` is used for "user friendly" unique identifiers destined for URL paths (aka URL slugs).

This field is always unique, and is available for the [Universal](/🗄/Article/models/types.md#universal)
and [Content](/🗄/Article/models/types.md#content) type's.

To keep URLs formatted according to best practices, it must start and end with
a lower case character a-z, or 0-9.  Between the start and end, dash characters are also allowed.
Minimum length is 2 characters.  Maximum length is 100 characters.

UID's behave differently than other unique values.  Because they are destined
for URLs, it's implied that when modified the previous value is not lost
(otherwise any previously published URL would result in a broken link).
Therefore a single model field may have multiple unique UID values associated with it,
however at any given time only one is "current" or "primary".

In an ideal scenario from an SEO standpoint, if the visitor has reached a URL by an older UID,
then it's recommended you redirect to the current/primary UID value.
When using [dynamic endpoints](/🗄/Article/endpoints/dynamic.md) backed by a UID field,
this redirection is handled automatically.