import { redirect } from "next/navigation";

/*
  Root route for Edunancial.
  Netlify requires this file to exist or "/" will be blank.
*/

export default function Page() {
  let region = "us";

  if (typeof navigator !== "undefined") {
    const lang = navigator.language?.toLowerCase() || "";
    if (lang.startsWith("es")) region = "latam";
  }

  redirect(`/${region}`);
}
