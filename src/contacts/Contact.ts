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
  name: ContactName
  organization?: string;
  title?: string;
  phones: ContactPhone[];
  emails: ContactEmail[];
  addresses: ContactAddress[];
  websites: ContactWebsite[];
  birthday?: string;
  notes: string;
  images: ContactImage[];
}

function objectWithGroupAttribute(obj: any): obj is { group: string } {
  return typeof obj === "object" && "group" in obj && typeof obj["group"] === "string"
}


export default class Contact {
  constructor(public contact: ContactType) { }

  static fromVCard = (vCard: vcf) => {
    const newContact: any = {}

    const getPropertyJSONs = (property: string) => {
      const vCardProperty = vCard.get(property)
      if (vCardProperty === undefined) return null;
      if (Array.isArray(vCardProperty)) {
        return vCardProperty.map(vCard => vCard.toJSON())
      }
      else {
        return vCardProperty.toJSON() as string[]
      }
    }

    const rawLabels = getPropertyJSONs("xAbLabel")
    if (rawLabels === null)
      throw new Error("Labels not found in VCard")
    const labelMap = Object.fromEntries(rawLabels.map(label => [(label[1] as any).group, label[3]]))

    const [lastName, firstName] = getPropertyJSONs("n")![3]

    const getPronunciation = (part: string) => {
      const pronunciation = getPropertyJSONs(
        `xPhonetic${part[0].toUpperCase()}${part.slice(1)}Name`
      )
      if (pronunciation === null) return null
      return pronunciation[3]
    }

    newContact.name = {
      first: firstName,
      last: lastName,
      pronunciation: `${getPronunciation("first") || ""} ${getPronunciation("last") || ""}`.trim() || null
    }

    const organization = getPropertyJSONs("org")
    if (organization !== null)
      newContact.organization = organization[0]

    const title = getPropertyJSONs("title")
    if (title !== null)
      newContact.title = title[0]

    const phones = getPropertyJSONs("tel")
    if (phones !== null) {
      newContact.phones = phones.map(phone => {
        if (objectWithGroupAttribute(phone[1]))
          return {
            number: phone[3],
            type: labelMap[phone[1]["group"]]
          } as ContactPhone
        else
          return {
            number: phone[3],
            type: "Misc"
          } as ContactPhone
      })
    }

    const emails = getPropertyJSONs("email")
    if (emails !== null) {
      newContact.emails = emails.map(email => {
        if (objectWithGroupAttribute(email[1]))
          return { type: labelMap[email[1].group] as string, address: email[3] } as ContactEmail
        else
          return { type: "Misc", address: email[3] } as ContactEmail
      })
    }

    const birthday = getPropertyJSONs("bday")
    if (birthday !== null)
      newContact.birthday = birthday[3]

    const images = getPropertyJSONs("photo")
    if (images !== null) {
      let imageType: string;
      if (typeof images[1] === "object" && "type" in images[1])
        imageType = images[1].type as string;
      else
        throw new Error("Unknown image encoding")
      newContact.images = [{
        data: images[3],
        type: `image/${imageType}`
      } as ContactImage]
    }

    const addresses = getPropertyJSONs("adr")
    if (addresses !== null) {
      throw new Error("Not implemented")
    }

    const notes = getPropertyJSONs("note")
    if (notes !== null)
      newContact.notes = notes[3]
    else
      newContact.notes = ""

    const contactWebsites = getPropertyJSONs("url")
    if (contactWebsites !== null)
      newContact.website = contactWebsites[3]

    return newContact as ContactType;
  }
}
