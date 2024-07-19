import vcf from "vcf";
import Contact from "./Contact";

const input = Bun.file("./inputs/WolfMermelstein.vcf");
const cards = vcf.parse(await input.text())
const contact = cards[0].toJSON()
//console.log(JSON.stringify(contact))
console.log(Contact.fromVCard(cards[0]))
