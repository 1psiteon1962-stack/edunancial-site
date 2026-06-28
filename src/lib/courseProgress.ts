export interface CourseProgress{
userId:string;
courseId:string;
lessonId:string;
percent:number;
completed:boolean;
lastViewed:string;
}

export function updateProgress(
progress:CourseProgress[],
item:CourseProgress
){
return[
...progress.filter(p=>!(
p.userId===item.userId &&
p.courseId===item.courseId
)),
item
];
}
