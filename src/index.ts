import vcf from "vcf";
import ContactBuilder from "./contacts/ContactBuilder";
import templateMarkdown from "./utils/templating";
import {
  getB64Hash,
  readFile,
  saveBase64ImageToFile,
  writeFile,
} from "./utils";

async function processVCardToMarkdown() {
  const markdownTemplate = await readFile("./inputs/template.md");
  const input = await readFile("./inputs/vcards.vcf");

  const cards = vcf.parse(input);
  await Promise.all(
    cards.map(async (card) => {
      const contact = ContactBuilder.build(card);

      let filename = "./outputs/contacts/@";
      if (contact.name.last && contact.name.middle) {
        filename +=
          `${contact.name.first} ${contact.name.middle} ${contact.name.last}`;
      } else if (contact.name.last) {
        filename += `${contact.name.first} ${contact.name.last}`;
      } else {
        filename += `${contact.name.first}`;
      }
      filename += ".md";

      if (contact.image) {
        if (/https?:\/\//.test(contact.image.data)) {
          // Create a unique filename for the image
          const imageFileName = `${Date.now()}-${
            Math.random().toString(36).substring(2, 15)
          }.${contact.image.type || "png"}`;
          contact.image.path = `./outputs/resources/${imageFileName}`;

          // Fetch the image and save it directly to a file
          const response = await fetch(contact.image.data);
          const blob = await response.blob();

          // Convert blob to buffer and write to file
          const arrayBuffer = await blob.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          await Bun.write(contact.image.path, buffer);
        } else {
          contact.image.path = `${
            (await getB64Hash(contact.image.data)).slice(0, 16)
          }.${contact.image.type}`;

          await saveBase64ImageToFile(
            `data:image/${
              contact.image?.type || "png"
            };base64,${contact.image.data}`,
            `./outputs/resources`,
          );

          const imageFileName = contact.image.path.split("/").pop();
          contact.image.data = `resources/${imageFileName}`;
        }

        // Now render the markdown with the updated image path
        await writeFile(
          filename,
          await templateMarkdown(contact, markdownTemplate),
        );
      } else {
        // Process contacts without images
        await writeFile(
          filename,
          await templateMarkdown(contact, markdownTemplate),
        );
      }
    }),
  );

  console.log("Processing completed successfully");
}

processVCardToMarkdown();
