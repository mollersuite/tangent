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
import Interface from "./window.blp" assert { type: "uri" }
//import meta from "../share/metainfo/surf.tangent.Tangent.metainfo.xml" assert { type: "uri" }
// import Preferences from "./settings.js"
// imports.package.init({
// 	name: "@app_id@",
// 	version: "@version@",
// 	prefix: "@prefix@",
// 	libdir: "@libdir@",
// 	datadir: "@datadir@",
// })
GLib.set_application_name("Tangent")

/**
 * @param {string} fail_url
 * @param {string} msg
 */
function error_page(fail_url, msg) {
	const error = `
	<meta name="color-scheme" content="dark light">
    <div style="text-align:center; margin:24px;">
    <h2>An error occurred while loading ${fail_url}</h2>
    <p>${msg}</p>
    </div>
  `
	return error
}

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

			const about = new Gio.SimpleAction({
				name: "about",
				parameterType: null,
			})
			about.connect("activate", () => {
				const about = Adw.AboutWindow.new_from_appdata(
					meta.replace("resource://", ""),
					""
				)
				about.set_transient_for(this.get_active_window())
				about.present()
			})
			this.add_action(about)
			const preferences = new Gio.SimpleAction({
				name: "preferences",
				parameterType: null,
			})
			preferences.connect("activate", () =>
				Preferences(this.get_active_window())
			)
			this.add_action(preferences)
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
				settings: new WebKit2.Settings({
					enableDeveloperExtras: true,
					// enableCaretBrowsing: true,
					enableHyperlinkAuditing: false,
				}),
			})

			content.append(webview)
			webview.vexpand = true
			webview.hexpand = true
			webview.load_uri("https://duckduckgo.com/lite")
			webview.bind_property(
				"uri",
				urlbar.buffer,
				"text",
				GObject.BindingFlags.DEFAULT
			)
			webview.connect("notify::estimated-load-progress", () => {
				urlbar.progressFraction = webview.estimatedLoadProgress
				if (urlbar.progressFraction === 1) {
					setTimeout(() => {
						urlbar.progressFraction = 0
					}, 500)
				}
			})
			webview.connect("load-failed", (_self, _load_event, fail_url, error) => {
				// Loading failed as a result of calling stop_loading
				if (
					error.matches(WebKit2.NetworkError, WebKit2.NetworkError.CANCELLED)
				) {
					return
				}
				webview.load_alternate_html(
					error_page(fail_url, error.message),
					fail_url,
					null
				)
			})
			urlbar.connect("activate", () => {
				let url = urlbar.buffer.text
				const scheme = GLib.Uri.peek_scheme(url)
				if (!scheme) {
					url = `https://${url}`
				}
				webview.load_uri(url)
			})
		}
	}
)

new Tangent().run([programInvocationName].concat(programArgs))
