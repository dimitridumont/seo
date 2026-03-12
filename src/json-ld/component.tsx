import { sanitizeJsonLd } from "./sanitize"

type Props = {
	schemas: unknown[]
}

export const JsonLdScripts = ({ schemas }: Props) => (
	<>
		{schemas.map((schema, index) => (
			<script
				dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(schema) }}
				key={index}
				type="application/ld+json"
			/>
		))}
	</>
)
