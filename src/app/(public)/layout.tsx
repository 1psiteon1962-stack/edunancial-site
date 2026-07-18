import { InternationalPreferencesProvider } from "@/components/international/InternationalPreferencesProvider";
import { Providers } from "@/components/Providers";
import SiteChrome from "@/components/layout/SiteChrome";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <InternationalPreferencesProvider>
        <SiteChrome>{children}</SiteChrome>
      </InternationalPreferencesProvider>
    </Providers>
  );
}
