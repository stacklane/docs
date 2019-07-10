---
title: Forms
summary: Learn about model validation and HTML forms.
beta: true
---

HTML forms are a natural fit for models.
Typically the input to a form ends up being transformed into model values.
Those values may be valid or invalid.
To handle user form input, continuations, and validation,
Stacklane provides a specialized model type.

# Form Type

All models have a corresponding Form type.
For example a `Product` model also has a `Product.Form`.
This may be thought of a singleton for the current user, request, and response.
The Form type of a model has all of the fields of a regular model.
The main difference is that it can exist in an *invalid* state.
The `get()` method of the Form type always returns an instance,
initializing as needed by reading form submission data, or an existing form instance.

```file-name
/product/add.html
```
```html
<!--TEMPLATE mustache-->
{{% import {Product} from '📦' }}

{{#Product.Form.get as form}}
  <form action="/product/create" method="POST">

  {{! Access Product.name field data }}
  {{#form.name}}
    <label for="{{path}}">{{label}}</label>
    {{#input as input}}
    <input id="{{path}}" name="{{path}}" value="{{value}}"
      class="input {{#invalid}}is-danger{{/invalid}}"
      {{{input.attributes}}}>
    {{/input}}
    {{#about}}<p>{{about}}</p>{{/about}}
    {{#invalid}}
      <p class="is-danger">{{message.value}}</p>
    {{/invalid}}
  {{/form.name}}

  </form>
{{/Product.Form.get}}
```

## Supported Fields

Forms support a subset of [field types](/🗄/Article/models/fields.md).
For other field types custom handling will be necessary, prior to calling the `fill(model)` method on the form.
The following field types are supported: `string`, `options`, `options[]`, `boolean`, `integer`, `double`, `markdown`

# Lifecycle

Forms are immutable once initialized &mdash;
for example, a given Form ID being passed in the `_form` parameter will never have field values which change over time.
This means that every form submission results in a new, unique Form ID.
Form data is only accessible from the same client, for a period of up to 4 hours.

## Manual Invalidation

If a given form's data should no longer be considered usable, then manually calling `remove()` on
the form instance will invalidate it.  This is not necessary for most flows.
Allow a few minutes for the invalidation to take effect.

# Labels

