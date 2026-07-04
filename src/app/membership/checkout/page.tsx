import SquareCheckout from "@/components/payments/SquareCheckout";

import { membershipPlans } from "@/types/membership";

interface CheckoutPageProps {

  searchParams: {

    plan?: string;

  };

}

export default async function CheckoutPage({

  searchParams,

}: CheckoutPageProps) {

  const selectedPlan =

    membershipPlans.find(

      plan =>

        plan.id === searchParams.plan

    ) ?? membershipPlans[1];

  return (

    <main className="mx-auto max-w-3xl px-6 py-16">

      <h1 className="text-5xl font-bold">

        Checkout

      </h1>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">

        <h2 className="text-3xl font-bold">

          {selectedPlan.name}

        </h2>

        <p className="mt-4 text-slate-600">

          Review your membership before
          completing payment.

        </p>

        <div className="mt-10 space-y-3">

          <div className="flex justify-between">

            <span>

              Membership

            </span>

            <strong>

              {selectedPlan.name}

            </strong>

          </div>

          <div className="flex justify-between">

            <span>

              Monthly Price

            </span>

            <strong>

              ${selectedPlan.monthlyPrice}

            </strong>

          </div>

          <div className="flex justify-between">

            <span>

              Currency

            </span>

            <strong>

              {selectedPlan.currency}

            </strong>

          </div>

        </div>

        <div className="mt-12">

          <SquareCheckout

            planId={selectedPlan.id}

            amount={selectedPlan.monthlyPrice}

            currency={selectedPlan.currency}

          />

        </div>

      </div>

    </main>

  );

}
