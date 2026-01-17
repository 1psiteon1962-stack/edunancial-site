"use client";

import { useState } from "react";
import { AgeRange, BusinessStatus } from "@/lib/types/user-profile";

export default function SignupForm() {
  const [hasBusiness, setHasBusiness] = useState(false);

  return (
    <form
      method="post"
      action="/api/signup"
      style={{ maxWidth: 520, marginTop: 24 }}
    >
      <input name="firstName" placeholder="First name" required />
      <input name="lastName" placeholder="Last name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="phone" placeholder="Phone (optional)" />

      <select name="ageRange" required>
        <option value="">Age Range</option>
        <option value="18_24">18–24</option>
        <option value="25_34">25–34</option>
        <option value="35_44">35–44</option>
        <option value="45_54">45–54</option>
        <option value="55_64">55–64</option>
        <option value="65_plus">65+</option>
      </select>

      <select name="country" required>
        <option value="">Country</option>
        <option value="US">United States</option>
      </select>

      <label>
        <input
          type="checkbox"
          name="hasBusiness"
          onChange={(e) => setHasBusiness(e.target.checked)}
        />
        I already have a business
      </label>

      {hasBusiness && (
        <>
          <input name="businessName" placeholder="Business name" />

          <select name="businessStatus">
            <option value="">Business type</option>
            <option value="informal_business">Informal</option>
            <option value="formal_llc">LLC</option>
            <option value="formal_corp">Corporation</option>
            <option value="other">Other</option>
          </select>

          <input
            name="businessJurisdiction"
            placeholder="State or country of formation"
          />
        </>
      )}

      <button type="submit">Continue</button>
    </form>
  );
}
