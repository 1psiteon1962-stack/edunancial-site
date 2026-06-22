import { memberships } from "../../data/memberships";

export default function MembershipPage() {

  return (

    <main

      style={{

        maxWidth: "1100px",

        margin: "0 auto",

        padding: "60px 20px"

      }}

    >

      <h1>

        Membership

      </h1>

      <p>

        Recurring value through education,
        ownership, and economic self-defense.

      </p>

      <div

        style={{

          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(300px,1fr))",

          gap: "20px",

          marginTop: "40px"

        }}

      >

        {

          memberships.map((membership) => (

            <section

              key={membership.name}

              style={{

                border: "1px solid #ddd",

                borderRadius: "12px",

                padding: "24px"

              }}

            >

              <h2>

                {membership.name}

              </h2>

              <h3>

                {membership.monthly}/month

              </h3>

              <p>

                {membership.description}

              </p>

              <ul>

                {

                  membership.features.map((feature) => (

                    <li key={feature}>

                      {feature}

                    </li>

                  ))

                }

              </ul>

            </section>

          ))

        }

      </div>

    </main>

  );

}
