<script>
	import Adw from "gi://Adw"
	import { setContext, getContext, onMount } from "svelte"

	export let title = "My Window!"
	export let default_width = 200
	export let default_height = 200

	const application = getContext("gtk.app")
	const win = new Adw.Window({
		title,
		default_width,
		default_height,
		application,
	})

	setContext("gtk.window", win)
	setContext("gtk.parent", win)

	onMount(() => win.present())
</script>

<slot />
