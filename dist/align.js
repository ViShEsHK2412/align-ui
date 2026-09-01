function re(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function Zt(e){return(e.split(",")[0]??"").trim().replace(/^['"]|['"]$/g,"")}function en(e){let o={100:"thin",200:"extralight",300:"light",400:"regular",500:"medium",600:"semibold",700:"bold",800:"extrabold",900:"black"}[e.trim()];return o?`${e} ${o}`:e}function we(e){let t=getComputedStyle(e);return[{label:"family",value:Zt(t.fontFamily),px:NaN},{label:"size",value:t.fontSize,px:re(t.fontSize)},{label:"weight",value:en(t.fontWeight),px:NaN},{label:"line",value:t.lineHeight,px:re(t.lineHeight)},{label:"tracking",value:t.letterSpacing,px:re(t.letterSpacing)}]}function Ze(e){let t="";for(let o of e.childNodes)o.nodeType===3&&(t+=o.nodeValue??"");return t.trim().replace(/\s+/g," ")}function et(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:re(r)})}return o}function tn(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function nn(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function tt(e,t){return t.length===0?"":nn(e).map(o=>{let n=tn(o,t);return n.length?`${o} ${n.join(" ")}`:`${o} \u2014`}).join("  \xB7  ")}function Qe(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(re)}function nt(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),s=a.display.includes("flex")||a.display.includes("grid"),d=n==="x"?a.columnGap:a.rowGap,y=s&&d!=="normal"?re(d):null,[h,w,u,S]=Qe(e),[N,p,C,T]=Qe(t),G=f=>Number.isFinite(f)?f:0,P=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,l=n==="x"?P?G(w)+G(T):G(p)+G(S):P?G(u)+G(N):G(C)+G(h);return{px:o,cssGap:y,margins:l,siblings:!0}}function ot(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function rt(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}var on={ignore:"",hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function at(e={}){return{...on,...e}}var it=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function st(e){return e.ignore?`${it}, ${e.ignore}`:it}function v(e){return String(Math.round(e*100)/100)}function rn(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function Se(e){let t=e.getBoundingClientRect();return{el:e,label:rn(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height}}function lt(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function ee(e,t,o){let n=st(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=lt(r);return r&&r!==document.documentElement?Se(r):null}var $e=e=>parseFloat(e)||0;function Re(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[$e(n),$e(r),$e(i),$e(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function an(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function sn(e,t){let o=t.left+t.width/2,n=t.top+t.height/2;return[{x1:e.left,y1:n,x2:t.left,y2:n,label:v(t.left-e.left),axis:"x"},{x1:t.right,y1:n,x2:e.right,y2:n,label:v(e.right-t.right),axis:"x"},{x1:o,y1:e.top,x2:o,y2:t.top,label:v(t.top-e.top),axis:"y"},{x1:o,y1:t.bottom,x2:o,y2:e.bottom,label:v(e.bottom-t.bottom),axis:"y"}]}function Ee(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function Ce(e,t){let o=[],n=e.left<t.right&&t.left<e.right,r=e.top<t.bottom&&t.top<e.bottom;if(n&&r){let[i,a]=an(e,t);return sn(i,a)}if(!n){let[i,a]=e.right<=t.left?[e,t]:[t,e],s=r?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:i.right,y1:s,x2:a.left,y2:s,label:`${v(a.left-i.right)}`,axis:"x"}),o.push(...Ee(i.right,i.top,i.bottom,s,"x")),o.push(...Ee(a.left,a.top,a.bottom,s,"x"))}if(!r){let[i,a]=e.bottom<=t.top?[e,t]:[t,e],s=n?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:s,y1:i.bottom,x2:s,y2:a.top,label:`${v(a.top-i.bottom)}`,axis:"y"}),o.push(...Ee(i.bottom,i.left,i.right,s,"y")),o.push(...Ee(a.top,a.left,a.right,s,"y"))}return o}function ln(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function Pe(e){let t=ln(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var cn=5,un=4;function de(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function Ie(e,t,o){let n=null,r=cn;for(let i of e){let a=Math.abs(de(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function ct(e,t,o){if(o)return{at:e,what:""};let n=null,r=un;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function ut(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function Fe(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,s=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:s,y2:i,label:v(r.gap),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,s=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:s,label:v(r.gap),axis:"y"})}}return o}function dt(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],s=r[i],d=s-a;d<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:s,y2:t.y,label:v(d),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:s,label:v(d),axis:"y"}))}}return o}var U=3;function dn(e,t){return e.x<t.x+t.w+U&&t.x<e.x+e.w+U&&e.y<t.y+t.h+U&&t.y<e.y+e.h+U}function pt(e,t,o=12){let n=(a,s)=>Math.min(Math.max(a,o),t.w-s-o),r=(a,s)=>Math.min(Math.max(a,o),t.h-s-o),i=[];for(let a of e){let s={...a,x:n(a.x,a.w),y:r(a.y,a.h)},d=!1;for(let y=0;y<16;y++){let h=i.find(u=>dn(u,s));if(!h)break;let w=s.axis==="x"?s.y:s.x;if(s.axis==="x"?s.y=r(d?h.y+h.h+U:h.y-s.h-U,s.h):s.x=n(d?h.x-s.w-U:h.x+h.w+U,s.w),(s.axis==="x"?s.y:s.x)===w){if(d)break;d=!0}}i.push(s)}return i}function pn(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(s=>parseFloat(s)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function De(e){let t=1,o=1;for(let n=e;n;n=lt(n)){let r=pn(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var Y=(e,t)=>({light:e,dark:t}),He={accent:Y("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:Y("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:Y("oklch(1 0 0)","oklch(0.264 0 0)"),fg:Y("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:Y("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:Y("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:Y("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:Y("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)")},mt=[Y("oklch(1 0 0)","oklch(0.264 0 0)"),Y("oklch(0.985 0 0)","oklch(0.293 0 0)"),Y("oklch(0.967 0 0)","oklch(0.321 0 0)"),Y("oklch(0.937 0 0)","oklch(0.348 0 0)"),Y("oklch(0.922 0 0)","oklch(0.375 0 0)")],R={fg:Y("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:Y("oklch(0.556 0 0)","oklch(0.715 0 0)")};function B(e){return`light-dark(${e.light}, ${e.dark})`}var z=e=>B(mt[e]??mt[0]),mn=["0 1px 1px -0.5px","0 3px 3px -1.5px","0 6px 6px -3px","0 12px 12px -6px","0 24px 24px -12px","0 48px 48px -24px","0 96px 96px -48px"];function K(e,t){let o=Math.max(1,Math.min(8,Math.round(e))),n=mn.slice(0,o-1);if(!t){let d="oklch(0 0 0 / 0.06)";return[`0 0 0 1px ${d}`,...n.map(y=>`${y} ${d}`)].join(", ")}let r=[0,0,.01,.02,.02,.04,.04,.06][o-1],i=[.02,.02,.04,.04,.06,.06,.06,.06][o-1],a="oklch(0 0 0 / 0.18)",s=[`inset 0 0 0 1px oklch(1 0 0 / ${i})`];return r&&s.unshift(`inset 0 1px 0 0 oklch(1 0 0 / ${r})`),[...s,...n.map(d=>`${d} ${a}`)].join(", ")}var hn='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',k={title:13,body:12,tag:11,stack:hn},D={regular:400,medium:500,semibold:600},Oe="__align_font",fn="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function ht(){if(document.getElementById(Oe))return;let e=document.createElement("link");e.id=Oe,e.rel="stylesheet",e.href=fn,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function ft(){document.getElementById(Oe)?.remove()}function gt(e){let t=[`${D.medium} ${k.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function Ye(e){let t={};for(let o of Object.keys(He))t[o]=e?He[o].dark:He[o].light;return t}function xt(){return matchMedia("(prefers-color-scheme: dark)").matches}function pe(e,t){return e.replace(/\)$/,` / ${t})`)}var gn=`
`,J=16,xn=3,yn=5,bn=4,ze=(e,t)=>`
${e} { box-shadow: ${K(t,!1)}; }
@media (prefers-color-scheme: dark) {
  ${e} { box-shadow: ${K(t,!0)}; }
}`,vn=`
.dock {
  /* On .dock, not :host \u2014 the host's inline all:initial outranks a :host rule,
     which would pin color-scheme to normal and resolve light-dark() to its
     light branch on a dark page. */
  color-scheme: light dark;
  position: fixed; left: ${J}px; top: 0; width: 340px;
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none; user-select: none;
  font-family: ${k.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${B(R.fg)};
  --muted: ${B(R.muted)};
  --border: color-mix(in oklab, var(--fg) 12%, transparent);
}
.panel {
  padding: 10px; border-radius: 0;
  font-size: ${k.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${z(0)};

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
${ze(".panel",xn)}
${ze(".dock[data-dragging] .panel",yn)}

header {
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${k.title}px; font-weight: ${D.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${k.body}px; font-weight: ${D.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${k.tag}px; font-weight: ${D.medium};
  margin-left: 4px;
  color: ${B(R.fg)};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${k.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${z(1)}; }

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
.region[data-level="1"] { background: ${z(1)}; }
.region[data-level="2"] { background: ${z(2)}; }
.region[data-level="3"] { background: ${z(3)}; }
.content { background: ${z(4)}; }
${ze(".region, .content",bn)}

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
  font-size: ${k.tag}px; font-weight: ${D.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${D.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${D.regular}; }
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
  text-align: center; font-weight: ${D.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,me=J,te=-1,he=!1;function yt(e){let t=document.createElement("style");t.textContent=vn,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);let r=!1;function i(p,C){let T=document.createElement("div");T.className="readout";let G=document.createElement("div");G.className="tag readout-tag",G.textContent=p,T.appendChild(G);for(let[P,l]of C){let f=document.createElement("div");f.className="readout-row";let c=document.createElement("span");c.className="readout-key",c.textContent=P;let b=document.createElement("span");b.className="readout-value",b.textContent=l,f.append(c,b),T.appendChild(f)}return T}e.appendChild(o);let a=(p,C)=>Math.min(Math.max(p,J),Math.max(J,C-J));function s(){let p=o.offsetHeight||300;te<0&&(te=Math.max(J,innerHeight-p-J)),me=a(me,innerWidth-o.offsetWidth),te=a(te,innerHeight-p),o.style.transform=`translate(${me-J}px, ${te}px)`}let d=null;function y(p){p.button===0&&(p.preventDefault(),p.stopPropagation(),d={x:p.clientX,y:p.clientY,dx:me,dy:te},o.setAttribute("data-dragging",""),p.currentTarget.setPointerCapture(p.pointerId))}function h(p){d&&(me=d.dx+(p.clientX-d.x),te=d.dy+(p.clientY-d.y),s())}function w(){d=null,o.removeAttribute("data-dragging")}addEventListener("resize",s);let u=null;function S(p){let C=document.createElement("div");return C.className="edge",C.textContent=p===0?"0":v(p),p===0&&C.setAttribute("data-zero",""),C}function N(p,C,T,G){let[P,l,f,c]=T,b=document.createElement("div");b.className="region",b.setAttribute("data-level",String(C));let g=document.createElement("span");g.className="tag",g.textContent=p;let m=document.createElement("div");m.className="row";let x=document.createElement("div");x.className="fill",x.appendChild(G),m.append(S(c),x,S(l));let F=document.createElement("div");return F.className="head",F.append(g,S(P)),b.append(F,m,S(f)),b}return{show(p,C=[]){let T=Re(p.el),[G,P,l,f]=T.border,[c,b,g,m]=T.padding,x=De(p.el),F=p.width/x.x,Ge=p.height/x.y,Vt=Math.abs(x.x-1)>.001||Math.abs(x.y-1)>.001,q=document.createElement("header"),Be=document.createElement("span");Be.className="name",Be.textContent=p.label;let Ae=document.createElement("span");Ae.className="size",Ae.textContent=`${v(F)} \xD7 ${v(Ge)}`;let oe=document.createElement("button");if(oe.className="close",oe.textContent="\xD7",oe.title="close (B brings it back)",oe.addEventListener("pointerdown",O=>O.stopPropagation()),oe.addEventListener("click",O=>{O.stopPropagation(),he=!0,o.removeAttribute("data-open")}),q.append(Be,Ae),Vt){let O=document.createElement("span");O.className="scale",O.textContent=`\xD7${v(x.x)}`,O.title=`renders at ${v(p.width)} \xD7 ${v(p.height)}`,q.appendChild(O)}q.appendChild(oe),q.addEventListener("pointerdown",y),q.addEventListener("pointermove",h),q.addEventListener("pointerup",w),q.addEventListener("pointercancel",w);let Ne=document.createElement("div");Ne.className="content",Ne.textContent=`${v(F-f-P-m-b)} \xD7 ${v(Ge-G-l-c-g)}`;let ke=[q,N("margin",1,T.margin,N("border",2,T.border,N("padding",3,T.padding,Ne)))];if(r){let O=Ze(p.el),ue=we(p.el);ke.push(ue.length&&O?i("type",ue.map(Z=>[Z.label,Z.value])):i("type",[["","nothing of its own to set type on"]]))}if(C.length){let O=C.map(Z=>[v(Z.px),Z.detail]),ue=rt(C.map(Z=>Z.px));ue&&O.push(["",ue]),ke.push(i("gaps",O))}let Qt=et(p.el),Ve=tt([F,Ge,...T.margin,...T.border,...T.padding,...r?we(p.el).map(O=>O.px):[]],Qt);Ve&&ke.push(i("tokens",[["",Ve]])),n.replaceChildren(...ke),u=p,s(),!he&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},toggleType(){r=!r,u&&this.show(u)},asText(){if(!u)return"";let p=Re(u.el),C=De(u.el),T=u.width/C.x,G=u.height/C.y,P=f=>f.map(c=>v(c)).join(" "),l=[`${u.label}  ${v(T)} \xD7 ${v(G)}`,`margin   ${P(p.margin)}`,`border   ${P(p.border)}`,`padding  ${P(p.padding)}`];if(r)for(let f of we(u.el))l.push(`${f.label.padEnd(8)} ${f.value}`);return l.join(gn)},hide(){u=null,o.removeAttribute("data-open")},toggle(){u&&(he=!he,he?o.removeAttribute("data-open"):(s(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",s),o.remove(),t.remove()}}}var kn=[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure what is under the cursor"],["Click","lock an element"],["Right-click","add to, or drop from, the locked set"],["Drag the panel header","move the box model"],["B","hide or bring back the box model"],["R","rulers down the top and left edges"],["Drag from a rule","pull out a guide; drag it back to remove"],["V","vertical guide at the cursor"],["H","horizontal guide at the cursor"],["Hover a guide","distance from it to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the last guide you touched; Shift for 10px"],["L","pin that guide so it cannot be moved or deleted"],["Ctrl/Cmd + Z","bring back the guides you just deleted"],["T","type and token readout for the locked element"],["X","x-ray: outline every element on the page"],["P","pick a colour from anywhere on screen"],["C","copy the numbers in the panel"],["Alt while placing","ignore snapping"],["Del","remove the guide under the cursor; Shift+Del for all"],["Esc","clear the locks, then close"]],fe=16,bt=k.tag+12,vt=8,wn=`
.flag {
  position: fixed; top: ${fe}px; right: ${fe}px;
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${k.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${k.tag}px; font-weight: ${D.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${B(R.fg)};
  background: ${z(0)};
  box-shadow: ${K(3,!1)};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
.flag:hover { background: ${z(1)}; }
@media (prefers-color-scheme: dark) {
  .flag { box-shadow: ${K(3,!0)}; }
}
.flag .count { color: ${B(R.muted)}; }
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: ${fe+bt+vt}px; right: ${fe}px; width: 292px;
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${fe*2+bt+vt}px); overflow-y: auto;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${k.stack};
  font-synthesis: none;
  font-size: ${k.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${B(R.fg)};
  background: ${z(0)};
  box-shadow: ${K(4,!1)};
  display: none;
}
@media (prefers-color-scheme: dark) {
  .help { box-shadow: ${K(4,!0)}; }
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
  font: inherit; font-weight: ${D.medium};
  border: 1px solid color-mix(in oklab, ${B(R.fg)} 14%, transparent);
  background: ${z(2)};
}
.help dd { margin: 0; color: ${B(R.muted)}; }
`;function kt(e){let t=document.createElement("style");t.textContent=wn,e.appendChild(t);let o=document.createElement("div");o.className="flag";let n=document.createElement("span");n.className="name",n.textContent="Align";let r=document.createElement("span");r.className="count",o.append(n,r);let i=document.createElement("div");i.className="help";let a=document.createElement("dl");for(let[s,d]of kn){let y=document.createElement("dt"),h=document.createElement("kbd");h.textContent=s,y.appendChild(h);let w=document.createElement("dd");w.textContent=d,a.append(y,w)}return i.appendChild(a),o.addEventListener("click",s=>{s.stopPropagation(),i.toggleAttribute("data-open")}),e.append(o,i),{update(s){r.textContent=s>0?`${s} locked`:""},closeHelp(){let s=i.hasAttribute("data-open");return i.removeAttribute("data-open"),s},destroy(){o.remove(),i.remove(),t.remove()}}}var Me=5,Xe=4,ge=12,wt=.22,$=22,ie=10,$n=50,En=100;function $t(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,guides:[],liveGuide:null,activeGuide:null},i=Ye(xt()),a=0,s=matchMedia("(prefers-color-scheme: dark)"),d=()=>{i=Ye(s.matches),P()};s.addEventListener("change",d),gt(()=>P());function y(){let l=devicePixelRatio;o.width=Math.round(innerWidth*l),o.height=Math.round(innerHeight*l),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(l,0,0,l,0,0),n.translate(.5,.5)}let h=l=>Math.round(l)-.5;function w(l,f){n.strokeStyle=f,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(l.left),Math.round(l.top),Math.round(l.width),Math.round(l.height))}function u(l){n.strokeStyle=pe(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let f of[l.left,l.right])n.moveTo(Math.round(f),0),n.lineTo(Math.round(f),innerHeight);for(let f of[l.top,l.bottom])n.moveTo(0,Math.round(f)),n.lineTo(innerWidth,Math.round(f));n.stroke(),n.setLineDash([])}function S(l){if(n.strokeStyle=l.extension?pe(i.measure,.45):i.measure,n.lineWidth=1,n.setLineDash([]),n.beginPath(),n.moveTo(Math.round(l.x1),Math.round(l.y1)),n.lineTo(Math.round(l.x2),Math.round(l.y2)),l.extension){n.stroke();return}if(l.axis==="x")for(let f of[l.x1,l.x2])n.moveTo(Math.round(f),Math.round(l.y1)-Me),n.lineTo(Math.round(f),Math.round(l.y1)+Me);else for(let f of[l.y1,l.y2])n.moveTo(Math.round(l.x1)-Me,Math.round(f)),n.lineTo(Math.round(l.x1)+Me,Math.round(f));n.stroke()}function N(l){return n.font=`${D.medium} ${k.body}px ${k.stack}`,{w:n.measureText(l).width+Xe*2,h:k.body+Xe*2+2}}function p(l,f,c,b){n.font=`${D.medium} ${k.body}px ${k.stack}`,n.textBaseline="middle";let{w:g,h:m}=N(l),x=h(Math.min(Math.max(f,ge),innerWidth-g-ge)),F=h(Math.min(Math.max(c,ge),innerHeight-m-ge));n.fillStyle=b,n.beginPath(),n.roundRect(x,F,Math.ceil(g),m,4),n.fill(),n.fillStyle=i.surface,n.fillText(l,x+Xe,F+m/2)}function C(l,f,c,b,g=!1){let{w:m,h:x}=N(l);p(l,g?f-m/2:f,g?c-x/2:c,b)}function T(){let l=scrollX,f=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,$),n.fillRect(-.5,-.5,$,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${D.regular} 9px ${k.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let m of r.pinned)n.fillRect(h(m.left),-.5,Math.round(m.width),$),n.fillRect(-.5,h(m.top),$,Math.round(m.height));n.restore(),n.beginPath(),n.moveTo(-.5,$-.5),n.lineTo(innerWidth,$-.5),n.moveTo($-.5,-.5),n.lineTo($-.5,innerHeight),n.stroke();let c=m=>m%En===0?$:m%$n===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let b=Math.floor(l/ie)*ie;for(let m=b;m<l+innerWidth;m+=ie){let x=Math.round(m-l);if(x<$)continue;let F=c(m);n.moveTo(x,$-F),n.lineTo(x,$),F===$&&(n.fillStyle=i.muted,n.fillText(String(m),x+3,3))}n.stroke(),n.beginPath();let g=Math.floor(f/ie)*ie;for(let m=g;m<f+innerHeight;m+=ie){let x=Math.round(m-f);if(x<$)continue;let F=c(m);n.moveTo($-F,x),n.lineTo($,x),F===$&&(n.save(),n.translate(3,x-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(m),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),$),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo($,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let m of r.guides){let x=Math.round(de(m));m.axis==="x"?n.fillRect(x-1,-.5,2,$):n.fillRect(-.5,x-1,$,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,$,$),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,$,$)}function G(){a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore();for(let c of r.pinned)w(c,i.accent);r.hover&&(u(r.hover),w(r.hover,r.pinned.length?pe(i.accent,.7):i.accent));for(let c of r.guides){let b=r.liveGuide?.id===c.id;n.strokeStyle=c.locked||b?i.guide:pe(i.guide,.55),n.lineWidth=c.pinned?2:1,n.setLineDash(c.locked?[]:[4,4]),n.beginPath();let g=Math.round(de(c));if(c.axis==="x"?(n.moveTo(g,0),n.lineTo(g,innerHeight)):(n.moveTo(0,g),n.lineTo(innerWidth,g)),n.stroke(),r.activeGuide===c.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let m=7;c.axis==="x"?(n.moveTo(g,0),n.lineTo(g,m),n.moveTo(g,innerHeight-m),n.lineTo(g,innerHeight)):(n.moveTo(0,g),n.lineTo(m,g),n.moveTo(innerWidth-m,g),n.lineTo(innerWidth,g)),n.stroke()}}for(let c of r.lines)n.globalAlpha=c.faded?wt:1,S(c);n.globalAlpha=1;let l=r.lines.filter(c=>c.label!==""),f=l.map(c=>{let b=(c.x1+c.x2)/2,g=(c.y1+c.y2)/2,{w:m,h:x}=N(c.label);return c.axis==="x"?{x:b-m/2,y:g-16-x/2,w:m,h:x,axis:c.axis}:{x:b+26-m/2,y:g-x/2,w:m,h:x,axis:c.axis}});if(pt(f,{w:innerWidth,h:innerHeight},ge).forEach((c,b)=>{let g=l[b];n.globalAlpha=g.faded?wt:1,p(g.label,c.x,c.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:c,height:b}=r.hover;C(`${v(c)} \xD7 ${v(b)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let c=r.liveGuide,b=Math.round(de(c));C([`${c.axis} ${v(c.at)}`,c.caught,c.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),c.axis==="x"?b+6:30,c.axis==="x"?30:b+6,i.guide)}r.rulers&&T()}function P(){a||(a=requestAnimationFrame(G))}return y(),{root:t,update(l){Object.assign(r,l),P()},resize(){y(),P()},destroy(){a&&cancelAnimationFrame(a),s.removeEventListener("change",d),e.remove()}}}function Sn(e){let t=e.trim().replace(/^#/,""),o=t.length===3?t.split("").map(n=>n+n).join(""):t;return/^[0-9a-f]{6}$/i.test(o)?{r:parseInt(o.slice(0,2),16),g:parseInt(o.slice(2,4),16),b:parseInt(o.slice(4,6),16)}:null}function Cn({r:e,g:t,b:o}){let n=r=>Math.round(r).toString(16).padStart(2,"0");return`#${n(e)}${n(t)}${n(o)}`}function Mn({r:e,g:t,b:o}){return`rgb(${Math.round(e)} ${Math.round(t)} ${Math.round(o)})`}function ne(e,t){return String(Number(e.toFixed(t)))}function Tn({r:e,g:t,b:o}){let n=e/255,r=t/255,i=o/255,a=Math.max(n,r,i),s=Math.min(n,r,i),d=(a+s)/2,y=a-s,h=0,w=0;return y!==0&&(w=y/(1-Math.abs(2*d-1)),a===n?h=(r-i)/y%6:a===r?h=(i-n)/y+2:h=(n-r)/y+4,h*=60,h<0&&(h+=360)),`hsl(${ne(h,1)} ${ne(w*100,1)}% ${ne(d*100,1)}%)`}function We(e){let t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4}function Ln(e){let t=We(e.r),o=We(e.g),n=We(e.b),r=.4122214708*t+.5363325363*o+.0514459929*n,i=.2119034982*t+.6806995451*o+.1073969566*n,a=.0883024619*t+.2817188376*o+.6299787005*n,s=Math.cbrt(r),d=Math.cbrt(i),y=Math.cbrt(a),h=.2104542553*s+.793617785*d-.0040720468*y,w=1.9779984951*s-2.428592205*d+.4505937099*y,u=.0259040371*s+.7827717662*d-.808675766*y,S=Math.sqrt(w*w+u*u),N=Math.atan2(u,w)*180/Math.PI;return N<0&&(N+=360),S<1e-4?`oklch(${ne(h,4)} 0 0)`:`oklch(${ne(h,4)} ${ne(S,4)} ${ne(N,2)})`}function Et(e){let t=Sn(e);return t?[{label:"hex",value:Cn(t)},{label:"rgb",value:Mn(t)},{label:"hsl",value:Tn(t)},{label:"oklch",value:Ln(t)}]:[]}var Gn=`
.picker {
  position: fixed; top: 46px; right: 16px; width: 200px;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${k.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${k.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${B(R.fg)};
  background: ${z(0)};
  box-shadow: ${K(4,!1)};
  display: none;
}
@media (prefers-color-scheme: dark) {
  .picker { box-shadow: ${K(4,!0)}; }
}
.picker[data-open] { display: block; }
.picker .swatch {
  height: 40px; margin-bottom: 8px;
  border: 1px solid color-mix(in oklab, ${B(R.fg)} 14%, transparent);
}
/* Each row copies itself, so the whole row is the target rather than the text. */
.picker button {
  display: grid; grid-template-columns: 34px 1fr;
  gap: 8px; align-items: baseline;
  width: 100%; padding: 3px 4px; margin: 0;
  border: 0; background: none; cursor: pointer;
  font: inherit; text-align: left;
  color: ${B(R.fg)};
}
.picker button:hover { background: ${z(2)}; }
.picker button:focus-visible { outline: 1px solid ${B(R.fg)}; outline-offset: -1px; }
.picker .k { color: ${B(R.muted)}; }
.picker .v { overflow-wrap: anywhere; }
.picker .hint {
  margin-top: 6px; padding-top: 6px;
  border-top: 1px solid color-mix(in oklab, ${B(R.fg)} 12%, transparent);
  color: ${B(R.muted)};
}
`;function St(e){let t=document.createElement("style");t.textContent=Gn,e.appendChild(t);let o=document.createElement("div");o.className="picker",e.appendChild(o);let n=document.createElement("div");n.className="swatch";let r=document.createElement("div");r.className="hint";function i(a){n.style.background=a;let s=Et(a).map(({label:d,value:y})=>{let h=document.createElement("button");h.type="button";let w=document.createElement("span");w.className="k",w.textContent=d;let u=document.createElement("span");return u.className="v",u.textContent=y,h.append(w,u),h.addEventListener("click",S=>{S.stopPropagation(),navigator.clipboard?.writeText(y).then(()=>{r.textContent=`copied ${d}`},()=>{r.textContent="clipboard refused"})}),h});r.textContent="click a row to copy",o.replaceChildren(n,...s,r),o.setAttribute("data-open","")}return{async open(){let a=window.EyeDropper;if(!a){o.replaceChildren(Object.assign(document.createElement("div"),{className:"hint",textContent:"this browser has no eyedropper"})),o.setAttribute("data-open","");return}try{let{sRGBHex:s}=await new a().open();i(s)}catch{}},close(){let a=o.hasAttribute("data-open");return o.removeAttribute("data-open"),a},destroy(){o.remove(),t.remove()}}}var Ke="__align_xray",Bn=`
[data-align-xray] * { outline: 1px solid rgb(128 128 128 / 0.55) !important; }
[data-align-xray] [data-align-ignore],
[data-align-xray] [data-align-ignore] * { outline: none !important; }
`;function _e(e){let t=document.documentElement;if(!e){t.removeAttribute("data-align-xray"),document.getElementById(Ke)?.remove();return}if(!document.getElementById(Ke)){let o=document.createElement("style");o.id=Ke,o.textContent=Bn,o.setAttribute("data-align-ignore",""),document.head.appendChild(o)}t.setAttribute("data-align-xray","")}var je="align-ui";function Ct(e){try{return localStorage.getItem(e)}catch{return null}}function Mt(e,t){try{localStorage.setItem(e,t)}catch{}}function Tt(e){let t="/";try{t=location.pathname||"/"}catch{}return`${je}:${e}::${t}`}function An(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function Lt(){let e=Ct(Tt("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(An).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function Gt(e){Mt(Tt("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function Bt(e){return Ct(`${je}:${e}`)==="1"}function At(e,t){Mt(`${je}:${e}`,t?"1":"0")}var X,M=null,W=null,Q=null,ve=null,ye=!1,A=null,E=[],Le=0,be=Bt("rulers"),L=[],Ue=1,Nt=!1,ce=null,ae=null;function Rt(){return L.find(e=>e.id===ce)??null}function V(e){L=e,Gt(L)}var I=null,j=null,_=null,Nn=3,se=22;function Ht(e,t){return be?t<se&&e>=se?"y":e<se&&t>=se?"x":null:null}function Ot(e,t,o,n){let r=ee(t,o,X),i=e.axis==="x"?t:o,a=L.filter(d=>d.id!==e.id).map(d=>({axis:d.axis,at:xe(d).pos})),s=ct(i,ut(r,e.axis,a),n);e.at=s.at+(e.axis==="x"?scrollX:scrollY),e.caught=s.what}function Yt(e,t,o,n){let r={id:Ue++,axis:e,at:0,locked:!1,caught:"",pinned:!1};return Ot(r,t,o,n),V([...L,r]),r}function zt(e){e.pinned||(ae=[e],V(L.filter(t=>t.id!==e.id)),j?.id===e.id&&(j=null),I?.id===e.id&&(I=null))}function Rn(e){let t=X.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function xe(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function Je(){if(E.length<2)return[];let e=[];for(let[t,o]of Pe(E))for(let n of Ce(t,o)){if(n.extension||!n.label)continue;let r=nt(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:ot(r)})}return e}function H(e){let t=E[E.length-1],o=A&&E.some(u=>u.el===A.el),n=L.map(xe),r=!I&&j?j:null,i=L.filter(u=>u.locked||u.id===r?.id),a=!r&&o?A.el:null,s=r??a,d=r?xe(r):null,y=[],h=(u,S)=>{for(let N of u)y.push(s&&!S?{...N,faded:!0}:N)},w=u=>!d||u.axis!==d.axis?!1:(u.axis==="x"?[u.x1,u.x2]:[u.y1,u.y2]).some(N=>Math.abs(N-d.pos)<.5);for(let[u,S]of Pe(E))h(Ce(u,S),u.el===a||S.el===a);t&&A&&!o&&!r&&h(Ce(t,A),!0);for(let u of i)for(let S of E)h(Fe(S,[xe(u)]),u.id===r?.id||S.el===a);A&&!o&&!r&&L.length&&h(Fe(A,n),!0);for(let u of dt(i.map(xe),{x:innerWidth/2,y:innerHeight/2}))h([u],w(u));M?.update({hover:A,pinned:E,rulers:be,guides:L,liveGuide:I??j,activeGuide:ce,lines:y,...e?{cursor:e}:{}}),Q?.update(E.length)}var Te=null;function Xt(e){if(Te={x:e.clientX,y:e.clientY},I){_&&Math.hypot(e.clientX-_.x,e.clientY-_.y)>Nn&&(_=null),!_&&!I.pinned&&(Ot(I,e.clientX,e.clientY,e.altKey),V([...L])),H({x:e.clientX,y:e.clientY});return}j=Ie(L,e.clientX,e.clientY),A=ee(e.clientX,e.clientY,X),H({x:e.clientX,y:e.clientY})}function Wt(e){I&&(_?(I.locked=!I.locked,ce=I.id,V([...L])):(Ht(e.clientX,e.clientY)||e.clientX<se||e.clientY<se)&&zt(I),_=null,I=null,H({x:e.clientX,y:e.clientY}))}function Kt(e){if(e.button!==0)return;let t=ee(e.clientX,e.clientY,X);if(!t)return;let o=Ht(e.clientX,e.clientY);if(o){le(e),_=null,I=Yt(o,e.clientX,e.clientY,e.altKey),H({x:e.clientX,y:e.clientY});return}let n=Ie(L,e.clientX,e.clientY);if(n){le(e),ce=n.id,I=n,_={x:e.clientX,y:e.clientY},H({x:e.clientX,y:e.clientY});return}le(e),Q?.closeHelp(),E=[t],A=t,W?.show(t,Je()),H({x:e.clientX,y:e.clientY})}function _t(e){let t=ee(e.clientX,e.clientY,X);if(!t)return;le(e),Q?.closeHelp();let o=E.findIndex(r=>r.el===t.el);E=o>=0?E.filter((r,i)=>i!==o):[...E,t],A=t;let n=E[E.length-1];n?W?.show(n,Je()):W?.hide(),H({x:e.clientX,y:e.clientY})}function jt(e){ee(e.clientX,e.clientY,X)&&le(e)}function qt(e){ee(e.clientX,e.clientY,X)&&le(e)}function le(e){e.preventDefault(),e.stopPropagation()}function Pt(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var It=0,Ft=0;function Ut(){Le=requestAnimationFrame(Ut);let t=E.filter(a=>a.el.isConnected).map(a=>Se(a.el)),o=A&&A.el.isConnected?Se(A.el):null;if(!(scrollX!==It||scrollY!==Ft||t.length!==E.length||t.some((a,s)=>!Pt(a,E[s]))||A===null!=(o===null)||A!==null&&o!==null&&!Pt(A,o)))return;It=scrollX,Ft=scrollY,E=t,A=o;let i=E[E.length-1];i?W?.show(i,Je()):W?.hide(),H()}function Jt(){M?.resize()}function Pn(){Nt||(Nt=!0,L=Lt().map(e=>({...e,id:Ue++}))),!M&&(ht(),M=$t(),W=yt(M.root),Q=kt(M.root),ve=St(M.root),Q.update(0),addEventListener("mousemove",Xt),addEventListener("mousedown",Kt,{capture:!0}),addEventListener("mouseup",Wt,{capture:!0}),addEventListener("click",jt,{capture:!0}),addEventListener("auxclick",qt,{capture:!0}),addEventListener("contextmenu",_t,{capture:!0}),addEventListener("resize",Jt),Le=requestAnimationFrame(Ut),H())}function qe(){removeEventListener("mousemove",Xt),removeEventListener("mousedown",Kt,{capture:!0}),removeEventListener("mouseup",Wt,{capture:!0}),removeEventListener("click",jt,{capture:!0}),removeEventListener("auxclick",qt,{capture:!0}),removeEventListener("contextmenu",_t,{capture:!0}),removeEventListener("resize",Jt),cancelAnimationFrame(Le),Le=0,Q?.destroy(),ve?.destroy(),ve=null,ye&&(ye=!1,_e(!1)),Q=null,W?.destroy(),W=null,M?.destroy(),M=null,ft(),A=null,E=[],I=null,_=null,j=null}function Dt(e){if(Rn(e))e.preventDefault(),M?qe():Pn();else if(M&&Te&&(e.key.toLowerCase()===X.guideKeys.vertical||e.key.toLowerCase()===X.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===X.guideKeys.vertical?"x":"y";Yt(t,Te.x,Te.y,e.altKey),H()}else if(M&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(ae=L.filter(t=>!t.pinned),V(L.filter(t=>t.pinned)),j=null,I=null,_=null,L.some(t=>t.id===ce)||(ce=null)):j&&zt(j),H();else if(M&&e.key.startsWith("Arrow")){let t=Rt(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",V([...L]),H()}else if(M&&e.key.toLowerCase()==="x")e.preventDefault(),ye=!ye,_e(ye);else if(M&&e.key.toLowerCase()==="p")e.preventDefault(),ve?.open();else if(M&&e.key.toLowerCase()==="t")e.preventDefault(),W?.toggleType();else if(M&&e.key.toLowerCase()==="c"){e.preventDefault();let t=W?.asText()??"";t&&navigator.clipboard?.writeText(t).catch(()=>{})}else if(M&&e.key.toLowerCase()==="l"){let t=Rt();if(!t)return;e.preventDefault(),t.pinned=!t.pinned,V([...L]),H()}else if(M&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){if(!ae||ae.length===0)return;e.preventDefault(),V([...L,...ae.map(t=>({...t,id:Ue++}))]),ae=null,H()}else if(M&&e.key.toLowerCase()===X.rulerKey)e.preventDefault(),be=!be,At("rulers",be),H();else if(M&&e.key.toLowerCase()===X.panelKey)e.preventDefault(),W?.toggle();else if(e.key==="Escape"&&M){if(ve?.close()||Q?.closeHelp())return;E.length?(E=[],W?.hide(),H()):qe()}}function mo(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,X=at(e),addEventListener("keydown",Dt,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{qe(),removeEventListener("keydown",Dt,{capture:!0}),delete window.__align})}export{mo as initAlign};
