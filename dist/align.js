function ye(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function Tr(e){return(e.split(",")[0]??"").trim().replace(/^['"]|['"]$/g,"")}function Ar(e){let o={100:"thin",200:"extralight",300:"light",400:"regular",500:"medium",600:"semibold",700:"bold",800:"extrabold",900:"black"}[e.trim()];return o?`${e} ${o}`:e}function Rt(e){let t=getComputedStyle(e);return[{label:"family",value:Tr(t.fontFamily),px:NaN},{label:"size",value:t.fontSize,px:ye(t.fontSize)},{label:"weight",value:Ar(t.fontWeight),px:NaN},{label:"line",value:t.lineHeight,px:ye(t.lineHeight)},{label:"tracking",value:t.letterSpacing,px:ye(t.letterSpacing)}]}function jn(e){let t="";for(let o of e.childNodes)o.nodeType===3&&(t+=o.nodeValue??"");return t.trim().replace(/\s+/g," ")}function Pt(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:ye(r)})}return o}function ln(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function Lr(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function Un(e,t){if(t.length===0)return"";let o=[],n=0;for(let i of Lr(e)){let a=ln(i,t);a.length?o.push(`${Nr(i)} ${a.join(" ")}`):n+=1}if(o.length===0)return n===1?"its one number is not on the scale":`none of its ${n} numbers are on the scale`;let r=n===0?"":n===1?"  \xB7  1 more, not on the scale":`  \xB7  ${n} more, not on the scale`;return o.join("  \xB7  ")+r}function Nr(e){return String(Math.round(e*100)/100)}function zn(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(ye)}function Vn(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),s=a.display.includes("flex")||a.display.includes("grid"),l=n==="x"?a.columnGap:a.rowGap,E=s&&l!=="normal"?ye(l):null,[$,L,y,p]=zn(e),[g,x,T,b]=zn(t),S=D=>Number.isFinite(D)?D:0,z=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,j=n==="x"?z?S(L)+S(b):S(x)+S(p):z?S(y)+S(g):S(T)+S($);return{px:o,cssGap:E,margins:j,siblings:!0}}function qn(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function Zn(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}function wt(e){let t=e.trim().toLowerCase();return t?t.startsWith("#")||/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(t)?!0:["black","white","transparent","currentcolor"].includes(t):!1}var Oe;function Fn(e){if(Oe===void 0&&(Oe=document.createElement("canvas").getContext("2d")),!Oe)return"";Oe.fillStyle="#000000",Oe.fillStyle=e;let t=Oe.fillStyle;return Oe.fillStyle="#ffffff",Oe.fillStyle=e,t===Oe.fillStyle?String(t):""}function Dt(e,t){let o=Fn(e);return o?t.filter(n=>wt(n.value)&&Fn(n.value)===o).map(n=>n.name).sort():[]}function Jn(e){let t=getComputedStyle(e),o=[],n=(r,i)=>{let a=i.trim();!a||a==="transparent"||/rgba?\([^)]*,\s*0\s*\)$/.test(a)||o.push({label:r,value:a})};return n("text",t.color),n("background",t.backgroundColor),o}function Rr(e,t,o){let n=r=>typeof CSS<"u"&&CSS.escape?CSS.escape(r):r.replace(/[^\w-]/g,"\\$&");return t?`#${n(t)}`:o.length?e+o.map(r=>`.${n(r)}`).join(""):e}function vt(e){let t=typeof e.className=="string"?e.className.trim().split(/\s+/).filter(Boolean):[];return Rr(e.tagName.toLowerCase(),e.id,t)}function Qn(e){let t=vt(e);if(!/[.#]/.test(t))return 0;try{return document.querySelectorAll(t).length}catch{return 0}}function Pr(e){if(!e)return"inline <style>";let t=e.split("?")[0]??e;try{let o=new URL(t,"http://x").pathname;return decodeURI(o).replace(/^\//,"")||t}catch{return t}}var Dr=["width","height","padding","margin","border-width","gap","font-size","line-height","letter-spacing","color","background-color"];function Ir(e){for(let t=0;t<e.length;t+=1){let o=e.item(t);if(Dr.some(n=>o===n||o.startsWith(`${n}-`)))return!0}return!1}function eo(e){let t=[],o=new Set,n=(r,i)=>{for(let a of Array.from(r)){if(a instanceof CSSMediaRule){matchMedia(a.conditionText).matches&&n(a.cssRules,i);continue}if(a instanceof CSSSupportsRule){CSS.supports(a.conditionText)&&n(a.cssRules,i);continue}let s=a.cssRules;if(s&&!(a instanceof CSSStyleRule)){n(s,i);continue}if(!(a instanceof CSSStyleRule))continue;let l=!1;try{l=e.matches(a.selectorText)}catch{continue}if(!l||!Ir(a.style))continue;let E=`${a.selectorText}|${i}`;o.has(E)||(o.add(E),t.push({selector:a.selectorText,file:i}))}};for(let r of Array.from(document.styleSheets)){if(r.ownerNode instanceof Element&&r.ownerNode.hasAttribute("data-align-ignore"))continue;let i;try{i=r.cssRules}catch{continue}n(i,Pr(r.href))}return t.reverse()}function Wn(e){if(!e||e==="none")return[];let t=e.trim().split(/\s+/),o=[];for(let n of t){if(!n.endsWith("px"))return[];let r=Number.parseFloat(n);if(!Number.isFinite(r))return[];o.push(r)}return o}function _n(e,t,o){let n=0;for(let r=0;r<e.length;r+=1){let i=n+e[r];if(o<i+.5)return r;n=i+t}return-1}function Hr(e,t){let o=t==="rtl";return e.startsWith("vertical")||e.startsWith("sideways")?{inline:"y",inlineReversed:e==="sideways-lr"?!o:o,blockReversed:e==="vertical-rl"||e==="sideways-rl"}:{inline:"x",inlineReversed:o,blockReversed:!1}}function Xn(e,t,o,n,r){return r?t-n:o-e}function to(e){let t=e.parentElement,o=0;for(;t&&getComputedStyle(t).display==="contents";)t=t.parentElement,o+=1;if(!t)return null;let n=getComputedStyle(t),r=getComputedStyle(e),i=n.display,a=[];if(o>0&&a.push({label:"through",value:o===1?"a display: contents parent":`${o} display: contents parents`}),r.position==="absolute"||r.position==="fixed")return a.push({label:"placed by",value:`${r.position}, not by the parent`}),{display:i,rows:a};if(r.float!=="none")return a.push({label:"placed by",value:`float: ${r.float}`}),{display:i,rows:a};let s=i.includes("flex"),l=i.includes("grid");if(!s&&!l)return a.push({label:"flow",value:i}),{display:i,rows:a};let E=Kn(n.rowGap==="normal"?"0px":n.rowGap),$=Kn(n.columnGap==="normal"?"0px":n.columnGap),L=E===$?E:`row ${E} \xB7 column ${$}`;if(s){let J=n.flexDirection;a.push({label:"direction",value:n.flexWrap==="nowrap"?J:`${J} \xB7 ${n.flexWrap}`}),a.push({label:"justify",value:n.justifyContent}),a.push({label:"align",value:n.alignItems}),a.push({label:"gap",value:L});let w=`${r.flexGrow} ${r.flexShrink} ${r.flexBasis}`;return w!=="0 1 auto"&&a.push({label:"this child",value:`flex: ${w}`}),r.alignSelf!=="auto"&&a.push({label:"align-self",value:r.alignSelf}),{display:i,rows:a}}let y=Wn(n.gridTemplateColumns),p=Wn(n.gridTemplateRows);y.length&&a.push({label:"columns",value:`${y.length} \xB7 ${y.map(sn).join(" ")}`}),p.length&&a.push({label:"rows",value:`${p.length} \xB7 ${p.map(sn).join(" ")}`}),a.push({label:"gap",value:L});let g=t.getBoundingClientRect(),x=e.getBoundingClientRect(),T={left:g.left+ye(n.borderLeftWidth)+ye(n.paddingLeft),right:g.right-ye(n.borderRightWidth)-ye(n.paddingRight),top:g.top+ye(n.borderTopWidth)+ye(n.paddingTop),bottom:g.bottom-ye(n.borderBottomWidth)-ye(n.paddingBottom)},b=Hr(n.writingMode,n.direction),S=(J,w)=>J==="x"?Xn(T.left,T.right,x.left,x.right,w):Xn(T.top,T.bottom,x.top,x.bottom,w),z=b.inline==="x"?"y":"x",j=ye(n.columnGap==="normal"?"0":n.columnGap),D=ye(n.rowGap==="normal"?"0":n.rowGap),X=_n(y,j,S(b.inline,b.inlineReversed)),re=_n(p,D,S(z,b.blockReversed)),te=[];return X>=0&&te.push(`column ${X+1} of ${y.length}`),re>=0&&te.push(`row ${re+1} of ${p.length}`),te.length&&a.push({label:"this child",value:te.join(" \xB7 ")}),{display:i,rows:a}}function Kn(e){return e.endsWith("px")?sn(Number.parseFloat(e)):e}function sn(e){return String(Math.round(e*100)/100)}var no=["display","position","width","height","padding","margin","border-width","border-style","border-radius","font-family","font-size","font-weight","font-style","line-height","letter-spacing","text-transform","text-align","color","background-color","border-color","opacity","flex-direction","justify-content","align-items","gap","flex-grow","flex-shrink","flex-basis","align-self","box-shadow","overflow","text-overflow","white-space"];function Gr(e,t){let o=[];for(let n of no){let r=e[n]??"",i=t[n]??"";r!==i&&o.push({prop:n,a:r,b:i})}return o}function Yn(e){let t=getComputedStyle(e),o={};for(let n of no)o[n]=t.getPropertyValue(n);return o}function oo(e,t){return Gr(Yn(e),Yn(t))}var Or={ignore:"",grid:null,hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"},theme:"auto"};function io(e={}){return{...Or,...e}}var ro=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function ao(e){return e.ignore?`${ro}, ${e.ignore}`:ro}function oe(e){return String(Math.round(e*100)/100)}function Br(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function Gt(e){let t=e.getBoundingClientRect();return{el:e,label:Br(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height,scale:Be(e)}}function so(e,t){let o=(n,r)=>Math.abs(n-r)<.001;return o(e.scale.x,t.scale.x)&&o(e.scale.y,t.scale.y)?e.scale:{x:1,y:1}}function lo(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function Ve(e,t,o){let n=ao(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=lo(r);return r&&r!==document.documentElement?Gt(r):null}var It=e=>parseFloat(e)||0;function cn(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[It(n),It(r),It(i),It(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function zr(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function Fr(e,t){let o=so(e,t),n=t.left+t.width/2,r=t.top+t.height/2;return[{x1:e.left,y1:r,x2:t.left,y2:r,label:oe((t.left-e.left)/o.x),axis:"x"},{x1:t.right,y1:r,x2:e.right,y2:r,label:oe((e.right-t.right)/o.x),axis:"x"},{x1:n,y1:e.top,x2:n,y2:t.top,label:oe((t.top-e.top)/o.y),axis:"y"},{x1:n,y1:t.bottom,x2:n,y2:e.bottom,label:oe((e.bottom-t.bottom)/o.y),axis:"y"}]}function Ht(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function Ot(e,t){let o=[],n=so(e,t),r=e.left<t.right&&t.left<e.right,i=e.top<t.bottom&&t.top<e.bottom;if(r&&i){let[a,s]=zr(e,t);return Fr(a,s)}if(!r){let[a,s]=e.right<=t.left?[e,t]:[t,e],l=i?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:a.right,y1:l,x2:s.left,y2:l,label:`${oe((s.left-a.right)/n.x)}`,axis:"x"}),o.push(...Ht(a.right,a.top,a.bottom,l,"x")),o.push(...Ht(s.left,s.top,s.bottom,l,"x"))}if(!i){let[a,s]=e.bottom<=t.top?[e,t]:[t,e],l=r?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:l,y1:a.bottom,x2:l,y2:s.top,label:`${oe((s.top-a.bottom)/n.y)}`,axis:"y"}),o.push(...Ht(a.bottom,a.left,a.right,l,"y")),o.push(...Ht(s.top,s.left,s.right,l,"y"))}return o}function Wr(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function dn(e){let t=Wr(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var _r=5,Xr=8;function kt(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function un(e,t,o){let n=null,r=_r;for(let i of e){let a=Math.abs(kt(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function co(e,t,o){if(o)return{at:e,what:""};let n=null,r=Xr;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function uo(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function pn(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,s=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:s,y2:i,label:oe(r.gap/e.scale.x),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,s=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:s,label:oe(r.gap/e.scale.y),axis:"y"})}}return o}function po(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],s=r[i],l=s-a;l<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:s,y2:t.y,label:oe(l),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:s,label:oe(l),axis:"y"}))}}return o}var _e=3;function Kr(e,t){return e.x<t.x+t.w+_e&&t.x<e.x+e.w+_e&&e.y<t.y+t.h+_e&&t.y<e.y+e.h+_e}function ho(e,t,o=12){let n=(a,s)=>Math.min(Math.max(a,o),t.w-s-o),r=(a,s)=>Math.min(Math.max(a,o),t.h-s-o),i=[];for(let a of e){let s={...a,x:n(a.x,a.w),y:r(a.y,a.h)},l=!1;for(let E=0;E<16;E++){let $=i.find(y=>Kr(y,s));if(!$)break;let L=s.axis==="x"?s.y:s.x;if(s.axis==="x"?s.y=r(l?$.y+$.h+_e:$.y-s.h-_e,s.h):s.x=n(l?$.x-s.w-_e:$.x+$.w+_e,s.w),(s.axis==="x"?s.y:s.x)===L){if(l)break;l=!0}}i.push(s)}return i}function mo(e,t){let{columns:o,gutter:n,margin:r}=e;if(o<=0)return[];let i=e.maxWidth>0?Math.min(e.maxWidth,t):t,a=Math.max(0,(t-i)/2),l=(Math.max(0,i-r*2)-n*(o-1))/o;if(l<=0)return[];let E=[];for(let $=0;$<o;$+=1)E.push({left:a+r+$*(l+n),width:l});return E}function fo(e,t){return e*t>=8?e:0}function Yr(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(s=>parseFloat(s)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function Be(e){let t=1,o=1;for(let n=e;n;n=lo(n)){let r=Yr(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}function go(e,t,o,n,r=16){let i=r-e,a=n-r-t-e;return i>a?i:Math.min(Math.max(o,i),a)}var jr='button, a, input, select, textarea, [role="button"], [tabindex]',bo=3;function at(e){let{surface:t,margin:o=16,onMove:n,initial:r}=e;function i(D){for(let X of D.composedPath())if(X instanceof Element){if(X.matches(jr))return!1;if(X.hasAttribute("data-drag-handle"))return!0;if(X===t)return!1}return!1}let a=r?.dx??0,s=r?.dy??0,l=null,E=!1;function $(){t.style.transform=a===0&&s===0?"":`translate(${a}px, ${s}px)`}function L(){let D=t.getBoundingClientRect();return{left:D.left-a,top:D.top-s,width:D.width,height:D.height}}function y(){let D=L();a=go(D.left,D.width,a,innerWidth,o),s=go(D.top,D.height,s,innerHeight,o),$(),n?.()}function p(D){if(D.button===0&&i(D)){l={x:D.clientX,y:D.clientY,dx:a,dy:s},E=!0;try{t.setPointerCapture(D.pointerId)}catch{}}}function g(D){if(!l)return;let X=D.clientX-l.x,re=D.clientY-l.y;if(E){if(Math.abs(X)<bo&&Math.abs(re)<bo)return;E=!1,t.setAttribute("data-dragging","")}D.preventDefault(),a=l.dx+X,s=l.dy+re,y()}function x(){l=null,E=!1,t.removeAttribute("data-dragging")}function T(D){let X=l!==null&&!E;t.hasPointerCapture?.(D.pointerId)&&t.releasePointerCapture(D.pointerId),x(),X&&(addEventListener("click",b,{capture:!0,once:!0}),setTimeout(()=>removeEventListener("click",b,!0),0))}function b(D){D.stopPropagation(),D.preventDefault()}function S(D){!l||D.key!=="Escape"||(D.preventDefault(),D.stopPropagation(),a=l.dx,s=l.dy,x(),$(),n?.())}function z(){a=0,s=0,$(),n?.()}function j(D){i(D)&&z()}return(a!==0||s!==0)&&$(),t.addEventListener("pointerdown",p),t.addEventListener("pointermove",g),t.addEventListener("pointerup",T),t.addEventListener("pointercancel",T),t.addEventListener("dblclick",j),addEventListener("keydown",S,!0),addEventListener("resize",y),{place:y,reset:z,moved:()=>a!==0||s!==0,offset:()=>({dx:a,dy:s}),destroy(){t.removeEventListener("pointerdown",p),t.removeEventListener("pointermove",g),t.removeEventListener("pointerup",T),t.removeEventListener("pointercancel",T),t.removeEventListener("dblclick",j),removeEventListener("keydown",S,!0),removeEventListener("resize",y),t.style.transform=""}}}var st=`
[data-drag-handle] { cursor: grab; touch-action: none; }
/*
 * Both forms, because the toolbar is its own handle: the two attributes land
 * on the same element there, and a descendant selector alone would leave the
 * one bar you drag by its whole body showing a grab cursor while you drag it.
 */
[data-dragging] [data-drag-handle],
[data-dragging][data-drag-handle] { cursor: grabbing; }
/* No text selection mid-drag, and no transition racing the pointer. */
[data-dragging] { user-select: none; transition: none !important; }
`;var Re=(e,t)=>({light:e,dark:t}),hn={accent:Re("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:Re("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:Re("oklch(1 0 0)","oklch(0.264 0 0)"),fg:Re("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:Re("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:Re("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:Re("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:Re("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)"),pixelLine:Re("oklch(0.205 0 0 / 0.14)","oklch(0.97 0 0 / 0.14)")};function xo(e){return`light-dark(${e.light}, ${e.dark})`}var xe=xo(Re("#fafafa","#1a1a1a"));function lt(e,t=e){return xo(Re(`rgb(0 0 0 / ${t})`,`rgb(255 255 255 / ${e})`))}var yo=[0,.07,.08,.1,.12,.15,.2];function _(e){let t=yo[Math.max(0,Math.min(yo.length-1,e))];return t===0?xe:lt(t)}var k={primary:lt(.9),secondary:lt(.6),tertiary:lt(.46,.55),disabled:lt(.22,.26)},ue=lt(.12),ze="0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)",Bt="0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)",Q=22,Xe=36,B={tight:4,base:8,roomy:12,edge:16},W={exit:"160ms cubic-bezier(0.3, 0, 1, 1)",ui:"160ms cubic-bezier(0.2, 0, 0, 1)"},Ur='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',O={title:13,body:12,tag:11,stack:Ur},q={regular:400,medium:500,semibold:600},mn="__align_font",Vr="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function wo(){if(document.getElementById(mn))return;let e=document.createElement("link");e.id=mn,e.rel="stylesheet",e.href=Vr,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function vo(){document.getElementById(mn)?.remove()}function ko(e){let t=[`${q.medium} ${O.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function gn(e){let t={};for(let o of Object.keys(hn))t[o]=e?hn[o].dark:hn[o].light;return t}var fn=null;function $o(e){fn=e==="auto"?null:e}function bn(){if(fn)return fn==="dark";let e=document.documentElement,t=getComputedStyle(e).colorScheme;if(/dark/.test(t)&&!/light/.test(t))return!0;if(/light/.test(t)&&!/dark/.test(t))return!1;for(let o of[document.body,e]){if(!o)continue;let n=qr(getComputedStyle(o).backgroundColor);if(n!==null)return n<.5}return matchMedia("(prefers-color-scheme: dark)").matches}function qr(e){let t=/^rgba?\(([^)]+)\)$/.exec(e.trim());if(!t)return null;let o=t[1].split(/[\s,/]+/).filter(Boolean).map(Number),[n,r,i,a=1]=o;return n===void 0||r===void 0||i===void 0||a<.5?null:(.2126*n+.7152*r+.0722*i)/255}function qe(e,t){return e.replace(/\)$/,` / ${t})`)}var Zr=`
`,$t=16,Jr=st+`
.dock {
  /* No color-scheme here: the overlay sets it inline on the shadow host, from
     what the page actually looks like rather than what the machine prefers, and
     it inherits down. Declaring 'light dark' again would undo that and hand
     light-dark() back to the media query. */
  /*
   * Bottom-left by default, said in CSS rather than computed.
   *
   * This used to be top: 0 plus a transform that carried the whole position,
   * with -1 standing for "not placed yet, put it at the bottom". The drag is
   * shared now and it treats the transform as an offset from wherever the CSS
   * puts a surface, so the default belongs here and the sentinel is gone.
   */
  position: fixed; left: ${$t}px; bottom: ${$t}px;
  /* Clamped to the window. A narrow viewport is not an edge case for this
     tool, it is the case it exists for: you make the window 375px wide
     precisely to check a mobile layout, and a readout that hangs off the
     screen there is useless exactly when you reached for it. */
  width: min(340px, calc(100vw - ${$t*2}px));
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none;
  /* Not the whole panel: only the header is a drag surface, and making the
     numbers unselectable means the one thing you might want to paste into a
     stylesheet cannot be picked up by hand. Copy covers the whole reading; a
     selection covers the one value you actually wanted. */
  user-select: none;
  font-family: ${O.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${k.primary};
  --muted: ${k.secondary};
  --border: ${ue};
}
.panel {
  padding: 10px; border-radius: 0;
  /* Five sections now \u2014 box, tokens, styled by, matches, colour \u2014 and on a
     laptop that is taller than the window. place() clamps the position but
     cannot rescue a panel taller than the screen, so it scrolls instead. */
  max-height: calc(100vh - ${$t*2}px);
  overflow-y: auto; overscroll-behavior: contain;
  font-size: ${O.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${xe};

  box-shadow: ${ze};

  /* The one animation in the tool: a panel that must land exactly, so the
     Fluid spring.moderate tier at 160ms, critically damped. */
  opacity: 0;
  transform: translateY(4px) scale(0.98);
  transform-origin: bottom left;
  transition: opacity ${W.exit}, transform ${W.exit},
              box-shadow ${W.exit};
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
  transition: opacity ${W.ui}, transform ${W.ui},
              box-shadow ${W.ui};
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
.dock[data-dragging] .panel { box-shadow: ${Bt}; }
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${O.title}px; font-weight: ${q.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${O.body}px; font-weight: ${q.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${O.tag}px; font-weight: ${q.medium};
  margin-left: 4px;
  color: ${k.primary};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${O.body}px; line-height: 1;
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
  font-size: ${O.tag}px; font-weight: ${q.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${q.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${q.regular}; }
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
  font-size: ${O.tag}px; line-height: 1.5;
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
  font-size: ${O.body}px;
  /* Several of these wrap \u2014 a diff value, a rule file, a token list \u2014 and a
     lone short word on the last line reads as a mistake. */
  text-wrap: pretty;
}
.content {
  border-radius: 0; padding: ${B.roomy}px ${B.base}px;
  text-align: center; font-weight: ${q.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,Eo={dx:0,dy:0},ct=!1;function So(e){let t=document.createElement("style");t.textContent=Jr,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);let r=!1;function i(p,g){let x=document.createElement("div");x.className="readout";let T=document.createElement("div");T.className="tag readout-tag",T.textContent=p,x.appendChild(T);let b=document.createElement("div");b.className="readout-rows",x.appendChild(b);for(let[S,z]of g){let j=document.createElement("div");j.className="readout-row";let D=document.createElement("span");D.className="readout-key",D.textContent=S;let X=document.createElement("span");X.className="readout-value",X.textContent=z,j.append(D,X),b.appendChild(j)}return x}e.appendChild(o);let a=at({surface:o,margin:$t,initial:Eo,onMove:()=>{Eo=a.offset()}}),s=()=>a.place(),l=null,E=[],$;function L(p){let g=document.createElement("div");return g.className="edge",g.textContent=p===0?"0":oe(p),p===0&&g.setAttribute("data-zero",""),g}function y(p,g,x,T){let[b,S,z,j]=x,D=document.createElement("div");D.className="region",D.setAttribute("data-level",String(g));let X=document.createElement("span");X.className="tag",X.textContent=p;let re=document.createElement("div");re.className="row";let te=document.createElement("div");te.className="fill",te.appendChild(T),re.append(L(j),te,L(S));let J=document.createElement("div");return J.className="head",J.append(X,L(b)),D.append(J,re,L(z)),D}return{show(p,g=[],x){E=g,$=x;let T=cn(p.el),[b,S,z,j]=T.border,[D,X,re,te]=T.padding,J=Be(p.el),w=p.width/J.x,F=p.height/J.y,ae=Math.abs(J.x-1)>.001||Math.abs(J.y-1)>.001,H=document.createElement("header"),U=document.createElement("span");U.className="name",U.textContent=p.label;let R=document.createElement("span");R.className="size",R.textContent=`${oe(w)} \xD7 ${oe(F)}`;let K=document.createElement("button");if(K.className="close",K.textContent="\xD7",K.title="close (B brings it back)",K.addEventListener("click",m=>{m.stopPropagation(),ct=!0,o.removeAttribute("data-open")}),H.append(U,R),ae){let m=document.createElement("span");m.className="scale",m.textContent=`\xD7${oe(J.x)}`,m.title=`renders at ${oe(p.width)} \xD7 ${oe(p.height)}`,H.appendChild(m)}H.appendChild(K),H.setAttribute("data-drag-handle","");let ne=document.createElement("div");ne.className="content",ne.textContent=`${oe(w-j-S-te-X)} \xD7 ${oe(F-b-z-D-re)}`,ne.title=ne.textContent;let me=[H,y("margin",1,T.margin,y("border",2,T.border,y("padding",3,T.padding,ne)))];if(r){let m=jn(p.el),N=Rt(p.el);me.push(N.length&&m?i("type",N.map(A=>[A.label,A.value])):i("type",[["","nothing of its own to set type on"]]))}if(x&&x.el!==p.el&&x.el.isConnected){let m=oo(x.el,p.el).map(C=>[C.prop,`${C.a||"\u2014"} \u2192 ${C.b||"\u2014"}`]),N=m.slice(0,10);m.length>N.length&&N.push(["",`and ${m.length-N.length} more`]);let A=x.label===p.label?"the one locked before":x.label;me.push(i(`differs from ${A}`,N.length?N:[["","nothing in the properties it compares"]]))}let c=to(p.el);if(c&&c.rows.length&&me.push(i(`laid out by ${c.display}`,c.rows.map(m=>[m.label,m.value]))),g.length){let m=g.map(A=>[oe(A.px),A.detail]),N=Zn(g.map(A=>A.px));N&&m.push(["",N]),me.push(i("gaps",m))}let M=Pt(p.el),v=Un([w,F,...T.margin,...T.border,...T.padding,...r?Rt(p.el).map(m=>m.px):[]],M);v&&me.push(i("tokens",[["",v]]));let I=eo(p.el);I.length&&me.push(i("styled by",I.slice(0,4).map(m=>[m.selector,m.file])));let d=Qn(p.el);d>1&&me.push(i("matches",[["",`${d} elements share ${vt(p.el)}`]]));let u=M.filter(m=>wt(m.value));if(u.length){let m=Jn(p.el).map(({label:N,value:A})=>{let C=Dt(A,u);return[N,C.length?`${A}  ${C.join(" ")}`:`${A}  \u2014`]});m.length&&me.push(i("colour",m))}n.replaceChildren(...me),l=p,s(),!ct&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},showsType:()=>r,isOpen:()=>!ct&&l!==null,toggleType(){r=!r,l&&this.show(l,E,$)},asText(){if(!l)return"";let p=cn(l.el),g=Be(l.el),x=l.width/g.x,T=l.height/g.y,b=z=>z.map(j=>oe(j)).join(" "),S=[`${l.label}  ${oe(x)} \xD7 ${oe(T)}`,`margin   ${b(p.margin)}`,`border   ${b(p.border)}`,`padding  ${b(p.padding)}`];if(r)for(let z of Rt(l.el))S.push(`${z.label.padEnd(8)} ${z.value}`);return S.join(Zr)},hide(){l=null,o.removeAttribute("data-open")},setHidden(p){o.toggleAttribute("data-away",p)},toggle(){l&&(ct=!ct,ct?o.removeAttribute("data-open"):(s(),o.setAttribute("data-open","")))},destroy(){a.destroy(),o.remove(),t.remove()}}}function Co(e=20,t=1e3){let o=[];return{push(n,r,i=Date.now()){let a=o[o.length-1];if(a&&r!==""&&a.tag===r&&i-a.at<=t){a.at=i;return}o.push({state:n,tag:r,at:i}),o.length>e&&o.shift()},pop(){return o.pop()?.state??null},peek(){return o[o.length-1]?.state??null},depth(){return o.length},clear(){o.length=0}}}var Qr="0 0 24 24";var f=(e,t,o)=>{let n={path:e};return t!==void 0&&(n.fade=t),o!==void 0&&(n.weight=o),n},le=(e,t,o,n,r,i)=>i===void 0?{rect:[e,t,o,n,r]}:{rect:[e,t,o,n,r],fade:i},ei={rulers:[f("M2 8V4"),f("M22 8V4"),f("M22 6H2"),le(2,12,20,8,2),f("M6 15v-3"),f("M10 15v-3"),f("M14 15v-3"),f("M18 15v-3")],xray:[f("M3 7V5a2 2 0 0 1 2-2h2"),f("M17 3h2a2 2 0 0 1 2 2v2"),f("M21 17v2a2 2 0 0 1-2 2h-2"),f("M7 21H5a2 2 0 0 1-2-2v-2")],grid:[le(3,3,18,18,2),f("M9 3v18"),f("M15 3v18")],pixels:[le(3,3,18,18,2),f("M3 9h18"),f("M3 15h18"),f("M9 3v18"),f("M15 3v18")],type:[f("M12 4v16"),f("M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"),f("M9 20h6")],panel:[le(3,3,18,18,2),le(8,8,8,8,1)],freeze:[le(14,3,5,18,1),le(5,3,5,18,1)],copy:[le(8,8,14,14,2),f("M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2")],pick:[f("m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12"),f("m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z"),f("m2 22 .414-.414")],hide:[f("M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"),f("M14.084 14.158a3 3 0 0 1-4.242-4.242"),f("M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"),f("m2 2 20 20")],undo:[f("M9 14 4 9l5-5"),f("M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11")],edit:[f("M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"),f("m15 5 4 4")],sideTop:[f("M4 5h16v14H4z",.25,1.25),f("M4 5h16",1,3.5)],sideRight:[f("M4 5h16v14H4z",.25,1.25),f("M20 5v14",1,3.5)],sideBottom:[f("M4 5h16v14H4z",.25,1.25),f("M4 19h16",1,3.5)],sideLeft:[f("M4 5h16v14H4z",.25,1.25),f("M4 5v14",1,3.5)],fontSize:[f("M12 4v16"),f("M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"),f("M9 20h6")],fontWeight:[f("M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8")],lineHeight:[f("M3 5h18",.35),f("M3 19h18",.35),f("M12 8v8")],tracking:[f("M5 5v14",.35),f("M19 5v14",.35),f("M8 12h8")],italic:[f("M19 4h-9"),f("M14 20H5"),f("m15 4-4 16")],textAlign:[f("M21 6H3"),f("M15 12H3"),f("M17 18H3")],textCase:[f("M3.5 13h6"),f("m2 16 4.5-9 4.5 9"),f("M18 16V7"),f("m14 11 4-4 4 4")],underline:[f("M6 4v6a6 6 0 0 0 12 0V4"),f("M4 20h16")],textColour:[f("m6 16 6-12 6 12",.35),f("M8 12h8",.35),f("M4 20h16")],backgroundColour:[le(3,3,18,18,2),f("M3 12h18",.35),f("M12 3v18",.35)],borderColour:[le(3,3,18,18,2),le(8,8,8,8,1,.35)],opacity:[f("M12 3a9 9 0 0 0 0 18z"),f("M12 3a9 9 0 0 1 0 18",.35)],padding:[le(3,3,18,18,2,.35),le(7,7,10,10,1)],margin:[le(3,3,18,18,2),le(7,7,10,10,1,.35)],boxSizing:[le(3,3,18,18,2),f("M7 7h10v10H7z",.35)],widthIcon:[f("M2 12h20"),f("m6 8-4 4 4 4"),f("m18 8 4 4-4 4")],heightIcon:[f("M12 2v20"),f("m8 6 4-4 4 4"),f("m8 18 4 4 4-4")],borderWidth:[le(3,3,18,18,2),f("M3 3h18")],borderStyle:[f("M3 12h4"),f("M10 12h4"),f("M17 12h4")],borderRadius:[f("M21 21V9a6 6 0 0 0-6-6H3")],gap:[le(3,4,7,16,1,.35),le(14,4,7,16,1,.35),f("M12 8v8")],flexDirection:[f("M12 5v14"),f("m8 9 4-4 4 4"),f("m8 15 4 4 4-4")],justify:[f("M4 4v16",.35),f("M20 4v16",.35),le(8,8,8,8,1)],alignItems:[f("M4 4h16",.35),f("M4 20h16",.35),le(8,8,8,8,1)],flexWrap:[f("M3 7h13a4 4 0 0 1 0 8H8"),f("m11 12-3 3 3 3")],shadow:[le(3,3,14,14,2),f("M21 9v10a2 2 0 0 1-2 2H9",.35)],backdrop:[le(3,3,18,18,2),f("M7 12h10",.35),f("M7 8h10",.35),f("M7 16h10",.35)],arrowUp:[f("m5 12 7-7 7 7"),f("M12 19V5")],arrowDown:[f("M12 5v14"),f("m19 12-7 7-7-7")],link:[f("M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"),f("M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71")],check:[f("M20 6 9 17l-5-5")],warning:[f("m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"),f("M12 9v4"),f("M12 17h.01")],cross:[f("M18 6 6 18"),f("m6 6 12 12")]},yn="http://www.w3.org/2000/svg";function ve(e,t=16){let o=document.createElementNS(yn,"svg");o.setAttribute("viewBox",Qr),o.setAttribute("width",String(t)),o.setAttribute("height",String(t)),o.setAttribute("fill","none"),o.setAttribute("stroke","currentColor"),o.setAttribute("stroke-width","2"),o.setAttribute("stroke-linecap","round"),o.setAttribute("stroke-linejoin","round"),o.setAttribute("aria-hidden","true");for(let n of ei[e])if("rect"in n){let[r,i,a,s,l]=n.rect,E=document.createElementNS(yn,"rect");E.setAttribute("x",String(r)),E.setAttribute("y",String(i)),E.setAttribute("width",String(a)),E.setAttribute("height",String(s)),E.setAttribute("rx",String(l)),n.fade!==void 0&&E.setAttribute("opacity",String(n.fade)),n.weight!==void 0&&E.setAttribute("stroke-width",String(n.weight)),o.appendChild(E)}else{let r=document.createElementNS(yn,"path");r.setAttribute("d",n.path),n.fade!==void 0&&r.setAttribute("opacity",String(n.fade)),n.weight!==void 0&&r.setAttribute("stroke-width",String(n.weight)),o.appendChild(r)}return o}var ti=[{title:"Pointing at things",rows:[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure whatever is under the cursor"],["Click","lock an element, so it keeps measuring after the pointer leaves"],["Right-click","add another to the locked set, or drop one from it. Two locked also gets you a diff"],["Drag the panel header","move the box model out of your way"],["Esc","clear the locks, then close the tool"]]},{title:"Guides",rows:[["Drag from a rule","pull out a guide; drag it back into the rule to throw it away"],["V  /  H","drop a vertical or horizontal guide at the cursor"],["Hover a guide","its distance to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the guide you last touched. Shift for 10px"],["L","pin a guide, so it cannot be moved or deleted by accident"],["Ctrl/Cmd while placing","ignore snapping"],["Del","remove the guide under the cursor. Shift+Del for all of them"]]}],Le=B.edge,xn=24,ni=900,Et=Xe,St=B.base,oi=st+`
.flag {
  position: fixed; top: ${Le}px; right: ${Le}px;
  display: flex; align-items: center; gap: 8px;
  transition: top ${W.ui};
  padding: ${(Xe-xn)/2}px 10px; border-radius: 0;
  /* No cursor of its own: the bar is a drag handle and takes grab from the
     shared rules, while the buttons on it keep their own pointer. */
  pointer-events: auto; user-select: none;
  font-family: ${O.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${O.tag}px; font-weight: ${q.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${k.primary};
  background: ${xe};
  box-shadow: ${ze};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
/* No negative tracking: it is 11px, and tightening is what large text wants.
   Small text reads better at zero or a hair positive. */
.flag .name { letter-spacing: 0; }
/* The rulers draw a gutter along the top edge, and the badge sits in it. Step
   down out of the way rather than covering the ticks the rulers exist to show. */
.flag[data-rulers] { top: ${Le+Q}px; }
.help[data-rulers] { top: ${Le+Q+Et+St}px; }
.flag:hover { background: ${_(1)}; }
.flag .count { color: ${k.secondary}; }

/* A layers bar, not a palette. Switches, then the one control that changes the
   page, then the things that happen once. */
.tools { display: flex; align-items: center; gap: 2px; }
.sep {
  width: 1px; align-self: stretch; margin: 0 4px;
  background: ${ue};
}
.tool {
  width: ${xn}px; height: ${xn}px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; cursor: pointer;
  font: inherit; font-size: ${O.tag}px; font-weight: ${q.medium};
  color: ${k.tertiary};
}
/* Both glyphs occupy the same cell so one can cross-fade into the other; a
   swap would jump, and the point is to be noticed without being a movement. */
.tool > svg { grid-area: 1 / 1; transition: opacity ${W.ui}; }
.tool > .ack { opacity: 0; }
.tool[data-ack] > .ack { opacity: 1; }
.tool[data-ack] > .glyph { opacity: 0; }
.tool:hover { background: ${_(2)}; color: ${k.primary}; }
/* On the press, not on the release. Waiting for the click to acknowledge a
   button is the difference between a control that answers and one that lags,
   and it costs one rule. */
.tool:active { background: ${_(4)}; color: ${k.primary}; }
.tool:focus-visible { outline: 1px solid ${k.primary}; outline-offset: -1px; }
/* On is the film, not a colour: the three hues each already mean something on
   the canvas, and a fourth here would say nothing. */
.tool[data-on] { background: ${_(4)}; color: ${k.primary}; }
/*
 * Armed reads differently from on, deliberately. Every other toggle draws
 * something over the page; this one lets the page be rewritten, and a tool that
 * can do that while looking exactly like one that cannot is the problem the
 * arming design exists to avoid. It inverts rather than taking a hue: red
 * already means a measurement here, and a second meaning for it would cost
 * more than the emphasis is worth.
 */
.tool[data-tool='edit'][data-on] {
  background: ${k.primary};
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
  position: fixed; top: ${Le+Et+St}px; right: ${Le}px;
  /* 368 plus two insets is 400, so this was the first thing to hang off the
     left edge of a phone-width window. */
  /* The padding is in the subtraction because these boxes are content-box:
     without it the clamp lets the panel sit flush against the far edge with
     no inset at all, which reads as broken rather than as tight. */
  width: min(368px, calc(100vw - ${Le*2+B.base*2}px));
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${Le*2+Et+St}px); overflow-y: auto;
  padding: ${B.base}px; border-radius: 0;
  user-select: none;
  font-family: ${O.stack};
  font-synthesis: none;
  font-size: ${O.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${k.primary};
  background: ${xe};
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
  transition: opacity ${W.ui}, transform ${W.ui}, visibility 0s linear 160ms;
}
.help[data-open] {
  opacity: 1; visibility: visible; pointer-events: auto;
  transform: none;
  transition: opacity ${W.ui}, transform ${W.ui}, visibility 0s;
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
  color: ${k.tertiary}; line-height: 0;
}
.help h4 {
  grid-column: 1 / -1; margin: 10px 0 2px;
  font-size: ${O.tag}px; font-weight: ${q.semibold};
  color: ${k.tertiary};
}
.help h4:first-child { margin-top: 0; }
.help kbd {
  display: inline-block; padding: 3px 5px;
  font: inherit; font-weight: ${q.medium};
  border: 1px solid ${ue};
  background: ${_(2)};
}
/* These run to three lines, and a one-word last line reads as a mistake. */
.help dd { margin: 0; color: ${k.secondary}; text-wrap: pretty; }
`,wn=[{name:"rulers",label:"Rulers",key:"R",toggle:!0,what:"a scale down the top and left edges, in page pixels \u2014 and the gutters you drag guides out of"},{name:"xray",label:"X-ray",key:"X",toggle:!0,what:"outline every element at once, to see the boxes a layout is really made of"},{name:"grid",label:"Column grid",key:"G",toggle:!0,what:"the grid your design is built on, columns filled and gutters left empty. Needs one configured"},{name:"pixels",label:"Pixel grid",key:"K",toggle:!0,what:"a ten-pixel lattice over the page, to read an offset off without measuring it"},{name:"type",label:"Type",key:"T",toggle:!0,what:"add size, weight, line height and tracking to the panel, each checked against your scale"},{name:"panel",label:"Box model",key:"B",toggle:!0,what:"the readout itself \u2014 margins, borders, padding, what places the element, what styles it"},{name:"hide",label:"Hide",key:"\\",toggle:!0,what:"everything drawn, out of the way for a moment. Your locks, guides and layers all survive it"},{name:"freeze",label:"Freeze",key:"F",toggle:!0,what:"hold every animation and transition where it stands, so a moving thing can be measured"},{name:"copy",label:"Copy",key:"C",toggle:!1,what:"put everything in the panel on the clipboard as text"},{name:"pick",label:"Colour",key:"P",toggle:!1,what:"sample a colour from anywhere on screen and match it against your palette"},{name:"edit",label:"Edit",key:"E",toggle:!0,what:"let the panel change the page. Off until you say so, shown while it is on, and everything goes back when you turn it off"},{name:"undo",label:"Undo",key:"Ctrl/Cmd + Z",toggle:!1,what:"step back through the guides \u2014 a whole run of nudges counts as one"}];function Mo(e,t){let o=document.createElement("style");o.textContent=oi,e.appendChild(o);let n=document.createElement("div");n.className="flag";let r=document.createElement("span");r.className="name",r.textContent="Align";let i=document.createElement("span");i.className="count";let a=new Map,s=new Map,l=document.createElement("div");l.className="tools";for(let g of wn){if(g.name==="freeze"||g.name==="copy"){let b=document.createElement("span");b.className="sep",l.appendChild(b)}let x=document.createElement("button");x.type="button",x.className="tool",x.dataset.tool=g.name;let T=ve(g.name);T.classList.add("glyph"),x.appendChild(T),x.setAttribute("aria-label",g.label),x.title=`${g.label}  \xB7  ${g.key}
${g.what}`,g.toggle||x.setAttribute("data-once",""),x.addEventListener("click",b=>{b.stopPropagation(),t(g.name)}),a.set(g.name,x),l.appendChild(x)}n.append(r,l,i);let E=document.createElement("div");E.className="help";let $=document.createElement("dl");function L(g){let x=document.createElement("h4");x.textContent=g,$.appendChild(x)}function y(g,x,T){let b=document.createElement("span");b.className="glyph",T&&b.appendChild(ve(T,14));let S=document.createElement("dt"),z=document.createElement("kbd");z.textContent=g,S.appendChild(z);let j=document.createElement("dd");j.textContent=x,$.append(b,S,j)}L("The bar, left to right");for(let g of wn)y(g.key,`${g.label} \u2014 ${g.what}`,g.name);for(let g of ti){L(g.title);for(let[x,T]of g.rows)y(x,T)}E.appendChild($),n.addEventListener("click",g=>{g.stopPropagation(),E.toggleAttribute("data-open")}),e.append(n,E),n.setAttribute("data-drag-handle","");let p=at({surface:n});return{acknowledge(g,x){let T=a.get(g);if(!T)return;clearTimeout(s.get(g)),T.querySelector(".ack")?.remove();let b=ve(x?"check":"cross");b.classList.add("ack"),T.appendChild(b),requestAnimationFrame(()=>T.setAttribute("data-ack",x?"yes":"no")),s.set(g,setTimeout(()=>{T.removeAttribute("data-ack"),setTimeout(()=>T.querySelector(".ack")?.remove(),200)},ni))},update(g,x){i.textContent=g>0?`${g} locked`:"";let T=x.rulers&&!x.hide;n.toggleAttribute("data-rulers",T),E.toggleAttribute("data-rulers",T);for(let z of wn)z.toggle&&a.get(z.name)?.toggleAttribute("data-on",x[z.name]===!0);let b=a.get("copy");b&&(b.disabled=!x.canCopy);let S=a.get("undo");S&&(S.disabled=!x.canUndo)},closeHelp(){let g=E.hasAttribute("data-open");return E.removeAttribute("data-open"),g},destroy(){for(let g of s.values())clearTimeout(g);p.destroy(),n.remove(),E.remove(),o.remove()}}}var ri=2,ii=3;function ai(e,t,o,n,r=1){let i=e+t/ri,a=r>0?Math.round(i/r)*r:i;return Math.max(o,Math.min(n,Number(a.toPrecision(12))))}function si(e,t,o){let n=/^\s*(-?\d*\.?\d+)\s*(px|rem|em|%)?\s*$/i.exec(e);if(!n)return null;let r=parseFloat(n[1]);return Number.isFinite(r)?Math.max(t,Math.min(o,r)):null}function To(e){return String(Math.round(e*100)/100)}var li=`
.scrub {
  display: flex; align-items: center; gap: 6px;
  min-width: 0;
  height: 28px;
  padding: 0 8px;
  border: 0; border-radius: 0;
  background: ${_(1)};
  color: ${k.primary};
  font: inherit;
  font-size: ${O.body}px; font-weight: ${q.regular};
  font-variant-numeric: tabular-nums;
  line-height: 1;
  text-align: left;
  user-select: none;
  touch-action: none;
  transition: background ${W.ui};
}
.scrub[data-axis='x'] { cursor: ew-resize; }
.scrub[data-axis='y'] { cursor: ns-resize; }
.scrub:hover { background: ${_(3)}; }
.scrub[data-scrubbing] { background: ${_(5)}; }
.scrub:focus-visible { outline: 2px solid ${k.secondary}; outline-offset: -2px; }

/* The glyph is the label, so it must not shrink when the number grows. */
.scrub-glyph { flex: none; display: grid; place-items: center; color: ${k.tertiary}; }
.scrub-text {
  flex: none;
  color: ${k.tertiary};
  font-size: ${O.tag}px;
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
  color: ${k.primary};
  font: inherit;
  font-size: ${O.body}px;
  font-variant-numeric: tabular-nums;
  text-align: right;
}
.scrub-input:focus { box-shadow: inset 0 -1px ${ue}; }
`,Ao="align-scrub";function ci(e){if(e.querySelector(`#${Ao}`))return;let t=document.createElement("style");t.id=Ao,t.textContent=li,e.appendChild(t)}function Lo(e,t){ci(e);let o=t.min??0,n=t.max??9999,r=t.step??1,i=t.axis??"x",a=t.value,s=document.createElement("button");if(s.type="button",s.className="scrub",s.dataset.axis=i,s.setAttribute("aria-label",t.label),s.title=`${t.label}. Drag to change, click to type.`,t.glyph){let b=document.createElement("span");b.className="scrub-glyph",b.appendChild(ve(t.glyph,14)),s.appendChild(b)}else if(t.text){let b=document.createElement("span");b.className="scrub-text",b.textContent=t.text,s.appendChild(b)}let l=document.createElement("span");l.className="scrub-value",s.appendChild(l);function E(){l.textContent=To(a),s.setAttribute("aria-valuenow",String(a))}function $(b,S){let z=Math.max(o,Math.min(n,b));z!==a&&(a=z,E(),t.onChange(a)),S||t.onCommit?.(a)}let L=null,y=!1,p=1;s.addEventListener("pointerdown",b=>{if(!(x||b.button!==0)){b.preventDefault(),b.stopPropagation();try{s.setPointerCapture(b.pointerId)}catch{}L={x:b.clientX,y:b.clientY,value:a},y=!1,p=(i==="x"?Be(s).x:Be(s).y)||1,s.setAttribute("data-scrubbing","")}}),s.addEventListener("pointermove",b=>{if(!L)return;let S=i==="x"?(b.clientX-L.x)/p:(b.clientY-L.y)/p;!y&&Math.abs(S)>ii&&(y=!0),y&&$(ai(L.value,S,o,n,r),!0)});let g=b=>{if(L){try{s.releasePointerCapture(b.pointerId)}catch{}L=null,s.removeAttribute("data-scrubbing"),y&&t.onCommit?.(a)}};s.addEventListener("pointerup",g),s.addEventListener("pointercancel",g);let x=null;function T(){if(x)return;x=document.createElement("input"),x.className="scrub-input",x.type="text",x.value=To(a),x.setAttribute("aria-label",`${t.label}, as a number`),l.style.display="none",s.appendChild(x),x.focus(),x.select();let b=S=>{if(x){if(S){let z=si(x.value,o,n);z!==null&&$(z,!1)}x.remove(),x=null,l.style.display="",s.focus()}};x.addEventListener("keydown",S=>{S.stopPropagation(),S.key==="Enter"?(S.preventDefault(),b(!0)):S.key==="Escape"&&(S.preventDefault(),b(!1))}),x.addEventListener("blur",()=>b(!0)),x.addEventListener("pointerdown",S=>S.stopPropagation())}return s.addEventListener("click",b=>{if(b.stopPropagation(),y){y=!1;return}T()}),s.addEventListener("keydown",b=>{if(b.target!==s||b.altKey||b.metaKey||b.ctrlKey)return;let S=b.shiftKey?10:1;b.key==="ArrowUp"||b.key==="ArrowRight"?(b.preventDefault(),b.stopPropagation(),$(a+r*S,!1)):b.key==="ArrowDown"||b.key==="ArrowLeft"?(b.preventDefault(),b.stopPropagation(),$(a-r*S,!1)):b.key==="Enter"&&(b.preventDefault(),b.stopPropagation(),T())}),E(),{el:s,set(b){a=Math.max(o,Math.min(n,b)),E()},destroy(){x?.remove(),s.remove()}}}function No(e,t=0,o=0){return Math.min(100,Math.max(...[e,t,o].map(n=>{let[r,i="0"]=String(n).toLowerCase().split("e");return Math.max(0,(r.split(".")[1]?.length??0)-Number(i))})))}function vn(e,t,o,n){let r=o??-1/0,i=n??1/0,a=Math.max(r,Math.min(i,e));if(a===r||a===i||!Number.isFinite(t)||t<=0)return a;let s=o??0,l=s+Math.round((a-s)/t)*t;return Math.max(r,Math.min(i,Number(l.toPrecision(14))))}var di=.03125;function ui(e,t,o){let n=(e-t)/(o-t),r=Math.round(n*10)/10;return Math.abs(n-r)<=di?t+r*(o-t):e}var pi=32,hi=8,mi=200;function Ro(e,t){let o=Math.max(0,e-pi);return t*hi*Math.sqrt(Math.min(o/mi,1))}function zt(e,t,o){return o===t?0:(e-t)/(o-t)*100}function Po(e,t,o){let n=Math.max(0,Math.min(1,e));return t+n*(o-t)}function fi(e,t,o,n,r,i=!1){if(e==="Home")return o;if(e==="End")return n;let a=["ArrowRight","ArrowUp","PageUp"].includes(e)?1:["ArrowLeft","ArrowDown","PageDown"].includes(e)?-1:0;if(!a)return;if(!(r>0)||n<=o)return o;let s=e.startsWith("Page")||i?10:1,l=(t-o)/r,E=o+(a>0?Math.floor(l+1e-9)+s:Math.ceil(l-1e-9)-s)*r;return Math.max(o,Math.min(n,Number(E.toPrecision(14))))}function gi(e,t,o){let n=(t-e)/o;return n<=10&&Number.isFinite(n)&&n>1?Array.from({length:Math.round(n)-1},(r,i)=>(i+1)*o/(t-e)*100):Array.from({length:9},(r,i)=>(i+1)*10)}function Do(e,t,o=0,n=0){let r=No(t,o,n),i=Math.max(r,Math.min(4,No(e)));return!Number.isFinite(t)||t<=0?i:vn(e,t,o,n)===e?r:i}function bi(e,t,o,n){return(o-t)/n<=10?Math.max(t,Math.min(o,t+Math.round((e-t)/n)*n)):ui(e,t,o)}var $n={stiffness:300,damping:25,mass:.8},yi={stiffness:220,damping:22,mass:1};function Wt(e,t,o,n,r){let i=(-r.stiffness*(e-o)-r.damping*t)/r.mass,a=t+i*n;return{x:e+a*n,v:a}}function _t(e,t,o,n=.01){return Math.abs(e-o)<n&&Math.abs(t)<n}var xi=0,wi=.5,vi=.9,ki=.1,$i=3,Ei=800,Io=8,Ft=3,Si=20,Go=10,kn=12,Ci=`
.sl {
  position: relative;
  height: ${Xe}px;
  overflow: hidden;
  background: ${_(1)};
  border-radius: 0;
  cursor: pointer;
  user-select: none;
  touch-action: none;
}
.sl:focus-visible { outline: 2px solid ${k.secondary}; outline-offset: -2px; }

/* Behind everything, and scaled rather than resized: a width change is layout,
   a transform is not, and this moves on every pointer event of a drag. */
.sl-fill {
  position: absolute; inset: 0;
  transform-origin: left center;
  transform: scaleX(0);
  background: ${_(3)};
  transition: background ${W.ui};
  pointer-events: none;
}
.sl[data-awake] .sl-fill { background: ${_(5)}; }

.sl-marks { position: absolute; inset: 0; pointer-events: none; }
.sl-mark {
  position: absolute; top: 50%;
  width: 1px; height: 8px;
  transform: translate(-50%, -50%);
  background: transparent;
  transition: background ${W.ui};
}
.sl[data-awake] .sl-mark { background: ${ue}; }

.sl-handle {
  position: absolute; top: 50%; left: 0;
  width: ${Ft}px; height: ${Si}px;
  background: ${k.primary};
  pointer-events: none;
  opacity: ${xi};
  /* Two transitions, two jobs: opacity and the squash are eased, the position
     is not \u2014 it is written every frame and must not lag the pointer. */
  transition: opacity ${W.ui}, scale ${W.ui};
  scale: 0.25 1;
}
.sl[data-awake] .sl-handle { opacity: ${wi}; scale: 1 1; }
.sl[data-dragging] .sl-handle { opacity: ${vi}; }
.sl[data-dodge] .sl-handle { opacity: ${ki}; scale: 1 0.75; }

.sl-label, .sl-value {
  position: absolute; top: 50%;
  transform: translateY(-50%);
  font-size: ${O.body}px; font-weight: ${q.medium};
  line-height: 1;
  white-space: nowrap;
  transition: color ${W.ui};
}
.sl-label { left: ${Go}px; color: ${k.secondary}; pointer-events: none; }
.sl-value {
  right: ${kn}px;
  color: ${k.secondary};
  /* Inter has tabular figures, so the number stops shifting as it changes
     without loading a second face for it. */
  font-variant-numeric: tabular-nums;
  pointer-events: auto;
  border-bottom: 1px solid transparent;
  padding-bottom: 1px;
}
.sl[data-awake] .sl-value { color: ${k.primary}; }
/* Only after the hover delay: the underline is the promise that a click here
   edits rather than seeks, and it must not appear during a drag. */
.sl-value[data-editable] { border-bottom-color: ${k.secondary}; cursor: text; }

.sl-input {
  position: absolute; right: ${kn}px; top: 50%;
  transform: translateY(-50%);
  width: 5ch;
  padding: 0 0 1px; border: 0;
  border-bottom: 1px solid ${k.secondary};
  background: none; outline: none;
  text-align: right;
  font: inherit;
  font-size: ${O.body}px; font-weight: ${q.medium};
  font-variant-numeric: tabular-nums;
  color: ${k.primary};
}
`,Ho="align-slider";function Mi(e){if(e.querySelector(`#${Ho}`))return;let t=document.createElement("style");t.id=Ho,t.textContent=Ci,e.appendChild(t)}function Xt(e,t){Mi(e);let o=t.min??0,n=t.max??1,r=t.step??.01,i=t.value,a=document.createElement("div");a.className="sl",a.tabIndex=0,a.setAttribute("role","slider"),a.setAttribute("aria-label",t.label),a.setAttribute("aria-valuemin",String(o)),a.setAttribute("aria-valuemax",String(n));let s=document.createElement("div");s.className="sl-fill";let l=document.createElement("div");l.className="sl-marks";for(let h of gi(o,n,r)){let G=document.createElement("div");G.className="sl-mark",G.style.left=`${h}%`,l.appendChild(G)}let E=document.createElement("div");E.className="sl-handle";let $=document.createElement("span");$.className="sl-label",$.textContent=t.label;let L=document.createElement("span");L.className="sl-value",a.append(l,s,E,$,L);let y=zt(i,o,n),p=0,g=null,x=0,T=0;function b(){return a.offsetWidth}function S(){s.style.transform=`scaleX(${y/100})`;let h=b(),G=y/100*h,Y=Math.max(Ft,Math.min(h-Ft,G))-Ft/2;E.style.transform=`translate(${Y}px, -50%)`;let ie=!1;if(h>0){let se=Go+$.offsetWidth+Io,Ee=h-kn-L.offsetWidth-Io;ie=G<se||G>Ee}a.toggleAttribute("data-dodge",ie)}function z(){let h=Do(i,r,o,n);L.textContent=t.unit?`${i.toFixed(h)}${t.unit}`:i.toFixed(h),a.setAttribute("aria-valuenow",String(i)),a.setAttribute("aria-valuetext",L.textContent)}function j(){x&&cancelAnimationFrame(x),x=0,g=null,p=0}function D(){return typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches}function X(h,G=$n){if(D()){j(),y=h,S();return}if(g=h,T=performance.now(),x)return;let Y=ie=>{let se=Math.min((ie-T)/1e3,.03333333333333333);if(T=ie,g===null){x=0;return}let Ee=Wt(y,p,g,se,G);if(y=Ee.x,p=Ee.v,S(),_t(y,p,g)){y=g,p=0,g=null,x=0,S();return}x=requestAnimationFrame(Y)};x=requestAnimationFrame(Y)}function re(h,G){let Y=vn(h,r,o,n),ie=Y!==i;i=Y,z(),G?X(zt(i,o,n)):(j(),y=zt(i,o,n),S()),ie&&t.onChange(i)}let te=null,J=!0,w=null,F=1,ae=0,H=0;function U(h){if(ae=h,h===0){a.style.width="",a.style.transform="";return}a.style.width=`calc(100% + ${Math.abs(h)}px)`,a.style.transform=h<0?`translateX(${h}px)`:""}function R(){if(ae===0)return;if(D()){U(0),a.style.width="",a.style.transform="";return}let h=0,G=performance.now(),Y=ie=>{let se=Math.min((ie-G)/1e3,.03333333333333333);G=ie;let Ee=Wt(ae,h,0,se,yi);if(h=Ee.v,U(Ee.x),_t(Ee.x,h,0,.05)){U(0),a.style.width="",a.style.transform="",H=0;return}H=requestAnimationFrame(Y)};H=requestAnimationFrame(Y)}function K(h){if(!w)return 0;let G=b();return G<=0?0:(h-w.left)/F/G}let ne=h=>{if(!(u||h.button!==0)){h.preventDefault();try{a.setPointerCapture(h.pointerId)}catch{}te={x:h.clientX,y:h.clientY},J=!0,w=a.getBoundingClientRect(),F=Be(a).x||1,a.setAttribute("data-awake","")}},me=h=>{if(!te)return;let G=h.clientX-te.x,Y=h.clientY-te.y;J&&Math.hypot(G,Y)>$i&&(J=!1,a.setAttribute("data-dragging","")),!(J||!w)&&(D()||(h.clientX<w.left?U(Ro(w.left-h.clientX,-1)):h.clientX>w.right?U(Ro(h.clientX-w.right,1)):ae!==0&&U(0)),j(),re(Po(K(h.clientX),o,n),!1))},c=h=>{te&&(J&&re(bi(Po(K(h.clientX),o,n),o,n,r),!0),t.onCommit?.(i),R(),te=null,a.removeAttribute("data-dragging"),v||a.removeAttribute("data-awake"))},M=()=>{te&&(U(0),a.style.width="",a.style.transform="",te=null,a.removeAttribute("data-dragging"),v||a.removeAttribute("data-awake"))},v=!1,I=()=>{v=!0,a.setAttribute("data-awake","")},d=()=>{v=!1,te||a.removeAttribute("data-awake")},u=null,m=!1,N=0;function A(){if(u)return;u=document.createElement("input"),u.className="sl-input",u.type="text",u.setAttribute("aria-label",`${t.label} value`),u.value=i.toFixed(Do(i,r,o,n)),L.style.display="none",a.appendChild(u),u.focus(),u.select();let h=G=>{if(u){if(G){let Y=parseFloat(u.value);Number.isFinite(Y)&&(re(Math.max(o,Math.min(n,Y)),!0),t.onCommit?.(i))}u.remove(),u=null,L.style.display="",C(!1),a.focus()}};u.addEventListener("keydown",G=>{G.stopPropagation(),G.key==="Enter"?(G.preventDefault(),h(!0)):G.key==="Escape"&&(G.preventDefault(),h(!1))}),u.addEventListener("blur",()=>h(!0)),u.addEventListener("pointerdown",G=>G.stopPropagation())}function C(h){m=h,L.toggleAttribute("data-editable",h)}L.addEventListener("pointerenter",()=>{u||te||(N=window.setTimeout(()=>C(!0),Ei))}),L.addEventListener("pointerleave",()=>{clearTimeout(N),u||C(!1)}),L.addEventListener("pointerdown",h=>{m&&(h.stopPropagation(),h.preventDefault(),A())});let P=h=>{if(h.target!==a||h.altKey||h.metaKey||h.ctrlKey)return;let G=fi(h.key,i,o,n,r,h.shiftKey);if(G===void 0){if(h.key!=="Enter")return;h.preventDefault(),h.stopPropagation(),C(!0),A();return}h.preventDefault(),h.stopPropagation(),re(G,!1),t.onCommit?.(i)};return a.addEventListener("pointerdown",ne),a.addEventListener("pointermove",me),a.addEventListener("pointerup",c),a.addEventListener("pointercancel",M),a.addEventListener("lostpointercapture",M),a.addEventListener("pointerenter",I),a.addEventListener("pointerleave",d),a.addEventListener("keydown",P),z(),requestAnimationFrame(S),{el:a,set(h){i=vn(h,r,o,n),z(),j(),y=zt(i,o,n),S()},destroy(){j(),H&&cancelAnimationFrame(H),clearTimeout(N),a.remove()}}}function ke(e,t){return getComputedStyle(e).getPropertyValue(t).trim()}function Ti(e,t){let o=parseFloat(e);if(e.endsWith("px")&&Number.isFinite(o)){let r=ln(o,t)[0];if(r)return r}return wt(e)?Dt(e,t)[0]??null:null}function Ai(e){if(e.length===0)return"";let t=new Map;for(let n of e){let r=t.get(n.selector)??[];r.push(n),t.set(n.selector,r)}let o=["These changes were made live in the browser and are not in the source yet.","Apply them, preferring the named token wherever one is given.",""];for(let[n,r]of t){o.push(`${n} {`);for(let i of r){let a=i.token?`var(${i.token})`:i.to,s=i.token?`  /* ${i.to}, was ${i.from} */`:`  /* was ${i.from} */`;o.push(`  ${i.prop}: ${a};${s}`)}o.push("}","")}return o.join(`
`).trimEnd()}function Oo(){let e=new Map,t=!1;function o(r){let i=e.get(r);if(i)return i;let a=new Map;return e.set(r,a),a}function n(r,i,a){let s=r.style;a.inline?s.setProperty(i,a.inline):s.removeProperty(i)}return{get armed(){return t},arm(){t=!0},disarm(){let r=this.revertAll();return t=!1,r},set(r,i,a){if(!t)return;let s=o(r);s.has(i)||s.set(i,{inline:r.style.getPropertyValue(i),computed:ke(r,i)}),r.style.setProperty(i,a)},revert(r,i){let a=e.get(r),s=a?.get(i);!a||!s||(n(r,i,s),a.delete(i),a.size===0&&e.delete(r))},revertAll(){let r=0;for(let[i,a]of e)for(let[s,l]of a)n(i,s,l),r+=1;return e.clear(),r},touched(r,i){return e.get(r)?.has(i)??!1},touchedProps(r){return[...e.get(r)?.keys()??[]].sort()},changes(){let r=[];for(let[i,a]of e)for(let[s,l]of a)r.push({el:i,prop:s,from:l.computed,to:ke(i,s)});return r},asPrompt(){let r=[];for(let[i,a]of e){let s=Pt(i),l=vt(i);for(let[E,$]of a){let L=ke(i,E);L!==$.computed&&r.push({selector:l,prop:E,from:$.computed,to:L,token:Ti(L,s)})}}return Ai(r)}}}var pe=(e,t=0,o=1)=>Math.max(t,Math.min(o,e)),En=e=>(e%360+360)%360,Kt=(e,t)=>e.map(o=>o.reduce((n,r,i)=>n+r*t[i],0)),Li=e=>Math.abs(e)<=.04045?e/12.92:Math.sign(e)*((Math.abs(e)+.055)/1.055)**2.4,Ni=e=>Math.abs(e)<=.0031308?12.92*e:Math.sign(e)*(1.055*Math.abs(e)**.4166666666666667-.055),Ri=[[.4123907993,.3575843394,.1804807884],[.2126390059,.7151686788,.0721923154],[.0193308187,.1191947798,.9505321522]],Pi=[[.4865709486,.2656676932,.1982172852],[.2289745641,.6917385218,.0792869141],[0,.0451133819,1.0439443689]],Di=[[3.2409699419,-1.5373831776,-.4986107603],[-.9692436363,1.8759675015,.0415550574],[.0556300797,-.2039769589,1.0569715142]],Ii=[[2.4934969119,-.9313836179,-.4027107845],[-.8294889696,1.7626640603,.0236246858],[.0358458302,-.0761723893,.956884524]],Hi=[[.819022438,.3619062601,-.1288737815],[.0329836539,.9292868616,.0361446664],[.0481771894,.2642395318,.6335478285]],Gi=[[1.2268798734,-.5578149966,.2813910502],[-.0405757626,1.1122868294,-.0717110667],[-.0763729497,-.421493324,1.5869240244]];function Mt(e,t=1,o="srgb"){let n=Kt(o==="p3"?Pi:Ri,e.map(Li)),[r,i,a]=Kt(Hi,n).map(Math.cbrt),s=.2104542553*r+.793617785*i-.0040720468*a,l=1.9779984951*r-2.428592205*i+.4505937099*a,E=.0259040371*r+.7827717662*i-.808675766*a,$=Math.hypot(l,E);return{l:pe(s),c:$<1e-7?0:$,h:$<1e-7?0:En(Math.atan2(E,l)*180/Math.PI),a:pe(t)}}function Tt(e,t="srgb"){let o=e.c*Math.cos(e.h*Math.PI/180),n=e.c*Math.sin(e.h*Math.PI/180),r=[(e.l+.3963377774*o+.2158037573*n)**3,(e.l-.1055613458*o-.0638541728*n)**3,(e.l-.0894841775*o-1.291485548*n)**3];return Kt(t==="p3"?Ii:Di,Kt(Gi,r)).map(Ni)}function Bo(e,t="srgb"){return Tt(e,t).every(o=>o>=-1e-5&&o<=1.00001)}function Yt(e,t="srgb"){if(Bo(e,t))return e;let o=0,n=e.c;for(let r=0;r<20;r++){let i=(o+n)/2;Bo({...e,c:i},t)?o=i:n=i}return{...e,c:o}}function Ze(e,t,o="srgb"){return e<=0||e>=1?0:Yt({l:e,c:.5,h:t,a:1},o).c}function Je(e){let t=e.trim();return/^oklch\(/i.test(t)?"oklch":/^color\(display-p3\s/i.test(t)?"p3":"hex"}var Ct=(e,t=4)=>Number(e.toFixed(t));function Ye(e,t){let o=e.a<1?` / ${Ct(e.a)}`:"";if(t==="oklch")return`oklch(${Ct(e.l)} ${Ct(e.c)} ${Ct(e.h,2)}${o})`;let n=t==="p3"?"p3":"srgb",r=Tt(Yt(e,n),n);if(t==="p3")return`color(display-p3 ${r.map(a=>Ct(pe(a),5)).join(" ")}${o})`;let i=r.map(a=>Math.round(pe(a)*255));return e.a<1&&i.push(Math.round(e.a*255)),"#"+i.map(a=>a.toString(16).padStart(2,"0")).join("")}var Oi=/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?(%|deg|grad|rad|turn)?$/i;function Ke(e,t=1,o=!1){let n=e.match(Oi);if(!n)return null;let r=parseFloat(e);if(!Number.isFinite(r))return null;let i=n[1]?.toLowerCase();return o?i==="rad"?r*180/Math.PI:i==="turn"?r*360:i==="grad"?r*.9:!i||i==="deg"?r:null:i==="%"?r*t/100:i?null:r}function Fe(e){let t=e.trim().toLowerCase();if(t==="transparent")return{l:0,c:0,h:0,a:0};if(/^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/.test(t)){let y=t.slice(1);y.length<=4&&(y=[...y].map(g=>g+g).join(""));let p=y.match(/../g).map(g=>parseInt(g,16)/255);return Mt(p.slice(0,3),p[3]??1)}let o=t.match(/^(oklch|rgb|rgba|hsl|hsla|color)\(([^()]*)\)$/);if(!o)return null;let n=o[1],r=o[2].trim(),i=n==="color";if(i){if(!r.startsWith("display-p3 "))return null;r=r.slice(11).trim()}let a=r.includes(",");if(a&&(i||n==="oklch"||r.includes("/")))return null;let s=a?r.split(",").map(y=>y.trim()):r.split(/\s*\/\s*/);if(!a&&s.length>2)return null;let l=a?s.slice(0,3):s[0].split(/\s+/);if(l.length!==3||a&&s.length!==3&&s.length!==4||a&&n.startsWith("rgb")&&l.some(y=>y.endsWith("%"))&&!l.every(y=>y.endsWith("%")))return null;let E=a?s[3]:s[1],$=E===void 0?1:Ke(E);if($===null)return null;if(n==="oklch"){let y=Ke(l[0]),p=Ke(l[1],.4),g=Ke(l[2],1,!0);return y===null||p===null||g===null?null:{l:pe(y),c:Math.max(0,p),h:En(g),a:pe($)}}if(n.startsWith("hsl")){let y=Ke(l[0],1,!0),p=Ke(l[1]),g=Ke(l[2]);if(y===null||p===null||g===null||!l[1].endsWith("%")||!l[2].endsWith("%"))return null;let x=pe(p),T=pe(g),b=x*Math.min(T,1-T),S=z=>{let j=(z+En(y)/30)%12;return T-b*Math.max(-1,Math.min(j-3,9-j,1))};return Mt([S(0),S(8),S(4)],$)}let L=l.map(y=>Ke(y,i?1:255));return L.some(y=>y===null)?null:Mt(L.map(y=>i?y:pe(y/255)),$,i?"p3":"srgb")}function dt(e,t=!1){return Ye(t?{...e,a:1}:e,"oklch")}var zo=148,Bi=14,jt=12,Fo=`
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
  box-shadow: ${Bt};
  /*
   * Typography too, for the same reason: it is not inside the dock, so it
   * inherits from a host pinned by all: initial, and comes out in the
   * browser's default serif at the browser's default size.
   */
  font-family: ${O.stack};
  font-synthesis: none;
  font-size: ${O.body}px;
  font-weight: ${q.regular};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${k.primary};
  transition: opacity ${W.ui}, translate ${W.ui};
}
@starting-style { .pick { opacity: 0; translate: 0 -4px; } }
.pick[data-closing] { opacity: 0; translate: 0 -4px; }

/* The plane. */
.pick-plane {
  position: relative;
  width: 100%; height: ${zo}px;
  cursor: crosshair; touch-action: none;
}
.pick-plane:focus-visible { outline: 2px solid ${k.primary}; outline-offset: 2px; }
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
  height: ${Bi}px;
  cursor: pointer; touch-action: none;
}
.pick-track:focus-visible { outline: 2px solid ${k.primary}; outline-offset: 2px; }
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
  width: ${jt}px; height: ${jt}px;
  margin-top: -${jt/2}px; margin-left: -${jt/2}px;
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
  background: ${_(3)}; color: ${k.secondary};
  font: inherit; font-size: ${O.tag}px; font-weight: ${q.medium};
  cursor: pointer;
  transition: background ${W.ui}, color ${W.ui};
}
.pick-fmt:hover { background: ${_(4)}; color: ${k.primary}; }
.pick-fmt[data-on] { background: ${k.primary}; color: ${xe}; }
.pick-fmt:focus-visible { outline: 2px solid ${k.secondary}; outline-offset: -2px; }

.pick-css {
  flex: 1; min-width: 0;
  height: 24px; padding: 0 ${B.base/2}px;
  border: 0; border-radius: 0;
  background: ${_(2)}; color: ${k.primary};
  font: inherit; font-size: ${O.tag}px;
  font-variant-numeric: tabular-nums;
}
.pick-css[aria-invalid] { color: ${k.primary}; background: ${_(4)}; }
.pick-css:focus-visible { outline: 2px solid ${k.secondary}; outline-offset: -2px; }

.pick-dropper {
  flex: none;
  display: grid; place-items: center;
  width: 24px; height: 24px;
  padding: 0; border: 0; border-radius: 0;
  background: ${_(2)}; color: ${k.secondary};
  cursor: pointer;
  transition: background ${W.ui}, color ${W.ui};
}
.pick-dropper:hover { background: ${_(4)}; color: ${k.primary}; }
.pick-dropper:focus-visible { outline: 2px solid ${k.secondary}; outline-offset: -2px; }

/* Out of gamut in the chosen output space. */
.pick-warn {
  display: none;
  align-items: center; gap: ${B.tight}px;
  color: ${k.secondary}; font-size: ${O.tag}px;
}
.pick[data-clipped] .pick-warn { display: flex; }

@media (prefers-reduced-motion: reduce) {
  .pick { transition: none; }
}
`,zi="conic-gradient("+ue+" 0 25%, transparent 0 50%, "+ue+" 0 75%, transparent 0)";function Se(e,t){let o=document.createElement(e);return o.className=t,o instanceof HTMLButtonElement&&(o.type="button"),o}function Ut(e,t){let o=Fe(t.value)??{l:.5,c:0,h:0,a:1},n=Je(t.value),r=0,i="",a=Se("div","pick");a.setAttribute("role","dialog"),a.setAttribute("aria-label","Colour picker"),a.style.setProperty("--checker",zi);let s=Se("div","pick-plane");s.tabIndex=0,s.setAttribute("role","application"),s.setAttribute("aria-label","Colour field. Arrow keys adjust lightness and saturation.");let l=Se("canvas","pick-canvas");l.setAttribute("aria-hidden","true");let E=Se("span","pick-marker");s.append(l,E);let $=U("pick-hue","Hue"),L=U("pick-alpha","Opacity"),y=Se("div","pick-row"),p=Se("div","pick-seg");p.setAttribute("role","radiogroup"),p.setAttribute("aria-label","Colour format");let g=["hex","oklch","p3"],x={hex:"Hex",oklch:"OKLCH",p3:"P3"},T=g.map(d=>{let u=Se("button","pick-fmt");return u.textContent=x[d],u.setAttribute("role","radio"),u.addEventListener("click",()=>R(o,d)),p.append(u),u});y.append(p);let b=Se("div","pick-row"),S=Se("input","pick-css");if(S.type="text",S.spellcheck=!1,S.setAttribute("aria-label","CSS colour"),b.append(S),"EyeDropper"in window){let d=Se("button","pick-dropper");d.setAttribute("aria-label","Pick a colour from the screen"),d.append(ve("pick",14)),d.addEventListener("click",async()=>{try{let u=window.EyeDropper,m=await new u().open(),N=Fe(m.sRGBHex);N&&R({...N,a:o.a})}catch{}}),b.append(d)}let j=Se("div","pick-warn");j.append(ve("warning",12));let D=document.createElement("span");j.append(D),a.append(s,$.el,L.el,y,b,j),e.append(a);let X=()=>n==="hex"?"srgb":"p3",re=l.getContext("2d",{colorSpace:"display-p3"}),te=re?.getContextAttributes?.().colorSpace==="display-p3"?"p3":"srgb",J="",w=0;function F(){if(!re)return;let d=`${o.h.toFixed(3)}:${X()}:${l.width}`;if(d===J)return;J=d;let{width:u,height:m}=l,N=re.createImageData(u,m);for(let A=0;A<m;A++){let C=1-A/(m-1),P=Ze(C,o.h,X());for(let h=0;h<u;h++){let G=Tt({l:C,c:h/(u-1)*P,h:o.h,a:1},te),Y=(A*u+h)*4;N.data[Y]=Math.round(pe(G[0])*255),N.data[Y+1]=Math.round(pe(G[1])*255),N.data[Y+2]=Math.round(pe(G[2])*255),N.data[Y+3]=255}}re.putImageData(N,0,0)}function ae(){let d=Math.min(devicePixelRatio||1,2),u=Math.max(1,Math.round(s.clientWidth*d)),m=Math.max(1,Math.round(zo*d));l.width===u&&l.height===m||(l.width=u,l.height=m,J="")}function H(d){let u=s.getBoundingClientRect(),m=1-pe((d.clientY-u.top)/u.height);r=pe((d.clientX-u.left)/u.width),R({...o,l:m,c:r*Ze(m,o.h,X())})}s.addEventListener("pointerdown",d=>{if(d.button===0){d.preventDefault(),s.focus({preventScroll:!0});try{s.setPointerCapture(d.pointerId)}catch{}H(d)}}),s.addEventListener("pointermove",d=>{s.hasPointerCapture(d.pointerId)&&H(d)}),s.addEventListener("pointerup",d=>{s.hasPointerCapture(d.pointerId)&&s.releasePointerCapture(d.pointerId)}),s.addEventListener("keydown",d=>{if(!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(d.key))return;d.preventDefault();let u=d.shiftKey?.1:.01,m=pe(o.l+(d.key==="ArrowUp"?u:d.key==="ArrowDown"?-u:0));r=pe(r+(d.key==="ArrowRight"?u:d.key==="ArrowLeft"?-u:0)),R({...o,l:m,c:r*Ze(m,o.h,X())})});function U(d,u){let m=Se("div",`pick-track ${d}`);m.tabIndex=0,m.setAttribute("role","slider"),m.setAttribute("aria-label",u);let N=Se("div","pick-track-bed"),A=Se("div","pick-thumb");m.append(N,A);let C=0,P=0,h=0,G=0,Y=0,ie=!1,se=()=>{},Ee=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;function Ce(){A.style.left=`${C*100}%`}function Ae(){G&&cancelAnimationFrame(G),G=0,P=0}function De(V){if(h=V,Ee()){Ae(),C=V,Ce();return}if(Y=performance.now(),G)return;let de=We=>{let it=Math.min((We-Y)/1e3,.03333333333333333);Y=We;let he=Wt(C,P,h,it,$n);if(C=he.x,P=he.v,Ce(),_t(C,P,h,5e-4)){C=h,P=0,G=0,Ce();return}G=requestAnimationFrame(de)};G=requestAnimationFrame(de)}function Ge(V){let de=m.getBoundingClientRect();return pe((V.clientX-de.left)/de.width)}m.addEventListener("pointerdown",V=>{if(V.button!==0)return;V.preventDefault(),m.focus({preventScroll:!0});try{m.setPointerCapture(V.pointerId)}catch{}let de=Ge(V);De(de),se(de),ie=!0}),m.addEventListener("pointermove",V=>{if(!ie||!m.hasPointerCapture(V.pointerId))return;let de=Ge(V);Ae(),C=de,h=de,Ce(),se(de)});let rt=V=>{ie=!1,m.hasPointerCapture(V.pointerId)&&m.releasePointerCapture(V.pointerId)};return m.addEventListener("pointerup",rt),m.addEventListener("pointercancel",rt),m.addEventListener("keydown",V=>{let de=V.shiftKey?.1:.01,We=V.key==="ArrowRight"?de:V.key==="ArrowLeft"?-de:V.key==="Home"?-1:V.key==="End"?1:0;if(!We)return;V.preventDefault();let it=pe(C+We);De(it),se(it)}),{el:m,set(V,de){m.setAttribute("aria-valuenow",de),m.setAttribute("aria-valuetext",de),!ie&&(Ae(),C=V,h=V,Ce())},bind(V){se=V},gradient(V){N.style.setProperty("--track",V)},thumbColour(V){A.style.setProperty("--thumb",V)},destroy(){Ae()}}}$.bind(d=>{let u=d*360;R({...o,h:u,c:r*Ze(o.l,u,X())})}),L.bind(d=>R({...o,a:d}));function R(d,u=n){n=u,o=n==="oklch"?d:Yt(d,n==="p3"?"p3":"srgb");let m=Ye(o,n);i=m,me(),t.onChange(m)}function K(d){let u=Fe(d.value);return u?(d.removeAttribute("aria-invalid"),d.title="",o={...u,h:u.c<1e-7?o.h:u.h},n=Je(d.value),i=d.value.trim(),me(),t.onChange(i),!0):(d.setAttribute("aria-invalid","true"),d.title="Hex, rgb(), hsl(), oklch() or color(display-p3 ...)",!1)}S.addEventListener("change",()=>K(S)),S.addEventListener("keydown",d=>{d.key==="Enter"&&(d.preventDefault(),K(S)),d.key==="Escape"&&(S.value=i,S.removeAttribute("aria-invalid")),d.stopPropagation()}),S.addEventListener("blur",()=>{S.hasAttribute("aria-invalid")&&(S.value=i,S.removeAttribute("aria-invalid"))});let ne="";function me(){let d=X(),u=Ze(o.l,o.h,d);u>0&&(r=pe(o.c/u)),E.style.left=`${r*100}%`,E.style.top=`${(1-o.l)*100}%`,E.style.background=dt(o,!0),$.set(o.h/360,`${Math.round(o.h)} degrees`),L.set(o.a,`${Math.round(o.a*100)} percent`);let m=`${o.l.toFixed(4)}:${r.toFixed(4)}:${d}`;if(m!==ne){ne=m;let A=Array.from({length:73},(C,P)=>{let h=P*5;return Ye({l:o.l,c:r*Ze(o.l,h,d),h,a:1},"oklch")});$.gradient(`linear-gradient(to right in oklab, ${A.join(", ")})`)}$.thumbColour(dt(o,!0)),L.gradient(`linear-gradient(to right in oklab, ${dt({...o,a:0})}, ${dt(o,!0)})`),L.thumbColour(dt(o)),T.forEach((A,C)=>{let P=g[C]===n;A.toggleAttribute("data-on",P),A.setAttribute("aria-checked",String(P)),A.tabIndex=P?0:-1}),document.activeElement!==S&&e.activeElement!==S&&(S.value=Ye(o,n),S.removeAttribute("aria-invalid"));let N=n==="oklch"&&!Tt(o,"srgb").every(A=>A>=-1e-5&&A<=1.00001);a.toggleAttribute("data-clipped",N),N&&(D.textContent="Outside sRGB \u2014 clipped on older displays"),cancelAnimationFrame(w),w=requestAnimationFrame(F)}function c(){let d=t.anchor.getBoundingClientRect(),u=248,m=a.offsetHeight||320,A=d.left+d.width/2<innerWidth/2?d.right+B.base:d.left-u-B.base;A=pe(A,B.base,Math.max(B.base,innerWidth-u-B.base));let C=d.top;C+m>innerHeight-B.base&&(C=innerHeight-m-B.base),C=Math.max(B.base,C),a.style.left=`${A}px`,a.style.top=`${C}px`}ae(),me(),c(),requestAnimationFrame(c);let M=()=>c();addEventListener("scroll",M,!0),addEventListener("resize",M);let v=new ResizeObserver(()=>{ae(),me()});v.observe(s);let I=!1;return{contains(d){return d?a.contains(d):!1},update(d){if(I||d===i)return;let u=Fe(d);u&&(o={...u,h:u.c<1e-7?o.h:u.h},n=Je(d),me())},destroy(){if(I)return;I=!0,cancelAnimationFrame(w),$.destroy(),L.destroy(),v.disconnect(),removeEventListener("scroll",M,!0),removeEventListener("resize",M),a.setAttribute("data-closing","");let d=()=>a.remove();a.addEventListener("transitionend",d,{once:!0}),setTimeout(d,260),t.onClose?.()}}}var Wo={x:0,y:0,blur:0,spread:0,colour:"rgba(0, 0, 0, 0.2)",inset:!1};function Fi(e,t){let o=[],n=0,r="";for(let i of e){if(i==="("?n+=1:i===")"&&(n-=1),i===t&&n===0){o.push(r.trim()),r="";continue}r+=i}return r.trim()&&o.push(r.trim()),o.filter(Boolean)}function Wi(e){let t=e.trim();if(!t||t==="none")return null;let o=t,n=/(^|\s)inset(\s|$)/.test(o);n&&(o=o.replace(/(^|\s)inset(\s|$)/," ").trim());let r=[];o=o.replace(/[a-z-]+\([^)]*\)/gi,l=>(r.push(l),`@${r.length-1}`));let i=o.split(/\s+/).filter(Boolean).map(l=>l.startsWith("@")?r[Number(l.slice(1))]:l),a=[],s=[];for(let l of i)/^-?\d*\.?\d+(px|em|rem|%)?$/.test(l)?a.push(parseFloat(l)):s.push(l);return a.length<2?null:{x:a[0]??0,y:a[1]??0,blur:a[2]??0,spread:a[3]??0,colour:s[0]??"rgba(0, 0, 0, 0.2)",inset:n}}function _o(e){return!e||e.trim()==="none"?[]:Fi(e,",").map(Wi).filter(t=>t!==null)}function _i(e){let t=`${e.x}px ${e.y}px ${e.blur}px ${e.spread}px ${e.colour}`;return e.inset?`inset ${t}`:t}function Xo(e){return e.length===0?"none":e.map(_i).join(", ")}function Cn(e,t,o){let n=[...e];if(t<0||t>=n.length||o<0||o>=n.length)return n;let[r]=n.splice(t,1);return r!==void 0&&n.splice(o,0,r),n}function Mn(e){let t=/blur\(\s*(-?\d*\.?\d+)px\s*\)/i.exec(e||"");return t?parseFloat(t[1]):0}function Ko(e){return e<=0?"none":`blur(${e}px)`}function Xi(e){return-e.spread-e.blur/2}function Ki(e){let t=Xi(e),o=[];return e.y<-t&&o.push("top"),e.x>t&&o.push("right"),e.y>t&&o.push("bottom"),e.x<-t&&o.push("left"),o.length===1?o[0]:"all"}function Sn(e,t){if(t==="all")return{...e,spread:Math.max(0,e.spread)};let o=Math.ceil(e.blur/2),n=o-e.blur/2,r=Math.max(Math.abs(e.x),Math.abs(e.y));r<=n&&(r=n+Math.max(1,Math.round(e.blur/2)));let i=-o;switch(t){case"top":return{...e,x:0,y:-r,spread:i};case"bottom":return{...e,x:0,y:r,spread:i};case"left":return{...e,x:-r,y:0,spread:i};case"right":return{...e,x:r,y:0,spread:i}}}function Yo(e){let t=Ki(e);return t==="all"?"all":t==="top"||t==="bottom"?"y":"x"}function jo(e,t){return t==="all"?Sn(e,"all"):t==="y"?Sn(e,e.y<0?"top":"bottom"):Sn(e,e.x<0?"left":"right")}function Yi(e){let t=getComputedStyle(e).display;return t.includes("flex")||t.includes("grid")}var Vt=["top","right","bottom","left"],ji=["border-top-left-radius","border-top-right-radius","border-bottom-right-radius","border-bottom-left-radius"],Ui=[{name:"Type",specs:[{prop:"font-size",label:"Size",kind:"length",glyph:"fontSize",min:8,max:96,step:1,unit:"px"},{prop:"font-weight",label:"Weight",kind:"number",glyph:"fontWeight",min:100,max:900,step:100},{prop:"line-height",label:"Line height",kind:"length",glyph:"lineHeight",min:0,max:96,step:1,unit:"px"},{prop:"letter-spacing",label:"Tracking",kind:"length",glyph:"tracking",min:-4,max:12,step:.1,unit:"px",more:!0},{prop:"font-style",label:"Style",kind:"choice",glyph:"italic",options:["normal","italic"],more:!0},{prop:"text-align",label:"Align",kind:"choice",glyph:"textAlign",options:["start","center","end","justify"],more:!0},{prop:"text-transform",label:"Case",kind:"choice",glyph:"textCase",options:["none","uppercase","lowercase","capitalize"],more:!0},{prop:"text-decoration-line",label:"Decoration",kind:"choice",glyph:"underline",options:["none","underline","line-through"],more:!0}]},{name:"Colour",specs:[{prop:"color",label:"Text",kind:"colour",glyph:"textColour"},{prop:"background-color",label:"Background",kind:"colour",glyph:"backgroundColour"},{prop:"opacity",label:"Opacity",kind:"number",glyph:"opacity",min:0,max:1,step:.01}]},{name:"Box",specs:[{prop:"padding",label:"Padding",kind:"length",glyph:"padding",min:0,max:128,step:1,unit:"px",sides:Vt.map(e=>`padding-${e}`)},{prop:"margin",label:"Margin",kind:"length",glyph:"margin",min:-64,max:128,step:1,unit:"px",sides:Vt.map(e=>`margin-${e}`)},{prop:"width",label:"Width",kind:"length",glyph:"widthIcon",min:0,max:1600,step:1,unit:"px",more:!0},{prop:"height",label:"Height",kind:"length",glyph:"heightIcon",min:0,max:1200,step:1,unit:"px",more:!0},{prop:"box-sizing",label:"Sizing",kind:"choice",glyph:"boxSizing",options:["content-box","border-box"]}]},{name:"Border",specs:[{prop:"border-width",label:"Width",kind:"length",glyph:"borderWidth",min:0,max:24,step:1,unit:"px",sides:Vt.map(e=>`border-${e}-width`)},{prop:"border-color",label:"Colour",kind:"colour",glyph:"borderColour",sides:Vt.map(e=>`border-${e}-color`)},{prop:"border-style",label:"Style",kind:"choice",glyph:"borderStyle",options:["none","solid","dashed","dotted"]},{prop:"border-radius",label:"Radius",kind:"length",glyph:"borderRadius",min:0,max:64,step:1,unit:"px",sides:ji}]},{name:"Effects",specs:[{prop:"box-shadow",label:"Shadow",kind:"shadow",glyph:"shadow"},{prop:"backdrop-filter",label:"Backdrop blur",kind:"blur",glyph:"backdrop",min:0,max:40,step:1,unit:"px",more:!0}]},{name:"Layout",when:Yi,specs:[{prop:"display",label:"Display",kind:"choice",glyph:"boxSizing",options:["block","flex","grid","inline-flex","inline-block","none"]},{prop:"flex-direction",label:"Direction",kind:"choice",glyph:"flexDirection",options:["row","column","row-reverse","column-reverse"],more:!0},{prop:"justify-content",label:"Justify",kind:"choice",glyph:"justify",options:["flex-start","center","flex-end","space-between"],more:!0},{prop:"align-items",label:"Align",kind:"choice",glyph:"alignItems",options:["stretch","flex-start","center","flex-end"],more:!0},{prop:"flex-wrap",label:"Wrap",kind:"choice",glyph:"flexWrap",options:["nowrap","wrap"],more:!0},{prop:"gap",label:"Gap",kind:"length",glyph:"gap",min:0,max:96,step:1,unit:"px"}]}];function qt(e){let t=parseFloat(e);return Number.isFinite(t)?t:0}var Vi=320,qi=Fo+st+`
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
  width: ${Vi}px;
  max-height: calc(100vh - ${B.edge*2}px);
  overflow: hidden;
  display: none;
  flex-direction: column;
  pointer-events: auto;
  font-family: ${O.stack};
  font-synthesis: none;
  font-size: ${O.body}px;
  font-weight: ${q.regular};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${k.primary};
  background: ${xe};
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
  transition: opacity ${W.ui}, translate ${W.ui}, display ${W.ui} allow-discrete;
}

/* The bar that says the tool wrote this row. Worth a fade: it is the panel
   admitting to something, and it should be noticed without being a movement. */
.edit-row::before { transition: opacity ${W.ui}; }

@media (prefers-reduced-motion: reduce) {
  .edit-dock { transition: opacity ${W.ui}; translate: none; }
  @starting-style { .edit-dock[data-open] { translate: none; } }
  .edit-opt:active, .edit-mini:active, .edit-add:active,
  .edit-action:active { scale: 1; }
}

.edit-head {
  display: flex; align-items: center; gap: ${B.base}px;
  flex: none;
  height: ${Xe}px;
  padding: 0 ${B.base}px 0 ${B.roomy}px;
  border-bottom: 1px solid ${ue};
}
.edit-title { font-size: ${O.title}px; font-weight: ${q.semibold}; }
.edit-subject {
  flex: 1; min-width: 0;
  color: ${k.tertiary};
  font-size: ${O.tag}px;
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
  transition: scrollbar-color ${W.ui};
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
  transition: background ${W.ui};
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
  font-size: ${O.tag}px; font-weight: ${q.semibold};
  letter-spacing: 0.04em; text-transform: uppercase;
  color: ${k.secondary};
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
  min-height: ${Xe}px;
}
.edit-glyph {
  flex: none;
  display: grid; place-items: center;
  width: 15px; height: 15px;
  color: ${k.tertiary};
}

.edit-label {
  flex: none; width: 74px;
  color: ${k.secondary};
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
  background: ${_(2)}; color: ${k.secondary};
  font: inherit; font-size: ${O.tag}px; cursor: pointer;
  transition: background ${W.ui}, color ${W.ui};
}
.edit-opt:hover { background: ${_(4)}; color: ${k.primary}; }
.edit-opt:active { scale: 0.96; }
.edit-opt:focus-visible { outline: 2px solid ${k.secondary}; outline-offset: -2px; }
.edit-opt[data-on] { background: ${k.primary}; color: ${xe}; }

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
.edit-colour:focus-within { outline: 2px solid ${k.secondary}; outline-offset: -2px; }
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
.edit-swatch:focus-visible { outline: 2px solid ${k.secondary}; outline-offset: -2px; }
.edit-hex {
  flex: 1; min-width: 0;
  padding: 0 6px;
  border: 0; border-radius: 0;
  background: none; color: ${k.primary};
  font: inherit; font-size: ${O.tag}px;
  font-variant-numeric: tabular-nums;
}
/* The field owns the focus ring now; the input inside it does not draw a second. */
.edit-hex:focus-visible { outline: none; }

.edit-row-name {
  display: flex; align-items: center; gap: 6px;
  /* Half the gap between rows, so the name binds to its own control rather
     than floating between two of them. */
  margin: 0 0 ${B.tight}px;
  color: ${k.secondary};
  font-size: ${O.tag}px; font-weight: ${q.regular};
}
.edit-row-name .edit-glyph { color: ${k.tertiary}; }
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
  color: ${k.secondary};
  font-size: ${O.tag}px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.edit-swatch-solo { width: 24px; height: 24px; }
.edit-mini {
  flex: none;
  display: grid; place-items: center;
  width: 24px; height: 24px;
  padding: 0; border: 0; border-radius: 0;
  background: ${_(3)}; color: ${k.secondary};
  font: inherit; font-size: ${O.tag}px; line-height: 1;
  cursor: pointer;
}
.edit-mini:hover:not(:disabled) { background: ${_(5)}; color: ${k.primary}; }
.edit-mini:active:not(:disabled) { scale: 0.96; }
.edit-mini:disabled { color: ${k.disabled}; cursor: default; }
.edit-mini:focus-visible { outline: 2px solid ${k.secondary}; outline-offset: -2px; }
.edit-add {
  width: 100%;
  padding: 7px; border: 0; border-radius: 0;
  background: ${_(2)}; color: ${k.secondary};
  font: inherit; font-size: ${O.tag}px; cursor: pointer;
}
.edit-add:hover { background: ${_(4)}; color: ${k.primary}; }
.edit-add:active { scale: 0.96; }
.edit-add:focus-visible { outline: 2px solid ${k.secondary}; outline-offset: -2px; }
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
  background: ${_(1)}; color: ${k.secondary};
  font: inherit; font-size: ${O.tag}px;
  cursor: pointer;
  transition: background ${W.ui}, color ${W.ui};
}
.edit-side-colour:hover { background: ${_(3)}; color: ${k.primary}; }
.edit-side-colour:focus-visible { outline: 2px solid ${k.secondary}; outline-offset: -2px; }
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
  background: none; color: ${k.tertiary};
  cursor: pointer;
}
.edit-linked[data-on] { background: ${_(4)}; color: ${k.primary}; }
.edit-linked:focus-visible { outline: 2px solid ${k.secondary}; outline-offset: -2px; }


