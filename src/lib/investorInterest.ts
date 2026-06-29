export interface InvestorInterest{
id:string;
investorId:string;
startupId:string;
status:
"requested"|
"accepted"|
"declined";
notes:string;
createdAt:string;
}
