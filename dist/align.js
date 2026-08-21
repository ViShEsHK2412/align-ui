var ct={ignore:"",hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function Le(e={}){return{...ct,...e}}var Ce=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function Te(e){return e.ignore?`${Ce}, ${e.ignore}`:Ce}function f(e){return String(Math.round(e*100)/100)}function dt(e){let n=e.tagName.toLowerCase();e.id&&(n+=`#${e.id}`);let o=e.classList[0];return o&&(n+=`.${o}`),n.length>32?n.slice(0,31)+"\u2026":n}function ae(e){let n=e.getBoundingClientRect();return{el:e,label:dt(e),left:n.left,right:n.right,top:n.top,bottom:n.bottom,width:n.width,height:n.height}}function Be(e){if(e.parentElement)return e.parentElement;let n=e.getRootNode();return n instanceof ShadowRoot?n.host:null}function j(e,n,o){let t=Te(o),r=document.elementFromPoint(e,n);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,n);if(!i||i===r)break;r=i}for(;r&&r.matches(t);)r=Be(r);return r&&r!==document.documentElement?ae(r):null}var le=e=>parseFloat(e)||0;function Ae(e){let n=getComputedStyle(e),o=(t,r,i,l)=>[le(t),le(r),le(i),le(l)];return{padding:o(n.paddingTop,n.paddingRight,n.paddingBottom,n.paddingLeft),border:o(n.borderTopWidth,n.borderRightWidth,n.borderBottomWidth,n.borderLeftWidth),margin:o(n.marginTop,n.marginRight,n.marginBottom,n.marginLeft)}}function ut(e,n){return e.width*e.height>=n.width*n.height?[e,n]:[n,e]}function pt(e,n){let o=n.left+n.width/2,t=n.top+n.height/2;return[{x1:e.left,y1:t,x2:n.left,y2:t,label:f(n.left-e.left),axis:"x"},{x1:n.right,y1:t,x2:e.right,y2:t,label:f(e.right-n.right),axis:"x"},{x1:o,y1:e.top,x2:o,y2:n.top,label:f(n.top-e.top),axis:"y"},{x1:o,y1:n.bottom,x2:o,y2:e.bottom,label:f(e.bottom-n.bottom),axis:"y"}]}function ye(e,n){let o=[],t=e.left<n.right&&n.left<e.right,r=e.top<n.bottom&&n.top<e.bottom;if(t&&r){let[i,l]=ut(e,n);return pt(i,l)}if(!t){let[i,l]=e.right<=n.left?[e,n]:[n,e],u=r?(Math.max(e.top,n.top)+Math.min(e.bottom,n.bottom))/2:(e.top+e.height/2+n.top+n.height/2)/2;o.push({x1:i.right,y1:u,x2:l.left,y2:u,label:`${f(l.left-i.right)}`,axis:"x"})}if(!r){let[i,l]=e.bottom<=n.top?[e,n]:[n,e],u=t?(Math.max(e.left,n.left)+Math.min(e.right,n.right))/2:(e.left+e.width/2+n.left+n.width/2)/2;o.push({x1:u,y1:i.bottom,x2:u,y2:l.top,label:`${f(l.top-i.bottom)}`,axis:"y"})}return o}function ht(e){if(e.length<2)return[...e];let n=t=>{let r=e.map(t);return Math.max(...r)-Math.min(...r)},o=n(t=>t.left+t.width/2)>=n(t=>t.top+t.height/2);return[...e].sort((t,r)=>o?t.left-r.left:t.top-r.top)}function Re(e){let n=ht(e),o=[];for(let t=1;t<n.length;t++)o.push([n[t-1],n[t]]);return o}var mt=5,ft=4;function oe(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function ve(e,n,o){let t=null,r=mt;for(let i of e){let l=Math.abs(oe(i)-(i.axis==="x"?n:o));l<=r&&(t=i,r=l)}return t}function Pe(e,n,o){if(o)return e;let t=e,r=ft;for(let i of n){let l=Math.abs(i-e);l<r&&(t=i,r=l)}return t}function Ge(e,n){return e?n==="x"?[e.left,e.right]:[e.top,e.bottom]:[]}function be(e,n){let o=[];for(let t of["x","y"]){let r=n.filter(i=>i.axis===t).map(i=>({pos:i.pos,gap:t==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,l)=>i.gap-l.gap)[0];if(r)if(t==="x"){let i=e.top+e.height/2,l=r.pos<e.left?r.pos:e.right,u=r.pos<e.left?e.left:r.pos;o.push({x1:l,y1:i,x2:u,y2:i,label:f(r.gap),axis:"x"})}else{let i=e.left+e.width/2,l=r.pos<e.top?r.pos:e.bottom,u=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:l,x2:i,y2:u,label:f(r.gap),axis:"y"})}}return o}function Ye(e,n){let o=[];for(let t of["x","y"]){let r=e.filter(i=>i.axis===t).map(i=>i.pos).sort((i,l)=>i-l);for(let i=1;i<r.length;i++){let l=r[i-1],u=r[i],w=u-l;w<.01||(t==="x"?o.push({x1:l,y1:n.y,x2:u,y2:n.y,label:f(w),axis:"x"}):o.push({x1:n.x,y1:l,x2:n.x,y2:u,label:f(w),axis:"y"}))}}return o}var V=3;function gt(e,n){return e.x<n.x+n.w+V&&n.x<e.x+e.w+V&&e.y<n.y+n.h+V&&n.y<e.y+e.h+V}function Ie(e){let n=[];for(let o of e){let t={...o};for(let r=0;r<16;r++){let i=n.find(l=>gt(l,t));if(!i)break;t.axis==="x"?t.y=i.y-t.h-V:t.x=i.x+i.w+V}n.push(t)}return n}function xt(e){let n=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!n)return{x:1,y:1};let o=n[2].split(",").map(u=>parseFloat(u)),[t,r,i,l]=n[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(t??1,r??0)||1,y:Math.hypot(i??0,l??1)||1}}function De(e){let n=1,o=1;for(let t=e;t;t=Be(t)){let r=xt(getComputedStyle(t).transform);n*=r.x,o*=r.y}return{x:n,y:o}}var S=(e,n)=>({light:e,dark:n}),ke={accent:S("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:S("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:S("oklch(1 0 0)","oklch(0.264 0 0)"),fg:S("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:S("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:S("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:S("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:S("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)")},Xe=[S("oklch(1 0 0)","oklch(0.264 0 0)"),S("oklch(0.985 0 0)","oklch(0.293 0 0)"),S("oklch(0.967 0 0)","oklch(0.321 0 0)"),S("oklch(0.937 0 0)","oklch(0.348 0 0)"),S("oklch(0.922 0 0)","oklch(0.375 0 0)")],X={fg:S("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:S("oklch(0.556 0 0)","oklch(0.715 0 0)")};function Y(e){return`light-dark(${e.light}, ${e.dark})`}var P=e=>Y(Xe[e]??Xe[0]),yt=["0 1px 1px -0.5px","0 3px 3px -1.5px","0 6px 6px -3px","0 12px 12px -6px","0 24px 24px -12px","0 48px 48px -24px","0 96px 96px -48px"];function F(e,n){let o=Math.max(1,Math.min(8,Math.round(e))),t=yt.slice(0,o-1);if(!n){let w="oklch(0 0 0 / 0.06)";return[`0 0 0 1px ${w}`,...t.map(B=>`${B} ${w}`)].join(", ")}let r=[0,0,.01,.02,.02,.04,.04,.06][o-1],i=[.02,.02,.04,.04,.06,.06,.06,.06][o-1],l="oklch(0 0 0 / 0.18)",u=[`inset 0 0 0 1px oklch(1 0 0 / ${i})`];return r&&u.unshift(`inset 0 1px 0 0 oklch(1 0 0 / ${r})`),[...u,...t.map(w=>`${w} ${l}`)].join(", ")}var vt='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',b={title:13,body:12,tag:11,stack:vt},M={regular:400,medium:500,semibold:600},we="__align_font",bt="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function Ne(){if(document.getElementById(we))return;let e=document.createElement("link");e.id=we,e.rel="stylesheet",e.href=bt,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function ze(){document.getElementById(we)?.remove()}function He(e){let n=[`${M.medium} ${b.body}px Inter`];Promise.all(n.map(o=>document.fonts.load(o))).then(e,e)}function Ee(e){let n={};for(let o of Object.keys(ke))n[o]=e?ke[o].dark:ke[o].light;return n}function Ke(){return matchMedia("(prefers-color-scheme: dark)").matches}function se(e,n){return e.replace(/\)$/,` / ${n})`)}var W=16,kt=3,wt=5,Et=4,Me=(e,n)=>`
${e} { box-shadow: ${F(n,!1)}; }
@media (prefers-color-scheme: dark) {
  ${e} { box-shadow: ${F(n,!0)}; }
}`,Mt=`
.dock {
  /* On .dock, not :host \u2014 the host's inline all:initial outranks a :host rule,
     which would pin color-scheme to normal and resolve light-dark() to its
     light branch on a dark page. */
  color-scheme: light dark;
  position: fixed; left: ${W}px; top: 0; width: 340px;
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none; user-select: none;
  font-family: ${b.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${Y(X.fg)};
  --muted: ${Y(X.muted)};
  --border: color-mix(in oklab, var(--fg) 12%, transparent);
}
.panel {
  padding: 10px; border-radius: 0;
  font-size: ${b.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${P(0)};

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
${Me(".panel",kt)}
${Me(".dock[data-dragging] .panel",wt)}

header {
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${b.title}px; font-weight: ${M.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${b.body}px; font-weight: ${M.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${b.tag}px; font-weight: ${M.medium};
  margin-left: 4px;
  color: ${Y(X.fg)};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${b.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${P(1)}; }

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
.region[data-level="1"] { background: ${P(1)}; }
.region[data-level="2"] { background: ${P(2)}; }
.region[data-level="3"] { background: ${P(3)}; }
.content { background: ${P(4)}; }
${Me(".region, .content",Et)}

/* One muted weight for every label: the words already say which band is which,
   so colour would only compete with the numbers. */
.tag {
  position: absolute; top: 10px; left: 10px;
  font-size: ${b.tag}px; font-weight: ${M.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${M.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${M.regular}; }
.row { display: flex; align-items: center; gap: 5px; margin: 6px 0; }
.row > .edge { flex: 0 0 22px; }
.row > .fill { flex: 1 1 auto; min-width: 0; }

.content {
  border-radius: 0; padding: 14px 8px;
  text-align: center; font-weight: ${M.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,re=W,U=-1,ie=!1;function Oe(e){let n=document.createElement("style");n.textContent=Mt,e.appendChild(n);let o=document.createElement("div");o.className="dock";let t=document.createElement("div");t.className="panel",o.appendChild(t),e.appendChild(o);let r=(c,x)=>Math.min(Math.max(c,W),Math.max(W,x-W));function i(){let c=o.offsetHeight||300;U<0&&(U=Math.max(W,innerHeight-c-W)),re=r(re,innerWidth-o.offsetWidth),U=r(U,innerHeight-c),o.style.transform=`translate(${re-W}px, ${U}px)`}let l=null;function u(c){c.button===0&&(c.preventDefault(),c.stopPropagation(),l={x:c.clientX,y:c.clientY,dx:re,dy:U},o.setAttribute("data-dragging",""),c.currentTarget.setPointerCapture(c.pointerId))}function w(c){l&&(re=l.dx+(c.clientX-l.x),U=l.dy+(c.clientY-l.y),i())}function B(){l=null,o.removeAttribute("data-dragging")}addEventListener("resize",i);let $=null;function G(c){let x=document.createElement("div");return x.className="edge",x.textContent=c===0?"0":f(c),c===0&&x.setAttribute("data-zero",""),x}function p(c,x,q,te){let[ne,H,s,a]=q,h=document.createElement("div");h.className="region",h.setAttribute("data-level",String(x));let y=document.createElement("span");y.className="tag",y.textContent=c;let v=document.createElement("div");v.className="row";let d=document.createElement("div");return d.className="fill",d.appendChild(te),v.append(G(a),d,G(H)),h.append(y,G(ne),v,G(s)),h}return{show(c){let x=Ae(c.el),[q,te,ne,H]=x.border,[s,a,h,y]=x.padding,v=De(c.el),d=c.width/v.x,k=c.height/v.y,D=Math.abs(v.x-1)>.001||Math.abs(v.y-1)>.001,K=document.createElement("header"),fe=document.createElement("span");fe.className="name",fe.textContent=c.label;let ge=document.createElement("span");ge.className="size",ge.textContent=`${f(d)} \xD7 ${f(k)}`;let Q=document.createElement("button");if(Q.className="close",Q.textContent="\xD7",Q.title="close (B brings it back)",Q.addEventListener("pointerdown",O=>O.stopPropagation()),Q.addEventListener("click",O=>{O.stopPropagation(),ie=!0,o.removeAttribute("data-open")}),K.append(fe,ge),D){let O=document.createElement("span");O.className="scale",O.textContent=`\xD7${f(v.x)}`,O.title=`renders at ${f(c.width)} \xD7 ${f(c.height)}`,K.appendChild(O)}K.appendChild(Q),K.addEventListener("pointerdown",u),K.addEventListener("pointermove",w),K.addEventListener("pointerup",B),K.addEventListener("pointercancel",B);let xe=document.createElement("div");xe.className="content",xe.textContent=`${f(d-H-te-y-a)} \xD7 ${f(k-q-ne-s-h)}`,t.replaceChildren(K,p("margin",1,x.margin,p("border",2,x.border,p("padding",3,x.padding,xe)))),$=c,i(),!ie&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},hide(){$=null,o.removeAttribute("data-open")},toggle(){$&&(ie=!ie,ie?o.removeAttribute("data-open"):(i(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",i),o.remove(),n.remove()}}}var $t=[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure what is under the cursor"],["Click","lock an element"],["Right-click","add to, or drop from, the locked set"],["Drag the panel header","move the box model"],["B","hide or bring back the box model"],["R","rulers down the top and left edges"],["Drag from a rule","pull out a guide; drag it back to remove"],["V","vertical guide at the cursor"],["H","horizontal guide at the cursor"],["Hover a guide","distance from it to every locked element"],["Click a guide","keep those distances up; click again to release"],["Alt while placing","ignore snapping"],["Del","remove the guide under the cursor; Shift+Del for all"],["Esc","clear the locks, then close"]],St=`
.flag {
  position: fixed; top: 16px; right: 16px;
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${b.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${b.tag}px; font-weight: ${M.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${Y(X.fg)};
  background: ${P(0)};
  box-shadow: ${F(3,!1)};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
.flag:hover { background: ${P(1)}; }
@media (prefers-color-scheme: dark) {
  .flag { box-shadow: ${F(3,!0)}; }
}
.flag .count { color: ${Y(X.muted)}; }
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: 46px; right: 16px; width: 292px;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${b.stack};
  font-synthesis: none;
  font-size: ${b.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${Y(X.fg)};
  background: ${P(0)};
  box-shadow: ${F(4,!1)};
  display: none;
}
@media (prefers-color-scheme: dark) {
  .help { box-shadow: ${F(4,!0)}; }
}
.help[data-open] { display: block; }
.help dl { display: grid; grid-template-columns: auto 1fr; gap: 6px 10px; margin: 0; }
.help dt { justify-self: start; }
.help kbd {
  display: inline-block; padding: 3px 5px;
  font: inherit; font-weight: ${M.medium};
  border: 1px solid color-mix(in oklab, ${Y(X.fg)} 14%, transparent);
  background: ${P(2)};
}
.help dd { margin: 0; align-self: center; color: ${Y(X.muted)}; }
`;function Fe(e){let n=document.createElement("style");n.textContent=St,e.appendChild(n);let o=document.createElement("div");o.className="flag";let t=document.createElement("span");t.className="name",t.textContent="Align";let r=document.createElement("span");r.className="count",o.append(t,r);let i=document.createElement("div");i.className="help";let l=document.createElement("dl");for(let[u,w]of $t){let B=document.createElement("dt"),$=document.createElement("kbd");$.textContent=u,B.appendChild($);let G=document.createElement("dd");G.textContent=w,l.append(B,G)}return i.appendChild(l),o.addEventListener("click",u=>{u.stopPropagation(),i.toggleAttribute("data-open")}),e.append(o,i),{update(u){r.textContent=u>0?`${u} locked`:""},closeHelp(){let u=i.hasAttribute("data-open");return i.removeAttribute("data-open"),u},destroy(){o.remove(),i.remove(),n.remove()}}}var ce=5,$e=4,de=12,We=.22,m=22,J=10,Ct=50,Lt=100;function _e(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let n=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",n.appendChild(o);let t=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,guides:[],liveGuide:null},i=Ee(Ke()),l=0,u=matchMedia("(prefers-color-scheme: dark)"),w=()=>{i=Ee(u.matches),H()};u.addEventListener("change",w),He(()=>H());function B(){let s=devicePixelRatio;o.width=Math.round(innerWidth*s),o.height=Math.round(innerHeight*s),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",t.setTransform(s,0,0,s,0,0),t.translate(.5,.5)}function $(s,a){t.strokeStyle=a,t.lineWidth=1,t.setLineDash([]),t.strokeRect(Math.round(s.left),Math.round(s.top),Math.round(s.width),Math.round(s.height))}function G(s){t.strokeStyle=se(i.measure,.7),t.lineWidth=1,t.setLineDash([2,2]),t.beginPath();for(let a of[s.left,s.right])t.moveTo(Math.round(a),0),t.lineTo(Math.round(a),innerHeight);for(let a of[s.top,s.bottom])t.moveTo(0,Math.round(a)),t.lineTo(innerWidth,Math.round(a));t.stroke(),t.setLineDash([])}function p(s){if(t.strokeStyle=i.measure,t.lineWidth=1,t.setLineDash([]),t.beginPath(),t.moveTo(Math.round(s.x1),Math.round(s.y1)),t.lineTo(Math.round(s.x2),Math.round(s.y2)),s.axis==="x")for(let a of[s.x1,s.x2])t.moveTo(Math.round(a),Math.round(s.y1)-ce),t.lineTo(Math.round(a),Math.round(s.y1)+ce);else for(let a of[s.y1,s.y2])t.moveTo(Math.round(s.x1)-ce,Math.round(a)),t.lineTo(Math.round(s.x1)+ce,Math.round(a));t.stroke()}function c(s){return t.font=`${M.medium} ${b.body}px ${b.stack}`,{w:t.measureText(s).width+$e*2,h:b.body+$e*2+2}}function x(s,a,h,y){t.font=`${M.medium} ${b.body}px ${b.stack}`,t.textBaseline="middle";let{w:v,h:d}=c(s),k=Math.min(Math.max(a,de),innerWidth-v-de),D=Math.min(Math.max(h,de),innerHeight-d-de);t.fillStyle=y,t.beginPath(),t.roundRect(k,D,v,d,4),t.fill(),t.fillStyle=i.surface,t.fillText(s,k+$e,D+d/2)}function q(s,a,h,y,v=!1){let{w:d,h:k}=c(s);x(s,v?a-d/2:a,v?h-k/2:h,y)}function te(){let s=scrollX,a=scrollY;t.fillStyle=i.rulerBg,t.fillRect(-.5,-.5,innerWidth+1,m),t.fillRect(-.5,-.5,m,innerHeight+1),t.strokeStyle=i.rulerLine,t.lineWidth=1,t.setLineDash([]),t.font=`${M.regular} 9px ${b.stack}`,t.fillStyle=i.muted,t.save(),t.globalAlpha=.16,t.fillStyle=i.accent;for(let d of r.pinned)t.fillRect(d.left,-.5,d.width,m),t.fillRect(-.5,d.top,m,d.height);t.restore(),t.beginPath(),t.moveTo(-.5,m-.5),t.lineTo(innerWidth,m-.5),t.moveTo(m-.5,-.5),t.lineTo(m-.5,innerHeight),t.stroke();let h=d=>d%Lt===0?m:d%Ct===0?7:4;t.textBaseline="top",t.textAlign="left",t.beginPath();let y=Math.floor(s/J)*J;for(let d=y;d<s+innerWidth;d+=J){let k=Math.round(d-s);if(k<m)continue;let D=h(d);t.moveTo(k,m-D),t.lineTo(k,m),D===m&&(t.fillStyle=i.muted,t.fillText(String(d),k+3,3))}t.stroke(),t.beginPath();let v=Math.floor(a/J)*J;for(let d=v;d<a+innerHeight;d+=J){let k=Math.round(d-a);if(k<m)continue;let D=h(d);t.moveTo(m-D,k),t.lineTo(m,k),D===m&&(t.save(),t.translate(3,k-3),t.rotate(-Math.PI/2),t.fillStyle=i.muted,t.fillText(String(d),0,0),t.restore())}t.stroke(),r.cursor&&(t.strokeStyle=i.accent,t.beginPath(),t.moveTo(Math.round(r.cursor.x),-.5),t.lineTo(Math.round(r.cursor.x),m),t.moveTo(-.5,Math.round(r.cursor.y)),t.lineTo(m,Math.round(r.cursor.y)),t.stroke()),t.fillStyle=i.guide;for(let d of r.guides){let k=Math.round(oe(d));d.axis==="x"?t.fillRect(k-1,-.5,2,m):t.fillRect(-.5,k-1,m,2)}t.fillStyle=i.rulerBg,t.fillRect(-.5,-.5,m,m),t.strokeStyle=i.rulerLine,t.strokeRect(-.5,-.5,m,m)}function ne(){l=0,t.save(),t.setTransform(1,0,0,1,0,0),t.clearRect(0,0,o.width,o.height),t.restore();for(let a of r.pinned)$(a,i.accent);r.hover&&(G(r.hover),$(r.hover,r.pinned.length?se(i.accent,.7):i.accent));for(let a of r.guides){let h=r.liveGuide?.id===a.id;t.strokeStyle=a.locked||h?i.guide:se(i.guide,.55),t.lineWidth=1,t.setLineDash(a.locked?[]:[4,4]),t.beginPath();let y=Math.round(oe(a));a.axis==="x"?(t.moveTo(y,0),t.lineTo(y,innerHeight)):(t.moveTo(0,y),t.lineTo(innerWidth,y)),t.stroke()}for(let a of r.lines)t.globalAlpha=a.faded?We:1,p(a);t.globalAlpha=1;let s=r.lines.map(a=>{let h=(a.x1+a.x2)/2,y=(a.y1+a.y2)/2,{w:v,h:d}=c(a.label);return a.axis==="x"?{x:h-v/2,y:y-16-d/2,w:v,h:d,axis:a.axis}:{x:h+26-v/2,y:y-d/2,w:v,h:d,axis:a.axis}});if(Ie(s).forEach((a,h)=>{let y=r.lines[h];t.globalAlpha=y.faded?We:1,x(y.label,a.x,a.y,i.measure)}),t.globalAlpha=1,r.hover&&r.cursor){let{width:a,height:h}=r.hover;q(`${f(a)} \xD7 ${f(h)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let a=r.liveGuide,h=Math.round(oe(a));q(`${a.axis} ${f(a.at)}`,a.axis==="x"?h+6:30,a.axis==="x"?30:h+6,i.guide)}r.rulers&&te()}function H(){l||(l=requestAnimationFrame(ne))}return B(),{root:n,update(s){Object.assign(r,s),H()},resize(){B(),H()},destroy(){l&&cancelAnimationFrame(l),u.removeEventListener("change",w),e.remove()}}}var A,T=null,z=null,_=null,E=null,g=[],he=0,me=!1,L=[],Tt=1,C=null,N=null,I=null,Bt=3,Z=22;function Ve(e,n){return me?n<Z&&e>=Z?"y":e<Z&&n>=Z?"x":null:null}function Je(e,n,o,t){let r=j(n,o,A),i=e.axis==="x"?n:o,l=Pe(i,Ge(r,e.axis),t);e.at=l+(e.axis==="x"?scrollX:scrollY)}function Ze(e,n,o,t){let r={id:Tt++,axis:e,at:0,locked:!1};return Je(r,n,o,t),L=[...L,r],r}function et(e){L=L.filter(n=>n.id!==e.id),N?.id===e.id&&(N=null),C?.id===e.id&&(C=null)}function At(e){let n=A.hotkey.toLowerCase().split("+"),o=n[n.length-1];return e.key.toLowerCase()!==o||n.includes("shift")!==e.shiftKey||n.includes("alt")!==e.altKey?!1:(n.includes("mod")||n.includes("ctrl")||n.includes("cmd"))===(e.metaKey||e.ctrlKey)}function ue(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function R(e){let n=g[g.length-1],o=E&&g.some(p=>p.el===E.el),t=L.map(ue),r=!C&&N?N:null,i=L.filter(p=>p.locked||p.id===r?.id),l=!r&&o?E.el:null,u=r??l,w=r?ue(r):null,B=[],$=(p,c)=>{for(let x of p)B.push(u&&!c?{...x,faded:!0}:x)},G=p=>!w||p.axis!==w.axis?!1:(p.axis==="x"?[p.x1,p.x2]:[p.y1,p.y2]).some(x=>Math.abs(x-w.pos)<.5);for(let[p,c]of Re(g))$(ye(p,c),p.el===l||c.el===l);n&&E&&!o&&!r&&$(ye(n,E),!0);for(let p of i)for(let c of g)$(be(c,[ue(p)]),p.id===r?.id||c.el===l);E&&!o&&!r&&L.length&&$(be(E,t),!0);for(let p of Ye(i.map(ue),{x:innerWidth/2,y:innerHeight/2}))$([p],G(p));T?.update({hover:E,pinned:g,rulers:me,guides:L,liveGuide:C??N,lines:B,...e?{cursor:e}:{}}),_?.update(g.length)}var pe=null;function tt(e){if(pe={x:e.clientX,y:e.clientY},C){I&&Math.hypot(e.clientX-I.x,e.clientY-I.y)>Bt&&(I=null),I||(Je(C,e.clientX,e.clientY,e.altKey),L=[...L]),R({x:e.clientX,y:e.clientY});return}N=ve(L,e.clientX,e.clientY),E=j(e.clientX,e.clientY,A),R({x:e.clientX,y:e.clientY})}function nt(e){C&&(I?(C.locked=!C.locked,L=[...L]):(Ve(e.clientX,e.clientY)||e.clientX<Z||e.clientY<Z)&&et(C),I=null,C=null,R({x:e.clientX,y:e.clientY}))}function ot(e){if(e.button!==0)return;let n=j(e.clientX,e.clientY,A);if(!n)return;let o=Ve(e.clientX,e.clientY);if(o){ee(e),I=null,C=Ze(o,e.clientX,e.clientY,e.altKey),R({x:e.clientX,y:e.clientY});return}let t=ve(L,e.clientX,e.clientY);if(t){ee(e),C=t,I={x:e.clientX,y:e.clientY},R({x:e.clientX,y:e.clientY});return}ee(e),_?.closeHelp(),g=[n],E=n,z?.show(n),R({x:e.clientX,y:e.clientY})}function rt(e){let n=j(e.clientX,e.clientY,A);if(!n)return;ee(e),_?.closeHelp();let o=g.findIndex(r=>r.el===n.el);g=o>=0?g.filter((r,i)=>i!==o):[...g,n],E=n;let t=g[g.length-1];t?z?.show(t):z?.hide(),R({x:e.clientX,y:e.clientY})}function it(e){j(e.clientX,e.clientY,A)&&ee(e)}function lt(e){j(e.clientX,e.clientY,A)&&ee(e)}function ee(e){e.preventDefault(),e.stopPropagation()}function je(e,n){return e.left===n.left&&e.top===n.top&&e.width===n.width&&e.height===n.height}var Ue=0,qe=0;function at(){he=requestAnimationFrame(at);let n=g.filter(l=>l.el.isConnected).map(l=>ae(l.el)),o=E&&E.el.isConnected?ae(E.el):null;if(!(scrollX!==Ue||scrollY!==qe||n.length!==g.length||n.some((l,u)=>!je(l,g[u]))||E===null!=(o===null)||E!==null&&o!==null&&!je(E,o)))return;Ue=scrollX,qe=scrollY,g=n,E=o;let i=g[g.length-1];i?z?.show(i):z?.hide(),R()}function st(){T?.resize()}function Rt(){T||(Ne(),T=_e(),z=Oe(T.root),_=Fe(T.root),_.update(0),addEventListener("mousemove",tt),addEventListener("mousedown",ot,{capture:!0}),addEventListener("mouseup",nt,{capture:!0}),addEventListener("click",it,{capture:!0}),addEventListener("auxclick",lt,{capture:!0}),addEventListener("contextmenu",rt,{capture:!0}),addEventListener("resize",st),he=requestAnimationFrame(at),R())}function Se(){removeEventListener("mousemove",tt),removeEventListener("mousedown",ot,{capture:!0}),removeEventListener("mouseup",nt,{capture:!0}),removeEventListener("click",it,{capture:!0}),removeEventListener("auxclick",lt,{capture:!0}),removeEventListener("contextmenu",rt,{capture:!0}),removeEventListener("resize",st),cancelAnimationFrame(he),he=0,_?.destroy(),_=null,z?.destroy(),z=null,T?.destroy(),T=null,ze(),E=null,g=[],C=null,I=null,N=null}function Qe(e){if(At(e))e.preventDefault(),T?Se():Rt();else if(T&&pe&&(e.key.toLowerCase()===A.guideKeys.vertical||e.key.toLowerCase()===A.guideKeys.horizontal)){e.preventDefault();let n=e.key.toLowerCase()===A.guideKeys.vertical?"x":"y";Ze(n,pe.x,pe.y,e.altKey),R()}else if(T&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(L=[],N=null,C=null,I=null):N&&et(N),R();else if(T&&e.key.toLowerCase()===A.rulerKey)e.preventDefault(),me=!me,R();else if(T&&e.key.toLowerCase()===A.panelKey)e.preventDefault(),z?.toggle();else if(e.key==="Escape"&&T){if(_?.closeHelp())return;g.length?(g=[],z?.hide(),R()):Se()}}function Vt(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,A=Le(e),addEventListener("keydown",Qe,{capture:!0});let n=import.meta.hot;n&&n.dispose(()=>{Se(),removeEventListener("keydown",Qe,{capture:!0}),delete window.__align})}export{Vt as initAlign};
