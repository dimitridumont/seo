export const sendGAEvent = (event: string) => {
	if (typeof window !== "undefined" && typeof window.gtag === "function") {
		window.gtag("event", event)
	}
}

declare global {
	interface Window {
		gtag?: (command: string, action: string) => void
		dataLayer?: unknown[]
	}
}
