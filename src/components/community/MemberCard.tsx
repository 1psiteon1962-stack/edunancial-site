import Link from "next/link";
import type { CommunityMember } from "@/types/community";
import { BADGE_LABELS, BADGE_COLORS, CATEGORY_LABELS } from "@/data/community";

interface MemberCardProps {
  member: CommunityMember;
  rank?: number;
}

export default function MemberCard({ member, rank }: MemberCardProps) {
  const badge = member.badge;

  return (
    <article className="rounded-xl bg-slate-800 p-6 flex items-start gap-4">
      {rank !== undefined && (
        <div className="shrink-0 w-8 text-center font-black text-yellow-400 text-xl">
          #{rank}
        </div>
      )}
      <div
        className={`h-12 w-12 rounded-full ${member.avatarColor} flex items-center justify-center font-bold text-white shrink-0`}
        aria-hidden="true"
      >
        {member.avatarInitials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-white">{member.displayName}</span>
          <span
            className={`inline-block rounded-full border px-2 py-0.5 text-xs ${BADGE_COLORS[badge]}`}
          >
            {BADGE_LABELS[badge]}
          </span>
        </div>

        {member.bio && (
          <p className="mt-1 text-sm text-slate-400 line-clamp-2">{member.bio}</p>
        )}

        {member.expertise && member.expertise.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {member.expertise.map((e) => (
              <Link
                key={e}
                href={`/community/forum/${e}`}
                className="inline-block rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-300 hover:text-yellow-400 transition-colors"
              >
                {CATEGORY_LABELS[e] ?? e}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
          <span>
            <strong className="text-yellow-400">{member.reputationPoints.toLocaleString()}</strong>{" "}
            rep
          </span>
          <span>
            <strong className="text-green-400">{member.helpfulAnswers}</strong>{" "}
            helpful
          </span>
          <span>
            <strong className="text-blue-400">{member.threadCount}</strong>{" "}
            threads
          </span>
          <span>
            <strong className="text-slate-300">{member.postCount.toLocaleString()}</strong>{" "}
            posts
          </span>
        </div>
      </div>
    </article>
  );
}
