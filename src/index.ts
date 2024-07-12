import vcardsjs from "vcards-js"

const testContacts = Bun.file("./inputs/contacts.vcf");
const testContactsText = await testContacts.text();

const parsed = parse(testContactsText)
console.log(parsed)
