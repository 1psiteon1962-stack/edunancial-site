import { customerCount } from "@/lib/customerManager";

interface Props {

  activeMembers: number;

}

export default function CustomerDashboard({

  activeMembers,

}: Props) {

  return (

    <section className="rounded-3xl bg-[#151b2d] p-10">

      <h2 className="text-4xl font-black">

        Customer Dashboard

      </h2>

      <div className="grid md:grid-cols-2 gap-10 mt-10">

        <div>

          <p className="text-gray-400">

            Registered Customers

          </p>

          <h3 className="text-5xl font-black mt-2">

            {customerCount()}

          </h3>

        </div>

        <div>

          <p className="text-gray-400">

            Active Members

          </p>

          <h3 className="text-5xl font-black mt-2">

            {activeMembers}

          </h3>

        </div>

      </div>

    </section>

  );

}
