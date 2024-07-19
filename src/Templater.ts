import type VCard from "vcf";
import handlebars from "handlebars";

export enum VCardTemplateTerms {
  FIRST_NAME = "FN",
  LAST_NAME = "LN",
  ORGANIZATION = "ORG",
  TITLE = "TITLE",
  CELL_PHONE = "TEL",
  WORK_PHONE = "TEL;TYPE=WORK",
  HOME_PHONE = "TEL;TYPE=HOME",
  EMAIL = "EMAIL",
  ADDRESS = "ADR",
  URL = "URL",
  BIRTHDAY = "BDAY",
  NOTES = "NOTE",
  REVISION = "REV",
  LOCATION = "GEO",
}

export default class Templator {
  constructor(public vCard: VCard) {}

  toMarkdown = (markdownTemplate: string) => {
    const template = this.#getTemplate(markdownTemplate);
    return template(this.vCard);
  };

  #getTemplate = (markdownTemplate: string) => 
    handlebars.compile(markdownTemplate);
}
