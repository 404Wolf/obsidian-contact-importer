import vcf from "vcf";
import { formatDate } from "../utils";

export interface ContactPhone {
  number: string;
  type: string;
}

export interface ContactEmail {
  address: string;
  type: string;
}

export interface ContactImage {
  data: string;
  type: string;
}

export interface ContactWebsite {
  url: string;
  label: string;
}

export interface ContactAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  label: string;
}

export interface ContactName {
  first: string;
  middle?: string;
  last: string;
  pronunciation?: string;
}

export type ContactType = {
  name: ContactName;
  organization?: string;
  title?: string;
  phones: ContactPhone[];
  emails: ContactEmail[];
  addresses: ContactAddress[];
  websites: ContactWebsite[];
  birthday?: string;
  notes: string;
  image: ContactImage;
};

function sanitizeVCardLabel(label: string): string {
  // Regular expression to match the Apple-specific label format
  const appleFormatRegex = /\_\$\!<([^>]*)>\!\$_/;

  const match = label.match(appleFormatRegex);
  if (match) {
    // Extract the label name from within the Apple-specific format
    let sanitizedLabel = match[1];

    // Convert to lowercase and replace spaces with underscores
    sanitizedLabel = sanitizedLabel.replace(/\s+/g, " ");
    return sanitizedLabel;
  }
  // If it doesn't match the Apple-specific format, return the original label
  return label;
}

function objectWithGroupAttribute(obj: any): obj is { group: string } {
  return (
    typeof obj === "object" &&
    "group" in obj &&
    typeof obj["group"] === "string"
  );
}

export default class ContactBuilder {
  constructor(private vCard: vcf) {}

  /**
   * Read a property of the vCard and return it as a normalized list of JSONs
   */
  private getPropertyJSONs = (property: string): any[] | null => {
    const vCardProperty = this.vCard.get(property);
    if (vCardProperty === undefined) return null;
    if (Array.isArray(vCardProperty))
      return vCardProperty.map((vCard) => vCard.toJSON());
    else return [vCardProperty.toJSON()];
  };

  private extractFullName = (): [string, string] => {
    // [ [ "n", {}, "text", [ "Mermelstein", "Wolf", "", "", "" ] ] ]
    const nameDict = this.getPropertyJSONs("n");
    if (nameDict === null) throw new Error("Contact doesn't have a name!");
    const nameList = nameDict[0][3] as string[];
    const name = [nameList[1], nameList[0]].map((name) => name.trim());
    return name as [string, string];
  };

  private extractPronunciation = (): string => {
    const getPronunciationPart = (part: string) => {
      const pronunciation = this.getPropertyJSONs(
        `xPhonetic${part[0].toUpperCase()}${part.slice(1)}Name`,
      );
      if (pronunciation === null) return null;
      return pronunciation[0][3].trim();
    };

    return `${getPronunciationPart("first") || ""} ${getPronunciationPart("last") || ""}`.trim();
  };

  private extractTitle = (): string => {
    const title = this.getPropertyJSONs("title");
    if (title === null) return "";
    return typeof title[0] === "string" ? (title[0].trim() as string) : "";
  };

  private extractOrganization = (): string => {
    const organization = this.getPropertyJSONs("org");
    if (organization === null) return "";
    return typeof organization[0] === "string"
      ? (organization[0].trim() as string)
      : "";
  };

  private extractPhones = (): ContactPhone[] => {
    const phones = this.getPropertyJSONs("tel");
    if (phones === null) return [];
    return phones.map((phone) => {
      if (objectWithGroupAttribute(phone[1]))
        return {
          number: phone[3].trim(),
          type: phone[1].group.trim(),
        } as ContactPhone;
      else
        return {
          number: phone[3].trim(),
          type: "Misc",
        } as ContactPhone;
    });
  };

