function le(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function gn(e){return(e.split(",")[0]??"").trim().replace(/^['"]|['"]$/g,"")}function xn(e){let o={100:"thin",200:"extralight",300:"light",400:"regular",500:"medium",600:"semibold",700:"bold",800:"extrabold",900:"black"}[e.trim()];return o?`${e} ${o}`:e}function $e(e){let t=getComputedStyle(e);return[{label:"family",value:gn(t.fontFamily),px:NaN},{label:"size",value:t.fontSize,px:le(t.fontSize)},{label:"weight",value:xn(t.fontWeight),px:NaN},{label:"line",value:t.lineHeight,px:le(t.lineHeight)},{label:"tracking",value:t.letterSpacing,px:le(t.letterSpacing)}]}function ut(e){let t="";for(let o of e.childNodes)o.nodeType===3&&(t+=o.nodeValue??"");return t.trim().replace(/\s+/g," ")}function dt(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:le(r)})}return o}function yn(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function bn(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function pt(e,t){return t.length===0?"":bn(e).map(o=>{let n=yn(o,t);return n.length?`${o} ${n.join(" ")}`:`${o} \u2014`}).join("  \xB7  ")}function lt(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(le)}function mt(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),s=a.display.includes("flex")||a.display.includes("grid"),p=n==="x"?a.columnGap:a.rowGap,y=s&&p!=="normal"?le(p):null,[h,k,u,C]=lt(e),[B,d,T,L]=lt(t),G=f=>Number.isFinite(f)?f:0,N=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,l=n==="x"?N?G(k)+G(L):G(d)+G(C):N?G(u)+G(B):G(T)+G(h);return{px:o,cssGap:y,margins:l,siblings:!0}}function ht(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function ft(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}function Ie(e){let t=e.trim().toLowerCase();return t?t.startsWith("#")||/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(t)?!0:["black","white","transparent","currentcolor"].includes(t):!1}var j;function ct(e){if(j===void 0&&(j=document.createElement("canvas").getContext("2d")),!j)return"";j.fillStyle="#000000",j.fillStyle=e;let t=j.fillStyle;return j.fillStyle="#ffffff",j.fillStyle=e,t===j.fillStyle?String(t):""}function gt(e,t){let o=ct(e);return o?t.filter(n=>Ie(n.value)&&ct(n.value)===o).map(n=>n.name).sort():[]}function xt(e){let t=getComputedStyle(e),o=[],n=(r,i)=>{let a=i.trim();!a||a==="transparent"||/rgba?\([^)]*,\s*0\s*\)$/.test(a)||o.push({label:r,value:a})};return n("text",t.color),n("background",t.backgroundColor),o}function vn(e,t,o){let n=r=>typeof CSS<"u"&&CSS.escape?CSS.escape(r):r.replace(/[^\w-]/g,"\\$&");return t?`#${n(t)}`:o.length?e+o.map(r=>`.${n(r)}`).join(""):e}function Oe(e){let t=typeof e.className=="string"?e.className.trim().split(/\s+/).filter(Boolean):[];return vn(e.tagName.toLowerCase(),e.id,t)}function yt(e){try{return document.querySelectorAll(Oe(e)).length}catch{return 0}}function wn(e){if(!e)return"inline <style>";let t=e.split("?")[0]??e;try{let o=new URL(t,"http://x").pathname;return decodeURI(o).replace(/^\//,"")||t}catch{return t}}var kn=["width","height","padding","margin","border-width","gap","font-size","line-height","letter-spacing","color","background-color"];function Sn(e){for(let t=0;t<e.length;t+=1){let o=e.item(t);if(kn.some(n=>o===n||o.startsWith(`${n}-`)))return!0}return!1}function bt(e){let t=[],o=new Set,n=(r,i)=>{for(let a of Array.from(r)){if(a instanceof CSSMediaRule){matchMedia(a.conditionText).matches&&n(a.cssRules,i);continue}if(a instanceof CSSSupportsRule){CSS.supports(a.conditionText)&&n(a.cssRules,i);continue}let s=a.cssRules;if(s&&!(a instanceof CSSStyleRule)){n(s,i);continue}if(!(a instanceof CSSStyleRule))continue;let p=!1;try{p=e.matches(a.selectorText)}catch{continue}if(!p||!Sn(a.style))continue;let y=`${a.selectorText}|${i}`;o.has(y)||(o.add(y),t.push({selector:a.selectorText,file:i}))}};for(let r of Array.from(document.styleSheets)){if(r.ownerNode instanceof Element&&r.ownerNode.hasAttribute("data-align-ignore"))continue;let i;try{i=r.cssRules}catch{continue}n(i,wn(r.href))}return t.reverse()}var En={ignore:"",hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function wt(e={}){return{...En,...e}}var vt=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function kt(e){return e.ignore?`${vt}, ${e.ignore}`:vt}function v(e){return String(Math.round(e*100)/100)}function $n(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function Me(e){let t=e.getBoundingClientRect();return{el:e,label:$n(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height}}function St(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function ne(e,t,o){let n=kt(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=St(r);return r&&r!==document.documentElement?Me(r):null}var Ce=e=>parseFloat(e)||0;function Fe(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[Ce(n),Ce(r),Ce(i),Ce(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function Cn(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function Tn(e,t){let o=t.left+t.width/2,n=t.top+t.height/2;return[{x1:e.left,y1:n,x2:t.left,y2:n,label:v(t.left-e.left),axis:"x"},{x1:t.right,y1:n,x2:e.right,y2:n,label:v(e.right-t.right),axis:"x"},{x1:o,y1:e.top,x2:o,y2:t.top,label:v(t.top-e.top),axis:"y"},{x1:o,y1:t.bottom,x2:o,y2:e.bottom,label:v(e.bottom-t.bottom),axis:"y"}]}function Te(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function Le(e,t){let o=[],n=e.left<t.right&&t.left<e.right,r=e.top<t.bottom&&t.top<e.bottom;if(n&&r){let[i,a]=Cn(e,t);return Tn(i,a)}if(!n){let[i,a]=e.right<=t.left?[e,t]:[t,e],s=r?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:i.right,y1:s,x2:a.left,y2:s,label:`${v(a.left-i.right)}`,axis:"x"}),o.push(...Te(i.right,i.top,i.bottom,s,"x")),o.push(...Te(a.left,a.top,a.bottom,s,"x"))}if(!r){let[i,a]=e.bottom<=t.top?[e,t]:[t,e],s=n?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:s,y1:i.bottom,x2:s,y2:a.top,label:`${v(a.top-i.bottom)}`,axis:"y"}),o.push(...Te(i.bottom,i.left,i.right,s,"y")),o.push(...Te(a.top,a.left,a.right,s,"y"))}return o}function Mn(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function He(e){let t=Mn(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var Ln=5,Rn=8;function he(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function We(e,t,o){let n=null,r=Ln;for(let i of e){let a=Math.abs(he(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function Et(e,t,o){if(o)return{at:e,what:""};let n=null,r=Rn;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function $t(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function ze(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,s=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:s,y2:i,label:v(r.gap),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,s=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:s,label:v(r.gap),axis:"y"})}}return o}function Ct(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],s=r[i],p=s-a;p<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:s,y2:t.y,label:v(p),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:s,label:v(p),axis:"y"}))}}return o}var Q=3;function Gn(e,t){return e.x<t.x+t.w+Q&&t.x<e.x+e.w+Q&&e.y<t.y+t.h+Q&&t.y<e.y+e.h+Q}function Tt(e,t,o=12){let n=(a,s)=>Math.min(Math.max(a,o),t.w-s-o),r=(a,s)=>Math.min(Math.max(a,o),t.h-s-o),i=[];for(let a of e){let s={...a,x:n(a.x,a.w),y:r(a.y,a.h)},p=!1;for(let y=0;y<16;y++){let h=i.find(u=>Gn(u,s));if(!h)break;let k=s.axis==="x"?s.y:s.x;if(s.axis==="x"?s.y=r(p?h.y+h.h+Q:h.y-s.h-Q,s.h):s.x=n(p?h.x-s.w-Q:h.x+h.w+Q,s.w),(s.axis==="x"?s.y:s.x)===k){if(p)break;p=!0}}i.push(s)}return i}function An(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(s=>parseFloat(s)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function Xe(e){let t=1,o=1;for(let n=e;n;n=St(n)){let r=An(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var K=(e,t)=>({light:e,dark:t}),Ye={accent:K("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:K("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:K("oklch(1 0 0)","oklch(0.264 0 0)"),fg:K("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:K("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:K("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:K("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:K("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)")};function Lt(e){return`light-dark(${e.light}, ${e.dark})`}var U=Lt(K("#fafafa","#1a1a1a"));function fe(e){return Lt(K(`rgb(0 0 0 / ${e})`,`rgb(255 255 255 / ${e})`))}var Mt=[0,.07,.08,.1,.12,.15,.2];function X(e){let t=Mt[Math.max(0,Math.min(Mt.length-1,e))];return t===0?U:fe(t)}var F={primary:fe(.9),secondary:fe(.6),tertiary:fe(.4)},oe=fe(.12),re="0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)",Rt="0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)";var Bn='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',w={title:13,body:12,tag:11,stack:Bn},I={regular:400,medium:500,semibold:600},Ke="__align_font",Nn="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function Gt(){if(document.getElementById(Ke))return;let e=document.createElement("link");e.id=Ke,e.rel="stylesheet",e.href=Nn,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function At(){document.getElementById(Ke)?.remove()}function Bt(e){let t=[`${I.medium} ${w.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function _e(e){let t={};for(let o of Object.keys(Ye))t[o]=e?Ye[o].dark:Ye[o].light;return t}function Nt(){return matchMedia("(prefers-color-scheme: dark)").matches}function ge(e,t){return e.replace(/\)$/,` / ${t})`)}var Dn=`
`,q=16,Pn=`
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

  --fg: ${F.primary};
  --muted: ${F.secondary};
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
.dock[data-dragging] .panel { box-shadow: ${Rt}; }
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${w.title}px; font-weight: ${I.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${w.body}px; font-weight: ${I.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${w.tag}px; font-weight: ${I.medium};
  margin-left: 4px;
  color: ${F.primary};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${w.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${X(1)}; }

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
.region[data-level="1"] { background: ${X(1)}; }
.region[data-level="2"] { background: ${X(2)}; }
.region[data-level="3"] { background: ${X(3)}; }
.content { background: ${X(4)}; }

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
  font-size: ${w.tag}px; font-weight: ${I.medium};
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
.readout-row {
  display: grid; grid-template-columns: 62px 1fr;
  gap: 8px; align-items: baseline;
  font-size: ${w.tag}px; line-height: 1.5;
}
.readout-key { color: var(--muted); }
.readout-value { color: var(--fg); overflow-wrap: anywhere; }
.content {
  border-radius: 0; padding: 14px 8px;
  text-align: center; font-weight: ${I.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,xe=q,ie=-1,ye=!1;function Dt(e){let t=document.createElement("style");t.textContent=Pn,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);let r=!1;function i(d,T){let L=document.createElement("div");L.className="readout";let G=document.createElement("div");G.className="tag readout-tag",G.textContent=d,L.appendChild(G);for(let[N,l]of T){let f=document.createElement("div");f.className="readout-row";let c=document.createElement("span");c.className="readout-key",c.textContent=N;let b=document.createElement("span");b.className="readout-value",b.textContent=l,f.append(c,b),L.appendChild(f)}return L}e.appendChild(o);let a=(d,T)=>Math.min(Math.max(d,q),Math.max(q,T-q));function s(){let d=o.offsetHeight||300;ie<0&&(ie=Math.max(q,innerHeight-d-q)),xe=a(xe,innerWidth-o.offsetWidth),ie=a(ie,innerHeight-d),o.style.transform=`translate(${xe-q}px, ${ie}px)`}let p=null;function y(d){d.button===0&&(d.preventDefault(),d.stopPropagation(),p={x:d.clientX,y:d.clientY,dx:xe,dy:ie},o.setAttribute("data-dragging",""),d.currentTarget.setPointerCapture(d.pointerId))}function h(d){p&&(xe=p.dx+(d.clientX-p.x),ie=p.dy+(d.clientY-p.y),s())}function k(){p=null,o.removeAttribute("data-dragging")}addEventListener("resize",s);let u=null;function C(d){let T=document.createElement("div");return T.className="edge",T.textContent=d===0?"0":v(d),d===0&&T.setAttribute("data-zero",""),T}function B(d,T,L,G){let[N,l,f,c]=L,b=document.createElement("div");b.className="region",b.setAttribute("data-level",String(T));let g=document.createElement("span");g.className="tag",g.textContent=d;let m=document.createElement("div");m.className="row";let x=document.createElement("div");x.className="fill",x.appendChild(G),m.append(C(c),x,C(l));let P=document.createElement("div");return P.className="head",P.append(g,C(N)),b.append(P,m,C(f)),b}return{show(d,T=[]){let L=Fe(d.el),[G,N,l,f]=L.border,[c,b,g,m]=L.padding,x=Xe(d.el),P=d.width/x.x,Be=d.height/x.y,fn=Math.abs(x.x-1)>.001||Math.abs(x.y-1)>.001,J=document.createElement("header"),Ne=document.createElement("span");Ne.className="name",Ne.textContent=d.label;let De=document.createElement("span");De.className="size",De.textContent=`${v(P)} \xD7 ${v(Be)}`;let se=document.createElement("button");if(se.className="close",se.textContent="\xD7",se.title="close (B brings it back)",se.addEventListener("pointerdown",$=>$.stopPropagation()),se.addEventListener("click",$=>{$.stopPropagation(),ye=!0,o.removeAttribute("data-open")}),J.append(Ne,De),fn){let $=document.createElement("span");$.className="scale",$.textContent=`\xD7${v(x.x)}`,$.title=`renders at ${v(d.width)} \xD7 ${v(d.height)}`,J.appendChild($)}J.appendChild(se),J.addEventListener("pointerdown",y),J.addEventListener("pointermove",h),J.addEventListener("pointerup",k),J.addEventListener("pointercancel",k);let Pe=document.createElement("div");Pe.className="content",Pe.textContent=`${v(P-f-N-m-b)} \xD7 ${v(Be-G-l-c-g)}`;let ee=[J,B("margin",1,L.margin,B("border",2,L.border,B("padding",3,L.padding,Pe)))];if(r){let $=ut(d.el),te=$e(d.el);ee.push(te.length&&$?i("type",te.map(z=>[z.label,z.value])):i("type",[["","nothing of its own to set type on"]]))}if(T.length){let $=T.map(z=>[v(z.px),z.detail]),te=ft(T.map(z=>z.px));te&&$.push(["",te]),ee.push(i("gaps",$))}let nt=dt(d.el),ot=pt([P,Be,...L.margin,...L.border,...L.padding,...r?$e(d.el).map($=>$.px):[]],nt);ot&&ee.push(i("tokens",[["",ot]]));let rt=bt(d.el);rt.length&&ee.push(i("styled by",rt.slice(0,4).map($=>[$.selector,$.file])));let it=yt(d.el);it>1&&ee.push(i("matches",[["",`${it} elements share ${Oe(d.el)}`]]));let at=nt.filter($=>Ie($.value));if(at.length){let $=xt(d.el).map(({label:te,value:z})=>{let st=gt(z,at);return[te,st.length?`${z}  ${st.join(" ")}`:`${z}  \u2014`]});$.length&&ee.push(i("colour",$))}n.replaceChildren(...ee),u=d,s(),!ye&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},toggleType(){r=!r,u&&this.show(u)},asText(){if(!u)return"";let d=Fe(u.el),T=Xe(u.el),L=u.width/T.x,G=u.height/T.y,N=f=>f.map(c=>v(c)).join(" "),l=[`${u.label}  ${v(L)} \xD7 ${v(G)}`,`margin   ${N(d.margin)}`,`border   ${N(d.border)}`,`padding  ${N(d.padding)}`];if(r)for(let f of $e(u.el))l.push(`${f.label.padEnd(8)} ${f.value}`);return l.join(Dn)},hide(){u=null,o.removeAttribute("data-open")},toggle(){u&&(ye=!ye,ye?o.removeAttribute("data-open"):(s(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",s),o.remove(),t.remove()}}}var In=[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure what is under the cursor"],["Click","lock an element"],["Right-click","add to, or drop from, the locked set"],["Drag the panel header","move the box model"],["B","hide or bring back the box model"],["R","rulers down the top and left edges"],["Drag from a rule","pull out a guide; drag it back to remove"],["V","vertical guide at the cursor"],["H","horizontal guide at the cursor"],["Hover a guide","distance from it to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the last guide you touched; Shift for 10px"],["L","pin that guide so it cannot be moved or deleted"],["Ctrl/Cmd + Z","bring back the guides you just deleted"],["T","type and token readout for the locked element"],["X","x-ray: outline every element on the page"],["P","pick a colour from anywhere on screen"],["C","copy the numbers in the panel"],["Ctrl/Cmd while placing","ignore snapping"],["Del","remove the guide under the cursor; Shift+Del for all"],["Esc","clear the locks, then close"]],be=16,Pt=w.tag+12,It=8,On=`
.flag {
  position: fixed; top: ${be}px; right: ${be}px;
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${w.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${w.tag}px; font-weight: ${I.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${F.primary};
  background: ${U};
  box-shadow: ${re};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
.flag:hover { background: ${X(1)}; }
.flag .count { color: ${F.secondary}; }
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: ${be+Pt+It}px; right: ${be}px; width: 292px;
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${be*2+Pt+It}px); overflow-y: auto;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${w.stack};
  font-synthesis: none;
  font-size: ${w.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${F.primary};
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
  font: inherit; font-weight: ${I.medium};
  border: 1px solid ${oe};
  background: ${X(2)};
}
.help dd { margin: 0; color: ${F.secondary}; }
`;function Ot(e){let t=document.createElement("style");t.textContent=On,e.appendChild(t);let o=document.createElement("div");o.className="flag";let n=document.createElement("span");n.className="name",n.textContent="Align";let r=document.createElement("span");r.className="count",o.append(n,r);let i=document.createElement("div");i.className="help";let a=document.createElement("dl");for(let[s,p]of In){let y=document.createElement("dt"),h=document.createElement("kbd");h.textContent=s,y.appendChild(h);let k=document.createElement("dd");k.textContent=p,a.append(y,k)}return i.appendChild(a),o.addEventListener("click",s=>{s.stopPropagation(),i.toggleAttribute("data-open")}),e.append(o,i),{update(s){r.textContent=s>0?`${s} locked`:""},closeHelp(){let s=i.hasAttribute("data-open");return i.removeAttribute("data-open"),s},destroy(){o.remove(),i.remove(),t.remove()}}}var Re=5,je=4,ve=12,Ft=.22,S=22,ce=10,Fn=50,Hn=100;function Ht(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,guides:[],liveGuide:null,activeGuide:null},i=_e(Nt()),a=0,s=matchMedia("(prefers-color-scheme: dark)"),p=()=>{i=_e(s.matches),N()};s.addEventListener("change",p),Bt(()=>N());function y(){let l=devicePixelRatio;o.width=Math.round(innerWidth*l),o.height=Math.round(innerHeight*l),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(l,0,0,l,0,0),n.translate(.5,.5)}let h=l=>Math.round(l)-.5;function k(l,f){n.strokeStyle=f,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(l.left),Math.round(l.top),Math.round(l.width),Math.round(l.height))}function u(l){n.strokeStyle=ge(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let f of[l.left,l.right])n.moveTo(Math.round(f),0),n.lineTo(Math.round(f),innerHeight);for(let f of[l.top,l.bottom])n.moveTo(0,Math.round(f)),n.lineTo(innerWidth,Math.round(f));n.stroke(),n.setLineDash([])}function C(l){if(n.strokeStyle=l.extension?ge(i.measure,.55):i.measure,n.lineWidth=1,n.setLineDash(l.extension?[3,3]:[]),n.beginPath(),n.moveTo(Math.round(l.x1),Math.round(l.y1)),n.lineTo(Math.round(l.x2),Math.round(l.y2)),l.extension){n.stroke();return}if(l.axis==="x")for(let f of[l.x1,l.x2])n.moveTo(Math.round(f),Math.round(l.y1)-Re),n.lineTo(Math.round(f),Math.round(l.y1)+Re);else for(let f of[l.y1,l.y2])n.moveTo(Math.round(l.x1)-Re,Math.round(f)),n.lineTo(Math.round(l.x1)+Re,Math.round(f));n.stroke()}function B(l){return n.font=`${I.medium} ${w.body}px ${w.stack}`,{w:n.measureText(l).width+je*2,h:w.body+je*2+2}}function d(l,f,c,b){n.font=`${I.medium} ${w.body}px ${w.stack}`,n.textBaseline="middle";let{w:g,h:m}=B(l),x=h(Math.min(Math.max(f,ve),innerWidth-g-ve)),P=h(Math.min(Math.max(c,ve),innerHeight-m-ve));n.fillStyle=b,n.beginPath(),n.roundRect(x,P,Math.ceil(g),m,4),n.fill(),n.fillStyle=i.surface,n.fillText(l,x+je,P+m/2)}function T(l,f,c,b,g=!1){let{w:m,h:x}=B(l);d(l,g?f-m/2:f,g?c-x/2:c,b)}function L(){let l=scrollX,f=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,S),n.fillRect(-.5,-.5,S,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${I.regular} 9px ${w.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let m of r.pinned)n.fillRect(h(m.left),-.5,Math.round(m.width),S),n.fillRect(-.5,h(m.top),S,Math.round(m.height));n.restore(),n.beginPath(),n.moveTo(-.5,S-.5),n.lineTo(innerWidth,S-.5),n.moveTo(S-.5,-.5),n.lineTo(S-.5,innerHeight),n.stroke();let c=m=>m%Hn===0?S:m%Fn===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let b=Math.floor(l/ce)*ce;for(let m=b;m<l+innerWidth;m+=ce){let x=Math.round(m-l);if(x<S)continue;let P=c(m);n.moveTo(x,S-P),n.lineTo(x,S),P===S&&(n.fillStyle=i.muted,n.fillText(String(m),x+3,3))}n.stroke(),n.beginPath();let g=Math.floor(f/ce)*ce;for(let m=g;m<f+innerHeight;m+=ce){let x=Math.round(m-f);if(x<S)continue;let P=c(m);n.moveTo(S-P,x),n.lineTo(S,x),P===S&&(n.save(),n.translate(3,x-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(m),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),S),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo(S,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let m of r.guides){let x=Math.round(he(m));m.axis==="x"?n.fillRect(x-1,-.5,2,S):n.fillRect(-.5,x-1,S,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,S,S),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,S,S)}function G(){a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore();for(let c of r.pinned)k(c,i.accent);r.hover&&(u(r.hover),k(r.hover,r.pinned.length?ge(i.accent,.7):i.accent));for(let c of r.guides){let b=r.liveGuide?.id===c.id;n.strokeStyle=c.locked||b?i.guide:ge(i.guide,.55),n.lineWidth=c.pinned?2:1,n.setLineDash(c.locked?[]:[4,4]),n.beginPath();let g=Math.round(he(c));if(c.axis==="x"?(n.moveTo(g,0),n.lineTo(g,innerHeight)):(n.moveTo(0,g),n.lineTo(innerWidth,g)),n.stroke(),r.activeGuide===c.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let m=7;c.axis==="x"?(n.moveTo(g,0),n.lineTo(g,m),n.moveTo(g,innerHeight-m),n.lineTo(g,innerHeight)):(n.moveTo(0,g),n.lineTo(m,g),n.moveTo(innerWidth-m,g),n.lineTo(innerWidth,g)),n.stroke()}}for(let c of r.lines)n.globalAlpha=c.faded?Ft:1,C(c);n.globalAlpha=1;let l=r.lines.filter(c=>c.label!==""),f=l.map(c=>{let b=(c.x1+c.x2)/2,g=(c.y1+c.y2)/2,{w:m,h:x}=B(c.label);return c.axis==="x"?{x:b-m/2,y:g-16-x/2,w:m,h:x,axis:c.axis}:{x:b+26-m/2,y:g-x/2,w:m,h:x,axis:c.axis}});if(Tt(f,{w:innerWidth,h:innerHeight},ve).forEach((c,b)=>{let g=l[b];n.globalAlpha=g.faded?Ft:1,d(g.label,c.x,c.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:c,height:b}=r.hover;T(`${v(c)} \xD7 ${v(b)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let c=r.liveGuide,b=Math.round(he(c));T([`${c.axis} ${v(c.at)}`,c.caught,c.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),c.axis==="x"?b+6:30,c.axis==="x"?30:b+6,i.guide)}r.rulers&&L()}function N(){a||(a=requestAnimationFrame(G))}return y(),{root:t,update(l){Object.assign(r,l),N()},resize(){y(),N()},destroy(){a&&cancelAnimationFrame(a),s.removeEventListener("change",p),e.remove()}}}function Wn(e){let t=e.trim().replace(/^#/,""),o=t.length===3?t.split("").map(n=>n+n).join(""):t;return/^[0-9a-f]{6}$/i.test(o)?{r:parseInt(o.slice(0,2),16),g:parseInt(o.slice(2,4),16),b:parseInt(o.slice(4,6),16)}:null}function zn({r:e,g:t,b:o}){let n=r=>Math.round(r).toString(16).padStart(2,"0");return`#${n(e)}${n(t)}${n(o)}`}function Xn({r:e,g:t,b:o}){return`rgb(${Math.round(e)} ${Math.round(t)} ${Math.round(o)})`}function ae(e,t){return String(Number(e.toFixed(t)))}function Yn({r:e,g:t,b:o}){let n=e/255,r=t/255,i=o/255,a=Math.max(n,r,i),s=Math.min(n,r,i),p=(a+s)/2,y=a-s,h=0,k=0;return y!==0&&(k=y/(1-Math.abs(2*p-1)),a===n?h=(r-i)/y%6:a===r?h=(i-n)/y+2:h=(n-r)/y+4,h*=60,h<0&&(h+=360)),`hsl(${ae(h,1)} ${ae(k*100,1)}% ${ae(p*100,1)}%)`}function Ue(e){let t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4}function Kn(e){let t=Ue(e.r),o=Ue(e.g),n=Ue(e.b),r=.4122214708*t+.5363325363*o+.0514459929*n,i=.2119034982*t+.6806995451*o+.1073969566*n,a=.0883024619*t+.2817188376*o+.6299787005*n,s=Math.cbrt(r),p=Math.cbrt(i),y=Math.cbrt(a),h=.2104542553*s+.793617785*p-.0040720468*y,k=1.9779984951*s-2.428592205*p+.4505937099*y,u=.0259040371*s+.7827717662*p-.808675766*y,C=Math.sqrt(k*k+u*u),B=Math.atan2(u,k)*180/Math.PI;return B<0&&(B+=360),C<1e-4?`oklch(${ae(h,4)} 0 0)`:`oklch(${ae(h,4)} ${ae(C,4)} ${ae(B,2)})`}function Wt(e){let t=Wn(e);return t?[{label:"hex",value:zn(t)},{label:"rgb",value:Xn(t)},{label:"hsl",value:Yn(t)},{label:"oklch",value:Kn(t)}]:[]}var _n=`
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
  color: ${F.primary};
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
  color: ${F.primary};
}
.picker button:hover { background: ${X(2)}; }
.picker button:focus-visible { outline: 1px solid ${F.primary}; outline-offset: -1px; }
.picker .k { color: ${F.secondary}; }
.picker .v { overflow-wrap: anywhere; }
.picker .hint {
  margin-top: 6px; padding-top: 6px;
  border-top: 1px solid ${oe};
  color: ${F.secondary};
}
`;function zt(e){let t=document.createElement("style");t.textContent=_n,e.appendChild(t);let o=document.createElement("div");o.className="picker",e.appendChild(o);let n=document.createElement("div");n.className="swatch";let r=document.createElement("div");r.className="hint";function i(a){n.style.background=a;let s=Wt(a).map(({label:p,value:y})=>{let h=document.createElement("button");h.type="button";let k=document.createElement("span");k.className="k",k.textContent=p;let u=document.createElement("span");return u.className="v",u.textContent=y,h.append(k,u),h.addEventListener("click",C=>{C.stopPropagation(),navigator.clipboard?.writeText(y).then(()=>{r.textContent=`copied ${p}`},()=>{r.textContent="clipboard refused"})}),h});r.textContent="click a row to copy",o.replaceChildren(n,...s,r),o.setAttribute("data-open","")}return{async open(){let a=window.EyeDropper;if(!a){o.replaceChildren(Object.assign(document.createElement("div"),{className:"hint",textContent:"this browser has no eyedropper"})),o.setAttribute("data-open","");return}try{let{sRGBHex:s}=await new a().open();i(s)}catch{}},close(){let a=o.hasAttribute("data-open");return o.removeAttribute("data-open"),a},destroy(){o.remove(),t.remove()}}}var qe="__align_xray",jn=`
[data-align-xray] * { outline: 1px solid rgb(128 128 128 / 0.55) !important; }
[data-align-xray] [data-align-ignore],
[data-align-xray] [data-align-ignore] * { outline: none !important; }
`;function Je(e){let t=document.documentElement;if(!e){t.removeAttribute("data-align-xray"),document.getElementById(qe)?.remove();return}if(!document.getElementById(qe)){let o=document.createElement("style");o.id=qe,o.textContent=jn,o.setAttribute("data-align-ignore",""),document.head.appendChild(o)}t.setAttribute("data-align-xray","")}var Qe="align-ui";function Xt(e){try{return localStorage.getItem(e)}catch{return null}}function Yt(e,t){try{localStorage.setItem(e,t)}catch{}}function Kt(e){let t="/";try{t=location.pathname||"/"}catch{}return`${Qe}:${e}::${t}`}function Un(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function _t(){let e=Xt(Kt("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(Un).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function jt(e){Yt(Kt("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function Ut(e){return Xt(`${Qe}:${e}`)==="1"}function qt(e,t){Yt(`${Qe}:${e}`,t?"1":"0")}var H,M=null,W=null,Z=null,Ee=null,ke=!1,A=null,E=[],Ae=0,Se=Ut("rulers"),R=[],Ze=1,Jt=!1,me=null,ue=null;function Qt(){return R.find(e=>e.id===me)??null}function V(e){R=e,jt(R)}var D=null,_=null,Y=null,qn=3,de=22;function nn(e,t){return Se?t<de&&e>=de?"y":e<de&&t>=de?"x":null:null}function et(e){return e.ctrlKey||e.metaKey}function on(e,t,o,n){let r=ne(t,o,H),i=e.axis==="x"?t:o,a=R.filter(p=>p.id!==e.id).map(p=>({axis:p.axis,at:we(p).pos})),s=Et(i,$t(r,e.axis,a),n);e.at=s.at+(e.axis==="x"?scrollX:scrollY),e.caught=s.what}function rn(e,t,o,n){let r={id:Ze++,axis:e,at:0,locked:!1,caught:"",pinned:!1};return on(r,t,o,n),V([...R,r]),r}function an(e){e.pinned||(ue=[e],V(R.filter(t=>t.id!==e.id)),_?.id===e.id&&(_=null),D?.id===e.id&&(D=null))}function Jn(e){let t=H.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function we(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function tt(){if(E.length<2)return[];let e=[];for(let[t,o]of He(E))for(let n of Le(t,o)){if(n.extension||!n.label)continue;let r=mt(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:ht(r)})}return e}function O(e){let t=E[E.length-1],o=A&&E.some(u=>u.el===A.el),n=R.map(we),r=!D&&_?_:null,i=R.filter(u=>u.locked||u.id===r?.id),a=!r&&o?A.el:null,s=r??a,p=r?we(r):null,y=[],h=(u,C)=>{for(let B of u)y.push(s&&!C?{...B,faded:!0}:B)},k=u=>!p||u.axis!==p.axis?!1:(u.axis==="x"?[u.x1,u.x2]:[u.y1,u.y2]).some(B=>Math.abs(B-p.pos)<.5);for(let[u,C]of He(E))h(Le(u,C),u.el===a||C.el===a);t&&A&&!o&&!r&&h(Le(t,A),!0);for(let u of i)for(let C of E)h(ze(C,[we(u)]),u.id===r?.id||C.el===a);A&&!o&&!r&&R.length&&h(ze(A,n),!0);for(let u of Ct(i.map(we),{x:innerWidth/2,y:innerHeight/2}))h([u],k(u));M?.update({hover:A,pinned:E,rulers:Se,guides:R,liveGuide:D??_,activeGuide:me,lines:y,...e?{cursor:e}:{}}),Z?.update(E.length)}var Ge=null;function sn(e){if(Ge={x:e.clientX,y:e.clientY},D){Y&&Math.hypot(e.clientX-Y.x,e.clientY-Y.y)>qn&&(Y=null),!Y&&!D.pinned&&(on(D,e.clientX,e.clientY,et(e)),V([...R])),O({x:e.clientX,y:e.clientY});return}_=We(R,e.clientX,e.clientY),A=ne(e.clientX,e.clientY,H),O({x:e.clientX,y:e.clientY})}function ln(e){D&&(Y?(D.locked=!D.locked,me=D.id,V([...R])):(nn(e.clientX,e.clientY)||e.clientX<de||e.clientY<de)&&an(D),Y=null,D=null,O({x:e.clientX,y:e.clientY}))}function cn(e){if(e.button!==0)return;let t=ne(e.clientX,e.clientY,H);if(!t)return;let o=nn(e.clientX,e.clientY);if(o){pe(e),Y=null,D=rn(o,e.clientX,e.clientY,et(e)),O({x:e.clientX,y:e.clientY});return}let n=We(R,e.clientX,e.clientY);if(n){pe(e),me=n.id,D=n,Y={x:e.clientX,y:e.clientY},O({x:e.clientX,y:e.clientY});return}pe(e),Z?.closeHelp(),E=[t],A=t,W?.show(t,tt()),O({x:e.clientX,y:e.clientY})}function un(e){let t=ne(e.clientX,e.clientY,H);if(!t)return;pe(e),Z?.closeHelp();let o=E.findIndex(r=>r.el===t.el);E=o>=0?E.filter((r,i)=>i!==o):[...E,t],A=t;let n=E[E.length-1];n?W?.show(n,tt()):W?.hide(),O({x:e.clientX,y:e.clientY})}function dn(e){ne(e.clientX,e.clientY,H)&&pe(e)}function pn(e){ne(e.clientX,e.clientY,H)&&pe(e)}function pe(e){e.preventDefault(),e.stopPropagation()}function Vt(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var Zt=0,en=0;function mn(){Ae=requestAnimationFrame(mn);let t=E.filter(a=>a.el.isConnected).map(a=>Me(a.el)),o=A&&A.el.isConnected?Me(A.el):null;if(!(scrollX!==Zt||scrollY!==en||t.length!==E.length||t.some((a,s)=>!Vt(a,E[s]))||A===null!=(o===null)||A!==null&&o!==null&&!Vt(A,o)))return;Zt=scrollX,en=scrollY,E=t,A=o;let i=E[E.length-1];i?W?.show(i,tt()):W?.hide(),O()}function hn(){M?.resize()}function Qn(){Jt||(Jt=!0,R=_t().map(e=>({...e,id:Ze++}))),!M&&(Gt(),M=Ht(),W=Dt(M.root),Z=Ot(M.root),Ee=zt(M.root),Z.update(0),addEventListener("mousemove",sn),addEventListener("mousedown",cn,{capture:!0}),addEventListener("mouseup",ln,{capture:!0}),addEventListener("click",dn,{capture:!0}),addEventListener("auxclick",pn,{capture:!0}),addEventListener("contextmenu",un,{capture:!0}),addEventListener("resize",hn),Ae=requestAnimationFrame(mn),O())}function Ve(){removeEventListener("mousemove",sn),removeEventListener("mousedown",cn,{capture:!0}),removeEventListener("mouseup",ln,{capture:!0}),removeEventListener("click",dn,{capture:!0}),removeEventListener("auxclick",pn,{capture:!0}),removeEventListener("contextmenu",un,{capture:!0}),removeEventListener("resize",hn),cancelAnimationFrame(Ae),Ae=0,Z?.destroy(),Ee?.destroy(),Ee=null,ke&&(ke=!1,Je(!1)),Z=null,W?.destroy(),W=null,M?.destroy(),M=null,At(),A=null,E=[],D=null,Y=null,_=null}function tn(e){if(Jn(e))e.preventDefault(),M?Ve():Qn();else if(M&&Ge&&(e.key.toLowerCase()===H.guideKeys.vertical||e.key.toLowerCase()===H.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===H.guideKeys.vertical?"x":"y";rn(t,Ge.x,Ge.y,et(e)),O()}else if(M&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(ue=R.filter(t=>!t.pinned),V(R.filter(t=>t.pinned)),_=null,D=null,Y=null,R.some(t=>t.id===me)||(me=null)):_&&an(_),O();else if(M&&e.key.startsWith("Arrow")){let t=Qt(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",V([...R]),O()}else if(M&&e.key.toLowerCase()==="x")e.preventDefault(),ke=!ke,Je(ke);else if(M&&e.key.toLowerCase()==="p")e.preventDefault(),Ee?.open();else if(M&&e.key.toLowerCase()==="t")e.preventDefault(),W?.toggleType();else if(M&&e.key.toLowerCase()==="c"){e.preventDefault();let t=W?.asText()??"";t&&navigator.clipboard?.writeText(t).catch(()=>{})}else if(M&&e.key.toLowerCase()==="l"){let t=Qt();if(!t)return;e.preventDefault(),t.pinned=!t.pinned,V([...R]),O()}else if(M&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){if(!ue||ue.length===0)return;e.preventDefault(),V([...R,...ue.map(t=>({...t,id:Ze++}))]),ue=null,O()}else if(M&&e.key.toLowerCase()===H.rulerKey)e.preventDefault(),Se=!Se,qt("rulers",Se),O();else if(M&&e.key.toLowerCase()===H.panelKey)e.preventDefault(),W?.toggle();else if(e.key==="Escape"&&M){if(Ee?.close()||Z?.closeHelp())return;E.length?(E=[],W?.hide(),O()):Ve()}}function Lo(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,H=wt(e),addEventListener("keydown",tn,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{Ve(),removeEventListener("keydown",tn,{capture:!0}),delete window.__align})}export{Lo as initAlign};
