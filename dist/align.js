function pe(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function Tn(e){return(e.split(",")[0]??"").trim().replace(/^['"]|['"]$/g,"")}function Mn(e){let o={100:"thin",200:"extralight",300:"light",400:"regular",500:"medium",600:"semibold",700:"bold",800:"extrabold",900:"black"}[e.trim()];return o?`${e} ${o}`:e}function Ce(e){let t=getComputedStyle(e);return[{label:"family",value:Tn(t.fontFamily),px:NaN},{label:"size",value:t.fontSize,px:pe(t.fontSize)},{label:"weight",value:Mn(t.fontWeight),px:NaN},{label:"line",value:t.lineHeight,px:pe(t.lineHeight)},{label:"tracking",value:t.letterSpacing,px:pe(t.letterSpacing)}]}function bt(e){let t="";for(let o of e.childNodes)o.nodeType===3&&(t+=o.nodeValue??"");return t.trim().replace(/\s+/g," ")}function vt(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:pe(r)})}return o}function Ln(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function Rn(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function wt(e,t){return t.length===0?"":Rn(e).map(o=>{let n=Ln(o,t);return n.length?`${o} ${n.join(" ")}`:`${o} \u2014`}).join("  \xB7  ")}function xt(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(pe)}function kt(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),s=a.display.includes("flex")||a.display.includes("grid"),l=n==="x"?a.columnGap:a.rowGap,b=s&&l!=="normal"?pe(l):null,[d,g,c,E]=xt(e),[L,m,M,R]=xt(t),G=h=>Number.isFinite(h)?h:0,I=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,u=n==="x"?I?G(g)+G(R):G(m)+G(E):I?G(c)+G(L):G(M)+G(d);return{px:o,cssGap:b,margins:u,siblings:!0}}function St(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function Et(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}function Xe(e){let t=e.trim().toLowerCase();return t?t.startsWith("#")||/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(t)?!0:["black","white","transparent","currentcolor"].includes(t):!1}var q;function yt(e){if(q===void 0&&(q=document.createElement("canvas").getContext("2d")),!q)return"";q.fillStyle="#000000",q.fillStyle=e;let t=q.fillStyle;return q.fillStyle="#ffffff",q.fillStyle=e,t===q.fillStyle?String(t):""}function $t(e,t){let o=yt(e);return o?t.filter(n=>Xe(n.value)&&yt(n.value)===o).map(n=>n.name).sort():[]}function Ct(e){let t=getComputedStyle(e),o=[],n=(r,i)=>{let a=i.trim();!a||a==="transparent"||/rgba?\([^)]*,\s*0\s*\)$/.test(a)||o.push({label:r,value:a})};return n("text",t.color),n("background",t.backgroundColor),o}function An(e,t,o){let n=r=>typeof CSS<"u"&&CSS.escape?CSS.escape(r):r.replace(/[^\w-]/g,"\\$&");return t?`#${n(t)}`:o.length?e+o.map(r=>`.${n(r)}`).join(""):e}function Ye(e){let t=typeof e.className=="string"?e.className.trim().split(/\s+/).filter(Boolean):[];return An(e.tagName.toLowerCase(),e.id,t)}function Tt(e){let t=Ye(e);if(!/[.#]/.test(t))return 0;try{return document.querySelectorAll(t).length}catch{return 0}}function Gn(e){if(!e)return"inline <style>";let t=e.split("?")[0]??e;try{let o=new URL(t,"http://x").pathname;return decodeURI(o).replace(/^\//,"")||t}catch{return t}}var Nn=["width","height","padding","margin","border-width","gap","font-size","line-height","letter-spacing","color","background-color"];function Bn(e){for(let t=0;t<e.length;t+=1){let o=e.item(t);if(Nn.some(n=>o===n||o.startsWith(`${n}-`)))return!0}return!1}function Mt(e){let t=[],o=new Set,n=(r,i)=>{for(let a of Array.from(r)){if(a instanceof CSSMediaRule){matchMedia(a.conditionText).matches&&n(a.cssRules,i);continue}if(a instanceof CSSSupportsRule){CSS.supports(a.conditionText)&&n(a.cssRules,i);continue}let s=a.cssRules;if(s&&!(a instanceof CSSStyleRule)){n(s,i);continue}if(!(a instanceof CSSStyleRule))continue;let l=!1;try{l=e.matches(a.selectorText)}catch{continue}if(!l||!Bn(a.style))continue;let b=`${a.selectorText}|${i}`;o.has(b)||(o.add(b),t.push({selector:a.selectorText,file:i}))}};for(let r of Array.from(document.styleSheets)){if(r.ownerNode instanceof Element&&r.ownerNode.hasAttribute("data-align-ignore"))continue;let i;try{i=r.cssRules}catch{continue}n(i,Gn(r.href))}return t.reverse()}var Dn={ignore:"",hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function Rt(e={}){return{...Dn,...e}}var Lt=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function At(e){return e.ignore?`${Lt}, ${e.ignore}`:Lt}function k(e){return String(Math.round(e*100)/100)}function In(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function Le(e){let t=e.getBoundingClientRect();return{el:e,label:In(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height,scale:Ae(e)}}function Gt(e,t){let o=(n,r)=>Math.abs(n-r)<.001;return o(e.scale.x,t.scale.x)&&o(e.scale.y,t.scale.y)?e.scale:{x:1,y:1}}function Nt(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function ae(e,t,o){let n=At(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=Nt(r);return r&&r!==document.documentElement?Le(r):null}var Te=e=>parseFloat(e)||0;function Ke(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[Te(n),Te(r),Te(i),Te(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function On(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function Pn(e,t){let o=Gt(e,t),n=t.left+t.width/2,r=t.top+t.height/2;return[{x1:e.left,y1:r,x2:t.left,y2:r,label:k((t.left-e.left)/o.x),axis:"x"},{x1:t.right,y1:r,x2:e.right,y2:r,label:k((e.right-t.right)/o.x),axis:"x"},{x1:n,y1:e.top,x2:n,y2:t.top,label:k((t.top-e.top)/o.y),axis:"y"},{x1:n,y1:t.bottom,x2:n,y2:e.bottom,label:k((e.bottom-t.bottom)/o.y),axis:"y"}]}function Me(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function Re(e,t){let o=[],n=Gt(e,t),r=e.left<t.right&&t.left<e.right,i=e.top<t.bottom&&t.top<e.bottom;if(r&&i){let[a,s]=On(e,t);return Pn(a,s)}if(!r){let[a,s]=e.right<=t.left?[e,t]:[t,e],l=i?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:a.right,y1:l,x2:s.left,y2:l,label:`${k((s.left-a.right)/n.x)}`,axis:"x"}),o.push(...Me(a.right,a.top,a.bottom,l,"x")),o.push(...Me(s.left,s.top,s.bottom,l,"x"))}if(!i){let[a,s]=e.bottom<=t.top?[e,t]:[t,e],l=r?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:l,y1:a.bottom,x2:l,y2:s.top,label:`${k((s.top-a.bottom)/n.y)}`,axis:"y"}),o.push(...Me(a.bottom,a.left,a.right,l,"y")),o.push(...Me(s.top,s.left,s.right,l,"y"))}return o}function zn(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function _e(e){let t=zn(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var Fn=5,Hn=8;function be(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function je(e,t,o){let n=null,r=Fn;for(let i of e){let a=Math.abs(be(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function Bt(e,t,o){if(o)return{at:e,what:""};let n=null,r=Hn;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function Dt(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function Ue(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,s=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:s,y2:i,label:k(r.gap),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,s=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:s,label:k(r.gap),axis:"y"})}}return o}function It(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],s=r[i],l=s-a;l<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:s,y2:t.y,label:k(l),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:s,label:k(l),axis:"y"}))}}return o}var Z=3;function Wn(e,t){return e.x<t.x+t.w+Z&&t.x<e.x+e.w+Z&&e.y<t.y+t.h+Z&&t.y<e.y+e.h+Z}function Ot(e,t,o=12){let n=(a,s)=>Math.min(Math.max(a,o),t.w-s-o),r=(a,s)=>Math.min(Math.max(a,o),t.h-s-o),i=[];for(let a of e){let s={...a,x:n(a.x,a.w),y:r(a.y,a.h)},l=!1;for(let b=0;b<16;b++){let d=i.find(c=>Wn(c,s));if(!d)break;let g=s.axis==="x"?s.y:s.x;if(s.axis==="x"?s.y=r(l?d.y+d.h+Z:d.y-s.h-Z,s.h):s.x=n(l?d.x-s.w-Z:d.x+d.w+Z,s.w),(s.axis==="x"?s.y:s.x)===g){if(l)break;l=!0}}i.push(s)}return i}function Xn(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(s=>parseFloat(s)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function Ae(e){let t=1,o=1;for(let n=e;n;n=Nt(n)){let r=Xn(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var K=(e,t)=>({light:e,dark:t}),qe={accent:K("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:K("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:K("oklch(1 0 0)","oklch(0.264 0 0)"),fg:K("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:K("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:K("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:K("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:K("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)")};function zt(e){return`light-dark(${e.light}, ${e.dark})`}var V=zt(K("#fafafa","#1a1a1a"));function ve(e){return zt(K(`rgb(0 0 0 / ${e})`,`rgb(255 255 255 / ${e})`))}var Pt=[0,.07,.08,.1,.12,.15,.2];function H(e){let t=Pt[Math.max(0,Math.min(Pt.length-1,e))];return t===0?V:ve(t)}var N={primary:ve(.9),secondary:ve(.6),tertiary:ve(.4)},ee=ve(.12),se="0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)",Ft="0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)",v=22;var Yn='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',S={title:13,body:12,tag:11,stack:Yn},O={regular:400,medium:500,semibold:600},Ve="__align_font",Kn="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function Ht(){if(document.getElementById(Ve))return;let e=document.createElement("link");e.id=Ve,e.rel="stylesheet",e.href=Kn,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function Wt(){document.getElementById(Ve)?.remove()}function Xt(e){let t=[`${O.medium} ${S.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function Je(e){let t={};for(let o of Object.keys(qe))t[o]=e?qe[o].dark:qe[o].light;return t}function Yt(){return matchMedia("(prefers-color-scheme: dark)").matches}function we(e,t){return e.replace(/\)$/,` / ${t})`)}var _n=`
`,J=16,jn=`
.dock {
  /* On .dock, not :host \u2014 the host's inline all:initial outranks a :host rule,
     which would pin color-scheme to normal and resolve light-dark() to its
     light branch on a dark page. */
  color-scheme: light dark;
  position: fixed; left: ${J}px; top: 0; width: 340px;
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none; user-select: none;
  font-family: ${S.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${N.primary};
  --muted: ${N.secondary};
  --border: ${ee};
}
.panel {
  padding: 10px; border-radius: 0;
  /* Five sections now \u2014 box, tokens, styled by, matches, colour \u2014 and on a
     laptop that is taller than the window. place() clamps the position but
     cannot rescue a panel taller than the screen, so it scrolls instead. */
  max-height: calc(100vh - ${J*2}px);
  overflow-y: auto; overscroll-behavior: contain;
  font-size: ${S.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${V};

  box-shadow: ${se};

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
  background: ${V};
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] .panel { box-shadow: ${Ft}; }
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${S.title}px; font-weight: ${O.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${S.body}px; font-weight: ${O.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${S.tag}px; font-weight: ${O.medium};
  margin-left: 4px;
  color: ${N.primary};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${S.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${H(1)}; }

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
  font-size: ${S.tag}px; font-weight: ${O.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${O.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${O.regular}; }
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
  text-align: center; font-weight: ${O.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,ke=J,le=-1,me=!1;function Kt(e){let t=document.createElement("style");t.textContent=jn,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);let r=!1;function i(m,M){let R=document.createElement("div");R.className="readout";let G=document.createElement("div");G.className="tag readout-tag",G.textContent=m,R.appendChild(G);for(let[I,u]of M){let h=document.createElement("div");h.className="readout-row";let p=document.createElement("span");p.className="readout-key",p.textContent=I;let w=document.createElement("span");w.className="readout-value",w.textContent=u,h.append(p,w),R.appendChild(h)}return R}e.appendChild(o);let a=(m,M)=>Math.min(Math.max(m,J),Math.max(J,M-J));function s(){let m=o.offsetHeight||300;le<0&&(le=Math.max(J,innerHeight-m-J)),ke=a(ke,innerWidth-o.offsetWidth),le=a(le,innerHeight-m),o.style.transform=`translate(${ke-J}px, ${le}px)`}let l=null;function b(m){m.button===0&&(m.preventDefault(),m.stopPropagation(),l={x:m.clientX,y:m.clientY,dx:ke,dy:le},o.setAttribute("data-dragging",""),m.currentTarget.setPointerCapture(m.pointerId))}function d(m){l&&(ke=l.dx+(m.clientX-l.x),le=l.dy+(m.clientY-l.y),s())}function g(){l=null,o.removeAttribute("data-dragging")}addEventListener("resize",s);let c=null;function E(m){let M=document.createElement("div");return M.className="edge",M.textContent=m===0?"0":k(m),m===0&&M.setAttribute("data-zero",""),M}function L(m,M,R,G){let[I,u,h,p]=R,w=document.createElement("div");w.className="region",w.setAttribute("data-level",String(M));let x=document.createElement("span");x.className="tag",x.textContent=m;let f=document.createElement("div");f.className="row";let y=document.createElement("div");y.className="fill",y.appendChild(G),f.append(E(p),y,E(u));let z=document.createElement("div");return z.className="head",z.append(x,E(I)),w.append(z,f,E(h)),w}return{show(m,M=[]){let R=Ke(m.el),[G,I,u,h]=R.border,[p,w,x,f]=R.padding,y=Ae(m.el),z=m.width/y.x,ze=m.height/y.y,Cn=Math.abs(y.x-1)>.001||Math.abs(y.y-1)>.001,Q=document.createElement("header"),Fe=document.createElement("span");Fe.className="name",Fe.textContent=m.label;let He=document.createElement("span");He.className="size",He.textContent=`${k(z)} \xD7 ${k(ze)}`;let de=document.createElement("button");if(de.className="close",de.textContent="\xD7",de.title="close (B brings it back)",de.addEventListener("pointerdown",C=>C.stopPropagation()),de.addEventListener("click",C=>{C.stopPropagation(),me=!0,o.removeAttribute("data-open")}),Q.append(Fe,He),Cn){let C=document.createElement("span");C.className="scale",C.textContent=`\xD7${k(y.x)}`,C.title=`renders at ${k(m.width)} \xD7 ${k(m.height)}`,Q.appendChild(C)}Q.appendChild(de),Q.addEventListener("pointerdown",b),Q.addEventListener("pointermove",d),Q.addEventListener("pointerup",g),Q.addEventListener("pointercancel",g);let We=document.createElement("div");We.className="content",We.textContent=`${k(z-h-I-f-w)} \xD7 ${k(ze-G-u-p-x)}`;let re=[Q,L("margin",1,R.margin,L("border",2,R.border,L("padding",3,R.padding,We)))];if(r){let C=bt(m.el),ie=Ce(m.el);re.push(ie.length&&C?i("type",ie.map(X=>[X.label,X.value])):i("type",[["","nothing of its own to set type on"]]))}if(M.length){let C=M.map(X=>[k(X.px),X.detail]),ie=Et(M.map(X=>X.px));ie&&C.push(["",ie]),re.push(i("gaps",C))}let dt=vt(m.el),pt=wt([z,ze,...R.margin,...R.border,...R.padding,...r?Ce(m.el).map(C=>C.px):[]],dt);pt&&re.push(i("tokens",[["",pt]]));let mt=Mt(m.el);mt.length&&re.push(i("styled by",mt.slice(0,4).map(C=>[C.selector,C.file])));let ft=Tt(m.el);ft>1&&re.push(i("matches",[["",`${ft} elements share ${Ye(m.el)}`]]));let ht=dt.filter(C=>Xe(C.value));if(ht.length){let C=Ct(m.el).map(({label:ie,value:X})=>{let gt=$t(X,ht);return[ie,gt.length?`${X}  ${gt.join(" ")}`:`${X}  \u2014`]});C.length&&re.push(i("colour",C))}n.replaceChildren(...re),c=m,s(),!me&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},showsType:()=>r,isOpen:()=>!me&&c!==null,toggleType(){r=!r,c&&this.show(c)},asText(){if(!c)return"";let m=Ke(c.el),M=Ae(c.el),R=c.width/M.x,G=c.height/M.y,I=h=>h.map(p=>k(p)).join(" "),u=[`${c.label}  ${k(R)} \xD7 ${k(G)}`,`margin   ${I(m.margin)}`,`border   ${I(m.border)}`,`padding  ${I(m.padding)}`];if(r)for(let h of Ce(c.el))u.push(`${h.label.padEnd(8)} ${h.value}`);return u.join(_n)},hide(){c=null,o.removeAttribute("data-open")},toggle(){c&&(me=!me,me?o.removeAttribute("data-open"):(s(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",s),o.remove(),t.remove()}}}var Un=[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure what is under the cursor"],["Click","lock an element"],["Right-click","add to, or drop from, the locked set"],["Drag the panel header","move the box model"],["B","hide or bring back the box model"],["R","rulers down the top and left edges"],["Drag from a rule","pull out a guide; drag it back to remove"],["V","vertical guide at the cursor"],["H","horizontal guide at the cursor"],["Hover a guide","distance from it to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the last guide you touched; Shift for 10px"],["L","pin that guide so it cannot be moved or deleted"],["Ctrl/Cmd + Z","bring back the guides you just deleted"],["T","type and token readout for the locked element"],["F","freeze the page so a moving thing can be measured"],["X","x-ray: outline every element on the page"],["P","pick a colour from anywhere on screen"],["C","copy the numbers in the panel"],["Ctrl/Cmd while placing","ignore snapping"],["Del","remove the guide under the cursor; Shift+Del for all"],["Esc","clear the locks, then close"]],ce=16,Qe=S.tag+12,Ze=8,qn=`
.flag {
  position: fixed; top: ${ce}px; right: ${ce}px;
  display: flex; align-items: center; gap: 8px;
  transition: top 160ms cubic-bezier(0.19, 1, 0.22, 1);
  padding: 6px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${S.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${S.tag}px; font-weight: ${O.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${N.primary};
  background: ${V};
  box-shadow: ${se};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
/* The rulers draw a gutter along the top edge, and the badge sits in it. Step
   down out of the way rather than covering the ticks the rulers exist to show. */
.flag[data-rulers] { top: ${ce+v}px; }
.help[data-rulers] { top: ${ce+v+Qe+Ze}px; }
.flag:hover { background: ${H(1)}; }
.flag .count { color: ${N.secondary}; }

/* A layers bar, not a palette. Switches, then the one control that changes the
   page, then the things that happen once. */
.tools { display: flex; align-items: center; gap: 2px; }
.sep {
  width: 1px; align-self: stretch; margin: 0 4px;
  background: ${ee};
}
.tool {
  width: 20px; height: 20px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; cursor: pointer;
  font: inherit; font-size: ${S.tag}px; font-weight: ${O.medium};
  color: ${N.tertiary};
}
.tool:hover { background: ${H(2)}; color: ${N.primary}; }
.tool:focus-visible { outline: 1px solid ${N.primary}; outline-offset: -1px; }
/* On is the film, not a colour: the three hues each already mean something on
   the canvas, and a fourth here would say nothing. */
.tool[data-on] { background: ${H(4)}; color: ${N.primary}; }
.tool[data-once]:active { background: ${H(4)}; }
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: ${ce+Qe+Ze}px; right: ${ce}px; width: 292px;
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${ce*2+Qe+Ze}px); overflow-y: auto;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${S.stack};
  font-synthesis: none;
  font-size: ${S.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${N.primary};
  background: ${V};
  box-shadow: ${se};
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
  font: inherit; font-weight: ${O.medium};
  border: 1px solid ${ee};
  background: ${H(2)};
}
.help dd { margin: 0; color: ${N.secondary}; }
`,_t=[{name:"rulers",label:"R",title:"rulers down the top and left edges",toggle:!0},{name:"xray",label:"X",title:"outline every element on the page",toggle:!0},{name:"type",label:"T",title:"type and token readout",toggle:!0},{name:"panel",label:"B",title:"the box model panel",toggle:!0},{name:"freeze",label:"F",title:"hold the page still",toggle:!0},{name:"copy",label:"C",title:"copy the numbers in the panel",toggle:!1},{name:"pick",label:"P",title:"pick a colour from anywhere on screen",toggle:!1},{name:"undo",label:"\u21BA",title:"bring back the guides you just deleted",toggle:!1}];function jt(e,t){let o=document.createElement("style");o.textContent=qn,e.appendChild(o);let n=document.createElement("div");n.className="flag";let r=document.createElement("span");r.className="name",r.textContent="Align";let i=document.createElement("span");i.className="count";let a=new Map,s=document.createElement("div");s.className="tools";for(let d of _t){if(d.name==="freeze"||d.name==="copy"){let c=document.createElement("span");c.className="sep",s.appendChild(c)}let g=document.createElement("button");g.type="button",g.className="tool",g.textContent=d.label,g.title=`${d.title}  \xB7  ${d.name==="undo"?"Ctrl/Cmd+Z":d.label}`,d.toggle||g.setAttribute("data-once",""),g.addEventListener("click",c=>{c.stopPropagation(),t(d.name)}),a.set(d.name,g),s.appendChild(g)}n.append(r,s,i);let l=document.createElement("div");l.className="help";let b=document.createElement("dl");for(let[d,g]of Un){let c=document.createElement("dt"),E=document.createElement("kbd");E.textContent=d,c.appendChild(E);let L=document.createElement("dd");L.textContent=g,b.append(c,L)}return l.appendChild(b),n.addEventListener("click",d=>{d.stopPropagation(),l.toggleAttribute("data-open")}),e.append(n,l),{update(d,g){i.textContent=d>0?`${d} locked`:"",n.toggleAttribute("data-rulers",g.rulers),l.toggleAttribute("data-rulers",g.rulers);for(let c of _t)c.toggle&&a.get(c.name)?.toggleAttribute("data-on",g[c.name]===!0)},closeHelp(){let d=l.hasAttribute("data-open");return l.removeAttribute("data-open"),d},destroy(){n.remove(),l.remove(),o.remove()}}}var Ge=5,et=4,Se=12,Ut=.22,fe=10,Vn=50,Jn=100;function qt(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,guides:[],liveGuide:null,activeGuide:null},i=Je(Yt()),a=0,s=matchMedia("(prefers-color-scheme: dark)"),l=()=>{i=Je(s.matches),I()};s.addEventListener("change",l),Xt(()=>I());function b(){let u=devicePixelRatio;o.width=Math.round(innerWidth*u),o.height=Math.round(innerHeight*u),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(u,0,0,u,0,0),n.translate(.5,.5)}let d=u=>Math.round(u)-.5;function g(u,h){n.strokeStyle=h,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(u.left),Math.round(u.top),Math.round(u.width),Math.round(u.height))}function c(u){n.strokeStyle=we(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let h of[u.left,u.right])n.moveTo(Math.round(h),0),n.lineTo(Math.round(h),innerHeight);for(let h of[u.top,u.bottom])n.moveTo(0,Math.round(h)),n.lineTo(innerWidth,Math.round(h));n.stroke(),n.setLineDash([])}function E(u){if(n.strokeStyle=u.extension?we(i.measure,.55):i.measure,n.lineWidth=1,n.setLineDash(u.extension?[3,3]:[]),n.beginPath(),n.moveTo(Math.round(u.x1),Math.round(u.y1)),n.lineTo(Math.round(u.x2),Math.round(u.y2)),u.extension){n.stroke();return}if(u.axis==="x")for(let h of[u.x1,u.x2])n.moveTo(Math.round(h),Math.round(u.y1)-Ge),n.lineTo(Math.round(h),Math.round(u.y1)+Ge);else for(let h of[u.y1,u.y2])n.moveTo(Math.round(u.x1)-Ge,Math.round(h)),n.lineTo(Math.round(u.x1)+Ge,Math.round(h));n.stroke()}function L(u){return n.font=`${O.medium} ${S.body}px ${S.stack}`,{w:n.measureText(u).width+et*2,h:S.body+et*2+2}}function m(u,h,p,w){n.font=`${O.medium} ${S.body}px ${S.stack}`,n.textBaseline="middle";let{w:x,h:f}=L(u),y=d(Math.min(Math.max(h,Se),innerWidth-x-Se)),z=d(Math.min(Math.max(p,Se),innerHeight-f-Se));n.fillStyle=w,n.beginPath(),n.roundRect(y,z,Math.ceil(x),f,4),n.fill(),n.fillStyle=i.surface,n.fillText(u,y+et,z+f/2)}function M(u,h,p,w,x=!1){let{w:f,h:y}=L(u);m(u,x?h-f/2:h,x?p-y/2:p,w)}function R(){let u=scrollX,h=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,v),n.fillRect(-.5,-.5,v,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${O.regular} 9px ${S.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let f of r.pinned)n.fillRect(d(f.left),-.5,Math.round(f.width),v),n.fillRect(-.5,d(f.top),v,Math.round(f.height));n.restore(),n.beginPath(),n.moveTo(-.5,v-.5),n.lineTo(innerWidth,v-.5),n.moveTo(v-.5,-.5),n.lineTo(v-.5,innerHeight),n.stroke();let p=f=>f%Jn===0?v:f%Vn===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let w=Math.floor(u/fe)*fe;for(let f=w;f<u+innerWidth;f+=fe){let y=Math.round(f-u);if(y<v)continue;let z=p(f);n.moveTo(y,v-z),n.lineTo(y,v),z===v&&(n.fillStyle=i.muted,n.fillText(String(f),y+3,3))}n.stroke(),n.beginPath();let x=Math.floor(h/fe)*fe;for(let f=x;f<h+innerHeight;f+=fe){let y=Math.round(f-h);if(y<v)continue;let z=p(f);n.moveTo(v-z,y),n.lineTo(v,y),z===v&&(n.save(),n.translate(3,y-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(f),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),v),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo(v,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let f of r.guides){let y=Math.round(be(f));f.axis==="x"?n.fillRect(y-1,-.5,2,v):n.fillRect(-.5,y-1,v,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,v,v),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,v,v)}function G(){a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore();for(let p of r.pinned)g(p,i.accent);r.hover&&(c(r.hover),g(r.hover,r.pinned.length?we(i.accent,.7):i.accent));for(let p of r.guides){let w=r.liveGuide?.id===p.id;n.strokeStyle=p.locked||w?i.guide:we(i.guide,.55),n.lineWidth=p.pinned?2:1,n.setLineDash(p.locked?[]:[4,4]),n.beginPath();let x=Math.round(be(p));if(p.axis==="x"?(n.moveTo(x,0),n.lineTo(x,innerHeight)):(n.moveTo(0,x),n.lineTo(innerWidth,x)),n.stroke(),r.activeGuide===p.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let f=7;p.axis==="x"?(n.moveTo(x,0),n.lineTo(x,f),n.moveTo(x,innerHeight-f),n.lineTo(x,innerHeight)):(n.moveTo(0,x),n.lineTo(f,x),n.moveTo(innerWidth-f,x),n.lineTo(innerWidth,x)),n.stroke()}}for(let p of r.lines)n.globalAlpha=p.faded?Ut:1,E(p);n.globalAlpha=1;let u=r.lines.filter(p=>p.label!==""),h=u.map(p=>{let w=(p.x1+p.x2)/2,x=(p.y1+p.y2)/2,{w:f,h:y}=L(p.label);return p.axis==="x"?{x:w-f/2,y:x-16-y/2,w:f,h:y,axis:p.axis}:{x:w+26-f/2,y:x-y/2,w:f,h:y,axis:p.axis}});if(Ot(h,{w:innerWidth,h:innerHeight},Se).forEach((p,w)=>{let x=u[w];n.globalAlpha=x.faded?Ut:1,m(x.label,p.x,p.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:p,height:w,scale:x}=r.hover;M(`${k(p/x.x)} \xD7 ${k(w/x.y)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let p=r.liveGuide,w=Math.round(be(p));M([`${p.axis} ${k(p.at)}`,p.caught,p.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),p.axis==="x"?w+6:30,p.axis==="x"?30:w+6,i.guide)}r.rulers&&R()}function I(){a||(a=requestAnimationFrame(G))}return b(),{root:t,update(u){Object.assign(r,u),I()},resize(){b(),I()},destroy(){a&&cancelAnimationFrame(a),s.removeEventListener("change",l),e.remove()}}}function Qn(e){let t=e.trim().replace(/^#/,""),o=t.length===3?t.split("").map(n=>n+n).join(""):t;return/^[0-9a-f]{6}$/i.test(o)?{r:parseInt(o.slice(0,2),16),g:parseInt(o.slice(2,4),16),b:parseInt(o.slice(4,6),16)}:null}function Zn({r:e,g:t,b:o}){let n=r=>Math.round(r).toString(16).padStart(2,"0");return`#${n(e)}${n(t)}${n(o)}`}function eo({r:e,g:t,b:o}){return`rgb(${Math.round(e)} ${Math.round(t)} ${Math.round(o)})`}function ue(e,t){return String(Number(e.toFixed(t)))}function to({r:e,g:t,b:o}){let n=e/255,r=t/255,i=o/255,a=Math.max(n,r,i),s=Math.min(n,r,i),l=(a+s)/2,b=a-s,d=0,g=0;return b!==0&&(g=b/(1-Math.abs(2*l-1)),a===n?d=(r-i)/b%6:a===r?d=(i-n)/b+2:d=(n-r)/b+4,d*=60,d<0&&(d+=360)),`hsl(${ue(d,1)} ${ue(g*100,1)}% ${ue(l*100,1)}%)`}function tt(e){let t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4}function no(e){let t=tt(e.r),o=tt(e.g),n=tt(e.b),r=.4122214708*t+.5363325363*o+.0514459929*n,i=.2119034982*t+.6806995451*o+.1073969566*n,a=.0883024619*t+.2817188376*o+.6299787005*n,s=Math.cbrt(r),l=Math.cbrt(i),b=Math.cbrt(a),d=.2104542553*s+.793617785*l-.0040720468*b,g=1.9779984951*s-2.428592205*l+.4505937099*b,c=.0259040371*s+.7827717662*l-.808675766*b,E=Math.sqrt(g*g+c*c),L=Math.atan2(c,g)*180/Math.PI;return L<0&&(L+=360),E<1e-4?`oklch(${ue(d,4)} 0 0)`:`oklch(${ue(d,4)} ${ue(E,4)} ${ue(L,2)})`}function Vt(e){let t=Qn(e);return t?[{label:"hex",value:Zn(t)},{label:"rgb",value:eo(t)},{label:"hsl",value:to(t)},{label:"oklch",value:no(t)}]:[]}var oo=`
.picker {
  position: fixed; top: 46px; right: 16px; width: 200px;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${S.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${S.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${N.primary};
  background: ${V};
  box-shadow: ${se};
  display: none;
}
.picker[data-open] { display: block; }
.picker .swatch {
  height: 40px; margin-bottom: 8px;
  border: 1px solid ${ee};
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
.picker button:hover { background: ${H(2)}; }
.picker button:focus-visible { outline: 1px solid ${N.primary}; outline-offset: -1px; }
.picker .k { color: ${N.secondary}; }
.picker .v { overflow-wrap: anywhere; }
.picker .hint {
  margin-top: 6px; padding-top: 6px;
  border-top: 1px solid ${ee};
  color: ${N.secondary};
}
`;function Jt(e){let t=document.createElement("style");t.textContent=oo,e.appendChild(t);let o=document.createElement("div");o.className="picker",e.appendChild(o);let n=document.createElement("div");n.className="swatch";let r=document.createElement("div");r.className="hint";function i(a){n.style.background=a;let s=Vt(a).map(({label:l,value:b})=>{let d=document.createElement("button");d.type="button";let g=document.createElement("span");g.className="k",g.textContent=l;let c=document.createElement("span");return c.className="v",c.textContent=b,d.append(g,c),d.addEventListener("click",E=>{E.stopPropagation(),navigator.clipboard?.writeText(b).then(()=>{r.textContent=`copied ${l}`},()=>{r.textContent="clipboard refused"})}),d});r.textContent="click a row to copy",o.replaceChildren(n,...s,r),o.setAttribute("data-open","")}return{async open(){let a=window.EyeDropper;if(!a){o.replaceChildren(Object.assign(document.createElement("div"),{className:"hint",textContent:"this browser has no eyedropper"})),o.setAttribute("data-open","");return}try{let{sRGBHex:s}=await new a().open();i(s)}catch{}},close(){let a=o.hasAttribute("data-open");return o.removeAttribute("data-open"),a},destroy(){o.remove(),t.remove()}}}var nt="__align_freeze",ro=`
[data-align-frozen] *:not([data-align-ignore]):not([data-align-ignore] *) {
  animation-play-state: paused !important;
}
`,ot=!1,Ne=[],Be=[];function Qt(e){let t=e;for(;t;){if(t instanceof Element&&t.hasAttribute("data-align-ignore"))return!0;let o=t.getRootNode();if(t=o instanceof ShadowRoot?o.host:t.parentNode??null,t===document)return!1}return!1}function Ee(){return ot}function De(e){if(e!==ot){if(ot=e,!e){document.documentElement.removeAttribute("data-align-frozen"),document.getElementById(nt)?.remove();for(let t of Ne)try{t.play()}catch{}for(let t of Be)t.play().catch(()=>{});Ne=[],Be=[];return}if(!document.getElementById(nt)){let t=document.createElement("style");t.id=nt,t.textContent=ro,t.setAttribute("data-align-ignore",""),document.head.appendChild(t)}document.documentElement.setAttribute("data-align-frozen",""),Ne=[];try{for(let t of document.getAnimations()){if(t.playState!=="running")continue;let o=t.effect?.target??null;Qt(o)||(t.pause(),Ne.push(t))}}catch{}Be=[];for(let t of Array.from(document.querySelectorAll("video")))t.paused||Qt(t)||(t.pause(),Be.push(t))}}var rt="__align_xray",io=`
[data-align-xray] * { outline: 1px solid rgb(128 128 128 / 0.55) !important; }
[data-align-xray] [data-align-ignore],
[data-align-xray] [data-align-ignore] * { outline: none !important; }
`;function Ie(e){let t=document.documentElement;if(!e){t.removeAttribute("data-align-xray"),document.getElementById(rt)?.remove();return}if(!document.getElementById(rt)){let o=document.createElement("style");o.id=rt,o.textContent=io,o.setAttribute("data-align-ignore",""),document.head.appendChild(o)}t.setAttribute("data-align-xray","")}var it="align-ui";function Zt(e){try{return localStorage.getItem(e)}catch{return null}}function en(e,t){try{localStorage.setItem(e,t)}catch{}}function tn(e){let t="/";try{t=location.pathname||"/"}catch{}return`${it}:${e}::${t}`}function ao(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function nn(){let e=Zt(tn("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(ao).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function on(e){en(tn("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function rn(e){return Zt(`${it}:${e}`)==="1"}function at(e,t){en(`${it}:${e}`,t?"1":"0")}var W,T=null,F=null,oe=null,xe=null,_=!1,B=null,$=[],Pe=0,j=rn("rulers"),A=[],lt=1,an=!1,ye=null,te=null;function sn(){return A.find(e=>e.id===ye)??null}function ne(e){A=e,on(A)}var P=null,U=null,Y=null,so=3,he=22;function pn(e,t){return j?t<he&&e>=he?"y":e<he&&t>=he?"x":null:null}function ct(e){return e.ctrlKey||e.metaKey}function mn(e,t,o,n){let r=ae(t,o,W),i=e.axis==="x"?t:o,a=A.filter(l=>l.id!==e.id).map(l=>({axis:l.axis,at:$e(l).pos})),s=Bt(i,Dt(r,e.axis,a),n);e.at=s.at+(e.axis==="x"?scrollX:scrollY),e.caught=s.what}function fn(e,t,o,n){let r={id:lt++,axis:e,at:0,locked:!1,caught:"",pinned:!1};return mn(r,t,o,n),ne([...A,r]),r}function hn(e){e.pinned||(te=[e],ne(A.filter(t=>t.id!==e.id)),U?.id===e.id&&(U=null),P?.id===e.id&&(P=null))}function lo(e){let t=W.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function $e(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function ut(){if($.length<2)return[];let e=[];for(let[t,o]of _e($))for(let n of Re(t,o)){if(n.extension||!n.label)continue;let r=kt(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:St(r)})}return e}function D(e){let t=$[$.length-1],o=B&&$.some(c=>c.el===B.el),n=A.map($e),r=!P&&U?U:null,i=A.filter(c=>c.locked||c.id===r?.id),a=!r&&o?B.el:null,s=r??a,l=r?$e(r):null,b=[],d=(c,E)=>{for(let L of c)b.push(s&&!E?{...L,faded:!0}:L)},g=c=>!l||c.axis!==l.axis?!1:(c.axis==="x"?[c.x1,c.x2]:[c.y1,c.y2]).some(L=>Math.abs(L-l.pos)<.5);for(let[c,E]of _e($))d(Re(c,E),c.el===a||E.el===a);t&&B&&!o&&!r&&d(Re(t,B),!0);for(let c of i)for(let E of $)d(Ue(E,[$e(c)]),c.id===r?.id||E.el===a);B&&!o&&!r&&A.length&&d(Ue(B,n),!0);for(let c of It(i.map($e),{x:innerWidth/2,y:innerHeight/2}))d([c],g(c));T?.update({hover:B,pinned:$,rulers:j,guides:A,liveGuide:P??U,activeGuide:ye,lines:b,...e?{cursor:e}:{}}),oe?.update($.length,{rulers:j,xray:_,freeze:Ee(),type:F?.showsType()??!1,panel:F?.isOpen()??!1})}function gn(){let e=F?.asText()??"";e&&navigator.clipboard?.writeText(e).catch(()=>{})}function xn(){!te||te.length===0||(ne([...A,...te.map(e=>({...e,id:lt++}))]),te=null)}function co(e){switch(e){case"rulers":j=!j,at("rulers",j);break;case"xray":_=!_,Ie(_);break;case"freeze":De(!Ee());break;case"type":F?.toggleType();break;case"panel":F?.toggle();break;case"copy":gn();break;case"pick":xe?.open();break;case"undo":xn();break}D()}var Oe=null;function yn(e){if(Oe={x:e.clientX,y:e.clientY},P){Y&&Math.hypot(e.clientX-Y.x,e.clientY-Y.y)>so&&(Y=null),!Y&&!P.pinned&&(mn(P,e.clientX,e.clientY,ct(e)),ne([...A])),D({x:e.clientX,y:e.clientY});return}U=je(A,e.clientX,e.clientY),B=ae(e.clientX,e.clientY,W),D({x:e.clientX,y:e.clientY})}function bn(e){P&&(Y?(P.locked=!P.locked,ye=P.id,ne([...A])):(pn(e.clientX,e.clientY)||e.clientX<he||e.clientY<he)&&hn(P),Y=null,P=null,D({x:e.clientX,y:e.clientY}))}function vn(e){if(e.button!==0)return;let t=ae(e.clientX,e.clientY,W);if(!t)return;let o=pn(e.clientX,e.clientY);if(o){ge(e),Y=null,P=fn(o,e.clientX,e.clientY,ct(e)),D({x:e.clientX,y:e.clientY});return}let n=je(A,e.clientX,e.clientY);if(n){ge(e),ye=n.id,P=n,Y={x:e.clientX,y:e.clientY},D({x:e.clientX,y:e.clientY});return}ge(e),oe?.closeHelp(),$=[t],B=t,F?.show(t,ut()),D({x:e.clientX,y:e.clientY})}function wn(e){let t=ae(e.clientX,e.clientY,W);if(!t)return;ge(e),oe?.closeHelp();let o=$.findIndex(r=>r.el===t.el);$=o>=0?$.filter((r,i)=>i!==o):[...$,t],B=t;let n=$[$.length-1];n?F?.show(n,ut()):F?.hide(),D({x:e.clientX,y:e.clientY})}function kn(e){ae(e.clientX,e.clientY,W)&&ge(e)}function Sn(e){ae(e.clientX,e.clientY,W)&&ge(e)}function ge(e){e.preventDefault(),e.stopPropagation()}function ln(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var cn=0,un=0;function En(){Pe=requestAnimationFrame(En);let t=$.filter(a=>a.el.isConnected).map(a=>Le(a.el)),o=B&&B.el.isConnected?Le(B.el):null;if(!(scrollX!==cn||scrollY!==un||t.length!==$.length||t.some((a,s)=>!ln(a,$[s]))||B===null!=(o===null)||B!==null&&o!==null&&!ln(B,o)))return;cn=scrollX,un=scrollY,$=t,B=o;let i=$[$.length-1];i?F?.show(i,ut()):F?.hide(),D()}function $n(){T?.resize()}function uo(){an||(an=!0,A=nn().map(e=>({...e,id:lt++}))),!T&&(Ht(),T=qt(),F=Kt(T.root),oe=jt(T.root,co),xe=Jt(T.root),oe.update(0,{rulers:j,xray:_,freeze:Ee(),type:!1,panel:!1}),addEventListener("mousemove",yn),addEventListener("mousedown",vn,{capture:!0}),addEventListener("mouseup",bn,{capture:!0}),addEventListener("click",kn,{capture:!0}),addEventListener("auxclick",Sn,{capture:!0}),addEventListener("contextmenu",wn,{capture:!0}),addEventListener("resize",$n),Pe=requestAnimationFrame(En),D())}function st(){removeEventListener("mousemove",yn),removeEventListener("mousedown",vn,{capture:!0}),removeEventListener("mouseup",bn,{capture:!0}),removeEventListener("click",kn,{capture:!0}),removeEventListener("auxclick",Sn,{capture:!0}),removeEventListener("contextmenu",wn,{capture:!0}),removeEventListener("resize",$n),cancelAnimationFrame(Pe),Pe=0,oe?.destroy(),xe?.destroy(),xe=null,_&&(_=!1,Ie(!1)),De(!1),oe=null,F?.destroy(),F=null,T?.destroy(),T=null,Wt(),B=null,$=[],P=null,Y=null,U=null}function dn(e){if(lo(e))e.preventDefault(),T?st():uo();else if(T&&Oe&&(e.key.toLowerCase()===W.guideKeys.vertical||e.key.toLowerCase()===W.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===W.guideKeys.vertical?"x":"y";fn(t,Oe.x,Oe.y,ct(e)),D()}else if(T&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(te=A.filter(t=>!t.pinned),ne(A.filter(t=>t.pinned)),U=null,P=null,Y=null,A.some(t=>t.id===ye)||(ye=null)):U&&hn(U),D();else if(T&&e.key.startsWith("Arrow")){let t=sn(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",ne([...A]),D()}else if(T&&e.key.toLowerCase()==="f")e.preventDefault(),De(!Ee()),D();else if(T&&e.key.toLowerCase()==="x")e.preventDefault(),_=!_,Ie(_);else if(T&&e.key.toLowerCase()==="p")e.preventDefault(),xe?.open();else if(T&&e.key.toLowerCase()==="t")e.preventDefault(),F?.toggleType();else if(T&&e.key.toLowerCase()==="c")e.preventDefault(),gn();else if(T&&e.key.toLowerCase()==="l"){let t=sn();if(!t)return;e.preventDefault(),t.pinned=!t.pinned,ne([...A]),D()}else if(T&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){if(!te||te.length===0)return;e.preventDefault(),xn(),D()}else if(T&&e.key.toLowerCase()===W.rulerKey)e.preventDefault(),j=!j,at("rulers",j),D();else if(T&&e.key.toLowerCase()===W.panelKey)e.preventDefault(),F?.toggle();else if(e.key==="Escape"&&T){if(xe?.close()||oe?.closeHelp())return;$.length?($=[],F?.hide(),D()):st()}}function Yo(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,W=Rt(e),addEventListener("keydown",dn,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{st(),removeEventListener("keydown",dn,{capture:!0}),delete window.__align})}export{Yo as initAlign};
