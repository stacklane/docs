---
title: Model Definition
summary: Learn about defining model and field types.
---

To define and use data models in your project, create a directory named "📦" in the root
of your project.  This directory will contain `.yaml` files that
define the model names and fields, as well as the structure of
parent/child ([container](/🗄/Article/models/containers.md)) relationships.

# Model Name and Type {#name}

The file name indicates _both_ the name of the model as well as the model's type.
The model's type is denoted with a specific emoji prefix.

- [Universal](/🗄/Article/models/types.md#universal) -- prefix file with 🌐
- [Content](/🗄/Article/models/types.md#content) -- prefix file with 📄
- [User Profile](/🗄/Article/models/types.md#profile)-- prefix file with 👤
- [Embedded](/🗄/Article/models/types.md#embedded) -- prefix with 📎

Within the directory "📦", and given a file name named `🌐Article.yaml`,
a "Universal" model named `Article` will be available to your scripts.

# Containers

To define models that are in a container, place them into directories.  Example files and folders in the
"📦" directory which define 3 model types, two of which are in containers.

```
 🌐Account.yaml
 Account/🌐List.yaml
 Account/List/🌐Task.yaml
```

# Fields 

Field names must follow "camel case" conventions, e.g. "camel" or "camelCase".
All defined fields are indexed and required by default.
Field definitions have a short form and long form, which can be mixed and matched as
needed in the same file.
_Note: .yaml files use spaces, not tabs, for indentation._

## Short Form

To compactly use all defaults for a field, simply assign a [field type](/🗄/Article/models/fields.md)
immediately following your field name.

```yaml
fieldName: string
otherField: boolean
somethingEmbed: EmbeddedModelName
```

## Long Form

To define additional field properties use the long form.
In the long form you only need to define the properties you're interested in.

```yaml
fieldName:
  type: string
  optional: true
  unique: true

otherField:
  type: boolean
```

# Embedded Values {#embedded}

## Global
        
Global embedded model types have a distinct name and configuration file,
and may be referenced in a configuration file like any other field type.

## Local

Local embedded model types are defined directly in the model that uses them.

```yaml
item:
  type:
    price: double
```

## Multi-Valued

Whether defined globally or locally, embedded values can allow multiple values (up to 20 entries)
by adding "[]" after the field name:

```yaml
items[]:
  type:
    price: double
```

If requirements don't call for the maximum of 20 entries, then provision less entries by
specifying a number (less than 20) between the brackets.

```yaml
address[5]: Address
```