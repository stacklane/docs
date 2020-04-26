---
title: User Profiles
summary: Learn about associating custom data with a user.
short: Profiles
order: 10
---

Profiles are a type of model which allows associating custom fields with a specific user. 
They are only available when [user related](/🗄/Article/users/overview.md) functionality is enabled.
They may either be top level or [contained](/🗄/Article/models/containers.md).

For a top level user profile, there may only be a single user profile per user (one-to-one). 
For a contained user profile, a single user may have as many user profiles as there are
[containers](/🗄/Article/models/containers.md) (one-to-many, profile-per-container).
In both cases the user profile must be explicitly created.

# Role Associations

[Role](/🗄/Article/users/roles.md#custom) names are stored on Profiles.
Because Profiles may be either be top level or contained,
this allows a flexible mechanism for creating role/permission hierarchies.

Take the following model layout:

```file-name
Models
```

```file-list
/📦/👤BasicProfile.yaml
/📦/🌐Account.yaml
/📦/Account/👤AccountProfile.yaml
/📦/Account/🌐Product.yaml
```

`BasicProfile` is a top level Profile type, and `AccountUser` is a container based Profile type.
A single user may have only 1 `BasicProfile` (one-to-one),
and via containers may have multiple `AccountProfile`'s (one-to-many).

Any Profile may be associated with a [custom Role](/🗄/Article/users/roles.md#custom). 
Roles assigned to the top level Profile `BasicProfile` will *always* be in-scope for an authenticated User.
Roles assigned to the contained Profile `AccountProfile` will only be in-scope when
the authenticated User is accessing a _specific_ `Account` *and* any of its contained `Product`'s.

For more information on assigning roles to Profiles, see [User Scripting](/🗄/Article/users/scripting.md).


