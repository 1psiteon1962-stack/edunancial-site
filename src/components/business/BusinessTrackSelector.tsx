"use client";

import { useState } from "react";
import {
  businessTracks,
  businessChallenges,
  BusinessStage,
} from "@/data/businessTracks";

export default function BusinessTrackSelector() {
  const [stage, setStage] =
    useState<BusinessStage>("startup");

  const [selectedChallenges, setSelectedChallenges] =
    useState<string[]>([]);

  const currentTrack =
    businessTracks.find((t) => t.id === stage)!;

  function toggleChallenge(id: string) {
    if (selectedChallenges.includes(id)) {
      setSelectedChallenges(
        selectedChallenges.filter((c) => c !== id)
      );
    } else {
      setSelectedChallenges([
        ...selectedChallenges,
        id,
      ]);
    }
  }

  return (
    <section
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "60px 20px",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: 42,
          marginBottom: 10,
        }}
      >
        Business Competency Path
      </h2>

      <p
        style={{
          textAlign: "center",
          fontSize: 20,
          marginBottom: 40,
          maxWidth: 850,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Your education should match where your
        business is today—not where someone
        else's business is.
      </p>

      <div
        style={{
          display: "flex",
          gap: 20,
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: 50,
        }}
      >
        {businessTracks.map((track) => (
          <button
            key={track.id}
            onClick={() => setStage(track.id)}
            style={{
              padding: "18px 28px",
              borderRadius: 12,
              cursor: "pointer",
              fontSize: 18,
              fontWeight: 700,
              border:
                stage === track.id
                  ? "3px solid gold"
                  : "2px solid #555",
              background:
                stage === track.id
                  ? "#17335f"
                  : "#111827",
              color: "white",
              minWidth: 220,
            }}
          >
            <div>{track.title}</div>

            <div
              style={{
                marginTop: 6,
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              {track.years}
            </div>
          </button>
        ))}
      </div>

      <div
        style={{
          background: "#111827",
          padding: 30,
          borderRadius: 16,
        }}
      >
        <h3
          style={{
            fontSize: 32,
            marginBottom: 15,
          }}
        >
          {currentTrack.title}
        </h3>

        <p
          style={{
            fontSize: 20,
            marginBottom: 30,
          }}
        >
          {currentTrack.description}
        </p>

        <h4
          style={{
            fontSize: 24,
            marginBottom: 15,
          }}
        >
          Primary Objectives
        </h4>

        <ul
          style={{
            lineHeight: 2,
            fontSize: 19,
          }}
        >
          {currentTrack.objectives.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h4
          style={{
            marginTop: 40,
            marginBottom: 15,
            fontSize: 24,
          }}
        >
          Biggest Challenges
        </h4>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
                    {businessChallenges.map((challenge) => (
            <button
              key={challenge.id}
              onClick={() => toggleChallenge(challenge.id)}
              style={{
                padding: "12px 18px",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 600,
                border: selectedChallenges.includes(challenge.id)
                  ? "2px solid gold"
                  : "2px solid #444",
                background: selectedChallenges.includes(challenge.id)
                  ? "#1e3a8a"
                  : "#1f2937",
                color: "white",
              }}
            >
              {challenge.label}
            </button>
          ))}
        </div>

        <h4
          style={{
            marginTop: 45,
            marginBottom: 15,
            fontSize: 24,
          }}
        >
          Recommended Courses
        </h4>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",
            gap: 20,
          }}
        >
          {currentTrack.recommendedCourses.map((course) => (
            <div
              key={course}
              style={{
                background: "#0f172a",
                padding: 20,
                borderRadius: 12,
                border: "1px solid #374151",
              }}
            >
              <h5
                style={{
                  margin: 0,
                  fontSize: 20,
                }}
              >
                {course}
              </h5>

              <p
                style={{
                  marginTop: 10,
                  color: "#cbd5e1",
                  lineHeight: 1.6,
                }}
              >
                Complete this course to strengthen your
                competency in this area before moving to
                the next stage of business growth.
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 50,
            textAlign: "center",
          }}
        >
          <button
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "18px 42px",
              borderRadius: 12,
              fontSize: 20,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Continue Assessment
          </button>
        </div>
      </div>
    </section>
  );
}
