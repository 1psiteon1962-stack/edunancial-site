export function detectCountry(){

if(typeof window==="undefined") return null;

return navigator.language;

}
