---
title: Properties

summary: A purpose specific SCSS file which may define colors, phrases, and options for a running instance.
---

# File Format

The properties file is a plain SCSS-like file that accepts values/variables only.
These values may be overridden for instances of the site,
and also accessed from server-side environments &mdash;
JavaScript, Mustache, and imported into other SCSS files.

Create a file at the root `/🎨.scss` to define your properties.
This is a limited SCSS file for variables only.
The following SCSS data types are supported:  `string`, `boolean`, `color (hex/rgb/preset)`, `url`.
URLs must be absolute and point to static images contained in the source.

Variable names must follow the convention of `$variable` or `$variable-name`.

## Example

```file-name
/🎨.scss
```

```css
$name: 'ABC Great App';

$theme-color: blue;
```

# SCSS Access {#scss}

From another SCSS file, access variables defined in the properties file just
as you would any other SCSS import:

```css
@import '/🎨';

body{
  background-image: $image-background
}
```

# Mustache Access {#mustache}

There are several different ways to use or import properties from Mustache.
Note that url(...) values are unwrapped to their paths only.

## Direct Access

```html
<!--TEMPLATE mustache-->

<img src="{{🎨.image-background}}">
```

## Import Alias

```html
<!--TEMPLATE mustache-->
{{% import * as Properties from '🎨'}}

<img src="{{Properties.image-background}}">
```

## Specific Variables

```html
<!--TEMPLATE mustache-->
{{% import {image-background} from '🎨'}}

<img src="{{image-background}}">
```

# JavaScript Access {#javascript}

A SCSS/CSS friendly convention is to use
dashes for variables names such as `$color-primary`.  If you choose
this naming convention, simply be aware that from JavaScript that same variable
is accessed with "camel case" convention: `Properties.colorPrimary`.
Alternatively keep the dash using bracket syntax:  `Properties['color-primary']`

From a server side JavaScript file import the properties:

```javascript
import * as Properties from '🎨';

if (Properties.someBooleanOption){
   /* In 🎨.scss the variable is $some-boolean-option */
}
```

In JavaScript, string variables should be accessed as methods:

```javascript
import * as Properties from '🎨';

let msg = Properties.hello();
```

# Categories
    
There are several preset categories to group properties:
`style`, `messages`, and `options`.
Category presets provide a hint to the Stacklane console UI on how to
group and display properties to a user configuring them.
If no category is specified then `style` is the default.

```css
/**
 * @category messages
 */

$ui-home: 'Home';
$ui-sign-in: 'Sign In';

/**
 * @category style
 */

$bg-color: aliceblue;
```

# Use Cases {#cases}

## Instance-Specific Options

Certain capabilities may be optional, and checked in JavaScript or Mustache logic.

```css
$use-new-feature: true;
```

## Interface Messages

Consider centralizing your interface messages/phrases into the properties file.
This will later allow localizing/translating these phrases
in separate, language-specific properties files.
For example:

```css
$ui-home: 'Home';
$ui-sign-in: 'Sign In';
```

Then in a Mustache template:

```html
<!--TEMPLATE mustache-->

<span>{{ 🎨.ui-home }}</span>
<span>{{ 🎨.ui-sign-in }}</span>
```

Arguments are supported, for example:

```html
$ui-hello: 'Hello, {0}';
```

Then in a Mustache template:

```html
<!--TEMPLATE mustache-->
{{ % import {Me} from '👤' }}

<span>{{ 🎨.ui-hello Me.name }}</span>
```

Results in:

```html
Hello, John
```

Argument formatting options are based on the <a href="https://ssl.icu-project.org/apiref/icu4j/com/ibm/icu/text/MessageFormat.html">ICU project</a>.

## Modes

Consider using boolean values to provide advanced configuration or "modes" to a site.
Because the values are accessible from all locations, you can go deeper than CSS alone.
For example in `/🎨.scss`:

```css
$my-mode: true;
```

Then in a Mustache template:

```html
<!--TEMPLATE mustache-->
{{% import {my-mode} from '🎨'}}

{{#my-mode}}
Using special mode.
{{/my-mode}}
```

# Formatting

## Quotes

The straight single quote / apostrophe (U+0027) denotes literal characters.
Therefore in a message it should not be used for visible text.
Instead use left curly (U+2018) and right curly (U+2018) single quotes.
For example on a Mac, these are `option ]` and `shift option ]`.

```css
$action-added: 'You just added ‘{0}’';
```
