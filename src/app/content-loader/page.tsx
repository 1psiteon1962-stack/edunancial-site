import ContentLoaderPortal from "@/components/content-loader/ContentLoaderPortal";

export const metadata = {
  title: "Content Loader | Edunancial",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ContentLoaderPage() {
  return <ContentLoaderPortal />;
}
