/// <reference types="gjs/dom" />
import WebKit2 from "gi://WebKit?version=6.0"
import GObject from "gi://GObject"
import Gio from "gi://Gio"
import Gtk from "gi://Gtk?version=4.0"
import Adw from "gi://Adw?version=1"
import GLib from "gi://GLib"
import { programArgs, programInvocationName } from "system"
import { build } from "troll"
import "troll/globals.js"
import Interface from "./window.blp" with { type: "uri" }
import meta from "../share/metainfo/surf.tangent.Tangent.metainfo.xml" with {type: "uri"}

GLib.set_application_name("Tangent")

const Tangent = GObject.registerClass(
	{},
	class Tangent extends Adw.Application {
		constructor() {
			super({
				applicationId: "surf.tangent.Tangent",
				flags: Gio.ApplicationFlags.DEFAULT_FLAGS,
			})
		}

		vfunc_startup() {
			super.vfunc_startup()

			const about_action = new Gio.SimpleAction({
				name: "about",
				parameterType: null
			})
			about_action.connect("activate", () => {
				const about = Adw.AboutWindow.new_from_appdata(
						meta.replace("resource://", ""),
						""
				)
			  about.set_transient_for(this.get_active_window())
				about.present()
			})
			this.add_action(about_action)
		}

		vfunc_activate() {
			super.vfunc_activate()

			/*** @type {{window: Gtk.ApplicationWindow, content: Gtk.Box, urlbar: Gtk.Entry}} */
			const { window, content, urlbar } = build(Interface)
			window.set_application(this)
			window.set_icon_name("surf.tangent.Tangent")
			window.present()
			window.connect("close-request", win => win.run_dispose())
			const webview = new WebKit2.WebView({
				settings: 
					new WebKit2.Settings({
						enableDeveloperExtras: true
					})
				
			})


			content.append(webview)
			webview.vexpand = true
			webview.hexpand = true
			webview.load_uri("https://tangent.surf")
			webview.bind_property(
  "uri",
  urlbar.buffer,
  "text",
  GObject.BindingFlags.DEFAULT,
);
						webview.connect("notify::estimated-load-progress", () => {
  urlbar.progressFraction = webview.estimatedLoadProgress;
  if (urlbar.progressFraction === 1) {
    setTimeout(() => {
      urlbar.progressFraction = 0;
    }, 500);
  }
});
		}
	}
)

new Tangent().run([programInvocationName].concat(programArgs))
