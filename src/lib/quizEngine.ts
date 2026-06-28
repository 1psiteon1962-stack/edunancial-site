import {Quiz} from "./quizTypes";

export function gradeQuiz(
quiz:Quiz,
answers:number[]
){

let score=0;

quiz.questions.forEach((q,i)=>{

if(q.correct===answers[i])
score+=q.points;

});

const total=quiz.questions.reduce(
(a,b)=>a+b.points,
0
);

return{

score,

total,

passed:
score/total*100>=quiz.passingScore

};

}
