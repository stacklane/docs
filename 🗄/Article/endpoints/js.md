---
title: JavaScript Endpoints

summary: Learn how to use JavaScript to create custom logic for your views and endpoints.
---

Stacklane uses a JavaScript subset for server-side logic.
This subset is designed for speed, security, and compile time validation.

In many cases JavaScript endpoints are used in conjunction with JavaScript
[Suppliers](/🗄/Article/scripting/suppliers.md).
Suppliers allow for code reuse between multiple endpoints, creating simpler endpoint code.

Scripts are executed on the server-side only, and their last emitted value
becomes the response value. Scripts never produce HTML, which is better suited
for [Mustache](/🗄/Article/endpoints/mustache.md) files.

# Routing

The file name is used to determine both the endpoint path and the HTTP verb it responds to.
There are several ways of defining JavaScript endpoints, and it's a matter of preference
which to choose.  There is no functional difference.
Note that in all cases JavaScript endpoints do not end in a trailing "/".

## Verb Name Only

Place an uppercase verb name in a directory.
`GET.js`, `POST.js`, `PUT.js`, `DELETE.js`.

For example `/hello/POST.js`
responds to requests for `POST /hello`.

Or for a [dynamic path](/🗄/Article/endpoints/dynamic.md) 
such as `/product/{product}/GET.js`, a
corresponding request could be `/product/1234`.

## Index / Directory

JavaScript endpoints by default do not respond to directory requests ending in "/".
In certain cases directory requests are useful however,
especially if the JS endpoint is redirecting to other endpoints.
In this case use `🖥index.js`, such as `/here/🖥index.js`
to have the endpoint respond at `GET /here/`.

## Emoji and Name

Verbs are represented by a specific an emoji prefix.

- 🖥 - GET
- 📮 - POST
- ❌ - DELETE

The rest of the name after verb prefix becomes the endpoint name.
For example a file name of
`/account/{account}/🖥settings.js`
responds to requests for `GET /account/1234/settings`.

# Redirects

## Internal Redirects

Output a string prefixed with "/"
to perform an absolute redirect to another endpoint within your app.
For more readable code and additional options, use the
[redirect builder](/🗄/Article/scripting/helpers.md#redirect) instead.
    
## External Redirects

Output a string prefixed with "http" to perform an external redirect.
   
## Rerouting

Similar to an internal redirect, but no extra client request is made.
A few conditions must exist for this to occur.

- It must be a POST/PUT/DELETE request.
- "X-Requested-With" header must exist and equal "XMLHttpRequest" (denoting an AJAX request).
- The script must emit an absolute path for the app, similar to a regular internal redirect.

Given a `POST.js` code called via AJAX and returning '/show/all', the server would
internally route and return the result of executing `GET /show/all`, **instead of**
requiring the client to round trip as it would with a normal internal redirect.

# JSON Output {#json}

Output an object literal from the script to create a JSON response.  For example:

```javascript
({
  hello: 'world'
});
```

Result:

```javascript
{
  "hello": "world"
}
```

Stream aware model methods may also be used:

```javascript
/* Code to assign LoadedList variable */

({
  list: LoadedList.name,
  tasks: LoadedList(()=>Task.all().map(t=>({name:t.title}}))
});
```

Result:

```javascript
{
  "list": "hello"
  "tasks": [{"name":"world"}]
}
```

# Configuration

Adding a file with the same name as the JavaScript endpoint, but with 
the extension `yaml` will create a configuration file specific to the endpoint.
For example, a configuration file for the POST "📮setup.js" would be "📮setup.yaml". 

## Users

Presuming [user functionality](/🗄/Article/settings/users.md) is enabled,
then the following configuration values are supported, any of which are optional:

```yaml
👤:
  as: SomeRoleName
  only: OtherRoleName
```

The role names must already be defined. 

`as` causes the current JavaScript endpoint to "run as" the given role,
regardless of whether the current user is actually assigned to that role.

`only` causes the current JavaScript endpoint to only allow requests 
from users associated with the role. If the user is not associated
with the role, then `403 FORBIDDEN` is returned.