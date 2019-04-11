---
title: User Roles
summary: Learn about user roles and permissions
---

Stacklane's role and permission system is designed 
to strike a balance between power and real world use.
The best permission system is the one you'll actually use.

Roles are defined (and redefined) in any 
[user settings file](/🗄/Article/users/settings.md).
Roles permissions are primarily centered around 
access to [models](/models/), since model usage
*broadly crosses all endpoints*.

# Default Role {#default}

The `default` role is a specially named role that is 
always defined and in effect for all users and visitors, 
whether authenticated or not.
All other roles that may be in effect are built on top of any 
permissions in effect for the `default` role.

If there is no root `/👤.yaml` file defined in the source,
then the `default` role is given full access to all resources.
This would be the case of a fully public site with 
no sensitive or user specific data.

Once a root `/👤.yaml` is added, then the `default` role's
access level becomes `none` if not otherwise redefined.  

Take care with the default role since permissions may only be granted, never revoked.
Although you may add to the default role's permissions in sub-directories,
another custom role may not reduce the permissions already in effect for the default role.

# Custom Roles {#custom}

Custom role names must start with an uppercase character and be valid identifiers.
We recommend using a singular form for role names &mdash; for example,
use the role name of `Owner` instead of the plural `Owners`.

## Role Association

Once you've defined custom roles, they are most typical meaningful when associated with a specific user.

Profiles are a type of model which associates custom data with a specific user,
and are the only location where role names may be associated with a user.

[Learn more about Profiles](/🗄/Article/users/profiles.md), including role examples.

> {.alert .is-warning .is-small}
>
> Changing role names may not be a safe operation if the role has been associated with a user.

# Permissions {#permissions}

All roles, including `default`, may define permission rules.
Permission rules define what is allowed for a role,
and are always granted, never revoked.
Most permission rules map to model data operations.

The general layout of a role and its permission rules 
is the role name, resource rule (corresponding to a model or field),
and one or more operations allowed (separated by commas).

```file-name
👤.yaml
```

```yaml
[ROLE_NAME]:
  [RESOURCE_RULE]: [OPERATIONS_ALLOWED]
```

## Operations

The following operations may be specified for any resource rule
Besides `all`, no operation implies another operation.

- `none` &mdash; Only applicable to root settings file roles.
- `all` &mdash; All operations allowed.
- `access` &mdash; May also refer to "select", "exists", "accessible", or "visible". Necessary for accessing linked/referenced models. 
- `read` &mdash; Read a value.  May also refer to "get", "load" if the operation requires knowing an ID.
- `create` &mdash; Create / new operation such as `new Task()`.
- `update` &mdash; Update / set a field value.
- `delete` &mdash; Removing / deleting a model.
- `state` &mdash; Special case of a field value `update`, representing a significant "change in state". This occurs only by nomenclature, for any field named "state", "status", "stage", or "lifecycle".
- `list` &mdash; List operations are "bulk" operations, and usually refer to queries that may return multiple results.

## Resource Rules

Resource rules for models follow the data structure, from general to specific.
The rule most specific to the requested resource will be used.

- `📦` &mdash; Package/module level rule.
- `📦.Product` &mdash; Model type specific rule.
- `📦.Product.title` &mdash; Field specific rule.
- `📦.Product.Description` &mdash; Embedded model specific rule.

```file-name
👤.yaml
```

```yaml
MyRole: 
  📦: read # read all models and fields
  📦.Product: update # read (from package/module) + update (added)
```

## Connector Rules

In addition to models, [Connectors](/🗄/Article/scripting/connectors.md)
also support permission rules. The resource of the connector rule
follows the file-based definition of the Connector's various endpoints.
GET's are a `read` operation, unless the endpoint is `list.yaml` and then it's a `list` operation.
DELETE's are `delete` operations. Endpoints ending with `create.yaml` are `create` operations.
Everything else is an `update`.

```file-name
👤.yaml
```

```yaml
default:
  stripe.com: read # read everything by default
  stripe.com.charges.list: list # allow for specific endpoint
```

# Sub-Directory Roles {#sub}

User settings files may be placed in [sub-directories](/🗄/Article/users/settings.md#sub).
This allows roles and permission to be scoped to a directory and its descendants.

Sub-directory settings files may *not* define new role names. 
They may only use role names already specified in the root `/👤.yaml`.
In this way the root file is a "master list" of role names.
If a role name is only relevant to a sub-directory, simply 
define it with `[ROLE_NAME]: none` in the root file, and then 
redefine it with actual permissions in the sub-directory settings file.

Role permissions defined in a sub-directory file are *additive*
to any earlier definitions of the same role name in ancestor directories.
Permissions are never revoked. In this way deeper sub-directories
are usually going from less permissive to more permissive 
(accumulating new role permissions as needed).

It's also not necessary to specify every role &mdash; only those 
roles which are being granted additional permissions in the sub-directory file. 

## Example

```file-name
/👤.yaml
```

```yaml
auth: none

MyRole: none
```

```file-name
/app/👤.yaml
```

```yaml
auth: required

MyRole:
  📦: read
  📦.Post: access,read,update
```

```file-name
/app/special/👤.yaml
```

```yaml
MyRole:
  📦.Post: create,delete
```

# Endpoint Access {#endpoint}

> {.alert .is-info .is-small}
>
> This is for special cases only and will not be needed for most endpoints.

JavaScript endpoints may be given a configuration file that corresponds to their file name.
This configuration file supports user related settings.
Assuming a POST endpoint named `/📮update.js`:

```file-name
/📮update.yaml
```

```yaml
👤:
  as: SomeRoleName
  only: OtherRoleName
```

The role names must already be defined, and typically
only one setting would be used at a time.

`as` causes the current JavaScript endpoint to "run as" the given role,
regardless of whether the current user is actually assigned to that role.

`only` causes the current JavaScript endpoint to only allow requests 
from users associated with the given role. If the user is not associated
with the role, then `403 FORBIDDEN` is returned.
Typically an app would hide this functionality as well, if the
role was not applicable to the user. Therefore `only` is
the last line of defense, not the first.

# Resolving {#resolving}

The following gives some insight into how roles and permissions are resolved.

Given the example of loading a specific
model instance `let prod = Product.get('[id]')`,
the platform will check for `read` on `📦.Product.id`.

As additional operations on the instance are performed,
such as `product.title = 'New Title'`,
the system will use all in-scope roles to determine `update` on `📦.Product.title`.

## In-Scope Roles

To determine whether a specific operation is possible,
the platform is considering a combination of permission
rules as follows:

- 👤.yaml `default` role.
- Roles assigned to the authenticated user (by way of user profiles)
- Roles assigned between authenticated user and the model's parent + ancestor [containers](/🗄/Article/models/containers.md) (by way of container user profiles).

As we are only concerned with granting permissions,
if multiple roles are in effect then the final effective role is a combination of all
assigned and in-scope roles.

It's also important to keep in mind the first step of the process.
For this process 👤.yaml is referring to the currently in-scope
settings file, which may be a sub-directory file.
In this way both revocation and super-user scenarios
are possible simply redefining roles for specific sub-directories.