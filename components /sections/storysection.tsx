import React from "react";

export default function StorySection() {
  return (
    <section
      style={{
        width: "100%",
        padding: "3rem 1.5rem",
        backgroundColor: "#fafafa",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
          color: "#111",
        }}
      >
        Our Story
      </h2>

      <div
        style={{
          maxWidth: "850px",
          margin: "0 auto",
          fontSize: "1.15rem",
          lineHeight: "1.75",
          color: "#222",
        }}
      >
        <p>
          One afternoon when my son was 11, he came into my room just as an
          electronic deposit notification arrived. His eyes went wide.{" "}
          <strong>“How did you make money like that?”</strong> he asked.
        </p>

        <p>
          “By using my head,” I told him. Then I asked, “Do you want to work
          with your head?” He said yes—but he didn’t know how.{" "}
          <strong>That is when Edunancial was born.</strong>
        </p>

        <p>
          At 11, he started buying silver coins—discipline and assets instead of
          candy and games. At 12, he began analyzing stocks: which were
          undervalued or overvalued, and why. After he presented his reasons, we
          bought. His results averaged 7–12%.
        </p>

        <p>
          At 15, he added gold—and today we think in terms of assets instead of
          just spending.
        </p>

        <p>
          The <strong>Red, White, and Blue</strong> method does not tell you
          what to buy—it teaches you how to think, how to evaluate, and how to
          take control of your financial future.
        </p>

        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <a
            href="/our-story.html"
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#1565c0",
              color: "#fff",
              borderRadius: "6px",
              fontSize: "1rem",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Read Full Story
          </a>

          <a
            href="/start-here.html"
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#c62828",
              color: "#fff",
              borderRadius: "6px",
              fontSize: "1rem",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Start Level 1 — Free
          </a>
        </div>
      </div>
    </section>
  );
}
