/// <reference types="gjs/dom" />
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
		}

		vfunc_activate() {
			super.vfunc_activate()

			/*** @type {{window: Gtk.ApplicationWindow, search: Gtk.SearchEntry}} */
			const { window } = build(Interface, {
				about: () => {
					const about = Adw.AboutWindow.new_from_appdata(
						meta.replace("resource://", ""),
						""
					)
					about.set_transient_for(window)
					about.present()
				},
			})
			window.set_application(this)
			window.set_icon_name("surf.tangent.Tangent")
			window.present()
			window.connect("close-request", win => win.run_dispose())
		}
	}
)

new Tangent().run([programInvocationName].concat(programArgs))
