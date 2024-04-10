{
  nixConfig.commit-lockfile-summary = "chore: :arrow_up: Update flake.lock";
  inputs.nixpkgs.url = "nixpkgs/nixpkgs-unstable";
  inputs.troll = {
    url = "github:sonnyp/troll";
    flake = false;
  };

  outputs = { nixpkgs, self, troll }:
    let
      appid = "surf.tangent.Tangent";
      description = "Go on tangents.";
    in
    {
      packages.x86_64-linux =
        let
          pkgs = import nixpkgs {
            system = "x86_64-linux";
          };
          lib = pkgs.lib;
        in
        {
          # TODO: This could be dramatically simplified by using Meson
          default = pkgs.stdenvNoCC.mkDerivation (finalAttrs: {
            pname = "tangent";
            version = "0.0.1";
            src = self;
            nativeBuildInputs = [
              pkgs.gjs
              pkgs.wrapGAppsHook4
              pkgs.blueprint-compiler
              pkgs.meson
              pkgs.ninja
              pkgs.desktop-file-utils
            ];
            enableParallelBuilding = true;
            buildInputs = [
              pkgs.gjs
              pkgs.gtk4
              pkgs.libadwaita
              pkgs.libsoup_3
              pkgs.webkitgtk_6_0
              pkgs.glib-networking
              pkgs.p11-kit
              pkgs.gst_all_1.gst-libav
              pkgs.gst_all_1.gst-plugins-bad
              pkgs.gst_all_1.gst-plugins-base
              pkgs.gst_all_1.gst-plugins-good
              pkgs.gst_all_1.gst-plugins-ugly
              pkgs.gst_all_1.gstreamer
            ];
            dontPatchShebangs = true;
            inherit troll;
            postPatch = ''
              cp --recursive $troll ./src/troll
              substituteInPlace src/bin.js src/troll/gjspack/bin/gjspack --replace-fail "#!/usr/bin/env -S gjs -m" "#!${pkgs.gjs}/bin/gjs --module"
            '';
            postInstall = ''chmod +x $out/bin/${appid}'';
            meta = {
              mainProgram = appid;
              description = description;
              license = lib.licenses.gpl3Plus;
              homepage = "https://cetera.uk/";
              longDescription = builtins.readFile ./README.md;
              changelog = "https://github.com/mollersuite/tangent/releases/tag/v${finalAttrs.version}";
            };
          });
        };
    };
}
