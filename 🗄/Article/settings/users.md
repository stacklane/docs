---
title: Users
summary: This configuration is only needed to enable user and/or session functionality.
---

To enable user or session functionality drop a settings file into
the root named `/👤.yaml`.
After learning about the settings and related concepts involved,
check out the closely related [user scripting](/🗄/Article/scripting/users.md).

# `auth`

Predefined string which specifies the overall authentication
mode of the site.  Default: `inherit`

- `inherit` &mdash; Default. If the site is nested, inherit the parent site's user behavior, otherwise `none`
- `none` &mdash; Explicitly disabled user and/or session functionality.
- `required` &mdash; Private access only, requiring user authentication for all endpoints.
- `optional` &mdash; Aware of users, but they are not explicitly required for access.

# Sub-Directories {#sub}

By default the root 👤.yaml impacts all files and descendant directories.

Additional user settings files (👤.yaml) may be selectively placed in sub-directories.
As with the root file, settings in a sub-directory file are in scope for all descendants,
unless another 👤.yaml is specified, in which case that begins a new scope.
