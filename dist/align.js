function X(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function _n(e){return(e.split(",")[0]??"").trim().replace(/^['"]|['"]$/g,"")}function jn(e){let o={100:"thin",200:"extralight",300:"light",400:"regular",500:"medium",600:"semibold",700:"bold",800:"extrabold",900:"black"}[e.trim()];return o?`${e} ${o}`:e}function De(e){let t=getComputedStyle(e);return[{label:"family",value:_n(t.fontFamily),px:NaN},{label:"size",value:t.fontSize,px:X(t.fontSize)},{label:"weight",value:jn(t.fontWeight),px:NaN},{label:"line",value:t.lineHeight,px:X(t.lineHeight)},{label:"tracking",value:t.letterSpacing,px:X(t.letterSpacing)}]}function Nt(e){let t="";for(let o of e.childNodes)o.nodeType===3&&(t+=o.nodeValue??"");return t.trim().replace(/\s+/g," ")}function Dt(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:X(r)})}return o}function Un(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function qn(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function Ot(e,t){return t.length===0?"":qn(e).map(o=>{let n=Un(o,t);return n.length?`${o} ${n.join(" ")}`:`${o} \u2014`}).join("  \xB7  ")}function Tt(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(X)}function Pt(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),l=a.display.includes("flex")||a.display.includes("grid"),s=n==="x"?a.columnGap:a.rowGap,x=l&&s!=="normal"?X(s):null,[d,g,c,y]=Tt(e),[S,p,T,M]=Tt(t),b=O=>Number.isFinite(O)?O:0,B=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,K=n==="x"?B?b(g)+b(M):b(p)+b(y):B?b(c)+b(S):b(T)+b(d);return{px:o,cssGap:x,margins:K,siblings:!0}}function Ft(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function It(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}function Je(e){let t=e.trim().toLowerCase();return t?t.startsWith("#")||/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(t)?!0:["black","white","transparent","currentcolor"].includes(t):!1}var re;function Rt(e){if(re===void 0&&(re=document.createElement("canvas").getContext("2d")),!re)return"";re.fillStyle="#000000",re.fillStyle=e;let t=re.fillStyle;return re.fillStyle="#ffffff",re.fillStyle=e,t===re.fillStyle?String(t):""}function zt(e,t){let o=Rt(e);return o?t.filter(n=>Je(n.value)&&Rt(n.value)===o).map(n=>n.name).sort():[]}function Ht(e){let t=getComputedStyle(e),o=[],n=(r,i)=>{let a=i.trim();!a||a==="transparent"||/rgba?\([^)]*,\s*0\s*\)$/.test(a)||o.push({label:r,value:a})};return n("text",t.color),n("background",t.backgroundColor),o}function Vn(e,t,o){let n=r=>typeof CSS<"u"&&CSS.escape?CSS.escape(r):r.replace(/[^\w-]/g,"\\$&");return t?`#${n(t)}`:o.length?e+o.map(r=>`.${n(r)}`).join(""):e}function Qe(e){let t=typeof e.className=="string"?e.className.trim().split(/\s+/).filter(Boolean):[];return Vn(e.tagName.toLowerCase(),e.id,t)}function Wt(e){let t=Qe(e);if(!/[.#]/.test(t))return 0;try{return document.querySelectorAll(t).length}catch{return 0}}function Jn(e){if(!e)return"inline <style>";let t=e.split("?")[0]??e;try{let o=new URL(t,"http://x").pathname;return decodeURI(o).replace(/^\//,"")||t}catch{return t}}var Qn=["width","height","padding","margin","border-width","gap","font-size","line-height","letter-spacing","color","background-color"];function Zn(e){for(let t=0;t<e.length;t+=1){let o=e.item(t);if(Qn.some(n=>o===n||o.startsWith(`${n}-`)))return!0}return!1}function Xt(e){let t=[],o=new Set,n=(r,i)=>{for(let a of Array.from(r)){if(a instanceof CSSMediaRule){matchMedia(a.conditionText).matches&&n(a.cssRules,i);continue}if(a instanceof CSSSupportsRule){CSS.supports(a.conditionText)&&n(a.cssRules,i);continue}let l=a.cssRules;if(l&&!(a instanceof CSSStyleRule)){n(l,i);continue}if(!(a instanceof CSSStyleRule))continue;let s=!1;try{s=e.matches(a.selectorText)}catch{continue}if(!s||!Zn(a.style))continue;let x=`${a.selectorText}|${i}`;o.has(x)||(o.add(x),t.push({selector:a.selectorText,file:i}))}};for(let r of Array.from(document.styleSheets)){if(r.ownerNode instanceof Element&&r.ownerNode.hasAttribute("data-align-ignore"))continue;let i;try{i=r.cssRules}catch{continue}n(i,Jn(r.href))}return t.reverse()}function Lt(e){if(!e||e==="none")return[];let t=e.trim().split(/\s+/),o=[];for(let n of t){if(!n.endsWith("px"))return[];let r=Number.parseFloat(n);if(!Number.isFinite(r))return[];o.push(r)}return o}function Mt(e,t,o){let n=0;for(let r=0;r<e.length;r+=1){let i=n+e[r];if(o<i+.5)return r;n=i+t}return-1}function eo(e,t){let o=t==="rtl";return e.startsWith("vertical")||e.startsWith("sideways")?{inline:"y",inlineReversed:e==="sideways-lr"?!o:o,blockReversed:e==="vertical-rl"||e==="sideways-rl"}:{inline:"x",inlineReversed:o,blockReversed:!1}}function Gt(e,t,o,n,r){return r?t-n:o-e}function Yt(e){let t=e.parentElement;if(!t)return null;let o=getComputedStyle(t),n=getComputedStyle(e),r=o.display,i=[];if(n.position==="absolute"||n.position==="fixed")return i.push({label:"placed by",value:`${n.position}, not by the parent`}),{display:r,rows:i};if(n.float!=="none")return i.push({label:"placed by",value:`float: ${n.float}`}),{display:r,rows:i};let a=r.includes("flex"),l=r.includes("grid");if(!a&&!l)return i.push({label:"flow",value:r}),{display:r,rows:i};let s=At(o.rowGap==="normal"?"0px":o.rowGap),x=At(o.columnGap==="normal"?"0px":o.columnGap),d=s===x?s:`row ${s} \xB7 column ${x}`;if(a){let H=o.flexDirection;i.push({label:"direction",value:o.flexWrap==="nowrap"?H:`${H} \xB7 ${o.flexWrap}`}),i.push({label:"justify",value:o.justifyContent}),i.push({label:"align",value:o.alignItems}),i.push({label:"gap",value:d});let W=`${n.flexGrow} ${n.flexShrink} ${n.flexBasis}`;return W!=="0 1 auto"&&i.push({label:"this child",value:`flex: ${W}`}),n.alignSelf!=="auto"&&i.push({label:"align-self",value:n.alignSelf}),{display:r,rows:i}}let g=Lt(o.gridTemplateColumns),c=Lt(o.gridTemplateRows);g.length&&i.push({label:"columns",value:`${g.length} \xB7 ${g.map(Ve).join(" ")}`}),c.length&&i.push({label:"rows",value:`${c.length} \xB7 ${c.map(Ve).join(" ")}`}),i.push({label:"gap",value:d});let y=t.getBoundingClientRect(),S=e.getBoundingClientRect(),p={left:y.left+X(o.borderLeftWidth)+X(o.paddingLeft),right:y.right-X(o.borderRightWidth)-X(o.paddingRight),top:y.top+X(o.borderTopWidth)+X(o.paddingTop),bottom:y.bottom-X(o.borderBottomWidth)-X(o.paddingBottom)},T=eo(o.writingMode,o.direction),M=(H,W)=>H==="x"?Gt(p.left,p.right,S.left,S.right,W):Gt(p.top,p.bottom,S.top,S.bottom,W),b=T.inline==="x"?"y":"x",B=X(o.columnGap==="normal"?"0":o.columnGap),K=X(o.rowGap==="normal"?"0":o.rowGap),O=Mt(g,B,M(T.inline,T.inlineReversed)),U=Mt(c,K,M(b,T.blockReversed)),I=[];return O>=0&&I.push(`column ${O+1} of ${g.length}`),U>=0&&I.push(`row ${U+1} of ${c.length}`),I.length&&i.push({label:"this child",value:I.join(" \xB7 ")}),{display:r,rows:i}}function At(e){return e.endsWith("px")?Ve(Number.parseFloat(e)):e}function Ve(e){return String(Math.round(e*100)/100)}var Kt=["display","position","width","height","padding","margin","border-width","border-style","border-radius","font-family","font-size","font-weight","font-style","line-height","letter-spacing","text-transform","text-align","color","background-color","border-color","opacity","flex-direction","justify-content","align-items","gap","flex-grow","flex-shrink","flex-basis","align-self","box-shadow","overflow","text-overflow","white-space"];function to(e,t){let o=[];for(let n of Kt){let r=e[n]??"",i=t[n]??"";r!==i&&o.push({prop:n,a:r,b:i})}return o}function Bt(e){let t=getComputedStyle(e),o={};for(let n of Kt)o[n]=t.getPropertyValue(n);return o}function _t(e,t){return to(Bt(e),Bt(t))}var no={ignore:"",grid:null,hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function Ut(e={}){return{...no,...e}}var jt=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function qt(e){return e.ignore?`${jt}, ${e.ignore}`:jt}function E(e){return String(Math.round(e*100)/100)}function oo(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function Fe(e){let t=e.getBoundingClientRect();return{el:e,label:oo(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height,scale:ze(e)}}function Vt(e,t){let o=(n,r)=>Math.abs(n-r)<.001;return o(e.scale.x,t.scale.x)&&o(e.scale.y,t.scale.y)?e.scale:{x:1,y:1}}function Jt(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function pe(e,t,o){let n=qt(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=Jt(r);return r&&r!==document.documentElement?Fe(r):null}var Oe=e=>parseFloat(e)||0;function Ze(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[Oe(n),Oe(r),Oe(i),Oe(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function ro(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function io(e,t){let o=Vt(e,t),n=t.left+t.width/2,r=t.top+t.height/2;return[{x1:e.left,y1:r,x2:t.left,y2:r,label:E((t.left-e.left)/o.x),axis:"x"},{x1:t.right,y1:r,x2:e.right,y2:r,label:E((e.right-t.right)/o.x),axis:"x"},{x1:n,y1:e.top,x2:n,y2:t.top,label:E((t.top-e.top)/o.y),axis:"y"},{x1:n,y1:t.bottom,x2:n,y2:e.bottom,label:E((e.bottom-t.bottom)/o.y),axis:"y"}]}function Pe(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function Ie(e,t){let o=[],n=Vt(e,t),r=e.left<t.right&&t.left<e.right,i=e.top<t.bottom&&t.top<e.bottom;if(r&&i){let[a,l]=ro(e,t);return io(a,l)}if(!r){let[a,l]=e.right<=t.left?[e,t]:[t,e],s=i?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:a.right,y1:s,x2:l.left,y2:s,label:`${E((l.left-a.right)/n.x)}`,axis:"x"}),o.push(...Pe(a.right,a.top,a.bottom,s,"x")),o.push(...Pe(l.left,l.top,l.bottom,s,"x"))}if(!i){let[a,l]=e.bottom<=t.top?[e,t]:[t,e],s=r?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:s,y1:a.bottom,x2:s,y2:l.top,label:`${E((l.top-a.bottom)/n.y)}`,axis:"y"}),o.push(...Pe(a.bottom,a.left,a.right,s,"y")),o.push(...Pe(l.top,l.left,l.right,s,"y"))}return o}function ao(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function et(e){let t=ao(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var lo=5,so=8;function Te(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function tt(e,t,o){let n=null,r=lo;for(let i of e){let a=Math.abs(Te(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function Qt(e,t,o){if(o)return{at:e,what:""};let n=null,r=so;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function Zt(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function nt(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,l=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:l,y2:i,label:E(r.gap),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,l=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:l,label:E(r.gap),axis:"y"})}}return o}function en(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],l=r[i],s=l-a;s<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:l,y2:t.y,label:E(s),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:l,label:E(s),axis:"y"}))}}return o}var se=3;function co(e,t){return e.x<t.x+t.w+se&&t.x<e.x+e.w+se&&e.y<t.y+t.h+se&&t.y<e.y+e.h+se}function tn(e,t,o=12){let n=(a,l)=>Math.min(Math.max(a,o),t.w-l-o),r=(a,l)=>Math.min(Math.max(a,o),t.h-l-o),i=[];for(let a of e){let l={...a,x:n(a.x,a.w),y:r(a.y,a.h)},s=!1;for(let x=0;x<16;x++){let d=i.find(c=>co(c,l));if(!d)break;let g=l.axis==="x"?l.y:l.x;if(l.axis==="x"?l.y=r(s?d.y+d.h+se:d.y-l.h-se,l.h):l.x=n(s?d.x-l.w-se:d.x+d.w+se,l.w),(l.axis==="x"?l.y:l.x)===g){if(s)break;s=!0}}i.push(l)}return i}function nn(e,t){let{columns:o,gutter:n,margin:r}=e;if(o<=0)return[];let i=e.maxWidth>0?Math.min(e.maxWidth,t):t,a=Math.max(0,(t-i)/2),s=(Math.max(0,i-r*2)-n*(o-1))/o;if(s<=0)return[];let x=[];for(let d=0;d<o;d+=1)x.push({left:a+r+d*(s+n),width:s});return x}function on(e,t){return e*t>=8?e:0}function uo(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(l=>parseFloat(l)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function ze(e){let t=1,o=1;for(let n=e;n;n=Jt(n)){let r=uo(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var Z=(e,t)=>({light:e,dark:t}),ot={accent:Z("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:Z("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:Z("oklch(1 0 0)","oklch(0.264 0 0)"),fg:Z("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:Z("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:Z("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:Z("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:Z("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)"),pixelLine:Z("oklch(0.205 0 0 / 0.14)","oklch(0.97 0 0 / 0.14)")};function an(e){return`light-dark(${e.light}, ${e.dark})`}var ie=an(Z("#fafafa","#1a1a1a"));function Re(e){return an(Z(`rgb(0 0 0 / ${e})`,`rgb(255 255 255 / ${e})`))}var rn=[0,.07,.08,.1,.12,.15,.2];function q(e){let t=rn[Math.max(0,Math.min(rn.length-1,e))];return t===0?ie:Re(t)}var N={primary:Re(.9),secondary:Re(.6),tertiary:Re(.4)},ce=Re(.12),me="0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)",ln="0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)",k=22;var po='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',C={title:13,body:12,tag:11,stack:po},z={regular:400,medium:500,semibold:600},rt="__align_font",mo="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function sn(){if(document.getElementById(rt))return;let e=document.createElement("link");e.id=rt,e.rel="stylesheet",e.href=mo,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function cn(){document.getElementById(rt)?.remove()}function un(e){let t=[`${z.medium} ${C.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function it(e){let t={};for(let o of Object.keys(ot))t[o]=e?ot[o].dark:ot[o].light;return t}function at(){let e=document.documentElement,t=getComputedStyle(e).colorScheme;if(/dark/.test(t)&&!/light/.test(t))return!0;if(/light/.test(t)&&!/dark/.test(t))return!1;for(let o of[document.body,e]){if(!o)continue;let n=fo(getComputedStyle(o).backgroundColor);if(n!==null)return n<.5}return matchMedia("(prefers-color-scheme: dark)").matches}function fo(e){let t=/^rgba?\(([^)]+)\)$/.exec(e.trim());if(!t)return null;let o=t[1].split(/[\s,/]+/).filter(Boolean).map(Number),[n,r,i,a=1]=o;return n===void 0||r===void 0||i===void 0||a<.5?null:(.2126*n+.7152*r+.0722*i)/255}function ye(e,t){return e.replace(/\)$/,` / ${t})`)}var ho=`
`,ae=16,go=`
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

  box-shadow: ${me};

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
  font-size: ${C.title}px; font-weight: ${z.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${C.body}px; font-weight: ${z.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${C.tag}px; font-weight: ${z.medium};
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
  font-size: ${C.tag}px; font-weight: ${z.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${z.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${z.regular}; }
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
  text-align: center; font-weight: ${z.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,Le=ae,fe=-1,be=!1;function dn(e){let t=document.createElement("style");t.textContent=go,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);let r=!1;function i(p,T){let M=document.createElement("div");M.className="readout";let b=document.createElement("div");b.className="tag readout-tag",b.textContent=p,M.appendChild(b);let B=document.createElement("div");B.className="readout-rows",M.appendChild(B);for(let[K,O]of T){let U=document.createElement("div");U.className="readout-row";let I=document.createElement("span");I.className="readout-key",I.textContent=K;let H=document.createElement("span");H.className="readout-value",H.textContent=O,U.append(I,H),B.appendChild(U)}return M}e.appendChild(o);let a=(p,T)=>Math.min(Math.max(p,ae),Math.max(ae,T-ae));function l(){let p=o.offsetHeight||300;fe<0&&(fe=Math.max(ae,innerHeight-p-ae)),Le=a(Le,innerWidth-o.offsetWidth),fe=a(fe,innerHeight-p),o.style.transform=`translate(${Le-ae}px, ${fe}px)`}let s=null;function x(p){p.button===0&&(p.preventDefault(),p.stopPropagation(),s={x:p.clientX,y:p.clientY,dx:Le,dy:fe},o.setAttribute("data-dragging",""),p.currentTarget.setPointerCapture(p.pointerId))}function d(p){s&&(Le=s.dx+(p.clientX-s.x),fe=s.dy+(p.clientY-s.y),l())}function g(){s=null,o.removeAttribute("data-dragging")}addEventListener("resize",l);let c=null;function y(p){let T=document.createElement("div");return T.className="edge",T.textContent=p===0?"0":E(p),p===0&&T.setAttribute("data-zero",""),T}function S(p,T,M,b){let[B,K,O,U]=M,I=document.createElement("div");I.className="region",I.setAttribute("data-level",String(T));let H=document.createElement("span");H.className="tag",H.textContent=p;let W=document.createElement("div");W.className="row";let u=document.createElement("div");u.className="fill",u.appendChild(b),W.append(y(U),u,y(K));let h=document.createElement("div");return h.className="head",h.append(H,y(B)),I.append(h,W,y(O)),I}return{show(p,T=[],M){let b=Ze(p.el),[B,K,O,U]=b.border,[I,H,W,u]=b.padding,h=ze(p.el),m=p.width/h.x,G=p.height/h.y,v=Math.abs(h.x-1)>.001||Math.abs(h.y-1)>.001,f=document.createElement("header"),R=document.createElement("span");R.className="name",R.textContent=p.label;let J=document.createElement("span");J.className="size",J.textContent=`${E(m)} \xD7 ${E(G)}`;let xe=document.createElement("button");if(xe.className="close",xe.textContent="\xD7",xe.title="close (B brings it back)",xe.addEventListener("pointerdown",w=>w.stopPropagation()),xe.addEventListener("click",w=>{w.stopPropagation(),be=!0,o.removeAttribute("data-open")}),f.append(R,J),v){let w=document.createElement("span");w.className="scale",w.textContent=`\xD7${E(h.x)}`,w.title=`renders at ${E(p.width)} \xD7 ${E(p.height)}`,f.appendChild(w)}f.appendChild(xe),f.addEventListener("pointerdown",x),f.addEventListener("pointermove",d),f.addEventListener("pointerup",g),f.addEventListener("pointercancel",g);let qe=document.createElement("div");qe.className="content",qe.textContent=`${E(m-U-K-u-H)} \xD7 ${E(G-B-O-I-W)}`;let oe=[f,S("margin",1,b.margin,S("border",2,b.border,S("padding",3,b.padding,qe)))];if(r){let w=Nt(p.el),V=De(p.el);oe.push(V.length&&w?i("type",V.map(_=>[_.label,_.value])):i("type",[["","nothing of its own to set type on"]]))}if(M&&M.el!==p.el&&M.el.isConnected){let w=_t(M.el,p.el).map(_=>[_.prop,`${_.a||"\u2014"} \u2192 ${_.b||"\u2014"}`]),V=w.slice(0,10);w.length>V.length&&V.push(["",`and ${w.length-V.length} more`]),oe.push(i(`differs from ${M.label}`,V.length?V:[["","nothing in the properties it compares"]]))}let Ne=Yt(p.el);if(Ne&&Ne.rows.length&&oe.push(i(`laid out by ${Ne.display}`,Ne.rows.map(w=>[w.label,w.value]))),T.length){let w=T.map(_=>[E(_.px),_.detail]),V=It(T.map(_=>_.px));V&&w.push(["",V]),oe.push(i("gaps",w))}let wt=Dt(p.el),kt=Ot([m,G,...b.margin,...b.border,...b.padding,...r?De(p.el).map(w=>w.px):[]],wt);kt&&oe.push(i("tokens",[["",kt]]));let St=Xt(p.el);St.length&&oe.push(i("styled by",St.slice(0,4).map(w=>[w.selector,w.file])));let $t=Wt(p.el);$t>1&&oe.push(i("matches",[["",`${$t} elements share ${Qe(p.el)}`]]));let Et=wt.filter(w=>Je(w.value));if(Et.length){let w=Ht(p.el).map(({label:V,value:_})=>{let Ct=zt(_,Et);return[V,Ct.length?`${_}  ${Ct.join(" ")}`:`${_}  \u2014`]});w.length&&oe.push(i("colour",w))}n.replaceChildren(...oe),c=p,l(),!be&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},showsType:()=>r,isOpen:()=>!be&&c!==null,toggleType(){r=!r,c&&this.show(c)},asText(){if(!c)return"";let p=Ze(c.el),T=ze(c.el),M=c.width/T.x,b=c.height/T.y,B=O=>O.map(U=>E(U)).join(" "),K=[`${c.label}  ${E(M)} \xD7 ${E(b)}`,`margin   ${B(p.margin)}`,`border   ${B(p.border)}`,`padding  ${B(p.padding)}`];if(r)for(let O of De(c.el))K.push(`${O.label.padEnd(8)} ${O.value}`);return K.join(ho)},hide(){c=null,o.removeAttribute("data-open")},toggle(){c&&(be=!be,be?o.removeAttribute("data-open"):(l(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",l),o.remove(),t.remove()}}}function pn(e=20,t=1e3){let o=[];return{push(n,r,i=Date.now()){let a=o[o.length-1];if(a&&r!==""&&a.tag===r&&i-a.at<=t){a.at=i;return}o.push({state:n,tag:r,at:i}),o.length>e&&o.shift()},pop(){return o.pop()?.state??null},depth(){return o.length},clear(){o.length=0}}}var xo=[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure what is under the cursor"],["Click","lock an element"],["Right-click","add to, or drop from, the locked set"],["Drag the panel header","move the box model"],["B","hide or bring back the box model"],["R","rulers down the top and left edges"],["Drag from a rule","pull out a guide; drag it back to remove"],["V","vertical guide at the cursor"],["H","horizontal guide at the cursor"],["Hover a guide","distance from it to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the last guide you touched; Shift for 10px"],["L","pin that guide so it cannot be moved or deleted"],["Ctrl/Cmd + Z","undo the last change \u2014 a run of nudges counts as one"],["T","type and token readout for the locked element"],["F","freeze the page so a moving thing can be measured"],["G","your column grid, if one is configured"],["K","a ten-pixel texture to read against"],["X","x-ray: outline every element on the page"],["P","pick a colour from anywhere on screen"],["C","copy the numbers in the panel"],["Ctrl/Cmd while placing","ignore snapping"],["Del","remove the guide under the cursor; Shift+Del for all"],["Esc","clear the locks, then close"]],he=16,lt=C.tag+12,st=8,yo=`
.flag {
  position: fixed; top: ${he}px; right: ${he}px;
  display: flex; align-items: center; gap: 8px;
  transition: top 160ms cubic-bezier(0.19, 1, 0.22, 1);
  padding: 6px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${C.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${C.tag}px; font-weight: ${z.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${N.primary};
  background: ${ie};
  box-shadow: ${me};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
/* The rulers draw a gutter along the top edge, and the badge sits in it. Step
   down out of the way rather than covering the ticks the rulers exist to show. */
.flag[data-rulers] { top: ${he+k}px; }
.help[data-rulers] { top: ${he+k+lt+st}px; }
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
  font: inherit; font-size: ${C.tag}px; font-weight: ${z.medium};
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
  box-shadow: ${me};
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
  font: inherit; font-weight: ${z.medium};
  border: 1px solid ${ce};
  background: ${q(2)};
}
.help dd { margin: 0; color: ${N.secondary}; }
`,mn=[{name:"rulers",label:"R",title:"rulers down the top and left edges",toggle:!0},{name:"xray",label:"X",title:"outline every element on the page",toggle:!0},{name:"grid",label:"G",title:"your column grid, if one is configured",toggle:!0},{name:"pixels",label:"K",title:"a ten-pixel texture to read against",toggle:!0},{name:"type",label:"T",title:"type and token readout",toggle:!0},{name:"panel",label:"B",title:"the box model panel",toggle:!0},{name:"freeze",label:"F",title:"hold the page still",toggle:!0},{name:"copy",label:"C",title:"copy the numbers in the panel",toggle:!1},{name:"pick",label:"P",title:"pick a colour from anywhere on screen",toggle:!1},{name:"undo",label:"\u21BA",title:"undo the last change to the guides",toggle:!1}];function fn(e,t){let o=document.createElement("style");o.textContent=yo,e.appendChild(o);let n=document.createElement("div");n.className="flag";let r=document.createElement("span");r.className="name",r.textContent="Align";let i=document.createElement("span");i.className="count";let a=new Map,l=document.createElement("div");l.className="tools";for(let d of mn){if(d.name==="freeze"||d.name==="copy"){let c=document.createElement("span");c.className="sep",l.appendChild(c)}let g=document.createElement("button");g.type="button",g.className="tool",g.textContent=d.label,g.title=`${d.title}  \xB7  ${d.name==="undo"?"Ctrl/Cmd+Z":d.label}`,d.toggle||g.setAttribute("data-once",""),g.addEventListener("click",c=>{c.stopPropagation(),t(d.name)}),a.set(d.name,g),l.appendChild(g)}n.append(r,l,i);let s=document.createElement("div");s.className="help";let x=document.createElement("dl");for(let[d,g]of xo){let c=document.createElement("dt"),y=document.createElement("kbd");y.textContent=d,c.appendChild(y);let S=document.createElement("dd");S.textContent=g,x.append(c,S)}return s.appendChild(x),n.addEventListener("click",d=>{d.stopPropagation(),s.toggleAttribute("data-open")}),e.append(n,s),{update(d,g){i.textContent=d>0?`${d} locked`:"",n.toggleAttribute("data-rulers",g.rulers),s.toggleAttribute("data-rulers",g.rulers);for(let c of mn)c.toggle&&a.get(c.name)?.toggleAttribute("data-on",g[c.name]===!0)},closeHelp(){let d=s.hasAttribute("data-open");return s.removeAttribute("data-open"),d},destroy(){n.remove(),s.remove(),o.remove()}}}var He=5,ct=4,Me=12,hn=.22,ve=10,bo=50,vo=100;function gn(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,grid:null,pixels:!1,guides:[],liveGuide:null,activeGuide:null},i=it(at()),a=0,l=null;function s(){let u=at();u!==l&&(l=u,i=it(u),e.style.colorScheme=u?"dark":"light",W())}s();let x=matchMedia("(prefers-color-scheme: dark)"),d=()=>s();x.addEventListener("change",d);let g=new MutationObserver(()=>s());function c(){g.disconnect(),g.observe(document.documentElement,{attributes:!0}),document.body&&g.observe(document.body,{attributes:!0})}c(),un(()=>W());function y(){let u=devicePixelRatio;o.width=Math.round(innerWidth*u),o.height=Math.round(innerHeight*u),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(u,0,0,u,0,0),n.translate(.5,.5)}let S=u=>Math.round(u)-.5;function p(u,h){n.strokeStyle=h,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(u.left),Math.round(u.top),Math.round(u.width),Math.round(u.height))}function T(u){n.strokeStyle=ye(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let h of[u.left,u.right])n.moveTo(Math.round(h),0),n.lineTo(Math.round(h),innerHeight);for(let h of[u.top,u.bottom])n.moveTo(0,Math.round(h)),n.lineTo(innerWidth,Math.round(h));n.stroke(),n.setLineDash([])}function M(u){if(n.strokeStyle=u.extension?ye(i.measure,.55):i.measure,n.lineWidth=1,n.setLineDash(u.extension?[3,3]:[]),n.beginPath(),n.moveTo(Math.round(u.x1),Math.round(u.y1)),n.lineTo(Math.round(u.x2),Math.round(u.y2)),u.extension){n.stroke();return}if(u.axis==="x")for(let h of[u.x1,u.x2])n.moveTo(Math.round(h),Math.round(u.y1)-He),n.lineTo(Math.round(h),Math.round(u.y1)+He);else for(let h of[u.y1,u.y2])n.moveTo(Math.round(u.x1)-He,Math.round(h)),n.lineTo(Math.round(u.x1)+He,Math.round(h));n.stroke()}function b(u){return n.font=`${z.medium} ${C.body}px ${C.stack}`,{w:n.measureText(u).width+ct*2,h:C.body+ct*2+2}}function B(u,h,m,G){n.font=`${z.medium} ${C.body}px ${C.stack}`,n.textBaseline="middle";let{w:v,h:f}=b(u),R=S(Math.min(Math.max(h,Me),innerWidth-v-Me)),J=S(Math.min(Math.max(m,Me),innerHeight-f-Me));n.fillStyle=G,n.beginPath(),n.roundRect(R,J,Math.ceil(v),f,4),n.fill(),n.fillStyle=i.surface,n.fillText(u,R+ct,J+f/2)}function K(u,h,m,G,v=!1){let{w:f,h:R}=b(u);B(u,v?h-f/2:h,v?m-R/2:m,G)}function O(){let u=scrollX,h=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,k),n.fillRect(-.5,-.5,k,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${z.regular} 9px ${C.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let f of r.pinned)n.fillRect(S(f.left),-.5,Math.round(f.width),k),n.fillRect(-.5,S(f.top),k,Math.round(f.height));n.restore(),n.beginPath(),n.moveTo(-.5,k-.5),n.lineTo(innerWidth,k-.5),n.moveTo(k-.5,-.5),n.lineTo(k-.5,innerHeight),n.stroke();let m=f=>f%vo===0?k:f%bo===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let G=Math.floor(u/ve)*ve;for(let f=G;f<u+innerWidth;f+=ve){let R=Math.round(f-u);if(R<k)continue;let J=m(f);n.moveTo(R,k-J),n.lineTo(R,k),J===k&&(n.fillStyle=i.muted,n.fillText(String(f),R+3,3))}n.stroke(),n.beginPath();let v=Math.floor(h/ve)*ve;for(let f=v;f<h+innerHeight;f+=ve){let R=Math.round(f-h);if(R<k)continue;let J=m(f);n.moveTo(k-J,R),n.lineTo(k,R),J===k&&(n.save(),n.translate(3,R-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(f),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),k),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo(k,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let f of r.guides){let R=Math.round(Te(f));f.axis==="x"?n.fillRect(R-1,-.5,2,k):n.fillRect(-.5,R-1,k,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,k,k),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,k,k)}function U(){let u=on(10,1);if(u){n.strokeStyle=i.pixelLine,n.lineWidth=1,n.setLineDash([]),n.beginPath();for(let h=0;h<=innerWidth;h+=u)n.moveTo(h,0),n.lineTo(h,innerHeight);for(let h=0;h<=innerHeight;h+=u)n.moveTo(0,h),n.lineTo(innerWidth,h);n.stroke()}}function I(u){let h=nn(u,document.documentElement.clientWidth);n.fillStyle=ye(i.measure,.08);for(let m of h)n.fillRect(S(m.left),-.5,Math.round(m.width),innerHeight+1)}function H(){a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore(),r.pixels&&U(),r.grid&&I(r.grid);for(let m of r.pinned)p(m,i.accent);r.hover&&(T(r.hover),p(r.hover,r.pinned.length?ye(i.accent,.7):i.accent));for(let m of r.guides){let G=r.liveGuide?.id===m.id;n.strokeStyle=m.locked||G?i.guide:ye(i.guide,.55),n.lineWidth=m.pinned?2:1,n.setLineDash(m.locked?[]:[4,4]),n.beginPath();let v=Math.round(Te(m));if(m.axis==="x"?(n.moveTo(v,0),n.lineTo(v,innerHeight)):(n.moveTo(0,v),n.lineTo(innerWidth,v)),n.stroke(),r.activeGuide===m.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let f=7;m.axis==="x"?(n.moveTo(v,0),n.lineTo(v,f),n.moveTo(v,innerHeight-f),n.lineTo(v,innerHeight)):(n.moveTo(0,v),n.lineTo(f,v),n.moveTo(innerWidth-f,v),n.lineTo(innerWidth,v)),n.stroke()}}for(let m of r.lines)n.globalAlpha=m.faded?hn:1,M(m);n.globalAlpha=1;let u=r.lines.filter(m=>m.label!==""),h=u.map(m=>{let G=(m.x1+m.x2)/2,v=(m.y1+m.y2)/2,{w:f,h:R}=b(m.label);return m.axis==="x"?{x:G-f/2,y:v-16-R/2,w:f,h:R,axis:m.axis}:{x:G+26-f/2,y:v-R/2,w:f,h:R,axis:m.axis}});if(tn(h,{w:innerWidth,h:innerHeight},Me).forEach((m,G)=>{let v=u[G];n.globalAlpha=v.faded?hn:1,B(v.label,m.x,m.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:m,height:G,scale:v}=r.hover;K(`${E(m/v.x)} \xD7 ${E(G/v.y)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let m=r.liveGuide,G=Math.round(Te(m));K([`${m.axis} ${E(m.at)}`,m.caught,m.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),m.axis==="x"?G+6:30,m.axis==="x"?30:G+6,i.guide)}r.rulers&&O()}function W(){a||(a=requestAnimationFrame(H))}return y(),{root:t,update(u){Object.assign(r,u),W()},resize(){y(),W()},destroy(){a&&cancelAnimationFrame(a),x.removeEventListener("change",d),g.disconnect(),e.remove()}}}function wo(e){let t=e.trim().replace(/^#/,""),o=t.length===3?t.split("").map(n=>n+n).join(""):t;return/^[0-9a-f]{6}$/i.test(o)?{r:parseInt(o.slice(0,2),16),g:parseInt(o.slice(2,4),16),b:parseInt(o.slice(4,6),16)}:null}function ko({r:e,g:t,b:o}){let n=r=>Math.round(r).toString(16).padStart(2,"0");return`#${n(e)}${n(t)}${n(o)}`}function So({r:e,g:t,b:o}){return`rgb(${Math.round(e)} ${Math.round(t)} ${Math.round(o)})`}function ge(e,t){return String(Number(e.toFixed(t)))}function $o({r:e,g:t,b:o}){let n=e/255,r=t/255,i=o/255,a=Math.max(n,r,i),l=Math.min(n,r,i),s=(a+l)/2,x=a-l,d=0,g=0;return x!==0&&(g=x/(1-Math.abs(2*s-1)),a===n?d=(r-i)/x%6:a===r?d=(i-n)/x+2:d=(n-r)/x+4,d*=60,d<0&&(d+=360)),`hsl(${ge(d,1)} ${ge(g*100,1)}% ${ge(s*100,1)}%)`}function ut(e){let t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4}function Eo(e){let t=ut(e.r),o=ut(e.g),n=ut(e.b),r=.4122214708*t+.5363325363*o+.0514459929*n,i=.2119034982*t+.6806995451*o+.1073969566*n,a=.0883024619*t+.2817188376*o+.6299787005*n,l=Math.cbrt(r),s=Math.cbrt(i),x=Math.cbrt(a),d=.2104542553*l+.793617785*s-.0040720468*x,g=1.9779984951*l-2.428592205*s+.4505937099*x,c=.0259040371*l+.7827717662*s-.808675766*x,y=Math.sqrt(g*g+c*c),S=Math.atan2(c,g)*180/Math.PI;return S<0&&(S+=360),y<1e-4?`oklch(${ge(d,4)} 0 0)`:`oklch(${ge(d,4)} ${ge(y,4)} ${ge(S,2)})`}function xn(e){let t=wo(e);return t?[{label:"hex",value:ko(t)},{label:"rgb",value:So(t)},{label:"hsl",value:$o(t)},{label:"oklch",value:Eo(t)}]:[]}var Co=`
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
  box-shadow: ${me};
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
`;function yn(e){let t=document.createElement("style");t.textContent=Co,e.appendChild(t);let o=document.createElement("div");o.className="picker",e.appendChild(o);let n=document.createElement("div");n.className="swatch";let r=document.createElement("div");r.className="hint";function i(a){n.style.background=a;let l=xn(a).map(({label:s,value:x})=>{let d=document.createElement("button");d.type="button";let g=document.createElement("span");g.className="k",g.textContent=s;let c=document.createElement("span");return c.className="v",c.textContent=x,d.append(g,c),d.addEventListener("click",y=>{y.stopPropagation(),navigator.clipboard?.writeText(x).then(()=>{r.textContent=`copied ${s}`},()=>{r.textContent="clipboard refused"})}),d});r.textContent="click a row to copy",o.replaceChildren(n,...l,r),o.setAttribute("data-open","")}return{async open(){let a=window.EyeDropper;if(!a){o.replaceChildren(Object.assign(document.createElement("div"),{className:"hint",textContent:"this browser has no eyedropper"})),o.setAttribute("data-open","");return}try{let{sRGBHex:l}=await new a().open();i(l)}catch{}},close(){let a=o.hasAttribute("data-open");return o.removeAttribute("data-open"),a},destroy(){o.remove(),t.remove()}}}var dt="__align_freeze",To=`
[data-align-frozen] *:not([data-align-ignore]):not([data-align-ignore] *) {
  animation-play-state: paused !important;
}
`,pt=!1,We=[],Xe=[];function bn(e){let t=e;for(;t;){if(t instanceof Element&&t.hasAttribute("data-align-ignore"))return!0;let o=t.getRootNode();if(t=o instanceof ShadowRoot?o.host:t.parentNode??null,t===document)return!1}return!1}function Ge(){return pt}function Ye(e){if(e!==pt){if(pt=e,!e){document.documentElement.removeAttribute("data-align-frozen"),document.getElementById(dt)?.remove();for(let t of We)try{t.play()}catch{}for(let t of Xe)t.play().catch(()=>{});We=[],Xe=[];return}if(!document.getElementById(dt)){let t=document.createElement("style");t.id=dt,t.textContent=To,t.setAttribute("data-align-ignore",""),document.head.appendChild(t)}document.documentElement.setAttribute("data-align-frozen",""),We=[];try{for(let t of document.getAnimations()){if(t.playState!=="running")continue;let o=t.effect?.target??null;bn(o)||(t.pause(),We.push(t))}}catch{}Xe=[];for(let t of Array.from(document.querySelectorAll("video")))t.paused||bn(t)||(t.pause(),Xe.push(t))}}var mt="__align_xray",Ro=`
[data-align-xray] * { outline: 1px solid rgb(128 128 128 / 0.55) !important; }
[data-align-xray] [data-align-ignore],
[data-align-xray] [data-align-ignore] * { outline: none !important; }
`;function Ke(e){let t=document.documentElement;if(!e){t.removeAttribute("data-align-xray"),document.getElementById(mt)?.remove();return}if(!document.getElementById(mt)){let o=document.createElement("style");o.id=mt,o.textContent=Ro,o.setAttribute("data-align-ignore",""),document.head.appendChild(o)}t.setAttribute("data-align-xray","")}var ft="align-ui";function vn(e){try{return localStorage.getItem(e)}catch{return null}}function wn(e,t){try{localStorage.setItem(e,t)}catch{}}function kn(e){let t="/";try{t=location.pathname||"/"}catch{}return`${ft}:${e}::${t}`}function Lo(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function Sn(){let e=vn(kn("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(Lo).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function $n(e){wn(kn("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function _e(e){return vn(`${ft}:${e}`)==="1"}function Ae(e,t){wn(`${ft}:${e}`,t?"1":"0")}var j,L=null,Y=null,de=null,Ce=null,te=!1,ke=_e("grid"),Se=_e("pixels"),D=null,$=[],Ue=0,ne=_e("rulers"),A=[],Gn=1,En=!1,le=null,xt=pn();function Mo(){return A.map(e=>({...e}))}function $e(e=""){xt.push(Mo(),e)}function Cn(){return A.find(e=>e.id===le)??null}function ue(e){A=e,$n(A)}var F=null,ee=null,Q=null,Go=3,we=22;function An(e,t){return ne?t<we&&e>=we?"y":e<we&&t>=we?"x":null:null}function yt(e){return e.ctrlKey||e.metaKey}function Bn(e,t,o,n){let r=pe(t,o,j),i=e.axis==="x"?t:o,a=A.filter(s=>s.id!==e.id).map(s=>({axis:s.axis,at:Be(s).pos})),l=Qt(i,Zt(r,e.axis,a),n);e.at=l.at+(e.axis==="x"?scrollX:scrollY),e.caught=l.what}function Nn(e,t,o,n){let r={id:Gn++,axis:e,at:0,locked:!1,caught:"",pinned:!1};return $e(),Bn(r,t,o,n),ue([...A,r]),le=r.id,r}function Dn(e){e.pinned||($e(),ue(A.filter(t=>t.id!==e.id)),ee?.id===e.id&&(ee=null),F?.id===e.id&&(F=null))}function Ao(e){let t=j.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function Be(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function bt(){return $.length>=2?$[$.length-2]:void 0}function vt(){if($.length<2)return[];let e=[];for(let[t,o]of et($))for(let n of Ie(t,o)){if(n.extension||!n.label)continue;let r=Pt(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:Ft(r)})}return e}function P(e){let t=$[$.length-1],o=D&&$.some(c=>c.el===D.el),n=A.map(Be),r=!F&&ee?ee:null,i=A.filter(c=>c.locked||c.id===r?.id),a=!r&&o?D.el:null,l=r??a,s=r?Be(r):null,x=[],d=(c,y)=>{for(let S of c)x.push(l&&!y?{...S,faded:!0}:S)},g=c=>!s||c.axis!==s.axis?!1:(c.axis==="x"?[c.x1,c.x2]:[c.y1,c.y2]).some(S=>Math.abs(S-s.pos)<.5);for(let[c,y]of et($))d(Ie(c,y),c.el===a||y.el===a);t&&D&&!o&&!r&&d(Ie(t,D),!0);for(let c of i)for(let y of $)d(nt(y,[Be(c)]),c.id===r?.id||y.el===a);D&&!o&&!r&&A.length&&d(nt(D,n),!0);for(let c of en(i.map(Be),{x:innerWidth/2,y:innerHeight/2}))d([c],g(c));L?.update({hover:D,pinned:$,rulers:ne,grid:ke&&j.grid?j.grid:null,pixels:Se,guides:A,liveGuide:F??ee,activeGuide:le,lines:x,...e?{cursor:e}:{}}),de?.update($.length,{rulers:ne,xray:te,grid:ke,pixels:Se,freeze:Ge(),type:Y?.showsType()??!1,panel:Y?.isOpen()??!1})}function On(){let e=Y?.asText()??"";e&&navigator.clipboard?.writeText(e).catch(()=>{})}function Pn(){let e=xt.pop();e&&(ue(e),ee=null,F=null,Q=null,e.some(t=>t.id===le)||(le=null))}function ht(e){switch(e){case"rulers":ne=!ne,Ae("rulers",ne);break;case"xray":te=!te,Ke(te);break;case"grid":ke=!ke,Ae("grid",ke);break;case"pixels":Se=!Se,Ae("pixels",Se);break;case"freeze":Ye(!Ge());break;case"type":Y?.toggleType();break;case"panel":Y?.toggle();break;case"copy":On();break;case"pick":Ce?.open();break;case"undo":Pn();break}P()}var je=null;function Fn(e){if(je={x:e.clientX,y:e.clientY},F){Q&&Math.hypot(e.clientX-Q.x,e.clientY-Q.y)>Go&&(Q=null),!Q&&!F.pinned&&(Bn(F,e.clientX,e.clientY,yt(e)),ue([...A])),P({x:e.clientX,y:e.clientY});return}ee=tt(A,e.clientX,e.clientY),D=pe(e.clientX,e.clientY,j),P({x:e.clientX,y:e.clientY})}function In(e){F&&(Q?(F.locked=!F.locked,le=F.id,ue([...A])):(An(e.clientX,e.clientY)||e.clientX<we||e.clientY<we)&&Dn(F),Q=null,F=null,P({x:e.clientX,y:e.clientY}))}function zn(e){if(e.button!==0)return;let t=pe(e.clientX,e.clientY,j);if(!t)return;let o=An(e.clientX,e.clientY);if(o){Ee(e),Q=null,F=Nn(o,e.clientX,e.clientY,yt(e)),P({x:e.clientX,y:e.clientY});return}let n=tt(A,e.clientX,e.clientY);if(n){Ee(e),$e(),le=n.id,F=n,Q={x:e.clientX,y:e.clientY},P({x:e.clientX,y:e.clientY});return}Ee(e),de?.closeHelp(),$=[t],D=t,Y?.show(t,vt(),bt()),P({x:e.clientX,y:e.clientY})}function Hn(e){let t=pe(e.clientX,e.clientY,j);if(!t)return;Ee(e),de?.closeHelp();let o=$.findIndex(r=>r.el===t.el);$=o>=0?$.filter((r,i)=>i!==o):[...$,t],D=t;let n=$[$.length-1];n?Y?.show(n,vt(),bt()):Y?.hide(),P({x:e.clientX,y:e.clientY})}function Wn(e){pe(e.clientX,e.clientY,j)&&Ee(e)}function Xn(e){pe(e.clientX,e.clientY,j)&&Ee(e)}function Ee(e){e.preventDefault(),e.stopPropagation()}function Tn(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var Rn=0,Ln=0;function Yn(){Ue=requestAnimationFrame(Yn);let t=$.filter(a=>a.el.isConnected).map(a=>Fe(a.el)),o=D&&D.el.isConnected?Fe(D.el):null;if(!(scrollX!==Rn||scrollY!==Ln||t.length!==$.length||t.some((a,l)=>!Tn(a,$[l]))||D===null!=(o===null)||D!==null&&o!==null&&!Tn(D,o)))return;Rn=scrollX,Ln=scrollY,$=t,D=o;let i=$[$.length-1];i?Y?.show(i,vt(),bt()):Y?.hide(),P()}function Kn(){L?.resize()}function Bo(){En||(En=!0,A=Sn().map(e=>({...e,id:Gn++}))),!L&&(sn(),L=gn(),Y=dn(L.root),de=fn(L.root,ht),Ce=yn(L.root),de.update(0,{rulers:ne,xray:te,grid:ke,pixels:Se,freeze:Ge(),type:!1,panel:!1}),addEventListener("mousemove",Fn),addEventListener("mousedown",zn,{capture:!0}),addEventListener("mouseup",In,{capture:!0}),addEventListener("click",Wn,{capture:!0}),addEventListener("auxclick",Xn,{capture:!0}),addEventListener("contextmenu",Hn,{capture:!0}),addEventListener("resize",Kn),Ue=requestAnimationFrame(Yn),P())}function gt(){removeEventListener("mousemove",Fn),removeEventListener("mousedown",zn,{capture:!0}),removeEventListener("mouseup",In,{capture:!0}),removeEventListener("click",Wn,{capture:!0}),removeEventListener("auxclick",Xn,{capture:!0}),removeEventListener("contextmenu",Hn,{capture:!0}),removeEventListener("resize",Kn),cancelAnimationFrame(Ue),Ue=0,de?.destroy(),Ce?.destroy(),Ce=null,te&&(te=!1,Ke(!1)),Ye(!1),de=null,Y?.destroy(),Y=null,L?.destroy(),L=null,cn(),D=null,$=[],F=null,Q=null,ee=null}function Mn(e){if(Ao(e))e.preventDefault(),L?gt():Bo();else if(L&&je&&(e.key.toLowerCase()===j.guideKeys.vertical||e.key.toLowerCase()===j.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===j.guideKeys.vertical?"x":"y";Nn(t,je.x,je.y,yt(e)),P()}else if(L&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?($e(),ue(A.filter(t=>t.pinned)),ee=null,F=null,Q=null,A.some(t=>t.id===le)||(le=null)):ee&&Dn(ee),P();else if(L&&e.key.startsWith("Arrow")){let t=Cn(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;$e(`nudge:${t.id}`);let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",ue([...A]),P()}else if(L&&e.key.toLowerCase()==="g"){e.preventDefault(),ht("grid");return}else if(L&&e.key.toLowerCase()==="k"){e.preventDefault(),ht("pixels");return}else if(L&&e.key.toLowerCase()==="f")e.preventDefault(),Ye(!Ge()),P();else if(L&&e.key.toLowerCase()==="x")e.preventDefault(),te=!te,Ke(te);else if(L&&e.key.toLowerCase()==="p")e.preventDefault(),Ce?.open();else if(L&&e.key.toLowerCase()==="t")e.preventDefault(),Y?.toggleType();else if(L&&e.key.toLowerCase()==="c")e.preventDefault(),On();else if(L&&e.key.toLowerCase()==="l"){let t=Cn();if(!t)return;e.preventDefault(),$e(),t.pinned=!t.pinned,ue([...A]),P()}else if(L&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){if(xt.depth()===0)return;e.preventDefault(),Pn(),P()}else if(L&&e.key.toLowerCase()===j.rulerKey)e.preventDefault(),ne=!ne,Ae("rulers",ne),P();else if(L&&e.key.toLowerCase()===j.panelKey)e.preventDefault(),Y?.toggle();else if(e.key==="Escape"&&L){if(Ce?.close()||de?.closeHelp())return;$.length?($=[],Y?.hide(),P()):gt()}}function fr(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,j=Ut(e),addEventListener("keydown",Mn,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{gt(),removeEventListener("keydown",Mn,{capture:!0}),delete window.__align})}export{fr as initAlign};