> {.alert .is-info .is-small}
>
> All labels are assumed to be in the language of the [Manifest locale](/🗄/Article/settings/manifest.md#locale).

When using models for forms, it's useful to define labels and descriptions for the field, which may then be used directly within HTML.

```file-name
/📦/🌐Product.yaml
```
```yaml
name:
  type: string
  label: Name
  placeholder: Product Name
  about: A great name for the product.
```

Even if not explicitly given, a default label is generated for every field using its name. "name" -> "Name", "myField" -> "My Field".

## Option Labels

When using the `options` field type, each option is given a default label.
To define a custom label for an option use the following format:

```yaml
status:
  type: options
  values:
    act: Active
    dis: Disabled
```

# Creating Models {#create}

New may be filled with form data using the `fill(model)` method.

```file-name
/product/📮create.js
```
```javascript
import {Product} from '📦';

let form = Product.Form.get();

try {

   let newProduct = new Product();

   form.fill(newProduct); // throws $ModelInvalid

   Redirect.dir('product').dir(newProduct.id);

} catch ($ModelInvalid){

   // Redisplay with form values, errors, etc:
   Redirect.dir('product')
           .name('create')
           .form(form);

}
```

# Updating Models {#update}

An existing model may also have a form representation,
which is useful for updating existing model instances.

```file-name
/product/{product}/update.html
```
```html
<!--TEMPLATE mustache-->
{{% import {Product} from '📦' }}
{{% import {product} from '🔗' }}

{{#Product.Form.get product}}
...
{{/Product.Form.get}}
```

```file-name
/product/{product}/📮update.js
```
```javascript
import {Product} from '📦';
import {product} from '🔗';

let form = Product.Form.get();

try {

   form.fill(product); // throws $ModelInvalid

   Redirect.dir('product')
           .dir(newProduct.id)
           .success('Updated!');

} catch ($ModelInvalid){

   // Redisplay with form values, errors, etc:
   Redirect.dir('product')
           .dir(newProduct.id)
           .name('update')
           .form(form);

}
```

# Partial Forms {#partial}

To create a partial form, which includes only a subset of fields,
define a supplier value with the ⏳ prefix:

```file-name
/📤/⏳ProductNamePriceForm.yaml
```
```yaml
📦.Product:
  - name
  - price
```

Now use the partial form type as you would any other form type.

## Creating

```html
<!--TEMPLATE mustache-->
{{% import {ProductNamePriceForm} from '📤' }}

{{#ProductNamePriceForm.get as form}}
...
{{/ProductNamePriceForm.get}}
```

## Updating

```html
<!--TEMPLATE mustache-->
{{% import {product} from '🔗' }}
{{% import {ProductNamePriceForm} from '📤' }}

{{#ProductNamePriceForm.get product as form}}
...
{{/ProductNamePriceForm.get}}
```

# Incremental Forms {#incremental}

[Partial Forms](#partial) allow collecting information across multiple pages.

As in the example above, assume the first page begins collecting
a Product's name and price using `ProductNamePriceForm`.

The submission of the first page is similar, however instead of creating a new Product
we're simply moving on to the next step.
Notice that in *both* redirects we are including the form instance.

```file-name
/product/📮start.js
```
```javascript
import {Product} from '📦';
import {ProductNamePriceForm} from '📤';

let form = ProductNamePriceForm.get();

try {

   form.validate();

   Redirect.dir('product')
           .name('finish') // last page
           .form(form);

} catch ($ModelInvalid){

   // Redisplay with form values, errors, etc:
   Redirect.dir('product')
           .name('start') // stay
           .form(form);

}
```

On the next/last step, include the original form ID as a query parameter:

```file-name
/product/finish.html
```
```html
{{^ProductNamePriceForm.exists}}
  <a href="/product/start.html">Start Over</a>
{{/ProductNamePriceForm.exists}}

{{#ProductNamePriceForm.exists}}
  {{#Product.Form.get as form}}
  <form
     action="/product/finish?_form={{ProductNamePriceForm.get.id}}"
     method="POST">
    {{! more fields }}
  </form>
  {{/Product.Form.get}}
{{/ProductNamePriceForm.exists}}
```

```file-name
/product/📮finish.js
```
```javascript
import {Product} from '📦';

// First reads the _form query param, THEN reads form submission:
let form = Product.Form.get();

// ... Remainder identical to normal creation
```

## Expired Forms

To handle the temporary nature of forms while collection incremental forms over a period of time,
there are two points where it's possible to check for a still viable form instance:

1. `exists` &mdash; Useful on incremental forms during GET.
2. During a POST/PUT, if a `_form` is passed for incremental form processing,
   but the form given in the parameter has expired, then any resulting call to `create` or `update`
   will result in a validation error.

# Nested Forms {#nested}

Nested forms occur for [embedded model types](/🗄/Article/models/types.md#embedded).
They are directly reachable via the `.value` property.
Unlike regular embedded model values, which may be optional and therefore null,
nested form values are *never* null.
This enables nested field access such as:

```html
<!--TEMPLATE mustache-->
{{% import {Product} from '📦' }}

{{#Product.Form.get as form}}
  <form action="/product/create" method="POST">

  {{! Access Product.description.summary field data }}
  {{#form.description.value.summary}}
     ...
  {{/form.description.value.summary}}

  </form>
{{/Product.Form.get}}
```

# Field Properties

Each form instance contains properties that reach the fields available on the form.
For example, `Product.Form.get().name` accesses the field information for `name`.
The following properties are available for each field:

## value

The current value of the field.
This value may be a [nested form](#nested).

## path

An underscore separated identifier for the field, beginning with the type's name.
Suitable for `id` and `name` HTML attributes, and _required_ on `name`
for proper interpretation of form input.

## required

true if field has been set to required.

## label

The field label text as defined in the model's definition.

## placeholder

The field placeholder text as defined in the model's definition.

## about

The field about text as defined in the model's definition.

## invalid

true if the current value is invalid.

## message

A message object associated with the field, with properties `.type` and `.value`.
Always defined if `invalid == true`.
These messages are intended to be seen by the user submitting the form,
and next to the field itself, for example: "Fill out this field".

## readable

true if the field is readable with the current user's permissions.

## updatable

true if the field is updatable with the current user's permissions.

## readOnly

Readable, but not updatable, with the current user's permissions.

# HTML Controls

Stacklane provides utilities for generating HTML forms.
For additional context check out the [forms example](https://github.com/stacklane-blueprints/forms).
The following properties are available for every field &mdash; they are mutually exclusive,
and a given control will not be defined twice for the same field.
Note that for all of the HTML utilities below, `id`, `name`, and `class` are never emitted.

## input

Defined for `string`, `integer`, and `double`.

Contains an `attributes` property which emits HTML attributes as needed for the field type:
type, value, required, placeholder, value, maxlength, minlength, max, min, pattern, readonly

When using `input.attributes` do not also define any above attributes, or duplicates/conflicts may occur.

## textarea

Defined for `markdown`.

Contains an `attributes` property which emits HTML attributes as needed for the field type:
required, placeholder, maxlength, minlength, readonly

When using `textarea.attributes` do not also define any above attributes, or duplicates/conflicts may occur.

## toggle

Defined for `boolean`.

Contains `on` and `off` properties, which are always defined.
The on/off objects each have the following properties: `value`, `label`, `selected`.

## selectOne

Defined for 'options'.

Contains an `options` property, which is a list of available options.
Each available option object has the following properties: `value`, `label`, `selected`.
0-1 option may be selected.

## selectMany

Defined for a list/array of 'options'.

Contains an `options` property, which is a list of available options.
Each available option object has the following properties: `value`, `label`, `selected`.
0+ options may be selected.