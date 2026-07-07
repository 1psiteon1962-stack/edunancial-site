// ======================================================
// COUNTRY DEPLOYMENT STATUS
// FILE 1038
// ======================================================

export type CountryStatus =

| "ACTIVE"

| "PILOT"

| "WAITLIST"

| "LIMITED"

| "DISABLED"

| "SANCTIONED";

export interface CountryConfiguration {

country:string;

status:CountryStatus;

currency:string;

language:string[];

pricingMultiplier:number;

coursesEnabled:boolean;

aiEnabled:boolean;

paymentsEnabled:boolean;

enterpriseEnabled:boolean;

}

export const DefaultCountryConfiguration:CountryConfiguration={

country:"United States",

status:"ACTIVE",

currency:"USD",

language:["English"],

pricingMultiplier:1,

coursesEnabled:true,

aiEnabled:true,

paymentsEnabled:true,

enterpriseEnabled:true,

};
