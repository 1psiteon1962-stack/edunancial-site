import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      style={{
        padding: "60px 20px",
        textAlign: "center",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <Image
        src="/images/three-paths-hero.svg"
        alt="Edunancial Three Roads to Wealth"
        width={1100}
        height={620}
        priority
        style={{
          width: "100%",
          maxWidth: "1100px",
          height: "auto",
          margin: "0 auto 50px auto",
          display: "block",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,.45)",
          background: "#020817",
        }}
      />

      <h1 style={{ fontSize: "54px", fontWeight: 800, marginBottom: "25px" }}>
        Three Roads.
        <br />
        One Gate.
        <br />
        One Destination.
      </h1>

      <p style={{ fontSize: "24px", lineHeight: 1.7, maxWidth: "850px", margin: "0 auto" }}>
        Every journey begins with a choice. Whether your path is
        <strong> Real Estate</strong>, <strong> Paper Assets</strong>, or
        <strong> Business</strong>, each road passes through
        <strong> Competency</strong> before leading toward <strong>Wealth.</strong>
      </p>

      <p
        style={{
          marginTop: "40px",
          fontSize: "22px",
          lineHeight: 1.8,
          maxWidth: "900px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Edunancial helps ordinary people build extraordinary financial futures through
        measurable financial competency, practical education, and disciplined action.
      </p>

      <div
        style={{
          marginTop: "50px",
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/assessment"
          style={{
            background: "#2563eb",
            color: "white",
            padding: "16px 36px",
            borderRadius: "12px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Start Assessment
        </Link>

        <Link
          href="/courses"
          style={{
            border: "2px solid white",
            color: "white",
            padding: "16px 36px",
            borderRadius: "12px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Explore Courses
        </Link>
      </div>
    </section>
  );
}
