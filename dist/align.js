function Me(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function Oe(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:Me(r)})}return o}function Ot(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function zt(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function ze(e,t){return t.length===0?"":zt(e).map(o=>{let n=Ot(o,t);return n.length?`${o} ${n.join(" ")}`:`${o} \u2014`}).join("  \xB7  ")}function De(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(Me)}function Xe(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),s=a.display.includes("flex")||a.display.includes("grid"),h=n==="x"?a.columnGap:a.rowGap,C=s&&h!=="normal"?Me(h):null,[x,N,m,L]=De(e),[d,$,E,D]=De(t),G=p=>Number.isFinite(p)?p:0,P=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,l=n==="x"?P?G(N)+G(D):G($)+G(L):P?G(m)+G(d):G(E)+G(x);return{px:o,cssGap:C,margins:l,siblings:!0}}function We(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function Ke(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}var Xt={ignore:"",hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function je(e={}){return{...Xt,...e}}var _e=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function Ue(e){return e.ignore?`${_e}, ${e.ignore}`:_e}function v(e){return String(Math.round(e*100)/100)}function Wt(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function xe(e){let t=e.getBoundingClientRect();return{el:e,label:Wt(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height}}function qe(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function Q(e,t,o){let n=Ue(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=qe(r);return r&&r!==document.documentElement?xe(r):null}var fe=e=>parseFloat(e)||0;function Je(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[fe(n),fe(r),fe(i),fe(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function Kt(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function _t(e,t){let o=t.left+t.width/2,n=t.top+t.height/2;return[{x1:e.left,y1:n,x2:t.left,y2:n,label:v(t.left-e.left),axis:"x"},{x1:t.right,y1:n,x2:e.right,y2:n,label:v(e.right-t.right),axis:"x"},{x1:o,y1:e.top,x2:o,y2:t.top,label:v(t.top-e.top),axis:"y"},{x1:o,y1:t.bottom,x2:o,y2:e.bottom,label:v(e.bottom-t.bottom),axis:"y"}]}function ge(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function ye(e,t){let o=[],n=e.left<t.right&&t.left<e.right,r=e.top<t.bottom&&t.top<e.bottom;if(n&&r){let[i,a]=Kt(e,t);return _t(i,a)}if(!n){let[i,a]=e.right<=t.left?[e,t]:[t,e],s=r?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:i.right,y1:s,x2:a.left,y2:s,label:`${v(a.left-i.right)}`,axis:"x"}),o.push(...ge(i.right,i.top,i.bottom,s,"x")),o.push(...ge(a.left,a.top,a.bottom,s,"x"))}if(!r){let[i,a]=e.bottom<=t.top?[e,t]:[t,e],s=n?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:s,y1:i.bottom,x2:s,y2:a.top,label:`${v(a.top-i.bottom)}`,axis:"y"}),o.push(...ge(i.bottom,i.left,i.right,s,"y")),o.push(...ge(a.top,a.left,a.right,s,"y"))}return o}function jt(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function Ce(e){let t=jt(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var Ut=5,qt=4;function ae(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function Te(e,t,o){let n=null,r=Ut;for(let i of e){let a=Math.abs(ae(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function Ve(e,t,o){if(o)return{at:e,what:""};let n=null,r=qt;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function Qe(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function Le(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,s=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:s,y2:i,label:v(r.gap),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,s=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:s,label:v(r.gap),axis:"y"})}}return o}function Ze(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],s=r[i],h=s-a;h<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:s,y2:t.y,label:v(h),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:s,label:v(h),axis:"y"}))}}return o}var U=3;function Jt(e,t){return e.x<t.x+t.w+U&&t.x<e.x+e.w+U&&e.y<t.y+t.h+U&&t.y<e.y+e.h+U}function et(e,t,o=12){let n=(a,s)=>Math.min(Math.max(a,o),t.w-s-o),r=(a,s)=>Math.min(Math.max(a,o),t.h-s-o),i=[];for(let a of e){let s={...a,x:n(a.x,a.w),y:r(a.y,a.h)},h=!1;for(let C=0;C<16;C++){let x=i.find(m=>Jt(m,s));if(!x)break;let N=s.axis==="x"?s.y:s.x;if(s.axis==="x"?s.y=r(h?x.y+x.h+U:x.y-s.h-U,s.h):s.x=n(h?x.x-s.w-U:x.x+x.w+U,s.w),(s.axis==="x"?s.y:s.x)===N){if(h)break;h=!0}}i.push(s)}return i}function Vt(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(s=>parseFloat(s)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function tt(e){let t=1,o=1;for(let n=e;n;n=qe(n)){let r=Vt(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var R=(e,t)=>({light:e,dark:t}),Ge={accent:R("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:R("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:R("oklch(1 0 0)","oklch(0.264 0 0)"),fg:R("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:R("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:R("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:R("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:R("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)")},nt=[R("oklch(1 0 0)","oklch(0.264 0 0)"),R("oklch(0.985 0 0)","oklch(0.293 0 0)"),R("oklch(0.967 0 0)","oklch(0.321 0 0)"),R("oklch(0.937 0 0)","oklch(0.348 0 0)"),R("oklch(0.922 0 0)","oklch(0.375 0 0)")],W={fg:R("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:R("oklch(0.556 0 0)","oklch(0.715 0 0)")};function z(e){return`light-dark(${e.light}, ${e.dark})`}var H=e=>z(nt[e]??nt[0]),Qt=["0 1px 1px -0.5px","0 3px 3px -1.5px","0 6px 6px -3px","0 12px 12px -6px","0 24px 24px -12px","0 48px 48px -24px","0 96px 96px -48px"];function q(e,t){let o=Math.max(1,Math.min(8,Math.round(e))),n=Qt.slice(0,o-1);if(!t){let h="oklch(0 0 0 / 0.06)";return[`0 0 0 1px ${h}`,...n.map(C=>`${C} ${h}`)].join(", ")}let r=[0,0,.01,.02,.02,.04,.04,.06][o-1],i=[.02,.02,.04,.04,.06,.06,.06,.06][o-1],a="oklch(0 0 0 / 0.18)",s=[`inset 0 0 0 1px oklch(1 0 0 / ${i})`];return r&&s.unshift(`inset 0 1px 0 0 oklch(1 0 0 / ${r})`),[...s,...n.map(h=>`${h} ${a}`)].join(", ")}var Zt='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',w={title:13,body:12,tag:11,stack:Zt},B={regular:400,medium:500,semibold:600},Be="__align_font",en="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function ot(){if(document.getElementById(Be))return;let e=document.createElement("link");e.id=Be,e.rel="stylesheet",e.href=en,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function rt(){document.getElementById(Be)?.remove()}function it(e){let t=[`${B.medium} ${w.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function Ae(e){let t={};for(let o of Object.keys(Ge))t[o]=e?Ge[o].dark:Ge[o].light;return t}function at(){return matchMedia("(prefers-color-scheme: dark)").matches}function se(e,t){return e.replace(/\)$/,` / ${t})`)}var J=16,tn=3,nn=5,on=4,Ne=(e,t)=>`
${e} { box-shadow: ${q(t,!1)}; }
@media (prefers-color-scheme: dark) {
  ${e} { box-shadow: ${q(t,!0)}; }
}`,rn=`
.dock {
  /* On .dock, not :host \u2014 the host's inline all:initial outranks a :host rule,
     which would pin color-scheme to normal and resolve light-dark() to its
     light branch on a dark page. */
  color-scheme: light dark;
  position: fixed; left: ${J}px; top: 0; width: 340px;
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none; user-select: none;
  font-family: ${w.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${z(W.fg)};
  --muted: ${z(W.muted)};
  --border: color-mix(in oklab, var(--fg) 12%, transparent);
}
.panel {
  padding: 10px; border-radius: 0;
  font-size: ${w.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${H(0)};

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
${Ne(".panel",tn)}
${Ne(".dock[data-dragging] .panel",nn)}

header {
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${w.title}px; font-weight: ${B.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${w.body}px; font-weight: ${B.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${w.tag}px; font-weight: ${B.medium};
  margin-left: 4px;
  color: ${z(W.fg)};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${w.body}px; line-height: 1;
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
${Ne(".region, .content",on)}

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
  font-size: ${w.tag}px; font-weight: ${B.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${B.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${B.regular}; }
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
  text-align: center; font-weight: ${B.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,le=J,Z=-1,ce=!1;function st(e){let t=document.createElement("style");t.textContent=rn,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);function r(d,$){let E=document.createElement("div");E.className="readout";let D=document.createElement("div");D.className="tag readout-tag",D.textContent=d,E.appendChild(D);for(let[G,P]of $){let l=document.createElement("div");l.className="readout-row";let p=document.createElement("span");p.className="readout-key",p.textContent=G;let c=document.createElement("span");c.className="readout-value",c.textContent=P,l.append(p,c),E.appendChild(l)}return E}e.appendChild(o);let i=(d,$)=>Math.min(Math.max(d,J),Math.max(J,$-J));function a(){let d=o.offsetHeight||300;Z<0&&(Z=Math.max(J,innerHeight-d-J)),le=i(le,innerWidth-o.offsetWidth),Z=i(Z,innerHeight-d),o.style.transform=`translate(${le-J}px, ${Z}px)`}let s=null;function h(d){d.button===0&&(d.preventDefault(),d.stopPropagation(),s={x:d.clientX,y:d.clientY,dx:le,dy:Z},o.setAttribute("data-dragging",""),d.currentTarget.setPointerCapture(d.pointerId))}function C(d){s&&(le=s.dx+(d.clientX-s.x),Z=s.dy+(d.clientY-s.y),a())}function x(){s=null,o.removeAttribute("data-dragging")}addEventListener("resize",a);let N=null;function m(d){let $=document.createElement("div");return $.className="edge",$.textContent=d===0?"0":v(d),d===0&&$.setAttribute("data-zero",""),$}function L(d,$,E,D){let[G,P,l,p]=E,c=document.createElement("div");c.className="region",c.setAttribute("data-level",String($));let k=document.createElement("span");k.className="tag",k.textContent=d;let f=document.createElement("div");f.className="row";let u=document.createElement("div");u.className="fill",u.appendChild(D),f.append(m(p),u,m(P));let g=document.createElement("div");return g.className="head",g.append(k,m(G)),c.append(g,f,m(l)),c}return{show(d,$=[]){let E=Je(d.el),[D,G,P,l]=E.border,[p,c,k,f]=E.padding,u=tt(d.el),g=d.width/u.x,Y=d.height/u.y,Ht=Math.abs(u.x-1)>.001||Math.abs(u.y-1)>.001,j=document.createElement("header"),we=document.createElement("span");we.className="name",we.textContent=d.label;let Ee=document.createElement("span");Ee.className="size",Ee.textContent=`${v(g)} \xD7 ${v(Y)}`;let te=document.createElement("button");if(te.className="close",te.textContent="\xD7",te.title="close (B brings it back)",te.addEventListener("pointerdown",O=>O.stopPropagation()),te.addEventListener("click",O=>{O.stopPropagation(),ce=!0,o.removeAttribute("data-open")}),j.append(we,Ee),Ht){let O=document.createElement("span");O.className="scale",O.textContent=`\xD7${v(u.x)}`,O.title=`renders at ${v(d.width)} \xD7 ${v(d.height)}`,j.appendChild(O)}j.appendChild(te),j.addEventListener("pointerdown",h),j.addEventListener("pointermove",C),j.addEventListener("pointerup",x),j.addEventListener("pointercancel",x);let $e=document.createElement("div");$e.className="content",$e.textContent=`${v(g-l-G-f-c)} \xD7 ${v(Y-D-P-p-k)}`;let Se=[j,L("margin",1,E.margin,L("border",2,E.border,L("padding",3,E.padding,$e)))];if($.length){let O=$.map(he=>[v(he.px),he.detail]),He=Ke($.map(he=>he.px));He&&O.push(["",He]),Se.push(r("gaps",O))}let Dt=Oe(d.el),Ye=ze([g,Y,...E.margin,...E.border,...E.padding],Dt);Ye&&Se.push(r("tokens",[["",Ye]])),n.replaceChildren(...Se),N=d,a(),!ce&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},hide(){N=null,o.removeAttribute("data-open")},toggle(){N&&(ce=!ce,ce?o.removeAttribute("data-open"):(a(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",a),o.remove(),t.remove()}}}var an=[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure what is under the cursor"],["Click","lock an element"],["Right-click","add to, or drop from, the locked set"],["Drag the panel header","move the box model"],["B","hide or bring back the box model"],["R","rulers down the top and left edges"],["Drag from a rule","pull out a guide; drag it back to remove"],["V","vertical guide at the cursor"],["H","horizontal guide at the cursor"],["Hover a guide","distance from it to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the last guide you touched; Shift for 10px"],["L","pin that guide so it cannot be moved or deleted"],["Alt while placing","ignore snapping"],["Del","remove the guide under the cursor; Shift+Del for all"],["Esc","clear the locks, then close"]],ue=16,lt=w.tag+12,ct=8,sn=`
.flag {
  position: fixed; top: ${ue}px; right: ${ue}px;
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${w.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${w.tag}px; font-weight: ${B.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${z(W.fg)};
  background: ${H(0)};
  box-shadow: ${q(3,!1)};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
.flag:hover { background: ${H(1)}; }
@media (prefers-color-scheme: dark) {
  .flag { box-shadow: ${q(3,!0)}; }
}
.flag .count { color: ${z(W.muted)}; }
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: ${ue+lt+ct}px; right: ${ue}px; width: 292px;
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${ue*2+lt+ct}px); overflow-y: auto;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${w.stack};
  font-synthesis: none;
  font-size: ${w.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${z(W.fg)};
  background: ${H(0)};
  box-shadow: ${q(4,!1)};
  display: none;
}
@media (prefers-color-scheme: dark) {
  .help { box-shadow: ${q(4,!0)}; }
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
  font: inherit; font-weight: ${B.medium};
  border: 1px solid color-mix(in oklab, ${z(W.fg)} 14%, transparent);
  background: ${H(2)};
}
.help dd { margin: 0; color: ${z(W.muted)}; }
`;function ut(e){let t=document.createElement("style");t.textContent=sn,e.appendChild(t);let o=document.createElement("div");o.className="flag";let n=document.createElement("span");n.className="name",n.textContent="Align";let r=document.createElement("span");r.className="count",o.append(n,r);let i=document.createElement("div");i.className="help";let a=document.createElement("dl");for(let[s,h]of an){let C=document.createElement("dt"),x=document.createElement("kbd");x.textContent=s,C.appendChild(x);let N=document.createElement("dd");N.textContent=h,a.append(C,N)}return i.appendChild(a),o.addEventListener("click",s=>{s.stopPropagation(),i.toggleAttribute("data-open")}),e.append(o,i),{update(s){r.textContent=s>0?`${s} locked`:""},closeHelp(){let s=i.hasAttribute("data-open");return i.removeAttribute("data-open"),s},destroy(){o.remove(),i.remove(),t.remove()}}}var be=5,Re=4,de=12,dt=.22,y=22,ne=10,ln=50,cn=100;function pt(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,guides:[],liveGuide:null,activeGuide:null},i=Ae(at()),a=0,s=matchMedia("(prefers-color-scheme: dark)"),h=()=>{i=Ae(s.matches),P()};s.addEventListener("change",h),it(()=>P());function C(){let l=devicePixelRatio;o.width=Math.round(innerWidth*l),o.height=Math.round(innerHeight*l),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(l,0,0,l,0,0),n.translate(.5,.5)}let x=l=>Math.round(l)-.5;function N(l,p){n.strokeStyle=p,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(l.left),Math.round(l.top),Math.round(l.width),Math.round(l.height))}function m(l){n.strokeStyle=se(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let p of[l.left,l.right])n.moveTo(Math.round(p),0),n.lineTo(Math.round(p),innerHeight);for(let p of[l.top,l.bottom])n.moveTo(0,Math.round(p)),n.lineTo(innerWidth,Math.round(p));n.stroke(),n.setLineDash([])}function L(l){if(n.strokeStyle=l.extension?se(i.measure,.45):i.measure,n.lineWidth=1,n.setLineDash([]),n.beginPath(),n.moveTo(Math.round(l.x1),Math.round(l.y1)),n.lineTo(Math.round(l.x2),Math.round(l.y2)),l.extension){n.stroke();return}if(l.axis==="x")for(let p of[l.x1,l.x2])n.moveTo(Math.round(p),Math.round(l.y1)-be),n.lineTo(Math.round(p),Math.round(l.y1)+be);else for(let p of[l.y1,l.y2])n.moveTo(Math.round(l.x1)-be,Math.round(p)),n.lineTo(Math.round(l.x1)+be,Math.round(p));n.stroke()}function d(l){return n.font=`${B.medium} ${w.body}px ${w.stack}`,{w:n.measureText(l).width+Re*2,h:w.body+Re*2+2}}function $(l,p,c,k){n.font=`${B.medium} ${w.body}px ${w.stack}`,n.textBaseline="middle";let{w:f,h:u}=d(l),g=x(Math.min(Math.max(p,de),innerWidth-f-de)),Y=x(Math.min(Math.max(c,de),innerHeight-u-de));n.fillStyle=k,n.beginPath(),n.roundRect(g,Y,Math.ceil(f),u,4),n.fill(),n.fillStyle=i.surface,n.fillText(l,g+Re,Y+u/2)}function E(l,p,c,k,f=!1){let{w:u,h:g}=d(l);$(l,f?p-u/2:p,f?c-g/2:c,k)}function D(){let l=scrollX,p=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,y),n.fillRect(-.5,-.5,y,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${B.regular} 9px ${w.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let u of r.pinned)n.fillRect(x(u.left),-.5,Math.round(u.width),y),n.fillRect(-.5,x(u.top),y,Math.round(u.height));n.restore(),n.beginPath(),n.moveTo(-.5,y-.5),n.lineTo(innerWidth,y-.5),n.moveTo(y-.5,-.5),n.lineTo(y-.5,innerHeight),n.stroke();let c=u=>u%cn===0?y:u%ln===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let k=Math.floor(l/ne)*ne;for(let u=k;u<l+innerWidth;u+=ne){let g=Math.round(u-l);if(g<y)continue;let Y=c(u);n.moveTo(g,y-Y),n.lineTo(g,y),Y===y&&(n.fillStyle=i.muted,n.fillText(String(u),g+3,3))}n.stroke(),n.beginPath();let f=Math.floor(p/ne)*ne;for(let u=f;u<p+innerHeight;u+=ne){let g=Math.round(u-p);if(g<y)continue;let Y=c(u);n.moveTo(y-Y,g),n.lineTo(y,g),Y===y&&(n.save(),n.translate(3,g-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(u),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),y),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo(y,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let u of r.guides){let g=Math.round(ae(u));u.axis==="x"?n.fillRect(g-1,-.5,2,y):n.fillRect(-.5,g-1,y,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,y,y),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,y,y)}function G(){a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore();for(let c of r.pinned)N(c,i.accent);r.hover&&(m(r.hover),N(r.hover,r.pinned.length?se(i.accent,.7):i.accent));for(let c of r.guides){let k=r.liveGuide?.id===c.id;n.strokeStyle=c.locked||k?i.guide:se(i.guide,.55),n.lineWidth=c.pinned?2:1,n.setLineDash(c.locked?[]:[4,4]),n.beginPath();let f=Math.round(ae(c));if(c.axis==="x"?(n.moveTo(f,0),n.lineTo(f,innerHeight)):(n.moveTo(0,f),n.lineTo(innerWidth,f)),n.stroke(),r.activeGuide===c.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let u=7;c.axis==="x"?(n.moveTo(f,0),n.lineTo(f,u),n.moveTo(f,innerHeight-u),n.lineTo(f,innerHeight)):(n.moveTo(0,f),n.lineTo(u,f),n.moveTo(innerWidth-u,f),n.lineTo(innerWidth,f)),n.stroke()}}for(let c of r.lines)n.globalAlpha=c.faded?dt:1,L(c);n.globalAlpha=1;let l=r.lines.filter(c=>c.label!==""),p=l.map(c=>{let k=(c.x1+c.x2)/2,f=(c.y1+c.y2)/2,{w:u,h:g}=d(c.label);return c.axis==="x"?{x:k-u/2,y:f-16-g/2,w:u,h:g,axis:c.axis}:{x:k+26-u/2,y:f-g/2,w:u,h:g,axis:c.axis}});if(et(p,{w:innerWidth,h:innerHeight},de).forEach((c,k)=>{let f=l[k];n.globalAlpha=f.faded?dt:1,$(f.label,c.x,c.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:c,height:k}=r.hover;E(`${v(c)} \xD7 ${v(k)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let c=r.liveGuide,k=Math.round(ae(c));E([`${c.axis} ${v(c.at)}`,c.caught,c.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),c.axis==="x"?k+6:30,c.axis==="x"?30:k+6,i.guide)}r.rulers&&D()}function P(){a||(a=requestAnimationFrame(G))}return C(),{root:t,update(l){Object.assign(r,l),P()},resize(){C(),P()},destroy(){a&&cancelAnimationFrame(a),s.removeEventListener("change",h),e.remove()}}}var Fe="align-ui";function mt(e){try{return localStorage.getItem(e)}catch{return null}}function ht(e,t){try{localStorage.setItem(e,t)}catch{}}function ft(e){let t="/";try{t=location.pathname||"/"}catch{}return`${Fe}:${e}::${t}`}function un(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function gt(){let e=mt(ft("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(un).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function xt(e){ht(ft("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function yt(e){return mt(`${Fe}:${e}`)==="1"}function bt(e,t){ht(`${Fe}:${e}`,t?"1":"0")}var I,A=null,_=null,V=null,S=null,b=[],ke=0,me=yt("rulers"),M=[],Mt=1,vt=!1,ie=null;function kt(){return M.find(e=>e.id===ie)??null}function ee(e){M=e,xt(M)}var T=null,K=null,X=null,dn=3,oe=22;function Ct(e,t){return me?t<oe&&e>=oe?"y":e<oe&&t>=oe?"x":null:null}function Tt(e,t,o,n){let r=Q(t,o,I),i=e.axis==="x"?t:o,a=M.filter(h=>h.id!==e.id).map(h=>({axis:h.axis,at:pe(h).pos})),s=Ve(i,Qe(r,e.axis,a),n);e.at=s.at+(e.axis==="x"?scrollX:scrollY),e.caught=s.what}function Lt(e,t,o,n){let r={id:Mt++,axis:e,at:0,locked:!1,caught:"",pinned:!1};return Tt(r,t,o,n),ee([...M,r]),r}function Gt(e){e.pinned||(ee(M.filter(t=>t.id!==e.id)),K?.id===e.id&&(K=null),T?.id===e.id&&(T=null))}function pn(e){let t=I.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function pe(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function Ie(){if(b.length<2)return[];let e=[];for(let[t,o]of Ce(b))for(let n of ye(t,o)){if(n.extension||!n.label)continue;let r=Xe(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:We(r)})}return e}function F(e){let t=b[b.length-1],o=S&&b.some(m=>m.el===S.el),n=M.map(pe),r=!T&&K?K:null,i=M.filter(m=>m.locked||m.id===r?.id),a=!r&&o?S.el:null,s=r??a,h=r?pe(r):null,C=[],x=(m,L)=>{for(let d of m)C.push(s&&!L?{...d,faded:!0}:d)},N=m=>!h||m.axis!==h.axis?!1:(m.axis==="x"?[m.x1,m.x2]:[m.y1,m.y2]).some(d=>Math.abs(d-h.pos)<.5);for(let[m,L]of Ce(b))x(ye(m,L),m.el===a||L.el===a);t&&S&&!o&&!r&&x(ye(t,S),!0);for(let m of i)for(let L of b)x(Le(L,[pe(m)]),m.id===r?.id||L.el===a);S&&!o&&!r&&M.length&&x(Le(S,n),!0);for(let m of Ze(i.map(pe),{x:innerWidth/2,y:innerHeight/2}))x([m],N(m));A?.update({hover:S,pinned:b,rulers:me,guides:M,liveGuide:T??K,activeGuide:ie,lines:C,...e?{cursor:e}:{}}),V?.update(b.length)}var ve=null;function Bt(e){if(ve={x:e.clientX,y:e.clientY},T){X&&Math.hypot(e.clientX-X.x,e.clientY-X.y)>dn&&(X=null),!X&&!T.pinned&&(Tt(T,e.clientX,e.clientY,e.altKey),ee([...M])),F({x:e.clientX,y:e.clientY});return}K=Te(M,e.clientX,e.clientY),S=Q(e.clientX,e.clientY,I),F({x:e.clientX,y:e.clientY})}function At(e){T&&(X?(T.locked=!T.locked,ie=T.id,ee([...M])):(Ct(e.clientX,e.clientY)||e.clientX<oe||e.clientY<oe)&&Gt(T),X=null,T=null,F({x:e.clientX,y:e.clientY}))}function Nt(e){if(e.button!==0)return;let t=Q(e.clientX,e.clientY,I);if(!t)return;let o=Ct(e.clientX,e.clientY);if(o){re(e),X=null,T=Lt(o,e.clientX,e.clientY,e.altKey),F({x:e.clientX,y:e.clientY});return}let n=Te(M,e.clientX,e.clientY);if(n){re(e),ie=n.id,T=n,X={x:e.clientX,y:e.clientY},F({x:e.clientX,y:e.clientY});return}re(e),V?.closeHelp(),b=[t],S=t,_?.show(t,Ie()),F({x:e.clientX,y:e.clientY})}function Rt(e){let t=Q(e.clientX,e.clientY,I);if(!t)return;re(e),V?.closeHelp();let o=b.findIndex(r=>r.el===t.el);b=o>=0?b.filter((r,i)=>i!==o):[...b,t],S=t;let n=b[b.length-1];n?_?.show(n,Ie()):_?.hide(),F({x:e.clientX,y:e.clientY})}function Ft(e){Q(e.clientX,e.clientY,I)&&re(e)}function Pt(e){Q(e.clientX,e.clientY,I)&&re(e)}function re(e){e.preventDefault(),e.stopPropagation()}function wt(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var Et=0,$t=0;function It(){ke=requestAnimationFrame(It);let t=b.filter(a=>a.el.isConnected).map(a=>xe(a.el)),o=S&&S.el.isConnected?xe(S.el):null;if(!(scrollX!==Et||scrollY!==$t||t.length!==b.length||t.some((a,s)=>!wt(a,b[s]))||S===null!=(o===null)||S!==null&&o!==null&&!wt(S,o)))return;Et=scrollX,$t=scrollY,b=t,S=o;let i=b[b.length-1];i?_?.show(i,Ie()):_?.hide(),F()}function Yt(){A?.resize()}function mn(){vt||(vt=!0,M=gt().map(e=>({...e,id:Mt++}))),!A&&(ot(),A=pt(),_=st(A.root),V=ut(A.root),V.update(0),addEventListener("mousemove",Bt),addEventListener("mousedown",Nt,{capture:!0}),addEventListener("mouseup",At,{capture:!0}),addEventListener("click",Ft,{capture:!0}),addEventListener("auxclick",Pt,{capture:!0}),addEventListener("contextmenu",Rt,{capture:!0}),addEventListener("resize",Yt),ke=requestAnimationFrame(It),F())}function Pe(){removeEventListener("mousemove",Bt),removeEventListener("mousedown",Nt,{capture:!0}),removeEventListener("mouseup",At,{capture:!0}),removeEventListener("click",Ft,{capture:!0}),removeEventListener("auxclick",Pt,{capture:!0}),removeEventListener("contextmenu",Rt,{capture:!0}),removeEventListener("resize",Yt),cancelAnimationFrame(ke),ke=0,V?.destroy(),V=null,_?.destroy(),_=null,A?.destroy(),A=null,rt(),S=null,b=[],T=null,X=null,K=null}function St(e){if(pn(e))e.preventDefault(),A?Pe():mn();else if(A&&ve&&(e.key.toLowerCase()===I.guideKeys.vertical||e.key.toLowerCase()===I.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===I.guideKeys.vertical?"x":"y";Lt(t,ve.x,ve.y,e.altKey),F()}else if(A&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(ee(M.filter(t=>t.pinned)),K=null,T=null,X=null,M.some(t=>t.id===ie)||(ie=null)):K&&Gt(K),F();else if(A&&e.key.startsWith("Arrow")){let t=kt(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",ee([...M]),F()}else if(A&&e.key.toLowerCase()==="l"){let t=kt();if(!t)return;e.preventDefault(),t.pinned=!t.pinned,ee([...M]),F()}else if(A&&e.key.toLowerCase()===I.rulerKey)e.preventDefault(),me=!me,bt("rulers",me),F();else if(A&&e.key.toLowerCase()===I.panelKey)e.preventDefault(),_?.toggle();else if(e.key==="Escape"&&A){if(V?.closeHelp())return;b.length?(b=[],_?.hide(),F()):Pe()}}function In(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,I=je(e),addEventListener("keydown",St,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{Pe(),removeEventListener("keydown",St,{capture:!0}),delete window.__align})}export{In as initAlign};
