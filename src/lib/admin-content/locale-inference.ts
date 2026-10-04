/**
 * Shared, safety-first locale inference for curriculum package filenames.
 * Never silently treats an ambiguous localized filename as canonical English.
 */
export const FILENAME_LOCALE_CODES = [
  "es-Caribbean","es-419","en-US","en-GB","es-ES","fr-CA","fr-FR","pt-BR","pt-PT",
  "de","it","nl","ht","es","fr","pt","en",
] as const;

const HUMAN_LANGUAGE_NAMES:Array<[string,string]>=[
 ["spanish-latin-america-caribbean","es-Caribbean"],["spanish-latin-america","es-419"],["latin-american-spanish","es-419"],
 ["spanish-caribbean","es-Caribbean"],["caribbean-spanish","es-Caribbean"],["portuguese-brazil","pt-BR"],
 ["brazilian-portuguese","pt-BR"],["portuguese-portugal","pt-PT"],["french-canadian","fr-CA"],["canadian-french","fr-CA"],
 ["french-france","fr-FR"],["spanish-spain","es-ES"],["english-uk","en-GB"],["english-united-kingdom","en-GB"],
 ["english-us","en-US"],["english-united-states","en-US"],["german-germany","de"],["german","de"],["deutsch","de"],
 ["italian-italy","it"],["italian","it"],["italiano","it"],["dutch-netherlands","nl"],["dutch","nl"],["nederlands","nl"],
 ["haitian-creole","ht"],["kreyol-ayisyen","ht"],["kreyol","ht"],
];
const PACKAGING_WORDS=new Set(["complete","completo","completa","complet","compleet","volledig","vollstaendig","vollstandig","konple","combined","package","curriculum","curriculo","curricula","final","translation","translations","lessons","lecciones","licoes","zip","md"]);
const BASE_CODES=new Set(["de","it","nl","ht","es","fr","pt","en"]);
const REGIONS=new Set(["us","gb","uk","es","ca","fr","br","pt","de","it","nl","ht","mx","do","pr","cu","419","caribbean","be","ch","at"]);
const SUPPORTED_BY_LOWER=new Map<string,string>(FILENAME_LOCALE_CODES.map(code=>[code.toLowerCase(),code]));
function stemOf(filename:string){const base=filename.split(/[\\/]/u).pop()??filename;const dot=base.lastIndexOf(".");return dot>0?base.slice(0,dot):base;}
function tokensOf(filename:string){return stemOf(filename).toLowerCase().split(/[^a-z0-9]+/u).filter(Boolean);}
function matchesAt(tokens:string[],start:number,phrase:string[]){return phrase.every((part,offset)=>tokens[start+offset]===part);}
export type LocaleInference={locale:string|null;ambiguous:boolean;reason:string|null};
export function analyzeFilenameLocale(filename:string):LocaleInference{
 const tokens=tokensOf(filename);let end=tokens.length;
 while(end>0&&(PACKAGING_WORDS.has(tokens[end-1])||/^v\d+$/u.test(tokens[end-1])))end-=1;
 const significant=tokens.slice(0,end),consumed=new Set<number>(),found=new Set<string>();
 for(const [name,locale] of HUMAN_LANGUAGE_NAMES){const phrase=name.split("-");for(let i=0;i+phrase.length<=significant.length;i+=1){if([...phrase.keys()].some(o=>consumed.has(i+o)))continue;if(matchesAt(significant,i,phrase)){found.add(locale);phrase.forEach((_,o)=>consumed.add(i+o));}}}
 for(let i=0;i+1<significant.length;i+=1){if(consumed.has(i)||consumed.has(i+1))continue;const base=significant[i],region=significant[i+1];if(!BASE_CODES.has(base)||!REGIONS.has(region))continue;found.add(SUPPORTED_BY_LOWER.get(`${base}-${region==="uk"?"gb":region}`)??SUPPORTED_BY_LOWER.get(base)!);consumed.add(i);consumed.add(i+1);}
 let last=significant.length-1;while(last>=0&&/^\d+$/u.test(significant[last]))last-=1;
 if(last>=0&&!consumed.has(last)&&BASE_CODES.has(significant[last])){found.add(SUPPORTED_BY_LOWER.get(significant[last])!);consumed.add(last);}
 if(found.size>1)return{locale:null,ambiguous:true,reason:`multiple language signals (${[...found].join(", ")})`};
 if(found.size===1)return{locale:[...found][0],ambiguous:false,reason:null};
 const interior=significant.filter((token,index)=>!consumed.has(index)&&BASE_CODES.has(token));
 if(interior.length)return{locale:null,ambiguous:true,reason:`language code "${interior[0]}" is not at the end of the filename`};
 return{locale:null,ambiguous:false,reason:null};
}
export function inferLocaleFromFilename(filename:string){return analyzeFilenameLocale(filename).locale;}
