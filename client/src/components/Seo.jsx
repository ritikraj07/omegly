import { Helmet } from "react-helmet-async";

// TODO: replace with your real production domain (no trailing slash)
export const SITE_URL = "https://www.omegly.in";
export const SITE_NAME = "Omegly";

/**
 * Per-page head tags. Needs <HelmetProvider> around <App /> (see setup notes).
 *
 * <Seo title="..." description="..." path="/" faqs={FAQS} />
 * <Seo title="Chat" path="/chat" noindex />
 */
export default function Seo({
    title='Omegly',
    description="free stranger talk",
    path = "/",
    noindex = false,
    faqs,
    image = `${SITE_URL}/og-image.png`, // 1200x630 recommended
}) {
    const url = `${SITE_URL}${path}`;

    const jsonLd = [];

    if (path === "/") {
        jsonLd.push(
            {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: SITE_NAME,
                url: SITE_URL,
            },
            {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: SITE_NAME,
                url: SITE_URL,
                applicationCategory: "SocialNetworkingApplication",
                operatingSystem: "Any (web browser)",
                description,
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            }
        );
    }

    if (faqs?.length) {
        jsonLd.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
        });
    }

    return (
        <Helmet>
            <title>{title}</title>
            {description && <meta name="description" content={description} />}
            <link rel="canonical" href={url} />
            <meta
                name="robots"
                content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"}
            />

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:title" content={title} />
            {description && <meta property="og:description" content={description} />}
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            {description && <meta name="twitter:description" content={description} />}
            <meta name="twitter:image" content={image} />

            {jsonLd.map((obj, i) => (
                <script key={i} type="application/ld+json">
                    {JSON.stringify(obj)}
                </script>
            ))}
        </Helmet>
    );
}