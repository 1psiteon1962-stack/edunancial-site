'use client';

import { useState } from 'react';

type Language = 'en' | 'es';

function LanguageToggle({
  value,
  onChange,
}: {
  value: Language;
  onChange: (lang: Language) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
      <button
        type="button"
        onClick={() => onChange('en')}
        style={{
          padding: '8px 16px',
          fontWeight: value === 'en' ? 'bold' : 'normal',
        }}
      >
        English
      </button>

      <button
        type="button"
        onClick={() => onChange('es')}
        style={{
          padding: '8px 16px',
          fontWeight: value === 'es' ? 'bold' : 'normal',
        }}
      >
        Español
      </button>
    </div>
  );
}

export default function USHomePage() {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <main style={{ padding: 24 }}>
      <LanguageToggle value={language} onChange={setLanguage} />

      <h1>
        {language === 'en'
          ? 'Welcome to Edunancial'
          : 'Bienvenido a Edunancial'}
      </h1>
    </main>
  );
}
