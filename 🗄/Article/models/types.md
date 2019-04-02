---
title: Model Types
summary:  Learn about model types, and how to choose the best for the job.
---

# Universal

This is a general purpose type, suitable for a wide range of entities and concepts.
It supports unique values, and may be a singleton.

The Universal type may optionally be a [container](/🗄/Article/models/containers.md) for other types.
For example, a `List` might be defined as a container for `Task`'s.

While this type has broad cases, review the other model types before choosing
in case another type is more suitable. It should not be
used for extremely unbounded data, such as _Orders_ or _Comments_
(better suited for the Event type).  It does not allow large text fields,
and is therefore not suitable for an article, blog post, or product description.

# Content

Represents content that is handcrafted by a small number of people,
and typically viewed by a much wider audience.
Intended for content management systems, and it may represent
anything from an Article to a Product.

It supports a larger field size for the [rich text field type](/🗄/Article/models/fields.md#rich),
as well as a larger overall model size.
Because it is intended to created and managed by people,
only 1 insert is allowed per transaction.
 
# User Profile {#profile}

User profiles are a type of model that allows associating custom fields with a specific user. 
They are only available when [user related](/🗄/Article/settings/users.md) functionality is enabled.
They may either be a top level type or [contained](/🗄/Article/models/containers.md).

For a top level user profile, there may only be a single user profile per user (one-to-one). 
For a contained user profile, a single user may have as many user profiles as there are containers (one-to-many, profile-per-container).
In both cases the user profile must be explicitly created.

Learn more about [user scripting](/🗄/Article/scripting/users.md).

# Event (Q4 2019) {#event}

This type is for events, time-series data, activity, or logging.
Events accumulate over time at a potentially high frequency/volume.

# Embedded {#embedded}

Embedded models create a complex value (or sub-document) that can be used as a field type for another model type.
It may also be used for lists, where for example "Order.items" is a list of "OrderItem" embedded values.
Models to be embedded take on the field limitations of whatever type they are embedded on.

For more information see [embedded definitions](/🗄/Article/models/definition.md#embedded).

## Local vs Global 

Global Embedded types may be used and embedded within any other type,
as long as their fields are compatible with that type.
They have a distinct name and configuration file.

Local Embedded types may only be used and embedded within a single model type,
and they are defined directly in the same model configuration file that uses them.
