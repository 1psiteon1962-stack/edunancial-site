import { InternationalPreferencesProvider } from "@/components/international/InternationalPreferencesProvider";
import NetworkCountrySync from "@/components/international/NetworkCountrySync";
import { Providers } from "@/components/Providers";
import { AILearningProvider } from "@/components/ai-learning/AILearningProvider";
import SiteChrome from "@/components/layout/SiteChrome";
import { getServerLanguage } from "@/lib/international/server";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialLanguage = await getServerLanguage();

  return (
    <Providers>
      <InternationalPreferencesProvider initialLanguage={initialLanguage}>
        <NetworkCountrySync />
        <AILearningProvider>
          <SiteChrome>{children}</SiteChrome>
        </AILearningProvider>
      </InternationalPreferencesProvider>
    </Providers>
  );
}
