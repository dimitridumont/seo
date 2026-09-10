"use client"

import Script from "next/script"

type Props = {
	gaId: string
}

const buildInitScript = (gaId: string) => `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');
`

export const GoogleAnalytics = ({ gaId }: Props) => {
	if (process.env.NODE_ENV !== "production") return null

	return (
		<>
			<Script id="ga-init" strategy="afterInteractive">
				{buildInitScript(gaId)}
			</Script>
			<Script
				id="ga-tag"
				src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
				strategy="lazyOnload"
			/>
		</>
	)
}
