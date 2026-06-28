export interface ScheduledLesson{
id:string;
courseId:string;
lessonId:string;
publishAt:string;
expireAt?:string;
isPublished:boolean;
}

export function lessonVisible(
lesson:ScheduledLesson,
date=new Date()
){

if(!lesson.isPublished)return false;

if(new Date(lesson.publishAt)>date)return false;

if(
lesson.expireAt &&
new Date(lesson.expireAt)<date
)return false;

return true;

}
