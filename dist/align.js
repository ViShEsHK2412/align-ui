function _(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function On(e){return(e.split(",")[0]??"").trim().replace(/^['"]|['"]$/g,"")}function Pn(e){let o={100:"thin",200:"extralight",300:"light",400:"regular",500:"medium",600:"semibold",700:"bold",800:"extrabold",900:"black"}[e.trim()];return o?`${e} ${o}`:e}function Ae(e){let t=getComputedStyle(e);return[{label:"family",value:On(t.fontFamily),px:NaN},{label:"size",value:t.fontSize,px:_(t.fontSize)},{label:"weight",value:Pn(t.fontWeight),px:NaN},{label:"line",value:t.lineHeight,px:_(t.lineHeight)},{label:"tracking",value:t.letterSpacing,px:_(t.letterSpacing)}]}function Gt(e){let t="";for(let o of e.childNodes)o.nodeType===3&&(t+=o.nodeValue??"");return t.trim().replace(/\s+/g," ")}function Rt(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:_(r)})}return o}function zn(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function Hn(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function At(e,t){return t.length===0?"":Hn(e).map(o=>{let n=zn(o,t);return n.length?`${o} ${n.join(" ")}`:`${o} \u2014`}).join("  \xB7  ")}function Et(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(_)}function Nt(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),l=a.display.includes("flex")||a.display.includes("grid"),s=n==="x"?a.columnGap:a.rowGap,x=l&&s!=="normal"?_(s):null,[d,f,u,v]=Et(e),[R,m,L,E]=Et(t),G=N=>Number.isFinite(N)?N:0,B=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,W=n==="x"?B?G(f)+G(E):G(m)+G(v):B?G(u)+G(R):G(L)+G(d);return{px:o,cssGap:x,margins:W,siblings:!0}}function Bt(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function Dt(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}function Ve(e){let t=e.trim().toLowerCase();return t?t.startsWith("#")||/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(t)?!0:["black","white","transparent","currentcolor"].includes(t):!1}var Z;function Ct(e){if(Z===void 0&&(Z=document.createElement("canvas").getContext("2d")),!Z)return"";Z.fillStyle="#000000",Z.fillStyle=e;let t=Z.fillStyle;return Z.fillStyle="#ffffff",Z.fillStyle=e,t===Z.fillStyle?String(t):""}function It(e,t){let o=Ct(e);return o?t.filter(n=>Ve(n.value)&&Ct(n.value)===o).map(n=>n.name).sort():[]}function Ft(e){let t=getComputedStyle(e),o=[],n=(r,i)=>{let a=i.trim();!a||a==="transparent"||/rgba?\([^)]*,\s*0\s*\)$/.test(a)||o.push({label:r,value:a})};return n("text",t.color),n("background",t.backgroundColor),o}function Wn(e,t,o){let n=r=>typeof CSS<"u"&&CSS.escape?CSS.escape(r):r.replace(/[^\w-]/g,"\\$&");return t?`#${n(t)}`:o.length?e+o.map(r=>`.${n(r)}`).join(""):e}function Je(e){let t=typeof e.className=="string"?e.className.trim().split(/\s+/).filter(Boolean):[];return Wn(e.tagName.toLowerCase(),e.id,t)}function Ot(e){let t=Je(e);if(!/[.#]/.test(t))return 0;try{return document.querySelectorAll(t).length}catch{return 0}}function Xn(e){if(!e)return"inline <style>";let t=e.split("?")[0]??e;try{let o=new URL(t,"http://x").pathname;return decodeURI(o).replace(/^\//,"")||t}catch{return t}}var Yn=["width","height","padding","margin","border-width","gap","font-size","line-height","letter-spacing","color","background-color"];function Kn(e){for(let t=0;t<e.length;t+=1){let o=e.item(t);if(Yn.some(n=>o===n||o.startsWith(`${n}-`)))return!0}return!1}function Pt(e){let t=[],o=new Set,n=(r,i)=>{for(let a of Array.from(r)){if(a instanceof CSSMediaRule){matchMedia(a.conditionText).matches&&n(a.cssRules,i);continue}if(a instanceof CSSSupportsRule){CSS.supports(a.conditionText)&&n(a.cssRules,i);continue}let l=a.cssRules;if(l&&!(a instanceof CSSStyleRule)){n(l,i);continue}if(!(a instanceof CSSStyleRule))continue;let s=!1;try{s=e.matches(a.selectorText)}catch{continue}if(!s||!Kn(a.style))continue;let x=`${a.selectorText}|${i}`;o.has(x)||(o.add(x),t.push({selector:a.selectorText,file:i}))}};for(let r of Array.from(document.styleSheets)){if(r.ownerNode instanceof Element&&r.ownerNode.hasAttribute("data-align-ignore"))continue;let i;try{i=r.cssRules}catch{continue}n(i,Xn(r.href))}return t.reverse()}function Tt(e){if(!e||e==="none")return[];let t=e.trim().split(/\s+/),o=[];for(let n of t){if(!n.endsWith("px"))return[];let r=Number.parseFloat(n);if(!Number.isFinite(r))return[];o.push(r)}return o}function Lt(e,t,o){let n=0;for(let r=0;r<e.length;r+=1){let i=n+e[r];if(o<i+.5)return r;n=i+t}return-1}function zt(e){let t=e.parentElement;if(!t)return null;let o=getComputedStyle(t),n=getComputedStyle(e),r=o.display,i=[];if(n.position==="absolute"||n.position==="fixed")return i.push({label:"placed by",value:`${n.position}, not by the parent`}),{display:r,rows:i};if(n.float!=="none")return i.push({label:"placed by",value:`float: ${n.float}`}),{display:r,rows:i};let a=r.includes("flex"),l=r.includes("grid");if(!a&&!l)return i.push({label:"flow",value:r}),{display:r,rows:i};let s=Mt(o.rowGap==="normal"?"0px":o.rowGap),x=Mt(o.columnGap==="normal"?"0px":o.columnGap),d=s===x?s:`row ${s} \xB7 column ${x}`;if(a){let W=o.flexDirection;i.push({label:"direction",value:o.flexWrap==="nowrap"?W:`${W} \xB7 ${o.flexWrap}`}),i.push({label:"justify",value:o.justifyContent}),i.push({label:"align",value:o.alignItems}),i.push({label:"gap",value:d});let N=`${n.flexGrow} ${n.flexShrink} ${n.flexBasis}`;return N!=="0 1 auto"&&i.push({label:"this child",value:`flex: ${N}`}),n.alignSelf!=="auto"&&i.push({label:"align-self",value:n.alignSelf}),{display:r,rows:i}}let f=Tt(o.gridTemplateColumns),u=Tt(o.gridTemplateRows);f.length&&i.push({label:"columns",value:`${f.length} \xB7 ${f.map(qe).join(" ")}`}),u.length&&i.push({label:"rows",value:`${u.length} \xB7 ${u.map(qe).join(" ")}`}),i.push({label:"gap",value:d});let v=t.getBoundingClientRect(),R=e.getBoundingClientRect(),m=v.left+_(o.borderLeftWidth)+_(o.paddingLeft),L=v.top+_(o.borderTopWidth)+_(o.paddingTop),E=Lt(f,_(o.columnGap==="normal"?"0":o.columnGap),R.left-m),G=Lt(u,_(o.rowGap==="normal"?"0":o.rowGap),R.top-L),B=[];return E>=0&&B.push(`column ${E+1} of ${f.length}`),G>=0&&B.push(`row ${G+1} of ${u.length}`),B.length&&i.push({label:"this child",value:B.join(" \xB7 ")}),{display:r,rows:i}}function Mt(e){return e.endsWith("px")?qe(Number.parseFloat(e)):e}function qe(e){return String(Math.round(e*100)/100)}var _n={ignore:"",grid:null,hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function Wt(e={}){return{..._n,...e}}var Ht=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function Xt(e){return e.ignore?`${Ht}, ${e.ignore}`:Ht}function k(e){return String(Math.round(e*100)/100)}function jn(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function De(e){let t=e.getBoundingClientRect();return{el:e,label:jn(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height,scale:Fe(e)}}function Yt(e,t){let o=(n,r)=>Math.abs(n-r)<.001;return o(e.scale.x,t.scale.x)&&o(e.scale.y,t.scale.y)?e.scale:{x:1,y:1}}function Kt(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function ce(e,t,o){let n=Xt(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=Kt(r);return r&&r!==document.documentElement?De(r):null}var Ne=e=>parseFloat(e)||0;function Qe(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[Ne(n),Ne(r),Ne(i),Ne(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function Un(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function qn(e,t){let o=Yt(e,t),n=t.left+t.width/2,r=t.top+t.height/2;return[{x1:e.left,y1:r,x2:t.left,y2:r,label:k((t.left-e.left)/o.x),axis:"x"},{x1:t.right,y1:r,x2:e.right,y2:r,label:k((e.right-t.right)/o.x),axis:"x"},{x1:n,y1:e.top,x2:n,y2:t.top,label:k((t.top-e.top)/o.y),axis:"y"},{x1:n,y1:t.bottom,x2:n,y2:e.bottom,label:k((e.bottom-t.bottom)/o.y),axis:"y"}]}function Be(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function Ie(e,t){let o=[],n=Yt(e,t),r=e.left<t.right&&t.left<e.right,i=e.top<t.bottom&&t.top<e.bottom;if(r&&i){let[a,l]=Un(e,t);return qn(a,l)}if(!r){let[a,l]=e.right<=t.left?[e,t]:[t,e],s=i?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:a.right,y1:s,x2:l.left,y2:s,label:`${k((l.left-a.right)/n.x)}`,axis:"x"}),o.push(...Be(a.right,a.top,a.bottom,s,"x")),o.push(...Be(l.left,l.top,l.bottom,s,"x"))}if(!i){let[a,l]=e.bottom<=t.top?[e,t]:[t,e],s=r?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:s,y1:a.bottom,x2:s,y2:l.top,label:`${k((l.top-a.bottom)/n.y)}`,axis:"y"}),o.push(...Be(a.bottom,a.left,a.right,s,"y")),o.push(...Be(l.top,l.left,l.right,s,"y"))}return o}function Vn(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function Ze(e){let t=Vn(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var Jn=5,Qn=8;function $e(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function et(e,t,o){let n=null,r=Jn;for(let i of e){let a=Math.abs($e(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function _t(e,t,o){if(o)return{at:e,what:""};let n=null,r=Qn;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function jt(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function tt(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,l=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:l,y2:i,label:k(r.gap),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,l=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:l,label:k(r.gap),axis:"y"})}}return o}function Ut(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],l=r[i],s=l-a;s<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:l,y2:t.y,label:k(s),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:l,label:k(s),axis:"y"}))}}return o}var oe=3;function Zn(e,t){return e.x<t.x+t.w+oe&&t.x<e.x+e.w+oe&&e.y<t.y+t.h+oe&&t.y<e.y+e.h+oe}function qt(e,t,o=12){let n=(a,l)=>Math.min(Math.max(a,o),t.w-l-o),r=(a,l)=>Math.min(Math.max(a,o),t.h-l-o),i=[];for(let a of e){let l={...a,x:n(a.x,a.w),y:r(a.y,a.h)},s=!1;for(let x=0;x<16;x++){let d=i.find(u=>Zn(u,l));if(!d)break;let f=l.axis==="x"?l.y:l.x;if(l.axis==="x"?l.y=r(s?d.y+d.h+oe:d.y-l.h-oe,l.h):l.x=n(s?d.x-l.w-oe:d.x+d.w+oe,l.w),(l.axis==="x"?l.y:l.x)===f){if(s)break;s=!0}}i.push(l)}return i}function Vt(e,t){let{columns:o,gutter:n,margin:r}=e;if(o<=0)return[];let i=e.maxWidth>0?Math.min(e.maxWidth,t):t,a=Math.max(0,(t-i)/2),s=(Math.max(0,i-r*2)-n*(o-1))/o;if(s<=0)return[];let x=[];for(let d=0;d<o;d+=1)x.push({left:a+r+d*(s+n),width:s});return x}function Jt(e,t){return e*t>=8?e:0}function eo(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(l=>parseFloat(l)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function Fe(e){let t=1,o=1;for(let n=e;n;n=Kt(n)){let r=eo(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var U=(e,t)=>({light:e,dark:t}),nt={accent:U("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:U("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:U("oklch(1 0 0)","oklch(0.264 0 0)"),fg:U("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:U("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:U("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:U("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:U("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)"),pixelLine:U("oklch(0.205 0 0 / 0.14)","oklch(0.97 0 0 / 0.14)")};function Zt(e){return`light-dark(${e.light}, ${e.dark})`}var ee=Zt(U("#fafafa","#1a1a1a"));function Ee(e){return Zt(U(`rgb(0 0 0 / ${e})`,`rgb(255 255 255 / ${e})`))}var Qt=[0,.07,.08,.1,.12,.15,.2];function K(e){let t=Qt[Math.max(0,Math.min(Qt.length-1,e))];return t===0?ee:Ee(t)}var D={primary:Ee(.9),secondary:Ee(.6),tertiary:Ee(.4)},re=Ee(.12),ue="0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)",en="0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)",b=22;var to='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',S={title:13,body:12,tag:11,stack:to},P={regular:400,medium:500,semibold:600},ot="__align_font",no="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function tn(){if(document.getElementById(ot))return;let e=document.createElement("link");e.id=ot,e.rel="stylesheet",e.href=no,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function nn(){document.getElementById(ot)?.remove()}function on(e){let t=[`${P.medium} ${S.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function rt(e){let t={};for(let o of Object.keys(nt))t[o]=e?nt[o].dark:nt[o].light;return t}function it(){let e=document.documentElement,t=getComputedStyle(e).colorScheme;if(/dark/.test(t)&&!/light/.test(t))return!0;if(/light/.test(t)&&!/dark/.test(t))return!1;for(let o of[document.body,e]){if(!o)continue;let n=oo(getComputedStyle(o).backgroundColor);if(n!==null)return n<.5}return matchMedia("(prefers-color-scheme: dark)").matches}function oo(e){let t=/^rgba?\(([^)]+)\)$/.exec(e.trim());if(!t)return null;let o=t[1].split(/[\s,/]+/).filter(Boolean).map(Number),[n,r,i,a=1]=o;return n===void 0||r===void 0||i===void 0||a<.5?null:(.2126*n+.7152*r+.0722*i)/255}function he(e,t){return e.replace(/\)$/,` / ${t})`)}var ro=`
`,te=16,io=`
.dock {
  /* No color-scheme here: the overlay sets it inline on the shadow host, from
     what the page actually looks like rather than what the machine prefers, and
     it inherits down. Declaring 'light dark' again would undo that and hand
     light-dark() back to the media query. */
  position: fixed; left: ${te}px; top: 0; width: 340px;
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none; user-select: none;
  font-family: ${S.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${D.primary};
  --muted: ${D.secondary};
  --border: ${re};
}
.panel {
  padding: 10px; border-radius: 0;
  /* Five sections now \u2014 box, tokens, styled by, matches, colour \u2014 and on a
     laptop that is taller than the window. place() clamps the position but
     cannot rescue a panel taller than the screen, so it scrolls instead. */
  max-height: calc(100vh - ${te*2}px);
  overflow-y: auto; overscroll-behavior: contain;
  font-size: ${S.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${ee};

  box-shadow: ${ue};

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
  background: ${ee};
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] .panel { box-shadow: ${en}; }
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${S.title}px; font-weight: ${P.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${S.body}px; font-weight: ${P.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${S.tag}px; font-weight: ${P.medium};
  margin-left: 4px;
  color: ${D.primary};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${S.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${K(1)}; }

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
.region[data-level="1"] { background: ${K(1)}; }
.region[data-level="2"] { background: ${K(2)}; }
.region[data-level="3"] { background: ${K(3)}; }
.content { background: ${K(4)}; }

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
  font-size: ${S.tag}px; font-weight: ${P.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${P.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${P.regular}; }
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
.readout-row {
  display: grid; grid-template-columns: 62px 1fr;
  gap: 8px; align-items: baseline;
  font-size: ${S.tag}px; line-height: 1.5;
}
.readout-key { color: var(--muted); }
.readout-value { color: var(--fg); overflow-wrap: anywhere; }
.content {
  border-radius: 0; padding: 14px 8px;
  text-align: center; font-weight: ${P.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,Ce=te,de=-1,ge=!1;function rn(e){let t=document.createElement("style");t.textContent=io,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);let r=!1;function i(m,L){let E=document.createElement("div");E.className="readout";let G=document.createElement("div");G.className="tag readout-tag",G.textContent=m,E.appendChild(G);for(let[B,W]of L){let N=document.createElement("div");N.className="readout-row";let Y=document.createElement("span");Y.className="readout-key",Y.textContent=B;let c=document.createElement("span");c.className="readout-value",c.textContent=W,N.append(Y,c),E.appendChild(N)}return E}e.appendChild(o);let a=(m,L)=>Math.min(Math.max(m,te),Math.max(te,L-te));function l(){let m=o.offsetHeight||300;de<0&&(de=Math.max(te,innerHeight-m-te)),Ce=a(Ce,innerWidth-o.offsetWidth),de=a(de,innerHeight-m),o.style.transform=`translate(${Ce-te}px, ${de}px)`}let s=null;function x(m){m.button===0&&(m.preventDefault(),m.stopPropagation(),s={x:m.clientX,y:m.clientY,dx:Ce,dy:de},o.setAttribute("data-dragging",""),m.currentTarget.setPointerCapture(m.pointerId))}function d(m){s&&(Ce=s.dx+(m.clientX-s.x),de=s.dy+(m.clientY-s.y),l())}function f(){s=null,o.removeAttribute("data-dragging")}addEventListener("resize",l);let u=null;function v(m){let L=document.createElement("div");return L.className="edge",L.textContent=m===0?"0":k(m),m===0&&L.setAttribute("data-zero",""),L}function R(m,L,E,G){let[B,W,N,Y]=E,c=document.createElement("div");c.className="region",c.setAttribute("data-level",String(L));let h=document.createElement("span");h.className="tag",h.textContent=m;let p=document.createElement("div");p.className="row";let w=document.createElement("div");w.className="fill",w.appendChild(G),p.append(v(Y),w,v(W));let y=document.createElement("div");return y.className="head",y.append(h,v(B)),c.append(y,p,v(N)),c}return{show(m,L=[]){let E=Qe(m.el),[G,B,W,N]=E.border,[Y,c,h,p]=E.padding,w=Fe(m.el),y=m.width/w.x,g=m.height/w.y,M=Math.abs(w.x-1)>.001||Math.abs(w.y-1)>.001,O=document.createElement("header"),_e=document.createElement("span");_e.className="name",_e.textContent=m.label;let je=document.createElement("span");je.className="size",je.textContent=`${k(y)} \xD7 ${k(g)}`;let fe=document.createElement("button");if(fe.className="close",fe.textContent="\xD7",fe.title="close (B brings it back)",fe.addEventListener("pointerdown",$=>$.stopPropagation()),fe.addEventListener("click",$=>{$.stopPropagation(),ge=!0,o.removeAttribute("data-open")}),O.append(_e,je),M){let $=document.createElement("span");$.className="scale",$.textContent=`\xD7${k(w.x)}`,$.title=`renders at ${k(m.width)} \xD7 ${k(m.height)}`,O.appendChild($)}O.appendChild(fe),O.addEventListener("pointerdown",x),O.addEventListener("pointermove",d),O.addEventListener("pointerup",f),O.addEventListener("pointercancel",f);let Ue=document.createElement("div");Ue.className="content",Ue.textContent=`${k(y-N-B-p-c)} \xD7 ${k(g-G-W-Y-h)}`;let ne=[O,R("margin",1,E.margin,R("border",2,E.border,R("padding",3,E.padding,Ue)))];if(r){let $=Gt(m.el),se=Ae(m.el);ne.push(se.length&&$?i("type",se.map(j=>[j.label,j.value])):i("type",[["","nothing of its own to set type on"]]))}let Re=zt(m.el);if(Re&&Re.rows.length&&ne.push(i(`laid out by ${Re.display}`,Re.rows.map($=>[$.label,$.value]))),L.length){let $=L.map(j=>[k(j.px),j.detail]),se=Dt(L.map(j=>j.px));se&&$.push(["",se]),ne.push(i("gaps",$))}let bt=Rt(m.el),vt=At([y,g,...E.margin,...E.border,...E.padding,...r?Ae(m.el).map($=>$.px):[]],bt);vt&&ne.push(i("tokens",[["",vt]]));let wt=Pt(m.el);wt.length&&ne.push(i("styled by",wt.slice(0,4).map($=>[$.selector,$.file])));let kt=Ot(m.el);kt>1&&ne.push(i("matches",[["",`${kt} elements share ${Je(m.el)}`]]));let St=bt.filter($=>Ve($.value));if(St.length){let $=Ft(m.el).map(({label:se,value:j})=>{let $t=It(j,St);return[se,$t.length?`${j}  ${$t.join(" ")}`:`${j}  \u2014`]});$.length&&ne.push(i("colour",$))}n.replaceChildren(...ne),u=m,l(),!ge&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},showsType:()=>r,isOpen:()=>!ge&&u!==null,toggleType(){r=!r,u&&this.show(u)},asText(){if(!u)return"";let m=Qe(u.el),L=Fe(u.el),E=u.width/L.x,G=u.height/L.y,B=N=>N.map(Y=>k(Y)).join(" "),W=[`${u.label}  ${k(E)} \xD7 ${k(G)}`,`margin   ${B(m.margin)}`,`border   ${B(m.border)}`,`padding  ${B(m.padding)}`];if(r)for(let N of Ae(u.el))W.push(`${N.label.padEnd(8)} ${N.value}`);return W.join(ro)},hide(){u=null,o.removeAttribute("data-open")},toggle(){u&&(ge=!ge,ge?o.removeAttribute("data-open"):(l(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",l),o.remove(),t.remove()}}}var ao=[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure what is under the cursor"],["Click","lock an element"],["Right-click","add to, or drop from, the locked set"],["Drag the panel header","move the box model"],["B","hide or bring back the box model"],["R","rulers down the top and left edges"],["Drag from a rule","pull out a guide; drag it back to remove"],["V","vertical guide at the cursor"],["H","horizontal guide at the cursor"],["Hover a guide","distance from it to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the last guide you touched; Shift for 10px"],["L","pin that guide so it cannot be moved or deleted"],["Ctrl/Cmd + Z","bring back the guides you just deleted"],["T","type and token readout for the locked element"],["F","freeze the page so a moving thing can be measured"],["G","your column grid, if one is configured"],["K","a ten-pixel texture to read against"],["X","x-ray: outline every element on the page"],["P","pick a colour from anywhere on screen"],["C","copy the numbers in the panel"],["Ctrl/Cmd while placing","ignore snapping"],["Del","remove the guide under the cursor; Shift+Del for all"],["Esc","clear the locks, then close"]],pe=16,at=S.tag+12,lt=8,lo=`
.flag {
  position: fixed; top: ${pe}px; right: ${pe}px;
  display: flex; align-items: center; gap: 8px;
  transition: top 160ms cubic-bezier(0.19, 1, 0.22, 1);
  padding: 6px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${S.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${S.tag}px; font-weight: ${P.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${D.primary};
  background: ${ee};
  box-shadow: ${ue};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
/* The rulers draw a gutter along the top edge, and the badge sits in it. Step
   down out of the way rather than covering the ticks the rulers exist to show. */
.flag[data-rulers] { top: ${pe+b}px; }
.help[data-rulers] { top: ${pe+b+at+lt}px; }
.flag:hover { background: ${K(1)}; }
.flag .count { color: ${D.secondary}; }

/* A layers bar, not a palette. Switches, then the one control that changes the
   page, then the things that happen once. */
.tools { display: flex; align-items: center; gap: 2px; }
.sep {
  width: 1px; align-self: stretch; margin: 0 4px;
  background: ${re};
}
.tool {
  width: 20px; height: 20px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; cursor: pointer;
  font: inherit; font-size: ${S.tag}px; font-weight: ${P.medium};
  color: ${D.tertiary};
}
.tool:hover { background: ${K(2)}; color: ${D.primary}; }
.tool:focus-visible { outline: 1px solid ${D.primary}; outline-offset: -1px; }
/* On is the film, not a colour: the three hues each already mean something on
   the canvas, and a fourth here would say nothing. */
.tool[data-on] { background: ${K(4)}; color: ${D.primary}; }
.tool[data-once]:active { background: ${K(4)}; }
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: ${pe+at+lt}px; right: ${pe}px; width: 292px;
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${pe*2+at+lt}px); overflow-y: auto;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${S.stack};
  font-synthesis: none;
  font-size: ${S.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${D.primary};
  background: ${ee};
  box-shadow: ${ue};
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
  font: inherit; font-weight: ${P.medium};
  border: 1px solid ${re};
  background: ${K(2)};
}
.help dd { margin: 0; color: ${D.secondary}; }
`,an=[{name:"rulers",label:"R",title:"rulers down the top and left edges",toggle:!0},{name:"xray",label:"X",title:"outline every element on the page",toggle:!0},{name:"grid",label:"G",title:"your column grid, if one is configured",toggle:!0},{name:"pixels",label:"K",title:"a ten-pixel texture to read against",toggle:!0},{name:"type",label:"T",title:"type and token readout",toggle:!0},{name:"panel",label:"B",title:"the box model panel",toggle:!0},{name:"freeze",label:"F",title:"hold the page still",toggle:!0},{name:"copy",label:"C",title:"copy the numbers in the panel",toggle:!1},{name:"pick",label:"P",title:"pick a colour from anywhere on screen",toggle:!1},{name:"undo",label:"\u21BA",title:"bring back the guides you just deleted",toggle:!1}];function ln(e,t){let o=document.createElement("style");o.textContent=lo,e.appendChild(o);let n=document.createElement("div");n.className="flag";let r=document.createElement("span");r.className="name",r.textContent="Align";let i=document.createElement("span");i.className="count";let a=new Map,l=document.createElement("div");l.className="tools";for(let d of an){if(d.name==="freeze"||d.name==="copy"){let u=document.createElement("span");u.className="sep",l.appendChild(u)}let f=document.createElement("button");f.type="button",f.className="tool",f.textContent=d.label,f.title=`${d.title}  \xB7  ${d.name==="undo"?"Ctrl/Cmd+Z":d.label}`,d.toggle||f.setAttribute("data-once",""),f.addEventListener("click",u=>{u.stopPropagation(),t(d.name)}),a.set(d.name,f),l.appendChild(f)}n.append(r,l,i);let s=document.createElement("div");s.className="help";let x=document.createElement("dl");for(let[d,f]of ao){let u=document.createElement("dt"),v=document.createElement("kbd");v.textContent=d,u.appendChild(v);let R=document.createElement("dd");R.textContent=f,x.append(u,R)}return s.appendChild(x),n.addEventListener("click",d=>{d.stopPropagation(),s.toggleAttribute("data-open")}),e.append(n,s),{update(d,f){i.textContent=d>0?`${d} locked`:"",n.toggleAttribute("data-rulers",f.rulers),s.toggleAttribute("data-rulers",f.rulers);for(let u of an)u.toggle&&a.get(u.name)?.toggleAttribute("data-on",f[u.name]===!0)},closeHelp(){let d=s.hasAttribute("data-open");return s.removeAttribute("data-open"),d},destroy(){n.remove(),s.remove(),o.remove()}}}var Oe=5,st=4,Te=12,sn=.22,xe=10,so=50,co=100;function cn(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,grid:null,pixels:!1,guides:[],liveGuide:null,activeGuide:null},i=rt(it()),a=0;function l(){let c=it();i=rt(c),e.style.colorScheme=c?"dark":"light",Y()}l();let s=matchMedia("(prefers-color-scheme: dark)"),x=()=>l();s.addEventListener("change",x),on(()=>Y());function d(){let c=devicePixelRatio;o.width=Math.round(innerWidth*c),o.height=Math.round(innerHeight*c),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(c,0,0,c,0,0),n.translate(.5,.5)}let f=c=>Math.round(c)-.5;function u(c,h){n.strokeStyle=h,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(c.left),Math.round(c.top),Math.round(c.width),Math.round(c.height))}function v(c){n.strokeStyle=he(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let h of[c.left,c.right])n.moveTo(Math.round(h),0),n.lineTo(Math.round(h),innerHeight);for(let h of[c.top,c.bottom])n.moveTo(0,Math.round(h)),n.lineTo(innerWidth,Math.round(h));n.stroke(),n.setLineDash([])}function R(c){if(n.strokeStyle=c.extension?he(i.measure,.55):i.measure,n.lineWidth=1,n.setLineDash(c.extension?[3,3]:[]),n.beginPath(),n.moveTo(Math.round(c.x1),Math.round(c.y1)),n.lineTo(Math.round(c.x2),Math.round(c.y2)),c.extension){n.stroke();return}if(c.axis==="x")for(let h of[c.x1,c.x2])n.moveTo(Math.round(h),Math.round(c.y1)-Oe),n.lineTo(Math.round(h),Math.round(c.y1)+Oe);else for(let h of[c.y1,c.y2])n.moveTo(Math.round(c.x1)-Oe,Math.round(h)),n.lineTo(Math.round(c.x1)+Oe,Math.round(h));n.stroke()}function m(c){return n.font=`${P.medium} ${S.body}px ${S.stack}`,{w:n.measureText(c).width+st*2,h:S.body+st*2+2}}function L(c,h,p,w){n.font=`${P.medium} ${S.body}px ${S.stack}`,n.textBaseline="middle";let{w:y,h:g}=m(c),M=f(Math.min(Math.max(h,Te),innerWidth-y-Te)),O=f(Math.min(Math.max(p,Te),innerHeight-g-Te));n.fillStyle=w,n.beginPath(),n.roundRect(M,O,Math.ceil(y),g,4),n.fill(),n.fillStyle=i.surface,n.fillText(c,M+st,O+g/2)}function E(c,h,p,w,y=!1){let{w:g,h:M}=m(c);L(c,y?h-g/2:h,y?p-M/2:p,w)}function G(){let c=scrollX,h=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,b),n.fillRect(-.5,-.5,b,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${P.regular} 9px ${S.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let g of r.pinned)n.fillRect(f(g.left),-.5,Math.round(g.width),b),n.fillRect(-.5,f(g.top),b,Math.round(g.height));n.restore(),n.beginPath(),n.moveTo(-.5,b-.5),n.lineTo(innerWidth,b-.5),n.moveTo(b-.5,-.5),n.lineTo(b-.5,innerHeight),n.stroke();let p=g=>g%co===0?b:g%so===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let w=Math.floor(c/xe)*xe;for(let g=w;g<c+innerWidth;g+=xe){let M=Math.round(g-c);if(M<b)continue;let O=p(g);n.moveTo(M,b-O),n.lineTo(M,b),O===b&&(n.fillStyle=i.muted,n.fillText(String(g),M+3,3))}n.stroke(),n.beginPath();let y=Math.floor(h/xe)*xe;for(let g=y;g<h+innerHeight;g+=xe){let M=Math.round(g-h);if(M<b)continue;let O=p(g);n.moveTo(b-O,M),n.lineTo(b,M),O===b&&(n.save(),n.translate(3,M-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(g),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),b),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo(b,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let g of r.guides){let M=Math.round($e(g));g.axis==="x"?n.fillRect(M-1,-.5,2,b):n.fillRect(-.5,M-1,b,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,b,b),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,b,b)}function B(){let c=Jt(10,1);if(c){n.strokeStyle=i.pixelLine,n.lineWidth=1,n.setLineDash([]),n.beginPath();for(let h=0;h<=innerWidth;h+=c)n.moveTo(h,0),n.lineTo(h,innerHeight);for(let h=0;h<=innerHeight;h+=c)n.moveTo(0,h),n.lineTo(innerWidth,h);n.stroke()}}function W(c){let h=Vt(c,document.documentElement.clientWidth);n.fillStyle=he(i.measure,.08);for(let p of h)n.fillRect(f(p.left),-.5,Math.round(p.width),innerHeight+1)}function N(){a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore(),r.pixels&&B(),r.grid&&W(r.grid);for(let p of r.pinned)u(p,i.accent);r.hover&&(v(r.hover),u(r.hover,r.pinned.length?he(i.accent,.7):i.accent));for(let p of r.guides){let w=r.liveGuide?.id===p.id;n.strokeStyle=p.locked||w?i.guide:he(i.guide,.55),n.lineWidth=p.pinned?2:1,n.setLineDash(p.locked?[]:[4,4]),n.beginPath();let y=Math.round($e(p));if(p.axis==="x"?(n.moveTo(y,0),n.lineTo(y,innerHeight)):(n.moveTo(0,y),n.lineTo(innerWidth,y)),n.stroke(),r.activeGuide===p.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let g=7;p.axis==="x"?(n.moveTo(y,0),n.lineTo(y,g),n.moveTo(y,innerHeight-g),n.lineTo(y,innerHeight)):(n.moveTo(0,y),n.lineTo(g,y),n.moveTo(innerWidth-g,y),n.lineTo(innerWidth,y)),n.stroke()}}for(let p of r.lines)n.globalAlpha=p.faded?sn:1,R(p);n.globalAlpha=1;let c=r.lines.filter(p=>p.label!==""),h=c.map(p=>{let w=(p.x1+p.x2)/2,y=(p.y1+p.y2)/2,{w:g,h:M}=m(p.label);return p.axis==="x"?{x:w-g/2,y:y-16-M/2,w:g,h:M,axis:p.axis}:{x:w+26-g/2,y:y-M/2,w:g,h:M,axis:p.axis}});if(qt(h,{w:innerWidth,h:innerHeight},Te).forEach((p,w)=>{let y=c[w];n.globalAlpha=y.faded?sn:1,L(y.label,p.x,p.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:p,height:w,scale:y}=r.hover;E(`${k(p/y.x)} \xD7 ${k(w/y.y)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let p=r.liveGuide,w=Math.round($e(p));E([`${p.axis} ${k(p.at)}`,p.caught,p.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),p.axis==="x"?w+6:30,p.axis==="x"?30:w+6,i.guide)}r.rulers&&G()}function Y(){a||(a=requestAnimationFrame(N))}return d(),{root:t,update(c){Object.assign(r,c),Y()},resize(){d(),Y()},destroy(){a&&cancelAnimationFrame(a),s.removeEventListener("change",x),e.remove()}}}function uo(e){let t=e.trim().replace(/^#/,""),o=t.length===3?t.split("").map(n=>n+n).join(""):t;return/^[0-9a-f]{6}$/i.test(o)?{r:parseInt(o.slice(0,2),16),g:parseInt(o.slice(2,4),16),b:parseInt(o.slice(4,6),16)}:null}function po({r:e,g:t,b:o}){let n=r=>Math.round(r).toString(16).padStart(2,"0");return`#${n(e)}${n(t)}${n(o)}`}function mo({r:e,g:t,b:o}){return`rgb(${Math.round(e)} ${Math.round(t)} ${Math.round(o)})`}function me(e,t){return String(Number(e.toFixed(t)))}function fo({r:e,g:t,b:o}){let n=e/255,r=t/255,i=o/255,a=Math.max(n,r,i),l=Math.min(n,r,i),s=(a+l)/2,x=a-l,d=0,f=0;return x!==0&&(f=x/(1-Math.abs(2*s-1)),a===n?d=(r-i)/x%6:a===r?d=(i-n)/x+2:d=(n-r)/x+4,d*=60,d<0&&(d+=360)),`hsl(${me(d,1)} ${me(f*100,1)}% ${me(s*100,1)}%)`}function ct(e){let t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4}function ho(e){let t=ct(e.r),o=ct(e.g),n=ct(e.b),r=.4122214708*t+.5363325363*o+.0514459929*n,i=.2119034982*t+.6806995451*o+.1073969566*n,a=.0883024619*t+.2817188376*o+.6299787005*n,l=Math.cbrt(r),s=Math.cbrt(i),x=Math.cbrt(a),d=.2104542553*l+.793617785*s-.0040720468*x,f=1.9779984951*l-2.428592205*s+.4505937099*x,u=.0259040371*l+.7827717662*s-.808675766*x,v=Math.sqrt(f*f+u*u),R=Math.atan2(u,f)*180/Math.PI;return R<0&&(R+=360),v<1e-4?`oklch(${me(d,4)} 0 0)`:`oklch(${me(d,4)} ${me(v,4)} ${me(R,2)})`}function un(e){let t=uo(e);return t?[{label:"hex",value:po(t)},{label:"rgb",value:mo(t)},{label:"hsl",value:fo(t)},{label:"oklch",value:ho(t)}]:[]}var go=`
.picker {
  position: fixed; top: 46px; right: 16px; width: 200px;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${S.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${S.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${D.primary};
  background: ${ee};
  box-shadow: ${ue};
  display: none;
}
.picker[data-open] { display: block; }
.picker .swatch {
  height: 40px; margin-bottom: 8px;
  border: 1px solid ${re};
}
/* Each row copies itself, so the whole row is the target rather than the text. */
.picker button {
  display: grid; grid-template-columns: 34px 1fr;
  gap: 8px; align-items: baseline;
  width: 100%; padding: 3px 4px; margin: 0;
  border: 0; background: none; cursor: pointer;
  font: inherit; text-align: left;
  color: ${D.primary};
}
.picker button:hover { background: ${K(2)}; }
.picker button:focus-visible { outline: 1px solid ${D.primary}; outline-offset: -1px; }
.picker .k { color: ${D.secondary}; }
.picker .v { overflow-wrap: anywhere; }
.picker .hint {
  margin-top: 6px; padding-top: 6px;
  border-top: 1px solid ${re};
  color: ${D.secondary};
}
`;function dn(e){let t=document.createElement("style");t.textContent=go,e.appendChild(t);let o=document.createElement("div");o.className="picker",e.appendChild(o);let n=document.createElement("div");n.className="swatch";let r=document.createElement("div");r.className="hint";function i(a){n.style.background=a;let l=un(a).map(({label:s,value:x})=>{let d=document.createElement("button");d.type="button";let f=document.createElement("span");f.className="k",f.textContent=s;let u=document.createElement("span");return u.className="v",u.textContent=x,d.append(f,u),d.addEventListener("click",v=>{v.stopPropagation(),navigator.clipboard?.writeText(x).then(()=>{r.textContent=`copied ${s}`},()=>{r.textContent="clipboard refused"})}),d});r.textContent="click a row to copy",o.replaceChildren(n,...l,r),o.setAttribute("data-open","")}return{async open(){let a=window.EyeDropper;if(!a){o.replaceChildren(Object.assign(document.createElement("div"),{className:"hint",textContent:"this browser has no eyedropper"})),o.setAttribute("data-open","");return}try{let{sRGBHex:l}=await new a().open();i(l)}catch{}},close(){let a=o.hasAttribute("data-open");return o.removeAttribute("data-open"),a},destroy(){o.remove(),t.remove()}}}var ut="__align_freeze",xo=`
[data-align-frozen] *:not([data-align-ignore]):not([data-align-ignore] *) {
  animation-play-state: paused !important;
}
`,dt=!1,Pe=[],ze=[];function pn(e){let t=e;for(;t;){if(t instanceof Element&&t.hasAttribute("data-align-ignore"))return!0;let o=t.getRootNode();if(t=o instanceof ShadowRoot?o.host:t.parentNode??null,t===document)return!1}return!1}function Le(){return dt}function He(e){if(e!==dt){if(dt=e,!e){document.documentElement.removeAttribute("data-align-frozen"),document.getElementById(ut)?.remove();for(let t of Pe)try{t.play()}catch{}for(let t of ze)t.play().catch(()=>{});Pe=[],ze=[];return}if(!document.getElementById(ut)){let t=document.createElement("style");t.id=ut,t.textContent=xo,t.setAttribute("data-align-ignore",""),document.head.appendChild(t)}document.documentElement.setAttribute("data-align-frozen",""),Pe=[];try{for(let t of document.getAnimations()){if(t.playState!=="running")continue;let o=t.effect?.target??null;pn(o)||(t.pause(),Pe.push(t))}}catch{}ze=[];for(let t of Array.from(document.querySelectorAll("video")))t.paused||pn(t)||(t.pause(),ze.push(t))}}var pt="__align_xray",yo=`
[data-align-xray] * { outline: 1px solid rgb(128 128 128 / 0.55) !important; }
[data-align-xray] [data-align-ignore],
[data-align-xray] [data-align-ignore] * { outline: none !important; }
`;function We(e){let t=document.documentElement;if(!e){t.removeAttribute("data-align-xray"),document.getElementById(pt)?.remove();return}if(!document.getElementById(pt)){let o=document.createElement("style");o.id=pt,o.textContent=yo,o.setAttribute("data-align-ignore",""),document.head.appendChild(o)}t.setAttribute("data-align-xray","")}var mt="align-ui";function mn(e){try{return localStorage.getItem(e)}catch{return null}}function fn(e,t){try{localStorage.setItem(e,t)}catch{}}function hn(e){let t="/";try{t=location.pathname||"/"}catch{}return`${mt}:${e}::${t}`}function bo(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function gn(){let e=mn(hn("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(bo).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function xn(e){fn(hn("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function Xe(e){return mn(`${mt}:${e}`)==="1"}function Me(e,t){fn(`${mt}:${e}`,t?"1":"0")}var X,C=null,H=null,le=null,ke=null,V=!1,be=Xe("grid"),ve=Xe("pixels"),I=null,T=[],Ke=0,J=Xe("rulers"),A=[],gt=1,yn=!1,Se=null,ie=null;function bn(){return A.find(e=>e.id===Se)??null}function ae(e){A=e,xn(A)}var z=null,Q=null,q=null,vo=3,ye=22;function $n(e,t){return J?t<ye&&e>=ye?"y":e<ye&&t>=ye?"x":null:null}function xt(e){return e.ctrlKey||e.metaKey}function En(e,t,o,n){let r=ce(t,o,X),i=e.axis==="x"?t:o,a=A.filter(s=>s.id!==e.id).map(s=>({axis:s.axis,at:Ge(s).pos})),l=_t(i,jt(r,e.axis,a),n);e.at=l.at+(e.axis==="x"?scrollX:scrollY),e.caught=l.what}function Cn(e,t,o,n){let r={id:gt++,axis:e,at:0,locked:!1,caught:"",pinned:!1};return En(r,t,o,n),ae([...A,r]),r}function Tn(e){e.pinned||(ie=[e],ae(A.filter(t=>t.id!==e.id)),Q?.id===e.id&&(Q=null),z?.id===e.id&&(z=null))}function wo(e){let t=X.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function Ge(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function yt(){if(T.length<2)return[];let e=[];for(let[t,o]of Ze(T))for(let n of Ie(t,o)){if(n.extension||!n.label)continue;let r=Nt(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:Bt(r)})}return e}function F(e){let t=T[T.length-1],o=I&&T.some(u=>u.el===I.el),n=A.map(Ge),r=!z&&Q?Q:null,i=A.filter(u=>u.locked||u.id===r?.id),a=!r&&o?I.el:null,l=r??a,s=r?Ge(r):null,x=[],d=(u,v)=>{for(let R of u)x.push(l&&!v?{...R,faded:!0}:R)},f=u=>!s||u.axis!==s.axis?!1:(u.axis==="x"?[u.x1,u.x2]:[u.y1,u.y2]).some(R=>Math.abs(R-s.pos)<.5);for(let[u,v]of Ze(T))d(Ie(u,v),u.el===a||v.el===a);t&&I&&!o&&!r&&d(Ie(t,I),!0);for(let u of i)for(let v of T)d(tt(v,[Ge(u)]),u.id===r?.id||v.el===a);I&&!o&&!r&&A.length&&d(tt(I,n),!0);for(let u of Ut(i.map(Ge),{x:innerWidth/2,y:innerHeight/2}))d([u],f(u));C?.update({hover:I,pinned:T,rulers:J,grid:be&&X.grid?X.grid:null,pixels:ve,guides:A,liveGuide:z??Q,activeGuide:Se,lines:x,...e?{cursor:e}:{}}),le?.update(T.length,{rulers:J,xray:V,grid:be,pixels:ve,freeze:Le(),type:H?.showsType()??!1,panel:H?.isOpen()??!1})}function Ln(){let e=H?.asText()??"";e&&navigator.clipboard?.writeText(e).catch(()=>{})}function Mn(){!ie||ie.length===0||(ae([...A,...ie.map(e=>({...e,id:gt++}))]),ie=null)}function ft(e){switch(e){case"rulers":J=!J,Me("rulers",J);break;case"xray":V=!V,We(V);break;case"grid":be=!be,Me("grid",be);break;case"pixels":ve=!ve,Me("pixels",ve);break;case"freeze":He(!Le());break;case"type":H?.toggleType();break;case"panel":H?.toggle();break;case"copy":Ln();break;case"pick":ke?.open();break;case"undo":Mn();break}F()}var Ye=null;function Gn(e){if(Ye={x:e.clientX,y:e.clientY},z){q&&Math.hypot(e.clientX-q.x,e.clientY-q.y)>vo&&(q=null),!q&&!z.pinned&&(En(z,e.clientX,e.clientY,xt(e)),ae([...A])),F({x:e.clientX,y:e.clientY});return}Q=et(A,e.clientX,e.clientY),I=ce(e.clientX,e.clientY,X),F({x:e.clientX,y:e.clientY})}function Rn(e){z&&(q?(z.locked=!z.locked,Se=z.id,ae([...A])):($n(e.clientX,e.clientY)||e.clientX<ye||e.clientY<ye)&&Tn(z),q=null,z=null,F({x:e.clientX,y:e.clientY}))}function An(e){if(e.button!==0)return;let t=ce(e.clientX,e.clientY,X);if(!t)return;let o=$n(e.clientX,e.clientY);if(o){we(e),q=null,z=Cn(o,e.clientX,e.clientY,xt(e)),F({x:e.clientX,y:e.clientY});return}let n=et(A,e.clientX,e.clientY);if(n){we(e),Se=n.id,z=n,q={x:e.clientX,y:e.clientY},F({x:e.clientX,y:e.clientY});return}we(e),le?.closeHelp(),T=[t],I=t,H?.show(t,yt()),F({x:e.clientX,y:e.clientY})}function Nn(e){let t=ce(e.clientX,e.clientY,X);if(!t)return;we(e),le?.closeHelp();let o=T.findIndex(r=>r.el===t.el);T=o>=0?T.filter((r,i)=>i!==o):[...T,t],I=t;let n=T[T.length-1];n?H?.show(n,yt()):H?.hide(),F({x:e.clientX,y:e.clientY})}function Bn(e){ce(e.clientX,e.clientY,X)&&we(e)}function Dn(e){ce(e.clientX,e.clientY,X)&&we(e)}function we(e){e.preventDefault(),e.stopPropagation()}function vn(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var wn=0,kn=0;function In(){Ke=requestAnimationFrame(In);let t=T.filter(a=>a.el.isConnected).map(a=>De(a.el)),o=I&&I.el.isConnected?De(I.el):null;if(!(scrollX!==wn||scrollY!==kn||t.length!==T.length||t.some((a,l)=>!vn(a,T[l]))||I===null!=(o===null)||I!==null&&o!==null&&!vn(I,o)))return;wn=scrollX,kn=scrollY,T=t,I=o;let i=T[T.length-1];i?H?.show(i,yt()):H?.hide(),F()}function Fn(){C?.resize()}function ko(){yn||(yn=!0,A=gn().map(e=>({...e,id:gt++}))),!C&&(tn(),C=cn(),H=rn(C.root),le=ln(C.root,ft),ke=dn(C.root),le.update(0,{rulers:J,xray:V,grid:be,pixels:ve,freeze:Le(),type:!1,panel:!1}),addEventListener("mousemove",Gn),addEventListener("mousedown",An,{capture:!0}),addEventListener("mouseup",Rn,{capture:!0}),addEventListener("click",Bn,{capture:!0}),addEventListener("auxclick",Dn,{capture:!0}),addEventListener("contextmenu",Nn,{capture:!0}),addEventListener("resize",Fn),Ke=requestAnimationFrame(In),F())}function ht(){removeEventListener("mousemove",Gn),removeEventListener("mousedown",An,{capture:!0}),removeEventListener("mouseup",Rn,{capture:!0}),removeEventListener("click",Bn,{capture:!0}),removeEventListener("auxclick",Dn,{capture:!0}),removeEventListener("contextmenu",Nn,{capture:!0}),removeEventListener("resize",Fn),cancelAnimationFrame(Ke),Ke=0,le?.destroy(),ke?.destroy(),ke=null,V&&(V=!1,We(!1)),He(!1),le=null,H?.destroy(),H=null,C?.destroy(),C=null,nn(),I=null,T=[],z=null,q=null,Q=null}function Sn(e){if(wo(e))e.preventDefault(),C?ht():ko();else if(C&&Ye&&(e.key.toLowerCase()===X.guideKeys.vertical||e.key.toLowerCase()===X.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===X.guideKeys.vertical?"x":"y";Cn(t,Ye.x,Ye.y,xt(e)),F()}else if(C&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(ie=A.filter(t=>!t.pinned),ae(A.filter(t=>t.pinned)),Q=null,z=null,q=null,A.some(t=>t.id===Se)||(Se=null)):Q&&Tn(Q),F();else if(C&&e.key.startsWith("Arrow")){let t=bn(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",ae([...A]),F()}else if(C&&e.key.toLowerCase()==="g"){e.preventDefault(),ft("grid");return}else if(C&&e.key.toLowerCase()==="k"){e.preventDefault(),ft("pixels");return}else if(C&&e.key.toLowerCase()==="f")e.preventDefault(),He(!Le()),F();else if(C&&e.key.toLowerCase()==="x")e.preventDefault(),V=!V,We(V);else if(C&&e.key.toLowerCase()==="p")e.preventDefault(),ke?.open();else if(C&&e.key.toLowerCase()==="t")e.preventDefault(),H?.toggleType();else if(C&&e.key.toLowerCase()==="c")e.preventDefault(),Ln();else if(C&&e.key.toLowerCase()==="l"){let t=bn();if(!t)return;e.preventDefault(),t.pinned=!t.pinned,ae([...A]),F()}else if(C&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){if(!ie||ie.length===0)return;e.preventDefault(),Mn(),F()}else if(C&&e.key.toLowerCase()===X.rulerKey)e.preventDefault(),J=!J,Me("rulers",J),F();else if(C&&e.key.toLowerCase()===X.panelKey)e.preventDefault(),H?.toggle();else if(e.key==="Escape"&&C){if(ke?.close()||le?.closeHelp())return;T.length?(T=[],H?.hide(),F()):ht()}}function tr(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,X=Wt(e),addEventListener("keydown",Sn,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{ht(),removeEventListener("keydown",Sn,{capture:!0}),delete window.__align})}export{tr as initAlign};
