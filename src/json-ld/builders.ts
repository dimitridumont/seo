type Address = {
	street: string
	city: string
	region: string
	postalCode: string
	country: string
}

type GeoCoordinates = {
	latitude: number
	longitude: number
}

type OpeningHours = {
	days: string[]
	opens: string
	closes: string
}

type AggregateRating = {
	value: number
	count: number
	bestRating?: number
	worstRating?: number
}

type Review = {
	name: string
	text: string
	rating?: number
}

type Service = {
	name: string
	description: string
	url?: string
}

type AreaServed = {
	type: "Country" | "AdministrativeArea" | "City"
	name: string
	sameAs?: string
}

type LocalBusinessOptions = {
	type?: string | string[]
	name: string
	legalName?: string
	description: string
	url: string
	email: string
	telephone: string
	address: Address
	geo: GeoCoordinates
	areaServed?: AreaServed[]
	openingHours: OpeningHours | OpeningHours[]
	aggregateRating?: AggregateRating
	reviews?: Review[]
	services?: Service[]
	priceRange?: string
	siret?: string
	logo?: string
	images?: string[]
	sameAs?: string[]
	googleMapsUrl?: string
}

export const buildLocalBusinessSchema = (options: LocalBusinessOptions) => {
	const base: Record<string, unknown> = {
		"@context": "https://schema.org",
		"@id": `${options.url}/#localbusiness`,
		"@type": options.type ?? "LocalBusiness",
		address: {
			"@type": "PostalAddress",
			addressCountry: options.address.country,
			addressLocality: options.address.city,
			addressRegion: options.address.region,
			postalCode: options.address.postalCode,
			streetAddress: options.address.street,
		},
		description: options.description,
		email: options.email,
		geo: {
			"@type": "GeoCoordinates",
			latitude: options.geo.latitude,
			longitude: options.geo.longitude,
		},
		name: options.name,
		telephone: options.telephone,
		url: options.url,
	}

	if (options.legalName) base.legalName = options.legalName
	if (options.priceRange) base.priceRange = options.priceRange
	if (options.logo) base.logo = options.logo
	if (options.images) base.image = options.images
	if (options.sameAs) base.sameAs = options.sameAs
	if (options.googleMapsUrl) base.hasMap = options.googleMapsUrl

	if (options.siret) {
		base.identifier = {
			"@type": "PropertyValue",
			name: "SIRET",
			value: options.siret,
		}
	}

	if (options.areaServed) {
		base.areaServed = options.areaServed.map((a) => ({
			"@type": a.type,
			name: a.name,
			...(a.sameAs ? { sameAs: a.sameAs } : {}),
		}))
	}

	const hoursArray = Array.isArray(options.openingHours)
		? options.openingHours
		: [options.openingHours]

	base.openingHoursSpecification = hoursArray.map((h) => ({
		"@type": "OpeningHoursSpecification",
		closes: h.closes,
		dayOfWeek: h.days,
		opens: h.opens,
	}))

	if (options.aggregateRating) {
		base.aggregateRating = {
			"@type": "AggregateRating",
			bestRating: options.aggregateRating.bestRating ?? 5,
			ratingValue: options.aggregateRating.value,
			reviewCount: options.aggregateRating.count,
			worstRating: options.aggregateRating.worstRating ?? 1,
		}
	}

	if (options.reviews) {
		base.review = options.reviews.map((r) => ({
			"@type": "Review",
			author: { "@type": "Person", name: r.name },
			reviewBody: r.text.replace(/\n/g, " ").trim(),
			reviewRating: {
				"@type": "Rating",
				bestRating: 5,
				ratingValue: r.rating ?? 5,
				worstRating: 1,
			},
		}))
	}

	if (options.services) {
		base.hasOfferCatalog = {
			"@type": "OfferCatalog",
			itemListElement: options.services.map((s) => ({
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					description: s.description,
					name: s.name,
					...(s.url ? { url: s.url } : {}),
				},
			})),
		}
	}

	return base
}

export const buildWebsiteSchema = (options: {
	name: string
	description: string
	url: string
	language?: string
}) => ({
	"@context": "https://schema.org",
	"@id": `${options.url}/#website`,
	"@type": "WebSite",
	description: options.description,
	inLanguage: options.language ?? "fr-FR",
	name: options.name,
	publisher: { "@id": `${options.url}/#organization` },
	url: options.url,
})

export const buildOrganizationSchema = (options: {
	name: string
	description: string
	url: string
	email: string
	telephone: string
	address: Address
	logo?: { url: string; width: number; height: number }
	ogImage?: string
	sameAs?: string[]
}) => ({
	"@context": "https://schema.org",
	"@id": `${options.url}/#organization`,
	"@type": "Organization",
	address: {
		"@type": "PostalAddress",
		addressCountry: options.address.country,
		addressLocality: options.address.city,
		addressRegion: options.address.region,
		postalCode: options.address.postalCode,
		streetAddress: options.address.street,
	},
	description: options.description,
	email: options.email,
	...(options.ogImage ? { image: options.ogImage } : {}),
	...(options.logo
		? {
				logo: {
					"@type": "ImageObject",
					height: options.logo.height,
					url: options.logo.url,
					width: options.logo.width,
				},
			}
		: {}),
	name: options.name,
	...(options.sameAs ? { sameAs: options.sameAs } : {}),
	telephone: options.telephone,
	url: options.url,
})

export const buildFaqSchema = (
	questions: Array<{ question: string; answer: string }>,
) => ({
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: questions.map((q) => ({
		"@type": "Question",
		acceptedAnswer: {
			"@type": "Answer",
			text: q.answer,
		},
		name: q.question,
	})),
})

export const buildBreadcrumbSchema = (
	baseUrl: string,
	items: Array<{ name: string; path?: string }>,
) => ({
	"@context": "https://schema.org",
	"@type": "BreadcrumbList",
	itemListElement: items.map((item, index) => ({
		"@type": "ListItem",
		item: item.path ? `${baseUrl}${item.path}` : baseUrl,
		name: item.name,
		position: index + 1,
	})),
})

export const buildServiceSchema = (options: {
	baseUrl: string
	id: string
	name: string
	description: string
	serviceType: string
	offers: unknown
	providerName: string
	areaServed?: AreaServed[]
}) => ({
	"@context": "https://schema.org",
	"@id": `${options.baseUrl}${options.id}`,
	"@type": "Service",
	description: options.description,
	name: options.name,
	offers: options.offers,
	provider: {
		"@id": `${options.baseUrl}/#localbusiness`,
		"@type": "ProfessionalService",
		name: options.providerName,
	},
	serviceType: options.serviceType,
	...(options.areaServed
		? {
				areaServed: options.areaServed.map((a) => ({
					"@type": a.type,
					name: a.name,
				})),
			}
		: {}),
})
