import Link from "next/link";

export default function StartPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold">Start Here</h1>
      <p className="mt-4 text-lg text-gray-700">
        This is financial literacy — explained clearly. No hype. No pressure.
        Just a path you can follow.
      </p>

      <div className="mt-8 rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold">Get the Track Guide</h2>
        <p className="mt-2 text-gray-700">
          Enter your email and we’ll send you the “start point” so you know exactly
          where to begin.
        </p>

        {/* Netlify Forms (works on Netlify without extra backend) */}
        <form
          className="mt-6 space-y-4"
          name="track-guide"
          method="POST"
          action="/thanks"
          data-netlify="true"
          netlify-honeypot="bot-field"
        >
          <input type="hidden" name="form-name" value="track-guide" />

          <p className="hidden">
            <label>
              Don’t fill this out: <input name="bot-field" />
            </label>
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Name (optional)
            </label>
            <input
              name="name"
              type="text"
              className="mt-2 w-full rounded border border-gray-300 px-4 py-3"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded border border-gray-300 px-4 py-3"
              placeholder="you@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              What are you trying to improve first?
            </label>
            <select
              name="primary_goal"
              className="mt-2 w-full rounded border border-gray-300 px-4 py-3"
              defaultValue="foundation"
            >
              <option value="foundation">Understanding money & personal structure</option>
              <option value="business">Business income & business structure</option>
              <option value="investing">Investing literacy & decision-making</option>
              <option value="advanced">Scaling, systems, and long-term strategy</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-black px-6 py-4 text-white hover:bg-gray-800"
          >
            Send me the guide →
          </button>

          <p className="text-sm text-gray-600">
            By submitting, you agree to receive messages related to the guide and track steps.
            You can unsubscribe anytime.
          </p>
        </form>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/tracks"
          className="rounded border border-gray-300 px-6 py-3 text-gray-900 hover:bg-gray-50"
        >
          View all tracks
        </Link>
        <Link
          href="/faq"
          className="rounded border border-gray-300 px-6 py-3 text-gray-900 hover:bg-gray-50"
        >
          FAQs
        </Link>
      </div>
    </main>
  );
}
