---
title: Progressive Web Apps
summary: Learn the settings required to enable PWA's.
---

Progressive web apps use modern web APIs along with traditional progressive enhancement 
strategy to create cross-platform web applications.
These apps work everywhere and provide several features that 
give them similar user experience advantages as native apps. 

# Manifest

To indicate support for PWA, use the `app` configuration value in the `🎛.yaml` manifest file.

```file-name
/🎛.yaml
```

```yaml
name: GreatApp

app: true
```

# Properties

Progressive web apps require various properties to enable home screen icons, startup screens, etc.

These [special variables](/🗄/Article/settings/properties.md#special) are defined in the `🎨.scss` properties file.  

Required values are: `$name`, `$short-name`, `$theme-color`, `$background-color`, `$icon-sm`, `$icon-lg`, `$icon-apple`.

For more information about each variable see the [properties file](/🗄/Article/settings/properties.md#special) doc.

# Use

Progressive web apps require configuration values in the document `<head>`.
Stacklane automatically assembles these values, as well as the "[Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)".

Simply include the following line in your Mustache file's `<head>`, usually in a layout template:

```file-name
/_layout.html
```

```html
<!--TEMPLATE mustache-->
<html>
<head>
... 
{{{🎨.WebApp}}}
...
{{$head}}Endpoint Specific Head{{/head}
</head>
...
```

## iOS

Legacy support for iOS does not have the "[Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)" recommendation.

Therefore we recommend only emitting Apple specific information on one HTML endpoint &mdash; this being the specific endpoint
which a user is expected to choose "Add to Home Screen" from.

To explicitly emit Apple related tags, and assuming a layout template as in the example above:

```file-name
/index.html
```

```html
<!--TEMPLATE mustache-->
{{% partial /_layout }}
{{< layout}}

{{$head}}
{{{🎨.AppleMobile}}}
{{/head}}

....
```

The end result being that (between the layout template and endpoint template)
both `{{{🎨.WebApp}}}` and `{{{🎨.AppleMobile}}}` will be generated.

