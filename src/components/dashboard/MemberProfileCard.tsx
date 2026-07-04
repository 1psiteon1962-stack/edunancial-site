export default function MemberProfileCard() {

  return (

    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold">

        Member Profile

      </h2>

      <div className="mt-8 space-y-4">

        <div className="flex justify-between">

          <span>Member</span>

          <strong>Guest User</strong>

        </div>

        <div className="flex justify-between">

          <span>Membership</span>

          <strong>Basic</strong>

        </div>

        <div className="flex justify-between">

          <span>Country</span>

          <strong>United States</strong>

        </div>

        <div className="flex justify-between">

          <span>Preferred Language</span>

          <strong>English</strong>

        </div>

      </div>

    </section>

  );

}
