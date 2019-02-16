---
title: Development
---
 
Stacklane doesn't require any special UI setup to start coding -- everything
needed to run a Stacklane site is in standard file formats,
hosted in a BitBucket or GitHub GIT repository.
For ease of testing, we recommend using WebStorm and its Stacklane plugin.

<section>
 
# Repositories

A repository URL is only needed for live deployment and testing from within the Stacklane management console UI.
However we recommend creating and developing with a repository from the beginning.
BitBucket and GitHub are supported GIT repository types.

## Public

For public repositories,
ensure that the repository is set to be publicly accessible.
Then use the HTTPS GIT URL given in the BitBucket and GitHub UIs.
        
<code>https://bitbucket.org/[group]/[repo].git</code>
<code>https://github.com/[group]/[repo].git</code>

## Private

For private repository deployment,
Stacklane will be accessing a read-only version of your repository using
SSH keys generated and securely hosted by Stacklane.
When providing the GIT URL in the management console UI,
use the SSH form given in the BitBucket and GitHub UIs.
        
<code>git@bitbucket.org:[group]/[repo].git</code>
<code>git@github.com:[group]/[repo].git</code>

Stacklane supports both a one-to-one and one-to-many model of SSH keys per repository.
For the one-to-many model on GitHub you'll need to follow their
"<a target="_blank" href="https://developer.github.com/v3/guides/managing-deploy-keys/#machine-users">machine user</a>" pattern.

</section>

<section>
 
# IDE Plugins
   
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title"><img src="images/WebStormLogo.png" /> WebStorm</h4>
                        <h6 class="card-subtitle mb-2 text-muted">+ Stacklane Plugin</h6>
                        <p class="card-text">
                            WebStorm natively supports all
                            Stacklane file formats, including GIT integration.
                            Get the
                            <a target="_blank" href="https://plugins.jetbrains.com/plugin/10313-stacklane">Stacklane plugin</a>
                            for WebStorm for easy testing.
                        </p>
                    </div>
                    <div class="card-footer">
                        <a target="_blank" href="https://www.jetbrains.com/webstorm/download/"
                           class="btn btn-sm btn-primary">Download</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="alert alert-info small mt-4" role="alert">
            Check out the <a href="/api/">Build API</a> to learn about developing new IDE plugins.
        </div>
</section>

<section>
 
# Credentials

For certain functionality such as <a href="/scripting/connectors">connectors</a> to third party APIs,
you'll need to define credentials with your build.
Defining credentials is done with a JSON file that is specified in an IDE-specific way.

## Basic Format
    
```javascript
{
  "🔑":{
    "CREDENTIAL_NAME":{
      "KEY_NAME":"KEY_VALUE"
    }
  }
}
```

## Example

```javascript
{
  "🔑":{
    "api:site24x7.com":{
      "token":"[your-api-token]"
    }
  }
}
```

</section>
