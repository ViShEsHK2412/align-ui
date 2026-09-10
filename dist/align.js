function le(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function Io(e){return(e.split(",")[0]??"").trim().replace(/^['"]|['"]$/g,"")}function Ho(e){let o={100:"thin",200:"extralight",300:"light",400:"regular",500:"medium",600:"semibold",700:"bold",800:"extrabold",900:"black"}[e.trim()];return o?`${e} ${o}`:e}function lt(e){let t=getComputedStyle(e);return[{label:"family",value:Io(t.fontFamily),px:NaN},{label:"size",value:t.fontSize,px:le(t.fontSize)},{label:"weight",value:Ho(t.fontWeight),px:NaN},{label:"line",value:t.lineHeight,px:le(t.lineHeight)},{label:"tracking",value:t.letterSpacing,px:le(t.letterSpacing)}]}function pn(e){let t="";for(let o of e.childNodes)o.nodeType===3&&(t+=o.nodeValue??"");return t.trim().replace(/\s+/g," ")}function ct(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:le(r)})}return o}function Mt(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function Fo(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function hn(e,t){if(t.length===0)return"";let o=[],n=0;for(let i of Fo(e)){let a=Mt(i,t);a.length?o.push(`${zo(i)} ${a.join(" ")}`):n+=1}if(o.length===0)return n===1?"its one number is not on the scale":`none of its ${n} numbers are on the scale`;let r=n===0?"":n===1?"  \xB7  1 more, not on the scale":`  \xB7  ${n} more, not on the scale`;return o.join("  \xB7  ")+r}function zo(e){return String(Math.round(e*100)/100)}function rn(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(le)}function mn(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),l=a.display.includes("flex")||a.display.includes("grid"),c=n==="x"?a.columnGap:a.rowGap,x=l&&c!=="normal"?le(c):null,[w,S,u,f]=rn(e),[v,C,D,g]=rn(t),E=q=>Number.isFinite(q)?q:0,P=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,z=n==="x"?P?E(S)+E(g):E(C)+E(f):P?E(u)+E(v):E(D)+E(w);return{px:o,cssGap:x,margins:z,siblings:!0}}function fn(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function gn(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}function et(e){let t=e.trim().toLowerCase();return t?t.startsWith("#")||/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(t)?!0:["black","white","transparent","currentcolor"].includes(t):!1}var Me;function an(e){if(Me===void 0&&(Me=document.createElement("canvas").getContext("2d")),!Me)return"";Me.fillStyle="#000000",Me.fillStyle=e;let t=Me.fillStyle;return Me.fillStyle="#ffffff",Me.fillStyle=e,t===Me.fillStyle?String(t):""}function dt(e,t){let o=an(e);return o?t.filter(n=>et(n.value)&&an(n.value)===o).map(n=>n.name).sort():[]}function bn(e){let t=getComputedStyle(e),o=[],n=(r,i)=>{let a=i.trim();!a||a==="transparent"||/rgba?\([^)]*,\s*0\s*\)$/.test(a)||o.push({label:r,value:a})};return n("text",t.color),n("background",t.backgroundColor),o}function Wo(e,t,o){let n=r=>typeof CSS<"u"&&CSS.escape?CSS.escape(r):r.replace(/[^\w-]/g,"\\$&");return t?`#${n(t)}`:o.length?e+o.map(r=>`.${n(r)}`).join(""):e}function tt(e){let t=typeof e.className=="string"?e.className.trim().split(/\s+/).filter(Boolean):[];return Wo(e.tagName.toLowerCase(),e.id,t)}function yn(e){let t=tt(e);if(!/[.#]/.test(t))return 0;try{return document.querySelectorAll(t).length}catch{return 0}}function _o(e){if(!e)return"inline <style>";let t=e.split("?")[0]??e;try{let o=new URL(t,"http://x").pathname;return decodeURI(o).replace(/^\//,"")||t}catch{return t}}var Xo=["width","height","padding","margin","border-width","gap","font-size","line-height","letter-spacing","color","background-color"];function Yo(e){for(let t=0;t<e.length;t+=1){let o=e.item(t);if(Xo.some(n=>o===n||o.startsWith(`${n}-`)))return!0}return!1}function xn(e){let t=[],o=new Set,n=(r,i)=>{for(let a of Array.from(r)){if(a instanceof CSSMediaRule){matchMedia(a.conditionText).matches&&n(a.cssRules,i);continue}if(a instanceof CSSSupportsRule){CSS.supports(a.conditionText)&&n(a.cssRules,i);continue}let l=a.cssRules;if(l&&!(a instanceof CSSStyleRule)){n(l,i);continue}if(!(a instanceof CSSStyleRule))continue;let c=!1;try{c=e.matches(a.selectorText)}catch{continue}if(!c||!Yo(a.style))continue;let x=`${a.selectorText}|${i}`;o.has(x)||(o.add(x),t.push({selector:a.selectorText,file:i}))}};for(let r of Array.from(document.styleSheets)){if(r.ownerNode instanceof Element&&r.ownerNode.hasAttribute("data-align-ignore"))continue;let i;try{i=r.cssRules}catch{continue}n(i,_o(r.href))}return t.reverse()}function sn(e){if(!e||e==="none")return[];let t=e.trim().split(/\s+/),o=[];for(let n of t){if(!n.endsWith("px"))return[];let r=Number.parseFloat(n);if(!Number.isFinite(r))return[];o.push(r)}return o}function ln(e,t,o){let n=0;for(let r=0;r<e.length;r+=1){let i=n+e[r];if(o<i+.5)return r;n=i+t}return-1}function Ko(e,t){let o=t==="rtl";return e.startsWith("vertical")||e.startsWith("sideways")?{inline:"y",inlineReversed:e==="sideways-lr"?!o:o,blockReversed:e==="vertical-rl"||e==="sideways-rl"}:{inline:"x",inlineReversed:o,blockReversed:!1}}function cn(e,t,o,n,r){return r?t-n:o-e}function wn(e){let t=e.parentElement,o=0;for(;t&&getComputedStyle(t).display==="contents";)t=t.parentElement,o+=1;if(!t)return null;let n=getComputedStyle(t),r=getComputedStyle(e),i=n.display,a=[];if(o>0&&a.push({label:"through",value:o===1?"a display: contents parent":`${o} display: contents parents`}),r.position==="absolute"||r.position==="fixed")return a.push({label:"placed by",value:`${r.position}, not by the parent`}),{display:i,rows:a};if(r.float!=="none")return a.push({label:"placed by",value:`float: ${r.float}`}),{display:i,rows:a};let l=i.includes("flex"),c=i.includes("grid");if(!l&&!c)return a.push({label:"flow",value:i}),{display:i,rows:a};let x=dn(n.rowGap==="normal"?"0px":n.rowGap),w=dn(n.columnGap==="normal"?"0px":n.columnGap),S=x===w?x:`row ${x} \xB7 column ${w}`;if(l){let K=n.flexDirection;a.push({label:"direction",value:n.flexWrap==="nowrap"?K:`${K} \xB7 ${n.flexWrap}`}),a.push({label:"justify",value:n.justifyContent}),a.push({label:"align",value:n.alignItems}),a.push({label:"gap",value:S});let p=`${r.flexGrow} ${r.flexShrink} ${r.flexBasis}`;return p!=="0 1 auto"&&a.push({label:"this child",value:`flex: ${p}`}),r.alignSelf!=="auto"&&a.push({label:"align-self",value:r.alignSelf}),{display:i,rows:a}}let u=sn(n.gridTemplateColumns),f=sn(n.gridTemplateRows);u.length&&a.push({label:"columns",value:`${u.length} \xB7 ${u.map(Tt).join(" ")}`}),f.length&&a.push({label:"rows",value:`${f.length} \xB7 ${f.map(Tt).join(" ")}`}),a.push({label:"gap",value:S});let v=t.getBoundingClientRect(),C=e.getBoundingClientRect(),D={left:v.left+le(n.borderLeftWidth)+le(n.paddingLeft),right:v.right-le(n.borderRightWidth)-le(n.paddingRight),top:v.top+le(n.borderTopWidth)+le(n.paddingTop),bottom:v.bottom-le(n.borderBottomWidth)-le(n.paddingBottom)},g=Ko(n.writingMode,n.direction),E=(K,p)=>K==="x"?cn(D.left,D.right,C.left,C.right,p):cn(D.top,D.bottom,C.top,C.bottom,p),P=g.inline==="x"?"y":"x",z=le(n.columnGap==="normal"?"0":n.columnGap),q=le(n.rowGap==="normal"?"0":n.rowGap),ae=ln(u,z,E(g.inline,g.inlineReversed)),ee=ln(f,q,E(P,g.blockReversed)),X=[];return ae>=0&&X.push(`column ${ae+1} of ${u.length}`),ee>=0&&X.push(`row ${ee+1} of ${f.length}`),X.length&&a.push({label:"this child",value:X.join(" \xB7 ")}),{display:i,rows:a}}function dn(e){return e.endsWith("px")?Tt(Number.parseFloat(e)):e}function Tt(e){return String(Math.round(e*100)/100)}var vn=["display","position","width","height","padding","margin","border-width","border-style","border-radius","font-family","font-size","font-weight","font-style","line-height","letter-spacing","text-transform","text-align","color","background-color","border-color","opacity","flex-direction","justify-content","align-items","gap","flex-grow","flex-shrink","flex-basis","align-self","box-shadow","overflow","text-overflow","white-space"];function jo(e,t){let o=[];for(let n of vn){let r=e[n]??"",i=t[n]??"";r!==i&&o.push({prop:n,a:r,b:i})}return o}function un(e){let t=getComputedStyle(e),o={};for(let n of vn)o[n]=t.getPropertyValue(n);return o}function kn(e,t){return jo(un(e),un(t))}var Uo={ignore:"",grid:null,hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"},theme:"auto"};function En(e={}){return{...Uo,...e}}var $n=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function Sn(e){return e.ignore?`${$n}, ${e.ignore}`:$n}function U(e){return String(Math.round(e*100)/100)}function Vo(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function ht(e){let t=e.getBoundingClientRect();return{el:e,label:Vo(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height,scale:We(e)}}function Cn(e,t){let o=(n,r)=>Math.abs(n-r)<.001;return o(e.scale.x,t.scale.x)&&o(e.scale.y,t.scale.y)?e.scale:{x:1,y:1}}function Tn(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function Pe(e,t,o){let n=Sn(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=Tn(r);return r&&r!==document.documentElement?ht(r):null}var ut=e=>parseFloat(e)||0;function At(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[ut(n),ut(r),ut(i),ut(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function qo(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function Jo(e,t){let o=Cn(e,t),n=t.left+t.width/2,r=t.top+t.height/2;return[{x1:e.left,y1:r,x2:t.left,y2:r,label:U((t.left-e.left)/o.x),axis:"x"},{x1:t.right,y1:r,x2:e.right,y2:r,label:U((e.right-t.right)/o.x),axis:"x"},{x1:n,y1:e.top,x2:n,y2:t.top,label:U((t.top-e.top)/o.y),axis:"y"},{x1:n,y1:t.bottom,x2:n,y2:e.bottom,label:U((e.bottom-t.bottom)/o.y),axis:"y"}]}function pt(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function mt(e,t){let o=[],n=Cn(e,t),r=e.left<t.right&&t.left<e.right,i=e.top<t.bottom&&t.top<e.bottom;if(r&&i){let[a,l]=qo(e,t);return Jo(a,l)}if(!r){let[a,l]=e.right<=t.left?[e,t]:[t,e],c=i?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:a.right,y1:c,x2:l.left,y2:c,label:`${U((l.left-a.right)/n.x)}`,axis:"x"}),o.push(...pt(a.right,a.top,a.bottom,c,"x")),o.push(...pt(l.left,l.top,l.bottom,c,"x"))}if(!i){let[a,l]=e.bottom<=t.top?[e,t]:[t,e],c=r?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:c,y1:a.bottom,x2:c,y2:l.top,label:`${U((l.top-a.bottom)/n.y)}`,axis:"y"}),o.push(...pt(a.bottom,a.left,a.right,c,"y")),o.push(...pt(l.top,l.left,l.right,c,"y"))}return o}function Qo(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function Lt(e){let t=Qo(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var Zo=5,er=8;function nt(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function Nt(e,t,o){let n=null,r=Zo;for(let i of e){let a=Math.abs(nt(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function Mn(e,t,o){if(o)return{at:e,what:""};let n=null,r=er;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function An(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function Rt(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,l=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:l,y2:i,label:U(r.gap/e.scale.x),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,l=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:l,label:U(r.gap/e.scale.y),axis:"y"})}}return o}function Ln(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],l=r[i],c=l-a;c<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:l,y2:t.y,label:U(c),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:l,label:U(c),axis:"y"}))}}return o}var Le=3;function tr(e,t){return e.x<t.x+t.w+Le&&t.x<e.x+e.w+Le&&e.y<t.y+t.h+Le&&t.y<e.y+e.h+Le}function Nn(e,t,o=12){let n=(a,l)=>Math.min(Math.max(a,o),t.w-l-o),r=(a,l)=>Math.min(Math.max(a,o),t.h-l-o),i=[];for(let a of e){let l={...a,x:n(a.x,a.w),y:r(a.y,a.h)},c=!1;for(let x=0;x<16;x++){let w=i.find(u=>tr(u,l));if(!w)break;let S=l.axis==="x"?l.y:l.x;if(l.axis==="x"?l.y=r(c?w.y+w.h+Le:w.y-l.h-Le,l.h):l.x=n(c?w.x-l.w-Le:w.x+w.w+Le,l.w),(l.axis==="x"?l.y:l.x)===S){if(c)break;c=!0}}i.push(l)}return i}function Rn(e,t){let{columns:o,gutter:n,margin:r}=e;if(o<=0)return[];let i=e.maxWidth>0?Math.min(e.maxWidth,t):t,a=Math.max(0,(t-i)/2),c=(Math.max(0,i-r*2)-n*(o-1))/o;if(c<=0)return[];let x=[];for(let w=0;w<o;w+=1)x.push({left:a+r+w*(c+n),width:c});return x}function Gn(e,t){return e*t>=8?e:0}function nr(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(l=>parseFloat(l)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function We(e){let t=1,o=1;for(let n=e;n;n=Tn(n)){let r=nr(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var xe=(e,t)=>({light:e,dark:t}),Gt={accent:xe("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:xe("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:xe("oklch(1 0 0)","oklch(0.264 0 0)"),fg:xe("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:xe("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:xe("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:xe("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:xe("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)"),pixelLine:xe("oklch(0.205 0 0 / 0.14)","oklch(0.97 0 0 / 0.14)")};function Pn(e){return`light-dark(${e.light}, ${e.dark})`}var me=Pn(xe("#fafafa","#1a1a1a"));function _e(e,t=e){return Pn(xe(`rgb(0 0 0 / ${t})`,`rgb(255 255 255 / ${e})`))}var Bn=[0,.07,.08,.1,.12,.15,.2];function H(e){let t=Bn[Math.max(0,Math.min(Bn.length-1,e))];return t===0?me:_e(t)}var y={primary:_e(.9),secondary:_e(.6),tertiary:_e(.46,.55),disabled:_e(.22,.26)},pe=_e(.12),Ae="0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)",Dn="0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)",_=22,Ne=36,O={tight:4,base:8,roomy:12,edge:16},I={exit:"160ms cubic-bezier(0.3, 0, 1, 1)",ui:"160ms cubic-bezier(0.2, 0, 0, 1)"},or='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',L={title:13,body:12,tag:11,stack:or},V={regular:400,medium:500,semibold:600},Bt="__align_font",rr="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function On(){if(document.getElementById(Bt))return;let e=document.createElement("link");e.id=Bt,e.rel="stylesheet",e.href=rr,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function In(){document.getElementById(Bt)?.remove()}function Hn(e){let t=[`${V.medium} ${L.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function Dt(e){let t={};for(let o of Object.keys(Gt))t[o]=e?Gt[o].dark:Gt[o].light;return t}var Pt=null;function Fn(e){Pt=e==="auto"?null:e}function Ot(){if(Pt)return Pt==="dark";let e=document.documentElement,t=getComputedStyle(e).colorScheme;if(/dark/.test(t)&&!/light/.test(t))return!0;if(/light/.test(t)&&!/dark/.test(t))return!1;for(let o of[document.body,e]){if(!o)continue;let n=ir(getComputedStyle(o).backgroundColor);if(n!==null)return n<.5}return matchMedia("(prefers-color-scheme: dark)").matches}function ir(e){let t=/^rgba?\(([^)]+)\)$/.exec(e.trim());if(!t)return null;let o=t[1].split(/[\s,/]+/).filter(Boolean).map(Number),[n,r,i,a=1]=o;return n===void 0||r===void 0||i===void 0||a<.5?null:(.2126*n+.7152*r+.0722*i)/255}function Xe(e,t){return e.replace(/\)$/,` / ${t})`)}var ar=`
`,Ee=16,sr=`
.dock {
  /* No color-scheme here: the overlay sets it inline on the shadow host, from
     what the page actually looks like rather than what the machine prefers, and
     it inherits down. Declaring 'light dark' again would undo that and hand
     light-dark() back to the media query. */
  position: fixed; left: ${Ee}px; top: 0;
  /* Clamped to the window. A narrow viewport is not an edge case for this
     tool, it is the case it exists for: you make the window 375px wide
     precisely to check a mobile layout, and a readout that hangs off the
     screen there is useless exactly when you reached for it. */
  width: min(340px, calc(100vw - ${Ee*2}px));
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

  --fg: ${y.primary};
  --muted: ${y.secondary};
  --border: ${pe};
}
.panel {
  padding: 10px; border-radius: 0;
  /* Five sections now \u2014 box, tokens, styled by, matches, colour \u2014 and on a
     laptop that is taller than the window. place() clamps the position but
     cannot rescue a panel taller than the screen, so it scrolls instead. */
  max-height: calc(100vh - ${Ee*2}px);
  overflow-y: auto; overscroll-behavior: contain;
  font-size: ${L.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${me};

  box-shadow: ${Ae};

  /* The one animation in the tool: a panel that must land exactly, so the
     Fluid spring.moderate tier at 160ms, critically damped. */
  opacity: 0;
  transform: translateY(4px) scale(0.98);
  transform-origin: bottom left;
  transition: opacity ${I.exit}, transform ${I.exit},
              box-shadow ${I.exit};
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
  transition: opacity ${I.ui}, transform ${I.ui},
              box-shadow ${I.ui};
}
@media (prefers-reduced-motion: reduce) {
  /* Fewer and gentler, not none: the fade aids comprehension, the travel does not. */
  .panel { transform: none; transition: opacity 120ms linear; }
}

header {
  /* Stays put while the body scrolls: it is also the drag handle, and a handle
     you have to scroll back up to find is not a handle. */
  position: sticky; top: -10px; z-index: 1;
  background: ${me};
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] .panel { box-shadow: ${Dn}; }
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${L.title}px; font-weight: ${V.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${L.body}px; font-weight: ${V.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${L.tag}px; font-weight: ${V.medium};
  margin-left: 4px;
  color: ${y.primary};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${L.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${H(1)}; }

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
  padding: ${O.base}px;
}
.region[data-level="1"] { background: ${H(1)}; }
.region[data-level="2"] { background: ${H(2)}; }
.region[data-level="3"] { background: ${H(3)}; }
.content { background: ${H(4)}; }

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
  font-size: ${L.tag}px; font-weight: ${V.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${V.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${V.regular}; }
.row { display: flex; align-items: center; gap: ${O.tight}px; margin: ${O.tight}px 0; }
.row > .edge { flex: 0 0 20px; }
.row > .fill { flex: 1 1 auto; min-width: 0; }

/* Type and tokens sit under the box, in the same muted register as the band
   labels \u2014 they annotate the measurement rather than competing with it. */
.readout {
  user-select: text;
  margin-top: ${O.base}px; padding-top: ${O.base}px;
  border-top: 1px solid var(--border);
}
.readout-tag { position: static; margin-bottom: ${O.tight}px; }
/* One grid for the whole section rather than one per row, so every key in a
   section shares a column and the column sizes to the longest key in it. A
   fixed 62px was right until a diff started printing 'background-color', which
   it broke across two lines mid-word. The 62px floor keeps the rhythm the
   other sections already had. */
.readout-rows {
  display: grid; grid-template-columns: minmax(62px, max-content) 1fr;
  gap: 0 ${O.base}px; align-items: baseline;
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
  border-radius: 0; padding: ${O.roomy}px ${O.base}px;
  text-align: center; font-weight: ${V.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,ot=Ee,De=-1,Ye=!1;function zn(e){let t=document.createElement("style");t.textContent=sr,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);let r=!1;function i(g,E){let P=document.createElement("div");P.className="readout";let z=document.createElement("div");z.className="tag readout-tag",z.textContent=g,P.appendChild(z);let q=document.createElement("div");q.className="readout-rows",P.appendChild(q);for(let[ae,ee]of E){let X=document.createElement("div");X.className="readout-row";let K=document.createElement("span");K.className="readout-key",K.textContent=ae;let p=document.createElement("span");p.className="readout-value",p.textContent=ee,X.append(K,p),q.appendChild(X)}return P}e.appendChild(o);let a=(g,E)=>Math.min(Math.max(g,Ee),Math.max(Ee,E-Ee));function l(){let g=o.offsetHeight||300;De<0&&(De=Math.max(Ee,innerHeight-g-Ee)),ot=a(ot,innerWidth-o.offsetWidth),De=a(De,innerHeight-g),o.style.transform=`translate(${ot-Ee}px, ${De}px)`}let c=null;function x(g){g.button===0&&(g.preventDefault(),g.stopPropagation(),c={x:g.clientX,y:g.clientY,dx:ot,dy:De},o.setAttribute("data-dragging",""),g.currentTarget.setPointerCapture(g.pointerId))}function w(g){c&&(ot=c.dx+(g.clientX-c.x),De=c.dy+(g.clientY-c.y),l())}function S(){c=null,o.removeAttribute("data-dragging")}addEventListener("resize",l);let u=null,f=[],v;function C(g){let E=document.createElement("div");return E.className="edge",E.textContent=g===0?"0":U(g),g===0&&E.setAttribute("data-zero",""),E}function D(g,E,P,z){let[q,ae,ee,X]=P,K=document.createElement("div");K.className="region",K.setAttribute("data-level",String(E));let p=document.createElement("span");p.className="tag",p.textContent=g;let A=document.createElement("div");A.className="row";let k=document.createElement("div");k.className="fill",k.appendChild(z),A.append(C(X),k,C(ae));let s=document.createElement("div");return s.className="head",s.append(p,C(q)),K.append(s,A,C(ee)),K}return{show(g,E=[],P){f=E,v=P;let z=At(g.el),[q,ae,ee,X]=z.border,[K,p,A,k]=z.padding,s=We(g.el),h=g.width/s.x,d=g.height/s.y,$=Math.abs(s.x-1)>.001||Math.abs(s.y-1)>.001,T=document.createElement("header"),N=document.createElement("span");N.className="name",N.textContent=g.label;let G=document.createElement("span");G.className="size",G.textContent=`${U(h)} \xD7 ${U(d)}`;let j=document.createElement("button");if(j.className="close",j.textContent="\xD7",j.title="close (B brings it back)",j.addEventListener("pointerdown",B=>B.stopPropagation()),j.addEventListener("click",B=>{B.stopPropagation(),Ye=!0,o.removeAttribute("data-open")}),T.append(N,G),$){let B=document.createElement("span");B.className="scale",B.textContent=`\xD7${U(s.x)}`,B.title=`renders at ${U(g.width)} \xD7 ${U(g.height)}`,T.appendChild(B)}T.appendChild(j),T.addEventListener("pointerdown",x),T.addEventListener("pointermove",w),T.addEventListener("pointerup",S),T.addEventListener("pointercancel",S);let J=document.createElement("div");J.className="content",J.textContent=`${U(h-X-ae-k-p)} \xD7 ${U(d-q-ee-K-A)}`,J.title=J.textContent;let b=[T,D("margin",1,z.margin,D("border",2,z.border,D("padding",3,z.padding,J)))];if(r){let B=pn(g.el),m=lt(g.el);b.push(m.length&&B?i("type",m.map(M=>[M.label,M.value])):i("type",[["","nothing of its own to set type on"]]))}if(P&&P.el!==g.el&&P.el.isConnected){let B=kn(P.el,g.el).map(Q=>[Q.prop,`${Q.a||"\u2014"} \u2192 ${Q.b||"\u2014"}`]),m=B.slice(0,10);B.length>m.length&&m.push(["",`and ${B.length-m.length} more`]);let M=P.label===g.label?"the one locked before":P.label;b.push(i(`differs from ${M}`,m.length?m:[["","nothing in the properties it compares"]]))}let te=wn(g.el);if(te&&te.rows.length&&b.push(i(`laid out by ${te.display}`,te.rows.map(B=>[B.label,B.value]))),E.length){let B=E.map(M=>[U(M.px),M.detail]),m=gn(E.map(M=>M.px));m&&B.push(["",m]),b.push(i("gaps",B))}let F=ct(g.el),ye=hn([h,d,...z.margin,...z.border,...z.padding,...r?lt(g.el).map(B=>B.px):[]],F);ye&&b.push(i("tokens",[["",ye]]));let re=xn(g.el);re.length&&b.push(i("styled by",re.slice(0,4).map(B=>[B.selector,B.file])));let ne=yn(g.el);ne>1&&b.push(i("matches",[["",`${ne} elements share ${tt(g.el)}`]]));let ue=F.filter(B=>et(B.value));if(ue.length){let B=bn(g.el).map(({label:m,value:M})=>{let Q=dt(M,ue);return[m,Q.length?`${M}  ${Q.join(" ")}`:`${M}  \u2014`]});B.length&&b.push(i("colour",B))}n.replaceChildren(...b),u=g,l(),!Ye&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},showsType:()=>r,isOpen:()=>!Ye&&u!==null,toggleType(){r=!r,u&&this.show(u,f,v)},asText(){if(!u)return"";let g=At(u.el),E=We(u.el),P=u.width/E.x,z=u.height/E.y,q=ee=>ee.map(X=>U(X)).join(" "),ae=[`${u.label}  ${U(P)} \xD7 ${U(z)}`,`margin   ${q(g.margin)}`,`border   ${q(g.border)}`,`padding  ${q(g.padding)}`];if(r)for(let ee of lt(u.el))ae.push(`${ee.label.padEnd(8)} ${ee.value}`);return ae.join(ar)},hide(){u=null,o.removeAttribute("data-open")},setHidden(g){o.toggleAttribute("data-away",g)},toggle(){u&&(Ye=!Ye,Ye?o.removeAttribute("data-open"):(l(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",l),o.remove(),t.remove()}}}function Wn(e=20,t=1e3){let o=[];return{push(n,r,i=Date.now()){let a=o[o.length-1];if(a&&r!==""&&a.tag===r&&i-a.at<=t){a.at=i;return}o.push({state:n,tag:r,at:i}),o.length>e&&o.shift()},pop(){return o.pop()?.state??null},peek(){return o[o.length-1]?.state??null},depth(){return o.length},clear(){o.length=0}}}var lr="0 0 24 24";var R=e=>({path:e}),Re=(e,t,o,n,r)=>({rect:[e,t,o,n,r]}),cr={rulers:[R("M2 8V4"),R("M22 8V4"),R("M22 6H2"),Re(2,12,20,8,2),R("M6 15v-3"),R("M10 15v-3"),R("M14 15v-3"),R("M18 15v-3")],xray:[R("M3 7V5a2 2 0 0 1 2-2h2"),R("M17 3h2a2 2 0 0 1 2 2v2"),R("M21 17v2a2 2 0 0 1-2 2h-2"),R("M7 21H5a2 2 0 0 1-2-2v-2")],grid:[Re(3,3,18,18,2),R("M9 3v18"),R("M15 3v18")],pixels:[Re(3,3,18,18,2),R("M3 9h18"),R("M3 15h18"),R("M9 3v18"),R("M15 3v18")],type:[R("M12 4v16"),R("M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"),R("M9 20h6")],panel:[Re(3,3,18,18,2),Re(8,8,8,8,1)],freeze:[Re(14,3,5,18,1),Re(5,3,5,18,1)],copy:[Re(8,8,14,14,2),R("M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2")],pick:[R("m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12"),R("m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z"),R("m2 22 .414-.414")],hide:[R("M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"),R("M14.084 14.158a3 3 0 0 1-4.242-4.242"),R("M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"),R("m2 2 20 20")],undo:[R("M9 14 4 9l5-5"),R("M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11")],edit:[R("M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"),R("m15 5 4 4")],arrowUp:[R("m5 12 7-7 7 7"),R("M12 19V5")],arrowDown:[R("M12 5v14"),R("m19 12-7 7-7-7")],link:[R("M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"),R("M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71")],check:[R("M20 6 9 17l-5-5")],cross:[R("M18 6 6 18"),R("m6 6 12 12")]},It="http://www.w3.org/2000/svg";function Se(e,t=16){let o=document.createElementNS(It,"svg");o.setAttribute("viewBox",lr),o.setAttribute("width",String(t)),o.setAttribute("height",String(t)),o.setAttribute("fill","none"),o.setAttribute("stroke","currentColor"),o.setAttribute("stroke-width","2"),o.setAttribute("stroke-linecap","round"),o.setAttribute("stroke-linejoin","round"),o.setAttribute("aria-hidden","true");for(let n of cr[e])if("rect"in n){let[r,i,a,l,c]=n.rect,x=document.createElementNS(It,"rect");x.setAttribute("x",String(r)),x.setAttribute("y",String(i)),x.setAttribute("width",String(a)),x.setAttribute("height",String(l)),x.setAttribute("rx",String(c)),o.appendChild(x)}else{let r=document.createElementNS(It,"path");r.setAttribute("d",n.path),o.appendChild(r)}return o}var dr=[{title:"Pointing at things",rows:[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure whatever is under the cursor"],["Click","lock an element, so it keeps measuring after the pointer leaves"],["Right-click","add another to the locked set, or drop one from it. Two locked also gets you a diff"],["Drag the panel header","move the box model out of your way"],["Esc","clear the locks, then close the tool"]]},{title:"Guides",rows:[["Drag from a rule","pull out a guide; drag it back into the rule to throw it away"],["V  /  H","drop a vertical or horizontal guide at the cursor"],["Hover a guide","its distance to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the guide you last touched. Shift for 10px"],["L","pin a guide, so it cannot be moved or deleted by accident"],["Ctrl/Cmd while placing","ignore snapping"],["Del","remove the guide under the cursor. Shift+Del for all of them"]]}],ge=O.edge,Ht=24,ur=900,rt=Ne,it=O.base,pr=`
.flag {
  position: fixed; top: ${ge}px; right: ${ge}px;
  display: flex; align-items: center; gap: 8px;
  transition: top ${I.ui};
  padding: ${(Ne-Ht)/2}px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${L.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${L.tag}px; font-weight: ${V.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${y.primary};
  background: ${me};
  box-shadow: ${Ae};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
/* No negative tracking: it is 11px, and tightening is what large text wants.
   Small text reads better at zero or a hair positive. */
.flag .name { letter-spacing: 0; }
/* The rulers draw a gutter along the top edge, and the badge sits in it. Step
   down out of the way rather than covering the ticks the rulers exist to show. */
.flag[data-rulers] { top: ${ge+_}px; }
.help[data-rulers] { top: ${ge+_+rt+it}px; }
.flag:hover { background: ${H(1)}; }
.flag .count { color: ${y.secondary}; }

/* A layers bar, not a palette. Switches, then the one control that changes the
   page, then the things that happen once. */
.tools { display: flex; align-items: center; gap: 2px; }
.sep {
  width: 1px; align-self: stretch; margin: 0 4px;
  background: ${pe};
}
.tool {
  width: ${Ht}px; height: ${Ht}px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; cursor: pointer;
  font: inherit; font-size: ${L.tag}px; font-weight: ${V.medium};
  color: ${y.tertiary};
}
/* Both glyphs occupy the same cell so one can cross-fade into the other; a
   swap would jump, and the point is to be noticed without being a movement. */
.tool > svg { grid-area: 1 / 1; transition: opacity ${I.ui}; }
.tool > .ack { opacity: 0; }
.tool[data-ack] > .ack { opacity: 1; }
.tool[data-ack] > .glyph { opacity: 0; }
.tool:hover { background: ${H(2)}; color: ${y.primary}; }
/* On the press, not on the release. Waiting for the click to acknowledge a
   button is the difference between a control that answers and one that lags,
   and it costs one rule. */
.tool:active { background: ${H(4)}; color: ${y.primary}; }
.tool:focus-visible { outline: 1px solid ${y.primary}; outline-offset: -1px; }
/* On is the film, not a colour: the three hues each already mean something on
   the canvas, and a fourth here would say nothing. */
.tool[data-on] { background: ${H(4)}; color: ${y.primary}; }
/*
 * Armed reads differently from on, deliberately. Every other toggle draws
 * something over the page; this one lets the page be rewritten, and a tool that
 * can do that while looking exactly like one that cannot is the problem the
 * arming design exists to avoid. It inverts rather than taking a hue: red
 * already means a measurement here, and a second meaning for it would cost
 * more than the emphasis is worth.
 */
.tool[data-tool='edit'][data-on] {
  background: ${y.primary};
  color: ${me};
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
  position: fixed; top: ${ge+rt+it}px; right: ${ge}px;
  /* 368 plus two insets is 400, so this was the first thing to hang off the
     left edge of a phone-width window. */
  /* The padding is in the subtraction because these boxes are content-box:
     without it the clamp lets the panel sit flush against the far edge with
     no inset at all, which reads as broken rather than as tight. */
  width: min(368px, calc(100vw - ${ge*2+O.base*2}px));
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${ge*2+rt+it}px); overflow-y: auto;
  padding: ${O.base}px; border-radius: 0;
  user-select: none;
  font-family: ${L.stack};
  font-synthesis: none;
  font-size: ${L.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${y.primary};
  background: ${me};
  box-shadow: ${Ae};
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
  transition: opacity ${I.ui}, transform ${I.ui}, visibility 0s linear 160ms;
}
.help[data-open] {
  opacity: 1; visibility: visible; pointer-events: auto;
  transform: none;
  transition: opacity ${I.ui}, transform ${I.ui}, visibility 0s;
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
  align-items: baseline; gap: ${O.tight}px ${O.base}px; margin: 0;
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
  color: ${y.tertiary}; line-height: 0;
}
.help h4 {
  grid-column: 1 / -1; margin: 10px 0 2px;
  font-size: ${L.tag}px; font-weight: ${V.semibold};
  color: ${y.tertiary};
}
.help h4:first-child { margin-top: 0; }
.help kbd {
  display: inline-block; padding: 3px 5px;
  font: inherit; font-weight: ${V.medium};
  border: 1px solid ${pe};
  background: ${H(2)};
}
/* These run to three lines, and a one-word last line reads as a mistake. */
.help dd { margin: 0; color: ${y.secondary}; text-wrap: pretty; }
`,Ft=[{name:"rulers",label:"Rulers",key:"R",toggle:!0,what:"a scale down the top and left edges, in page pixels \u2014 and the gutters you drag guides out of"},{name:"xray",label:"X-ray",key:"X",toggle:!0,what:"outline every element at once, to see the boxes a layout is really made of"},{name:"grid",label:"Column grid",key:"G",toggle:!0,what:"the grid your design is built on, columns filled and gutters left empty. Needs one configured"},{name:"pixels",label:"Pixel grid",key:"K",toggle:!0,what:"a ten-pixel lattice over the page, to read an offset off without measuring it"},{name:"type",label:"Type",key:"T",toggle:!0,what:"add size, weight, line height and tracking to the panel, each checked against your scale"},{name:"panel",label:"Box model",key:"B",toggle:!0,what:"the readout itself \u2014 margins, borders, padding, what places the element, what styles it"},{name:"hide",label:"Hide",key:"\\",toggle:!0,what:"everything drawn, out of the way for a moment. Your locks, guides and layers all survive it"},{name:"freeze",label:"Freeze",key:"F",toggle:!0,what:"hold every animation and transition where it stands, so a moving thing can be measured"},{name:"copy",label:"Copy",key:"C",toggle:!1,what:"put everything in the panel on the clipboard as text"},{name:"pick",label:"Colour",key:"P",toggle:!1,what:"sample a colour from anywhere on screen and match it against your palette"},{name:"edit",label:"Edit",key:"E",toggle:!0,what:"let the panel change the page. Off until you say so, shown while it is on, and everything goes back when you turn it off"},{name:"undo",label:"Undo",key:"Ctrl/Cmd + Z",toggle:!1,what:"step back through the guides \u2014 a whole run of nudges counts as one"}];function _n(e,t){let o=document.createElement("style");o.textContent=pr,e.appendChild(o);let n=document.createElement("div");n.className="flag";let r=document.createElement("span");r.className="name",r.textContent="Align";let i=document.createElement("span");i.className="count";let a=new Map,l=new Map,c=document.createElement("div");c.className="tools";for(let f of Ft){if(f.name==="freeze"||f.name==="copy"){let D=document.createElement("span");D.className="sep",c.appendChild(D)}let v=document.createElement("button");v.type="button",v.className="tool",v.dataset.tool=f.name;let C=Se(f.name);C.classList.add("glyph"),v.appendChild(C),v.setAttribute("aria-label",f.label),v.title=`${f.label}  \xB7  ${f.key}
${f.what}`,f.toggle||v.setAttribute("data-once",""),v.addEventListener("click",D=>{D.stopPropagation(),t(f.name)}),a.set(f.name,v),c.appendChild(v)}n.append(r,c,i);let x=document.createElement("div");x.className="help";let w=document.createElement("dl");function S(f){let v=document.createElement("h4");v.textContent=f,w.appendChild(v)}function u(f,v,C){let D=document.createElement("span");D.className="glyph",C&&D.appendChild(Se(C,14));let g=document.createElement("dt"),E=document.createElement("kbd");E.textContent=f,g.appendChild(E);let P=document.createElement("dd");P.textContent=v,w.append(D,g,P)}S("The bar, left to right");for(let f of Ft)u(f.key,`${f.label} \u2014 ${f.what}`,f.name);for(let f of dr){S(f.title);for(let[v,C]of f.rows)u(v,C)}return x.appendChild(w),n.addEventListener("click",f=>{f.stopPropagation(),x.toggleAttribute("data-open")}),e.append(n,x),{acknowledge(f,v){let C=a.get(f);if(!C)return;clearTimeout(l.get(f)),C.querySelector(".ack")?.remove();let D=Se(v?"check":"cross");D.classList.add("ack"),C.appendChild(D),requestAnimationFrame(()=>C.setAttribute("data-ack",v?"yes":"no")),l.set(f,setTimeout(()=>{C.removeAttribute("data-ack"),setTimeout(()=>C.querySelector(".ack")?.remove(),200)},ur))},update(f,v){i.textContent=f>0?`${f} locked`:"";let C=v.rulers&&!v.hide;n.toggleAttribute("data-rulers",C),x.toggleAttribute("data-rulers",C);for(let E of Ft)E.toggle&&a.get(E.name)?.toggleAttribute("data-on",v[E.name]===!0);let D=a.get("copy");D&&(D.disabled=!v.canCopy);let g=a.get("undo");g&&(g.disabled=!v.canUndo)},closeHelp(){let f=x.hasAttribute("data-open");return x.removeAttribute("data-open"),f},destroy(){for(let f of l.values())clearTimeout(f);n.remove(),x.remove(),o.remove()}}}function Xn(e,t=0,o=0){return Math.min(100,Math.max(...[e,t,o].map(n=>{let[r,i="0"]=String(n).toLowerCase().split("e");return Math.max(0,(r.split(".")[1]?.length??0)-Number(i))})))}function zt(e,t,o,n){let r=o??-1/0,i=n??1/0,a=Math.max(r,Math.min(i,e));if(a===r||a===i||!Number.isFinite(t)||t<=0)return a;let l=o??0,c=l+Math.round((a-l)/t)*t;return Math.max(r,Math.min(i,Number(c.toPrecision(14))))}var hr=.03125;function mr(e,t,o){let n=(e-t)/(o-t),r=Math.round(n*10)/10;return Math.abs(n-r)<=hr?t+r*(o-t):e}var fr=32,gr=8,br=200;function Yn(e,t){let o=Math.max(0,e-fr);return t*gr*Math.sqrt(Math.min(o/br,1))}function ft(e,t,o){return o===t?0:(e-t)/(o-t)*100}function Kn(e,t,o){let n=Math.max(0,Math.min(1,e));return t+n*(o-t)}function yr(e,t,o,n,r,i=!1){if(e==="Home")return o;if(e==="End")return n;let a=["ArrowRight","ArrowUp","PageUp"].includes(e)?1:["ArrowLeft","ArrowDown","PageDown"].includes(e)?-1:0;if(!a)return;if(!(r>0)||n<=o)return o;let l=e.startsWith("Page")||i?10:1,c=(t-o)/r,x=o+(a>0?Math.floor(c+1e-9)+l:Math.ceil(c-1e-9)-l)*r;return Math.max(o,Math.min(n,Number(x.toPrecision(14))))}function xr(e,t,o){let n=(t-e)/o;return n<=10&&Number.isFinite(n)&&n>1?Array.from({length:Math.round(n)-1},(r,i)=>(i+1)*o/(t-e)*100):Array.from({length:9},(r,i)=>(i+1)*10)}function jn(e,t,o=0,n=0){let r=Xn(t,o,n),i=Math.max(r,Math.min(4,Xn(e)));return!Number.isFinite(t)||t<=0?i:zt(e,t,o,n)===e?r:i}function wr(e,t,o,n){return(o-t)/n<=10?Math.max(t,Math.min(o,t+Math.round((e-t)/n)*n)):mr(e,t,o)}var vr={stiffness:300,damping:25,mass:.8},kr={stiffness:220,damping:22,mass:1};function Un(e,t,o,n,r){let i=(-r.stiffness*(e-o)-r.damping*t)/r.mass,a=t+i*n;return{x:e+a*n,v:a}}function Vn(e,t,o,n=.01){return Math.abs(e-o)<n&&Math.abs(t)<n}var $r=0,Er=.5,Sr=.9,Cr=.1,Tr=3,Mr=800,qn=8,gt=3,Ar=20,Qn=10,Wt=12,Lr=`
.sl {
  position: relative;
  height: ${Ne}px;
  overflow: hidden;
  background: ${H(1)};
  border-radius: 0;
  cursor: pointer;
  user-select: none;
  touch-action: none;
}
.sl:focus-visible { outline: 2px solid ${y.secondary}; outline-offset: -2px; }

/* Behind everything, and scaled rather than resized: a width change is layout,
   a transform is not, and this moves on every pointer event of a drag. */
.sl-fill {
  position: absolute; inset: 0;
  transform-origin: left center;
  transform: scaleX(0);
  background: ${H(3)};
  transition: background ${I.ui};
  pointer-events: none;
}
.sl[data-awake] .sl-fill { background: ${H(5)}; }

.sl-marks { position: absolute; inset: 0; pointer-events: none; }
.sl-mark {
  position: absolute; top: 50%;
  width: 1px; height: 8px;
  transform: translate(-50%, -50%);
  background: transparent;
  transition: background ${I.ui};
}
.sl[data-awake] .sl-mark { background: ${pe}; }

.sl-handle {
  position: absolute; top: 50%; left: 0;
  width: ${gt}px; height: ${Ar}px;
  background: ${y.primary};
  pointer-events: none;
  opacity: ${$r};
  /* Two transitions, two jobs: opacity and the squash are eased, the position
     is not \u2014 it is written every frame and must not lag the pointer. */
  transition: opacity ${I.ui}, scale ${I.ui};
  scale: 0.25 1;
}
.sl[data-awake] .sl-handle { opacity: ${Er}; scale: 1 1; }
.sl[data-dragging] .sl-handle { opacity: ${Sr}; }
.sl[data-dodge] .sl-handle { opacity: ${Cr}; scale: 1 0.75; }

.sl-label, .sl-value {
  position: absolute; top: 50%;
  transform: translateY(-50%);
  font-size: ${L.body}px; font-weight: ${V.medium};
  line-height: 1;
  white-space: nowrap;
  transition: color ${I.ui};
}
.sl-label { left: ${Qn}px; color: ${y.secondary}; pointer-events: none; }
.sl-value {
  right: ${Wt}px;
  color: ${y.secondary};
  /* Inter has tabular figures, so the number stops shifting as it changes
     without loading a second face for it. */
  font-variant-numeric: tabular-nums;
  pointer-events: auto;
  border-bottom: 1px solid transparent;
  padding-bottom: 1px;
}
.sl[data-awake] .sl-value { color: ${y.primary}; }
/* Only after the hover delay: the underline is the promise that a click here
   edits rather than seeks, and it must not appear during a drag. */
.sl-value[data-editable] { border-bottom-color: ${y.secondary}; cursor: text; }

.sl-input {
  position: absolute; right: ${Wt}px; top: 50%;
  transform: translateY(-50%);
  width: 5ch;
  padding: 0 0 1px; border: 0;
  border-bottom: 1px solid ${y.secondary};
  background: none; outline: none;
  text-align: right;
  font: inherit;
  font-size: ${L.body}px; font-weight: ${V.medium};
  font-variant-numeric: tabular-nums;
  color: ${y.primary};
}
`,Jn="align-slider";function Nr(e){if(e.querySelector(`#${Jn}`))return;let t=document.createElement("style");t.id=Jn,t.textContent=Lr,e.appendChild(t)}function bt(e,t){Nr(e);let o=t.min??0,n=t.max??1,r=t.step??.01,i=t.value,a=document.createElement("div");a.className="sl",a.tabIndex=0,a.setAttribute("role","slider"),a.setAttribute("aria-label",t.label),a.setAttribute("aria-valuemin",String(o)),a.setAttribute("aria-valuemax",String(n));let l=document.createElement("div");l.className="sl-fill";let c=document.createElement("div");c.className="sl-marks";for(let m of xr(o,n,r)){let M=document.createElement("div");M.className="sl-mark",M.style.left=`${m}%`,c.appendChild(M)}let x=document.createElement("div");x.className="sl-handle";let w=document.createElement("span");w.className="sl-label",w.textContent=t.label;let S=document.createElement("span");S.className="sl-value",a.append(c,l,x,w,S);let u=ft(i,o,n),f=0,v=null,C=0,D=0;function g(){return a.offsetWidth}function E(){l.style.transform=`scaleX(${u/100})`;let m=g(),M=u/100*m,Q=Math.max(gt,Math.min(m-gt,M))-gt/2;x.style.transform=`translate(${Q}px, -50%)`;let se=!1;if(m>0){let ke=Qn+w.offsetWidth+qn,$e=m-Wt-S.offsetWidth-qn;se=M<ke||M>$e}a.toggleAttribute("data-dodge",se)}function P(){let m=jn(i,r,o,n);S.textContent=t.unit?`${i.toFixed(m)}${t.unit}`:i.toFixed(m),a.setAttribute("aria-valuenow",String(i)),a.setAttribute("aria-valuetext",S.textContent)}function z(){C&&cancelAnimationFrame(C),C=0,v=null,f=0}function q(){return typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches}function ae(m,M=vr){if(q()){z(),u=m,E();return}if(v=m,D=performance.now(),C)return;let Q=se=>{let ke=Math.min((se-D)/1e3,.03333333333333333);if(D=se,v===null){C=0;return}let $e=Un(u,f,v,ke,M);if(u=$e.x,f=$e.v,E(),Vn(u,f,v)){u=v,f=0,v=null,C=0,E();return}C=requestAnimationFrame(Q)};C=requestAnimationFrame(Q)}function ee(m,M){let Q=zt(m,r,o,n),se=Q!==i;i=Q,P(),M?ae(ft(i,o,n)):(z(),u=ft(i,o,n),E()),se&&t.onChange(i)}let X=null,K=!0,p=null,A=1,k=0,s=0;function h(m){if(k=m,m===0){a.style.width="",a.style.transform="";return}a.style.width=`calc(100% + ${Math.abs(m)}px)`,a.style.transform=m<0?`translateX(${m}px)`:""}function d(){if(k===0)return;if(q()){h(0),a.style.width="",a.style.transform="";return}let m=0,M=performance.now(),Q=se=>{let ke=Math.min((se-M)/1e3,.03333333333333333);M=se;let $e=Un(k,m,0,ke,kr);if(m=$e.v,h($e.x),Vn($e.x,m,0,.05)){h(0),a.style.width="",a.style.transform="",s=0;return}s=requestAnimationFrame(Q)};s=requestAnimationFrame(Q)}function $(m){if(!p)return 0;let M=g();return M<=0?0:(m-p.left)/A/M}let T=m=>{if(!(F||m.button!==0)){m.preventDefault();try{a.setPointerCapture(m.pointerId)}catch{}X={x:m.clientX,y:m.clientY},K=!0,p=a.getBoundingClientRect(),A=We(a).x||1,a.setAttribute("data-awake","")}},N=m=>{if(!X)return;let M=m.clientX-X.x,Q=m.clientY-X.y;K&&Math.hypot(M,Q)>Tr&&(K=!1,a.setAttribute("data-dragging","")),!(K||!p)&&(q()||(m.clientX<p.left?h(Yn(p.left-m.clientX,-1)):m.clientX>p.right?h(Yn(m.clientX-p.right,1)):k!==0&&h(0)),z(),ee(Kn($(m.clientX),o,n),!1))},G=m=>{X&&(K&&ee(wr(Kn($(m.clientX),o,n),o,n,r),!0),t.onCommit?.(i),d(),X=null,a.removeAttribute("data-dragging"),J||a.removeAttribute("data-awake"))},j=()=>{X&&(h(0),a.style.width="",a.style.transform="",X=null,a.removeAttribute("data-dragging"),J||a.removeAttribute("data-awake"))},J=!1,b=()=>{J=!0,a.setAttribute("data-awake","")},te=()=>{J=!1,X||a.removeAttribute("data-awake")},F=null,ye=!1,re=0;function ne(){if(F)return;F=document.createElement("input"),F.className="sl-input",F.type="text",F.setAttribute("aria-label",`${t.label} value`),F.value=i.toFixed(jn(i,r,o,n)),S.style.display="none",a.appendChild(F),F.focus(),F.select();let m=M=>{if(F){if(M){let Q=parseFloat(F.value);Number.isFinite(Q)&&(ee(Math.max(o,Math.min(n,Q)),!0),t.onCommit?.(i))}F.remove(),F=null,S.style.display="",ue(!1),a.focus()}};F.addEventListener("keydown",M=>{M.stopPropagation(),M.key==="Enter"?(M.preventDefault(),m(!0)):M.key==="Escape"&&(M.preventDefault(),m(!1))}),F.addEventListener("blur",()=>m(!0)),F.addEventListener("pointerdown",M=>M.stopPropagation())}function ue(m){ye=m,S.toggleAttribute("data-editable",m)}S.addEventListener("pointerenter",()=>{F||X||(re=window.setTimeout(()=>ue(!0),Mr))}),S.addEventListener("pointerleave",()=>{clearTimeout(re),F||ue(!1)}),S.addEventListener("pointerdown",m=>{ye&&(m.stopPropagation(),m.preventDefault(),ne())});let B=m=>{if(m.target!==a||m.altKey||m.metaKey||m.ctrlKey)return;let M=yr(m.key,i,o,n,r,m.shiftKey);if(M===void 0){if(m.key!=="Enter")return;m.preventDefault(),m.stopPropagation(),ue(!0),ne();return}m.preventDefault(),m.stopPropagation(),ee(M,!1),t.onCommit?.(i)};return a.addEventListener("pointerdown",T),a.addEventListener("pointermove",N),a.addEventListener("pointerup",G),a.addEventListener("pointercancel",j),a.addEventListener("lostpointercapture",j),a.addEventListener("pointerenter",b),a.addEventListener("pointerleave",te),a.addEventListener("keydown",B),P(),requestAnimationFrame(E),{el:a,set(m){i=zt(m,r,o,n),P(),z(),u=ft(i,o,n),E()},destroy(){z(),s&&cancelAnimationFrame(s),clearTimeout(re),a.remove()}}}function we(e,t){return getComputedStyle(e).getPropertyValue(t).trim()}function Rr(e,t){let o=parseFloat(e);if(e.endsWith("px")&&Number.isFinite(o)){let r=Mt(o,t)[0];if(r)return r}return et(e)?dt(e,t)[0]??null:null}function Gr(e){if(e.length===0)return"";let t=new Map;for(let n of e){let r=t.get(n.selector)??[];r.push(n),t.set(n.selector,r)}let o=["These changes were made live in the browser and are not in the source yet.","Apply them, preferring the named token wherever one is given.",""];for(let[n,r]of t){o.push(`${n} {`);for(let i of r){let a=i.token?`var(${i.token})`:i.to,l=i.token?`  /* ${i.to}, was ${i.from} */`:`  /* was ${i.from} */`;o.push(`  ${i.prop}: ${a};${l}`)}o.push("}","")}return o.join(`
`).trimEnd()}function Zn(){let e=new Map,t=!1;function o(r){let i=e.get(r);if(i)return i;let a=new Map;return e.set(r,a),a}function n(r,i,a){let l=r.style;a.inline?l.setProperty(i,a.inline):l.removeProperty(i)}return{get armed(){return t},arm(){t=!0},disarm(){let r=this.revertAll();return t=!1,r},set(r,i,a){if(!t)return;let l=o(r);l.has(i)||l.set(i,{inline:r.style.getPropertyValue(i),computed:we(r,i)}),r.style.setProperty(i,a)},revert(r,i){let a=e.get(r),l=a?.get(i);!a||!l||(n(r,i,l),a.delete(i),a.size===0&&e.delete(r))},revertAll(){let r=0;for(let[i,a]of e)for(let[l,c]of a)n(i,l,c),r+=1;return e.clear(),r},touched(r,i){return e.get(r)?.has(i)??!1},touchedProps(r){return[...e.get(r)?.keys()??[]].sort()},changes(){let r=[];for(let[i,a]of e)for(let[l,c]of a)r.push({el:i,prop:l,from:c.computed,to:we(i,l)});return r},asPrompt(){let r=[];for(let[i,a]of e){let l=ct(i),c=tt(i);for(let[x,w]of a){let S=we(i,x);S!==w.computed&&r.push({selector:c,prop:x,from:w.computed,to:S,token:Rr(S,l)})}}return Gr(r)}}}var eo={x:0,y:2,blur:8,spread:0,colour:"rgba(0, 0, 0, 0.2)",inset:!1};function Br(e,t){let o=[],n=0,r="";for(let i of e){if(i==="("?n+=1:i===")"&&(n-=1),i===t&&n===0){o.push(r.trim()),r="";continue}r+=i}return r.trim()&&o.push(r.trim()),o.filter(Boolean)}function Pr(e){let t=e.trim();if(!t||t==="none")return null;let o=t,n=/(^|\s)inset(\s|$)/.test(o);n&&(o=o.replace(/(^|\s)inset(\s|$)/," ").trim());let r=[];o=o.replace(/[a-z-]+\([^)]*\)/gi,c=>(r.push(c),`\0${r.length-1}`));let i=o.split(/\s+/).filter(Boolean).map(c=>c.startsWith("\0")?r[Number(c.slice(1))]:c),a=[],l=[];for(let c of i)/^-?\d*\.?\d+(px|em|rem|%)?$/.test(c)?a.push(parseFloat(c)):l.push(c);return a.length<2?null:{x:a[0]??0,y:a[1]??0,blur:a[2]??0,spread:a[3]??0,colour:l[0]??"rgba(0, 0, 0, 0.2)",inset:n}}function to(e){return!e||e.trim()==="none"?[]:Br(e,",").map(Pr).filter(t=>t!==null)}function Dr(e){let t=`${e.x}px ${e.y}px ${e.blur}px ${e.spread}px ${e.colour}`;return e.inset?`inset ${t}`:t}function no(e){return e.length===0?"none":e.map(Dr).join(", ")}function _t(e,t,o){let n=[...e];if(t<0||t>=n.length||o<0||o>=n.length)return n;let[r]=n.splice(t,1);return r!==void 0&&n.splice(o,0,r),n}function Xt(e){let t=/blur\(\s*(-?\d*\.?\d+)px\s*\)/i.exec(e||"");return t?parseFloat(t[1]):0}function oo(e){return e<=0?"none":`blur(${e}px)`}var Yt=["top","right","bottom","left"],Or=["border-top-left-radius","border-top-right-radius","border-bottom-right-radius","border-bottom-left-radius"],Ir=[{name:"Type",specs:[{prop:"font-size",label:"Size",kind:"length",min:8,max:96,step:1,unit:"px"},{prop:"font-weight",label:"Weight",kind:"number",min:100,max:900,step:100},{prop:"line-height",label:"Line height",kind:"length",min:0,max:96,step:1,unit:"px"},{prop:"letter-spacing",label:"Tracking",kind:"length",min:-4,max:12,step:.1,unit:"px"},{prop:"font-style",label:"Style",kind:"choice",options:["normal","italic"],more:!0},{prop:"text-align",label:"Align",kind:"choice",options:["start","center","end","justify"],more:!0},{prop:"text-transform",label:"Case",kind:"choice",options:["none","uppercase","lowercase","capitalize"],more:!0},{prop:"text-decoration-line",label:"Decoration",kind:"choice",options:["none","underline","line-through"],more:!0}]},{name:"Colour",specs:[{prop:"color",label:"Text",kind:"colour"},{prop:"background-color",label:"Background",kind:"colour"},{prop:"border-color",label:"Border",kind:"colour",more:!0},{prop:"opacity",label:"Opacity",kind:"number",min:0,max:1,step:.01}]},{name:"Box",specs:[{prop:"padding",label:"Padding",kind:"length",min:0,max:128,step:1,unit:"px",sides:Yt.map(e=>`padding-${e}`)},{prop:"margin",label:"Margin",kind:"length",min:-64,max:128,step:1,unit:"px",sides:Yt.map(e=>`margin-${e}`)},{prop:"width",label:"Width",kind:"length",min:0,max:1600,step:1,unit:"px",more:!0},{prop:"height",label:"Height",kind:"length",min:0,max:1200,step:1,unit:"px",more:!0},{prop:"box-sizing",label:"Sizing",kind:"choice",options:["content-box","border-box"]}]},{name:"Border",specs:[{prop:"border-width",label:"Width",kind:"length",min:0,max:24,step:1,unit:"px",sides:Yt.map(e=>`border-${e}-width`)},{prop:"border-style",label:"Style",kind:"choice",options:["none","solid","dashed","dotted"]},{prop:"border-radius",label:"Radius",kind:"length",min:0,max:64,step:1,unit:"px",sides:Or}]},{name:"Effects",specs:[{prop:"box-shadow",label:"Shadow",kind:"shadow"},{prop:"backdrop-filter",label:"Backdrop blur",kind:"blur",min:0,max:40,step:1,unit:"px",more:!0}]},{name:"Layout",specs:[{prop:"display",label:"Display",kind:"choice",options:["block","flex","grid","inline-flex","inline-block","none"]},{prop:"flex-direction",label:"Direction",kind:"choice",options:["row","column","row-reverse","column-reverse"],more:!0},{prop:"justify-content",label:"Justify",kind:"choice",options:["flex-start","center","flex-end","space-between"],more:!0},{prop:"align-items",label:"Align",kind:"choice",options:["stretch","flex-start","center","flex-end"],more:!0},{prop:"flex-wrap",label:"Wrap",kind:"choice",options:["nowrap","wrap"],more:!0},{prop:"gap",label:"Gap",kind:"length",min:0,max:96,step:1,unit:"px"}]}];function ro(e){let t=parseFloat(e);return Number.isFinite(t)?t:0}function io(e){let t=/^rgba?\(([^)]+)\)$/.exec(e.trim());if(!t)return/^#[0-9a-f]{6}$/i.test(e.trim())?e.trim():"#000000";let[o,n,r]=t[1].split(/[\s,/]+/).filter(Boolean).map(Number);if(o===void 0||n===void 0||r===void 0)return"#000000";let i=a=>Math.max(0,Math.min(255,Math.round(a))).toString(16).padStart(2,"0");return`#${i(o)}${i(n)}${i(r)}`}var Hr=320,Fr=`
.edit-dock {
  position: fixed;
  top: ${O.edge}px;
  left: ${O.edge}px;
  width: ${Hr}px;
  max-height: calc(100vh - ${O.edge*2}px);
  overflow: hidden;
  display: none;
  flex-direction: column;
  pointer-events: auto;
  font-family: ${L.stack};
  font-synthesis: none;
  font-size: ${L.body}px;
  font-weight: ${V.regular};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${y.primary};
  background: ${me};
  box-shadow: ${Ae};
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
  transition: opacity ${I.ui}, translate ${I.ui}, display ${I.ui} allow-discrete;
}

/* The bar that says the tool wrote this row. Worth a fade: it is the panel
   admitting to something, and it should be noticed without being a movement. */
.edit-row::before { transition: opacity ${I.ui}; }

@media (prefers-reduced-motion: reduce) {
  .edit-dock { transition: opacity ${I.ui}; translate: none; }
  @starting-style { .edit-dock[data-open] { translate: none; } }
  .edit-opt:active, .edit-mini:active, .edit-add:active,
  .edit-action:active, .edit-revert:active { scale: 1; }
}

.edit-head {
  display: flex; align-items: center; gap: ${O.base}px;
  flex: none;
  height: ${Ne}px;
  padding: 0 ${O.base}px 0 ${O.roomy}px;
  border-bottom: 1px solid ${pe};
}
.edit-title { font-size: ${L.title}px; font-weight: ${V.semibold}; }
.edit-subject {
  flex: 1; min-width: 0;
  color: ${y.tertiary};
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
  /*
   * Present but not part of the design until you reach for it. The panel is
   * mostly a column of controls, and a permanent light bar down its edge reads
   * as one more thing to look at.
   */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  transition: scrollbar-color ${I.ui};
  padding: ${O.base}px;
}
.edit-body:hover, .edit-body:focus-within {
  scrollbar-color: ${H(6)} transparent;
}
/* WebKit does not read scrollbar-color, so it gets the same thing said twice. */
.edit-body::-webkit-scrollbar { width: 8px; }
.edit-body::-webkit-scrollbar-track { background: transparent; }
.edit-body::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 0;
  transition: background ${I.ui};
}
.edit-body:hover::-webkit-scrollbar-thumb,
.edit-body:focus-within::-webkit-scrollbar-thumb { background: ${H(6)}; }
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
  margin: 0 0 ${O.base}px 2px;
  font-size: ${L.tag}px; font-weight: ${V.semibold};
  letter-spacing: 0.04em; text-transform: uppercase;
  color: ${y.secondary};
}
.edit-rows { display: grid; gap: ${O.base}px; }

/*
 * A row the tool has written shows its revert control and nothing else.
 *
 * There was a bar down the leading edge as well, which said the same thing
 * twice: the revert arrow only appears on a touched row, so it already marks
 * which rows are the tool's doing, and it is a control rather than a stripe.
 * Two marks for one fact is noise in a panel with twenty rows in it.
 */
.edit-row { position: relative; }

.edit-line {
  display: flex; align-items: center; gap: ${O.base}px;
  min-height: ${Ne}px;
  padding: 0 10px;
  background: ${H(1)};
}
.edit-label {
  flex: none; width: 88px;
  color: ${y.secondary};
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.edit-field { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; }

/* Choice: one button per value, the current one filled. Buttons rather than a
   select, because a select hides every option until you open it and the whole
   value of these is seeing the alternatives. */
.edit-choice { display: flex; flex-wrap: wrap; gap: 2px; }
.edit-opt {
  /* 24px is WCAG's AA floor and these were 21 by a padding accident. */
  min-height: 24px;
  padding: 5px 8px; border: 0; border-radius: 0;
  background: ${H(2)}; color: ${y.secondary};
  font: inherit; font-size: ${L.tag}px; cursor: pointer;
  transition: background ${I.ui}, color ${I.ui};
}
.edit-opt:hover { background: ${H(4)}; color: ${y.primary}; }
.edit-opt:active { scale: 0.96; }
.edit-opt:focus-visible { outline: 2px solid ${y.secondary}; outline-offset: -2px; }
.edit-opt[data-on] { background: ${y.primary}; color: ${me}; }

.edit-swatch {
  flex: none; width: 24px; height: 24px;
  padding: 0; border: 0; border-radius: 0;
  box-shadow: inset 0 0 0 1px ${pe};
  cursor: pointer;
}
.edit-hex {
  flex: 1; min-width: 0;
  height: 24px; padding: 0 6px;
  border: 1px solid ${pe}; border-radius: 0;
  background: ${H(1)}; color: ${y.primary};
  font: inherit; font-size: ${L.tag}px;
  font-variant-numeric: tabular-nums;
}
.edit-hex:focus-visible { outline: 2px solid ${y.secondary}; outline-offset: -2px; }

.edit-row-name {
  display: block;
  /* Half the gap between rows, so the name binds to its own control rather
     than floating between two of them. */
  margin: 0 0 ${O.tight}px 10px;
  color: ${y.secondary};
  font-size: ${L.tag}px; font-weight: ${V.regular};
}
.edit-sides { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; }

/* A shadow is a list, so its row is a block rather than a line. */
.edit-line-block { display: block; padding: ${O.base}px 10px; }
.edit-stack { display: grid; gap: 6px; }
.edit-layer { background: ${H(2)}; padding: 6px; }
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
  color: ${y.secondary};
  font-size: ${L.tag}px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.edit-layer-head .edit-swatch { width: 24px; height: 24px; }
.edit-mini {
  flex: none;
  display: grid; place-items: center;
  width: 24px; height: 24px;
  padding: 0; border: 0; border-radius: 0;
  background: ${H(3)}; color: ${y.secondary};
  font: inherit; font-size: ${L.tag}px; line-height: 1;
  cursor: pointer;
}
.edit-mini:hover:not(:disabled) { background: ${H(5)}; color: ${y.primary}; }
.edit-mini:active:not(:disabled) { scale: 0.96; }
.edit-mini:disabled { color: ${y.disabled}; cursor: default; }
.edit-mini:focus-visible { outline: 2px solid ${y.secondary}; outline-offset: -2px; }
.edit-add {
  width: 100%;
  padding: 7px; border: 0; border-radius: 0;
  background: ${H(2)}; color: ${y.secondary};
  font: inherit; font-size: ${L.tag}px; cursor: pointer;
}
.edit-add:hover { background: ${H(4)}; color: ${y.primary}; }
.edit-add:active { scale: 0.96; }
.edit-add:focus-visible { outline: 2px solid ${y.secondary}; outline-offset: -2px; }
.edit-sides > * { min-width: 0; }

.edit-linked {
  width: 24px; height: 24px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; color: ${y.tertiary};
  cursor: pointer;
}
.edit-linked[data-on] { background: ${H(4)}; color: ${y.primary}; }
.edit-linked:focus-visible { outline: 2px solid ${y.secondary}; outline-offset: -2px; }

.edit-revert {
  width: 24px; height: 24px;
  display: none; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; color: ${y.tertiary};
  cursor: pointer;
}
.edit-row[data-touched] .edit-revert { display: grid; }
.edit-revert:hover { color: ${y.primary}; }
.edit-revert:active { scale: 0.96; }
.edit-revert:focus-visible { outline: 2px solid ${y.secondary}; outline-offset: -2px; }

.edit-more {
  width: 100%; margin-top: ${O.tight}px;
  padding: 6px; border: 0; border-radius: 0;
  background: none; color: ${y.tertiary};
  font: inherit; font-size: ${L.tag}px; cursor: pointer;
  text-align: left;
}
.edit-more:hover { color: ${y.primary}; }

.edit-foot {
  flex: none;
  display: flex; align-items: center; gap: ${O.base}px;
  padding: ${O.base}px;
  border-top: 1px solid ${pe};
}
.edit-count { flex: 1; color: ${y.tertiary}; font-size: ${L.tag}px; }
.edit-action {
  padding: 7px 10px; border: 0; border-radius: 0;
  background: ${H(3)}; color: ${y.primary};
  font: inherit; font-size: ${L.tag}px; font-weight: ${V.medium};
  cursor: pointer;
  transition: background ${I.ui};
}
.edit-action:hover { background: ${H(5)}; }
.edit-action:active:not(:disabled) { scale: 0.96; }
.edit-action:disabled { color: ${y.disabled}; cursor: default; background: ${H(1)}; }
.edit-action:focus-visible { outline: 2px solid ${y.secondary}; outline-offset: -2px; }

.edit-empty {
  padding: ${O.roomy}px;
  color: ${y.tertiary};
}
`;function ao(e,t){let o=document.createElement("style");o.textContent=Fr,e.appendChild(o);let n=document.createElement("div");n.className="edit-dock",n.setAttribute("role","region"),n.setAttribute("aria-label","Edit the locked element");let r=document.createElement("div");r.className="edit-head";let i=document.createElement("span");i.className="edit-title",i.textContent="Edit";let a=document.createElement("span");a.className="edit-subject",r.append(i,a);let l=document.createElement("div");l.className="edit-body";let c=document.createElement("div");c.className="edit-foot";let x=document.createElement("span");x.className="edit-count";let w=document.createElement("button");w.type="button",w.className="edit-action",w.textContent="Copy as prompt";let S=document.createElement("button");S.type="button",S.className="edit-action",S.textContent="Revert all",c.append(x,S,w),n.append(r,l,c),e.appendChild(n);let u=null,f=!1,v=!1,C=[],D=new Set;function g(){let s=t.changes().length;x.textContent=s===0?"No changes":`${s} change${s===1?"":"s"}`,w.disabled=s===0,S.disabled=s===0}function E(){if(u){for(let s of C){let d=(s.spec.sides??[s.spec.prop]).some($=>t.touched(u,$));s.el.toggleAttribute("data-touched",d)}g()}}function P(s,h){u&&(t.set(u,s,h),E())}function z(s,h,d){let $=bt(e,{label:d,value:u?ro(we(u,h)):0,min:s.min??0,max:s.max??100,step:s.step??1,...s.unit?{unit:s.unit}:{},onChange:T=>{let N=`${T}${s.unit??""}`;if(s.sides&&D.has(s.prop)){for(let G of s.sides)P(G,N);for(let G of C)if(G.spec.prop===s.prop)for(let j of G.sliders)j.set(T)}else P(h,N)}});return{el:$.el,slider:$,sync:()=>{u&&$.set(ro(we(u,h)))}}}function q(s){let h=document.createElement("div");h.className="edit-choice",h.setAttribute("role","group"),h.setAttribute("aria-label",s.label);let d=[];for(let T of s.options??[]){let N=document.createElement("button");N.type="button",N.className="edit-opt",N.textContent=T,N.addEventListener("click",()=>{P(s.prop,T),$()}),d.push(N),h.appendChild(N)}function $(){let T=u?we(u,s.prop):"";for(let N of d){let G=N.textContent===T;N.toggleAttribute("data-on",G),N.setAttribute("aria-pressed",String(G))}}return{el:h,sync:$}}function ae(s){let h=document.createElement("div");h.className="edit-field";let d=document.createElement("input");d.type="color",d.className="edit-swatch",d.setAttribute("aria-label",`${s.label} colour`);let $=document.createElement("input");$.type="text",$.className="edit-hex",$.spellcheck=!1,$.setAttribute("aria-label",`${s.label} colour, as hex`),d.addEventListener("input",()=>{$.value=d.value,P(s.prop,d.value)}),$.addEventListener("change",()=>{let N=$.value.trim();if(!/^#?[0-9a-f]{3}$|^#?[0-9a-f]{6}$/i.test(N)){T();return}let G=N.startsWith("#")?N:`#${N}`;d.value=G.length===4?`#${G[1]}${G[1]}${G[2]}${G[2]}${G[3]}${G[3]}`:G,P(s.prop,d.value)});function T(){let N=u?we(u,s.prop):"",G=io(N);d.value=G,$.value=G}return h.append(d,$),{el:h,sync:T}}function ee(s){let h=document.createElement("div");h.className="edit-stack";let d=[],$=[];function T(){P(s.prop,no(d))}function N(){for(let J of $)J.destroy();$=[],h.textContent="",d.forEach((J,b)=>{let te=document.createElement("div");te.className="edit-layer";let F=document.createElement("div");F.className="edit-layer-head";let ye=document.createElement("span");ye.className="edit-layer-name",ye.textContent=`Layer ${b+1}`;let re=document.createElement("input");re.type="color",re.className="edit-swatch",re.setAttribute("aria-label",`Layer ${b+1} colour`),re.value=io(J.colour),re.addEventListener("input",()=>{d[b]={...J,colour:re.value},J=d[b],T()});let ne=document.createElement("button");ne.type="button",ne.className="edit-opt",ne.textContent="inset",ne.toggleAttribute("data-on",J.inset),ne.addEventListener("click",()=>{d[b]={...J,inset:!J.inset},J=d[b],ne.toggleAttribute("data-on",J.inset),T()});let ue=document.createElement("button");ue.type="button",ue.className="edit-mini",ue.setAttribute("aria-label",`Move layer ${b+1} up`),ue.appendChild(Se("arrowUp",12)),ue.disabled=b===0,ue.addEventListener("click",()=>{d=_t(d,b,b-1),T(),N()});let B=document.createElement("button");B.type="button",B.className="edit-mini",B.setAttribute("aria-label",`Move layer ${b+1} down`),B.appendChild(Se("arrowDown",12)),B.disabled=b===d.length-1,B.addEventListener("click",()=>{d=_t(d,b,b+1),T(),N()});let m=document.createElement("button");m.type="button",m.className="edit-mini",m.setAttribute("aria-label",`Remove layer ${b+1}`),m.appendChild(Se("cross",12)),m.addEventListener("click",()=>{d=d.filter((se,ke)=>ke!==b),T(),N()}),F.append(ye,re,ne,ue,B,m);let M=document.createElement("div");M.className="edit-sides";let Q=[{key:"x",label:"x",min:-64,max:64},{key:"y",label:"y",min:-64,max:64},{key:"blur",label:"blur",min:0,max:96},{key:"spread",label:"spread",min:-32,max:32}];for(let se of Q){let ke=bt(e,{label:se.label,value:J[se.key],min:se.min,max:se.max,step:1,unit:"px",onChange:$e=>{d[b]={...d[b],[se.key]:$e},J=d[b],T()}});$.push(ke),M.appendChild(ke.el)}te.append(F,M),h.appendChild(te)});let j=document.createElement("button");j.type="button",j.className="edit-add",j.textContent=d.length===0?"Add a shadow":"Add another layer",j.addEventListener("click",()=>{d=[...d,{...eo}],T(),N()}),h.appendChild(j)}function G(){d=u?to(we(u,s.prop)):[],N()}return{el:h,sync:G,sliders:[]}}function X(s){let h=bt(e,{label:s.label,value:u?Xt(we(u,s.prop)):0,min:s.min??0,max:s.max??40,step:s.step??1,unit:s.unit??"px",onChange:d=>P(s.prop,oo(d))});return{el:h.el,slider:h,sync:()=>{u&&h.set(Xt(we(u,s.prop)))}}}function K(s){let h=document.createElement("div");h.className="edit-row";let d=document.createElement("div");d.className="edit-line";let $=document.createElement("span");$.className="edit-label",$.textContent=s.label;let T=document.createElement("div");T.className="edit-field";let N=[],G=[];if(s.sides){let b=document.createElement("div");b.className="edit-sides",b.style.flex="1";for(let F of s.sides){let ye=F.split("-").filter(ne=>ne!=="border"&&ne!=="radius"&&ne!=="width"&&ne!=="padding"&&ne!=="margin").join(" ")||F,re=z(s,F,ye);N.push(re.slider),G.push(re.sync),b.appendChild(re.el)}let te=document.createElement("button");te.type="button",te.className="edit-linked",te.setAttribute("aria-label",`Link all four ${s.label.toLowerCase()} values`),te.title="Change all four together",te.appendChild(Se("link",13)),te.setAttribute("aria-pressed","false"),te.addEventListener("click",()=>{D.has(s.prop)?D.delete(s.prop):D.add(s.prop);let F=D.has(s.prop);te.toggleAttribute("data-on",F),te.setAttribute("aria-pressed",String(F))}),T.append(b,te)}else if(s.kind==="shadow"){let b=ee(s);G.push(b.sync),b.el.style.flex="1",T.appendChild(b.el)}else if(s.kind==="blur"){let b=X(s);N.push(b.slider),G.push(b.sync),b.el.style.flex="1",T.appendChild(b.el)}else if(s.kind==="choice"){let b=q(s);G.push(b.sync),T.appendChild(b.el)}else if(s.kind==="colour"){let b=ae(s);G.push(b.sync),b.el.style.flex="1",T.appendChild(b.el)}else{let b=z(s,s.prop,s.label);N.push(b.slider),G.push(b.sync),b.el.style.flex="1",T.appendChild(b.el)}let j=document.createElement("button");if(j.type="button",j.className="edit-revert",j.setAttribute("aria-label",`Revert ${s.label.toLowerCase()}`),j.title="Put this back",j.appendChild(Se("undo",13)),j.addEventListener("click",()=>{if(u){for(let b of s.sides??[s.prop])t.revert(u,b);for(let b of G)b();E()}}),s.kind==="shadow"&&d.classList.add("edit-line-block"),!s.sides&&s.kind==="colour"&&d.appendChild($),s.sides||s.kind==="shadow"||s.kind==="choice"){let b=document.createElement("span");b.className="edit-row-name",b.textContent=s.label,h.appendChild(b)}return d.append(T,j),h.appendChild(d),{spec:s,el:h,sliders:N,sync:()=>{for(let b of G)b()}}}function p(){for(let h of C)for(let d of h.sliders)d.destroy();if(C.length=0,l.textContent="",!u){let h=document.createElement("p");h.className="edit-empty",h.textContent="Click an element to lock it, then change it here.",l.appendChild(h),g();return}for(let h of Ir){let d=h.specs.filter(G=>v||!G.more);if(d.length===0)continue;let $=document.createElement("section");$.className="edit-group";let T=document.createElement("span");T.className="edit-group-name",T.textContent=h.name;let N=document.createElement("div");N.className="edit-rows";for(let G of d){let j=K(G);C.push(j),N.appendChild(j.el)}$.append(T,N),l.appendChild($)}let s=document.createElement("button");s.type="button",s.className="edit-more",s.textContent=v?"Fewer properties":"More properties",s.addEventListener("click",()=>{v=!v,p()}),l.appendChild(s);for(let h of C)h.sync();E()}S.addEventListener("click",()=>{t.revertAll();for(let s of C)s.sync();E()});let A=0;w.addEventListener("click",()=>{let s=t.asPrompt();if(!s)return;let h=$=>{w.textContent=$,clearTimeout(A),A=window.setTimeout(()=>{w.textContent="Copy as prompt"},900)},d=navigator.clipboard;if(!d){h("No clipboard");return}d.writeText(s).then(()=>h("Copied"),()=>h("Blocked"))});function k(){n.toggleAttribute("data-open",f)}return{show(s){u=s,a.textContent=s?s.tagName.toLowerCase()+(s.id?`#${s.id}`:""):"",p()},setArmed(s){f=s,k(),s&&p()},refresh(){for(let s of C)s.sync();E()},asText(){return t.asPrompt()},destroy(){for(let s of C)for(let h of s.sliders)h.destroy();C.length=0,n.remove(),o.remove()}}}var yt=5,Kt=4,at=12,so=.22,Ke=10,zr=50,Wr=100;function lo(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,hidden:!1,grid:null,pixels:!1,guides:[],liveGuide:null,activeGuide:null},i=Dt(Ot()),a=0,l=null;function c(){let p=Ot();p!==l&&(l=p,i=Dt(p),e.style.colorScheme=p?"dark":"light",K())}c();let x=matchMedia("(prefers-color-scheme: dark)"),w=()=>c();x.addEventListener("change",w);let S=new MutationObserver(()=>c());function u(){S.disconnect(),S.observe(document.documentElement,{attributes:!0}),document.body&&S.observe(document.body,{attributes:!0})}u(),Hn(()=>K());function f(){let p=devicePixelRatio;o.width=Math.round(innerWidth*p),o.height=Math.round(innerHeight*p),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(p,0,0,p,0,0),n.translate(.5,.5)}let v=p=>Math.round(p)-.5;function C(p,A){n.strokeStyle=A,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(p.left),Math.round(p.top),Math.round(p.width),Math.round(p.height))}function D(p){n.strokeStyle=Xe(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let A of[p.left,p.right])n.moveTo(Math.round(A),0),n.lineTo(Math.round(A),innerHeight);for(let A of[p.top,p.bottom])n.moveTo(0,Math.round(A)),n.lineTo(innerWidth,Math.round(A));n.stroke(),n.setLineDash([])}function g(p){if(n.strokeStyle=p.extension?Xe(i.measure,.55):i.measure,n.lineWidth=1,n.setLineDash(p.extension?[3,3]:[]),n.beginPath(),n.moveTo(Math.round(p.x1),Math.round(p.y1)),n.lineTo(Math.round(p.x2),Math.round(p.y2)),p.extension){n.stroke();return}if(p.axis==="x")for(let A of[p.x1,p.x2])n.moveTo(Math.round(A),Math.round(p.y1)-yt),n.lineTo(Math.round(A),Math.round(p.y1)+yt);else for(let A of[p.y1,p.y2])n.moveTo(Math.round(p.x1)-yt,Math.round(A)),n.lineTo(Math.round(p.x1)+yt,Math.round(A));n.stroke()}function E(p){return n.font=`${V.medium} ${L.body}px ${L.stack}`,{w:n.measureText(p).width+Kt*2,h:L.body+Kt*2+2}}function P(p,A,k,s){n.font=`${V.medium} ${L.body}px ${L.stack}`,n.textBaseline="middle";let{w:h,h:d}=E(p),$=v(Math.min(Math.max(A,at),innerWidth-h-at)),T=v(Math.min(Math.max(k,at),innerHeight-d-at));n.fillStyle=s,n.beginPath(),n.roundRect($,T,Math.ceil(h),d,4),n.fill(),n.fillStyle=i.surface,n.fillText(p,$+Kt,T+d/2)}function z(p,A,k,s,h=!1){let{w:d,h:$}=E(p);P(p,h?A-d/2:A,h?k-$/2:k,s)}function q(){let p=scrollX,A=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,_),n.fillRect(-.5,-.5,_,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${V.regular} 9px ${L.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let d of r.pinned)n.fillRect(v(d.left),-.5,Math.round(d.width),_),n.fillRect(-.5,v(d.top),_,Math.round(d.height));n.restore(),n.beginPath(),n.moveTo(-.5,_-.5),n.lineTo(innerWidth,_-.5),n.moveTo(_-.5,-.5),n.lineTo(_-.5,innerHeight),n.stroke();let k=d=>d%Wr===0?_:d%zr===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let s=Math.floor(p/Ke)*Ke;for(let d=s;d<p+innerWidth;d+=Ke){let $=Math.round(d-p);if($<_)continue;let T=k(d);n.moveTo($,_-T),n.lineTo($,_),T===_&&(n.fillStyle=i.muted,n.fillText(String(d),$+3,3))}n.stroke(),n.beginPath();let h=Math.floor(A/Ke)*Ke;for(let d=h;d<A+innerHeight;d+=Ke){let $=Math.round(d-A);if($<_)continue;let T=k(d);n.moveTo(_-T,$),n.lineTo(_,$),T===_&&(n.save(),n.translate(3,$-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(d),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),_),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo(_,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let d of r.guides){let $=Math.round(nt(d));d.axis==="x"?n.fillRect($-1,-.5,2,_):n.fillRect(-.5,$-1,_,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,_,_),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,_,_)}function ae(){let p=Gn(10,1);if(p){n.strokeStyle=i.pixelLine,n.lineWidth=1,n.setLineDash([]),n.beginPath();for(let A=0;A<=innerWidth;A+=p)n.moveTo(A,0),n.lineTo(A,innerHeight);for(let A=0;A<=innerHeight;A+=p)n.moveTo(0,A),n.lineTo(innerWidth,A);n.stroke()}}function ee(p){let A=Rn(p,document.documentElement.clientWidth);n.fillStyle=Xe(i.measure,.08);for(let k of A)n.fillRect(v(k.left),-.5,Math.round(k.width),innerHeight+1)}function X(){if(a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore(),r.hidden)return;(r.pixels||r.grid)&&(n.save(),r.rulers&&(n.beginPath(),n.rect(_,_,innerWidth,innerHeight),n.clip()),r.pixels&&ae(),r.grid&&ee(r.grid),n.restore());for(let k of r.pinned)C(k,i.accent);r.hover&&(D(r.hover),C(r.hover,r.pinned.length?Xe(i.accent,.7):i.accent));for(let k of r.guides){let s=r.liveGuide?.id===k.id;n.strokeStyle=k.locked||s?i.guide:Xe(i.guide,.55),n.lineWidth=k.pinned?2:1,n.setLineDash(k.locked?[]:[4,4]),n.beginPath();let h=Math.round(nt(k));if(k.axis==="x"?(n.moveTo(h,0),n.lineTo(h,innerHeight)):(n.moveTo(0,h),n.lineTo(innerWidth,h)),n.stroke(),r.activeGuide===k.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let d=7;k.axis==="x"?(n.moveTo(h,0),n.lineTo(h,d),n.moveTo(h,innerHeight-d),n.lineTo(h,innerHeight)):(n.moveTo(0,h),n.lineTo(d,h),n.moveTo(innerWidth-d,h),n.lineTo(innerWidth,h)),n.stroke()}}for(let k of r.lines)n.globalAlpha=k.faded?so:1,g(k);n.globalAlpha=1;let p=r.lines.filter(k=>k.label!==""),A=p.map(k=>{let s=(k.x1+k.x2)/2,h=(k.y1+k.y2)/2,{w:d,h:$}=E(k.label);return k.axis==="x"?{x:s-d/2,y:h-16-$/2,w:d,h:$,axis:k.axis}:{x:s+26-d/2,y:h-$/2,w:d,h:$,axis:k.axis}});if(Nn(A,{w:innerWidth,h:innerHeight},at).forEach((k,s)=>{let h=p[s];n.globalAlpha=h.faded?so:1,P(h.label,k.x,k.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:k,height:s,scale:h}=r.hover;z(`${U(k/h.x)} \xD7 ${U(s/h.y)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let k=r.liveGuide,s=Math.round(nt(k));z([`${k.axis} ${U(k.at)}`,k.caught,k.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),k.axis==="x"?s+6:30,k.axis==="x"?30:s+6,i.guide)}r.rulers&&q()}function K(){a||(a=requestAnimationFrame(X))}return f(),{root:t,update(p){Object.assign(r,p),K()},resize(){f(),K()},destroy(){a&&cancelAnimationFrame(a),x.removeEventListener("change",w),S.disconnect(),e.remove()}}}function _r(e){let t=e.trim().replace(/^#/,""),o=t.length===3?t.split("").map(n=>n+n).join(""):t;return/^[0-9a-f]{6}$/i.test(o)?{r:parseInt(o.slice(0,2),16),g:parseInt(o.slice(2,4),16),b:parseInt(o.slice(4,6),16)}:null}function Xr({r:e,g:t,b:o}){let n=r=>Math.round(r).toString(16).padStart(2,"0");return`#${n(e)}${n(t)}${n(o)}`}function Yr({r:e,g:t,b:o}){return`rgb(${Math.round(e)} ${Math.round(t)} ${Math.round(o)})`}function Oe(e,t){return String(Number(e.toFixed(t)))}function Kr({r:e,g:t,b:o}){let n=e/255,r=t/255,i=o/255,a=Math.max(n,r,i),l=Math.min(n,r,i),c=(a+l)/2,x=a-l,w=0,S=0;return x!==0&&(S=x/(1-Math.abs(2*c-1)),a===n?w=(r-i)/x%6:a===r?w=(i-n)/x+2:w=(n-r)/x+4,w*=60,w<0&&(w+=360)),`hsl(${Oe(w,1)} ${Oe(S*100,1)}% ${Oe(c*100,1)}%)`}function jt(e){let t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4}function jr(e){let t=jt(e.r),o=jt(e.g),n=jt(e.b),r=.4122214708*t+.5363325363*o+.0514459929*n,i=.2119034982*t+.6806995451*o+.1073969566*n,a=.0883024619*t+.2817188376*o+.6299787005*n,l=Math.cbrt(r),c=Math.cbrt(i),x=Math.cbrt(a),w=.2104542553*l+.793617785*c-.0040720468*x,S=1.9779984951*l-2.428592205*c+.4505937099*x,u=.0259040371*l+.7827717662*c-.808675766*x,f=Math.sqrt(S*S+u*u),v=Math.atan2(u,S)*180/Math.PI;return v<0&&(v+=360),f<1e-4?`oklch(${Oe(w,4)} 0 0)`:`oklch(${Oe(w,4)} ${Oe(f,4)} ${Oe(v,2)})`}function co(e){let t=_r(e);return t?[{label:"hex",value:Xr(t)},{label:"rgb",value:Yr(t)},{label:"hsl",value:Kr(t)},{label:"oklch",value:jr(t)}]:[]}var Ur=`
.picker {
  /* Under the badge, from the badge's own numbers. */
  position: fixed; top: ${ge+rt+it}px; right: ${ge}px;
  width: min(200px, calc(100vw - ${ge*2+O.base*2}px));
  padding: ${O.base}px; border-radius: 0;
  user-select: none;
  font-family: ${L.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${L.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${y.primary};
  background: ${me};
  box-shadow: ${Ae};
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
  transition: opacity ${I.ui}, transform ${I.ui}, visibility 0s linear 160ms;
}
.picker[data-open] {
  opacity: 1; visibility: visible; pointer-events: auto;
  transform: none;
  transition: opacity ${I.ui}, transform ${I.ui}, visibility 0s;
}
@media (prefers-reduced-motion: reduce) {
  /* The fade says it arrived; the travel and the scale are decoration. */
  .picker { transform: none; transition: opacity 120ms linear, visibility 0s linear 120ms; }
  .picker[data-open] { transition: opacity 120ms linear, visibility 0s; }
}
.picker .swatch {
  height: 40px; margin-bottom: 8px;
  border: 1px solid ${pe};
}
/* Each row copies itself, so the whole row is the target rather than the text. */
.picker button {
  display: grid; grid-template-columns: 34px 1fr;
  gap: 8px; align-items: baseline;
  width: 100%; padding: 3px 4px; margin: 0;
  border: 0; background: none; cursor: pointer;
  font: inherit; text-align: left;
  color: ${y.primary};
}
.picker button:hover { background: ${H(2)}; }
.picker button:focus-visible { outline: 1px solid ${y.primary}; outline-offset: -1px; }
.picker .k { color: ${y.secondary}; }
.picker .v { overflow-wrap: anywhere; }
.picker .hint {
  margin-top: 6px; padding-top: 6px;
  border-top: 1px solid ${pe};
  color: ${y.secondary};
}
`;function uo(e){let t=document.createElement("style");t.textContent=Ur,e.appendChild(t);let o=document.createElement("div");o.className="picker",e.appendChild(o);let n=document.createElement("div");n.className="swatch";let r=document.createElement("div");r.className="hint";function i(a){n.style.background=a;let l=co(a).map(({label:c,value:x})=>{let w=document.createElement("button");w.type="button";let S=document.createElement("span");S.className="k",S.textContent=c;let u=document.createElement("span");return u.className="v",u.textContent=x,w.append(S,u),w.addEventListener("click",f=>{f.stopPropagation(),navigator.clipboard?.writeText(x).then(()=>{r.textContent=`copied ${c}`},()=>{r.textContent="clipboard refused"})}),w});r.textContent="click a row to copy",o.replaceChildren(n,...l,r),o.setAttribute("data-open","")}return{async open(){let a=window.EyeDropper;if(!a){o.replaceChildren(Object.assign(document.createElement("div"),{className:"hint",textContent:"this browser has no eyedropper"})),o.setAttribute("data-open","");return}try{let{sRGBHex:l}=await new a().open();i(l)}catch{}},close(){let a=o.hasAttribute("data-open");return o.removeAttribute("data-open"),a},destroy(){o.remove(),t.remove()}}}var Ut="__align_freeze",Vr=`
[data-align-frozen] *:not([data-align-ignore]):not([data-align-ignore] *) {
  animation-play-state: paused !important;
}
`,Vt=!1,xt=[],wt=[];function po(e){let t=e;for(;t;){if(t instanceof Element&&t.hasAttribute("data-align-ignore"))return!0;let o=t.getRootNode();if(t=o instanceof ShadowRoot?o.host:t.parentNode??null,t===document)return!1}return!1}function vt(){return Vt}function qt(e){if(e!==Vt){if(Vt=e,!e){document.documentElement.removeAttribute("data-align-frozen"),document.getElementById(Ut)?.remove();for(let t of xt)try{t.play()}catch{}for(let t of wt)t.play().catch(()=>{});xt=[],wt=[];return}if(!document.getElementById(Ut)){let t=document.createElement("style");t.id=Ut,t.textContent=Vr,t.setAttribute("data-align-ignore",""),document.head.appendChild(t)}document.documentElement.setAttribute("data-align-frozen",""),xt=[];try{for(let t of document.getAnimations()){if(t.playState!=="running")continue;let o=t.effect?.target??null;po(o)||(t.pause(),xt.push(t))}}catch{}wt=[];for(let t of Array.from(document.querySelectorAll("video")))t.paused||po(t)||(t.pause(),wt.push(t))}}var Jt="__align_xray",qr=`
[data-align-xray] * { outline: 1px solid rgb(128 128 128 / 0.55) !important; }
[data-align-xray] [data-align-ignore],
[data-align-xray] [data-align-ignore] * { outline: none !important; }
`;function Qt(e){let t=document.documentElement;if(!e){t.removeAttribute("data-align-xray"),document.getElementById(Jt)?.remove();return}if(!document.getElementById(Jt)){let o=document.createElement("style");o.id=Jt,o.textContent=qr,o.setAttribute("data-align-ignore",""),document.head.appendChild(o)}t.setAttribute("data-align-xray","")}var Zt="align-ui";function ho(e){try{return localStorage.getItem(e)}catch{return null}}function mo(e,t){try{localStorage.setItem(e,t)}catch{}}function fo(e){let t="/";try{t=location.pathname||"/"}catch{}return`${Zt}:${e}::${t}`}function Jr(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function go(){let e=ho(fo("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(Jr).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function bo(e){mo(fo("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function kt(e){return ho(`${Zt}:${e}`)==="1"}function $t(e,t){mo(`${Zt}:${e}`,t?"1":"0")}var ce,Y=null,he=null,Ce=null,Ze=null,Be=null,Ie=Zn(),Fe=!1,Ve=kt("grid"),qe=kt("pixels"),oe=null,W=[],St=0,ze=kt("rulers"),Z=[],So=1,yo=!1,Te=null,je=!1,He=Wn();function Qr(){return Z.map(e=>({...e}))}function Je(e=""){He.push(Qr(),e)}function xo(){return Z.find(e=>e.id===Te)??null}function Ge(e){Z=e,bo(Z)}var ie=null,ve=null,be=null,Zr=3,Ue=22;function Co(e,t){return ze?t<Ue&&e>=Ue?"y":e<Ue&&t>=Ue?"x":null:null}function tn(e){return e.ctrlKey||e.metaKey}function To(e,t,o,n){let r=Pe(t,o,ce),i=e.axis==="x"?t:o,a=Z.filter(c=>c.id!==e.id).map(c=>({axis:c.axis,at:st(c).pos})),l=Mn(i,An(r,e.axis,a),n);e.at=l.at+(e.axis==="x"?scrollX:scrollY),e.caught=l.what}function Mo(e,t,o,n){let r={id:So++,axis:e,at:0,locked:!1,caught:"",pinned:!1};To(r,t,o,n);let i=Z.find(a=>a.axis===r.axis&&Math.abs(a.at-r.at)<.5);return i?(Te=i.id,i):(Je(),Ge([...Z,r]),Te=r.id,r)}function Ao(e){e.pinned||(Je(),Ge(Z.filter(t=>t.id!==e.id)),ve?.id===e.id&&(ve=null),ie?.id===e.id&&(ie=null))}function ei(e){let t=ce.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function st(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function nn(){return W.length>=2?W[W.length-2]:void 0}function on(){if(W.length<2)return[];let e=[];for(let[t,o]of Lt(W))for(let n of mt(t,o)){if(n.extension||!n.label)continue;let r=mn(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:fn(r)})}return e}function de(e){let t=W[W.length-1],o=oe&&W.some(u=>u.el===oe.el),n=Z.map(st),r=!ie&&ve?ve:null,i=Z.filter(u=>u.locked||u.id===r?.id),a=!r&&o?oe.el:null,l=r??a,c=r?st(r):null,x=[],w=(u,f)=>{for(let v of u)x.push(l&&!f?{...v,faded:!0}:v)},S=u=>!c||u.axis!==c.axis?!1:(u.axis==="x"?[u.x1,u.x2]:[u.y1,u.y2]).some(v=>Math.abs(v-c.pos)<.5);for(let[u,f]of Lt(W))w(mt(u,f),u.el===a||f.el===a);t&&oe&&!o&&!r&&w(mt(t,oe),!0);for(let u of i)for(let f of W)w(Rt(f,[st(u)]),u.id===r?.id||f.el===a);oe&&!o&&!r&&Z.length&&w(Rt(oe,n),!0);for(let u of Ln(i.map(st),{x:innerWidth/2,y:innerHeight/2}))w([u],S(u));Y?.update({hover:oe,pinned:W,rulers:ze,hidden:je,grid:Ve&&ce.grid?ce.grid:null,pixels:qe,guides:Z,liveGuide:ie??ve,activeGuide:Te,lines:x,...e?{cursor:e}:{}}),Ce?.update(W.length,{edit:Ie.armed,rulers:ze,xray:Fe,grid:Ve,pixels:qe,freeze:vt(),type:he?.showsType()??!1,hide:je,canCopy:W.length>0,canUndo:He.depth()>0,panel:he?.isOpen()??!1})}function ti(){let e=he?.asText()??"";if(!e)return;let t=n=>Ce?.acknowledge("copy",n),o=navigator.clipboard?.writeText(e);o?o.then(()=>t(!0),()=>t(!1)):t(!1)}function ni(e,t){return e.length===t.length&&e.every((o,n)=>{let r=t[n];return o.id===r.id&&o.axis===r.axis&&o.at===r.at&&o.locked===r.locked&&o.pinned===r.pinned})}function oi(){for(;He.depth()>0&&ni(He.peek(),Z);)He.pop();let e=He.pop();e&&(Ge(e),ve=null,ie=null,be=null,e.some(t=>t.id===Te)||(Te=null))}function fe(e){switch(e){case"rulers":ze=!ze,$t("rulers",ze);break;case"xray":Fe=!Fe,Qt(Fe);break;case"grid":Ve=!Ve,$t("grid",Ve);break;case"pixels":qe=!qe,$t("pixels",qe);break;case"freeze":qt(!vt());break;case"type":he?.toggleType();break;case"panel":he?.toggle();break;case"hide":je=!je,he?.setHidden(je),je&&Ze?.close();break;case"copy":ti();break;case"pick":Ze?.open();break;case"edit":if(Ie.armed){let t=Ie.disarm();Ce?.acknowledge("edit",t>=0)}else Ie.arm();Be?.setArmed(Ie.armed),W.length&&de();break;case"undo":oi();break}de()}var Et=null;function Lo(e){if(Et={x:e.clientX,y:e.clientY},ie){be&&Math.hypot(e.clientX-be.x,e.clientY-be.y)>Zr&&(be=null),!be&&!ie.pinned&&(To(ie,e.clientX,e.clientY,tn(e)),Ge([...Z])),de({x:e.clientX,y:e.clientY});return}ve=Nt(Z,e.clientX,e.clientY),oe=Pe(e.clientX,e.clientY,ce),de({x:e.clientX,y:e.clientY})}function No(e){ie&&(be?(ie.locked=!ie.locked,Te=ie.id,Ge([...Z])):(Co(e.clientX,e.clientY)||e.clientX<Ue||e.clientY<Ue)&&Ao(ie),be=null,ie=null,de({x:e.clientX,y:e.clientY}))}function Ct(e){let t=Y?.root.host;return t?(e.composedPath?.()??[]).includes(t):!1}function Ro(e){if(e.button!==0||Ct(e))return;let t=Pe(e.clientX,e.clientY,ce);if(!t)return;let o=Co(e.clientX,e.clientY);if(o){Qe(e),be=null,ie=Mo(o,e.clientX,e.clientY,tn(e)),de({x:e.clientX,y:e.clientY});return}let n=Nt(Z,e.clientX,e.clientY);if(n){Qe(e),Je(),Te=n.id,ie=n,be={x:e.clientX,y:e.clientY},de({x:e.clientX,y:e.clientY});return}Qe(e),Ce?.closeHelp(),W=[t],oe=t,he?.show(t,on(),nn()),Be?.show(t.el),de({x:e.clientX,y:e.clientY})}function Go(e){if(Ct(e))return;let t=Pe(e.clientX,e.clientY,ce);if(!t)return;Qe(e),Ce?.closeHelp();let o=W.findIndex(r=>r.el===t.el);W=o>=0?W.filter((r,i)=>i!==o):[...W,t],oe=t;let n=W[W.length-1];n?he?.show(n,on(),nn()):he?.hide(),Be?.show(n?.el??null),de({x:e.clientX,y:e.clientY})}function Bo(e){Ct(e)||Pe(e.clientX,e.clientY,ce)&&Qe(e)}function Po(e){Ct(e)||Pe(e.clientX,e.clientY,ce)&&Qe(e)}function Qe(e){e.preventDefault(),e.stopPropagation()}function wo(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var vo=0,ko=0;function Do(){St=requestAnimationFrame(Do);let t=W.filter(l=>l.el.isConnected).map(l=>ht(l.el)),o=oe&&oe.el.isConnected?ht(oe.el):null;if(!(scrollX!==vo||scrollY!==ko||t.length!==W.length||t.some((l,c)=>!wo(l,W[c]))||oe===null!=(o===null)||oe!==null&&o!==null&&!wo(oe,o)))return;vo=scrollX,ko=scrollY,W=t,oe=o;let i=W[W.length-1],a=ri();a!==$o&&($o=a,i?he?.show(i,on(),nn()):he?.hide(),Be?.show(i?.el??null)),de()}var $o="";function ri(){let e=W[0];return e?W.map(t=>[t.label,Math.round(t.width*100),Math.round(t.height*100),Math.round((t.left-e.left)*100),Math.round((t.top-e.top)*100)].join(",")).join(";"):""}function Oo(){Y?.resize()}function ii(){yo||(yo=!0,Z=go().map(e=>({...e,id:So++}))),!Y&&(On(),Y=lo(),he=zn(Y.root),Ce=_n(Y.root,fe),Be=ao(Y.root,Ie),Ze=uo(Y.root),Ce.update(0,{rulers:ze,xray:Fe,grid:Ve,pixels:qe,freeze:vt(),type:!1,panel:!1,hide:!1,edit:!1,canCopy:!1,canUndo:!1}),addEventListener("mousemove",Lo),addEventListener("mousedown",Ro,{capture:!0}),addEventListener("mouseup",No,{capture:!0}),addEventListener("click",Bo,{capture:!0}),addEventListener("auxclick",Po,{capture:!0}),addEventListener("contextmenu",Go,{capture:!0}),addEventListener("resize",Oo),St=requestAnimationFrame(Do),de())}function en(){removeEventListener("mousemove",Lo),removeEventListener("mousedown",Ro,{capture:!0}),removeEventListener("mouseup",No,{capture:!0}),removeEventListener("click",Bo,{capture:!0}),removeEventListener("auxclick",Po,{capture:!0}),removeEventListener("contextmenu",Go,{capture:!0}),removeEventListener("resize",Oo),cancelAnimationFrame(St),St=0,Ce?.destroy(),Be?.destroy(),Be=null,Ze?.destroy(),Ze=null,Fe&&(Fe=!1,Qt(!1)),qt(!1),Ie.disarm(),Ce=null,he?.destroy(),he=null,Y?.destroy(),Y=null,In(),oe=null,W=[],ie=null,be=null,ve=null}function ai(e){let t=e.composedPath?.()[0]??e.target;return!t||typeof t!="object"||!("tagName"in t)?!1:t.isContentEditable?!0:t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT"}function Eo(e){if(ei(e))e.preventDefault(),Y?en():ii();else if(!ai(e)){if(Y&&Et&&(e.key.toLowerCase()===ce.guideKeys.vertical||e.key.toLowerCase()===ce.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===ce.guideKeys.vertical?"x":"y";Mo(t,Et.x,Et.y,tn(e)),de()}else if(Y&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(Z.some(t=>!t.pinned)&&Je(),Ge(Z.filter(t=>t.pinned)),ve=null,ie=null,be=null,Z.some(t=>t.id===Te)||(Te=null)):ve&&Ao(ve),de();else if(Y&&e.key.startsWith("Arrow")){let t=xo(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;Je(`nudge:${t.id}`);let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",Ge([...Z]),de()}else if(Y&&e.key.toLowerCase()==="g"){e.preventDefault(),fe("grid");return}else if(Y&&e.key.toLowerCase()==="k"){e.preventDefault(),fe("pixels");return}else if(Y&&e.key==="\\"){e.preventDefault(),fe("hide");return}else if(Y&&e.key.toLowerCase()==="e"){e.preventDefault(),fe("edit");return}else if(Y&&e.key.toLowerCase()==="f"){e.preventDefault(),fe("freeze");return}else if(Y&&e.key.toLowerCase()==="x"){e.preventDefault(),fe("xray");return}else if(Y&&e.key.toLowerCase()==="p"){e.preventDefault(),fe("pick");return}else if(Y&&e.key.toLowerCase()==="t"){e.preventDefault(),fe("type");return}else if(Y&&e.key.toLowerCase()==="c"){e.preventDefault(),fe("copy");return}else if(Y&&e.key.toLowerCase()==="l"){let t=xo();if(!t)return;e.preventDefault(),Je(),t.pinned=!t.pinned,Ge([...Z]),de()}else if(Y&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){if(He.depth()===0)return;e.preventDefault(),fe("undo");return}else if(Y&&e.key.toLowerCase()===ce.rulerKey){e.preventDefault(),fe("rulers");return}else if(Y&&e.key.toLowerCase()===ce.panelKey){e.preventDefault(),fe("panel");return}else if(e.key==="Escape"&&Y){if(Ze?.close()||Ce?.closeHelp())return;W.length?(W=[],he?.hide(),Be?.show(null),de()):en()}}}function ra(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,ce=En(e),Fn(ce.theme),addEventListener("keydown",Eo,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{en(),removeEventListener("keydown",Eo,{capture:!0}),delete window.__align})}export{ra as initAlign};
