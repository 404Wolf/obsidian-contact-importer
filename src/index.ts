import { parse } from "vcard4"

const johnDoeFile = Bun.file("./inputs/john-doe.vcf");
const johnDoe = await johnDoeFile.text();


parse(johnDoe)
