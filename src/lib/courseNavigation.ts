export interface Lesson{
id:string;
title:string;
order:number;
}

export function nextLesson(
lessons:Lesson[],
current:string
){

const i=lessons.findIndex(
l=>l.id===current
);

return i<lessons.length-1
?lessons[i+1]
:null;

}

export function previousLesson(
lessons:Lesson[],
current:string
){

const i=lessons.findIndex(
l=>l.id===current
);

return i>0
?lessons[i-1]
:null;

}
