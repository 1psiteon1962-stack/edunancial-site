"use client";

type DisciplineTrackerProps = {
  region: string;
};

export default function DisciplineTracker({ region }: DisciplineTrackerProps) {
  return (
    <section style={{ marginTop: "2rem" }}>
      <h2>Discipline Tracker — {region}</h2>
      <p>
        Track daily financial discipline habits such as saving consistency,
        expense control, and income reliability.
      </p>

      <ul>
        <li>Daily savings action</li>
        <li>Expense awareness</li>
        <li>Income stability</li>
      </ul>
    </section>
  );
}
