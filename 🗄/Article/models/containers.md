---
title: Containers
summary: Learn about designing models with containers in mind.
---

# Overview

Containers in Stacklane are an important modeling concept.
They create a strong one-to-many, or parent/child relationship.
A container may have many kinds of children, but a child may only have one kind of container/parent.
For example, List ▶ Note and List ▶ Task, but there would
never be another parent for "Task" besides "List".
The container (parent) is always a [Universal](/🗄/Article/models/types.md#universal) type.

# Back References {#container-link}

All contained models have a reference back to their container.
This method is the same name as the container model, but with a lower case first letter.
Given a container named `List` and contained model named `Task`,
the back reference method would be `task.list()`

# One Level Deep {#depth}

Containers may be one level deep -- one parent container may have any number of contained types,
however those child types may not themselves be containers.

Keep in mind that [model links](/🗄/Article/models/fields.md#model-links) are another way
to maintain model associations.

# Access Control {#access}

Containers are an important access control point.
Any roles specifically associated between a user and a container
will be in effect for the container *and* its descendants.

For more information see the document on [User Profiles](/🗄/Article/users/profiles.md).

# Unique Values {#unique}

If a model type within a container defines unique values, then those
unique values are local/specific to a given container.

For example, given Blog ▶ Post, where Post has a [UID](/🗄/Article/models/fields.md#uid) field named "slug".
If there are many Blog's, and many Posts within any given Blog, then two Posts may have the
same UID if they are in **separate** Blog's.
