export default function BooksSection({ copy }: any) {
  return (
    <section>
      <h3>{copy?.booksTitle}</h3>
      <p>{copy?.booksBody}</p>
    </section>
  );
}
