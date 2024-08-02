import vcf from "vcf";
import ContactBuilder from "./contacts/ContactBuilder";
import templateMarkdown from "./utils/templating";
import { readFile, saveBase64ImageToFile, writeFile } from "./utils";

async function processVCardToMarkdown() {
  const markdownTemplate = await readFile("./inputs/template.md");
  const input = await readFile("./inputs/vcards.vcf");
  vcf.parse(input).forEach(async (card: vcf) => {
    const contact = ContactBuilder.build(card);
    const result = await templateMarkdown(contact, markdownTemplate);
    await writeFile(
      `./outputs/contacts/@${contact.name.first} ${contact.name.last}.md`,
      result,
    );
    if (contact.image !== null)
      await saveBase64ImageToFile(
        `data:image/${contact.image.type};base64,${contact.image.data}`,
        `./outputs/resources`,
      );
  });
}

processVCardToMarkdown();
