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

Other Examples: `en-US`, 'de-DE', 'fr'

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
