---
title: User Login
summary: Learn about the steps to build a login area.
---

Login / signup areas are created within a specific directory 
of the site named `/auth/`.  Users trying to access an
`auth: required` area will be redirected to this directory.

# Common Layout

The following is a typical layout for a private site with a login area.

```file-name
Private Site
```

```file-list
/index.html 
/👤.yaml 
  auth: required
```

```file-name
Auth Area
```

```file-list
/auth/index.html
/auth/👤.yaml
  auth: optional
```

Note that the `/auth/` directory is within the private site.

A variation of this layout applies to [nested sites](/🗄/Article/settings/nested.md).
The private site may be nested at a sub-path of a public site:

```file-name
Public Site
```

```file-list
/index.html
/👤.yaml
  auth: optional
/🔌app.yaml
  source: [source-to-private-site]
  namespace: application
```

In this case the private site and auth area will be accessible from
`/app/` and `/app/auth/` respectively.

# Login Widget

Building a login widget that lists providers is relatively simple.
All configured login providers for the site are accessible from the `Providers` object.
These providers may vary from test environment to the production environment.
`{{provider.brand}}` is well-defined identifier such as `github` or `google`,
suitable for targeting with CSS.

```html
<!--TEMPLATE mustache-->
...

{{% import {Me, Providers} from '👤' }} 

...
<div class="provider-list">
    {{! Login }}
    {{^Me.linked}}
    {{#Providers.all as provider}}
    <form id="{{provider.type}}" method="post" class="provider-form" action="{{provider.authPath}}">
    <button type="submit" class="provider-button provider-{{provider.brand}}">
        <div class="provider-icon">{{! CSS target }}</div>
        <div class="provider-text">{{🎨.login-with provider.name}}</div>
    </button>
    </form>
    {{/Providers.all}}
    {{/Me.linked}}

    {{! Logout }}
    {{#Me.linked}}
    <form method="post" class="provider-form" action="/__/auth/provider/logout">
        <button type="submit" class="provider-button provider-logout">
            <div class="provider-icon">{{! CSS target }}</div>
            <div class="provider-text">{{🎨.logout}}</div>
        </button>
    </form>
    {{/Me.linked}}
</div>
```

# Previous Logins

Previously successful logins may be recognized using `localStorage` and the key `/auth/provider`.
The following adds an `is-recognized` class to the `body` if a previous login has occurred.
This class could be used to show a "Welcome Back!" button for example.
 
```javascript
document.addEventListener('DOMContentLoaded', ()=>{
    var prevSuccessId = localStorage.getItem('/auth/provider');

    if (prevSuccessId) document.body.classList.add('is-recognized');
});
```

The key `/auth/provider` contains the unique type of the user provider they last logged in with.
This value can be used to indicate to the user on the UI what they last logged in with.

```javascript
document.addEventListener('DOMContentLoaded', ()=>{
    var prevSuccessId = localStorage.getItem('/auth/provider');
    
    if (prevSuccessId){
        var e = document.getElementById(prevSuccessId);
        if (e != null) e.classList.add('provider-previous');
    }
});
```

In this example assume that `prevSuccessId` is `google`.
It finds the element having `id="google"`, and applies the
class `provider-previous` to indicate to the CSS that the last login was done
using `google`.  

# Providers

The following providers are currently available:

## Google

provider.name: `Google`\
provider.type: `google`\
provider.brand: `google`

## GitHub

provider.name: `GitHub`\
provider.type: `github`\
provider.brand: `github`

