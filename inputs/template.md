---
obsidian-contact-importer-schema-version: "1.0"
tags: ["person"]
---

# {{name.first}} {{name.last}}

---

{{#if organization}}
  {{#if title}}
{{title}} @ {{organization}}
  {{else}}
{{organization}}
  {{/if}}
{{else}}
  {{#if title}}
{{title}}
  {{/if}}
{{/if}}
{{#if image}}
![Image]({{image}})
{{/if}}
## Phones
| Type          | Number        |
|:--------------|:--------------|
{{#each phones}}
| {{type}}      | `c!{{number}}`|
{{/each}}

## Emails
| Type          | Address       |
|:--------------|:--------------|
{{#each emails}}
| {{type}}      | [`c!{{address}}` |
{{/each}}

## Links
| Type          | URL           |
|:--------------|:--------------|
{{#each websites}}
| {{label}}     | [{{url}}]({{url}}) |
{{/each}}

## Addresses
| Type          | Street        | City, State   | Zip, Country  |
|:--------------|:--------------|:--------------|:--------------|
{{#each addresses}}
| {{type}}      | {{street}}    | {{city}}, {{state}} | {{zip}} {{country}} |
{{/each}}

## Other
| Type          | Value         |
|:--------------|:--------------|
| Birthday      | {{birthday}}  |

---

Imported to Obsidian {{imported.month}}, {{imported.day}}, {{imported.year}} 

# Notes

{{notes}}
