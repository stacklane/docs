---
title: User Scripting
summary:  Learn about scripting with users, roles, and profiles.
---

User scripting puts into practice the concepts and setup from
[user settings](/🗄/Article/settings/users.md) and
[user profiles](/🗄/Article/models/types.md#profile).
Review these docs before learning about user scripting, or use this doc as an overview
for how these settings materialize into code.

> {.alert .is-info .is-small}
>
> The examples below are in JavaScript, but most approaches apply to Mustache templates as well.

# User Model

Users are a represented by a pre-built model that lives in the module '👤'.
All users will have at least a `name` and `email` by default,
which is obtained from whatever social login provider they used (Google, etc).
       
# Current User
 
Access the currently authenticated user using the `Me` variable in the `👤` module.
 
```javascript
import {Me} from '👤';

({name: Me.name});
``` 

## Checking Optional Authentication

In most cases authentication state is **guaranteed** by how the user authentication
settings and endpoints are configured.
But in certain cases of "optional authentication"
you may need to know whether the `Me` variable is available (whether a user authenticated).
        
```javascript
import {Me} from '👤';
import {Msg} from '🎨';

if (Me.linked){
    ({name: Me.name});
} else {
    // This message must be configured in a style settings file
    ({name: Msg.NotLoggedIn});
}
```

# Avatar

All users have an `avatar()` method, which is also accessible 
from Mustache as `{{{user.avatar}}}` (triple bracket to emit HTML).

This method will return a web safe SVG or IMG value.

Using the avatar method requires `read` permission for `👤.User.name` and `👤.User.picture`.

# Profiles

[User profiles](/🗄/Article/models/types.md#profile)
are a type of model that allows associating custom fields with a specific user.
A user profile may be associated with only a user (one-to-one),
**or** you may associate the user profile with _both_ a user and a
[container](/🗄/Article/models/containers.md) (one-to-many, profile-per-container).
        
When accessing user profiles for the currently logged in user,
use the special `me()` method to load them.
       
```javascript
import {BasicProfile} from '📦'

try {
    let currentUserProfile = BasicProfile.me().get();
} catch ($ModelNotFound){
    // No BasicProfile created for current user
}
```

## Assigning Roles

When constructing a new user profile model, it's common to associate it with both the current user and a defined role.
The following example assumes a container named `Group`, a profile named `GroupUser`, and a role named `GroupOwner`.

```javascript
import {Me,Role} from '👤';
import {Group, GroupUser} from '📦';

let group = new Group().name('New Group');

group(()=>{ // Selects the 'group' as a container
  new GroupUser().role(Role.GroupOwner).user(Me);
});
```

We've created a new Group, created a new GroupUser profile, 
then assigned the current user to the GroupUser profile, along with the pre-defined role GroupOwner.

GroupOwner must be a previously [defined role](/🗄/Article/settings/users.md).

## Checking Roles

To check whether a user profile is assigned a specific role, use `hasRole`:

```javascript
import {Role} from '👤';
import {GroupUser} from '📦';

if (GroupUser.me().get().hasRole(Role.GroupOwner)){
  // Current user is a 'GroupOwner'
}
```