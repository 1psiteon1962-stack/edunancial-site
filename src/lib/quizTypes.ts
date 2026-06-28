export interface Quiz{
id:string;
courseId:string;
title:string;
passingScore:number;
questions:QuizQuestion[];
}

export interface QuizQuestion{
id:string;
question:string;
answers:string[];
correct:number;
points:number;
}
