export interface GlobalRollup{

revenue:number;

profit:number;

expenses:number;

customers:number;

subscribers:number;

books:number;

courses:number;

memberships:number;

ltv:number;

cac:number;

}

export function combineRollups(
items:GlobalRollup[]
){

return items.reduce(

(a,b)=>({

revenue:a.revenue+b.revenue,

profit:a.profit+b.profit,

expenses:a.expenses+b.expenses,

customers:a.customers+b.customers,

subscribers:a.subscribers+b.subscribers,

books:a.books+b.books,

courses:a.courses+b.courses,

memberships:a.memberships+b.memberships,

ltv:a.ltv+b.ltv,

cac:a.cac+b.cac

})

);

}
