---
title: Image Fields
summary: Learn about uploading and displaying images.
---

The `image` field type stores a single image. Supported image types are JPG, GIF, PNG.
Because non-expert users may be using the site/app, the platform supports image uploads of up to 10MB.

# Display

Images are served out of an optimized, secure, and "generic" domain name
which is independent from the domain a site is hosted on.
The image URLs are not designed to be user friendly or directly shared.
Image URLs should always be embedded in HTML, even if it's a simple shareable "wrapper".

Using a Mustache template, a triple bracket expression will render an appropriate `<img>` tag, for example:

```html
{{{post.image}}}
```

Depending on the processing state of the image, the resulting value may
or may not have width/height attributes.

# Lifecycle

From initial upload to final storage, images pass through two phases. 
For typical development these phases will be transparent to the client code.

## Preprocess
 
This is the image state immediately after it's transferred/uploaded.
It is the raw image received from the client.
Prior to processing, images displayed while in this phase will still be in their original state.

## Processing

After committed, an image moves to the processing phase.
During this phase the image will still display in its original raw state.
Processing includes rescaling, EXIF orientation correction, [safety scanning](#unsafe),
and removal of potentially identifiable EXIF data (GPS location, etc).

## Postprocess

The image has been processed and is now in its final stored state.

# Rescaling

Non-expert users may upload full resolution / raw images which are too large for general web display.
These may be rescaled or cropped client-side.
Otherwise Stacklane will automatically rescale images during the processing phase.

- Image longest side > 1000px, proportionally rescaled to 1000px.
- Image longest side <= 1000px wide remain unscaled.
- JPG images will use progressive rendering.
- PNG images will use progressive rendering.
- PNG images exceeding 500K bytes after rescaling are converted to JPG.
- Resulting image size must be less than 500K bytes.

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

**CSP**:

On the page containing the upload form controls, ensure that the following is specified anywhere:

```html
<link itemprop="content-security-policy" data-img-upload="true">
```

This ensures the proper Content Security Policy is active for the HTML endpoint performing the uploads.

**Step 1**:

Obtain a one-time-use URL that will be the destination of the PUT.
This is typically done with an XHR/fetch that accesses a simple JavaScript endpoint such as:

```javascript
import {Post} from '📦';
import {name, width, height} from 'form';

if (!Post.image.isValidFileName(name)) throw 'InvalidImageFileName';
let newUrl = Post.image.newPutUrl(name, width, height);

({url: newUrl});
```

Passing in `width` and `height` from the client side is recommended,
and involves obtaining the `naturalWidth` and `naturalHeight` of the image.

**Step 2**:

Use XHR to PUT the file data to the one-time-use URL retrieved in the first step.
This can be complex on the client side, and we recommend taking a look
at our [example](https://github.com/stacklane-blueprints/images).
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
(Our [example](https://github.com/stacklane-blueprints/images) takes care of that for you).

## Working Example

The steps above are relatively boilerplate, especially step two.
We've put together a full [example](https://github.com/stacklane-blueprints/images)
that we recommend looking at.
This examples includes a StimulusJS widget, that with a few modifications
could be useful in any project.

# Unsafe Content {#unsafe}

A challenge with user-uploaded content is that it may literally be anything.
While most users are well-behaved, it only takes a single user to throw off a community.
Unsafe content detection will consider images which appear to be adult, racy, or violent.

Stacklane automatically applies safety detection to uploaded images.
This occurs during the processing phase --
an image where `processed==true` has already had safety detection applied.

If an image appears to be unsafe, then the image will be blurred, and the `unsafe` property will return true.
When using the default `<img>` HTML generation via triple brackets `{{{post.image}}}`,
the generated `<img>` tag will contain the attribute `data-unsafe="true"`.
Using an attribute selector it's possible to apply additional formatting beyond the default blurring.

# Utilities

An image value has several helpful utility fields:

## `processed`

`true` if the uploaded image has been analyzed and resized.

## `width`

If available, then returns the width of the image, otherwise null.

## `height`

If available, then returns the height of the image, otherwise null.

## `square`, `horizontal`, `vertical`

If width/height are available, then returns true/false if image width == height,
width > height, and width < height respectively.

## `ratio`

If width/height are available, then returns the ratio of the image such as `16:9`.
Variations of this field are `ratioBy` which returns as `2by3`, and `ratioX` which returns as `1x1`.
The ratio (combined with a CSS class) can be useful in displaying responsive images.
If the image's dimensions are unusual, then the ratio may be null.

## `ratioX`

Variation of ratio which returns values separated with 'x' such as `1x1`.

## `ratioBy`

Variation of ratio which returns values separated with 'by' such as `2by3`.

## `unsafe`

`true` if the uploaded image has been processed and determined to be unsafe.