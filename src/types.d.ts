declare module "gi://Adw*"
/**
 * > "[slur]-[expletive] [slur], get trolled"
 *
 * ―[Kankan, chorus of "Get Trolled"](https://youtu.be/aIzMD_I2Zj4?t=22)
 *
 * ---
 * `troll` is:
 * 1. An implementation of common JavaScript APIs for gjs
 * 2. some helpers for using GTK with gjs
 * 3. gjspack, the gjs bundler
 */
declare module "troll" {
	/**
	 * A helper function to easily load, build and bind a GTK XML interface.
	 */
	function build(url: string, params?: unknown): any // i forgor :skull:
}
declare module "*.blp"
declare module "*.css"
declare module "*.svg"

/**
 * implementation of common JavaScript globals for gjs
 */
declare module "troll/globals.js" {
	declare global {
		var atob: (str: string) => string
		var btoa: (str: string) => string
		// TODO: Fetch, WebSocket, are in troll but I haven't typed them yet
	}
}
