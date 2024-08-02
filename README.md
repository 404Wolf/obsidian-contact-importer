# Obsidian Contact Importer
## Import contacts into templated Obsidian markdown

This works by importing your vCards, parsing them with [`vcf`](https://www.npmjs.com/package/vcf), adapting the parser output to be more human-friendly and JSON-ic, and then plugging it all into a handlebar template. Images are handled by converting the base64 embedded images into proper image files, with UUID linking.

Currently this is only one-way, but it is designed to be able to be two-way so that you can both convert vCards to markdown and vice versa in the future. Eventually this will be ported to a proper Obsidian plugin.

## Usage

Clone this repo. Run `nix develop` if you have `nix`, or just make sure that `bun` is installed. Then run `bun install`. Export your contacts to a `.vcf` format, and then just run `bun run dev`. This project will be properly packaged soon!
