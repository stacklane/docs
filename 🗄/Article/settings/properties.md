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
$name: 'The Great App';

$theme-color: blue;
```

# Special Variables {#special}

The following variable names have reserved meaning for [progressive web apps (PWAs)](/🗄/Article/settings/app.md).
Freely use them as "standardized" variable names, however be sure to keep the intent described below.

- `$name` &mdash; The name of the web app or site as it is usually displayed to the user 
  (e.g., amongst a list of other applications, or as a label for an icon).
  Example: "The Great App".
- `$short-name` &mdash; Only used in the case that `$name` is rather long.
  It is a short version of the name of the web app, intended to be used where there is insufficient space to display the full name.
  If both are provided, `$short-name` is used on the user's home screen, launcher, or other places where space may be limited.
  Example: "TheGreat".
  
`$name` and `$short-name` may be the same value.  

## Colors

- `$theme-color` &mdash; Often a brand color, toolbar color, or otherwise primary color in e.g. a logo.
- `$background-color` &mdash; Used on the splash screen when the application is first launched.
  This value repeats what is already available in the site’s CSS, 
  but can be used by browsers to draw the background color before the stylesheet has loaded. 
  This creates a smooth transition between launching the web application and loading the site's content.

## Icons

These icons are used in places like the home screen, app launcher, task switcher, splash screen, etc.

- `$icon-sm` &mdash; 192x192 absolute PNG image `url`.  
- `$icon-lg` &mdash; 512x512 absolute PNG image `url`.

## Apple Touch Icon

For iOS, there are a few more requirements:

- `$icon-apple` &mdash; 180x180 absolute PNG image `url`. 

This PNG should fill the entire 180x180 square.  No rounded corners or transparency.

# SCSS Access {#scss}

From another SCSS file, access variables defined in the properties file just
as you would any other SCSS import:

```css
@import '/🎨';

body{
  background-color: $background-color;
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

$background-color: aliceblue;
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

Argument formatting options are based on the [ICU project](https://ssl.icu-project.org/apiref/icu4j/com/ibm/icu/text/MessageFormat.html).

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
