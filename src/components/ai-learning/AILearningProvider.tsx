"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { useAuth } from "@/lib/authContext";

import {
  AI_LEARNING_CONTEXT_SESSION_KEY,
  buildAILearningContext,
  mergeContextAcrossNavigation,
  safeLoadContextFromSessionStorage,
  safeSaveContextToSessionStorage,
  type AILearningContext,
  type MembershipStatus,
} from "@/lib/ai-learning/context";
import {
  AI_LEARNING_ADMIN_STORAGE_KEY,
  DEFAULT_AI_LEARNING_CONFIG,
  mergeAILearningConfig,
  type AILearningAdminConfig,
} from "@/lib/ai-learning/config";
import type { AILearningResponse } from "@/lib/ai-learning/service";

type AILearningContextValue = {
  context: AILearningContext | null;
  config: AILearningAdminConfig;
  askCoach: (message: string) => Promise<AILearningResponse>;
};

const AILearningContextContainer = createContext<AILearningContextValue>({
  context: null,
  config: DEFAULT_AI_LEARNING_CONFIG,
  askCoach: async () => ({
    enabled: false,
    message: "AI Learning Network unavailable.",
    suggestions: [],
    disclaimers: [],
    milestone: null,
    contextSummary: "",
  }),
});

function resolveMembershipStatus(value: string | undefined): MembershipStatus {
  if (!value) return "public";

  if (value === "free" || value === "basic" || value === "premium" || value === "enterprise" || value === "beta") {
    return value;
  }

  return "public";
}

function loadAdminConfig(): AILearningAdminConfig {
  if (typeof window === "undefined") {
    return DEFAULT_AI_LEARNING_CONFIG;
  }

  try {
    const raw = localStorage.getItem(AI_LEARNING_ADMIN_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_AI_LEARNING_CONFIG;
    }

    return mergeAILearningConfig(JSON.parse(raw) as Partial<AILearningAdminConfig>);
  } catch {
    return DEFAULT_AI_LEARNING_CONFIG;
  }
}

export function AILearningProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { effectiveLanguage, preferences } = useInternationalPreferences();
  const { user } = useAuth();

  const [config, setConfig] = useState<AILearningAdminConfig>(DEFAULT_AI_LEARNING_CONFIG);
  const [context, setContext] = useState<AILearningContext | null>(null);

  useEffect(() => {
    const loadedConfig = loadAdminConfig();
    setConfig(loadedConfig);

    const onStorage = (event: StorageEvent) => {
      if (event.key === AI_LEARNING_ADMIN_STORAGE_KEY) {
        setConfig(loadAdminConfig());
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const current = buildAILearningContext({
      pathname,
      language: effectiveLanguage,
      membership: resolveMembershipStatus(user?.membershipTier),
      country: preferences.country,
      jurisdiction: preferences.country,
    });

    const previous = safeLoadContextFromSessionStorage();
    const merged = mergeContextAcrossNavigation(previous, current);

    safeSaveContextToSessionStorage(merged);
    setContext(merged);
  }, [pathname, effectiveLanguage, preferences.country, user?.membershipTier]);

  const value = useMemo<AILearningContextValue>(
    () => ({
      context,
      config,
      askCoach: async (message: string) => {
        if (!context) {
          return {
            enabled: false,
            message: "AI context is still loading.",
            suggestions: [],
            disclaimers: [],
            milestone: null,
            contextSummary: "",
          };
        }

        const response = await fetch("/api/ai-learning/respond", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, context, config }),
        });

        if (!response.ok) {
          return {
            enabled: false,
            message: "AI Learning Network is temporarily unavailable.",
            suggestions: ["Try again shortly"],
            disclaimers: [],
            milestone: null,
            contextSummary: context.track ?? "",
          };
        }

        return (await response.json()) as AILearningResponse;
      },
    }),
    [context, config],
  );

  return (
    <AILearningContextContainer.Provider value={value}>
      {children}
    </AILearningContextContainer.Provider>
  );
}

export function useAILearning() {
  return useContext(AILearningContextContainer);
}

export { AI_LEARNING_CONTEXT_SESSION_KEY };
