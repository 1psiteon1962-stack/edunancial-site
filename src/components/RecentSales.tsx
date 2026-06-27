interface Sale {

  customer: string;

  product: string;

  amount: number;

  date: string;

}

interface Props {

  sales: Sale[];

}

export default function RecentSales({

  sales,

}: Props) {

  return (

    <section className="rounded-2xl bg-[#151b2d] p-8">

      <h2 className="text-3xl font-black">

        Recent Sales

      </h2>

      <div className="mt-8 space-y-4">

        {sales.length === 0 ? (

          <p className="text-gray-400">

            No sales recorded yet.

          </p>

        ) : (

          sales.map((sale, index) => (

            <div
              key={index}
              className="flex justify-between border-b border-gray-700 pb-4"
            >

              <div>

                <p className="font-bold">

                  {sale.product}

                </p>

                <p className="text-sm text-gray-400">

                  {sale.customer}

                </p>

              </div>

              <div className="text-right">

                <p className="font-bold">

                  ${sale.amount.toFixed(2)}

                </p>

                <p className="text-sm text-gray-400">

                  {sale.date}

                </p>

              </div>

            </div>

          ))

        )}

      </div>

    </section>

  );

}
