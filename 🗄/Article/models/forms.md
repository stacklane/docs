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

# Incremental Forms {#incremental}

[Partial forms](#partial) allow collecting information across multiple steps.

The following example defines two steps, `Begin` and `End`:

```file-name
/📤/⏳CreateProduct.yaml
```
```yaml
📦.Product:
  Begin:
    - name
  End:
    - price
```

Each subsequent step contains the fields from previous steps.
In this example the form for `End` actually contains `name` and `price`.

For the submission of the first step, we're validating and moving on to the next step.

```file-name
/product/📮begin.js
```
```javascript
import {Product} from '📦';
import {CreateProduct} from '📤';

try {

   let form = CreateProduct.Begin.read();

   Redirect.dir('product')
           .name('end') // last page
           .form(form);

} catch ($ModelInvalid){

   Redirect.dir('product')
           .name('begin') // stay
           .invalid($ModelInvalid);

}
```

On the next/last step, include the original form ID as a query parameter:

```file-name
/product/finish.html
```
```html
{{^CreateProduct.Begin.valid}}
  <a href="/product/begin">Start Over</a>
{{/CreateProduct.Begin.valid}}

{{#CreateProduct.Begin.valid}}
  {{#CreateProduct.End.view}}
    <form action="/product/end?_form={{id}}" method="POST">
      {{! more fields }}
    </form>
  {{/CreateProduct.End.view}}
{{/CreateProduct.Begin.valid}}
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

# Nested Forms {#nested}

Nested forms occur for [embedded model types](/🗄/Article/models/types.md#embedded).
They are directly reachable via the `.value` property.
Unlike regular embedded model values, which may be optional and therefore null,
nested form values are *never* null.
This enables nested field access such as:

```html
<!--TEMPLATE mustache-->
{{% import {Product} from '📦' }}

{{#Product.Form.view}}
  <form action="/product/create?_form={{id}}" method="POST">
    {{#description.value.summary}}
    ...
    {{/description.value.summary}}
  </form>
{{/Product.Form.view}}
```

# Form Type {#form-type}

The following top level methods are available for each form type:

### `view()`

Usable during GET. Returns an existing or new [form instance](#form-instance).
This method may be used directly in Mustache templates,
or its resulting form instance may be exported from a [supplier](/📤/Article/scripting/suppliers.md).
It optionally accepts an existing model as a parameter to initialize the view,
*or* it accepts an object literal / hash of field values to initialize the view.

### `get()`

Usable during non-GET. Reads any previous state, combined with incoming form data,
and returns a [form instance](#form-instance).

### `read()`

Identical to `get()` however it will throw `$ModelInvalid` if the read form is invalid.
Equivalent to calling `let form = FormType.get(); form.validate();`

### `submit(model)`

Fills a new or existing model with information in the form.
Throws `$ModelInvalid` if either the form or the filled model are invalid.
If an exception is thrown, then the model is rolled back.
Equivalent to calling `FormType.get().submit(model)`.
Keep in mind that the form itself must be valid,
**and** the resulting model must be valid &mdash;
for example, if there are other non-form fields which should be set on the
model, these should be set before calling `submit(model)`.

# Form Instance {#form-instance}

The following properties/methods are available for each form instance.
Form instances are returned for `view()`, `get()`, and `read()`

### `id`

Returns the unique identifier for the form.
This should be included the `_form` query param in URLs related to the form.

### `validate()`

Throws `$ModelInvalid` if the form instance is invalid.

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

# Generic Control

Using [HTML suppliers](/🗄/Article/scripting/suppliers.md), it's possible create a generic HTML control.
Here is an example for the Bulma CSS library, which accepts the field of a form instance as its input parameter.

```file-name
/📤/Field.html
```
```html
<!--TEMPLATE mustache-->
{{#updatable}}
<div class="field">
    {{^toggle}}<label class="label" for="{{path}}">{{label}}</label>{{/toggle}}
    <div class="control">
        {{#input as input}}
        <input id="{{path}}" name="{{path}}" value="{{value}}"
           class="input {{#invalid}}is-danger{{/invalid}}" {{{input.attributes}}}>
        {{/input}}
        {{#textarea as textarea}}
        <textarea id="{{path}}" name="{{path}}"
           class="textarea" {{{textarea.attributes}}}>{{value}}</textarea>
        {{/textarea}}
        {{#toggle as toggle}}
        <label class="checkbox" for="{{path}}">
            <input id="{{path}}" type="checkbox" name="{{path}}" value="{{toggle.on.value}}"
                   {{#toggle.on.selected}}checked{{/toggle.on.selected}}> {{toggle.on.label}}
        </label>
        {{/toggle}}
        {{#selectOne as select}}
        <div class="select {{#invalid}}is-danger{{/invalid}}">
            <select id="{{path}}" name="{{path}}" {{#required}}required{{/required}}>
            {{#select.options as option}}
            <option value="{{option.value}}" {{#option.selected}}selected{{/option.selected}}>
            {{option.label}}
            </option>
            {{/select.options}}
            </select>
        </div>
        {{/selectOne}}
        {{#selectMany as select}}
        {{#select.options as option}}
        <label class="checkbox" for="{{path}}_{{option.value}}">
            <input type="checkbox" value="{{option.value}}"
                   id="{{path}}_{{option.value}}" name="{{path}}"
                   {{#option.selected}}checked{{/option.selected}}>
            {{option.label}}
        </label>
        {{/select.options}}
        {{/selectMany}}
    </div>
    {{#about}}<p class="help">{{about}}</p>{{/about}}
    {{#invalid}}<p class="help is-danger">{{message.value}}</p>{{/invalid}}
</div>
{{/updatable}}
```
