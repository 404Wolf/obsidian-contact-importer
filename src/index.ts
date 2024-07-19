import vcf from "vcf";
import Contact from "./contacts/Contact";
import templateMarkdown from "./utils/templating";

async function readFile(path: string): Promise<string> {
  return await Bun.file(path).text();
}

async function writeFile(path: string, content: string): Promise<void> {
  await Bun.write(path, content);
}

async function processVCardToMarkdown() {
  const input = await readFile("./inputs/vcards.vcf");
  const cards = vcf.parse(input);
  const contact = Contact.fromVCard(cards[0]);
  const markdownTemplate = await readFile("./inputs/template.md");
  const result = templateMarkdown(contact, markdownTemplate);
  await writeFile("./output.md", result);
}

processVCardToMarkdown(); 
