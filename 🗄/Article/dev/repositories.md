---
title: Repositories
summary: Learn about support source code repositories.
---

A repository URL is only needed for live deployment and testing from within the Stacklane management console UI.
However we recommend creating and developing with a repository from the beginning.
BitBucket and GitHub are supported GIT repository types.

# Public

For public repositories,
ensure that the repository is set to be publicly accessible.
Then use the HTTPS GIT URL given in the BitBucket and GitHub UIs.

`https://bitbucket.org/[group]/[repo].git`\
`https://github.com/[group]/[repo].git`

# Private

For private repository deployment,
Stacklane will be accessing a read-only version of your repository using SSH keys generated and securely hosted by Stacklane.
When providing the GIT URL in the Stacklane Console, *or* [nested source](/🗄/Article/settings/nested.md),
use the SSH form given in the BitBucket and GitHub UIs.

`git@bitbucket.org:[group]/[repo].git`\
`git@github.com:[group]/[repo].git`

Stacklane supports both a one-to-one and one-to-many model of SSH keys per repository.
For the one-to-many model on GitHub you'll need to follow their
["machine user"](https://developer.github.com/v3/guides/managing-deploy-keys/#machine-users) pattern.

# Branches / Tags {#branches-tags}

For [nested sites](/🗄/Article/settings/nested.md)
and [connectors](/🗄/Article/settings/connectors.md),
a source GIT URL must be specified.

For the master branch:

`https://github.com/owner/project.git#branch`

To specify a specific branch:

`https://github.com/owner/project.git#branch`

To specify a tag (prefix with '!'):

`https://github.com/owner/project.git#!tag`

The `#branch` and `#!tag` postfixes also apply to private SSH GIT sources.