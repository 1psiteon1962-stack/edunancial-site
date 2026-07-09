const settings = [
  {
    group: "Platform",
    items: [
      { label: "Site Name", value: "Edunancial", type: "text" },
      { label: "Support Email", value: "support@edunancial.com", type: "text" },
      { label: "Default Language", value: "English (en)", type: "select" },
      { label: "Default Currency", value: "USD", type: "select" },
      { label: "Maintenance Mode", value: "Disabled", type: "toggle" },
    ],
  },
  {
    group: "Payments",
    items: [
      { label: "Payment Provider", value: "Square", type: "select" },
      { label: "PayPal Enabled", value: "Yes", type: "toggle" },
      { label: "Stripe Enabled", value: "No", type: "toggle" },
      { label: "Tax Rate (US)", value: "0%", type: "text" },
    ],
  },
  {
    group: "Email & Notifications",
    items: [
      { label: "Transactional Email Provider", value: "SendGrid", type: "select" },
      { label: "From Name", value: "Edunancial", type: "text" },
      { label: "From Address", value: "noreply@edunancial.com", type: "text" },
      { label: "Admin Alerts Enabled", value: "Yes", type: "toggle" },
    ],
  },
  {
    group: "Security",
    items: [
      { label: "Two-Factor Auth (Admin)", value: "Enabled", type: "toggle" },
      { label: "Session Timeout (minutes)", value: "60", type: "text" },
      { label: "Max Login Attempts", value: "5", type: "text" },
      { label: "IP Allowlist", value: "None", type: "text" },
    ],
  },
  {
    group: "Content",
    items: [
      { label: "Enable Blog", value: "Yes", type: "toggle" },
      { label: "Max Upload Size (MB)", value: "100", type: "text" },
      { label: "CDN Provider", value: "None", type: "select" },
      { label: "Watermark PDFs", value: "Yes", type: "toggle" },
    ],
  },
];

export default function SystemSettingsPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          System
        </p>
        <h1 className="mt-2 text-5xl font-black">
          System Settings
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Configure platform behaviour, integrations and security policies.
        </p>
      </div>

      <div className="max-w-3xl space-y-8">
        {settings.map((group) => (
          <section
            key={group.group}
            className="rounded-2xl bg-[#101a2f] border border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="font-bold text-white">
                {group.group}
              </h2>
            </div>
            <ul className="divide-y divide-white/5">
              {group.items.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <p className="text-sm text-gray-300">
                    {item.label}
                  </p>
                  <span className="text-sm font-medium text-white rounded-lg bg-white/5 px-3 py-1.5">
                    {item.value}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div className="flex gap-4 pt-2">
          <button className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-sm hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
          <button className="rounded-xl border border-white/10 px-6 py-3 font-bold text-sm hover:bg-white/5 transition-colors">
            Reset to Defaults
          </button>
        </div>
      </div>

    </main>
  );
}
