# Obsidian Contact Importer
## Import contacts into templated Obsidian markdown

[Obsidian](https://obsidian.md/) is a super cool note taking client. [Vcard](https://www.rfc-editor.org/rfc/rfc6350.html) is a not super cool super annoying Contact storage standard. `Obsidian Contact Importer` is a super cool `ts` project to parse your `vcards`, and generate structured `markdown` ready for importing to `Obsidian`.

This works by loading your vCards, parsing them with [`vcf`](https://www.npmjs.com/package/vcf), adapting the parser output to be more human-friendly and JSON-ic, and then plugging it all into a handlebar template. Images are handled by converting the base64 embedded images into proper image files, with UUID linking.

Currently this is only one-way, but it is designed to be able to be two-way so that you can both convert vCards to markdown and vice versa in the future. Eventually this will be ported to a proper Obsidian plugin.

## Usage

Clone this repo or create a `inputs` folder with a `vcards.vcf` and `template.md` file (see example template if you're creating your own). Run `nix run github:404wolf/obsidian-contact-importer` if you have `nix`. If not, make sure that `bun` is installed, and then run `bun install`. Export your contacts to a `.vcf` format, and then just run `bun run dev`. Only tested with Apple contacts so far. Please create an issue if your contacts can't import correctly.

## Examples

![20fdcf6b-0961-418b-9c78-effa2b5ef2d9](https://github.com/user-attachments/assets/5df9c689-251b-4e39-b3cd-bc0d8e156703)

![34d5c1f9-ef12-4f90-8d5d-244cb4273313](https://github.com/user-attachments/assets/64ba7881-cb34-418d-a0b3-65865a3a11bf)

Check out [@ symbol linking!](https://github.com/Ebonsignori/obsidian-at-symbol-linking), so you can dynamically create people notes!
