import Link from "next/link";
import { getActiveAnnouncement } from "@/lib/communications/platform";

export default function AnnouncementBar() {
  const announcement = getActiveAnnouncement();

  return (
    <div className="bg-blue-700 py-3 text-center font-bold text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 px-4 text-sm md:flex-row md:text-base">
        <span>{announcement.title}</span>
        <span className="hidden md:inline" aria-hidden="true">
          •
        </span>
        <Link href={announcement.href} className="underline underline-offset-4 hover:text-blue-100">
          {announcement.callToAction}
        </Link>
      </div>
    </div>
  );
}
