export interface CompetencyLevel {

  minimum: number;

  maximum: number;

  title: string;

  description: string;

}

export const competencyLevels: CompetencyLevel[] = [

{
minimum:0,
maximum:39,
title:"Foundation",
description:"Learning the fundamentals."
},

{
minimum:40,
maximum:59,
title:"Developing",
description:"Beginning to apply financial competency."
},

{
minimum:60,
maximum:74,
title:"Competent",
description:"Making consistently sound financial decisions."
},

{
minimum:75,
maximum:89,
title:"Advanced",
description:"Managing wealth and business strategically."
},

{
minimum:90,
maximum:100,
title:"Master",
description:"Able to teach, mentor and build significant wealth."
}

];

export function competencyTitle(score:number){

return competencyLevels.find(level=>

score>=level.minimum &&

score<=level.maximum

);

}
