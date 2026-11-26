import { Helmet } from "react-helmet-async";

// IMPORTANT: this is the public URL of the FRONTEND site, not the API server.
// Must match the domain in sitemap.xml and robots.txt (www vs non-www!).
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || "https://www.omegly.in"
).replace(/\/$/, "");
export const SITE_NAME = "Omegly";

const DEFAULT_TITLE = "Omegly: Free Random Text Chat, an Omegle Alternative";
const DEFAULT_DESCRIPTION =
  "Talk to strangers online with Omegly, a free random text chat. No sign-up, with gender, country and age filters. A simple Omegle alternative for adults 18+.";

/**
 * Per-page head tags. Needs <HelmetProvider> around <App />.
 *
 * <Seo title="..." description="..." path="/" faqs={FAQS} />
 * <Seo title="Chat" path="/chat" noindex />
 */
export default function Seo({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  noindex = false,
  faqs,
  image = `${SITE_URL}/og-image.png`, // 1200x630, must exist in /public
}) {
  const url = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;

  const jsonLd = [];

  if (path === "/") {
    jsonLd.push(
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: `${SITE_URL}/`,
      },
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        applicationCategory: "SocialNetworkingApplication",
        operatingSystem: "Any (web browser)",
        description,
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      },
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
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta
        name="robots"
        content={
          noindex
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large"
        }
      />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
}
