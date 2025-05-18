import handlebars from "handlebars";
import type { ContactType } from "../contacts/ContactBuilder";
import { getFullMonthName } from "./misc";

export default async function templateMarkdown(
  contact: ContactType,
  markdownTemplate: string,
) {
  const template = handlebars.compile(markdownTemplate);
  const now = new Date();
  return template({
    ...contact,
    image: contact.image === null || (!contact.image.path)
      ? null
      : contact.image.path,
    imported: {
      month: getFullMonthName(new Date()),
      day: now.getDate(),
      year: now.getFullYear(),
    },
  });
}
