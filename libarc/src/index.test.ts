import { test, expect } from "bun:test"
import { quote } from "."

test("Quote from a public URL can be generated and redirects to the original URL", async () => {
	const url = await quote(
		process.env.ARC_TOKEN!,
		"https://cetera.uk",
		"Etcetera Development",
		"Wave smiley"
	)

	console.log(url)

	const res = await fetch(url).then((res) => res.text())

	// Arc's shortened URLs are not HTTP redirects
	expect(res).toContain('canonical" href="https://cetera.uk/')
})
