{
  inputs = {
    flake-utils.url = "flake-utils";
    nixpkgs.url = "nixpkgs/nixpkgs-unstable"; #nixpkgs-unstable"; # gnome";
    naersk.url = "github:nix-community/naersk";
    naersk.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { self, flake-utils, naersk, nixpkgs }:
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
          pname = "tangent";
          src = ./.;
          nativeBuildInputs = [ pkgs.pkg-config ];
          buildInputs = [
            pkgs.webkitgtk_6_0
            pkgs.gtk4
            pkgs.libadwaita
            pkgs.glib-networking
            pkgs.p11-kit # Trying stuff until HTTPS works
            pkgs.gst_all_1.gst-libav
            pkgs.gst_all_1.gst-plugins-bad
            pkgs.gst_all_1.gst-plugins-base
            pkgs.gst_all_1.gst-plugins-good
            pkgs.gst_all_1.gst-plugins-ugly
            pkgs.gst_all_1.gstreamer
            pkgs.wrapGAppsHook
          ];
          meta.mainProgram = "tangent";
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
            pkgs.gst_all_1.gst-libav
            pkgs.gst_all_1.gst-plugins-bad
            pkgs.gst_all_1.gst-plugins-base
            pkgs.gst_all_1.gst-plugins-good
            pkgs.gst_all_1.gst-plugins-ugly
            pkgs.gst_all_1.gstreamer
            pkgs.wrapGAppsHook
          ];
          RUST_SRC_PATH = pkgs.rustPlatform.rustLibSrc;
        };
      }
    );
}
