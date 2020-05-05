---
title: Field Overview
short: Overview
summary: Learn about available field types for your models.
order: -1000
---

# Default

Every non-embedded model type is pre-defined with a unique `id`, plus `created` and `modified` timestamp fields.
These are automatically managed.  All are available immediately after model creation, even prior to persisting.

# Labels

When using models for [forms](/🗄/Article/controllers/forms.md),
it's useful to define labels and descriptions for the field, which may then be used directly within HTML.
By default all labels are assumed to be in the language of the [Manifest locale](/🗄/Article/settings/manifest.md#locale).

```file-name
/📦/🌐Product.yaml
```
```yaml
name:
  type: string
  label: Name
  placeholder: Product Name
  about: A great name for the product.
```

Even if not explicitly given, a default label is generated for every field using its name.
"name" -> "Name", "myField" -> "My Field".

## Option Labels

When using the [options field type](/🗄/Article/fields/basic.md#options), each option is given a default label.
To define custom labels for option values use the following name/value format:

```yaml
status:
  type: options
  values:
    act: Active
    dis: Disabled
```

# Unique Values {#unique}

> {.alert .is-warning .is-small}
>
> It is *not* recommended that an existing field be changed to unique after there is already live/production data for the field.
> A transaction will fail if trying to persist a duplicate unique value.
> If a unique value is being created or changed,
> first [query by the unique field](/🗄/Article/modules/queries.md#unique)
> to check whether it's already used.

The `string` field type may be marked as `unique: true` for the [Universal](/🗄/Article/models/types.md#universal)
model type only. Unique values are constrained/scoped to the nearest [container](/🗄/Article/models/containers.md).

The [`uid` field type](/🗄/Article/fields/basic.md#uid) is *always* unique (and retains previously used values).

Deleting a document will delete all associated unique values.

Within the directory "📦", and given a file name named `🌐Article.yaml`,
a "Universal" model named `Article` will be available to your scripts.

# Protected Fields {#protected}

Protected fields have values which are intended to be handled with more care and thought than regular fields.
Fields which may be protected are usually access tokens, identifiers, and other generated values.

A field may be marked as protected using `protected: true`

A protected field has the following properties:

- *Not* available for direct access in Mustache (but may be exposed via [suppliers](/🗄/Article/controllers/suppliers.md)).
- *Not* available for use in [forms](/🗄/Article/controllers/suppliers.md), including custom forms (their input may not come directly from a user).
- Available for direct access in server-side JavaScript, and exportable from [suppliers](/🗄/Article/controllers/suppliers.md) as usual.