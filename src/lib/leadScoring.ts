export interface LeadScore{

subscriberId:string;

score:number;

openedEmails:number;

clickedLinks:number;

downloads:number;

purchases:number;

}

export function calculateLeadScore(
lead:LeadScore
){

return(

lead.openedEmails*2+

lead.clickedLinks*5+

lead.downloads*10+

lead.purchases*25

);

}
