---
title: Connectors
summary: Learn about defining and using Connectors.
---

Connectors provide a secure and type-safe way to access third party REST APIs.
Defining a connector requires only a simple file/folder layout that closely
maps to the third party's REST structure.
Each connector uses a dedicated GIT repository.

Before defining a new connector, double check that one doesn't already exist in our
<a href="https://github.com/stacklane-registry/">registry</a>.
If you develop a new connector, get in touch &mdash; we'd love to consider including
it in the public registry.

# Manifest

In the root directory, define a manifest file: `/🎛.yaml`

```file-name
/🎛.yaml
```
```yaml
name: stripe.com

type: connector
```

## name

The domain name the connector is for.

## type

Must be the string `connector`.

# REST APIs

The definition of a connector involves mapping
folders/files to third party REST endpoints.

## Manifest

```file-name
/🎛.yaml
```
```yaml
name: stripe.com

type: connector

rest-api:
  prefix: https://api.stripe.com/v1
  docs: https://stripe.com/docs/api
  token: Bearer
  payload: form
  accept: application/json
```

## prefix

The `prefix` will be prepended to all endpoint paths for this connector.

## token

The name of the token expected in the `Authorization` header.

## payload

Either `json` or `form`,
to indicate how request content should be encoded and passed to non-GET endpoints.

## accept

The `Accept` header expected by the third party API.

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

# Tags

Connectors may predefine one or more `<link>` and `<script>` tags.
These specialized third party tags may then be used directly in [Mustache](/🗄/Article/endpoints/mustache.md).
The main advantage to using connector tags is their ability to set a [Content Security Policy](/🗄/Article/security.md#csp).
All tag definitions must be placed in the directory named `/<>/`.

## Example

```file-name
/<>/v3.yaml
```
```yaml
script:
  src: https://js.stripe.com/v3/
  #integrity: # not supported by stripe.com
  async: optional

csp:
  script-src: https://js.stripe.com/v3/
  frame-src: https://js.stripe.com
  connect-src: # Multiple using list format
    - https://api.stripe.com
```

## Usage

After importing the connector, the tag may be used directly in a Mustache file:

```html
<stripe.com-v3 defer/>
```

# Importing

Connectors must be imported into the project that will use it.
Define a root file named `/🔌.yaml`
Within this file specify each imported connector's GIT source
(branch/tag is optional):

```file-name
/🔌.yaml
```
```yaml
- https://github.com/stacklane-registry/site24x7.com.git#branch
- https://github.com/stacklane-registry/stripe.com.git#!tag
```

# Credentials

Many third party REST APIs require an authorization token.
To pass the authorization token during development builds,
see the [development credentials](/🗄/Article/dev.md#credentials) JSON format.

The credential key for a connector is `api:[connector-root-domain]`,
where `[connector-root-domain]` is the name of the rest API's root domain.
For example, a connector to `api.abc.com` would have the credential key of `api:abc.com`.