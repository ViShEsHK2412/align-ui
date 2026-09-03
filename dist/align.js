function Ge(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function Ve(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:Ge(r)})}return o}function on(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function rn(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function Ze(e,t){return t.length===0?"":rn(e).map(o=>{let n=on(o,t);return n.length?`${o} ${n.join(" ")}`:`${o} \u2014`}).join("  \xB7  ")}function Je(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(Ge)}function et(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),s=a.display.includes("flex")||a.display.includes("grid"),h=n==="x"?a.columnGap:a.rowGap,M=s&&h!=="normal"?Ge(h):null,[x,N,m,G]=Je(e),[u,E,S,P]=Je(t),R=p=>Number.isFinite(p)?p:0,O=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,l=n==="x"?O?R(N)+R(P):R(E)+R(G):O?R(m)+R(u):R(S)+R(x);return{px:o,cssGap:M,margins:l,siblings:!0}}function tt(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function nt(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}function Re(e){let t=e.trim().toLowerCase();return t?t.startsWith("#")||/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(t)?!0:["black","white","transparent","currentcolor"].includes(t):!1}var X;function Qe(e){if(X===void 0&&(X=document.createElement("canvas").getContext("2d")),!X)return"";X.fillStyle="#000000",X.fillStyle=e;let t=X.fillStyle;return X.fillStyle="#ffffff",X.fillStyle=e,t===X.fillStyle?String(t):""}function ot(e,t){let o=Qe(e);return o?t.filter(n=>Re(n.value)&&Qe(n.value)===o).map(n=>n.name).sort():[]}function rt(e){let t=getComputedStyle(e),o=[],n=(r,i)=>{let a=i.trim();!a||a==="transparent"||/rgba?\([^)]*,\s*0\s*\)$/.test(a)||o.push({label:r,value:a})};return n("text",t.color),n("background",t.backgroundColor),o}function an(e,t,o){let n=r=>typeof CSS<"u"&&CSS.escape?CSS.escape(r):r.replace(/[^\w-]/g,"\\$&");return t?`#${n(t)}`:o.length?e+o.map(r=>`.${n(r)}`).join(""):e}function Ae(e){let t=typeof e.className=="string"?e.className.trim().split(/\s+/).filter(Boolean):[];return an(e.tagName.toLowerCase(),e.id,t)}function it(e){try{return document.querySelectorAll(Ae(e)).length}catch{return 0}}function sn(e){if(!e)return"inline <style>";let t=e.split("?")[0]??e;try{let o=new URL(t,"http://x").pathname;return decodeURI(o).replace(/^\//,"")||t}catch{return t}}var ln=["width","height","padding","margin","border-width","gap","font-size","line-height","letter-spacing","color","background-color"];function cn(e){for(let t=0;t<e.length;t+=1){let o=e.item(t);if(ln.some(n=>o===n||o.startsWith(`${n}-`)))return!0}return!1}function at(e){let t=[],o=new Set,n=(r,i)=>{for(let a of Array.from(r)){if(a instanceof CSSMediaRule){matchMedia(a.conditionText).matches&&n(a.cssRules,i);continue}if(a instanceof CSSSupportsRule){CSS.supports(a.conditionText)&&n(a.cssRules,i);continue}let s=a.cssRules;if(s&&!(a instanceof CSSStyleRule)){n(s,i);continue}if(!(a instanceof CSSStyleRule))continue;let h=!1;try{h=e.matches(a.selectorText)}catch{continue}if(!h||!cn(a.style))continue;let M=`${a.selectorText}|${i}`;o.has(M)||(o.add(M),t.push({selector:a.selectorText,file:i}))}};for(let r of Array.from(document.styleSheets)){if(r.ownerNode instanceof Element&&r.ownerNode.hasAttribute("data-align-ignore"))continue;let i;try{i=r.cssRules}catch{continue}n(i,sn(r.href))}return t.reverse()}var un={ignore:"",hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function lt(e={}){return{...un,...e}}var st=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function ct(e){return e.ignore?`${st}, ${e.ignore}`:st}function v(e){return String(Math.round(e*100)/100)}function dn(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function we(e){let t=e.getBoundingClientRect();return{el:e,label:dn(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height}}function ut(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function V(e,t,o){let n=ct(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=ut(r);return r&&r!==document.documentElement?we(r):null}var be=e=>parseFloat(e)||0;function dt(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[be(n),be(r),be(i),be(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function pn(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function mn(e,t){let o=t.left+t.width/2,n=t.top+t.height/2;return[{x1:e.left,y1:n,x2:t.left,y2:n,label:v(t.left-e.left),axis:"x"},{x1:t.right,y1:n,x2:e.right,y2:n,label:v(e.right-t.right),axis:"x"},{x1:o,y1:e.top,x2:o,y2:t.top,label:v(t.top-e.top),axis:"y"},{x1:o,y1:t.bottom,x2:o,y2:e.bottom,label:v(e.bottom-t.bottom),axis:"y"}]}function ve(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function ke(e,t){let o=[],n=e.left<t.right&&t.left<e.right,r=e.top<t.bottom&&t.top<e.bottom;if(n&&r){let[i,a]=pn(e,t);return mn(i,a)}if(!n){let[i,a]=e.right<=t.left?[e,t]:[t,e],s=r?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:i.right,y1:s,x2:a.left,y2:s,label:`${v(a.left-i.right)}`,axis:"x"}),o.push(...ve(i.right,i.top,i.bottom,s,"x")),o.push(...ve(a.left,a.top,a.bottom,s,"x"))}if(!r){let[i,a]=e.bottom<=t.top?[e,t]:[t,e],s=n?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:s,y1:i.bottom,x2:s,y2:a.top,label:`${v(a.top-i.bottom)}`,axis:"y"}),o.push(...ve(i.bottom,i.left,i.right,s,"y")),o.push(...ve(a.top,a.left,a.right,s,"y"))}return o}function fn(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function Be(e){let t=fn(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var hn=5,gn=8;function le(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function Ne(e,t,o){let n=null,r=hn;for(let i of e){let a=Math.abs(le(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function pt(e,t,o){if(o)return{at:e,what:""};let n=null,r=gn;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function mt(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function Fe(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,s=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:s,y2:i,label:v(r.gap),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,s=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:s,label:v(r.gap),axis:"y"})}}return o}function ft(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],s=r[i],h=s-a;h<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:s,y2:t.y,label:v(h),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:s,label:v(h),axis:"y"}))}}return o}var J=3;function xn(e,t){return e.x<t.x+t.w+J&&t.x<e.x+e.w+J&&e.y<t.y+t.h+J&&t.y<e.y+e.h+J}function ht(e,t,o=12){let n=(a,s)=>Math.min(Math.max(a,o),t.w-s-o),r=(a,s)=>Math.min(Math.max(a,o),t.h-s-o),i=[];for(let a of e){let s={...a,x:n(a.x,a.w),y:r(a.y,a.h)},h=!1;for(let M=0;M<16;M++){let x=i.find(m=>xn(m,s));if(!x)break;let N=s.axis==="x"?s.y:s.x;if(s.axis==="x"?s.y=r(h?x.y+x.h+J:x.y-s.h-J,s.h):s.x=n(h?x.x-s.w-J:x.x+x.w+J,s.w),(s.axis==="x"?s.y:s.x)===N){if(h)break;h=!0}}i.push(s)}return i}function yn(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(s=>parseFloat(s)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function gt(e){let t=1,o=1;for(let n=e;n;n=ut(n)){let r=yn(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var W=(e,t)=>({light:e,dark:t}),Oe={accent:W("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:W("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:W("oklch(1 0 0)","oklch(0.264 0 0)"),fg:W("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:W("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:W("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:W("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:W("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)")};function yt(e){return`light-dark(${e.light}, ${e.dark})`}var Z=yt(W("#fafafa","#1a1a1a"));function ce(e){return yt(W(`rgb(0 0 0 / ${e})`,`rgb(255 255 255 / ${e})`))}var xt=[0,.07,.08,.1,.12,.15,.2];function K(e){let t=xt[Math.max(0,Math.min(xt.length-1,e))];return t===0?Z:ce(t)}var _={primary:ce(.9),secondary:ce(.6),tertiary:ce(.4)},Se=ce(.12),ue="0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)",bt="0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)";var bn='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',k={title:13,body:12,tag:11,stack:bn},A={regular:400,medium:500,semibold:600},Ie="__align_font",vn="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function vt(){if(document.getElementById(Ie))return;let e=document.createElement("link");e.id=Ie,e.rel="stylesheet",e.href=vn,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function wt(){document.getElementById(Ie)?.remove()}function kt(e){let t=[`${A.medium} ${k.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function De(e){let t={};for(let o of Object.keys(Oe))t[o]=e?Oe[o].dark:Oe[o].light;return t}function St(){return matchMedia("(prefers-color-scheme: dark)").matches}function de(e,t){return e.replace(/\)$/,` / ${t})`)}var j=16,wn=`
.dock {
  /* On .dock, not :host \u2014 the host's inline all:initial outranks a :host rule,
     which would pin color-scheme to normal and resolve light-dark() to its
     light branch on a dark page. */
  color-scheme: light dark;
  position: fixed; left: ${j}px; top: 0; width: 340px;
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none; user-select: none;
  font-family: ${k.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${_.primary};
  --muted: ${_.secondary};
  --border: ${Se};
}
.panel {
  padding: 10px; border-radius: 0;
  /* Five sections now \u2014 box, tokens, styled by, matches, colour \u2014 and on a
     laptop that is taller than the window. place() clamps the position but
     cannot rescue a panel taller than the screen, so it scrolls instead. */
  max-height: calc(100vh - ${j*2}px);
  overflow-y: auto; overscroll-behavior: contain;
  font-size: ${k.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${Z};

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
  background: ${Z};
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] .panel { box-shadow: ${bt}; }
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${k.title}px; font-weight: ${A.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${k.body}px; font-weight: ${A.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${k.tag}px; font-weight: ${A.medium};
  margin-left: 4px;
  color: ${_.primary};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${k.body}px; line-height: 1;
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
  font-size: ${k.tag}px; font-weight: ${A.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${A.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${A.regular}; }
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
  font-size: ${k.tag}px; line-height: 1.5;
}
.readout-key { color: var(--muted); }
.readout-value { color: var(--fg); overflow-wrap: anywhere; }
.content {
  border-radius: 0; padding: 14px 8px;
  text-align: center; font-weight: ${A.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,pe=j,ee=-1,me=!1;function Et(e){let t=document.createElement("style");t.textContent=wn,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);function r(u,E){let S=document.createElement("div");S.className="readout";let P=document.createElement("div");P.className="tag readout-tag",P.textContent=u,S.appendChild(P);for(let[R,O]of E){let l=document.createElement("div");l.className="readout-row";let p=document.createElement("span");p.className="readout-key",p.textContent=R;let c=document.createElement("span");c.className="readout-value",c.textContent=O,l.append(p,c),S.appendChild(l)}return S}e.appendChild(o);let i=(u,E)=>Math.min(Math.max(u,j),Math.max(j,E-j));function a(){let u=o.offsetHeight||300;ee<0&&(ee=Math.max(j,innerHeight-u-j)),pe=i(pe,innerWidth-o.offsetWidth),ee=i(ee,innerHeight-u),o.style.transform=`translate(${pe-j}px, ${ee}px)`}let s=null;function h(u){u.button===0&&(u.preventDefault(),u.stopPropagation(),s={x:u.clientX,y:u.clientY,dx:pe,dy:ee},o.setAttribute("data-dragging",""),u.currentTarget.setPointerCapture(u.pointerId))}function M(u){s&&(pe=s.dx+(u.clientX-s.x),ee=s.dy+(u.clientY-s.y),a())}function x(){s=null,o.removeAttribute("data-dragging")}addEventListener("resize",a);let N=null;function m(u){let E=document.createElement("div");return E.className="edge",E.textContent=u===0?"0":v(u),u===0&&E.setAttribute("data-zero",""),E}function G(u,E,S,P){let[R,O,l,p]=S,c=document.createElement("div");c.className="region",c.setAttribute("data-level",String(E));let w=document.createElement("span");w.className="tag",w.textContent=u;let f=document.createElement("div");f.className="row";let d=document.createElement("div");d.className="fill",d.appendChild(P),f.append(m(p),d,m(O));let g=document.createElement("div");return g.className="head",g.append(w,m(R)),c.append(g,f,m(l)),c}return{show(u,E=[]){let S=dt(u.el),[P,R,O,l]=S.border,[p,c,w,f]=S.padding,d=gt(u.el),g=u.width/d.x,D=u.height/d.y,nn=Math.abs(d.x-1)>.001||Math.abs(d.y-1)>.001,U=document.createElement("header"),Te=document.createElement("span");Te.className="name",Te.textContent=u.label;let Me=document.createElement("span");Me.className="size",Me.textContent=`${v(g)} \xD7 ${v(D)}`;let ne=document.createElement("button");if(ne.className="close",ne.textContent="\xD7",ne.title="close (B brings it back)",ne.addEventListener("pointerdown",$=>$.stopPropagation()),ne.addEventListener("click",$=>{$.stopPropagation(),me=!0,o.removeAttribute("data-open")}),U.append(Te,Me),nn){let $=document.createElement("span");$.className="scale",$.textContent=`\xD7${v(d.x)}`,$.title=`renders at ${v(u.width)} \xD7 ${v(u.height)}`,U.appendChild($)}U.appendChild(ne),U.addEventListener("pointerdown",h),U.addEventListener("pointermove",M),U.addEventListener("pointerup",x),U.addEventListener("pointercancel",x);let Le=document.createElement("div");Le.className="content",Le.textContent=`${v(g-l-R-f-c)} \xD7 ${v(D-P-O-p-w)}`;let oe=[U,G("margin",1,S.margin,G("border",2,S.border,G("padding",3,S.padding,Le)))];if(E.length){let $=E.map(q=>[v(q.px),q.detail]),ye=nt(E.map(q=>q.px));ye&&$.push(["",ye]),oe.push(r("gaps",$))}let Xe=Ve(u.el),Ke=Ze([g,D,...S.margin,...S.border,...S.padding],Xe);Ke&&oe.push(r("tokens",[["",Ke]]));let _e=at(u.el);_e.length&&oe.push(r("styled by",_e.slice(0,4).map($=>[$.selector,$.file])));let je=it(u.el);je>1&&oe.push(r("matches",[["",`${je} elements share ${Ae(u.el)}`]]));let Ue=Xe.filter($=>Re($.value));if(Ue.length){let $=rt(u.el).map(({label:ye,value:q})=>{let qe=ot(q,Ue);return[ye,qe.length?`${q}  ${qe.join(" ")}`:`${q}  \u2014`]});$.length&&oe.push(r("colour",$))}n.replaceChildren(...oe),N=u,a(),!me&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},hide(){N=null,o.removeAttribute("data-open")},toggle(){N&&(me=!me,me?o.removeAttribute("data-open"):(a(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",a),o.remove(),t.remove()}}}var kn=[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure what is under the cursor"],["Click","lock an element"],["Right-click","add to, or drop from, the locked set"],["Drag the panel header","move the box model"],["B","hide or bring back the box model"],["R","rulers down the top and left edges"],["Drag from a rule","pull out a guide; drag it back to remove"],["V","vertical guide at the cursor"],["H","horizontal guide at the cursor"],["Hover a guide","distance from it to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the last guide you touched; Shift for 10px"],["L","pin that guide so it cannot be moved or deleted"],["Ctrl/Cmd while placing","ignore snapping"],["Del","remove the guide under the cursor; Shift+Del for all"],["Esc","clear the locks, then close"]],fe=16,$t=k.tag+12,Ct=8,Sn=`
.flag {
  position: fixed; top: ${fe}px; right: ${fe}px;
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${k.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${k.tag}px; font-weight: ${A.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${_.primary};
  background: ${Z};
  box-shadow: ${ue};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
.flag:hover { background: ${K(1)}; }
.flag .count { color: ${_.secondary}; }
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: ${fe+$t+Ct}px; right: ${fe}px; width: 292px;
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${fe*2+$t+Ct}px); overflow-y: auto;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${k.stack};
  font-synthesis: none;
  font-size: ${k.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${_.primary};
  background: ${Z};
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
  font: inherit; font-weight: ${A.medium};
  border: 1px solid ${Se};
  background: ${K(2)};
}
.help dd { margin: 0; color: ${_.secondary}; }
`;function Tt(e){let t=document.createElement("style");t.textContent=Sn,e.appendChild(t);let o=document.createElement("div");o.className="flag";let n=document.createElement("span");n.className="name",n.textContent="Align";let r=document.createElement("span");r.className="count",o.append(n,r);let i=document.createElement("div");i.className="help";let a=document.createElement("dl");for(let[s,h]of kn){let M=document.createElement("dt"),x=document.createElement("kbd");x.textContent=s,M.appendChild(x);let N=document.createElement("dd");N.textContent=h,a.append(M,N)}return i.appendChild(a),o.addEventListener("click",s=>{s.stopPropagation(),i.toggleAttribute("data-open")}),e.append(o,i),{update(s){r.textContent=s>0?`${s} locked`:""},closeHelp(){let s=i.hasAttribute("data-open");return i.removeAttribute("data-open"),s},destroy(){o.remove(),i.remove(),t.remove()}}}var Ee=5,Pe=4,he=12,Mt=.22,y=22,re=10,En=50,$n=100;function Lt(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,guides:[],liveGuide:null,activeGuide:null},i=De(St()),a=0,s=matchMedia("(prefers-color-scheme: dark)"),h=()=>{i=De(s.matches),O()};s.addEventListener("change",h),kt(()=>O());function M(){let l=devicePixelRatio;o.width=Math.round(innerWidth*l),o.height=Math.round(innerHeight*l),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(l,0,0,l,0,0),n.translate(.5,.5)}let x=l=>Math.round(l)-.5;function N(l,p){n.strokeStyle=p,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(l.left),Math.round(l.top),Math.round(l.width),Math.round(l.height))}function m(l){n.strokeStyle=de(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let p of[l.left,l.right])n.moveTo(Math.round(p),0),n.lineTo(Math.round(p),innerHeight);for(let p of[l.top,l.bottom])n.moveTo(0,Math.round(p)),n.lineTo(innerWidth,Math.round(p));n.stroke(),n.setLineDash([])}function G(l){if(n.strokeStyle=l.extension?de(i.measure,.55):i.measure,n.lineWidth=1,n.setLineDash(l.extension?[3,3]:[]),n.beginPath(),n.moveTo(Math.round(l.x1),Math.round(l.y1)),n.lineTo(Math.round(l.x2),Math.round(l.y2)),l.extension){n.stroke();return}if(l.axis==="x")for(let p of[l.x1,l.x2])n.moveTo(Math.round(p),Math.round(l.y1)-Ee),n.lineTo(Math.round(p),Math.round(l.y1)+Ee);else for(let p of[l.y1,l.y2])n.moveTo(Math.round(l.x1)-Ee,Math.round(p)),n.lineTo(Math.round(l.x1)+Ee,Math.round(p));n.stroke()}function u(l){return n.font=`${A.medium} ${k.body}px ${k.stack}`,{w:n.measureText(l).width+Pe*2,h:k.body+Pe*2+2}}function E(l,p,c,w){n.font=`${A.medium} ${k.body}px ${k.stack}`,n.textBaseline="middle";let{w:f,h:d}=u(l),g=x(Math.min(Math.max(p,he),innerWidth-f-he)),D=x(Math.min(Math.max(c,he),innerHeight-d-he));n.fillStyle=w,n.beginPath(),n.roundRect(g,D,Math.ceil(f),d,4),n.fill(),n.fillStyle=i.surface,n.fillText(l,g+Pe,D+d/2)}function S(l,p,c,w,f=!1){let{w:d,h:g}=u(l);E(l,f?p-d/2:p,f?c-g/2:c,w)}function P(){let l=scrollX,p=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,y),n.fillRect(-.5,-.5,y,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${A.regular} 9px ${k.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let d of r.pinned)n.fillRect(x(d.left),-.5,Math.round(d.width),y),n.fillRect(-.5,x(d.top),y,Math.round(d.height));n.restore(),n.beginPath(),n.moveTo(-.5,y-.5),n.lineTo(innerWidth,y-.5),n.moveTo(y-.5,-.5),n.lineTo(y-.5,innerHeight),n.stroke();let c=d=>d%$n===0?y:d%En===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let w=Math.floor(l/re)*re;for(let d=w;d<l+innerWidth;d+=re){let g=Math.round(d-l);if(g<y)continue;let D=c(d);n.moveTo(g,y-D),n.lineTo(g,y),D===y&&(n.fillStyle=i.muted,n.fillText(String(d),g+3,3))}n.stroke(),n.beginPath();let f=Math.floor(p/re)*re;for(let d=f;d<p+innerHeight;d+=re){let g=Math.round(d-p);if(g<y)continue;let D=c(d);n.moveTo(y-D,g),n.lineTo(y,g),D===y&&(n.save(),n.translate(3,g-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(d),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),y),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo(y,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let d of r.guides){let g=Math.round(le(d));d.axis==="x"?n.fillRect(g-1,-.5,2,y):n.fillRect(-.5,g-1,y,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,y,y),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,y,y)}function R(){a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore();for(let c of r.pinned)N(c,i.accent);r.hover&&(m(r.hover),N(r.hover,r.pinned.length?de(i.accent,.7):i.accent));for(let c of r.guides){let w=r.liveGuide?.id===c.id;n.strokeStyle=c.locked||w?i.guide:de(i.guide,.55),n.lineWidth=c.pinned?2:1,n.setLineDash(c.locked?[]:[4,4]),n.beginPath();let f=Math.round(le(c));if(c.axis==="x"?(n.moveTo(f,0),n.lineTo(f,innerHeight)):(n.moveTo(0,f),n.lineTo(innerWidth,f)),n.stroke(),r.activeGuide===c.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let d=7;c.axis==="x"?(n.moveTo(f,0),n.lineTo(f,d),n.moveTo(f,innerHeight-d),n.lineTo(f,innerHeight)):(n.moveTo(0,f),n.lineTo(d,f),n.moveTo(innerWidth-d,f),n.lineTo(innerWidth,f)),n.stroke()}}for(let c of r.lines)n.globalAlpha=c.faded?Mt:1,G(c);n.globalAlpha=1;let l=r.lines.filter(c=>c.label!==""),p=l.map(c=>{let w=(c.x1+c.x2)/2,f=(c.y1+c.y2)/2,{w:d,h:g}=u(c.label);return c.axis==="x"?{x:w-d/2,y:f-16-g/2,w:d,h:g,axis:c.axis}:{x:w+26-d/2,y:f-g/2,w:d,h:g,axis:c.axis}});if(ht(p,{w:innerWidth,h:innerHeight},he).forEach((c,w)=>{let f=l[w];n.globalAlpha=f.faded?Mt:1,E(f.label,c.x,c.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:c,height:w}=r.hover;S(`${v(c)} \xD7 ${v(w)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let c=r.liveGuide,w=Math.round(le(c));S([`${c.axis} ${v(c.at)}`,c.caught,c.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),c.axis==="x"?w+6:30,c.axis==="x"?30:w+6,i.guide)}r.rulers&&P()}function O(){a||(a=requestAnimationFrame(R))}return M(),{root:t,update(l){Object.assign(r,l),O()},resize(){M(),O()},destroy(){a&&cancelAnimationFrame(a),s.removeEventListener("change",h),e.remove()}}}var He="align-ui";function Gt(e){try{return localStorage.getItem(e)}catch{return null}}function Rt(e,t){try{localStorage.setItem(e,t)}catch{}}function At(e){let t="/";try{t=location.pathname||"/"}catch{}return`${He}:${e}::${t}`}function Cn(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function Bt(){let e=Gt(At("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(Cn).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function Nt(e){Rt(At("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function Ft(e){return Gt(`${He}:${e}`)==="1"}function Ot(e,t){Rt(`${He}:${e}`,t?"1":"0")}var I,B=null,Y=null,Q=null,C=null,b=[],Ce=0,xe=Ft("rulers"),T=[],Yt=1,It=!1,se=null;function Dt(){return T.find(e=>e.id===se)??null}function te(e){T=e,Nt(T)}var L=null,z=null,H=null,Tn=3,ie=22;function Xt(e,t){return xe?t<ie&&e>=ie?"y":e<ie&&t>=ie?"x":null:null}function ze(e){return e.ctrlKey||e.metaKey}function Kt(e,t,o,n){let r=V(t,o,I),i=e.axis==="x"?t:o,a=T.filter(h=>h.id!==e.id).map(h=>({axis:h.axis,at:ge(h).pos})),s=pt(i,mt(r,e.axis,a),n);e.at=s.at+(e.axis==="x"?scrollX:scrollY),e.caught=s.what}function _t(e,t,o,n){let r={id:Yt++,axis:e,at:0,locked:!1,caught:"",pinned:!1};return Kt(r,t,o,n),te([...T,r]),r}function jt(e){e.pinned||(te(T.filter(t=>t.id!==e.id)),z?.id===e.id&&(z=null),L?.id===e.id&&(L=null))}function Mn(e){let t=I.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function ge(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function Ye(){if(b.length<2)return[];let e=[];for(let[t,o]of Be(b))for(let n of ke(t,o)){if(n.extension||!n.label)continue;let r=et(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:tt(r)})}return e}function F(e){let t=b[b.length-1],o=C&&b.some(m=>m.el===C.el),n=T.map(ge),r=!L&&z?z:null,i=T.filter(m=>m.locked||m.id===r?.id),a=!r&&o?C.el:null,s=r??a,h=r?ge(r):null,M=[],x=(m,G)=>{for(let u of m)M.push(s&&!G?{...u,faded:!0}:u)},N=m=>!h||m.axis!==h.axis?!1:(m.axis==="x"?[m.x1,m.x2]:[m.y1,m.y2]).some(u=>Math.abs(u-h.pos)<.5);for(let[m,G]of Be(b))x(ke(m,G),m.el===a||G.el===a);t&&C&&!o&&!r&&x(ke(t,C),!0);for(let m of i)for(let G of b)x(Fe(G,[ge(m)]),m.id===r?.id||G.el===a);C&&!o&&!r&&T.length&&x(Fe(C,n),!0);for(let m of ft(i.map(ge),{x:innerWidth/2,y:innerHeight/2}))x([m],N(m));B?.update({hover:C,pinned:b,rulers:xe,guides:T,liveGuide:L??z,activeGuide:se,lines:M,...e?{cursor:e}:{}}),Q?.update(b.length)}var $e=null;function Ut(e){if($e={x:e.clientX,y:e.clientY},L){H&&Math.hypot(e.clientX-H.x,e.clientY-H.y)>Tn&&(H=null),!H&&!L.pinned&&(Kt(L,e.clientX,e.clientY,ze(e)),te([...T])),F({x:e.clientX,y:e.clientY});return}z=Ne(T,e.clientX,e.clientY),C=V(e.clientX,e.clientY,I),F({x:e.clientX,y:e.clientY})}function qt(e){L&&(H?(L.locked=!L.locked,se=L.id,te([...T])):(Xt(e.clientX,e.clientY)||e.clientX<ie||e.clientY<ie)&&jt(L),H=null,L=null,F({x:e.clientX,y:e.clientY}))}function Jt(e){if(e.button!==0)return;let t=V(e.clientX,e.clientY,I);if(!t)return;let o=Xt(e.clientX,e.clientY);if(o){ae(e),H=null,L=_t(o,e.clientX,e.clientY,ze(e)),F({x:e.clientX,y:e.clientY});return}let n=Ne(T,e.clientX,e.clientY);if(n){ae(e),se=n.id,L=n,H={x:e.clientX,y:e.clientY},F({x:e.clientX,y:e.clientY});return}ae(e),Q?.closeHelp(),b=[t],C=t,Y?.show(t,Ye()),F({x:e.clientX,y:e.clientY})}function Qt(e){let t=V(e.clientX,e.clientY,I);if(!t)return;ae(e),Q?.closeHelp();let o=b.findIndex(r=>r.el===t.el);b=o>=0?b.filter((r,i)=>i!==o):[...b,t],C=t;let n=b[b.length-1];n?Y?.show(n,Ye()):Y?.hide(),F({x:e.clientX,y:e.clientY})}function Vt(e){V(e.clientX,e.clientY,I)&&ae(e)}function Zt(e){V(e.clientX,e.clientY,I)&&ae(e)}function ae(e){e.preventDefault(),e.stopPropagation()}function Pt(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var Ht=0,Wt=0;function en(){Ce=requestAnimationFrame(en);let t=b.filter(a=>a.el.isConnected).map(a=>we(a.el)),o=C&&C.el.isConnected?we(C.el):null;if(!(scrollX!==Ht||scrollY!==Wt||t.length!==b.length||t.some((a,s)=>!Pt(a,b[s]))||C===null!=(o===null)||C!==null&&o!==null&&!Pt(C,o)))return;Ht=scrollX,Wt=scrollY,b=t,C=o;let i=b[b.length-1];i?Y?.show(i,Ye()):Y?.hide(),F()}function tn(){B?.resize()}function Ln(){It||(It=!0,T=Bt().map(e=>({...e,id:Yt++}))),!B&&(vt(),B=Lt(),Y=Et(B.root),Q=Tt(B.root),Q.update(0),addEventListener("mousemove",Ut),addEventListener("mousedown",Jt,{capture:!0}),addEventListener("mouseup",qt,{capture:!0}),addEventListener("click",Vt,{capture:!0}),addEventListener("auxclick",Zt,{capture:!0}),addEventListener("contextmenu",Qt,{capture:!0}),addEventListener("resize",tn),Ce=requestAnimationFrame(en),F())}function We(){removeEventListener("mousemove",Ut),removeEventListener("mousedown",Jt,{capture:!0}),removeEventListener("mouseup",qt,{capture:!0}),removeEventListener("click",Vt,{capture:!0}),removeEventListener("auxclick",Zt,{capture:!0}),removeEventListener("contextmenu",Qt,{capture:!0}),removeEventListener("resize",tn),cancelAnimationFrame(Ce),Ce=0,Q?.destroy(),Q=null,Y?.destroy(),Y=null,B?.destroy(),B=null,wt(),C=null,b=[],L=null,H=null,z=null}function zt(e){if(Mn(e))e.preventDefault(),B?We():Ln();else if(B&&$e&&(e.key.toLowerCase()===I.guideKeys.vertical||e.key.toLowerCase()===I.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===I.guideKeys.vertical?"x":"y";_t(t,$e.x,$e.y,ze(e)),F()}else if(B&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(te(T.filter(t=>t.pinned)),z=null,L=null,H=null,T.some(t=>t.id===se)||(se=null)):z&&jt(z),F();else if(B&&e.key.startsWith("Arrow")){let t=Dt(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",te([...T]),F()}else if(B&&e.key.toLowerCase()==="l"){let t=Dt();if(!t)return;e.preventDefault(),t.pinned=!t.pinned,te([...T]),F()}else if(B&&e.key.toLowerCase()===I.rulerKey)e.preventDefault(),xe=!xe,Ot("rulers",xe),F();else if(B&&e.key.toLowerCase()===I.panelKey)e.preventDefault(),Y?.toggle();else if(e.key==="Escape"&&B){if(Q?.closeHelp())return;b.length?(b=[],Y?.hide(),F()):We()}}function Zn(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,I=lt(e),addEventListener("keydown",zt,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{We(),removeEventListener("keydown",zt,{capture:!0}),delete window.__align})}export{Zn as initAlign};
