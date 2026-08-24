import{statSync as i}from"node:fs";import{fileURLToPath as e}from"node:url";function o(){let n=e(new URL(".",import.meta.url))+"align.js",r="/@fs/"+n.replace(/\\/g,"/").replace(/^\/+/,"/");try{return`${r}?v=${i(n).mtimeMs}`}catch{return r}}function a(t={}){return{name:"align-ui",apply:"serve",transformIndexHtml(){return[{tag:"script",attrs:{type:"module"},children:`import { initAlign } from '${o()}';
initAlign(${JSON.stringify(t)});
`,injectTo:"body"}]}}}export{a as default};
