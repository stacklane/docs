---
title: Static Documents
short: Static
summary: Learn about defining static documents within source code.
order: 40
---

In certain cases *dynamic* model data is overkill, but model types and structured data are still warranted.
Static model documents allow placing model data directly within source code, effectively using the repository as storage.

# Definition

Static models are [defined similarly to dynamic models](/🗄/Article/models/types.md#definition).
However instead of placing definitions in the `/📦/` directory,
use the special directory `/🗄/` for these model definitions.

Model types for static model documents may either be
[Universal](/🗄/Article/models/types.md#universal) or [Content](/🗄/Article/models/types.md#content).

# Documents

Once the models are defined, the static documents themselves also go in the directory `/🗄/`,
within a sub-directory having the same name as the model definition.
There are two ways to define static documents, YAML and Markdown.

## YAML

YAML documents map directly to the already defined model.  

Example definition:

```file-name
/🗄/Example.yaml
```
```yaml
title:
  type: string
  order: true

description: string
```

Example document:

```file-name
/🗄/Example/first-example.yaml
```
```yaml
title: My First Example

description: Neat
```

In this particular definition `first-example.yaml` is arbitrary / unused.
We'll discuss below how to optionally map `first-example` to a [UID field](/🗄/Article/fields/basic.md#uid).

## Markdown

Markdown documents are largely the same as YAML, however they also give 
the ability to use a single markdown field for the bulk of the document.
These are most useful with the [Content type](/🗄/Article/models/types.md#content). 
 
Example definition:
 
```file-name
/🗄/Article.yaml
```
```yaml
title: string

content: document-text

uid:
  type: document-uid
  path: true
```

Example document:

```file-name
/🗄/Article/places/antarctica.yaml
```
```markdown
---
title: Antarctica
---

Antarctica is a *very* fine place.
```

There are a few things going on in this example:

1. YAML is still used for most fields, and this YAML is placed between the "---" lines.  Also known as "front matter".
2. The special field type `document-text` transforms the markdown content that follows into a [rich text field](/🗄/Article/fields/text.md).
3. The special field type `document-uid` maps the directory and file name onto a [UID field](/🗄/Article/fields/basic.md#uid).

`document-uid` is important because it now allows us to use this value in a [dynamic path parameter](/🗄/Article/views/dynamic.md).

```file-name
/{article}📎.yaml
```
```yaml
field: 🗄.Article.uid
```

# Date-Based {#date}

The special static document field type `document-date` may be used to construct `date` values from the file path.

Example static `document-date` formats:

- `/🗄/Entry/2000-01-03.md` will have the date `2000-01-03`
- `/🗄/Entry/2000-01/02.yaml` will have the date `2000-01-02`
- `/🗄/Entry/2000/01-01.yaml` will have the date `2000-01-01`

When using `document-date` it typically makes sense to enable ordering by using `order: true` on the field definition.

# Linking {#linking}

> {.alert .is-warning .is-small}
>
> This currently only applies when using root file dynamic path parameters, as in the above example.

When using static markdown documents, it's common to link between them.
Assuming you're using [dynamic path parameters](/🗄/Article/views/dynamic.md) for your
static model document, then within the markdown content structure
links to point directly to other documents (using absolute paths):

```file-name
/🗄/Article/places/antarctica.yaml
```
```markdown
---
title: Antarctica
---

Antarctica is a *very* fine place,
but not as warm as the [Sahara](/🗄/Article/places/sahara.md).
```

When transforming the markdown document, Stacklane will resolve
the documents into proper endpoints links, and detect any invalid links.

Another good reason to use this approach is that it ensures cross-linking within GitHub's
web UI continues to work properly.

## Invalid Links

During compilation Stacklane will attempt to resolve document links,
and if invalid will apply CSS classes to those generated links.

To display these prominently in the rendered document use the CSS:

```css
.is-invalid-link:after, .is-missing-link:after{
  content: '⚠️';
}
```
