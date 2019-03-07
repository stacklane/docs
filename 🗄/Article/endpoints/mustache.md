---
title: Mustache Endpoints
summary: Learn how to use Mustache to create HTML views.
---

# Overview

Stacklane uses Mustache, combined with additional extensions (pragmas),
to create dynamic HTML views.

To use Mustache to generate HTML views, continue to use the ".html" extension,
and on the first line of the HTML file use the special comment:

`<!--TEMPLATE mustache-->`

All files that use Mustache for the templating language, including partials/imports,
must include on the first line.

Mustache views may be populated with data or other scripted variables
by importing [variables](#variables) previously exported by
[Suppliers](/🗄/Article/scripting/suppliers.md).

# Routing

Mustache endpoints are routed according to their file name.

For example, `/hello/world.html`
responds to requests for `GET /hello/world`.

`index.html` may be used in the case where
the routing should be directory based.  `/hello/index.html`
responses to requests for `GET /hello/`.
_Note: It will also respond to requests for `GET /hello` (no trailing slash),
and redirect to the actual endpoint of `/hello/` (trailing slash)._

# Link Absolute Paths {#links}

When referencing files or endpoints within your app
we highly recommend using "href" and "src" with
absolute values instead of relative values --
`href="/here/there"` instead of
`href="here/there"`.

This creates consistency in a number of other locations including
script redirects, Mustache partial imports, and in
general leaves no ambiguity.

# Partials

Mustache partials may be thought of as file includes.
The syntax for including a partial is `{{> nameOfPartial}}`.

By default there are no partials available.  Stacklane uses pragmas to
instruct what partials are available, and how they are named.

## Directory of Partials

Name the directory with a leading underscore to indicate it is private:
`/_partials/`.  To allow the individual Mustache files in the directory
to be used as partials, use the pragma `{{% partial /_partials/ }}`
(note the trailing slash).  Given a file in this directory `/_partials/something.html`,
it may then be included via the standard syntax `{{> something}}`.

A directory of partials may optionally be given a prefix.  Using the above example,
`{{% partial /_partials/ as my}}`
brings in those partials with the "my-" prefix (hyphen is implied).
The same partial is now included using
`{{> my-something}}`

## Single Files

A single partial may be imported by referencing its full path name without the
".html" extension.  `{{% partial /_partials/something }}`
is accessible via `{{> something}}`.

Single file partials also support aliases.
`{{% partial /_something as somethingElse }}`
is accessible via `{{> somethingElse}}`.

# SVG

SVG files may be included/inlined using the same nomenclature as Mustache partials.
The only difference is the initial pragma.

Given a directory of SVG icons, the pragma
 `{{% svg /_icons/ as ic }}` would allow
importing of gear.svg using `{{> ic-gear}}`.

# Layout Templates {#layout}

A common extension to Mustache is the ability to define a "master template".
This file contains the `<html>`, `<head>`,
and `<body>` tags.  Within the file there is at least one
placeholder which denotes where to "insert" a section of HTML from another Mustache file
(the file which uses this master layout template).

## Master Template

```html
<!--TEMPLATE mustache-->
<!DOCTYPE html>
<html>
<head>
<title>{{$title}}Title{{/title}}</title>
...
</head>
<body>
...
{{$content}}Content{{/content}}
...
</body>
</html>
```

## Template Using Layout

The file using the master layout template will include it similar to a partial.
Assuming a layout file named `/_layout.html`, another file
would use this template like:

```html
<!--TEMPLATE mustache-->
{{% partial /_layout}}

{{<layout}}
{{$title}}My Title{{/title}}
{{$content}}
.. Custom Content Here ..
{{/content}}
{{/layout}}
```

# JSON

In certain cases it helps to keep structured data outside of your Mustache file,
and then include this for processing as any other variable.

In this case you can define a JSON file with a list of objects, and then refer to it as
you would any partial:  `{{% json /_myData as myData }}`.
This list of objects may then be iterated using Mustache iteration tags.

# HTML and SVG {#html}

Unescaped HTML or SVG may be emitted with triple brackets.

```html
{{{ myModel.icon }}}
```

Keep in mind that this is only allowed for web safe
[HTML](/🗄/Article/models/fields.md#rich)
and
[SVG](/🗄/Article/models/fields.md#svg-icon)
field types.

# Utilities {#util}

## choose-string

Provides a declarative way to choose one string based on another string.
If it were defined programmatically it would be a series of simple if/then/else,
or switch/case/default statements.
This is especially useful when dealing with constant, well-defined values
for a model field.

First, declare the string choices using `choose-string-map`.

```html
{{% choose-string-map message error=alert-danger *=alert-* }}
```

The first parameter of `message` defines a name of the string choice,
which will be repeated later for `choose-string`.
The remaining parameters define the mapping of input strings to output strings,
with an optional capture of the input via "*".

The above example outputs "alert-danger" when the string input is "error".
A catch all / else case may defined with "*".
In the example above an input of "success" would result in "alert-success".
For any of the cases, "*" is available to fill in the existing string input.

Second, use the previously defined string map.
The first parameter repeats the name given to the string map,
and the second parameter is the string input.

```html
{{#Messages.all}}
<div class="notification {{% choose-string message this.type }}">
  {{this.value}}
</div>
{{/Messages.all}}
```

## Alternative Definition

`choose-string-map` is the most compact way to define the choices.
However if spaces are needed in the strings use JSON for the definition via
`choose-string-json`.

```html
{{% choose-string-json message
  {
    "error": "alert alert-danger",
     "*": "alert alert-*"
  }
}}
```

# Iteration 

We've extended Mustache iteration with a couple of helpful utilities.
Standard mustache iteration looks like
`{{#SomeList}} ... {{/SomeList}}`.
There are two additional iteration options:

## as {#iteration-as}

Use 'as' to rename the internal variable available in each iteration:

`{{#SomeList as item}} {{item.prop}} {{/SomeList}}`

## by {#iteration-by}

Use 'by' to iterate the collection in groups of N (up to 10).

This is most useful when working with various CSS grid layouts.

```html
{{#SomeList by 2 as grp}}
    {{#grp as item}}
        {{item.prop}}
    {{/grp}}
{{/SomeList}}
```

# Variable Imports {#variables}

Mustache views may import variables which were exported by [Suppliers](/🗄/Article/scripting/suppliers.md).
To import a variable (or variables) use the following pragma:

`{{% import {SomeVar, AnotherVar} from '📤' }}`

After importing, `{{SomeVar}}` may then be used anywhere within the Mustache view.

(As mentioned in the documentation on [Suppliers](/🗄/Article/scripting/suppliers.md),
all variables exported exist in the module '📤'.)

## HTML Escaping

Mustache escapes / encodes special HTML characters by default when they
are included from a variable or model field.  If `{{company.name}}`
is "ABC &amp; Co.", then this will become the encoded HTML equivalent  `ABC &amp;amp; Co.`.

# Separation of Concerns {#soc}

If there are developers on a team who are strictly working on Mustache views, it may be useful to
limit their access to specific [Supplier](/🗄/Article/scripting/suppliers.md) values.
This can be accomplished by creating a [pinned supplier](/🗄/Article/scripting/suppliers.md#strict).

For example, given a Mustache view of `/hello/world.html`, and a Supplier file of
`/hello/📤/📌world.js`, the Mustache view will only have access to
values exported by `/hello/📤/📌world.js`, regardless of any other Supplier's in the path.

# Content Security Policies {#csp}

All pages served by Stacklane are given a Content Security Policy (CSP).
The CSP header allows a host to declare trusted sources of content (JS execution, CSS styles, images etc).

## Automatic Behavior

Files are analyzed to create a reasonable CSP file.

- `<script src=" ... >`
- `<link rel="stylesheet" href=" ... >`
- Inline `<script>` elements become a CSP hash source.
- Inline `<style>` elements become a CSP hash source.

## Custom Declarations

Include the following tag anywhere in the body:

```html
<link itemprop="content-security-policy" ... >
```

This tag supports the following properties:

- `data-connect-self="true"` - allows AJAX connections to the same web app.
- `data-img-src-data="true"` - allows "data:" as an image source in CSS.

## Restrictions

- Inline style attributes `style="..."` are not allowed.
- Inline JavaScript via attributes `onclick="..."`, etc, are not allowed.

# Private Files {#private}

Any file prefixed with an underscore `_fileName.html`
will never be publicly accessible, and is only used for
server side includes or similar logic (for example SASS import or Mustache partial).

Similarly any files whose **direct** parent folder
has an underscore such as `/_files/something.html`,
will be considered private even if the files themselves are not prefixed
with an underscore.
