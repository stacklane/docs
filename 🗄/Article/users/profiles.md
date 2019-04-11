---
title: User Profiles
summary: Learn about associating custom data with a user.
---

Profiles are a type of model which allows associating custom fields with a specific user. 
They are only available when [user related](/users/) functionality is enabled.
They may either be top level or [contained](/🗄/Article/models/containers.md).

For a top level user profile, there may only be a single user profile per user (one-to-one). 
For a contained user profile, a single user may have as many user profiles as there are containers (one-to-many, profile-per-container).
In both cases the user profile must be explicitly created.
