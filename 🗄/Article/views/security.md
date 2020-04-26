---
title: Content Security Policies
short: Security Policies
summary: Allows a site to declare trusted sources of content (JS execution, CSS styles, images etc).
order: 100
---

A Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks,
including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data
theft to site defacement to distribution of malware.

In most cases Stacklane makes using Content Security Policies automatic, by using the content of the HTML
view to create a reasonable policy. Policies may also be customized for specific cases.

# Automatic Behavior

HTML views are automatically analyzed to create a reasonable CSP file,
without any further effort on your part.
The following elements are checked:

- `<script src=" ... >`
- `<link rel="stylesheet" href=" ... >`
- Inline `<script>` elements become a CSP hash source.
- Inline `<style>` elements become a CSP hash source.

## Restrictions

- Inline style attributes `style="..."` are not allowed.
- Inline JavaScript via attributes `onclick="..."`, etc, are not allowed.

## Custom Declarations

Include the following tag anywhere in the body:

```html
<link itemprop="content-security-policy" ... >
```

This tag supports the following properties:

- `data-connect-self="true"` -- allows AJAX connections to the same web app. Default: *true*.
- `data-form-self="true"` -- allows AJAX connections to the same web app. Default: *true*.
- `data-img-src-data="true"` -- allows "data:" as an image source in CSS (not recommended). Default: *false*.

# Additional CSP {#add-csp}

Local or external JavaScript may have further dependencies &mdash for example it may connect to another API,
or require fonts.

In that case it may be necessary to specify additional Content-Security-Policy information.
frame-src, script-src, connect-src, style-src, and font-src may be specified directly on the `<script>` element:

```html
<script src="https://cdn.asset.com/file.js"
        data-frame-src="https://frame.asset.com/"
        data-connect-src="https://connect.asset.com/"
        data-style-src="https://style.asset.com/"
        data-font-src="https://font.asset.com/"
        data-script-src="https://script.asset.com/"></script>
```

Similarly they may be specified on the `<link>` element for stylesheets:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/hack-font@3.3.0/build/web/hack.css"
      integrity="sha256-nZuLDiukZ8m5pnOiJdxK1IjXsQ2qbZB1R6x0ddFRyog=" crossorigin="anonymous"
      data-font-src="https://cdn.jsdelivr.net/npm/hack-font@3.3.0/">
```