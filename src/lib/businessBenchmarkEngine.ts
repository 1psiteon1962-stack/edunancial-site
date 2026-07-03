export interface BusinessBenchmark {

  category: string;

  minimum: number;

  target: number;

  excellent: number;

}

export const benchmarks: BusinessBenchmark[] = [

{
category:"Net Profit Margin",
minimum:5,
target:15,
excellent:25
},

{
category:"Gross Margin",
minimum:30,
target:45,
excellent:60
},

{
category:"Cash Reserve (Months)",
minimum:1,
target:3,
excellent:6
},

{
category:"Revenue Growth %",
minimum:5,
target:15,
excellent:30
},

{
category:"Customer Retention %",
minimum:60,
target:80,
excellent:95
},

{
category:"Lead Conversion %",
minimum:10,
target:25,
excellent:40
},

{
category:"Employee Retention %",
minimum:70,
target:85,
excellent:95
}

];

export function compareBenchmark(

actual:number,

benchmark:BusinessBenchmark

){

if(actual>=benchmark.excellent)

return "Excellent";

if(actual>=benchmark.target)

return "Target";

if(actual>=benchmark.minimum)

return "Needs Improvement";

return "Critical";

}
