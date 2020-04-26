---
title: Model Definitions
short: Definition
summary:  Learn about defining data models, fields, and relationships.
order: 2
---

To define and use data models in your project, create a directory named "📦" in the root
of your project.  This directory will contain `.yaml` files that
define the model names and fields, as well as the structure of
[container relationships](/🗄/Article/models/containers.md).

The file name indicates _both_ the name of the model as well as the model's type.
The model's type is denoted with a specific emoji prefix.

- [Universal](/🗄/Article/models/types.md#universal) -- prefix file with 🌐
- [Content](/🗄/Article/models/types.md#content) -- prefix file with 📄
- [User Profile](/🗄/Article/models/types.md#profile) -- prefix file with 👤
- [Embedded](/🗄/Article/models/types.md#embedded) -- prefix file with 📎

# Containers {#containers}

To define model types that are in a container, place them into a directory named after the container type.

```file-list
/📦/🌐List.yaml
/📦/List/🌐Note.yaml
/📦/List/🌐Task.yaml
```

# Fields {#fields}

Field names must follow camel case, e.g. "camel" or "camelCase".
All defined fields are indexed and required by default.
Field definitions have a short form and long form,
which may be mixed and matched as needed in the same file.
_.yaml files use spaces, not tabs, for indentation._

## Short Form

To compactly use all defaults for a field, simply assign a [field type](/🗄/Article/fields/overview.md)
immediately following the field name (all fields are required by default).

```yaml
fieldName: string
otherField: boolean
```

Short form field definitions may be configured as `optional` with the '?' postfix:

```yaml
optionalNumber?: integer
```

## Long Form

To define additional [field properties](/🗄/Article/fields/overview.md) use the long form:

```yaml
fieldName:
  type: string
  optional: true
  unique: true

otherField:
  type: boolean
```

# Embedded Values {#embedded}

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

# Custom ID Prefixes {#id-prefix}

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