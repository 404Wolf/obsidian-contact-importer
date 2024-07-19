import vcf from "vcf";

interface Phone {
  number: string;
  type: string;
}

interface Email {
  address: string;
  type: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  label: string;
}

interface Website {
  url: string;
  label: string;
}

interface Name {
  first: string;
  middle?: string;
  last: string;
  pronunciation?: string;
}

interface Photo {
  data: string;
  type: string;
}

export type ContactType = {
  name: Name
  organization?: string;
  title?: string;
  phones: Phone[];
  emails: Email[];
  addresses: Address[];
  websites: Website[];
  birthday?: string;
  notes: string;
  revision: string;
  location: string;
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
          } as Phone
        else
          return {
            number: phone[3],
            type: "Misc"
          } as Phone
      })
    }

    const emails = getPropertyJSONs("email")
    if (emails !== null) {
      newContact.emails = emails.map(email => {
        if (objectWithGroupAttribute(email[1]))
          return { type: labelMap[email[1].group] as string, address: email[3] } as Email
        else
          return { type: "Misc", address: email[3] } as Email
      })
    }

    const birthday = getPropertyJSONs("bday")
    if (birthday !== null)
      newContact.birthday = birthday[3]

    const photo = getPropertyJSONs("photo")
    if (photo !== null) {
      let imageType: string;
      if (typeof photo[1] === "object" && "type" in photo[1])
        imageType = photo[1].type as string;
      else
        throw new Error("Unknown image encoding")
      newContact.photo = {
        data: photo[3],
        type: `image/${imageType}`
      }
    }

    const addresses = getPropertyJSONs("adr")
    if (addresses !== null) {
      throw new Error("Not implemented")
    }

    return newContact as ContactType;
  }
}
