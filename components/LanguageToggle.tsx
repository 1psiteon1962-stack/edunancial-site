'use client';

export type Language = 'en' | 'es';

export type LanguageToggleProps = {
  value: Language;
  onChange: (lang: Language) => void;
};

export default function LanguageToggle({
  value,
  onChange,
}: LanguageToggleProps) {
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
