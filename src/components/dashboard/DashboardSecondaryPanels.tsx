export default function DashboardSecondaryPanels() {
  return (
    <div className="mt-20 grid gap-8 lg:grid-cols-2">
      <div className="rounded-2xl bg-slate-900 p-10">
        <h2 className="text-4xl font-black">Recommended Next Courses</h2>

        <div className="mt-10 space-y-6">
          <div className="rounded-xl bg-slate-800 p-6">
            <h3 className="text-2xl font-bold">Building Wealth Through Real Estate</h3>
            <p className="mt-4 text-slate-300">
              Recommended because your Real Estate competency score is currently below your
              overall average.
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 p-6">
            <h3 className="text-2xl font-bold">Advanced Risk Management</h3>
            <p className="mt-4 text-slate-300">
              Improve wealth preservation and long-term financial security.
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 p-6">
            <h3 className="text-2xl font-bold">Executive KPI Dashboard</h3>
            <p className="mt-4 text-slate-300">
              Strengthen business decision-making using measurable performance indicators.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 p-10">
        <h2 className="text-4xl font-black">Achievement Badges</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-yellow-500 p-6 text-center">
            🥇
            <p className="mt-4 font-bold">First Assessment</p>
          </div>

          <div className="rounded-xl border border-blue-500 p-6 text-center">
            📈
            <p className="mt-4 font-bold">Investment Explorer</p>
          </div>

          <div className="rounded-xl border border-red-500 p-6 text-center">
            🏘️
            <p className="mt-4 font-bold">Real Estate Student</p>
          </div>

          <div className="rounded-xl border border-green-500 p-6 text-center">
            💼
            <p className="mt-4 font-bold">Business Builder</p>
          </div>
        </div>
      </div>
    </div>
  );
}
