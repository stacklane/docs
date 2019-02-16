---
title: Build API
summary: Learn about using the build API to test sites from client-side IDEs. 
---

Stacklane provides a build API for syncing files, validating + building sites,
and generating shareable test domains.
To see this API in action view the source code for the
[WebStorm plugin](https://github.com/stacklane/ide-jetbrains).

# Auth

The build API supports a reasonable number of anonymous users per day.
To indicate anonymous authentication pass <code>Bearer anonymous</code>
in the <code>Authorization</code> header.
Only anonymous users are currently supported.

## Endpoint and Project IDs

All API verbs are performed at the following endpoint:

`https://api.execute.website/{ProjectId}`
 
`{ProjectId}` should be a GUID-like string
between 20 and 64 characters (a-z A-Z 0-9 - _).  This could be a
randomly generated value or SHA-256 hex value.
For anonymous users the client code should take care to produce
sufficiently unique values to prevent collisions.
Generally this would be a unique value produced at IDE startup.
To perform efficient `PATCH` operations (syncing),
this unique GUID-like value should not frequently change.

# GET

Produces a JSON response with the current contents of the <code>ProjectId</code>.
If the <code>ProjectId</code> does not exist the response status is <b>404</b>.

## JSON Response

```javascript
{
  "files":[
    { "path": "/🎛.yaml", "md5": "m1ChXoeAKCZirpWm3sbPAg==" }
  ]
}

# PUT

PUT completely replaces all files for the site.
It receives the request <code>Content-Type</code> of <code>application/zip</code>.
The body should contain the binary zip data.

PUT always creates a new <code>ProjectId</code> if one does not exist,
therefore unlike other verbs it will never return 404.
The response from a successful upload is the current contents as defined by <code>GET</code>.

# PATCH

Use PATCH for incremental syncing of an existing <code>ProjectId</code>.
When a <code>ProjectId</code> already exists this is the quickest way to generate a new test instance.
If the <code>ProjectId</code> does not exist the response status is <b>404</b>.
This would typically be transparent to the user &mdash;
for example, if GET returns 404, then automatically perform a PUT instead of trying a PATCH.
PATCH takes two forms depending on the request Content-Type.

## Add/Replace Files (application/zip)

Similar to PUT, but the zip should only contain the files to create or update.
No files will be deleted in this operation.
Use the <code>md5</code> from GET to determine what files need to be updated.

## Prune/Delete Files (application/json)

Use this operation if, based on the current contents (GET), it is determined that certain files should be deleted.
This operation informs the server what files to *keep / retain*.
Any other files not specified will be deleted.

```javascript
{
  "retain":[
    "/the/path/to/keep.js",
    "/other/index.html"
  ]
}

# POST

Use the POST operation on a previously uploaded/synced <code>ProjectId</code>.
This step performs the validation and build of the files, reports any errors,
and if successful returns a unique domain name for testing and sharing.

## Plain Text Response

Pass text/plain in the `Accept` header to receive simple
build messages, one per line.  In a successful build with no errors,
the final line will start with `https://` and contain the unique test domain for that build.

## Passing Credentials

The POST operation may optionally pass 
[development credentials](/🗄/Article/dev#credentials).
When passing the credential JSON file to the build process,
specify a <code>Content-Type</code> of <code>application/json</code> and
the JSON credentials file as the content/payload of the request.

