"use client";

export default function BookUploadForm() {

  return (

    <form className="space-y-6 rounded-3xl bg-[#151b2d] p-10">

      <input
        placeholder="Book Title"
        className="w-full rounded-xl bg-[#0a0f1e] p-4"
      />

      <input
        placeholder="Author"
        className="w-full rounded-xl bg-[#0a0f1e] p-4"
      />

      <textarea
        rows={6}
        placeholder="Book Description"
        className="w-full rounded-xl bg-[#0a0f1e] p-4"
      />

      <input
        placeholder="Price"
        className="w-full rounded-xl bg-[#0a0f1e] p-4"
      />

      <select className="w-full rounded-xl bg-[#0a0f1e] p-4">

        <option>Blue - Business</option>

        <option>Red - Real Estate</option>

        <option>White - Paper Assets</option>

      </select>

      <label className="block">

        Cover Image

        <input
          type="file"
          className="mt-2 w-full"
        />

      </label>

      <label className="block">

        eBook PDF

        <input
          type="file"
          className="mt-2 w-full"
        />

      </label>

      <input
        placeholder="Square Checkout URL"
        className="w-full rounded-xl bg-[#0a0f1e] p-4"
      />

      <button
        className="w-full rounded-xl bg-blue-600 py-4 text-xl font-bold"
      >
        Publish Book
      </button>

    </form>

  );

}
