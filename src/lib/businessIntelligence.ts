export interface BusinessInsight{

id:string;

title:string;

description:string;

priority:
"low"|
"medium"|
"high";

department:string;

createdAt:string;

}

export function createInsight(
title:string,
description:string
):BusinessInsight{

return{

id:crypto.randomUUID(),

title,

description,

priority:"medium",

department:"Executive",

createdAt:new Date().toISOString()

};

}
