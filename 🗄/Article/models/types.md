---
title: Model Types
short: Types
summary:  Learn about model types, and how to choose the best for the job.
order: 1
---

# Universal

This is a general purpose type, suitable for a wide range of entities and concepts.
It supports unique values, and may be a singleton.

The Universal type may optionally be a [container](/🗄/Article/models/containers.md) for other types.
For example, a `List` might be defined as a container for `Task`'s.

While this type has broad cases, review the other model types before choosing
in case another type is more suitable. It does not allow large text fields,
and is therefore not suitable for an article, blog post, or product description.

# Content {#content}

Represents content that is handcrafted by a small number of people,
and typically viewed by a much wider audience.
Intended for content management systems, and it may represent
anything from an Article to a Product.

It supports a larger field size for the [rich text field type](/🗄/Article/fields/text.md),
as well as a larger overall model size.
 
# User Profile {#profile}

Profiles are a type of model which allows associating custom fields with a specific user. 
They are only available when [user related](/🗄/Article/users/overview.md) functionality is enabled.
They may either be top level or [contained](/🗄/Article/models/containers.md).

[Learn more about Profiles](/🗄/Article/users/profiles.md).

# Embedded {#embedded}

Embedded models create a complex value (or sub-document) that can be used as a field type for another model type.
It may also be used for [lists](/🗄/Article/fields/models.md#model-lists),
where for example `Order.item` is a list of `OrderItem` embedded values.
Models to be embedded take on the field limitations of whatever type they are embedded on.

## Local vs Global 

Global embedded types may be used and embedded within any other type.
They have a distinct name and definition file separate from other files.
Because they are independent types, they may be used from any other type.

Local embedded types may only be used and embedded within a single model type.
They are defined directly in the same model configuration file that uses them.
