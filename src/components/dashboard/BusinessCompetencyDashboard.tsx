"use client";

interface DashboardProps {
  competencyScore: number;
  competencyLevel: string;
  completedCourses: number;
  totalCourses: number;
}

export default function BusinessCompetencyDashboard({
  competencyScore,
  competencyLevel,
  completedCourses,
  totalCourses,
}: DashboardProps) {

  const progress =
    totalCourses === 0
      ? 0
      : Math.round(
          (completedCourses / totalCourses) * 100
        );

  return (

    <section
      style={{
        maxWidth: "1200px",
        margin: "60px auto",
        padding: "20px",
      }}
    >

      <h1
        style={{
          textAlign: "center",
          fontSize: 42,
          marginBottom: 40,
        }}
      >
        Business Competency Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: 25,
        }}
      >

        <div
          style={{
            background: "#111827",
            borderRadius: 14,
            padding: 30,
          }}
        >

          <h3>Competency Score</h3>

          <div
            style={{
              fontSize: 60,
              fontWeight: 800,
              color: "#facc15",
            }}
          >
            {competencyScore}
          </div>

        </div>

        <div
          style={{
            background: "#111827",
            borderRadius: 14,
            padding: 30,
          }}
        >

          <h3>Competency Level</h3>

          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            {competencyLevel}
          </div>

        </div>

        <div
          style={{
            background: "#111827",
            borderRadius: 14,
            padding: 30,
          }}
        >

          <h3>Courses Completed</h3>

          <div
            style={{
              fontSize: 54,
              fontWeight: 800,
            }}
          >
            {completedCourses}
            <span
              style={{
                fontSize: 24,
              }}
            >
              {" "}
              / {totalCourses}
            </span>
          </div>

        </div>

        <div
          style={{
            background: "#111827",
            borderRadius: 14,
            padding: 30,
          }}
        >

          <h3>Overall Progress</h3>

          <div
            style={{
              width: "100%",
              height: 22,
              background: "#374151",
              borderRadius: 25,
              overflow: "hidden",
              marginTop: 20,
            }}
          >

            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#2563eb",
              }}
            />

          </div>

          <div
            style={{
              marginTop: 15,
              fontWeight: 700,
              fontSize: 24,
            }}
          >
            {progress}%
          </div>

        </div>

      </div>
            <div
        style={{
          marginTop: 50,
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(320px,1fr))",
          gap: 25,
        }}
      >

        <div
          style={{
            background: "#111827",
            borderRadius: 14,
            padding: 30,
          }}
        >

          <h2>Next Recommended Actions</h2>

          <ol
            style={{
              lineHeight: 2,
              marginTop: 20,
            }}
          >
            <li>Complete your Business Competency Assessment.</li>
            <li>Finish your recommended competency courses.</li>
            <li>Review your KPIs every day.</li>
            <li>Measure profit before pursuing growth.</li>
            <li>Repeat your assessment every 90 days.</li>
          </ol>

        </div>

        <div
          style={{
            background: "#111827",
            borderRadius: 14,
            padding: 30,
          }}
        >

          <h2>Business KPIs</h2>

          <ul
            style={{
              lineHeight: 2,
              marginTop: 20,
            }}
          >
            <li>Revenue</li>
            <li>Gross Profit</li>
            <li>Net Profit</li>
            <li>Cash Flow</li>
            <li>Operating Margin</li>
            <li>Average Sale</li>
            <li>Customer Acquisition Cost</li>
            <li>Customer Lifetime Value</li>
            <li>Employee Productivity</li>
            <li>Monthly Growth Rate</li>
          </ul>

        </div>

        <div
          style={{
            background: "#111827",
            borderRadius: 14,
            padding: 30,
          }}
        >

          <h2>Business Health</h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              marginTop: 20,
            }}
          >

            <div>🟢 Revenue Trend</div>

            <div>🟢 Profit Trend</div>

            <div>🟡 Cash Flow</div>

            <div>🟢 Pricing</div>

            <div>🟡 Hiring</div>

            <div>🟢 Leadership</div>

          </div>

        </div>

      </div>

    </section>

  );

}
