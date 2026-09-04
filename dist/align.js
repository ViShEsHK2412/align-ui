function z(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function jn(e){return(e.split(",")[0]??"").trim().replace(/^['"]|['"]$/g,"")}function Un(e){let o={100:"thin",200:"extralight",300:"light",400:"regular",500:"medium",600:"semibold",700:"bold",800:"extrabold",900:"black"}[e.trim()];return o?`${e} ${o}`:e}function De(e){let t=getComputedStyle(e);return[{label:"family",value:jn(t.fontFamily),px:NaN},{label:"size",value:t.fontSize,px:z(t.fontSize)},{label:"weight",value:Un(t.fontWeight),px:NaN},{label:"line",value:t.lineHeight,px:z(t.lineHeight)},{label:"tracking",value:t.letterSpacing,px:z(t.letterSpacing)}]}function Nt(e){let t="";for(let o of e.childNodes)o.nodeType===3&&(t+=o.nodeValue??"");return t.trim().replace(/\s+/g," ")}function Dt(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:z(r)})}return o}function qn(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function Vn(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function Ot(e,t){return t.length===0?"":Vn(e).map(o=>{let n=qn(o,t);return n.length?`${o} ${n.join(" ")}`:`${o} \u2014`}).join("  \xB7  ")}function Tt(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(z)}function Pt(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),l=a.display.includes("flex")||a.display.includes("grid"),c=n==="x"?a.columnGap:a.rowGap,x=l&&c!=="normal"?z(c):null,[d,g,u,y]=Tt(e),[$,p,T,M]=Tt(t),b=F=>Number.isFinite(F)?F:0,B=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,X=n==="x"?B?b(g)+b(M):b(p)+b(y):B?b(u)+b($):b(T)+b(d);return{px:o,cssGap:x,margins:X,siblings:!0}}function Ft(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function It(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}function Je(e){let t=e.trim().toLowerCase();return t?t.startsWith("#")||/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(t)?!0:["black","white","transparent","currentcolor"].includes(t):!1}var re;function Rt(e){if(re===void 0&&(re=document.createElement("canvas").getContext("2d")),!re)return"";re.fillStyle="#000000",re.fillStyle=e;let t=re.fillStyle;return re.fillStyle="#ffffff",re.fillStyle=e,t===re.fillStyle?String(t):""}function Ht(e,t){let o=Rt(e);return o?t.filter(n=>Je(n.value)&&Rt(n.value)===o).map(n=>n.name).sort():[]}function zt(e){let t=getComputedStyle(e),o=[],n=(r,i)=>{let a=i.trim();!a||a==="transparent"||/rgba?\([^)]*,\s*0\s*\)$/.test(a)||o.push({label:r,value:a})};return n("text",t.color),n("background",t.backgroundColor),o}function Jn(e,t,o){let n=r=>typeof CSS<"u"&&CSS.escape?CSS.escape(r):r.replace(/[^\w-]/g,"\\$&");return t?`#${n(t)}`:o.length?e+o.map(r=>`.${n(r)}`).join(""):e}function Qe(e){let t=typeof e.className=="string"?e.className.trim().split(/\s+/).filter(Boolean):[];return Jn(e.tagName.toLowerCase(),e.id,t)}function Wt(e){let t=Qe(e);if(!/[.#]/.test(t))return 0;try{return document.querySelectorAll(t).length}catch{return 0}}function Qn(e){if(!e)return"inline <style>";let t=e.split("?")[0]??e;try{let o=new URL(t,"http://x").pathname;return decodeURI(o).replace(/^\//,"")||t}catch{return t}}var Zn=["width","height","padding","margin","border-width","gap","font-size","line-height","letter-spacing","color","background-color"];function eo(e){for(let t=0;t<e.length;t+=1){let o=e.item(t);if(Zn.some(n=>o===n||o.startsWith(`${n}-`)))return!0}return!1}function Xt(e){let t=[],o=new Set,n=(r,i)=>{for(let a of Array.from(r)){if(a instanceof CSSMediaRule){matchMedia(a.conditionText).matches&&n(a.cssRules,i);continue}if(a instanceof CSSSupportsRule){CSS.supports(a.conditionText)&&n(a.cssRules,i);continue}let l=a.cssRules;if(l&&!(a instanceof CSSStyleRule)){n(l,i);continue}if(!(a instanceof CSSStyleRule))continue;let c=!1;try{c=e.matches(a.selectorText)}catch{continue}if(!c||!eo(a.style))continue;let x=`${a.selectorText}|${i}`;o.has(x)||(o.add(x),t.push({selector:a.selectorText,file:i}))}};for(let r of Array.from(document.styleSheets)){if(r.ownerNode instanceof Element&&r.ownerNode.hasAttribute("data-align-ignore"))continue;let i;try{i=r.cssRules}catch{continue}n(i,Qn(r.href))}return t.reverse()}function Lt(e){if(!e||e==="none")return[];let t=e.trim().split(/\s+/),o=[];for(let n of t){if(!n.endsWith("px"))return[];let r=Number.parseFloat(n);if(!Number.isFinite(r))return[];o.push(r)}return o}function Mt(e,t,o){let n=0;for(let r=0;r<e.length;r+=1){let i=n+e[r];if(o<i+.5)return r;n=i+t}return-1}function to(e,t){let o=t==="rtl";return e.startsWith("vertical")||e.startsWith("sideways")?{inline:"y",inlineReversed:e==="sideways-lr"?!o:o,blockReversed:e==="vertical-rl"||e==="sideways-rl"}:{inline:"x",inlineReversed:o,blockReversed:!1}}function Gt(e,t,o,n,r){return r?t-n:o-e}function Yt(e){let t=e.parentElement,o=0;for(;t&&getComputedStyle(t).display==="contents";)t=t.parentElement,o+=1;if(!t)return null;let n=getComputedStyle(t),r=getComputedStyle(e),i=n.display,a=[];if(o>0&&a.push({label:"through",value:o===1?"a display: contents parent":`${o} display: contents parents`}),r.position==="absolute"||r.position==="fixed")return a.push({label:"placed by",value:`${r.position}, not by the parent`}),{display:i,rows:a};if(r.float!=="none")return a.push({label:"placed by",value:`float: ${r.float}`}),{display:i,rows:a};let l=i.includes("flex"),c=i.includes("grid");if(!l&&!c)return a.push({label:"flow",value:i}),{display:i,rows:a};let x=At(n.rowGap==="normal"?"0px":n.rowGap),d=At(n.columnGap==="normal"?"0px":n.columnGap),g=x===d?x:`row ${x} \xB7 column ${d}`;if(l){let K=n.flexDirection;a.push({label:"direction",value:n.flexWrap==="nowrap"?K:`${K} \xB7 ${n.flexWrap}`}),a.push({label:"justify",value:n.justifyContent}),a.push({label:"align",value:n.alignItems}),a.push({label:"gap",value:g});let s=`${r.flexGrow} ${r.flexShrink} ${r.flexBasis}`;return s!=="0 1 auto"&&a.push({label:"this child",value:`flex: ${s}`}),r.alignSelf!=="auto"&&a.push({label:"align-self",value:r.alignSelf}),{display:i,rows:a}}let u=Lt(n.gridTemplateColumns),y=Lt(n.gridTemplateRows);u.length&&a.push({label:"columns",value:`${u.length} \xB7 ${u.map(Ve).join(" ")}`}),y.length&&a.push({label:"rows",value:`${y.length} \xB7 ${y.map(Ve).join(" ")}`}),a.push({label:"gap",value:g});let $=t.getBoundingClientRect(),p=e.getBoundingClientRect(),T={left:$.left+z(n.borderLeftWidth)+z(n.paddingLeft),right:$.right-z(n.borderRightWidth)-z(n.paddingRight),top:$.top+z(n.borderTopWidth)+z(n.paddingTop),bottom:$.bottom-z(n.borderBottomWidth)-z(n.paddingBottom)},M=to(n.writingMode,n.direction),b=(K,s)=>K==="x"?Gt(T.left,T.right,p.left,p.right,s):Gt(T.top,T.bottom,p.top,p.bottom,s),B=M.inline==="x"?"y":"x",X=z(n.columnGap==="normal"?"0":n.columnGap),F=z(n.rowGap==="normal"?"0":n.rowGap),U=Mt(u,X,b(M.inline,M.inlineReversed)),Y=Mt(y,F,b(B,M.blockReversed)),H=[];return U>=0&&H.push(`column ${U+1} of ${u.length}`),Y>=0&&H.push(`row ${Y+1} of ${y.length}`),H.length&&a.push({label:"this child",value:H.join(" \xB7 ")}),{display:i,rows:a}}function At(e){return e.endsWith("px")?Ve(Number.parseFloat(e)):e}function Ve(e){return String(Math.round(e*100)/100)}var Kt=["display","position","width","height","padding","margin","border-width","border-style","border-radius","font-family","font-size","font-weight","font-style","line-height","letter-spacing","text-transform","text-align","color","background-color","border-color","opacity","flex-direction","justify-content","align-items","gap","flex-grow","flex-shrink","flex-basis","align-self","box-shadow","overflow","text-overflow","white-space"];function no(e,t){let o=[];for(let n of Kt){let r=e[n]??"",i=t[n]??"";r!==i&&o.push({prop:n,a:r,b:i})}return o}function Bt(e){let t=getComputedStyle(e),o={};for(let n of Kt)o[n]=t.getPropertyValue(n);return o}function _t(e,t){return no(Bt(e),Bt(t))}var oo={ignore:"",grid:null,hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function Ut(e={}){return{...oo,...e}}var jt=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function qt(e){return e.ignore?`${jt}, ${e.ignore}`:jt}function E(e){return String(Math.round(e*100)/100)}function ro(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function Fe(e){let t=e.getBoundingClientRect();return{el:e,label:ro(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height,scale:He(e)}}function Vt(e,t){let o=(n,r)=>Math.abs(n-r)<.001;return o(e.scale.x,t.scale.x)&&o(e.scale.y,t.scale.y)?e.scale:{x:1,y:1}}function Jt(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function pe(e,t,o){let n=qt(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=Jt(r);return r&&r!==document.documentElement?Fe(r):null}var Oe=e=>parseFloat(e)||0;function Ze(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[Oe(n),Oe(r),Oe(i),Oe(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function io(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function ao(e,t){let o=Vt(e,t),n=t.left+t.width/2,r=t.top+t.height/2;return[{x1:e.left,y1:r,x2:t.left,y2:r,label:E((t.left-e.left)/o.x),axis:"x"},{x1:t.right,y1:r,x2:e.right,y2:r,label:E((e.right-t.right)/o.x),axis:"x"},{x1:n,y1:e.top,x2:n,y2:t.top,label:E((t.top-e.top)/o.y),axis:"y"},{x1:n,y1:t.bottom,x2:n,y2:e.bottom,label:E((e.bottom-t.bottom)/o.y),axis:"y"}]}function Pe(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function Ie(e,t){let o=[],n=Vt(e,t),r=e.left<t.right&&t.left<e.right,i=e.top<t.bottom&&t.top<e.bottom;if(r&&i){let[a,l]=io(e,t);return ao(a,l)}if(!r){let[a,l]=e.right<=t.left?[e,t]:[t,e],c=i?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:a.right,y1:c,x2:l.left,y2:c,label:`${E((l.left-a.right)/n.x)}`,axis:"x"}),o.push(...Pe(a.right,a.top,a.bottom,c,"x")),o.push(...Pe(l.left,l.top,l.bottom,c,"x"))}if(!i){let[a,l]=e.bottom<=t.top?[e,t]:[t,e],c=r?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:c,y1:a.bottom,x2:c,y2:l.top,label:`${E((l.top-a.bottom)/n.y)}`,axis:"y"}),o.push(...Pe(a.bottom,a.left,a.right,c,"y")),o.push(...Pe(l.top,l.left,l.right,c,"y"))}return o}function lo(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function et(e){let t=lo(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var so=5,co=8;function Te(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function tt(e,t,o){let n=null,r=so;for(let i of e){let a=Math.abs(Te(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function Qt(e,t,o){if(o)return{at:e,what:""};let n=null,r=co;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function Zt(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function nt(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,l=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:l,y2:i,label:E(r.gap),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,l=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:l,label:E(r.gap),axis:"y"})}}return o}function en(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],l=r[i],c=l-a;c<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:l,y2:t.y,label:E(c),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:l,label:E(c),axis:"y"}))}}return o}var se=3;function uo(e,t){return e.x<t.x+t.w+se&&t.x<e.x+e.w+se&&e.y<t.y+t.h+se&&t.y<e.y+e.h+se}function tn(e,t,o=12){let n=(a,l)=>Math.min(Math.max(a,o),t.w-l-o),r=(a,l)=>Math.min(Math.max(a,o),t.h-l-o),i=[];for(let a of e){let l={...a,x:n(a.x,a.w),y:r(a.y,a.h)},c=!1;for(let x=0;x<16;x++){let d=i.find(u=>uo(u,l));if(!d)break;let g=l.axis==="x"?l.y:l.x;if(l.axis==="x"?l.y=r(c?d.y+d.h+se:d.y-l.h-se,l.h):l.x=n(c?d.x-l.w-se:d.x+d.w+se,l.w),(l.axis==="x"?l.y:l.x)===g){if(c)break;c=!0}}i.push(l)}return i}function nn(e,t){let{columns:o,gutter:n,margin:r}=e;if(o<=0)return[];let i=e.maxWidth>0?Math.min(e.maxWidth,t):t,a=Math.max(0,(t-i)/2),c=(Math.max(0,i-r*2)-n*(o-1))/o;if(c<=0)return[];let x=[];for(let d=0;d<o;d+=1)x.push({left:a+r+d*(c+n),width:c});return x}function on(e,t){return e*t>=8?e:0}function po(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(l=>parseFloat(l)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function He(e){let t=1,o=1;for(let n=e;n;n=Jt(n)){let r=po(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var Z=(e,t)=>({light:e,dark:t}),ot={accent:Z("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:Z("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:Z("oklch(1 0 0)","oklch(0.264 0 0)"),fg:Z("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:Z("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:Z("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:Z("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:Z("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)"),pixelLine:Z("oklch(0.205 0 0 / 0.14)","oklch(0.97 0 0 / 0.14)")};function an(e){return`light-dark(${e.light}, ${e.dark})`}var ie=an(Z("#fafafa","#1a1a1a"));function Re(e){return an(Z(`rgb(0 0 0 / ${e})`,`rgb(255 255 255 / ${e})`))}var rn=[0,.07,.08,.1,.12,.15,.2];function q(e){let t=rn[Math.max(0,Math.min(rn.length-1,e))];return t===0?ie:Re(t)}var N={primary:Re(.9),secondary:Re(.6),tertiary:Re(.4)},ce=Re(.12),fe="0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)",ln="0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)",w=22;var fo='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',C={title:13,body:12,tag:11,stack:fo},I={regular:400,medium:500,semibold:600},rt="__align_font",mo="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function sn(){if(document.getElementById(rt))return;let e=document.createElement("link");e.id=rt,e.rel="stylesheet",e.href=mo,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function cn(){document.getElementById(rt)?.remove()}function un(e){let t=[`${I.medium} ${C.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function it(e){let t={};for(let o of Object.keys(ot))t[o]=e?ot[o].dark:ot[o].light;return t}function at(){let e=document.documentElement,t=getComputedStyle(e).colorScheme;if(/dark/.test(t)&&!/light/.test(t))return!0;if(/light/.test(t)&&!/dark/.test(t))return!1;for(let o of[document.body,e]){if(!o)continue;let n=ho(getComputedStyle(o).backgroundColor);if(n!==null)return n<.5}return matchMedia("(prefers-color-scheme: dark)").matches}function ho(e){let t=/^rgba?\(([^)]+)\)$/.exec(e.trim());if(!t)return null;let o=t[1].split(/[\s,/]+/).filter(Boolean).map(Number),[n,r,i,a=1]=o;return n===void 0||r===void 0||i===void 0||a<.5?null:(.2126*n+.7152*r+.0722*i)/255}function ye(e,t){return e.replace(/\)$/,` / ${t})`)}var go=`
`,ae=16,xo=`
.dock {
  /* No color-scheme here: the overlay sets it inline on the shadow host, from
     what the page actually looks like rather than what the machine prefers, and
     it inherits down. Declaring 'light dark' again would undo that and hand
     light-dark() back to the media query. */
  position: fixed; left: ${ae}px; top: 0; width: 340px;
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none; user-select: none;
  font-family: ${C.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${N.primary};
  --muted: ${N.secondary};
  --border: ${ce};
}
.panel {
  padding: 10px; border-radius: 0;
  /* Five sections now \u2014 box, tokens, styled by, matches, colour \u2014 and on a
     laptop that is taller than the window. place() clamps the position but
     cannot rescue a panel taller than the screen, so it scrolls instead. */
  max-height: calc(100vh - ${ae*2}px);
  overflow-y: auto; overscroll-behavior: contain;
  font-size: ${C.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${ie};

  box-shadow: ${fe};

  /* The one animation in the tool: a panel that must land exactly, so the
     Fluid spring.moderate tier at 160ms, critically damped. */
  opacity: 0;
  transform: translateY(4px) scale(0.98);
  transform-origin: bottom left;
  transition: opacity 120ms cubic-bezier(0.2, 0, 0, 1),
              transform 120ms cubic-bezier(0.2, 0, 0, 1),
              box-shadow 120ms cubic-bezier(0.2, 0, 0, 1);
}
.dock[data-open] .panel {
  pointer-events: auto;
  opacity: 1;
  transform: none;
  /* Slow in, faster out \u2014 the exit above is one tier quicker. */
  transition-duration: 160ms;
}
@media (prefers-reduced-motion: reduce) {
  /* Fewer and gentler, not none: the fade aids comprehension, the travel does not. */
  .panel { transform: none; transition: opacity 120ms linear; }
}

header {
  /* Stays put while the body scrolls: it is also the drag handle, and a handle
     you have to scroll back up to find is not a handle. */
  position: sticky; top: -10px; z-index: 1;
  background: ${ie};
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] .panel { box-shadow: ${ln}; }
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${C.title}px; font-weight: ${I.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${C.body}px; font-weight: ${I.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${C.tag}px; font-weight: ${I.medium};
  margin-left: 4px;
  color: ${N.primary};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${C.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${q(1)}; }

/* Each region is one step up Fluid's surface ladder. Depth is carried by the
   surface and its shadow \u2014 no borders, the same way the system's own nesting
   example reads. Generous, even insets so each surface has room to breathe. */
.region {
  border-radius: 0;
  /* Symmetric. An extra-tall top to clear the label offset each box's centre
     from its parent's, and nesting compounded it until the side numbers were
     visibly staggered. The label shares the top number's line instead. */
  padding: 10px;
}
.region[data-level="1"] { background: ${q(1)}; }
.region[data-level="2"] { background: ${q(2)}; }
.region[data-level="3"] { background: ${q(3)}; }
.content { background: ${q(4)}; }

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
  font-size: ${C.tag}px; font-weight: ${I.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${I.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${I.regular}; }
.row { display: flex; align-items: center; gap: 5px; margin: 6px 0; }
.row > .edge { flex: 0 0 22px; }
.row > .fill { flex: 1 1 auto; min-width: 0; }

/* Type and tokens sit under the box, in the same muted register as the band
   labels \u2014 they annotate the measurement rather than competing with it. */
.readout {
  margin-top: 10px; padding-top: 10px;
  border-top: 1px solid var(--border);
}
.readout-tag { position: static; margin-bottom: 5px; }
/* One grid for the whole section rather than one per row, so every key in a
   section shares a column and the column sizes to the longest key in it. A
   fixed 62px was right until a diff started printing 'background-color', which
   it broke across two lines mid-word. The 62px floor keeps the rhythm the
   other sections already had. */
.readout-rows {
  display: grid; grid-template-columns: minmax(62px, max-content) 1fr;
  gap: 0 8px; align-items: baseline;
  font-size: ${C.tag}px; line-height: 1.5;
}
.readout-row { display: contents; }
.readout-key { color: var(--muted); white-space: nowrap; }
.readout-value { color: var(--fg); overflow-wrap: anywhere; }
.content {
  border-radius: 0; padding: 14px 8px;
  text-align: center; font-weight: ${I.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,Le=ae,me=-1,be=!1;function dn(e){let t=document.createElement("style");t.textContent=xo,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);let r=!1;function i(p,T){let M=document.createElement("div");M.className="readout";let b=document.createElement("div");b.className="tag readout-tag",b.textContent=p,M.appendChild(b);let B=document.createElement("div");B.className="readout-rows",M.appendChild(B);for(let[X,F]of T){let U=document.createElement("div");U.className="readout-row";let Y=document.createElement("span");Y.className="readout-key",Y.textContent=X;let H=document.createElement("span");H.className="readout-value",H.textContent=F,U.append(Y,H),B.appendChild(U)}return M}e.appendChild(o);let a=(p,T)=>Math.min(Math.max(p,ae),Math.max(ae,T-ae));function l(){let p=o.offsetHeight||300;me<0&&(me=Math.max(ae,innerHeight-p-ae)),Le=a(Le,innerWidth-o.offsetWidth),me=a(me,innerHeight-p),o.style.transform=`translate(${Le-ae}px, ${me}px)`}let c=null;function x(p){p.button===0&&(p.preventDefault(),p.stopPropagation(),c={x:p.clientX,y:p.clientY,dx:Le,dy:me},o.setAttribute("data-dragging",""),p.currentTarget.setPointerCapture(p.pointerId))}function d(p){c&&(Le=c.dx+(p.clientX-c.x),me=c.dy+(p.clientY-c.y),l())}function g(){c=null,o.removeAttribute("data-dragging")}addEventListener("resize",l);let u=null;function y(p){let T=document.createElement("div");return T.className="edge",T.textContent=p===0?"0":E(p),p===0&&T.setAttribute("data-zero",""),T}function $(p,T,M,b){let[B,X,F,U]=M,Y=document.createElement("div");Y.className="region",Y.setAttribute("data-level",String(T));let H=document.createElement("span");H.className="tag",H.textContent=p;let K=document.createElement("div");K.className="row";let s=document.createElement("div");s.className="fill",s.appendChild(b),K.append(y(U),s,y(X));let h=document.createElement("div");return h.className="head",h.append(H,y(B)),Y.append(h,K,y(F)),Y}return{show(p,T=[],M){let b=Ze(p.el),[B,X,F,U]=b.border,[Y,H,K,s]=b.padding,h=He(p.el),f=p.width/h.x,G=p.height/h.y,v=Math.abs(h.x-1)>.001||Math.abs(h.y-1)>.001,m=document.createElement("header"),R=document.createElement("span");R.className="name",R.textContent=p.label;let J=document.createElement("span");J.className="size",J.textContent=`${E(f)} \xD7 ${E(G)}`;let xe=document.createElement("button");if(xe.className="close",xe.textContent="\xD7",xe.title="close (B brings it back)",xe.addEventListener("pointerdown",k=>k.stopPropagation()),xe.addEventListener("click",k=>{k.stopPropagation(),be=!0,o.removeAttribute("data-open")}),m.append(R,J),v){let k=document.createElement("span");k.className="scale",k.textContent=`\xD7${E(h.x)}`,k.title=`renders at ${E(p.width)} \xD7 ${E(p.height)}`,m.appendChild(k)}m.appendChild(xe),m.addEventListener("pointerdown",x),m.addEventListener("pointermove",d),m.addEventListener("pointerup",g),m.addEventListener("pointercancel",g);let qe=document.createElement("div");qe.className="content",qe.textContent=`${E(f-U-X-s-H)} \xD7 ${E(G-B-F-Y-K)}`;let oe=[m,$("margin",1,b.margin,$("border",2,b.border,$("padding",3,b.padding,qe)))];if(r){let k=Nt(p.el),V=De(p.el);oe.push(V.length&&k?i("type",V.map(_=>[_.label,_.value])):i("type",[["","nothing of its own to set type on"]]))}if(M&&M.el!==p.el&&M.el.isConnected){let k=_t(M.el,p.el).map(_=>[_.prop,`${_.a||"\u2014"} \u2192 ${_.b||"\u2014"}`]),V=k.slice(0,10);k.length>V.length&&V.push(["",`and ${k.length-V.length} more`]),oe.push(i(`differs from ${M.label}`,V.length?V:[["","nothing in the properties it compares"]]))}let Ne=Yt(p.el);if(Ne&&Ne.rows.length&&oe.push(i(`laid out by ${Ne.display}`,Ne.rows.map(k=>[k.label,k.value]))),T.length){let k=T.map(_=>[E(_.px),_.detail]),V=It(T.map(_=>_.px));V&&k.push(["",V]),oe.push(i("gaps",k))}let wt=Dt(p.el),kt=Ot([f,G,...b.margin,...b.border,...b.padding,...r?De(p.el).map(k=>k.px):[]],wt);kt&&oe.push(i("tokens",[["",kt]]));let St=Xt(p.el);St.length&&oe.push(i("styled by",St.slice(0,4).map(k=>[k.selector,k.file])));let $t=Wt(p.el);$t>1&&oe.push(i("matches",[["",`${$t} elements share ${Qe(p.el)}`]]));let Et=wt.filter(k=>Je(k.value));if(Et.length){let k=zt(p.el).map(({label:V,value:_})=>{let Ct=Ht(_,Et);return[V,Ct.length?`${_}  ${Ct.join(" ")}`:`${_}  \u2014`]});k.length&&oe.push(i("colour",k))}n.replaceChildren(...oe),u=p,l(),!be&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},showsType:()=>r,isOpen:()=>!be&&u!==null,toggleType(){r=!r,u&&this.show(u)},asText(){if(!u)return"";let p=Ze(u.el),T=He(u.el),M=u.width/T.x,b=u.height/T.y,B=F=>F.map(U=>E(U)).join(" "),X=[`${u.label}  ${E(M)} \xD7 ${E(b)}`,`margin   ${B(p.margin)}`,`border   ${B(p.border)}`,`padding  ${B(p.padding)}`];if(r)for(let F of De(u.el))X.push(`${F.label.padEnd(8)} ${F.value}`);return X.join(go)},hide(){u=null,o.removeAttribute("data-open")},toggle(){u&&(be=!be,be?o.removeAttribute("data-open"):(l(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",l),o.remove(),t.remove()}}}function pn(e=20,t=1e3){let o=[];return{push(n,r,i=Date.now()){let a=o[o.length-1];if(a&&r!==""&&a.tag===r&&i-a.at<=t){a.at=i;return}o.push({state:n,tag:r,at:i}),o.length>e&&o.shift()},pop(){return o.pop()?.state??null},depth(){return o.length},clear(){o.length=0}}}var yo=[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure what is under the cursor"],["Click","lock an element"],["Right-click","add to, or drop from, the locked set"],["Drag the panel header","move the box model"],["B","hide or bring back the box model"],["R","rulers down the top and left edges"],["Drag from a rule","pull out a guide; drag it back to remove"],["V","vertical guide at the cursor"],["H","horizontal guide at the cursor"],["Hover a guide","distance from it to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the last guide you touched; Shift for 10px"],["L","pin that guide so it cannot be moved or deleted"],["Ctrl/Cmd + Z","undo the last change \u2014 a run of nudges counts as one"],["T","type and token readout for the locked element"],["F","freeze the page so a moving thing can be measured"],["G","your column grid, if one is configured"],["K","a ten-pixel texture to read against"],["X","x-ray: outline every element on the page"],["P","pick a colour from anywhere on screen"],["C","copy the numbers in the panel"],["Ctrl/Cmd while placing","ignore snapping"],["Del","remove the guide under the cursor; Shift+Del for all"],["Esc","clear the locks, then close"]],he=16,lt=C.tag+12,st=8,bo=`
.flag {
  position: fixed; top: ${he}px; right: ${he}px;
  display: flex; align-items: center; gap: 8px;
  transition: top 160ms cubic-bezier(0.19, 1, 0.22, 1);
  padding: 6px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${C.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${C.tag}px; font-weight: ${I.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${N.primary};
  background: ${ie};
  box-shadow: ${fe};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
/* The rulers draw a gutter along the top edge, and the badge sits in it. Step
   down out of the way rather than covering the ticks the rulers exist to show. */
.flag[data-rulers] { top: ${he+w}px; }
.help[data-rulers] { top: ${he+w+lt+st}px; }
.flag:hover { background: ${q(1)}; }
.flag .count { color: ${N.secondary}; }

/* A layers bar, not a palette. Switches, then the one control that changes the
   page, then the things that happen once. */
.tools { display: flex; align-items: center; gap: 2px; }
.sep {
  width: 1px; align-self: stretch; margin: 0 4px;
  background: ${ce};
}
.tool {
  width: 20px; height: 20px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; cursor: pointer;
  font: inherit; font-size: ${C.tag}px; font-weight: ${I.medium};
  color: ${N.tertiary};
}
.tool:hover { background: ${q(2)}; color: ${N.primary}; }
.tool:focus-visible { outline: 1px solid ${N.primary}; outline-offset: -1px; }
/* On is the film, not a colour: the three hues each already mean something on
   the canvas, and a fourth here would say nothing. */
.tool[data-on] { background: ${q(4)}; color: ${N.primary}; }
.tool[data-once]:active { background: ${q(4)}; }
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: ${he+lt+st}px; right: ${he}px; width: 292px;
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${he*2+lt+st}px); overflow-y: auto;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${C.stack};
  font-synthesis: none;
  font-size: ${C.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${N.primary};
  background: ${ie};
  box-shadow: ${fe};
  display: none;
}
.help[data-open] { display: block; }
/* Baselines, not boxes. A key sits in a bordered chip and its description does
   not, so aligning the two boxes puts the key's text 4px below the first line
   of the text it labels \u2014 right on one-line rows by luck, wrong on every row
   that wraps. Aligning on the baseline is right on both. */
.help dl {
  display: grid; grid-template-columns: auto 1fr;
  /* Baseline alignment already buys each wrapped row 4px of separation, so
     the gap stays where it was rather than pushing the list off the screen. */
  align-items: baseline; gap: 6px 10px; margin: 0;
}
.help dt { justify-self: start; }
.help kbd {
  display: inline-block; padding: 3px 5px;
  font: inherit; font-weight: ${I.medium};
  border: 1px solid ${ce};
  background: ${q(2)};
}
.help dd { margin: 0; color: ${N.secondary}; }
`,fn=[{name:"rulers",label:"R",title:"rulers down the top and left edges",toggle:!0},{name:"xray",label:"X",title:"outline every element on the page",toggle:!0},{name:"grid",label:"G",title:"your column grid, if one is configured",toggle:!0},{name:"pixels",label:"K",title:"a ten-pixel texture to read against",toggle:!0},{name:"type",label:"T",title:"type and token readout",toggle:!0},{name:"panel",label:"B",title:"the box model panel",toggle:!0},{name:"freeze",label:"F",title:"hold the page still",toggle:!0},{name:"copy",label:"C",title:"copy the numbers in the panel",toggle:!1},{name:"pick",label:"P",title:"pick a colour from anywhere on screen",toggle:!1},{name:"undo",label:"\u21BA",title:"undo the last change to the guides",toggle:!1}];function mn(e,t){let o=document.createElement("style");o.textContent=bo,e.appendChild(o);let n=document.createElement("div");n.className="flag";let r=document.createElement("span");r.className="name",r.textContent="Align";let i=document.createElement("span");i.className="count";let a=new Map,l=document.createElement("div");l.className="tools";for(let d of fn){if(d.name==="freeze"||d.name==="copy"){let u=document.createElement("span");u.className="sep",l.appendChild(u)}let g=document.createElement("button");g.type="button",g.className="tool",g.textContent=d.label,g.title=`${d.title}  \xB7  ${d.name==="undo"?"Ctrl/Cmd+Z":d.label}`,d.toggle||g.setAttribute("data-once",""),g.addEventListener("click",u=>{u.stopPropagation(),t(d.name)}),a.set(d.name,g),l.appendChild(g)}n.append(r,l,i);let c=document.createElement("div");c.className="help";let x=document.createElement("dl");for(let[d,g]of yo){let u=document.createElement("dt"),y=document.createElement("kbd");y.textContent=d,u.appendChild(y);let $=document.createElement("dd");$.textContent=g,x.append(u,$)}return c.appendChild(x),n.addEventListener("click",d=>{d.stopPropagation(),c.toggleAttribute("data-open")}),e.append(n,c),{update(d,g){i.textContent=d>0?`${d} locked`:"",n.toggleAttribute("data-rulers",g.rulers),c.toggleAttribute("data-rulers",g.rulers);for(let u of fn)u.toggle&&a.get(u.name)?.toggleAttribute("data-on",g[u.name]===!0)},closeHelp(){let d=c.hasAttribute("data-open");return c.removeAttribute("data-open"),d},destroy(){n.remove(),c.remove(),o.remove()}}}var ze=5,ct=4,Me=12,hn=.22,ve=10,vo=50,wo=100;function gn(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,grid:null,pixels:!1,guides:[],liveGuide:null,activeGuide:null},i=it(at()),a=0,l=null;function c(){let s=at();s!==l&&(l=s,i=it(s),e.style.colorScheme=s?"dark":"light",K())}c();let x=matchMedia("(prefers-color-scheme: dark)"),d=()=>c();x.addEventListener("change",d);let g=new MutationObserver(()=>c());function u(){g.disconnect(),g.observe(document.documentElement,{attributes:!0}),document.body&&g.observe(document.body,{attributes:!0})}u(),un(()=>K());function y(){let s=devicePixelRatio;o.width=Math.round(innerWidth*s),o.height=Math.round(innerHeight*s),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(s,0,0,s,0,0),n.translate(.5,.5)}let $=s=>Math.round(s)-.5;function p(s,h){n.strokeStyle=h,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(s.left),Math.round(s.top),Math.round(s.width),Math.round(s.height))}function T(s){n.strokeStyle=ye(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let h of[s.left,s.right])n.moveTo(Math.round(h),0),n.lineTo(Math.round(h),innerHeight);for(let h of[s.top,s.bottom])n.moveTo(0,Math.round(h)),n.lineTo(innerWidth,Math.round(h));n.stroke(),n.setLineDash([])}function M(s){if(n.strokeStyle=s.extension?ye(i.measure,.55):i.measure,n.lineWidth=1,n.setLineDash(s.extension?[3,3]:[]),n.beginPath(),n.moveTo(Math.round(s.x1),Math.round(s.y1)),n.lineTo(Math.round(s.x2),Math.round(s.y2)),s.extension){n.stroke();return}if(s.axis==="x")for(let h of[s.x1,s.x2])n.moveTo(Math.round(h),Math.round(s.y1)-ze),n.lineTo(Math.round(h),Math.round(s.y1)+ze);else for(let h of[s.y1,s.y2])n.moveTo(Math.round(s.x1)-ze,Math.round(h)),n.lineTo(Math.round(s.x1)+ze,Math.round(h));n.stroke()}function b(s){return n.font=`${I.medium} ${C.body}px ${C.stack}`,{w:n.measureText(s).width+ct*2,h:C.body+ct*2+2}}function B(s,h,f,G){n.font=`${I.medium} ${C.body}px ${C.stack}`,n.textBaseline="middle";let{w:v,h:m}=b(s),R=$(Math.min(Math.max(h,Me),innerWidth-v-Me)),J=$(Math.min(Math.max(f,Me),innerHeight-m-Me));n.fillStyle=G,n.beginPath(),n.roundRect(R,J,Math.ceil(v),m,4),n.fill(),n.fillStyle=i.surface,n.fillText(s,R+ct,J+m/2)}function X(s,h,f,G,v=!1){let{w:m,h:R}=b(s);B(s,v?h-m/2:h,v?f-R/2:f,G)}function F(){let s=scrollX,h=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,w),n.fillRect(-.5,-.5,w,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${I.regular} 9px ${C.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let m of r.pinned)n.fillRect($(m.left),-.5,Math.round(m.width),w),n.fillRect(-.5,$(m.top),w,Math.round(m.height));n.restore(),n.beginPath(),n.moveTo(-.5,w-.5),n.lineTo(innerWidth,w-.5),n.moveTo(w-.5,-.5),n.lineTo(w-.5,innerHeight),n.stroke();let f=m=>m%wo===0?w:m%vo===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let G=Math.floor(s/ve)*ve;for(let m=G;m<s+innerWidth;m+=ve){let R=Math.round(m-s);if(R<w)continue;let J=f(m);n.moveTo(R,w-J),n.lineTo(R,w),J===w&&(n.fillStyle=i.muted,n.fillText(String(m),R+3,3))}n.stroke(),n.beginPath();let v=Math.floor(h/ve)*ve;for(let m=v;m<h+innerHeight;m+=ve){let R=Math.round(m-h);if(R<w)continue;let J=f(m);n.moveTo(w-J,R),n.lineTo(w,R),J===w&&(n.save(),n.translate(3,R-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(m),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),w),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo(w,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let m of r.guides){let R=Math.round(Te(m));m.axis==="x"?n.fillRect(R-1,-.5,2,w):n.fillRect(-.5,R-1,w,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,w,w),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,w,w)}function U(){let s=on(10,1);if(s){n.strokeStyle=i.pixelLine,n.lineWidth=1,n.setLineDash([]),n.beginPath();for(let h=0;h<=innerWidth;h+=s)n.moveTo(h,0),n.lineTo(h,innerHeight);for(let h=0;h<=innerHeight;h+=s)n.moveTo(0,h),n.lineTo(innerWidth,h);n.stroke()}}function Y(s){let h=nn(s,document.documentElement.clientWidth);n.fillStyle=ye(i.measure,.08);for(let f of h)n.fillRect($(f.left),-.5,Math.round(f.width),innerHeight+1)}function H(){a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore(),(r.pixels||r.grid)&&(n.save(),r.rulers&&(n.beginPath(),n.rect(w,w,innerWidth,innerHeight),n.clip()),r.pixels&&U(),r.grid&&Y(r.grid),n.restore());for(let f of r.pinned)p(f,i.accent);r.hover&&(T(r.hover),p(r.hover,r.pinned.length?ye(i.accent,.7):i.accent));for(let f of r.guides){let G=r.liveGuide?.id===f.id;n.strokeStyle=f.locked||G?i.guide:ye(i.guide,.55),n.lineWidth=f.pinned?2:1,n.setLineDash(f.locked?[]:[4,4]),n.beginPath();let v=Math.round(Te(f));if(f.axis==="x"?(n.moveTo(v,0),n.lineTo(v,innerHeight)):(n.moveTo(0,v),n.lineTo(innerWidth,v)),n.stroke(),r.activeGuide===f.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let m=7;f.axis==="x"?(n.moveTo(v,0),n.lineTo(v,m),n.moveTo(v,innerHeight-m),n.lineTo(v,innerHeight)):(n.moveTo(0,v),n.lineTo(m,v),n.moveTo(innerWidth-m,v),n.lineTo(innerWidth,v)),n.stroke()}}for(let f of r.lines)n.globalAlpha=f.faded?hn:1,M(f);n.globalAlpha=1;let s=r.lines.filter(f=>f.label!==""),h=s.map(f=>{let G=(f.x1+f.x2)/2,v=(f.y1+f.y2)/2,{w:m,h:R}=b(f.label);return f.axis==="x"?{x:G-m/2,y:v-16-R/2,w:m,h:R,axis:f.axis}:{x:G+26-m/2,y:v-R/2,w:m,h:R,axis:f.axis}});if(tn(h,{w:innerWidth,h:innerHeight},Me).forEach((f,G)=>{let v=s[G];n.globalAlpha=v.faded?hn:1,B(v.label,f.x,f.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:f,height:G,scale:v}=r.hover;X(`${E(f/v.x)} \xD7 ${E(G/v.y)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let f=r.liveGuide,G=Math.round(Te(f));X([`${f.axis} ${E(f.at)}`,f.caught,f.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),f.axis==="x"?G+6:30,f.axis==="x"?30:G+6,i.guide)}r.rulers&&F()}function K(){a||(a=requestAnimationFrame(H))}return y(),{root:t,update(s){Object.assign(r,s),K()},resize(){y(),K()},destroy(){a&&cancelAnimationFrame(a),x.removeEventListener("change",d),g.disconnect(),e.remove()}}}function ko(e){let t=e.trim().replace(/^#/,""),o=t.length===3?t.split("").map(n=>n+n).join(""):t;return/^[0-9a-f]{6}$/i.test(o)?{r:parseInt(o.slice(0,2),16),g:parseInt(o.slice(2,4),16),b:parseInt(o.slice(4,6),16)}:null}function So({r:e,g:t,b:o}){let n=r=>Math.round(r).toString(16).padStart(2,"0");return`#${n(e)}${n(t)}${n(o)}`}function $o({r:e,g:t,b:o}){return`rgb(${Math.round(e)} ${Math.round(t)} ${Math.round(o)})`}function ge(e,t){return String(Number(e.toFixed(t)))}function Eo({r:e,g:t,b:o}){let n=e/255,r=t/255,i=o/255,a=Math.max(n,r,i),l=Math.min(n,r,i),c=(a+l)/2,x=a-l,d=0,g=0;return x!==0&&(g=x/(1-Math.abs(2*c-1)),a===n?d=(r-i)/x%6:a===r?d=(i-n)/x+2:d=(n-r)/x+4,d*=60,d<0&&(d+=360)),`hsl(${ge(d,1)} ${ge(g*100,1)}% ${ge(c*100,1)}%)`}function ut(e){let t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4}function Co(e){let t=ut(e.r),o=ut(e.g),n=ut(e.b),r=.4122214708*t+.5363325363*o+.0514459929*n,i=.2119034982*t+.6806995451*o+.1073969566*n,a=.0883024619*t+.2817188376*o+.6299787005*n,l=Math.cbrt(r),c=Math.cbrt(i),x=Math.cbrt(a),d=.2104542553*l+.793617785*c-.0040720468*x,g=1.9779984951*l-2.428592205*c+.4505937099*x,u=.0259040371*l+.7827717662*c-.808675766*x,y=Math.sqrt(g*g+u*u),$=Math.atan2(u,g)*180/Math.PI;return $<0&&($+=360),y<1e-4?`oklch(${ge(d,4)} 0 0)`:`oklch(${ge(d,4)} ${ge(y,4)} ${ge($,2)})`}function xn(e){let t=ko(e);return t?[{label:"hex",value:So(t)},{label:"rgb",value:$o(t)},{label:"hsl",value:Eo(t)},{label:"oklch",value:Co(t)}]:[]}var To=`
.picker {
  position: fixed; top: 46px; right: 16px; width: 200px;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${C.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${C.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${N.primary};
  background: ${ie};
  box-shadow: ${fe};
  display: none;
}
.picker[data-open] { display: block; }
.picker .swatch {
  height: 40px; margin-bottom: 8px;
  border: 1px solid ${ce};
}
/* Each row copies itself, so the whole row is the target rather than the text. */
.picker button {
  display: grid; grid-template-columns: 34px 1fr;
  gap: 8px; align-items: baseline;
  width: 100%; padding: 3px 4px; margin: 0;
  border: 0; background: none; cursor: pointer;
  font: inherit; text-align: left;
  color: ${N.primary};
}
.picker button:hover { background: ${q(2)}; }
.picker button:focus-visible { outline: 1px solid ${N.primary}; outline-offset: -1px; }
.picker .k { color: ${N.secondary}; }
.picker .v { overflow-wrap: anywhere; }
.picker .hint {
  margin-top: 6px; padding-top: 6px;
  border-top: 1px solid ${ce};
  color: ${N.secondary};
}
`;function yn(e){let t=document.createElement("style");t.textContent=To,e.appendChild(t);let o=document.createElement("div");o.className="picker",e.appendChild(o);let n=document.createElement("div");n.className="swatch";let r=document.createElement("div");r.className="hint";function i(a){n.style.background=a;let l=xn(a).map(({label:c,value:x})=>{let d=document.createElement("button");d.type="button";let g=document.createElement("span");g.className="k",g.textContent=c;let u=document.createElement("span");return u.className="v",u.textContent=x,d.append(g,u),d.addEventListener("click",y=>{y.stopPropagation(),navigator.clipboard?.writeText(x).then(()=>{r.textContent=`copied ${c}`},()=>{r.textContent="clipboard refused"})}),d});r.textContent="click a row to copy",o.replaceChildren(n,...l,r),o.setAttribute("data-open","")}return{async open(){let a=window.EyeDropper;if(!a){o.replaceChildren(Object.assign(document.createElement("div"),{className:"hint",textContent:"this browser has no eyedropper"})),o.setAttribute("data-open","");return}try{let{sRGBHex:l}=await new a().open();i(l)}catch{}},close(){let a=o.hasAttribute("data-open");return o.removeAttribute("data-open"),a},destroy(){o.remove(),t.remove()}}}var dt="__align_freeze",Ro=`
[data-align-frozen] *:not([data-align-ignore]):not([data-align-ignore] *) {
  animation-play-state: paused !important;
}
`,pt=!1,We=[],Xe=[];function bn(e){let t=e;for(;t;){if(t instanceof Element&&t.hasAttribute("data-align-ignore"))return!0;let o=t.getRootNode();if(t=o instanceof ShadowRoot?o.host:t.parentNode??null,t===document)return!1}return!1}function Ge(){return pt}function Ye(e){if(e!==pt){if(pt=e,!e){document.documentElement.removeAttribute("data-align-frozen"),document.getElementById(dt)?.remove();for(let t of We)try{t.play()}catch{}for(let t of Xe)t.play().catch(()=>{});We=[],Xe=[];return}if(!document.getElementById(dt)){let t=document.createElement("style");t.id=dt,t.textContent=Ro,t.setAttribute("data-align-ignore",""),document.head.appendChild(t)}document.documentElement.setAttribute("data-align-frozen",""),We=[];try{for(let t of document.getAnimations()){if(t.playState!=="running")continue;let o=t.effect?.target??null;bn(o)||(t.pause(),We.push(t))}}catch{}Xe=[];for(let t of Array.from(document.querySelectorAll("video")))t.paused||bn(t)||(t.pause(),Xe.push(t))}}var ft="__align_xray",Lo=`
[data-align-xray] * { outline: 1px solid rgb(128 128 128 / 0.55) !important; }
[data-align-xray] [data-align-ignore],
[data-align-xray] [data-align-ignore] * { outline: none !important; }
`;function Ke(e){let t=document.documentElement;if(!e){t.removeAttribute("data-align-xray"),document.getElementById(ft)?.remove();return}if(!document.getElementById(ft)){let o=document.createElement("style");o.id=ft,o.textContent=Lo,o.setAttribute("data-align-ignore",""),document.head.appendChild(o)}t.setAttribute("data-align-xray","")}var mt="align-ui";function vn(e){try{return localStorage.getItem(e)}catch{return null}}function wn(e,t){try{localStorage.setItem(e,t)}catch{}}function kn(e){let t="/";try{t=location.pathname||"/"}catch{}return`${mt}:${e}::${t}`}function Mo(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function Sn(){let e=vn(kn("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(Mo).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function $n(e){wn(kn("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function _e(e){return vn(`${mt}:${e}`)==="1"}function Ae(e,t){wn(`${mt}:${e}`,t?"1":"0")}var j,L=null,W=null,de=null,Ce=null,te=!1,ke=_e("grid"),Se=_e("pixels"),D=null,S=[],Ue=0,ne=_e("rulers"),A=[],An=1,En=!1,le=null,xt=pn();function Go(){return A.map(e=>({...e}))}function $e(e=""){xt.push(Go(),e)}function Cn(){return A.find(e=>e.id===le)??null}function ue(e){A=e,$n(A)}var P=null,ee=null,Q=null,Ao=3,we=22;function Bn(e,t){return ne?t<we&&e>=we?"y":e<we&&t>=we?"x":null:null}function yt(e){return e.ctrlKey||e.metaKey}function Nn(e,t,o,n){let r=pe(t,o,j),i=e.axis==="x"?t:o,a=A.filter(c=>c.id!==e.id).map(c=>({axis:c.axis,at:Be(c).pos})),l=Qt(i,Zt(r,e.axis,a),n);e.at=l.at+(e.axis==="x"?scrollX:scrollY),e.caught=l.what}function Dn(e,t,o,n){let r={id:An++,axis:e,at:0,locked:!1,caught:"",pinned:!1};return $e(),Nn(r,t,o,n),ue([...A,r]),le=r.id,r}function On(e){e.pinned||($e(),ue(A.filter(t=>t.id!==e.id)),ee?.id===e.id&&(ee=null),P?.id===e.id&&(P=null))}function Bo(e){let t=j.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function Be(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function bt(){return S.length>=2?S[S.length-2]:void 0}function vt(){if(S.length<2)return[];let e=[];for(let[t,o]of et(S))for(let n of Ie(t,o)){if(n.extension||!n.label)continue;let r=Pt(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:Ft(r)})}return e}function O(e){let t=S[S.length-1],o=D&&S.some(u=>u.el===D.el),n=A.map(Be),r=!P&&ee?ee:null,i=A.filter(u=>u.locked||u.id===r?.id),a=!r&&o?D.el:null,l=r??a,c=r?Be(r):null,x=[],d=(u,y)=>{for(let $ of u)x.push(l&&!y?{...$,faded:!0}:$)},g=u=>!c||u.axis!==c.axis?!1:(u.axis==="x"?[u.x1,u.x2]:[u.y1,u.y2]).some($=>Math.abs($-c.pos)<.5);for(let[u,y]of et(S))d(Ie(u,y),u.el===a||y.el===a);t&&D&&!o&&!r&&d(Ie(t,D),!0);for(let u of i)for(let y of S)d(nt(y,[Be(u)]),u.id===r?.id||y.el===a);D&&!o&&!r&&A.length&&d(nt(D,n),!0);for(let u of en(i.map(Be),{x:innerWidth/2,y:innerHeight/2}))d([u],g(u));L?.update({hover:D,pinned:S,rulers:ne,grid:ke&&j.grid?j.grid:null,pixels:Se,guides:A,liveGuide:P??ee,activeGuide:le,lines:x,...e?{cursor:e}:{}}),de?.update(S.length,{rulers:ne,xray:te,grid:ke,pixels:Se,freeze:Ge(),type:W?.showsType()??!1,panel:W?.isOpen()??!1})}function Pn(){let e=W?.asText()??"";e&&navigator.clipboard?.writeText(e).catch(()=>{})}function Fn(){let e=xt.pop();e&&(ue(e),ee=null,P=null,Q=null,e.some(t=>t.id===le)||(le=null))}function ht(e){switch(e){case"rulers":ne=!ne,Ae("rulers",ne);break;case"xray":te=!te,Ke(te);break;case"grid":ke=!ke,Ae("grid",ke);break;case"pixels":Se=!Se,Ae("pixels",Se);break;case"freeze":Ye(!Ge());break;case"type":W?.toggleType();break;case"panel":W?.toggle();break;case"copy":Pn();break;case"pick":Ce?.open();break;case"undo":Fn();break}O()}var je=null;function In(e){if(je={x:e.clientX,y:e.clientY},P){Q&&Math.hypot(e.clientX-Q.x,e.clientY-Q.y)>Ao&&(Q=null),!Q&&!P.pinned&&(Nn(P,e.clientX,e.clientY,yt(e)),ue([...A])),O({x:e.clientX,y:e.clientY});return}ee=tt(A,e.clientX,e.clientY),D=pe(e.clientX,e.clientY,j),O({x:e.clientX,y:e.clientY})}function Hn(e){P&&(Q?(P.locked=!P.locked,le=P.id,ue([...A])):(Bn(e.clientX,e.clientY)||e.clientX<we||e.clientY<we)&&On(P),Q=null,P=null,O({x:e.clientX,y:e.clientY}))}function zn(e){if(e.button!==0)return;let t=pe(e.clientX,e.clientY,j);if(!t)return;let o=Bn(e.clientX,e.clientY);if(o){Ee(e),Q=null,P=Dn(o,e.clientX,e.clientY,yt(e)),O({x:e.clientX,y:e.clientY});return}let n=tt(A,e.clientX,e.clientY);if(n){Ee(e),$e(),le=n.id,P=n,Q={x:e.clientX,y:e.clientY},O({x:e.clientX,y:e.clientY});return}Ee(e),de?.closeHelp(),S=[t],D=t,W?.show(t,vt(),bt()),O({x:e.clientX,y:e.clientY})}function Wn(e){let t=pe(e.clientX,e.clientY,j);if(!t)return;Ee(e),de?.closeHelp();let o=S.findIndex(r=>r.el===t.el);S=o>=0?S.filter((r,i)=>i!==o):[...S,t],D=t;let n=S[S.length-1];n?W?.show(n,vt(),bt()):W?.hide(),O({x:e.clientX,y:e.clientY})}function Xn(e){pe(e.clientX,e.clientY,j)&&Ee(e)}function Yn(e){pe(e.clientX,e.clientY,j)&&Ee(e)}function Ee(e){e.preventDefault(),e.stopPropagation()}function Tn(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var Rn=0,Ln=0;function Kn(){Ue=requestAnimationFrame(Kn);let t=S.filter(l=>l.el.isConnected).map(l=>Fe(l.el)),o=D&&D.el.isConnected?Fe(D.el):null;if(!(scrollX!==Rn||scrollY!==Ln||t.length!==S.length||t.some((l,c)=>!Tn(l,S[c]))||D===null!=(o===null)||D!==null&&o!==null&&!Tn(D,o)))return;Rn=scrollX,Ln=scrollY,S=t,D=o;let i=S[S.length-1],a=No();a!==Mn&&(Mn=a,i?W?.show(i,vt(),bt()):W?.hide()),O()}var Mn="";function No(){let e=S[0];return e?S.map(t=>[t.label,Math.round(t.width*100),Math.round(t.height*100),Math.round((t.left-e.left)*100),Math.round((t.top-e.top)*100)].join(",")).join(";"):""}function _n(){L?.resize()}function Do(){En||(En=!0,A=Sn().map(e=>({...e,id:An++}))),!L&&(sn(),L=gn(),W=dn(L.root),de=mn(L.root,ht),Ce=yn(L.root),de.update(0,{rulers:ne,xray:te,grid:ke,pixels:Se,freeze:Ge(),type:!1,panel:!1}),addEventListener("mousemove",In),addEventListener("mousedown",zn,{capture:!0}),addEventListener("mouseup",Hn,{capture:!0}),addEventListener("click",Xn,{capture:!0}),addEventListener("auxclick",Yn,{capture:!0}),addEventListener("contextmenu",Wn,{capture:!0}),addEventListener("resize",_n),Ue=requestAnimationFrame(Kn),O())}function gt(){removeEventListener("mousemove",In),removeEventListener("mousedown",zn,{capture:!0}),removeEventListener("mouseup",Hn,{capture:!0}),removeEventListener("click",Xn,{capture:!0}),removeEventListener("auxclick",Yn,{capture:!0}),removeEventListener("contextmenu",Wn,{capture:!0}),removeEventListener("resize",_n),cancelAnimationFrame(Ue),Ue=0,de?.destroy(),Ce?.destroy(),Ce=null,te&&(te=!1,Ke(!1)),Ye(!1),de=null,W?.destroy(),W=null,L?.destroy(),L=null,cn(),D=null,S=[],P=null,Q=null,ee=null}function Gn(e){if(Bo(e))e.preventDefault(),L?gt():Do();else if(L&&je&&(e.key.toLowerCase()===j.guideKeys.vertical||e.key.toLowerCase()===j.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===j.guideKeys.vertical?"x":"y";Dn(t,je.x,je.y,yt(e)),O()}else if(L&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?($e(),ue(A.filter(t=>t.pinned)),ee=null,P=null,Q=null,A.some(t=>t.id===le)||(le=null)):ee&&On(ee),O();else if(L&&e.key.startsWith("Arrow")){let t=Cn(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;$e(`nudge:${t.id}`);let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",ue([...A]),O()}else if(L&&e.key.toLowerCase()==="g"){e.preventDefault(),ht("grid");return}else if(L&&e.key.toLowerCase()==="k"){e.preventDefault(),ht("pixels");return}else if(L&&e.key.toLowerCase()==="f")e.preventDefault(),Ye(!Ge()),O();else if(L&&e.key.toLowerCase()==="x")e.preventDefault(),te=!te,Ke(te);else if(L&&e.key.toLowerCase()==="p")e.preventDefault(),Ce?.open();else if(L&&e.key.toLowerCase()==="t")e.preventDefault(),W?.toggleType();else if(L&&e.key.toLowerCase()==="c")e.preventDefault(),Pn();else if(L&&e.key.toLowerCase()==="l"){let t=Cn();if(!t)return;e.preventDefault(),$e(),t.pinned=!t.pinned,ue([...A]),O()}else if(L&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){if(xt.depth()===0)return;e.preventDefault(),Fn(),O()}else if(L&&e.key.toLowerCase()===j.rulerKey)e.preventDefault(),ne=!ne,Ae("rulers",ne),O();else if(L&&e.key.toLowerCase()===j.panelKey)e.preventDefault(),W?.toggle();else if(e.key==="Escape"&&L){if(Ce?.close()||de?.closeHelp())return;S.length?(S=[],W?.hide(),O()):gt()}}function gr(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,j=Ut(e),addEventListener("keydown",Gn,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{gt(),removeEventListener("keydown",Gn,{capture:!0}),delete window.__align})}export{gr as initAlign};
