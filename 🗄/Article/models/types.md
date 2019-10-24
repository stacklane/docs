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
in case another type is more suitable. It does not allow large text fields,
and is therefore not suitable for an article, blog post, or product description.

# Content {#content}

Represents content that is handcrafted by a small number of people,
and typically viewed by a much wider audience.
Intended for content management systems, and it may represent
anything from an Article to a Product.

It supports a larger field size for the [rich text field type](/🗄/Article/models/fields.md#rich),
as well as a larger overall model size.
Because it is intended to be created and managed by people,
only 1 insert is allowed per transaction/request.
 
# User Profile {#profile}

Profiles are a type of model which allows associating custom fields with a specific user. 
They are only available when [user related](/users/) functionality is enabled.
They may either be top level or [contained](/🗄/Article/models/containers.md).

[Learn more about Profiles](/🗄/Article/users/profiles.md).

# Embedded {#embedded}

Embedded models create a complex value (or sub-document) that can be used as a field type for another model type.
It may also be used for [lists](/🗄/Article/models/fields.md#lists),
where for example `Order.item` is a list of `OrderItem` embedded values.
Models to be embedded take on the field limitations of whatever type they are embedded on.

## Local vs Global 

Global embedded types may be used and embedded within any other type.
They have a distinct name and definition file separate from other files.
Because they are independent types, they may be used from any other type.

Local embedded types may only be used and embedded within a single model type.
They are defined directly in the same model configuration file that uses them.

# Defining Types {#definitions}

To define and use data models in your project, create a directory named "📦" in the root
of your project.  This directory will contain `.yaml` files that
define the model names and fields, as well as the structure of
[container relationships](/🗄/Article/models/containers.md).

The file name indicates _both_ the name of the model as well as the model's type.
The model's type is denoted with a specific emoji prefix.

- [Universal](/🗄/Article/models/types.md#universal) &mdash; prefix file with 🌐
- [Content](/🗄/Article/models/types.md#content) &mdash; prefix file with 📄
- [User Profile](/🗄/Article/models/types.md#profile) &mdash; prefix file with 👤
- [Embedded](/🗄/Article/models/types.md#embedded) &mdash; prefix file with 📎

## Containers

To define model types that are in a container, place them into a directory named after the container type.

```file-list
/📦/🌐List.yaml
/📦/List/🌐Note.yaml
/📦/List/🌐Task.yaml
```

## Custom ID Prefixes

Models always have an automatically generated unique `id` field.
A custom prefix may be added to all generated IDs for a particular model type.
This prefix may be between 1-3 lowercase alpha characters (a-z), and optionally end with an underscore.

```file-name
/📦/🌐Product.yaml
```
```yaml
🎛:
  prefix: prd_

# Field definitions
```

This will produce IDs for the `Product` model such as `prd_QpvhSS8U34k`

## Fields

Field names must follow camel case, e.g. "camel" or "camelCase".
All defined fields are indexed and required by default.
Field definitions have a short form and long form,
which may be mixed and matched as needed in the same file.
_.yaml files use spaces, not tabs, for indentation._

### Short Form

To compactly use all defaults for a field, simply assign a [field type](/🗄/Article/models/fields.md)
immediately following the field name (all fields are required by default).

```yaml
fieldName: string
otherField: boolean
```

Short form field definitions may be configured as `optional` with the '?' postfix:

```yaml
optionalNumber?: integer
```

### Long Form

To define additional [field properties](/🗄/Article/models/fields.md) use the long form:

```yaml
fieldName:
  type: string
  optional: true
  unique: true

otherField:
  type: boolean
```

## Embedded Values

Global embedded values may be referenced as any other field type:

```file-name
/📦/🌐Order.yaml
```
```yaml
contact: Contact
```

Local embedded values have field definitions inlined beneath the `type`:

```file-name
/📦/🌐Order.yaml
```
```yaml
contact:
  type:
    first: string
    last: string
    email: string
```

This local embedded model type is ultimately accessed as:

```javascript
order.contact = new Order.Contact().email('a@b.com')
```