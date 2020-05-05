---
title: JavaScript
short: JavaScript
summary: Use JavaScript to create endpoints for handling interactions.
order: 10
uid: endpoints/js
---

JavaScript endpoints are designed for small, purpose specific, server/client interactions.
Stacklane uses a JavaScript subset designed for speed, security, and compile time validation.

# Routing

The file name is used to determine both the endpoint path and the HTTP verb it responds to.
There are several ways of defining JavaScript endpoints, and it's a matter of preference which to choose.

## Verb Name Only

Place an uppercase verb name in a directory.
`GET.js`, `POST.js`, `PUT.js`, `DELETE.js`.

For example `/hello/POST.js` responds to requests for `POST /hello`.

Or for a [dynamic path](/🗄/Article/views/dynamic.md) such as `/product/{product}/GET.js`,
a corresponding request could be `/product/1234`

## Emoji and Name

Verbs are represented by a specific emoji prefix.

- 🖥 - GET
- 📮 - POST
- ❌ - DELETE

The rest of the name after the prefix becomes the endpoint name.
For example a file name of `/account/{account}/🖥settings.js`
responds to requests for `GET /account/1234/settings`.

## Index / Directory

JavaScript endpoints by default do not respond to directory requests ending in "/".
In certain cases directory requests are useful, especially if the JS endpoint is redirecting to other endpoints.
In this case use `🖥index.js`, such as `/here/🖥index.js`, to have the endpoint respond at `GET /here/`.

# Responses {#response}

When a script is executed, it either has a resulting value (the last emitted value), or an exception is thrown.
Based on the resulting value or thrown value, the execution will either have been a success or failure.

## Success {#success}

Successes first commit any work done during script execution, and then render a client response.
A successful response is either a status 200 or status 302 redirect.

## Failure {#failure}

Failures always rollback any previous work.
Explicit throws and uncaught exceptions always result in a failure.
Also any [Redirect](#redirect) for [invalid forms](/🗄/Article/controllers/forms.md)
(even if not thrown) will be considered a failure.

## JSON {#json-response}

JSON may be output as a resulting value or thrown value.
This may be accomplished with an object literal and/or use of a `map` function.
For more information see [JSON Output](#json).

## HTML

Scripts never directly produce HTML -- instead [Redirect](#redirect)
to a [Mustache](/🗄/Article/views/mustache.md) endpoint.

## Redirects

Redirects may be used for success or failure.
For more information see [Redirect](#redirect).

# Redirects {#redirect}

The `Redirect` object is always available and does not require importing.
It may be used to build directory names, path names, query parameters, etc,
resulting in a full URL.

Redirects may represent either a success or failure response.
Thrown redirects are always failure.

The following examples illustrate available methods and their result.

```javascript
// Success:
Redirect.home(); // Result: /
Redirect.dir('accounts').dir(accountId); // Result: /accounts/1234/
Redirect.dir('accounts').dir(accountId).name('settings'); // Result: /accounts/1234/settings
Redirect.home().name('place').params({this:'that'});  // Result: /place?this=that
Redirect.index().name('other'); // If current request is /here/there, result: /here/other
Redirect.home().hash('123'); // Result /#123
Redirect.home().url.href; // Full URL including host

// Failure (stop execution and rollback):
throw Redirect.home();
Redirect.home().invalid($ModelInvalid); // Invalid form handling
```

## With Messages

As a convenience to using the [Messages](/🗄/Article/modules/messages.md) object directly,
messages may "go with" the redirect being built.
For example, after adding a new Article:

```javascript
import {Article} from '📦';

let article = new Article().title('New');

Redirect.dir('articles')
        .dir(article.id)
        .success('New Article successfully created');
```

## As JSON

Redirects may also be used as JSON values:

```javascript
({redirect: Redirect.home().success('Going Home')});
```

Resulting in:

```javascript
{"redirect": {"path":"/", "messages":[{"type":"success", "value": "Going Home"}]}
```

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
For example, a configuration file for the POST `📮setup.js` would be `📮setup.yaml` in the same directory.

The primary use of this file is to define 
[endpoint-specific role behavior](/🗄/Article/users/roles.md#endpoint).