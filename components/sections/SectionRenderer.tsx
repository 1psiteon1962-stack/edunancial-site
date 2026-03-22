import dynamic from 'next/dynamic';

const sectionComponents = {
  hero: dynamic(() => import('./Hero')),
  testimonial: dynamic(() => import('./Testimonial')),
  features: dynamic(() => import('./Features')),
  pricing: dynamic(() => import('./Pricing')),
};

type Section = {
  type: keyof typeof sectionComponents;
  props?: any;
};

export default function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section, index) => {
        const Component = sectionComponents[section.type];
        if (!Component) return null;

        return <Component key={index} {...section.props} />;
      })}
    </>
  );
}
