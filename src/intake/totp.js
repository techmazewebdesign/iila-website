// Normalise pasted time-based codes without silently accepting extra characters.
export function normalizeTotpCode(value){
 return String(value).replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-0x6f0)).replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-0x660)).replace(/[\s\u200e\u200f\u2066-\u2069]/g,'')
}
export function enrollmentExpired(deadline,now=Date.now()){
 const expires=Date.parse(deadline)
 return !Number.isFinite(expires)||expires<=now
}
