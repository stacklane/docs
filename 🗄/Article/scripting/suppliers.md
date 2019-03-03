---
title: Suppliers
summary:  Learn about sharing and reusing values across multiple scripts and views.
---

Suppliers are scripts which export one or more named values, for the sole purpose of
having those values imported by another script -- either by another supplier,
a [JS endpoint](/🗄/Article/endpoints/js.md), or a 
[Mustache endpoint](/🗄/Article/endpoints/mustache.md).
Suppliers allow for reusing values and functions.
All values exported by suppliers exist in the module '📤'.

A general best practice is to keep supplier scripts small and purpose specific.
If you're exporting more than a few values out of a single supplier script,
then it's likely worth breaking it out into multiple supplier scripts.
Keeping supplier scripts small and purpose specific will enhance
readability, performance, and maintainability.

> {.alert .alert-info .small}
>
> Suppliers aren't the only way to share values across many endpoints.
> [Dynamic path parameters](/🗄/Article/endpoints/dynamic.md) will
> provide model references to all suppliers and endpoints.

# Supplier Types

Choosing a supplier type depends on its purpose and allowed values.
Supplier .js files are placed into a sub-directory named '📤',
and any directory may have a supplier sub-directory.
Suppliers are only visible to the current directory where
the supplier directory is located, as well as descendant directories.
This allows scoping exported supplier values to only
those endpoints which need the values/functions.

## Request Supplier {#request}

`📤/AnyName.js`
Allowed exports: Primitives (String, Number, Boolean), Map/Object of Primitives,
a single instance of a [Model](/models/), or a [query](/🗄/Article/scripting/queries.md).

Only model read/query operations are allowed within the supplier.
However the endpoint finally using the supplied value may itself perform write operations
if allowed by the endpoint.

## Function Supplier {#function}
        
`📤/{}AnyName.js`.
Allowed exports: "Utility" functions only.  Function Suppliers
 have very limited functionality. They may not import anything (not even other suppliers).
Their primary purpose is to provide functions that perform _calculations or transformations_
on parameters.

# Export Scope {#export}

The path location of a supplier file influences the scope
of where its exported values are visible.
Only scripts in the same directory, _or_ descendant
directories, have access to the exported values of a supplier.

`/product/{product}/📤/GetLiveProduct.js`

```javascript
import {product} from '🔗';

let liveProduct = product.get();

export {liveProduct as LiveProduct};
```

In the above example `*/` is the resulting value exported.
It is imported from the module named '📤', for all scripts
inside `/product/{product}/*`, _and_ any descendant directories.
For example the Mustache file `/product/{product}/related/index.html`
would be able import the `LiveProduct` value.

# Importing Values {#import}

Regardless of where the supplier exists in the path hierarchy, and regardless of the supplier's file name,
all supplier values are located in the module named '📤'.  This creates a simple flat namespace for
importing named values.

```javascript
// Importing specific values:
import {Something, Other, That} from '📤';
```

# Endpoint Specific {#endpoint}

## Endpoint Specific Supplier
       
Because suppliers follow the hierarchical REST structure, they have varying levels of specificity for an endpoint.
The most specific supplier is one with the same name as the endpoint itself.
For example, an endpoint named `index.html`
may also have a supplier named `📤/index.js`.
As the most specific supplier, only `index.html` may access values exported by `📤index.js`
(however `index.html` may also access other in-scope suppliers).

## Pinned Supplier

An extension to an endpoint specific supplier is a "pinned" supplier.
Indicate a pinned supplier with the pin emoji, e.g. `📤/📌index.js`,
using the same file name as the target Mustache template.
Pinned suppliers may be used to hide _or_ re-expose broader/earlier supplied values.

This is especially useful where more strict separation of concerns
are desired, for example in the case of [Mustache endpoints](/🗄/Article/endpoints/mustache.md#soc).
The JavaScript developer may want to ensure that regardless of any suppliers along the REST path,
only very explicit / strictly supplied values are visible to the Mustache file.
