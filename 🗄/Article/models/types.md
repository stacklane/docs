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

# Event (Q4 2019) {#event}

This type is for events, time-series data, activity, or logging.
Events accumulate over time at a potentially high frequency/volume.

Orders, comments, and Twitter posts are considered "events", from the standpoint of their
potentially high frequency, their small size, and their permanence/low-mutability.
Once created they are usually not modified again.

Another distinguishing characteristic is that newer Events are generally more relevant than older events,
with very old Events having little to no relevance.

Events have a "useful time horizon" for queries, of either yearly, monthly, or daily.
The default of one year should be suitable for most cases, and is easiest to develop against.
A query for events may only span two time partitions.  So in the case of the default
yearly horizon, a single query could span two years.

## Query Scope

The Event type is always isolated to its immediate parent container for query scope.
Given Account ▶︎ Site ▶︎ Orders, the Orders Event type must always be queried in the context of a single Site.
In other words, you must first know the Site you want to query before you query for Orders.

## Advantages

- Designed for highest write volume.
- Automatic partitioning over time. There is no "performance penalty" to a business that has events growing over time, where newer events are generally more relevant than previous events.

## Limitations
       
- Unique values are not allowed.
- Must always exist within a [container](/🗄/Article/models/containers.md).
- All queries must include date/time range (it is not possible to query for all Events).
- Embedded models must be "local" to the Event type -- "purpose built" for that Event type.
 
# User Profile {#profile}

User profiles are only relevant and available
when [user related](/🗄/Article/settings/users.md) functionality is enabled.
They may either be a top level type or [contained](/🗄/Article/models/containers.md).

Learn more about [user scripting](/🗄/Article/scripting/users.md).

# Embedded

Embedded models create a complex value (or sub-document) that can be used as a field type for another model type.
It may also be used for lists, where for example "Order.items" is a list of "OrderItem" embedded values.
Models to be embedded take on the field limitations of whatever type they are embedded on.

## Local vs Global 

Global Embedded types may be used and embedded within any other type,
as long as their fields are compatible with that type.
They have a distinct name and configuration file.

Local Embedded types may only be used and embedded within a single model type,
and they are defined directly in the same model configuration file that uses them.
