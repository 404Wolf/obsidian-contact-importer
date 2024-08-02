import handlebars from "handlebars";
import type { ContactType } from "../contacts/ContactBuilder";
import { getFullMonthName } from "./misc";
import { getB64Hash } from "../utils";

export default async function templateMarkdown(
  contact: ContactType,
  markdownTemplate: string,
) {
  const template = handlebars.compile(markdownTemplate);
  const now = new Date();
  return template({
    ...contact,
    image:
      contact.image === null
        ? null
        : `${(await getB64Hash(contact.image.data)).slice(0, 16)}.${contact.image.type}`,
    imported: {
      month: getFullMonthName(new Date()),
      day: now.getDate(),
      year: now.getFullYear(),
    },
  });
}
