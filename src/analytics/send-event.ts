export const sendGAEvent = (
	event: string,
	params?: Record<string, unknown>,
) => {
	if (typeof window !== "undefined" && typeof window.gtag === "function") {
		window.gtag("event", event, params)
	}
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
