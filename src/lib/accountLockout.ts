export interface AccountLockout{
email:string;
locked:boolean;
reason:string;
lockedAt:string;
expiresAt:string;
}

export function lockAccount(
email:string,
reason:string,
minutes=30
):AccountLockout{

const now=new Date();
const expires=new Date(now.getTime()+minutes*60000);

return{
email,
locked:true,
reason,
lockedAt:now.toISOString(),
expiresAt:expires.toISOString()
};

}
