---
title: Connectors
summary: Learn about importing and using Stacklane Connectors
---

Connectors provide a secure and type-safe way to access third party REST APIs,
as well as define Content Security Policies for third party client-side libraries.

# Registry

Stacklane maintains a registry of Connectors. [View the listing](/integrations#connectors).

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

# Tags

Connectors may predefine one or more `<link>` and `<script>` tags,
which may be thought of as a client-side connection.
These specialized third party tags are used directly in [Mustache](/🗄/Article/endpoints/mustache.md).
The main advantage to using connector tags is their ability to set a Content Security Policy.

## Usage

After importing the connector, the tag may be used directly in a Mustache file:

```html
<stripe.com-v3 defer/>
```

# Credentials

Many third party REST APIs require an authorization token.
To pass the authorization token during development builds,
see the [development credentials](/🗄/Article/dev/credentials.md) JSON format.

The credential key for a connector is `api:[connector-root-domain]`,
where `[connector-root-domain]` is the name of the rest API's root domain.
For example, a connector to `api.abc.com` would have the credential key of `api:abc.com`.

# Permissions

For production deployment, the repository `/owner/` must match the owner of the source which is importing connector.

The pre-approved owner `/stacklane-registry/` is also permitted.

# Development

This documentation covers Connector usage.
For information on development see ["Developing Connectors"](/🗄/Article/api/connectors.md).