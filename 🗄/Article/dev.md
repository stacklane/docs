---
title: Development
---
 
Stacklane doesn't require any special UI setup to start coding &mdash; everything
needed to run a Stacklane site is in standard file formats,
hosted in a BitBucket or GitHub GIT repository.
For ease of testing, we recommend using WebStorm and its Stacklane plugin.
 
# Repositories

A repository URL is only needed for live deployment and testing from within the Stacklane management console UI.
However we recommend creating and developing with a repository from the beginning.
BitBucket and GitHub are supported GIT repository types.

## Public

For public repositories,
ensure that the repository is set to be publicly accessible.
Then use the HTTPS GIT URL given in the BitBucket and GitHub UIs.
        
`https://bitbucket.org/[group]/[repo].git`\
`https://github.com/[group]/[repo].git`

## Private

For private repository deployment,
Stacklane will be accessing a read-only version of your repository using SSH keys generated and securely hosted by Stacklane.
When providing the GIT URL in the Stacklane Console, *or* [nested source](/🗄/Article/settings/nested.md),
use the SSH form given in the BitBucket and GitHub UIs.
        
`git@bitbucket.org:[group]/[repo].git`\
`git@github.com:[group]/[repo].git`

Stacklane supports both a one-to-one and one-to-many model of SSH keys per repository.
For the one-to-many model on GitHub you'll need to follow their
"<a target="_blank" href="https://developer.github.com/v3/guides/managing-deploy-keys/#machine-users">machine user</a>" pattern.

## Branches and Tags

[Nested](/🗄/Article/settings/nested.md) sites require specifying URLs in their configuration.
In this case it's also possible to reference a specific [tag or branch](/🗄/Article/settings/nested.md#source).

# IDE Plugins

## WebStorm

[WebStorm](https://www.jetbrains.com/webstorm/download/) 
natively supports all Stacklane file formats, including GIT integration.
Get the [Stacklane plugin](https://plugins.jetbrains.com/plugin/10313-stacklane) 
for WebStorm for easy testing.

> {.alert .is-info .is-small}
>
> Check out the [Build API](/🗄/Article/api/build.md) to learn about developing new IDE plugins.
 
# Credentials

For certain functionality such as [connectors](/🗄/Article/api/connectors.md) to third party APIs,
you'll need to define credentials with your local build.
Defining credentials is done with a JSON file that is specified in an IDE-specific way.

## Basic Format
    
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

## Dev Token

A more robust technique is to use a "Development Token" generated from the Stacklane Console.
A development token is an identifier that may be used for local development and IDEs only.
This allows all keys, including development/testing keys, to be managed and securely stored entirely
within Stacklane's platform and never distributed.

```javascript
{
  "🔑":"[dev-token]"
}
```

Development tokens are especially necessary if nesting private SSH repositories, 
since those repositories will be secured by SSH keys stored within Stacklane.