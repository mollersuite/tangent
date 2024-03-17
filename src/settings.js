import Gio from "gi://Gio"
import Adw from "gi://Adw"
import Gtk from "gi://Gtk"

const settings = new Gio.Settings({
	schemaId: "surf.tangent.Tangent",
})

export default transient_for => {
	const window = new Adw.PreferencesWindow({})
	window.set_transient_for(transient_for)
	window.present()
}
