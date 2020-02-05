---
title: Rich Text Fields
summary: Learn about HTML and Markdown fields
---

Stacklane supports two different types of rich text fields.
Rich text fields are necessary when a user needs to enter formatted text which will ultimately be displayed as HTML.
Both field types share the same functionality &mdash; the primary difference is in how they are natively stored,
and in how they will primarily be edited on the front-end.

# HTML {#html}

The `html` field type is recommended when the user interface front-end will use a WYSIWYG editor.
The `html` field type is also best suited for cases where dual modes (HTML or Markdown) are needed &mdash;
for example, if some users may want a WYSIWYG HTML editor, and others may want to enter Markdown directly.

## Valid Structure {#html-valid}

To ensure uniformity the HTML allowed by this field limits elements and attributes,
and any front-end editor should take this into consideration &mdash;
most editors allow configuration of allowed input.

It expects a series of block level elements:
`h1-h6`, `div`, `p`, `pre`, `blockquote`, `ul/li`, `ol/li`.

Within each supported block, the following inline elements are supported:
`a`, `br`, `code`, `em`, `s`, `strong`, `sub`, `sup`, `del`, `ins`.

Allowed attributes are `id`, `class`, and `href`.

The default maximum size is 2,000 *bytes*, which may be increased up to 20,000 *bytes*.
Supports min/max *bytes* via `max: N` and `min: N` on the
[field definition](/🗄/Article/models/types.md#definitions).

## Initializing

A string may be assigned directly to the model's field.
Or a value object may be created using the static field method:

`let value = new Product.summary('<p>summary</p>')`

# Markdown {#markdown}

The `markdown` field type is suitable for either basic formatting, or more technical users.
For example if users only need to be able to make text bold, or enter and display URLs,
then using Markdown instead of a WYSIWYG HTML editor is sufficient.
In either case, the front-end editor is likely to be a simple `<textarea>` or `<input>`.

## Valid Structure {#markdown-valid}

Markdown is inherently a limited subset of HTML.
Ultimately a valid `markdown` field will only resolve to the same valid structure as the `html` field type.

The default maximum size is 2,000 *characters*, which may be increased up to 20,000 *characters*.
Supports min/max *characters* via `max: N` and `min: N` on the
[field definition](/🗄/Article/models/types.md#definitions).

## Initializing

A string may be assigned directly to the model's field.
Or a value object may be created using the static field method:

`let value = new Product.summary('*Markdown* summary')`

# Sections {#sections}

For larger documents it can be useful to inspect section headers (for example any `h1`'s)
to generate a table of contents. This is accomplished with the `sections()` field method:

```html
<ul>
{{#model.htmlOrMarkdownField.sections as section}}
  <li>
    {{{ section.title }}}
  </li>
{{/model.htmlOrMarkdownField.sections}}
</ul>
```

The `sections()` method returns the highest level headers found in the document.
For example if the document starts with `h2` instead of `h1`, then `h2` will be considered the highest level,
and will be returned from `sections()`.

# Rendering {#rendering}

Rendering a rich text field occurs when using a Mustache template along with triple brackets:

`{{{ model.htmlOrMarkdownField }}}`

By default this will display the HTML unmodified, or the Markdown as directly converted to HTML.

Stacklane supports rendering options which transform the HTML for various cases.
To pass rendering options use the `html` method on the field, for example:

`{{{ model.htmlOrMarkdownField.html autolink=true }}}`

## `autolink`

Controls whether URLs found within plain text are automatically converted to links when the value is rendered to HTML.

The setting may be `true`, `false`, or `'blank'`. `'blank'` will ensure links are output with `target="_blank"`.

## `minimumHeaderLevel`

A numeric value between 1 and 6 which controls the smallest
(and therefore most prominent) header level / rank which will be rendered.

`{{{ model.htmlOrMarkdownField.html minimumHeaderLevel=2 }}}`

In this example using `2`, the final rendered HTML will *not* contain any `h1` headers, even if the field value does.
The assumption in this example is that the surrounding document where the field is rendered/included already contains an `h1`.
If any `h1` headers exist in the field value being rendered, they will be incremented to `h2`,
as well as incrementing all other header levels to maintain semantic meaning.

## `generateHeaderId`

When this rendering option is `true`, then any headers
which do not contain an ID already will be automatically assigned one based on the text within the header element.

## Adding Classes

For any supported HTML element (`p`, `div`, etc), it's possible to add classes during rendering,
even when the source field value does not contain the classes.  This is especially useful when
using various CSS frameworks which do not natively style headers.

To add classes simply indicate the name of the element along with space separated class names:

`{{{ model.htmlOrMarkdownField.html h2='title is-size-7' }}}`

In this example any rendered `h2` will have the additional style classes of "title" and "is-size-7".

# Properties {#properties}

Both `html` and `markdown` field types share the same fields and methods.
In some cases these may be redundant, but are included for consistency in working with either type.

## `value`

String value which is never null, but may be empty.

## `empty`

true if the value is empty (also checks for empty when all whitespace is removed)

## `length`

Same as calling `value.length`

## `valid`

true if the value is valid according to the field settings.

## `invalid`

true if the value is invalid according to the field settings.

## `markdown()`

For the HTML field, returns a Markdown representation of HTML.
This may be re-parsed back to HTML using the static method described above.

## `text()`

Returns a plain text representation of the HTML (similar to Markdown),
however there is no guarantee this form may be re-parsed back to HTML.

## `html(renderOptions)`

Using this method supports passing rendering options to control the final HTML output.
See the [rendering section](#rendering) for more information.

## `sections()`

List of sections which may be iterated to inspect the structure of the document.
For more information see [Sections](#sections).