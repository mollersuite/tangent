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
            nativeBuildInputs = [ pkgs.gjs pkgs.gobject-introspection pkgs.wrapGAppsHook pkgs.blueprint-compiler ];
            buildInputs = [
              pkgs.gjs
              pkgs.gtk4
              pkgs.libadwaita
              pkgs.libsoup_3
              pkgs.gobject-introspection
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
            buildPhase = ''
              ln --symbolic ${troll} ./src/troll
              mkdir $out
              export version="${finalAttrs.version}"
              export comments="${description}"
              export homepage="${finalAttrs.meta.homepage}"
              substituteAllInPlace ./src/main.js
              gjs --module ${troll}/gjspack/bin/gjspack ${lib.cli.toGNUCommandLineShell {} {
                inherit appid;
                import-map = "./src/import_map.json";
                resource-root="./src";
              }} ./src/main.js $out/bin
              sed --in-place "1s/.*/#!${lib.strings.escape ["/"] (lib.getExe pkgs.gjs)} --module/" $out/bin/${appid}
              cp --recursive ./share $out/share
            '';
            meta = {
              mainProgram = appid;
              description = description;
              license = lib.licenses.gpl3Plus;
              homepage = "https://cetera.uk/";
              longDescription = builtins.readFile ./README.md;
              changelog = "https://github.com/mollersuite/tangent/releases/tag/v${finalAttrs.version}";
            };
            desktopItem = pkgs.makeDesktopItem {
              name = appid; # Filename, not display name
              icon = appid;
              exec = "${appid} %u";
              desktopName = "Tangent";
              genericName = "Web Browser";
              categories = [ "GNOME" ];
              keywords = [ "Etcetera" ];
              comment = description;
              # TODO
              dbusActivatable = true;
              startupNotify = true;
            };

            postInstall = "cp -r $desktopItem/* $out";
          });
        };
    };
}
