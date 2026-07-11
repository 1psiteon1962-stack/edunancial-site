"use client";

import { FormEvent, useMemo, useState } from "react";
import { calculateBudgetSummary } from "@/lib/budgetCalculator";

const calculatorFields = [
  { key: "monthlyIncome", label: "Monthly income" },
  { key: "housing", label: "Housing" },
  { key: "utilities", label: "Utilities" },
  { key: "food", label: "Food" },
  { key: "transportation", label: "Transportation" },
  { key: "insurance", label: "Insurance" },
  { key: "debtPayments", label: "Debt payments" },
  { key: "savings", label: "Savings" },
  { key: "otherExpenses", label: "Other expenses" },
] as const;

type FieldKey = (typeof calculatorFields)[number]["key"];

type FormValues = Record<FieldKey, string>;

const initialValues: FormValues = {
  monthlyIncome: "",
  housing: "",
  utilities: "",
  food: "",
  transportation: "",
  insurance: "",
  debtPayments: "",
  savings: "",
  otherExpenses: "",
};

export default function BudgetCalculator() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [error, setError] = useState<string>("");
  const [hasCalculated, setHasCalculated] = useState(false);

  const summary = useMemo(() => {
    const parsed = parseFormValues(values);
    if (!parsed.valid) {
      return null;
    }

    return calculateBudgetSummary(parsed.data);
  }, [values]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = parseFormValues(values);

    if (!parsed.valid) {
      setError("Please enter valid non-negative numbers for every field.");
      setHasCalculated(false);
      return;
    }

    setError("");
    setHasCalculated(true);
  }

  return (
    <section
      id="budget-calculator"
      aria-labelledby="budget-calculator-heading"
      className="rounded-2xl border border-slate-700/70 bg-[#111827] p-6 md:p-8"
    >
      <h2 id="budget-calculator-heading" className="text-3xl font-black text-white md:text-4xl">
        Budget Calculator
      </h2>
      <p className="mt-4 max-w-3xl text-slate-300">
        Use this budget calculator to review monthly cash flow, savings rate, and debt-to-income
        estimate.
      </p>

      <form className="mt-8" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {calculatorFields.map((field) => (
            <div key={field.key}>
              <label htmlFor={field.key} className="mb-2 block text-sm font-semibold text-slate-200">
                {field.label}
              </label>
              <input
                id={field.key}
                name={field.key}
                inputMode="decimal"
                min="0"
                step="0.01"
                type="number"
                value={values[field.key]}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [field.key]: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                placeholder="0.00"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
        >
          Calculate Budget
        </button>

        {error ? (
          <p role="alert" className="mt-4 text-sm font-semibold text-red-300">
            {error}
          </p>
        ) : null}
      </form>

      {hasCalculated && summary ? (
        <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900/70 p-5">
          <h3 className="text-xl font-bold text-white">Budget Summary</h3>
          <dl className="mt-4 grid gap-3 text-sm text-slate-200 md:grid-cols-2">
            <SummaryRow label="Total income" value={formatCurrency(summary.totalIncome)} />
            <SummaryRow label="Total expenses" value={formatCurrency(summary.totalExpenses)} />
            <SummaryRow label="Remaining cash flow" value={formatCurrency(summary.remainingCashFlow)} />
            <SummaryRow label="Savings rate" value={`${summary.savingsRate.toFixed(1)}%`} />
            <SummaryRow label="Debt-to-income estimate" value={`${summary.debtToIncome.toFixed(1)}%`} />
          </dl>

          <ul className="mt-5 space-y-2 text-sm text-slate-100" aria-label="Financial health messages">
            {summary.messages.map((message) => (
              <li key={message}>• {message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-6 text-sm text-slate-300">
        This calculator runs in your browser and does not store your information.
      </p>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-800/80 px-3 py-2">
      <dt className="font-semibold">{label}</dt>
      <dd className="font-bold text-white">{value}</dd>
    </div>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function parseFormValues(values: FormValues):
  | { valid: true; data: Record<FieldKey, number> }
  | { valid: false } {
  const parsed = {} as Record<FieldKey, number>;

  for (const field of calculatorFields) {
    const rawValue = values[field.key].trim();
    const value = rawValue === "" ? 0 : Number(rawValue);

    if (!Number.isFinite(value) || value < 0) {
      return { valid: false };
    }

    parsed[field.key] = value;
  }

  return { valid: true, data: parsed };
}
