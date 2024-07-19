# {{name.first}} {{name.last}}

# Contact

## Phones
{{#each phones}}
- **{{type}}**: [{{number}}](tel:{{number}})
{{/each}}

## Emails
{{#each emails}}
- **{{type}}**: [{{address}}](mailto:{{address}})
{{/each}}

## Addresses
{{#each addresses}}
- **{{type}}**: {{address}}
{{/each}}

## Links
{{#each LINKS}}
- [{{TITLE}}]({{URL}})
{{/each}}

# Facts

- **Birthday**: {{birthday}}
- **Schools**: {{schools}}

---

# Status

# {{month}}, {{year}} 
{{#if organization}}
- {{title @ organization}}
{{else}}
- ???
{{/if}}

---

# Photos/Resources

{{#each images}}
- ![Image](data:{{type}};base64,{{data}})
{{/each}}

---

# Notes

{{notes}}
