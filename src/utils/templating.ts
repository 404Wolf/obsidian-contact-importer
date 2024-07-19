import handlebars from "handlebars";
import type { ContactType } from "../contacts/Contact";
import { getFullMonthName } from "./misc";

export default function templateMarkdown(contact: ContactType, markdownTemplate: string) {
  const template = handlebars.compile(markdownTemplate);
  const now = new Date()
  return template({ ...contact, month: getFullMonthName(new Date()), day: now.getDate(), year: now.getFullYear() })
}
