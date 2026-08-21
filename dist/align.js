var ct={ignore:"",hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function Le(e={}){return{...ct,...e}}var Ce=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function Te(e){return e.ignore?`${Ce}, ${e.ignore}`:Ce}function x(e){return String(Math.round(e*100)/100)}function dt(e){let n=e.tagName.toLowerCase();e.id&&(n+=`#${e.id}`);let o=e.classList[0];return o&&(n+=`.${o}`),n.length>32?n.slice(0,31)+"\u2026":n}function se(e){let n=e.getBoundingClientRect();return{el:e,label:dt(e),left:n.left,right:n.right,top:n.top,bottom:n.bottom,width:n.width,height:n.height}}function Be(e){if(e.parentElement)return e.parentElement;let n=e.getRootNode();return n instanceof ShadowRoot?n.host:null}function U(e,n,o){let t=Te(o),r=document.elementFromPoint(e,n);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,n);if(!i||i===r)break;r=i}for(;r&&r.matches(t);)r=Be(r);return r&&r!==document.documentElement?se(r):null}var ae=e=>parseFloat(e)||0;function Ae(e){let n=getComputedStyle(e),o=(t,r,i,l)=>[ae(t),ae(r),ae(i),ae(l)];return{padding:o(n.paddingTop,n.paddingRight,n.paddingBottom,n.paddingLeft),border:o(n.borderTopWidth,n.borderRightWidth,n.borderBottomWidth,n.borderLeftWidth),margin:o(n.marginTop,n.marginRight,n.marginBottom,n.marginLeft)}}function ut(e,n){return e.width*e.height>=n.width*n.height?[e,n]:[n,e]}function pt(e,n){let o=n.left+n.width/2,t=n.top+n.height/2;return[{x1:e.left,y1:t,x2:n.left,y2:t,label:x(n.left-e.left),axis:"x"},{x1:n.right,y1:t,x2:e.right,y2:t,label:x(e.right-n.right),axis:"x"},{x1:o,y1:e.top,x2:o,y2:n.top,label:x(n.top-e.top),axis:"y"},{x1:o,y1:n.bottom,x2:o,y2:e.bottom,label:x(e.bottom-n.bottom),axis:"y"}]}function ye(e,n){let o=[],t=e.left<n.right&&n.left<e.right,r=e.top<n.bottom&&n.top<e.bottom;if(t&&r){let[i,l]=ut(e,n);return pt(i,l)}if(!t){let[i,l]=e.right<=n.left?[e,n]:[n,e],a=r?(Math.max(e.top,n.top)+Math.min(e.bottom,n.bottom))/2:(e.top+e.height/2+n.top+n.height/2)/2;o.push({x1:i.right,y1:a,x2:l.left,y2:a,label:`${x(l.left-i.right)}`,axis:"x"})}if(!r){let[i,l]=e.bottom<=n.top?[e,n]:[n,e],a=t?(Math.max(e.left,n.left)+Math.min(e.right,n.right))/2:(e.left+e.width/2+n.left+n.width/2)/2;o.push({x1:a,y1:i.bottom,x2:a,y2:l.top,label:`${x(l.top-i.bottom)}`,axis:"y"})}return o}function ht(e){if(e.length<2)return[...e];let n=t=>{let r=e.map(t);return Math.max(...r)-Math.min(...r)},o=n(t=>t.left+t.width/2)>=n(t=>t.top+t.height/2);return[...e].sort((t,r)=>o?t.left-r.left:t.top-r.top)}function Re(e){let n=ht(e),o=[];for(let t=1;t<n.length;t++)o.push([n[t-1],n[t]]);return o}var mt=5,ft=4;function oe(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function be(e,n,o){let t=null,r=mt;for(let i of e){let l=Math.abs(oe(i)-(i.axis==="x"?n:o));l<=r&&(t=i,r=l)}return t}function Pe(e,n,o){if(o)return e;let t=e,r=ft;for(let i of n){let l=Math.abs(i-e);l<r&&(t=i,r=l)}return t}function Ge(e,n){return e?n==="x"?[e.left,e.right]:[e.top,e.bottom]:[]}function ve(e,n){let o=[];for(let t of["x","y"]){let r=n.filter(i=>i.axis===t).map(i=>({pos:i.pos,gap:t==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,l)=>i.gap-l.gap)[0];if(r)if(t==="x"){let i=e.top+e.height/2,l=r.pos<e.left?r.pos:e.right,a=r.pos<e.left?e.left:r.pos;o.push({x1:l,y1:i,x2:a,y2:i,label:x(r.gap),axis:"x"})}else{let i=e.left+e.width/2,l=r.pos<e.top?r.pos:e.bottom,a=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:l,x2:i,y2:a,label:x(r.gap),axis:"y"})}}return o}function Ye(e,n){let o=[];for(let t of["x","y"]){let r=e.filter(i=>i.axis===t).map(i=>i.pos).sort((i,l)=>i-l);for(let i=1;i<r.length;i++){let l=r[i-1],a=r[i],f=a-l;f<.01||(t==="x"?o.push({x1:l,y1:n.y,x2:a,y2:n.y,label:x(f),axis:"x"}):o.push({x1:n.x,y1:l,x2:n.x,y2:a,label:x(f),axis:"y"}))}}return o}var F=3;function gt(e,n){return e.x<n.x+n.w+F&&n.x<e.x+e.w+F&&e.y<n.y+n.h+F&&n.y<e.y+e.h+F}function Ie(e,n,o=12){let t=(l,a)=>Math.min(Math.max(l,o),n.w-a-o),r=(l,a)=>Math.min(Math.max(l,o),n.h-a-o),i=[];for(let l of e){let a={...l,x:t(l.x,l.w),y:r(l.y,l.h)},f=!1;for(let $=0;$<16;$++){let g=i.find(p=>gt(p,a));if(!g)break;let A=a.axis==="x"?a.y:a.x;if(a.axis==="x"?a.y=r(f?g.y+g.h+F:g.y-a.h-F,a.h):a.x=t(f?g.x-a.w-F:g.x+g.w+F,a.w),(a.axis==="x"?a.y:a.x)===A){if(f)break;f=!0}}i.push(a)}return i}function xt(e){let n=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!n)return{x:1,y:1};let o=n[2].split(",").map(a=>parseFloat(a)),[t,r,i,l]=n[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(t??1,r??0)||1,y:Math.hypot(i??0,l??1)||1}}function Xe(e){let n=1,o=1;for(let t=e;t;t=Be(t)){let r=xt(getComputedStyle(t).transform);n*=r.x,o*=r.y}return{x:n,y:o}}var C=(e,n)=>({light:e,dark:n}),ke={accent:C("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:C("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:C("oklch(1 0 0)","oklch(0.264 0 0)"),fg:C("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:C("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:C("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:C("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:C("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)")},De=[C("oklch(1 0 0)","oklch(0.264 0 0)"),C("oklch(0.985 0 0)","oklch(0.293 0 0)"),C("oklch(0.967 0 0)","oklch(0.321 0 0)"),C("oklch(0.937 0 0)","oklch(0.348 0 0)"),C("oklch(0.922 0 0)","oklch(0.375 0 0)")],D={fg:C("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:C("oklch(0.556 0 0)","oklch(0.715 0 0)")};function Y(e){return`light-dark(${e.light}, ${e.dark})`}var G=e=>Y(De[e]??De[0]),yt=["0 1px 1px -0.5px","0 3px 3px -1.5px","0 6px 6px -3px","0 12px 12px -6px","0 24px 24px -12px","0 48px 48px -24px","0 96px 96px -48px"];function W(e,n){let o=Math.max(1,Math.min(8,Math.round(e))),t=yt.slice(0,o-1);if(!n){let f="oklch(0 0 0 / 0.06)";return[`0 0 0 1px ${f}`,...t.map($=>`${$} ${f}`)].join(", ")}let r=[0,0,.01,.02,.02,.04,.04,.06][o-1],i=[.02,.02,.04,.04,.06,.06,.06,.06][o-1],l="oklch(0 0 0 / 0.18)",a=[`inset 0 0 0 1px oklch(1 0 0 / ${i})`];return r&&a.unshift(`inset 0 1px 0 0 oklch(1 0 0 / ${r})`),[...a,...t.map(f=>`${f} ${l}`)].join(", ")}var bt='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',w={title:13,body:12,tag:11,stack:bt},S={regular:400,medium:500,semibold:600},we="__align_font",vt="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function Ne(){if(document.getElementById(we))return;let e=document.createElement("link");e.id=we,e.rel="stylesheet",e.href=vt,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function He(){document.getElementById(we)?.remove()}function ze(e){let n=[`${S.medium} ${w.body}px Inter`];Promise.all(n.map(o=>document.fonts.load(o))).then(e,e)}function Ee(e){let n={};for(let o of Object.keys(ke))n[o]=e?ke[o].dark:ke[o].light;return n}function Ke(){return matchMedia("(prefers-color-scheme: dark)").matches}function ce(e,n){return e.replace(/\)$/,` / ${n})`)}var _=16,kt=3,wt=5,Et=4,Me=(e,n)=>`
${e} { box-shadow: ${W(n,!1)}; }
@media (prefers-color-scheme: dark) {
  ${e} { box-shadow: ${W(n,!0)}; }
}`,Mt=`
.dock {
  /* On .dock, not :host \u2014 the host's inline all:initial outranks a :host rule,
     which would pin color-scheme to normal and resolve light-dark() to its
     light branch on a dark page. */
  color-scheme: light dark;
  position: fixed; left: ${_}px; top: 0; width: 340px;
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none; user-select: none;
  font-family: ${w.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${Y(D.fg)};
  --muted: ${Y(D.muted)};
  --border: color-mix(in oklab, var(--fg) 12%, transparent);
}
.panel {
  padding: 10px; border-radius: 0;
  font-size: ${w.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${G(0)};

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
  font-size: ${w.title}px; font-weight: ${S.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${w.body}px; font-weight: ${S.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${w.tag}px; font-weight: ${S.medium};
  margin-left: 4px;
  color: ${Y(D.fg)};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${w.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${G(1)}; }

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
.region[data-level="1"] { background: ${G(1)}; }
.region[data-level="2"] { background: ${G(2)}; }
.region[data-level="3"] { background: ${G(3)}; }
.content { background: ${G(4)}; }
${Me(".region, .content",Et)}

/* One muted weight for every label: the words already say which band is which,
   so colour would only compete with the numbers. */
.tag {
  position: absolute; top: 10px; left: 10px;
  font-size: ${w.tag}px; font-weight: ${S.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${S.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${S.regular}; }
.row { display: flex; align-items: center; gap: 5px; margin: 6px 0; }
.row > .edge { flex: 0 0 22px; }
.row > .fill { flex: 1 1 auto; min-width: 0; }

.content {
  border-radius: 0; padding: 14px 8px;
  text-align: center; font-weight: ${S.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,re=_,q=-1,ie=!1;function Oe(e){let n=document.createElement("style");n.textContent=Mt,e.appendChild(n);let o=document.createElement("div");o.className="dock";let t=document.createElement("div");t.className="panel",o.appendChild(t),e.appendChild(o);let r=(d,b)=>Math.min(Math.max(d,_),Math.max(_,b-_));function i(){let d=o.offsetHeight||300;q<0&&(q=Math.max(_,innerHeight-d-_)),re=r(re,innerWidth-o.offsetWidth),q=r(q,innerHeight-d),o.style.transform=`translate(${re-_}px, ${q}px)`}let l=null;function a(d){d.button===0&&(d.preventDefault(),d.stopPropagation(),l={x:d.clientX,y:d.clientY,dx:re,dy:q},o.setAttribute("data-dragging",""),d.currentTarget.setPointerCapture(d.pointerId))}function f(d){l&&(re=l.dx+(d.clientX-l.x),q=l.dy+(d.clientY-l.y),i())}function $(){l=null,o.removeAttribute("data-dragging")}addEventListener("resize",i);let g=null;function A(d){let b=document.createElement("div");return b.className="edge",b.textContent=d===0?"0":x(d),d===0&&b.setAttribute("data-zero",""),b}function p(d,b,Q,te){let[ne,z,c,s]=Q,h=document.createElement("div");h.className="region",h.setAttribute("data-level",String(b));let v=document.createElement("span");v.className="tag",v.textContent=d;let k=document.createElement("div");k.className="row";let u=document.createElement("div");return u.className="fill",u.appendChild(te),k.append(A(s),u,A(z)),h.append(v,A(ne),k,A(c)),h}return{show(d){let b=Ae(d.el),[Q,te,ne,z]=b.border,[c,s,h,v]=b.padding,k=Xe(d.el),u=d.width/k.x,E=d.height/k.y,X=Math.abs(k.x-1)>.001||Math.abs(k.y-1)>.001,K=document.createElement("header"),fe=document.createElement("span");fe.className="name",fe.textContent=d.label;let ge=document.createElement("span");ge.className="size",ge.textContent=`${x(u)} \xD7 ${x(E)}`;let V=document.createElement("button");if(V.className="close",V.textContent="\xD7",V.title="close (B brings it back)",V.addEventListener("pointerdown",O=>O.stopPropagation()),V.addEventListener("click",O=>{O.stopPropagation(),ie=!0,o.removeAttribute("data-open")}),K.append(fe,ge),X){let O=document.createElement("span");O.className="scale",O.textContent=`\xD7${x(k.x)}`,O.title=`renders at ${x(d.width)} \xD7 ${x(d.height)}`,K.appendChild(O)}K.appendChild(V),K.addEventListener("pointerdown",a),K.addEventListener("pointermove",f),K.addEventListener("pointerup",$),K.addEventListener("pointercancel",$);let xe=document.createElement("div");xe.className="content",xe.textContent=`${x(u-z-te-v-s)} \xD7 ${x(E-Q-ne-c-h)}`,t.replaceChildren(K,p("margin",1,b.margin,p("border",2,b.border,p("padding",3,b.padding,xe)))),g=d,i(),!ie&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},hide(){g=null,o.removeAttribute("data-open")},toggle(){g&&(ie=!ie,ie?o.removeAttribute("data-open"):(i(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",i),o.remove(),n.remove()}}}var $t=[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure what is under the cursor"],["Click","lock an element"],["Right-click","add to, or drop from, the locked set"],["Drag the panel header","move the box model"],["B","hide or bring back the box model"],["R","rulers down the top and left edges"],["Drag from a rule","pull out a guide; drag it back to remove"],["V","vertical guide at the cursor"],["H","horizontal guide at the cursor"],["Hover a guide","distance from it to every locked element"],["Click a guide","keep those distances up; click again to release"],["Alt while placing","ignore snapping"],["Del","remove the guide under the cursor; Shift+Del for all"],["Esc","clear the locks, then close"]],St=`
.flag {
  position: fixed; top: 16px; right: 16px;
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${w.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${w.tag}px; font-weight: ${S.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${Y(D.fg)};
  background: ${G(0)};
  box-shadow: ${W(3,!1)};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
.flag:hover { background: ${G(1)}; }
@media (prefers-color-scheme: dark) {
  .flag { box-shadow: ${W(3,!0)}; }
}
.flag .count { color: ${Y(D.muted)}; }
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: 46px; right: 16px; width: 292px;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${w.stack};
  font-synthesis: none;
  font-size: ${w.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${Y(D.fg)};
  background: ${G(0)};
  box-shadow: ${W(4,!1)};
  display: none;
}
@media (prefers-color-scheme: dark) {
  .help { box-shadow: ${W(4,!0)}; }
}
.help[data-open] { display: block; }
.help dl { display: grid; grid-template-columns: auto 1fr; gap: 6px 10px; margin: 0; }
.help dt { justify-self: start; }
.help kbd {
  display: inline-block; padding: 3px 5px;
  font: inherit; font-weight: ${S.medium};
  border: 1px solid color-mix(in oklab, ${Y(D.fg)} 14%, transparent);
  background: ${G(2)};
}
.help dd { margin: 0; align-self: center; color: ${Y(D.muted)}; }
`;function Fe(e){let n=document.createElement("style");n.textContent=St,e.appendChild(n);let o=document.createElement("div");o.className="flag";let t=document.createElement("span");t.className="name",t.textContent="Align";let r=document.createElement("span");r.className="count",o.append(t,r);let i=document.createElement("div");i.className="help";let l=document.createElement("dl");for(let[a,f]of $t){let $=document.createElement("dt"),g=document.createElement("kbd");g.textContent=a,$.appendChild(g);let A=document.createElement("dd");A.textContent=f,l.append($,A)}return i.appendChild(l),o.addEventListener("click",a=>{a.stopPropagation(),i.toggleAttribute("data-open")}),e.append(o,i),{update(a){r.textContent=a>0?`${a} locked`:""},closeHelp(){let a=i.hasAttribute("data-open");return i.removeAttribute("data-open"),a},destroy(){o.remove(),i.remove(),n.remove()}}}var de=5,$e=4,le=12,We=.22,m=22,J=10,Ct=50,Lt=100;function _e(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let n=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",n.appendChild(o);let t=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,guides:[],liveGuide:null},i=Ee(Ke()),l=0,a=matchMedia("(prefers-color-scheme: dark)"),f=()=>{i=Ee(a.matches),z()};a.addEventListener("change",f),ze(()=>z());function $(){let c=devicePixelRatio;o.width=Math.round(innerWidth*c),o.height=Math.round(innerHeight*c),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",t.setTransform(c,0,0,c,0,0),t.translate(.5,.5)}function g(c,s){t.strokeStyle=s,t.lineWidth=1,t.setLineDash([]),t.strokeRect(Math.round(c.left),Math.round(c.top),Math.round(c.width),Math.round(c.height))}function A(c){t.strokeStyle=ce(i.measure,.7),t.lineWidth=1,t.setLineDash([2,2]),t.beginPath();for(let s of[c.left,c.right])t.moveTo(Math.round(s),0),t.lineTo(Math.round(s),innerHeight);for(let s of[c.top,c.bottom])t.moveTo(0,Math.round(s)),t.lineTo(innerWidth,Math.round(s));t.stroke(),t.setLineDash([])}function p(c){if(t.strokeStyle=i.measure,t.lineWidth=1,t.setLineDash([]),t.beginPath(),t.moveTo(Math.round(c.x1),Math.round(c.y1)),t.lineTo(Math.round(c.x2),Math.round(c.y2)),c.axis==="x")for(let s of[c.x1,c.x2])t.moveTo(Math.round(s),Math.round(c.y1)-de),t.lineTo(Math.round(s),Math.round(c.y1)+de);else for(let s of[c.y1,c.y2])t.moveTo(Math.round(c.x1)-de,Math.round(s)),t.lineTo(Math.round(c.x1)+de,Math.round(s));t.stroke()}function d(c){return t.font=`${S.medium} ${w.body}px ${w.stack}`,{w:t.measureText(c).width+$e*2,h:w.body+$e*2+2}}function b(c,s,h,v){t.font=`${S.medium} ${w.body}px ${w.stack}`,t.textBaseline="middle";let{w:k,h:u}=d(c),E=Math.min(Math.max(s,le),innerWidth-k-le),X=Math.min(Math.max(h,le),innerHeight-u-le);t.fillStyle=v,t.beginPath(),t.roundRect(E,X,k,u,4),t.fill(),t.fillStyle=i.surface,t.fillText(c,E+$e,X+u/2)}function Q(c,s,h,v,k=!1){let{w:u,h:E}=d(c);b(c,k?s-u/2:s,k?h-E/2:h,v)}function te(){let c=scrollX,s=scrollY;t.fillStyle=i.rulerBg,t.fillRect(-.5,-.5,innerWidth+1,m),t.fillRect(-.5,-.5,m,innerHeight+1),t.strokeStyle=i.rulerLine,t.lineWidth=1,t.setLineDash([]),t.font=`${S.regular} 9px ${w.stack}`,t.fillStyle=i.muted,t.save(),t.globalAlpha=.16,t.fillStyle=i.accent;for(let u of r.pinned)t.fillRect(u.left,-.5,u.width,m),t.fillRect(-.5,u.top,m,u.height);t.restore(),t.beginPath(),t.moveTo(-.5,m-.5),t.lineTo(innerWidth,m-.5),t.moveTo(m-.5,-.5),t.lineTo(m-.5,innerHeight),t.stroke();let h=u=>u%Lt===0?m:u%Ct===0?7:4;t.textBaseline="top",t.textAlign="left",t.beginPath();let v=Math.floor(c/J)*J;for(let u=v;u<c+innerWidth;u+=J){let E=Math.round(u-c);if(E<m)continue;let X=h(u);t.moveTo(E,m-X),t.lineTo(E,m),X===m&&(t.fillStyle=i.muted,t.fillText(String(u),E+3,3))}t.stroke(),t.beginPath();let k=Math.floor(s/J)*J;for(let u=k;u<s+innerHeight;u+=J){let E=Math.round(u-s);if(E<m)continue;let X=h(u);t.moveTo(m-X,E),t.lineTo(m,E),X===m&&(t.save(),t.translate(3,E-3),t.rotate(-Math.PI/2),t.fillStyle=i.muted,t.fillText(String(u),0,0),t.restore())}t.stroke(),r.cursor&&(t.strokeStyle=i.accent,t.beginPath(),t.moveTo(Math.round(r.cursor.x),-.5),t.lineTo(Math.round(r.cursor.x),m),t.moveTo(-.5,Math.round(r.cursor.y)),t.lineTo(m,Math.round(r.cursor.y)),t.stroke()),t.fillStyle=i.guide;for(let u of r.guides){let E=Math.round(oe(u));u.axis==="x"?t.fillRect(E-1,-.5,2,m):t.fillRect(-.5,E-1,m,2)}t.fillStyle=i.rulerBg,t.fillRect(-.5,-.5,m,m),t.strokeStyle=i.rulerLine,t.strokeRect(-.5,-.5,m,m)}function ne(){l=0,t.save(),t.setTransform(1,0,0,1,0,0),t.clearRect(0,0,o.width,o.height),t.restore();for(let s of r.pinned)g(s,i.accent);r.hover&&(A(r.hover),g(r.hover,r.pinned.length?ce(i.accent,.7):i.accent));for(let s of r.guides){let h=r.liveGuide?.id===s.id;t.strokeStyle=s.locked||h?i.guide:ce(i.guide,.55),t.lineWidth=1,t.setLineDash(s.locked?[]:[4,4]),t.beginPath();let v=Math.round(oe(s));s.axis==="x"?(t.moveTo(v,0),t.lineTo(v,innerHeight)):(t.moveTo(0,v),t.lineTo(innerWidth,v)),t.stroke()}for(let s of r.lines)t.globalAlpha=s.faded?We:1,p(s);t.globalAlpha=1;let c=r.lines.map(s=>{let h=(s.x1+s.x2)/2,v=(s.y1+s.y2)/2,{w:k,h:u}=d(s.label);return s.axis==="x"?{x:h-k/2,y:v-16-u/2,w:k,h:u,axis:s.axis}:{x:h+26-k/2,y:v-u/2,w:k,h:u,axis:s.axis}});if(Ie(c,{w:innerWidth,h:innerHeight},le).forEach((s,h)=>{let v=r.lines[h];t.globalAlpha=v.faded?We:1,b(v.label,s.x,s.y,i.measure)}),t.globalAlpha=1,r.hover&&r.cursor){let{width:s,height:h}=r.hover;Q(`${x(s)} \xD7 ${x(h)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let s=r.liveGuide,h=Math.round(oe(s));Q(`${s.axis} ${x(s.at)}`,s.axis==="x"?h+6:30,s.axis==="x"?30:h+6,i.guide)}r.rulers&&te()}function z(){l||(l=requestAnimationFrame(ne))}return $(),{root:n,update(c){Object.assign(r,c),z()},resize(){$(),z()},destroy(){l&&cancelAnimationFrame(l),a.removeEventListener("change",f),e.remove()}}}var R,B=null,H=null,j=null,M=null,y=[],he=0,me=!1,T=[],Tt=1,L=null,N=null,I=null,Bt=3,Z=22;function Ve(e,n){return me?n<Z&&e>=Z?"y":e<Z&&n>=Z?"x":null:null}function Je(e,n,o,t){let r=U(n,o,R),i=e.axis==="x"?n:o,l=Pe(i,Ge(r,e.axis),t);e.at=l+(e.axis==="x"?scrollX:scrollY)}function Ze(e,n,o,t){let r={id:Tt++,axis:e,at:0,locked:!1};return Je(r,n,o,t),T=[...T,r],r}function et(e){T=T.filter(n=>n.id!==e.id),N?.id===e.id&&(N=null),L?.id===e.id&&(L=null)}function At(e){let n=R.hotkey.toLowerCase().split("+"),o=n[n.length-1];return e.key.toLowerCase()!==o||n.includes("shift")!==e.shiftKey||n.includes("alt")!==e.altKey?!1:(n.includes("mod")||n.includes("ctrl")||n.includes("cmd"))===(e.metaKey||e.ctrlKey)}function ue(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function P(e){let n=y[y.length-1],o=M&&y.some(p=>p.el===M.el),t=T.map(ue),r=!L&&N?N:null,i=T.filter(p=>p.locked||p.id===r?.id),l=!r&&o?M.el:null,a=r??l,f=r?ue(r):null,$=[],g=(p,d)=>{for(let b of p)$.push(a&&!d?{...b,faded:!0}:b)},A=p=>!f||p.axis!==f.axis?!1:(p.axis==="x"?[p.x1,p.x2]:[p.y1,p.y2]).some(b=>Math.abs(b-f.pos)<.5);for(let[p,d]of Re(y))g(ye(p,d),p.el===l||d.el===l);n&&M&&!o&&!r&&g(ye(n,M),!0);for(let p of i)for(let d of y)g(ve(d,[ue(p)]),p.id===r?.id||d.el===l);M&&!o&&!r&&T.length&&g(ve(M,t),!0);for(let p of Ye(i.map(ue),{x:innerWidth/2,y:innerHeight/2}))g([p],A(p));B?.update({hover:M,pinned:y,rulers:me,guides:T,liveGuide:L??N,lines:$,...e?{cursor:e}:{}}),j?.update(y.length)}var pe=null;function tt(e){if(pe={x:e.clientX,y:e.clientY},L){I&&Math.hypot(e.clientX-I.x,e.clientY-I.y)>Bt&&(I=null),I||(Je(L,e.clientX,e.clientY,e.altKey),T=[...T]),P({x:e.clientX,y:e.clientY});return}N=be(T,e.clientX,e.clientY),M=U(e.clientX,e.clientY,R),P({x:e.clientX,y:e.clientY})}function nt(e){L&&(I?(L.locked=!L.locked,T=[...T]):(Ve(e.clientX,e.clientY)||e.clientX<Z||e.clientY<Z)&&et(L),I=null,L=null,P({x:e.clientX,y:e.clientY}))}function ot(e){if(e.button!==0)return;let n=U(e.clientX,e.clientY,R);if(!n)return;let o=Ve(e.clientX,e.clientY);if(o){ee(e),I=null,L=Ze(o,e.clientX,e.clientY,e.altKey),P({x:e.clientX,y:e.clientY});return}let t=be(T,e.clientX,e.clientY);if(t){ee(e),L=t,I={x:e.clientX,y:e.clientY},P({x:e.clientX,y:e.clientY});return}ee(e),j?.closeHelp(),y=[n],M=n,H?.show(n),P({x:e.clientX,y:e.clientY})}function rt(e){let n=U(e.clientX,e.clientY,R);if(!n)return;ee(e),j?.closeHelp();let o=y.findIndex(r=>r.el===n.el);y=o>=0?y.filter((r,i)=>i!==o):[...y,n],M=n;let t=y[y.length-1];t?H?.show(t):H?.hide(),P({x:e.clientX,y:e.clientY})}function it(e){U(e.clientX,e.clientY,R)&&ee(e)}function lt(e){U(e.clientX,e.clientY,R)&&ee(e)}function ee(e){e.preventDefault(),e.stopPropagation()}function je(e,n){return e.left===n.left&&e.top===n.top&&e.width===n.width&&e.height===n.height}var Ue=0,qe=0;function at(){he=requestAnimationFrame(at);let n=y.filter(l=>l.el.isConnected).map(l=>se(l.el)),o=M&&M.el.isConnected?se(M.el):null;if(!(scrollX!==Ue||scrollY!==qe||n.length!==y.length||n.some((l,a)=>!je(l,y[a]))||M===null!=(o===null)||M!==null&&o!==null&&!je(M,o)))return;Ue=scrollX,qe=scrollY,y=n,M=o;let i=y[y.length-1];i?H?.show(i):H?.hide(),P()}function st(){B?.resize()}function Rt(){B||(Ne(),B=_e(),H=Oe(B.root),j=Fe(B.root),j.update(0),addEventListener("mousemove",tt),addEventListener("mousedown",ot,{capture:!0}),addEventListener("mouseup",nt,{capture:!0}),addEventListener("click",it,{capture:!0}),addEventListener("auxclick",lt,{capture:!0}),addEventListener("contextmenu",rt,{capture:!0}),addEventListener("resize",st),he=requestAnimationFrame(at),P())}function Se(){removeEventListener("mousemove",tt),removeEventListener("mousedown",ot,{capture:!0}),removeEventListener("mouseup",nt,{capture:!0}),removeEventListener("click",it,{capture:!0}),removeEventListener("auxclick",lt,{capture:!0}),removeEventListener("contextmenu",rt,{capture:!0}),removeEventListener("resize",st),cancelAnimationFrame(he),he=0,j?.destroy(),j=null,H?.destroy(),H=null,B?.destroy(),B=null,He(),M=null,y=[],L=null,I=null,N=null}function Qe(e){if(At(e))e.preventDefault(),B?Se():Rt();else if(B&&pe&&(e.key.toLowerCase()===R.guideKeys.vertical||e.key.toLowerCase()===R.guideKeys.horizontal)){e.preventDefault();let n=e.key.toLowerCase()===R.guideKeys.vertical?"x":"y";Ze(n,pe.x,pe.y,e.altKey),P()}else if(B&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(T=[],N=null,L=null,I=null):N&&et(N),P();else if(B&&e.key.toLowerCase()===R.rulerKey)e.preventDefault(),me=!me,P();else if(B&&e.key.toLowerCase()===R.panelKey)e.preventDefault(),H?.toggle();else if(e.key==="Escape"&&B){if(j?.closeHelp())return;y.length?(y=[],H?.hide(),P()):Se()}}function Vt(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,R=Le(e),addEventListener("keydown",Qe,{capture:!0});let n=import.meta.hot;n&&n.dispose(()=>{Se(),removeEventListener("keydown",Qe,{capture:!0}),delete window.__align})}export{Vt as initAlign};
