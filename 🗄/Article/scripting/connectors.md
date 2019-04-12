---
title: Connectors
summary: Learn about defining and using Connectors, which wrap third party REST APIs.
---

Connectors provide a secure and type-safe way to access third party REST APIs.
Defining a connector requires only a simple file/folder layout that closely
maps to the third party's REST structure.
Each connector uses a dedicated GIT repository.

Before defining a new connector, double check that one doesn't already exist in our
<a href="https://github.com/stacklane-registry/">registry</a>.
If you develop a new connector, get in touch &dash; we'd love to consider including
it in the public registry.

# Manifest

In the root directory, define a manifest file: `/🎛.yaml`

## Example

```file-name
/🎛.yaml
```

```yaml
name: site24x7.com

type: rest-api

rest-api:
  prefix: https://www.site24x7.com/api
  docs: https://www.site24x7.com/help/api/
  token: Zoho-authtoken
  payload: json
  accept: application/json; version=2.0
```

## name

Typically the domain name the connector is for.
This name is used for <a href="#credentials">credential</a> keys,
and once in production use the name should never change.
Using the domain also ensures uniqueness.

## prefix

The `prefix` will be prepended to all endpoint paths
for this connector.

## token

The name of the token expected in the `Authorization` header.

## payload

Either `json` or `form`,
to indicate how request content should be encoded and passed to non-GET endpoints.

## accept

The `Accept` header expected by the third party API.

# Definitions

The definition of a connector involves mapping
folders/files to third party REST endpoints.

## Example

```file-name
/balance/history/{txn}/get.yaml
```

```yaml'
# No additional configuration needed
```

REST endpoint result:

`GET /balance/history/{txn}`

JavaScript use:

`balance.history('txn').get()`

## Post Example

```file-name
/customers/{customer}/update.yaml
```

```yaml
method: POST
```

REST endpoint result:

`POST /customers/{customer}`

JavaScript use:

`customers('customer').update({ payload });`

# Importing

Connectors must be imported into the project that will use it.
Define a file in the root named `/🔌.yaml`
Within this file specify each imported connector's GIT source
(branch is optional):

```file-name
/🔌.yaml
```

```yaml
- https://github.com/stacklane-registry/site24x7.com.git#branch
- https://github.com/stacklane-registry/stripe.com.git#!tag
```

# Credentials

Most third party APIs require an authorization token.
To pass the authorization token during development builds,
see the [development credentials](/🗄/Article/dev.md#credentials) JSON format.

The credential key for a connector is `api:[connector-domain]`,
where `[connector-domain]` is the name of the rest API's root domain.
For example, a connector to `api.abc.com` would have the credential key of `api:abc.com`.