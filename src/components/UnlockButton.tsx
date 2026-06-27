"use client";

interface Props {
  packId: string;
}

export default function UnlockButton({
  packId,
}: Props) {

  function unlock() {
    window.location.href = `/checkout?pack=${packId}`;
  }

  return (
    <button
      onClick={unlock}
      className="mt-6 w-full rounded-xl bg-blue-600 py-4 text-xl font-bold text-white"
    >
      Unlock for $0.99
    </button>
  );
}
