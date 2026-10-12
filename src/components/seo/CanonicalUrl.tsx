type Props = {
  path: string;
};

const SITE_URL = "https://edunancial.com";

export default function CanonicalUrl({ path }: Props) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return <link rel="canonical" href={`${SITE_URL}${normalized}`} />;
}
