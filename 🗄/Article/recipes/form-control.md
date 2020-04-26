---
title: Form Control
summary: Reusable form control example
---

Using [HTML suppliers](/🗄/Article/controllers/suppliers.md),
it's possible create a generic HTML control which accepts the field of a form instance as its input parameter.

The following example assumes use of the Bulma CSS library:

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
