export const GA_EVENTS = {
	CLICK_ADDRESS: "click_address",
	CLICK_AVIS: "click_avis",
	CLICK_CONTACT: "click_contact",
	CLICK_DEVIS: "click_devis",
	CLICK_EMAIL: "click_email",
	CLICK_PHONE: "click_phone",
	CLICK_WHATSAPP: "click_whatsapp",
} as const

export type GAEvent = (typeof GA_EVENTS)[keyof typeof GA_EVENTS]
