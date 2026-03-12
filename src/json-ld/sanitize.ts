export const sanitizeJsonLd = (schema: unknown): string =>
	JSON.stringify(schema).replace(/</g, "\\u003c")
