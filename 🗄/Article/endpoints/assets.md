---
title: Assets
summary: Learn how to use SCSS, CSS, static HTML, and client side JS.
---

# SCSS {#scss}

Stacklane includes native support for `.scss` files.
If you have a SCSS file at `/theme.scss`, then reference this
in your HTML or Mustache file as you would any CSS file:

```html
<link rel="stylesheet" href="/theme.scss" ... >
```

We recommend using SCSS over plain CSS as it inherently supports
combining many files into one, as well as minification.

If the SCSS file is a [private file](/🗄/Article/endpoints/mustache.md#private-files),
then it will be inlined into the HTML.

# CSS

A `.css` file may be included anywhere, however in general we recommend SCSS (`.scss`) files
due to the additional capabilities offered.
There are performance benefits to SCSS in addition to its functionality &mdash;
SCSS inherently supports combining many files into one, as well as minification.

# JS {#js}

Whenever possible consider using native
<a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/Element">DOM</a>
methods and of course <a target="_blank" href="http://vanilla-js.com/">VanillaJS</a>.
Web development has come a long way, and certain monolithic libraries were
created in the day of poor cross-browser compatibility.

## Inlining

Provided any major functionality has been brought in via a third party JS library,
in some cases it may make sense to simply inline your JavaScript.

Inline in the normal way using `<script>...</script>`.
Alternatively you may inline a private file by
referencing it like any external script: `<script src="/_myCode.js"></script>`.
Because of the underscore marking it as a private file, Stacklane inlines the JS into the page.

In either case Stacklane produces an appropriate [CSP](/🗄/Article/infrastructure.md#csp).

## Turbolinks + StimulusJS

As an alternative to the traditional "single page application" which
often uses a complex library with its own learning curve,
we recommend a combination of
<a href="https://github.com/turbolinks/turbolinks" target="_blank">Turbolinks</a>
and
<a href="https://stimulusjs.org" target="_blank">StimulusJS</a>.

Turbolinks makes page-to-page navigation faster, and
Stimulus allows you to declaratively inject/connect JavaScript to HTML.
Together they are a lightweight alternative
which respects the natural structure of the web, allows
code to stay close to the native browser capabilities,
and facilitates highly readable and maintainable code.

# HTML

If the extra capabilities of [Mustache](/🗄/Article/endpoints/mustache.md)
templates are not needed, then a plain HTML file may be used.  It follows the same routing conventions
and [CSP](/🗄/Article/endpoints/mustache.md#csp) requirements as Mustache files,
including putting `index.html` into a route with a trailing slash.
If you decide to rename your file extension to use Mustache in the future,
there is no change to the public endpoint/URL.

# External JS/CSS {#external}

## JS
   
We like to think of third party JS libraries as part of the browser's stack
&mdash; something that extends the native functionality of the browser, and that your app may put to use.

We generally do not recommend hosting these along with custom Stacklane JavaScript files, as it brings no additional benefit.

There are many excellent services, where third party libraries are dependable, distributed, and versioned.

Depending on the script, it may be necessary to specify additional Content-Security-Policy information.
frame-src and connect-src may be specified directly on the element:

```html
<script src="https://js.stripe.com/v3/"
        data-frame-src="https://js.stripe.com"
        data-connect-src="https://api.stripe.com"></script>
```

## CSS

Ensure that you're able to obtain a reliable Subresource Integrity (SRI) `integrity` attribute for the external CSS,
and place it on the `<link>` element.  Typically SRI is only reliable for "versioned" URLs.

## Fonts

The following external font services are supported:

- Google Fonts (SRI integrity attribute is not required)

Stacklane does not currently support:

- Adobe TypeKit &mdash; [does not support](https://helpx.adobe.com/fonts/using/content-security-policy.html) safe Content Security Policies (requires use of unsafe-inline).

## SRI

For security purposes most external (third party) JavaScript and CSS must specify an `integrity` attribute.
Subresource Integrity (SRI) is a security feature that enables browsers to verify that 
files they fetch are delivered without unexpected manipulation.
It works by allowing you to provide a cryptographic hash that a fetched file must match.
Most services such as <a target="_blank" href="https://www.jsdelivr.com/">jsDelivr</a>
automatically provide SRI information to copy/paste.

## SRI Whitelist

The following JS does not require SRI:

- https://js.stripe.com/v3/

The following CSS does not require SRI:

- https://fonts.googleapis.com/css?...