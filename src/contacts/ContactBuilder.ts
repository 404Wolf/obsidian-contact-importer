import vcf from "vcf";

export interface ContactPhone {
  number: string;
  type: string;
}

export interface ContactEmail {
  address: string;
  type: string;
}

export interface ContactAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  label: string;
}

export interface ContactWebsite {
  url: string;
  label: string;
}

export interface ContactName {
  first: string;
  middle?: string;
  last: string;
  pronunciation?: string;
}

export interface ContactImage {
  data: string;
  type: string;
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
  images: ContactImage;
};

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

  private extractFullName = (): string => {
    // [ [ "n", {}, "text", [ "Mermelstein", "Wolf", "", "", "" ] ] ]
    const nameDict = this.getPropertyJSONs("n");
    if (nameDict === null) throw new Error("Contact doesn't have a name!");
    const name = nameDict[0][3];
    return `${name[1]} ${name[0]}`;
  };

  private extractPronunciation = (): string => {
    const getPronunciationPart = (part: string) => {
      const pronunciation = this.getPropertyJSONs(
        `xPhonetic${part[0].toUpperCase()}${part.slice(1)}Name`,
      );
      if (pronunciation === null) return null;
      return pronunciation[0][3];
    };

    return `${getPronunciationPart("first") || ""} ${getPronunciationPart("last") || ""}`.trim();
  };

  private extractTitle = (): string => {
    const title = this.getPropertyJSONs("title");
    if (title === null) return "";
    return title[0] as string;
  };

  private extractOrganization = (): string => {
    const organization = this.getPropertyJSONs("org");
    if (organization === null) return "";
    return organization[0] as string;
  };

  private extractPhones = (): ContactPhone[] => {
    const phones = this.getPropertyJSONs("tel");
    if (phones === null) return [];
    return phones.map((phone) => {
      if (objectWithGroupAttribute(phone[1]))
        return {
          number: phone[3],
          type: phone[1].group,
        } as ContactPhone;
      else
        return {
          number: phone[3],
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
          address: email[3],
          type: email[1].group,
        } as ContactEmail;
      else
        return {
          address: email[3],
          type: "Misc",
        } as ContactEmail;
    });
  };

  private extractBirthday = (): string => {
    const birthday = this.getPropertyJSONs("bday");
    if (birthday === null) return "";
    return birthday[3] as string;
  };

  private extractAddresses = (): ContactAddress[] => {
    const addresses = this.getPropertyJSONs("adr");
    if (addresses === null) return [];
    return addresses.map((address) => {
      const [street, city, state, zip, country] = address[3];
      return {
        street,
        city,
        state,
        zip,
        country,
        label: (address[1] as any).group,
      } as ContactAddress;
    });
  };

  private extractImages = (): ContactImage | null => {
    const images = this.getPropertyJSONs("photo");
    // Each image format is:
    // "photo" {encoding: string, type: string} "text" "base64"
    if (images === null) return null;
    const normalizedImages = images.map((image) => {
      return {
        data: image[3],
        type: image[1]["type"],
      } as ContactImage;
    });
    if (normalizedImages.length !== 1) throw new Error("Multiple images found");
    return normalizedImages[0];
  };

  private extractNotes = (): string => {
    const notes = this.getPropertyJSONs("note");
    if (notes === null) return "";
    return notes[3] as string;
  };

  private extractWebsites = (): ContactWebsite[] => {
    const websites = this.getPropertyJSONs("url");
    if (websites === null) return [];
    return websites.map((website) => {
      if (objectWithGroupAttribute(website[1]))
        return {
          url: website[3],
          label: website[1].group,
        } as ContactWebsite;
      else
        return {
          url: website[3],
          label: "Misc",
        } as ContactWebsite;
    });
  };

  private extractAll = (): ContactType => {
    const [lastName, firstName] = this.extractFullName();
    const pronunciation = this.extractPronunciation();
    const organization = this.extractOrganization();
    const title = this.extractTitle();
    const phones = this.extractPhones();
    const emails = this.extractEmails();
    const birthday = this.extractBirthday();
    const images = this.extractImages();
    const addresses = this.extractAddresses();
    const notes = this.extractNotes();
    const contactWebsites = this.extractWebsites();

    return {
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
      websites: contactWebsites,
      birthday,
      notes,
      images,
    } as ContactType;
  };

  public static build = (vCard: vcf): ContactType => {
    const contactBuilder = new ContactBuilder(vCard);
    return contactBuilder.extractAll();
  };
}
