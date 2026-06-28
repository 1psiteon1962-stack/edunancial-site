"use client";

import { useState } from "react";
import { supportedLanguages } from "@/lib/i18n";

export default function LanguageSelector() {

  const [language, setLanguage] = useState("en");

  function changeLanguage(code: string) {

    setLanguage(code);

    localStorage.setItem(
      "edunancial-language",
      code
    );

    window.location.reload();

  }

  return (

    <select
      value={language}
      onChange={(e) => changeLanguage(e.target.value)}
      className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white"
    >

      {supportedLanguages.map((item) => (

        <option
          key={item.code}
          value={item.code}
        >
          {item.flag} {item.name}
        </option>

      ))}

    </select>

  );

}
