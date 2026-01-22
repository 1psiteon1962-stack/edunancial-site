'use client';

export type Language = 'en' | 'es';

type LanguageToggleProps = {
  value: Language;
  onChange: (lang: Language) => void;
};

export default function LanguageToggle({
  value,
  onChange,
}: LanguageToggleProps) {
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
      <button
        type="button"
        onClick={() => onChange('en')}
        style={{
          padding: '8px 16px',
          fontWeight: value === 'en' ? 'bold' : 'normal',
          cursor: 'pointer',
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
          cursor: 'pointer',
        }}
      >
        Español
      </button>
    </div>
  );
}
