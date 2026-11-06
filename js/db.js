const DB=(()=>{const N='examflow',S=['exams','students','results','settings'];let p;
const open=()=>p||(p=new Promise((res,rej)=>{const r=indexedDB.open(N,1);r.onupgradeneeded=()=>S.forEach(s=>r.result.createObjectStore(s,{keyPath:'id'}));r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}));
const tx=async(s,m,f)=>{const d=await open();return new Promise((res,rej)=>{const T=d.transaction(s,m),q=f(T.objectStore(s));T.oncomplete=()=>res(q&&q.result);T.onerror=()=>rej(T.error)})};
const api={all:s=>tx(s,'readonly',o=>o.getAll()),get:(s,k)=>tx(s,'readonly',o=>o.get(k)),put:(s,v)=>tx(s,'readwrite',o=>o.put(v)),del:(s,k)=>tx(s,'readwrite',o=>o.delete(k)),
uid:()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7),
async dump(){const o={app:'examflow',version:1,exported:new Date().toISOString()};for(const s of S)o[s]=await api.all(s);return o},
validate(o){if(!o||o.app!=='examflow')return false;return S.every(s=>o[s]===undefined||(Array.isArray(o[s])&&o[s].every(v=>v&&typeof v.id==='string')))},
async restore(o){if(!api.validate(o))throw new Error('invalid');for(const s of S)for(const v of o[s]||[])await api.put(s,v)}};
return api})();
if(typeof module!=='undefined')module.exports={DB};
