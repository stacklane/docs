---
title: Progressive Web Apps
short: Web App
summary: Learn the settings required to enable PWA's.
order: 1000
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

Therefore we recommend only emitting Apple specific information on one HTML endpoint -- this being the specific endpoint
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

# Caching

App-enabled Stacklane sites automatically generate and install a service worker.
This service worker sets up 
pre-caching of static assets, 
dynamic caching of [model images](/🗄/Article/fields/image.md) ,
and custom caching for HTML endpoints.

## Third Party JavaScript

To ensure that third party JavaScript may be cached by the service worker,
specify `crossorigin="anonymous"`:

```html
<script src="https://...js" integrity="..." crossorigin="anonymous"></script>
```

## Custom Caching Strategies

Individual HTML endpoints may be given custom caching strategies.
We recommend using these sparingly on only the most commonly accessed views.

- **Network-First (Network Falling Back to Cache)** --
  Good for endpoints which may be updated frequently. 
  By default it will try and fetch the latest request from the network. 
  If the request is successful, it’ll put the response in the cache. 
  If the network fails to return a response, the caches response will be used.
- **Stale-While-Revalidate** --
  The stale-while-revalidate pattern responds to a request as
  quickly as possible with a cached response if available, falling back to the network 
  request if it’s not cached. The network request is then used to update the cache.
  This is a fairly common strategy where having the most up-to-date resource is not vital to the application.

Specify the strategy as a Mustache pragma:

```html
<!--TEMPLATE mustache-->
{{% Network-First }}
...
```

