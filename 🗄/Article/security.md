---
title: Security
summary: Learn how Stacklane protects data and encourages security best practices.
---

Stacklane approaches security as a default requirement of any web application, from simple to complex.
Security should be an inherent consideration from the first line of code written,
and not require later revisiting after the early stages of development.
The following is an overview of steps Stacklane automatically takes to protect your application and data.

# Content Policies {#csp}

<a target="_blank" href="https://en.wikipedia.org/wiki/Content_Security_Policy">Content Security Policies</a>
are a security standard which helps prevent common techniques for
cross-site scripting (XSS), clickjacking, and other code injection attacks.
A CSP header allows a site to declare trusted sources of its content (scripts, styles, images, fonts, etc).

All HTML served by Stacklane uses a Content Security Policy (CSP).
Instead of later revisiting an application to add-on a policy,
Stacklane makes using a Content Security Policy easy through a combination of
[automatic behavior and custom declarations](/🗄/Article/endpoints/mustache.md#csp).

# Model Data {#data}

All model data hosted with Stacklane is encrypted-at-rest.
Data is replicated and redundantly stored across multiple geographic regions.
Data can withstand the loss of entire regions and maintain availability without losing data.

# Key Vault {#keys}

Stacklane *requires* that all server-to-server code, connecting to remote third party APIs, use our secure key vault.
This encrypted vault is one-way &mdash; administrators may add keys to it, but from then on keys are
only used in server-to-server communications.

This approach ensures that third party usernames, passwords, credentials, and tokens are not stored
in source code, since they are unusable from within the source code itself.

# Identity Providers {#identity}

For [user login functionality](/users/), Stacklane requires the use of trusted third party providers.
This ensures that users do not need to remember and manage yet another password,
and also simplifies your application &mdash; there is no need to provide
"remember my password", "change password", "change username" options,
since these are instead the responsibility of the identity provider.

# Scripting {#scripting}

Stacklane uses a [custom JavaScript engine](/scripting/) for server-side logic.
This engine is designed for speed, security, and compile-time validation.
It ensures that all code runs in a secure sandbox,
follows any [user permissions](/users/), and
only connects to remote third party APIs using the internal [key vault](#keys).

# User Content {#user-content}

Accepting content created by users is challenging enough.
Stacklane ensures that all incoming data is sanitized.
For uploaded images, [unsafe content](/🗄/Article/models/images.md#unsafe) is automatically detected and blurred.