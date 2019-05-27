---
title: Messages
summary: Learn about using the Messages object across requests.
---

Messages are a simple way to communicate a one-time notice, alert, or message.
They are intended for a single user/visitor to see on the very next page view (GET).
Messages may be more typically added during [redirects](/🗄/Article/scripting/helpers.md#redirect).
  
> {.alert .is-warning .is-small}
> 
> Messages are intended for information purposes only, 
> and should not contain sensitive or secure information.
> For example, do not include a user's name, email, etc.

# New Messages {#add}

The `Messages` object is always available and pre-imported.
There are 4 message levels and typical uses:

- `success` &dash; Expected action was taken / something occurred.
- `info` &dash; Default / neutral / informational notification.
- `error` &dash; Action not be taken, invalid input, or unexpected error.
- `warning` &dash; Softer error, that may not require further action by the user.

## Global Messages

```javascript
Messages.success('A new Article was created');
```

## Field Specific

Messages may be associated with a specific field name.
The field name must be interpreted client-side,
as it may represent a custom named form input field.

```javascript
Messages.fieldError('title', 'Titles may not contain special characters.');
```

# Mustache Rendering
    
For standard handling of form POSTs and message display,
you'll be emitting the messages via a Mustache template.

## Bootstrap CSS

The following example maps the message types to Bootstrap classes
and displays the messages as an "alert" class:

```html
<!--TEMPLATE mustache-->
{{% choose-string-map message error=alert-danger *=alert-* }}

{{#Messages.all}}
<div class="alert {{% choose-string message this.type }}">
  {{this.value}}
</div>
{{/Messages.all}}
```

## Bulma CSS

The following example maps the message types to Bulma classes
and displays the messages as a "notification" class:

```html
<!--TEMPLATE mustache-->
{{% choose-string-map message error=is-danger *=is-* }}

{{#Messages.all}}
<div class="notification {{% choose-string message this.type }}">
  {{this.value}}
</div>
{{/Messages.all}}
```

# API Rendering {#server}

If form handling is being done as an API call,
then it's still recommended to use the Messages object and API for
code readability and convenience.

In this case you'll want to emit the messages as JSON, immediately on the server-side,
rather than waiting until the next GET.

```javascript
import {Article} from '📦';
import {title} from 'form';

new Article().title(title);

Messages.success('Successfully created new Article');

if (title == 'great')
    Messages.fieldInfo('title', 'Great title for the Article!');

({messages: Messages.now()});
```

Calling `Messages.now()` will emit a JSON array.
It will also cause all messages to be flushed out so they are not visible on the next GET.
It is the responsibility of the client making the request to
interpret this array and display messages accordingly.

```javascript
{
  "messages":[
    {"type": "success", value: "Successfully created new Article"},
    {"type": "info", field: "title", value: "Great title for the Article!"}
  ]
}
```

## Throwing Messages

Messages may also be thrown as an error:

```javascript
throw Messages.fieldError('title', 'Not Good');
```

Results in client side JSON with HTTP status code 422:

```javascript
{
  "messages":[
    {"type": "error", "field": "title", "value": "Not Good"}
  ]
}
```

# Passing Data {#data}

Messages may also be used to pass arbitrary string data from one request to another.

Given a POST which sets data and redirects to `/`:

```javascript
Messages.data('thing', 'one');
Redirect.home();
```

For the very next GET only, the value of `thing` will be available:

```html
<!--TEMPLATE mustache-->
{{#Messages.data.thing}}
Hello thing: {{Messages.data.thing}}
{{/Messages.data.thing}}
```