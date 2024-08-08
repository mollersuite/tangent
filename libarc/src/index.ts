
/**
 * Generate a quote embed
 * @param url The URL to redirect to. In Arc, the URL always contains a [text fragment](https://developer.mozilla.org/en-US/docs/Web/Text_fragments), but this is not validated server-side.
 * @param title The title of the webpage. Displayed
 * @param quote The quote from the webpage to display
 */
export async function quote (
	token: string,
	url: string,
	title: string,
	quote: string
): Promise<string> {
	const res = await fetch(
		"https://us-central1-bcny-arc-server.cloudfunctions.net/createRedirectLink",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				data: {
					url,
					title,
					quote,
				},
			}),
		}
	).then((res) => res.json())

	if (res.error) {
		throw new Error(`Arc API error: ${res.error.message} (${res.error.status})`)
	}
	
	return res.result.url
}
