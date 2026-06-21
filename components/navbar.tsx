import Link from "next/link";

export default function Navbar() {

  return (

    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
        borderBottom: "1px solid #ddd",
        background: "#ffffff",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}
    >

      <div
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "#1a237e"
        }}
      >
        Edunancial
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          fontSize: "16px"
        }}
      >

        <Link href="/">
          Home
        </Link>

        <Link href="/courses">
          Courses
        </Link>

        <Link href="/levels">
          Levels
        </Link>

        <Link href="/membership">
          Membership
        </Link>

        <Link href="/sponsor">
          Sponsor
        </Link>

        <Link href="/about">
          About
        </Link>

        <Link href="/contact">
          Contact
        </Link>

      </div>

    </nav>

  );

}
