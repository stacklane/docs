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
May be marked as <a href="#unique">unique: true</a>.\
Provisioned size: 400 bytes (4 bytes provisioned per character).\
This may be lowered by defining `max: N` for the field definition.

## `boolean`

true/false boolean value.\
Provisioned size: 1 byte.

## `integer`

Non-floating 64 bit integer (long).\
Provisioned size: 8 bytes.

## `double`

Floating-point number (64-bit double precision, IEEE 754).\
Provisioned size: 8 bytes.

## `timestamp`

Date/time stored as UTC/GMT.
Keep in mind that every model comes with
automatically managed `created` and `modified` timestamp fields.\
Provisioned size: 8 bytes.\
To initialize a timestamp field to the current date/time use `init: true`.

## `geo`

Geographical point containing both latitude and longitude.\
Provisioned size: 16 bytes.
        
Writing a geo point may be done as either a 
comma separated string `myModel.location = 'latitude,longitude'`,
or as a value object `myModel.location = new MyModelType.location(lat,long)`.

Reading a geo point always results in a value object with `latitude` and `longitude` properties.

Valid geo points have latitudes >= -90 and <= 90, and longitudes >= -180 and <= 180.
        
# Options {#options}

`options` are a special purpose string field, limited to pre-configured string values.
The options / values must be camel case (example, exampleOne, exampleTwoOther), using single byte letters.\
Provisioned size: 50 bytes.

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

To use the first listed value as a default / pre-initialized value for newly created models,
simply change `init` to `true`.
Otherwise it will default to null.

## Type-Safe Access {#options-type-safe}

Instead of referencing the available values by string, it's recommend to use
the type-safe version.  Given a `Product` model:

```javascript
let p = new Product().status(Product.status.pending);
```

# Speciality

Speciality fields provide validation, and often lower provisioned sizes.

## `country`

<a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3" target="_blank">ISO 3166-1 alpha-3</a> country code.\
Provisioned size: 3 bytes.

## `map`

Special case field that should be used sparingly.
Maps support free-form string, number, and boolean values.
_Maps are not indexed, and not queryable_.
They are only suitable for free-form fields that may vary widely for the same model type.

# Image

The `image` field type stores a single image. Supported image types are JPG, GIF, PNG.
For more information on uploading and displaying images,
see [Models / Images](/🗄/Article/models/images.md).\
Provisioned size: 100 bytes (independent of image size)

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

Provisioned size: 50 bytes.

# SVG Icon {#svg-icon}

`svg-icon` is a purpose specific field for holding a web-safe, square SVG icon.
Typically these values are generated from the `Identicon`
[utility](/🗄/Article/scripting/helpers.md#utilities).
This field is highly constrained to valid and safe SVG.
No scripting or inline styles are allowed.\
Maximum and provisioned size: 2000 bytes.

## Example Definition

```yaml
projectIcon: svg-icon
```

To display an SVG field in Mustache, use triple brackets `{{{ model.textField }}}`.

# Rich Text / HTML {#rich}

## `text`
        
Limited and validated HTML "rich text".

Supports a series of blocks
`h1-h6`,
`p`,
`pre`,
`section`,
`blockquote`,
`ul/li`,
`ol/li`.
`section` must contain `h1-h6` as its first child.

Within each block, the following inline elements are supported:
`a`,
`br`,
`code`,
`em`,
`s`,
`strong`,
`sub`,
`sup`.

Provisioned *and* maximum size is 20,000 *bytes* for the Content Type, and 2,000 *bytes* for all other types.

## `title`

Special kind of `text` which is limited to a
single `h1-h6` block containing allowed inline elements.\
Maximum length: 100 UTF-8 *characters*.  Provisioned size: 400 bytes (4 bytes provisioned per character).

## `paragraph`

Special kind of `text` which is limited to a
single `p` block containing allowed inline elements.\
Provisioned *and* maximum size: 2000 *bytes*.\
This may be lowered by defining `max: N` for the field definition.

## Markdown

Rich text / HTML fields support markdown input via field-specific static methods.
Keep in mind that the markdown must ultimately resolve to valid HTML for the field type.

```javascript
let markdown = 'My *markdown* string'
new Product().summary(Product.summary.md(markdown));
```

To later convert back to Markdown:

```javascript
let markdown = theProduct.summary.md();
```

## Display

To display an HTML field in Mustache, use triple brackets `{{{ model.titleOrTextField }}}` to ensure it is not escaped.

# Embedded

This is the field type corresponding to a complex value defined by an [Embedded](/🗄/Article/models/types.md#embedded) model type.

It may be a many valued array/list, in which case there is a limit of **20** embedded entries.
        
Provisioned size: sum of provisioned field sizes * times number of possible entries.

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

Provisioned size: 100 bytes.