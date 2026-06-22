import { courses } from "../../data/courses";

export default function CoursesPage() {

  return (

    <main
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "60px 20px"
      }}
    >

      <h1>

        Courses

      </h1>

      <p
        style={{
          fontSize: "22px",
          lineHeight: "1.7"
        }}
      >

        Financial literacy, ownership,
        business, paper assets,
        real estate, and
        economic self-defense.

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

          courses.map((course) => (

            <section

              key={course.id}

              style={{

                border: "1px solid #ddd",

                padding: "24px",

                borderRadius: "12px"

              }}

            >

              <h2>

                {course.title}

              </h2>

              <p>

                {course.description}

              </p>

              <h3>

                Lessons

              </h3>

              <ol>

                {

                  course.lessons.map((lesson) => (

                    <li key={lesson}>

                      {lesson}

                    </li>

                  ))

                }

              </ol>

            </section>

          ))

        }

      </div>

    </main>

  );

}
