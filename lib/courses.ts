export type Course = {
  id: string;
  title: string;
  description: string;
};

export function getCourses(): Course[] {
  return [
    {
      id: 'intro-finance',
      title: 'Introduction to Financial Literacy',
      description: 'Learn the basics of money, credit, and budgeting.'
    }
  ];
}
