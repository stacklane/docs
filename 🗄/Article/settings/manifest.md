---
title: Manifest
summary: The manifest configuration file defines basic properties about a site.
---

The manifest is the **only** required configuration file in a site's source.
It should be in the root directory and named `/🎛.yaml`.
The `name` field is required.

# `name`

The name of the site / application (for development purposes). Required.

# `locale`

The primary locale (language and optional country) of the site.
This includes the site's text, and any strings defined in the
(optional) [properties file](/🗄/Article/settings/properties.md).

Default: `en`

Other Examples: `en-US`, `de-DE`, `fr`

# `features`

Features are toggles which may significantly impact site/app function *or* pricing.
Not every capability or option has a corresponding feature.
*All features are enabled by default*.

Leaving all features enabled by default is useful for early development.
Prior to live deployment it is recommended to explicitly choose features.
By adding the `features` key to the manifest, all features become *disabled* by default,
and those desired must be explicitly enabled.

> {.more}
>
> The following features are available:
>
> ```yaml
> features:
>   models:
>     static: false
>     dynamic: false
>     search: false
>     images: false
>     files: false
>     events: false
>   users:
>     internal: false
>     external: false
>   scripts:
>     connectors: false
>     email: false
> ```
>
> ## `models`
>
> - `static` &mdash; [Static model data](/🗄/Article/models/static.md)
> - `dynamic` &mdash; [Dynamic model data](/🗄/Article/models/types.md)
> - `search` &mdash; Full text search
> - `images` &mdash; [Image support](/🗄/Article/models/images.md)
> - `files` &mdash; File support
> - `events` &mdash; Event model type
>
> ## `users`
>
> For more information see [Users](/users/).
>
> - `internal` &mdash; Team members / administrators.
>   These users must be explicitly invited.
>   Compared to external users, there are a very low number.
> - `external` &mdash; End-users or end-clients of the site/app.
>   These are users which "signup", and are automatically on-boarded.
>   There are typically a much higher number of external users than internal users.
>   May either be `false`, `viewers`, or `true`.
>   `viewers` may only interact with existing content, such as a membership area.
>
> ## `scripts`
>
> - `connectors` &mdash; [Connectors / Third Party APIs](/🗄/Article/scripting/connectors.md)
> - `email` &mdash; [Email](/🗄/Article/scripting/email.md)

# `app`

Setting this value to `true` enables [progressive web app functionality](/🗄/Article/settings/app.md).
Additional configuration is needed as described in the [doc](/🗄/Article/settings/app.md).

# `domain`

true/false value that determines whether a site may exist at
a standalone domain name.  Default: `true`

# `path`

true/false value that determines whether a site may be 
[nested](/🗄/Article/settings/nested.md)
at a sub-path of another site.  Default: `true`

# `frameable`

true/false value that determines whether a site may be embedded in a frame
of another site on the same domain.  Default: `false`
