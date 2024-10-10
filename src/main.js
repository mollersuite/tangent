/// <reference types="gjs/dom" />
// import WebKit2 from "gi://WebKit?version=6.0"
import GObject from "gi://GObject"
import Gio from "gi://Gio"
import Gtk from "gi://Gtk?version=4.0"
import Adw from "gi://Adw?version=1"
import GLib from "gi://GLib"
import App from "./App.svelte"

GLib.set_application_name("Tangent")

window.document = {
	createTextNode() {
		return {}
	},
}

window.CustomEvent = class CustomEvent {
	constructor(name, options) {
		this.name = name
		this.options = options
	}
}

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
		}

		vfunc_activate() {
			super.vfunc_activate()
			const window = new App({
				context: new Map([["gtk.app", this]]),
				target: {
					insertBefore: () => {},
				},
			})
		}
	}
)

new Tangent().runAsync([])
