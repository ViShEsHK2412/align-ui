function ye(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function yr(e){return(e.split(",")[0]??"").trim().replace(/^['"]|['"]$/g,"")}function xr(e){let o={100:"thin",200:"extralight",300:"light",400:"regular",500:"medium",600:"semibold",700:"bold",800:"extrabold",900:"black"}[e.trim()];return o?`${e} ${o}`:e}function At(e){let t=getComputedStyle(e);return[{label:"family",value:yr(t.fontFamily),px:NaN},{label:"size",value:t.fontSize,px:ye(t.fontSize)},{label:"weight",value:xr(t.fontWeight),px:NaN},{label:"line",value:t.lineHeight,px:ye(t.lineHeight)},{label:"tracking",value:t.letterSpacing,px:ye(t.letterSpacing)}]}function Xn(e){let t="";for(let o of e.childNodes)o.nodeType===3&&(t+=o.nodeValue??"");return t.trim().replace(/\s+/g," ")}function Lt(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:ye(r)})}return o}function nn(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function wr(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function Kn(e,t){if(t.length===0)return"";let o=[],n=0;for(let i of wr(e)){let a=nn(i,t);a.length?o.push(`${vr(i)} ${a.join(" ")}`):n+=1}if(o.length===0)return n===1?"its one number is not on the scale":`none of its ${n} numbers are on the scale`;let r=n===0?"":n===1?"  \xB7  1 more, not on the scale":`  \xB7  ${n} more, not on the scale`;return o.join("  \xB7  ")+r}function vr(e){return String(Math.round(e*100)/100)}function Gn(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(ye)}function Yn(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),s=a.display.includes("flex")||a.display.includes("grid"),c=n==="x"?a.columnGap:a.rowGap,k=s&&c!=="normal"?ye(c):null,[w,M,d,y]=Gn(e),[$,E,W,u]=Gn(t),g=q=>Number.isFinite(q)?q:0,X=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,K=n==="x"?X?g(M)+g(u):g(E)+g(y):X?g(d)+g($):g(W)+g(w);return{px:o,cssGap:k,margins:K,siblings:!0}}function jn(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function Un(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}function ft(e){let t=e.trim().toLowerCase();return t?t.startsWith("#")||/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(t)?!0:["black","white","transparent","currentcolor"].includes(t):!1}var De;function Bn(e){if(De===void 0&&(De=document.createElement("canvas").getContext("2d")),!De)return"";De.fillStyle="#000000",De.fillStyle=e;let t=De.fillStyle;return De.fillStyle="#ffffff",De.fillStyle=e,t===De.fillStyle?String(t):""}function Nt(e,t){let o=Bn(e);return o?t.filter(n=>ft(n.value)&&Bn(n.value)===o).map(n=>n.name).sort():[]}function Vn(e){let t=getComputedStyle(e),o=[],n=(r,i)=>{let a=i.trim();!a||a==="transparent"||/rgba?\([^)]*,\s*0\s*\)$/.test(a)||o.push({label:r,value:a})};return n("text",t.color),n("background",t.backgroundColor),o}function kr(e,t,o){let n=r=>typeof CSS<"u"&&CSS.escape?CSS.escape(r):r.replace(/[^\w-]/g,"\\$&");return t?`#${n(t)}`:o.length?e+o.map(r=>`.${n(r)}`).join(""):e}function gt(e){let t=typeof e.className=="string"?e.className.trim().split(/\s+/).filter(Boolean):[];return kr(e.tagName.toLowerCase(),e.id,t)}function qn(e){let t=gt(e);if(!/[.#]/.test(t))return 0;try{return document.querySelectorAll(t).length}catch{return 0}}function $r(e){if(!e)return"inline <style>";let t=e.split("?")[0]??e;try{let o=new URL(t,"http://x").pathname;return decodeURI(o).replace(/^\//,"")||t}catch{return t}}var Er=["width","height","padding","margin","border-width","gap","font-size","line-height","letter-spacing","color","background-color"];function Sr(e){for(let t=0;t<e.length;t+=1){let o=e.item(t);if(Er.some(n=>o===n||o.startsWith(`${n}-`)))return!0}return!1}function Zn(e){let t=[],o=new Set,n=(r,i)=>{for(let a of Array.from(r)){if(a instanceof CSSMediaRule){matchMedia(a.conditionText).matches&&n(a.cssRules,i);continue}if(a instanceof CSSSupportsRule){CSS.supports(a.conditionText)&&n(a.cssRules,i);continue}let s=a.cssRules;if(s&&!(a instanceof CSSStyleRule)){n(s,i);continue}if(!(a instanceof CSSStyleRule))continue;let c=!1;try{c=e.matches(a.selectorText)}catch{continue}if(!c||!Sr(a.style))continue;let k=`${a.selectorText}|${i}`;o.has(k)||(o.add(k),t.push({selector:a.selectorText,file:i}))}};for(let r of Array.from(document.styleSheets)){if(r.ownerNode instanceof Element&&r.ownerNode.hasAttribute("data-align-ignore"))continue;let i;try{i=r.cssRules}catch{continue}n(i,$r(r.href))}return t.reverse()}function On(e){if(!e||e==="none")return[];let t=e.trim().split(/\s+/),o=[];for(let n of t){if(!n.endsWith("px"))return[];let r=Number.parseFloat(n);if(!Number.isFinite(r))return[];o.push(r)}return o}function zn(e,t,o){let n=0;for(let r=0;r<e.length;r+=1){let i=n+e[r];if(o<i+.5)return r;n=i+t}return-1}function Cr(e,t){let o=t==="rtl";return e.startsWith("vertical")||e.startsWith("sideways")?{inline:"y",inlineReversed:e==="sideways-lr"?!o:o,blockReversed:e==="vertical-rl"||e==="sideways-rl"}:{inline:"x",inlineReversed:o,blockReversed:!1}}function Fn(e,t,o,n,r){return r?t-n:o-e}function Jn(e){let t=e.parentElement,o=0;for(;t&&getComputedStyle(t).display==="contents";)t=t.parentElement,o+=1;if(!t)return null;let n=getComputedStyle(t),r=getComputedStyle(e),i=n.display,a=[];if(o>0&&a.push({label:"through",value:o===1?"a display: contents parent":`${o} display: contents parents`}),r.position==="absolute"||r.position==="fixed")return a.push({label:"placed by",value:`${r.position}, not by the parent`}),{display:i,rows:a};if(r.float!=="none")return a.push({label:"placed by",value:`float: ${r.float}`}),{display:i,rows:a};let s=i.includes("flex"),c=i.includes("grid");if(!s&&!c)return a.push({label:"flow",value:i}),{display:i,rows:a};let k=Wn(n.rowGap==="normal"?"0px":n.rowGap),w=Wn(n.columnGap==="normal"?"0px":n.columnGap),M=k===w?k:`row ${k} \xB7 column ${w}`;if(s){let Z=n.flexDirection;a.push({label:"direction",value:n.flexWrap==="nowrap"?Z:`${Z} \xB7 ${n.flexWrap}`}),a.push({label:"justify",value:n.justifyContent}),a.push({label:"align",value:n.alignItems}),a.push({label:"gap",value:M});let b=`${r.flexGrow} ${r.flexShrink} ${r.flexBasis}`;return b!=="0 1 auto"&&a.push({label:"this child",value:`flex: ${b}`}),r.alignSelf!=="auto"&&a.push({label:"align-self",value:r.alignSelf}),{display:i,rows:a}}let d=On(n.gridTemplateColumns),y=On(n.gridTemplateRows);d.length&&a.push({label:"columns",value:`${d.length} \xB7 ${d.map(tn).join(" ")}`}),y.length&&a.push({label:"rows",value:`${y.length} \xB7 ${y.map(tn).join(" ")}`}),a.push({label:"gap",value:M});let $=t.getBoundingClientRect(),E=e.getBoundingClientRect(),W={left:$.left+ye(n.borderLeftWidth)+ye(n.paddingLeft),right:$.right-ye(n.borderRightWidth)-ye(n.paddingRight),top:$.top+ye(n.borderTopWidth)+ye(n.paddingTop),bottom:$.bottom-ye(n.borderBottomWidth)-ye(n.paddingBottom)},u=Cr(n.writingMode,n.direction),g=(Z,b)=>Z==="x"?Fn(W.left,W.right,E.left,E.right,b):Fn(W.top,W.bottom,E.top,E.bottom,b),X=u.inline==="x"?"y":"x",K=ye(n.columnGap==="normal"?"0":n.columnGap),q=ye(n.rowGap==="normal"?"0":n.rowGap),ae=zn(d,K,g(u.inline,u.inlineReversed)),re=zn(y,q,g(X,u.blockReversed)),ee=[];return ae>=0&&ee.push(`column ${ae+1} of ${d.length}`),re>=0&&ee.push(`row ${re+1} of ${y.length}`),ee.length&&a.push({label:"this child",value:ee.join(" \xB7 ")}),{display:i,rows:a}}function Wn(e){return e.endsWith("px")?tn(Number.parseFloat(e)):e}function tn(e){return String(Math.round(e*100)/100)}var Qn=["display","position","width","height","padding","margin","border-width","border-style","border-radius","font-family","font-size","font-weight","font-style","line-height","letter-spacing","text-transform","text-align","color","background-color","border-color","opacity","flex-direction","justify-content","align-items","gap","flex-grow","flex-shrink","flex-basis","align-self","box-shadow","overflow","text-overflow","white-space"];function Tr(e,t){let o=[];for(let n of Qn){let r=e[n]??"",i=t[n]??"";r!==i&&o.push({prop:n,a:r,b:i})}return o}function _n(e){let t=getComputedStyle(e),o={};for(let n of Qn)o[n]=t.getPropertyValue(n);return o}function eo(e,t){return Tr(_n(e),_n(t))}var Mr={ignore:"",grid:null,hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"},theme:"auto"};function no(e={}){return{...Mr,...e}}var to=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function oo(e){return e.ignore?`${to}, ${e.ignore}`:to}function ie(e){return String(Math.round(e*100)/100)}function Ar(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function It(e){let t=e.getBoundingClientRect();return{el:e,label:Ar(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height,scale:Ge(e)}}function ro(e,t){let o=(n,r)=>Math.abs(n-r)<.001;return o(e.scale.x,t.scale.x)&&o(e.scale.y,t.scale.y)?e.scale:{x:1,y:1}}function io(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function Ke(e,t,o){let n=oo(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=io(r);return r&&r!==document.documentElement?It(r):null}var Rt=e=>parseFloat(e)||0;function on(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[Rt(n),Rt(r),Rt(i),Rt(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function Lr(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function Nr(e,t){let o=ro(e,t),n=t.left+t.width/2,r=t.top+t.height/2;return[{x1:e.left,y1:r,x2:t.left,y2:r,label:ie((t.left-e.left)/o.x),axis:"x"},{x1:t.right,y1:r,x2:e.right,y2:r,label:ie((e.right-t.right)/o.x),axis:"x"},{x1:n,y1:e.top,x2:n,y2:t.top,label:ie((t.top-e.top)/o.y),axis:"y"},{x1:n,y1:t.bottom,x2:n,y2:e.bottom,label:ie((e.bottom-t.bottom)/o.y),axis:"y"}]}function Pt(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function Ht(e,t){let o=[],n=ro(e,t),r=e.left<t.right&&t.left<e.right,i=e.top<t.bottom&&t.top<e.bottom;if(r&&i){let[a,s]=Lr(e,t);return Nr(a,s)}if(!r){let[a,s]=e.right<=t.left?[e,t]:[t,e],c=i?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:a.right,y1:c,x2:s.left,y2:c,label:`${ie((s.left-a.right)/n.x)}`,axis:"x"}),o.push(...Pt(a.right,a.top,a.bottom,c,"x")),o.push(...Pt(s.left,s.top,s.bottom,c,"x"))}if(!i){let[a,s]=e.bottom<=t.top?[e,t]:[t,e],c=r?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:c,y1:a.bottom,x2:c,y2:s.top,label:`${ie((s.top-a.bottom)/n.y)}`,axis:"y"}),o.push(...Pt(a.bottom,a.left,a.right,c,"y")),o.push(...Pt(s.top,s.left,s.right,c,"y"))}return o}function Rr(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function rn(e){let t=Rr(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var Pr=5,Ir=8;function bt(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function an(e,t,o){let n=null,r=Pr;for(let i of e){let a=Math.abs(bt(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function ao(e,t,o){if(o)return{at:e,what:""};let n=null,r=Ir;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function so(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function sn(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,s=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:s,y2:i,label:ie(r.gap/e.scale.x),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,s=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:s,label:ie(r.gap/e.scale.y),axis:"y"})}}return o}function lo(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],s=r[i],c=s-a;c<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:s,y2:t.y,label:ie(c),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:s,label:ie(c),axis:"y"}))}}return o}var Oe=3;function Hr(e,t){return e.x<t.x+t.w+Oe&&t.x<e.x+e.w+Oe&&e.y<t.y+t.h+Oe&&t.y<e.y+e.h+Oe}function co(e,t,o=12){let n=(a,s)=>Math.min(Math.max(a,o),t.w-s-o),r=(a,s)=>Math.min(Math.max(a,o),t.h-s-o),i=[];for(let a of e){let s={...a,x:n(a.x,a.w),y:r(a.y,a.h)},c=!1;for(let k=0;k<16;k++){let w=i.find(d=>Hr(d,s));if(!w)break;let M=s.axis==="x"?s.y:s.x;if(s.axis==="x"?s.y=r(c?w.y+w.h+Oe:w.y-s.h-Oe,s.h):s.x=n(c?w.x-s.w-Oe:w.x+w.w+Oe,s.w),(s.axis==="x"?s.y:s.x)===M){if(c)break;c=!0}}i.push(s)}return i}function uo(e,t){let{columns:o,gutter:n,margin:r}=e;if(o<=0)return[];let i=e.maxWidth>0?Math.min(e.maxWidth,t):t,a=Math.max(0,(t-i)/2),c=(Math.max(0,i-r*2)-n*(o-1))/o;if(c<=0)return[];let k=[];for(let w=0;w<o;w+=1)k.push({left:a+r+w*(c+n),width:c});return k}function po(e,t){return e*t>=8?e:0}function Dr(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(s=>parseFloat(s)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function Ge(e){let t=1,o=1;for(let n=e;n;n=io(n)){let r=Dr(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var Ne=(e,t)=>({light:e,dark:t}),ln={accent:Ne("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:Ne("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:Ne("oklch(1 0 0)","oklch(0.264 0 0)"),fg:Ne("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:Ne("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:Ne("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:Ne("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:Ne("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)"),pixelLine:Ne("oklch(0.205 0 0 / 0.14)","oklch(0.97 0 0 / 0.14)")};function mo(e){return`light-dark(${e.light}, ${e.dark})`}var xe=mo(Ne("#fafafa","#1a1a1a"));function nt(e,t=e){return mo(Ne(`rgb(0 0 0 / ${t})`,`rgb(255 255 255 / ${e})`))}var ho=[0,.07,.08,.1,.12,.15,.2];function _(e){let t=ho[Math.max(0,Math.min(ho.length-1,e))];return t===0?xe:nt(t)}var x={primary:nt(.9),secondary:nt(.6),tertiary:nt(.46,.55),disabled:nt(.22,.26)},ue=nt(.12),Be="0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)",Dt="0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)",te=22,ze=36,B={tight:4,base:8,roomy:12,edge:16},F={exit:"160ms cubic-bezier(0.3, 0, 1, 1)",ui:"160ms cubic-bezier(0.2, 0, 0, 1)"},Gr='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',H={title:13,body:12,tag:11,stack:Gr},J={regular:400,medium:500,semibold:600},cn="__align_font",Br="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function fo(){if(document.getElementById(cn))return;let e=document.createElement("link");e.id=cn,e.rel="stylesheet",e.href=Br,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function go(){document.getElementById(cn)?.remove()}function bo(e){let t=[`${J.medium} ${H.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function un(e){let t={};for(let o of Object.keys(ln))t[o]=e?ln[o].dark:ln[o].light;return t}var dn=null;function yo(e){dn=e==="auto"?null:e}function pn(){if(dn)return dn==="dark";let e=document.documentElement,t=getComputedStyle(e).colorScheme;if(/dark/.test(t)&&!/light/.test(t))return!0;if(/light/.test(t)&&!/dark/.test(t))return!1;for(let o of[document.body,e]){if(!o)continue;let n=Or(getComputedStyle(o).backgroundColor);if(n!==null)return n<.5}return matchMedia("(prefers-color-scheme: dark)").matches}function Or(e){let t=/^rgba?\(([^)]+)\)$/.exec(e.trim());if(!t)return null;let o=t[1].split(/[\s,/]+/).filter(Boolean).map(Number),[n,r,i,a=1]=o;return n===void 0||r===void 0||i===void 0||a<.5?null:(.2126*n+.7152*r+.0722*i)/255}function Ye(e,t){return e.replace(/\)$/,` / ${t})`)}var zr=`
`,Pe=16,Fr=`
.dock {
  /* No color-scheme here: the overlay sets it inline on the shadow host, from
     what the page actually looks like rather than what the machine prefers, and
     it inherits down. Declaring 'light dark' again would undo that and hand
     light-dark() back to the media query. */
  position: fixed; left: ${Pe}px; top: 0;
  /* Clamped to the window. A narrow viewport is not an edge case for this
     tool, it is the case it exists for: you make the window 375px wide
     precisely to check a mobile layout, and a readout that hangs off the
     screen there is useless exactly when you reached for it. */
  width: min(340px, calc(100vw - ${Pe*2}px));
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none;
  /* Not the whole panel: only the header is a drag surface, and making the
     numbers unselectable means the one thing you might want to paste into a
     stylesheet cannot be picked up by hand. Copy covers the whole reading; a
     selection covers the one value you actually wanted. */
  user-select: none;
  font-family: ${H.stack};
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
  max-height: calc(100vh - ${Pe*2}px);
  overflow-y: auto; overscroll-behavior: contain;
  font-size: ${H.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${xe};

  box-shadow: ${Be};

  /* The one animation in the tool: a panel that must land exactly, so the
     Fluid spring.moderate tier at 160ms, critically damped. */
  opacity: 0;
  transform: translateY(4px) scale(0.98);
  transform-origin: bottom left;
  transition: opacity ${F.exit}, transform ${F.exit},
              box-shadow ${F.exit};
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
  transition: opacity ${F.ui}, transform ${F.ui},
              box-shadow ${F.ui};
}
@media (prefers-reduced-motion: reduce) {
  /* Fewer and gentler, not none: the fade aids comprehension, the travel does not. */
  .panel { transform: none; transition: opacity 120ms linear; }
}

header {
  /* Stays put while the body scrolls: it is also the drag handle, and a handle
     you have to scroll back up to find is not a handle. */
  position: sticky; top: -10px; z-index: 1;
  background: ${xe};
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] .panel { box-shadow: ${Dt}; }
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${H.title}px; font-weight: ${J.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${H.body}px; font-weight: ${J.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${H.tag}px; font-weight: ${J.medium};
  margin-left: 4px;
  color: ${x.primary};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${H.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${_(1)}; }

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
.region[data-level="1"] { background: ${_(1)}; }
.region[data-level="2"] { background: ${_(2)}; }
.region[data-level="3"] { background: ${_(3)}; }
.content { background: ${_(4)}; }

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
  font-size: ${H.tag}px; font-weight: ${J.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${J.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${J.regular}; }
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
  font-size: ${H.tag}px; line-height: 1.5;
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
  font-size: ${H.body}px;
  /* Several of these wrap \u2014 a diff value, a rule file, a token list \u2014 and a
     lone short word on the last line reads as a mistake. */
  text-wrap: pretty;
}
.content {
  border-radius: 0; padding: ${B.roomy}px ${B.base}px;
  text-align: center; font-weight: ${J.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,yt=Pe,je=-1,ot=!1;function xo(e){let t=document.createElement("style");t.textContent=Fr,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);let r=!1;function i(u,g){let X=document.createElement("div");X.className="readout";let K=document.createElement("div");K.className="tag readout-tag",K.textContent=u,X.appendChild(K);let q=document.createElement("div");q.className="readout-rows",X.appendChild(q);for(let[ae,re]of g){let ee=document.createElement("div");ee.className="readout-row";let Z=document.createElement("span");Z.className="readout-key",Z.textContent=ae;let b=document.createElement("span");b.className="readout-value",b.textContent=re,ee.append(Z,b),q.appendChild(ee)}return X}e.appendChild(o);let a=(u,g)=>Math.min(Math.max(u,Pe),Math.max(Pe,g-Pe));function s(){let u=o.offsetHeight||300;je<0&&(je=Math.max(Pe,innerHeight-u-Pe)),yt=a(yt,innerWidth-o.offsetWidth),je=a(je,innerHeight-u),o.style.transform=`translate(${yt-Pe}px, ${je}px)`}let c=null;function k(u){u.button===0&&(u.preventDefault(),u.stopPropagation(),c={x:u.clientX,y:u.clientY,dx:yt,dy:je},o.setAttribute("data-dragging",""),u.currentTarget.setPointerCapture(u.pointerId))}function w(u){c&&(yt=c.dx+(u.clientX-c.x),je=c.dy+(u.clientY-c.y),s())}function M(){c=null,o.removeAttribute("data-dragging")}addEventListener("resize",s);let d=null,y=[],$;function E(u){let g=document.createElement("div");return g.className="edge",g.textContent=u===0?"0":ie(u),u===0&&g.setAttribute("data-zero",""),g}function W(u,g,X,K){let[q,ae,re,ee]=X,Z=document.createElement("div");Z.className="region",Z.setAttribute("data-level",String(g));let b=document.createElement("span");b.className="tag",b.textContent=u;let O=document.createElement("div");O.className="row";let oe=document.createElement("div");oe.className="fill",oe.appendChild(K),O.append(E(ee),oe,E(ae));let N=document.createElement("div");return N.className="head",N.append(b,E(q)),Z.append(N,O,E(re)),Z}return{show(u,g=[],X){y=g,$=X;let K=on(u.el),[q,ae,re,ee]=K.border,[Z,b,O,oe]=K.padding,N=Ge(u.el),j=u.width/N.x,A=u.height/N.y,U=Math.abs(N.x-1)>.001||Math.abs(N.y-1)>.001,l=document.createElement("header"),C=document.createElement("span");C.className="name",C.textContent=u.label;let v=document.createElement("span");v.className="size",v.textContent=`${ie(j)} \xD7 ${ie(A)}`;let D=document.createElement("button");if(D.className="close",D.textContent="\xD7",D.title="close (B brings it back)",D.addEventListener("pointerdown",P=>P.stopPropagation()),D.addEventListener("click",P=>{P.stopPropagation(),ot=!0,o.removeAttribute("data-open")}),l.append(C,v),U){let P=document.createElement("span");P.className="scale",P.textContent=`\xD7${ie(N.x)}`,P.title=`renders at ${ie(u.width)} \xD7 ${ie(u.height)}`,l.appendChild(P)}l.appendChild(D),l.addEventListener("pointerdown",k),l.addEventListener("pointermove",w),l.addEventListener("pointerup",M),l.addEventListener("pointercancel",M);let I=document.createElement("div");I.className="content",I.textContent=`${ie(j-ee-ae-oe-b)} \xD7 ${ie(A-q-re-Z-O)}`,I.title=I.textContent;let G=[l,W("margin",1,K.margin,W("border",2,K.border,W("padding",3,K.padding,I)))];if(r){let P=Xn(u.el),h=At(u.el);G.push(h.length&&P?i("type",h.map(T=>[T.label,T.value])):i("type",[["","nothing of its own to set type on"]]))}if(X&&X.el!==u.el&&X.el.isConnected){let P=eo(X.el,u.el).map(Y=>[Y.prop,`${Y.a||"\u2014"} \u2192 ${Y.b||"\u2014"}`]),h=P.slice(0,10);P.length>h.length&&h.push(["",`and ${P.length-h.length} more`]);let T=X.label===u.label?"the one locked before":X.label;G.push(i(`differs from ${T}`,h.length?h:[["","nothing in the properties it compares"]]))}let p=Jn(u.el);if(p&&p.rows.length&&G.push(i(`laid out by ${p.display}`,p.rows.map(P=>[P.label,P.value]))),g.length){let P=g.map(T=>[ie(T.px),T.detail]),h=Un(g.map(T=>T.px));h&&P.push(["",h]),G.push(i("gaps",P))}let f=Lt(u.el),S=Kn([j,A,...K.margin,...K.border,...K.padding,...r?At(u.el).map(P=>P.px):[]],f);S&&G.push(i("tokens",[["",S]]));let R=Zn(u.el);R.length&&G.push(i("styled by",R.slice(0,4).map(P=>[P.selector,P.file])));let L=qn(u.el);L>1&&G.push(i("matches",[["",`${L} elements share ${gt(u.el)}`]]));let z=f.filter(P=>ft(P.value));if(z.length){let P=Vn(u.el).map(({label:h,value:T})=>{let Y=Nt(T,z);return[h,Y.length?`${T}  ${Y.join(" ")}`:`${T}  \u2014`]});P.length&&G.push(i("colour",P))}n.replaceChildren(...G),d=u,s(),!ot&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},showsType:()=>r,isOpen:()=>!ot&&d!==null,toggleType(){r=!r,d&&this.show(d,y,$)},asText(){if(!d)return"";let u=on(d.el),g=Ge(d.el),X=d.width/g.x,K=d.height/g.y,q=re=>re.map(ee=>ie(ee)).join(" "),ae=[`${d.label}  ${ie(X)} \xD7 ${ie(K)}`,`margin   ${q(u.margin)}`,`border   ${q(u.border)}`,`padding  ${q(u.padding)}`];if(r)for(let re of At(d.el))ae.push(`${re.label.padEnd(8)} ${re.value}`);return ae.join(zr)},hide(){d=null,o.removeAttribute("data-open")},setHidden(u){o.toggleAttribute("data-away",u)},toggle(){d&&(ot=!ot,ot?o.removeAttribute("data-open"):(s(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",s),o.remove(),t.remove()}}}function wo(e=20,t=1e3){let o=[];return{push(n,r,i=Date.now()){let a=o[o.length-1];if(a&&r!==""&&a.tag===r&&i-a.at<=t){a.at=i;return}o.push({state:n,tag:r,at:i}),o.length>e&&o.shift()},pop(){return o.pop()?.state??null},peek(){return o[o.length-1]?.state??null},depth(){return o.length},clear(){o.length=0}}}var Wr="0 0 24 24";var m=(e,t,o)=>{let n={path:e};return t!==void 0&&(n.fade=t),o!==void 0&&(n.weight=o),n},se=(e,t,o,n,r,i)=>i===void 0?{rect:[e,t,o,n,r]}:{rect:[e,t,o,n,r],fade:i},_r={rulers:[m("M2 8V4"),m("M22 8V4"),m("M22 6H2"),se(2,12,20,8,2),m("M6 15v-3"),m("M10 15v-3"),m("M14 15v-3"),m("M18 15v-3")],xray:[m("M3 7V5a2 2 0 0 1 2-2h2"),m("M17 3h2a2 2 0 0 1 2 2v2"),m("M21 17v2a2 2 0 0 1-2 2h-2"),m("M7 21H5a2 2 0 0 1-2-2v-2")],grid:[se(3,3,18,18,2),m("M9 3v18"),m("M15 3v18")],pixels:[se(3,3,18,18,2),m("M3 9h18"),m("M3 15h18"),m("M9 3v18"),m("M15 3v18")],type:[m("M12 4v16"),m("M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"),m("M9 20h6")],panel:[se(3,3,18,18,2),se(8,8,8,8,1)],freeze:[se(14,3,5,18,1),se(5,3,5,18,1)],copy:[se(8,8,14,14,2),m("M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2")],pick:[m("m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12"),m("m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z"),m("m2 22 .414-.414")],hide:[m("M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"),m("M14.084 14.158a3 3 0 0 1-4.242-4.242"),m("M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"),m("m2 2 20 20")],undo:[m("M9 14 4 9l5-5"),m("M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11")],edit:[m("M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"),m("m15 5 4 4")],sideTop:[m("M4 5h16v14H4z",.25,1.25),m("M4 5h16",1,3.5)],sideRight:[m("M4 5h16v14H4z",.25,1.25),m("M20 5v14",1,3.5)],sideBottom:[m("M4 5h16v14H4z",.25,1.25),m("M4 19h16",1,3.5)],sideLeft:[m("M4 5h16v14H4z",.25,1.25),m("M4 5v14",1,3.5)],fontSize:[m("M12 4v16"),m("M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"),m("M9 20h6")],fontWeight:[m("M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8")],lineHeight:[m("M3 5h18",.35),m("M3 19h18",.35),m("M12 8v8")],tracking:[m("M5 5v14",.35),m("M19 5v14",.35),m("M8 12h8")],italic:[m("M19 4h-9"),m("M14 20H5"),m("m15 4-4 16")],textAlign:[m("M21 6H3"),m("M15 12H3"),m("M17 18H3")],textCase:[m("M3.5 13h6"),m("m2 16 4.5-9 4.5 9"),m("M18 16V7"),m("m14 11 4-4 4 4")],underline:[m("M6 4v6a6 6 0 0 0 12 0V4"),m("M4 20h16")],textColour:[m("m6 16 6-12 6 12",.35),m("M8 12h8",.35),m("M4 20h16")],backgroundColour:[se(3,3,18,18,2),m("M3 12h18",.35),m("M12 3v18",.35)],borderColour:[se(3,3,18,18,2),se(8,8,8,8,1,.35)],opacity:[m("M12 3a9 9 0 0 0 0 18z"),m("M12 3a9 9 0 0 1 0 18",.35)],padding:[se(3,3,18,18,2,.35),se(7,7,10,10,1)],margin:[se(3,3,18,18,2),se(7,7,10,10,1,.35)],boxSizing:[se(3,3,18,18,2),m("M7 7h10v10H7z",.35)],widthIcon:[m("M2 12h20"),m("m6 8-4 4 4 4"),m("m18 8 4 4-4 4")],heightIcon:[m("M12 2v20"),m("m8 6 4-4 4 4"),m("m8 18 4 4 4-4")],borderWidth:[se(3,3,18,18,2),m("M3 3h18")],borderStyle:[m("M3 12h4"),m("M10 12h4"),m("M17 12h4")],borderRadius:[m("M21 21V9a6 6 0 0 0-6-6H3")],gap:[se(3,4,7,16,1,.35),se(14,4,7,16,1,.35),m("M12 8v8")],flexDirection:[m("M12 5v14"),m("m8 9 4-4 4 4"),m("m8 15 4 4 4-4")],justify:[m("M4 4v16",.35),m("M20 4v16",.35),se(8,8,8,8,1)],alignItems:[m("M4 4h16",.35),m("M4 20h16",.35),se(8,8,8,8,1)],flexWrap:[m("M3 7h13a4 4 0 0 1 0 8H8"),m("m11 12-3 3 3 3")],shadow:[se(3,3,14,14,2),m("M21 9v10a2 2 0 0 1-2 2H9",.35)],backdrop:[se(3,3,18,18,2),m("M7 12h10",.35),m("M7 8h10",.35),m("M7 16h10",.35)],arrowUp:[m("m5 12 7-7 7 7"),m("M12 19V5")],arrowDown:[m("M12 5v14"),m("m19 12-7 7-7-7")],link:[m("M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"),m("M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71")],check:[m("M20 6 9 17l-5-5")],warning:[m("m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"),m("M12 9v4"),m("M12 17h.01")],cross:[m("M18 6 6 18"),m("m6 6 12 12")]},hn="http://www.w3.org/2000/svg";function ve(e,t=16){let o=document.createElementNS(hn,"svg");o.setAttribute("viewBox",Wr),o.setAttribute("width",String(t)),o.setAttribute("height",String(t)),o.setAttribute("fill","none"),o.setAttribute("stroke","currentColor"),o.setAttribute("stroke-width","2"),o.setAttribute("stroke-linecap","round"),o.setAttribute("stroke-linejoin","round"),o.setAttribute("aria-hidden","true");for(let n of _r[e])if("rect"in n){let[r,i,a,s,c]=n.rect,k=document.createElementNS(hn,"rect");k.setAttribute("x",String(r)),k.setAttribute("y",String(i)),k.setAttribute("width",String(a)),k.setAttribute("height",String(s)),k.setAttribute("rx",String(c)),n.fade!==void 0&&k.setAttribute("opacity",String(n.fade)),n.weight!==void 0&&k.setAttribute("stroke-width",String(n.weight)),o.appendChild(k)}else{let r=document.createElementNS(hn,"path");r.setAttribute("d",n.path),n.fade!==void 0&&r.setAttribute("opacity",String(n.fade)),n.weight!==void 0&&r.setAttribute("stroke-width",String(n.weight)),o.appendChild(r)}return o}var Xr=[{title:"Pointing at things",rows:[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure whatever is under the cursor"],["Click","lock an element, so it keeps measuring after the pointer leaves"],["Right-click","add another to the locked set, or drop one from it. Two locked also gets you a diff"],["Drag the panel header","move the box model out of your way"],["Esc","clear the locks, then close the tool"]]},{title:"Guides",rows:[["Drag from a rule","pull out a guide; drag it back into the rule to throw it away"],["V  /  H","drop a vertical or horizontal guide at the cursor"],["Hover a guide","its distance to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the guide you last touched. Shift for 10px"],["L","pin a guide, so it cannot be moved or deleted by accident"],["Ctrl/Cmd while placing","ignore snapping"],["Del","remove the guide under the cursor. Shift+Del for all of them"]]}],Me=B.edge,mn=24,Kr=900,xt=ze,wt=B.base,Yr=`
.flag {
  position: fixed; top: ${Me}px; right: ${Me}px;
  display: flex; align-items: center; gap: 8px;
  transition: top ${F.ui};
  padding: ${(ze-mn)/2}px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${H.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${H.tag}px; font-weight: ${J.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${x.primary};
  background: ${xe};
  box-shadow: ${Be};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
/* No negative tracking: it is 11px, and tightening is what large text wants.
   Small text reads better at zero or a hair positive. */
.flag .name { letter-spacing: 0; }
/* The rulers draw a gutter along the top edge, and the badge sits in it. Step
   down out of the way rather than covering the ticks the rulers exist to show. */
.flag[data-rulers] { top: ${Me+te}px; }
.help[data-rulers] { top: ${Me+te+xt+wt}px; }
.flag:hover { background: ${_(1)}; }
.flag .count { color: ${x.secondary}; }

/* A layers bar, not a palette. Switches, then the one control that changes the
   page, then the things that happen once. */
.tools { display: flex; align-items: center; gap: 2px; }
.sep {
  width: 1px; align-self: stretch; margin: 0 4px;
  background: ${ue};
}
.tool {
  width: ${mn}px; height: ${mn}px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; cursor: pointer;
  font: inherit; font-size: ${H.tag}px; font-weight: ${J.medium};
  color: ${x.tertiary};
}
/* Both glyphs occupy the same cell so one can cross-fade into the other; a
   swap would jump, and the point is to be noticed without being a movement. */
.tool > svg { grid-area: 1 / 1; transition: opacity ${F.ui}; }
.tool > .ack { opacity: 0; }
.tool[data-ack] > .ack { opacity: 1; }
.tool[data-ack] > .glyph { opacity: 0; }
.tool:hover { background: ${_(2)}; color: ${x.primary}; }
/* On the press, not on the release. Waiting for the click to acknowledge a
   button is the difference between a control that answers and one that lags,
   and it costs one rule. */
.tool:active { background: ${_(4)}; color: ${x.primary}; }
.tool:focus-visible { outline: 1px solid ${x.primary}; outline-offset: -1px; }
/* On is the film, not a colour: the three hues each already mean something on
   the canvas, and a fourth here would say nothing. */
.tool[data-on] { background: ${_(4)}; color: ${x.primary}; }
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
  color: ${xe};
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
  position: fixed; top: ${Me+xt+wt}px; right: ${Me}px;
  /* 368 plus two insets is 400, so this was the first thing to hang off the
     left edge of a phone-width window. */
  /* The padding is in the subtraction because these boxes are content-box:
     without it the clamp lets the panel sit flush against the far edge with
     no inset at all, which reads as broken rather than as tight. */
  width: min(368px, calc(100vw - ${Me*2+B.base*2}px));
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${Me*2+xt+wt}px); overflow-y: auto;
  padding: ${B.base}px; border-radius: 0;
  user-select: none;
  font-family: ${H.stack};
  font-synthesis: none;
  font-size: ${H.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${x.primary};
  background: ${xe};
  box-shadow: ${Be};
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
  transition: opacity ${F.ui}, transform ${F.ui}, visibility 0s linear 160ms;
}
.help[data-open] {
  opacity: 1; visibility: visible; pointer-events: auto;
  transform: none;
  transition: opacity ${F.ui}, transform ${F.ui}, visibility 0s;
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
  font-size: ${H.tag}px; font-weight: ${J.semibold};
  color: ${x.tertiary};
}
.help h4:first-child { margin-top: 0; }
.help kbd {
  display: inline-block; padding: 3px 5px;
  font: inherit; font-weight: ${J.medium};
  border: 1px solid ${ue};
  background: ${_(2)};
}
/* These run to three lines, and a one-word last line reads as a mistake. */
.help dd { margin: 0; color: ${x.secondary}; text-wrap: pretty; }
`,fn=[{name:"rulers",label:"Rulers",key:"R",toggle:!0,what:"a scale down the top and left edges, in page pixels \u2014 and the gutters you drag guides out of"},{name:"xray",label:"X-ray",key:"X",toggle:!0,what:"outline every element at once, to see the boxes a layout is really made of"},{name:"grid",label:"Column grid",key:"G",toggle:!0,what:"the grid your design is built on, columns filled and gutters left empty. Needs one configured"},{name:"pixels",label:"Pixel grid",key:"K",toggle:!0,what:"a ten-pixel lattice over the page, to read an offset off without measuring it"},{name:"type",label:"Type",key:"T",toggle:!0,what:"add size, weight, line height and tracking to the panel, each checked against your scale"},{name:"panel",label:"Box model",key:"B",toggle:!0,what:"the readout itself \u2014 margins, borders, padding, what places the element, what styles it"},{name:"hide",label:"Hide",key:"\\",toggle:!0,what:"everything drawn, out of the way for a moment. Your locks, guides and layers all survive it"},{name:"freeze",label:"Freeze",key:"F",toggle:!0,what:"hold every animation and transition where it stands, so a moving thing can be measured"},{name:"copy",label:"Copy",key:"C",toggle:!1,what:"put everything in the panel on the clipboard as text"},{name:"pick",label:"Colour",key:"P",toggle:!1,what:"sample a colour from anywhere on screen and match it against your palette"},{name:"edit",label:"Edit",key:"E",toggle:!0,what:"let the panel change the page. Off until you say so, shown while it is on, and everything goes back when you turn it off"},{name:"undo",label:"Undo",key:"Ctrl/Cmd + Z",toggle:!1,what:"step back through the guides \u2014 a whole run of nudges counts as one"}];function vo(e,t){let o=document.createElement("style");o.textContent=Yr,e.appendChild(o);let n=document.createElement("div");n.className="flag";let r=document.createElement("span");r.className="name",r.textContent="Align";let i=document.createElement("span");i.className="count";let a=new Map,s=new Map,c=document.createElement("div");c.className="tools";for(let y of fn){if(y.name==="freeze"||y.name==="copy"){let W=document.createElement("span");W.className="sep",c.appendChild(W)}let $=document.createElement("button");$.type="button",$.className="tool",$.dataset.tool=y.name;let E=ve(y.name);E.classList.add("glyph"),$.appendChild(E),$.setAttribute("aria-label",y.label),$.title=`${y.label}  \xB7  ${y.key}
${y.what}`,y.toggle||$.setAttribute("data-once",""),$.addEventListener("click",W=>{W.stopPropagation(),t(y.name)}),a.set(y.name,$),c.appendChild($)}n.append(r,c,i);let k=document.createElement("div");k.className="help";let w=document.createElement("dl");function M(y){let $=document.createElement("h4");$.textContent=y,w.appendChild($)}function d(y,$,E){let W=document.createElement("span");W.className="glyph",E&&W.appendChild(ve(E,14));let u=document.createElement("dt"),g=document.createElement("kbd");g.textContent=y,u.appendChild(g);let X=document.createElement("dd");X.textContent=$,w.append(W,u,X)}M("The bar, left to right");for(let y of fn)d(y.key,`${y.label} \u2014 ${y.what}`,y.name);for(let y of Xr){M(y.title);for(let[$,E]of y.rows)d($,E)}return k.appendChild(w),n.addEventListener("click",y=>{y.stopPropagation(),k.toggleAttribute("data-open")}),e.append(n,k),{acknowledge(y,$){let E=a.get(y);if(!E)return;clearTimeout(s.get(y)),E.querySelector(".ack")?.remove();let W=ve($?"check":"cross");W.classList.add("ack"),E.appendChild(W),requestAnimationFrame(()=>E.setAttribute("data-ack",$?"yes":"no")),s.set(y,setTimeout(()=>{E.removeAttribute("data-ack"),setTimeout(()=>E.querySelector(".ack")?.remove(),200)},Kr))},update(y,$){i.textContent=y>0?`${y} locked`:"";let E=$.rulers&&!$.hide;n.toggleAttribute("data-rulers",E),k.toggleAttribute("data-rulers",E);for(let g of fn)g.toggle&&a.get(g.name)?.toggleAttribute("data-on",$[g.name]===!0);let W=a.get("copy");W&&(W.disabled=!$.canCopy);let u=a.get("undo");u&&(u.disabled=!$.canUndo)},closeHelp(){let y=k.hasAttribute("data-open");return k.removeAttribute("data-open"),y},destroy(){for(let y of s.values())clearTimeout(y);n.remove(),k.remove(),o.remove()}}}var jr=2,Ur=3;function Vr(e,t,o,n,r=1){let i=e+t/jr,a=r>0?Math.round(i/r)*r:i;return Math.max(o,Math.min(n,Number(a.toPrecision(12))))}function qr(e,t,o){let n=/^\s*(-?\d*\.?\d+)\s*(px|rem|em|%)?\s*$/i.exec(e);if(!n)return null;let r=parseFloat(n[1]);return Number.isFinite(r)?Math.max(t,Math.min(o,r)):null}function ko(e){return String(Math.round(e*100)/100)}var Zr=`
.scrub {
  display: flex; align-items: center; gap: 6px;
  min-width: 0;
  height: 28px;
  padding: 0 8px;
  border: 0; border-radius: 0;
  background: ${_(1)};
  color: ${x.primary};
  font: inherit;
  font-size: ${H.body}px; font-weight: ${J.regular};
  font-variant-numeric: tabular-nums;
  line-height: 1;
  text-align: left;
  user-select: none;
  touch-action: none;
  transition: background ${F.ui};
}
.scrub[data-axis='x'] { cursor: ew-resize; }
.scrub[data-axis='y'] { cursor: ns-resize; }
.scrub:hover { background: ${_(3)}; }
.scrub[data-scrubbing] { background: ${_(5)}; }
.scrub:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }

/* The glyph is the label, so it must not shrink when the number grows. */
.scrub-glyph { flex: none; display: grid; place-items: center; color: ${x.tertiary}; }
.scrub-text {
  flex: none;
  color: ${x.tertiary};
  font-size: ${H.tag}px;
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
  font-size: ${H.body}px;
  font-variant-numeric: tabular-nums;
  text-align: right;
}
.scrub-input:focus { box-shadow: inset 0 -1px ${ue}; }
`,$o="align-scrub";function Jr(e){if(e.querySelector(`#${$o}`))return;let t=document.createElement("style");t.id=$o,t.textContent=Zr,e.appendChild(t)}function Eo(e,t){Jr(e);let o=t.min??0,n=t.max??9999,r=t.step??1,i=t.axis??"x",a=t.value,s=document.createElement("button");if(s.type="button",s.className="scrub",s.dataset.axis=i,s.setAttribute("aria-label",t.label),s.title=`${t.label}. Drag to change, click to type.`,t.glyph){let u=document.createElement("span");u.className="scrub-glyph",u.appendChild(ve(t.glyph,14)),s.appendChild(u)}else if(t.text){let u=document.createElement("span");u.className="scrub-text",u.textContent=t.text,s.appendChild(u)}let c=document.createElement("span");c.className="scrub-value",s.appendChild(c);function k(){c.textContent=ko(a),s.setAttribute("aria-valuenow",String(a))}function w(u,g){let X=Math.max(o,Math.min(n,u));X!==a&&(a=X,k(),t.onChange(a)),g||t.onCommit?.(a)}let M=null,d=!1,y=1;s.addEventListener("pointerdown",u=>{if(!(E||u.button!==0)){u.preventDefault(),u.stopPropagation();try{s.setPointerCapture(u.pointerId)}catch{}M={x:u.clientX,y:u.clientY,value:a},d=!1,y=(i==="x"?Ge(s).x:Ge(s).y)||1,s.setAttribute("data-scrubbing","")}}),s.addEventListener("pointermove",u=>{if(!M)return;let g=i==="x"?(u.clientX-M.x)/y:(u.clientY-M.y)/y;!d&&Math.abs(g)>Ur&&(d=!0),d&&w(Vr(M.value,g,o,n,r),!0)});let $=u=>{if(M){try{s.releasePointerCapture(u.pointerId)}catch{}M=null,s.removeAttribute("data-scrubbing"),d&&t.onCommit?.(a)}};s.addEventListener("pointerup",$),s.addEventListener("pointercancel",$);let E=null;function W(){if(E)return;E=document.createElement("input"),E.className="scrub-input",E.type="text",E.value=ko(a),E.setAttribute("aria-label",`${t.label}, as a number`),c.style.display="none",s.appendChild(E),E.focus(),E.select();let u=g=>{if(E){if(g){let X=qr(E.value,o,n);X!==null&&w(X,!1)}E.remove(),E=null,c.style.display="",s.focus()}};E.addEventListener("keydown",g=>{g.stopPropagation(),g.key==="Enter"?(g.preventDefault(),u(!0)):g.key==="Escape"&&(g.preventDefault(),u(!1))}),E.addEventListener("blur",()=>u(!0)),E.addEventListener("pointerdown",g=>g.stopPropagation())}return s.addEventListener("click",u=>{if(u.stopPropagation(),d){d=!1;return}W()}),s.addEventListener("keydown",u=>{if(u.target!==s||u.altKey||u.metaKey||u.ctrlKey)return;let g=u.shiftKey?10:1;u.key==="ArrowUp"||u.key==="ArrowRight"?(u.preventDefault(),u.stopPropagation(),w(a+r*g,!1)):u.key==="ArrowDown"||u.key==="ArrowLeft"?(u.preventDefault(),u.stopPropagation(),w(a-r*g,!1)):u.key==="Enter"&&(u.preventDefault(),u.stopPropagation(),W())}),k(),{el:s,set(u){a=Math.max(o,Math.min(n,u)),k()},destroy(){E?.remove(),s.remove()}}}function So(e,t=0,o=0){return Math.min(100,Math.max(...[e,t,o].map(n=>{let[r,i="0"]=String(n).toLowerCase().split("e");return Math.max(0,(r.split(".")[1]?.length??0)-Number(i))})))}function gn(e,t,o,n){let r=o??-1/0,i=n??1/0,a=Math.max(r,Math.min(i,e));if(a===r||a===i||!Number.isFinite(t)||t<=0)return a;let s=o??0,c=s+Math.round((a-s)/t)*t;return Math.max(r,Math.min(i,Number(c.toPrecision(14))))}var Qr=.03125;function ei(e,t,o){let n=(e-t)/(o-t),r=Math.round(n*10)/10;return Math.abs(n-r)<=Qr?t+r*(o-t):e}var ti=32,ni=8,oi=200;function Co(e,t){let o=Math.max(0,e-ti);return t*ni*Math.sqrt(Math.min(o/oi,1))}function Gt(e,t,o){return o===t?0:(e-t)/(o-t)*100}function To(e,t,o){let n=Math.max(0,Math.min(1,e));return t+n*(o-t)}function ri(e,t,o,n,r,i=!1){if(e==="Home")return o;if(e==="End")return n;let a=["ArrowRight","ArrowUp","PageUp"].includes(e)?1:["ArrowLeft","ArrowDown","PageDown"].includes(e)?-1:0;if(!a)return;if(!(r>0)||n<=o)return o;let s=e.startsWith("Page")||i?10:1,c=(t-o)/r,k=o+(a>0?Math.floor(c+1e-9)+s:Math.ceil(c-1e-9)-s)*r;return Math.max(o,Math.min(n,Number(k.toPrecision(14))))}function ii(e,t,o){let n=(t-e)/o;return n<=10&&Number.isFinite(n)&&n>1?Array.from({length:Math.round(n)-1},(r,i)=>(i+1)*o/(t-e)*100):Array.from({length:9},(r,i)=>(i+1)*10)}function Mo(e,t,o=0,n=0){let r=So(t,o,n),i=Math.max(r,Math.min(4,So(e)));return!Number.isFinite(t)||t<=0?i:gn(e,t,o,n)===e?r:i}function ai(e,t,o,n){return(o-t)/n<=10?Math.max(t,Math.min(o,t+Math.round((e-t)/n)*n)):ei(e,t,o)}var yn={stiffness:300,damping:25,mass:.8},si={stiffness:220,damping:22,mass:1};function Ot(e,t,o,n,r){let i=(-r.stiffness*(e-o)-r.damping*t)/r.mass,a=t+i*n;return{x:e+a*n,v:a}}function zt(e,t,o,n=.01){return Math.abs(e-o)<n&&Math.abs(t)<n}var li=0,ci=.5,di=.9,ui=.1,pi=3,hi=800,Ao=8,Bt=3,mi=20,No=10,bn=12,fi=`
.sl {
  position: relative;
  height: ${ze}px;
  overflow: hidden;
  background: ${_(1)};
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
  background: ${_(3)};
  transition: background ${F.ui};
  pointer-events: none;
}
.sl[data-awake] .sl-fill { background: ${_(5)}; }

.sl-marks { position: absolute; inset: 0; pointer-events: none; }
.sl-mark {
  position: absolute; top: 50%;
  width: 1px; height: 8px;
  transform: translate(-50%, -50%);
  background: transparent;
  transition: background ${F.ui};
}
.sl[data-awake] .sl-mark { background: ${ue}; }

.sl-handle {
  position: absolute; top: 50%; left: 0;
  width: ${Bt}px; height: ${mi}px;
  background: ${x.primary};
  pointer-events: none;
  opacity: ${li};
  /* Two transitions, two jobs: opacity and the squash are eased, the position
     is not \u2014 it is written every frame and must not lag the pointer. */
  transition: opacity ${F.ui}, scale ${F.ui};
  scale: 0.25 1;
}
.sl[data-awake] .sl-handle { opacity: ${ci}; scale: 1 1; }
.sl[data-dragging] .sl-handle { opacity: ${di}; }
.sl[data-dodge] .sl-handle { opacity: ${ui}; scale: 1 0.75; }

.sl-label, .sl-value {
  position: absolute; top: 50%;
  transform: translateY(-50%);
  font-size: ${H.body}px; font-weight: ${J.medium};
  line-height: 1;
  white-space: nowrap;
  transition: color ${F.ui};
}
.sl-label { left: ${No}px; color: ${x.secondary}; pointer-events: none; }
.sl-value {
  right: ${bn}px;
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
  position: absolute; right: ${bn}px; top: 50%;
  transform: translateY(-50%);
  width: 5ch;
  padding: 0 0 1px; border: 0;
  border-bottom: 1px solid ${x.secondary};
  background: none; outline: none;
  text-align: right;
  font: inherit;
  font-size: ${H.body}px; font-weight: ${J.medium};
  font-variant-numeric: tabular-nums;
  color: ${x.primary};
}
`,Lo="align-slider";function gi(e){if(e.querySelector(`#${Lo}`))return;let t=document.createElement("style");t.id=Lo,t.textContent=fi,e.appendChild(t)}function Ft(e,t){gi(e);let o=t.min??0,n=t.max??1,r=t.step??.01,i=t.value,a=document.createElement("div");a.className="sl",a.tabIndex=0,a.setAttribute("role","slider"),a.setAttribute("aria-label",t.label),a.setAttribute("aria-valuemin",String(o)),a.setAttribute("aria-valuemax",String(n));let s=document.createElement("div");s.className="sl-fill";let c=document.createElement("div");c.className="sl-marks";for(let h of ii(o,n,r)){let T=document.createElement("div");T.className="sl-mark",T.style.left=`${h}%`,c.appendChild(T)}let k=document.createElement("div");k.className="sl-handle";let w=document.createElement("span");w.className="sl-label",w.textContent=t.label;let M=document.createElement("span");M.className="sl-value",a.append(c,s,k,w,M);let d=Gt(i,o,n),y=0,$=null,E=0,W=0;function u(){return a.offsetWidth}function g(){s.style.transform=`scaleX(${d/100})`;let h=u(),T=d/100*h,Y=Math.max(Bt,Math.min(h-Bt,T))-Bt/2;k.style.transform=`translate(${Y}px, -50%)`;let pe=!1;if(h>0){let me=No+w.offsetWidth+Ao,fe=h-bn-M.offsetWidth-Ao;pe=T<me||T>fe}a.toggleAttribute("data-dodge",pe)}function X(){let h=Mo(i,r,o,n);M.textContent=t.unit?`${i.toFixed(h)}${t.unit}`:i.toFixed(h),a.setAttribute("aria-valuenow",String(i)),a.setAttribute("aria-valuetext",M.textContent)}function K(){E&&cancelAnimationFrame(E),E=0,$=null,y=0}function q(){return typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches}function ae(h,T=yn){if(q()){K(),d=h,g();return}if($=h,W=performance.now(),E)return;let Y=pe=>{let me=Math.min((pe-W)/1e3,.03333333333333333);if(W=pe,$===null){E=0;return}let fe=Ot(d,y,$,me,T);if(d=fe.x,y=fe.v,g(),zt(d,y,$)){d=$,y=0,$=null,E=0,g();return}E=requestAnimationFrame(Y)};E=requestAnimationFrame(Y)}function re(h,T){let Y=gn(h,r,o,n),pe=Y!==i;i=Y,X(),T?ae(Gt(i,o,n)):(K(),d=Gt(i,o,n),g()),pe&&t.onChange(i)}let ee=null,Z=!0,b=null,O=1,oe=0,N=0;function j(h){if(oe=h,h===0){a.style.width="",a.style.transform="";return}a.style.width=`calc(100% + ${Math.abs(h)}px)`,a.style.transform=h<0?`translateX(${h}px)`:""}function A(){if(oe===0)return;if(q()){j(0),a.style.width="",a.style.transform="";return}let h=0,T=performance.now(),Y=pe=>{let me=Math.min((pe-T)/1e3,.03333333333333333);T=pe;let fe=Ot(oe,h,0,me,si);if(h=fe.v,j(fe.x),zt(fe.x,h,0,.05)){j(0),a.style.width="",a.style.transform="",N=0;return}N=requestAnimationFrame(Y)};N=requestAnimationFrame(Y)}function U(h){if(!b)return 0;let T=u();return T<=0?0:(h-b.left)/O/T}let l=h=>{if(!(f||h.button!==0)){h.preventDefault();try{a.setPointerCapture(h.pointerId)}catch{}ee={x:h.clientX,y:h.clientY},Z=!0,b=a.getBoundingClientRect(),O=Ge(a).x||1,a.setAttribute("data-awake","")}},C=h=>{if(!ee)return;let T=h.clientX-ee.x,Y=h.clientY-ee.y;Z&&Math.hypot(T,Y)>pi&&(Z=!1,a.setAttribute("data-dragging","")),!(Z||!b)&&(q()||(h.clientX<b.left?j(Co(b.left-h.clientX,-1)):h.clientX>b.right?j(Co(h.clientX-b.right,1)):oe!==0&&j(0)),K(),re(To(U(h.clientX),o,n),!1))},v=h=>{ee&&(Z&&re(ai(To(U(h.clientX),o,n),o,n,r),!0),t.onCommit?.(i),A(),ee=null,a.removeAttribute("data-dragging"),I||a.removeAttribute("data-awake"))},D=()=>{ee&&(j(0),a.style.width="",a.style.transform="",ee=null,a.removeAttribute("data-dragging"),I||a.removeAttribute("data-awake"))},I=!1,G=()=>{I=!0,a.setAttribute("data-awake","")},p=()=>{I=!1,ee||a.removeAttribute("data-awake")},f=null,S=!1,R=0;function L(){if(f)return;f=document.createElement("input"),f.className="sl-input",f.type="text",f.setAttribute("aria-label",`${t.label} value`),f.value=i.toFixed(Mo(i,r,o,n)),M.style.display="none",a.appendChild(f),f.focus(),f.select();let h=T=>{if(f){if(T){let Y=parseFloat(f.value);Number.isFinite(Y)&&(re(Math.max(o,Math.min(n,Y)),!0),t.onCommit?.(i))}f.remove(),f=null,M.style.display="",z(!1),a.focus()}};f.addEventListener("keydown",T=>{T.stopPropagation(),T.key==="Enter"?(T.preventDefault(),h(!0)):T.key==="Escape"&&(T.preventDefault(),h(!1))}),f.addEventListener("blur",()=>h(!0)),f.addEventListener("pointerdown",T=>T.stopPropagation())}function z(h){S=h,M.toggleAttribute("data-editable",h)}M.addEventListener("pointerenter",()=>{f||ee||(R=window.setTimeout(()=>z(!0),hi))}),M.addEventListener("pointerleave",()=>{clearTimeout(R),f||z(!1)}),M.addEventListener("pointerdown",h=>{S&&(h.stopPropagation(),h.preventDefault(),L())});let P=h=>{if(h.target!==a||h.altKey||h.metaKey||h.ctrlKey)return;let T=ri(h.key,i,o,n,r,h.shiftKey);if(T===void 0){if(h.key!=="Enter")return;h.preventDefault(),h.stopPropagation(),z(!0),L();return}h.preventDefault(),h.stopPropagation(),re(T,!1),t.onCommit?.(i)};return a.addEventListener("pointerdown",l),a.addEventListener("pointermove",C),a.addEventListener("pointerup",v),a.addEventListener("pointercancel",D),a.addEventListener("lostpointercapture",D),a.addEventListener("pointerenter",G),a.addEventListener("pointerleave",p),a.addEventListener("keydown",P),X(),requestAnimationFrame(g),{el:a,set(h){i=gn(h,r,o,n),X(),K(),d=Gt(i,o,n),g()},destroy(){K(),N&&cancelAnimationFrame(N),clearTimeout(R),a.remove()}}}function Ce(e,t){return getComputedStyle(e).getPropertyValue(t).trim()}function bi(e,t){let o=parseFloat(e);if(e.endsWith("px")&&Number.isFinite(o)){let r=nn(o,t)[0];if(r)return r}return ft(e)?Nt(e,t)[0]??null:null}function yi(e){if(e.length===0)return"";let t=new Map;for(let n of e){let r=t.get(n.selector)??[];r.push(n),t.set(n.selector,r)}let o=["These changes were made live in the browser and are not in the source yet.","Apply them, preferring the named token wherever one is given.",""];for(let[n,r]of t){o.push(`${n} {`);for(let i of r){let a=i.token?`var(${i.token})`:i.to,s=i.token?`  /* ${i.to}, was ${i.from} */`:`  /* was ${i.from} */`;o.push(`  ${i.prop}: ${a};${s}`)}o.push("}","")}return o.join(`
`).trimEnd()}function Ro(){let e=new Map,t=!1;function o(r){let i=e.get(r);if(i)return i;let a=new Map;return e.set(r,a),a}function n(r,i,a){let s=r.style;a.inline?s.setProperty(i,a.inline):s.removeProperty(i)}return{get armed(){return t},arm(){t=!0},disarm(){let r=this.revertAll();return t=!1,r},set(r,i,a){if(!t)return;let s=o(r);s.has(i)||s.set(i,{inline:r.style.getPropertyValue(i),computed:Ce(r,i)}),r.style.setProperty(i,a)},revert(r,i){let a=e.get(r),s=a?.get(i);!a||!s||(n(r,i,s),a.delete(i),a.size===0&&e.delete(r))},revertAll(){let r=0;for(let[i,a]of e)for(let[s,c]of a)n(i,s,c),r+=1;return e.clear(),r},touched(r,i){return e.get(r)?.has(i)??!1},touchedProps(r){return[...e.get(r)?.keys()??[]].sort()},changes(){let r=[];for(let[i,a]of e)for(let[s,c]of a)r.push({el:i,prop:s,from:c.computed,to:Ce(i,s)});return r},asPrompt(){let r=[];for(let[i,a]of e){let s=Lt(i),c=gt(i);for(let[k,w]of a){let M=Ce(i,k);M!==w.computed&&r.push({selector:c,prop:k,from:w.computed,to:M,token:bi(M,s)})}}return yi(r)}}}var ce=(e,t=0,o=1)=>Math.max(t,Math.min(o,e)),xn=e=>(e%360+360)%360,Wt=(e,t)=>e.map(o=>o.reduce((n,r,i)=>n+r*t[i],0)),xi=e=>Math.abs(e)<=.04045?e/12.92:Math.sign(e)*((Math.abs(e)+.055)/1.055)**2.4,wi=e=>Math.abs(e)<=.0031308?12.92*e:Math.sign(e)*(1.055*Math.abs(e)**.4166666666666667-.055),vi=[[.4123907993,.3575843394,.1804807884],[.2126390059,.7151686788,.0721923154],[.0193308187,.1191947798,.9505321522]],ki=[[.4865709486,.2656676932,.1982172852],[.2289745641,.6917385218,.0792869141],[0,.0451133819,1.0439443689]],$i=[[3.2409699419,-1.5373831776,-.4986107603],[-.9692436363,1.8759675015,.0415550574],[.0556300797,-.2039769589,1.0569715142]],Ei=[[2.4934969119,-.9313836179,-.4027107845],[-.8294889696,1.7626640603,.0236246858],[.0358458302,-.0761723893,.956884524]],Si=[[.819022438,.3619062601,-.1288737815],[.0329836539,.9292868616,.0361446664],[.0481771894,.2642395318,.6335478285]],Ci=[[1.2268798734,-.5578149966,.2813910502],[-.0405757626,1.1122868294,-.0717110667],[-.0763729497,-.421493324,1.5869240244]];function kt(e,t=1,o="srgb"){let n=Wt(o==="p3"?ki:vi,e.map(xi)),[r,i,a]=Wt(Si,n).map(Math.cbrt),s=.2104542553*r+.793617785*i-.0040720468*a,c=1.9779984951*r-2.428592205*i+.4505937099*a,k=.0259040371*r+.7827717662*i-.808675766*a,w=Math.hypot(c,k);return{l:ce(s),c:w<1e-7?0:w,h:w<1e-7?0:xn(Math.atan2(k,c)*180/Math.PI),a:ce(t)}}function $t(e,t="srgb"){let o=e.c*Math.cos(e.h*Math.PI/180),n=e.c*Math.sin(e.h*Math.PI/180),r=[(e.l+.3963377774*o+.2158037573*n)**3,(e.l-.1055613458*o-.0638541728*n)**3,(e.l-.0894841775*o-1.291485548*n)**3];return Wt(t==="p3"?Ei:$i,Wt(Ci,r)).map(wi)}function Po(e,t="srgb"){return $t(e,t).every(o=>o>=-1e-5&&o<=1.00001)}function _t(e,t="srgb"){if(Po(e,t))return e;let o=0,n=e.c;for(let r=0;r<20;r++){let i=(o+n)/2;Po({...e,c:i},t)?o=i:n=i}return{...e,c:o}}function Ue(e,t,o="srgb"){return e<=0||e>=1?0:_t({l:e,c:.5,h:t,a:1},o).c}function rt(e){let t=e.trim();return/^oklch\(/i.test(t)?"oklch":/^color\(display-p3\s/i.test(t)?"p3":"hex"}var vt=(e,t=4)=>Number(e.toFixed(t));function Ve(e,t){let o=e.a<1?` / ${vt(e.a)}`:"";if(t==="oklch")return`oklch(${vt(e.l)} ${vt(e.c)} ${vt(e.h,2)}${o})`;let n=t==="p3"?"p3":"srgb",r=$t(_t(e,n),n);if(t==="p3")return`color(display-p3 ${r.map(a=>vt(ce(a),5)).join(" ")}${o})`;let i=r.map(a=>Math.round(ce(a)*255));return e.a<1&&i.push(Math.round(e.a*255)),"#"+i.map(a=>a.toString(16).padStart(2,"0")).join("")}var Ti=/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?(%|deg|grad|rad|turn)?$/i;function Fe(e,t=1,o=!1){let n=e.match(Ti);if(!n)return null;let r=parseFloat(e);if(!Number.isFinite(r))return null;let i=n[1]?.toLowerCase();return o?i==="rad"?r*180/Math.PI:i==="turn"?r*360:i==="grad"?r*.9:!i||i==="deg"?r:null:i==="%"?r*t/100:i?null:r}function We(e){let t=e.trim().toLowerCase();if(t==="transparent")return{l:0,c:0,h:0,a:0};if(/^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/.test(t)){let d=t.slice(1);d.length<=4&&(d=[...d].map($=>$+$).join(""));let y=d.match(/../g).map($=>parseInt($,16)/255);return kt(y.slice(0,3),y[3]??1)}let o=t.match(/^(oklch|rgb|rgba|hsl|hsla|color)\(([^()]*)\)$/);if(!o)return null;let n=o[1],r=o[2].trim(),i=n==="color";if(i){if(!r.startsWith("display-p3 "))return null;r=r.slice(11).trim()}let a=r.includes(",");if(a&&(i||n==="oklch"||r.includes("/")))return null;let s=a?r.split(",").map(d=>d.trim()):r.split(/\s*\/\s*/);if(!a&&s.length>2)return null;let c=a?s.slice(0,3):s[0].split(/\s+/);if(c.length!==3||a&&s.length!==3&&s.length!==4||a&&n.startsWith("rgb")&&c.some(d=>d.endsWith("%"))&&!c.every(d=>d.endsWith("%")))return null;let k=a?s[3]:s[1],w=k===void 0?1:Fe(k);if(w===null)return null;if(n==="oklch"){let d=Fe(c[0]),y=Fe(c[1],.4),$=Fe(c[2],1,!0);return d===null||y===null||$===null?null:{l:ce(d),c:Math.max(0,y),h:xn($),a:ce(w)}}if(n.startsWith("hsl")){let d=Fe(c[0],1,!0),y=Fe(c[1]),$=Fe(c[2]);if(d===null||y===null||$===null||!c[1].endsWith("%")||!c[2].endsWith("%"))return null;let E=ce(y),W=ce($),u=E*Math.min(W,1-W),g=X=>{let K=(X+xn(d)/30)%12;return W-u*Math.max(-1,Math.min(K-3,9-K,1))};return kt([g(0),g(8),g(4)],w)}let M=c.map(d=>Fe(d,i?1:255));return M.some(d=>d===null)?null:kt(M.map(d=>i?d:ce(d/255)),w,i?"p3":"srgb")}function it(e,t=!1){return Ve(t?{...e,a:1}:e,"oklch")}var Io=148,Mi=14,Xt=12,Ho=`
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
  background: ${xe};
  /*
   * A shadow, not a border. This is the one thing on the panel that is
   * genuinely floating above another surface, and elevation is what a shadow
   * is for; an outline here would read as a box drawn around a box.
   */
  box-shadow: ${Dt};
  /*
   * Typography too, for the same reason: it is not inside the dock, so it
   * inherits from a host pinned by all: initial, and comes out in the
   * browser's default serif at the browser's default size.
   */
  font-family: ${H.stack};
  font-synthesis: none;
  font-size: ${H.body}px;
  font-weight: ${J.regular};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${x.primary};
  transition: opacity ${F.ui}, translate ${F.ui};
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
  height: ${Mi}px;
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
  width: ${Xt}px; height: ${Xt}px;
  margin-top: -${Xt/2}px; margin-left: -${Xt/2}px;
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
  background: ${_(3)}; color: ${x.secondary};
  font: inherit; font-size: ${H.tag}px; font-weight: ${J.medium};
  cursor: pointer;
  transition: background ${F.ui}, color ${F.ui};
}
.pick-fmt:hover { background: ${_(4)}; color: ${x.primary}; }
.pick-fmt[data-on] { background: ${x.primary}; color: ${xe}; }
.pick-fmt:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }

.pick-css {
  flex: 1; min-width: 0;
  height: 24px; padding: 0 ${B.base/2}px;
  border: 0; border-radius: 0;
  background: ${_(2)}; color: ${x.primary};
  font: inherit; font-size: ${H.tag}px;
  font-variant-numeric: tabular-nums;
}
.pick-css[aria-invalid] { color: ${x.primary}; background: ${_(4)}; }
.pick-css:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }

.pick-dropper {
  flex: none;
  display: grid; place-items: center;
  width: 24px; height: 24px;
  padding: 0; border: 0; border-radius: 0;
  background: ${_(2)}; color: ${x.secondary};
  cursor: pointer;
  transition: background ${F.ui}, color ${F.ui};
}
.pick-dropper:hover { background: ${_(4)}; color: ${x.primary}; }
.pick-dropper:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }

/* Out of gamut in the chosen output space. */
.pick-warn {
  display: none;
  align-items: center; gap: ${B.tight}px;
  color: ${x.secondary}; font-size: ${H.tag}px;
}
.pick[data-clipped] .pick-warn { display: flex; }

@media (prefers-reduced-motion: reduce) {
  .pick { transition: none; }
}
`,Ai="conic-gradient("+ue+" 0 25%, transparent 0 50%, "+ue+" 0 75%, transparent 0)";function Ee(e,t){let o=document.createElement(e);return o.className=t,o instanceof HTMLButtonElement&&(o.type="button"),o}function wn(e,t){let o=We(t.value)??{l:.5,c:0,h:0,a:1},n=rt(t.value),r=0,i="",a=Ee("div","pick");a.setAttribute("role","dialog"),a.setAttribute("aria-label","Colour picker"),a.style.setProperty("--checker",Ai);let s=Ee("div","pick-plane");s.tabIndex=0,s.setAttribute("role","application"),s.setAttribute("aria-label","Colour field. Arrow keys adjust lightness and saturation.");let c=Ee("canvas","pick-canvas");c.setAttribute("aria-hidden","true");let k=Ee("span","pick-marker");s.append(c,k);let w=j("pick-hue","Hue"),M=j("pick-alpha","Opacity"),d=Ee("div","pick-row"),y=Ee("div","pick-seg");y.setAttribute("role","radiogroup"),y.setAttribute("aria-label","Colour format");let $=["hex","oklch","p3"],E={hex:"Hex",oklch:"OKLCH",p3:"P3"},W=$.map(p=>{let f=Ee("button","pick-fmt");return f.textContent=E[p],f.setAttribute("role","radio"),f.addEventListener("click",()=>A(o,p)),y.append(f),f});d.append(y);let u=Ee("div","pick-row"),g=Ee("input","pick-css");if(g.type="text",g.spellcheck=!1,g.setAttribute("aria-label","CSS colour"),u.append(g),"EyeDropper"in window){let p=Ee("button","pick-dropper");p.setAttribute("aria-label","Pick a colour from the screen"),p.append(ve("pick",14)),p.addEventListener("click",async()=>{try{let f=window.EyeDropper,S=await new f().open(),R=We(S.sRGBHex);R&&A({...R,a:o.a})}catch{}}),u.append(p)}let K=Ee("div","pick-warn");K.append(ve("warning",12));let q=document.createElement("span");K.append(q),a.append(s,w.el,M.el,d,u,K),e.append(a);let ae=()=>n==="hex"?"srgb":"p3",re=c.getContext("2d",{colorSpace:"display-p3"}),ee=re?.getContextAttributes?.().colorSpace==="display-p3"?"p3":"srgb",Z="",b=0;function O(){if(!re)return;let p=`${o.h.toFixed(3)}:${ae()}:${c.width}`;if(p===Z)return;Z=p;let{width:f,height:S}=c,R=re.createImageData(f,S);for(let L=0;L<S;L++){let z=1-L/(S-1),P=Ue(z,o.h,ae());for(let h=0;h<f;h++){let T=$t({l:z,c:h/(f-1)*P,h:o.h,a:1},ee),Y=(L*f+h)*4;R.data[Y]=Math.round(ce(T[0])*255),R.data[Y+1]=Math.round(ce(T[1])*255),R.data[Y+2]=Math.round(ce(T[2])*255),R.data[Y+3]=255}}re.putImageData(R,0,0)}function oe(){let p=Math.min(devicePixelRatio||1,2),f=Math.max(1,Math.round(s.clientWidth*p)),S=Math.max(1,Math.round(Io*p));c.width===f&&c.height===S||(c.width=f,c.height=S,Z="")}function N(p){let f=s.getBoundingClientRect(),S=1-ce((p.clientY-f.top)/f.height);r=ce((p.clientX-f.left)/f.width),A({...o,l:S,c:r*Ue(S,o.h,ae())})}s.addEventListener("pointerdown",p=>{if(p.button===0){p.preventDefault(),s.focus({preventScroll:!0});try{s.setPointerCapture(p.pointerId)}catch{}N(p)}}),s.addEventListener("pointermove",p=>{s.hasPointerCapture(p.pointerId)&&N(p)}),s.addEventListener("pointerup",p=>{s.hasPointerCapture(p.pointerId)&&s.releasePointerCapture(p.pointerId)}),s.addEventListener("keydown",p=>{if(!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(p.key))return;p.preventDefault();let f=p.shiftKey?.1:.01,S=ce(o.l+(p.key==="ArrowUp"?f:p.key==="ArrowDown"?-f:0));r=ce(r+(p.key==="ArrowRight"?f:p.key==="ArrowLeft"?-f:0)),A({...o,l:S,c:r*Ue(S,o.h,ae())})});function j(p,f){let S=Ee("div",`pick-track ${p}`);S.tabIndex=0,S.setAttribute("role","slider"),S.setAttribute("aria-label",f);let R=Ee("div","pick-track-bed"),L=Ee("div","pick-thumb");S.append(R,L);let z=0,P=0,h=0,T=0,Y=0,pe=!1,me=()=>{},fe=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;function Se(){L.style.left=`${z*100}%`}function Le(){T&&cancelAnimationFrame(T),T=0,P=0}function tt(V){if(h=V,fe()){Le(),z=V,Se();return}if(Y=performance.now(),T)return;let de=mt=>{let Mt=Math.min((mt-Y)/1e3,.03333333333333333);Y=mt;let Dn=Ot(z,P,h,Mt,yn);if(z=Dn.x,P=Dn.v,Se(),zt(z,P,h,5e-4)){z=h,P=0,T=0,Se();return}T=requestAnimationFrame(de)};T=requestAnimationFrame(de)}function Tt(V){let de=S.getBoundingClientRect();return ce((V.clientX-de.left)/de.width)}S.addEventListener("pointerdown",V=>{if(V.button!==0)return;V.preventDefault(),S.focus({preventScroll:!0});try{S.setPointerCapture(V.pointerId)}catch{}let de=Tt(V);tt(de),me(de),pe=!0}),S.addEventListener("pointermove",V=>{if(!pe||!S.hasPointerCapture(V.pointerId))return;let de=Tt(V);Le(),z=de,h=de,Se(),me(de)});let $e=V=>{pe=!1,S.hasPointerCapture(V.pointerId)&&S.releasePointerCapture(V.pointerId)};return S.addEventListener("pointerup",$e),S.addEventListener("pointercancel",$e),S.addEventListener("keydown",V=>{let de=V.shiftKey?.1:.01,mt=V.key==="ArrowRight"?de:V.key==="ArrowLeft"?-de:V.key==="Home"?-1:V.key==="End"?1:0;if(!mt)return;V.preventDefault();let Mt=ce(z+mt);tt(Mt),me(Mt)}),{el:S,set(V,de){S.setAttribute("aria-valuenow",de),S.setAttribute("aria-valuetext",de),!pe&&(Le(),z=V,h=V,Se())},bind(V){me=V},gradient(V){R.style.setProperty("--track",V)},thumbColour(V){L.style.setProperty("--thumb",V)},destroy(){Le()}}}w.bind(p=>{let f=p*360;A({...o,h:f,c:r*Ue(o.l,f,ae())})}),M.bind(p=>A({...o,a:p}));function A(p,f=n){n=f,o=n==="oklch"?p:_t(p,n==="p3"?"p3":"srgb");let S=Ve(o,n);i=S,C(),t.onChange(S)}function U(p){let f=We(p.value);return f?(p.removeAttribute("aria-invalid"),p.title="",o={...f,h:f.c<1e-7?o.h:f.h},n=rt(p.value),i=p.value.trim(),C(),t.onChange(i),!0):(p.setAttribute("aria-invalid","true"),p.title="Hex, rgb(), hsl(), oklch() or color(display-p3 ...)",!1)}g.addEventListener("change",()=>U(g)),g.addEventListener("keydown",p=>{p.key==="Enter"&&(p.preventDefault(),U(g)),p.key==="Escape"&&(g.value=i,g.removeAttribute("aria-invalid")),p.stopPropagation()}),g.addEventListener("blur",()=>{g.hasAttribute("aria-invalid")&&(g.value=i,g.removeAttribute("aria-invalid"))});let l="";function C(){let p=ae(),f=Ue(o.l,o.h,p);f>0&&(r=ce(o.c/f)),k.style.left=`${r*100}%`,k.style.top=`${(1-o.l)*100}%`,k.style.background=it(o,!0),w.set(o.h/360,`${Math.round(o.h)} degrees`),M.set(o.a,`${Math.round(o.a*100)} percent`);let S=`${o.l.toFixed(4)}:${r.toFixed(4)}:${p}`;if(S!==l){l=S;let L=Array.from({length:73},(z,P)=>{let h=P*5;return Ve({l:o.l,c:r*Ue(o.l,h,p),h,a:1},"oklch")});w.gradient(`linear-gradient(to right in oklab, ${L.join(", ")})`)}w.thumbColour(it(o,!0)),M.gradient(`linear-gradient(to right in oklab, ${it({...o,a:0})}, ${it(o,!0)})`),M.thumbColour(it(o)),W.forEach((L,z)=>{let P=$[z]===n;L.toggleAttribute("data-on",P),L.setAttribute("aria-checked",String(P)),L.tabIndex=P?0:-1}),document.activeElement!==g&&e.activeElement!==g&&(g.value=Ve(o,n),g.removeAttribute("aria-invalid"));let R=n==="oklch"&&!$t(o,"srgb").every(L=>L>=-1e-5&&L<=1.00001);a.toggleAttribute("data-clipped",R),R&&(q.textContent="Outside sRGB \u2014 clipped on older displays"),cancelAnimationFrame(b),b=requestAnimationFrame(O)}function v(){let p=t.anchor.getBoundingClientRect(),f=248,S=a.offsetHeight||320,L=p.left+p.width/2<innerWidth/2?p.right+B.base:p.left-f-B.base;L=ce(L,B.base,Math.max(B.base,innerWidth-f-B.base));let z=p.top;z+S>innerHeight-B.base&&(z=innerHeight-S-B.base),z=Math.max(B.base,z),a.style.left=`${L}px`,a.style.top=`${z}px`}oe(),C(),v(),requestAnimationFrame(v);let D=()=>v();addEventListener("scroll",D,!0),addEventListener("resize",D);let I=new ResizeObserver(()=>{oe(),C()});I.observe(s);let G=!1;return{contains(p){return p?a.contains(p):!1},update(p){if(G||p===i)return;let f=We(p);f&&(o={...f,h:f.c<1e-7?o.h:f.h},n=rt(p),C())},destroy(){if(G)return;G=!0,cancelAnimationFrame(b),w.destroy(),M.destroy(),I.disconnect(),removeEventListener("scroll",D,!0),removeEventListener("resize",D),a.setAttribute("data-closing","");let p=()=>a.remove();a.addEventListener("transitionend",p,{once:!0}),setTimeout(p,260),t.onClose?.()}}}var Do={x:0,y:0,blur:0,spread:0,colour:"rgba(0, 0, 0, 0.2)",inset:!1};function Li(e,t){let o=[],n=0,r="";for(let i of e){if(i==="("?n+=1:i===")"&&(n-=1),i===t&&n===0){o.push(r.trim()),r="";continue}r+=i}return r.trim()&&o.push(r.trim()),o.filter(Boolean)}function Ni(e){let t=e.trim();if(!t||t==="none")return null;let o=t,n=/(^|\s)inset(\s|$)/.test(o);n&&(o=o.replace(/(^|\s)inset(\s|$)/," ").trim());let r=[];o=o.replace(/[a-z-]+\([^)]*\)/gi,c=>(r.push(c),`@${r.length-1}`));let i=o.split(/\s+/).filter(Boolean).map(c=>c.startsWith("@")?r[Number(c.slice(1))]:c),a=[],s=[];for(let c of i)/^-?\d*\.?\d+(px|em|rem|%)?$/.test(c)?a.push(parseFloat(c)):s.push(c);return a.length<2?null:{x:a[0]??0,y:a[1]??0,blur:a[2]??0,spread:a[3]??0,colour:s[0]??"rgba(0, 0, 0, 0.2)",inset:n}}function Go(e){return!e||e.trim()==="none"?[]:Li(e,",").map(Ni).filter(t=>t!==null)}function Ri(e){let t=`${e.x}px ${e.y}px ${e.blur}px ${e.spread}px ${e.colour}`;return e.inset?`inset ${t}`:t}function Bo(e){return e.length===0?"none":e.map(Ri).join(", ")}function vn(e,t,o){let n=[...e];if(t<0||t>=n.length||o<0||o>=n.length)return n;let[r]=n.splice(t,1);return r!==void 0&&n.splice(o,0,r),n}function kn(e){let t=/blur\(\s*(-?\d*\.?\d+)px\s*\)/i.exec(e||"");return t?parseFloat(t[1]):0}function Oo(e){return e<=0?"none":`blur(${e}px)`}function Pi(e){let t=getComputedStyle(e).display;return t.includes("flex")||t.includes("grid")}var $n=["top","right","bottom","left"],Ii=["border-top-left-radius","border-top-right-radius","border-bottom-right-radius","border-bottom-left-radius"],Hi=[{name:"Type",specs:[{prop:"font-size",label:"Size",kind:"length",glyph:"fontSize",min:8,max:96,step:1,unit:"px"},{prop:"font-weight",label:"Weight",kind:"number",glyph:"fontWeight",min:100,max:900,step:100},{prop:"line-height",label:"Line height",kind:"length",glyph:"lineHeight",min:0,max:96,step:1,unit:"px"},{prop:"letter-spacing",label:"Tracking",kind:"length",glyph:"tracking",min:-4,max:12,step:.1,unit:"px"},{prop:"font-style",label:"Style",kind:"choice",glyph:"italic",options:["normal","italic"],more:!0},{prop:"text-align",label:"Align",kind:"choice",glyph:"textAlign",options:["start","center","end","justify"],more:!0},{prop:"text-transform",label:"Case",kind:"choice",glyph:"textCase",options:["none","uppercase","lowercase","capitalize"],more:!0},{prop:"text-decoration-line",label:"Decoration",kind:"choice",glyph:"underline",options:["none","underline","line-through"],more:!0}]},{name:"Colour",specs:[{prop:"color",label:"Text",kind:"colour",glyph:"textColour"},{prop:"background-color",label:"Background",kind:"colour",glyph:"backgroundColour"},{prop:"border-color",label:"Border",kind:"colour",glyph:"borderColour",more:!0},{prop:"opacity",label:"Opacity",kind:"number",glyph:"opacity",min:0,max:1,step:.01}]},{name:"Box",specs:[{prop:"padding",label:"Padding",kind:"length",glyph:"padding",min:0,max:128,step:1,unit:"px",sides:$n.map(e=>`padding-${e}`)},{prop:"margin",label:"Margin",kind:"length",glyph:"margin",min:-64,max:128,step:1,unit:"px",sides:$n.map(e=>`margin-${e}`)},{prop:"width",label:"Width",kind:"length",glyph:"widthIcon",min:0,max:1600,step:1,unit:"px",more:!0},{prop:"height",label:"Height",kind:"length",glyph:"heightIcon",min:0,max:1200,step:1,unit:"px",more:!0},{prop:"box-sizing",label:"Sizing",kind:"choice",glyph:"boxSizing",options:["content-box","border-box"]}]},{name:"Border",specs:[{prop:"border-width",label:"Width",kind:"length",glyph:"borderWidth",min:0,max:24,step:1,unit:"px",sides:$n.map(e=>`border-${e}-width`)},{prop:"border-style",label:"Style",kind:"choice",glyph:"borderStyle",options:["none","solid","dashed","dotted"]},{prop:"border-radius",label:"Radius",kind:"length",glyph:"borderRadius",min:0,max:64,step:1,unit:"px",sides:Ii}]},{name:"Effects",specs:[{prop:"box-shadow",label:"Shadow",kind:"shadow",glyph:"shadow"},{prop:"backdrop-filter",label:"Backdrop blur",kind:"blur",glyph:"backdrop",min:0,max:40,step:1,unit:"px",more:!0}]},{name:"Layout",when:Pi,specs:[{prop:"display",label:"Display",kind:"choice",glyph:"boxSizing",options:["block","flex","grid","inline-flex","inline-block","none"]},{prop:"flex-direction",label:"Direction",kind:"choice",glyph:"flexDirection",options:["row","column","row-reverse","column-reverse"],more:!0},{prop:"justify-content",label:"Justify",kind:"choice",glyph:"justify",options:["flex-start","center","flex-end","space-between"],more:!0},{prop:"align-items",label:"Align",kind:"choice",glyph:"alignItems",options:["stretch","flex-start","center","flex-end"],more:!0},{prop:"flex-wrap",label:"Wrap",kind:"choice",glyph:"flexWrap",options:["nowrap","wrap"],more:!0},{prop:"gap",label:"Gap",kind:"length",glyph:"gap",min:0,max:96,step:1,unit:"px"}]}];function Kt(e){let t=parseFloat(e);return Number.isFinite(t)?t:0}var Di=320,Gi=Ho+`
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
  width: ${Di}px;
  max-height: calc(100vh - ${B.edge*2}px);
  overflow: hidden;
  display: none;
  flex-direction: column;
  pointer-events: auto;
  font-family: ${H.stack};
  font-synthesis: none;
  font-size: ${H.body}px;
  font-weight: ${J.regular};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${x.primary};
  background: ${xe};
  box-shadow: ${Be};
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
  transition: opacity ${F.ui}, translate ${F.ui}, display ${F.ui} allow-discrete;
}

/* The bar that says the tool wrote this row. Worth a fade: it is the panel
   admitting to something, and it should be noticed without being a movement. */
.edit-row::before { transition: opacity ${F.ui}; }

@media (prefers-reduced-motion: reduce) {
  .edit-dock { transition: opacity ${F.ui}; translate: none; }
  @starting-style { .edit-dock[data-open] { translate: none; } }
  .edit-opt:active, .edit-mini:active, .edit-add:active,
  .edit-action:active { scale: 1; }
}

.edit-head {
  display: flex; align-items: center; gap: ${B.base}px;
  flex: none;
  height: ${ze}px;
  padding: 0 ${B.base}px 0 ${B.roomy}px;
  border-bottom: 1px solid ${ue};
}
.edit-title { font-size: ${H.title}px; font-weight: ${J.semibold}; }
.edit-subject {
  flex: 1; min-width: 0;
  color: ${x.tertiary};
  font-size: ${H.tag}px;
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
  transition: scrollbar-color ${F.ui};
  padding: ${B.base}px;
}
.edit-body:hover, .edit-body:focus-within {
  scrollbar-color: ${_(6)} transparent;
}
/* WebKit does not read scrollbar-color, so it gets the same thing said twice. */
.edit-body::-webkit-scrollbar { width: 8px; }
.edit-body::-webkit-scrollbar-track { background: transparent; }
.edit-body::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 0;
  transition: background ${F.ui};
}
.edit-body:hover::-webkit-scrollbar-thumb,
.edit-body:focus-within::-webkit-scrollbar-thumb { background: ${_(6)}; }
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
  font-size: ${H.tag}px; font-weight: ${J.semibold};
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
  min-height: ${ze}px;
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
  background: ${_(2)}; color: ${x.secondary};
  font: inherit; font-size: ${H.tag}px; cursor: pointer;
  transition: background ${F.ui}, color ${F.ui};
}
.edit-opt:hover { background: ${_(4)}; color: ${x.primary}; }
.edit-opt:active { scale: 0.96; }
.edit-opt:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }
.edit-opt[data-on] { background: ${x.primary}; color: ${xe}; }

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
  background: ${_(1)};
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
  font: inherit; font-size: ${H.tag}px;
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
  font-size: ${H.tag}px; font-weight: ${J.regular};
}
.edit-row-name .edit-glyph { color: ${x.tertiary}; }
/* Two columns of badges. They size to their own digits, so the grid can be
   tight without anything being clipped. */
.edit-sides { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; }

/* A shadow is a list, so its row is a block rather than a line. */
.edit-line-block { display: block; padding: ${B.base}px 10px; }
.edit-stack { display: grid; gap: 6px; }
.edit-layer { background: ${_(2)}; padding: 6px; }
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
  font-size: ${H.tag}px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.edit-swatch-solo { width: 24px; height: 24px; }
.edit-mini {
  flex: none;
  display: grid; place-items: center;
  width: 24px; height: 24px;
  padding: 0; border: 0; border-radius: 0;
  background: ${_(3)}; color: ${x.secondary};
  font: inherit; font-size: ${H.tag}px; line-height: 1;
  cursor: pointer;
}
.edit-mini:hover:not(:disabled) { background: ${_(5)}; color: ${x.primary}; }
.edit-mini:active:not(:disabled) { scale: 0.96; }
.edit-mini:disabled { color: ${x.disabled}; cursor: default; }
.edit-mini:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }
.edit-add {
  width: 100%;
  padding: 7px; border: 0; border-radius: 0;
  background: ${_(2)}; color: ${x.secondary};
  font: inherit; font-size: ${H.tag}px; cursor: pointer;
}
.edit-add:hover { background: ${_(4)}; color: ${x.primary}; }
.edit-add:active { scale: 0.96; }
.edit-add:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }
.edit-sides > * { min-width: 0; }

.edit-linked {
  width: 24px; height: 24px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; color: ${x.tertiary};
  cursor: pointer;
}
.edit-linked[data-on] { background: ${_(4)}; color: ${x.primary}; }
.edit-linked:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }


.edit-more {
  width: 100%; margin-top: ${B.tight}px;
  padding: 6px; border: 0; border-radius: 0;
  background: none; color: ${x.tertiary};
  font: inherit; font-size: ${H.tag}px; cursor: pointer;
  text-align: left;
}
.edit-more:hover { color: ${x.primary}; }

.edit-foot {
  flex: none;
  display: flex; align-items: center; gap: ${B.base}px;
  padding: ${B.base}px;
  border-top: 1px solid ${ue};
}
.edit-count { flex: 1; color: ${x.tertiary}; font-size: ${H.tag}px; }
.edit-action {
  padding: 7px 10px; border: 0; border-radius: 0;
  background: ${_(3)}; color: ${x.primary};
  font: inherit; font-size: ${H.tag}px; font-weight: ${J.medium};
  cursor: pointer;
  transition: background ${F.ui};
}
.edit-action:hover { background: ${_(5)}; }
.edit-action:active:not(:disabled) { scale: 0.96; }
.edit-action:disabled { color: ${x.disabled}; cursor: default; background: ${_(1)}; }
.edit-action:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }

.edit-empty {
  padding: ${B.roomy}px;
  color: ${x.tertiary};
}
`;function zo(e,t){let o=document.createElement("style");o.textContent=Gi,e.appendChild(o);let n=document.createElement("div");n.className="edit-dock",n.setAttribute("role","region"),n.setAttribute("aria-label","Edit the locked element");let r=document.createElement("div");r.className="edit-head";let i=document.createElement("span");i.className="edit-title",i.textContent="Edit";let a=document.createElement("span");a.className="edit-subject",r.append(i,a);let s=document.createElement("div");s.className="edit-body";let c=document.createElement("div");c.className="edit-foot";let k=document.createElement("span");k.className="edit-count";let w=document.createElement("button");w.type="button",w.className="edit-action",w.textContent="Copy as prompt";let M=document.createElement("button");M.type="button",M.className="edit-action",M.textContent="Revert all",c.append(k,M,w),n.append(r,s,c),e.appendChild(n);let d=null,y=!1,$=!1,E=[],W=[];function u(){for(let l of W.splice(0))l()}let g=new Set;function X(){let l=t.changes().length;k.textContent=l===0?"No changes":`${l} change${l===1?"":"s"}`,w.disabled=l===0,M.disabled=l===0}function K(){if(d){for(let l of E){let v=(l.spec.sides??[l.spec.prop]).some(D=>t.touched(d,D));l.el.toggleAttribute("data-touched",v)}X()}}function q(l,C){d&&(t.set(d,l,C),K())}function ae(l,C,v){let D=Ft(e,{label:v,value:d?Kt(Ce(d,C)):0,min:l.min??0,max:l.max??100,step:l.step??1,...l.unit?{unit:l.unit}:{},onChange:I=>{let G=`${I}${l.unit??""}`;if(l.sides&&g.has(l.prop)){for(let p of l.sides)q(p,G);for(let p of E)if(p.spec.prop===l.prop)for(let f of p.sliders)f.set(I)}else q(C,G)}});return{el:D.el,slider:D,sync:()=>{d&&D.set(Kt(Ce(d,C)))}}}function re(l,C,v){let D=/(^|\s)(top|bottom)(\s|$)/.test(v),I=v==="top"?"sideTop":v==="right"?"sideRight":v==="bottom"?"sideBottom":v==="left"?"sideLeft":void 0,G=Eo(e,{label:`${l.label} ${v}`,value:d?Kt(Ce(d,C)):0,min:l.min??0,max:l.max??999,step:l.step??1,axis:D?"y":"x",...I?{glyph:I}:{text:v},onChange:p=>{let f=`${p}${l.unit??""}`;if(g.has(l.prop)&&l.sides){for(let S of l.sides)q(S,f);for(let S of E)if(S.spec.prop===l.prop)for(let R of S.scrubs)R.set(p)}else q(C,f)}});return{el:G.el,scrub:G,sync:()=>{d&&G.set(Kt(Ce(d,C)))}}}function ee(l){let C=document.createElement("div");C.className="edit-choice",C.setAttribute("role","group"),C.setAttribute("aria-label",l.label);let v=[];for(let I of l.options??[]){let G=document.createElement("button");G.type="button",G.className="edit-opt",G.textContent=I,G.addEventListener("click",()=>{q(l.prop,I),D()}),v.push(G),C.appendChild(G)}function D(){let I=d?Ce(d,l.prop):"";for(let G of v){let p=G.textContent===I;G.toggleAttribute("data-on",p),G.setAttribute("aria-pressed",String(p))}}return{el:C,sync:D}}function Z(l,C,v){let D=G=>{let p=G.composedPath();p.includes(l)||p.some(f=>f instanceof Node&&C(f))||v()},I=G=>{(G.composedPath?.()??[]).includes(e.host)||v()};return e.addEventListener("pointerdown",D,!0),document.addEventListener("pointerdown",I,!0),()=>{e.removeEventListener("pointerdown",D,!0),document.removeEventListener("pointerdown",I,!0)}}function b(l){let C=document.createElement("div");C.className="edit-colour";let v=document.createElement("button");v.type="button",v.className="edit-swatch",v.setAttribute("aria-haspopup","dialog"),v.setAttribute("aria-expanded","false"),v.setAttribute("aria-label",`Pick the ${l.label.toLowerCase()} colour`);let D=document.createElement("input");D.type="text",D.className="edit-hex",D.spellcheck=!1,D.setAttribute("aria-label",`${l.label} colour`);let I=null,G=null;function p(){G?.(),G=null,I?.destroy(),I=null,v.setAttribute("aria-expanded","false")}v.addEventListener("click",()=>{if(I){p();return}I=wn(e,{anchor:v,value:D.value||"#000000",onChange:R=>{D.value=R,f(R),q(l.prop,R)}}),v.setAttribute("aria-expanded","true"),G=Z(v,R=>I?.contains(R)??!1,p)}),D.addEventListener("change",()=>{let R=D.value.trim();if(!We(R)){S();return}f(R),I?.update(R),q(l.prop,R)});function f(R){v.style.setProperty("--swatch",R)}function S(){let R=d?Ce(d,l.prop):"",L=We(R),z=L?Ve(L,rt(R)):R;document.activeElement!==D&&e.activeElement!==D&&(D.value=z),f(z),I?.update(z)}return C.append(v,D),W.push(p),{el:C,sync:S}}function O(l){let C=document.createElement("div");C.className="edit-stack";let v=[],D=[];function I(){q(l.prop,Bo(v))}function G(){for(let S of D)S.destroy();D=[],C.textContent="",v.forEach((S,R)=>{let L=document.createElement("div");L.className="edit-layer";let z=document.createElement("div");z.className="edit-layer-head";let P=document.createElement("span");P.className="edit-layer-name",P.textContent=`Layer ${R+1}`;let h=document.createElement("button");h.type="button",h.className="edit-swatch edit-swatch-solo",h.setAttribute("aria-haspopup","dialog"),h.setAttribute("aria-expanded","false"),h.setAttribute("aria-label",`Layer ${R+1} colour`),h.style.setProperty("--swatch",S.colour);let T=null,Y=null,pe=()=>{Y?.(),Y=null,T?.destroy(),T=null,h.setAttribute("aria-expanded","false")};h.addEventListener("click",()=>{if(T){pe();return}T=wn(e,{anchor:h,value:S.colour||"rgb(0 0 0 / 0.2)",onChange:$e=>{h.style.setProperty("--swatch",$e),v[R]={...S,colour:$e},S=v[R],I()}}),h.setAttribute("aria-expanded","true"),Y=Z(h,$e=>T?.contains($e)??!1,pe)}),W.push(pe);let me=document.createElement("button");me.type="button",me.className="edit-opt",me.textContent="inset",me.toggleAttribute("data-on",S.inset),me.addEventListener("click",()=>{v[R]={...S,inset:!S.inset},S=v[R],me.toggleAttribute("data-on",S.inset),I()});let fe=document.createElement("button");fe.type="button",fe.className="edit-mini",fe.setAttribute("aria-label",`Move layer ${R+1} up`),fe.appendChild(ve("arrowUp",12)),fe.disabled=R===0,fe.addEventListener("click",()=>{v=vn(v,R,R-1),I(),G()});let Se=document.createElement("button");Se.type="button",Se.className="edit-mini",Se.setAttribute("aria-label",`Move layer ${R+1} down`),Se.appendChild(ve("arrowDown",12)),Se.disabled=R===v.length-1,Se.addEventListener("click",()=>{v=vn(v,R,R+1),I(),G()});let Le=document.createElement("button");Le.type="button",Le.className="edit-mini",Le.setAttribute("aria-label",`Remove layer ${R+1}`),Le.appendChild(ve("cross",12)),Le.addEventListener("click",()=>{v=v.filter(($e,V)=>V!==R),I(),G()}),z.append(P,h,me,fe,Se,Le);let tt=document.createElement("div");tt.className="edit-sides";let Tt=[{key:"x",label:"x",min:-64,max:64},{key:"y",label:"y",min:-64,max:64},{key:"blur",label:"blur",min:0,max:96},{key:"spread",label:"spread",min:-32,max:32}];for(let $e of Tt){let V=Ft(e,{label:$e.label,value:S[$e.key],min:$e.min,max:$e.max,step:1,unit:"px",onChange:de=>{v[R]={...v[R],[$e.key]:de},S=v[R],I()}});D.push(V),tt.appendChild(V.el)}L.append(z,tt),C.appendChild(L)});let f=document.createElement("button");f.type="button",f.className="edit-add",f.textContent=v.length===0?"Add a shadow":"Add another layer",f.addEventListener("click",()=>{v=[...v,{...v[v.length-1]??Do}],I(),G()}),C.appendChild(f)}function p(){v=d?Go(Ce(d,l.prop)):[],G()}return{el:C,sync:p,sliders:[]}}function oe(l){let C=Ft(e,{label:l.label,value:d?kn(Ce(d,l.prop)):0,min:l.min??0,max:l.max??40,step:l.step??1,unit:l.unit??"px",onChange:v=>q(l.prop,Oo(v))});return{el:C.el,slider:C,sync:()=>{d&&C.set(kn(Ce(d,l.prop)))}}}function N(l){let C=document.createElement("div");C.className="edit-row";let v=document.createElement("div");v.className="edit-line";let D=document.createElement("span");D.className="edit-label",D.textContent=l.label;let I=document.createElement("div");I.className="edit-field";let G=[],p=[],f=[];if(l.sides){let L=document.createElement("div");L.className="edit-sides",L.style.flex="1";for(let P of l.sides){let h=P.split("-").filter(Y=>Y!=="border"&&Y!=="radius"&&Y!=="width"&&Y!=="padding"&&Y!=="margin").join(" ")||P,T=re(l,P,h);p.push(T.scrub),f.push(T.sync),L.appendChild(T.el)}let z=document.createElement("button");z.type="button",z.className="edit-linked",z.setAttribute("aria-label",`Link all four ${l.label.toLowerCase()} values`),z.title="Change all four together",z.appendChild(ve("link",13)),z.setAttribute("aria-pressed","false"),z.addEventListener("click",()=>{g.has(l.prop)?g.delete(l.prop):g.add(l.prop);let P=g.has(l.prop);z.toggleAttribute("data-on",P),z.setAttribute("aria-pressed",String(P))}),I.append(L,z)}else if(l.kind==="shadow"){let L=O(l);f.push(L.sync),L.el.style.flex="1",I.appendChild(L.el)}else if(l.kind==="blur"){let L=oe(l);G.push(L.slider),f.push(L.sync),L.el.style.flex="1",I.appendChild(L.el)}else if(l.kind==="choice"){let L=ee(l);f.push(L.sync),I.appendChild(L.el)}else if(l.kind==="colour"){let L=b(l);f.push(L.sync),L.el.style.flex="1",I.appendChild(L.el)}else{let L=ae(l,l.prop,l.label);G.push(L.slider),f.push(L.sync),L.el.style.flex="1",I.appendChild(L.el)}l.kind==="shadow"&&v.classList.add("edit-line-block");let S=document.createElement("span");S.className="edit-glyph",S.appendChild(ve(l.glyph,15));let R=!l.sides&&l.kind==="colour";if(R&&v.prepend(S,D),(l.sides||l.kind==="shadow")&&C.setAttribute("data-grouped",""),l.sides||l.kind==="shadow"||l.kind==="choice"){let L=document.createElement("span");L.className="edit-row-name",L.append(S,document.createTextNode(l.label)),C.appendChild(L)}return!R&&!l.sides&&l.kind!=="shadow"&&l.kind!=="choice"&&v.appendChild(S),v.appendChild(I),C.appendChild(v),{spec:l,el:C,sliders:G,scrubs:p,sync:()=>{for(let L of f)L()}}}function j(){u();for(let C of E){for(let v of C.sliders)v.destroy();for(let v of C.scrubs)v.destroy()}if(E.length=0,s.textContent="",!d){let C=document.createElement("p");C.className="edit-empty",C.textContent="Click an element to lock it, then change it here.",s.appendChild(C),X();return}for(let C of Hi){if(C.when&&!C.when(d))continue;let v=C.specs.filter(p=>$||!p.more);if(v.length===0)continue;let D=document.createElement("section");D.className="edit-group";let I=document.createElement("span");I.className="edit-group-name",I.textContent=C.name;let G=document.createElement("div");G.className="edit-rows";for(let p of v){let f=N(p);E.push(f),G.appendChild(f.el)}D.append(I,G),s.appendChild(D)}let l=document.createElement("button");l.type="button",l.className="edit-more",l.textContent=$?"Fewer properties":"More properties",l.addEventListener("click",()=>{$=!$,j()}),s.appendChild(l);for(let C of E)C.sync();K()}M.addEventListener("click",()=>{t.revertAll();for(let l of E)l.sync();K()});let A=0;w.addEventListener("click",()=>{let l=t.asPrompt();if(!l)return;let C=D=>{w.textContent=D,clearTimeout(A),A=window.setTimeout(()=>{w.textContent="Copy as prompt"},900)},v=navigator.clipboard;if(!v){C("No clipboard");return}v.writeText(l).then(()=>C("Copied"),()=>C("Blocked"))});function U(){n.toggleAttribute("data-open",y)}return{show(l){if(l===d){for(let C of E)C.sync();K();return}d=l,a.textContent=l?l.tagName.toLowerCase()+(l.id?`#${l.id}`:""):"",j()},setArmed(l){y=l,U(),l&&j()},refresh(){for(let l of E)l.sync();K()},asText(){return t.asPrompt()},destroy(){u();for(let l of E){for(let C of l.sliders)C.destroy();for(let C of l.scrubs)C.destroy()}E.length=0,n.remove(),o.remove()}}}var Yt=5,En=4,Et=12,Fo=.22,at=10,Bi=50,Oi=100;function Wo(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,hidden:!1,dimLock:!1,grid:null,pixels:!1,guides:[],liveGuide:null,activeGuide:null},i=un(pn()),a=0,s=null;function c(){let b=pn();b!==s&&(s=b,i=un(b),e.style.colorScheme=b?"dark":"light",Z())}c();let k=matchMedia("(prefers-color-scheme: dark)"),w=()=>c();k.addEventListener("change",w);let M=new MutationObserver(()=>c());function d(){M.disconnect(),M.observe(document.documentElement,{attributes:!0}),document.body&&M.observe(document.body,{attributes:!0})}d(),bo(()=>Z());function y(){let b=devicePixelRatio;o.width=Math.round(innerWidth*b),o.height=Math.round(innerHeight*b),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(b,0,0,b,0,0),n.translate(.5,.5)}let $=b=>Math.round(b)-.5;function E(b,O){n.strokeStyle=O,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(b.left),Math.round(b.top),Math.round(b.width),Math.round(b.height))}function W(b){n.strokeStyle=Ye(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let O of[b.left,b.right])n.moveTo(Math.round(O),0),n.lineTo(Math.round(O),innerHeight);for(let O of[b.top,b.bottom])n.moveTo(0,Math.round(O)),n.lineTo(innerWidth,Math.round(O));n.stroke(),n.setLineDash([])}function u(b){if(n.strokeStyle=b.extension?Ye(i.measure,.55):i.measure,n.lineWidth=1,n.setLineDash(b.extension?[3,3]:[]),n.beginPath(),n.moveTo(Math.round(b.x1),Math.round(b.y1)),n.lineTo(Math.round(b.x2),Math.round(b.y2)),b.extension){n.stroke();return}if(b.axis==="x")for(let O of[b.x1,b.x2])n.moveTo(Math.round(O),Math.round(b.y1)-Yt),n.lineTo(Math.round(O),Math.round(b.y1)+Yt);else for(let O of[b.y1,b.y2])n.moveTo(Math.round(b.x1)-Yt,Math.round(O)),n.lineTo(Math.round(b.x1)+Yt,Math.round(O));n.stroke()}function g(b){return n.font=`${J.medium} ${H.body}px ${H.stack}`,{w:n.measureText(b).width+En*2,h:H.body+En*2+2}}function X(b,O,oe,N){n.font=`${J.medium} ${H.body}px ${H.stack}`,n.textBaseline="middle";let{w:j,h:A}=g(b),U=$(Math.min(Math.max(O,Et),innerWidth-j-Et)),l=$(Math.min(Math.max(oe,Et),innerHeight-A-Et));n.fillStyle=N,n.beginPath(),n.roundRect(U,l,Math.ceil(j),A,4),n.fill(),n.fillStyle=i.surface,n.fillText(b,U+En,l+A/2)}function K(b,O,oe,N,j=!1){let{w:A,h:U}=g(b);X(b,j?O-A/2:O,j?oe-U/2:oe,N)}function q(){let b=scrollX,O=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,te),n.fillRect(-.5,-.5,te,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${J.regular} 9px ${H.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let A of r.pinned)n.fillRect($(A.left),-.5,Math.round(A.width),te),n.fillRect(-.5,$(A.top),te,Math.round(A.height));n.restore(),n.beginPath(),n.moveTo(-.5,te-.5),n.lineTo(innerWidth,te-.5),n.moveTo(te-.5,-.5),n.lineTo(te-.5,innerHeight),n.stroke();let oe=A=>A%Oi===0?te:A%Bi===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let N=Math.floor(b/at)*at;for(let A=N;A<b+innerWidth;A+=at){let U=Math.round(A-b);if(U<te)continue;let l=oe(A);n.moveTo(U,te-l),n.lineTo(U,te),l===te&&(n.fillStyle=i.muted,n.fillText(String(A),U+3,3))}n.stroke(),n.beginPath();let j=Math.floor(O/at)*at;for(let A=j;A<O+innerHeight;A+=at){let U=Math.round(A-O);if(U<te)continue;let l=oe(A);n.moveTo(te-l,U),n.lineTo(te,U),l===te&&(n.save(),n.translate(3,U-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(A),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),te),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo(te,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let A of r.guides){let U=Math.round(bt(A));A.axis==="x"?n.fillRect(U-1,-.5,2,te):n.fillRect(-.5,U-1,te,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,te,te),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,te,te)}function ae(){let b=po(10,1);if(b){n.strokeStyle=i.pixelLine,n.lineWidth=1,n.setLineDash([]),n.beginPath();for(let O=0;O<=innerWidth;O+=b)n.moveTo(O,0),n.lineTo(O,innerHeight);for(let O=0;O<=innerHeight;O+=b)n.moveTo(0,O),n.lineTo(innerWidth,O);n.stroke()}}function re(b){let O=uo(b,document.documentElement.clientWidth);n.fillStyle=Ye(i.measure,.08);for(let oe of O)n.fillRect($(oe.left),-.5,Math.round(oe.width),innerHeight+1)}function ee(){if(a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore(),r.hidden)return;(r.pixels||r.grid)&&(n.save(),r.rulers&&(n.beginPath(),n.rect(te,te,innerWidth,innerHeight),n.clip()),r.pixels&&ae(),r.grid&&re(r.grid),n.restore());let b=r.dimLock?Ye(i.accent,.15):i.accent;for(let N of r.pinned)E(N,b);r.hover&&(W(r.hover),E(r.hover,r.pinned.length||r.dimLock?Ye(b,.7):b));for(let N of r.guides){let j=r.liveGuide?.id===N.id;n.strokeStyle=N.locked||j?i.guide:Ye(i.guide,.55),n.lineWidth=N.pinned?2:1,n.setLineDash(N.locked?[]:[4,4]),n.beginPath();let A=Math.round(bt(N));if(N.axis==="x"?(n.moveTo(A,0),n.lineTo(A,innerHeight)):(n.moveTo(0,A),n.lineTo(innerWidth,A)),n.stroke(),r.activeGuide===N.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let U=7;N.axis==="x"?(n.moveTo(A,0),n.lineTo(A,U),n.moveTo(A,innerHeight-U),n.lineTo(A,innerHeight)):(n.moveTo(0,A),n.lineTo(U,A),n.moveTo(innerWidth-U,A),n.lineTo(innerWidth,A)),n.stroke()}}for(let N of r.lines)n.globalAlpha=N.faded?Fo:1,u(N);n.globalAlpha=1;let O=r.lines.filter(N=>N.label!==""),oe=O.map(N=>{let j=(N.x1+N.x2)/2,A=(N.y1+N.y2)/2,{w:U,h:l}=g(N.label);return N.axis==="x"?{x:j-U/2,y:A-16-l/2,w:U,h:l,axis:N.axis}:{x:j+26-U/2,y:A-l/2,w:U,h:l,axis:N.axis}});if(co(oe,{w:innerWidth,h:innerHeight},Et).forEach((N,j)=>{let A=O[j];n.globalAlpha=A.faded?Fo:1,X(A.label,N.x,N.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:N,height:j,scale:A}=r.hover;K(`${ie(N/A.x)} \xD7 ${ie(j/A.y)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let N=r.liveGuide,j=Math.round(bt(N));K([`${N.axis} ${ie(N.at)}`,N.caught,N.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),N.axis==="x"?j+6:30,N.axis==="x"?30:j+6,i.guide)}r.rulers&&q()}function Z(){a||(a=requestAnimationFrame(ee))}return y(),{root:t,update(b){Object.assign(r,b),Z()},resize(){y(),Z()},destroy(){a&&cancelAnimationFrame(a),k.removeEventListener("change",w),M.disconnect(),e.remove()}}}function zi(e){let t=e.trim().replace(/^#/,""),o=t.length===3?t.split("").map(n=>n+n).join(""):t;return/^[0-9a-f]{6}$/i.test(o)?{r:parseInt(o.slice(0,2),16),g:parseInt(o.slice(2,4),16),b:parseInt(o.slice(4,6),16)}:null}function Fi({r:e,g:t,b:o}){let n=r=>Math.round(r).toString(16).padStart(2,"0");return`#${n(e)}${n(t)}${n(o)}`}function Wi({r:e,g:t,b:o}){return`rgb(${Math.round(e)} ${Math.round(t)} ${Math.round(o)})`}function qe(e,t){return String(Number(e.toFixed(t)))}function _i({r:e,g:t,b:o}){let n=e/255,r=t/255,i=o/255,a=Math.max(n,r,i),s=Math.min(n,r,i),c=(a+s)/2,k=a-s,w=0,M=0;return k!==0&&(M=k/(1-Math.abs(2*c-1)),a===n?w=(r-i)/k%6:a===r?w=(i-n)/k+2:w=(n-r)/k+4,w*=60,w<0&&(w+=360)),`hsl(${qe(w,1)} ${qe(M*100,1)}% ${qe(c*100,1)}%)`}function Xi(e){let{l:t,c:o,h:n}=kt([e.r/255,e.g/255,e.b/255]);return o<1e-4?`oklch(${qe(t,4)} 0 0)`:`oklch(${qe(t,4)} ${qe(o,4)} ${qe(n,2)})`}function _o(e){let t=zi(e);return t?[{label:"hex",value:Fi(t)},{label:"rgb",value:Wi(t)},{label:"hsl",value:_i(t)},{label:"oklch",value:Xi(t)}]:[]}var Ki=`
.picker {
  /* Under the badge, from the badge's own numbers. */
  position: fixed; top: ${Me+xt+wt}px; right: ${Me}px;
  width: min(200px, calc(100vw - ${Me*2+B.base*2}px));
  padding: ${B.base}px; border-radius: 0;
  user-select: none;
  font-family: ${H.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${H.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${x.primary};
  background: ${xe};
  box-shadow: ${Be};
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
  transition: opacity ${F.ui}, transform ${F.ui}, visibility 0s linear 160ms;
}
.picker[data-open] {
  opacity: 1; visibility: visible; pointer-events: auto;
  transform: none;
  transition: opacity ${F.ui}, transform ${F.ui}, visibility 0s;
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
.picker button:hover { background: ${_(2)}; }
.picker button:focus-visible { outline: 1px solid ${x.primary}; outline-offset: -1px; }
.picker .k { color: ${x.secondary}; }
.picker .v { overflow-wrap: anywhere; }
.picker .hint {
  margin-top: 6px; padding-top: 6px;
  border-top: 1px solid ${ue};
  color: ${x.secondary};
}
`;function Xo(e){let t=document.createElement("style");t.textContent=Ki,e.appendChild(t);let o=document.createElement("div");o.className="picker",e.appendChild(o);let n=document.createElement("div");n.className="swatch";let r=document.createElement("div");r.className="hint";function i(a){n.style.background=a;let s=_o(a).map(({label:c,value:k})=>{let w=document.createElement("button");w.type="button";let M=document.createElement("span");M.className="k",M.textContent=c;let d=document.createElement("span");return d.className="v",d.textContent=k,w.append(M,d),w.addEventListener("click",y=>{y.stopPropagation(),navigator.clipboard?.writeText(k).then(()=>{r.textContent=`copied ${c}`},()=>{r.textContent="clipboard refused"})}),w});r.textContent="click a row to copy",o.replaceChildren(n,...s,r),o.setAttribute("data-open","")}return{async open(){let a=window.EyeDropper;if(!a){o.replaceChildren(Object.assign(document.createElement("div"),{className:"hint",textContent:"this browser has no eyedropper"})),o.setAttribute("data-open","");return}try{let{sRGBHex:s}=await new a().open();i(s)}catch{}},close(){let a=o.hasAttribute("data-open");return o.removeAttribute("data-open"),a},destroy(){o.remove(),t.remove()}}}var Sn="__align_freeze",Yi=`
[data-align-frozen] *:not([data-align-ignore]):not([data-align-ignore] *) {
  animation-play-state: paused !important;
}
`,Cn=!1,jt=[],Ut=[];function Ko(e){let t=e;for(;t;){if(t instanceof Element&&t.hasAttribute("data-align-ignore"))return!0;let o=t.getRootNode();if(t=o instanceof ShadowRoot?o.host:t.parentNode??null,t===document)return!1}return!1}function Vt(){return Cn}function Tn(e){if(e!==Cn){if(Cn=e,!e){document.documentElement.removeAttribute("data-align-frozen"),document.getElementById(Sn)?.remove();for(let t of jt)try{t.play()}catch{}for(let t of Ut)t.play().catch(()=>{});jt=[],Ut=[];return}if(!document.getElementById(Sn)){let t=document.createElement("style");t.id=Sn,t.textContent=Yi,t.setAttribute("data-align-ignore",""),document.head.appendChild(t)}document.documentElement.setAttribute("data-align-frozen",""),jt=[];try{for(let t of document.getAnimations()){if(t.playState!=="running")continue;let o=t.effect?.target??null;Ko(o)||(t.pause(),jt.push(t))}}catch{}Ut=[];for(let t of Array.from(document.querySelectorAll("video")))t.paused||Ko(t)||(t.pause(),Ut.push(t))}}var Mn="__align_xray",ji=`
[data-align-xray] * { outline: 1px solid rgb(128 128 128 / 0.55) !important; }
[data-align-xray] [data-align-ignore],
[data-align-xray] [data-align-ignore] * { outline: none !important; }
`;function An(e){let t=document.documentElement;if(!e){t.removeAttribute("data-align-xray"),document.getElementById(Mn)?.remove();return}if(!document.getElementById(Mn)){let o=document.createElement("style");o.id=Mn,o.textContent=ji,o.setAttribute("data-align-ignore",""),document.head.appendChild(o)}t.setAttribute("data-align-xray","")}var Ln="align-ui";function Yo(e){try{return localStorage.getItem(e)}catch{return null}}function jo(e,t){try{localStorage.setItem(e,t)}catch{}}function Uo(e){let t="/";try{t=location.pathname||"/"}catch{}return`${Ln}:${e}::${t}`}function Ui(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function Vo(){let e=Yo(Uo("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(Ui).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function qo(e){jo(Uo("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function qt(e){return Yo(`${Ln}:${e}`)==="1"}function Zt(e,t){jo(`${Ln}:${e}`,t?"1":"0")}var we,ne=null,ke=null,Ie=null,ht=null,Xe=null,Ze=Ro(),Qe=!1,ct=qt("grid"),dt=qt("pixels"),he=null,Q=[],Qt=0,et=qt("rulers"),le=[],rr=1,Zo=!1,He=null,st=!1,Ct=!1,Nn,Je=wo();function Vi(){return le.map(e=>({...e}))}function ut(e=""){Je.push(Vi(),e)}function Jo(){return le.find(e=>e.id===He)??null}function _e(e){le=e,qo(le)}var ge=null,Re=null,Ae=null,qi=3,lt=22;function ir(e,t){return et?t<lt&&e>=lt?"y":e<lt&&t>=lt?"x":null:null}function Pn(e){return e.ctrlKey||e.metaKey}function ar(e,t,o,n){let r=Ke(t,o,we),i=e.axis==="x"?t:o,a=le.filter(c=>c.id!==e.id).map(c=>({axis:c.axis,at:St(c).pos})),s=ao(i,so(r,e.axis,a),n);e.at=s.at+(e.axis==="x"?scrollX:scrollY),e.caught=s.what}function sr(e,t,o,n){let r={id:rr++,axis:e,at:0,locked:!1,caught:"",pinned:!1};ar(r,t,o,n);let i=le.find(a=>a.axis===r.axis&&Math.abs(a.at-r.at)<.5);return i?(He=i.id,i):(ut(),_e([...le,r]),He=r.id,r)}function lr(e){e.pinned||(ut(),_e(le.filter(t=>t.id!==e.id)),Re?.id===e.id&&(Re=null),ge?.id===e.id&&(ge=null))}function Zi(e){let t=we.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function St(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function In(){return Q.length>=2?Q[Q.length-2]:void 0}function Hn(){if(Q.length<2)return[];let e=[];for(let[t,o]of rn(Q))for(let n of Ht(t,o)){if(n.extension||!n.label)continue;let r=Yn(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:jn(r)})}return e}function be(e){let t=Q[Q.length-1],o=he&&Q.some(d=>d.el===he.el),n=le.map(St),r=!ge&&Re?Re:null,i=le.filter(d=>d.locked||d.id===r?.id),a=!r&&o?he.el:null,s=r??a,c=r?St(r):null,k=[],w=(d,y)=>{for(let $ of d)k.push(s&&!y?{...$,faded:!0}:$)},M=d=>!c||d.axis!==c.axis?!1:(d.axis==="x"?[d.x1,d.x2]:[d.y1,d.y2]).some($=>Math.abs($-c.pos)<.5);for(let[d,y]of rn(Q))w(Ht(d,y),d.el===a||y.el===a);t&&he&&!o&&!r&&w(Ht(t,he),!0);for(let d of i)for(let y of Q)w(sn(y,[St(d)]),d.id===r?.id||y.el===a);he&&!o&&!r&&le.length&&w(sn(he,n),!0);for(let d of lo(i.map(St),{x:innerWidth/2,y:innerHeight/2}))w([d],M(d));ne?.update({hover:he,pinned:Q,rulers:et,hidden:st,dimLock:Ct,grid:ct&&we.grid?we.grid:null,pixels:dt,guides:le,liveGuide:ge??Re,activeGuide:He,lines:k,...e?{cursor:e}:{}}),Ie?.update(Q.length,{edit:Ze.armed,rulers:et,xray:Qe,grid:ct,pixels:dt,freeze:Vt(),type:ke?.showsType()??!1,hide:st,canCopy:Q.length>0,canUndo:Je.depth()>0,panel:ke?.isOpen()??!1})}function Ji(){let e=ke?.asText()??"";if(!e)return;let t=n=>Ie?.acknowledge("copy",n),o=navigator.clipboard?.writeText(e);o?o.then(()=>t(!0),()=>t(!1)):t(!1)}function Qi(e,t){return e.length===t.length&&e.every((o,n)=>{let r=t[n];return o.id===r.id&&o.axis===r.axis&&o.at===r.at&&o.locked===r.locked&&o.pinned===r.pinned})}function ea(){for(;Je.depth()>0&&Qi(Je.peek(),le);)Je.pop();let e=Je.pop();e&&(_e(e),Re=null,ge=null,Ae=null,e.some(t=>t.id===He)||(He=null))}function Te(e){switch(e){case"rulers":et=!et,Zt("rulers",et);break;case"xray":Qe=!Qe,An(Qe);break;case"grid":ct=!ct,Zt("grid",ct);break;case"pixels":dt=!dt,Zt("pixels",dt);break;case"freeze":Tn(!Vt());break;case"type":ke?.toggleType();break;case"panel":ke?.toggle();break;case"hide":st=!st,ke?.setHidden(st),st&&ht?.close();break;case"copy":Ji();break;case"pick":ht?.open();break;case"edit":if(Ze.armed){let t=Ze.disarm();Ie?.acknowledge("edit",t>=0)}else Ze.arm();Xe?.setArmed(Ze.armed),Q.length&&be();break;case"undo":ea();break}be()}var Jt=null;function cr(e){if(Jt={x:e.clientX,y:e.clientY},ge){Ae&&Math.hypot(e.clientX-Ae.x,e.clientY-Ae.y)>qi&&(Ae=null),!Ae&&!ge.pinned&&(ar(ge,e.clientX,e.clientY,Pn(e)),_e([...le])),be({x:e.clientX,y:e.clientY});return}Re=an(le,e.clientX,e.clientY),he=Ke(e.clientX,e.clientY,we),be({x:e.clientX,y:e.clientY})}function dr(e){ur(!1),ge&&(Ae?(ge.locked=!ge.locked,He=ge.id,_e([...le])):(ir(e.clientX,e.clientY)||e.clientX<lt||e.clientY<lt)&&lr(ge),Ae=null,ge=null,be({x:e.clientX,y:e.clientY}))}function en(e){let t=ne?.root.host;return t?(e.composedPath?.()??[]).includes(t):!1}function ur(e){if(clearTimeout(Nn),e){if(Ct)return;Ct=!0,be();return}Nn=setTimeout(()=>{Ct=!1,be()},200)}function pr(e){if(e.button!==0)return;if(en(e)){ur(!0);return}let t=Ke(e.clientX,e.clientY,we);if(!t)return;let o=ir(e.clientX,e.clientY);if(o){pt(e),Ae=null,ge=sr(o,e.clientX,e.clientY,Pn(e)),be({x:e.clientX,y:e.clientY});return}let n=an(le,e.clientX,e.clientY);if(n){pt(e),ut(),He=n.id,ge=n,Ae={x:e.clientX,y:e.clientY},be({x:e.clientX,y:e.clientY});return}pt(e),Ie?.closeHelp(),Q=[t],he=t,ke?.show(t,Hn(),In()),Xe?.show(t.el),be({x:e.clientX,y:e.clientY})}function hr(e){if(en(e))return;let t=Ke(e.clientX,e.clientY,we);if(!t)return;pt(e),Ie?.closeHelp();let o=Q.findIndex(r=>r.el===t.el);Q=o>=0?Q.filter((r,i)=>i!==o):[...Q,t],he=t;let n=Q[Q.length-1];n?ke?.show(n,Hn(),In()):ke?.hide(),Xe?.show(n?.el??null),be({x:e.clientX,y:e.clientY})}function mr(e){en(e)||Ke(e.clientX,e.clientY,we)&&pt(e)}function fr(e){en(e)||Ke(e.clientX,e.clientY,we)&&pt(e)}function pt(e){e.preventDefault(),e.stopPropagation()}function Qo(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var er=0,tr=0;function gr(){Qt=requestAnimationFrame(gr);let t=Q.filter(s=>s.el.isConnected).map(s=>It(s.el)),o=he&&he.el.isConnected?It(he.el):null;if(!(scrollX!==er||scrollY!==tr||t.length!==Q.length||t.some((s,c)=>!Qo(s,Q[c]))||he===null!=(o===null)||he!==null&&o!==null&&!Qo(he,o)))return;er=scrollX,tr=scrollY,Q=t,he=o;let i=Q[Q.length-1],a=ta();a!==nr&&(nr=a,i?ke?.show(i,Hn(),In()):ke?.hide(),Xe?.show(i?.el??null)),be()}var nr="";function ta(){let e=Q[0];return e?Q.map(t=>[t.label,Math.round(t.width*100),Math.round(t.height*100),Math.round((t.left-e.left)*100),Math.round((t.top-e.top)*100)].join(",")).join(";"):""}function br(){ne?.resize()}function na(){Zo||(Zo=!0,le=Vo().map(e=>({...e,id:rr++}))),!ne&&(fo(),ne=Wo(),ke=xo(ne.root),Ie=vo(ne.root,Te),Xe=zo(ne.root,Ze),ht=Xo(ne.root),Ie.update(0,{rulers:et,xray:Qe,grid:ct,pixels:dt,freeze:Vt(),type:!1,panel:!1,hide:!1,edit:!1,canCopy:!1,canUndo:!1}),addEventListener("mousemove",cr),addEventListener("mousedown",pr,{capture:!0}),addEventListener("mouseup",dr,{capture:!0}),addEventListener("click",mr,{capture:!0}),addEventListener("auxclick",fr,{capture:!0}),addEventListener("contextmenu",hr,{capture:!0}),addEventListener("resize",br),Qt=requestAnimationFrame(gr),be())}function Rn(){removeEventListener("mousemove",cr),removeEventListener("mousedown",pr,{capture:!0}),removeEventListener("mouseup",dr,{capture:!0}),removeEventListener("click",mr,{capture:!0}),removeEventListener("auxclick",fr,{capture:!0}),removeEventListener("contextmenu",hr,{capture:!0}),removeEventListener("resize",br),clearTimeout(Nn),Ct=!1,cancelAnimationFrame(Qt),Qt=0,Ie?.destroy(),Xe?.destroy(),Xe=null,ht?.destroy(),ht=null,Qe&&(Qe=!1,An(!1)),Tn(!1),Ze.disarm(),Ie=null,ke?.destroy(),ke=null,ne?.destroy(),ne=null,go(),he=null,Q=[],ge=null,Ae=null,Re=null}function oa(e){let t=e.composedPath?.()[0]??e.target;return!t||typeof t!="object"||!("tagName"in t)?!1:t.isContentEditable?!0:t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT"}function or(e){if(Zi(e))e.preventDefault(),ne?Rn():na();else if(!oa(e)){if(ne&&Jt&&(e.key.toLowerCase()===we.guideKeys.vertical||e.key.toLowerCase()===we.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===we.guideKeys.vertical?"x":"y";sr(t,Jt.x,Jt.y,Pn(e)),be()}else if(ne&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(le.some(t=>!t.pinned)&&ut(),_e(le.filter(t=>t.pinned)),Re=null,ge=null,Ae=null,le.some(t=>t.id===He)||(He=null)):Re&&lr(Re),be();else if(ne&&e.key.startsWith("Arrow")){let t=Jo(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;ut(`nudge:${t.id}`);let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",_e([...le]),be()}else if(ne&&e.key.toLowerCase()==="g"){e.preventDefault(),Te("grid");return}else if(ne&&e.key.toLowerCase()==="k"){e.preventDefault(),Te("pixels");return}else if(ne&&e.key==="\\"){e.preventDefault(),Te("hide");return}else if(ne&&e.key.toLowerCase()==="e"){e.preventDefault(),Te("edit");return}else if(ne&&e.key.toLowerCase()==="f"){e.preventDefault(),Te("freeze");return}else if(ne&&e.key.toLowerCase()==="x"){e.preventDefault(),Te("xray");return}else if(ne&&e.key.toLowerCase()==="p"){e.preventDefault(),Te("pick");return}else if(ne&&e.key.toLowerCase()==="t"){e.preventDefault(),Te("type");return}else if(ne&&e.key.toLowerCase()==="c"){e.preventDefault(),Te("copy");return}else if(ne&&e.key.toLowerCase()==="l"){let t=Jo();if(!t)return;e.preventDefault(),ut(),t.pinned=!t.pinned,_e([...le]),be()}else if(ne&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){if(Je.depth()===0)return;e.preventDefault(),Te("undo");return}else if(ne&&e.key.toLowerCase()===we.rulerKey){e.preventDefault(),Te("rulers");return}else if(ne&&e.key.toLowerCase()===we.panelKey){e.preventDefault(),Te("panel");return}else if(e.key==="Escape"&&ne){if(ht?.close()||Ie?.closeHelp())return;Q.length?(Q=[],ke?.hide(),Xe?.show(null),be()):Rn()}}}function fs(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,we=no(e),yo(we.theme),addEventListener("keydown",or,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{Rn(),removeEventListener("keydown",or,{capture:!0}),delete window.__align})}export{fs as initAlign};