  private extractEmails = (): ContactEmail[] => {
    const emails = this.getPropertyJSONs("email");
    if (emails === null) return [];
    return emails.map((email) => {
      if (objectWithGroupAttribute(email[1]))
        return {
          address: email[3].trim(),
          type: email[1].group.trim(),
        } as ContactEmail;
      else
        return {
          address: email[3].trim(),
          type: "Misc",
        } as ContactEmail;
    });
  };

  private extractBirthday = (): string => {
    const birthday = this.getPropertyJSONs("bday");
    if (birthday === null) return "";
    return formatDate(birthday[0][3].trim()) as string;
  };

  private extractAddresses = (): ContactAddress[] => {
    const addresses = this.getPropertyJSONs("adr");
    if (addresses === null) return [];
    return addresses.map((address) => {
      const label = address[1];
      const [_, country, streetZip, city, state] = address[3];
      const zip = streetZip.split(" ").slice(-1)[0];
      const street = streetZip.split(" ").slice(0, -1).join(" ");
      return {
        street,
        city,
        state,
        zip,
        country,
        label: typeof label === "string" && label.length > 0 ? label : "Misc",
      } as ContactAddress;
    });
  };

  private extractImages = (): ContactImage | null => {
    const images = this.getPropertyJSONs("photo");
    // Each image format is:
    // "photo" {encoding: string, type: string} "text" "base64"
    if (images === null) return null;
    const normalizedImages = images.map((image) => {
      const contactImage = {
        data: image[3].trim(),
        type: image[1]["type"],
      } as ContactImage;
      if (contactImage.type === undefined) return null;
      return contactImage;
    });
    if (normalizedImages.length !== 1) throw new Error("Multiple images found");
    return normalizedImages[0];
  };

  private extractNotes = (): string => {
    const notes = this.getPropertyJSONs("note");
    if (notes === null) return "";
    return notes[0][3].trim() as string;
  };

  private extractWebsites = (): ContactWebsite[] => {
    const websites = this.getPropertyJSONs("url");
    if (websites === null) return [];
    return websites.map((website) => {
      if (objectWithGroupAttribute(website[1]))
        return {
          url: website[3].trim(),
          label: website[1].group.trim(),
        } as ContactWebsite;
      else
        return {
          url: website[3].trim(),
          label: "Misc",
        } as ContactWebsite;
    });
  };

  private extractAll = (labelFallback: string = "Misc"): ContactType => {
    const rawLabels = this.getPropertyJSONs("xAbLabel");
    let labelMap = [];
    if (rawLabels !== null) {
      labelMap = Object.fromEntries(
        rawLabels.map((label: any) => [
          (label[1] as any).group,
          sanitizeVCardLabel(label[3]).trim(),
        ]),
      );
    }
    const getLabel = (label: string) => {
      if (label in labelMap) return labelMap[label];
      else return labelFallback;
    };

    const [firstName, lastName] = this.extractFullName();
    const pronunciation = this.extractPronunciation();
    const organization = this.extractOrganization();
    const title = this.extractTitle();
    const phones = this.extractPhones().map(({ number, type }) => ({
      number,
      type: getLabel(type),
    }));
    const emails = this.extractEmails().map((email: ContactEmail) => ({
      address: email.address.trim(),
      type: getLabel(email.type),
    }));
    const birthday = this.extractBirthday();
    const image = this.extractImages();
    const addresses = this.extractAddresses();
    const notes = this.extractNotes();
    const websites = this.extractWebsites().map(({ url, label }) => ({
      url,
      label: getLabel(label),
    }));

    const outputContact = {
      name: {
        first: firstName,
        last: lastName,
        pronunciation,
      },
      organization,
      title,
      phones,
      emails,
      addresses,
      websites,
      birthday,
      notes,
      image,
    } as ContactType;
    console.log("Generated contact!", outputContact);
    return outputContact;
  };

  public static build = (vCard: vcf): ContactType => {
    const contactBuilder = new ContactBuilder(vCard);
    return contactBuilder.extractAll();
  };
}
