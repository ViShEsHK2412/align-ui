var lt={ignore:"",hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function Ce(e={}){return{...lt,...e}}var Se=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function Te(e){return e.ignore?`${Se}, ${e.ignore}`:Se}function m(e){return String(Math.round(e*100)/100)}function at(e){let n=e.tagName.toLowerCase();e.id&&(n+=`#${e.id}`);let o=e.classList[0];return o&&(n+=`.${o}`),n.length>32?n.slice(0,31)+"\u2026":n}function le(e){let n=e.getBoundingClientRect();return{el:e,label:at(e),left:n.left,right:n.right,top:n.top,bottom:n.bottom,width:n.width,height:n.height}}function Le(e){if(e.parentElement)return e.parentElement;let n=e.getRootNode();return n instanceof ShadowRoot?n.host:null}function _(e,n,o){let t=Te(o),r=document.elementFromPoint(e,n);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,n);if(!i||i===r)break;r=i}for(;r&&r.matches(t);)r=Le(r);return r&&r!==document.documentElement?le(r):null}var re=e=>parseFloat(e)||0;function Be(e){let n=getComputedStyle(e),o=(t,r,i,a)=>[re(t),re(r),re(i),re(a)];return{padding:o(n.paddingTop,n.paddingRight,n.paddingBottom,n.paddingLeft),border:o(n.borderTopWidth,n.borderRightWidth,n.borderBottomWidth,n.borderLeftWidth),margin:o(n.marginTop,n.marginRight,n.marginBottom,n.marginLeft)}}function st(e,n){return e.width*e.height>=n.width*n.height?[e,n]:[n,e]}function ct(e,n){let o=n.left+n.width/2,t=n.top+n.height/2;return[{x1:e.left,y1:t,x2:n.left,y2:t,label:m(n.left-e.left),axis:"x"},{x1:n.right,y1:t,x2:e.right,y2:t,label:m(e.right-n.right),axis:"x"},{x1:o,y1:e.top,x2:o,y2:n.top,label:m(n.top-e.top),axis:"y"},{x1:o,y1:n.bottom,x2:o,y2:e.bottom,label:m(e.bottom-n.bottom),axis:"y"}]}function ge(e,n){let o=[],t=e.left<n.right&&n.left<e.right,r=e.top<n.bottom&&n.top<e.bottom;if(t&&r){let[i,a]=st(e,n);return ct(i,a)}if(!t){let[i,a]=e.right<=n.left?[e,n]:[n,e],s=r?(Math.max(e.top,n.top)+Math.min(e.bottom,n.bottom))/2:(e.top+e.height/2+n.top+n.height/2)/2;o.push({x1:i.right,y1:s,x2:a.left,y2:s,label:`${m(a.left-i.right)}`,axis:"x"})}if(!r){let[i,a]=e.bottom<=n.top?[e,n]:[n,e],s=t?(Math.max(e.left,n.left)+Math.min(e.right,n.right))/2:(e.left+e.width/2+n.left+n.width/2)/2;o.push({x1:s,y1:i.bottom,x2:s,y2:a.top,label:`${m(a.top-i.bottom)}`,axis:"y"})}return o}function dt(e){if(e.length<2)return[...e];let n=t=>{let r=e.map(t);return Math.max(...r)-Math.min(...r)},o=n(t=>t.left+t.width/2)>=n(t=>t.top+t.height/2);return[...e].sort((t,r)=>o?t.left-r.left:t.top-r.top)}function Ae(e){let n=dt(e),o=[];for(let t=1;t<n.length;t++)o.push(...ge(n[t-1],n[t]));return o}var ut=5,pt=4;function ee(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function xe(e,n,o){let t=null,r=ut;for(let i of e){let a=Math.abs(ee(i)-(i.axis==="x"?n:o));a<=r&&(t=i,r=a)}return t}function Re(e,n,o){if(o)return e;let t=e,r=pt;for(let i of n){let a=Math.abs(i-e);a<r&&(t=i,r=a)}return t}function Ge(e,n){return e?n==="x"?[e.left,e.right]:[e.top,e.bottom]:[]}function ye(e,n){let o=[];for(let t of["x","y"]){let r=n.filter(i=>i.axis===t).map(i=>({pos:i.pos,gap:t==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(t==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,s=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:s,y2:i,label:m(r.gap),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,s=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:s,label:m(r.gap),axis:"y"})}}return o}function Pe(e,n){let o=[];for(let t of["x","y"]){let r=e.filter(i=>i.axis===t).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],s=r[i],b=s-a;b<.01||(t==="x"?o.push({x1:a,y1:n.y,x2:s,y2:n.y,label:m(b),axis:"x"}):o.push({x1:n.x,y1:a,x2:n.x,y2:s,label:m(b),axis:"y"}))}}return o}function ht(e){let n=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!n)return{x:1,y:1};let o=n[2].split(",").map(s=>parseFloat(s)),[t,r,i,a]=n[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(t??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function Ye(e){let n=1,o=1;for(let t=e;t;t=Le(t)){let r=ht(getComputedStyle(t).transform);n*=r.x,o*=r.y}return{x:n,y:o}}var k=(e,n)=>({light:e,dark:n}),ve={accent:k("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:k("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:k("oklch(1 0 0)","oklch(0.264 0 0)"),fg:k("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:k("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:k("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:k("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:k("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)")},Ie=[k("oklch(1 0 0)","oklch(0.264 0 0)"),k("oklch(0.985 0 0)","oklch(0.293 0 0)"),k("oklch(0.967 0 0)","oklch(0.321 0 0)"),k("oklch(0.937 0 0)","oklch(0.348 0 0)"),k("oklch(0.922 0 0)","oklch(0.375 0 0)")],Y={fg:k("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:k("oklch(0.556 0 0)","oklch(0.715 0 0)")};function R(e){return`light-dark(${e.light}, ${e.dark})`}var L=e=>R(Ie[e]??Ie[0]),mt=["0 1px 1px -0.5px","0 3px 3px -1.5px","0 6px 6px -3px","0 12px 12px -6px","0 24px 24px -12px","0 48px 48px -24px","0 96px 96px -48px"];function K(e,n){let o=Math.max(1,Math.min(8,Math.round(e))),t=mt.slice(0,o-1);if(!n){let b="oklch(0 0 0 / 0.06)";return[`0 0 0 1px ${b}`,...t.map(P=>`${P} ${b}`)].join(", ")}let r=[0,0,.01,.02,.02,.04,.04,.06][o-1],i=[.02,.02,.04,.04,.06,.06,.06,.06][o-1],a="oklch(0 0 0 / 0.18)",s=[`inset 0 0 0 1px oklch(1 0 0 / ${i})`];return r&&s.unshift(`inset 0 1px 0 0 oklch(1 0 0 / ${r})`),[...s,...t.map(b=>`${b} ${a}`)].join(", ")}var ft='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',g={title:13,body:12,tag:11,stack:ft},w={regular:400,medium:500,semibold:600},be="__align_font",gt="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function Xe(){if(document.getElementById(be))return;let e=document.createElement("link");e.id=be,e.rel="stylesheet",e.href=gt,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function Ne(){document.getElementById(be)?.remove()}function De(e){let n=[`${w.medium} ${g.body}px Inter`];Promise.all(n.map(o=>document.fonts.load(o))).then(e,e)}function ke(e){let n={};for(let o of Object.keys(ve))n[o]=e?ve[o].dark:ve[o].light;return n}function He(){return matchMedia("(prefers-color-scheme: dark)").matches}function ae(e,n){return e.replace(/\)$/,` / ${n})`)}var O=16,xt=3,yt=5,vt=4,we=(e,n)=>`
${e} { box-shadow: ${K(n,!1)}; }
@media (prefers-color-scheme: dark) {
  ${e} { box-shadow: ${K(n,!0)}; }
}`,bt=`
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
  background: ${L(0)};

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
${we(".panel",xt)}
${we(".dock[data-dragging] .panel",yt)}

header {
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${g.title}px; font-weight: ${w.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${g.body}px; font-weight: ${w.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${g.tag}px; font-weight: ${w.medium};
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
.close:hover { color: var(--fg); background: ${L(1)}; }

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
.region[data-level="1"] { background: ${L(1)}; }
.region[data-level="2"] { background: ${L(2)}; }
.region[data-level="3"] { background: ${L(3)}; }
.content { background: ${L(4)}; }
${we(".region, .content",vt)}

/* One muted weight for every label: the words already say which band is which,
   so colour would only compete with the numbers. */
.tag {
  position: absolute; top: 10px; left: 10px;
  font-size: ${g.tag}px; font-weight: ${w.medium};
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
`,te=O,j=-1,ne=!1;function ze(e){let n=document.createElement("style");n.textContent=bt,e.appendChild(n);let o=document.createElement("div");o.className="dock";let t=document.createElement("div");t.className="panel",o.appendChild(t),e.appendChild(o);let r=(c,v)=>Math.min(Math.max(c,O),Math.max(O,v-O));function i(){let c=o.offsetHeight||300;j<0&&(j=Math.max(O,innerHeight-c-O)),te=r(te,innerWidth-o.offsetWidth),j=r(j,innerHeight-c),o.style.transform=`translate(${te-O}px, ${j}px)`}let a=null;function s(c){c.button===0&&(c.preventDefault(),c.stopPropagation(),a={x:c.clientX,y:c.clientY,dx:te,dy:j},o.setAttribute("data-dragging",""),c.currentTarget.setPointerCapture(c.pointerId))}function b(c){a&&(te=a.dx+(c.clientX-a.x),j=a.dy+(c.clientY-a.y),i())}function P(){a=null,o.removeAttribute("data-dragging")}addEventListener("resize",i);let N=null;function D(c){let v=document.createElement("div");return v.className="edge",v.textContent=c===0?"0":m(c),c===0&&v.setAttribute("data-zero",""),v}function J(c,v,Z,H){let[l,d,y,W]=Z,B=document.createElement("div");B.className="region",B.setAttribute("data-level",String(v));let u=document.createElement("span");u.className="tag",u.textContent=c;let p=document.createElement("div");p.className="row";let $=document.createElement("div");return $.className="fill",$.appendChild(H),p.append(D(W),$,D(d)),B.append(u,D(l),p,D(y)),B}return{show(c){let v=Be(c.el),[Z,H,l,d]=v.border,[y,W,B,u]=v.padding,p=Ye(c.el),$=c.width/p.x,oe=c.height/p.y,ie=Math.abs(p.x-1)>.001||Math.abs(p.y-1)>.001,A=document.createElement("header"),he=document.createElement("span");he.className="name",he.textContent=c.label;let me=document.createElement("span");me.className="size",me.textContent=`${m($)} \xD7 ${m(oe)}`;let U=document.createElement("button");if(U.className="close",U.textContent="\xD7",U.title="close (B brings it back)",U.addEventListener("pointerdown",z=>z.stopPropagation()),U.addEventListener("click",z=>{z.stopPropagation(),ne=!0,o.removeAttribute("data-open")}),A.append(he,me),ie){let z=document.createElement("span");z.className="scale",z.textContent=`\xD7${m(p.x)}`,z.title=`renders at ${m(c.width)} \xD7 ${m(c.height)}`,A.appendChild(z)}A.appendChild(U),A.addEventListener("pointerdown",s),A.addEventListener("pointermove",b),A.addEventListener("pointerup",P),A.addEventListener("pointercancel",P);let fe=document.createElement("div");fe.className="content",fe.textContent=`${m($-d-H-u-W)} \xD7 ${m(oe-Z-l-y-B)}`,t.replaceChildren(A,J("margin",1,v.margin,J("border",2,v.border,J("padding",3,v.padding,fe)))),N=c,i(),!ne&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},hide(){N=null,o.removeAttribute("data-open")},toggle(){N&&(ne=!ne,ne?o.removeAttribute("data-open"):(i(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",i),o.remove(),n.remove()}}}var kt=[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure what is under the cursor"],["Click","lock an element"],["Right-click","add to, or drop from, the locked set"],["Drag the panel header","move the box model"],["B","hide or bring back the box model"],["R","rulers down the top and left edges"],["Drag from a rule","pull out a guide; drag it back to remove"],["V","vertical guide at the cursor"],["H","horizontal guide at the cursor"],["Hover a guide","distance from it to every locked element"],["Click a guide","keep those distances up; click again to release"],["Alt while placing","ignore snapping"],["Del","remove the guide under the cursor; Shift+Del for all"],["Esc","clear the locks, then close"]],wt=`
.flag {
  position: fixed; top: 16px; right: 16px;
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${g.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${g.tag}px; font-weight: ${w.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${R(Y.fg)};
  background: ${L(0)};
  box-shadow: ${K(3,!1)};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
.flag:hover { background: ${L(1)}; }
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
  background: ${L(0)};
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
  font: inherit; font-weight: ${w.medium};
  border: 1px solid color-mix(in oklab, ${R(Y.fg)} 14%, transparent);
  background: ${L(2)};
}
.help dd { margin: 0; align-self: center; color: ${R(Y.muted)}; }
`;function Ke(e){let n=document.createElement("style");n.textContent=wt,e.appendChild(n);let o=document.createElement("div");o.className="flag";let t=document.createElement("span");t.className="name",t.textContent="Align";let r=document.createElement("span");r.className="count",o.append(t,r);let i=document.createElement("div");i.className="help";let a=document.createElement("dl");for(let[s,b]of kt){let P=document.createElement("dt"),N=document.createElement("kbd");N.textContent=s,P.appendChild(N);let D=document.createElement("dd");D.textContent=b,a.append(P,D)}return i.appendChild(a),o.addEventListener("click",s=>{s.stopPropagation(),i.toggleAttribute("data-open")}),e.append(o,i),{update(s){r.textContent=s>0?`${s} locked`:""},closeHelp(){let s=i.hasAttribute("data-open");return i.removeAttribute("data-open"),s},destroy(){o.remove(),i.remove(),n.remove()}}}var se=5,Ee=4,ce=12,h=22,q=10,Et=50,Mt=100;function Oe(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let n=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",n.appendChild(o);let t=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,guides:[],liveGuide:null},i=ke(He()),a=0,s=matchMedia("(prefers-color-scheme: dark)"),b=()=>{i=ke(s.matches),H()};s.addEventListener("change",b),De(()=>H());function P(){let l=devicePixelRatio;o.width=Math.round(innerWidth*l),o.height=Math.round(innerHeight*l),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",t.setTransform(l,0,0,l,0,0),t.translate(.5,.5)}function N(l,d){t.strokeStyle=d,t.lineWidth=1,t.setLineDash([]),t.strokeRect(Math.round(l.left),Math.round(l.top),Math.round(l.width),Math.round(l.height))}function D(l){t.strokeStyle=ae(i.measure,.7),t.lineWidth=1,t.setLineDash([2,2]),t.beginPath();for(let d of[l.left,l.right])t.moveTo(Math.round(d),0),t.lineTo(Math.round(d),innerHeight);for(let d of[l.top,l.bottom])t.moveTo(0,Math.round(d)),t.lineTo(innerWidth,Math.round(d));t.stroke(),t.setLineDash([])}function J(l){if(t.strokeStyle=i.measure,t.lineWidth=1,t.setLineDash([]),t.beginPath(),t.moveTo(Math.round(l.x1),Math.round(l.y1)),t.lineTo(Math.round(l.x2),Math.round(l.y2)),l.axis==="x")for(let d of[l.x1,l.x2])t.moveTo(Math.round(d),Math.round(l.y1)-se),t.lineTo(Math.round(d),Math.round(l.y1)+se);else for(let d of[l.y1,l.y2])t.moveTo(Math.round(l.x1)-se,Math.round(d)),t.lineTo(Math.round(l.x1)+se,Math.round(d));t.stroke()}function c(l,d,y,W,B=!1){t.font=`${w.medium} ${g.body}px ${g.stack}`,t.textBaseline="middle";let u=t.measureText(l).width+Ee*2,p=g.body+Ee*2+2,$=B?d-u/2:d,oe=B?y-p/2:y,ie=Math.min(Math.max($,ce),innerWidth-u-ce),A=Math.min(Math.max(oe,ce),innerHeight-p-ce);t.fillStyle=W,t.beginPath(),t.roundRect(ie,A,u,p,4),t.fill(),t.fillStyle=i.surface,t.fillText(l,ie+Ee,A+p/2)}function v(){let l=scrollX,d=scrollY;t.fillStyle=i.rulerBg,t.fillRect(-.5,-.5,innerWidth+1,h),t.fillRect(-.5,-.5,h,innerHeight+1),t.strokeStyle=i.rulerLine,t.lineWidth=1,t.setLineDash([]),t.font=`${w.regular} 9px ${g.stack}`,t.fillStyle=i.muted,t.save(),t.globalAlpha=.16,t.fillStyle=i.accent;for(let u of r.pinned)t.fillRect(u.left,-.5,u.width,h),t.fillRect(-.5,u.top,h,u.height);t.restore(),t.beginPath(),t.moveTo(-.5,h-.5),t.lineTo(innerWidth,h-.5),t.moveTo(h-.5,-.5),t.lineTo(h-.5,innerHeight),t.stroke();let y=u=>u%Mt===0?h:u%Et===0?7:4;t.textBaseline="top",t.textAlign="left",t.beginPath();let W=Math.floor(l/q)*q;for(let u=W;u<l+innerWidth;u+=q){let p=Math.round(u-l);if(p<h)continue;let $=y(u);t.moveTo(p,h-$),t.lineTo(p,h),$===h&&(t.fillStyle=i.muted,t.fillText(String(u),p+3,3))}t.stroke(),t.beginPath();let B=Math.floor(d/q)*q;for(let u=B;u<d+innerHeight;u+=q){let p=Math.round(u-d);if(p<h)continue;let $=y(u);t.moveTo(h-$,p),t.lineTo(h,p),$===h&&(t.save(),t.translate(3,p-3),t.rotate(-Math.PI/2),t.fillStyle=i.muted,t.fillText(String(u),0,0),t.restore())}t.stroke(),r.cursor&&(t.strokeStyle=i.accent,t.beginPath(),t.moveTo(Math.round(r.cursor.x),-.5),t.lineTo(Math.round(r.cursor.x),h),t.moveTo(-.5,Math.round(r.cursor.y)),t.lineTo(h,Math.round(r.cursor.y)),t.stroke()),t.fillStyle=i.guide;for(let u of r.guides){let p=Math.round(ee(u));u.axis==="x"?t.fillRect(p-1,-.5,2,h):t.fillRect(-.5,p-1,h,2)}t.fillStyle=i.rulerBg,t.fillRect(-.5,-.5,h,h),t.strokeStyle=i.rulerLine,t.strokeRect(-.5,-.5,h,h)}function Z(){a=0,t.save(),t.setTransform(1,0,0,1,0,0),t.clearRect(0,0,o.width,o.height),t.restore();for(let l of r.pinned)N(l,i.accent);r.hover&&(D(r.hover),N(r.hover,r.pinned.length?ae(i.accent,.7):i.accent));for(let l of r.guides){let d=r.liveGuide?.id===l.id;t.strokeStyle=l.locked||d?i.guide:ae(i.guide,.55),t.lineWidth=1,t.setLineDash(l.locked?[]:[4,4]),t.beginPath();let y=Math.round(ee(l));l.axis==="x"?(t.moveTo(y,0),t.lineTo(y,innerHeight)):(t.moveTo(0,y),t.lineTo(innerWidth,y)),t.stroke()}for(let l of r.lines)J(l);for(let l of r.lines){let d=(l.x1+l.x2)/2,y=(l.y1+l.y2)/2;l.axis==="x"?c(l.label,d,y-16,i.measure,!0):c(l.label,d+26,y,i.measure,!0)}if(r.hover&&r.cursor){let{width:l,height:d}=r.hover;c(`${m(l)} \xD7 ${m(d)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let l=r.liveGuide,d=Math.round(ee(l));c(`${l.axis} ${m(l.at)}`,l.axis==="x"?d+6:30,l.axis==="x"?30:d+6,i.guide)}r.rulers&&v()}function H(){a||(a=requestAnimationFrame(Z))}return P(),{root:n,update(l){Object.assign(r,l),H()},resize(){P(),H()},destroy(){a&&cancelAnimationFrame(a),s.removeEventListener("change",b),e.remove()}}}var C,S=null,X=null,F=null,x=null,f=[],ue=0,pe=!1,M=[],$t=1,E=null,I=null,G=null,St=3,Q=22;function Ue(e,n){return pe?n<Q&&e>=Q?"y":e<Q&&n>=Q?"x":null:null}function qe(e,n,o,t){let r=_(n,o,C),i=e.axis==="x"?n:o,a=Re(i,Ge(r,e.axis),t);e.at=a+(e.axis==="x"?scrollX:scrollY)}function Qe(e,n,o,t){let r={id:$t++,axis:e,at:0,locked:!1};return qe(r,n,o,t),M=[...M,r],r}function Ve(e){M=M.filter(n=>n.id!==e.id),I?.id===e.id&&(I=null),E?.id===e.id&&(E=null)}function Ct(e){let n=C.hotkey.toLowerCase().split("+"),o=n[n.length-1];return e.key.toLowerCase()!==o||n.includes("shift")!==e.shiftKey||n.includes("alt")!==e.altKey?!1:(n.includes("mod")||n.includes("ctrl")||n.includes("cmd"))===(e.metaKey||e.ctrlKey)}function Me(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function T(e){let n=f[f.length-1],o=x&&f.some(a=>a.el===x.el),t=M.map(Me),r=!E&&I?I:null,i=M.filter(a=>a.locked||a.id===r?.id);S?.update({hover:x,pinned:f,rulers:pe,guides:M,liveGuide:E??I,lines:[...Ae(f),...n&&x&&!o&&!r?ge(n,x):[],...i.flatMap(a=>f.flatMap(s=>ye(s,[Me(a)]))),...x&&!r&&M.length?ye(x,t):[],...Pe(i.map(Me),{x:innerWidth/2,y:innerHeight/2})],...e?{cursor:e}:{}}),F?.update(f.length)}var de=null;function Je(e){if(de={x:e.clientX,y:e.clientY},E){G&&Math.hypot(e.clientX-G.x,e.clientY-G.y)>St&&(G=null),G||(qe(E,e.clientX,e.clientY,e.altKey),M=[...M]),T({x:e.clientX,y:e.clientY});return}I=xe(M,e.clientX,e.clientY),x=_(e.clientX,e.clientY,C),T({x:e.clientX,y:e.clientY})}function Ze(e){E&&(G?(E.locked=!E.locked,M=[...M]):(Ue(e.clientX,e.clientY)||e.clientX<Q||e.clientY<Q)&&Ve(E),G=null,E=null,T({x:e.clientX,y:e.clientY}))}function et(e){if(e.button!==0)return;let n=_(e.clientX,e.clientY,C);if(!n)return;let o=Ue(e.clientX,e.clientY);if(o){V(e),G=null,E=Qe(o,e.clientX,e.clientY,e.altKey),T({x:e.clientX,y:e.clientY});return}let t=xe(M,e.clientX,e.clientY);if(t){V(e),E=t,G={x:e.clientX,y:e.clientY},T({x:e.clientX,y:e.clientY});return}V(e),F?.closeHelp(),f=[n],x=n,X?.show(n),T({x:e.clientX,y:e.clientY})}function tt(e){let n=_(e.clientX,e.clientY,C);if(!n)return;V(e),F?.closeHelp();let o=f.findIndex(r=>r.el===n.el);f=o>=0?f.filter((r,i)=>i!==o):[...f,n],x=n;let t=f[f.length-1];t?X?.show(t):X?.hide(),T({x:e.clientX,y:e.clientY})}function nt(e){_(e.clientX,e.clientY,C)&&V(e)}function ot(e){_(e.clientX,e.clientY,C)&&V(e)}function V(e){e.preventDefault(),e.stopPropagation()}function Fe(e,n){return e.left===n.left&&e.top===n.top&&e.width===n.width&&e.height===n.height}var We=0,_e=0;function it(){ue=requestAnimationFrame(it);let n=f.filter(a=>a.el.isConnected).map(a=>le(a.el)),o=x&&x.el.isConnected?le(x.el):null;if(!(scrollX!==We||scrollY!==_e||n.length!==f.length||n.some((a,s)=>!Fe(a,f[s]))||x===null!=(o===null)||x!==null&&o!==null&&!Fe(x,o)))return;We=scrollX,_e=scrollY,f=n,x=o;let i=f[f.length-1];i?X?.show(i):X?.hide(),T()}function rt(){S?.resize()}function Tt(){S||(Xe(),S=Oe(),X=ze(S.root),F=Ke(S.root),F.update(0),addEventListener("mousemove",Je),addEventListener("mousedown",et,{capture:!0}),addEventListener("mouseup",Ze,{capture:!0}),addEventListener("click",nt,{capture:!0}),addEventListener("auxclick",ot,{capture:!0}),addEventListener("contextmenu",tt,{capture:!0}),addEventListener("resize",rt),ue=requestAnimationFrame(it),T())}function $e(){removeEventListener("mousemove",Je),removeEventListener("mousedown",et,{capture:!0}),removeEventListener("mouseup",Ze,{capture:!0}),removeEventListener("click",nt,{capture:!0}),removeEventListener("auxclick",ot,{capture:!0}),removeEventListener("contextmenu",tt,{capture:!0}),removeEventListener("resize",rt),cancelAnimationFrame(ue),ue=0,F?.destroy(),F=null,X?.destroy(),X=null,S?.destroy(),S=null,Ne(),x=null,f=[],E=null,G=null,I=null}function je(e){if(Ct(e))e.preventDefault(),S?$e():Tt();else if(S&&de&&(e.key.toLowerCase()===C.guideKeys.vertical||e.key.toLowerCase()===C.guideKeys.horizontal)){e.preventDefault();let n=e.key.toLowerCase()===C.guideKeys.vertical?"x":"y";Qe(n,de.x,de.y,e.altKey),T()}else if(S&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(M=[],I=null,E=null,G=null):I&&Ve(I),T();else if(S&&e.key.toLowerCase()===C.rulerKey)e.preventDefault(),pe=!pe,T();else if(S&&e.key.toLowerCase()===C.panelKey)e.preventDefault(),X?.toggle();else if(e.key==="Escape"&&S){if(F?.closeHelp())return;f.length?(f=[],X?.hide(),T()):$e()}}function jt(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,C=Ce(e),addEventListener("keydown",je,{capture:!0});let n=import.meta.hot;n&&n.dispose(()=>{$e(),removeEventListener("keydown",je,{capture:!0}),delete window.__align})}export{jt as initAlign};
