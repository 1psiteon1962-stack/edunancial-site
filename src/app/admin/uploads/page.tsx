export default function UploadManagerPage() {

  return (

    <main className="min-h-screen bg-[#08101f] text-white p-10">

      <h1 className="text-6xl font-black">

        Upload Manager

      </h1>

      <p className="mt-6 text-xl text-gray-300">

        Upload books, courses, PDFs, audio books and marketing materials.

      </p>

      <div className="grid gap-6 mt-12">

        <input
          type="file"
          className="rounded-xl bg-[#101a2f] p-4"
        />

        <select
          className="rounded-xl bg-[#101a2f] p-4"
        >
          <option>Book</option>
          <option>Course</option>
          <option>Audio Book</option>
          <option>Workbook</option>
          <option>Financial Terms</option>
        </select>

        <button
          className="rounded-xl bg-blue-600 p-4 font-bold"
        >
          Upload
        </button>

      </div>

    </main>

  );

}
