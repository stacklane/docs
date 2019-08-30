---
title: Forms
summary: Learn about model validation and HTML forms.
beta: true
---

To handle user form input, incremental steps, and validation,
Stacklane provides a specialized model type.

# Overview

All models have a corresponding Form type.
For example a `Product` model also has a `Product.Form`.
This may be thought of a singleton for the current user, request, and response.

## Lifecycle

Forms are immutable once initialized &mdash;
for example, a given Form ID being passed in the `_form` parameter will never have field values which change over time.
This means that every form submission results in a new, unique Form ID.
Form data is only accessible from the same client, for a period of up to 4 hours.

## Labels

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

# Viewing Forms {#view}

```file-name
/product/add.html
```
```html
<!--TEMPLATE mustache-->
{{% import {Product} from '📦' }}

{{#Product.Form.view}}
  <form action="/product/create?_form={{id}}" method="POST">
  {{#name}}
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
  {{/name}}
  </form>
{{/Product.Form.view}}
```

# Creating Models {#create}

New models may be filled with form data using the `submit(model)` method.

```file-name
/product/📮create.js
```
```javascript
import {Product} from '📦';

try {

   let newProduct = new Product();

   // throws $ModelInvalid, and rolls back 'newProduct'
   Product.Form.submit(newProduct);

   Redirect.dir('product').dir(newProduct.id);

} catch ($ModelInvalid){

   // Redisplay with form values, errors, etc:
   Redirect.dir('product')
           .name('create')
           // May use exception for form():
           .invalid($ModelInvalid);

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

{{#Product.Form.view product}}
...
{{/Product.Form.view}}
```

```file-name
/product/{product}/📮update.js
```
```javascript
import {Product} from '📦';
import {product} from '🔗';

try {

   // throws $ModelInvalid:
   Product.Form.submit(product.get());

   Redirect.dir('product')
           .dir(product.id)
           .success('Updated!');

} catch ($ModelInvalid){

   // Redisplay with form values, errors, etc:
   Redirect.dir('product')
           .dir(product.id)
           .name('update')
           .invalid($ModelInvalid);

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

Now use the partial form type as you would any other form type,
by first importing it from the supplier module:

```javascript
import {ProductNamePriceForm} from '📤'
```

[Labels](#labels) may also be overridden per field:

```yaml
📦.Product:
  - name:
      label: Product Name
  - price
```

# Form Groups {#group}

In certain cases it's useful to unify several forms under a common identifier.
For example, a single HTML form may be collecting information for two different models.

```file-name
/📤/⏳SetupForm.yaml
```
```yaml
OneForm:
  📦.One:
    - fieldOne
TwoForm:
  📦.Two:
    - fieldTwo
