import{A as s}from"./chunk-V3Y375FU.js";import{sb as a}from"./chunk-QZTINFOT.js";var d=class n{transform(r){try{if(r instanceof s)return r.toDate().toISOString();if(r instanceof Date&&!isNaN(r.getTime()))return r.toISOString();if(typeof r=="string"){let t=new Date(r);if(!isNaN(t.getTime()))return t.toISOString();let o=[/^\d{4}\/\d{1,2}\/\d{1,2}$/,/^\d{1,2}\/\d{1,2}\/\d{4}$/,/^\d{4}-\d{1,2}-\d{1,2}$/,/^\d{4}\.\d{1,2}\.\d{1,2}$/,/^\d{1,2}-\d{1,2}-\d{4}$/];for(let i of o)if(i.test(r)){let e=r.replace(/[-\/\.]/g,"-").split("-").map(f=>parseInt(f,10));return i===o[4]?new Date(e[2],e[1]-1,e[0]).toISOString():new Date(e[0],e[1]-1,e[2]||1).toISOString()}}return null}catch(t){return console.error("Error converting date:",t),null}}static \u0275fac=function(t){return new(t||n)};static \u0275pipe=a({name:"convertToStandardDateTime",type:n,pure:!0})};export{d as a};
