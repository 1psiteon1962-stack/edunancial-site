// components/LocalizedDoctrine.tsx

import { t } from "@/lib/i18n";

export default function LocalizedDoctrine() {
  return (
    <section style={{ maxWidth: "720px", margin: "3rem auto" }}>
      <h2 style={{ fontSize: "1.75rem", fontWeight: 600 }}>
        {t("Our Mission")}
      </h2>

      <p style={{ marginTop: "1rem", fontSize: "1.05rem", lineHeight: 1.6 }}>
        {t(
          "Edunancial exists to provide practical financial literacy across regions, cultures, and legal systems—without selling hype, speculation, or false promises."
        )}
      </p>
    </section>
  );
}
