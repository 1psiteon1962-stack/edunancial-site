"use client";

import Image from "next/image";
import Link from "next/link";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export interface VideoSource {
  type: "mp4" | "youtube" | "vimeo";
  src: string;
  poster?: string;
}

export interface SubtitleTrack {
  src: string;
  srclang: string;
  label: string;
  default?: boolean;
}

export interface SuccessStory {
  id: string;
  name: string;
  country: string;
  language: string;
  profileImage?: string;
  video?: VideoSource;
  subtitleTracks?: SubtitleTrack[];
  summary: string;
  lessonsLearned: string[];
  ctaLabel: string;
  ctaHref: string;
}

interface MemberSuccessStoriesProps {
  stories?: SuccessStory[];
}

function StoryVideoPlayer({
  video,
  subtitleTracks,
  name,
  unsupportedLabel,
}: {
  video: VideoSource;
  subtitleTracks?: SubtitleTrack[];
  name: string;
  unsupportedLabel: string;
}) {
  if (video.type === "mp4") {
    return (
      <video
        className="w-full rounded-2xl"
        style={{ aspectRatio: "16 / 9" }}
        controls
        playsInline
        preload="metadata"
        poster={video.poster}
        aria-label={`${name} success story video`}
      >
        <source src={video.src} type="video/mp4" />
        {subtitleTracks?.map((track) => (
          <track
            key={track.srclang}
            kind={track.default ? "captions" : "subtitles"}
            src={track.src}
            srcLang={track.srclang}
            label={track.label}
            default={track.default}
          />
        ))}
        {unsupportedLabel}
      </video>
    );
  }

  if (video.type === "youtube") {
    return (
      <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "16 / 9" }}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${video.src}?enablejsapi=1&cc_load_policy=1&rel=0`}
          title={`${name} success story video`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  if (video.type === "vimeo") {
    return (
      <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "16 / 9" }}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://player.vimeo.com/video/${video.src}?texttrack=en&byline=0&portrait=0`}
          title={`${name} success story video`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return null;
}

function StoryCard({ story, lessonsTitle, unsupportedLabel }: { story: SuccessStory; lessonsTitle: string; unsupportedLabel: string }) {
  return (
    <article aria-label={`Success story: ${story.name}`} className="rounded-3xl border border-white/10 bg-slate-950/60 p-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex shrink-0 flex-col items-center gap-4 lg:w-48">
          {story.profileImage ? (
            <Image
              src={story.profileImage}
              alt={`${story.name} profile photo`}
              width={96}
              height={96}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-700 text-2xl font-black text-white" aria-hidden="true">
              {story.name.charAt(0)}
            </div>
          )}
          <div className="text-center">
            <p className="font-black text-white">{story.name}</p>
            <p className="mt-1 text-sm text-slate-400">{story.country}</p>
            <p className="text-sm text-slate-400">{story.language}</p>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          {story.video && (
            <div className="mb-6">
              <StoryVideoPlayer
                video={story.video}
                subtitleTracks={story.subtitleTracks}
                name={story.name}
                unsupportedLabel={unsupportedLabel}
              />
            </div>
          )}

          <p className="text-base leading-7 text-slate-300">{story.summary}</p>

          {story.lessonsLearned.length > 0 && (
            <div className="mt-6">
              <h4 className="font-bold text-white">{lessonsTitle}</h4>
              <ul className="mt-3 space-y-2" aria-label={lessonsTitle}>
                {story.lessonsLearned.map((lesson, index) => (
                  <li key={index} className="flex gap-3 text-sm leading-6 text-slate-300">
                    <span className="mt-0.5 shrink-0 text-yellow-400" aria-hidden="true">
                      •
                    </span>
                    {lesson}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link
            href={story.ctaHref}
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08101f]"
          >
            {story.ctaLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function MemberSuccessStories({ stories = [] }: MemberSuccessStoriesProps) {
  const { t } = useInternationalPreferences();

  return (
    <section aria-labelledby="homepage-success-stories-heading" className="mx-auto max-w-7xl px-6 py-16 md:py-20">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">{t("memberStories.eyebrow")}</p>
        <h2 id="homepage-success-stories-heading" className="mt-4 text-3xl font-black sm:text-4xl md:text-5xl">
          {t("memberStories.heading")}
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{t("memberStories.body")}</p>
      </div>

      {stories.length > 0 && (
        <div className="mt-12 flex flex-col gap-12">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              lessonsTitle={t("memberStories.lessonsLearned")}
              unsupportedLabel={t("memberStories.videoUnsupported")}
            />
          ))}
        </div>
      )}
    </section>
  );
}
