import Link from "next/link";

export default function Navbar() {

  return (

    <nav

      style={{

        padding: "20px",

        borderBottom: "1px solid #ddd",

        background: "#fff"

      }}

    >

      <div

        style={{

          maxWidth: "1200px",

          margin: "0 auto",

          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",

          flexWrap: "wrap",

          gap: "20px"

        }}

      >

        <Link

          href="/"

          style={{

            fontWeight: "bold",

            fontSize: "28px",

            textDecoration: "none",

            color: "#111"

          }}

        >

          Edunancial

        </Link>

        <div

          style={{

            display: "flex",

            gap: "20px",

            flexWrap: "wrap"

          }}

        >

          <Link href="/">Home</Link>

          <Link href="/about">About</Link>

          <Link href="/courses">Courses</Link>

          <Link href="/membership">Membership</Link>

          <Link href="/downloads">Downloads</Link>

          <Link href="/economic-self-defense">

            Economic Self Defense

          </Link>

          <Link href="/blog">Blog</Link>

          <Link href="/faq">FAQ</Link>

          <Link href="/contact">Contact</Link>

        </div>

      </div>

    </nav>

  );

}
