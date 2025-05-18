import vcf from "vcf";
import ContactBuilder from "./contacts/ContactBuilder";
import templateMarkdown from "./utils/templating";
import { readFile, saveBase64ImageToFile, writeFile } from "./utils";

async function processVCardToMarkdown() {
  const markdownTemplate = await readFile("./inputs/template.md");
  const input = await readFile("./inputs/vcards.vcf");

  vcf
    .parse(input)
    .forEach(async (card: vcf) => {
      const contact = ContactBuilder.build(card);
      const result = await templateMarkdown(contact, markdownTemplate);

      let filename: string = "./outputs/contacts/@";
      if (contact.name.last && contact.name.middle) {
        filename +=
          `${contact.name.first} ${contact.name.middle} ${contact.name.last}`;
      } else if (contact.name.last) {
        filename += `${contact.name.first} ${contact.name.last}`;
      } else filename += `${contact.name.first}`;
      filename += ".md";

      await writeFile(filename, result);
      if (contact.image) {
        await saveBase64ImageToFile(
          `data:image/${contact.image.type};base64,${contact.image.data}`,
          `./outputs/resources`,
        );
      }
    });
}

processVCardToMarkdown();
