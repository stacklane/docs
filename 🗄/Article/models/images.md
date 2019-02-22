---
title: Image Field Type
summary:  Learn about uploading and displaying images.
---

# Overview

The `image` field type stores a single image. Supported image types are JPG, GIF, PNG.
Because non-expert users may be using your site/app, the system supports image uploads of up to 10MB.
However all images will be re-sized to be no more than 2000px wide (with a proportional height).

# Display

Images are served out of an optimized, secure, and "generic" domain name
which is independent from the domain your site is hosted on.
The image URLs are not designed to be user friendly or directly shared.
Image URLs should always be embedded in HTML, even if it's a simple
shareable "wrapper".

Using a Mustache template, simply embed the URL:

```html
<img src="{{Post.image.url}}" width="1000">
```

# Friendly URLs {#sharing}
     
Image URLs alone are not designed to be user friendly.
The are long, located on a generic domain, may expire, and contain unique identifiers.
For these reasons, if you need to share a friendly image URL we do not
recommend giving out image URLs directly.

## Using a Dedicated HTML Page

Instead of giving out an image that displays an image directly,
we recommend "wrapping" it in an HTML endpoint.
This gives you more flexibility in the future for what is
displayed "around" the image, provides analytics opportunities, etc.

# Access Control {#access}

By default all images are served using a temporary private URL.
These private URLs are only served over HTTPS and expire in 1 hour.
This ensures that images follow the same access controls as the model's field it is associated with.
For example, if you're serving images from within a private membership area,
then the temporary image URLs will not live past a typical login session.

If you know that images will primarily be used from publicly accessible pages,
such as within the posts of a public CMS, then there is a per-field optimization
to use public URLs:

```yaml
coverImage:
  type: image
  public: true
```

This public setting causes the image URL to be non-expiring,
and uses a "public" Cache-Control header with a much longer "max-age".

If you start out with a private image field (the default) and then sometime later
add `public: true`, then this setting will only take effect for newly uploaded images
from that point forward. The opposite is true if going from public to private.

# Uploading

Uploading images from the browser to a model field is done in three overall steps.
It's important to think of uploading images as _independent_ from
updating a model's data. Images previously uploaded
are not "committed" unless they are associated with a model's field (described below).

**Step 1**:

Obtain a one-time-use URL that will be the destination of the PUT.
This is typically done with XHR that accesses a simple JavaScript endpoint such as:

```javascript
import {Post} from '📦';
import {name} from 'form';

if (!Post.image.isValidFileName(name)) throw 'InvalidImageFileName';
let newUrl = Post.image.newPutUrl(name);

({url: newUrl});
```

**Step 2**:

Use XHR to PUT the file data to the one-time-use URL retrieved in the first step.
This can be complex on the client side, and we recommend taking a look
at our <a href="https://github.com/stacklane-examples/images" target="_blank">example</a>.
The browser's file input accept attribute should be:
`.png, .jpg, .gif, image/png, image/jpeg, image/gif`
Specifying both extensions and mime types is recommended by the spec.

**Step 3**:

After a successful upload in step two,
the one-time-use URL obtained from the first step is used for the model's
field data:

```javascript
import {Post} from '📦';
import {image} from 'form';

let post = new Post().image(image);

({id: post.id});
```

It's important to note that on the third and final step,
there is no need to send multipart/form-data, or it
should be stripped out before the third step.
The image's binary data was already sent in Step 2.
(Our <a href="https://github.com/stacklane-examples/images" target="_blank">example</a>
 takes care of that for you).

## Working Example

The steps above are relatively boilerplate, especially step two.
We've put together a full <a href="https://github.com/stacklane-examples/images" target="_blank">example</a>
that we recommend looking at.
This examples includes a StimulusJS widget, that with a few modifications
could be useful in any project.