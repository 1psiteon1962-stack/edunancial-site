export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Edunancial",
    url: "https://www.edunancial.com",
    logo: "https://www.edunancial.com/logo.png",
    description:
      "Financial education and entrepreneurship platform.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "West Palm Beach",
      addressRegion: "Florida",
      addressCountry: "US"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}
