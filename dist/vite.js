import{fileURLToPath as t}from"node:url";function i(){return"/@fs/"+(t(new URL(".",import.meta.url))+"align.js").replace(/\\/g,"/").replace(/^\/+/,"/")}function r(n={}){return{name:"align-ui",apply:"serve",transformIndexHtml(){return[{tag:"script",attrs:{type:"module"},children:`import { initAlign } from '${i()}';
initAlign(${JSON.stringify(n)});
`,injectTo:"body"}]}}}export{r as default};
