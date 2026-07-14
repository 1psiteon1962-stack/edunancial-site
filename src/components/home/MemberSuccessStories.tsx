"use client";

import Image from "next/image";
import Link from "next/link";

import { useNorthAmericaLaunchLanguage } from "@/components/international/BilingualContent";

export interface VideoSource {
  /** "mp4" uses a native <video> element; "youtube" and "vimeo" use responsive iframes. */
  type: "mp4" | "youtube" | "vimeo";
  /**
   * MP4: full URL (e.g. "https://cdn.example.com/story.mp4").
   * YouTube: video ID (e.g. "dQw4w9WgXcQ").
   * Vimeo: video ID (e.g. "123456789").
   */
  src: string;
  /** Poster / thumbnail image URL used for MP4 before playback begins. */
  poster?: string;
}

export interface SubtitleTrack {
  /** URL to a WebVTT (.vtt) caption or subtitle file. */
  src: string;
  /** BCP-47 language tag, e.g. "en", "es", "fr". */
  srclang: string;
  /** Human-readable label shown in the browser track menu. */
  label: string;
  /** Set true to enable this track by default (use for closed-captions). */
  default?: boolean;
}

export interface SuccessStory {
  /** Unique identifier used as the React key. */
  id: string;
  name: string;
  country: string;
  /** Primary language of the story, e.g. "English", "Luganda". */
  language: string;
  /** Absolute URL or a path inside /public for the member's profile photo. */
  profileImage?: string;
  video?: VideoSource;
  /**
   * Caption / subtitle tracks for MP4 playback.
   * YouTube and Vimeo load their own caption tracks via their respective APIs.
   */
  subtitleTracks?: SubtitleTrack[];
  /** Short paragraph summarising the member's experience. */
  summary: string;
  /** Bullet-point list of takeaways or lessons the member learned. */
  lessonsLearned: string[];
  ctaLabel: string;
  ctaHref: string;
}

interface MemberSuccessStoriesProps {
  /**
   * Array of SuccessStory objects to render.
   * Pass an empty array (or omit) while content is being gathered — the
   * section heading and placeholder will still render so the layout is
   * ready for stories to be added via configuration alone.
   */
  stories?: SuccessStory[];
}

// ---------------------------------------------------------------------------
// Video player sub-component
// ---------------------------------------------------------------------------

function StoryVideoPlayer({
  video,
  subtitleTracks,
  name,
}: {
  video: VideoSource;
  subtitleTracks?: SubtitleTrack[];
  name: string;
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
        Your browser does not support the video element.
      </video>
    );
  }

  if (video.type === "youtube") {
    return (
      <div
        className="relative w-full overflow-hidden rounded-2xl"
        style={{ aspectRatio: "16 / 9" }}
      >
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
      <div
        className="relative w-full overflow-hidden rounded-2xl"
        style={{ aspectRatio: "16 / 9" }}
      >
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

// ---------------------------------------------------------------------------
// Story card sub-component
// ---------------------------------------------------------------------------

function StoryCard({ story }: { story: SuccessStory }) {
  return (
    <article
      aria-label={`Success story: ${story.name}`}
      className="rounded-3xl border border-white/10 bg-slate-950/60 p-8"
    >
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Profile identity */}
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
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-700 text-2xl font-black text-white"
              aria-hidden="true"
            >
              {story.name.charAt(0)}
            </div>
          )}
          <div className="text-center">
            <p className="font-black text-white">{story.name}</p>
            <p className="mt-1 text-sm text-slate-400">{story.country}</p>
            <p className="text-sm text-slate-400">{story.language}</p>
          </div>
        </div>

        {/* Story content */}
        <div className="min-w-0 flex-1">
          {story.video && (
            <div className="mb-6">
              <StoryVideoPlayer
                video={story.video}
                subtitleTracks={story.subtitleTracks}
                name={story.name}
              />
            </div>
          )}

          <p className="text-base leading-7 text-slate-300">{story.summary}</p>

          {story.lessonsLearned.length > 0 && (
            <div className="mt-6">
              <h4 className="font-bold text-white">Lessons learned</h4>
              <ul className="mt-3 space-y-2" aria-label="Lessons learned">
                {story.lessonsLearned.map((lesson, index) => (
                  <li
                    key={index}
                    className="flex gap-3 text-sm leading-6 text-slate-300"
                  >
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

// ---------------------------------------------------------------------------
// Section component (default export)
// ---------------------------------------------------------------------------

export default function MemberSuccessStories({
  stories = [],
}: MemberSuccessStoriesProps) {
  const language = useNorthAmericaLaunchLanguage();

  return (
    <section
      aria-labelledby="homepage-success-stories-heading"
      className="mx-auto max-w-7xl px-6 py-16 md:py-20"
    >
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">
          {language === "es" ? "Historias de éxito de miembros" : "Member Success Stories"}
        </p>
        <h2
          id="homepage-success-stories-heading"
          className="mt-4 text-3xl font-black sm:text-4xl md:text-5xl"
        >
          {language === "es" ? "Resultados reales de miembros reales" : "Real results from real members"}
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          {language === "es"
            ? "Las experiencias y resultados de los miembros se compartirán aquí a medida que se recopilen de la comunidad."
            : "Member experiences and outcomes will be shared here as they are gathered from the community."}
        </p>
      </div>

      {stories.length > 0 && (
        <div className="mt-12 flex flex-col gap-12">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </section>
  );
}
