---
title: Model References
short: References
summary: Learn about fields which embed or references other models.
order: 50
---

Learn about how models may reference, embed, and link to other models.

# Model Links {#model-links}

To link from one model to another, specify the model name for the field type:

```yaml
otherModel: TheOtherModelName
```

Fields of this type never return null or undefined.
Keep in mind that links may be "broken" if the target of the link was deleted.

For more information on methods and properties available see
[Model Link Scripting](/🗄/Article/modules/models.md#model-links).

For [contained models](/🗄/Article/models/containers.md),
there is no need to add a link from the contained model back to the container.
There is already a method provided for this
[back reference](/🗄/Article/models/containers.md#container-link) to the container.

# Embedded

This is the field type corresponding to a complex value defined by an [Embedded](/🗄/Article/models/types.md#embedded) model type.

For more information on defining an embedded field, [click here](/🗄/Article/models/definition.md).

# Model Lists

Multi-valued lists may be defined for either simple values or complex embedded models.
To denote a list, add brackets "[]" after the field name.
If requirements don't call for the maximum of 20 entries,
then provision less entries by specifying a number (less than 20) between the brackets.
Capped/rolling/LRU lists are also [supported](/🗄/Article/modules/models.md#rolling-lists).

Whether defined [globally or locally](/🗄/Article/models/definition.md),
embedded models can allow multiple values by adding "[]" after the field name:

```yaml
items[]:
  type:
    price: double

address[5]: Address
```

For more information, see [String List Scripting](/🗄/Article/modules/models.md#string-lists).
