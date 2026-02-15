// components/SignupForm.tsx

"use client";

import { useState } from "react";
import { BusinessStatus } from "@/lib/types/user-profile";

type AgeRange =
  | "under_18"
  | "18_24"
  | "25_34"
  | "35_44"
  | "45_plus";

export default function SignupForm() {
  const [ageRange, setAgeRange] = useState<AgeRange | "">("");
  const [businessStatus, setBusinessStatus] = useState<BusinessStatus | "">("");

  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Age Range</label>
        <select
          value={ageRange}
          onChange={(e) => setAgeRange(e.target.value as AgeRange)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select</option>
          <option value="under_18">Under 18</option>
          <option value="18_24">18–24</option>
          <option value="25_34">25–34</option>
          <option value="35_44">35–44</option>
          <option value="45_plus">45+</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Business Status</label>
        <select
          value={businessStatus}
          onChange={(e) =>
            setBusinessStatus(e.target.value as BusinessStatus)
          }
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select</option>
          <option value="unregistered">Not registered yet</option>
          <option value="in_progress">In progress</option>
          <option value="registered">Already registered</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded"
      >
        Continue
      </button>
    </form>
  );
}
