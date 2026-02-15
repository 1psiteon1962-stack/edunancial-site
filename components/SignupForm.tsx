"use client";

import { useState } from "react";
import { AgeRange, BusinessStatus } from "@/lib/types/user-profile";

export default function SignupForm() {
  const [hasBusiness, setHasBusiness] = useState<boolean>(false);
  const [ageRange, setAgeRange] = useState<AgeRange | "">("");
  const [businessStatus, setBusinessStatus] =
    useState<BusinessStatus>("none");

  return (
    <form className="max-w-xl space-y-6">
      <div>
        <label className="block font-medium mb-1">Age Range</label>
        <select
          value={ageRange}
          onChange={(e) => setAgeRange(e.target.value as AgeRange)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select one</option>
          <option value="under_18">Under 18</option>
          <option value="18_24">18–24</option>
          <option value="25_34">25–34</option>
          <option value="35_44">35–44</option>
          <option value="45_54">45–54</option>
          <option value="55_64">55–64</option>
          <option value="65_plus">65+</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">
          Do you currently own a business?
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={hasBusiness}
              onChange={() => setHasBusiness(true)}
            />
            Yes
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={!hasBusiness}
              onChange={() => {
                setHasBusiness(false);
                setBusinessStatus("none");
              }}
            />
            No
          </label>
        </div>
      </div>

      {hasBusiness && (
        <div>
          <label className="block font-medium mb-1">
            Business Status
          </label>
          <select
            value={businessStatus}
            onChange={(e) =>
              setBusinessStatus(e.target.value as BusinessStatus)
            }
            className="w-full border rounded px-3 py-2"
          >
            <option value="none">Select one</option>
            <option value="planning">Planning</option>
            <option value="operating">Operating</option>
            <option value="scaling">Scaling</option>
          </select>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded"
      >
        Continue
      </button>
    </form>
  );
}
