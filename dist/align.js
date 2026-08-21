var st={ignore:"",hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function Le(e={}){return{...st,...e}}var Ce=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function Te(e){return e.ignore?`${Ce}, ${e.ignore}`:Ce}function m(e){return String(Math.round(e*100)/100)}function ct(e){let n=e.tagName.toLowerCase();e.id&&(n+=`#${e.id}`);let o=e.classList[0];return o&&(n+=`.${o}`),n.length>32?n.slice(0,31)+"\u2026":n}function ae(e){let n=e.getBoundingClientRect();return{el:e,label:ct(e),left:n.left,right:n.right,top:n.top,bottom:n.bottom,width:n.width,height:n.height}}function Be(e){if(e.parentElement)return e.parentElement;let n=e.getRootNode();return n instanceof ShadowRoot?n.host:null}function _(e,n,o){let t=Te(o),r=document.elementFromPoint(e,n);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,n);if(!i||i===r)break;r=i}for(;r&&r.matches(t);)r=Be(r);return r&&r!==document.documentElement?ae(r):null}var le=e=>parseFloat(e)||0;function Ae(e){let n=getComputedStyle(e),o=(t,r,i,l)=>[le(t),le(r),le(i),le(l)];return{padding:o(n.paddingTop,n.paddingRight,n.paddingBottom,n.paddingLeft),border:o(n.borderTopWidth,n.borderRightWidth,n.borderBottomWidth,n.borderLeftWidth),margin:o(n.marginTop,n.marginRight,n.marginBottom,n.marginLeft)}}function dt(e,n){return e.width*e.height>=n.width*n.height?[e,n]:[n,e]}function ut(e,n){let o=n.left+n.width/2,t=n.top+n.height/2;return[{x1:e.left,y1:t,x2:n.left,y2:t,label:m(n.left-e.left),axis:"x"},{x1:n.right,y1:t,x2:e.right,y2:t,label:m(e.right-n.right),axis:"x"},{x1:o,y1:e.top,x2:o,y2:n.top,label:m(n.top-e.top),axis:"y"},{x1:o,y1:n.bottom,x2:o,y2:e.bottom,label:m(e.bottom-n.bottom),axis:"y"}]}function xe(e,n){let o=[],t=e.left<n.right&&n.left<e.right,r=e.top<n.bottom&&n.top<e.bottom;if(t&&r){let[i,l]=dt(e,n);return ut(i,l)}if(!t){let[i,l]=e.right<=n.left?[e,n]:[n,e],d=r?(Math.max(e.top,n.top)+Math.min(e.bottom,n.bottom))/2:(e.top+e.height/2+n.top+n.height/2)/2;o.push({x1:i.right,y1:d,x2:l.left,y2:d,label:`${m(l.left-i.right)}`,axis:"x"})}if(!r){let[i,l]=e.bottom<=n.top?[e,n]:[n,e],d=t?(Math.max(e.left,n.left)+Math.min(e.right,n.right))/2:(e.left+e.width/2+n.left+n.width/2)/2;o.push({x1:d,y1:i.bottom,x2:d,y2:l.top,label:`${m(l.top-i.bottom)}`,axis:"y"})}return o}function pt(e){if(e.length<2)return[...e];let n=t=>{let r=e.map(t);return Math.max(...r)-Math.min(...r)},o=n(t=>t.left+t.width/2)>=n(t=>t.top+t.height/2);return[...e].sort((t,r)=>o?t.left-r.left:t.top-r.top)}function Re(e){let n=pt(e),o=[];for(let t=1;t<n.length;t++)o.push(...xe(n[t-1],n[t]));return o}var ht=5,mt=4;function oe(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function ye(e,n,o){let t=null,r=ht;for(let i of e){let l=Math.abs(oe(i)-(i.axis==="x"?n:o));l<=r&&(t=i,r=l)}return t}function Ge(e,n,o){if(o)return e;let t=e,r=mt;for(let i of n){let l=Math.abs(i-e);l<r&&(t=i,r=l)}return t}function Pe(e,n){return e?n==="x"?[e.left,e.right]:[e.top,e.bottom]:[]}function ve(e,n){let o=[];for(let t of["x","y"]){let r=n.filter(i=>i.axis===t).map(i=>({pos:i.pos,gap:t==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,l)=>i.gap-l.gap)[0];if(r)if(t==="x"){let i=e.top+e.height/2,l=r.pos<e.left?r.pos:e.right,d=r.pos<e.left?e.left:r.pos;o.push({x1:l,y1:i,x2:d,y2:i,label:m(r.gap),axis:"x"})}else{let i=e.left+e.width/2,l=r.pos<e.top?r.pos:e.bottom,d=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:l,x2:i,y2:d,label:m(r.gap),axis:"y"})}}return o}function Ye(e,n){let o=[];for(let t of["x","y"]){let r=e.filter(i=>i.axis===t).map(i=>i.pos).sort((i,l)=>i-l);for(let i=1;i<r.length;i++){let l=r[i-1],d=r[i],E=d-l;E<.01||(t==="x"?o.push({x1:l,y1:n.y,x2:d,y2:n.y,label:m(E),axis:"x"}):o.push({x1:n.x,y1:l,x2:n.x,y2:d,label:m(E),axis:"y"}))}}return o}var Q=3;function ft(e,n){return e.x<n.x+n.w+Q&&n.x<e.x+e.w+Q&&e.y<n.y+n.h+Q&&n.y<e.y+e.h+Q}function Ie(e){let n=[];for(let o of e){let t={...o};for(let r=0;r<16;r++){let i=n.find(l=>ft(l,t));if(!i)break;t.axis==="x"?t.y=i.y-t.h-Q:t.x=i.x+i.w+Q}n.push(t)}return n}function gt(e){let n=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!n)return{x:1,y:1};let o=n[2].split(",").map(d=>parseFloat(d)),[t,r,i,l]=n[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(t??1,r??0)||1,y:Math.hypot(i??0,l??1)||1}}function Xe(e){let n=1,o=1;for(let t=e;t;t=Be(t)){let r=gt(getComputedStyle(t).transform);n*=r.x,o*=r.y}return{x:n,y:o}}var M=(e,n)=>({light:e,dark:n}),be={accent:M("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:M("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:M("oklch(1 0 0)","oklch(0.264 0 0)"),fg:M("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:M("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:M("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:M("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:M("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)")},Ne=[M("oklch(1 0 0)","oklch(0.264 0 0)"),M("oklch(0.985 0 0)","oklch(0.293 0 0)"),M("oklch(0.967 0 0)","oklch(0.321 0 0)"),M("oklch(0.937 0 0)","oklch(0.348 0 0)"),M("oklch(0.922 0 0)","oklch(0.375 0 0)")],Y={fg:M("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:M("oklch(0.556 0 0)","oklch(0.715 0 0)")};function A(e){return`light-dark(${e.light}, ${e.dark})`}var B=e=>A(Ne[e]??Ne[0]),xt=["0 1px 1px -0.5px","0 3px 3px -1.5px","0 6px 6px -3px","0 12px 12px -6px","0 24px 24px -12px","0 48px 48px -24px","0 96px 96px -48px"];function O(e,n){let o=Math.max(1,Math.min(8,Math.round(e))),t=xt.slice(0,o-1);if(!n){let E="oklch(0 0 0 / 0.06)";return[`0 0 0 1px ${E}`,...t.map(G=>`${G} ${E}`)].join(", ")}let r=[0,0,.01,.02,.02,.04,.04,.06][o-1],i=[.02,.02,.04,.04,.06,.06,.06,.06][o-1],l="oklch(0 0 0 / 0.18)",d=[`inset 0 0 0 1px oklch(1 0 0 / ${i})`];return r&&d.unshift(`inset 0 1px 0 0 oklch(1 0 0 / ${r})`),[...d,...t.map(E=>`${E} ${l}`)].join(", ")}var yt='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',x={title:13,body:12,tag:11,stack:yt},w={regular:400,medium:500,semibold:600},ke="__align_font",vt="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function De(){if(document.getElementById(ke))return;let e=document.createElement("link");e.id=ke,e.rel="stylesheet",e.href=vt,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function ze(){document.getElementById(ke)?.remove()}function He(e){let n=[`${w.medium} ${x.body}px Inter`];Promise.all(n.map(o=>document.fonts.load(o))).then(e,e)}function we(e){let n={};for(let o of Object.keys(be))n[o]=e?be[o].dark:be[o].light;return n}function Ke(){return matchMedia("(prefers-color-scheme: dark)").matches}function se(e,n){return e.replace(/\)$/,` / ${n})`)}var F=16,bt=3,kt=5,wt=4,Ee=(e,n)=>`
${e} { box-shadow: ${O(n,!1)}; }
@media (prefers-color-scheme: dark) {
  ${e} { box-shadow: ${O(n,!0)}; }
}`,Et=`
.dock {
  /* On .dock, not :host \u2014 the host's inline all:initial outranks a :host rule,
     which would pin color-scheme to normal and resolve light-dark() to its
     light branch on a dark page. */
  color-scheme: light dark;
  position: fixed; left: ${F}px; top: 0; width: 340px;
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none; user-select: none;
  font-family: ${x.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${A(Y.fg)};
  --muted: ${A(Y.muted)};
  --border: color-mix(in oklab, var(--fg) 12%, transparent);
}
.panel {
  padding: 10px; border-radius: 0;
  font-size: ${x.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${B(0)};

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
${Ee(".panel",bt)}
${Ee(".dock[data-dragging] .panel",kt)}

header {
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${x.title}px; font-weight: ${w.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${x.body}px; font-weight: ${w.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${x.tag}px; font-weight: ${w.medium};
  margin-left: 4px;
  color: ${A(Y.fg)};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${x.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${B(1)}; }

/* Each region is one step up Fluid's surface ladder. Depth is carried by the
   surface and its shadow \u2014 no borders, the same way the system's own nesting
   example reads. Generous, even insets so each surface has room to breathe. */
.region {
  position: relative; border-radius: 0;
  /* Symmetric. An extra-tall top to clear the label offset each box's centre
     from its parent's, and nesting compounded it until the side numbers were
     visibly staggered. The label shares the top number's line instead. */
  padding: 10px;
}
.region[data-level="1"] { background: ${B(1)}; }
.region[data-level="2"] { background: ${B(2)}; }
.region[data-level="3"] { background: ${B(3)}; }
.content { background: ${B(4)}; }
${Ee(".region, .content",wt)}

/* One muted weight for every label: the words already say which band is which,
   so colour would only compete with the numbers. */
.tag {
  position: absolute; top: 10px; left: 10px;
  font-size: ${x.tag}px; font-weight: ${w.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${w.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${w.regular}; }
.row { display: flex; align-items: center; gap: 5px; margin: 6px 0; }
.row > .edge { flex: 0 0 22px; }
.row > .fill { flex: 1 1 auto; min-width: 0; }

.content {
  border-radius: 0; padding: 14px 8px;
  text-align: center; font-weight: ${w.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,ie=F,j=-1,re=!1;function Oe(e){let n=document.createElement("style");n.textContent=Et,e.appendChild(n);let o=document.createElement("div");o.className="dock";let t=document.createElement("div");t.className="panel",o.appendChild(t),e.appendChild(o);let r=(u,k)=>Math.min(Math.max(u,F),Math.max(F,k-F));function i(){let u=o.offsetHeight||300;j<0&&(j=Math.max(F,innerHeight-u-F)),ie=r(ie,innerWidth-o.offsetWidth),j=r(j,innerHeight-u),o.style.transform=`translate(${ie-F}px, ${j}px)`}let l=null;function d(u){u.button===0&&(u.preventDefault(),u.stopPropagation(),l={x:u.clientX,y:u.clientY,dx:ie,dy:j},o.setAttribute("data-dragging",""),u.currentTarget.setPointerCapture(u.pointerId))}function E(u){l&&(ie=l.dx+(u.clientX-l.x),j=l.dy+(u.clientY-l.y),i())}function G(){l=null,o.removeAttribute("data-dragging")}addEventListener("resize",i);let N=null;function D(u){let k=document.createElement("div");return k.className="edge",k.textContent=u===0?"0":m(u),u===0&&k.setAttribute("data-zero",""),k}function ee(u,k,U,te){let[ne,z,s,a]=U,p=document.createElement("div");p.className="region",p.setAttribute("data-level",String(k));let v=document.createElement("span");v.className="tag",v.textContent=u;let g=document.createElement("div");g.className="row";let c=document.createElement("div");return c.className="fill",c.appendChild(te),g.append(D(a),c,D(z)),p.append(v,D(ne),g,D(s)),p}return{show(u){let k=Ae(u.el),[U,te,ne,z]=k.border,[s,a,p,v]=k.padding,g=Xe(u.el),c=u.width/g.x,y=u.height/g.y,P=Math.abs(g.x-1)>.001||Math.abs(g.y-1)>.001,H=document.createElement("header"),me=document.createElement("span");me.className="name",me.textContent=u.label;let fe=document.createElement("span");fe.className="size",fe.textContent=`${m(c)} \xD7 ${m(y)}`;let q=document.createElement("button");if(q.className="close",q.textContent="\xD7",q.title="close (B brings it back)",q.addEventListener("pointerdown",K=>K.stopPropagation()),q.addEventListener("click",K=>{K.stopPropagation(),re=!0,o.removeAttribute("data-open")}),H.append(me,fe),P){let K=document.createElement("span");K.className="scale",K.textContent=`\xD7${m(g.x)}`,K.title=`renders at ${m(u.width)} \xD7 ${m(u.height)}`,H.appendChild(K)}H.appendChild(q),H.addEventListener("pointerdown",d),H.addEventListener("pointermove",E),H.addEventListener("pointerup",G),H.addEventListener("pointercancel",G);let ge=document.createElement("div");ge.className="content",ge.textContent=`${m(c-z-te-v-a)} \xD7 ${m(y-U-ne-s-p)}`,t.replaceChildren(H,ee("margin",1,k.margin,ee("border",2,k.border,ee("padding",3,k.padding,ge)))),N=u,i(),!re&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},hide(){N=null,o.removeAttribute("data-open")},toggle(){N&&(re=!re,re?o.removeAttribute("data-open"):(i(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",i),o.remove(),n.remove()}}}var Mt=[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure what is under the cursor"],["Click","lock an element"],["Right-click","add to, or drop from, the locked set"],["Drag the panel header","move the box model"],["B","hide or bring back the box model"],["R","rulers down the top and left edges"],["Drag from a rule","pull out a guide; drag it back to remove"],["V","vertical guide at the cursor"],["H","horizontal guide at the cursor"],["Hover a guide","distance from it to every locked element"],["Click a guide","keep those distances up; click again to release"],["Alt while placing","ignore snapping"],["Del","remove the guide under the cursor; Shift+Del for all"],["Esc","clear the locks, then close"]],$t=`
.flag {
  position: fixed; top: 16px; right: 16px;
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${x.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${x.tag}px; font-weight: ${w.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${A(Y.fg)};
  background: ${B(0)};
  box-shadow: ${O(3,!1)};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
.flag:hover { background: ${B(1)}; }
@media (prefers-color-scheme: dark) {
  .flag { box-shadow: ${O(3,!0)}; }
}
.flag .count { color: ${A(Y.muted)}; }
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: 46px; right: 16px; width: 292px;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${x.stack};
  font-synthesis: none;
  font-size: ${x.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${A(Y.fg)};
  background: ${B(0)};
  box-shadow: ${O(4,!1)};
  display: none;
}
@media (prefers-color-scheme: dark) {
  .help { box-shadow: ${O(4,!0)}; }
}
.help[data-open] { display: block; }
.help dl { display: grid; grid-template-columns: auto 1fr; gap: 6px 10px; margin: 0; }
.help dt { justify-self: start; }
.help kbd {
  display: inline-block; padding: 3px 5px;
  font: inherit; font-weight: ${w.medium};
  border: 1px solid color-mix(in oklab, ${A(Y.fg)} 14%, transparent);
  background: ${B(2)};
}
.help dd { margin: 0; align-self: center; color: ${A(Y.muted)}; }
`;function Fe(e){let n=document.createElement("style");n.textContent=$t,e.appendChild(n);let o=document.createElement("div");o.className="flag";let t=document.createElement("span");t.className="name",t.textContent="Align";let r=document.createElement("span");r.className="count",o.append(t,r);let i=document.createElement("div");i.className="help";let l=document.createElement("dl");for(let[d,E]of Mt){let G=document.createElement("dt"),N=document.createElement("kbd");N.textContent=d,G.appendChild(N);let D=document.createElement("dd");D.textContent=E,l.append(G,D)}return i.appendChild(l),o.addEventListener("click",d=>{d.stopPropagation(),i.toggleAttribute("data-open")}),e.append(o,i),{update(d){r.textContent=d>0?`${d} locked`:""},closeHelp(){let d=i.hasAttribute("data-open");return i.removeAttribute("data-open"),d},destroy(){o.remove(),i.remove(),n.remove()}}}var ce=5,Me=4,de=12,h=22,V=10,St=50,Ct=100;function We(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let n=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",n.appendChild(o);let t=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,guides:[],liveGuide:null},i=we(Ke()),l=0,d=matchMedia("(prefers-color-scheme: dark)"),E=()=>{i=we(d.matches),z()};d.addEventListener("change",E),He(()=>z());function G(){let s=devicePixelRatio;o.width=Math.round(innerWidth*s),o.height=Math.round(innerHeight*s),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",t.setTransform(s,0,0,s,0,0),t.translate(.5,.5)}function N(s,a){t.strokeStyle=a,t.lineWidth=1,t.setLineDash([]),t.strokeRect(Math.round(s.left),Math.round(s.top),Math.round(s.width),Math.round(s.height))}function D(s){t.strokeStyle=se(i.measure,.7),t.lineWidth=1,t.setLineDash([2,2]),t.beginPath();for(let a of[s.left,s.right])t.moveTo(Math.round(a),0),t.lineTo(Math.round(a),innerHeight);for(let a of[s.top,s.bottom])t.moveTo(0,Math.round(a)),t.lineTo(innerWidth,Math.round(a));t.stroke(),t.setLineDash([])}function ee(s){if(t.strokeStyle=i.measure,t.lineWidth=1,t.setLineDash([]),t.beginPath(),t.moveTo(Math.round(s.x1),Math.round(s.y1)),t.lineTo(Math.round(s.x2),Math.round(s.y2)),s.axis==="x")for(let a of[s.x1,s.x2])t.moveTo(Math.round(a),Math.round(s.y1)-ce),t.lineTo(Math.round(a),Math.round(s.y1)+ce);else for(let a of[s.y1,s.y2])t.moveTo(Math.round(s.x1)-ce,Math.round(a)),t.lineTo(Math.round(s.x1)+ce,Math.round(a));t.stroke()}function u(s){return t.font=`${w.medium} ${x.body}px ${x.stack}`,{w:t.measureText(s).width+Me*2,h:x.body+Me*2+2}}function k(s,a,p,v){t.font=`${w.medium} ${x.body}px ${x.stack}`,t.textBaseline="middle";let{w:g,h:c}=u(s),y=Math.min(Math.max(a,de),innerWidth-g-de),P=Math.min(Math.max(p,de),innerHeight-c-de);t.fillStyle=v,t.beginPath(),t.roundRect(y,P,g,c,4),t.fill(),t.fillStyle=i.surface,t.fillText(s,y+Me,P+c/2)}function U(s,a,p,v,g=!1){let{w:c,h:y}=u(s);k(s,g?a-c/2:a,g?p-y/2:p,v)}function te(){let s=scrollX,a=scrollY;t.fillStyle=i.rulerBg,t.fillRect(-.5,-.5,innerWidth+1,h),t.fillRect(-.5,-.5,h,innerHeight+1),t.strokeStyle=i.rulerLine,t.lineWidth=1,t.setLineDash([]),t.font=`${w.regular} 9px ${x.stack}`,t.fillStyle=i.muted,t.save(),t.globalAlpha=.16,t.fillStyle=i.accent;for(let c of r.pinned)t.fillRect(c.left,-.5,c.width,h),t.fillRect(-.5,c.top,h,c.height);t.restore(),t.beginPath(),t.moveTo(-.5,h-.5),t.lineTo(innerWidth,h-.5),t.moveTo(h-.5,-.5),t.lineTo(h-.5,innerHeight),t.stroke();let p=c=>c%Ct===0?h:c%St===0?7:4;t.textBaseline="top",t.textAlign="left",t.beginPath();let v=Math.floor(s/V)*V;for(let c=v;c<s+innerWidth;c+=V){let y=Math.round(c-s);if(y<h)continue;let P=p(c);t.moveTo(y,h-P),t.lineTo(y,h),P===h&&(t.fillStyle=i.muted,t.fillText(String(c),y+3,3))}t.stroke(),t.beginPath();let g=Math.floor(a/V)*V;for(let c=g;c<a+innerHeight;c+=V){let y=Math.round(c-a);if(y<h)continue;let P=p(c);t.moveTo(h-P,y),t.lineTo(h,y),P===h&&(t.save(),t.translate(3,y-3),t.rotate(-Math.PI/2),t.fillStyle=i.muted,t.fillText(String(c),0,0),t.restore())}t.stroke(),r.cursor&&(t.strokeStyle=i.accent,t.beginPath(),t.moveTo(Math.round(r.cursor.x),-.5),t.lineTo(Math.round(r.cursor.x),h),t.moveTo(-.5,Math.round(r.cursor.y)),t.lineTo(h,Math.round(r.cursor.y)),t.stroke()),t.fillStyle=i.guide;for(let c of r.guides){let y=Math.round(oe(c));c.axis==="x"?t.fillRect(y-1,-.5,2,h):t.fillRect(-.5,y-1,h,2)}t.fillStyle=i.rulerBg,t.fillRect(-.5,-.5,h,h),t.strokeStyle=i.rulerLine,t.strokeRect(-.5,-.5,h,h)}function ne(){l=0,t.save(),t.setTransform(1,0,0,1,0,0),t.clearRect(0,0,o.width,o.height),t.restore();for(let a of r.pinned)N(a,i.accent);r.hover&&(D(r.hover),N(r.hover,r.pinned.length?se(i.accent,.7):i.accent));for(let a of r.guides){let p=r.liveGuide?.id===a.id;t.strokeStyle=a.locked||p?i.guide:se(i.guide,.55),t.lineWidth=1,t.setLineDash(a.locked?[]:[4,4]),t.beginPath();let v=Math.round(oe(a));a.axis==="x"?(t.moveTo(v,0),t.lineTo(v,innerHeight)):(t.moveTo(0,v),t.lineTo(innerWidth,v)),t.stroke()}for(let a of r.lines)ee(a);let s=r.lines.map(a=>{let p=(a.x1+a.x2)/2,v=(a.y1+a.y2)/2,{w:g,h:c}=u(a.label);return a.axis==="x"?{x:p-g/2,y:v-16-c/2,w:g,h:c,axis:a.axis}:{x:p+26-g/2,y:v-c/2,w:g,h:c,axis:a.axis}});if(Ie(s).forEach((a,p)=>{k(r.lines[p].label,a.x,a.y,i.measure)}),r.hover&&r.cursor){let{width:a,height:p}=r.hover;U(`${m(a)} \xD7 ${m(p)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let a=r.liveGuide,p=Math.round(oe(a));U(`${a.axis} ${m(a.at)}`,a.axis==="x"?p+6:30,a.axis==="x"?30:p+6,i.guide)}r.rulers&&te()}function z(){l||(l=requestAnimationFrame(ne))}return G(),{root:n,update(s){Object.assign(r,s),z()},resize(){G(),z()},destroy(){l&&cancelAnimationFrame(l),d.removeEventListener("change",E),e.remove()}}}var L,C=null,X=null,W=null,b=null,f=[],pe=0,he=!1,S=[],Lt=1,$=null,I=null,R=null,Tt=3,J=22;function Qe(e,n){return he?n<J&&e>=J?"y":e<J&&n>=J?"x":null:null}function Ve(e,n,o,t){let r=_(n,o,L),i=e.axis==="x"?n:o,l=Ge(i,Pe(r,e.axis),t);e.at=l+(e.axis==="x"?scrollX:scrollY)}function Je(e,n,o,t){let r={id:Lt++,axis:e,at:0,locked:!1};return Ve(r,n,o,t),S=[...S,r],r}function Ze(e){S=S.filter(n=>n.id!==e.id),I?.id===e.id&&(I=null),$?.id===e.id&&($=null)}function Bt(e){let n=L.hotkey.toLowerCase().split("+"),o=n[n.length-1];return e.key.toLowerCase()!==o||n.includes("shift")!==e.shiftKey||n.includes("alt")!==e.altKey?!1:(n.includes("mod")||n.includes("ctrl")||n.includes("cmd"))===(e.metaKey||e.ctrlKey)}function $e(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function T(e){let n=f[f.length-1],o=b&&f.some(l=>l.el===b.el),t=S.map($e),r=!$&&I?I:null,i=S.filter(l=>l.locked||l.id===r?.id);C?.update({hover:b,pinned:f,rulers:he,guides:S,liveGuide:$??I,lines:[...Re(f),...n&&b&&!o&&!r?xe(n,b):[],...i.flatMap(l=>f.flatMap(d=>ve(d,[$e(l)]))),...b&&!o&&!r&&S.length?ve(b,t):[],...Ye(i.map($e),{x:innerWidth/2,y:innerHeight/2})],...e?{cursor:e}:{}}),W?.update(f.length)}var ue=null;function et(e){if(ue={x:e.clientX,y:e.clientY},$){R&&Math.hypot(e.clientX-R.x,e.clientY-R.y)>Tt&&(R=null),R||(Ve($,e.clientX,e.clientY,e.altKey),S=[...S]),T({x:e.clientX,y:e.clientY});return}I=ye(S,e.clientX,e.clientY),b=_(e.clientX,e.clientY,L),T({x:e.clientX,y:e.clientY})}function tt(e){$&&(R?($.locked=!$.locked,S=[...S]):(Qe(e.clientX,e.clientY)||e.clientX<J||e.clientY<J)&&Ze($),R=null,$=null,T({x:e.clientX,y:e.clientY}))}function nt(e){if(e.button!==0)return;let n=_(e.clientX,e.clientY,L);if(!n)return;let o=Qe(e.clientX,e.clientY);if(o){Z(e),R=null,$=Je(o,e.clientX,e.clientY,e.altKey),T({x:e.clientX,y:e.clientY});return}let t=ye(S,e.clientX,e.clientY);if(t){Z(e),$=t,R={x:e.clientX,y:e.clientY},T({x:e.clientX,y:e.clientY});return}Z(e),W?.closeHelp(),f=[n],b=n,X?.show(n),T({x:e.clientX,y:e.clientY})}function ot(e){let n=_(e.clientX,e.clientY,L);if(!n)return;Z(e),W?.closeHelp();let o=f.findIndex(r=>r.el===n.el);f=o>=0?f.filter((r,i)=>i!==o):[...f,n],b=n;let t=f[f.length-1];t?X?.show(t):X?.hide(),T({x:e.clientX,y:e.clientY})}function it(e){_(e.clientX,e.clientY,L)&&Z(e)}function rt(e){_(e.clientX,e.clientY,L)&&Z(e)}function Z(e){e.preventDefault(),e.stopPropagation()}function _e(e,n){return e.left===n.left&&e.top===n.top&&e.width===n.width&&e.height===n.height}var je=0,Ue=0;function lt(){pe=requestAnimationFrame(lt);let n=f.filter(l=>l.el.isConnected).map(l=>ae(l.el)),o=b&&b.el.isConnected?ae(b.el):null;if(!(scrollX!==je||scrollY!==Ue||n.length!==f.length||n.some((l,d)=>!_e(l,f[d]))||b===null!=(o===null)||b!==null&&o!==null&&!_e(b,o)))return;je=scrollX,Ue=scrollY,f=n,b=o;let i=f[f.length-1];i?X?.show(i):X?.hide(),T()}function at(){C?.resize()}function At(){C||(De(),C=We(),X=Oe(C.root),W=Fe(C.root),W.update(0),addEventListener("mousemove",et),addEventListener("mousedown",nt,{capture:!0}),addEventListener("mouseup",tt,{capture:!0}),addEventListener("click",it,{capture:!0}),addEventListener("auxclick",rt,{capture:!0}),addEventListener("contextmenu",ot,{capture:!0}),addEventListener("resize",at),pe=requestAnimationFrame(lt),T())}function Se(){removeEventListener("mousemove",et),removeEventListener("mousedown",nt,{capture:!0}),removeEventListener("mouseup",tt,{capture:!0}),removeEventListener("click",it,{capture:!0}),removeEventListener("auxclick",rt,{capture:!0}),removeEventListener("contextmenu",ot,{capture:!0}),removeEventListener("resize",at),cancelAnimationFrame(pe),pe=0,W?.destroy(),W=null,X?.destroy(),X=null,C?.destroy(),C=null,ze(),b=null,f=[],$=null,R=null,I=null}function qe(e){if(Bt(e))e.preventDefault(),C?Se():At();else if(C&&ue&&(e.key.toLowerCase()===L.guideKeys.vertical||e.key.toLowerCase()===L.guideKeys.horizontal)){e.preventDefault();let n=e.key.toLowerCase()===L.guideKeys.vertical?"x":"y";Je(n,ue.x,ue.y,e.altKey),T()}else if(C&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(S=[],I=null,$=null,R=null):I&&Ze(I),T();else if(C&&e.key.toLowerCase()===L.rulerKey)e.preventDefault(),he=!he,T();else if(C&&e.key.toLowerCase()===L.panelKey)e.preventDefault(),X?.toggle();else if(e.key==="Escape"&&C){if(W?.closeHelp())return;f.length?(f=[],X?.hide(),T()):Se()}}function Qt(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,L=Le(e),addEventListener("keydown",qe,{capture:!0});let n=import.meta.hot;n&&n.dispose(()=>{Se(),removeEventListener("keydown",qe,{capture:!0}),delete window.__align})}export{Qt as initAlign};
