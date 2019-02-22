---
title: Error Handling
summary: Learn about views for handling expected and unexpected errors.
---

Error endpoints are Mustache view prefixed with "⚡️".
They support Mustache layouts, however beyond layouts they are very restricted.
For example you may not load data into a Mustache error view.

# Routing
        
Multiple error views may be defined.  The nearest error view to the endpoint causing the error
will be served.  For example, given an endpoint generating an error at
`/here/{there}/everywhere.js`,
the error view `/here/⚡️.html` will be served instead of the earlier error view at
`/⚡️.html`.
       
# Types

## Default / Catch-All

The default error view used when a more specific error view is not defined is called `⚡️.html`.

## Not Found

Naming the error view `⚡️NotFound.html` will cause this to be selected
over the default error view in cases that are "Not Found-Like".  This includes simple
missing endpoints, as well as uncaught cases where a loaded Model was not found.
