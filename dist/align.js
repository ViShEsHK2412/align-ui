function le(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function Sn(e){return(e.split(",")[0]??"").trim().replace(/^['"]|['"]$/g,"")}function En(e){let o={100:"thin",200:"extralight",300:"light",400:"regular",500:"medium",600:"semibold",700:"bold",800:"extrabold",900:"black"}[e.trim()];return o?`${e} ${o}`:e}function $e(e){let t=getComputedStyle(e);return[{label:"family",value:Sn(t.fontFamily),px:NaN},{label:"size",value:t.fontSize,px:le(t.fontSize)},{label:"weight",value:En(t.fontWeight),px:NaN},{label:"line",value:t.lineHeight,px:le(t.lineHeight)},{label:"tracking",value:t.letterSpacing,px:le(t.letterSpacing)}]}function ht(e){let t="";for(let o of e.childNodes)o.nodeType===3&&(t+=o.nodeValue??"");return t.trim().replace(/\s+/g," ")}function gt(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:le(r)})}return o}function $n(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function Cn(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function xt(e,t){return t.length===0?"":Cn(e).map(o=>{let n=$n(o,t);return n.length?`${o} ${n.join(" ")}`:`${o} \u2014`}).join("  \xB7  ")}function mt(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(le)}function yt(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),s=a.display.includes("flex")||a.display.includes("grid"),p=n==="x"?a.columnGap:a.rowGap,y=s&&p!=="normal"?le(p):null,[f,k,u,T]=mt(e),[B,d,M,L]=mt(t),A=h=>Number.isFinite(h)?h:0,N=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,l=n==="x"?N?A(k)+A(L):A(d)+A(T):N?A(u)+A(B):A(M)+A(f);return{px:o,cssGap:y,margins:l,siblings:!0}}function bt(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function vt(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}function Oe(e){let t=e.trim().toLowerCase();return t?t.startsWith("#")||/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(t)?!0:["black","white","transparent","currentcolor"].includes(t):!1}var j;function ft(e){if(j===void 0&&(j=document.createElement("canvas").getContext("2d")),!j)return"";j.fillStyle="#000000",j.fillStyle=e;let t=j.fillStyle;return j.fillStyle="#ffffff",j.fillStyle=e,t===j.fillStyle?String(t):""}function wt(e,t){let o=ft(e);return o?t.filter(n=>Oe(n.value)&&ft(n.value)===o).map(n=>n.name).sort():[]}function kt(e){let t=getComputedStyle(e),o=[],n=(r,i)=>{let a=i.trim();!a||a==="transparent"||/rgba?\([^)]*,\s*0\s*\)$/.test(a)||o.push({label:r,value:a})};return n("text",t.color),n("background",t.backgroundColor),o}function Tn(e,t,o){let n=r=>typeof CSS<"u"&&CSS.escape?CSS.escape(r):r.replace(/[^\w-]/g,"\\$&");return t?`#${n(t)}`:o.length?e+o.map(r=>`.${n(r)}`).join(""):e}function He(e){let t=typeof e.className=="string"?e.className.trim().split(/\s+/).filter(Boolean):[];return Tn(e.tagName.toLowerCase(),e.id,t)}function St(e){try{return document.querySelectorAll(He(e)).length}catch{return 0}}function Mn(e){if(!e)return"inline <style>";let t=e.split("?")[0]??e;try{let o=new URL(t,"http://x").pathname;return decodeURI(o).replace(/^\//,"")||t}catch{return t}}var Ln=["width","height","padding","margin","border-width","gap","font-size","line-height","letter-spacing","color","background-color"];function Rn(e){for(let t=0;t<e.length;t+=1){let o=e.item(t);if(Ln.some(n=>o===n||o.startsWith(`${n}-`)))return!0}return!1}function Et(e){let t=[],o=new Set,n=(r,i)=>{for(let a of Array.from(r)){if(a instanceof CSSMediaRule){matchMedia(a.conditionText).matches&&n(a.cssRules,i);continue}if(a instanceof CSSSupportsRule){CSS.supports(a.conditionText)&&n(a.cssRules,i);continue}let s=a.cssRules;if(s&&!(a instanceof CSSStyleRule)){n(s,i);continue}if(!(a instanceof CSSStyleRule))continue;let p=!1;try{p=e.matches(a.selectorText)}catch{continue}if(!p||!Rn(a.style))continue;let y=`${a.selectorText}|${i}`;o.has(y)||(o.add(y),t.push({selector:a.selectorText,file:i}))}};for(let r of Array.from(document.styleSheets)){if(r.ownerNode instanceof Element&&r.ownerNode.hasAttribute("data-align-ignore"))continue;let i;try{i=r.cssRules}catch{continue}n(i,Mn(r.href))}return t.reverse()}var An={ignore:"",hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function Ct(e={}){return{...An,...e}}var $t=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function Tt(e){return e.ignore?`${$t}, ${e.ignore}`:$t}function v(e){return String(Math.round(e*100)/100)}function Gn(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function Me(e){let t=e.getBoundingClientRect();return{el:e,label:Gn(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height}}function Mt(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function ne(e,t,o){let n=Tt(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=Mt(r);return r&&r!==document.documentElement?Me(r):null}var Ce=e=>parseFloat(e)||0;function ze(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[Ce(n),Ce(r),Ce(i),Ce(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function Bn(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function Nn(e,t){let o=t.left+t.width/2,n=t.top+t.height/2;return[{x1:e.left,y1:n,x2:t.left,y2:n,label:v(t.left-e.left),axis:"x"},{x1:t.right,y1:n,x2:e.right,y2:n,label:v(e.right-t.right),axis:"x"},{x1:o,y1:e.top,x2:o,y2:t.top,label:v(t.top-e.top),axis:"y"},{x1:o,y1:t.bottom,x2:o,y2:e.bottom,label:v(e.bottom-t.bottom),axis:"y"}]}function Te(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function Le(e,t){let o=[],n=e.left<t.right&&t.left<e.right,r=e.top<t.bottom&&t.top<e.bottom;if(n&&r){let[i,a]=Bn(e,t);return Nn(i,a)}if(!n){let[i,a]=e.right<=t.left?[e,t]:[t,e],s=r?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:i.right,y1:s,x2:a.left,y2:s,label:`${v(a.left-i.right)}`,axis:"x"}),o.push(...Te(i.right,i.top,i.bottom,s,"x")),o.push(...Te(a.left,a.top,a.bottom,s,"x"))}if(!r){let[i,a]=e.bottom<=t.top?[e,t]:[t,e],s=n?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:s,y1:i.bottom,x2:s,y2:a.top,label:`${v(a.top-i.bottom)}`,axis:"y"}),o.push(...Te(i.bottom,i.left,i.right,s,"y")),o.push(...Te(a.top,a.left,a.right,s,"y"))}return o}function Dn(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function We(e){let t=Dn(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var In=5,Pn=8;function fe(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function Ye(e,t,o){let n=null,r=In;for(let i of e){let a=Math.abs(fe(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function Lt(e,t,o){if(o)return{at:e,what:""};let n=null,r=Pn;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function Rt(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function Xe(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,s=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:s,y2:i,label:v(r.gap),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,s=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:s,label:v(r.gap),axis:"y"})}}return o}function At(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],s=r[i],p=s-a;p<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:s,y2:t.y,label:v(p),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:s,label:v(p),axis:"y"}))}}return o}var J=3;function Fn(e,t){return e.x<t.x+t.w+J&&t.x<e.x+e.w+J&&e.y<t.y+t.h+J&&t.y<e.y+e.h+J}function Gt(e,t,o=12){let n=(a,s)=>Math.min(Math.max(a,o),t.w-s-o),r=(a,s)=>Math.min(Math.max(a,o),t.h-s-o),i=[];for(let a of e){let s={...a,x:n(a.x,a.w),y:r(a.y,a.h)},p=!1;for(let y=0;y<16;y++){let f=i.find(u=>Fn(u,s));if(!f)break;let k=s.axis==="x"?s.y:s.x;if(s.axis==="x"?s.y=r(p?f.y+f.h+J:f.y-s.h-J,s.h):s.x=n(p?f.x-s.w-J:f.x+f.w+J,s.w),(s.axis==="x"?s.y:s.x)===k){if(p)break;p=!0}}i.push(s)}return i}function On(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(s=>parseFloat(s)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function Ke(e){let t=1,o=1;for(let n=e;n;n=Mt(n)){let r=On(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var K=(e,t)=>({light:e,dark:t}),_e={accent:K("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:K("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:K("oklch(1 0 0)","oklch(0.264 0 0)"),fg:K("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:K("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:K("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:K("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:K("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)")};function Nt(e){return`light-dark(${e.light}, ${e.dark})`}var U=Nt(K("#fafafa","#1a1a1a"));function he(e){return Nt(K(`rgb(0 0 0 / ${e})`,`rgb(255 255 255 / ${e})`))}var Bt=[0,.07,.08,.1,.12,.15,.2];function Y(e){let t=Bt[Math.max(0,Math.min(Bt.length-1,e))];return t===0?U:he(t)}var O={primary:he(.9),secondary:he(.6),tertiary:he(.4)},oe=he(.12),re="0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)",Dt="0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)";var Hn='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',w={title:13,body:12,tag:11,stack:Hn},F={regular:400,medium:500,semibold:600},je="__align_font",zn="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function It(){if(document.getElementById(je))return;let e=document.createElement("link");e.id=je,e.rel="stylesheet",e.href=zn,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function Pt(){document.getElementById(je)?.remove()}function Ft(e){let t=[`${F.medium} ${w.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function Ue(e){let t={};for(let o of Object.keys(_e))t[o]=e?_e[o].dark:_e[o].light;return t}function Ot(){return matchMedia("(prefers-color-scheme: dark)").matches}function ge(e,t){return e.replace(/\)$/,` / ${t})`)}var Wn=`
`,q=16,Yn=`
.dock {
  /* On .dock, not :host \u2014 the host's inline all:initial outranks a :host rule,
     which would pin color-scheme to normal and resolve light-dark() to its
     light branch on a dark page. */
  color-scheme: light dark;
  position: fixed; left: ${q}px; top: 0; width: 340px;
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none; user-select: none;
  font-family: ${w.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${O.primary};
  --muted: ${O.secondary};
  --border: ${oe};
}
.panel {
  padding: 10px; border-radius: 0;
  /* Five sections now \u2014 box, tokens, styled by, matches, colour \u2014 and on a
     laptop that is taller than the window. place() clamps the position but
     cannot rescue a panel taller than the screen, so it scrolls instead. */
  max-height: calc(100vh - ${q*2}px);
  overflow-y: auto; overscroll-behavior: contain;
  font-size: ${w.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${U};

  box-shadow: ${re};

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
  background: ${U};
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] .panel { box-shadow: ${Dt}; }
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${w.title}px; font-weight: ${F.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${w.body}px; font-weight: ${F.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${w.tag}px; font-weight: ${F.medium};
  margin-left: 4px;
  color: ${O.primary};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${w.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${Y(1)}; }

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
.region[data-level="1"] { background: ${Y(1)}; }
.region[data-level="2"] { background: ${Y(2)}; }
.region[data-level="3"] { background: ${Y(3)}; }
.content { background: ${Y(4)}; }

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
  font-size: ${w.tag}px; font-weight: ${F.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${F.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${F.regular}; }
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
  font-size: ${w.tag}px; line-height: 1.5;
}
.readout-key { color: var(--muted); }
.readout-value { color: var(--fg); overflow-wrap: anywhere; }
.content {
  border-radius: 0; padding: 14px 8px;
  text-align: center; font-weight: ${F.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,xe=q,ie=-1,ye=!1;function Ht(e){let t=document.createElement("style");t.textContent=Yn,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);let r=!1;function i(d,M){let L=document.createElement("div");L.className="readout";let A=document.createElement("div");A.className="tag readout-tag",A.textContent=d,L.appendChild(A);for(let[N,l]of M){let h=document.createElement("div");h.className="readout-row";let c=document.createElement("span");c.className="readout-key",c.textContent=N;let b=document.createElement("span");b.className="readout-value",b.textContent=l,h.append(c,b),L.appendChild(h)}return L}e.appendChild(o);let a=(d,M)=>Math.min(Math.max(d,q),Math.max(q,M-q));function s(){let d=o.offsetHeight||300;ie<0&&(ie=Math.max(q,innerHeight-d-q)),xe=a(xe,innerWidth-o.offsetWidth),ie=a(ie,innerHeight-d),o.style.transform=`translate(${xe-q}px, ${ie}px)`}let p=null;function y(d){d.button===0&&(d.preventDefault(),d.stopPropagation(),p={x:d.clientX,y:d.clientY,dx:xe,dy:ie},o.setAttribute("data-dragging",""),d.currentTarget.setPointerCapture(d.pointerId))}function f(d){p&&(xe=p.dx+(d.clientX-p.x),ie=p.dy+(d.clientY-p.y),s())}function k(){p=null,o.removeAttribute("data-dragging")}addEventListener("resize",s);let u=null;function T(d){let M=document.createElement("div");return M.className="edge",M.textContent=d===0?"0":v(d),d===0&&M.setAttribute("data-zero",""),M}function B(d,M,L,A){let[N,l,h,c]=L,b=document.createElement("div");b.className="region",b.setAttribute("data-level",String(M));let g=document.createElement("span");g.className="tag",g.textContent=d;let m=document.createElement("div");m.className="row";let x=document.createElement("div");x.className="fill",x.appendChild(A),m.append(T(c),x,T(l));let P=document.createElement("div");return P.className="head",P.append(g,T(N)),b.append(P,m,T(h)),b}return{show(d,M=[]){let L=ze(d.el),[A,N,l,h]=L.border,[c,b,g,m]=L.padding,x=Ke(d.el),P=d.width/x.x,De=d.height/x.y,kn=Math.abs(x.x-1)>.001||Math.abs(x.y-1)>.001,V=document.createElement("header"),Ie=document.createElement("span");Ie.className="name",Ie.textContent=d.label;let Pe=document.createElement("span");Pe.className="size",Pe.textContent=`${v(P)} \xD7 ${v(De)}`;let se=document.createElement("button");if(se.className="close",se.textContent="\xD7",se.title="close (B brings it back)",se.addEventListener("pointerdown",$=>$.stopPropagation()),se.addEventListener("click",$=>{$.stopPropagation(),ye=!0,o.removeAttribute("data-open")}),V.append(Ie,Pe),kn){let $=document.createElement("span");$.className="scale",$.textContent=`\xD7${v(x.x)}`,$.title=`renders at ${v(d.width)} \xD7 ${v(d.height)}`,V.appendChild($)}V.appendChild(se),V.addEventListener("pointerdown",y),V.addEventListener("pointermove",f),V.addEventListener("pointerup",k),V.addEventListener("pointercancel",k);let Fe=document.createElement("div");Fe.className="content",Fe.textContent=`${v(P-h-N-m-b)} \xD7 ${v(De-A-l-c-g)}`;let ee=[V,B("margin",1,L.margin,B("border",2,L.border,B("padding",3,L.padding,Fe)))];if(r){let $=ht(d.el),te=$e(d.el);ee.push(te.length&&$?i("type",te.map(W=>[W.label,W.value])):i("type",[["","nothing of its own to set type on"]]))}if(M.length){let $=M.map(W=>[v(W.px),W.detail]),te=vt(M.map(W=>W.px));te&&$.push(["",te]),ee.push(i("gaps",$))}let st=gt(d.el),lt=xt([P,De,...L.margin,...L.border,...L.padding,...r?$e(d.el).map($=>$.px):[]],st);lt&&ee.push(i("tokens",[["",lt]]));let ct=Et(d.el);ct.length&&ee.push(i("styled by",ct.slice(0,4).map($=>[$.selector,$.file])));let ut=St(d.el);ut>1&&ee.push(i("matches",[["",`${ut} elements share ${He(d.el)}`]]));let dt=st.filter($=>Oe($.value));if(dt.length){let $=kt(d.el).map(({label:te,value:W})=>{let pt=wt(W,dt);return[te,pt.length?`${W}  ${pt.join(" ")}`:`${W}  \u2014`]});$.length&&ee.push(i("colour",$))}n.replaceChildren(...ee),u=d,s(),!ye&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},toggleType(){r=!r,u&&this.show(u)},asText(){if(!u)return"";let d=ze(u.el),M=Ke(u.el),L=u.width/M.x,A=u.height/M.y,N=h=>h.map(c=>v(c)).join(" "),l=[`${u.label}  ${v(L)} \xD7 ${v(A)}`,`margin   ${N(d.margin)}`,`border   ${N(d.border)}`,`padding  ${N(d.padding)}`];if(r)for(let h of $e(u.el))l.push(`${h.label.padEnd(8)} ${h.value}`);return l.join(Wn)},hide(){u=null,o.removeAttribute("data-open")},toggle(){u&&(ye=!ye,ye?o.removeAttribute("data-open"):(s(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",s),o.remove(),t.remove()}}}var Xn=[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure what is under the cursor"],["Click","lock an element"],["Right-click","add to, or drop from, the locked set"],["Drag the panel header","move the box model"],["B","hide or bring back the box model"],["R","rulers down the top and left edges"],["Drag from a rule","pull out a guide; drag it back to remove"],["V","vertical guide at the cursor"],["H","horizontal guide at the cursor"],["Hover a guide","distance from it to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the last guide you touched; Shift for 10px"],["L","pin that guide so it cannot be moved or deleted"],["Ctrl/Cmd + Z","bring back the guides you just deleted"],["T","type and token readout for the locked element"],["F","freeze the page so a moving thing can be measured"],["X","x-ray: outline every element on the page"],["P","pick a colour from anywhere on screen"],["C","copy the numbers in the panel"],["Ctrl/Cmd while placing","ignore snapping"],["Del","remove the guide under the cursor; Shift+Del for all"],["Esc","clear the locks, then close"]],be=16,zt=w.tag+12,Wt=8,Kn=`
.flag {
  position: fixed; top: ${be}px; right: ${be}px;
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${w.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${w.tag}px; font-weight: ${F.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${O.primary};
  background: ${U};
  box-shadow: ${re};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
.flag:hover { background: ${Y(1)}; }
.flag .count { color: ${O.secondary}; }
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: ${be+zt+Wt}px; right: ${be}px; width: 292px;
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${be*2+zt+Wt}px); overflow-y: auto;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${w.stack};
  font-synthesis: none;
  font-size: ${w.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${O.primary};
  background: ${U};
  box-shadow: ${re};
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
  font: inherit; font-weight: ${F.medium};
  border: 1px solid ${oe};
  background: ${Y(2)};
}
.help dd { margin: 0; color: ${O.secondary}; }
`;function Yt(e){let t=document.createElement("style");t.textContent=Kn,e.appendChild(t);let o=document.createElement("div");o.className="flag";let n=document.createElement("span");n.className="name",n.textContent="Align";let r=document.createElement("span");r.className="count",o.append(n,r);let i=document.createElement("div");i.className="help";let a=document.createElement("dl");for(let[s,p]of Xn){let y=document.createElement("dt"),f=document.createElement("kbd");f.textContent=s,y.appendChild(f);let k=document.createElement("dd");k.textContent=p,a.append(y,k)}return i.appendChild(a),o.addEventListener("click",s=>{s.stopPropagation(),i.toggleAttribute("data-open")}),e.append(o,i),{update(s){r.textContent=s>0?`${s} locked`:""},closeHelp(){let s=i.hasAttribute("data-open");return i.removeAttribute("data-open"),s},destroy(){o.remove(),i.remove(),t.remove()}}}var Re=5,qe=4,ve=12,Xt=.22,S=22,ce=10,_n=50,jn=100;function Kt(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,guides:[],liveGuide:null,activeGuide:null},i=Ue(Ot()),a=0,s=matchMedia("(prefers-color-scheme: dark)"),p=()=>{i=Ue(s.matches),N()};s.addEventListener("change",p),Ft(()=>N());function y(){let l=devicePixelRatio;o.width=Math.round(innerWidth*l),o.height=Math.round(innerHeight*l),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(l,0,0,l,0,0),n.translate(.5,.5)}let f=l=>Math.round(l)-.5;function k(l,h){n.strokeStyle=h,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(l.left),Math.round(l.top),Math.round(l.width),Math.round(l.height))}function u(l){n.strokeStyle=ge(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let h of[l.left,l.right])n.moveTo(Math.round(h),0),n.lineTo(Math.round(h),innerHeight);for(let h of[l.top,l.bottom])n.moveTo(0,Math.round(h)),n.lineTo(innerWidth,Math.round(h));n.stroke(),n.setLineDash([])}function T(l){if(n.strokeStyle=l.extension?ge(i.measure,.55):i.measure,n.lineWidth=1,n.setLineDash(l.extension?[3,3]:[]),n.beginPath(),n.moveTo(Math.round(l.x1),Math.round(l.y1)),n.lineTo(Math.round(l.x2),Math.round(l.y2)),l.extension){n.stroke();return}if(l.axis==="x")for(let h of[l.x1,l.x2])n.moveTo(Math.round(h),Math.round(l.y1)-Re),n.lineTo(Math.round(h),Math.round(l.y1)+Re);else for(let h of[l.y1,l.y2])n.moveTo(Math.round(l.x1)-Re,Math.round(h)),n.lineTo(Math.round(l.x1)+Re,Math.round(h));n.stroke()}function B(l){return n.font=`${F.medium} ${w.body}px ${w.stack}`,{w:n.measureText(l).width+qe*2,h:w.body+qe*2+2}}function d(l,h,c,b){n.font=`${F.medium} ${w.body}px ${w.stack}`,n.textBaseline="middle";let{w:g,h:m}=B(l),x=f(Math.min(Math.max(h,ve),innerWidth-g-ve)),P=f(Math.min(Math.max(c,ve),innerHeight-m-ve));n.fillStyle=b,n.beginPath(),n.roundRect(x,P,Math.ceil(g),m,4),n.fill(),n.fillStyle=i.surface,n.fillText(l,x+qe,P+m/2)}function M(l,h,c,b,g=!1){let{w:m,h:x}=B(l);d(l,g?h-m/2:h,g?c-x/2:c,b)}function L(){let l=scrollX,h=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,S),n.fillRect(-.5,-.5,S,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${F.regular} 9px ${w.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let m of r.pinned)n.fillRect(f(m.left),-.5,Math.round(m.width),S),n.fillRect(-.5,f(m.top),S,Math.round(m.height));n.restore(),n.beginPath(),n.moveTo(-.5,S-.5),n.lineTo(innerWidth,S-.5),n.moveTo(S-.5,-.5),n.lineTo(S-.5,innerHeight),n.stroke();let c=m=>m%jn===0?S:m%_n===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let b=Math.floor(l/ce)*ce;for(let m=b;m<l+innerWidth;m+=ce){let x=Math.round(m-l);if(x<S)continue;let P=c(m);n.moveTo(x,S-P),n.lineTo(x,S),P===S&&(n.fillStyle=i.muted,n.fillText(String(m),x+3,3))}n.stroke(),n.beginPath();let g=Math.floor(h/ce)*ce;for(let m=g;m<h+innerHeight;m+=ce){let x=Math.round(m-h);if(x<S)continue;let P=c(m);n.moveTo(S-P,x),n.lineTo(S,x),P===S&&(n.save(),n.translate(3,x-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(m),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),S),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo(S,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let m of r.guides){let x=Math.round(fe(m));m.axis==="x"?n.fillRect(x-1,-.5,2,S):n.fillRect(-.5,x-1,S,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,S,S),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,S,S)}function A(){a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore();for(let c of r.pinned)k(c,i.accent);r.hover&&(u(r.hover),k(r.hover,r.pinned.length?ge(i.accent,.7):i.accent));for(let c of r.guides){let b=r.liveGuide?.id===c.id;n.strokeStyle=c.locked||b?i.guide:ge(i.guide,.55),n.lineWidth=c.pinned?2:1,n.setLineDash(c.locked?[]:[4,4]),n.beginPath();let g=Math.round(fe(c));if(c.axis==="x"?(n.moveTo(g,0),n.lineTo(g,innerHeight)):(n.moveTo(0,g),n.lineTo(innerWidth,g)),n.stroke(),r.activeGuide===c.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let m=7;c.axis==="x"?(n.moveTo(g,0),n.lineTo(g,m),n.moveTo(g,innerHeight-m),n.lineTo(g,innerHeight)):(n.moveTo(0,g),n.lineTo(m,g),n.moveTo(innerWidth-m,g),n.lineTo(innerWidth,g)),n.stroke()}}for(let c of r.lines)n.globalAlpha=c.faded?Xt:1,T(c);n.globalAlpha=1;let l=r.lines.filter(c=>c.label!==""),h=l.map(c=>{let b=(c.x1+c.x2)/2,g=(c.y1+c.y2)/2,{w:m,h:x}=B(c.label);return c.axis==="x"?{x:b-m/2,y:g-16-x/2,w:m,h:x,axis:c.axis}:{x:b+26-m/2,y:g-x/2,w:m,h:x,axis:c.axis}});if(Gt(h,{w:innerWidth,h:innerHeight},ve).forEach((c,b)=>{let g=l[b];n.globalAlpha=g.faded?Xt:1,d(g.label,c.x,c.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:c,height:b}=r.hover;M(`${v(c)} \xD7 ${v(b)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let c=r.liveGuide,b=Math.round(fe(c));M([`${c.axis} ${v(c.at)}`,c.caught,c.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),c.axis==="x"?b+6:30,c.axis==="x"?30:b+6,i.guide)}r.rulers&&L()}function N(){a||(a=requestAnimationFrame(A))}return y(),{root:t,update(l){Object.assign(r,l),N()},resize(){y(),N()},destroy(){a&&cancelAnimationFrame(a),s.removeEventListener("change",p),e.remove()}}}function Un(e){let t=e.trim().replace(/^#/,""),o=t.length===3?t.split("").map(n=>n+n).join(""):t;return/^[0-9a-f]{6}$/i.test(o)?{r:parseInt(o.slice(0,2),16),g:parseInt(o.slice(2,4),16),b:parseInt(o.slice(4,6),16)}:null}function qn({r:e,g:t,b:o}){let n=r=>Math.round(r).toString(16).padStart(2,"0");return`#${n(e)}${n(t)}${n(o)}`}function Vn({r:e,g:t,b:o}){return`rgb(${Math.round(e)} ${Math.round(t)} ${Math.round(o)})`}function ae(e,t){return String(Number(e.toFixed(t)))}function Jn({r:e,g:t,b:o}){let n=e/255,r=t/255,i=o/255,a=Math.max(n,r,i),s=Math.min(n,r,i),p=(a+s)/2,y=a-s,f=0,k=0;return y!==0&&(k=y/(1-Math.abs(2*p-1)),a===n?f=(r-i)/y%6:a===r?f=(i-n)/y+2:f=(n-r)/y+4,f*=60,f<0&&(f+=360)),`hsl(${ae(f,1)} ${ae(k*100,1)}% ${ae(p*100,1)}%)`}function Ve(e){let t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4}function Qn(e){let t=Ve(e.r),o=Ve(e.g),n=Ve(e.b),r=.4122214708*t+.5363325363*o+.0514459929*n,i=.2119034982*t+.6806995451*o+.1073969566*n,a=.0883024619*t+.2817188376*o+.6299787005*n,s=Math.cbrt(r),p=Math.cbrt(i),y=Math.cbrt(a),f=.2104542553*s+.793617785*p-.0040720468*y,k=1.9779984951*s-2.428592205*p+.4505937099*y,u=.0259040371*s+.7827717662*p-.808675766*y,T=Math.sqrt(k*k+u*u),B=Math.atan2(u,k)*180/Math.PI;return B<0&&(B+=360),T<1e-4?`oklch(${ae(f,4)} 0 0)`:`oklch(${ae(f,4)} ${ae(T,4)} ${ae(B,2)})`}function _t(e){let t=Un(e);return t?[{label:"hex",value:qn(t)},{label:"rgb",value:Vn(t)},{label:"hsl",value:Jn(t)},{label:"oklch",value:Qn(t)}]:[]}var Zn=`
.picker {
  position: fixed; top: 46px; right: 16px; width: 200px;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${w.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${w.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${O.primary};
  background: ${U};
  box-shadow: ${re};
  display: none;
}
.picker[data-open] { display: block; }
.picker .swatch {
  height: 40px; margin-bottom: 8px;
  border: 1px solid ${oe};
}
/* Each row copies itself, so the whole row is the target rather than the text. */
.picker button {
  display: grid; grid-template-columns: 34px 1fr;
  gap: 8px; align-items: baseline;
  width: 100%; padding: 3px 4px; margin: 0;
  border: 0; background: none; cursor: pointer;
  font: inherit; text-align: left;
  color: ${O.primary};
}
.picker button:hover { background: ${Y(2)}; }
.picker button:focus-visible { outline: 1px solid ${O.primary}; outline-offset: -1px; }
.picker .k { color: ${O.secondary}; }
.picker .v { overflow-wrap: anywhere; }
.picker .hint {
  margin-top: 6px; padding-top: 6px;
  border-top: 1px solid ${oe};
  color: ${O.secondary};
}
`;function jt(e){let t=document.createElement("style");t.textContent=Zn,e.appendChild(t);let o=document.createElement("div");o.className="picker",e.appendChild(o);let n=document.createElement("div");n.className="swatch";let r=document.createElement("div");r.className="hint";function i(a){n.style.background=a;let s=_t(a).map(({label:p,value:y})=>{let f=document.createElement("button");f.type="button";let k=document.createElement("span");k.className="k",k.textContent=p;let u=document.createElement("span");return u.className="v",u.textContent=y,f.append(k,u),f.addEventListener("click",T=>{T.stopPropagation(),navigator.clipboard?.writeText(y).then(()=>{r.textContent=`copied ${p}`},()=>{r.textContent="clipboard refused"})}),f});r.textContent="click a row to copy",o.replaceChildren(n,...s,r),o.setAttribute("data-open","")}return{async open(){let a=window.EyeDropper;if(!a){o.replaceChildren(Object.assign(document.createElement("div"),{className:"hint",textContent:"this browser has no eyedropper"})),o.setAttribute("data-open","");return}try{let{sRGBHex:s}=await new a().open();i(s)}catch{}},close(){let a=o.hasAttribute("data-open");return o.removeAttribute("data-open"),a},destroy(){o.remove(),t.remove()}}}var Je="__align_freeze",eo=`
[data-align-frozen] *:not([data-align-ignore]):not([data-align-ignore] *) {
  animation-play-state: paused !important;
}
`,Qe=!1,Ae=[],Ge=[];function Ut(e){let t=e;for(;t;){if(t instanceof Element&&t.hasAttribute("data-align-ignore"))return!0;let o=t.getRootNode();if(t=o instanceof ShadowRoot?o.host:t.parentNode??null,t===document)return!1}return!1}function qt(){return Qe}function Ze(e){if(e!==Qe){if(Qe=e,!e){document.documentElement.removeAttribute("data-align-frozen"),document.getElementById(Je)?.remove();for(let t of Ae)try{t.play()}catch{}for(let t of Ge)t.play().catch(()=>{});Ae=[],Ge=[];return}if(!document.getElementById(Je)){let t=document.createElement("style");t.id=Je,t.textContent=eo,t.setAttribute("data-align-ignore",""),document.head.appendChild(t)}document.documentElement.setAttribute("data-align-frozen",""),Ae=[];try{for(let t of document.getAnimations()){if(t.playState!=="running")continue;let o=t.effect?.target??null;Ut(o)||(t.pause(),Ae.push(t))}}catch{}Ge=[];for(let t of Array.from(document.querySelectorAll("video")))t.paused||Ut(t)||(t.pause(),Ge.push(t))}}var et="__align_xray",to=`
[data-align-xray] * { outline: 1px solid rgb(128 128 128 / 0.55) !important; }
[data-align-xray] [data-align-ignore],
[data-align-xray] [data-align-ignore] * { outline: none !important; }
`;function tt(e){let t=document.documentElement;if(!e){t.removeAttribute("data-align-xray"),document.getElementById(et)?.remove();return}if(!document.getElementById(et)){let o=document.createElement("style");o.id=et,o.textContent=to,o.setAttribute("data-align-ignore",""),document.head.appendChild(o)}t.setAttribute("data-align-xray","")}var nt="align-ui";function Vt(e){try{return localStorage.getItem(e)}catch{return null}}function Jt(e,t){try{localStorage.setItem(e,t)}catch{}}function Qt(e){let t="/";try{t=location.pathname||"/"}catch{}return`${nt}:${e}::${t}`}function no(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function Zt(){let e=Vt(Qt("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(no).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function en(e){Jt(Qt("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function tn(e){return Vt(`${nt}:${e}`)==="1"}function nn(e,t){Jt(`${nt}:${e}`,t?"1":"0")}var H,C=null,z=null,Z=null,Ee=null,ke=!1,G=null,E=[],Ne=0,Se=tn("rulers"),R=[],rt=1,on=!1,me=null,ue=null;function rn(){return R.find(e=>e.id===me)??null}function Q(e){R=e,en(R)}var I=null,_=null,X=null,oo=3,de=22;function un(e,t){return Se?t<de&&e>=de?"y":e<de&&t>=de?"x":null:null}function it(e){return e.ctrlKey||e.metaKey}function dn(e,t,o,n){let r=ne(t,o,H),i=e.axis==="x"?t:o,a=R.filter(p=>p.id!==e.id).map(p=>({axis:p.axis,at:we(p).pos})),s=Lt(i,Rt(r,e.axis,a),n);e.at=s.at+(e.axis==="x"?scrollX:scrollY),e.caught=s.what}function pn(e,t,o,n){let r={id:rt++,axis:e,at:0,locked:!1,caught:"",pinned:!1};return dn(r,t,o,n),Q([...R,r]),r}function mn(e){e.pinned||(ue=[e],Q(R.filter(t=>t.id!==e.id)),_?.id===e.id&&(_=null),I?.id===e.id&&(I=null))}function ro(e){let t=H.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function we(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function at(){if(E.length<2)return[];let e=[];for(let[t,o]of We(E))for(let n of Le(t,o)){if(n.extension||!n.label)continue;let r=yt(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:bt(r)})}return e}function D(e){let t=E[E.length-1],o=G&&E.some(u=>u.el===G.el),n=R.map(we),r=!I&&_?_:null,i=R.filter(u=>u.locked||u.id===r?.id),a=!r&&o?G.el:null,s=r??a,p=r?we(r):null,y=[],f=(u,T)=>{for(let B of u)y.push(s&&!T?{...B,faded:!0}:B)},k=u=>!p||u.axis!==p.axis?!1:(u.axis==="x"?[u.x1,u.x2]:[u.y1,u.y2]).some(B=>Math.abs(B-p.pos)<.5);for(let[u,T]of We(E))f(Le(u,T),u.el===a||T.el===a);t&&G&&!o&&!r&&f(Le(t,G),!0);for(let u of i)for(let T of E)f(Xe(T,[we(u)]),u.id===r?.id||T.el===a);G&&!o&&!r&&R.length&&f(Xe(G,n),!0);for(let u of At(i.map(we),{x:innerWidth/2,y:innerHeight/2}))f([u],k(u));C?.update({hover:G,pinned:E,rulers:Se,guides:R,liveGuide:I??_,activeGuide:me,lines:y,...e?{cursor:e}:{}}),Z?.update(E.length)}var Be=null;function fn(e){if(Be={x:e.clientX,y:e.clientY},I){X&&Math.hypot(e.clientX-X.x,e.clientY-X.y)>oo&&(X=null),!X&&!I.pinned&&(dn(I,e.clientX,e.clientY,it(e)),Q([...R])),D({x:e.clientX,y:e.clientY});return}_=Ye(R,e.clientX,e.clientY),G=ne(e.clientX,e.clientY,H),D({x:e.clientX,y:e.clientY})}function hn(e){I&&(X?(I.locked=!I.locked,me=I.id,Q([...R])):(un(e.clientX,e.clientY)||e.clientX<de||e.clientY<de)&&mn(I),X=null,I=null,D({x:e.clientX,y:e.clientY}))}function gn(e){if(e.button!==0)return;let t=ne(e.clientX,e.clientY,H);if(!t)return;let o=un(e.clientX,e.clientY);if(o){pe(e),X=null,I=pn(o,e.clientX,e.clientY,it(e)),D({x:e.clientX,y:e.clientY});return}let n=Ye(R,e.clientX,e.clientY);if(n){pe(e),me=n.id,I=n,X={x:e.clientX,y:e.clientY},D({x:e.clientX,y:e.clientY});return}pe(e),Z?.closeHelp(),E=[t],G=t,z?.show(t,at()),D({x:e.clientX,y:e.clientY})}function xn(e){let t=ne(e.clientX,e.clientY,H);if(!t)return;pe(e),Z?.closeHelp();let o=E.findIndex(r=>r.el===t.el);E=o>=0?E.filter((r,i)=>i!==o):[...E,t],G=t;let n=E[E.length-1];n?z?.show(n,at()):z?.hide(),D({x:e.clientX,y:e.clientY})}function yn(e){ne(e.clientX,e.clientY,H)&&pe(e)}function bn(e){ne(e.clientX,e.clientY,H)&&pe(e)}function pe(e){e.preventDefault(),e.stopPropagation()}function an(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var sn=0,ln=0;function vn(){Ne=requestAnimationFrame(vn);let t=E.filter(a=>a.el.isConnected).map(a=>Me(a.el)),o=G&&G.el.isConnected?Me(G.el):null;if(!(scrollX!==sn||scrollY!==ln||t.length!==E.length||t.some((a,s)=>!an(a,E[s]))||G===null!=(o===null)||G!==null&&o!==null&&!an(G,o)))return;sn=scrollX,ln=scrollY,E=t,G=o;let i=E[E.length-1];i?z?.show(i,at()):z?.hide(),D()}function wn(){C?.resize()}function io(){on||(on=!0,R=Zt().map(e=>({...e,id:rt++}))),!C&&(It(),C=Kt(),z=Ht(C.root),Z=Yt(C.root),Ee=jt(C.root),Z.update(0),addEventListener("mousemove",fn),addEventListener("mousedown",gn,{capture:!0}),addEventListener("mouseup",hn,{capture:!0}),addEventListener("click",yn,{capture:!0}),addEventListener("auxclick",bn,{capture:!0}),addEventListener("contextmenu",xn,{capture:!0}),addEventListener("resize",wn),Ne=requestAnimationFrame(vn),D())}function ot(){removeEventListener("mousemove",fn),removeEventListener("mousedown",gn,{capture:!0}),removeEventListener("mouseup",hn,{capture:!0}),removeEventListener("click",yn,{capture:!0}),removeEventListener("auxclick",bn,{capture:!0}),removeEventListener("contextmenu",xn,{capture:!0}),removeEventListener("resize",wn),cancelAnimationFrame(Ne),Ne=0,Z?.destroy(),Ee?.destroy(),Ee=null,ke&&(ke=!1,tt(!1)),Ze(!1),Z=null,z?.destroy(),z=null,C?.destroy(),C=null,Pt(),G=null,E=[],I=null,X=null,_=null}function cn(e){if(ro(e))e.preventDefault(),C?ot():io();else if(C&&Be&&(e.key.toLowerCase()===H.guideKeys.vertical||e.key.toLowerCase()===H.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===H.guideKeys.vertical?"x":"y";pn(t,Be.x,Be.y,it(e)),D()}else if(C&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(ue=R.filter(t=>!t.pinned),Q(R.filter(t=>t.pinned)),_=null,I=null,X=null,R.some(t=>t.id===me)||(me=null)):_&&mn(_),D();else if(C&&e.key.startsWith("Arrow")){let t=rn(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",Q([...R]),D()}else if(C&&e.key.toLowerCase()==="f")e.preventDefault(),Ze(!qt()),D();else if(C&&e.key.toLowerCase()==="x")e.preventDefault(),ke=!ke,tt(ke);else if(C&&e.key.toLowerCase()==="p")e.preventDefault(),Ee?.open();else if(C&&e.key.toLowerCase()==="t")e.preventDefault(),z?.toggleType();else if(C&&e.key.toLowerCase()==="c"){e.preventDefault();let t=z?.asText()??"";t&&navigator.clipboard?.writeText(t).catch(()=>{})}else if(C&&e.key.toLowerCase()==="l"){let t=rn();if(!t)return;e.preventDefault(),t.pinned=!t.pinned,Q([...R]),D()}else if(C&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){if(!ue||ue.length===0)return;e.preventDefault(),Q([...R,...ue.map(t=>({...t,id:rt++}))]),ue=null,D()}else if(C&&e.key.toLowerCase()===H.rulerKey)e.preventDefault(),Se=!Se,nn("rulers",Se),D();else if(C&&e.key.toLowerCase()===H.panelKey)e.preventDefault(),z?.toggle();else if(e.key==="Escape"&&C){if(Ee?.close()||Z?.closeHelp())return;E.length?(E=[],z?.hide(),D()):ot()}}function Oo(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,H=Ct(e),addEventListener("keydown",cn,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{ot(),removeEventListener("keydown",cn,{capture:!0}),delete window.__align})}export{Oo as initAlign};
