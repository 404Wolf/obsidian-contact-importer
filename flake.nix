{
  description = "Import contacts into templated Obsidian markdown";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    bun-utils.url = "github:404Wolf/nix-bun-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      bun-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        packages = {
          default = bun-utils.lib.${system}.buildBunPackage {
            src = ./.;
            name = "obsidian-contact-importer";
            outputHash = "sha256-GSKIRTGhyUaiX5GW5AziZbq5VmxT6Lz+Tb5l1myGqvw=";
          };
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
