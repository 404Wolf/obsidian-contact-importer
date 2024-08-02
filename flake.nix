{
  description = "Import contacts into templated Obsidian markdown";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    bun-utils.url = "github:404Wolf/nix-bun-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    bun-utils,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {inherit system;};
      in {
        packages = {
          default = pkgs.writeShellScriptBin "obsidian-contact-importer" ''
            ${pkgs.bun}/bin/bun run ${bun-utils.lib.${system}.buildBunPackage {
              src = ./.;
              name = "obsidian-contact-importer";
              outputHash = "sha256-H9hWffy5QUN/n9tgaOO51k92XPJyLQ/bneFRgseCiX0=";
            }}/bin/index.js
          '';
        };
        devShells = {
          default = pkgs.mkShell {
            packages = [
              pkgs.bun
              pkgs.typescript
            ];
          };
        };
      }
    );
}
