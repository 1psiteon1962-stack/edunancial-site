import { totalRevenue } from "@/lib/salesManager";

interface Props {

  totalSales: number;

}

export default function SalesSummary({

  totalSales,

}: Props) {

  return (

    <section className="rounded-3xl bg-[#151b2d] p-10">

      <h2 className="text-4xl font-black">

        Sales Summary

      </h2>

      <div className="grid md:grid-cols-2 gap-8 mt-10">

        <div>

          <p className="text-gray-400">

            Gross Revenue

          </p>

          <h3 className="text-5xl font-black mt-2">

            ${totalRevenue().toFixed(2)}

          </h3>

        </div>

        <div>

          <p className="text-gray-400">

            Total Sales

          </p>

          <h3 className="text-5xl font-black mt-2">

            {totalSales}

          </h3>

        </div>

      </div>

    </section>

  );

}
