import SectionRenderer from "@/components/sections/SectionRenderer";

const sections = [
  {
    component: "hero",
    props: {}
  },
  {
    component: "features",
    props: {}
  },
  {
    component: "testimonial",
    props: {}
  },
  {
    component: "pricing",
    props: {}
  },
  {
    component: "faq",
    props: {}
  },
  {
    component: "cta",
    props: {}
  }
];

export default function Page() {
  return (
    <main>
      {sections.map((section, index) => (
        <SectionRenderer key={index} section={section} />
      ))}
    </main>
  );
}
