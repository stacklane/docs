---
title: Nested Site Mounts
summary: Stacklane sites may be organized into smaller sub-sites and mounted at a path.
---

To nest a site at a sub-path of another site, create a configuration file such as:
`/🔌path-name.yaml` where "path-name" will become the directory
where the site is nested at.
For example, if your main site is hosted at `https://abccompany.com/`,
a configured nested site `/🔌store.yaml` would host the
nested site at `https://abccompany.com/store/`

# Base URLs {#base}

Development of a nested site should be no different than if the site is intended for deployment on a root domain.
The final deployment location of the site (root domain or nested path) is code agnostic.
Therefore the nested site's code should *not* hardcode its final mount location.
Stacklane automatically applies a few simple rules to facilitate this.
The following scenarios are automatically modified to include with the mount path prefix of the nested site:

- Static assets such as links to scripts / images.
- Redirects from JavaScript endpoints.
- Form actions beginning with `/` &mdash; `<form ... action="/my-endpoint">` 
- *Any* HTML attribute in the format `href="/my/path"` where the attribute ends with `href` and its value begins with `/`.

The last rule covers a variety of scenarios including `a`, as well as custom attributes, for example:

`data-custom-value-href="/the/path"`

Another approach for client side JavaScript is to specify a `base` in `<html>` or `<body>`, such as this:

`<html data-base-href="/">`

If the site is deployed to the root domain then this will always be `/`.

Otherwise it will be the mount path where parent site is nesting this site.

# `source`

The only required field for a site mount is the location to obtain the nested site's source code.

```yaml
source: https://github.com/owner/project.git
```

To specify a branch:

```yaml
source: https://github.com/owner/project.git#branch
```

To specify a tag (prefix with '!'):

```yaml
source: https://github.com/owner/project.git#!tag
```

> {.alert .is-warning .is-small}
>
> The _owner_ must match the owner of the source including this nested mount.

# `namespace`

If the nested site is data driven, then it must be assigned a data namespace.
This ensures the data remains relevant if you later change its path.
Minimum length is 4 characters, maximum length is 25 characters.

```yaml
namespace: my-namespace
```

## Shared Data

A nested site may share data with its parent by specifying:

```yaml
namespace: shared
```

However this should only be used in special scenarios, especially when the parent and nested
site are sharing the same data model.

> {.alert .is-info .is-small}
>
> Changing the namespace identifier after it contains live / production data will result in a loss of data.

# `🎨`

If the nested site contains a [properties file](/🗄/Article/settings/properties.md),
then the values in this file may be overridden, where
the values beneath "🎨" correspond to values in the nested site's 🎨.scss file.

```yaml
🎨:
  some-option: true
  the-color: aliceblue
```

# `keys`

Since secure keys and credentials are scoped to the parent, there may be certain keys
that the parent needs to expose to a nested site.
The parent must explicitly specify individual keys,
and any other keys will be non-existent for the nested site.

```yaml
keys:
  - api:stripe.com
```

