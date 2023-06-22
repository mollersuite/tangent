{
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    naersk.url = "github:nix-community/naersk";
    naersk.inputs.nixpkgs.follows = "nixpkgs";
   };

  outputs = { self, flake-utils, naersk, nixpkgs}:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = (import nixpkgs) {
          inherit system;
        };

        naersk' = pkgs.callPackage naersk { };

      in
      {
        # For `nix build` & `nix run`:
        defaultPackage = naersk'.buildPackage {
          src = ./.;
          nativeBuildInputs = [ pkgs.pkg-config ];
          buildInputs = [
            pkgs.webkitgtk_6_0
            pkgs.gtk4
            pkgs.libadwaita
            pkgs.glib-networking
          ];
        };

        # For `nix develop`:
        devShell = pkgs.mkShell {
          nativeBuildInputs = [
            pkgs.rustc
            pkgs.cargo
            pkgs.pkg-config
            pkgs.rust-analyzer
            pkgs.rustfmt
            pkgs.webkitgtk_6_0
            pkgs.gtk4
            pkgs.libadwaita
          ];
          RUST_SRC_PATH = pkgs.rustPlatform.rustLibSrc;
        };
      }
    );
}
