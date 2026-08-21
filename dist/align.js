var it={ignore:"",hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function Se(e={}){return{...it,...e}}var $e=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function Ce(e){return e.ignore?`${$e}, ${e.ignore}`:$e}function f(e){return String(Math.round(e*100)/100)}function lt(e){let n=e.tagName.toLowerCase();e.id&&(n+=`#${e.id}`);let o=e.classList[0];return o&&(n+=`.${o}`),n.length>32?n.slice(0,31)+"\u2026":n}function le(e){let n=e.getBoundingClientRect();return{el:e,label:lt(e),left:n.left,right:n.right,top:n.top,bottom:n.bottom,width:n.width,height:n.height}}function Te(e){if(e.parentElement)return e.parentElement;let n=e.getRootNode();return n instanceof ShadowRoot?n.host:null}function _(e,n,o){let t=Ce(o),r=document.elementFromPoint(e,n);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,n);if(!i||i===r)break;r=i}for(;r&&r.matches(t);)r=Te(r);return r&&r!==document.documentElement?le(r):null}var ie=e=>parseFloat(e)||0;function Le(e){let n=getComputedStyle(e),o=(t,r,i,a)=>[ie(t),ie(r),ie(i),ie(a)];return{padding:o(n.paddingTop,n.paddingRight,n.paddingBottom,n.paddingLeft),border:o(n.borderTopWidth,n.borderRightWidth,n.borderBottomWidth,n.borderLeftWidth),margin:o(n.marginTop,n.marginRight,n.marginBottom,n.marginLeft)}}function at(e,n){return e.width*e.height>=n.width*n.height?[e,n]:[n,e]}function st(e,n){let o=n.left+n.width/2,t=n.top+n.height/2;return[{x1:e.left,y1:t,x2:n.left,y2:t,label:f(n.left-e.left),axis:"x"},{x1:n.right,y1:t,x2:e.right,y2:t,label:f(e.right-n.right),axis:"x"},{x1:o,y1:e.top,x2:o,y2:n.top,label:f(n.top-e.top),axis:"y"},{x1:o,y1:n.bottom,x2:o,y2:e.bottom,label:f(e.bottom-n.bottom),axis:"y"}]}function ge(e,n){let o=[],t=e.left<n.right&&n.left<e.right,r=e.top<n.bottom&&n.top<e.bottom;if(t&&r){let[i,a]=at(e,n);return st(i,a)}if(!t){let[i,a]=e.right<=n.left?[e,n]:[n,e],d=r?(Math.max(e.top,n.top)+Math.min(e.bottom,n.bottom))/2:(e.top+e.height/2+n.top+n.height/2)/2;o.push({x1:i.right,y1:d,x2:a.left,y2:d,label:`${f(a.left-i.right)}`,axis:"x"})}if(!r){let[i,a]=e.bottom<=n.top?[e,n]:[n,e],d=t?(Math.max(e.left,n.left)+Math.min(e.right,n.right))/2:(e.left+e.width/2+n.left+n.width/2)/2;o.push({x1:d,y1:i.bottom,x2:d,y2:a.top,label:`${f(a.top-i.bottom)}`,axis:"y"})}return o}function ct(e){if(e.length<2)return[...e];let n=t=>{let r=e.map(t);return Math.max(...r)-Math.min(...r)},o=n(t=>t.left+t.width/2)>=n(t=>t.top+t.height/2);return[...e].sort((t,r)=>o?t.left-r.left:t.top-r.top)}function Be(e){let n=ct(e),o=[];for(let t=1;t<n.length;t++)o.push(...ge(n[t-1],n[t]));return o}var dt=5,ut=4;function ee(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function xe(e,n,o){let t=null,r=dt;for(let i of e){let a=Math.abs(ee(i)-(i.axis==="x"?n:o));a<=r&&(t=i,r=a)}return t}function Ae(e,n,o){if(o)return e;let t=e,r=ut;for(let i of n){let a=Math.abs(i-e);a<r&&(t=i,r=a)}return t}function Re(e,n){return e?n==="x"?[e.left,e.right]:[e.top,e.bottom]:[]}function ye(e,n){let o=[];for(let t of["x","y"]){let r=n.filter(i=>i.axis===t).map(i=>({pos:i.pos,gap:t==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(t==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,d=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:d,y2:i,label:f(r.gap),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,d=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:d,label:f(r.gap),axis:"y"})}}return o}function pt(e){let n=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!n)return{x:1,y:1};let o=n[2].split(",").map(d=>parseFloat(d)),[t,r,i,a]=n[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(t??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function Pe(e){let n=1,o=1;for(let t=e;t;t=Te(t)){let r=pt(getComputedStyle(t).transform);n*=r.x,o*=r.y}return{x:n,y:o}}var b=(e,n)=>({light:e,dark:n}),ve={accent:b("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:b("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:b("oklch(1 0 0)","oklch(0.264 0 0)"),fg:b("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:b("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:b("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:b("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:b("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)")},Ge=[b("oklch(1 0 0)","oklch(0.264 0 0)"),b("oklch(0.985 0 0)","oklch(0.293 0 0)"),b("oklch(0.967 0 0)","oklch(0.321 0 0)"),b("oklch(0.937 0 0)","oklch(0.348 0 0)"),b("oklch(0.922 0 0)","oklch(0.375 0 0)")],Y={fg:b("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:b("oklch(0.556 0 0)","oklch(0.715 0 0)")};function R(e){return`light-dark(${e.light}, ${e.dark})`}var T=e=>R(Ge[e]??Ge[0]),ht=["0 1px 1px -0.5px","0 3px 3px -1.5px","0 6px 6px -3px","0 12px 12px -6px","0 24px 24px -12px","0 48px 48px -24px","0 96px 96px -48px"];function K(e,n){let o=Math.max(1,Math.min(8,Math.round(e))),t=ht.slice(0,o-1);if(!n){let L="oklch(0 0 0 / 0.06)";return[`0 0 0 1px ${L}`,...t.map(G=>`${G} ${L}`)].join(", ")}let r=[0,0,.01,.02,.02,.04,.04,.06][o-1],i=[.02,.02,.04,.04,.06,.06,.06,.06][o-1],a="oklch(0 0 0 / 0.18)",d=[`inset 0 0 0 1px oklch(1 0 0 / ${i})`];return r&&d.unshift(`inset 0 1px 0 0 oklch(1 0 0 / ${r})`),[...d,...t.map(L=>`${L} ${a}`)].join(", ")}var mt='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',g={title:13,body:12,tag:11,stack:mt},k={regular:400,medium:500,semibold:600},be="__align_font",ft="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function Ye(){if(document.getElementById(be))return;let e=document.createElement("link");e.id=be,e.rel="stylesheet",e.href=ft,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function Ie(){document.getElementById(be)?.remove()}function Xe(e){let n=[`${k.medium} ${g.body}px Inter`];Promise.all(n.map(o=>document.fonts.load(o))).then(e,e)}function ke(e){let n={};for(let o of Object.keys(ve))n[o]=e?ve[o].dark:ve[o].light;return n}function Ne(){return matchMedia("(prefers-color-scheme: dark)").matches}function ae(e,n){return e.replace(/\)$/,` / ${n})`)}var O=16,gt=3,xt=5,yt=4,we=(e,n)=>`
${e} { box-shadow: ${K(n,!1)}; }
@media (prefers-color-scheme: dark) {
  ${e} { box-shadow: ${K(n,!0)}; }
}`,vt=`
.dock {
  /* On .dock, not :host \u2014 the host's inline all:initial outranks a :host rule,
     which would pin color-scheme to normal and resolve light-dark() to its
     light branch on a dark page. */
  color-scheme: light dark;
  position: fixed; left: ${O}px; top: 0; width: 340px;
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none; user-select: none;
  font-family: ${g.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${R(Y.fg)};
  --muted: ${R(Y.muted)};
  --border: color-mix(in oklab, var(--fg) 12%, transparent);
}
.panel {
  padding: 10px; border-radius: 0;
  font-size: ${g.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${T(0)};

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
${we(".panel",gt)}
${we(".dock[data-dragging] .panel",xt)}

header {
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${g.title}px; font-weight: ${k.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${g.body}px; font-weight: ${k.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${g.tag}px; font-weight: ${k.medium};
  margin-left: 4px;
  color: ${R(Y.fg)};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${g.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${T(1)}; }

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
.region[data-level="1"] { background: ${T(1)}; }
.region[data-level="2"] { background: ${T(2)}; }
.region[data-level="3"] { background: ${T(3)}; }
.content { background: ${T(4)}; }
${we(".region, .content",yt)}

/* One muted weight for every label: the words already say which band is which,
   so colour would only compete with the numbers. */
.tag {
  position: absolute; top: 10px; left: 10px;
  font-size: ${g.tag}px; font-weight: ${k.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${k.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${k.regular}; }
.row { display: flex; align-items: center; gap: 5px; margin: 6px 0; }
.row > .edge { flex: 0 0 22px; }
.row > .fill { flex: 1 1 auto; min-width: 0; }

.content {
  border-radius: 0; padding: 14px 8px;
  text-align: center; font-weight: ${k.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,te=O,j=-1,ne=!1;function De(e){let n=document.createElement("style");n.textContent=vt,e.appendChild(n);let o=document.createElement("div");o.className="dock";let t=document.createElement("div");t.className="panel",o.appendChild(t),e.appendChild(o);let r=(s,v)=>Math.min(Math.max(s,O),Math.max(O,v-O));function i(){let s=o.offsetHeight||300;j<0&&(j=Math.max(O,innerHeight-s-O)),te=r(te,innerWidth-o.offsetWidth),j=r(j,innerHeight-s),o.style.transform=`translate(${te-O}px, ${j}px)`}let a=null;function d(s){s.button===0&&(s.preventDefault(),s.stopPropagation(),a={x:s.clientX,y:s.clientY,dx:te,dy:j},o.setAttribute("data-dragging",""),s.currentTarget.setPointerCapture(s.pointerId))}function L(s){a&&(te=a.dx+(s.clientX-a.x),j=a.dy+(s.clientY-a.y),i())}function G(){a=null,o.removeAttribute("data-dragging")}addEventListener("resize",i);let N=null;function D(s){let v=document.createElement("div");return v.className="edge",v.textContent=s===0?"0":f(s),s===0&&v.setAttribute("data-zero",""),v}function J(s,v,Z,z){let[l,c,y,W]=Z,B=document.createElement("div");B.className="region",B.setAttribute("data-level",String(v));let u=document.createElement("span");u.className="tag",u.textContent=s;let p=document.createElement("div");p.className="row";let M=document.createElement("div");return M.className="fill",M.appendChild(z),p.append(D(W),M,D(c)),B.append(u,D(l),p,D(y)),B}return{show(s){let v=Le(s.el),[Z,z,l,c]=v.border,[y,W,B,u]=v.padding,p=Pe(s.el),M=s.width/p.x,oe=s.height/p.y,re=Math.abs(p.x-1)>.001||Math.abs(p.y-1)>.001,A=document.createElement("header"),he=document.createElement("span");he.className="name",he.textContent=s.label;let me=document.createElement("span");me.className="size",me.textContent=`${f(M)} \xD7 ${f(oe)}`;let U=document.createElement("button");if(U.className="close",U.textContent="\xD7",U.title="close (B brings it back)",U.addEventListener("pointerdown",H=>H.stopPropagation()),U.addEventListener("click",H=>{H.stopPropagation(),ne=!0,o.removeAttribute("data-open")}),A.append(he,me),re){let H=document.createElement("span");H.className="scale",H.textContent=`\xD7${f(p.x)}`,H.title=`renders at ${f(s.width)} \xD7 ${f(s.height)}`,A.appendChild(H)}A.appendChild(U),A.addEventListener("pointerdown",d),A.addEventListener("pointermove",L),A.addEventListener("pointerup",G),A.addEventListener("pointercancel",G);let fe=document.createElement("div");fe.className="content",fe.textContent=`${f(M-c-z-u-W)} \xD7 ${f(oe-Z-l-y-B)}`,t.replaceChildren(A,J("margin",1,v.margin,J("border",2,v.border,J("padding",3,v.padding,fe)))),N=s,i(),!ne&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},hide(){N=null,o.removeAttribute("data-open")},toggle(){N&&(ne=!ne,ne?o.removeAttribute("data-open"):(i(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",i),o.remove(),n.remove()}}}var bt=[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure what is under the cursor"],["Click","lock an element"],["Right-click","add to, or drop from, the locked set"],["Drag the panel header","move the box model"],["B","hide or bring back the box model"],["R","rulers down the top and left edges"],["Drag from a rule","pull out a guide; drag it back to remove"],["V","vertical guide at the cursor"],["H","horizontal guide at the cursor"],["Hover a guide","distance from it to every locked element"],["Click a guide","keep those distances up; click again to release"],["Alt while placing","ignore snapping"],["Del","remove the guide under the cursor; Shift+Del for all"],["Esc","clear the locks, then close"]],kt=`
.flag {
  position: fixed; top: 16px; right: 16px;
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${g.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${g.tag}px; font-weight: ${k.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${R(Y.fg)};
  background: ${T(0)};
  box-shadow: ${K(3,!1)};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
.flag:hover { background: ${T(1)}; }
@media (prefers-color-scheme: dark) {
  .flag { box-shadow: ${K(3,!0)}; }
}
.flag .count { color: ${R(Y.muted)}; }
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: 46px; right: 16px; width: 292px;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${g.stack};
  font-synthesis: none;
  font-size: ${g.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${R(Y.fg)};
  background: ${T(0)};
  box-shadow: ${K(4,!1)};
  display: none;
}
@media (prefers-color-scheme: dark) {
  .help { box-shadow: ${K(4,!0)}; }
}
.help[data-open] { display: block; }
.help dl { display: grid; grid-template-columns: auto 1fr; gap: 6px 10px; margin: 0; }
.help dt { justify-self: start; }
.help kbd {
  display: inline-block; padding: 3px 5px;
  font: inherit; font-weight: ${k.medium};
  border: 1px solid color-mix(in oklab, ${R(Y.fg)} 14%, transparent);
  background: ${T(2)};
}
.help dd { margin: 0; align-self: center; color: ${R(Y.muted)}; }
`;function ze(e){let n=document.createElement("style");n.textContent=kt,e.appendChild(n);let o=document.createElement("div");o.className="flag";let t=document.createElement("span");t.className="name",t.textContent="Align";let r=document.createElement("span");r.className="count",o.append(t,r);let i=document.createElement("div");i.className="help";let a=document.createElement("dl");for(let[d,L]of bt){let G=document.createElement("dt"),N=document.createElement("kbd");N.textContent=d,G.appendChild(N);let D=document.createElement("dd");D.textContent=L,a.append(G,D)}return i.appendChild(a),o.addEventListener("click",d=>{d.stopPropagation(),i.toggleAttribute("data-open")}),e.append(o,i),{update(d){r.textContent=d>0?`${d} locked`:""},closeHelp(){let d=i.hasAttribute("data-open");return i.removeAttribute("data-open"),d},destroy(){o.remove(),i.remove(),n.remove()}}}var se=5,Ee=4,ce=12,h=22,q=10,wt=50,Et=100;function He(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let n=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",n.appendChild(o);let t=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,guides:[],liveGuide:null},i=ke(Ne()),a=0,d=matchMedia("(prefers-color-scheme: dark)"),L=()=>{i=ke(d.matches),z()};d.addEventListener("change",L),Xe(()=>z());function G(){let l=devicePixelRatio;o.width=Math.round(innerWidth*l),o.height=Math.round(innerHeight*l),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",t.setTransform(l,0,0,l,0,0),t.translate(.5,.5)}function N(l,c){t.strokeStyle=c,t.lineWidth=1,t.setLineDash([]),t.strokeRect(Math.round(l.left),Math.round(l.top),Math.round(l.width),Math.round(l.height))}function D(l){t.strokeStyle=ae(i.measure,.7),t.lineWidth=1,t.setLineDash([2,2]),t.beginPath();for(let c of[l.left,l.right])t.moveTo(Math.round(c),0),t.lineTo(Math.round(c),innerHeight);for(let c of[l.top,l.bottom])t.moveTo(0,Math.round(c)),t.lineTo(innerWidth,Math.round(c));t.stroke(),t.setLineDash([])}function J(l){if(t.strokeStyle=i.measure,t.lineWidth=1,t.setLineDash([]),t.beginPath(),t.moveTo(Math.round(l.x1),Math.round(l.y1)),t.lineTo(Math.round(l.x2),Math.round(l.y2)),l.axis==="x")for(let c of[l.x1,l.x2])t.moveTo(Math.round(c),Math.round(l.y1)-se),t.lineTo(Math.round(c),Math.round(l.y1)+se);else for(let c of[l.y1,l.y2])t.moveTo(Math.round(l.x1)-se,Math.round(c)),t.lineTo(Math.round(l.x1)+se,Math.round(c));t.stroke()}function s(l,c,y,W,B=!1){t.font=`${k.medium} ${g.body}px ${g.stack}`,t.textBaseline="middle";let u=t.measureText(l).width+Ee*2,p=g.body+Ee*2+2,M=B?c-u/2:c,oe=B?y-p/2:y,re=Math.min(Math.max(M,ce),innerWidth-u-ce),A=Math.min(Math.max(oe,ce),innerHeight-p-ce);t.fillStyle=W,t.beginPath(),t.roundRect(re,A,u,p,4),t.fill(),t.fillStyle=i.surface,t.fillText(l,re+Ee,A+p/2)}function v(){let l=scrollX,c=scrollY;t.fillStyle=i.rulerBg,t.fillRect(-.5,-.5,innerWidth+1,h),t.fillRect(-.5,-.5,h,innerHeight+1),t.strokeStyle=i.rulerLine,t.lineWidth=1,t.setLineDash([]),t.font=`${k.regular} 9px ${g.stack}`,t.fillStyle=i.muted,t.save(),t.globalAlpha=.16,t.fillStyle=i.accent;for(let u of r.pinned)t.fillRect(u.left,-.5,u.width,h),t.fillRect(-.5,u.top,h,u.height);t.restore(),t.beginPath(),t.moveTo(-.5,h-.5),t.lineTo(innerWidth,h-.5),t.moveTo(h-.5,-.5),t.lineTo(h-.5,innerHeight),t.stroke();let y=u=>u%Et===0?h:u%wt===0?7:4;t.textBaseline="top",t.textAlign="left",t.beginPath();let W=Math.floor(l/q)*q;for(let u=W;u<l+innerWidth;u+=q){let p=Math.round(u-l);if(p<h)continue;let M=y(u);t.moveTo(p,h-M),t.lineTo(p,h),M===h&&(t.fillStyle=i.muted,t.fillText(String(u),p+3,3))}t.stroke(),t.beginPath();let B=Math.floor(c/q)*q;for(let u=B;u<c+innerHeight;u+=q){let p=Math.round(u-c);if(p<h)continue;let M=y(u);t.moveTo(h-M,p),t.lineTo(h,p),M===h&&(t.save(),t.translate(3,p-3),t.rotate(-Math.PI/2),t.fillStyle=i.muted,t.fillText(String(u),0,0),t.restore())}t.stroke(),r.cursor&&(t.strokeStyle=i.accent,t.beginPath(),t.moveTo(Math.round(r.cursor.x),-.5),t.lineTo(Math.round(r.cursor.x),h),t.moveTo(-.5,Math.round(r.cursor.y)),t.lineTo(h,Math.round(r.cursor.y)),t.stroke()),t.fillStyle=i.guide;for(let u of r.guides){let p=Math.round(ee(u));u.axis==="x"?t.fillRect(p-1,-.5,2,h):t.fillRect(-.5,p-1,h,2)}t.fillStyle=i.rulerBg,t.fillRect(-.5,-.5,h,h),t.strokeStyle=i.rulerLine,t.strokeRect(-.5,-.5,h,h)}function Z(){a=0,t.save(),t.setTransform(1,0,0,1,0,0),t.clearRect(0,0,o.width,o.height),t.restore();for(let l of r.pinned)N(l,i.accent);r.hover&&(D(r.hover),N(r.hover,r.pinned.length?ae(i.accent,.7):i.accent));for(let l of r.guides){let c=r.liveGuide?.id===l.id;t.strokeStyle=l.locked||c?i.guide:ae(i.guide,.55),t.lineWidth=1,t.setLineDash(l.locked?[]:[4,4]),t.beginPath();let y=Math.round(ee(l));l.axis==="x"?(t.moveTo(y,0),t.lineTo(y,innerHeight)):(t.moveTo(0,y),t.lineTo(innerWidth,y)),t.stroke()}for(let l of r.lines)J(l);for(let l of r.lines){let c=(l.x1+l.x2)/2,y=(l.y1+l.y2)/2;l.axis==="x"?s(l.label,c,y-16,i.measure,!0):s(l.label,c+26,y,i.measure,!0)}if(r.hover&&r.cursor){let{width:l,height:c}=r.hover;s(`${f(l)} \xD7 ${f(c)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let l=r.liveGuide,c=Math.round(ee(l));s(`${l.axis} ${f(l.at)}`,l.axis==="x"?c+6:30,l.axis==="x"?30:c+6,i.guide)}r.rulers&&v()}function z(){a||(a=requestAnimationFrame(Z))}return G(),{root:n,update(l){Object.assign(r,l),z()},resize(){G(),z()},destroy(){a&&cancelAnimationFrame(a),d.removeEventListener("change",L),e.remove()}}}var S,$=null,X=null,F=null,x=null,m=[],ue=0,pe=!1,E=[],Mt=1,w=null,I=null,P=null,$t=3,Q=22;function je(e,n){return pe?n<Q&&e>=Q?"y":e<Q&&n>=Q?"x":null:null}function Ue(e,n,o,t){let r=_(n,o,S),i=e.axis==="x"?n:o,a=Ae(i,Re(r,e.axis),t);e.at=a+(e.axis==="x"?scrollX:scrollY)}function qe(e,n,o,t){let r={id:Mt++,axis:e,at:0,locked:!1};return Ue(r,n,o,t),E=[...E,r],r}function Qe(e){E=E.filter(n=>n.id!==e.id),I?.id===e.id&&(I=null),w?.id===e.id&&(w=null)}function St(e){let n=S.hotkey.toLowerCase().split("+"),o=n[n.length-1];return e.key.toLowerCase()!==o||n.includes("shift")!==e.shiftKey||n.includes("alt")!==e.altKey?!1:(n.includes("mod")||n.includes("ctrl")||n.includes("cmd"))===(e.metaKey||e.ctrlKey)}function Ke(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function C(e){let n=m[m.length-1],o=x&&m.some(a=>a.el===x.el),t=E.map(Ke),r=!w&&I?I:null,i=E.filter(a=>a.locked||a.id===r?.id);$?.update({hover:x,pinned:m,rulers:pe,guides:E,liveGuide:w??I,lines:[...Be(m),...n&&x&&!o&&!r?ge(n,x):[],...i.flatMap(a=>m.flatMap(d=>ye(d,[Ke(a)]))),...x&&!r&&E.length?ye(x,t):[]],...e?{cursor:e}:{}}),F?.update(m.length)}var de=null;function Ve(e){if(de={x:e.clientX,y:e.clientY},w){P&&Math.hypot(e.clientX-P.x,e.clientY-P.y)>$t&&(P=null),P||(Ue(w,e.clientX,e.clientY,e.altKey),E=[...E]),C({x:e.clientX,y:e.clientY});return}I=xe(E,e.clientX,e.clientY),x=_(e.clientX,e.clientY,S),C({x:e.clientX,y:e.clientY})}function Je(e){w&&(P?(w.locked=!w.locked,E=[...E]):(je(e.clientX,e.clientY)||e.clientX<Q||e.clientY<Q)&&Qe(w),P=null,w=null,C({x:e.clientX,y:e.clientY}))}function Ze(e){if(e.button!==0)return;let n=_(e.clientX,e.clientY,S);if(!n)return;let o=je(e.clientX,e.clientY);if(o){V(e),P=null,w=qe(o,e.clientX,e.clientY,e.altKey),C({x:e.clientX,y:e.clientY});return}let t=xe(E,e.clientX,e.clientY);if(t){V(e),w=t,P={x:e.clientX,y:e.clientY},C({x:e.clientX,y:e.clientY});return}V(e),F?.closeHelp(),m=[n],x=n,X?.show(n),C({x:e.clientX,y:e.clientY})}function et(e){let n=_(e.clientX,e.clientY,S);if(!n)return;V(e),F?.closeHelp();let o=m.findIndex(r=>r.el===n.el);m=o>=0?m.filter((r,i)=>i!==o):[...m,n],x=n;let t=m[m.length-1];t?X?.show(t):X?.hide(),C({x:e.clientX,y:e.clientY})}function tt(e){_(e.clientX,e.clientY,S)&&V(e)}function nt(e){_(e.clientX,e.clientY,S)&&V(e)}function V(e){e.preventDefault(),e.stopPropagation()}function Oe(e,n){return e.left===n.left&&e.top===n.top&&e.width===n.width&&e.height===n.height}var Fe=0,We=0;function ot(){ue=requestAnimationFrame(ot);let n=m.filter(a=>a.el.isConnected).map(a=>le(a.el)),o=x&&x.el.isConnected?le(x.el):null;if(!(scrollX!==Fe||scrollY!==We||n.length!==m.length||n.some((a,d)=>!Oe(a,m[d]))||x===null!=(o===null)||x!==null&&o!==null&&!Oe(x,o)))return;Fe=scrollX,We=scrollY,m=n,x=o;let i=m[m.length-1];i?X?.show(i):X?.hide(),C()}function rt(){$?.resize()}function Ct(){$||(Ye(),$=He(),X=De($.root),F=ze($.root),F.update(0),addEventListener("mousemove",Ve),addEventListener("mousedown",Ze,{capture:!0}),addEventListener("mouseup",Je,{capture:!0}),addEventListener("click",tt,{capture:!0}),addEventListener("auxclick",nt,{capture:!0}),addEventListener("contextmenu",et,{capture:!0}),addEventListener("resize",rt),ue=requestAnimationFrame(ot),C())}function Me(){removeEventListener("mousemove",Ve),removeEventListener("mousedown",Ze,{capture:!0}),removeEventListener("mouseup",Je,{capture:!0}),removeEventListener("click",tt,{capture:!0}),removeEventListener("auxclick",nt,{capture:!0}),removeEventListener("contextmenu",et,{capture:!0}),removeEventListener("resize",rt),cancelAnimationFrame(ue),ue=0,F?.destroy(),F=null,X?.destroy(),X=null,$?.destroy(),$=null,Ie(),x=null,m=[],w=null,P=null,I=null}function _e(e){if(St(e))e.preventDefault(),$?Me():Ct();else if($&&de&&(e.key.toLowerCase()===S.guideKeys.vertical||e.key.toLowerCase()===S.guideKeys.horizontal)){e.preventDefault();let n=e.key.toLowerCase()===S.guideKeys.vertical?"x":"y";qe(n,de.x,de.y,e.altKey),C()}else if($&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(E=[],I=null,w=null,P=null):I&&Qe(I),C();else if($&&e.key.toLowerCase()===S.rulerKey)e.preventDefault(),pe=!pe,C();else if($&&e.key.toLowerCase()===S.panelKey)e.preventDefault(),X?.toggle();else if(e.key==="Escape"&&$){if(F?.closeHelp())return;m.length?(m=[],X?.hide(),C()):Me()}}function _t(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,S=Se(e),addEventListener("keydown",_e,{capture:!0});let n=import.meta.hot;n&&n.dispose(()=>{Me(),removeEventListener("keydown",_e,{capture:!0}),delete window.__align})}export{_t as initAlign};