```

```file-name
/product/setup.html
```
```html
{{#SetupForm.view}}
  <form action="/setup?_form={{id}}" method="POST">
    {{#OneForm}}
       {{#fieldOne}}
         <input id="{{path}}" name="{{path}}" value="{{value}}"
            {{{input.attributes}}}>
       {{/fieldOne}}
    {{/OneForm}}
    {{#TwoForm}}
       {{#fieldTwo}}
         <input id="{{path}}" name="{{path}}" value="{{value}}"
            {{{input.attributes}}}>
       {{/fieldTwo}}
    {{/TwoForm}}
    <input type="submit" value="Submit">
  </form>
{{/SetupForm.view}}
```

In the subsequent script receiving the form POST,
for user friendly rollback handling, be sure to construct models immediately
before their corresponding use in `submit`:

```file-name
/product/📮setup.js
```
```javascript
import {SetupForm} from '📤';

//...
let one = new One();
SetupForm.OneForm.submit(one);
let two = new Two();
SetupForm.TwoForm.submit(two);
//...
```

# Form Steps {#step}

Form steps are a type of form group.
They are useful for collecting information progressively, across multiple steps.
Each step is a distinct form which contains all fields from any previous step.

Form steps will always initialize their state from other steps already filled out.
It's not required that all steps be followed &mdash; as with other forms,
the only requirement is that all fields of the submitted form are valid.

The following example defines two steps, `Begin` and `End`:

```file-name
/📤/⏳CreateProduct.yaml
```
```yaml
Begin:
  📦.Product:
    - name
+End:
  - price
```

Each subsequent step contains the fields from previous steps.
In this example the form for `End` contains `name` and `price`.
The prefix '+' indicates that it adds fields to the previous step.

For the submission of the first step, we're validating and moving on to the next step.

```file-name
/product/📮begin.js
```
```javascript
import {Product} from '📦';
import {CreateProduct} from '📤';

try {

   let form = CreateProduct.Begin.validate();

   Redirect.dir('product')
           .name('end') // last page
           .form(form);

} catch ($ModelInvalid){

   Redirect.dir('product')
           .name('begin') // stay
           .invalid($ModelInvalid);

}
```

On the next (last) step, include the form ID as a query parameter and
check `ready` for the state of the previous step:

```file-name
/product/finish.html
```
```html
{{#CreateProduct.Begin.view}}

{{^ready}}
  <a href="/product/begin">Start Over</a>
{{/ready}}

{{#ready}}
  {{#CreateProduct.End.view}}
    <form action="/product/end?_form={{id}}" method="POST">
      {{! more fields }}
    </form>
  {{/CreateProduct.End.view}}
{{/ready}}

{{/CreateProduct.Begin.view}}
```

```file-name
/product/📮end.js
```
```javascript
import {Product} from '📦';
import {CreateProduct} from '📤';

try {

  let newProduct = new Product();

  CreateProduct.End.submit(newProduct);

} //...
```

# Form Type {#form-type}

The following top level methods are available for each form type:

### `view()`

Usable during GET. Returns a [form instance](#form-instance).
This method may be used directly in Mustache templates,
or its resulting form instance may be exported from a [supplier](/📤/Article/scripting/suppliers.md).
It optionally accepts an existing model as a parameter to initialize the view,
*or* it accepts an object literal / hash of field values to initialize the view.

### `validate()`

Throws `$ModelInvalid` if the read form is invalid.
Returns a [form instance](#form-instance).

### `submit(model)`

Fills a new or existing model with information in the form.
Throws `$ModelInvalid` if either the form or the filled model are invalid.
If an exception is thrown, then the model is rolled back.
Keep in mind that the form itself must be valid, **and** the resulting model must be valid &mdash;
for example, if there are other non-form fields which should be set on the
model, these should be set before calling `submit(model)`.

# Form Instance {#form-instance}

The following properties/methods are available for each form instance.

### `id`

Returns the unique identifier for the form.
This should be included the `_form` query param in URLs related to the form.

### `invalid()`

Returns `true` if the form instance is invalid.
Newly initialized form views (with no previous state) are *neither* valid or invalid.
In that case this will always return false.
May be used in Mustache templates.

### `ready()`

Returns `true` if the form instance came from a previous state and it is valid.
Primarily used for incremental form steps.
May be used in Mustache templates.

### `submit(model)`

Fills a new or existing model with information in the form.
Throws $ModelInvalid if either the form or the filled model are invalid.
If an exception is thrown, then the model is rolled back.

### [`fieldName`](#form-fields)

Each form instance contains a property for accessing each [field](#form-fields).

# Form Fields {#form-fields}

Each [form instance](#form-instance) contains properties which reach the fields available on the form.
For example, `Product.Form.view().name` accesses the field information for `name`.
The following properties are available for each field:

### `value`

The current value of the field.
This value may be a [nested form](#nested).

### `path`

An underscore separated identifier for the field, beginning with the type's name.
Suitable for `id` and `name` HTML attributes, and _required_ on `name`
for proper interpretation of form input.

### `required`

true if field has been set to required.

### `label`

The field label text as defined in the model's definition.

### `placeholder`

The field placeholder text as defined in the model's definition.

### `about`

The field about text as defined in the model's definition.

### `invalid`

true if the current value is invalid.

### `message`

A message object associated with the field, with properties `.type` and `.value`.
Always defined if `invalid == true`.
These messages are intended to be seen by the user submitting the form,
and next to the field itself, for example: "Fill out this field".

### `readable`

true if the field is readable with the current user's permissions.

### `updatable`

true if the field is updatable with the current user's permissions.

### `readOnly`

Readable, but not updatable, with the current user's permissions.

# HTML Controls

Stacklane provides utilities for generating HTML forms.
For additional context check out the [forms example](https://github.com/stacklane-blueprints/forms).
The following properties are available for every field &mdash; they are mutually exclusive,
and a given control will not be defined twice for the same field.
Note that for all of the HTML utilities below, `id`, `name`, and `class` are never emitted.

Using [HTML suppliers](/🗄/Article/scripting/suppliers.md),
it's possible create a generic HTML control which accepts the field of a form instance as its input parameter.
[Check out the example](/🗄/Article/models/form-control.md).

### `input`

Defined for `string`, `integer`, and `double`.

Contains an `attributes` property which emits HTML attributes as needed for the field type:
type, value, required, placeholder, value, maxlength, minlength, max, min, pattern, readonly

When using `input.attributes` do not also define any above attributes, or duplicates/conflicts may occur.

### `textarea`

Defined for `markdown`.

Contains an `attributes` property which emits HTML attributes as needed for the field type:
required, placeholder, maxlength, minlength, readonly

When using `textarea.attributes` do not also define any above attributes, or duplicates/conflicts may occur.

### `toggle`

Defined for `boolean`.

Contains `on` and `off` properties, which are always defined.
The on/off objects each have the following properties: `value`, `label`, `selected`.

### `selectOne`

Defined for `options`.

Contains an `options` property, which is a list of available options.
Each available option object has the following properties: `value`, `label`, `selected`.
0-1 option may be selected.

### `selectMany`

Defined for `options[]`.

Contains an `options` property, which is a list of available options.
Each available option object has the following properties: `value`, `label`, `selected`.
0+ options may be selected.
