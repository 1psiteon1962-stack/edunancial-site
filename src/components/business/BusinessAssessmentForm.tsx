"use client";

import { useState } from "react";
import { businessQuestions } from "@/data/businessQuestions";
import { scoreBusinessAssessment } from "@/lib/businessScoring";

export default function BusinessAssessmentForm() {

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);

  function selectAnswer(questionId: string, answer: string) {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  }

  function completeAssessment() {
    const assessment = scoreBusinessAssessment(answers);
    setResult(assessment);
  }

  return (
    <section
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "60px 20px",
      }}
    >

      <h1
        style={{
          fontSize: 44,
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        Business Competency Assessment
      </h1>

      <p
        style={{
          textAlign: "center",
          fontSize: 20,
          marginBottom: 50,
        }}
      >
        Answer the questions below to receive your
        Business Competency Score and recommended
        learning path.
      </p>

      {businessQuestions.map((question) => (

        <div
          key={question.id}
          style={{
            marginBottom: 40,
            background: "#111827",
            padding: 25,
            borderRadius: 14,
          }}
        >

          <h3>{question.question}</h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 18,
            }}
          >

            {question.answers.map((answer) => (

              <button
                key={answer}
                onClick={() =>
                  selectAnswer(question.id, answer)
                }
                style={{
                  padding: "12px 18px",
                  borderRadius: 10,
                  cursor: "pointer",
                  border:
                    answers[question.id] === answer
                      ? "2px solid gold"
                      : "2px solid #444",
                  background:
                    answers[question.id] === answer
                      ? "#1d4ed8"
                      : "#1f2937",
                  color: "white",
                  fontWeight: 600,
                }}
              >
                {answer}
              </button>

            ))}

          </div>

        </div>

      ))}

      <div
        style={{
          textAlign: "center",
          marginTop: 50,
        }}
      >

        <button
          onClick={completeAssessment}
          style={{
            padding: "18px 40px",
            fontSize: 20,
            fontWeight: 700,
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
          }}
        >
          Calculate My Competency
        </button>
              </div>

      {result && (

        <section
          style={{
            marginTop: 70,
            background: "#0f172a",
            borderRadius: 16,
            padding: 35,
          }}
        >

          <h2
            style={{
              textAlign: "center",
              fontSize: 38,
              marginBottom: 25,
            }}
          >
            Your Results
          </h2>

          <div
            style={{
              textAlign: "center",
              marginBottom: 35,
            }}
          >

            <div
              style={{
                fontSize: 72,
                fontWeight: 800,
                color: "#facc15",
              }}
            >
              {result.competencyScore}
            </div>

            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              {result.competencyLevel}
            </div>

          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(280px,1fr))",
              gap: 30,
            }}
          >

            <div>
              <h3>Strengths</h3>

              <ul>

                {result.strengths.length === 0 ? (
                  <li>
                    Complete more assessments to
                    identify your strongest areas.
                  </li>
                ) : (
                  result.strengths.map((item: string) => (
                    <li key={item}>{item}</li>
                  ))
                )}

              </ul>
            </div>

            <div>
              <h3>Areas To Improve</h3>

              <ul>

                {result.weaknesses.length === 0 ? (
                  <li>
                    Your improvement areas will
                    appear here.
                  </li>
                ) : (
                  result.weaknesses.map((item: string) => (
                    <li key={item}>{item}</li>
                  ))
                )}

              </ul>
            </div>

            <div>
              <h3>Recommended Next Courses</h3>

              <ul>

                {result.recommendations.length === 0 ? (
                  <li>
                    Personalized recommendations
                    will appear here.
                  </li>
                ) : (
                  result.recommendations.map((item: string) => (
                    <li key={item}>{item}</li>
                  ))
                )}

              </ul>
            </div>

          </div>

        </section>

      )}

    </section>

  );

}
