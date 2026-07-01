import ExecutiveRevenueCenter from "./ExecutiveRevenueCenter";
import CourseCompletionAnalytics from "./CourseCompletionAnalytics";
import StudentEvaluationDashboard from "./StudentEvaluationDashboard";
import InstructorPerformanceDashboard from "./InstructorPerformanceDashboard";
import BusinessHealthScore from "./BusinessHealthScore";

export default function GlobalExecutiveCommandCenter(){

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="max-w-7xl mx-auto px-6 py-16">

<h1 className="text-5xl font-black">

Global Executive Command Center

</h1>

<p className="mt-4 text-xl text-gray-400">

One Platform. Global Visibility. Know Your Numbers.

</p>

<div className="space-y-10 mt-12">

<ExecutiveRevenueCenter/>

<CourseCompletionAnalytics/>

<StudentEvaluationDashboard/>

<InstructorPerformanceDashboard/>

<BusinessHealthScore/>

</div>

</section>

</main>

);

}
