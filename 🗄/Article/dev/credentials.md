---
title: Credentials
summary: Learn about using credentials during development
order: 30
---

For certain functionality such as [connectors](/🗄/Article/settings/connectors.md) to third party APIs,
you'll need to define credentials with your local build.
Credentials are defined with a JSON file, specified in an IDE-specific way.

# Format {#format}

```javascript
{
  "🔑":{
    "CREDENTIAL_NAME":{
      "KEY_NAME":"KEY_VALUE"
    }
  }
}
```

## Example

```javascript
{
  "🔑":{
    "api:site24x7.com":{
      "token":"[your-api-token]"
    }
  }
}
```

# Dev Tokens {#token}

A more robust technique is to use a "Development Token" generated from the Stacklane Console.
A development token is an identifier that may be used for local development and IDEs only.
This allows all keys, including development/testing keys, to be managed and securely stored entirely
within Stacklane's platform and never distributed.

```javascript
{
  "🔑":"[dev-token]"
}
```

Development tokens are especially necessary if nesting private SSH [repositories](/🗄/Article/dev/repositories.md),
since those repositories will be secured by SSH keys stored within Stacklane.