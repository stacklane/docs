---
title: Email Module
summary: Learn about setting up the email module.
---

The email module allows you to compose and send email using specific providers.
Pre-configured providers allow Stacklane to provide simpler configurations.
Contact us if you require a provider not already setup.

# Basic Use {#basic}

Once configured, the email module named "📧" is available to non-GET JavaScript endpoints.

There are two ways to send an email.  There is no functional difference between them.
In both cases the email will not be sent unless the endpoint completes without exception.

## new

Construct the new Email instance, then build the email.  Sending is implied.

```javascript
import {Email} from '📧';

new Email()
     .to('me@example.com')
     .subject('Hello')
     .text('World');
```

## send()

Use the factory method `to`, build the email, and then `send()`.

```javascript
import {Email} from '📧';

Email.to('me@example.com')
     .subject('Hello')
     .text('World')
     .send();
```

# Plain Text {#text}

For creating emails with longer plain text,
use a [Function Supplier](/🗄/Article/scripting/suppliers.md) combined with JavaScript template literals:

```file-name
/{account}/📤/{}BillingSetupEmailText.js
```
```javascript
let BillingSetupEmailText = (name)=>{

return `Dear ${name},

Thanks for setting up billing!`;

};

export {BillingSetupEmailText};
```

```file-name
/{account}/billing/POST.js
```
```javascript
import {Email} from '📧';
import {BillingSetupEmailText} from '📤';
import {account} from '🔗';
import * as Props from '🎨';

Email.to(account.billingEmail)
     .subject(Props.BillingSetupFinished())
     .text(BillingSetupEmailText(
       account.billingName
     ))
     .send();

Redirect.home().success(
  Props.BillingSetupFinished()
);
```

# Configuration

An email service provider must be configured with a username, password, and "from" address.
For sites configured in the Stacklane Console, the UI will guide the setup of these required fields.
For a [test environment](/🗄/Article/dev/credentials.md) such as WebStorm, you'll need to configure these directly:

```javascript
{
  "🔑":{
    "email:[PROVIDER_TYPE]":{
      "user":"username",
      "pass":"password",
      "from":"from@example.com"
    }
  }
}
```

- `"from"` -- May either be a simple email address, or it may contain a display name
using the RFC822 format: `"Example & Co." <from@example.com>`
- `[PROVIDER_TYPE]` -- Should be replaced with one of the supported provider types listed below.
For example the full key for Mailgun would be `email:mailgun`.

# Providers

For a list of available providers see [integrations](/integrations#email).
To configure a provider from a test environment make sure and use its `type`.
