export const sendGAEvent = (
	event: string,
	params?: Record<string, unknown>,
) => {
	if (typeof window === "undefined") return

	window.dataLayer = window.dataLayer || []

	if (typeof window.gtag !== "function") {
		window.gtag = function gtag() {
			window.dataLayer?.push(arguments)
		}
	}

	window.gtag("event", event, params)
}

declare global {
	interface Window {
		gtag?: (
			command: string,
			action: string,
			params?: Record<string, unknown>,
		) => void
		dataLayer?: unknown[]
	}
}
