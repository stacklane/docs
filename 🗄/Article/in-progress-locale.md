## Locales

`label`, `placeholder`, and `about` are optionally locale-aware.
By default they use the locale given by the [Manifest](/🗄/Article/settings/manifest.md).
Otherwise the values may be mapped to specific locales:

```yaml
name:
  type: string
  label:
    en: Name
    de-DE: etc
```