var ot={ignore:"",hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function Me(e={}){return{...ot,...e}}var Ee=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function $e(e){return e.ignore?`${Ee}, ${e.ignore}`:Ee}function f(e){return String(Math.round(e*100)/100)}function rt(e){let n=e.tagName.toLowerCase();e.id&&(n+=`#${e.id}`);let o=e.classList[0];return o&&(n+=`.${o}`),n.length>32?n.slice(0,31)+"\u2026":n}function ie(e){let n=e.getBoundingClientRect();return{el:e,label:rt(e),left:n.left,right:n.right,top:n.top,bottom:n.bottom,width:n.width,height:n.height}}function Se(e){if(e.parentElement)return e.parentElement;let n=e.getRootNode();return n instanceof ShadowRoot?n.host:null}function F(e,n,o){let t=$e(o),r=document.elementFromPoint(e,n);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,n);if(!i||i===r)break;r=i}for(;r&&r.matches(t);)r=Se(r);return r&&r!==document.documentElement?ie(r):null}var re=e=>parseFloat(e)||0;function Ce(e){let n=getComputedStyle(e),o=(t,r,i,a)=>[re(t),re(r),re(i),re(a)];return{padding:o(n.paddingTop,n.paddingRight,n.paddingBottom,n.paddingLeft),border:o(n.borderTopWidth,n.borderRightWidth,n.borderBottomWidth,n.borderLeftWidth),margin:o(n.marginTop,n.marginRight,n.marginBottom,n.marginLeft)}}function it(e,n){return e.width*e.height>=n.width*n.height?[e,n]:[n,e]}function lt(e,n){let o=n.left+n.width/2,t=n.top+n.height/2;return[{x1:e.left,y1:t,x2:n.left,y2:t,label:f(n.left-e.left),axis:"x"},{x1:n.right,y1:t,x2:e.right,y2:t,label:f(e.right-n.right),axis:"x"},{x1:o,y1:e.top,x2:o,y2:n.top,label:f(n.top-e.top),axis:"y"},{x1:o,y1:n.bottom,x2:o,y2:e.bottom,label:f(e.bottom-n.bottom),axis:"y"}]}function fe(e,n){let o=[],t=e.left<n.right&&n.left<e.right,r=e.top<n.bottom&&n.top<e.bottom;if(t&&r){let[i,a]=it(e,n);return lt(i,a)}if(!t){let[i,a]=e.right<=n.left?[e,n]:[n,e],u=r?(Math.max(e.top,n.top)+Math.min(e.bottom,n.bottom))/2:(e.top+e.height/2+n.top+n.height/2)/2;o.push({x1:i.right,y1:u,x2:a.left,y2:u,label:`${f(a.left-i.right)}`,axis:"x"})}if(!r){let[i,a]=e.bottom<=n.top?[e,n]:[n,e],u=t?(Math.max(e.left,n.left)+Math.min(e.right,n.right))/2:(e.left+e.width/2+n.left+n.width/2)/2;o.push({x1:u,y1:i.bottom,x2:u,y2:a.top,label:`${f(a.top-i.bottom)}`,axis:"y"})}return o}function at(e){if(e.length<2)return[...e];let n=t=>{let r=e.map(t);return Math.max(...r)-Math.min(...r)},o=n(t=>t.left+t.width/2)>=n(t=>t.top+t.height/2);return[...e].sort((t,r)=>o?t.left-r.left:t.top-r.top)}function Te(e){let n=at(e),o=[];for(let t=1;t<n.length;t++)o.push(...fe(n[t-1],n[t]));return o}var st=5,ct=4;function Z(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function ge(e,n,o){let t=null,r=st;for(let i of e){let a=Math.abs(Z(i)-(i.axis==="x"?n:o));a<=r&&(t=i,r=a)}return t}function Le(e,n,o){if(o)return e;let t=e,r=ct;for(let i of n){let a=Math.abs(i-e);a<r&&(t=i,r=a)}return t}function Be(e,n){return e?n==="x"?[e.left,e.right]:[e.top,e.bottom]:[]}function Ae(e,n){let o=[];for(let t of["x","y"]){let r=n.filter(i=>i.axis===t).map(i=>({pos:i.pos,gap:t==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(t==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,u=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:u,y2:i,label:f(r.gap),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,u=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:u,label:f(r.gap),axis:"y"})}}return o}function dt(e){let n=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!n)return{x:1,y:1};let o=n[2].split(",").map(u=>parseFloat(u)),[t,r,i,a]=n[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(t??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function Re(e){let n=1,o=1;for(let t=e;t;t=Se(t)){let r=dt(getComputedStyle(t).transform);n*=r.x,o*=r.y}return{x:n,y:o}}var b=(e,n)=>({light:e,dark:n}),xe={accent:b("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:b("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:b("oklch(1 0 0)","oklch(0.264 0 0)"),fg:b("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:b("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:b("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:b("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:b("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)")},Pe=[b("oklch(1 0 0)","oklch(0.264 0 0)"),b("oklch(0.985 0 0)","oklch(0.293 0 0)"),b("oklch(0.967 0 0)","oklch(0.321 0 0)"),b("oklch(0.937 0 0)","oklch(0.348 0 0)"),b("oklch(0.922 0 0)","oklch(0.375 0 0)")],I={fg:b("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:b("oklch(0.556 0 0)","oklch(0.715 0 0)")};function A(e){return`light-dark(${e.light}, ${e.dark})`}var S=e=>A(Pe[e]??Pe[0]),ut=["0 1px 1px -0.5px","0 3px 3px -1.5px","0 6px 6px -3px","0 12px 12px -6px","0 24px 24px -12px","0 48px 48px -24px","0 96px 96px -48px"];function z(e,n){let o=Math.max(1,Math.min(8,Math.round(e))),t=ut.slice(0,o-1);if(!n){let T="oklch(0 0 0 / 0.06)";return[`0 0 0 1px ${T}`,...t.map(P=>`${P} ${T}`)].join(", ")}let r=[0,0,.01,.02,.02,.04,.04,.06][o-1],i=[.02,.02,.04,.04,.06,.06,.06,.06][o-1],a="oklch(0 0 0 / 0.18)",u=[`inset 0 0 0 1px oklch(1 0 0 / ${i})`];return r&&u.unshift(`inset 0 1px 0 0 oklch(1 0 0 / ${r})`),[...u,...t.map(T=>`${T} ${a}`)].join(", ")}var pt='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',g={title:13,body:12,tag:11,stack:pt},k={regular:400,medium:500,semibold:600},ye="__align_font",ht="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function Ie(){if(document.getElementById(ye))return;let e=document.createElement("link");e.id=ye,e.rel="stylesheet",e.href=ht,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function Ye(){document.getElementById(ye)?.remove()}function Ge(e){let n=[`${k.medium} ${g.body}px Inter`];Promise.all(n.map(o=>document.fonts.load(o))).then(e,e)}function ve(e){let n={};for(let o of Object.keys(xe))n[o]=e?xe[o].dark:xe[o].light;return n}function Ne(){return matchMedia("(prefers-color-scheme: dark)").matches}function le(e,n){return e.replace(/\)$/,` / ${n})`)}var H=16,mt=3,ft=5,gt=4,be=(e,n)=>`
${e} { box-shadow: ${z(n,!1)}; }
@media (prefers-color-scheme: dark) {
  ${e} { box-shadow: ${z(n,!0)}; }
}`,xt=`
.dock {
  /* On .dock, not :host \u2014 the host's inline all:initial outranks a :host rule,
     which would pin color-scheme to normal and resolve light-dark() to its
     light branch on a dark page. */
  color-scheme: light dark;
  position: fixed; left: ${H}px; top: 0; width: 340px;
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none; user-select: none;
  font-family: ${g.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${A(I.fg)};
  --muted: ${A(I.muted)};
  --border: color-mix(in oklab, var(--fg) 12%, transparent);
}
.panel {
  padding: 10px; border-radius: 0;
  font-size: ${g.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${S(0)};

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
${be(".panel",mt)}
${be(".dock[data-dragging] .panel",ft)}

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
  color: ${A(I.fg)};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${g.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${S(1)}; }

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
.region[data-level="1"] { background: ${S(1)}; }
.region[data-level="2"] { background: ${S(2)}; }
.region[data-level="3"] { background: ${S(3)}; }
.content { background: ${S(4)}; }
${be(".region, .content",gt)}

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
`,ee=H,W=-1,te=!1;function De(e){let n=document.createElement("style");n.textContent=xt,e.appendChild(n);let o=document.createElement("div");o.className="dock";let t=document.createElement("div");t.className="panel",o.appendChild(t),e.appendChild(o);let r=(s,v)=>Math.min(Math.max(s,H),Math.max(H,v-H));function i(){let s=o.offsetHeight||300;W<0&&(W=Math.max(H,innerHeight-s-H)),ee=r(ee,innerWidth-o.offsetWidth),W=r(W,innerHeight-s),o.style.transform=`translate(${ee-H}px, ${W}px)`}let a=null;function u(s){s.button===0&&(s.preventDefault(),s.stopPropagation(),a={x:s.clientX,y:s.clientY,dx:ee,dy:W},o.setAttribute("data-dragging",""),s.currentTarget.setPointerCapture(s.pointerId))}function T(s){a&&(ee=a.dx+(s.clientX-a.x),W=a.dy+(s.clientY-a.y),i())}function P(){a=null,o.removeAttribute("data-dragging")}addEventListener("resize",i);let G=null;function N(s){let v=document.createElement("div");return v.className="edge",v.textContent=s===0?"0":f(s),s===0&&v.setAttribute("data-zero",""),v}function V(s,v,J,D){let[l,c,y,O]=J,L=document.createElement("div");L.className="region",L.setAttribute("data-level",String(v));let d=document.createElement("span");d.className="tag",d.textContent=s;let p=document.createElement("div");p.className="row";let w=document.createElement("div");return w.className="fill",w.appendChild(D),p.append(N(O),w,N(c)),L.append(d,N(l),p,N(y)),L}return{show(s){let v=Ce(s.el),[J,D,l,c]=v.border,[y,O,L,d]=v.padding,p=Re(s.el),w=s.width/p.x,ne=s.height/p.y,oe=Math.abs(p.x-1)>.001||Math.abs(p.y-1)>.001,B=document.createElement("header"),pe=document.createElement("span");pe.className="name",pe.textContent=s.label;let he=document.createElement("span");he.className="size",he.textContent=`${f(w)} \xD7 ${f(ne)}`;let j=document.createElement("button");if(j.className="close",j.textContent="\xD7",j.title="close (B brings it back)",j.addEventListener("pointerdown",X=>X.stopPropagation()),j.addEventListener("click",X=>{X.stopPropagation(),te=!0,o.removeAttribute("data-open")}),B.append(pe,he),oe){let X=document.createElement("span");X.className="scale",X.textContent=`\xD7${f(p.x)}`,X.title=`renders at ${f(s.width)} \xD7 ${f(s.height)}`,B.appendChild(X)}B.appendChild(j),B.addEventListener("pointerdown",u),B.addEventListener("pointermove",T),B.addEventListener("pointerup",P),B.addEventListener("pointercancel",P);let me=document.createElement("div");me.className="content",me.textContent=`${f(w-c-D-d-O)} \xD7 ${f(ne-J-l-y-L)}`,t.replaceChildren(B,V("margin",1,v.margin,V("border",2,v.border,V("padding",3,v.padding,me)))),G=s,i(),!te&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},hide(){G=null,o.removeAttribute("data-open")},toggle(){G&&(te=!te,te?o.removeAttribute("data-open"):(i(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",i),o.remove(),n.remove()}}}var yt=[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure what is under the cursor"],["Click","lock an element"],["Right-click","add to, or drop from, the locked set"],["Drag the panel header","move the box model"],["B","hide or bring back the box model"],["R","rulers down the top and left edges"],["Drag from a rule","pull out a guide; drag it back to remove"],["V","vertical guide at the cursor"],["H","horizontal guide at the cursor"],["Alt while placing","ignore snapping"],["Del","remove the guide under the cursor; Shift+Del for all"],["Esc","clear the locks, then close"]],vt=`
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
  color: ${A(I.fg)};
  background: ${S(0)};
  box-shadow: ${z(3,!1)};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
.flag:hover { background: ${S(1)}; }
@media (prefers-color-scheme: dark) {
  .flag { box-shadow: ${z(3,!0)}; }
}
.flag .count { color: ${A(I.muted)}; }
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
  color: ${A(I.fg)};
  background: ${S(0)};
  box-shadow: ${z(4,!1)};
  display: none;
}
@media (prefers-color-scheme: dark) {
  .help { box-shadow: ${z(4,!0)}; }
}
.help[data-open] { display: block; }
.help dl { display: grid; grid-template-columns: auto 1fr; gap: 6px 10px; margin: 0; }
.help dt { justify-self: start; }
.help kbd {
  display: inline-block; padding: 3px 5px;
  font: inherit; font-weight: ${k.medium};
  border: 1px solid color-mix(in oklab, ${A(I.fg)} 14%, transparent);
  background: ${S(2)};
}
.help dd { margin: 0; align-self: center; color: ${A(I.muted)}; }
`;function Xe(e){let n=document.createElement("style");n.textContent=vt,e.appendChild(n);let o=document.createElement("div");o.className="flag";let t=document.createElement("span");t.className="name",t.textContent="Align";let r=document.createElement("span");r.className="count",o.append(t,r);let i=document.createElement("div");i.className="help";let a=document.createElement("dl");for(let[u,T]of yt){let P=document.createElement("dt"),G=document.createElement("kbd");G.textContent=u,P.appendChild(G);let N=document.createElement("dd");N.textContent=T,a.append(P,N)}return i.appendChild(a),o.addEventListener("click",u=>{u.stopPropagation(),i.toggleAttribute("data-open")}),e.append(o,i),{update(u){r.textContent=u>0?`${u} locked`:""},closeHelp(){let u=i.hasAttribute("data-open");return i.removeAttribute("data-open"),u},destroy(){o.remove(),i.remove(),n.remove()}}}var ae=5,ke=4,se=12,h=22,U=10,bt=50,kt=100;function ze(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let n=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",n.appendChild(o);let t=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,guides:[],liveGuide:null},i=ve(Ne()),a=0,u=matchMedia("(prefers-color-scheme: dark)"),T=()=>{i=ve(u.matches),D()};u.addEventListener("change",T),Ge(()=>D());function P(){let l=devicePixelRatio;o.width=Math.round(innerWidth*l),o.height=Math.round(innerHeight*l),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",t.setTransform(l,0,0,l,0,0),t.translate(.5,.5)}function G(l,c){t.strokeStyle=c,t.lineWidth=1,t.setLineDash([]),t.strokeRect(Math.round(l.left),Math.round(l.top),Math.round(l.width),Math.round(l.height))}function N(l){t.strokeStyle=le(i.measure,.7),t.lineWidth=1,t.setLineDash([2,2]),t.beginPath();for(let c of[l.left,l.right])t.moveTo(Math.round(c),0),t.lineTo(Math.round(c),innerHeight);for(let c of[l.top,l.bottom])t.moveTo(0,Math.round(c)),t.lineTo(innerWidth,Math.round(c));t.stroke(),t.setLineDash([])}function V(l){if(t.strokeStyle=i.measure,t.lineWidth=1,t.setLineDash([]),t.beginPath(),t.moveTo(Math.round(l.x1),Math.round(l.y1)),t.lineTo(Math.round(l.x2),Math.round(l.y2)),l.axis==="x")for(let c of[l.x1,l.x2])t.moveTo(Math.round(c),Math.round(l.y1)-ae),t.lineTo(Math.round(c),Math.round(l.y1)+ae);else for(let c of[l.y1,l.y2])t.moveTo(Math.round(l.x1)-ae,Math.round(c)),t.lineTo(Math.round(l.x1)+ae,Math.round(c));t.stroke()}function s(l,c,y,O,L=!1){t.font=`${k.medium} ${g.body}px ${g.stack}`,t.textBaseline="middle";let d=t.measureText(l).width+ke*2,p=g.body+ke*2+2,w=L?c-d/2:c,ne=L?y-p/2:y,oe=Math.min(Math.max(w,se),innerWidth-d-se),B=Math.min(Math.max(ne,se),innerHeight-p-se);t.fillStyle=O,t.beginPath(),t.roundRect(oe,B,d,p,4),t.fill(),t.fillStyle=i.surface,t.fillText(l,oe+ke,B+p/2)}function v(){let l=scrollX,c=scrollY;t.fillStyle=i.rulerBg,t.fillRect(-.5,-.5,innerWidth+1,h),t.fillRect(-.5,-.5,h,innerHeight+1),t.strokeStyle=i.rulerLine,t.lineWidth=1,t.setLineDash([]),t.font=`${k.regular} 9px ${g.stack}`,t.fillStyle=i.muted,t.save(),t.globalAlpha=.16,t.fillStyle=i.accent;for(let d of r.pinned)t.fillRect(d.left,-.5,d.width,h),t.fillRect(-.5,d.top,h,d.height);t.restore(),t.beginPath(),t.moveTo(-.5,h-.5),t.lineTo(innerWidth,h-.5),t.moveTo(h-.5,-.5),t.lineTo(h-.5,innerHeight),t.stroke();let y=d=>d%kt===0?h:d%bt===0?7:4;t.textBaseline="top",t.textAlign="left",t.beginPath();let O=Math.floor(l/U)*U;for(let d=O;d<l+innerWidth;d+=U){let p=Math.round(d-l);if(p<h)continue;let w=y(d);t.moveTo(p,h-w),t.lineTo(p,h),w===h&&(t.fillStyle=i.muted,t.fillText(String(d),p+3,3))}t.stroke(),t.beginPath();let L=Math.floor(c/U)*U;for(let d=L;d<c+innerHeight;d+=U){let p=Math.round(d-c);if(p<h)continue;let w=y(d);t.moveTo(h-w,p),t.lineTo(h,p),w===h&&(t.save(),t.translate(3,p-3),t.rotate(-Math.PI/2),t.fillStyle=i.muted,t.fillText(String(d),0,0),t.restore())}t.stroke(),r.cursor&&(t.strokeStyle=i.accent,t.beginPath(),t.moveTo(Math.round(r.cursor.x),-.5),t.lineTo(Math.round(r.cursor.x),h),t.moveTo(-.5,Math.round(r.cursor.y)),t.lineTo(h,Math.round(r.cursor.y)),t.stroke()),t.fillStyle=i.guide;for(let d of r.guides){let p=Math.round(Z(d));d.axis==="x"?t.fillRect(p-1,-.5,2,h):t.fillRect(-.5,p-1,h,2)}t.fillStyle=i.rulerBg,t.fillRect(-.5,-.5,h,h),t.strokeStyle=i.rulerLine,t.strokeRect(-.5,-.5,h,h)}function J(){a=0,t.save(),t.setTransform(1,0,0,1,0,0),t.clearRect(0,0,o.width,o.height),t.restore();for(let l of r.pinned)G(l,i.accent);r.hover&&(N(r.hover),G(r.hover,r.pinned.length?le(i.accent,.7):i.accent));for(let l of r.guides){let c=r.liveGuide?.id===l.id;t.strokeStyle=c?i.guide:le(i.guide,.65),t.lineWidth=1,t.setLineDash([]),t.beginPath();let y=Math.round(Z(l));l.axis==="x"?(t.moveTo(y,0),t.lineTo(y,innerHeight)):(t.moveTo(0,y),t.lineTo(innerWidth,y)),t.stroke()}for(let l of r.lines)V(l);for(let l of r.lines){let c=(l.x1+l.x2)/2,y=(l.y1+l.y2)/2;l.axis==="x"?s(l.label,c,y-16,i.measure,!0):s(l.label,c+26,y,i.measure,!0)}if(r.hover&&r.cursor){let{width:l,height:c}=r.hover;s(`${f(l)} \xD7 ${f(c)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let l=r.liveGuide,c=Math.round(Z(l));s(`${l.axis} ${f(l.at)}`,l.axis==="x"?c+6:30,l.axis==="x"?30:c+6,i.guide)}r.rulers&&v()}function D(){a||(a=requestAnimationFrame(J))}return P(),{root:n,update(l){Object.assign(r,l),D()},resize(){P(),D()},destroy(){a&&cancelAnimationFrame(a),u.removeEventListener("change",T),e.remove()}}}var M,E=null,Y=null,K=null,x=null,m=[],de=0,ue=!1,C=[],wt=1,R=null,_=null,q=22;function We(e,n){return ue?n<q&&e>=q?"y":e<q&&n>=q?"x":null:null}function _e(e,n,o,t){let r=F(n,o,M),i=e.axis==="x"?n:o,a=Le(i,Be(r,e.axis),t);e.at=a+(e.axis==="x"?scrollX:scrollY)}function je(e,n,o,t){let r={id:wt++,axis:e,at:0};return _e(r,n,o,t),C=[...C,r],r}function Ue(e){C=C.filter(n=>n.id!==e.id),_?.id===e.id&&(_=null),R?.id===e.id&&(R=null)}function Et(e){let n=M.hotkey.toLowerCase().split("+"),o=n[n.length-1];return e.key.toLowerCase()!==o||n.includes("shift")!==e.shiftKey||n.includes("alt")!==e.altKey?!1:(n.includes("mod")||n.includes("ctrl")||n.includes("cmd"))===(e.metaKey||e.ctrlKey)}function $(e){let n=m[m.length-1],o=x&&m.some(r=>r.el===x.el),t=C.map(r=>({axis:r.axis,pos:r.axis==="x"?r.at-scrollX:r.at-scrollY}));E?.update({hover:x,pinned:m,rulers:ue,guides:C,liveGuide:R??_,lines:[...Te(m),...n&&x&&!o?fe(n,x):[],...x&&C.length?Ae(x,t):[]],...e?{cursor:e}:{}}),K?.update(m.length)}var ce=null;function qe(e){if(ce={x:e.clientX,y:e.clientY},R){_e(R,e.clientX,e.clientY,e.altKey),C=[...C],$({x:e.clientX,y:e.clientY});return}_=ge(C,e.clientX,e.clientY),x=F(e.clientX,e.clientY,M),$({x:e.clientX,y:e.clientY})}function Qe(e){R&&((We(e.clientX,e.clientY)||e.clientX<q||e.clientY<q)&&Ue(R),R=null,$({x:e.clientX,y:e.clientY}))}function Ve(e){if(e.button!==0)return;let n=F(e.clientX,e.clientY,M);if(!n)return;let o=We(e.clientX,e.clientY);if(o){Q(e),R=je(o,e.clientX,e.clientY,e.altKey),$({x:e.clientX,y:e.clientY});return}let t=ge(C,e.clientX,e.clientY);if(t){Q(e),R=t,$({x:e.clientX,y:e.clientY});return}Q(e),K?.closeHelp(),m=[n],x=n,Y?.show(n),$({x:e.clientX,y:e.clientY})}function Je(e){let n=F(e.clientX,e.clientY,M);if(!n)return;Q(e),K?.closeHelp();let o=m.findIndex(r=>r.el===n.el);m=o>=0?m.filter((r,i)=>i!==o):[...m,n],x=n;let t=m[m.length-1];t?Y?.show(t):Y?.hide(),$({x:e.clientX,y:e.clientY})}function Ze(e){F(e.clientX,e.clientY,M)&&Q(e)}function et(e){F(e.clientX,e.clientY,M)&&Q(e)}function Q(e){e.preventDefault(),e.stopPropagation()}function He(e,n){return e.left===n.left&&e.top===n.top&&e.width===n.width&&e.height===n.height}var Ke=0,Oe=0;function tt(){de=requestAnimationFrame(tt);let n=m.filter(a=>a.el.isConnected).map(a=>ie(a.el)),o=x&&x.el.isConnected?ie(x.el):null;if(!(scrollX!==Ke||scrollY!==Oe||n.length!==m.length||n.some((a,u)=>!He(a,m[u]))||x===null!=(o===null)||x!==null&&o!==null&&!He(x,o)))return;Ke=scrollX,Oe=scrollY,m=n,x=o;let i=m[m.length-1];i?Y?.show(i):Y?.hide(),$()}function nt(){E?.resize()}function Mt(){E||(Ie(),E=ze(),Y=De(E.root),K=Xe(E.root),K.update(0),addEventListener("mousemove",qe),addEventListener("mousedown",Ve,{capture:!0}),addEventListener("mouseup",Qe,{capture:!0}),addEventListener("click",Ze,{capture:!0}),addEventListener("auxclick",et,{capture:!0}),addEventListener("contextmenu",Je,{capture:!0}),addEventListener("resize",nt),de=requestAnimationFrame(tt),$())}function we(){removeEventListener("mousemove",qe),removeEventListener("mousedown",Ve,{capture:!0}),removeEventListener("mouseup",Qe,{capture:!0}),removeEventListener("click",Ze,{capture:!0}),removeEventListener("auxclick",et,{capture:!0}),removeEventListener("contextmenu",Je,{capture:!0}),removeEventListener("resize",nt),cancelAnimationFrame(de),de=0,K?.destroy(),K=null,Y?.destroy(),Y=null,E?.destroy(),E=null,Ye(),x=null,m=[],R=null,_=null}function Fe(e){if(Et(e))e.preventDefault(),E?we():Mt();else if(E&&ce&&(e.key.toLowerCase()===M.guideKeys.vertical||e.key.toLowerCase()===M.guideKeys.horizontal)){e.preventDefault();let n=e.key.toLowerCase()===M.guideKeys.vertical?"x":"y";je(n,ce.x,ce.y,e.altKey),$()}else if(E&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?C=[]:_&&Ue(_),$();else if(E&&e.key.toLowerCase()===M.rulerKey)e.preventDefault(),ue=!ue,$();else if(E&&e.key.toLowerCase()===M.panelKey)e.preventDefault(),Y?.toggle();else if(e.key==="Escape"&&E){if(K?.closeHelp())return;m.length?(m=[],Y?.hide(),$()):we()}}function Ot(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,M=Me(e),addEventListener("keydown",Fe,{capture:!0});let n=import.meta.hot;n&&n.dispose(()=>{we(),removeEventListener("keydown",Fe,{capture:!0}),delete window.__align})}export{Ot as initAlign};
