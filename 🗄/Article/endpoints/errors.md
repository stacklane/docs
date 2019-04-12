---
title: Error Handling
summary: Learn about views for handling expected and unexpected errors.
---

Errors and exceptions may occur during JavaScript and Mustache execution.

If an error occurs while rendering a Mustache view, then the emoji '⚠️' is emitted visibly, 
and the rendering stops at that point. The system also emits debugging information within
an HTML comment block (invisible to the user). 

If an error occurs while executing a JavaScript endpoint, then Stacklane automatically
generates an error view.  

# Not Found {#404}

"Not Found" / 404 errors are special case of a more expected error.
These include missing endpoints, unresolvable dynamic paths,
and uncaught `$ModelNotFound` errors.

"Not Found" errors may be given a custom Mustache view anywhere in the hierarchy.
These views support Mustache layouts, however beyond layouts they are very restricted.
For example you may not load data into a Mustache error view.

## Routing
        
Multiple views may be defined.  The nearest error view to the endpoint causing the error
will be served.  For example, given an endpoint generating an error at
`/here/{there}/everywhere.js`,
the error view `/here/⚡️NotFound.html` will be served instead of the earlier error view at
`/⚡️NotFound.html`.
   