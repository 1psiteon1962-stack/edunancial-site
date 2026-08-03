import { InternationalPreferencesProvider } from "@/components/international/InternationalPreferencesProvider";
import { Providers } from "@/components/Providers";
import { AILearningProvider } from "@/components/ai-learning/AILearningProvider";
import SiteChrome from "@/components/layout/SiteChrome";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <InternationalPreferencesProvider>
        <AILearningProvider>
          <SiteChrome>{children}</SiteChrome>
        </AILearningProvider>
      </InternationalPreferencesProvider>
    </Providers>
  );
}
