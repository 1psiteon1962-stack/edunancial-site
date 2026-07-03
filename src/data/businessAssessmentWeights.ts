export interface AssessmentWeight {

  id: string;

  category: string;

  weight: number;

}

export const assessmentWeights: AssessmentWeight[] = [

{ id:"cashFlow", category:"Financial", weight:10 },

{ id:"profit", category:"Financial", weight:10 },

{ id:"pricing", category:"Financial", weight:9 },

{ id:"sales", category:"Sales", weight:9 },

{ id:"marketing", category:"Marketing", weight:8 },

{ id:"leadership", category:"Leadership", weight:8 },

{ id:"hiring", category:"Leadership", weight:7 },

{ id:"systems", category:"Operations", weight:9 },

{ id:"operations", category:"Operations", weight:8 },

{ id:"growth", category:"Growth", weight:10 },

{ id:"planning", category:"Strategy", weight:9 },

{ id:"taxes", category:"Financial", weight:7 },

{ id:"financing", category:"Financial", weight:8 }

];
