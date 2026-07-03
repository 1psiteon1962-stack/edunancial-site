export interface RoadmapStep{

step:number;

title:string;

description:string;

completed:boolean;

}

export function generateRoadmap(

stage:string

):RoadmapStep[]{

if(stage==="startup"){

return[

{
step:1,
title:"Become Profitable",
description:"Establish consistent profits.",
completed:false
},

{
step:2,
title:"Know Your Numbers",
description:"Track KPIs daily.",
completed:false
},

{
step:3,
title:"Build Cash Flow",
description:"Strengthen cash reserves.",
completed:false
},

{
step:4,
title:"Create Systems",
description:"Document recurring processes.",
completed:false
}

];

}

if(stage==="growth"){

return[

{
step:1,
title:"Improve Margins",
description:"Increase profitability.",
completed:false
},

{
step:2,
title:"Build Leadership",
description:"Develop managers.",
completed:false
},

{
step:3,
title:"Hire Strategically",
description:"Recruit high performers.",
completed:false
},

{
step:4,
title:"Scale Operations",
description:"Expand efficiently.",
completed:false
}

];

}

return[

{
step:1,
title:"Executive Leadership",
description:"Operate strategically.",
completed:false
},

{
step:2,
title:"Expansion",
description:"Expand into new markets.",
completed:false
},

{
step:3,
title:"Acquire Businesses",
description:"Grow through acquisitions.",
completed:false
},

{
step:4,
title:"Build Long-Term Wealth",
description:"Develop a lasting enterprise.",
completed:false
}

];

}
