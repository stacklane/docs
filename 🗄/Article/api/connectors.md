---
title: Developing Connectors
summary: Learn about developing Stacklane Connectors.
---

Connectors provide a secure and type-safe way to access third party REST APIs.
Defining a connector requires only a simple file/folder layout that closely
maps to the third party's REST structure.
Each connector uses a dedicated GIT repository.

Before defining a new connector, double check that one doesn't already exist in our
[registry](https://github.com/stacklane-registry/).
If you develop a new connector, get in touch -- we'd love to consider including
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

# Tags

Connectors may predefine one or more `<link>` and `<script>` tags,
which may be thought of as a client-side connection.
These specialized third party tags are used directly in [Mustache](/🗄/Article/endpoints/mustache.md).
The main advantage to using connector tags is their ability to set a Content Security Policy.
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
  payload: form
  accept: application/json
```

### `prefix`

The `prefix` will be prepended to all endpoint paths for this connector.

### `payload`

Either `json` or `form`,
to indicate how request content should be encoded and passed to non-GET endpoints.

### `accept`

The `Accept` header expected by the third party API.

# REST Authentication

The following types of authentication are supported:

## Static Token

```file-name
/🎛.yaml
```
```yaml
# ...
rest-api:
  # ...
  auth:
    mode: static
    token-name: Bearer
```

### `token-name`

Defines the prefix for the static token in the "Authorization" header.
For example: `Authorization: Bearer [static-token]`.
The static token value is defined with the connector credentials.
Defaults to "Bearer".

## OAuth2 Token

For server-to-server OAuth2 based authentication, the third party API needs to
support a "refresh token" which never expires.  Stacklane will use the
non-expiring refresh token defined in the connector credentials to obtain temporary access tokens.

```file-name
/🎛.yaml
```
```yaml
# ...
rest-api:
  # ...
  auth:
    mode: oauth2
    token-name: Zoho-oauthtoken
    refresh-url: https://accounts.zoho.com/oauth/v2/token
    scheme: request-body
```

### `token-name`

Defines the prefix for the token in the "Authorization" header.
Defaults to "Bearer".

### `refresh-url`

The URL for generating new access tokens from the refresh token.

### `scheme`

The method for passing credentials when refreshing an access token.
Defaults to "basic", but may be "request-body".

# REST API Layout

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