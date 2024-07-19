# {{FIRST_NAME}} {{LAST_NAME}}

# Contact

## Phones:
{{#if CELL_PHONE}}
- **Mobile**: `{{ CELL_PHONE }}`
{{/if}}
{{#if WORK_PHONE}}
- **Work**: `{{ WORK_PHONE }}`
{{/if}}
{{#if HOME_PHONE}}
- **Home**: `{{ HOME_PHONE }}`
{{/if}}

## Emails:
- **Primary**: `[{{ EMAIL }}](mailto:{{ EMAIL }})`

## Addresses:
- **Primary**: {{ADDRESS}}

## Links
{{#each LINKS}}
- [{{TITLE}}]({{URL}})
{{/each}}

# Facts

- **Birthday**: {{BIRTHDAY}}
- **Schools**: {{SCHOOLS}}

---

# Status

# {{MONTH}} {{YEAR}} 
{{#if ORGANIZATION}}
- {{TITLE @ ORGANIZATION}}
{{/if}}

---

# Photos/Resources

{{#if PHOTO}}
![Photo](data:image/{{PHOTO_MIMETYPE}};base64,{{PHOTO_B64}})
{{/if}}

---

# Notes

{{NOTES}}
