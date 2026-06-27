import BookCard from "./BookCard";

export default function BookGrid() {
return (
<section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

  <BookCard
    title="Business Is About Profit"
    description="Learn why profit is the foundation of every successful business."
    price="$9.99"
    image="/books/profit.jpg"
    checkoutUrl="#"
  />

  <BookCard
    title="Working With Your Head"
    description="The story that inspired Edunancial."
    price="$9.99"
    image="/books/head.jpg"
    checkoutUrl="#"
  />

  <BookCard
    title="Economic Self Defense"
    description="Protect yourself financially through education."
    price="$9.99"
    image="/books/esd.jpg"
    checkoutUrl="#"
  />

</section>

);
}
