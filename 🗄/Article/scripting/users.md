---
title: User Scripting
summary:  Learn about scripting with users, roles, and profiles.
---

User scripting puts into practice the concepts and setup from
[user settings](/🗄/Article/settings/users.md) and
[user profiles](/🗄/Article/models/types.md#profile).
Review these docs before learning about user scripting, or use this doc as an overview
for how these settings materialize into code.

> {.alert .alert-info .small}
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

# Profiles

[User profiles](/🗄/Article/models/types.md#profile).
are a type of model that allows you to associate custom fields and data directly with a specific user.
You can either associate the user profile with only a user,
**or** you may associate the user profile with _both_ a user and a
[container](/🗄/Article/models/containers.md).
        
When accessing user profiles for the currently logged in user,
use the special `me()` method to load them.
       
```javascript
import {BasicProfile} from '📦'

let currentUserProfile = BasicProfile.me().get();
```

Important: the me() method acts like a singleton, and if there hasn't been a user profile setup
it will auto-create one.