.edit-more {
  width: 100%; margin-top: ${B.tight}px;
  padding: 6px; border: 0; border-radius: 0;
  background: none; color: ${k.tertiary};
  font: inherit; font-size: ${O.tag}px; cursor: pointer;
  text-align: left;
}
.edit-more:hover { color: ${k.primary}; }

.edit-foot {
  flex: none;
  display: flex; align-items: center; gap: ${B.base}px;
  padding: ${B.base}px;
  border-top: 1px solid ${ue};
}
.edit-count { flex: 1; color: ${k.tertiary}; font-size: ${O.tag}px; }
.edit-action {
  padding: 7px 10px; border: 0; border-radius: 0;
  background: ${_(3)}; color: ${k.primary};
  font: inherit; font-size: ${O.tag}px; font-weight: ${q.medium};
  cursor: pointer;
  transition: background ${W.ui};
}
.edit-action:hover { background: ${_(5)}; }
.edit-action:active:not(:disabled) { scale: 0.96; }
.edit-action:disabled { color: ${k.disabled}; cursor: default; background: ${_(1)}; }
.edit-action:focus-visible { outline: 2px solid ${k.secondary}; outline-offset: -2px; }

.edit-empty {
  padding: ${B.roomy}px;
  color: ${k.tertiary};
}
`;function Uo(e,t){let o=document.createElement("style");o.textContent=qi,e.appendChild(o);let n=document.createElement("div");n.className="edit-dock",n.setAttribute("role","region"),n.setAttribute("aria-label","Edit the locked element");let r=document.createElement("div");r.className="edit-head";let i=document.createElement("span");i.className="edit-title",i.textContent="Edit";let a=document.createElement("span");a.className="edit-subject",r.append(i,a);let s=document.createElement("div");s.className="edit-body";let l=document.createElement("div");l.className="edit-foot";let E=document.createElement("span");E.className="edit-count";let $=document.createElement("button");$.type="button",$.className="edit-action",$.textContent="Copy as prompt";let L=document.createElement("button");L.type="button",L.className="edit-action",L.textContent="Revert all",l.append(E,L,$),r.setAttribute("data-drag-handle","");let y=at({surface:n});n.append(r,s,l),e.appendChild(n);let p=null,g=!1,x=!1,T=[],b=[];function S(){for(let c of b.splice(0))c()}let z=new Set;function j(){let c=t.changes().length;E.textContent=c===0?"No changes":`${c} change${c===1?"":"s"}`,$.disabled=c===0,L.disabled=c===0}function D(){if(p){for(let c of T){let v=(c.spec.sides??[c.spec.prop]).some(I=>t.touched(p,I));c.el.toggleAttribute("data-touched",v)}j()}}function X(c,M){p&&(t.set(p,c,M),D())}function re(c,M,v){let I=Xt(e,{label:v,value:p?qt(ke(p,M)):0,min:c.min??0,max:c.max??100,step:c.step??1,...c.unit?{unit:c.unit}:{},onChange:d=>{let u=`${d}${c.unit??""}`;if(c.sides&&z.has(c.prop)){for(let m of c.sides)X(m,u);for(let m of T)if(m.spec.prop===c.prop)for(let N of m.sliders)N.set(d)}else X(M,u)}});return{el:I.el,slider:I,sync:()=>{p&&I.set(qt(ke(p,M)))}}}function te(c,M,v){let I=/(^|\s)(top|bottom)(\s|$)/.test(v),d=v==="top"?"sideTop":v==="right"?"sideRight":v==="bottom"?"sideBottom":v==="left"?"sideLeft":void 0,u=Lo(e,{label:`${c.label} ${v}`,value:p?qt(ke(p,M)):0,min:c.min??0,max:c.max??999,step:c.step??1,axis:I?"y":"x",...d?{glyph:d}:{text:v},onChange:m=>{let N=`${m}${c.unit??""}`;if(z.has(c.prop)&&c.sides){for(let A of c.sides)X(A,N);for(let A of T)if(A.spec.prop===c.prop)for(let C of A.scrubs)C.set(m)}else X(M,N)}});return{el:u.el,scrub:u,sync:()=>{p&&u.set(qt(ke(p,M)))}}}function J(c){let M=document.createElement("div");M.className="edit-choice",M.setAttribute("role","group"),M.setAttribute("aria-label",c.label);let v=[];for(let d of c.options??[]){let u=document.createElement("button");u.type="button",u.className="edit-opt",u.textContent=d,u.addEventListener("click",()=>{X(c.prop,d),I()}),v.push(u),M.appendChild(u)}function I(){let d=p?ke(p,c.prop):"";for(let u of v){let m=u.textContent===d;u.toggleAttribute("data-on",m),u.setAttribute("aria-pressed",String(m))}}return{el:M,sync:I}}function w(c,M,v){let I=u=>{let m=u.composedPath();m.includes(c)||m.some(N=>N instanceof Node&&M(N))||v()},d=u=>{(u.composedPath?.()??[]).includes(e.host)||v()};return e.addEventListener("pointerdown",I,!0),document.addEventListener("pointerdown",d,!0),()=>{e.removeEventListener("pointerdown",I,!0),document.removeEventListener("pointerdown",d,!0)}}function F(c,M,v){let I=document.createElement("button");I.type="button",I.className="edit-side-colour",I.setAttribute("aria-haspopup","dialog"),I.setAttribute("aria-expanded","false"),I.setAttribute("aria-label",`${c.label} ${v}`);let d=document.createElement("span");d.className="edit-side-name",d.textContent=v;let u=document.createElement("span");u.className="edit-side-chip",I.append(d,u);let m=null,N=null;function A(){N?.(),N=null,m?.destroy(),m=null,I.setAttribute("aria-expanded","false")}function C(P){if(u.style.setProperty("--swatch",P),z.has(c.prop)&&c.sides){for(let h of c.sides)X(h,P);for(let h of T)h.spec.prop===c.prop&&h.sync()}else X(M,P)}return I.addEventListener("click",()=>{if(m){A();return}let P=p?ke(p,M):"";m=Ut(e,{anchor:I,value:P||"#000000",onChange:C}),I.setAttribute("aria-expanded","true"),N=w(I,h=>m?.contains(h)??!1,A)}),b.push(A),{el:I,sync:()=>{let P=p?ke(p,M):"",h=Fe(P),G=h?Ye(h,Je(P)):P;u.style.setProperty("--swatch",G),m?.update(G)}}}function ae(c){let M=document.createElement("div");M.className="edit-colour";let v=document.createElement("button");v.type="button",v.className="edit-swatch",v.setAttribute("aria-haspopup","dialog"),v.setAttribute("aria-expanded","false"),v.setAttribute("aria-label",`Pick the ${c.label.toLowerCase()} colour`);let I=document.createElement("input");I.type="text",I.className="edit-hex",I.spellcheck=!1,I.setAttribute("aria-label",`${c.label} colour`);let d=null,u=null;function m(){u?.(),u=null,d?.destroy(),d=null,v.setAttribute("aria-expanded","false")}v.addEventListener("click",()=>{if(d){m();return}d=Ut(e,{anchor:v,value:I.value||"#000000",onChange:C=>{I.value=C,N(C),X(c.prop,C)}}),v.setAttribute("aria-expanded","true"),u=w(v,C=>d?.contains(C)??!1,m)}),I.addEventListener("change",()=>{let C=I.value.trim();if(!Fe(C)){A();return}N(C),d?.update(C),X(c.prop,C)});function N(C){v.style.setProperty("--swatch",C)}function A(){let C=p?ke(p,c.prop):"",P=Fe(C),h=P?Ye(P,Je(C)):C;document.activeElement!==I&&e.activeElement!==I&&(I.value=h),N(h),d?.update(h)}return M.append(v,I),b.push(m),{el:M,sync:A}}function H(c){let M=document.createElement("div");M.className="edit-stack";let v=[],I=[];function d(){X(c.prop,Xo(v))}function u(){for(let A of I)A.destroy();I=[],M.textContent="",v.forEach((A,C)=>{let P=document.createElement("div");P.className="edit-layer";let h=document.createElement("div");h.className="edit-layer-head";let G=document.createElement("span");G.className="edit-layer-name",G.textContent=`Layer ${C+1}`;let Y=document.createElement("button");Y.type="button",Y.className="edit-swatch edit-swatch-solo",Y.setAttribute("aria-haspopup","dialog"),Y.setAttribute("aria-expanded","false"),Y.setAttribute("aria-label",`Layer ${C+1} colour`),Y.style.setProperty("--swatch",A.colour);let ie=null,se=null,Ee=()=>{se?.(),se=null,ie?.destroy(),ie=null,Y.setAttribute("aria-expanded","false")};Y.addEventListener("click",()=>{if(ie){Ee();return}ie=Ut(e,{anchor:Y,value:A.colour||"rgb(0 0 0 / 0.2)",onChange:he=>{Y.style.setProperty("--swatch",he),v[C]={...A,colour:he},A=v[C],d()}}),Y.setAttribute("aria-expanded","true"),se=w(Y,he=>ie?.contains(he)??!1,Ee)}),b.push(Ee);let Ce=document.createElement("button");Ce.type="button",Ce.className="edit-opt",Ce.textContent="inset",Ce.toggleAttribute("data-on",A.inset),Ce.addEventListener("click",()=>{v[C]={...A,inset:!A.inset},A=v[C],Ce.toggleAttribute("data-on",A.inset),d()});let Ae=document.createElement("button");Ae.type="button",Ae.className="edit-mini",Ae.setAttribute("aria-label",`Move layer ${C+1} up`),Ae.appendChild(ve("arrowUp",12)),Ae.disabled=C===0,Ae.addEventListener("click",()=>{v=Cn(v,C,C-1),d(),u()});let De=document.createElement("button");De.type="button",De.className="edit-mini",De.setAttribute("aria-label",`Move layer ${C+1} down`),De.appendChild(ve("arrowDown",12)),De.disabled=C===v.length-1,De.addEventListener("click",()=>{v=Cn(v,C,C+1),d(),u()});let Ge=document.createElement("button");Ge.type="button",Ge.className="edit-mini",Ge.setAttribute("aria-label",`Remove layer ${C+1}`),Ge.appendChild(ve("cross",12)),Ge.addEventListener("click",()=>{v=v.filter((he,Me)=>Me!==C),d(),u()}),h.append(G,Y,Ce,Ae,De,Ge);let rt=document.createElement("div");rt.className="edit-sides";let V=[{key:"x",label:"x",min:-64,max:64},{key:"y",label:"y",min:-64,max:64},{key:"blur",label:"blur",min:0,max:96},{key:"spread",label:"spread",min:-32,max:32}];for(let he of V){let Me=Xt(e,{label:he.label,value:A[he.key],min:he.min,max:he.max,step:1,unit:"px",onChange:Mr=>{v[C]={...v[C],[he.key]:Mr},A=v[C],d()}});I.push(Me),rt.appendChild(Me.el)}let de=document.createElement("div");de.className="edit-edges";let We=Yo(A),it=[{axis:"all",label:"All",hint:"Shadow on all four sides"},{axis:"y",label:"Vertical",hint:"Top or bottom only \u2014 y sets which"},{axis:"x",label:"Horizontal",hint:"Left or right only \u2014 x sets which"}];for(let he of it){let Me=document.createElement("button");Me.type="button",Me.className="edit-opt",Me.textContent=he.label,Me.title=he.hint,Me.toggleAttribute("data-on",he.axis===We),Me.setAttribute("aria-pressed",String(he.axis===We)),Me.addEventListener("click",()=>{v[C]=jo(v[C],he.axis),A=v[C],d(),u()}),de.appendChild(Me)}P.append(h,de,rt),M.appendChild(P)});let N=document.createElement("button");N.type="button",N.className="edit-add",N.textContent=v.length===0?"Add a shadow":"Add another layer",N.addEventListener("click",()=>{v=[...v,{...v[v.length-1]??Wo}],d(),u()}),M.appendChild(N)}function m(){v=p?_o(ke(p,c.prop)):[],u()}return{el:M,sync:m,sliders:[]}}function U(c){let M=Xt(e,{label:c.label,value:p?Mn(ke(p,c.prop)):0,min:c.min??0,max:c.max??40,step:c.step??1,unit:c.unit??"px",onChange:v=>X(c.prop,Ko(v))});return{el:M.el,slider:M,sync:()=>{p&&M.set(Mn(ke(p,c.prop)))}}}function R(c){let M=document.createElement("div");M.className="edit-row";let v=document.createElement("div");v.className="edit-line";let I=document.createElement("span");I.className="edit-label",I.textContent=c.label;let d=document.createElement("div");d.className="edit-field";let u=[],m=[],N=[];if(c.sides){let P=document.createElement("div");P.className="edit-sides",P.style.flex="1";for(let G of c.sides){let Y=G.split("-").filter(se=>se!=="border"&&se!=="radius"&&se!=="width"&&se!=="padding"&&se!=="margin"&&se!=="color").join(" ")||G;if(c.kind==="colour"){let se=F(c,G,Y);N.push(se.sync),P.appendChild(se.el);continue}let ie=te(c,G,Y);m.push(ie.scrub),N.push(ie.sync),P.appendChild(ie.el)}let h=document.createElement("button");h.type="button",h.className="edit-linked",h.setAttribute("aria-label",`Link all four ${c.label.toLowerCase()} values`),h.title="Change all four together",h.appendChild(ve("link",13)),h.setAttribute("aria-pressed","false"),h.addEventListener("click",()=>{z.has(c.prop)?z.delete(c.prop):z.add(c.prop);let G=z.has(c.prop);h.toggleAttribute("data-on",G),h.setAttribute("aria-pressed",String(G))}),d.append(P,h)}else if(c.kind==="shadow"){let P=H(c);N.push(P.sync),P.el.style.flex="1",d.appendChild(P.el)}else if(c.kind==="blur"){let P=U(c);u.push(P.slider),N.push(P.sync),P.el.style.flex="1",d.appendChild(P.el)}else if(c.kind==="choice"){let P=J(c);N.push(P.sync),d.appendChild(P.el)}else if(c.kind==="colour"){let P=ae(c);N.push(P.sync),P.el.style.flex="1",d.appendChild(P.el)}else{let P=re(c,c.prop,c.label);u.push(P.slider),N.push(P.sync),P.el.style.flex="1",d.appendChild(P.el)}c.kind==="shadow"&&v.classList.add("edit-line-block");let A=document.createElement("span");A.className="edit-glyph",A.appendChild(ve(c.glyph,15));let C=!c.sides&&c.kind==="colour";if(C&&v.prepend(A,I),(c.sides||c.kind==="shadow")&&M.setAttribute("data-grouped",""),c.sides||c.kind==="shadow"||c.kind==="choice"){let P=document.createElement("span");P.className="edit-row-name",P.append(A,document.createTextNode(c.label)),M.appendChild(P)}return!C&&!c.sides&&c.kind!=="shadow"&&c.kind!=="choice"&&v.appendChild(A),v.appendChild(d),M.appendChild(v),{spec:c,el:M,sliders:u,scrubs:m,sync:()=>{for(let P of N)P()}}}function K(){S();for(let M of T){for(let v of M.sliders)v.destroy();for(let v of M.scrubs)v.destroy()}if(T.length=0,s.textContent="",!p){let M=document.createElement("p");M.className="edit-empty",M.textContent="Click an element to lock it, then change it here.",s.appendChild(M),j();return}for(let M of Ui){if(M.when&&!M.when(p))continue;let v=M.specs.filter(m=>x||!m.more);if(v.length===0)continue;let I=document.createElement("section");I.className="edit-group";let d=document.createElement("span");d.className="edit-group-name",d.textContent=M.name;let u=document.createElement("div");u.className="edit-rows";for(let m of v){let N=R(m);T.push(N),u.appendChild(N.el)}I.append(d,u),s.appendChild(I)}let c=document.createElement("button");c.type="button",c.className="edit-more",c.textContent=x?"Fewer properties":"More properties",c.addEventListener("click",()=>{x=!x,K()}),s.appendChild(c);for(let M of T)M.sync();D()}L.addEventListener("click",()=>{t.revertAll();for(let c of T)c.sync();D()});let ne=0;$.addEventListener("click",()=>{let c=t.asPrompt();if(!c)return;let M=I=>{$.textContent=I,clearTimeout(ne),ne=window.setTimeout(()=>{$.textContent="Copy as prompt"},900)},v=navigator.clipboard;if(!v){M("No clipboard");return}v.writeText(c).then(()=>M("Copied"),()=>M("Blocked"))});function me(){n.toggleAttribute("data-open",g)}return{show(c){if(c===p){for(let M of T)M.sync();D();return}p=c,a.textContent=c?c.tagName.toLowerCase()+(c.id?`#${c.id}`:""):"",K()},setArmed(c){g=c,me(),c&&K()},refresh(){for(let c of T)c.sync();D()},asText(){return t.asPrompt()},destroy(){y.destroy(),S();for(let c of T){for(let M of c.sliders)M.destroy();for(let M of c.scrubs)M.destroy()}T.length=0,n.remove(),o.remove()}}}var Zt=5,Tn=4,At=12,Vo=.22,ut=10,Zi=50,Ji=100;function qo(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,hidden:!1,dimLock:!1,grid:null,pixels:!1,guides:[],liveGuide:null,activeGuide:null},i=gn(bn()),a=0,s=null;function l(){let w=bn();w!==s&&(s=w,i=gn(w),e.style.colorScheme=w?"dark":"light",J())}l();let E=matchMedia("(prefers-color-scheme: dark)"),$=()=>l();E.addEventListener("change",$);let L=new MutationObserver(()=>l());function y(){L.disconnect(),L.observe(document.documentElement,{attributes:!0}),document.body&&L.observe(document.body,{attributes:!0})}y(),ko(()=>J());function p(){let w=devicePixelRatio;o.width=Math.round(innerWidth*w),o.height=Math.round(innerHeight*w),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(w,0,0,w,0,0),n.translate(.5,.5)}let g=w=>Math.round(w)-.5;function x(w,F){n.strokeStyle=F,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(w.left),Math.round(w.top),Math.round(w.width),Math.round(w.height))}function T(w){n.strokeStyle=qe(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let F of[w.left,w.right])n.moveTo(Math.round(F),0),n.lineTo(Math.round(F),innerHeight);for(let F of[w.top,w.bottom])n.moveTo(0,Math.round(F)),n.lineTo(innerWidth,Math.round(F));n.stroke(),n.setLineDash([])}function b(w){if(n.strokeStyle=w.extension?qe(i.measure,.55):i.measure,n.lineWidth=1,n.setLineDash(w.extension?[3,3]:[]),n.beginPath(),n.moveTo(Math.round(w.x1),Math.round(w.y1)),n.lineTo(Math.round(w.x2),Math.round(w.y2)),w.extension){n.stroke();return}if(w.axis==="x")for(let F of[w.x1,w.x2])n.moveTo(Math.round(F),Math.round(w.y1)-Zt),n.lineTo(Math.round(F),Math.round(w.y1)+Zt);else for(let F of[w.y1,w.y2])n.moveTo(Math.round(w.x1)-Zt,Math.round(F)),n.lineTo(Math.round(w.x1)+Zt,Math.round(F));n.stroke()}function S(w){return n.font=`${q.medium} ${O.body}px ${O.stack}`,{w:n.measureText(w).width+Tn*2,h:O.body+Tn*2+2}}function z(w,F,ae,H){n.font=`${q.medium} ${O.body}px ${O.stack}`,n.textBaseline="middle";let{w:U,h:R}=S(w),K=g(Math.min(Math.max(F,At),innerWidth-U-At)),ne=g(Math.min(Math.max(ae,At),innerHeight-R-At));n.fillStyle=H,n.beginPath(),n.roundRect(K,ne,Math.ceil(U),R,4),n.fill(),n.fillStyle=i.surface,n.fillText(w,K+Tn,ne+R/2)}function j(w,F,ae,H,U=!1){let{w:R,h:K}=S(w);z(w,U?F-R/2:F,U?ae-K/2:ae,H)}function D(){let w=scrollX,F=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,Q),n.fillRect(-.5,-.5,Q,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${q.regular} 9px ${O.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let R of r.pinned)n.fillRect(g(R.left),-.5,Math.round(R.width),Q),n.fillRect(-.5,g(R.top),Q,Math.round(R.height));n.restore(),n.beginPath(),n.moveTo(-.5,Q-.5),n.lineTo(innerWidth,Q-.5),n.moveTo(Q-.5,-.5),n.lineTo(Q-.5,innerHeight),n.stroke();let ae=R=>R%Ji===0?Q:R%Zi===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let H=Math.floor(w/ut)*ut;for(let R=H;R<w+innerWidth;R+=ut){let K=Math.round(R-w);if(K<Q)continue;let ne=ae(R);n.moveTo(K,Q-ne),n.lineTo(K,Q),ne===Q&&(n.fillStyle=i.muted,n.fillText(String(R),K+3,3))}n.stroke(),n.beginPath();let U=Math.floor(F/ut)*ut;for(let R=U;R<F+innerHeight;R+=ut){let K=Math.round(R-F);if(K<Q)continue;let ne=ae(R);n.moveTo(Q-ne,K),n.lineTo(Q,K),ne===Q&&(n.save(),n.translate(3,K-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(R),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),Q),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo(Q,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let R of r.guides){let K=Math.round(kt(R));R.axis==="x"?n.fillRect(K-1,-.5,2,Q):n.fillRect(-.5,K-1,Q,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,Q,Q),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,Q,Q)}function X(){let w=fo(10,1);if(w){n.strokeStyle=i.pixelLine,n.lineWidth=1,n.setLineDash([]),n.beginPath();for(let F=0;F<=innerWidth;F+=w)n.moveTo(F,0),n.lineTo(F,innerHeight);for(let F=0;F<=innerHeight;F+=w)n.moveTo(0,F),n.lineTo(innerWidth,F);n.stroke()}}function re(w){let F=mo(w,document.documentElement.clientWidth);n.fillStyle=qe(i.measure,.08);for(let ae of F)n.fillRect(g(ae.left),-.5,Math.round(ae.width),innerHeight+1)}function te(){if(a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore(),r.hidden)return;(r.pixels||r.grid)&&(n.save(),r.rulers&&(n.beginPath(),n.rect(Q,Q,innerWidth,innerHeight),n.clip()),r.pixels&&X(),r.grid&&re(r.grid),n.restore());let w=r.dimLock?qe(i.accent,.15):i.accent;for(let H of r.pinned)x(H,w);r.hover&&(T(r.hover),x(r.hover,r.pinned.length||r.dimLock?qe(w,.7):w));for(let H of r.guides){let U=r.liveGuide?.id===H.id;n.strokeStyle=H.locked||U?i.guide:qe(i.guide,.55),n.lineWidth=H.pinned?2:1,n.setLineDash(H.locked?[]:[4,4]),n.beginPath();let R=Math.round(kt(H));if(H.axis==="x"?(n.moveTo(R,0),n.lineTo(R,innerHeight)):(n.moveTo(0,R),n.lineTo(innerWidth,R)),n.stroke(),r.activeGuide===H.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let K=7;H.axis==="x"?(n.moveTo(R,0),n.lineTo(R,K),n.moveTo(R,innerHeight-K),n.lineTo(R,innerHeight)):(n.moveTo(0,R),n.lineTo(K,R),n.moveTo(innerWidth-K,R),n.lineTo(innerWidth,R)),n.stroke()}}for(let H of r.lines)n.globalAlpha=H.faded?Vo:1,b(H);n.globalAlpha=1;let F=r.lines.filter(H=>H.label!==""),ae=F.map(H=>{let U=(H.x1+H.x2)/2,R=(H.y1+H.y2)/2,{w:K,h:ne}=S(H.label);return H.axis==="x"?{x:U-K/2,y:R-16-ne/2,w:K,h:ne,axis:H.axis}:{x:U+26-K/2,y:R-ne/2,w:K,h:ne,axis:H.axis}});if(ho(ae,{w:innerWidth,h:innerHeight},At).forEach((H,U)=>{let R=F[U];n.globalAlpha=R.faded?Vo:1,z(R.label,H.x,H.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:H,height:U,scale:R}=r.hover;j(`${oe(H/R.x)} \xD7 ${oe(U/R.y)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let H=r.liveGuide,U=Math.round(kt(H));j([`${H.axis} ${oe(H.at)}`,H.caught,H.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),H.axis==="x"?U+6:30,H.axis==="x"?30:U+6,i.guide)}r.rulers&&D()}function J(){a||(a=requestAnimationFrame(te))}return p(),{root:t,update(w){Object.assign(r,w),J()},resize(){p(),J()},destroy(){a&&cancelAnimationFrame(a),E.removeEventListener("change",$),L.disconnect(),e.remove()}}}function Qi(e){let t=e.trim().replace(/^#/,""),o=t.length===3?t.split("").map(n=>n+n).join(""):t;return/^[0-9a-f]{6}$/i.test(o)?{r:parseInt(o.slice(0,2),16),g:parseInt(o.slice(2,4),16),b:parseInt(o.slice(4,6),16)}:null}function ea({r:e,g:t,b:o}){let n=r=>Math.round(r).toString(16).padStart(2,"0");return`#${n(e)}${n(t)}${n(o)}`}function ta({r:e,g:t,b:o}){return`rgb(${Math.round(e)} ${Math.round(t)} ${Math.round(o)})`}function Qe(e,t){return String(Number(e.toFixed(t)))}function na({r:e,g:t,b:o}){let n=e/255,r=t/255,i=o/255,a=Math.max(n,r,i),s=Math.min(n,r,i),l=(a+s)/2,E=a-s,$=0,L=0;return E!==0&&(L=E/(1-Math.abs(2*l-1)),a===n?$=(r-i)/E%6:a===r?$=(i-n)/E+2:$=(n-r)/E+4,$*=60,$<0&&($+=360)),`hsl(${Qe($,1)} ${Qe(L*100,1)}% ${Qe(l*100,1)}%)`}function oa(e){let{l:t,c:o,h:n}=Mt([e.r/255,e.g/255,e.b/255]);return o<1e-4?`oklch(${Qe(t,4)} 0 0)`:`oklch(${Qe(t,4)} ${Qe(o,4)} ${Qe(n,2)})`}function Zo(e){let t=Qi(e);return t?[{label:"hex",value:ea(t)},{label:"rgb",value:ta(t)},{label:"hsl",value:na(t)},{label:"oklch",value:oa(t)}]:[]}var ra=`
.picker {
  /* Under the badge, from the badge's own numbers. */
  position: fixed; top: ${Le+Et+St}px; right: ${Le}px;
  width: min(200px, calc(100vw - ${Le*2+B.base*2}px));
  padding: ${B.base}px; border-radius: 0;
  user-select: none;
  font-family: ${O.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${O.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${k.primary};
  background: ${xe};
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
  transition: opacity ${W.ui}, transform ${W.ui}, visibility 0s linear 160ms;
}
.picker[data-open] {
  opacity: 1; visibility: visible; pointer-events: auto;
  transform: none;
  transition: opacity ${W.ui}, transform ${W.ui}, visibility 0s;
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
  color: ${k.primary};
}
.picker button:hover { background: ${_(2)}; }
.picker button:focus-visible { outline: 1px solid ${k.primary}; outline-offset: -1px; }
.picker .k { color: ${k.secondary}; }
.picker .v { overflow-wrap: anywhere; }
.picker .hint {
  margin-top: 6px; padding-top: 6px;
  border-top: 1px solid ${ue};
  color: ${k.secondary};
}
`;function Jo(e){let t=document.createElement("style");t.textContent=ra,e.appendChild(t);let o=document.createElement("div");o.className="picker",e.appendChild(o);let n=document.createElement("div");n.className="swatch";let r=document.createElement("div");r.className="hint";function i(a){n.style.background=a;let s=Zo(a).map(({label:l,value:E})=>{let $=document.createElement("button");$.type="button";let L=document.createElement("span");L.className="k",L.textContent=l;let y=document.createElement("span");return y.className="v",y.textContent=E,$.append(L,y),$.addEventListener("click",p=>{p.stopPropagation(),navigator.clipboard?.writeText(E).then(()=>{r.textContent=`copied ${l}`},()=>{r.textContent="clipboard refused"})}),$});r.textContent="click a row to copy",o.replaceChildren(n,...s,r),o.setAttribute("data-open","")}return{async open(){let a=window.EyeDropper;if(!a){o.replaceChildren(Object.assign(document.createElement("div"),{className:"hint",textContent:"this browser has no eyedropper"})),o.setAttribute("data-open","");return}try{let{sRGBHex:s}=await new a().open();i(s)}catch{}},close(){let a=o.hasAttribute("data-open");return o.removeAttribute("data-open"),a},destroy(){o.remove(),t.remove()}}}var An="__align_freeze",ia=`
[data-align-frozen] *:not([data-align-ignore]):not([data-align-ignore] *) {
  animation-play-state: paused !important;
}
`,Ln=!1,Jt=[],Qt=[];function Qo(e){let t=e;for(;t;){if(t instanceof Element&&t.hasAttribute("data-align-ignore"))return!0;let o=t.getRootNode();if(t=o instanceof ShadowRoot?o.host:t.parentNode??null,t===document)return!1}return!1}function en(){return Ln}function Nn(e){if(e!==Ln){if(Ln=e,!e){document.documentElement.removeAttribute("data-align-frozen"),document.getElementById(An)?.remove();for(let t of Jt)try{t.play()}catch{}for(let t of Qt)t.play().catch(()=>{});Jt=[],Qt=[];return}if(!document.getElementById(An)){let t=document.createElement("style");t.id=An,t.textContent=ia,t.setAttribute("data-align-ignore",""),document.head.appendChild(t)}document.documentElement.setAttribute("data-align-frozen",""),Jt=[];try{for(let t of document.getAnimations()){if(t.playState!=="running")continue;let o=t.effect?.target??null;Qo(o)||(t.pause(),Jt.push(t))}}catch{}Qt=[];for(let t of Array.from(document.querySelectorAll("video")))t.paused||Qo(t)||(t.pause(),Qt.push(t))}}var Rn="__align_xray",aa=`
[data-align-xray] * { outline: 1px solid rgb(128 128 128 / 0.55) !important; }
[data-align-xray] [data-align-ignore],
[data-align-xray] [data-align-ignore] * { outline: none !important; }
`;function Pn(e){let t=document.documentElement;if(!e){t.removeAttribute("data-align-xray"),document.getElementById(Rn)?.remove();return}if(!document.getElementById(Rn)){let o=document.createElement("style");o.id=Rn,o.textContent=aa,o.setAttribute("data-align-ignore",""),document.head.appendChild(o)}t.setAttribute("data-align-xray","")}var Dn="align-ui";function er(e){try{return localStorage.getItem(e)}catch{return null}}function tr(e,t){try{localStorage.setItem(e,t)}catch{}}function nr(e){let t="/";try{t=location.pathname||"/"}catch{}return`${Dn}:${e}::${t}`}function sa(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function or(){let e=er(nr("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(sa).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function rr(e){tr(nr("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function tn(e){return er(`${Dn}:${e}`)==="1"}function nn(e,t){tr(`${Dn}:${e}`,t?"1":"0")}var we,ee=null,$e=null,Ie=null,xt=null,Ue=null,et=Oo(),nt=!1,ft=tn("grid"),gt=tn("pixels"),fe=null,Z=[],rn=0,ot=tn("rulers"),ce=[],pr=1,ir=!1,He=null,pt=!1,ht=!1,In,tt=Co();function la(){return ce.map(e=>({...e}))}function bt(e=""){tt.push(la(),e)}function ar(){return ce.find(e=>e.id===He)??null}function je(e){ce=e,rr(ce)}var ge=null,Pe=null,Ne=null,ca=3,mt=22;function hr(e,t){return ot?t<mt&&e>=mt?"y":e<mt&&t>=mt?"x":null:null}function Gn(e){return e.ctrlKey||e.metaKey}function mr(e,t,o,n){let r=Ve(t,o,we),i=e.axis==="x"?t:o,a=ce.filter(l=>l.id!==e.id).map(l=>({axis:l.axis,at:Lt(l).pos})),s=co(i,uo(r,e.axis,a),n);e.at=s.at+(e.axis==="x"?scrollX:scrollY),e.caught=s.what}function fr(e,t,o,n){let r={id:pr++,axis:e,at:0,locked:!1,caught:"",pinned:!1};mr(r,t,o,n);let i=ce.find(a=>a.axis===r.axis&&Math.abs(a.at-r.at)<.5);return i?(He=i.id,i):(bt(),je([...ce,r]),He=r.id,r)}function gr(e){e.pinned||(bt(),je(ce.filter(t=>t.id!==e.id)),Pe?.id===e.id&&(Pe=null),ge?.id===e.id&&(ge=null))}function da(e){let t=we.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function Lt(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function On(){return Z.length>=2?Z[Z.length-2]:void 0}function Bn(){if(Z.length<2)return[];let e=[];for(let[t,o]of dn(Z))for(let n of Ot(t,o)){if(n.extension||!n.label)continue;let r=Vn(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:qn(r)})}return e}function be(e){let t=Z[Z.length-1],o=fe&&Z.some(y=>y.el===fe.el),n=ce.map(Lt),r=!ge&&Pe?Pe:null,i=ce.filter(y=>y.locked||y.id===r?.id),a=!r&&o?fe.el:null,s=r??a,l=r?Lt(r):null,E=[],$=(y,p)=>{for(let g of y)E.push(s&&!p?{...g,faded:!0}:g)},L=y=>!l||y.axis!==l.axis?!1:(y.axis==="x"?[y.x1,y.x2]:[y.y1,y.y2]).some(g=>Math.abs(g-l.pos)<.5);for(let[y,p]of dn(Z))$(Ot(y,p),y.el===a||p.el===a);t&&fe&&!o&&!r&&$(Ot(t,fe),!0);for(let y of i)for(let p of Z)$(pn(p,[Lt(y)]),y.id===r?.id||p.el===a);fe&&!o&&!r&&ce.length&&$(pn(fe,n),!0);for(let y of po(i.map(Lt),{x:innerWidth/2,y:innerHeight/2}))$([y],L(y));ee?.update({hover:fe,pinned:Z,rulers:ot,hidden:pt,dimLock:ht,grid:ft&&we.grid?we.grid:null,pixels:gt,guides:ce,liveGuide:ge??Pe,activeGuide:He,lines:E,...e?{cursor:e}:{}}),Ie?.update(Z.length,{edit:et.armed,rulers:ot,xray:nt,grid:ft,pixels:gt,freeze:en(),type:$e?.showsType()??!1,hide:pt,canCopy:Z.length>0,canUndo:tt.depth()>0,panel:$e?.isOpen()??!1})}function ua(){let e=$e?.asText()??"";if(!e)return;let t=n=>Ie?.acknowledge("copy",n),o=navigator.clipboard?.writeText(e);o?o.then(()=>t(!0),()=>t(!1)):t(!1)}function pa(e,t){return e.length===t.length&&e.every((o,n)=>{let r=t[n];return o.id===r.id&&o.axis===r.axis&&o.at===r.at&&o.locked===r.locked&&o.pinned===r.pinned})}function ha(){for(;tt.depth()>0&&pa(tt.peek(),ce);)tt.pop();let e=tt.pop();e&&(je(e),Pe=null,ge=null,Ne=null,e.some(t=>t.id===He)||(He=null))}function Te(e){switch(e){case"rulers":ot=!ot,nn("rulers",ot);break;case"xray":nt=!nt,Pn(nt);break;case"grid":ft=!ft,nn("grid",ft);break;case"pixels":gt=!gt,nn("pixels",gt);break;case"freeze":Nn(!en());break;case"type":$e?.toggleType();break;case"panel":$e?.toggle();break;case"hide":pt=!pt,$e?.setHidden(pt),pt&&xt?.close();break;case"copy":ua();break;case"pick":xt?.open();break;case"edit":if(et.armed){let t=et.disarm();Ie?.acknowledge("edit",t>=0)}else et.arm();Ue?.setArmed(et.armed),Z.length&&be();break;case"undo":ha();break}be()}var on=null;function br(e){if(on={x:e.clientX,y:e.clientY},ge){Ne&&Math.hypot(e.clientX-Ne.x,e.clientY-Ne.y)>ca&&(Ne=null),!Ne&&!ge.pinned&&(mr(ge,e.clientX,e.clientY,Gn(e)),je([...ce])),be({x:e.clientX,y:e.clientY});return}Pe=un(ce,e.clientX,e.clientY),fe=Ve(e.clientX,e.clientY,we),be({x:e.clientX,y:e.clientY})}function yr(e){ge&&(Ne?(ge.locked=!ge.locked,He=ge.id,je([...ce])):(hr(e.clientX,e.clientY)||e.clientX<mt||e.clientY<mt)&&gr(ge),Ne=null,ge=null,be({x:e.clientX,y:e.clientY}))}function Nt(e){let t=ee?.root.host;return t?(e.composedPath?.()??[]).includes(t):!1}function xr(e){Nt(e)&&wr(!0)}function an(){wr(!1)}function wr(e){if(clearTimeout(In),e){if(ht)return;ht=!0,be();return}ht&&(In=setTimeout(()=>{ht=!1,be()},200))}function vr(e){if(e.button!==0||Nt(e))return;let t=Ve(e.clientX,e.clientY,we);if(!t)return;let o=hr(e.clientX,e.clientY);if(o){yt(e),Ne=null,ge=fr(o,e.clientX,e.clientY,Gn(e)),be({x:e.clientX,y:e.clientY});return}let n=un(ce,e.clientX,e.clientY);if(n){yt(e),bt(),He=n.id,ge=n,Ne={x:e.clientX,y:e.clientY},be({x:e.clientX,y:e.clientY});return}yt(e),Ie?.closeHelp(),Z=[t],fe=t,$e?.show(t,Bn(),On()),Ue?.show(t.el),be({x:e.clientX,y:e.clientY})}function kr(e){if(Nt(e))return;let t=Ve(e.clientX,e.clientY,we);if(!t)return;yt(e),Ie?.closeHelp();let o=Z.findIndex(r=>r.el===t.el);Z=o>=0?Z.filter((r,i)=>i!==o):[...Z,t],fe=t;let n=Z[Z.length-1];n?$e?.show(n,Bn(),On()):$e?.hide(),Ue?.show(n?.el??null),be({x:e.clientX,y:e.clientY})}function $r(e){Nt(e)||Ve(e.clientX,e.clientY,we)&&yt(e)}function Er(e){Nt(e)||Ve(e.clientX,e.clientY,we)&&yt(e)}function yt(e){e.preventDefault(),e.stopPropagation()}function sr(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var lr=0,cr=0;function Sr(){rn=requestAnimationFrame(Sr);let t=Z.filter(s=>s.el.isConnected).map(s=>Gt(s.el)),o=fe&&fe.el.isConnected?Gt(fe.el):null;if(!(scrollX!==lr||scrollY!==cr||t.length!==Z.length||t.some((s,l)=>!sr(s,Z[l]))||fe===null!=(o===null)||fe!==null&&o!==null&&!sr(fe,o)))return;lr=scrollX,cr=scrollY,Z=t,fe=o;let i=Z[Z.length-1],a=ma();a!==dr&&(dr=a,i?$e?.show(i,Bn(),On()):$e?.hide(),Ue?.show(i?.el??null)),be()}var dr="";function ma(){let e=Z[0];return e?Z.map(t=>[t.label,Math.round(t.width*100),Math.round(t.height*100),Math.round((t.left-e.left)*100),Math.round((t.top-e.top)*100)].join(",")).join(";"):""}function Cr(){ee?.resize()}function fa(){ir||(ir=!0,ce=or().map(e=>({...e,id:pr++}))),!ee&&(wo(),ee=qo(),$e=So(ee.root),Ie=Mo(ee.root,Te),Ue=Uo(ee.root,et),xt=Jo(ee.root),Ie.update(0,{rulers:ot,xray:nt,grid:ft,pixels:gt,freeze:en(),type:!1,panel:!1,hide:!1,edit:!1,canCopy:!1,canUndo:!1}),addEventListener("pointerdown",xr,{capture:!0}),addEventListener("pointerup",an,{capture:!0}),addEventListener("pointercancel",an,{capture:!0}),addEventListener("mousemove",br),addEventListener("mousedown",vr,{capture:!0}),addEventListener("mouseup",yr,{capture:!0}),addEventListener("click",$r,{capture:!0}),addEventListener("auxclick",Er,{capture:!0}),addEventListener("contextmenu",kr,{capture:!0}),addEventListener("resize",Cr),rn=requestAnimationFrame(Sr),be())}function Hn(){removeEventListener("mousemove",br),removeEventListener("mousedown",vr,{capture:!0}),removeEventListener("mouseup",yr,{capture:!0}),removeEventListener("click",$r,{capture:!0}),removeEventListener("auxclick",Er,{capture:!0}),removeEventListener("contextmenu",kr,{capture:!0}),removeEventListener("pointerdown",xr,{capture:!0}),removeEventListener("pointerup",an,{capture:!0}),removeEventListener("pointercancel",an,{capture:!0}),removeEventListener("resize",Cr),clearTimeout(In),ht=!1,cancelAnimationFrame(rn),rn=0,Ie?.destroy(),Ue?.destroy(),Ue=null,xt?.destroy(),xt=null,nt&&(nt=!1,Pn(!1)),Nn(!1),et.disarm(),Ie=null,$e?.destroy(),$e=null,ee?.destroy(),ee=null,vo(),fe=null,Z=[],ge=null,Ne=null,Pe=null}function ga(e){let t=e.composedPath?.()[0]??e.target;return!t||typeof t!="object"||!("tagName"in t)?!1:t.isContentEditable?!0:t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT"}function ur(e){if(da(e))e.preventDefault(),ee?Hn():fa();else if(!ga(e)){if(ee&&on&&(e.key.toLowerCase()===we.guideKeys.vertical||e.key.toLowerCase()===we.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===we.guideKeys.vertical?"x":"y";fr(t,on.x,on.y,Gn(e)),be()}else if(ee&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(ce.some(t=>!t.pinned)&&bt(),je(ce.filter(t=>t.pinned)),Pe=null,ge=null,Ne=null,ce.some(t=>t.id===He)||(He=null)):Pe&&gr(Pe),be();else if(ee&&e.key.startsWith("Arrow")){let t=ar(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;bt(`nudge:${t.id}`);let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",je([...ce]),be()}else if(ee&&e.key.toLowerCase()==="g"){e.preventDefault(),Te("grid");return}else if(ee&&e.key.toLowerCase()==="k"){e.preventDefault(),Te("pixels");return}else if(ee&&e.key==="\\"){e.preventDefault(),Te("hide");return}else if(ee&&e.key.toLowerCase()==="e"){e.preventDefault(),Te("edit");return}else if(ee&&e.key.toLowerCase()==="f"){e.preventDefault(),Te("freeze");return}else if(ee&&e.key.toLowerCase()==="x"){e.preventDefault(),Te("xray");return}else if(ee&&e.key.toLowerCase()==="p"){e.preventDefault(),Te("pick");return}else if(ee&&e.key.toLowerCase()==="t"){e.preventDefault(),Te("type");return}else if(ee&&e.key.toLowerCase()==="c"){e.preventDefault(),Te("copy");return}else if(ee&&e.key.toLowerCase()==="l"){let t=ar();if(!t)return;e.preventDefault(),bt(),t.pinned=!t.pinned,je([...ce]),be()}else if(ee&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){if(tt.depth()===0)return;e.preventDefault(),Te("undo");return}else if(ee&&e.key.toLowerCase()===we.rulerKey){e.preventDefault(),Te("rulers");return}else if(ee&&e.key.toLowerCase()===we.panelKey){e.preventDefault(),Te("panel");return}else if(e.key==="Escape"&&ee){if(xt?.close()||Ie?.closeHelp())return;Z.length?(Z=[],$e?.hide(),Ue?.show(null),be()):Hn()}}}function Rs(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,we=io(e),$o(we.theme),addEventListener("keydown",ur,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{Hn(),removeEventListener("keydown",ur,{capture:!0}),delete window.__align})}export{Rs as initAlign};
