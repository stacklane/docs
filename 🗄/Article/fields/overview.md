---
title: Field Overview
short: Overview
summary: Learn about available field types for your models.
order: -1000
---

# Default

Every non-embedded model type is pre-defined with a unique `id`, plus `created` and `modified` timestamp fields.
These are automatically managed.  All are available immediately after model creation, even prior to persisting.


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