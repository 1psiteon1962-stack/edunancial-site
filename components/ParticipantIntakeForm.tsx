"use client";

import { useState } from "react";

export default function ParticipantIntakeForm() {
  const [hasBusiness, setHasBusiness] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    await fetch("/api/participants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <input name="firstName" placeholder="First name" required />
      <input name="lastName" placeholder="Last name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="phone" placeholder="Phone" required />

      <input name="country" placeholder="Country" required />
      <input name="state" placeholder="State / Province" required />
      <input name="city" placeholder="City" required />
      <input name="postalCode" placeholder="Postal code" required />

      <label>
        <input
          type="checkbox"
          onChange={(e) => setHasBusiness(e.target.checked)}
        />
        I have already started a business
      </label>

      {hasBusiness && (
        <>
          <input name="businessName" placeholder="Business name" />
          <input name="businessCountry" placeholder="Business country" />
          <input name="businessState" placeholder="Business state" />
          <select name="businessType">
            <option value="">Select business type</option>
            <option value="informal">Informal</option>
            <option value="sole_proprietor">Sole proprietor</option>
            <option value="llc">LLC</option>
            <option value="corporation">Corporation</option>
            <option value="partnership">Partnership</option>
          </select>
        </>
      )}

      <button type="submit">Continue</button>
    </form>
  );
}
