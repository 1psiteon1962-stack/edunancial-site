export interface Product {

  id: string;

  title: string;

  description: string;

  price: number;

  type: "book" | "course" | "membership" | "terms";

  image: string;

  checkoutUrl: string;

}

export const products: Product[] = [

  {
    id: "profit-book",

    title: "Business Is About Profit",

    description:
      "Learn why profit is the foundation of every successful business.",

    price: 9.99,

    type: "book",

    image: "/books/profit.jpg",

    checkoutUrl: ""
  },

  {
    id: "terms-red",

    title: "Real Estate Terms",

    description:
      "50 Financial Terms",

    price: 0.99,

    type: "terms",

    image: "/terms/red.png",

    checkoutUrl: ""
  },

  {
    id: "membership",

    title: "Edunancial Membership",

    description:
      "Unlimited Learning",

    price: 19.00,

    type: "membership",

    image: "/membership.png",

    checkoutUrl: ""
  }

];
