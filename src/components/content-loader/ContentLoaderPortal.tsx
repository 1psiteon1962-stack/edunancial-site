"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type PublishStatus = {
  fileUpdated: string;
  commitSha: string;
  commitUrl: string;
  netlifyDeploymentStarted: boolean;
  netlifyDeploymentCompleted: boolean | null;
  websitePublished: boolean | null;
};

const COLORS = ["Red", "White", "Blue"] as const;
const LEVELS = ["1", "2", "3", "4", "5"] as const;
const LANGUAGES = ["English", "Spanish", "French", "Portuguese", "Arabic", "Japanese", "Korean", "Chinese"] as const;
const CATEGORIES = ["Book", "Course", "Lesson", "Article", "FAQ", "Video", "Prompt", "Other"] as const;

export default function ContentLoaderPortal() {
  const [authenticated, setAuthenticated] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");
  const [destinations, setDestinations] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [mode, setMode] = useState<"append" | "replace">("append");
  const [publishStatus, setPublishStatus] = useState<PublishStatus | null>(null);

  const [color, setColor] = useState<(typeof COLORS)[number]>("Red");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("1");
  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]>("English");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Book");
  const [destination, setDestination] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/api/content-loader/auth", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Not authenticated");
        return response.json() as Promise<{ authenticated: boolean; csrfToken?: string }>;
      })
      .then((payload) => {
        setAuthenticated(payload.authenticated);
        setCsrfToken(payload.csrfToken ?? "");
      })
      .catch(() => {
        setAuthenticated(false);
      })
      .finally(() => setLoadingAuth(false));
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    fetch("/api/content-loader/destinations", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load destinations");
        return response.json() as Promise<{ destinations: string[] }>;
      })
      .then((payload) => {
        setDestinations(payload.destinations);
        setDestination((current) => current || payload.destinations[0] || "");
      })
      .catch(() => {
        setMessage("Unable to load destination files.");
      });
  }, [authenticated]);

  const preview = useMemo(() => content || "Nothing to preview yet.", [content]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError("");
    setWorking(true);
    try {
      const response = await fetch("/api/content-loader/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const payload = await response.json() as { error?: string; csrfToken?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Unable to authenticate.");
      }
      setAuthenticated(true);
      setCsrfToken(payload.csrfToken ?? "");
      setPassword("");
    } catch (error) {
      setAuthError((error as Error).message);
    } finally {
      setWorking(false);
    }
  }

  async function handleAction(action: "save-draft" | "publish") {
    if (!destination) {
      setMessage("Please select a destination file.");
      return;
    }
    if (!content) {
      setMessage("Please paste content before continuing.");
      return;
    }

    if (action === "publish" && mode === "replace") {
      const confirmed = window.confirm("Replace will overwrite existing destination content. Continue?");
      if (!confirmed) {
        return;
      }
    }

    setWorking(true);
    setMessage("");
    setPublishStatus(null);
    try {
      const response = await fetch("/api/content-loader/actions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({
          action,
          color,
          level,
          language,
          category,
          destination,
          content,
          mode,
          confirmReplace: action === "publish" && mode === "replace",
        }),
      });
      const payload = await response.json() as {
        error?: string;
        draft?: { draftPath: string };
        publish?: PublishStatus;
      };
      if (!response.ok) {
        throw new Error(payload.error || "Action failed.");
      }

      if (action === "save-draft" && payload.draft) {
        setMessage(`Draft saved to ${payload.draft.draftPath}`);
      }
      if (action === "publish" && payload.publish) {
        setPublishStatus(payload.publish);
        setMessage("Publish completed. GitHub push succeeded.");
      }
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setWorking(false);
    }
  }

  if (loadingAuth) {
    return <main className="min-h-screen bg-[#040913] px-6 py-16 text-white">Loading Content Loader...</main>;
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#040913] px-6 py-16 text-white">
        <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-[#08101f] p-8">
          <h1 className="text-3xl font-black">Temporary Content Loader</h1>
          <p className="mt-3 text-sm text-slate-300">Enter the temporary administrator password.</p>
          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-white"
              placeholder="Temporary password"
              autoComplete="current-password"
              required
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
              disabled={working}
            >
              {working ? "Unlocking..." : "Unlock Content Loader"}
            </button>
          </form>
          {authError ? <p className="mt-4 text-sm text-red-300">{authError}</p> : null}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#040913] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-4xl font-black">Temporary Content Loader</h1>
          <p className="mt-2 text-sm text-slate-300">
            Isolated staging portal for immediate content publication into repository destinations.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <label className="space-y-2 text-sm">
            <span className="text-slate-300">Color</span>
            <select className="w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2" value={color} onChange={(event) => setColor(event.target.value as (typeof COLORS)[number])}>
              {COLORS.map((entry) => <option key={entry}>{entry}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-slate-300">Level</span>
            <select className="w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2" value={level} onChange={(event) => setLevel(event.target.value as (typeof LEVELS)[number])}>
              {LEVELS.map((entry) => <option key={entry}>{entry}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-slate-300">Language</span>
            <select className="w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2" value={language} onChange={(event) => setLanguage(event.target.value as (typeof LANGUAGES)[number])}>
              {LANGUAGES.map((entry) => <option key={entry}>{entry}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-slate-300">Content Category</span>
            <select className="w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2" value={category} onChange={(event) => setCategory(event.target.value as (typeof CATEGORIES)[number])}>
              {CATEGORIES.map((entry) => <option key={entry}>{entry}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm lg:col-span-1">
            <span className="text-slate-300">Destination</span>
            <select className="w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2" value={destination} onChange={(event) => setDestination(event.target.value)}>
              {destinations.map((entry) => <option key={entry} value={entry}>{entry}</option>)}
            </select>
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm text-slate-300">Paste Content</span>
          <textarea
            className="min-h-[600px] w-full rounded-2xl border border-white/15 bg-slate-900 px-4 py-3 font-mono text-sm leading-6 text-white"
            placeholder="Paste plain text or markdown content here..."
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button type="button" className="rounded-xl border border-white/20 px-4 py-2 font-semibold hover:border-white/40" onClick={() => setShowPreview((current) => !current)}>
            Preview
          </button>
          <button type="button" className="rounded-xl border border-white/20 px-4 py-2 font-semibold hover:border-white/40 disabled:opacity-50" onClick={() => handleAction("save-draft")} disabled={working}>
            Save Draft
          </button>
          <button type="button" className={`rounded-xl px-4 py-2 font-semibold ${mode === "append" ? "bg-emerald-600 text-white" : "border border-white/20 hover:border-white/40"}`} onClick={() => setMode("append")}>
            Append
          </button>
          <button type="button" className={`rounded-xl px-4 py-2 font-semibold ${mode === "replace" ? "bg-amber-500 text-black" : "border border-white/20 hover:border-white/40"}`} onClick={() => setMode("replace")}>
            Replace
          </button>
          <button type="button" className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-500 disabled:opacity-50" onClick={() => handleAction("publish")} disabled={working}>
            {working ? "Publishing..." : "Publish"}
          </button>
        </div>

        {showPreview ? (
          <section className="rounded-2xl border border-white/10 bg-[#08101f] p-5">
            <h2 className="text-lg font-semibold">Preview</h2>
            <pre className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-200">{preview}</pre>
          </section>
        ) : null}

        {message ? <p className="text-sm text-slate-200">{message}</p> : null}

        {publishStatus ? (
          <section className="rounded-2xl border border-blue-500/40 bg-blue-950/30 p-5 text-sm">
            <p><strong>File updated:</strong> {publishStatus.fileUpdated}</p>
            <p><strong>Commit SHA:</strong> {publishStatus.commitSha || "Unavailable"}</p>
            <p>
              <strong>GitHub commit link:</strong>{" "}
              {publishStatus.commitUrl ? (
                <a href={publishStatus.commitUrl} target="_blank" rel="noreferrer" className="text-blue-300 underline">
                  {publishStatus.commitUrl}
                </a>
              ) : (
                "Unavailable"
              )}
            </p>
            <p><strong>Netlify deployment started:</strong> {publishStatus.netlifyDeploymentStarted ? "Yes (triggered by push to main)." : "Unknown"}</p>
            <p><strong>Netlify deployment completed:</strong> {publishStatus.netlifyDeploymentCompleted === null ? "Not directly verifiable from repository integration." : publishStatus.netlifyDeploymentCompleted ? "Yes" : "No"}</p>
            <p><strong>Website successfully published:</strong> {publishStatus.websitePublished === null ? "Pending external deployment verification." : publishStatus.websitePublished ? "Yes" : "No"}</p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
