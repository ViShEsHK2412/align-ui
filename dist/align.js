function xe(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function vr(e){return(e.split(",")[0]??"").trim().replace(/^['"]|['"]$/g,"")}function kr(e){let o={100:"thin",200:"extralight",300:"light",400:"regular",500:"medium",600:"semibold",700:"bold",800:"extrabold",900:"black"}[e.trim()];return o?`${e} ${o}`:e}function Lt(e){let t=getComputedStyle(e);return[{label:"family",value:vr(t.fontFamily),px:NaN},{label:"size",value:t.fontSize,px:xe(t.fontSize)},{label:"weight",value:kr(t.fontWeight),px:NaN},{label:"line",value:t.lineHeight,px:xe(t.lineHeight)},{label:"tracking",value:t.letterSpacing,px:xe(t.letterSpacing)}]}function Xn(e){let t="";for(let o of e.childNodes)o.nodeType===3&&(t+=o.nodeValue??"");return t.trim().replace(/\s+/g," ")}function Nt(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:xe(r)})}return o}function an(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function $r(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function Kn(e,t){if(t.length===0)return"";let o=[],n=0;for(let i of $r(e)){let a=an(i,t);a.length?o.push(`${Er(i)} ${a.join(" ")}`):n+=1}if(o.length===0)return n===1?"its one number is not on the scale":`none of its ${n} numbers are on the scale`;let r=n===0?"":n===1?"  \xB7  1 more, not on the scale":`  \xB7  ${n} more, not on the scale`;return o.join("  \xB7  ")+r}function Er(e){return String(Math.round(e*100)/100)}function Gn(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(xe)}function Yn(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),s=a.display.includes("flex")||a.display.includes("grid"),u=n==="x"?a.columnGap:a.rowGap,S=s&&u!=="normal"?xe(u):null,[v,N,c,w]=Gn(e),[C,E,W,p]=Gn(t),g=j=>Number.isFinite(j)?j:0,_=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,X=n==="x"?_?g(N)+g(p):g(E)+g(w):_?g(c)+g(C):g(W)+g(v);return{px:o,cssGap:S,margins:X,siblings:!0}}function jn(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function Un(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}function bt(e){let t=e.trim().toLowerCase();return t?t.startsWith("#")||/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(t)?!0:["black","white","transparent","currentcolor"].includes(t):!1}var Be;function Bn(e){if(Be===void 0&&(Be=document.createElement("canvas").getContext("2d")),!Be)return"";Be.fillStyle="#000000",Be.fillStyle=e;let t=Be.fillStyle;return Be.fillStyle="#ffffff",Be.fillStyle=e,t===Be.fillStyle?String(t):""}function Rt(e,t){let o=Bn(e);return o?t.filter(n=>bt(n.value)&&Bn(n.value)===o).map(n=>n.name).sort():[]}function Vn(e){let t=getComputedStyle(e),o=[],n=(r,i)=>{let a=i.trim();!a||a==="transparent"||/rgba?\([^)]*,\s*0\s*\)$/.test(a)||o.push({label:r,value:a})};return n("text",t.color),n("background",t.backgroundColor),o}function Sr(e,t,o){let n=r=>typeof CSS<"u"&&CSS.escape?CSS.escape(r):r.replace(/[^\w-]/g,"\\$&");return t?`#${n(t)}`:o.length?e+o.map(r=>`.${n(r)}`).join(""):e}function yt(e){let t=typeof e.className=="string"?e.className.trim().split(/\s+/).filter(Boolean):[];return Sr(e.tagName.toLowerCase(),e.id,t)}function qn(e){let t=yt(e);if(!/[.#]/.test(t))return 0;try{return document.querySelectorAll(t).length}catch{return 0}}function Cr(e){if(!e)return"inline <style>";let t=e.split("?")[0]??e;try{let o=new URL(t,"http://x").pathname;return decodeURI(o).replace(/^\//,"")||t}catch{return t}}var Tr=["width","height","padding","margin","border-width","gap","font-size","line-height","letter-spacing","color","background-color"];function Mr(e){for(let t=0;t<e.length;t+=1){let o=e.item(t);if(Tr.some(n=>o===n||o.startsWith(`${n}-`)))return!0}return!1}function Zn(e){let t=[],o=new Set,n=(r,i)=>{for(let a of Array.from(r)){if(a instanceof CSSMediaRule){matchMedia(a.conditionText).matches&&n(a.cssRules,i);continue}if(a instanceof CSSSupportsRule){CSS.supports(a.conditionText)&&n(a.cssRules,i);continue}let s=a.cssRules;if(s&&!(a instanceof CSSStyleRule)){n(s,i);continue}if(!(a instanceof CSSStyleRule))continue;let u=!1;try{u=e.matches(a.selectorText)}catch{continue}if(!u||!Mr(a.style))continue;let S=`${a.selectorText}|${i}`;o.has(S)||(o.add(S),t.push({selector:a.selectorText,file:i}))}};for(let r of Array.from(document.styleSheets)){if(r.ownerNode instanceof Element&&r.ownerNode.hasAttribute("data-align-ignore"))continue;let i;try{i=r.cssRules}catch{continue}n(i,Cr(r.href))}return t.reverse()}function On(e){if(!e||e==="none")return[];let t=e.trim().split(/\s+/),o=[];for(let n of t){if(!n.endsWith("px"))return[];let r=Number.parseFloat(n);if(!Number.isFinite(r))return[];o.push(r)}return o}function zn(e,t,o){let n=0;for(let r=0;r<e.length;r+=1){let i=n+e[r];if(o<i+.5)return r;n=i+t}return-1}function Ar(e,t){let o=t==="rtl";return e.startsWith("vertical")||e.startsWith("sideways")?{inline:"y",inlineReversed:e==="sideways-lr"?!o:o,blockReversed:e==="vertical-rl"||e==="sideways-rl"}:{inline:"x",inlineReversed:o,blockReversed:!1}}function Fn(e,t,o,n,r){return r?t-n:o-e}function Jn(e){let t=e.parentElement,o=0;for(;t&&getComputedStyle(t).display==="contents";)t=t.parentElement,o+=1;if(!t)return null;let n=getComputedStyle(t),r=getComputedStyle(e),i=n.display,a=[];if(o>0&&a.push({label:"through",value:o===1?"a display: contents parent":`${o} display: contents parents`}),r.position==="absolute"||r.position==="fixed")return a.push({label:"placed by",value:`${r.position}, not by the parent`}),{display:i,rows:a};if(r.float!=="none")return a.push({label:"placed by",value:`float: ${r.float}`}),{display:i,rows:a};let s=i.includes("flex"),u=i.includes("grid");if(!s&&!u)return a.push({label:"flow",value:i}),{display:i,rows:a};let S=Wn(n.rowGap==="normal"?"0px":n.rowGap),v=Wn(n.columnGap==="normal"?"0px":n.columnGap),N=S===v?S:`row ${S} \xB7 column ${v}`;if(s){let q=n.flexDirection;a.push({label:"direction",value:n.flexWrap==="nowrap"?q:`${q} \xB7 ${n.flexWrap}`}),a.push({label:"justify",value:n.justifyContent}),a.push({label:"align",value:n.alignItems}),a.push({label:"gap",value:N});let b=`${r.flexGrow} ${r.flexShrink} ${r.flexBasis}`;return b!=="0 1 auto"&&a.push({label:"this child",value:`flex: ${b}`}),r.alignSelf!=="auto"&&a.push({label:"align-self",value:r.alignSelf}),{display:i,rows:a}}let c=On(n.gridTemplateColumns),w=On(n.gridTemplateRows);c.length&&a.push({label:"columns",value:`${c.length} \xB7 ${c.map(rn).join(" ")}`}),w.length&&a.push({label:"rows",value:`${w.length} \xB7 ${w.map(rn).join(" ")}`}),a.push({label:"gap",value:N});let C=t.getBoundingClientRect(),E=e.getBoundingClientRect(),W={left:C.left+xe(n.borderLeftWidth)+xe(n.paddingLeft),right:C.right-xe(n.borderRightWidth)-xe(n.paddingRight),top:C.top+xe(n.borderTopWidth)+xe(n.paddingTop),bottom:C.bottom-xe(n.borderBottomWidth)-xe(n.paddingBottom)},p=Ar(n.writingMode,n.direction),g=(q,b)=>q==="x"?Fn(W.left,W.right,E.left,E.right,b):Fn(W.top,W.bottom,E.top,E.bottom,b),_=p.inline==="x"?"y":"x",X=xe(n.columnGap==="normal"?"0":n.columnGap),j=xe(n.rowGap==="normal"?"0":n.rowGap),le=zn(c,X,g(p.inline,p.inlineReversed)),ie=zn(w,j,g(_,p.blockReversed)),Q=[];return le>=0&&Q.push(`column ${le+1} of ${c.length}`),ie>=0&&Q.push(`row ${ie+1} of ${w.length}`),Q.length&&a.push({label:"this child",value:Q.join(" \xB7 ")}),{display:i,rows:a}}function Wn(e){return e.endsWith("px")?rn(Number.parseFloat(e)):e}function rn(e){return String(Math.round(e*100)/100)}var Qn=["display","position","width","height","padding","margin","border-width","border-style","border-radius","font-family","font-size","font-weight","font-style","line-height","letter-spacing","text-transform","text-align","color","background-color","border-color","opacity","flex-direction","justify-content","align-items","gap","flex-grow","flex-shrink","flex-basis","align-self","box-shadow","overflow","text-overflow","white-space"];function Lr(e,t){let o=[];for(let n of Qn){let r=e[n]??"",i=t[n]??"";r!==i&&o.push({prop:n,a:r,b:i})}return o}function _n(e){let t=getComputedStyle(e),o={};for(let n of Qn)o[n]=t.getPropertyValue(n);return o}function eo(e,t){return Lr(_n(e),_n(t))}var Nr={ignore:"",grid:null,hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"},theme:"auto"};function no(e={}){return{...Nr,...e}}var to=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function oo(e){return e.ignore?`${to}, ${e.ignore}`:to}function ae(e){return String(Math.round(e*100)/100)}function Rr(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function Ht(e){let t=e.getBoundingClientRect();return{el:e,label:Rr(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height,scale:Oe(e)}}function ro(e,t){let o=(n,r)=>Math.abs(n-r)<.001;return o(e.scale.x,t.scale.x)&&o(e.scale.y,t.scale.y)?e.scale:{x:1,y:1}}function io(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function Ve(e,t,o){let n=oo(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=io(r);return r&&r!==document.documentElement?Ht(r):null}var Pt=e=>parseFloat(e)||0;function sn(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[Pt(n),Pt(r),Pt(i),Pt(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function Pr(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function Ir(e,t){let o=ro(e,t),n=t.left+t.width/2,r=t.top+t.height/2;return[{x1:e.left,y1:r,x2:t.left,y2:r,label:ae((t.left-e.left)/o.x),axis:"x"},{x1:t.right,y1:r,x2:e.right,y2:r,label:ae((e.right-t.right)/o.x),axis:"x"},{x1:n,y1:e.top,x2:n,y2:t.top,label:ae((t.top-e.top)/o.y),axis:"y"},{x1:n,y1:t.bottom,x2:n,y2:e.bottom,label:ae((e.bottom-t.bottom)/o.y),axis:"y"}]}function It(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function Dt(e,t){let o=[],n=ro(e,t),r=e.left<t.right&&t.left<e.right,i=e.top<t.bottom&&t.top<e.bottom;if(r&&i){let[a,s]=Pr(e,t);return Ir(a,s)}if(!r){let[a,s]=e.right<=t.left?[e,t]:[t,e],u=i?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:a.right,y1:u,x2:s.left,y2:u,label:`${ae((s.left-a.right)/n.x)}`,axis:"x"}),o.push(...It(a.right,a.top,a.bottom,u,"x")),o.push(...It(s.left,s.top,s.bottom,u,"x"))}if(!i){let[a,s]=e.bottom<=t.top?[e,t]:[t,e],u=r?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:u,y1:a.bottom,x2:u,y2:s.top,label:`${ae((s.top-a.bottom)/n.y)}`,axis:"y"}),o.push(...It(a.bottom,a.left,a.right,u,"y")),o.push(...It(s.top,s.left,s.right,u,"y"))}return o}function Hr(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function ln(e){let t=Hr(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var Dr=5,Gr=8;function xt(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function cn(e,t,o){let n=null,r=Dr;for(let i of e){let a=Math.abs(xt(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function ao(e,t,o){if(o)return{at:e,what:""};let n=null,r=Gr;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function so(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function dn(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,s=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:s,y2:i,label:ae(r.gap/e.scale.x),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,s=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:s,label:ae(r.gap/e.scale.y),axis:"y"})}}return o}function lo(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],s=r[i],u=s-a;u<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:s,y2:t.y,label:ae(u),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:s,label:ae(u),axis:"y"}))}}return o}var We=3;function Br(e,t){return e.x<t.x+t.w+We&&t.x<e.x+e.w+We&&e.y<t.y+t.h+We&&t.y<e.y+e.h+We}function co(e,t,o=12){let n=(a,s)=>Math.min(Math.max(a,o),t.w-s-o),r=(a,s)=>Math.min(Math.max(a,o),t.h-s-o),i=[];for(let a of e){let s={...a,x:n(a.x,a.w),y:r(a.y,a.h)},u=!1;for(let S=0;S<16;S++){let v=i.find(c=>Br(c,s));if(!v)break;let N=s.axis==="x"?s.y:s.x;if(s.axis==="x"?s.y=r(u?v.y+v.h+We:v.y-s.h-We,s.h):s.x=n(u?v.x-s.w-We:v.x+v.w+We,s.w),(s.axis==="x"?s.y:s.x)===N){if(u)break;u=!0}}i.push(s)}return i}function uo(e,t){let{columns:o,gutter:n,margin:r}=e;if(o<=0)return[];let i=e.maxWidth>0?Math.min(e.maxWidth,t):t,a=Math.max(0,(t-i)/2),u=(Math.max(0,i-r*2)-n*(o-1))/o;if(u<=0)return[];let S=[];for(let v=0;v<o;v+=1)S.push({left:a+r+v*(u+n),width:u});return S}function po(e,t){return e*t>=8?e:0}function Or(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(s=>parseFloat(s)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function Oe(e){let t=1,o=1;for(let n=e;n;n=io(n)){let r=Or(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var Re=(e,t)=>({light:e,dark:t}),un={accent:Re("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:Re("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:Re("oklch(1 0 0)","oklch(0.264 0 0)"),fg:Re("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:Re("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:Re("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:Re("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:Re("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)"),pixelLine:Re("oklch(0.205 0 0 / 0.14)","oklch(0.97 0 0 / 0.14)")};function mo(e){return`light-dark(${e.light}, ${e.dark})`}var we=mo(Re("#fafafa","#1a1a1a"));function at(e,t=e){return mo(Re(`rgb(0 0 0 / ${t})`,`rgb(255 255 255 / ${e})`))}var ho=[0,.07,.08,.1,.12,.15,.2];function F(e){let t=ho[Math.max(0,Math.min(ho.length-1,e))];return t===0?we:at(t)}var x={primary:at(.9),secondary:at(.6),tertiary:at(.46,.55),disabled:at(.22,.26)},ue=at(.12),ze="0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)",Gt="0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)",ee=22,_e=36,B={tight:4,base:8,roomy:12,edge:16},z={exit:"160ms cubic-bezier(0.3, 0, 1, 1)",ui:"160ms cubic-bezier(0.2, 0, 0, 1)"},zr='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',D={title:13,body:12,tag:11,stack:zr},Z={regular:400,medium:500,semibold:600},pn="__align_font",Fr="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function fo(){if(document.getElementById(pn))return;let e=document.createElement("link");e.id=pn,e.rel="stylesheet",e.href=Fr,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function go(){document.getElementById(pn)?.remove()}function bo(e){let t=[`${Z.medium} ${D.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function mn(e){let t={};for(let o of Object.keys(un))t[o]=e?un[o].dark:un[o].light;return t}var hn=null;function yo(e){hn=e==="auto"?null:e}function fn(){if(hn)return hn==="dark";let e=document.documentElement,t=getComputedStyle(e).colorScheme;if(/dark/.test(t)&&!/light/.test(t))return!0;if(/light/.test(t)&&!/dark/.test(t))return!1;for(let o of[document.body,e]){if(!o)continue;let n=Wr(getComputedStyle(o).backgroundColor);if(n!==null)return n<.5}return matchMedia("(prefers-color-scheme: dark)").matches}function Wr(e){let t=/^rgba?\(([^)]+)\)$/.exec(e.trim());if(!t)return null;let o=t[1].split(/[\s,/]+/).filter(Boolean).map(Number),[n,r,i,a=1]=o;return n===void 0||r===void 0||i===void 0||a<.5?null:(.2126*n+.7152*r+.0722*i)/255}function qe(e,t){return e.replace(/\)$/,` / ${t})`)}var _r=`
`,Ie=16,Xr=`
.dock {
  /* No color-scheme here: the overlay sets it inline on the shadow host, from
     what the page actually looks like rather than what the machine prefers, and
     it inherits down. Declaring 'light dark' again would undo that and hand
     light-dark() back to the media query. */
  position: fixed; left: ${Ie}px; top: 0;
  /* Clamped to the window. A narrow viewport is not an edge case for this
     tool, it is the case it exists for: you make the window 375px wide
     precisely to check a mobile layout, and a readout that hangs off the
     screen there is useless exactly when you reached for it. */
  width: min(340px, calc(100vw - ${Ie*2}px));
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none;
  /* Not the whole panel: only the header is a drag surface, and making the
     numbers unselectable means the one thing you might want to paste into a
     stylesheet cannot be picked up by hand. Copy covers the whole reading; a
     selection covers the one value you actually wanted. */
  user-select: none;
  font-family: ${D.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${x.primary};
  --muted: ${x.secondary};
  --border: ${ue};
}
.panel {
  padding: 10px; border-radius: 0;
  /* Five sections now \u2014 box, tokens, styled by, matches, colour \u2014 and on a
     laptop that is taller than the window. place() clamps the position but
     cannot rescue a panel taller than the screen, so it scrolls instead. */
  max-height: calc(100vh - ${Ie*2}px);
  overflow-y: auto; overscroll-behavior: contain;
  font-size: ${D.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${we};

  box-shadow: ${ze};

  /* The one animation in the tool: a panel that must land exactly, so the
     Fluid spring.moderate tier at 160ms, critically damped. */
  opacity: 0;
  transform: translateY(4px) scale(0.98);
  transform-origin: bottom left;
  transition: opacity ${z.exit}, transform ${z.exit},
              box-shadow ${z.exit};
}
/* Held out of the way. Not display:none, so reopening does not replay the
   entrance animation for something that was already there. */
.dock[data-away] { visibility: hidden; pointer-events: none; }
.dock[data-open] .panel {
  pointer-events: auto;
  opacity: 1;
  transform: none;
  /* Slow in, faster out. Both come from the tokens now: the panel had been
     carrying hard-coded curves from the design system the theme replaced. */
  transition: opacity ${z.ui}, transform ${z.ui},
              box-shadow ${z.ui};
}
@media (prefers-reduced-motion: reduce) {
  /* Fewer and gentler, not none: the fade aids comprehension, the travel does not. */
  .panel { transform: none; transition: opacity 120ms linear; }
}

header {
  /* Stays put while the body scrolls: it is also the drag handle, and a handle
     you have to scroll back up to find is not a handle. */
  position: sticky; top: -10px; z-index: 1;
  background: ${we};
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] .panel { box-shadow: ${Gt}; }
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${D.title}px; font-weight: ${Z.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${D.body}px; font-weight: ${Z.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${D.tag}px; font-weight: ${Z.medium};
  margin-left: 4px;
  color: ${x.primary};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${D.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${F(1)}; }

/* Each region is one step up Fluid's surface ladder. Depth is carried by the
   surface and its shadow \u2014 no borders, the same way the system's own nesting
   example reads. Generous, even insets so each surface has room to breathe. */
/*
 * Spacing here is 4 / 8 / 12, and that is a correction rather than a
 * preference. It was 5, 6, 10 and 14 \u2014 values picked one at a time, none of
 * which relate to each other. Four levels of nesting multiply that: every
 * region spent 20px of padding and every row 10px of gap plus 44px of edge
 * columns, so the innermost cell \u2014 the content size, the one number you opened
 * the panel to read \u2014 was squeezed to 83px and ellipsised, while each zero
 * beside it got a full cell. The same values on a scale give it back about 40%.
 */
.region {
  border-radius: 0;
  /* Symmetric. An extra-tall top to clear the label offset each box's centre
     from its parent's, and nesting compounded it until the side numbers were
     visibly staggered. The label shares the top number's line instead. */
  padding: ${B.base}px;
}
.region[data-level="1"] { background: ${F(1)}; }
.region[data-level="2"] { background: ${F(2)}; }
.region[data-level="3"] { background: ${F(3)}; }
.content { background: ${F(4)}; }

/* The label and the top number sit on one line, and a label set 1px off the
   number it introduces is the kind of thing this tool exists to catch. Equal
   side columns keep the number centred on the region whatever the label says;
   a label wider than its column overflows rather than shifting the number. */
.head {
  display: grid; grid-template-columns: 1fr auto 1fr;
  align-items: baseline;
}
/* One muted weight for every label: the words already say which band is which,
   so colour would only compete with the numbers. */
.tag {
  justify-self: start; white-space: nowrap;
  font-size: ${D.tag}px; font-weight: ${Z.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${Z.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${Z.regular}; }
.row { display: flex; align-items: center; gap: ${B.tight}px; margin: ${B.tight}px 0; }
.row > .edge { flex: 0 0 20px; }
.row > .fill { flex: 1 1 auto; min-width: 0; }

/* Type and tokens sit under the box, in the same muted register as the band
   labels \u2014 they annotate the measurement rather than competing with it. */
.readout {
  user-select: text;
  margin-top: ${B.base}px; padding-top: ${B.base}px;
  border-top: 1px solid var(--border);
}
.readout-tag { position: static; margin-bottom: ${B.tight}px; }
/* One grid for the whole section rather than one per row, so every key in a
   section shares a column and the column sizes to the longest key in it. A
   fixed 62px was right until a diff started printing 'background-color', which
   it broke across two lines mid-word. The 62px floor keeps the rhythm the
   other sections already had. */
.readout-rows {
  display: grid; grid-template-columns: minmax(62px, max-content) 1fr;
  gap: 0 ${B.base}px; align-items: baseline;
  font-size: ${D.tag}px; line-height: 1.5;
}
.readout-row { display: contents; }
.readout-key { color: var(--muted); white-space: nowrap; }
/* A row is a label and a reading, and only one of them is data. The label can
   sit at the 11px floor; the reading cannot \u2014 the theme's own rule is that
   anything you read a number from is 12px or larger, and half this panel's
   numbers live in these rows. Baseline alignment on the row already handles
   the two sizes meeting on one line. */
.readout-value {
  color: var(--fg); overflow-wrap: anywhere;
  font-size: ${D.body}px;
  /* Several of these wrap \u2014 a diff value, a rule file, a token list \u2014 and a
     lone short word on the last line reads as a mistake. */
  text-wrap: pretty;
}
.content {
  border-radius: 0; padding: ${B.roomy}px ${B.base}px;
  text-align: center; font-weight: ${Z.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,wt=Ie,Ze=-1,st=!1;function xo(e){let t=document.createElement("style");t.textContent=Xr,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);let r=!1;function i(p,g){let _=document.createElement("div");_.className="readout";let X=document.createElement("div");X.className="tag readout-tag",X.textContent=p,_.appendChild(X);let j=document.createElement("div");j.className="readout-rows",_.appendChild(j);for(let[le,ie]of g){let Q=document.createElement("div");Q.className="readout-row";let q=document.createElement("span");q.className="readout-key",q.textContent=le;let b=document.createElement("span");b.className="readout-value",b.textContent=ie,Q.append(q,b),j.appendChild(Q)}return _}e.appendChild(o);let a=(p,g)=>Math.min(Math.max(p,Ie),Math.max(Ie,g-Ie));function s(){let p=o.offsetHeight||300;Ze<0&&(Ze=Math.max(Ie,innerHeight-p-Ie)),wt=a(wt,innerWidth-o.offsetWidth),Ze=a(Ze,innerHeight-p),o.style.transform=`translate(${wt-Ie}px, ${Ze}px)`}let u=null;function S(p){p.button===0&&(p.preventDefault(),p.stopPropagation(),u={x:p.clientX,y:p.clientY,dx:wt,dy:Ze},o.setAttribute("data-dragging",""),p.currentTarget.setPointerCapture(p.pointerId))}function v(p){u&&(wt=u.dx+(p.clientX-u.x),Ze=u.dy+(p.clientY-u.y),s())}function N(){u=null,o.removeAttribute("data-dragging")}addEventListener("resize",s);let c=null,w=[],C;function E(p){let g=document.createElement("div");return g.className="edge",g.textContent=p===0?"0":ae(p),p===0&&g.setAttribute("data-zero",""),g}function W(p,g,_,X){let[j,le,ie,Q]=_,q=document.createElement("div");q.className="region",q.setAttribute("data-level",String(g));let b=document.createElement("span");b.className="tag",b.textContent=p;let O=document.createElement("div");O.className="row";let re=document.createElement("div");re.className="fill",re.appendChild(X),O.append(E(Q),re,E(le));let I=document.createElement("div");return I.className="head",I.append(b,E(j)),q.append(I,O,E(ie)),q}return{show(p,g=[],_){w=g,C=_;let X=sn(p.el),[j,le,ie,Q]=X.border,[q,b,O,re]=X.padding,I=Oe(p.el),U=p.width/I.x,R=p.height/I.y,Y=Math.abs(I.x-1)>.001||Math.abs(I.y-1)>.001,te=document.createElement("header"),l=document.createElement("span");l.className="name",l.textContent=p.label;let T=document.createElement("span");T.className="size",T.textContent=`${ae(U)} \xD7 ${ae(R)}`;let y=document.createElement("button");if(y.className="close",y.textContent="\xD7",y.title="close (B brings it back)",y.addEventListener("pointerdown",M=>M.stopPropagation()),y.addEventListener("click",M=>{M.stopPropagation(),st=!0,o.removeAttribute("data-open")}),te.append(l,T),Y){let M=document.createElement("span");M.className="scale",M.textContent=`\xD7${ae(I.x)}`,M.title=`renders at ${ae(p.width)} \xD7 ${ae(p.height)}`,te.appendChild(M)}te.appendChild(y),te.addEventListener("pointerdown",S),te.addEventListener("pointermove",v),te.addEventListener("pointerup",N),te.addEventListener("pointercancel",N);let P=document.createElement("div");P.className="content",P.textContent=`${ae(U-Q-le-re-b)} \xD7 ${ae(R-j-ie-q-O)}`,P.title=P.textContent;let H=[te,W("margin",1,X.margin,W("border",2,X.border,W("padding",3,X.padding,P)))];if(r){let M=Xn(p.el),h=Lt(p.el);H.push(h.length&&M?i("type",h.map(A=>[A.label,A.value])):i("type",[["","nothing of its own to set type on"]]))}if(_&&_.el!==p.el&&_.el.isConnected){let M=eo(_.el,p.el).map(K=>[K.prop,`${K.a||"\u2014"} \u2192 ${K.b||"\u2014"}`]),h=M.slice(0,10);M.length>h.length&&h.push(["",`and ${M.length-h.length} more`]);let A=_.label===p.label?"the one locked before":_.label;H.push(i(`differs from ${A}`,h.length?h:[["","nothing in the properties it compares"]]))}let d=Jn(p.el);if(d&&d.rows.length&&H.push(i(`laid out by ${d.display}`,d.rows.map(M=>[M.label,M.value]))),g.length){let M=g.map(A=>[ae(A.px),A.detail]),h=Un(g.map(A=>A.px));h&&M.push(["",h]),H.push(i("gaps",M))}let f=Nt(p.el),k=Kn([U,R,...X.margin,...X.border,...X.padding,...r?Lt(p.el).map(M=>M.px):[]],f);k&&H.push(i("tokens",[["",k]]));let G=Zn(p.el);G.length&&H.push(i("styled by",G.slice(0,4).map(M=>[M.selector,M.file])));let L=qn(p.el);L>1&&H.push(i("matches",[["",`${L} elements share ${yt(p.el)}`]]));let $=f.filter(M=>bt(M.value));if($.length){let M=Vn(p.el).map(({label:h,value:A})=>{let K=Rt(A,$);return[h,K.length?`${A}  ${K.join(" ")}`:`${A}  \u2014`]});M.length&&H.push(i("colour",M))}n.replaceChildren(...H),c=p,s(),!st&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},showsType:()=>r,isOpen:()=>!st&&c!==null,toggleType(){r=!r,c&&this.show(c,w,C)},asText(){if(!c)return"";let p=sn(c.el),g=Oe(c.el),_=c.width/g.x,X=c.height/g.y,j=ie=>ie.map(Q=>ae(Q)).join(" "),le=[`${c.label}  ${ae(_)} \xD7 ${ae(X)}`,`margin   ${j(p.margin)}`,`border   ${j(p.border)}`,`padding  ${j(p.padding)}`];if(r)for(let ie of Lt(c.el))le.push(`${ie.label.padEnd(8)} ${ie.value}`);return le.join(_r)},hide(){c=null,o.removeAttribute("data-open")},setHidden(p){o.toggleAttribute("data-away",p)},toggle(){c&&(st=!st,st?o.removeAttribute("data-open"):(s(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",s),o.remove(),t.remove()}}}function wo(e=20,t=1e3){let o=[];return{push(n,r,i=Date.now()){let a=o[o.length-1];if(a&&r!==""&&a.tag===r&&i-a.at<=t){a.at=i;return}o.push({state:n,tag:r,at:i}),o.length>e&&o.shift()},pop(){return o.pop()?.state??null},peek(){return o[o.length-1]?.state??null},depth(){return o.length},clear(){o.length=0}}}var Kr="0 0 24 24";var m=(e,t,o)=>{let n={path:e};return t!==void 0&&(n.fade=t),o!==void 0&&(n.weight=o),n},ce=(e,t,o,n,r,i)=>i===void 0?{rect:[e,t,o,n,r]}:{rect:[e,t,o,n,r],fade:i},Yr={rulers:[m("M2 8V4"),m("M22 8V4"),m("M22 6H2"),ce(2,12,20,8,2),m("M6 15v-3"),m("M10 15v-3"),m("M14 15v-3"),m("M18 15v-3")],xray:[m("M3 7V5a2 2 0 0 1 2-2h2"),m("M17 3h2a2 2 0 0 1 2 2v2"),m("M21 17v2a2 2 0 0 1-2 2h-2"),m("M7 21H5a2 2 0 0 1-2-2v-2")],grid:[ce(3,3,18,18,2),m("M9 3v18"),m("M15 3v18")],pixels:[ce(3,3,18,18,2),m("M3 9h18"),m("M3 15h18"),m("M9 3v18"),m("M15 3v18")],type:[m("M12 4v16"),m("M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"),m("M9 20h6")],panel:[ce(3,3,18,18,2),ce(8,8,8,8,1)],freeze:[ce(14,3,5,18,1),ce(5,3,5,18,1)],copy:[ce(8,8,14,14,2),m("M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2")],pick:[m("m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12"),m("m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z"),m("m2 22 .414-.414")],hide:[m("M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"),m("M14.084 14.158a3 3 0 0 1-4.242-4.242"),m("M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"),m("m2 2 20 20")],undo:[m("M9 14 4 9l5-5"),m("M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11")],edit:[m("M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"),m("m15 5 4 4")],sideTop:[m("M4 5h16v14H4z",.25,1.25),m("M4 5h16",1,3.5)],sideRight:[m("M4 5h16v14H4z",.25,1.25),m("M20 5v14",1,3.5)],sideBottom:[m("M4 5h16v14H4z",.25,1.25),m("M4 19h16",1,3.5)],sideLeft:[m("M4 5h16v14H4z",.25,1.25),m("M4 5v14",1,3.5)],fontSize:[m("M12 4v16"),m("M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"),m("M9 20h6")],fontWeight:[m("M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8")],lineHeight:[m("M3 5h18",.35),m("M3 19h18",.35),m("M12 8v8")],tracking:[m("M5 5v14",.35),m("M19 5v14",.35),m("M8 12h8")],italic:[m("M19 4h-9"),m("M14 20H5"),m("m15 4-4 16")],textAlign:[m("M21 6H3"),m("M15 12H3"),m("M17 18H3")],textCase:[m("M3.5 13h6"),m("m2 16 4.5-9 4.5 9"),m("M18 16V7"),m("m14 11 4-4 4 4")],underline:[m("M6 4v6a6 6 0 0 0 12 0V4"),m("M4 20h16")],textColour:[m("m6 16 6-12 6 12",.35),m("M8 12h8",.35),m("M4 20h16")],backgroundColour:[ce(3,3,18,18,2),m("M3 12h18",.35),m("M12 3v18",.35)],borderColour:[ce(3,3,18,18,2),ce(8,8,8,8,1,.35)],opacity:[m("M12 3a9 9 0 0 0 0 18z"),m("M12 3a9 9 0 0 1 0 18",.35)],padding:[ce(3,3,18,18,2,.35),ce(7,7,10,10,1)],margin:[ce(3,3,18,18,2),ce(7,7,10,10,1,.35)],boxSizing:[ce(3,3,18,18,2),m("M7 7h10v10H7z",.35)],widthIcon:[m("M2 12h20"),m("m6 8-4 4 4 4"),m("m18 8 4 4-4 4")],heightIcon:[m("M12 2v20"),m("m8 6 4-4 4 4"),m("m8 18 4 4 4-4")],borderWidth:[ce(3,3,18,18,2),m("M3 3h18")],borderStyle:[m("M3 12h4"),m("M10 12h4"),m("M17 12h4")],borderRadius:[m("M21 21V9a6 6 0 0 0-6-6H3")],gap:[ce(3,4,7,16,1,.35),ce(14,4,7,16,1,.35),m("M12 8v8")],flexDirection:[m("M12 5v14"),m("m8 9 4-4 4 4"),m("m8 15 4 4 4-4")],justify:[m("M4 4v16",.35),m("M20 4v16",.35),ce(8,8,8,8,1)],alignItems:[m("M4 4h16",.35),m("M4 20h16",.35),ce(8,8,8,8,1)],flexWrap:[m("M3 7h13a4 4 0 0 1 0 8H8"),m("m11 12-3 3 3 3")],shadow:[ce(3,3,14,14,2),m("M21 9v10a2 2 0 0 1-2 2H9",.35)],backdrop:[ce(3,3,18,18,2),m("M7 12h10",.35),m("M7 8h10",.35),m("M7 16h10",.35)],arrowUp:[m("m5 12 7-7 7 7"),m("M12 19V5")],arrowDown:[m("M12 5v14"),m("m19 12-7 7-7-7")],link:[m("M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"),m("M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71")],check:[m("M20 6 9 17l-5-5")],warning:[m("m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"),m("M12 9v4"),m("M12 17h.01")],cross:[m("M18 6 6 18"),m("m6 6 12 12")]},gn="http://www.w3.org/2000/svg";function ve(e,t=16){let o=document.createElementNS(gn,"svg");o.setAttribute("viewBox",Kr),o.setAttribute("width",String(t)),o.setAttribute("height",String(t)),o.setAttribute("fill","none"),o.setAttribute("stroke","currentColor"),o.setAttribute("stroke-width","2"),o.setAttribute("stroke-linecap","round"),o.setAttribute("stroke-linejoin","round"),o.setAttribute("aria-hidden","true");for(let n of Yr[e])if("rect"in n){let[r,i,a,s,u]=n.rect,S=document.createElementNS(gn,"rect");S.setAttribute("x",String(r)),S.setAttribute("y",String(i)),S.setAttribute("width",String(a)),S.setAttribute("height",String(s)),S.setAttribute("rx",String(u)),n.fade!==void 0&&S.setAttribute("opacity",String(n.fade)),n.weight!==void 0&&S.setAttribute("stroke-width",String(n.weight)),o.appendChild(S)}else{let r=document.createElementNS(gn,"path");r.setAttribute("d",n.path),n.fade!==void 0&&r.setAttribute("opacity",String(n.fade)),n.weight!==void 0&&r.setAttribute("stroke-width",String(n.weight)),o.appendChild(r)}return o}var jr=[{title:"Pointing at things",rows:[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure whatever is under the cursor"],["Click","lock an element, so it keeps measuring after the pointer leaves"],["Right-click","add another to the locked set, or drop one from it. Two locked also gets you a diff"],["Drag the panel header","move the box model out of your way"],["Esc","clear the locks, then close the tool"]]},{title:"Guides",rows:[["Drag from a rule","pull out a guide; drag it back into the rule to throw it away"],["V  /  H","drop a vertical or horizontal guide at the cursor"],["Hover a guide","its distance to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the guide you last touched. Shift for 10px"],["L","pin a guide, so it cannot be moved or deleted by accident"],["Ctrl/Cmd while placing","ignore snapping"],["Del","remove the guide under the cursor. Shift+Del for all of them"]]}],Le=B.edge,bn=24,Ur=900,vt=_e,kt=B.base,Vr=`
.flag {
  position: fixed; top: ${Le}px; right: ${Le}px;
  display: flex; align-items: center; gap: 8px;
  transition: top ${z.ui};
  padding: ${(_e-bn)/2}px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${D.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${D.tag}px; font-weight: ${Z.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${x.primary};
  background: ${we};
  box-shadow: ${ze};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
/* No negative tracking: it is 11px, and tightening is what large text wants.
   Small text reads better at zero or a hair positive. */
.flag .name { letter-spacing: 0; }
/* The rulers draw a gutter along the top edge, and the badge sits in it. Step
   down out of the way rather than covering the ticks the rulers exist to show. */
.flag[data-rulers] { top: ${Le+ee}px; }
.help[data-rulers] { top: ${Le+ee+vt+kt}px; }
.flag:hover { background: ${F(1)}; }
.flag .count { color: ${x.secondary}; }

/* A layers bar, not a palette. Switches, then the one control that changes the
   page, then the things that happen once. */
.tools { display: flex; align-items: center; gap: 2px; }
.sep {
  width: 1px; align-self: stretch; margin: 0 4px;
  background: ${ue};
}
.tool {
  width: ${bn}px; height: ${bn}px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; cursor: pointer;
  font: inherit; font-size: ${D.tag}px; font-weight: ${Z.medium};
  color: ${x.tertiary};
}
/* Both glyphs occupy the same cell so one can cross-fade into the other; a
   swap would jump, and the point is to be noticed without being a movement. */
.tool > svg { grid-area: 1 / 1; transition: opacity ${z.ui}; }
.tool > .ack { opacity: 0; }
.tool[data-ack] > .ack { opacity: 1; }
.tool[data-ack] > .glyph { opacity: 0; }
.tool:hover { background: ${F(2)}; color: ${x.primary}; }
/* On the press, not on the release. Waiting for the click to acknowledge a
   button is the difference between a control that answers and one that lags,
   and it costs one rule. */
.tool:active { background: ${F(4)}; color: ${x.primary}; }
.tool:focus-visible { outline: 1px solid ${x.primary}; outline-offset: -1px; }
/* On is the film, not a colour: the three hues each already mean something on
   the canvas, and a fourth here would say nothing. */
.tool[data-on] { background: ${F(4)}; color: ${x.primary}; }
/*
 * Armed reads differently from on, deliberately. Every other toggle draws
 * something over the page; this one lets the page be rewritten, and a tool that
 * can do that while looking exactly like one that cannot is the problem the
 * arming design exists to avoid. It inverts rather than taking a hue: red
 * already means a measurement here, and a second meaning for it would cost
 * more than the emphasis is worth.
 */
.tool[data-tool='edit'][data-on] {
  background: ${x.primary};
  color: ${we};
}

/* The badge steps down out of the ruler gutter, and that step is decoration:
   under reduced motion it should simply be in the right place. */
@media (prefers-reduced-motion: reduce) {
  .flag { transition: none; }
}
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: ${Le+vt+kt}px; right: ${Le}px;
  /* 368 plus two insets is 400, so this was the first thing to hang off the
     left edge of a phone-width window. */
  /* The padding is in the subtraction because these boxes are content-box:
     without it the clamp lets the panel sit flush against the far edge with
     no inset at all, which reads as broken rather than as tight. */
  width: min(368px, calc(100vw - ${Le*2+B.base*2}px));
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${Le*2+vt+kt}px); overflow-y: auto;
  padding: ${B.base}px; border-radius: 0;
  user-select: none;
  font-family: ${D.stack};
  font-synthesis: none;
  font-size: ${D.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${x.primary};
  background: ${we};
  box-shadow: ${ze};
  /*
   * It grows out of the badge that opens it, rather than appearing whole.
   * transform-origin at the top right is the badge's corner, so the list and
   * the thing you pressed to get it stay visibly connected \u2014 the one place in
   * this tool where something opens *from* somewhere.
   *
   * Visibility rather than display, because display cannot be transitioned;
   * it is delayed out by the duration on close so the fade finishes first.
   */
  opacity: 0; visibility: hidden; pointer-events: none;
  transform: scale(0.98) translateY(-4px);
  transform-origin: top right;
  transition: opacity ${z.ui}, transform ${z.ui}, visibility 0s linear 160ms;
}
.help[data-open] {
  opacity: 1; visibility: visible; pointer-events: auto;
  transform: none;
  transition: opacity ${z.ui}, transform ${z.ui}, visibility 0s;
}
@media (prefers-reduced-motion: reduce) {
  /* The fade says it arrived; the travel and the scale are decoration. */
  .help { transform: none; transition: opacity 120ms linear, visibility 0s linear 120ms; }
  .help[data-open] { transition: opacity 120ms linear, visibility 0s; }
}
/* Baselines, not boxes. A key sits in a bordered chip and its description does
   not, so aligning the two boxes puts the key's text 4px below the first line
   of the text it labels \u2014 right on one-line rows by luck, wrong on every row
   that wraps. Aligning on the baseline is right on both. */
.help dl {
  display: grid; grid-template-columns: 16px auto 1fr;
  /* Baseline alignment already buys each wrapped row 4px of separation, so
     the gap stays where it was rather than pushing the list off the screen. */
  align-items: baseline; gap: ${B.tight}px ${B.base}px; margin: 0;
}
.help dt { justify-self: start; }
/* The icon column: present for the rows that have a button, blank for the rows
   that are gestures. Blank rather than absent, so the keys stay in one column
   down the whole list instead of stepping in and out. */
.help .glyph {
  justify-self: center;
  /* Not centred: a wrapped description makes the row tall, and an icon
     floating halfway down it reads as belonging to the line it is level with
     rather than to the row it is in. Level with the first line. */
  align-self: start; margin-top: 1px;
  color: ${x.tertiary}; line-height: 0;
}
.help h4 {
  grid-column: 1 / -1; margin: 10px 0 2px;
  font-size: ${D.tag}px; font-weight: ${Z.semibold};
  color: ${x.tertiary};
}
.help h4:first-child { margin-top: 0; }
.help kbd {
  display: inline-block; padding: 3px 5px;
  font: inherit; font-weight: ${Z.medium};
  border: 1px solid ${ue};
  background: ${F(2)};
}
/* These run to three lines, and a one-word last line reads as a mistake. */
.help dd { margin: 0; color: ${x.secondary}; text-wrap: pretty; }
`,yn=[{name:"rulers",label:"Rulers",key:"R",toggle:!0,what:"a scale down the top and left edges, in page pixels \u2014 and the gutters you drag guides out of"},{name:"xray",label:"X-ray",key:"X",toggle:!0,what:"outline every element at once, to see the boxes a layout is really made of"},{name:"grid",label:"Column grid",key:"G",toggle:!0,what:"the grid your design is built on, columns filled and gutters left empty. Needs one configured"},{name:"pixels",label:"Pixel grid",key:"K",toggle:!0,what:"a ten-pixel lattice over the page, to read an offset off without measuring it"},{name:"type",label:"Type",key:"T",toggle:!0,what:"add size, weight, line height and tracking to the panel, each checked against your scale"},{name:"panel",label:"Box model",key:"B",toggle:!0,what:"the readout itself \u2014 margins, borders, padding, what places the element, what styles it"},{name:"hide",label:"Hide",key:"\\",toggle:!0,what:"everything drawn, out of the way for a moment. Your locks, guides and layers all survive it"},{name:"freeze",label:"Freeze",key:"F",toggle:!0,what:"hold every animation and transition where it stands, so a moving thing can be measured"},{name:"copy",label:"Copy",key:"C",toggle:!1,what:"put everything in the panel on the clipboard as text"},{name:"pick",label:"Colour",key:"P",toggle:!1,what:"sample a colour from anywhere on screen and match it against your palette"},{name:"edit",label:"Edit",key:"E",toggle:!0,what:"let the panel change the page. Off until you say so, shown while it is on, and everything goes back when you turn it off"},{name:"undo",label:"Undo",key:"Ctrl/Cmd + Z",toggle:!1,what:"step back through the guides \u2014 a whole run of nudges counts as one"}];function vo(e,t){let o=document.createElement("style");o.textContent=Vr,e.appendChild(o);let n=document.createElement("div");n.className="flag";let r=document.createElement("span");r.className="name",r.textContent="Align";let i=document.createElement("span");i.className="count";let a=new Map,s=new Map,u=document.createElement("div");u.className="tools";for(let w of yn){if(w.name==="freeze"||w.name==="copy"){let W=document.createElement("span");W.className="sep",u.appendChild(W)}let C=document.createElement("button");C.type="button",C.className="tool",C.dataset.tool=w.name;let E=ve(w.name);E.classList.add("glyph"),C.appendChild(E),C.setAttribute("aria-label",w.label),C.title=`${w.label}  \xB7  ${w.key}
${w.what}`,w.toggle||C.setAttribute("data-once",""),C.addEventListener("click",W=>{W.stopPropagation(),t(w.name)}),a.set(w.name,C),u.appendChild(C)}n.append(r,u,i);let S=document.createElement("div");S.className="help";let v=document.createElement("dl");function N(w){let C=document.createElement("h4");C.textContent=w,v.appendChild(C)}function c(w,C,E){let W=document.createElement("span");W.className="glyph",E&&W.appendChild(ve(E,14));let p=document.createElement("dt"),g=document.createElement("kbd");g.textContent=w,p.appendChild(g);let _=document.createElement("dd");_.textContent=C,v.append(W,p,_)}N("The bar, left to right");for(let w of yn)c(w.key,`${w.label} \u2014 ${w.what}`,w.name);for(let w of jr){N(w.title);for(let[C,E]of w.rows)c(C,E)}return S.appendChild(v),n.addEventListener("click",w=>{w.stopPropagation(),S.toggleAttribute("data-open")}),e.append(n,S),{acknowledge(w,C){let E=a.get(w);if(!E)return;clearTimeout(s.get(w)),E.querySelector(".ack")?.remove();let W=ve(C?"check":"cross");W.classList.add("ack"),E.appendChild(W),requestAnimationFrame(()=>E.setAttribute("data-ack",C?"yes":"no")),s.set(w,setTimeout(()=>{E.removeAttribute("data-ack"),setTimeout(()=>E.querySelector(".ack")?.remove(),200)},Ur))},update(w,C){i.textContent=w>0?`${w} locked`:"";let E=C.rulers&&!C.hide;n.toggleAttribute("data-rulers",E),S.toggleAttribute("data-rulers",E);for(let g of yn)g.toggle&&a.get(g.name)?.toggleAttribute("data-on",C[g.name]===!0);let W=a.get("copy");W&&(W.disabled=!C.canCopy);let p=a.get("undo");p&&(p.disabled=!C.canUndo)},closeHelp(){let w=S.hasAttribute("data-open");return S.removeAttribute("data-open"),w},destroy(){for(let w of s.values())clearTimeout(w);n.remove(),S.remove(),o.remove()}}}var qr=2,Zr=3;function Jr(e,t,o,n,r=1){let i=e+t/qr,a=r>0?Math.round(i/r)*r:i;return Math.max(o,Math.min(n,Number(a.toPrecision(12))))}function Qr(e,t,o){let n=/^\s*(-?\d*\.?\d+)\s*(px|rem|em|%)?\s*$/i.exec(e);if(!n)return null;let r=parseFloat(n[1]);return Number.isFinite(r)?Math.max(t,Math.min(o,r)):null}function ko(e){return String(Math.round(e*100)/100)}var ei=`
.scrub {
  display: flex; align-items: center; gap: 6px;
  min-width: 0;
  height: 28px;
  padding: 0 8px;
  border: 0; border-radius: 0;
  background: ${F(1)};
  color: ${x.primary};
  font: inherit;
  font-size: ${D.body}px; font-weight: ${Z.regular};
  font-variant-numeric: tabular-nums;
  line-height: 1;
  text-align: left;
  user-select: none;
  touch-action: none;
  transition: background ${z.ui};
}
.scrub[data-axis='x'] { cursor: ew-resize; }
.scrub[data-axis='y'] { cursor: ns-resize; }
.scrub:hover { background: ${F(3)}; }
.scrub[data-scrubbing] { background: ${F(5)}; }
.scrub:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }

/* The glyph is the label, so it must not shrink when the number grows. */
.scrub-glyph { flex: none; display: grid; place-items: center; color: ${x.tertiary}; }
.scrub-text {
  flex: none;
  color: ${x.tertiary};
  font-size: ${D.tag}px;
  white-space: nowrap;
}
.scrub-value {
  flex: 1; min-width: 0;
  text-align: right;
  white-space: nowrap; overflow: hidden;
}

.scrub-input {
  flex: 1; min-width: 0; width: 100%;
  padding: 0; border: 0;
  background: none; outline: none;
  color: ${x.primary};
  font: inherit;
  font-size: ${D.body}px;
  font-variant-numeric: tabular-nums;
  text-align: right;
}
.scrub-input:focus { box-shadow: inset 0 -1px ${ue}; }
`,$o="align-scrub";function ti(e){if(e.querySelector(`#${$o}`))return;let t=document.createElement("style");t.id=$o,t.textContent=ei,e.appendChild(t)}function Eo(e,t){ti(e);let o=t.min??0,n=t.max??9999,r=t.step??1,i=t.axis??"x",a=t.value,s=document.createElement("button");if(s.type="button",s.className="scrub",s.dataset.axis=i,s.setAttribute("aria-label",t.label),s.title=`${t.label}. Drag to change, click to type.`,t.glyph){let p=document.createElement("span");p.className="scrub-glyph",p.appendChild(ve(t.glyph,14)),s.appendChild(p)}else if(t.text){let p=document.createElement("span");p.className="scrub-text",p.textContent=t.text,s.appendChild(p)}let u=document.createElement("span");u.className="scrub-value",s.appendChild(u);function S(){u.textContent=ko(a),s.setAttribute("aria-valuenow",String(a))}function v(p,g){let _=Math.max(o,Math.min(n,p));_!==a&&(a=_,S(),t.onChange(a)),g||t.onCommit?.(a)}let N=null,c=!1,w=1;s.addEventListener("pointerdown",p=>{if(!(E||p.button!==0)){p.preventDefault(),p.stopPropagation();try{s.setPointerCapture(p.pointerId)}catch{}N={x:p.clientX,y:p.clientY,value:a},c=!1,w=(i==="x"?Oe(s).x:Oe(s).y)||1,s.setAttribute("data-scrubbing","")}}),s.addEventListener("pointermove",p=>{if(!N)return;let g=i==="x"?(p.clientX-N.x)/w:(p.clientY-N.y)/w;!c&&Math.abs(g)>Zr&&(c=!0),c&&v(Jr(N.value,g,o,n,r),!0)});let C=p=>{if(N){try{s.releasePointerCapture(p.pointerId)}catch{}N=null,s.removeAttribute("data-scrubbing"),c&&t.onCommit?.(a)}};s.addEventListener("pointerup",C),s.addEventListener("pointercancel",C);let E=null;function W(){if(E)return;E=document.createElement("input"),E.className="scrub-input",E.type="text",E.value=ko(a),E.setAttribute("aria-label",`${t.label}, as a number`),u.style.display="none",s.appendChild(E),E.focus(),E.select();let p=g=>{if(E){if(g){let _=Qr(E.value,o,n);_!==null&&v(_,!1)}E.remove(),E=null,u.style.display="",s.focus()}};E.addEventListener("keydown",g=>{g.stopPropagation(),g.key==="Enter"?(g.preventDefault(),p(!0)):g.key==="Escape"&&(g.preventDefault(),p(!1))}),E.addEventListener("blur",()=>p(!0)),E.addEventListener("pointerdown",g=>g.stopPropagation())}return s.addEventListener("click",p=>{if(p.stopPropagation(),c){c=!1;return}W()}),s.addEventListener("keydown",p=>{if(p.target!==s||p.altKey||p.metaKey||p.ctrlKey)return;let g=p.shiftKey?10:1;p.key==="ArrowUp"||p.key==="ArrowRight"?(p.preventDefault(),p.stopPropagation(),v(a+r*g,!1)):p.key==="ArrowDown"||p.key==="ArrowLeft"?(p.preventDefault(),p.stopPropagation(),v(a-r*g,!1)):p.key==="Enter"&&(p.preventDefault(),p.stopPropagation(),W())}),S(),{el:s,set(p){a=Math.max(o,Math.min(n,p)),S()},destroy(){E?.remove(),s.remove()}}}function So(e,t=0,o=0){return Math.min(100,Math.max(...[e,t,o].map(n=>{let[r,i="0"]=String(n).toLowerCase().split("e");return Math.max(0,(r.split(".")[1]?.length??0)-Number(i))})))}function xn(e,t,o,n){let r=o??-1/0,i=n??1/0,a=Math.max(r,Math.min(i,e));if(a===r||a===i||!Number.isFinite(t)||t<=0)return a;let s=o??0,u=s+Math.round((a-s)/t)*t;return Math.max(r,Math.min(i,Number(u.toPrecision(14))))}var ni=.03125;function oi(e,t,o){let n=(e-t)/(o-t),r=Math.round(n*10)/10;return Math.abs(n-r)<=ni?t+r*(o-t):e}var ri=32,ii=8,ai=200;function Co(e,t){let o=Math.max(0,e-ri);return t*ii*Math.sqrt(Math.min(o/ai,1))}function Bt(e,t,o){return o===t?0:(e-t)/(o-t)*100}function To(e,t,o){let n=Math.max(0,Math.min(1,e));return t+n*(o-t)}function si(e,t,o,n,r,i=!1){if(e==="Home")return o;if(e==="End")return n;let a=["ArrowRight","ArrowUp","PageUp"].includes(e)?1:["ArrowLeft","ArrowDown","PageDown"].includes(e)?-1:0;if(!a)return;if(!(r>0)||n<=o)return o;let s=e.startsWith("Page")||i?10:1,u=(t-o)/r,S=o+(a>0?Math.floor(u+1e-9)+s:Math.ceil(u-1e-9)-s)*r;return Math.max(o,Math.min(n,Number(S.toPrecision(14))))}function li(e,t,o){let n=(t-e)/o;return n<=10&&Number.isFinite(n)&&n>1?Array.from({length:Math.round(n)-1},(r,i)=>(i+1)*o/(t-e)*100):Array.from({length:9},(r,i)=>(i+1)*10)}function Mo(e,t,o=0,n=0){let r=So(t,o,n),i=Math.max(r,Math.min(4,So(e)));return!Number.isFinite(t)||t<=0?i:xn(e,t,o,n)===e?r:i}function ci(e,t,o,n){return(o-t)/n<=10?Math.max(t,Math.min(o,t+Math.round((e-t)/n)*n)):oi(e,t,o)}var vn={stiffness:300,damping:25,mass:.8},di={stiffness:220,damping:22,mass:1};function zt(e,t,o,n,r){let i=(-r.stiffness*(e-o)-r.damping*t)/r.mass,a=t+i*n;return{x:e+a*n,v:a}}function Ft(e,t,o,n=.01){return Math.abs(e-o)<n&&Math.abs(t)<n}var ui=0,pi=.5,hi=.9,mi=.1,fi=3,gi=800,Ao=8,Ot=3,bi=20,No=10,wn=12,yi=`
.sl {
  position: relative;
  height: ${_e}px;
  overflow: hidden;
  background: ${F(1)};
  border-radius: 0;
  cursor: pointer;
  user-select: none;
  touch-action: none;
}
.sl:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }

/* Behind everything, and scaled rather than resized: a width change is layout,
   a transform is not, and this moves on every pointer event of a drag. */
.sl-fill {
  position: absolute; inset: 0;
  transform-origin: left center;
  transform: scaleX(0);
  background: ${F(3)};
  transition: background ${z.ui};
  pointer-events: none;
}
.sl[data-awake] .sl-fill { background: ${F(5)}; }

.sl-marks { position: absolute; inset: 0; pointer-events: none; }
.sl-mark {
  position: absolute; top: 50%;
  width: 1px; height: 8px;
  transform: translate(-50%, -50%);
  background: transparent;
  transition: background ${z.ui};
}
.sl[data-awake] .sl-mark { background: ${ue}; }

.sl-handle {
  position: absolute; top: 50%; left: 0;
  width: ${Ot}px; height: ${bi}px;
  background: ${x.primary};
  pointer-events: none;
  opacity: ${ui};
  /* Two transitions, two jobs: opacity and the squash are eased, the position
     is not \u2014 it is written every frame and must not lag the pointer. */
  transition: opacity ${z.ui}, scale ${z.ui};
  scale: 0.25 1;
}
.sl[data-awake] .sl-handle { opacity: ${pi}; scale: 1 1; }
.sl[data-dragging] .sl-handle { opacity: ${hi}; }
.sl[data-dodge] .sl-handle { opacity: ${mi}; scale: 1 0.75; }

.sl-label, .sl-value {
  position: absolute; top: 50%;
  transform: translateY(-50%);
  font-size: ${D.body}px; font-weight: ${Z.medium};
  line-height: 1;
  white-space: nowrap;
  transition: color ${z.ui};
}
.sl-label { left: ${No}px; color: ${x.secondary}; pointer-events: none; }
.sl-value {
  right: ${wn}px;
  color: ${x.secondary};
  /* Inter has tabular figures, so the number stops shifting as it changes
     without loading a second face for it. */
  font-variant-numeric: tabular-nums;
  pointer-events: auto;
  border-bottom: 1px solid transparent;
  padding-bottom: 1px;
}
.sl[data-awake] .sl-value { color: ${x.primary}; }
/* Only after the hover delay: the underline is the promise that a click here
   edits rather than seeks, and it must not appear during a drag. */
.sl-value[data-editable] { border-bottom-color: ${x.secondary}; cursor: text; }

.sl-input {
  position: absolute; right: ${wn}px; top: 50%;
  transform: translateY(-50%);
  width: 5ch;
  padding: 0 0 1px; border: 0;
  border-bottom: 1px solid ${x.secondary};
  background: none; outline: none;
  text-align: right;
  font: inherit;
  font-size: ${D.body}px; font-weight: ${Z.medium};
  font-variant-numeric: tabular-nums;
  color: ${x.primary};
}
`,Lo="align-slider";function xi(e){if(e.querySelector(`#${Lo}`))return;let t=document.createElement("style");t.id=Lo,t.textContent=yi,e.appendChild(t)}function Wt(e,t){xi(e);let o=t.min??0,n=t.max??1,r=t.step??.01,i=t.value,a=document.createElement("div");a.className="sl",a.tabIndex=0,a.setAttribute("role","slider"),a.setAttribute("aria-label",t.label),a.setAttribute("aria-valuemin",String(o)),a.setAttribute("aria-valuemax",String(n));let s=document.createElement("div");s.className="sl-fill";let u=document.createElement("div");u.className="sl-marks";for(let h of li(o,n,r)){let A=document.createElement("div");A.className="sl-mark",A.style.left=`${h}%`,u.appendChild(A)}let S=document.createElement("div");S.className="sl-handle";let v=document.createElement("span");v.className="sl-label",v.textContent=t.label;let N=document.createElement("span");N.className="sl-value",a.append(u,s,S,v,N);let c=Bt(i,o,n),w=0,C=null,E=0,W=0;function p(){return a.offsetWidth}function g(){s.style.transform=`scaleX(${c/100})`;let h=p(),A=c/100*h,K=Math.max(Ot,Math.min(h-Ot,A))-Ot/2;S.style.transform=`translate(${K}px, -50%)`;let ne=!1;if(h>0){let Se=No+v.offsetWidth+Ao,ge=h-wn-N.offsetWidth-Ao;ne=A<Se||A>ge}a.toggleAttribute("data-dodge",ne)}function _(){let h=Mo(i,r,o,n);N.textContent=t.unit?`${i.toFixed(h)}${t.unit}`:i.toFixed(h),a.setAttribute("aria-valuenow",String(i)),a.setAttribute("aria-valuetext",N.textContent)}function X(){E&&cancelAnimationFrame(E),E=0,C=null,w=0}function j(){return typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches}function le(h,A=vn){if(j()){X(),c=h,g();return}if(C=h,W=performance.now(),E)return;let K=ne=>{let Se=Math.min((ne-W)/1e3,.03333333333333333);if(W=ne,C===null){E=0;return}let ge=zt(c,w,C,Se,A);if(c=ge.x,w=ge.v,g(),Ft(c,w,C)){c=C,w=0,C=null,E=0,g();return}E=requestAnimationFrame(K)};E=requestAnimationFrame(K)}function ie(h,A){let K=xn(h,r,o,n),ne=K!==i;i=K,_(),A?le(Bt(i,o,n)):(X(),c=Bt(i,o,n),g()),ne&&t.onChange(i)}let Q=null,q=!0,b=null,O=1,re=0,I=0;function U(h){if(re=h,h===0){a.style.width="",a.style.transform="";return}a.style.width=`calc(100% + ${Math.abs(h)}px)`,a.style.transform=h<0?`translateX(${h}px)`:""}function R(){if(re===0)return;if(j()){U(0),a.style.width="",a.style.transform="";return}let h=0,A=performance.now(),K=ne=>{let Se=Math.min((ne-A)/1e3,.03333333333333333);A=ne;let ge=zt(re,h,0,Se,di);if(h=ge.v,U(ge.x),Ft(ge.x,h,0,.05)){U(0),a.style.width="",a.style.transform="",I=0;return}I=requestAnimationFrame(K)};I=requestAnimationFrame(K)}function Y(h){if(!b)return 0;let A=p();return A<=0?0:(h-b.left)/O/A}let te=h=>{if(!(f||h.button!==0)){h.preventDefault();try{a.setPointerCapture(h.pointerId)}catch{}Q={x:h.clientX,y:h.clientY},q=!0,b=a.getBoundingClientRect(),O=Oe(a).x||1,a.setAttribute("data-awake","")}},l=h=>{if(!Q)return;let A=h.clientX-Q.x,K=h.clientY-Q.y;q&&Math.hypot(A,K)>fi&&(q=!1,a.setAttribute("data-dragging","")),!(q||!b)&&(j()||(h.clientX<b.left?U(Co(b.left-h.clientX,-1)):h.clientX>b.right?U(Co(h.clientX-b.right,1)):re!==0&&U(0)),X(),ie(To(Y(h.clientX),o,n),!1))},T=h=>{Q&&(q&&ie(ci(To(Y(h.clientX),o,n),o,n,r),!0),t.onCommit?.(i),R(),Q=null,a.removeAttribute("data-dragging"),P||a.removeAttribute("data-awake"))},y=()=>{Q&&(U(0),a.style.width="",a.style.transform="",Q=null,a.removeAttribute("data-dragging"),P||a.removeAttribute("data-awake"))},P=!1,H=()=>{P=!0,a.setAttribute("data-awake","")},d=()=>{P=!1,Q||a.removeAttribute("data-awake")},f=null,k=!1,G=0;function L(){if(f)return;f=document.createElement("input"),f.className="sl-input",f.type="text",f.setAttribute("aria-label",`${t.label} value`),f.value=i.toFixed(Mo(i,r,o,n)),N.style.display="none",a.appendChild(f),f.focus(),f.select();let h=A=>{if(f){if(A){let K=parseFloat(f.value);Number.isFinite(K)&&(ie(Math.max(o,Math.min(n,K)),!0),t.onCommit?.(i))}f.remove(),f=null,N.style.display="",$(!1),a.focus()}};f.addEventListener("keydown",A=>{A.stopPropagation(),A.key==="Enter"?(A.preventDefault(),h(!0)):A.key==="Escape"&&(A.preventDefault(),h(!1))}),f.addEventListener("blur",()=>h(!0)),f.addEventListener("pointerdown",A=>A.stopPropagation())}function $(h){k=h,N.toggleAttribute("data-editable",h)}N.addEventListener("pointerenter",()=>{f||Q||(G=window.setTimeout(()=>$(!0),gi))}),N.addEventListener("pointerleave",()=>{clearTimeout(G),f||$(!1)}),N.addEventListener("pointerdown",h=>{k&&(h.stopPropagation(),h.preventDefault(),L())});let M=h=>{if(h.target!==a||h.altKey||h.metaKey||h.ctrlKey)return;let A=si(h.key,i,o,n,r,h.shiftKey);if(A===void 0){if(h.key!=="Enter")return;h.preventDefault(),h.stopPropagation(),$(!0),L();return}h.preventDefault(),h.stopPropagation(),ie(A,!1),t.onCommit?.(i)};return a.addEventListener("pointerdown",te),a.addEventListener("pointermove",l),a.addEventListener("pointerup",T),a.addEventListener("pointercancel",y),a.addEventListener("lostpointercapture",y),a.addEventListener("pointerenter",H),a.addEventListener("pointerleave",d),a.addEventListener("keydown",M),_(),requestAnimationFrame(g),{el:a,set(h){i=xn(h,r,o,n),_(),X(),c=Bt(i,o,n),g()},destroy(){X(),I&&cancelAnimationFrame(I),clearTimeout(G),a.remove()}}}function $e(e,t){return getComputedStyle(e).getPropertyValue(t).trim()}function wi(e,t){let o=parseFloat(e);if(e.endsWith("px")&&Number.isFinite(o)){let r=an(o,t)[0];if(r)return r}return bt(e)?Rt(e,t)[0]??null:null}function vi(e){if(e.length===0)return"";let t=new Map;for(let n of e){let r=t.get(n.selector)??[];r.push(n),t.set(n.selector,r)}let o=["These changes were made live in the browser and are not in the source yet.","Apply them, preferring the named token wherever one is given.",""];for(let[n,r]of t){o.push(`${n} {`);for(let i of r){let a=i.token?`var(${i.token})`:i.to,s=i.token?`  /* ${i.to}, was ${i.from} */`:`  /* was ${i.from} */`;o.push(`  ${i.prop}: ${a};${s}`)}o.push("}","")}return o.join(`
`).trimEnd()}function Ro(){let e=new Map,t=!1;function o(r){let i=e.get(r);if(i)return i;let a=new Map;return e.set(r,a),a}function n(r,i,a){let s=r.style;a.inline?s.setProperty(i,a.inline):s.removeProperty(i)}return{get armed(){return t},arm(){t=!0},disarm(){let r=this.revertAll();return t=!1,r},set(r,i,a){if(!t)return;let s=o(r);s.has(i)||s.set(i,{inline:r.style.getPropertyValue(i),computed:$e(r,i)}),r.style.setProperty(i,a)},revert(r,i){let a=e.get(r),s=a?.get(i);!a||!s||(n(r,i,s),a.delete(i),a.size===0&&e.delete(r))},revertAll(){let r=0;for(let[i,a]of e)for(let[s,u]of a)n(i,s,u),r+=1;return e.clear(),r},touched(r,i){return e.get(r)?.has(i)??!1},touchedProps(r){return[...e.get(r)?.keys()??[]].sort()},changes(){let r=[];for(let[i,a]of e)for(let[s,u]of a)r.push({el:i,prop:s,from:u.computed,to:$e(i,s)});return r},asPrompt(){let r=[];for(let[i,a]of e){let s=Nt(i),u=yt(i);for(let[S,v]of a){let N=$e(i,S);N!==v.computed&&r.push({selector:u,prop:S,from:v.computed,to:N,token:wi(N,s)})}}return vi(r)}}}var he=(e,t=0,o=1)=>Math.max(t,Math.min(o,e)),kn=e=>(e%360+360)%360,_t=(e,t)=>e.map(o=>o.reduce((n,r,i)=>n+r*t[i],0)),ki=e=>Math.abs(e)<=.04045?e/12.92:Math.sign(e)*((Math.abs(e)+.055)/1.055)**2.4,$i=e=>Math.abs(e)<=.0031308?12.92*e:Math.sign(e)*(1.055*Math.abs(e)**.4166666666666667-.055),Ei=[[.4123907993,.3575843394,.1804807884],[.2126390059,.7151686788,.0721923154],[.0193308187,.1191947798,.9505321522]],Si=[[.4865709486,.2656676932,.1982172852],[.2289745641,.6917385218,.0792869141],[0,.0451133819,1.0439443689]],Ci=[[3.2409699419,-1.5373831776,-.4986107603],[-.9692436363,1.8759675015,.0415550574],[.0556300797,-.2039769589,1.0569715142]],Ti=[[2.4934969119,-.9313836179,-.4027107845],[-.8294889696,1.7626640603,.0236246858],[.0358458302,-.0761723893,.956884524]],Mi=[[.819022438,.3619062601,-.1288737815],[.0329836539,.9292868616,.0361446664],[.0481771894,.2642395318,.6335478285]],Ai=[[1.2268798734,-.5578149966,.2813910502],[-.0405757626,1.1122868294,-.0717110667],[-.0763729497,-.421493324,1.5869240244]];function Et(e,t=1,o="srgb"){let n=_t(o==="p3"?Si:Ei,e.map(ki)),[r,i,a]=_t(Mi,n).map(Math.cbrt),s=.2104542553*r+.793617785*i-.0040720468*a,u=1.9779984951*r-2.428592205*i+.4505937099*a,S=.0259040371*r+.7827717662*i-.808675766*a,v=Math.hypot(u,S);return{l:he(s),c:v<1e-7?0:v,h:v<1e-7?0:kn(Math.atan2(S,u)*180/Math.PI),a:he(t)}}function St(e,t="srgb"){let o=e.c*Math.cos(e.h*Math.PI/180),n=e.c*Math.sin(e.h*Math.PI/180),r=[(e.l+.3963377774*o+.2158037573*n)**3,(e.l-.1055613458*o-.0638541728*n)**3,(e.l-.0894841775*o-1.291485548*n)**3];return _t(t==="p3"?Ti:Ci,_t(Ai,r)).map($i)}function Po(e,t="srgb"){return St(e,t).every(o=>o>=-1e-5&&o<=1.00001)}function Xt(e,t="srgb"){if(Po(e,t))return e;let o=0,n=e.c;for(let r=0;r<20;r++){let i=(o+n)/2;Po({...e,c:i},t)?o=i:n=i}return{...e,c:o}}function Je(e,t,o="srgb"){return e<=0||e>=1?0:Xt({l:e,c:.5,h:t,a:1},o).c}function Qe(e){let t=e.trim();return/^oklch\(/i.test(t)?"oklch":/^color\(display-p3\s/i.test(t)?"p3":"hex"}var $t=(e,t=4)=>Number(e.toFixed(t));function Ke(e,t){let o=e.a<1?` / ${$t(e.a)}`:"";if(t==="oklch")return`oklch(${$t(e.l)} ${$t(e.c)} ${$t(e.h,2)}${o})`;let n=t==="p3"?"p3":"srgb",r=St(Xt(e,n),n);if(t==="p3")return`color(display-p3 ${r.map(a=>$t(he(a),5)).join(" ")}${o})`;let i=r.map(a=>Math.round(he(a)*255));return e.a<1&&i.push(Math.round(e.a*255)),"#"+i.map(a=>a.toString(16).padStart(2,"0")).join("")}var Li=/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?(%|deg|grad|rad|turn)?$/i;function Xe(e,t=1,o=!1){let n=e.match(Li);if(!n)return null;let r=parseFloat(e);if(!Number.isFinite(r))return null;let i=n[1]?.toLowerCase();return o?i==="rad"?r*180/Math.PI:i==="turn"?r*360:i==="grad"?r*.9:!i||i==="deg"?r:null:i==="%"?r*t/100:i?null:r}function Fe(e){let t=e.trim().toLowerCase();if(t==="transparent")return{l:0,c:0,h:0,a:0};if(/^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/.test(t)){let c=t.slice(1);c.length<=4&&(c=[...c].map(C=>C+C).join(""));let w=c.match(/../g).map(C=>parseInt(C,16)/255);return Et(w.slice(0,3),w[3]??1)}let o=t.match(/^(oklch|rgb|rgba|hsl|hsla|color)\(([^()]*)\)$/);if(!o)return null;let n=o[1],r=o[2].trim(),i=n==="color";if(i){if(!r.startsWith("display-p3 "))return null;r=r.slice(11).trim()}let a=r.includes(",");if(a&&(i||n==="oklch"||r.includes("/")))return null;let s=a?r.split(",").map(c=>c.trim()):r.split(/\s*\/\s*/);if(!a&&s.length>2)return null;let u=a?s.slice(0,3):s[0].split(/\s+/);if(u.length!==3||a&&s.length!==3&&s.length!==4||a&&n.startsWith("rgb")&&u.some(c=>c.endsWith("%"))&&!u.every(c=>c.endsWith("%")))return null;let S=a?s[3]:s[1],v=S===void 0?1:Xe(S);if(v===null)return null;if(n==="oklch"){let c=Xe(u[0]),w=Xe(u[1],.4),C=Xe(u[2],1,!0);return c===null||w===null||C===null?null:{l:he(c),c:Math.max(0,w),h:kn(C),a:he(v)}}if(n.startsWith("hsl")){let c=Xe(u[0],1,!0),w=Xe(u[1]),C=Xe(u[2]);if(c===null||w===null||C===null||!u[1].endsWith("%")||!u[2].endsWith("%"))return null;let E=he(w),W=he(C),p=E*Math.min(W,1-W),g=_=>{let X=(_+kn(c)/30)%12;return W-p*Math.max(-1,Math.min(X-3,9-X,1))};return Et([g(0),g(8),g(4)],v)}let N=u.map(c=>Xe(c,i?1:255));return N.some(c=>c===null)?null:Et(N.map(c=>i?c:he(c/255)),v,i?"p3":"srgb")}function lt(e,t=!1){return Ke(t?{...e,a:1}:e,"oklch")}var Io=148,Ni=14,Kt=12,Ho=`
.pick {
  position: fixed;
  z-index: 3;
  width: 248px;
  display: grid;
  gap: ${B.base}px;
  padding: ${B.roomy}px;
  border-radius: 0;
  /*
   * The host is pointer-events: none so the page underneath stays usable, and
   * every surface of ours has to opt back in. The dock does. This did not, so
   * it rendered perfectly and ignored every click aimed at it.
   */
  pointer-events: auto;
  /*
   * GROUND, opaque, exactly like the dock - not a rung of the surface ladder.
   *
   * Two separate mistakes were stacked here. The first: the ladder is alpha
   * over an opaque ground, and this popover is portalled to the shadow root
   * rather than parented to its row, so it is a sibling of the dock with
   * nothing behind it but the page. surface(6) alone was 20% white over
   * whatever happened to be down there, which is why it was see-through.
   *
   * The second was the fix I reached for first. Painting GROUND and then a
   * surface(6) film on top does make it opaque, but it makes it a *lighter*
   * ground than the panel, and every film above it is then a film over a film:
   * the format labels measured 3.67:1, under AA, the exact failure theme.ts
   * documents for tertiary. The ladder means nested regions of one box model.
   * A popover is not nested six levels deep, it is a new plane - so it gets
   * the ground itself, the shadow carries the elevation, and every pair inside
   * measures the same as it does in the panel.
   */
  background: ${we};
  /*
   * A shadow, not a border. This is the one thing on the panel that is
   * genuinely floating above another surface, and elevation is what a shadow
   * is for; an outline here would read as a box drawn around a box.
   */
  box-shadow: ${Gt};
  /*
   * Typography too, for the same reason: it is not inside the dock, so it
   * inherits from a host pinned by all: initial, and comes out in the
   * browser's default serif at the browser's default size.
   */
  font-family: ${D.stack};
  font-synthesis: none;
  font-size: ${D.body}px;
  font-weight: ${Z.regular};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${x.primary};
  transition: opacity ${z.ui}, translate ${z.ui};
}
@starting-style { .pick { opacity: 0; translate: 0 -4px; } }
.pick[data-closing] { opacity: 0; translate: 0 -4px; }

/* The plane. */
.pick-plane {
  position: relative;
  width: 100%; height: ${Io}px;
  cursor: crosshair; touch-action: none;
}
.pick-plane:focus-visible { outline: 2px solid ${x.primary}; outline-offset: 2px; }
.pick-canvas { display: block; width: 100%; height: 100%; }
.pick-marker {
  position: absolute; left: 0; top: 0;
  width: 12px; height: 12px;
  margin: -6px 0 0 -6px;
  border-radius: 50%;
  pointer-events: none;
  /*
   * The one place a ring is load-bearing rather than decorative: it sits on
   * arbitrary colour, so nothing about the surface beneath it is known. Two
   * rings, light outside dark, so one of them always has contrast. This is the
   * exception the rules name, not an exception to them.
   */
  box-shadow: 0 0 0 1.5px #fff, 0 0 0 3px rgb(0 0 0 / 0.45);
}

/* Hue and opacity. */
.pick-track {
  position: relative;
  height: ${Ni}px;
  cursor: pointer; touch-action: none;
}
.pick-track:focus-visible { outline: 2px solid ${x.primary}; outline-offset: 2px; }
.pick-track-bed { position: absolute; inset: 0; }
.pick-hue .pick-track-bed {
  background: var(--track);
}
.pick-alpha .pick-track-bed {
  /* The checkerboard is the only honest ground for an alpha ramp. */
  background-image: var(--track), var(--checker);
  background-size: auto, 8px 8px;
  background-position: 0 0, 0 0;
}
.pick-thumb {
  position: absolute; top: 50%; left: 0;
  width: ${Kt}px; height: ${Kt}px;
  margin-top: -${Kt/2}px; margin-left: -${Kt/2}px;
  border-radius: 50%;
  background: var(--thumb, #fff);
  box-shadow: 0 0 0 1.5px #fff, 0 0 0 3px rgb(0 0 0 / 0.45);
  pointer-events: none;
}

/* Bottom rows. */
.pick-row { display: flex; align-items: center; gap: ${B.tight}px; }
.pick-seg { display: flex; gap: 2px; flex: 1; }
.pick-fmt {
  flex: 1;
  height: 22px; padding: 0;
  border: 0; border-radius: 0;
  background: ${F(3)}; color: ${x.secondary};
  font: inherit; font-size: ${D.tag}px; font-weight: ${Z.medium};
  cursor: pointer;
  transition: background ${z.ui}, color ${z.ui};
}
.pick-fmt:hover { background: ${F(4)}; color: ${x.primary}; }
.pick-fmt[data-on] { background: ${x.primary}; color: ${we}; }
.pick-fmt:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }

.pick-css {
  flex: 1; min-width: 0;
  height: 24px; padding: 0 ${B.base/2}px;
  border: 0; border-radius: 0;
  background: ${F(2)}; color: ${x.primary};
  font: inherit; font-size: ${D.tag}px;
  font-variant-numeric: tabular-nums;
}
.pick-css[aria-invalid] { color: ${x.primary}; background: ${F(4)}; }
.pick-css:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }

.pick-dropper {
  flex: none;
  display: grid; place-items: center;
  width: 24px; height: 24px;
  padding: 0; border: 0; border-radius: 0;
  background: ${F(2)}; color: ${x.secondary};
  cursor: pointer;
  transition: background ${z.ui}, color ${z.ui};
}
.pick-dropper:hover { background: ${F(4)}; color: ${x.primary}; }
.pick-dropper:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }

/* Out of gamut in the chosen output space. */
.pick-warn {
  display: none;
  align-items: center; gap: ${B.tight}px;
  color: ${x.secondary}; font-size: ${D.tag}px;
}
.pick[data-clipped] .pick-warn { display: flex; }

@media (prefers-reduced-motion: reduce) {
  .pick { transition: none; }
}
`,Ri="conic-gradient("+ue+" 0 25%, transparent 0 50%, "+ue+" 0 75%, transparent 0)";function Ce(e,t){let o=document.createElement(e);return o.className=t,o instanceof HTMLButtonElement&&(o.type="button"),o}function Yt(e,t){let o=Fe(t.value)??{l:.5,c:0,h:0,a:1},n=Qe(t.value),r=0,i="",a=Ce("div","pick");a.setAttribute("role","dialog"),a.setAttribute("aria-label","Colour picker"),a.style.setProperty("--checker",Ri);let s=Ce("div","pick-plane");s.tabIndex=0,s.setAttribute("role","application"),s.setAttribute("aria-label","Colour field. Arrow keys adjust lightness and saturation.");let u=Ce("canvas","pick-canvas");u.setAttribute("aria-hidden","true");let S=Ce("span","pick-marker");s.append(u,S);let v=U("pick-hue","Hue"),N=U("pick-alpha","Opacity"),c=Ce("div","pick-row"),w=Ce("div","pick-seg");w.setAttribute("role","radiogroup"),w.setAttribute("aria-label","Colour format");let C=["hex","oklch","p3"],E={hex:"Hex",oklch:"OKLCH",p3:"P3"},W=C.map(d=>{let f=Ce("button","pick-fmt");return f.textContent=E[d],f.setAttribute("role","radio"),f.addEventListener("click",()=>R(o,d)),w.append(f),f});c.append(w);let p=Ce("div","pick-row"),g=Ce("input","pick-css");if(g.type="text",g.spellcheck=!1,g.setAttribute("aria-label","CSS colour"),p.append(g),"EyeDropper"in window){let d=Ce("button","pick-dropper");d.setAttribute("aria-label","Pick a colour from the screen"),d.append(ve("pick",14)),d.addEventListener("click",async()=>{try{let f=window.EyeDropper,k=await new f().open(),G=Fe(k.sRGBHex);G&&R({...G,a:o.a})}catch{}}),p.append(d)}let X=Ce("div","pick-warn");X.append(ve("warning",12));let j=document.createElement("span");X.append(j),a.append(s,v.el,N.el,c,p,X),e.append(a);let le=()=>n==="hex"?"srgb":"p3",ie=u.getContext("2d",{colorSpace:"display-p3"}),Q=ie?.getContextAttributes?.().colorSpace==="display-p3"?"p3":"srgb",q="",b=0;function O(){if(!ie)return;let d=`${o.h.toFixed(3)}:${le()}:${u.width}`;if(d===q)return;q=d;let{width:f,height:k}=u,G=ie.createImageData(f,k);for(let L=0;L<k;L++){let $=1-L/(k-1),M=Je($,o.h,le());for(let h=0;h<f;h++){let A=St({l:$,c:h/(f-1)*M,h:o.h,a:1},Q),K=(L*f+h)*4;G.data[K]=Math.round(he(A[0])*255),G.data[K+1]=Math.round(he(A[1])*255),G.data[K+2]=Math.round(he(A[2])*255),G.data[K+3]=255}}ie.putImageData(G,0,0)}function re(){let d=Math.min(devicePixelRatio||1,2),f=Math.max(1,Math.round(s.clientWidth*d)),k=Math.max(1,Math.round(Io*d));u.width===f&&u.height===k||(u.width=f,u.height=k,q="")}function I(d){let f=s.getBoundingClientRect(),k=1-he((d.clientY-f.top)/f.height);r=he((d.clientX-f.left)/f.width),R({...o,l:k,c:r*Je(k,o.h,le())})}s.addEventListener("pointerdown",d=>{if(d.button===0){d.preventDefault(),s.focus({preventScroll:!0});try{s.setPointerCapture(d.pointerId)}catch{}I(d)}}),s.addEventListener("pointermove",d=>{s.hasPointerCapture(d.pointerId)&&I(d)}),s.addEventListener("pointerup",d=>{s.hasPointerCapture(d.pointerId)&&s.releasePointerCapture(d.pointerId)}),s.addEventListener("keydown",d=>{if(!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(d.key))return;d.preventDefault();let f=d.shiftKey?.1:.01,k=he(o.l+(d.key==="ArrowUp"?f:d.key==="ArrowDown"?-f:0));r=he(r+(d.key==="ArrowRight"?f:d.key==="ArrowLeft"?-f:0)),R({...o,l:k,c:r*Je(k,o.h,le())})});function U(d,f){let k=Ce("div",`pick-track ${d}`);k.tabIndex=0,k.setAttribute("role","slider"),k.setAttribute("aria-label",f);let G=Ce("div","pick-track-bed"),L=Ce("div","pick-thumb");k.append(G,L);let $=0,M=0,h=0,A=0,K=0,ne=!1,Se=()=>{},ge=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;function Te(){L.style.left=`${$*100}%`}function Ae(){A&&cancelAnimationFrame(A),A=0,M=0}function Ge(V){if(h=V,ge()){Ae(),$=V,Te();return}if(K=performance.now(),A)return;let pe=Ue=>{let se=Math.min((Ue-K)/1e3,.03333333333333333);K=Ue;let me=zt($,M,h,se,vn);if($=me.x,M=me.v,Te(),Ft($,M,h,5e-4)){$=h,M=0,A=0,Te();return}A=requestAnimationFrame(pe)};A=requestAnimationFrame(pe)}function it(V){let pe=k.getBoundingClientRect();return he((V.clientX-pe.left)/pe.width)}k.addEventListener("pointerdown",V=>{if(V.button!==0)return;V.preventDefault(),k.focus({preventScroll:!0});try{k.setPointerCapture(V.pointerId)}catch{}let pe=it(V);Ge(pe),Se(pe),ne=!0}),k.addEventListener("pointermove",V=>{if(!ne||!k.hasPointerCapture(V.pointerId))return;let pe=it(V);Ae(),$=pe,h=pe,Te(),Se(pe)});let At=V=>{ne=!1,k.hasPointerCapture(V.pointerId)&&k.releasePointerCapture(V.pointerId)};return k.addEventListener("pointerup",At),k.addEventListener("pointercancel",At),k.addEventListener("keydown",V=>{let pe=V.shiftKey?.1:.01,Ue=V.key==="ArrowRight"?pe:V.key==="ArrowLeft"?-pe:V.key==="Home"?-1:V.key==="End"?1:0;if(!Ue)return;V.preventDefault();let se=he($+Ue);Ge(se),Se(se)}),{el:k,set(V,pe){k.setAttribute("aria-valuenow",pe),k.setAttribute("aria-valuetext",pe),!ne&&(Ae(),$=V,h=V,Te())},bind(V){Se=V},gradient(V){G.style.setProperty("--track",V)},thumbColour(V){L.style.setProperty("--thumb",V)},destroy(){Ae()}}}v.bind(d=>{let f=d*360;R({...o,h:f,c:r*Je(o.l,f,le())})}),N.bind(d=>R({...o,a:d}));function R(d,f=n){n=f,o=n==="oklch"?d:Xt(d,n==="p3"?"p3":"srgb");let k=Ke(o,n);i=k,l(),t.onChange(k)}function Y(d){let f=Fe(d.value);return f?(d.removeAttribute("aria-invalid"),d.title="",o={...f,h:f.c<1e-7?o.h:f.h},n=Qe(d.value),i=d.value.trim(),l(),t.onChange(i),!0):(d.setAttribute("aria-invalid","true"),d.title="Hex, rgb(), hsl(), oklch() or color(display-p3 ...)",!1)}g.addEventListener("change",()=>Y(g)),g.addEventListener("keydown",d=>{d.key==="Enter"&&(d.preventDefault(),Y(g)),d.key==="Escape"&&(g.value=i,g.removeAttribute("aria-invalid")),d.stopPropagation()}),g.addEventListener("blur",()=>{g.hasAttribute("aria-invalid")&&(g.value=i,g.removeAttribute("aria-invalid"))});let te="";function l(){let d=le(),f=Je(o.l,o.h,d);f>0&&(r=he(o.c/f)),S.style.left=`${r*100}%`,S.style.top=`${(1-o.l)*100}%`,S.style.background=lt(o,!0),v.set(o.h/360,`${Math.round(o.h)} degrees`),N.set(o.a,`${Math.round(o.a*100)} percent`);let k=`${o.l.toFixed(4)}:${r.toFixed(4)}:${d}`;if(k!==te){te=k;let L=Array.from({length:73},($,M)=>{let h=M*5;return Ke({l:o.l,c:r*Je(o.l,h,d),h,a:1},"oklch")});v.gradient(`linear-gradient(to right in oklab, ${L.join(", ")})`)}v.thumbColour(lt(o,!0)),N.gradient(`linear-gradient(to right in oklab, ${lt({...o,a:0})}, ${lt(o,!0)})`),N.thumbColour(lt(o)),W.forEach((L,$)=>{let M=C[$]===n;L.toggleAttribute("data-on",M),L.setAttribute("aria-checked",String(M)),L.tabIndex=M?0:-1}),document.activeElement!==g&&e.activeElement!==g&&(g.value=Ke(o,n),g.removeAttribute("aria-invalid"));let G=n==="oklch"&&!St(o,"srgb").every(L=>L>=-1e-5&&L<=1.00001);a.toggleAttribute("data-clipped",G),G&&(j.textContent="Outside sRGB \u2014 clipped on older displays"),cancelAnimationFrame(b),b=requestAnimationFrame(O)}function T(){let d=t.anchor.getBoundingClientRect(),f=248,k=a.offsetHeight||320,L=d.left+d.width/2<innerWidth/2?d.right+B.base:d.left-f-B.base;L=he(L,B.base,Math.max(B.base,innerWidth-f-B.base));let $=d.top;$+k>innerHeight-B.base&&($=innerHeight-k-B.base),$=Math.max(B.base,$),a.style.left=`${L}px`,a.style.top=`${$}px`}re(),l(),T(),requestAnimationFrame(T);let y=()=>T();addEventListener("scroll",y,!0),addEventListener("resize",y);let P=new ResizeObserver(()=>{re(),l()});P.observe(s);let H=!1;return{contains(d){return d?a.contains(d):!1},update(d){if(H||d===i)return;let f=Fe(d);f&&(o={...f,h:f.c<1e-7?o.h:f.h},n=Qe(d),l())},destroy(){if(H)return;H=!0,cancelAnimationFrame(b),v.destroy(),N.destroy(),P.disconnect(),removeEventListener("scroll",y,!0),removeEventListener("resize",y),a.setAttribute("data-closing","");let d=()=>a.remove();a.addEventListener("transitionend",d,{once:!0}),setTimeout(d,260),t.onClose?.()}}}var Do={x:0,y:0,blur:0,spread:0,colour:"rgba(0, 0, 0, 0.2)",inset:!1};function Pi(e,t){let o=[],n=0,r="";for(let i of e){if(i==="("?n+=1:i===")"&&(n-=1),i===t&&n===0){o.push(r.trim()),r="";continue}r+=i}return r.trim()&&o.push(r.trim()),o.filter(Boolean)}function Ii(e){let t=e.trim();if(!t||t==="none")return null;let o=t,n=/(^|\s)inset(\s|$)/.test(o);n&&(o=o.replace(/(^|\s)inset(\s|$)/," ").trim());let r=[];o=o.replace(/[a-z-]+\([^)]*\)/gi,u=>(r.push(u),`@${r.length-1}`));let i=o.split(/\s+/).filter(Boolean).map(u=>u.startsWith("@")?r[Number(u.slice(1))]:u),a=[],s=[];for(let u of i)/^-?\d*\.?\d+(px|em|rem|%)?$/.test(u)?a.push(parseFloat(u)):s.push(u);return a.length<2?null:{x:a[0]??0,y:a[1]??0,blur:a[2]??0,spread:a[3]??0,colour:s[0]??"rgba(0, 0, 0, 0.2)",inset:n}}function Go(e){return!e||e.trim()==="none"?[]:Pi(e,",").map(Ii).filter(t=>t!==null)}function Hi(e){let t=`${e.x}px ${e.y}px ${e.blur}px ${e.spread}px ${e.colour}`;return e.inset?`inset ${t}`:t}function Bo(e){return e.length===0?"none":e.map(Hi).join(", ")}function $n(e,t,o){let n=[...e];if(t<0||t>=n.length||o<0||o>=n.length)return n;let[r]=n.splice(t,1);return r!==void 0&&n.splice(o,0,r),n}function En(e){let t=/blur\(\s*(-?\d*\.?\d+)px\s*\)/i.exec(e||"");return t?parseFloat(t[1]):0}function Oo(e){return e<=0?"none":`blur(${e}px)`}function Di(e){return-e.spread-e.blur/2}function zo(e){let t=Di(e),o=[];return e.y<-t&&o.push("top"),e.x>t&&o.push("right"),e.y>t&&o.push("bottom"),e.x<-t&&o.push("left"),o.length===1?o[0]:"all"}function Fo(e,t){if(t==="all")return{...e,spread:Math.max(0,e.spread)};let o=Math.ceil(e.blur/2),n=o-e.blur/2,r=Math.max(Math.abs(e.x),Math.abs(e.y));r<=n&&(r=n+Math.max(1,Math.round(e.blur/2)));let i=-o;switch(t){case"top":return{...e,x:0,y:-r,spread:i};case"bottom":return{...e,x:0,y:r,spread:i};case"left":return{...e,x:-r,y:0,spread:i};case"right":return{...e,x:r,y:0,spread:i}}}function Gi(e){let t=getComputedStyle(e).display;return t.includes("flex")||t.includes("grid")}var jt=["top","right","bottom","left"],Bi=["border-top-left-radius","border-top-right-radius","border-bottom-right-radius","border-bottom-left-radius"],Oi=[{name:"Type",specs:[{prop:"font-size",label:"Size",kind:"length",glyph:"fontSize",min:8,max:96,step:1,unit:"px"},{prop:"font-weight",label:"Weight",kind:"number",glyph:"fontWeight",min:100,max:900,step:100},{prop:"line-height",label:"Line height",kind:"length",glyph:"lineHeight",min:0,max:96,step:1,unit:"px"},{prop:"letter-spacing",label:"Tracking",kind:"length",glyph:"tracking",min:-4,max:12,step:.1,unit:"px",more:!0},{prop:"font-style",label:"Style",kind:"choice",glyph:"italic",options:["normal","italic"],more:!0},{prop:"text-align",label:"Align",kind:"choice",glyph:"textAlign",options:["start","center","end","justify"],more:!0},{prop:"text-transform",label:"Case",kind:"choice",glyph:"textCase",options:["none","uppercase","lowercase","capitalize"],more:!0},{prop:"text-decoration-line",label:"Decoration",kind:"choice",glyph:"underline",options:["none","underline","line-through"],more:!0}]},{name:"Colour",specs:[{prop:"color",label:"Text",kind:"colour",glyph:"textColour"},{prop:"background-color",label:"Background",kind:"colour",glyph:"backgroundColour"},{prop:"opacity",label:"Opacity",kind:"number",glyph:"opacity",min:0,max:1,step:.01}]},{name:"Box",specs:[{prop:"padding",label:"Padding",kind:"length",glyph:"padding",min:0,max:128,step:1,unit:"px",sides:jt.map(e=>`padding-${e}`)},{prop:"margin",label:"Margin",kind:"length",glyph:"margin",min:-64,max:128,step:1,unit:"px",sides:jt.map(e=>`margin-${e}`)},{prop:"width",label:"Width",kind:"length",glyph:"widthIcon",min:0,max:1600,step:1,unit:"px",more:!0},{prop:"height",label:"Height",kind:"length",glyph:"heightIcon",min:0,max:1200,step:1,unit:"px",more:!0},{prop:"box-sizing",label:"Sizing",kind:"choice",glyph:"boxSizing",options:["content-box","border-box"]}]},{name:"Border",specs:[{prop:"border-width",label:"Width",kind:"length",glyph:"borderWidth",min:0,max:24,step:1,unit:"px",sides:jt.map(e=>`border-${e}-width`)},{prop:"border-color",label:"Colour",kind:"colour",glyph:"borderColour",sides:jt.map(e=>`border-${e}-color`)},{prop:"border-style",label:"Style",kind:"choice",glyph:"borderStyle",options:["none","solid","dashed","dotted"]},{prop:"border-radius",label:"Radius",kind:"length",glyph:"borderRadius",min:0,max:64,step:1,unit:"px",sides:Bi}]},{name:"Effects",specs:[{prop:"box-shadow",label:"Shadow",kind:"shadow",glyph:"shadow"},{prop:"backdrop-filter",label:"Backdrop blur",kind:"blur",glyph:"backdrop",min:0,max:40,step:1,unit:"px",more:!0}]},{name:"Layout",when:Gi,specs:[{prop:"display",label:"Display",kind:"choice",glyph:"boxSizing",options:["block","flex","grid","inline-flex","inline-block","none"]},{prop:"flex-direction",label:"Direction",kind:"choice",glyph:"flexDirection",options:["row","column","row-reverse","column-reverse"],more:!0},{prop:"justify-content",label:"Justify",kind:"choice",glyph:"justify",options:["flex-start","center","flex-end","space-between"],more:!0},{prop:"align-items",label:"Align",kind:"choice",glyph:"alignItems",options:["stretch","flex-start","center","flex-end"],more:!0},{prop:"flex-wrap",label:"Wrap",kind:"choice",glyph:"flexWrap",options:["nowrap","wrap"],more:!0},{prop:"gap",label:"Gap",kind:"length",glyph:"gap",min:0,max:96,step:1,unit:"px"}]}];function Ut(e){let t=parseFloat(e);return Number.isFinite(t)?t:0}var zi=320,Fi=Ho+`
/*
 * The reset the shadow root does not come with.
 *
 * The host sets all:initial, which stops the page's styles leaking in and also
 * means there is no box-sizing rule at all, so padding and borders are added
 * outside a flex-computed width. The hex field's 12px of padding and 2px of
 * border did exactly that: the colour rows measured 306px inside a 294px
 * column and hung past every other row in the panel.
 *
 * Scoped to the dock so it cannot reach the page.
 */
.edit-dock, .edit-dock * { box-sizing: border-box; }

.edit-dock {
  position: fixed;
  top: ${B.edge}px;
  left: ${B.edge}px;
  width: ${zi}px;
  max-height: calc(100vh - ${B.edge*2}px);
  overflow: hidden;
  display: none;
  flex-direction: column;
  pointer-events: auto;
  font-family: ${D.stack};
  font-synthesis: none;
  font-size: ${D.body}px;
  font-weight: ${Z.regular};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${x.primary};
  background: ${we};
  box-shadow: ${ze};
}
.edit-dock[data-open] { display: flex; }

/*
 * The panel is summoned by a keystroke you meant, so it arrives rather than
 * appears. 160ms on the UI curve, an 8px rise and a fade: enough to say where
 * it came from, short enough that arming twice in a row never feels slow.
 *
 * @starting-style animates the first frame after display changes, with no
 * keyframes to restart and nothing to clean up.
 */
@starting-style {
  .edit-dock[data-open] { opacity: 0; translate: 0 8px; }
}
.edit-dock {
  opacity: 1;
  translate: 0 0;
  transition: opacity ${z.ui}, translate ${z.ui}, display ${z.ui} allow-discrete;
}

/* The bar that says the tool wrote this row. Worth a fade: it is the panel
   admitting to something, and it should be noticed without being a movement. */
.edit-row::before { transition: opacity ${z.ui}; }

@media (prefers-reduced-motion: reduce) {
  .edit-dock { transition: opacity ${z.ui}; translate: none; }
  @starting-style { .edit-dock[data-open] { translate: none; } }
  .edit-opt:active, .edit-mini:active, .edit-add:active,
  .edit-action:active { scale: 1; }
}

.edit-head {
  display: flex; align-items: center; gap: ${B.base}px;
  flex: none;
  height: ${_e}px;
  padding: 0 ${B.base}px 0 ${B.roomy}px;
  border-bottom: 1px solid ${ue};
}
.edit-title { font-size: ${D.title}px; font-weight: ${Z.semibold}; }
.edit-subject {
  flex: 1; min-width: 0;
  color: ${x.tertiary};
  font-size: ${D.tag}px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  text-align: right;
}
/*
 * The gutter is reserved whether or not it is needed.
 *
 * Without it the scrollbar appears the moment the content is a row too tall,
 * takes about fifteen pixels off the width, and every row reflows under it \u2014
 * which is why the values were being clipped at the right edge on exactly the
 * elements that had enough properties to scroll.
 */
.edit-body {
  /*
   * A flex item's min-height is auto, so it refuses to shrink below its own
   * content and overflow-y never has anything to scroll. The panel
   * grew past its max-height instead, and a wheel over it fell through to the
   * page \u2014 which made every group below the fold unreachable. Same shape as
   * the min-width: auto that broke the colour popover in the lab.
   */
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
  /*
   * Present but not part of the design until you reach for it. The panel is
   * mostly a column of controls, and a permanent light bar down its edge reads
   * as one more thing to look at.
   */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  transition: scrollbar-color ${z.ui};
  padding: ${B.base}px;
}
.edit-body:hover, .edit-body:focus-within {
  scrollbar-color: ${F(6)} transparent;
}
/* WebKit does not read scrollbar-color, so it gets the same thing said twice. */
.edit-body::-webkit-scrollbar { width: 8px; }
.edit-body::-webkit-scrollbar-track { background: transparent; }
.edit-body::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 0;
  transition: background ${z.ui};
}
.edit-body:hover::-webkit-scrollbar-thumb,
.edit-body:focus-within::-webkit-scrollbar-thumb { background: ${F(6)}; }
/* Nothing a control does may push the panel wider than the panel. */
.edit-line > * { min-width: 0; }

/*
 * Three times the gap inside a group. Ambiguous spacing is a functional bug,
 * not an ugly one: at 12px against a 6px row gap, a group's name read as
 * belonging to the rows above it as easily as the ones below.
 */
.edit-group + .edit-group { margin-top: 24px; }
/*
 * The section, and the label inside it, were both 11px and two pixels apart,
 * and the child was the brighter of the two. Hierarchy inverted.
 *
 * They are the same size and the same colour now, and told apart by weight,
 * case and tracking, which is what carries emphasis without making the
 * important thing large or the subordinate thing unreadable.
 */
.edit-group-name {
  display: block;
  margin: 0 0 ${B.base}px 2px;
  font-size: ${D.tag}px; font-weight: ${Z.semibold};
  letter-spacing: 0.04em; text-transform: uppercase;
  color: ${x.secondary};
}
/*
 * minmax(0, 1fr), not 1fr.
 *
 * A grid track sized 1fr still refuses to go below its content's min-content
 * width, so one row whose contents will not shrink drags the whole column
 * wider than the panel. That is what made the colour rows 306px inside a 294px
 * column and hang past every other row: an input carries an intrinsic width
 * from its size attribute, and the track grew to fit it.
 */
.edit-rows { display: grid; grid-template-columns: minmax(0, 1fr); gap: ${B.base}px; }
/*
 * A per-side group is four controls in two rows, with 4px between them. Eight
 * outside that is only twice the gap inside, which is the floor, and at this
 * density it read as one undifferentiated block of eight numbers: padding and
 * margin ran together. Four more each side makes it sixteen between two
 * groups and twelve against a plain row.
 */
.edit-row[data-grouped] { margin-block: ${B.tight}px; }

/*
 * A row the tool has written shows its revert control and nothing else.
 *
 * There was a bar down the leading edge as well, which said the same thing
 * twice: the revert arrow only appears on a touched row, so it already marks
 * which rows are the tool's doing, and it is a control rather than a stripe.
 * Two marks for one fact is noise in a panel with twenty rows in it.
 */
.edit-row { position: relative; }

/*
 * A row is an alignment, not a container.
 *
 * It used to carry a surface of its own, so every control sat in a box inside
 * a box: the slider has a track, the badge has a chip, the hex field has a
 * border, and each of them was then wrapped again in a rectangle that did no
 * work. Twenty of those down a 320px panel is the boxed-in, over-
 * compartmentalised look, and the fix for it is to drop the outer one rather
 * than to space it better.
 *
 * The padding goes with it. Without a box to inset from, the controls align
 * to the panel's own edge, and every row in the panel starts at the same
 * place.
 */
.edit-line {
  display: flex; align-items: center; gap: ${B.base}px;
  min-height: ${_e}px;
}
.edit-glyph {
  flex: none;
  display: grid; place-items: center;
  width: 15px; height: 15px;
  color: ${x.tertiary};
}

.edit-label {
  flex: none; width: 74px;
  color: ${x.secondary};
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.edit-field { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; }

/* Choice: one button per value, the current one filled. Buttons rather than a
   select, because a select hides every option until you open it and the whole
   value of these is seeing the alternatives. */
/*
 * A segmented control: the options share the row rather than huddling at the
 * left with the rest of it empty. Nothing was ever going to fill that space,
 * so it read as a control that had failed to lay itself out.
 *
 * They wrap when there are too many to fit, and a wrapped row shares its own
 * width, so six display values come out as two even rows rather than four and
 * a ragged two.
 */
/* The group has to grow before its buttons can share anything: it is itself a
   flex item, and a flex item is content-sized until told otherwise. */
.edit-choice { flex: 1; min-width: 0; display: flex; flex-wrap: wrap; gap: 2px; }
.edit-choice .edit-opt { flex: 1 1 auto; }
.edit-opt {
  /* 24px is WCAG's AA floor and these were 21 by a padding accident. */
  min-height: 24px;
  padding: 5px 8px; border: 0; border-radius: 0;
  background: ${F(2)}; color: ${x.secondary};
  font: inherit; font-size: ${D.tag}px; cursor: pointer;
  transition: background ${z.ui}, color ${z.ui};
}
.edit-opt:hover { background: ${F(4)}; color: ${x.primary}; }
.edit-opt:active { scale: 0.96; }
.edit-opt:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }
.edit-opt[data-on] { background: ${x.primary}; color: ${we}; }

/*
 * The colour field is one control, not two sitting next to each other.
 *
 * It used to be a swatch with its own hairline ring beside a hex input with
 * its own border, on a panel whose every other row has neither. Both edges
 * were redundant with a fill that already drew them, and both measured under
 * 1.2:1 against what they sat on, so neither could have identified a control
 * even where the rules ask a border to. One surface now holds both halves:
 * the swatch is a flush block of the value itself, the hex is the rest.
 */
.edit-colour {
  flex: 1; min-width: 0;
  display: flex; align-items: stretch;
  height: 24px;
  background: ${F(1)};
}
.edit-colour:focus-within { outline: 2px solid ${x.secondary}; outline-offset: -2px; }
.edit-swatch {
  flex: none; width: 24px;
  padding: 0; border: 0; border-radius: 0;
  background: var(--swatch, transparent);
  /* The value can be translucent, and a swatch that hides that is lying. */
  background-image: linear-gradient(var(--swatch, transparent), var(--swatch, transparent)),
    ${"conic-gradient("+ue+" 0 25%, transparent 0 50%, "+ue+" 0 75%, transparent 0)"};
  background-size: auto, 8px 8px;
  background-position: 0 0, 0 0;
  cursor: pointer;
}
.edit-swatch:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }
.edit-hex {
  flex: 1; min-width: 0;
  padding: 0 6px;
  border: 0; border-radius: 0;
  background: none; color: ${x.primary};
  font: inherit; font-size: ${D.tag}px;
  font-variant-numeric: tabular-nums;
}
/* The field owns the focus ring now; the input inside it does not draw a second. */
.edit-hex:focus-visible { outline: none; }

.edit-row-name {
  display: flex; align-items: center; gap: 6px;
  /* Half the gap between rows, so the name binds to its own control rather
     than floating between two of them. */
  margin: 0 0 ${B.tight}px;
  color: ${x.secondary};
  font-size: ${D.tag}px; font-weight: ${Z.regular};
}
.edit-row-name .edit-glyph { color: ${x.tertiary}; }
/* Two columns of badges. They size to their own digits, so the grid can be
   tight without anything being clipped. */
.edit-sides { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; }

/* A shadow is a list, so its row is a block rather than a line. */
.edit-line-block { display: block; padding: ${B.base}px 10px; }
.edit-stack { display: grid; gap: 6px; }
.edit-layer { background: ${F(2)}; padding: 6px; }
.edit-layer-head {
  display: flex; align-items: center; gap: 4px;
  margin-bottom: 4px;
}
.edit-layer-name {
  flex: 1; min-width: 0;
  /*
   * Secondary, not tertiary. Tertiary is measured against the ground and
   * clears 4.61:1 there; on this card it is a film over a film and falls to
   * 4.20:1. The constraint is written down in theme.ts and this is the first
   * place in the panel that actually meets it.
   */
  color: ${x.secondary};
  font-size: ${D.tag}px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.edit-swatch-solo { width: 24px; height: 24px; }
.edit-mini {
  flex: none;
  display: grid; place-items: center;
  width: 24px; height: 24px;
  padding: 0; border: 0; border-radius: 0;
  background: ${F(3)}; color: ${x.secondary};
  font: inherit; font-size: ${D.tag}px; line-height: 1;
  cursor: pointer;
}
.edit-mini:hover:not(:disabled) { background: ${F(5)}; color: ${x.primary}; }
.edit-mini:active:not(:disabled) { scale: 0.96; }
.edit-mini:disabled { color: ${x.disabled}; cursor: default; }
.edit-mini:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }
.edit-add {
  width: 100%;
  padding: 7px; border: 0; border-radius: 0;
  background: ${F(2)}; color: ${x.secondary};
  font: inherit; font-size: ${D.tag}px; cursor: pointer;
}
.edit-add:hover { background: ${F(4)}; color: ${x.primary}; }
.edit-add:active { scale: 0.96; }
.edit-add:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }
.edit-sides > * { min-width: 0; }

/*
 * One side's colour: the same chip as the scrub badges beside it, with the
 * value shown as itself rather than as a number. No hex field - a quarter of a
 * 320px panel has no room for one, and the block is the value.
 */
.edit-side-colour {
  display: flex; align-items: center; gap: 6px;
  height: 24px; padding: 0 6px;
  border: 0; border-radius: 0;
  background: ${F(1)}; color: ${x.secondary};
  font: inherit; font-size: ${D.tag}px;
  cursor: pointer;
  transition: background ${z.ui}, color ${z.ui};
}
.edit-side-colour:hover { background: ${F(3)}; color: ${x.primary}; }
.edit-side-colour:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }
.edit-side-colour .edit-side-name { flex: 1; min-width: 0; text-align: left; }
.edit-side-chip {
  flex: none; width: 14px; height: 14px;
  background: var(--swatch, transparent);
  background-image: linear-gradient(var(--swatch, transparent), var(--swatch, transparent)),
    ${"conic-gradient("+ue+" 0 25%, transparent 0 50%, "+ue+" 0 75%, transparent 0)"};
  background-size: auto, 6px 6px;
}

/* The edge a shadow lands on. */
.edit-edges { display: flex; gap: 2px; margin-bottom: 6px; }
.edit-edges .edit-opt { flex: 1; display: grid; place-items: center; min-height: 22px; padding: 0 6px; }

.edit-linked {
  width: 24px; height: 24px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; color: ${x.tertiary};
  cursor: pointer;
}
.edit-linked[data-on] { background: ${F(4)}; color: ${x.primary}; }
.edit-linked:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }


.edit-more {
  width: 100%; margin-top: ${B.tight}px;
  padding: 6px; border: 0; border-radius: 0;
  background: none; color: ${x.tertiary};
  font: inherit; font-size: ${D.tag}px; cursor: pointer;
  text-align: left;
}
.edit-more:hover { color: ${x.primary}; }

.edit-foot {
  flex: none;
  display: flex; align-items: center; gap: ${B.base}px;
  padding: ${B.base}px;
  border-top: 1px solid ${ue};
}
.edit-count { flex: 1; color: ${x.tertiary}; font-size: ${D.tag}px; }
.edit-action {
  padding: 7px 10px; border: 0; border-radius: 0;
  background: ${F(3)}; color: ${x.primary};
  font: inherit; font-size: ${D.tag}px; font-weight: ${Z.medium};
  cursor: pointer;
  transition: background ${z.ui};
}
.edit-action:hover { background: ${F(5)}; }
.edit-action:active:not(:disabled) { scale: 0.96; }
.edit-action:disabled { color: ${x.disabled}; cursor: default; background: ${F(1)}; }
.edit-action:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }

.edit-empty {
  padding: ${B.roomy}px;
  color: ${x.tertiary};
}
`;function Wo(e,t){let o=document.createElement("style");o.textContent=Fi,e.appendChild(o);let n=document.createElement("div");n.className="edit-dock",n.setAttribute("role","region"),n.setAttribute("aria-label","Edit the locked element");let r=document.createElement("div");r.className="edit-head";let i=document.createElement("span");i.className="edit-title",i.textContent="Edit";let a=document.createElement("span");a.className="edit-subject",r.append(i,a);let s=document.createElement("div");s.className="edit-body";let u=document.createElement("div");u.className="edit-foot";let S=document.createElement("span");S.className="edit-count";let v=document.createElement("button");v.type="button",v.className="edit-action",v.textContent="Copy as prompt";let N=document.createElement("button");N.type="button",N.className="edit-action",N.textContent="Revert all",u.append(S,N,v),n.append(r,s,u),e.appendChild(n);let c=null,w=!1,C=!1,E=[],W=[];function p(){for(let l of W.splice(0))l()}let g=new Set;function _(){let l=t.changes().length;S.textContent=l===0?"No changes":`${l} change${l===1?"":"s"}`,v.disabled=l===0,N.disabled=l===0}function X(){if(c){for(let l of E){let y=(l.spec.sides??[l.spec.prop]).some(P=>t.touched(c,P));l.el.toggleAttribute("data-touched",y)}_()}}function j(l,T){c&&(t.set(c,l,T),X())}function le(l,T,y){let P=Wt(e,{label:y,value:c?Ut($e(c,T)):0,min:l.min??0,max:l.max??100,step:l.step??1,...l.unit?{unit:l.unit}:{},onChange:H=>{let d=`${H}${l.unit??""}`;if(l.sides&&g.has(l.prop)){for(let f of l.sides)j(f,d);for(let f of E)if(f.spec.prop===l.prop)for(let k of f.sliders)k.set(H)}else j(T,d)}});return{el:P.el,slider:P,sync:()=>{c&&P.set(Ut($e(c,T)))}}}function ie(l,T,y){let P=/(^|\s)(top|bottom)(\s|$)/.test(y),H=y==="top"?"sideTop":y==="right"?"sideRight":y==="bottom"?"sideBottom":y==="left"?"sideLeft":void 0,d=Eo(e,{label:`${l.label} ${y}`,value:c?Ut($e(c,T)):0,min:l.min??0,max:l.max??999,step:l.step??1,axis:P?"y":"x",...H?{glyph:H}:{text:y},onChange:f=>{let k=`${f}${l.unit??""}`;if(g.has(l.prop)&&l.sides){for(let G of l.sides)j(G,k);for(let G of E)if(G.spec.prop===l.prop)for(let L of G.scrubs)L.set(f)}else j(T,k)}});return{el:d.el,scrub:d,sync:()=>{c&&d.set(Ut($e(c,T)))}}}function Q(l){let T=document.createElement("div");T.className="edit-choice",T.setAttribute("role","group"),T.setAttribute("aria-label",l.label);let y=[];for(let H of l.options??[]){let d=document.createElement("button");d.type="button",d.className="edit-opt",d.textContent=H,d.addEventListener("click",()=>{j(l.prop,H),P()}),y.push(d),T.appendChild(d)}function P(){let H=c?$e(c,l.prop):"";for(let d of y){let f=d.textContent===H;d.toggleAttribute("data-on",f),d.setAttribute("aria-pressed",String(f))}}return{el:T,sync:P}}function q(l,T,y){let P=d=>{let f=d.composedPath();f.includes(l)||f.some(k=>k instanceof Node&&T(k))||y()},H=d=>{(d.composedPath?.()??[]).includes(e.host)||y()};return e.addEventListener("pointerdown",P,!0),document.addEventListener("pointerdown",H,!0),()=>{e.removeEventListener("pointerdown",P,!0),document.removeEventListener("pointerdown",H,!0)}}function b(l,T,y){let P=document.createElement("button");P.type="button",P.className="edit-side-colour",P.setAttribute("aria-haspopup","dialog"),P.setAttribute("aria-expanded","false"),P.setAttribute("aria-label",`${l.label} ${y}`);let H=document.createElement("span");H.className="edit-side-name",H.textContent=y;let d=document.createElement("span");d.className="edit-side-chip",P.append(H,d);let f=null,k=null;function G(){k?.(),k=null,f?.destroy(),f=null,P.setAttribute("aria-expanded","false")}function L($){if(d.style.setProperty("--swatch",$),g.has(l.prop)&&l.sides){for(let M of l.sides)j(M,$);for(let M of E)M.spec.prop===l.prop&&M.sync()}else j(T,$)}return P.addEventListener("click",()=>{if(f){G();return}let $=c?$e(c,T):"";f=Yt(e,{anchor:P,value:$||"#000000",onChange:L}),P.setAttribute("aria-expanded","true"),k=q(P,M=>f?.contains(M)??!1,G)}),W.push(G),{el:P,sync:()=>{let $=c?$e(c,T):"",M=Fe($),h=M?Ke(M,Qe($)):$;d.style.setProperty("--swatch",h),f?.update(h)}}}function O(l){let T=document.createElement("div");T.className="edit-colour";let y=document.createElement("button");y.type="button",y.className="edit-swatch",y.setAttribute("aria-haspopup","dialog"),y.setAttribute("aria-expanded","false"),y.setAttribute("aria-label",`Pick the ${l.label.toLowerCase()} colour`);let P=document.createElement("input");P.type="text",P.className="edit-hex",P.spellcheck=!1,P.setAttribute("aria-label",`${l.label} colour`);let H=null,d=null;function f(){d?.(),d=null,H?.destroy(),H=null,y.setAttribute("aria-expanded","false")}y.addEventListener("click",()=>{if(H){f();return}H=Yt(e,{anchor:y,value:P.value||"#000000",onChange:L=>{P.value=L,k(L),j(l.prop,L)}}),y.setAttribute("aria-expanded","true"),d=q(y,L=>H?.contains(L)??!1,f)}),P.addEventListener("change",()=>{let L=P.value.trim();if(!Fe(L)){G();return}k(L),H?.update(L),j(l.prop,L)});function k(L){y.style.setProperty("--swatch",L)}function G(){let L=c?$e(c,l.prop):"",$=Fe(L),M=$?Ke($,Qe(L)):L;document.activeElement!==P&&e.activeElement!==P&&(P.value=M),k(M),H?.update(M)}return T.append(y,P),W.push(f),{el:T,sync:G}}function re(l){let T=document.createElement("div");T.className="edit-stack";let y=[],P=[];function H(){j(l.prop,Bo(y))}function d(){for(let G of P)G.destroy();P=[],T.textContent="",y.forEach((G,L)=>{let $=document.createElement("div");$.className="edit-layer";let M=document.createElement("div");M.className="edit-layer-head";let h=document.createElement("span");h.className="edit-layer-name",h.textContent=`Layer ${L+1}`;let A=document.createElement("button");A.type="button",A.className="edit-swatch edit-swatch-solo",A.setAttribute("aria-haspopup","dialog"),A.setAttribute("aria-expanded","false"),A.setAttribute("aria-label",`Layer ${L+1} colour`),A.style.setProperty("--swatch",G.colour);let K=null,ne=null,Se=()=>{ne?.(),ne=null,K?.destroy(),K=null,A.setAttribute("aria-expanded","false")};A.addEventListener("click",()=>{if(K){Se();return}K=Yt(e,{anchor:A,value:G.colour||"rgb(0 0 0 / 0.2)",onChange:se=>{A.style.setProperty("--swatch",se),y[L]={...G,colour:se},G=y[L],H()}}),A.setAttribute("aria-expanded","true"),ne=q(A,se=>K?.contains(se)??!1,Se)}),W.push(Se);let ge=document.createElement("button");ge.type="button",ge.className="edit-opt",ge.textContent="inset",ge.toggleAttribute("data-on",G.inset),ge.addEventListener("click",()=>{y[L]={...G,inset:!G.inset},G=y[L],ge.toggleAttribute("data-on",G.inset),H()});let Te=document.createElement("button");Te.type="button",Te.className="edit-mini",Te.setAttribute("aria-label",`Move layer ${L+1} up`),Te.appendChild(ve("arrowUp",12)),Te.disabled=L===0,Te.addEventListener("click",()=>{y=$n(y,L,L-1),H(),d()});let Ae=document.createElement("button");Ae.type="button",Ae.className="edit-mini",Ae.setAttribute("aria-label",`Move layer ${L+1} down`),Ae.appendChild(ve("arrowDown",12)),Ae.disabled=L===y.length-1,Ae.addEventListener("click",()=>{y=$n(y,L,L+1),H(),d()});let Ge=document.createElement("button");Ge.type="button",Ge.className="edit-mini",Ge.setAttribute("aria-label",`Remove layer ${L+1}`),Ge.appendChild(ve("cross",12)),Ge.addEventListener("click",()=>{y=y.filter((se,me)=>me!==L),H(),d()}),M.append(h,A,ge,Te,Ae,Ge);let it=document.createElement("div");it.className="edit-sides";let At=[{key:"x",label:"x",min:-64,max:64},{key:"y",label:"y",min:-64,max:64},{key:"blur",label:"blur",min:0,max:96},{key:"spread",label:"spread",min:-32,max:32}];for(let se of At){let me=Wt(e,{label:se.label,value:G[se.key],min:se.min,max:se.max,step:1,unit:"px",onChange:wr=>{y[L]={...y[L],[se.key]:wr},G=y[L],H()}});P.push(me),it.appendChild(me.el)}let V=document.createElement("div");V.className="edit-edges";let pe=zo(G),Ue=[{side:"all",label:"All"},{side:"top",label:"Top",glyph:"sideTop"},{side:"right",label:"Right",glyph:"sideRight"},{side:"bottom",label:"Bottom",glyph:"sideBottom"},{side:"left",label:"Left",glyph:"sideLeft"}];for(let se of Ue){let me=document.createElement("button");me.type="button",me.className="edit-opt",se.glyph?(me.appendChild(ve(se.glyph,13)),me.setAttribute("aria-label",`Shadow on the ${se.label.toLowerCase()}`),me.title=`Shadow on the ${se.label.toLowerCase()}`):(me.textContent=se.label,me.title="Shadow on all four sides"),me.toggleAttribute("data-on",se.side===pe),me.setAttribute("aria-pressed",String(se.side===pe)),me.addEventListener("click",()=>{y[L]=Fo(y[L],se.side),G=y[L],H(),d()}),V.appendChild(me)}$.append(M,V,it),T.appendChild($)});let k=document.createElement("button");k.type="button",k.className="edit-add",k.textContent=y.length===0?"Add a shadow":"Add another layer",k.addEventListener("click",()=>{y=[...y,{...y[y.length-1]??Do}],H(),d()}),T.appendChild(k)}function f(){y=c?Go($e(c,l.prop)):[],d()}return{el:T,sync:f,sliders:[]}}function I(l){let T=Wt(e,{label:l.label,value:c?En($e(c,l.prop)):0,min:l.min??0,max:l.max??40,step:l.step??1,unit:l.unit??"px",onChange:y=>j(l.prop,Oo(y))});return{el:T.el,slider:T,sync:()=>{c&&T.set(En($e(c,l.prop)))}}}function U(l){let T=document.createElement("div");T.className="edit-row";let y=document.createElement("div");y.className="edit-line";let P=document.createElement("span");P.className="edit-label",P.textContent=l.label;let H=document.createElement("div");H.className="edit-field";let d=[],f=[],k=[];if(l.sides){let $=document.createElement("div");$.className="edit-sides",$.style.flex="1";for(let h of l.sides){let A=h.split("-").filter(ne=>ne!=="border"&&ne!=="radius"&&ne!=="width"&&ne!=="padding"&&ne!=="margin"&&ne!=="color").join(" ")||h;if(l.kind==="colour"){let ne=b(l,h,A);k.push(ne.sync),$.appendChild(ne.el);continue}let K=ie(l,h,A);f.push(K.scrub),k.push(K.sync),$.appendChild(K.el)}let M=document.createElement("button");M.type="button",M.className="edit-linked",M.setAttribute("aria-label",`Link all four ${l.label.toLowerCase()} values`),M.title="Change all four together",M.appendChild(ve("link",13)),M.setAttribute("aria-pressed","false"),M.addEventListener("click",()=>{g.has(l.prop)?g.delete(l.prop):g.add(l.prop);let h=g.has(l.prop);M.toggleAttribute("data-on",h),M.setAttribute("aria-pressed",String(h))}),H.append($,M)}else if(l.kind==="shadow"){let $=re(l);k.push($.sync),$.el.style.flex="1",H.appendChild($.el)}else if(l.kind==="blur"){let $=I(l);d.push($.slider),k.push($.sync),$.el.style.flex="1",H.appendChild($.el)}else if(l.kind==="choice"){let $=Q(l);k.push($.sync),H.appendChild($.el)}else if(l.kind==="colour"){let $=O(l);k.push($.sync),$.el.style.flex="1",H.appendChild($.el)}else{let $=le(l,l.prop,l.label);d.push($.slider),k.push($.sync),$.el.style.flex="1",H.appendChild($.el)}l.kind==="shadow"&&y.classList.add("edit-line-block");let G=document.createElement("span");G.className="edit-glyph",G.appendChild(ve(l.glyph,15));let L=!l.sides&&l.kind==="colour";if(L&&y.prepend(G,P),(l.sides||l.kind==="shadow")&&T.setAttribute("data-grouped",""),l.sides||l.kind==="shadow"||l.kind==="choice"){let $=document.createElement("span");$.className="edit-row-name",$.append(G,document.createTextNode(l.label)),T.appendChild($)}return!L&&!l.sides&&l.kind!=="shadow"&&l.kind!=="choice"&&y.appendChild(G),y.appendChild(H),T.appendChild(y),{spec:l,el:T,sliders:d,scrubs:f,sync:()=>{for(let $ of k)$()}}}function R(){p();for(let T of E){for(let y of T.sliders)y.destroy();for(let y of T.scrubs)y.destroy()}if(E.length=0,s.textContent="",!c){let T=document.createElement("p");T.className="edit-empty",T.textContent="Click an element to lock it, then change it here.",s.appendChild(T),_();return}for(let T of Oi){if(T.when&&!T.when(c))continue;let y=T.specs.filter(f=>C||!f.more);if(y.length===0)continue;let P=document.createElement("section");P.className="edit-group";let H=document.createElement("span");H.className="edit-group-name",H.textContent=T.name;let d=document.createElement("div");d.className="edit-rows";for(let f of y){let k=U(f);E.push(k),d.appendChild(k.el)}P.append(H,d),s.appendChild(P)}let l=document.createElement("button");l.type="button",l.className="edit-more",l.textContent=C?"Fewer properties":"More properties",l.addEventListener("click",()=>{C=!C,R()}),s.appendChild(l);for(let T of E)T.sync();X()}N.addEventListener("click",()=>{t.revertAll();for(let l of E)l.sync();X()});let Y=0;v.addEventListener("click",()=>{let l=t.asPrompt();if(!l)return;let T=P=>{v.textContent=P,clearTimeout(Y),Y=window.setTimeout(()=>{v.textContent="Copy as prompt"},900)},y=navigator.clipboard;if(!y){T("No clipboard");return}y.writeText(l).then(()=>T("Copied"),()=>T("Blocked"))});function te(){n.toggleAttribute("data-open",w)}return{show(l){if(l===c){for(let T of E)T.sync();X();return}c=l,a.textContent=l?l.tagName.toLowerCase()+(l.id?`#${l.id}`:""):"",R()},setArmed(l){w=l,te(),l&&R()},refresh(){for(let l of E)l.sync();X()},asText(){return t.asPrompt()},destroy(){p();for(let l of E){for(let T of l.sliders)T.destroy();for(let T of l.scrubs)T.destroy()}E.length=0,n.remove(),o.remove()}}}var Vt=5,Sn=4,Ct=12,_o=.22,ct=10,Wi=50,_i=100;function Xo(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,hidden:!1,dimLock:!1,grid:null,pixels:!1,guides:[],liveGuide:null,activeGuide:null},i=mn(fn()),a=0,s=null;function u(){let b=fn();b!==s&&(s=b,i=mn(b),e.style.colorScheme=b?"dark":"light",q())}u();let S=matchMedia("(prefers-color-scheme: dark)"),v=()=>u();S.addEventListener("change",v);let N=new MutationObserver(()=>u());function c(){N.disconnect(),N.observe(document.documentElement,{attributes:!0}),document.body&&N.observe(document.body,{attributes:!0})}c(),bo(()=>q());function w(){let b=devicePixelRatio;o.width=Math.round(innerWidth*b),o.height=Math.round(innerHeight*b),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(b,0,0,b,0,0),n.translate(.5,.5)}let C=b=>Math.round(b)-.5;function E(b,O){n.strokeStyle=O,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(b.left),Math.round(b.top),Math.round(b.width),Math.round(b.height))}function W(b){n.strokeStyle=qe(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let O of[b.left,b.right])n.moveTo(Math.round(O),0),n.lineTo(Math.round(O),innerHeight);for(let O of[b.top,b.bottom])n.moveTo(0,Math.round(O)),n.lineTo(innerWidth,Math.round(O));n.stroke(),n.setLineDash([])}function p(b){if(n.strokeStyle=b.extension?qe(i.measure,.55):i.measure,n.lineWidth=1,n.setLineDash(b.extension?[3,3]:[]),n.beginPath(),n.moveTo(Math.round(b.x1),Math.round(b.y1)),n.lineTo(Math.round(b.x2),Math.round(b.y2)),b.extension){n.stroke();return}if(b.axis==="x")for(let O of[b.x1,b.x2])n.moveTo(Math.round(O),Math.round(b.y1)-Vt),n.lineTo(Math.round(O),Math.round(b.y1)+Vt);else for(let O of[b.y1,b.y2])n.moveTo(Math.round(b.x1)-Vt,Math.round(O)),n.lineTo(Math.round(b.x1)+Vt,Math.round(O));n.stroke()}function g(b){return n.font=`${Z.medium} ${D.body}px ${D.stack}`,{w:n.measureText(b).width+Sn*2,h:D.body+Sn*2+2}}function _(b,O,re,I){n.font=`${Z.medium} ${D.body}px ${D.stack}`,n.textBaseline="middle";let{w:U,h:R}=g(b),Y=C(Math.min(Math.max(O,Ct),innerWidth-U-Ct)),te=C(Math.min(Math.max(re,Ct),innerHeight-R-Ct));n.fillStyle=I,n.beginPath(),n.roundRect(Y,te,Math.ceil(U),R,4),n.fill(),n.fillStyle=i.surface,n.fillText(b,Y+Sn,te+R/2)}function X(b,O,re,I,U=!1){let{w:R,h:Y}=g(b);_(b,U?O-R/2:O,U?re-Y/2:re,I)}function j(){let b=scrollX,O=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,ee),n.fillRect(-.5,-.5,ee,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${Z.regular} 9px ${D.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let R of r.pinned)n.fillRect(C(R.left),-.5,Math.round(R.width),ee),n.fillRect(-.5,C(R.top),ee,Math.round(R.height));n.restore(),n.beginPath(),n.moveTo(-.5,ee-.5),n.lineTo(innerWidth,ee-.5),n.moveTo(ee-.5,-.5),n.lineTo(ee-.5,innerHeight),n.stroke();let re=R=>R%_i===0?ee:R%Wi===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let I=Math.floor(b/ct)*ct;for(let R=I;R<b+innerWidth;R+=ct){let Y=Math.round(R-b);if(Y<ee)continue;let te=re(R);n.moveTo(Y,ee-te),n.lineTo(Y,ee),te===ee&&(n.fillStyle=i.muted,n.fillText(String(R),Y+3,3))}n.stroke(),n.beginPath();let U=Math.floor(O/ct)*ct;for(let R=U;R<O+innerHeight;R+=ct){let Y=Math.round(R-O);if(Y<ee)continue;let te=re(R);n.moveTo(ee-te,Y),n.lineTo(ee,Y),te===ee&&(n.save(),n.translate(3,Y-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(R),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),ee),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo(ee,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let R of r.guides){let Y=Math.round(xt(R));R.axis==="x"?n.fillRect(Y-1,-.5,2,ee):n.fillRect(-.5,Y-1,ee,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,ee,ee),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,ee,ee)}function le(){let b=po(10,1);if(b){n.strokeStyle=i.pixelLine,n.lineWidth=1,n.setLineDash([]),n.beginPath();for(let O=0;O<=innerWidth;O+=b)n.moveTo(O,0),n.lineTo(O,innerHeight);for(let O=0;O<=innerHeight;O+=b)n.moveTo(0,O),n.lineTo(innerWidth,O);n.stroke()}}function ie(b){let O=uo(b,document.documentElement.clientWidth);n.fillStyle=qe(i.measure,.08);for(let re of O)n.fillRect(C(re.left),-.5,Math.round(re.width),innerHeight+1)}function Q(){if(a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore(),r.hidden)return;(r.pixels||r.grid)&&(n.save(),r.rulers&&(n.beginPath(),n.rect(ee,ee,innerWidth,innerHeight),n.clip()),r.pixels&&le(),r.grid&&ie(r.grid),n.restore());let b=r.dimLock?qe(i.accent,.15):i.accent;for(let I of r.pinned)E(I,b);r.hover&&(W(r.hover),E(r.hover,r.pinned.length||r.dimLock?qe(b,.7):b));for(let I of r.guides){let U=r.liveGuide?.id===I.id;n.strokeStyle=I.locked||U?i.guide:qe(i.guide,.55),n.lineWidth=I.pinned?2:1,n.setLineDash(I.locked?[]:[4,4]),n.beginPath();let R=Math.round(xt(I));if(I.axis==="x"?(n.moveTo(R,0),n.lineTo(R,innerHeight)):(n.moveTo(0,R),n.lineTo(innerWidth,R)),n.stroke(),r.activeGuide===I.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let Y=7;I.axis==="x"?(n.moveTo(R,0),n.lineTo(R,Y),n.moveTo(R,innerHeight-Y),n.lineTo(R,innerHeight)):(n.moveTo(0,R),n.lineTo(Y,R),n.moveTo(innerWidth-Y,R),n.lineTo(innerWidth,R)),n.stroke()}}for(let I of r.lines)n.globalAlpha=I.faded?_o:1,p(I);n.globalAlpha=1;let O=r.lines.filter(I=>I.label!==""),re=O.map(I=>{let U=(I.x1+I.x2)/2,R=(I.y1+I.y2)/2,{w:Y,h:te}=g(I.label);return I.axis==="x"?{x:U-Y/2,y:R-16-te/2,w:Y,h:te,axis:I.axis}:{x:U+26-Y/2,y:R-te/2,w:Y,h:te,axis:I.axis}});if(co(re,{w:innerWidth,h:innerHeight},Ct).forEach((I,U)=>{let R=O[U];n.globalAlpha=R.faded?_o:1,_(R.label,I.x,I.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:I,height:U,scale:R}=r.hover;X(`${ae(I/R.x)} \xD7 ${ae(U/R.y)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let I=r.liveGuide,U=Math.round(xt(I));X([`${I.axis} ${ae(I.at)}`,I.caught,I.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),I.axis==="x"?U+6:30,I.axis==="x"?30:U+6,i.guide)}r.rulers&&j()}function q(){a||(a=requestAnimationFrame(Q))}return w(),{root:t,update(b){Object.assign(r,b),q()},resize(){w(),q()},destroy(){a&&cancelAnimationFrame(a),S.removeEventListener("change",v),N.disconnect(),e.remove()}}}function Xi(e){let t=e.trim().replace(/^#/,""),o=t.length===3?t.split("").map(n=>n+n).join(""):t;return/^[0-9a-f]{6}$/i.test(o)?{r:parseInt(o.slice(0,2),16),g:parseInt(o.slice(2,4),16),b:parseInt(o.slice(4,6),16)}:null}function Ki({r:e,g:t,b:o}){let n=r=>Math.round(r).toString(16).padStart(2,"0");return`#${n(e)}${n(t)}${n(o)}`}function Yi({r:e,g:t,b:o}){return`rgb(${Math.round(e)} ${Math.round(t)} ${Math.round(o)})`}function et(e,t){return String(Number(e.toFixed(t)))}function ji({r:e,g:t,b:o}){let n=e/255,r=t/255,i=o/255,a=Math.max(n,r,i),s=Math.min(n,r,i),u=(a+s)/2,S=a-s,v=0,N=0;return S!==0&&(N=S/(1-Math.abs(2*u-1)),a===n?v=(r-i)/S%6:a===r?v=(i-n)/S+2:v=(n-r)/S+4,v*=60,v<0&&(v+=360)),`hsl(${et(v,1)} ${et(N*100,1)}% ${et(u*100,1)}%)`}function Ui(e){let{l:t,c:o,h:n}=Et([e.r/255,e.g/255,e.b/255]);return o<1e-4?`oklch(${et(t,4)} 0 0)`:`oklch(${et(t,4)} ${et(o,4)} ${et(n,2)})`}function Ko(e){let t=Xi(e);return t?[{label:"hex",value:Ki(t)},{label:"rgb",value:Yi(t)},{label:"hsl",value:ji(t)},{label:"oklch",value:Ui(t)}]:[]}var Vi=`
.picker {
  /* Under the badge, from the badge's own numbers. */
  position: fixed; top: ${Le+vt+kt}px; right: ${Le}px;
  width: min(200px, calc(100vw - ${Le*2+B.base*2}px));
  padding: ${B.base}px; border-radius: 0;
  user-select: none;
  font-family: ${D.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${D.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${x.primary};
  background: ${we};
  box-shadow: ${ze};
  /*
   * It comes from the button that opened it. The card is parked directly under
   * the toolbar and the colour button is at its right end, so an origin in the
   * top right corner is that button \u2014 the card grows out of the control you
   * pressed rather than arriving from nowhere.
   *
   * Visibility rather than display, which cannot be transitioned; delayed out
   * by the duration on close so the fade finishes before it stops existing.
   * The same treatment the key list gets, because it is the same shape.
   */
  opacity: 0; visibility: hidden; pointer-events: none;
  transform: scale(0.98) translateY(-4px);
  transform-origin: top right;
  transition: opacity ${z.ui}, transform ${z.ui}, visibility 0s linear 160ms;
}
.picker[data-open] {
  opacity: 1; visibility: visible; pointer-events: auto;
  transform: none;
  transition: opacity ${z.ui}, transform ${z.ui}, visibility 0s;
}
@media (prefers-reduced-motion: reduce) {
  /* The fade says it arrived; the travel and the scale are decoration. */
  .picker { transform: none; transition: opacity 120ms linear, visibility 0s linear 120ms; }
  .picker[data-open] { transition: opacity 120ms linear, visibility 0s; }
}
.picker .swatch {
  height: 40px; margin-bottom: 8px;
  border: 1px solid ${ue};
}
/* Each row copies itself, so the whole row is the target rather than the text. */
.picker button {
  display: grid; grid-template-columns: 34px 1fr;
  gap: 8px; align-items: baseline;
  width: 100%; padding: 3px 4px; margin: 0;
  border: 0; background: none; cursor: pointer;
  font: inherit; text-align: left;
  color: ${x.primary};
}
.picker button:hover { background: ${F(2)}; }
.picker button:focus-visible { outline: 1px solid ${x.primary}; outline-offset: -1px; }
.picker .k { color: ${x.secondary}; }
.picker .v { overflow-wrap: anywhere; }
.picker .hint {
  margin-top: 6px; padding-top: 6px;
  border-top: 1px solid ${ue};
  color: ${x.secondary};
}
`;function Yo(e){let t=document.createElement("style");t.textContent=Vi,e.appendChild(t);let o=document.createElement("div");o.className="picker",e.appendChild(o);let n=document.createElement("div");n.className="swatch";let r=document.createElement("div");r.className="hint";function i(a){n.style.background=a;let s=Ko(a).map(({label:u,value:S})=>{let v=document.createElement("button");v.type="button";let N=document.createElement("span");N.className="k",N.textContent=u;let c=document.createElement("span");return c.className="v",c.textContent=S,v.append(N,c),v.addEventListener("click",w=>{w.stopPropagation(),navigator.clipboard?.writeText(S).then(()=>{r.textContent=`copied ${u}`},()=>{r.textContent="clipboard refused"})}),v});r.textContent="click a row to copy",o.replaceChildren(n,...s,r),o.setAttribute("data-open","")}return{async open(){let a=window.EyeDropper;if(!a){o.replaceChildren(Object.assign(document.createElement("div"),{className:"hint",textContent:"this browser has no eyedropper"})),o.setAttribute("data-open","");return}try{let{sRGBHex:s}=await new a().open();i(s)}catch{}},close(){let a=o.hasAttribute("data-open");return o.removeAttribute("data-open"),a},destroy(){o.remove(),t.remove()}}}var Cn="__align_freeze",qi=`
[data-align-frozen] *:not([data-align-ignore]):not([data-align-ignore] *) {
  animation-play-state: paused !important;
}
`,Tn=!1,qt=[],Zt=[];function jo(e){let t=e;for(;t;){if(t instanceof Element&&t.hasAttribute("data-align-ignore"))return!0;let o=t.getRootNode();if(t=o instanceof ShadowRoot?o.host:t.parentNode??null,t===document)return!1}return!1}function Jt(){return Tn}function Mn(e){if(e!==Tn){if(Tn=e,!e){document.documentElement.removeAttribute("data-align-frozen"),document.getElementById(Cn)?.remove();for(let t of qt)try{t.play()}catch{}for(let t of Zt)t.play().catch(()=>{});qt=[],Zt=[];return}if(!document.getElementById(Cn)){let t=document.createElement("style");t.id=Cn,t.textContent=qi,t.setAttribute("data-align-ignore",""),document.head.appendChild(t)}document.documentElement.setAttribute("data-align-frozen",""),qt=[];try{for(let t of document.getAnimations()){if(t.playState!=="running")continue;let o=t.effect?.target??null;jo(o)||(t.pause(),qt.push(t))}}catch{}Zt=[];for(let t of Array.from(document.querySelectorAll("video")))t.paused||jo(t)||(t.pause(),Zt.push(t))}}var An="__align_xray",Zi=`
[data-align-xray] * { outline: 1px solid rgb(128 128 128 / 0.55) !important; }
[data-align-xray] [data-align-ignore],
[data-align-xray] [data-align-ignore] * { outline: none !important; }
`;function Ln(e){let t=document.documentElement;if(!e){t.removeAttribute("data-align-xray"),document.getElementById(An)?.remove();return}if(!document.getElementById(An)){let o=document.createElement("style");o.id=An,o.textContent=Zi,o.setAttribute("data-align-ignore",""),document.head.appendChild(o)}t.setAttribute("data-align-xray","")}var Nn="align-ui";function Uo(e){try{return localStorage.getItem(e)}catch{return null}}function Vo(e,t){try{localStorage.setItem(e,t)}catch{}}function qo(e){let t="/";try{t=location.pathname||"/"}catch{}return`${Nn}:${e}::${t}`}function Ji(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function Zo(){let e=Uo(qo("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(Ji).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function Jo(e){Vo(qo("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function Qt(e){return Uo(`${Nn}:${e}`)==="1"}function en(e,t){Vo(`${Nn}:${e}`,t?"1":"0")}var ke,oe=null,Ee=null,He=null,gt=null,je=null,tt=Ro(),ot=!1,pt=Qt("grid"),ht=Qt("pixels"),fe=null,J=[],nn=0,rt=Qt("rulers"),de=[],ar=1,Qo=!1,De=null,dt=!1,Mt=!1,Rn,nt=wo();function Qi(){return de.map(e=>({...e}))}function mt(e=""){nt.push(Qi(),e)}function er(){return de.find(e=>e.id===De)??null}function Ye(e){de=e,Jo(de)}var be=null,Pe=null,Ne=null,ea=3,ut=22;function sr(e,t){return rt?t<ut&&e>=ut?"y":e<ut&&t>=ut?"x":null:null}function In(e){return e.ctrlKey||e.metaKey}function lr(e,t,o,n){let r=Ve(t,o,ke),i=e.axis==="x"?t:o,a=de.filter(u=>u.id!==e.id).map(u=>({axis:u.axis,at:Tt(u).pos})),s=ao(i,so(r,e.axis,a),n);e.at=s.at+(e.axis==="x"?scrollX:scrollY),e.caught=s.what}function cr(e,t,o,n){let r={id:ar++,axis:e,at:0,locked:!1,caught:"",pinned:!1};lr(r,t,o,n);let i=de.find(a=>a.axis===r.axis&&Math.abs(a.at-r.at)<.5);return i?(De=i.id,i):(mt(),Ye([...de,r]),De=r.id,r)}function dr(e){e.pinned||(mt(),Ye(de.filter(t=>t.id!==e.id)),Pe?.id===e.id&&(Pe=null),be?.id===e.id&&(be=null))}function ta(e){let t=ke.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function Tt(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function Hn(){return J.length>=2?J[J.length-2]:void 0}function Dn(){if(J.length<2)return[];let e=[];for(let[t,o]of ln(J))for(let n of Dt(t,o)){if(n.extension||!n.label)continue;let r=Yn(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:jn(r)})}return e}function ye(e){let t=J[J.length-1],o=fe&&J.some(c=>c.el===fe.el),n=de.map(Tt),r=!be&&Pe?Pe:null,i=de.filter(c=>c.locked||c.id===r?.id),a=!r&&o?fe.el:null,s=r??a,u=r?Tt(r):null,S=[],v=(c,w)=>{for(let C of c)S.push(s&&!w?{...C,faded:!0}:C)},N=c=>!u||c.axis!==u.axis?!1:(c.axis==="x"?[c.x1,c.x2]:[c.y1,c.y2]).some(C=>Math.abs(C-u.pos)<.5);for(let[c,w]of ln(J))v(Dt(c,w),c.el===a||w.el===a);t&&fe&&!o&&!r&&v(Dt(t,fe),!0);for(let c of i)for(let w of J)v(dn(w,[Tt(c)]),c.id===r?.id||w.el===a);fe&&!o&&!r&&de.length&&v(dn(fe,n),!0);for(let c of lo(i.map(Tt),{x:innerWidth/2,y:innerHeight/2}))v([c],N(c));oe?.update({hover:fe,pinned:J,rulers:rt,hidden:dt,dimLock:Mt,grid:pt&&ke.grid?ke.grid:null,pixels:ht,guides:de,liveGuide:be??Pe,activeGuide:De,lines:S,...e?{cursor:e}:{}}),He?.update(J.length,{edit:tt.armed,rulers:rt,xray:ot,grid:pt,pixels:ht,freeze:Jt(),type:Ee?.showsType()??!1,hide:dt,canCopy:J.length>0,canUndo:nt.depth()>0,panel:Ee?.isOpen()??!1})}function na(){let e=Ee?.asText()??"";if(!e)return;let t=n=>He?.acknowledge("copy",n),o=navigator.clipboard?.writeText(e);o?o.then(()=>t(!0),()=>t(!1)):t(!1)}function oa(e,t){return e.length===t.length&&e.every((o,n)=>{let r=t[n];return o.id===r.id&&o.axis===r.axis&&o.at===r.at&&o.locked===r.locked&&o.pinned===r.pinned})}function ra(){for(;nt.depth()>0&&oa(nt.peek(),de);)nt.pop();let e=nt.pop();e&&(Ye(e),Pe=null,be=null,Ne=null,e.some(t=>t.id===De)||(De=null))}function Me(e){switch(e){case"rulers":rt=!rt,en("rulers",rt);break;case"xray":ot=!ot,Ln(ot);break;case"grid":pt=!pt,en("grid",pt);break;case"pixels":ht=!ht,en("pixels",ht);break;case"freeze":Mn(!Jt());break;case"type":Ee?.toggleType();break;case"panel":Ee?.toggle();break;case"hide":dt=!dt,Ee?.setHidden(dt),dt&&gt?.close();break;case"copy":na();break;case"pick":gt?.open();break;case"edit":if(tt.armed){let t=tt.disarm();He?.acknowledge("edit",t>=0)}else tt.arm();je?.setArmed(tt.armed),J.length&&ye();break;case"undo":ra();break}ye()}var tn=null;function ur(e){if(tn={x:e.clientX,y:e.clientY},be){Ne&&Math.hypot(e.clientX-Ne.x,e.clientY-Ne.y)>ea&&(Ne=null),!Ne&&!be.pinned&&(lr(be,e.clientX,e.clientY,In(e)),Ye([...de])),ye({x:e.clientX,y:e.clientY});return}Pe=cn(de,e.clientX,e.clientY),fe=Ve(e.clientX,e.clientY,ke),ye({x:e.clientX,y:e.clientY})}function pr(e){hr(!1),be&&(Ne?(be.locked=!be.locked,De=be.id,Ye([...de])):(sr(e.clientX,e.clientY)||e.clientX<ut||e.clientY<ut)&&dr(be),Ne=null,be=null,ye({x:e.clientX,y:e.clientY}))}function on(e){let t=oe?.root.host;return t?(e.composedPath?.()??[]).includes(t):!1}function hr(e){if(clearTimeout(Rn),e){if(Mt)return;Mt=!0,ye();return}Rn=setTimeout(()=>{Mt=!1,ye()},200)}function mr(e){if(e.button!==0)return;if(on(e)){hr(!0);return}let t=Ve(e.clientX,e.clientY,ke);if(!t)return;let o=sr(e.clientX,e.clientY);if(o){ft(e),Ne=null,be=cr(o,e.clientX,e.clientY,In(e)),ye({x:e.clientX,y:e.clientY});return}let n=cn(de,e.clientX,e.clientY);if(n){ft(e),mt(),De=n.id,be=n,Ne={x:e.clientX,y:e.clientY},ye({x:e.clientX,y:e.clientY});return}ft(e),He?.closeHelp(),J=[t],fe=t,Ee?.show(t,Dn(),Hn()),je?.show(t.el),ye({x:e.clientX,y:e.clientY})}function fr(e){if(on(e))return;let t=Ve(e.clientX,e.clientY,ke);if(!t)return;ft(e),He?.closeHelp();let o=J.findIndex(r=>r.el===t.el);J=o>=0?J.filter((r,i)=>i!==o):[...J,t],fe=t;let n=J[J.length-1];n?Ee?.show(n,Dn(),Hn()):Ee?.hide(),je?.show(n?.el??null),ye({x:e.clientX,y:e.clientY})}function gr(e){on(e)||Ve(e.clientX,e.clientY,ke)&&ft(e)}function br(e){on(e)||Ve(e.clientX,e.clientY,ke)&&ft(e)}function ft(e){e.preventDefault(),e.stopPropagation()}function tr(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var nr=0,or=0;function yr(){nn=requestAnimationFrame(yr);let t=J.filter(s=>s.el.isConnected).map(s=>Ht(s.el)),o=fe&&fe.el.isConnected?Ht(fe.el):null;if(!(scrollX!==nr||scrollY!==or||t.length!==J.length||t.some((s,u)=>!tr(s,J[u]))||fe===null!=(o===null)||fe!==null&&o!==null&&!tr(fe,o)))return;nr=scrollX,or=scrollY,J=t,fe=o;let i=J[J.length-1],a=ia();a!==rr&&(rr=a,i?Ee?.show(i,Dn(),Hn()):Ee?.hide(),je?.show(i?.el??null)),ye()}var rr="";function ia(){let e=J[0];return e?J.map(t=>[t.label,Math.round(t.width*100),Math.round(t.height*100),Math.round((t.left-e.left)*100),Math.round((t.top-e.top)*100)].join(",")).join(";"):""}function xr(){oe?.resize()}function aa(){Qo||(Qo=!0,de=Zo().map(e=>({...e,id:ar++}))),!oe&&(fo(),oe=Xo(),Ee=xo(oe.root),He=vo(oe.root,Me),je=Wo(oe.root,tt),gt=Yo(oe.root),He.update(0,{rulers:rt,xray:ot,grid:pt,pixels:ht,freeze:Jt(),type:!1,panel:!1,hide:!1,edit:!1,canCopy:!1,canUndo:!1}),addEventListener("mousemove",ur),addEventListener("mousedown",mr,{capture:!0}),addEventListener("mouseup",pr,{capture:!0}),addEventListener("click",gr,{capture:!0}),addEventListener("auxclick",br,{capture:!0}),addEventListener("contextmenu",fr,{capture:!0}),addEventListener("resize",xr),nn=requestAnimationFrame(yr),ye())}function Pn(){removeEventListener("mousemove",ur),removeEventListener("mousedown",mr,{capture:!0}),removeEventListener("mouseup",pr,{capture:!0}),removeEventListener("click",gr,{capture:!0}),removeEventListener("auxclick",br,{capture:!0}),removeEventListener("contextmenu",fr,{capture:!0}),removeEventListener("resize",xr),clearTimeout(Rn),Mt=!1,cancelAnimationFrame(nn),nn=0,He?.destroy(),je?.destroy(),je=null,gt?.destroy(),gt=null,ot&&(ot=!1,Ln(!1)),Mn(!1),tt.disarm(),He=null,Ee?.destroy(),Ee=null,oe?.destroy(),oe=null,go(),fe=null,J=[],be=null,Ne=null,Pe=null}function sa(e){let t=e.composedPath?.()[0]??e.target;return!t||typeof t!="object"||!("tagName"in t)?!1:t.isContentEditable?!0:t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT"}function ir(e){if(ta(e))e.preventDefault(),oe?Pn():aa();else if(!sa(e)){if(oe&&tn&&(e.key.toLowerCase()===ke.guideKeys.vertical||e.key.toLowerCase()===ke.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===ke.guideKeys.vertical?"x":"y";cr(t,tn.x,tn.y,In(e)),ye()}else if(oe&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(de.some(t=>!t.pinned)&&mt(),Ye(de.filter(t=>t.pinned)),Pe=null,be=null,Ne=null,de.some(t=>t.id===De)||(De=null)):Pe&&dr(Pe),ye();else if(oe&&e.key.startsWith("Arrow")){let t=er(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;mt(`nudge:${t.id}`);let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",Ye([...de]),ye()}else if(oe&&e.key.toLowerCase()==="g"){e.preventDefault(),Me("grid");return}else if(oe&&e.key.toLowerCase()==="k"){e.preventDefault(),Me("pixels");return}else if(oe&&e.key==="\\"){e.preventDefault(),Me("hide");return}else if(oe&&e.key.toLowerCase()==="e"){e.preventDefault(),Me("edit");return}else if(oe&&e.key.toLowerCase()==="f"){e.preventDefault(),Me("freeze");return}else if(oe&&e.key.toLowerCase()==="x"){e.preventDefault(),Me("xray");return}else if(oe&&e.key.toLowerCase()==="p"){e.preventDefault(),Me("pick");return}else if(oe&&e.key.toLowerCase()==="t"){e.preventDefault(),Me("type");return}else if(oe&&e.key.toLowerCase()==="c"){e.preventDefault(),Me("copy");return}else if(oe&&e.key.toLowerCase()==="l"){let t=er();if(!t)return;e.preventDefault(),mt(),t.pinned=!t.pinned,Ye([...de]),ye()}else if(oe&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){if(nt.depth()===0)return;e.preventDefault(),Me("undo");return}else if(oe&&e.key.toLowerCase()===ke.rulerKey){e.preventDefault(),Me("rulers");return}else if(oe&&e.key.toLowerCase()===ke.panelKey){e.preventDefault(),Me("panel");return}else if(e.key==="Escape"&&oe){if(gt?.close()||He?.closeHelp())return;J.length?(J=[],Ee?.hide(),je?.show(null),ye()):Pn()}}}function xs(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,ke=no(e),yo(ke.theme),addEventListener("keydown",ir,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{Pn(),removeEventListener("keydown",ir,{capture:!0}),delete window.__align})}export{xs as initAlign};
