export type Course = {
  id: string;
  title: string;
  description: string;
  price: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
};

export const courses: Course[] = [
  {
    id: 'financial-literacy-101',
    title: 'Financial Literacy 101',
    description: 'Budgeting, saving, and credit fundamentals.',
    price: 99,
    level: 'Beginner',
  },
  {
    id: 'investing-basics',
    title: 'Investing Basics',
    description: 'Stocks, ETFs, and long-term investing.',
    price: 149,
    level: 'Beginner',
  },
  {
    id: 'wealth-building',
    title: 'Wealth Building',
    description: 'Advanced strategies for long-term growth.',
    price: 199,
    level: 'Advanced',
  },
];
