export interface AIChatRequest{
userId:string;
message:string;
language:string;
voice:boolean;
}

export interface AIChatResponse{
response:string;
educationalMode:boolean;
sources:string[];
followUpQuestions:string[];
}
