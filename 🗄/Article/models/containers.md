---
title: Containers
summary: Learn about designing models with containers in mind.
---

# Overview

Containers in Stacklane are an important modeling concept.
They creates a strong one-to-many,
or parent/child relationship.
A container may have many kinds of children,
but a child may only have one kind of container/parent.
For example, "Account/X" and "Account/Y", but there would
never be another parent for "X" besides "Account".
The container (parent) is always a 
[Universal](/🗄/Article/models/types.md#universal) type.

# Access Control

Containers are an important access control point.
Any roles specifically associated between a user and a container
will be in effect for the container *and* its descendants.

For more information see the document on [User Profiles](/🗄/Article/users/profiles.md).

# Behavior of Unique Values

If a model type within a container defines unique values, then those
unique values are local/specific to a given container.

For example, given Blog ▶ Post, where Post has a [UID](/🗄/Article/models/fields.md#uid) field named "slug".
If there are many Blog's, and many Posts within any given Blog, then two Posts may have
same UID if they are in **separate** Blog's.
