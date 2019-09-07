---
title: User Settings
summary: This configuration is needed to enable user functionality.
---

To enable user or session functionality drop a settings file into the root named `/👤.yaml`.
After learning about the settings and related concepts involved,
check out the closely related [user scripting](/🗄/Article/users/scripting.md).

# `auth`

Predefined string which specifies the overall authentication
mode of the site.  Default: `inherit`

- `inherit` &mdash; Default. If the site is nested, inherit the parent site's user behavior, otherwise `none`
- `none` &mdash; Explicitly disabled user and/or session functionality. Suitable for assets and fully public sites.
- `required` &mdash; Private access only, requiring user authentication for all endpoints. 
- `optional` &mdash; Aware of users, but they are not explicitly required for access. Suitable for login screens and other dual use areas.

# Roles

Named roles define permissions for accessing models within a given scope.
Any `👤.yaml` file may define roles for a given directory and its descendants.
Role permissions are always cumulative (for the same role name), and therefore the general structure of 
directories and endpoints is usually from least permission (ancestors) to more permissive (descendants). 
For more information, see the separate document on [defining and using roles](/🗄/Article/users/roles.md).

# Sub-Directories {#sub}

By default the root 👤.yaml impacts all files and descendant directories.

Additional user settings files (👤.yaml) may be selectively placed in sub-directories.
As with the root file, settings in a sub-directory file are in scope for all descendants,
unless another 👤.yaml is specified, in which case that begins a new scope.

Use sub-directory configurations to achieve various common layouts.
In the examples below, an `/auth/` area is always provided for login,
and the proper setting for this area is `auth: optional`.

## Public Main Site, Private App

```file-name
/👤.yaml
```
```yaml
auth: none
```

```file-name
/app/👤.yaml
```
```yaml
auth: required

# All permissions by default (for example only):
default: all 
```

```file-name
/auth/👤.yaml
```
```yaml
auth: optional
```

## Private Main Site, Public Assets

```file-name
/👤.yaml
```
```yaml
auth: required

# All permissions by default (for example only):
default: all 
```

```file-name
/assets/👤.yaml
```
```yaml
auth: none
```

```file-name
/auth/👤.yaml
```
```yaml
auth: optional
```