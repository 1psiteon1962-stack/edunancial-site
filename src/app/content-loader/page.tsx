import { redirect } from "next/navigation";

export const metadata = {
  title: "Content Loader | Edunancial",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ContentLoaderPage() {
  redirect("/admin/content/upload");
}
