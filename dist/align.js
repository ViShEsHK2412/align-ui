function ae(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function Io(e){return(e.split(",")[0]??"").trim().replace(/^['"]|['"]$/g,"")}function Ho(e){let o={100:"thin",200:"extralight",300:"light",400:"regular",500:"medium",600:"semibold",700:"bold",800:"extrabold",900:"black"}[e.trim()];return o?`${e} ${o}`:e}function lt(e){let t=getComputedStyle(e);return[{label:"family",value:Io(t.fontFamily),px:NaN},{label:"size",value:t.fontSize,px:ae(t.fontSize)},{label:"weight",value:Ho(t.fontWeight),px:NaN},{label:"line",value:t.lineHeight,px:ae(t.lineHeight)},{label:"tracking",value:t.letterSpacing,px:ae(t.letterSpacing)}]}function pn(e){let t="";for(let o of e.childNodes)o.nodeType===3&&(t+=o.nodeValue??"");return t.trim().replace(/\s+/g," ")}function ct(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:ae(r)})}return o}function Mt(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function Fo(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function mn(e,t){if(t.length===0)return"";let o=[],n=0;for(let i of Fo(e)){let a=Mt(i,t);a.length?o.push(`${zo(i)} ${a.join(" ")}`):n+=1}if(o.length===0)return n===1?"its one number is not on the scale":`none of its ${n} numbers are on the scale`;let r=n===0?"":n===1?"  \xB7  1 more, not on the scale":`  \xB7  ${n} more, not on the scale`;return o.join("  \xB7  ")+r}function zo(e){return String(Math.round(e*100)/100)}function rn(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(ae)}function hn(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),l=a.display.includes("flex")||a.display.includes("grid"),c=n==="x"?a.columnGap:a.rowGap,x=l&&c!=="normal"?ae(c):null,[v,C,u,g]=rn(e),[y,T,G,b]=rn(t),E=V=>Number.isFinite(V)?V:0,N=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,O=n==="x"?N?E(C)+E(b):E(T)+E(g):N?E(u)+E(y):E(G)+E(v);return{px:o,cssGap:x,margins:O,siblings:!0}}function fn(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function gn(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}function et(e){let t=e.trim().toLowerCase();return t?t.startsWith("#")||/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(t)?!0:["black","white","transparent","currentcolor"].includes(t):!1}var Se;function an(e){if(Se===void 0&&(Se=document.createElement("canvas").getContext("2d")),!Se)return"";Se.fillStyle="#000000",Se.fillStyle=e;let t=Se.fillStyle;return Se.fillStyle="#ffffff",Se.fillStyle=e,t===Se.fillStyle?String(t):""}function dt(e,t){let o=an(e);return o?t.filter(n=>et(n.value)&&an(n.value)===o).map(n=>n.name).sort():[]}function bn(e){let t=getComputedStyle(e),o=[],n=(r,i)=>{let a=i.trim();!a||a==="transparent"||/rgba?\([^)]*,\s*0\s*\)$/.test(a)||o.push({label:r,value:a})};return n("text",t.color),n("background",t.backgroundColor),o}function Wo(e,t,o){let n=r=>typeof CSS<"u"&&CSS.escape?CSS.escape(r):r.replace(/[^\w-]/g,"\\$&");return t?`#${n(t)}`:o.length?e+o.map(r=>`.${n(r)}`).join(""):e}function tt(e){let t=typeof e.className=="string"?e.className.trim().split(/\s+/).filter(Boolean):[];return Wo(e.tagName.toLowerCase(),e.id,t)}function xn(e){let t=tt(e);if(!/[.#]/.test(t))return 0;try{return document.querySelectorAll(t).length}catch{return 0}}function _o(e){if(!e)return"inline <style>";let t=e.split("?")[0]??e;try{let o=new URL(t,"http://x").pathname;return decodeURI(o).replace(/^\//,"")||t}catch{return t}}var Xo=["width","height","padding","margin","border-width","gap","font-size","line-height","letter-spacing","color","background-color"];function Yo(e){for(let t=0;t<e.length;t+=1){let o=e.item(t);if(Xo.some(n=>o===n||o.startsWith(`${n}-`)))return!0}return!1}function yn(e){let t=[],o=new Set,n=(r,i)=>{for(let a of Array.from(r)){if(a instanceof CSSMediaRule){matchMedia(a.conditionText).matches&&n(a.cssRules,i);continue}if(a instanceof CSSSupportsRule){CSS.supports(a.conditionText)&&n(a.cssRules,i);continue}let l=a.cssRules;if(l&&!(a instanceof CSSStyleRule)){n(l,i);continue}if(!(a instanceof CSSStyleRule))continue;let c=!1;try{c=e.matches(a.selectorText)}catch{continue}if(!c||!Yo(a.style))continue;let x=`${a.selectorText}|${i}`;o.has(x)||(o.add(x),t.push({selector:a.selectorText,file:i}))}};for(let r of Array.from(document.styleSheets)){if(r.ownerNode instanceof Element&&r.ownerNode.hasAttribute("data-align-ignore"))continue;let i;try{i=r.cssRules}catch{continue}n(i,_o(r.href))}return t.reverse()}function sn(e){if(!e||e==="none")return[];let t=e.trim().split(/\s+/),o=[];for(let n of t){if(!n.endsWith("px"))return[];let r=Number.parseFloat(n);if(!Number.isFinite(r))return[];o.push(r)}return o}function ln(e,t,o){let n=0;for(let r=0;r<e.length;r+=1){let i=n+e[r];if(o<i+.5)return r;n=i+t}return-1}function Ko(e,t){let o=t==="rtl";return e.startsWith("vertical")||e.startsWith("sideways")?{inline:"y",inlineReversed:e==="sideways-lr"?!o:o,blockReversed:e==="vertical-rl"||e==="sideways-rl"}:{inline:"x",inlineReversed:o,blockReversed:!1}}function cn(e,t,o,n,r){return r?t-n:o-e}function wn(e){let t=e.parentElement,o=0;for(;t&&getComputedStyle(t).display==="contents";)t=t.parentElement,o+=1;if(!t)return null;let n=getComputedStyle(t),r=getComputedStyle(e),i=n.display,a=[];if(o>0&&a.push({label:"through",value:o===1?"a display: contents parent":`${o} display: contents parents`}),r.position==="absolute"||r.position==="fixed")return a.push({label:"placed by",value:`${r.position}, not by the parent`}),{display:i,rows:a};if(r.float!=="none")return a.push({label:"placed by",value:`float: ${r.float}`}),{display:i,rows:a};let l=i.includes("flex"),c=i.includes("grid");if(!l&&!c)return a.push({label:"flow",value:i}),{display:i,rows:a};let x=dn(n.rowGap==="normal"?"0px":n.rowGap),v=dn(n.columnGap==="normal"?"0px":n.columnGap),C=x===v?x:`row ${x} \xB7 column ${v}`;if(l){let Y=n.flexDirection;a.push({label:"direction",value:n.flexWrap==="nowrap"?Y:`${Y} \xB7 ${n.flexWrap}`}),a.push({label:"justify",value:n.justifyContent}),a.push({label:"align",value:n.alignItems}),a.push({label:"gap",value:C});let p=`${r.flexGrow} ${r.flexShrink} ${r.flexBasis}`;return p!=="0 1 auto"&&a.push({label:"this child",value:`flex: ${p}`}),r.alignSelf!=="auto"&&a.push({label:"align-self",value:r.alignSelf}),{display:i,rows:a}}let u=sn(n.gridTemplateColumns),g=sn(n.gridTemplateRows);u.length&&a.push({label:"columns",value:`${u.length} \xB7 ${u.map(Tt).join(" ")}`}),g.length&&a.push({label:"rows",value:`${g.length} \xB7 ${g.map(Tt).join(" ")}`}),a.push({label:"gap",value:C});let y=t.getBoundingClientRect(),T=e.getBoundingClientRect(),G={left:y.left+ae(n.borderLeftWidth)+ae(n.paddingLeft),right:y.right-ae(n.borderRightWidth)-ae(n.paddingRight),top:y.top+ae(n.borderTopWidth)+ae(n.paddingTop),bottom:y.bottom-ae(n.borderBottomWidth)-ae(n.paddingBottom)},b=Ko(n.writingMode,n.direction),E=(Y,p)=>Y==="x"?cn(G.left,G.right,T.left,T.right,p):cn(G.top,G.bottom,T.top,T.bottom,p),N=b.inline==="x"?"y":"x",O=ae(n.columnGap==="normal"?"0":n.columnGap),V=ae(n.rowGap==="normal"?"0":n.rowGap),re=ln(u,O,E(b.inline,b.inlineReversed)),ee=ln(g,V,E(N,b.blockReversed)),z=[];return re>=0&&z.push(`column ${re+1} of ${u.length}`),ee>=0&&z.push(`row ${ee+1} of ${g.length}`),z.length&&a.push({label:"this child",value:z.join(" \xB7 ")}),{display:i,rows:a}}function dn(e){return e.endsWith("px")?Tt(Number.parseFloat(e)):e}function Tt(e){return String(Math.round(e*100)/100)}var vn=["display","position","width","height","padding","margin","border-width","border-style","border-radius","font-family","font-size","font-weight","font-style","line-height","letter-spacing","text-transform","text-align","color","background-color","border-color","opacity","flex-direction","justify-content","align-items","gap","flex-grow","flex-shrink","flex-basis","align-self","box-shadow","overflow","text-overflow","white-space"];function jo(e,t){let o=[];for(let n of vn){let r=e[n]??"",i=t[n]??"";r!==i&&o.push({prop:n,a:r,b:i})}return o}function un(e){let t=getComputedStyle(e),o={};for(let n of vn)o[n]=t.getPropertyValue(n);return o}function kn(e,t){return jo(un(e),un(t))}var Uo={ignore:"",grid:null,hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"},theme:"auto"};function En(e={}){return{...Uo,...e}}var $n=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function Sn(e){return e.ignore?`${$n}, ${e.ignore}`:$n}function j(e){return String(Math.round(e*100)/100)}function Vo(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function mt(e){let t=e.getBoundingClientRect();return{el:e,label:Vo(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height,scale:We(e)}}function Cn(e,t){let o=(n,r)=>Math.abs(n-r)<.001;return o(e.scale.x,t.scale.x)&&o(e.scale.y,t.scale.y)?e.scale:{x:1,y:1}}function Tn(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function Be(e,t,o){let n=Sn(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=Tn(r);return r&&r!==document.documentElement?mt(r):null}var ut=e=>parseFloat(e)||0;function At(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[ut(n),ut(r),ut(i),ut(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function qo(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function Jo(e,t){let o=Cn(e,t),n=t.left+t.width/2,r=t.top+t.height/2;return[{x1:e.left,y1:r,x2:t.left,y2:r,label:j((t.left-e.left)/o.x),axis:"x"},{x1:t.right,y1:r,x2:e.right,y2:r,label:j((e.right-t.right)/o.x),axis:"x"},{x1:n,y1:e.top,x2:n,y2:t.top,label:j((t.top-e.top)/o.y),axis:"y"},{x1:n,y1:t.bottom,x2:n,y2:e.bottom,label:j((e.bottom-t.bottom)/o.y),axis:"y"}]}function pt(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function ht(e,t){let o=[],n=Cn(e,t),r=e.left<t.right&&t.left<e.right,i=e.top<t.bottom&&t.top<e.bottom;if(r&&i){let[a,l]=qo(e,t);return Jo(a,l)}if(!r){let[a,l]=e.right<=t.left?[e,t]:[t,e],c=i?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:a.right,y1:c,x2:l.left,y2:c,label:`${j((l.left-a.right)/n.x)}`,axis:"x"}),o.push(...pt(a.right,a.top,a.bottom,c,"x")),o.push(...pt(l.left,l.top,l.bottom,c,"x"))}if(!i){let[a,l]=e.bottom<=t.top?[e,t]:[t,e],c=r?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:c,y1:a.bottom,x2:c,y2:l.top,label:`${j((l.top-a.bottom)/n.y)}`,axis:"y"}),o.push(...pt(a.bottom,a.left,a.right,c,"y")),o.push(...pt(l.top,l.left,l.right,c,"y"))}return o}function Qo(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function Lt(e){let t=Qo(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var Zo=5,er=8;function nt(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function Nt(e,t,o){let n=null,r=Zo;for(let i of e){let a=Math.abs(nt(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function Mn(e,t,o){if(o)return{at:e,what:""};let n=null,r=er;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function An(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function Rt(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,l=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:l,y2:i,label:j(r.gap/e.scale.x),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,l=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:l,label:j(r.gap/e.scale.y),axis:"y"})}}return o}function Ln(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],l=r[i],c=l-a;c<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:l,y2:t.y,label:j(c),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:l,label:j(c),axis:"y"}))}}return o}var Me=3;function tr(e,t){return e.x<t.x+t.w+Me&&t.x<e.x+e.w+Me&&e.y<t.y+t.h+Me&&t.y<e.y+e.h+Me}function Nn(e,t,o=12){let n=(a,l)=>Math.min(Math.max(a,o),t.w-l-o),r=(a,l)=>Math.min(Math.max(a,o),t.h-l-o),i=[];for(let a of e){let l={...a,x:n(a.x,a.w),y:r(a.y,a.h)},c=!1;for(let x=0;x<16;x++){let v=i.find(u=>tr(u,l));if(!v)break;let C=l.axis==="x"?l.y:l.x;if(l.axis==="x"?l.y=r(c?v.y+v.h+Me:v.y-l.h-Me,l.h):l.x=n(c?v.x-l.w-Me:v.x+v.w+Me,l.w),(l.axis==="x"?l.y:l.x)===C){if(c)break;c=!0}}i.push(l)}return i}function Rn(e,t){let{columns:o,gutter:n,margin:r}=e;if(o<=0)return[];let i=e.maxWidth>0?Math.min(e.maxWidth,t):t,a=Math.max(0,(t-i)/2),c=(Math.max(0,i-r*2)-n*(o-1))/o;if(c<=0)return[];let x=[];for(let v=0;v<o;v+=1)x.push({left:a+r+v*(c+n),width:c});return x}function Gn(e,t){return e*t>=8?e:0}function nr(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(l=>parseFloat(l)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function We(e){let t=1,o=1;for(let n=e;n;n=Tn(n)){let r=nr(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var ye=(e,t)=>({light:e,dark:t}),Gt={accent:ye("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:ye("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:ye("oklch(1 0 0)","oklch(0.264 0 0)"),fg:ye("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:ye("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:ye("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:ye("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:ye("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)"),pixelLine:ye("oklch(0.205 0 0 / 0.14)","oklch(0.97 0 0 / 0.14)")};function Pn(e){return`light-dark(${e.light}, ${e.dark})`}var fe=Pn(ye("#fafafa","#1a1a1a"));function _e(e,t=e){return Pn(ye(`rgb(0 0 0 / ${t})`,`rgb(255 255 255 / ${e})`))}var Bn=[0,.07,.08,.1,.12,.15,.2];function I(e){let t=Bn[Math.max(0,Math.min(Bn.length-1,e))];return t===0?fe:_e(t)}var w={primary:_e(.9),secondary:_e(.6),tertiary:_e(.46,.55),disabled:_e(.22,.26)},ue=_e(.12),Ce="0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)",Dn="0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)",F=22,Ae=36,P={tight:4,base:8,roomy:12,edge:16},_={exit:"160ms cubic-bezier(0.3, 0, 1, 1)",ui:"160ms cubic-bezier(0.2, 0, 0, 1)"},or='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',L={title:13,body:12,tag:11,stack:or},U={regular:400,medium:500,semibold:600},Bt="__align_font",rr="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function On(){if(document.getElementById(Bt))return;let e=document.createElement("link");e.id=Bt,e.rel="stylesheet",e.href=rr,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function In(){document.getElementById(Bt)?.remove()}function Hn(e){let t=[`${U.medium} ${L.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function Dt(e){let t={};for(let o of Object.keys(Gt))t[o]=e?Gt[o].dark:Gt[o].light;return t}var Pt=null;function Fn(e){Pt=e==="auto"?null:e}function Ot(){if(Pt)return Pt==="dark";let e=document.documentElement,t=getComputedStyle(e).colorScheme;if(/dark/.test(t)&&!/light/.test(t))return!0;if(/light/.test(t)&&!/dark/.test(t))return!1;for(let o of[document.body,e]){if(!o)continue;let n=ir(getComputedStyle(o).backgroundColor);if(n!==null)return n<.5}return matchMedia("(prefers-color-scheme: dark)").matches}function ir(e){let t=/^rgba?\(([^)]+)\)$/.exec(e.trim());if(!t)return null;let o=t[1].split(/[\s,/]+/).filter(Boolean).map(Number),[n,r,i,a=1]=o;return n===void 0||r===void 0||i===void 0||a<.5?null:(.2126*n+.7152*r+.0722*i)/255}function Xe(e,t){return e.replace(/\)$/,` / ${t})`)}var ar=`
`,ke=16,sr=`
.dock {
  /* No color-scheme here: the overlay sets it inline on the shadow host, from
     what the page actually looks like rather than what the machine prefers, and
     it inherits down. Declaring 'light dark' again would undo that and hand
     light-dark() back to the media query. */
  position: fixed; left: ${ke}px; top: 0;
  /* Clamped to the window. A narrow viewport is not an edge case for this
     tool, it is the case it exists for: you make the window 375px wide
     precisely to check a mobile layout, and a readout that hangs off the
     screen there is useless exactly when you reached for it. */
  width: min(340px, calc(100vw - ${ke*2}px));
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none;
  /* Not the whole panel: only the header is a drag surface, and making the
     numbers unselectable means the one thing you might want to paste into a
     stylesheet cannot be picked up by hand. Copy covers the whole reading; a
     selection covers the one value you actually wanted. */
  user-select: none;
  font-family: ${L.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${w.primary};
  --muted: ${w.secondary};
  --border: ${ue};
}
.panel {
  padding: 10px; border-radius: 0;
  /* Five sections now \u2014 box, tokens, styled by, matches, colour \u2014 and on a
     laptop that is taller than the window. place() clamps the position but
     cannot rescue a panel taller than the screen, so it scrolls instead. */
  max-height: calc(100vh - ${ke*2}px);
  overflow-y: auto; overscroll-behavior: contain;
  font-size: ${L.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${fe};

  box-shadow: ${Ce};

  /* The one animation in the tool: a panel that must land exactly, so the
     Fluid spring.moderate tier at 160ms, critically damped. */
  opacity: 0;
  transform: translateY(4px) scale(0.98);
  transform-origin: bottom left;
  transition: opacity ${_.exit}, transform ${_.exit},
              box-shadow ${_.exit};
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
  transition: opacity ${_.ui}, transform ${_.ui},
              box-shadow ${_.ui};
}
@media (prefers-reduced-motion: reduce) {
  /* Fewer and gentler, not none: the fade aids comprehension, the travel does not. */
  .panel { transform: none; transition: opacity 120ms linear; }
}

header {
  /* Stays put while the body scrolls: it is also the drag handle, and a handle
     you have to scroll back up to find is not a handle. */
  position: sticky; top: -10px; z-index: 1;
  background: ${fe};
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] .panel { box-shadow: ${Dn}; }
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${L.title}px; font-weight: ${U.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${L.body}px; font-weight: ${U.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${L.tag}px; font-weight: ${U.medium};
  margin-left: 4px;
  color: ${w.primary};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${L.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${I(1)}; }

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
  padding: ${P.base}px;
}
.region[data-level="1"] { background: ${I(1)}; }
.region[data-level="2"] { background: ${I(2)}; }
.region[data-level="3"] { background: ${I(3)}; }
.content { background: ${I(4)}; }

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
  font-size: ${L.tag}px; font-weight: ${U.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${U.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${U.regular}; }
.row { display: flex; align-items: center; gap: ${P.tight}px; margin: ${P.tight}px 0; }
.row > .edge { flex: 0 0 20px; }
.row > .fill { flex: 1 1 auto; min-width: 0; }

/* Type and tokens sit under the box, in the same muted register as the band
   labels \u2014 they annotate the measurement rather than competing with it. */
.readout {
  user-select: text;
  margin-top: ${P.base}px; padding-top: ${P.base}px;
  border-top: 1px solid var(--border);
}
.readout-tag { position: static; margin-bottom: ${P.tight}px; }
/* One grid for the whole section rather than one per row, so every key in a
   section shares a column and the column sizes to the longest key in it. A
   fixed 62px was right until a diff started printing 'background-color', which
   it broke across two lines mid-word. The 62px floor keeps the rhythm the
   other sections already had. */
.readout-rows {
  display: grid; grid-template-columns: minmax(62px, max-content) 1fr;
  gap: 0 ${P.base}px; align-items: baseline;
  font-size: ${L.tag}px; line-height: 1.5;
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
  font-size: ${L.body}px;
  /* Several of these wrap \u2014 a diff value, a rule file, a token list \u2014 and a
     lone short word on the last line reads as a mistake. */
  text-wrap: pretty;
}
.content {
  border-radius: 0; padding: ${P.roomy}px ${P.base}px;
  text-align: center; font-weight: ${U.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,ot=ke,Pe=-1,Ye=!1;function zn(e){let t=document.createElement("style");t.textContent=sr,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);let r=!1;function i(b,E){let N=document.createElement("div");N.className="readout";let O=document.createElement("div");O.className="tag readout-tag",O.textContent=b,N.appendChild(O);let V=document.createElement("div");V.className="readout-rows",N.appendChild(V);for(let[re,ee]of E){let z=document.createElement("div");z.className="readout-row";let Y=document.createElement("span");Y.className="readout-key",Y.textContent=re;let p=document.createElement("span");p.className="readout-value",p.textContent=ee,z.append(Y,p),V.appendChild(z)}return N}e.appendChild(o);let a=(b,E)=>Math.min(Math.max(b,ke),Math.max(ke,E-ke));function l(){let b=o.offsetHeight||300;Pe<0&&(Pe=Math.max(ke,innerHeight-b-ke)),ot=a(ot,innerWidth-o.offsetWidth),Pe=a(Pe,innerHeight-b),o.style.transform=`translate(${ot-ke}px, ${Pe}px)`}let c=null;function x(b){b.button===0&&(b.preventDefault(),b.stopPropagation(),c={x:b.clientX,y:b.clientY,dx:ot,dy:Pe},o.setAttribute("data-dragging",""),b.currentTarget.setPointerCapture(b.pointerId))}function v(b){c&&(ot=c.dx+(b.clientX-c.x),Pe=c.dy+(b.clientY-c.y),l())}function C(){c=null,o.removeAttribute("data-dragging")}addEventListener("resize",l);let u=null,g=[],y;function T(b){let E=document.createElement("div");return E.className="edge",E.textContent=b===0?"0":j(b),b===0&&E.setAttribute("data-zero",""),E}function G(b,E,N,O){let[V,re,ee,z]=N,Y=document.createElement("div");Y.className="region",Y.setAttribute("data-level",String(E));let p=document.createElement("span");p.className="tag",p.textContent=b;let A=document.createElement("div");A.className="row";let s=document.createElement("div");s.className="fill",s.appendChild(O),A.append(T(z),s,T(re));let h=document.createElement("div");return h.className="head",h.append(p,T(V)),Y.append(h,A,T(ee)),Y}return{show(b,E=[],N){g=E,y=N;let O=At(b.el),[V,re,ee,z]=O.border,[Y,p,A,s]=O.padding,h=We(b.el),d=b.width/h.x,f=b.height/h.y,$=Math.abs(h.x-1)>.001||Math.abs(h.y-1)>.001,S=document.createElement("header"),B=document.createElement("span");B.className="name",B.textContent=b.label;let q=document.createElement("span");q.className="size",q.textContent=`${j(d)} \xD7 ${j(f)}`;let Q=document.createElement("button");if(Q.className="close",Q.textContent="\xD7",Q.title="close (B brings it back)",Q.addEventListener("pointerdown",R=>R.stopPropagation()),Q.addEventListener("click",R=>{R.stopPropagation(),Ye=!0,o.removeAttribute("data-open")}),S.append(B,q),$){let R=document.createElement("span");R.className="scale",R.textContent=`\xD7${j(h.x)}`,R.title=`renders at ${j(b.width)} \xD7 ${j(b.height)}`,S.appendChild(R)}S.appendChild(Q),S.addEventListener("pointerdown",x),S.addEventListener("pointermove",v),S.addEventListener("pointerup",C),S.addEventListener("pointercancel",C);let k=document.createElement("div");k.className="content",k.textContent=`${j(d-z-re-s-p)} \xD7 ${j(f-V-ee-Y-A)}`,k.title=k.textContent;let J=[S,G("margin",1,O.margin,G("border",2,O.border,G("padding",3,O.padding,k)))];if(r){let R=pn(b.el),m=lt(b.el);J.push(m.length&&R?i("type",m.map(M=>[M.label,M.value])):i("type",[["","nothing of its own to set type on"]]))}if(N&&N.el!==b.el&&N.el.isConnected){let R=kn(N.el,b.el).map(W=>[W.prop,`${W.a||"\u2014"} \u2192 ${W.b||"\u2014"}`]),m=R.slice(0,10);R.length>m.length&&m.push(["",`and ${R.length-m.length} more`]);let M=N.label===b.label?"the one locked before":N.label;J.push(i(`differs from ${M}`,m.length?m:[["","nothing in the properties it compares"]]))}let me=wn(b.el);if(me&&me.rows.length&&J.push(i(`laid out by ${me.display}`,me.rows.map(R=>[R.label,R.value]))),E.length){let R=E.map(M=>[j(M.px),M.detail]),m=gn(E.map(M=>M.px));m&&R.push(["",m]),J.push(i("gaps",R))}let K=ct(b.el),ie=mn([d,f,...O.margin,...O.border,...O.padding,...r?lt(b.el).map(R=>R.px):[]],K);ie&&J.push(i("tokens",[["",ie]]));let te=yn(b.el);te.length&&J.push(i("styled by",te.slice(0,4).map(R=>[R.selector,R.file])));let he=xn(b.el);he>1&&J.push(i("matches",[["",`${he} elements share ${tt(b.el)}`]]));let ce=K.filter(R=>et(R.value));if(ce.length){let R=bn(b.el).map(({label:m,value:M})=>{let W=dt(M,ce);return[m,W.length?`${M}  ${W.join(" ")}`:`${M}  \u2014`]});R.length&&J.push(i("colour",R))}n.replaceChildren(...J),u=b,l(),!Ye&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},showsType:()=>r,isOpen:()=>!Ye&&u!==null,toggleType(){r=!r,u&&this.show(u,g,y)},asText(){if(!u)return"";let b=At(u.el),E=We(u.el),N=u.width/E.x,O=u.height/E.y,V=ee=>ee.map(z=>j(z)).join(" "),re=[`${u.label}  ${j(N)} \xD7 ${j(O)}`,`margin   ${V(b.margin)}`,`border   ${V(b.border)}`,`padding  ${V(b.padding)}`];if(r)for(let ee of lt(u.el))re.push(`${ee.label.padEnd(8)} ${ee.value}`);return re.join(ar)},hide(){u=null,o.removeAttribute("data-open")},setHidden(b){o.toggleAttribute("data-away",b)},toggle(){u&&(Ye=!Ye,Ye?o.removeAttribute("data-open"):(l(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",l),o.remove(),t.remove()}}}function Wn(e=20,t=1e3){let o=[];return{push(n,r,i=Date.now()){let a=o[o.length-1];if(a&&r!==""&&a.tag===r&&i-a.at<=t){a.at=i;return}o.push({state:n,tag:r,at:i}),o.length>e&&o.shift()},pop(){return o.pop()?.state??null},peek(){return o[o.length-1]?.state??null},depth(){return o.length},clear(){o.length=0}}}var lr="0 0 24 24";var D=e=>({path:e}),Le=(e,t,o,n,r)=>({rect:[e,t,o,n,r]}),cr={rulers:[D("M2 8V4"),D("M22 8V4"),D("M22 6H2"),Le(2,12,20,8,2),D("M6 15v-3"),D("M10 15v-3"),D("M14 15v-3"),D("M18 15v-3")],xray:[D("M3 7V5a2 2 0 0 1 2-2h2"),D("M17 3h2a2 2 0 0 1 2 2v2"),D("M21 17v2a2 2 0 0 1-2 2h-2"),D("M7 21H5a2 2 0 0 1-2-2v-2")],grid:[Le(3,3,18,18,2),D("M9 3v18"),D("M15 3v18")],pixels:[Le(3,3,18,18,2),D("M3 9h18"),D("M3 15h18"),D("M9 3v18"),D("M15 3v18")],type:[D("M12 4v16"),D("M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"),D("M9 20h6")],panel:[Le(3,3,18,18,2),Le(8,8,8,8,1)],freeze:[Le(14,3,5,18,1),Le(5,3,5,18,1)],copy:[Le(8,8,14,14,2),D("M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2")],pick:[D("m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12"),D("m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z"),D("m2 22 .414-.414")],hide:[D("M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"),D("M14.084 14.158a3 3 0 0 1-4.242-4.242"),D("M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"),D("m2 2 20 20")],undo:[D("M9 14 4 9l5-5"),D("M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11")],edit:[D("M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"),D("m15 5 4 4")],check:[D("M20 6 9 17l-5-5")],cross:[D("M18 6 6 18"),D("m6 6 12 12")]},It="http://www.w3.org/2000/svg";function De(e,t=16){let o=document.createElementNS(It,"svg");o.setAttribute("viewBox",lr),o.setAttribute("width",String(t)),o.setAttribute("height",String(t)),o.setAttribute("fill","none"),o.setAttribute("stroke","currentColor"),o.setAttribute("stroke-width","2"),o.setAttribute("stroke-linecap","round"),o.setAttribute("stroke-linejoin","round"),o.setAttribute("aria-hidden","true");for(let n of cr[e])if("rect"in n){let[r,i,a,l,c]=n.rect,x=document.createElementNS(It,"rect");x.setAttribute("x",String(r)),x.setAttribute("y",String(i)),x.setAttribute("width",String(a)),x.setAttribute("height",String(l)),x.setAttribute("rx",String(c)),o.appendChild(x)}else{let r=document.createElementNS(It,"path");r.setAttribute("d",n.path),o.appendChild(r)}return o}var dr=[{title:"Pointing at things",rows:[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure whatever is under the cursor"],["Click","lock an element, so it keeps measuring after the pointer leaves"],["Right-click","add another to the locked set, or drop one from it. Two locked also gets you a diff"],["Drag the panel header","move the box model out of your way"],["Esc","clear the locks, then close the tool"]]},{title:"Guides",rows:[["Drag from a rule","pull out a guide; drag it back into the rule to throw it away"],["V  /  H","drop a vertical or horizontal guide at the cursor"],["Hover a guide","its distance to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the guide you last touched. Shift for 10px"],["L","pin a guide, so it cannot be moved or deleted by accident"],["Ctrl/Cmd while placing","ignore snapping"],["Del","remove the guide under the cursor. Shift+Del for all of them"]]}],be=P.edge,Ht=24,ur=900,rt=Ae,it=P.base,pr=`
.flag {
  position: fixed; top: ${be}px; right: ${be}px;
  display: flex; align-items: center; gap: 8px;
  transition: top ${_.ui};
  padding: ${(Ae-Ht)/2}px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${L.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${L.tag}px; font-weight: ${U.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${w.primary};
  background: ${fe};
  box-shadow: ${Ce};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
/* No negative tracking: it is 11px, and tightening is what large text wants.
   Small text reads better at zero or a hair positive. */
.flag .name { letter-spacing: 0; }
/* The rulers draw a gutter along the top edge, and the badge sits in it. Step
   down out of the way rather than covering the ticks the rulers exist to show. */
.flag[data-rulers] { top: ${be+F}px; }
.help[data-rulers] { top: ${be+F+rt+it}px; }
.flag:hover { background: ${I(1)}; }
.flag .count { color: ${w.secondary}; }

/* A layers bar, not a palette. Switches, then the one control that changes the
   page, then the things that happen once. */
.tools { display: flex; align-items: center; gap: 2px; }
.sep {
  width: 1px; align-self: stretch; margin: 0 4px;
  background: ${ue};
}
.tool {
  width: ${Ht}px; height: ${Ht}px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; cursor: pointer;
  font: inherit; font-size: ${L.tag}px; font-weight: ${U.medium};
  color: ${w.tertiary};
}
/* Both glyphs occupy the same cell so one can cross-fade into the other; a
   swap would jump, and the point is to be noticed without being a movement. */
.tool > svg { grid-area: 1 / 1; transition: opacity ${_.ui}; }
.tool > .ack { opacity: 0; }
.tool[data-ack] > .ack { opacity: 1; }
.tool[data-ack] > .glyph { opacity: 0; }
.tool:hover { background: ${I(2)}; color: ${w.primary}; }
/* On the press, not on the release. Waiting for the click to acknowledge a
   button is the difference between a control that answers and one that lags,
   and it costs one rule. */
.tool:active { background: ${I(4)}; color: ${w.primary}; }
.tool:focus-visible { outline: 1px solid ${w.primary}; outline-offset: -1px; }
/* On is the film, not a colour: the three hues each already mean something on
   the canvas, and a fourth here would say nothing. */
.tool[data-on] { background: ${I(4)}; color: ${w.primary}; }
/*
 * Armed reads differently from on, deliberately. Every other toggle draws
 * something over the page; this one lets the page be rewritten, and a tool that
 * can do that while looking exactly like one that cannot is the problem the
 * arming design exists to avoid. It inverts rather than taking a hue: red
 * already means a measurement here, and a second meaning for it would cost
 * more than the emphasis is worth.
 */
.tool[data-tool='edit'][data-on] {
  background: ${w.primary};
  color: ${fe};
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
  position: fixed; top: ${be+rt+it}px; right: ${be}px;
  /* 368 plus two insets is 400, so this was the first thing to hang off the
     left edge of a phone-width window. */
  /* The padding is in the subtraction because these boxes are content-box:
     without it the clamp lets the panel sit flush against the far edge with
     no inset at all, which reads as broken rather than as tight. */
  width: min(368px, calc(100vw - ${be*2+P.base*2}px));
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${be*2+rt+it}px); overflow-y: auto;
  padding: ${P.base}px; border-radius: 0;
  user-select: none;
  font-family: ${L.stack};
  font-synthesis: none;
  font-size: ${L.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${w.primary};
  background: ${fe};
  box-shadow: ${Ce};
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
  transition: opacity ${_.ui}, transform ${_.ui}, visibility 0s linear 160ms;
}
.help[data-open] {
  opacity: 1; visibility: visible; pointer-events: auto;
  transform: none;
  transition: opacity ${_.ui}, transform ${_.ui}, visibility 0s;
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
  align-items: baseline; gap: ${P.tight}px ${P.base}px; margin: 0;
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
  color: ${w.tertiary}; line-height: 0;
}
.help h4 {
  grid-column: 1 / -1; margin: 10px 0 2px;
  font-size: ${L.tag}px; font-weight: ${U.semibold};
  color: ${w.tertiary};
}
.help h4:first-child { margin-top: 0; }
.help kbd {
  display: inline-block; padding: 3px 5px;
  font: inherit; font-weight: ${U.medium};
  border: 1px solid ${ue};
  background: ${I(2)};
}
/* These run to three lines, and a one-word last line reads as a mistake. */
.help dd { margin: 0; color: ${w.secondary}; text-wrap: pretty; }
`,Ft=[{name:"rulers",label:"Rulers",key:"R",toggle:!0,what:"a scale down the top and left edges, in page pixels \u2014 and the gutters you drag guides out of"},{name:"xray",label:"X-ray",key:"X",toggle:!0,what:"outline every element at once, to see the boxes a layout is really made of"},{name:"grid",label:"Column grid",key:"G",toggle:!0,what:"the grid your design is built on, columns filled and gutters left empty. Needs one configured"},{name:"pixels",label:"Pixel grid",key:"K",toggle:!0,what:"a ten-pixel lattice over the page, to read an offset off without measuring it"},{name:"type",label:"Type",key:"T",toggle:!0,what:"add size, weight, line height and tracking to the panel, each checked against your scale"},{name:"panel",label:"Box model",key:"B",toggle:!0,what:"the readout itself \u2014 margins, borders, padding, what places the element, what styles it"},{name:"hide",label:"Hide",key:"\\",toggle:!0,what:"everything drawn, out of the way for a moment. Your locks, guides and layers all survive it"},{name:"freeze",label:"Freeze",key:"F",toggle:!0,what:"hold every animation and transition where it stands, so a moving thing can be measured"},{name:"copy",label:"Copy",key:"C",toggle:!1,what:"put everything in the panel on the clipboard as text"},{name:"pick",label:"Colour",key:"P",toggle:!1,what:"sample a colour from anywhere on screen and match it against your palette"},{name:"edit",label:"Edit",key:"E",toggle:!0,what:"let the panel change the page. Off until you say so, shown while it is on, and everything goes back when you turn it off"},{name:"undo",label:"Undo",key:"Ctrl/Cmd + Z",toggle:!1,what:"step back through the guides \u2014 a whole run of nudges counts as one"}];function _n(e,t){let o=document.createElement("style");o.textContent=pr,e.appendChild(o);let n=document.createElement("div");n.className="flag";let r=document.createElement("span");r.className="name",r.textContent="Align";let i=document.createElement("span");i.className="count";let a=new Map,l=new Map,c=document.createElement("div");c.className="tools";for(let g of Ft){if(g.name==="freeze"||g.name==="copy"){let G=document.createElement("span");G.className="sep",c.appendChild(G)}let y=document.createElement("button");y.type="button",y.className="tool",y.dataset.tool=g.name;let T=De(g.name);T.classList.add("glyph"),y.appendChild(T),y.setAttribute("aria-label",g.label),y.title=`${g.label}  \xB7  ${g.key}
${g.what}`,g.toggle||y.setAttribute("data-once",""),y.addEventListener("click",G=>{G.stopPropagation(),t(g.name)}),a.set(g.name,y),c.appendChild(y)}n.append(r,c,i);let x=document.createElement("div");x.className="help";let v=document.createElement("dl");function C(g){let y=document.createElement("h4");y.textContent=g,v.appendChild(y)}function u(g,y,T){let G=document.createElement("span");G.className="glyph",T&&G.appendChild(De(T,14));let b=document.createElement("dt"),E=document.createElement("kbd");E.textContent=g,b.appendChild(E);let N=document.createElement("dd");N.textContent=y,v.append(G,b,N)}C("The bar, left to right");for(let g of Ft)u(g.key,`${g.label} \u2014 ${g.what}`,g.name);for(let g of dr){C(g.title);for(let[y,T]of g.rows)u(y,T)}return x.appendChild(v),n.addEventListener("click",g=>{g.stopPropagation(),x.toggleAttribute("data-open")}),e.append(n,x),{acknowledge(g,y){let T=a.get(g);if(!T)return;clearTimeout(l.get(g)),T.querySelector(".ack")?.remove();let G=De(y?"check":"cross");G.classList.add("ack"),T.appendChild(G),requestAnimationFrame(()=>T.setAttribute("data-ack",y?"yes":"no")),l.set(g,setTimeout(()=>{T.removeAttribute("data-ack"),setTimeout(()=>T.querySelector(".ack")?.remove(),200)},ur))},update(g,y){i.textContent=g>0?`${g} locked`:"";let T=y.rulers&&!y.hide;n.toggleAttribute("data-rulers",T),x.toggleAttribute("data-rulers",T);for(let E of Ft)E.toggle&&a.get(E.name)?.toggleAttribute("data-on",y[E.name]===!0);let G=a.get("copy");G&&(G.disabled=!y.canCopy);let b=a.get("undo");b&&(b.disabled=!y.canUndo)},closeHelp(){let g=x.hasAttribute("data-open");return x.removeAttribute("data-open"),g},destroy(){for(let g of l.values())clearTimeout(g);n.remove(),x.remove(),o.remove()}}}function Xn(e,t=0,o=0){return Math.min(100,Math.max(...[e,t,o].map(n=>{let[r,i="0"]=String(n).toLowerCase().split("e");return Math.max(0,(r.split(".")[1]?.length??0)-Number(i))})))}function zt(e,t,o,n){let r=o??-1/0,i=n??1/0,a=Math.max(r,Math.min(i,e));if(a===r||a===i||!Number.isFinite(t)||t<=0)return a;let l=o??0,c=l+Math.round((a-l)/t)*t;return Math.max(r,Math.min(i,Number(c.toPrecision(14))))}var mr=.03125;function hr(e,t,o){let n=(e-t)/(o-t),r=Math.round(n*10)/10;return Math.abs(n-r)<=mr?t+r*(o-t):e}var fr=32,gr=8,br=200;function Yn(e,t){let o=Math.max(0,e-fr);return t*gr*Math.sqrt(Math.min(o/br,1))}function ft(e,t,o){return o===t?0:(e-t)/(o-t)*100}function Kn(e,t,o){let n=Math.max(0,Math.min(1,e));return t+n*(o-t)}function xr(e,t,o,n,r,i=!1){if(e==="Home")return o;if(e==="End")return n;let a=["ArrowRight","ArrowUp","PageUp"].includes(e)?1:["ArrowLeft","ArrowDown","PageDown"].includes(e)?-1:0;if(!a)return;if(!(r>0)||n<=o)return o;let l=e.startsWith("Page")||i?10:1,c=(t-o)/r,x=o+(a>0?Math.floor(c+1e-9)+l:Math.ceil(c-1e-9)-l)*r;return Math.max(o,Math.min(n,Number(x.toPrecision(14))))}function yr(e,t,o){let n=(t-e)/o;return n<=10&&Number.isFinite(n)&&n>1?Array.from({length:Math.round(n)-1},(r,i)=>(i+1)*o/(t-e)*100):Array.from({length:9},(r,i)=>(i+1)*10)}function jn(e,t,o=0,n=0){let r=Xn(t,o,n),i=Math.max(r,Math.min(4,Xn(e)));return!Number.isFinite(t)||t<=0?i:zt(e,t,o,n)===e?r:i}function wr(e,t,o,n){return(o-t)/n<=10?Math.max(t,Math.min(o,t+Math.round((e-t)/n)*n)):hr(e,t,o)}var vr={stiffness:300,damping:25,mass:.8},kr={stiffness:220,damping:22,mass:1};function Un(e,t,o,n,r){let i=(-r.stiffness*(e-o)-r.damping*t)/r.mass,a=t+i*n;return{x:e+a*n,v:a}}function Vn(e,t,o,n=.01){return Math.abs(e-o)<n&&Math.abs(t)<n}var $r=0,Er=.5,Sr=.9,Cr=.1,Tr=3,Mr=800,qn=8,gt=3,Ar=20,Qn=10,Wt=12,Lr=`
.sl {
  position: relative;
  height: ${Ae}px;
  overflow: hidden;
  background: ${I(1)};
  border-radius: 0;
  cursor: pointer;
  user-select: none;
  touch-action: none;
}
.sl:focus-visible { outline: 2px solid ${w.secondary}; outline-offset: -2px; }

/* Behind everything, and scaled rather than resized: a width change is layout,
   a transform is not, and this moves on every pointer event of a drag. */
.sl-fill {
  position: absolute; inset: 0;
  transform-origin: left center;
  transform: scaleX(0);
  background: ${I(3)};
  transition: background ${_.ui};
  pointer-events: none;
}
.sl[data-awake] .sl-fill { background: ${I(5)}; }

.sl-marks { position: absolute; inset: 0; pointer-events: none; }
.sl-mark {
  position: absolute; top: 50%;
  width: 1px; height: 8px;
  transform: translate(-50%, -50%);
  background: transparent;
  transition: background ${_.ui};
}
.sl[data-awake] .sl-mark { background: ${ue}; }

.sl-handle {
  position: absolute; top: 50%; left: 0;
  width: ${gt}px; height: ${Ar}px;
  background: ${w.primary};
  pointer-events: none;
  opacity: ${$r};
  /* Two transitions, two jobs: opacity and the squash are eased, the position
     is not \u2014 it is written every frame and must not lag the pointer. */
  transition: opacity ${_.ui}, scale ${_.ui};
  scale: 0.25 1;
}
.sl[data-awake] .sl-handle { opacity: ${Er}; scale: 1 1; }
.sl[data-dragging] .sl-handle { opacity: ${Sr}; }
.sl[data-dodge] .sl-handle { opacity: ${Cr}; scale: 1 0.75; }

.sl-label, .sl-value {
  position: absolute; top: 50%;
  transform: translateY(-50%);
  font-size: ${L.body}px; font-weight: ${U.medium};
  line-height: 1;
  white-space: nowrap;
  transition: color ${_.ui};
}
.sl-label { left: ${Qn}px; color: ${w.secondary}; pointer-events: none; }
.sl-value {
  right: ${Wt}px;
  color: ${w.secondary};
  /* Inter has tabular figures, so the number stops shifting as it changes
     without loading a second face for it. */
  font-variant-numeric: tabular-nums;
  pointer-events: auto;
  border-bottom: 1px solid transparent;
  padding-bottom: 1px;
}
.sl[data-awake] .sl-value { color: ${w.primary}; }
/* Only after the hover delay: the underline is the promise that a click here
   edits rather than seeks, and it must not appear during a drag. */
.sl-value[data-editable] { border-bottom-color: ${w.secondary}; cursor: text; }

.sl-input {
  position: absolute; right: ${Wt}px; top: 50%;
  transform: translateY(-50%);
  width: 5ch;
  padding: 0 0 1px; border: 0;
  border-bottom: 1px solid ${w.secondary};
  background: none; outline: none;
  text-align: right;
  font: inherit;
  font-size: ${L.body}px; font-weight: ${U.medium};
  font-variant-numeric: tabular-nums;
  color: ${w.primary};
}
`,Jn="align-slider";function Nr(e){if(e.querySelector(`#${Jn}`))return;let t=document.createElement("style");t.id=Jn,t.textContent=Lr,e.appendChild(t)}function bt(e,t){Nr(e);let o=t.min??0,n=t.max??1,r=t.step??.01,i=t.value,a=document.createElement("div");a.className="sl",a.tabIndex=0,a.setAttribute("role","slider"),a.setAttribute("aria-label",t.label),a.setAttribute("aria-valuemin",String(o)),a.setAttribute("aria-valuemax",String(n));let l=document.createElement("div");l.className="sl-fill";let c=document.createElement("div");c.className="sl-marks";for(let m of yr(o,n,r)){let M=document.createElement("div");M.className="sl-mark",M.style.left=`${m}%`,c.appendChild(M)}let x=document.createElement("div");x.className="sl-handle";let v=document.createElement("span");v.className="sl-label",v.textContent=t.label;let C=document.createElement("span");C.className="sl-value",a.append(c,l,x,v,C);let u=ft(i,o,n),g=0,y=null,T=0,G=0;function b(){return a.offsetWidth}function E(){l.style.transform=`scaleX(${u/100})`;let m=b(),M=u/100*m,W=Math.max(gt,Math.min(m-gt,M))-gt/2;x.style.transform=`translate(${W}px, -50%)`;let de=!1;if(m>0){let Ge=Qn+v.offsetWidth+qn,Te=m-Wt-C.offsetWidth-qn;de=M<Ge||M>Te}a.toggleAttribute("data-dodge",de)}function N(){let m=jn(i,r,o,n);C.textContent=t.unit?`${i.toFixed(m)}${t.unit}`:i.toFixed(m),a.setAttribute("aria-valuenow",String(i)),a.setAttribute("aria-valuetext",C.textContent)}function O(){T&&cancelAnimationFrame(T),T=0,y=null,g=0}function V(){return typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches}function re(m,M=vr){if(V()){O(),u=m,E();return}if(y=m,G=performance.now(),T)return;let W=de=>{let Ge=Math.min((de-G)/1e3,.03333333333333333);if(G=de,y===null){T=0;return}let Te=Un(u,g,y,Ge,M);if(u=Te.x,g=Te.v,E(),Vn(u,g,y)){u=y,g=0,y=null,T=0,E();return}T=requestAnimationFrame(W)};T=requestAnimationFrame(W)}function ee(m,M){let W=zt(m,r,o,n),de=W!==i;i=W,N(),M?re(ft(i,o,n)):(O(),u=ft(i,o,n),E()),de&&t.onChange(i)}let z=null,Y=!0,p=null,A=1,s=0,h=0;function d(m){if(s=m,m===0){a.style.width="",a.style.transform="";return}a.style.width=`calc(100% + ${Math.abs(m)}px)`,a.style.transform=m<0?`translateX(${m}px)`:""}function f(){if(s===0)return;if(V()){d(0),a.style.width="",a.style.transform="";return}let m=0,M=performance.now(),W=de=>{let Ge=Math.min((de-M)/1e3,.03333333333333333);M=de;let Te=Un(s,m,0,Ge,kr);if(m=Te.v,d(Te.x),Vn(Te.x,m,0,.05)){d(0),a.style.width="",a.style.transform="",h=0;return}h=requestAnimationFrame(W)};h=requestAnimationFrame(W)}function $(m){if(!p)return 0;let M=b();return M<=0?0:(m-p.left)/A/M}let S=m=>{if(!(K||m.button!==0)){m.preventDefault();try{a.setPointerCapture(m.pointerId)}catch{}z={x:m.clientX,y:m.clientY},Y=!0,p=a.getBoundingClientRect(),A=We(a).x||1,a.setAttribute("data-awake","")}},B=m=>{if(!z)return;let M=m.clientX-z.x,W=m.clientY-z.y;Y&&Math.hypot(M,W)>Tr&&(Y=!1,a.setAttribute("data-dragging","")),!(Y||!p)&&(V()||(m.clientX<p.left?d(Yn(p.left-m.clientX,-1)):m.clientX>p.right?d(Yn(m.clientX-p.right,1)):s!==0&&d(0)),O(),ee(Kn($(m.clientX),o,n),!1))},q=m=>{z&&(Y&&ee(wr(Kn($(m.clientX),o,n),o,n,r),!0),t.onCommit?.(i),f(),z=null,a.removeAttribute("data-dragging"),k||a.removeAttribute("data-awake"))},Q=()=>{z&&(d(0),a.style.width="",a.style.transform="",z=null,a.removeAttribute("data-dragging"),k||a.removeAttribute("data-awake"))},k=!1,J=()=>{k=!0,a.setAttribute("data-awake","")},me=()=>{k=!1,z||a.removeAttribute("data-awake")},K=null,ie=!1,te=0;function he(){if(K)return;K=document.createElement("input"),K.className="sl-input",K.type="text",K.setAttribute("aria-label",`${t.label} value`),K.value=i.toFixed(jn(i,r,o,n)),C.style.display="none",a.appendChild(K),K.focus(),K.select();let m=M=>{if(K){if(M){let W=parseFloat(K.value);Number.isFinite(W)&&(ee(Math.max(o,Math.min(n,W)),!0),t.onCommit?.(i))}K.remove(),K=null,C.style.display="",ce(!1),a.focus()}};K.addEventListener("keydown",M=>{M.stopPropagation(),M.key==="Enter"?(M.preventDefault(),m(!0)):M.key==="Escape"&&(M.preventDefault(),m(!1))}),K.addEventListener("blur",()=>m(!0)),K.addEventListener("pointerdown",M=>M.stopPropagation())}function ce(m){ie=m,C.toggleAttribute("data-editable",m)}C.addEventListener("pointerenter",()=>{K||z||(te=window.setTimeout(()=>ce(!0),Mr))}),C.addEventListener("pointerleave",()=>{clearTimeout(te),K||ce(!1)}),C.addEventListener("pointerdown",m=>{ie&&(m.stopPropagation(),m.preventDefault(),he())});let R=m=>{if(m.target!==a||m.altKey||m.metaKey||m.ctrlKey)return;let M=xr(m.key,i,o,n,r,m.shiftKey);if(M===void 0){if(m.key!=="Enter")return;m.preventDefault(),m.stopPropagation(),ce(!0),he();return}m.preventDefault(),m.stopPropagation(),ee(M,!1),t.onCommit?.(i)};return a.addEventListener("pointerdown",S),a.addEventListener("pointermove",B),a.addEventListener("pointerup",q),a.addEventListener("pointercancel",Q),a.addEventListener("lostpointercapture",Q),a.addEventListener("pointerenter",J),a.addEventListener("pointerleave",me),a.addEventListener("keydown",R),N(),requestAnimationFrame(E),{el:a,set(m){i=zt(m,r,o,n),N(),O(),u=ft(i,o,n),E()},destroy(){O(),h&&cancelAnimationFrame(h),clearTimeout(te),a.remove()}}}function we(e,t){return getComputedStyle(e).getPropertyValue(t).trim()}function Rr(e,t){let o=parseFloat(e);if(e.endsWith("px")&&Number.isFinite(o)){let r=Mt(o,t)[0];if(r)return r}return et(e)?dt(e,t)[0]??null:null}function Gr(e){if(e.length===0)return"";let t=new Map;for(let n of e){let r=t.get(n.selector)??[];r.push(n),t.set(n.selector,r)}let o=["These changes were made live in the browser and are not in the source yet.","Apply them, preferring the named token wherever one is given.",""];for(let[n,r]of t){o.push(`${n} {`);for(let i of r){let a=i.token?`var(${i.token})`:i.to,l=i.token?`  /* ${i.to}, was ${i.from} */`:`  /* was ${i.from} */`;o.push(`  ${i.prop}: ${a};${l}`)}o.push("}","")}return o.join(`
`).trimEnd()}function Zn(){let e=new Map,t=!1;function o(r){let i=e.get(r);if(i)return i;let a=new Map;return e.set(r,a),a}function n(r,i,a){let l=r.style;a.inline?l.setProperty(i,a.inline):l.removeProperty(i)}return{get armed(){return t},arm(){t=!0},disarm(){let r=this.revertAll();return t=!1,r},set(r,i,a){if(!t)return;let l=o(r);l.has(i)||l.set(i,{inline:r.style.getPropertyValue(i),computed:we(r,i)}),r.style.setProperty(i,a)},revert(r,i){let a=e.get(r),l=a?.get(i);!a||!l||(n(r,i,l),a.delete(i),a.size===0&&e.delete(r))},revertAll(){let r=0;for(let[i,a]of e)for(let[l,c]of a)n(i,l,c),r+=1;return e.clear(),r},touched(r,i){return e.get(r)?.has(i)??!1},touchedProps(r){return[...e.get(r)?.keys()??[]].sort()},changes(){let r=[];for(let[i,a]of e)for(let[l,c]of a)r.push({el:i,prop:l,from:c.computed,to:we(i,l)});return r},asPrompt(){let r=[];for(let[i,a]of e){let l=ct(i),c=tt(i);for(let[x,v]of a){let C=we(i,x);C!==v.computed&&r.push({selector:c,prop:x,from:v.computed,to:C,token:Rr(C,l)})}}return Gr(r)}}}var eo={x:0,y:2,blur:8,spread:0,colour:"rgba(0, 0, 0, 0.2)",inset:!1};function Br(e,t){let o=[],n=0,r="";for(let i of e){if(i==="("?n+=1:i===")"&&(n-=1),i===t&&n===0){o.push(r.trim()),r="";continue}r+=i}return r.trim()&&o.push(r.trim()),o.filter(Boolean)}function Pr(e){let t=e.trim();if(!t||t==="none")return null;let o=t,n=/(^|\s)inset(\s|$)/.test(o);n&&(o=o.replace(/(^|\s)inset(\s|$)/," ").trim());let r=[];o=o.replace(/[a-z-]+\([^)]*\)/gi,c=>(r.push(c),`\0${r.length-1}`));let i=o.split(/\s+/).filter(Boolean).map(c=>c.startsWith("\0")?r[Number(c.slice(1))]:c),a=[],l=[];for(let c of i)/^-?\d*\.?\d+(px|em|rem|%)?$/.test(c)?a.push(parseFloat(c)):l.push(c);return a.length<2?null:{x:a[0]??0,y:a[1]??0,blur:a[2]??0,spread:a[3]??0,colour:l[0]??"rgba(0, 0, 0, 0.2)",inset:n}}function to(e){return!e||e.trim()==="none"?[]:Br(e,",").map(Pr).filter(t=>t!==null)}function Dr(e){let t=`${e.x}px ${e.y}px ${e.blur}px ${e.spread}px ${e.colour}`;return e.inset?`inset ${t}`:t}function no(e){return e.length===0?"none":e.map(Dr).join(", ")}function _t(e,t,o){let n=[...e];if(t<0||t>=n.length||o<0||o>=n.length)return n;let[r]=n.splice(t,1);return r!==void 0&&n.splice(o,0,r),n}function Xt(e){let t=/blur\(\s*(-?\d*\.?\d+)px\s*\)/i.exec(e||"");return t?parseFloat(t[1]):0}function oo(e){return e<=0?"none":`blur(${e}px)`}var Yt=["top","right","bottom","left"],Or=["border-top-left-radius","border-top-right-radius","border-bottom-right-radius","border-bottom-left-radius"],Ir=[{name:"Type",specs:[{prop:"font-size",label:"Size",kind:"length",min:8,max:96,step:1,unit:"px"},{prop:"font-weight",label:"Weight",kind:"number",min:100,max:900,step:100},{prop:"line-height",label:"Line height",kind:"length",min:0,max:96,step:1,unit:"px"},{prop:"letter-spacing",label:"Tracking",kind:"length",min:-4,max:12,step:.1,unit:"px"},{prop:"font-style",label:"Style",kind:"choice",options:["normal","italic"],more:!0},{prop:"text-align",label:"Align",kind:"choice",options:["start","center","end","justify"],more:!0},{prop:"text-transform",label:"Case",kind:"choice",options:["none","uppercase","lowercase","capitalize"],more:!0},{prop:"text-decoration-line",label:"Decoration",kind:"choice",options:["none","underline","line-through"],more:!0}]},{name:"Colour",specs:[{prop:"color",label:"Text",kind:"colour"},{prop:"background-color",label:"Background",kind:"colour"},{prop:"border-color",label:"Border",kind:"colour",more:!0},{prop:"opacity",label:"Opacity",kind:"number",min:0,max:1,step:.01}]},{name:"Box",specs:[{prop:"padding",label:"Padding",kind:"length",min:0,max:128,step:1,unit:"px",sides:Yt.map(e=>`padding-${e}`)},{prop:"margin",label:"Margin",kind:"length",min:-64,max:128,step:1,unit:"px",sides:Yt.map(e=>`margin-${e}`)},{prop:"width",label:"Width",kind:"length",min:0,max:1600,step:1,unit:"px",more:!0},{prop:"height",label:"Height",kind:"length",min:0,max:1200,step:1,unit:"px",more:!0},{prop:"box-sizing",label:"Sizing",kind:"choice",options:["content-box","border-box"]}]},{name:"Border",specs:[{prop:"border-width",label:"Width",kind:"length",min:0,max:24,step:1,unit:"px",sides:Yt.map(e=>`border-${e}-width`)},{prop:"border-style",label:"Style",kind:"choice",options:["none","solid","dashed","dotted"]},{prop:"border-radius",label:"Radius",kind:"length",min:0,max:64,step:1,unit:"px",sides:Or}]},{name:"Effects",specs:[{prop:"box-shadow",label:"Shadow",kind:"shadow"},{prop:"backdrop-filter",label:"Backdrop blur",kind:"blur",min:0,max:40,step:1,unit:"px",more:!0}]},{name:"Layout",specs:[{prop:"display",label:"Display",kind:"choice",options:["block","flex","grid","inline-flex","inline-block","none"]},{prop:"flex-direction",label:"Direction",kind:"choice",options:["row","column","row-reverse","column-reverse"],more:!0},{prop:"justify-content",label:"Justify",kind:"choice",options:["flex-start","center","flex-end","space-between"],more:!0},{prop:"align-items",label:"Align",kind:"choice",options:["stretch","flex-start","center","flex-end"],more:!0},{prop:"flex-wrap",label:"Wrap",kind:"choice",options:["nowrap","wrap"],more:!0},{prop:"gap",label:"Gap",kind:"length",min:0,max:96,step:1,unit:"px"}]}];function ro(e){let t=parseFloat(e);return Number.isFinite(t)?t:0}function io(e){let t=/^rgba?\(([^)]+)\)$/.exec(e.trim());if(!t)return/^#[0-9a-f]{6}$/i.test(e.trim())?e.trim():"#000000";let[o,n,r]=t[1].split(/[\s,/]+/).filter(Boolean).map(Number);if(o===void 0||n===void 0||r===void 0)return"#000000";let i=a=>Math.max(0,Math.min(255,Math.round(a))).toString(16).padStart(2,"0");return`#${i(o)}${i(n)}${i(r)}`}var Hr=320,Fr=`
.edit-dock {
  position: fixed;
  top: ${P.edge}px;
  left: ${P.edge}px;
  width: ${Hr}px;
  max-height: calc(100vh - ${P.edge*2}px);
  overflow: hidden;
  display: none;
  flex-direction: column;
  pointer-events: auto;
  font-family: ${L.stack};
  font-synthesis: none;
  font-size: ${L.body}px;
  font-weight: ${U.regular};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${w.primary};
  background: ${fe};
  box-shadow: ${Ce};
}
.edit-dock[data-open] { display: flex; }

.edit-head {
  display: flex; align-items: center; gap: ${P.base}px;
  flex: none;
  height: ${Ae}px;
  padding: 0 ${P.base}px 0 ${P.roomy}px;
  border-bottom: 1px solid ${ue};
}
.edit-title { font-size: ${L.title}px; font-weight: ${U.semibold}; }
.edit-subject {
  flex: 1; min-width: 0;
  color: ${w.tertiary};
  font-size: ${L.tag}px;
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
  scrollbar-width: thin;
  padding: ${P.base}px;
}
/* Nothing a control does may push the panel wider than the panel. */
.edit-line > * { min-width: 0; }

.edit-group + .edit-group { margin-top: ${P.roomy}px; }
.edit-group-name {
  display: block;
  margin: 0 0 ${P.tight}px 2px;
  font-size: ${L.tag}px; font-weight: ${U.medium};
  letter-spacing: 0.04em; text-transform: uppercase;
  color: ${w.tertiary};
}
.edit-rows { display: grid; gap: 6px; }

/* A row the tool has written. The bar is on the leading edge so a column of
   rows shows at a glance which of them are the tool's doing and which are the
   page's, without a word of text per row. */
.edit-row { position: relative; }
.edit-row[data-touched]::before {
  content: '';
  position: absolute; left: -${P.base}px; top: 0; bottom: 0;
  width: 2px;
  background: ${w.primary};
}

.edit-line {
  display: flex; align-items: center; gap: ${P.base}px;
  min-height: ${Ae}px;
  padding: 0 10px;
  background: ${I(1)};
}
.edit-label {
  flex: none; width: 88px;
  color: ${w.secondary};
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.edit-field { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; }

/* Choice: one button per value, the current one filled. Buttons rather than a
   select, because a select hides every option until you open it and the whole
   value of these is seeing the alternatives. */
.edit-choice { display: flex; flex-wrap: wrap; gap: 2px; }
.edit-opt {
  padding: 5px 7px; border: 0; border-radius: 0;
  background: ${I(2)}; color: ${w.secondary};
  font: inherit; font-size: ${L.tag}px; cursor: pointer;
  transition: background ${_.ui}, color ${_.ui};
}
.edit-opt:hover { background: ${I(4)}; color: ${w.primary}; }
.edit-opt[data-on] { background: ${w.primary}; color: ${fe}; }

.edit-swatch {
  flex: none; width: 22px; height: 22px;
  padding: 0; border: 0; border-radius: 0;
  box-shadow: inset 0 0 0 1px ${ue};
  cursor: pointer;
}
.edit-hex {
  flex: 1; min-width: 0;
  height: 24px; padding: 0 6px;
  border: 1px solid ${ue}; border-radius: 0;
  background: ${I(1)}; color: ${w.primary};
  font: inherit; font-size: ${L.tag}px;
  font-variant-numeric: tabular-nums;
}
.edit-hex:focus-visible { outline: 2px solid ${w.secondary}; outline-offset: -2px; }

.edit-sides { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; }

/* A shadow is a list, so its row is a block rather than a line. */
.edit-line-block { display: block; padding: ${P.base}px 10px; }
.edit-stack { display: grid; gap: 6px; }
.edit-layer { background: ${I(2)}; padding: 6px; }
.edit-layer-head {
  display: flex; align-items: center; gap: 4px;
  margin-bottom: 4px;
}
.edit-layer-name {
  flex: 1; min-width: 0;
  color: ${w.tertiary};
  font-size: ${L.tag}px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.edit-layer-head .edit-swatch { width: 18px; height: 18px; }
.edit-mini {
  flex: none;
  width: 20px; height: 20px;
  padding: 0; border: 0; border-radius: 0;
  background: ${I(3)}; color: ${w.secondary};
  font: inherit; font-size: ${L.tag}px; line-height: 1;
  cursor: pointer;
}
.edit-mini:hover:not(:disabled) { background: ${I(5)}; color: ${w.primary}; }
.edit-mini:disabled { color: ${w.disabled}; cursor: default; }
.edit-mini:focus-visible { outline: 2px solid ${w.secondary}; outline-offset: -2px; }
.edit-add {
  width: 100%;
  padding: 7px; border: 0; border-radius: 0;
  background: ${I(2)}; color: ${w.secondary};
  font: inherit; font-size: ${L.tag}px; cursor: pointer;
}
.edit-add:hover { background: ${I(4)}; color: ${w.primary}; }
.edit-add:focus-visible { outline: 2px solid ${w.secondary}; outline-offset: -2px; }
.edit-sides > * { min-width: 0; }

.edit-linked {
  width: 24px; height: 24px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; color: ${w.tertiary};
  cursor: pointer;
}
.edit-linked[data-on] { background: ${I(4)}; color: ${w.primary}; }
.edit-linked:focus-visible { outline: 2px solid ${w.secondary}; outline-offset: -2px; }

.edit-revert {
  width: 22px; height: 22px;
  display: none; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; color: ${w.tertiary};
  cursor: pointer;
}
.edit-row[data-touched] .edit-revert { display: grid; }
.edit-revert:hover { color: ${w.primary}; }
.edit-revert:focus-visible { outline: 2px solid ${w.secondary}; outline-offset: -2px; }

.edit-more {
  width: 100%; margin-top: ${P.tight}px;
  padding: 6px; border: 0; border-radius: 0;
  background: none; color: ${w.tertiary};
  font: inherit; font-size: ${L.tag}px; cursor: pointer;
  text-align: left;
}
.edit-more:hover { color: ${w.primary}; }

.edit-foot {
  flex: none;
  display: flex; align-items: center; gap: ${P.base}px;
  padding: ${P.base}px;
  border-top: 1px solid ${ue};
}
.edit-count { flex: 1; color: ${w.tertiary}; font-size: ${L.tag}px; }
.edit-action {
  padding: 7px 10px; border: 0; border-radius: 0;
  background: ${I(3)}; color: ${w.primary};
  font: inherit; font-size: ${L.tag}px; font-weight: ${U.medium};
  cursor: pointer;
  transition: background ${_.ui};
}
.edit-action:hover { background: ${I(5)}; }
.edit-action:disabled { color: ${w.disabled}; cursor: default; background: ${I(1)}; }
.edit-action:focus-visible { outline: 2px solid ${w.secondary}; outline-offset: -2px; }

.edit-empty {
  padding: ${P.roomy}px;
  color: ${w.tertiary};
}
`;function ao(e,t){let o=document.createElement("style");o.textContent=Fr,e.appendChild(o);let n=document.createElement("div");n.className="edit-dock";let r=document.createElement("div");r.className="edit-head";let i=document.createElement("span");i.className="edit-title",i.textContent="Edit";let a=document.createElement("span");a.className="edit-subject",r.append(i,a);let l=document.createElement("div");l.className="edit-body";let c=document.createElement("div");c.className="edit-foot";let x=document.createElement("span");x.className="edit-count";let v=document.createElement("button");v.type="button",v.className="edit-action",v.textContent="Copy as prompt";let C=document.createElement("button");C.type="button",C.className="edit-action",C.textContent="Revert all",c.append(x,C,v),n.append(r,l,c),e.appendChild(n);let u=null,g=!1,y=!1,T=[],G=new Set;function b(){let s=t.changes().length;x.textContent=s===0?"No changes":`${s} change${s===1?"":"s"}`,v.disabled=s===0,C.disabled=s===0}function E(){if(u){for(let s of T){let d=(s.spec.sides??[s.spec.prop]).some(f=>t.touched(u,f));s.el.toggleAttribute("data-touched",d)}b()}}function N(s,h){u&&(t.set(u,s,h),E())}function O(s,h,d){let f=bt(e,{label:d,value:u?ro(we(u,h)):0,min:s.min??0,max:s.max??100,step:s.step??1,...s.unit?{unit:s.unit}:{},onChange:$=>{let S=`${$}${s.unit??""}`;if(s.sides&&G.has(s.prop)){for(let B of s.sides)N(B,S);for(let B of T)if(B.spec.prop===s.prop)for(let q of B.sliders)q.set($)}else N(h,S)}});return{el:f.el,slider:f,sync:()=>{u&&f.set(ro(we(u,h)))}}}function V(s){let h=document.createElement("div");h.className="edit-choice";let d=[];for(let $ of s.options??[]){let S=document.createElement("button");S.type="button",S.className="edit-opt",S.textContent=$,S.addEventListener("click",()=>{N(s.prop,$),f()}),d.push(S),h.appendChild(S)}function f(){let $=u?we(u,s.prop):"";for(let S of d)S.toggleAttribute("data-on",S.textContent===$)}return{el:h,sync:f}}function re(s){let h=document.createElement("div");h.className="edit-field";let d=document.createElement("input");d.type="color",d.className="edit-swatch",d.setAttribute("aria-label",`${s.label} colour`);let f=document.createElement("input");f.type="text",f.className="edit-hex",f.spellcheck=!1,f.setAttribute("aria-label",`${s.label} colour, as hex`),d.addEventListener("input",()=>{f.value=d.value,N(s.prop,d.value)}),f.addEventListener("change",()=>{let S=f.value.trim();if(!/^#?[0-9a-f]{3}$|^#?[0-9a-f]{6}$/i.test(S)){$();return}let B=S.startsWith("#")?S:`#${S}`;d.value=B.length===4?`#${B[1]}${B[1]}${B[2]}${B[2]}${B[3]}${B[3]}`:B,N(s.prop,d.value)});function $(){let S=u?we(u,s.prop):"",B=io(S);d.value=B,f.value=B}return h.append(d,f),{el:h,sync:$}}function ee(s){let h=document.createElement("div");h.className="edit-stack";let d=[],f=[];function $(){N(s.prop,no(d))}function S(){for(let Q of f)Q.destroy();f=[],h.textContent="",d.forEach((Q,k)=>{let J=document.createElement("div");J.className="edit-layer";let me=document.createElement("div");me.className="edit-layer-head";let K=document.createElement("span");K.className="edit-layer-name",K.textContent=`Layer ${k+1}`;let ie=document.createElement("input");ie.type="color",ie.className="edit-swatch",ie.setAttribute("aria-label",`Layer ${k+1} colour`),ie.value=io(Q.colour),ie.addEventListener("input",()=>{d[k]={...Q,colour:ie.value},Q=d[k],$()});let te=document.createElement("button");te.type="button",te.className="edit-opt",te.textContent="inset",te.toggleAttribute("data-on",Q.inset),te.addEventListener("click",()=>{d[k]={...Q,inset:!Q.inset},Q=d[k],te.toggleAttribute("data-on",Q.inset),$()});let he=document.createElement("button");he.type="button",he.className="edit-mini",he.setAttribute("aria-label",`Move layer ${k+1} up`),he.textContent="\u2191",he.disabled=k===0,he.addEventListener("click",()=>{d=_t(d,k,k-1),$(),S()});let ce=document.createElement("button");ce.type="button",ce.className="edit-mini",ce.setAttribute("aria-label",`Move layer ${k+1} down`),ce.textContent="\u2193",ce.disabled=k===d.length-1,ce.addEventListener("click",()=>{d=_t(d,k,k+1),$(),S()});let R=document.createElement("button");R.type="button",R.className="edit-mini",R.setAttribute("aria-label",`Remove layer ${k+1}`),R.textContent="\xD7",R.addEventListener("click",()=>{d=d.filter((W,de)=>de!==k),$(),S()}),me.append(K,ie,te,he,ce,R);let m=document.createElement("div");m.className="edit-sides";let M=[{key:"x",label:"x",min:-64,max:64},{key:"y",label:"y",min:-64,max:64},{key:"blur",label:"blur",min:0,max:96},{key:"spread",label:"spread",min:-32,max:32}];for(let W of M){let de=bt(e,{label:W.label,value:Q[W.key],min:W.min,max:W.max,step:1,unit:"px",onChange:Ge=>{d[k]={...d[k],[W.key]:Ge},Q=d[k],$()}});f.push(de),m.appendChild(de.el)}J.append(me,m),h.appendChild(J)});let q=document.createElement("button");q.type="button",q.className="edit-add",q.textContent=d.length===0?"Add a shadow":"Add another layer",q.addEventListener("click",()=>{d=[...d,{...eo}],$(),S()}),h.appendChild(q)}function B(){d=u?to(we(u,s.prop)):[],S()}return{el:h,sync:B,sliders:[]}}function z(s){let h=bt(e,{label:s.label,value:u?Xt(we(u,s.prop)):0,min:s.min??0,max:s.max??40,step:s.step??1,unit:s.unit??"px",onChange:d=>N(s.prop,oo(d))});return{el:h.el,slider:h,sync:()=>{u&&h.set(Xt(we(u,s.prop)))}}}function Y(s){let h=document.createElement("div");h.className="edit-row";let d=document.createElement("div");d.className="edit-line";let f=document.createElement("span");f.className="edit-label",f.textContent=s.label;let $=document.createElement("div");$.className="edit-field";let S=[],B=[];if(s.sides){let k=document.createElement("div");k.className="edit-sides",k.style.flex="1";for(let me of s.sides){let K=me.split("-").filter(te=>te!=="border"&&te!=="radius"&&te!=="width"&&te!=="padding"&&te!=="margin").join(" ")||me,ie=O(s,me,K);S.push(ie.slider),B.push(ie.sync),k.appendChild(ie.el)}let J=document.createElement("button");J.type="button",J.className="edit-linked",J.setAttribute("aria-label",`Link all four ${s.label.toLowerCase()} values`),J.title="Change all four together",J.appendChild(De("copy",13)),J.addEventListener("click",()=>{G.has(s.prop)?G.delete(s.prop):G.add(s.prop),J.toggleAttribute("data-on",G.has(s.prop))}),$.append(k,J)}else if(s.kind==="shadow"){let k=ee(s);B.push(k.sync),k.el.style.flex="1",$.appendChild(k.el)}else if(s.kind==="blur"){let k=z(s);S.push(k.slider),B.push(k.sync),k.el.style.flex="1",$.appendChild(k.el)}else if(s.kind==="choice"){let k=V(s);B.push(k.sync),$.appendChild(k.el)}else if(s.kind==="colour"){let k=re(s);B.push(k.sync),k.el.style.flex="1",$.appendChild(k.el)}else{let k=O(s,s.prop,s.label);S.push(k.slider),B.push(k.sync),k.el.style.flex="1",$.appendChild(k.el)}let q=document.createElement("button");return q.type="button",q.className="edit-revert",q.setAttribute("aria-label",`Revert ${s.label.toLowerCase()}`),q.title="Put this back",q.appendChild(De("undo",13)),q.addEventListener("click",()=>{if(u){for(let k of s.sides??[s.prop])t.revert(u,k);for(let k of B)k();E()}}),s.kind==="shadow"&&d.classList.add("edit-line-block"),!s.sides&&(s.kind==="choice"||s.kind==="colour")&&d.appendChild(f),d.append($,q),h.appendChild(d),{spec:s,el:h,sliders:S,sync:()=>{for(let k of B)k()}}}function p(){for(let h of T)for(let d of h.sliders)d.destroy();if(T.length=0,l.textContent="",!u){let h=document.createElement("p");h.className="edit-empty",h.textContent="Click an element to lock it, then change it here.",l.appendChild(h),b();return}for(let h of Ir){let d=h.specs.filter(B=>y||!B.more);if(d.length===0)continue;let f=document.createElement("section");f.className="edit-group";let $=document.createElement("span");$.className="edit-group-name",$.textContent=h.name;let S=document.createElement("div");S.className="edit-rows";for(let B of d){let q=Y(B);T.push(q),S.appendChild(q.el)}f.append($,S),l.appendChild(f)}let s=document.createElement("button");s.type="button",s.className="edit-more",s.textContent=y?"Fewer properties":"More properties",s.addEventListener("click",()=>{y=!y,p()}),l.appendChild(s);for(let h of T)h.sync();E()}C.addEventListener("click",()=>{t.revertAll();for(let s of T)s.sync();E()}),v.addEventListener("click",()=>{let s=t.asPrompt();s&&navigator.clipboard?.writeText(s).catch(()=>{})});function A(){n.toggleAttribute("data-open",g)}return{show(s){u=s,a.textContent=s?s.tagName.toLowerCase()+(s.id?`#${s.id}`:""):"",p()},setArmed(s){g=s,A(),s&&p()},refresh(){for(let s of T)s.sync();E()},asText(){return t.asPrompt()},destroy(){for(let s of T)for(let h of s.sliders)h.destroy();T.length=0,n.remove(),o.remove()}}}var xt=5,Kt=4,at=12,so=.22,Ke=10,zr=50,Wr=100;function lo(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,hidden:!1,grid:null,pixels:!1,guides:[],liveGuide:null,activeGuide:null},i=Dt(Ot()),a=0,l=null;function c(){let p=Ot();p!==l&&(l=p,i=Dt(p),e.style.colorScheme=p?"dark":"light",Y())}c();let x=matchMedia("(prefers-color-scheme: dark)"),v=()=>c();x.addEventListener("change",v);let C=new MutationObserver(()=>c());function u(){C.disconnect(),C.observe(document.documentElement,{attributes:!0}),document.body&&C.observe(document.body,{attributes:!0})}u(),Hn(()=>Y());function g(){let p=devicePixelRatio;o.width=Math.round(innerWidth*p),o.height=Math.round(innerHeight*p),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(p,0,0,p,0,0),n.translate(.5,.5)}let y=p=>Math.round(p)-.5;function T(p,A){n.strokeStyle=A,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(p.left),Math.round(p.top),Math.round(p.width),Math.round(p.height))}function G(p){n.strokeStyle=Xe(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let A of[p.left,p.right])n.moveTo(Math.round(A),0),n.lineTo(Math.round(A),innerHeight);for(let A of[p.top,p.bottom])n.moveTo(0,Math.round(A)),n.lineTo(innerWidth,Math.round(A));n.stroke(),n.setLineDash([])}function b(p){if(n.strokeStyle=p.extension?Xe(i.measure,.55):i.measure,n.lineWidth=1,n.setLineDash(p.extension?[3,3]:[]),n.beginPath(),n.moveTo(Math.round(p.x1),Math.round(p.y1)),n.lineTo(Math.round(p.x2),Math.round(p.y2)),p.extension){n.stroke();return}if(p.axis==="x")for(let A of[p.x1,p.x2])n.moveTo(Math.round(A),Math.round(p.y1)-xt),n.lineTo(Math.round(A),Math.round(p.y1)+xt);else for(let A of[p.y1,p.y2])n.moveTo(Math.round(p.x1)-xt,Math.round(A)),n.lineTo(Math.round(p.x1)+xt,Math.round(A));n.stroke()}function E(p){return n.font=`${U.medium} ${L.body}px ${L.stack}`,{w:n.measureText(p).width+Kt*2,h:L.body+Kt*2+2}}function N(p,A,s,h){n.font=`${U.medium} ${L.body}px ${L.stack}`,n.textBaseline="middle";let{w:d,h:f}=E(p),$=y(Math.min(Math.max(A,at),innerWidth-d-at)),S=y(Math.min(Math.max(s,at),innerHeight-f-at));n.fillStyle=h,n.beginPath(),n.roundRect($,S,Math.ceil(d),f,4),n.fill(),n.fillStyle=i.surface,n.fillText(p,$+Kt,S+f/2)}function O(p,A,s,h,d=!1){let{w:f,h:$}=E(p);N(p,d?A-f/2:A,d?s-$/2:s,h)}function V(){let p=scrollX,A=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,F),n.fillRect(-.5,-.5,F,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${U.regular} 9px ${L.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let f of r.pinned)n.fillRect(y(f.left),-.5,Math.round(f.width),F),n.fillRect(-.5,y(f.top),F,Math.round(f.height));n.restore(),n.beginPath(),n.moveTo(-.5,F-.5),n.lineTo(innerWidth,F-.5),n.moveTo(F-.5,-.5),n.lineTo(F-.5,innerHeight),n.stroke();let s=f=>f%Wr===0?F:f%zr===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let h=Math.floor(p/Ke)*Ke;for(let f=h;f<p+innerWidth;f+=Ke){let $=Math.round(f-p);if($<F)continue;let S=s(f);n.moveTo($,F-S),n.lineTo($,F),S===F&&(n.fillStyle=i.muted,n.fillText(String(f),$+3,3))}n.stroke(),n.beginPath();let d=Math.floor(A/Ke)*Ke;for(let f=d;f<A+innerHeight;f+=Ke){let $=Math.round(f-A);if($<F)continue;let S=s(f);n.moveTo(F-S,$),n.lineTo(F,$),S===F&&(n.save(),n.translate(3,$-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(f),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),F),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo(F,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let f of r.guides){let $=Math.round(nt(f));f.axis==="x"?n.fillRect($-1,-.5,2,F):n.fillRect(-.5,$-1,F,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,F,F),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,F,F)}function re(){let p=Gn(10,1);if(p){n.strokeStyle=i.pixelLine,n.lineWidth=1,n.setLineDash([]),n.beginPath();for(let A=0;A<=innerWidth;A+=p)n.moveTo(A,0),n.lineTo(A,innerHeight);for(let A=0;A<=innerHeight;A+=p)n.moveTo(0,A),n.lineTo(innerWidth,A);n.stroke()}}function ee(p){let A=Rn(p,document.documentElement.clientWidth);n.fillStyle=Xe(i.measure,.08);for(let s of A)n.fillRect(y(s.left),-.5,Math.round(s.width),innerHeight+1)}function z(){if(a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore(),r.hidden)return;(r.pixels||r.grid)&&(n.save(),r.rulers&&(n.beginPath(),n.rect(F,F,innerWidth,innerHeight),n.clip()),r.pixels&&re(),r.grid&&ee(r.grid),n.restore());for(let s of r.pinned)T(s,i.accent);r.hover&&(G(r.hover),T(r.hover,r.pinned.length?Xe(i.accent,.7):i.accent));for(let s of r.guides){let h=r.liveGuide?.id===s.id;n.strokeStyle=s.locked||h?i.guide:Xe(i.guide,.55),n.lineWidth=s.pinned?2:1,n.setLineDash(s.locked?[]:[4,4]),n.beginPath();let d=Math.round(nt(s));if(s.axis==="x"?(n.moveTo(d,0),n.lineTo(d,innerHeight)):(n.moveTo(0,d),n.lineTo(innerWidth,d)),n.stroke(),r.activeGuide===s.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let f=7;s.axis==="x"?(n.moveTo(d,0),n.lineTo(d,f),n.moveTo(d,innerHeight-f),n.lineTo(d,innerHeight)):(n.moveTo(0,d),n.lineTo(f,d),n.moveTo(innerWidth-f,d),n.lineTo(innerWidth,d)),n.stroke()}}for(let s of r.lines)n.globalAlpha=s.faded?so:1,b(s);n.globalAlpha=1;let p=r.lines.filter(s=>s.label!==""),A=p.map(s=>{let h=(s.x1+s.x2)/2,d=(s.y1+s.y2)/2,{w:f,h:$}=E(s.label);return s.axis==="x"?{x:h-f/2,y:d-16-$/2,w:f,h:$,axis:s.axis}:{x:h+26-f/2,y:d-$/2,w:f,h:$,axis:s.axis}});if(Nn(A,{w:innerWidth,h:innerHeight},at).forEach((s,h)=>{let d=p[h];n.globalAlpha=d.faded?so:1,N(d.label,s.x,s.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:s,height:h,scale:d}=r.hover;O(`${j(s/d.x)} \xD7 ${j(h/d.y)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let s=r.liveGuide,h=Math.round(nt(s));O([`${s.axis} ${j(s.at)}`,s.caught,s.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),s.axis==="x"?h+6:30,s.axis==="x"?30:h+6,i.guide)}r.rulers&&V()}function Y(){a||(a=requestAnimationFrame(z))}return g(),{root:t,update(p){Object.assign(r,p),Y()},resize(){g(),Y()},destroy(){a&&cancelAnimationFrame(a),x.removeEventListener("change",v),C.disconnect(),e.remove()}}}function _r(e){let t=e.trim().replace(/^#/,""),o=t.length===3?t.split("").map(n=>n+n).join(""):t;return/^[0-9a-f]{6}$/i.test(o)?{r:parseInt(o.slice(0,2),16),g:parseInt(o.slice(2,4),16),b:parseInt(o.slice(4,6),16)}:null}function Xr({r:e,g:t,b:o}){let n=r=>Math.round(r).toString(16).padStart(2,"0");return`#${n(e)}${n(t)}${n(o)}`}function Yr({r:e,g:t,b:o}){return`rgb(${Math.round(e)} ${Math.round(t)} ${Math.round(o)})`}function Oe(e,t){return String(Number(e.toFixed(t)))}function Kr({r:e,g:t,b:o}){let n=e/255,r=t/255,i=o/255,a=Math.max(n,r,i),l=Math.min(n,r,i),c=(a+l)/2,x=a-l,v=0,C=0;return x!==0&&(C=x/(1-Math.abs(2*c-1)),a===n?v=(r-i)/x%6:a===r?v=(i-n)/x+2:v=(n-r)/x+4,v*=60,v<0&&(v+=360)),`hsl(${Oe(v,1)} ${Oe(C*100,1)}% ${Oe(c*100,1)}%)`}function jt(e){let t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4}function jr(e){let t=jt(e.r),o=jt(e.g),n=jt(e.b),r=.4122214708*t+.5363325363*o+.0514459929*n,i=.2119034982*t+.6806995451*o+.1073969566*n,a=.0883024619*t+.2817188376*o+.6299787005*n,l=Math.cbrt(r),c=Math.cbrt(i),x=Math.cbrt(a),v=.2104542553*l+.793617785*c-.0040720468*x,C=1.9779984951*l-2.428592205*c+.4505937099*x,u=.0259040371*l+.7827717662*c-.808675766*x,g=Math.sqrt(C*C+u*u),y=Math.atan2(u,C)*180/Math.PI;return y<0&&(y+=360),g<1e-4?`oklch(${Oe(v,4)} 0 0)`:`oklch(${Oe(v,4)} ${Oe(g,4)} ${Oe(y,2)})`}function co(e){let t=_r(e);return t?[{label:"hex",value:Xr(t)},{label:"rgb",value:Yr(t)},{label:"hsl",value:Kr(t)},{label:"oklch",value:jr(t)}]:[]}var Ur=`
.picker {
  /* Under the badge, from the badge's own numbers. */
  position: fixed; top: ${be+rt+it}px; right: ${be}px;
  width: min(200px, calc(100vw - ${be*2+P.base*2}px));
  padding: ${P.base}px; border-radius: 0;
  user-select: none;
  font-family: ${L.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${L.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${w.primary};
  background: ${fe};
  box-shadow: ${Ce};
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
  transition: opacity ${_.ui}, transform ${_.ui}, visibility 0s linear 160ms;
}
.picker[data-open] {
  opacity: 1; visibility: visible; pointer-events: auto;
  transform: none;
  transition: opacity ${_.ui}, transform ${_.ui}, visibility 0s;
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
  color: ${w.primary};
}
.picker button:hover { background: ${I(2)}; }
.picker button:focus-visible { outline: 1px solid ${w.primary}; outline-offset: -1px; }
.picker .k { color: ${w.secondary}; }
.picker .v { overflow-wrap: anywhere; }
.picker .hint {
  margin-top: 6px; padding-top: 6px;
  border-top: 1px solid ${ue};
  color: ${w.secondary};
}
`;function uo(e){let t=document.createElement("style");t.textContent=Ur,e.appendChild(t);let o=document.createElement("div");o.className="picker",e.appendChild(o);let n=document.createElement("div");n.className="swatch";let r=document.createElement("div");r.className="hint";function i(a){n.style.background=a;let l=co(a).map(({label:c,value:x})=>{let v=document.createElement("button");v.type="button";let C=document.createElement("span");C.className="k",C.textContent=c;let u=document.createElement("span");return u.className="v",u.textContent=x,v.append(C,u),v.addEventListener("click",g=>{g.stopPropagation(),navigator.clipboard?.writeText(x).then(()=>{r.textContent=`copied ${c}`},()=>{r.textContent="clipboard refused"})}),v});r.textContent="click a row to copy",o.replaceChildren(n,...l,r),o.setAttribute("data-open","")}return{async open(){let a=window.EyeDropper;if(!a){o.replaceChildren(Object.assign(document.createElement("div"),{className:"hint",textContent:"this browser has no eyedropper"})),o.setAttribute("data-open","");return}try{let{sRGBHex:l}=await new a().open();i(l)}catch{}},close(){let a=o.hasAttribute("data-open");return o.removeAttribute("data-open"),a},destroy(){o.remove(),t.remove()}}}var Ut="__align_freeze",Vr=`
[data-align-frozen] *:not([data-align-ignore]):not([data-align-ignore] *) {
  animation-play-state: paused !important;
}
`,Vt=!1,yt=[],wt=[];function po(e){let t=e;for(;t;){if(t instanceof Element&&t.hasAttribute("data-align-ignore"))return!0;let o=t.getRootNode();if(t=o instanceof ShadowRoot?o.host:t.parentNode??null,t===document)return!1}return!1}function vt(){return Vt}function qt(e){if(e!==Vt){if(Vt=e,!e){document.documentElement.removeAttribute("data-align-frozen"),document.getElementById(Ut)?.remove();for(let t of yt)try{t.play()}catch{}for(let t of wt)t.play().catch(()=>{});yt=[],wt=[];return}if(!document.getElementById(Ut)){let t=document.createElement("style");t.id=Ut,t.textContent=Vr,t.setAttribute("data-align-ignore",""),document.head.appendChild(t)}document.documentElement.setAttribute("data-align-frozen",""),yt=[];try{for(let t of document.getAnimations()){if(t.playState!=="running")continue;let o=t.effect?.target??null;po(o)||(t.pause(),yt.push(t))}}catch{}wt=[];for(let t of Array.from(document.querySelectorAll("video")))t.paused||po(t)||(t.pause(),wt.push(t))}}var Jt="__align_xray",qr=`
[data-align-xray] * { outline: 1px solid rgb(128 128 128 / 0.55) !important; }
[data-align-xray] [data-align-ignore],
[data-align-xray] [data-align-ignore] * { outline: none !important; }
`;function Qt(e){let t=document.documentElement;if(!e){t.removeAttribute("data-align-xray"),document.getElementById(Jt)?.remove();return}if(!document.getElementById(Jt)){let o=document.createElement("style");o.id=Jt,o.textContent=qr,o.setAttribute("data-align-ignore",""),document.head.appendChild(o)}t.setAttribute("data-align-xray","")}var Zt="align-ui";function mo(e){try{return localStorage.getItem(e)}catch{return null}}function ho(e,t){try{localStorage.setItem(e,t)}catch{}}function fo(e){let t="/";try{t=location.pathname||"/"}catch{}return`${Zt}:${e}::${t}`}function Jr(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function go(){let e=mo(fo("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(Jr).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function bo(e){ho(fo("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function kt(e){return mo(`${Zt}:${e}`)==="1"}function $t(e,t){ho(`${Zt}:${e}`,t?"1":"0")}var se,X=null,pe=null,$e=null,Ze=null,Re=null,Ie=Zn(),Fe=!1,Ve=kt("grid"),qe=kt("pixels"),ne=null,H=[],St=0,ze=kt("rulers"),Z=[],So=1,xo=!1,Ee=null,je=!1,He=Wn();function Qr(){return Z.map(e=>({...e}))}function Je(e=""){He.push(Qr(),e)}function yo(){return Z.find(e=>e.id===Ee)??null}function Ne(e){Z=e,bo(Z)}var oe=null,ve=null,xe=null,Zr=3,Ue=22;function Co(e,t){return ze?t<Ue&&e>=Ue?"y":e<Ue&&t>=Ue?"x":null:null}function tn(e){return e.ctrlKey||e.metaKey}function To(e,t,o,n){let r=Be(t,o,se),i=e.axis==="x"?t:o,a=Z.filter(c=>c.id!==e.id).map(c=>({axis:c.axis,at:st(c).pos})),l=Mn(i,An(r,e.axis,a),n);e.at=l.at+(e.axis==="x"?scrollX:scrollY),e.caught=l.what}function Mo(e,t,o,n){let r={id:So++,axis:e,at:0,locked:!1,caught:"",pinned:!1};To(r,t,o,n);let i=Z.find(a=>a.axis===r.axis&&Math.abs(a.at-r.at)<.5);return i?(Ee=i.id,i):(Je(),Ne([...Z,r]),Ee=r.id,r)}function Ao(e){e.pinned||(Je(),Ne(Z.filter(t=>t.id!==e.id)),ve?.id===e.id&&(ve=null),oe?.id===e.id&&(oe=null))}function ei(e){let t=se.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function st(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function nn(){return H.length>=2?H[H.length-2]:void 0}function on(){if(H.length<2)return[];let e=[];for(let[t,o]of Lt(H))for(let n of ht(t,o)){if(n.extension||!n.label)continue;let r=hn(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:fn(r)})}return e}function le(e){let t=H[H.length-1],o=ne&&H.some(u=>u.el===ne.el),n=Z.map(st),r=!oe&&ve?ve:null,i=Z.filter(u=>u.locked||u.id===r?.id),a=!r&&o?ne.el:null,l=r??a,c=r?st(r):null,x=[],v=(u,g)=>{for(let y of u)x.push(l&&!g?{...y,faded:!0}:y)},C=u=>!c||u.axis!==c.axis?!1:(u.axis==="x"?[u.x1,u.x2]:[u.y1,u.y2]).some(y=>Math.abs(y-c.pos)<.5);for(let[u,g]of Lt(H))v(ht(u,g),u.el===a||g.el===a);t&&ne&&!o&&!r&&v(ht(t,ne),!0);for(let u of i)for(let g of H)v(Rt(g,[st(u)]),u.id===r?.id||g.el===a);ne&&!o&&!r&&Z.length&&v(Rt(ne,n),!0);for(let u of Ln(i.map(st),{x:innerWidth/2,y:innerHeight/2}))v([u],C(u));X?.update({hover:ne,pinned:H,rulers:ze,hidden:je,grid:Ve&&se.grid?se.grid:null,pixels:qe,guides:Z,liveGuide:oe??ve,activeGuide:Ee,lines:x,...e?{cursor:e}:{}}),$e?.update(H.length,{edit:Ie.armed,rulers:ze,xray:Fe,grid:Ve,pixels:qe,freeze:vt(),type:pe?.showsType()??!1,hide:je,canCopy:H.length>0,canUndo:He.depth()>0,panel:pe?.isOpen()??!1})}function ti(){let e=pe?.asText()??"";if(!e)return;let t=n=>$e?.acknowledge("copy",n),o=navigator.clipboard?.writeText(e);o?o.then(()=>t(!0),()=>t(!1)):t(!1)}function ni(e,t){return e.length===t.length&&e.every((o,n)=>{let r=t[n];return o.id===r.id&&o.axis===r.axis&&o.at===r.at&&o.locked===r.locked&&o.pinned===r.pinned})}function oi(){for(;He.depth()>0&&ni(He.peek(),Z);)He.pop();let e=He.pop();e&&(Ne(e),ve=null,oe=null,xe=null,e.some(t=>t.id===Ee)||(Ee=null))}function ge(e){switch(e){case"rulers":ze=!ze,$t("rulers",ze);break;case"xray":Fe=!Fe,Qt(Fe);break;case"grid":Ve=!Ve,$t("grid",Ve);break;case"pixels":qe=!qe,$t("pixels",qe);break;case"freeze":qt(!vt());break;case"type":pe?.toggleType();break;case"panel":pe?.toggle();break;case"hide":je=!je,pe?.setHidden(je),je&&Ze?.close();break;case"copy":ti();break;case"pick":Ze?.open();break;case"edit":if(Ie.armed){let t=Ie.disarm();$e?.acknowledge("edit",t>=0)}else Ie.arm();Re?.setArmed(Ie.armed),H.length&&le();break;case"undo":oi();break}le()}var Et=null;function Lo(e){if(Et={x:e.clientX,y:e.clientY},oe){xe&&Math.hypot(e.clientX-xe.x,e.clientY-xe.y)>Zr&&(xe=null),!xe&&!oe.pinned&&(To(oe,e.clientX,e.clientY,tn(e)),Ne([...Z])),le({x:e.clientX,y:e.clientY});return}ve=Nt(Z,e.clientX,e.clientY),ne=Be(e.clientX,e.clientY,se),le({x:e.clientX,y:e.clientY})}function No(e){oe&&(xe?(oe.locked=!oe.locked,Ee=oe.id,Ne([...Z])):(Co(e.clientX,e.clientY)||e.clientX<Ue||e.clientY<Ue)&&Ao(oe),xe=null,oe=null,le({x:e.clientX,y:e.clientY}))}function Ct(e){let t=X?.root.host;return t?(e.composedPath?.()??[]).includes(t):!1}function Ro(e){if(e.button!==0||Ct(e))return;let t=Be(e.clientX,e.clientY,se);if(!t)return;let o=Co(e.clientX,e.clientY);if(o){Qe(e),xe=null,oe=Mo(o,e.clientX,e.clientY,tn(e)),le({x:e.clientX,y:e.clientY});return}let n=Nt(Z,e.clientX,e.clientY);if(n){Qe(e),Je(),Ee=n.id,oe=n,xe={x:e.clientX,y:e.clientY},le({x:e.clientX,y:e.clientY});return}Qe(e),$e?.closeHelp(),H=[t],ne=t,pe?.show(t,on(),nn()),Re?.show(t.el),le({x:e.clientX,y:e.clientY})}function Go(e){if(Ct(e))return;let t=Be(e.clientX,e.clientY,se);if(!t)return;Qe(e),$e?.closeHelp();let o=H.findIndex(r=>r.el===t.el);H=o>=0?H.filter((r,i)=>i!==o):[...H,t],ne=t;let n=H[H.length-1];n?pe?.show(n,on(),nn()):pe?.hide(),Re?.show(n?.el??null),le({x:e.clientX,y:e.clientY})}function Bo(e){Ct(e)||Be(e.clientX,e.clientY,se)&&Qe(e)}function Po(e){Ct(e)||Be(e.clientX,e.clientY,se)&&Qe(e)}function Qe(e){e.preventDefault(),e.stopPropagation()}function wo(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var vo=0,ko=0;function Do(){St=requestAnimationFrame(Do);let t=H.filter(l=>l.el.isConnected).map(l=>mt(l.el)),o=ne&&ne.el.isConnected?mt(ne.el):null;if(!(scrollX!==vo||scrollY!==ko||t.length!==H.length||t.some((l,c)=>!wo(l,H[c]))||ne===null!=(o===null)||ne!==null&&o!==null&&!wo(ne,o)))return;vo=scrollX,ko=scrollY,H=t,ne=o;let i=H[H.length-1],a=ri();a!==$o&&($o=a,i?pe?.show(i,on(),nn()):pe?.hide(),Re?.show(i?.el??null)),le()}var $o="";function ri(){let e=H[0];return e?H.map(t=>[t.label,Math.round(t.width*100),Math.round(t.height*100),Math.round((t.left-e.left)*100),Math.round((t.top-e.top)*100)].join(",")).join(";"):""}function Oo(){X?.resize()}function ii(){xo||(xo=!0,Z=go().map(e=>({...e,id:So++}))),!X&&(On(),X=lo(),pe=zn(X.root),$e=_n(X.root,ge),Re=ao(X.root,Ie),Ze=uo(X.root),$e.update(0,{rulers:ze,xray:Fe,grid:Ve,pixels:qe,freeze:vt(),type:!1,panel:!1,hide:!1,edit:!1,canCopy:!1,canUndo:!1}),addEventListener("mousemove",Lo),addEventListener("mousedown",Ro,{capture:!0}),addEventListener("mouseup",No,{capture:!0}),addEventListener("click",Bo,{capture:!0}),addEventListener("auxclick",Po,{capture:!0}),addEventListener("contextmenu",Go,{capture:!0}),addEventListener("resize",Oo),St=requestAnimationFrame(Do),le())}function en(){removeEventListener("mousemove",Lo),removeEventListener("mousedown",Ro,{capture:!0}),removeEventListener("mouseup",No,{capture:!0}),removeEventListener("click",Bo,{capture:!0}),removeEventListener("auxclick",Po,{capture:!0}),removeEventListener("contextmenu",Go,{capture:!0}),removeEventListener("resize",Oo),cancelAnimationFrame(St),St=0,$e?.destroy(),Re?.destroy(),Re=null,Ze?.destroy(),Ze=null,Fe&&(Fe=!1,Qt(!1)),qt(!1),Ie.disarm(),$e=null,pe?.destroy(),pe=null,X?.destroy(),X=null,In(),ne=null,H=[],oe=null,xe=null,ve=null}function ai(e){let t=e.composedPath?.()[0]??e.target;return!t||typeof t!="object"||!("tagName"in t)?!1:t.isContentEditable?!0:t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT"}function Eo(e){if(ei(e))e.preventDefault(),X?en():ii();else if(!ai(e)){if(X&&Et&&(e.key.toLowerCase()===se.guideKeys.vertical||e.key.toLowerCase()===se.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===se.guideKeys.vertical?"x":"y";Mo(t,Et.x,Et.y,tn(e)),le()}else if(X&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(Z.some(t=>!t.pinned)&&Je(),Ne(Z.filter(t=>t.pinned)),ve=null,oe=null,xe=null,Z.some(t=>t.id===Ee)||(Ee=null)):ve&&Ao(ve),le();else if(X&&e.key.startsWith("Arrow")){let t=yo(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;Je(`nudge:${t.id}`);let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",Ne([...Z]),le()}else if(X&&e.key.toLowerCase()==="g"){e.preventDefault(),ge("grid");return}else if(X&&e.key.toLowerCase()==="k"){e.preventDefault(),ge("pixels");return}else if(X&&e.key==="\\"){e.preventDefault(),ge("hide");return}else if(X&&e.key.toLowerCase()==="e"){e.preventDefault(),ge("edit");return}else if(X&&e.key.toLowerCase()==="f"){e.preventDefault(),ge("freeze");return}else if(X&&e.key.toLowerCase()==="x"){e.preventDefault(),ge("xray");return}else if(X&&e.key.toLowerCase()==="p"){e.preventDefault(),ge("pick");return}else if(X&&e.key.toLowerCase()==="t"){e.preventDefault(),ge("type");return}else if(X&&e.key.toLowerCase()==="c"){e.preventDefault(),ge("copy");return}else if(X&&e.key.toLowerCase()==="l"){let t=yo();if(!t)return;e.preventDefault(),Je(),t.pinned=!t.pinned,Ne([...Z]),le()}else if(X&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){if(He.depth()===0)return;e.preventDefault(),ge("undo");return}else if(X&&e.key.toLowerCase()===se.rulerKey){e.preventDefault(),ge("rulers");return}else if(X&&e.key.toLowerCase()===se.panelKey){e.preventDefault(),ge("panel");return}else if(e.key==="Escape"&&X){if(Ze?.close()||$e?.closeHelp())return;H.length?(H=[],pe?.hide(),Re?.show(null),le()):en()}}}function ra(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,se=En(e),Fn(se.theme),addEventListener("keydown",Eo,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{en(),removeEventListener("keydown",Eo,{capture:!0}),delete window.__align})}export{ra as initAlign};
