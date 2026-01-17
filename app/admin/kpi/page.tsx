import type { UserProfileKPI } from "@/lib/kpi-types";

const mockData: UserProfileKPI[] = [
  {
    userId: "sample",
    createdAt: new Date().toISOString(),
    firstName: "Sample",
    lastName: "User",
    email: "sample@example.com",
    country: "United States",
    region: "us",
    ageRange: "25_34",
    hasBusiness: true,
    businessName: "Sample LLC",
    businessJurisdiction: "CA",
    businessFormalized: true,
    startingLevel: 2,
    currentLevel: 3,
    primaryTrackInterest: "business",
  },
];

export default function AdminKPIDashboard() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Internal KPI Dashboard</h1>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Region</th>
            <th className="border p-2">Level</th>
            <th className="border p-2">Business</th>
            <th className="border p-2">Track</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((u) => (
            <tr key={u.userId}>
              <td className="border p-2">
                {u.firstName} {u.lastName}
              </td>
              <td className="border p-2">{u.region}</td>
              <td className="border p-2">
                {u.startingLevel} → {u.currentLevel}
              </td>
              <td className="border p-2">
                {u.hasBusiness ? "Yes" : "No"}
              </td>
              <td className="border p-2">{u.primaryTrackInterest}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
