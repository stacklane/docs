---
title: Build API
summary: Learn about using the build API to test sites from client-side IDEs. 
---

Stacklane provides a build API for syncing files, validating + building sites,
and generating shareable test domains.

# Auth

The build API supports a reasonable number of anonymous users per day.
To indicate anonymous authentication pass `Bearer anonymous`
in the `Authorization` header.
Only anonymous users are currently supported.

## Endpoint and Project IDs

All API verbs are performed at the following endpoint:

`https://api.execute.website/{ProjectId}`
 
`{ProjectId}` should be a GUID-like string
between 20 and 64 characters `(a-z A-Z 0-9 - _)`.
This could be a randomly generated value or SHA-256 hex value.
For anonymous users the client code should take care to produce
sufficiently unique values to prevent collisions.
Generally this would be a unique value produced at IDE startup.
To perform efficient `PATCH` operations (syncing),
this unique GUID-like value should not frequently change.

# GET

Produces a JSON response with the current contents of the `ProjectId`.
If the `ProjectId` does not exist the response status is **404**.

## JSON Response

```javascript
{
  "files":[
    { "path": "/🎛.yaml", "md5": "m1ChXoeAKCZirpWm3sbPAg==" }
  ]
}
```

# PUT

PUT completely replaces all files for the site.
It receives the request `Content-Type` of `application/zip`.
The body should contain the binary zip data.

PUT always creates a new `ProjectId` if one does not exist,
therefore unlike other verbs it will never return 404.
The response from a successful upload is the current contents as defined by `GET`.

# PATCH

Use PATCH for incremental syncing of an existing `ProjectId`.
When a `ProjectId` already exists this is the quickest way to generate a new test instance.
If the `ProjectId` does not exist the response status is **404**.
This would typically be transparent to the user --
for example, if GET returns 404, then automatically perform a PUT instead of trying a PATCH.
PATCH takes two forms depending on the request Content-Type.

## Add/Replace Files (application/zip)

Similar to PUT, but the zip should only contain the files to create or update.
No files will be deleted in this operation.
Use the `md5` from GET to determine what files need to be updated.

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
```

# POST

Use the POST operation on a previously uploaded/synced `ProjectId`.
This step performs the validation and build of the files, reports any errors,
and if successful returns a unique domain name for testing and sharing.

## Passing Credentials

The POST operation may optionally pass 
[development credentials](/🗄/Article/dev/credentials.md).
When passing the credential JSON file to the build process,
specify a `Content-Type` of `application/json` and
the JSON credentials file as the content/payload of the request.

## Plain Text Response

Pass `text/plain` in the `Accept` header to receive simple
build messages, one per line.  In a successful build with no errors,
the final line will start with `https://` and contain the unique test domain for that build.

## JSON Response

A more information rich option is to pass `application/json` in the `Accept` header.
This allows grouping of entries, and output of source code snippets which may have compilation errors.

The overall format of a JSON response is **one JSON document per newline**.

Every per-line JSON document will have a `type` property which may be one of:

- debug
- info
- warn
- error
- group-begin
- group-end
- result

In addition to `type`, nearly every entry will have a human readable `message` property.

Each entry may or may not belong to a group.
This is an example of an `error` occurring within a group:

```javascript
...
{"type":"group-begin", "group":{"name":"Endpoints","id":"grp-12"}}
{"type":"error", "file":"/GET.js", "group":{"name":"Endpoints","id":"grp-12"}, /*....*/ }
{"type":"group-end", "group":{"name":"Endpoints","id":"grp-12"}}
...
```

The final entry in a successful build will have a `type` of `result` and a `url` property:

```javascript
{"type":"result","url":"https://abc123.execute.website"}
```

Certain entries may contain a `file` property, especially for compilation errors.
The `file` property contains an absolute path to a file within the source code.
When this property is present, there are other optional pieces of information which may be included when available.
The following example has newlines added only for readability (newlines are never output within an entry):

```javascript
{
  "type":"error",
  "message":"Type Mismatch: expected (string=\"x\"), was number",
  "group":{"name":"Endpoints","id":"grp-12"}
  "file":"/GET.js",
  "line":{"end":8,"begin":8},
  "source":{"offset":5,"type":"js","value":"}\nlet v = 'x';\nv = 5;\n({});\n"}
}
```

Both `line` and `source` are optional. 
The `source.offset` refers to the starting point for the `source.value`.
Therefore in this example `source.value` starts on line 6, 
and includes lines 7, 8 (the line where the error is), 9, and 10.
