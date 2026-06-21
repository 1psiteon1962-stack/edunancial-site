"use client";

import { useState } from "react";

export default function BudgetCalculator() {

  const [income, setIncome] = useState(5000);

  const [expenses, setExpenses] = useState(3500);

  const surplus = income - expenses;

  const savingsRate =
    income > 0
      ? (surplus / income) * 100
      : 0;

  return (

    <section
      style={{
        padding: "40px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        maxWidth: "700px",
        margin: "40px auto",
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.7,
      }}
    >

      <h2>

        Budget Calculator

      </h2>

      <p>

        Understanding your cash flow is one of the
        most important principles of financial literacy.

      </p>

      <p>

        This calculator is for educational purposes only.

      </p>

      <br />

      <label>

        Monthly Income

      </label>

      <br />

      <input

        type="number"

        value={income}

        onChange={(e) =>

          setIncome(Number(e.target.value))

        }

        style={{

          width: "100%",

          padding: "10px",

          marginTop: "5px",

        }}

      />

      <br />

      <br />

      <label>

        Monthly Expenses

      </label>

      <br />

      <input

        type="number"

        value={expenses}

        onChange={(e) =>

          setExpenses(Number(e.target.value))

        }

        style={{

          width: "100%",

          padding: "10px",

          marginTop: "5px",

        }}

      />

      <br />

      <br />

      <h3>

        Monthly Surplus / Deficit

      </h3>

      <p>

        $

        {surplus.toFixed(2)}

      </p>

      <h3>

        Savings Rate

      </h3>

      <p>

        {savingsRate.toFixed(2)}

        %

      </p>

      <hr />

      <p>

        Edunancial is a Financial Literacy Platform.

      </p>

      <p>

        We provide educational information only and
        do not provide financial, investment, legal,
        tax, or accounting advice.

      </p>

    </section>

  );

}
