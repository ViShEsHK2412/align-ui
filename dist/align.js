var ht={ignore:"",hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function Le(e={}){return{...ht,...e}}var Te=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function Be(e){return e.ignore?`${Te}, ${e.ignore}`:Te}function y(e){return String(Math.round(e*100)/100)}function pt(e){let n=e.tagName.toLowerCase();e.id&&(n+=`#${e.id}`);let o=e.classList[0];return o&&(n+=`.${o}`),n.length>32?n.slice(0,31)+"\u2026":n}function ce(e){let n=e.getBoundingClientRect();return{el:e,label:pt(e),left:n.left,right:n.right,top:n.top,bottom:n.bottom,width:n.width,height:n.height}}function Ae(e){if(e.parentElement)return e.parentElement;let n=e.getRootNode();return n instanceof ShadowRoot?n.host:null}function U(e,n,o){let t=Be(o),i=document.elementFromPoint(e,n);for(;i?.shadowRoot;){let r=i.shadowRoot.elementFromPoint(e,n);if(!r||r===i)break;i=r}for(;i&&i.matches(t);)i=Ae(i);return i&&i!==document.documentElement?ce(i):null}var se=e=>parseFloat(e)||0;function Pe(e){let n=getComputedStyle(e),o=(t,i,r,l)=>[se(t),se(i),se(r),se(l)];return{padding:o(n.paddingTop,n.paddingRight,n.paddingBottom,n.paddingLeft),border:o(n.borderTopWidth,n.borderRightWidth,n.borderBottomWidth,n.borderLeftWidth),margin:o(n.marginTop,n.marginRight,n.marginBottom,n.marginLeft)}}function mt(e,n){return e.width*e.height>=n.width*n.height?[e,n]:[n,e]}function ft(e,n){let o=n.left+n.width/2,t=n.top+n.height/2;return[{x1:e.left,y1:t,x2:n.left,y2:t,label:y(n.left-e.left),axis:"x"},{x1:n.right,y1:t,x2:e.right,y2:t,label:y(e.right-n.right),axis:"x"},{x1:o,y1:e.top,x2:o,y2:n.top,label:y(n.top-e.top),axis:"y"},{x1:o,y1:n.bottom,x2:o,y2:e.bottom,label:y(e.bottom-n.bottom),axis:"y"}]}function be(e,n){let o=[],t=e.left<n.right&&n.left<e.right,i=e.top<n.bottom&&n.top<e.bottom;if(t&&i){let[r,l]=mt(e,n);return ft(r,l)}if(!t){let[r,l]=e.right<=n.left?[e,n]:[n,e],a=i?(Math.max(e.top,n.top)+Math.min(e.bottom,n.bottom))/2:(e.top+e.height/2+n.top+n.height/2)/2;o.push({x1:r.right,y1:a,x2:l.left,y2:a,label:`${y(l.left-r.right)}`,axis:"x"})}if(!i){let[r,l]=e.bottom<=n.top?[e,n]:[n,e],a=t?(Math.max(e.left,n.left)+Math.min(e.right,n.right))/2:(e.left+e.width/2+n.left+n.width/2)/2;o.push({x1:a,y1:r.bottom,x2:a,y2:l.top,label:`${y(l.top-r.bottom)}`,axis:"y"})}return o}function gt(e){if(e.length<2)return[...e];let n=t=>{let i=e.map(t);return Math.max(...i)-Math.min(...i)},o=n(t=>t.left+t.width/2)>=n(t=>t.top+t.height/2);return[...e].sort((t,i)=>o?t.left-i.left:t.top-i.top)}function Re(e){let n=gt(e),o=[];for(let t=1;t<n.length;t++)o.push([n[t-1],n[t]]);return o}var xt=5,yt=4;function oe(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function ve(e,n,o){let t=null,i=xt;for(let r of e){let l=Math.abs(oe(r)-(r.axis==="x"?n:o));l<=i&&(t=r,i=l)}return t}function Ge(e,n,o){if(o)return e;let t=e,i=yt;for(let r of n){let l=Math.abs(r-e);l<i&&(t=r,i=l)}return t}function Ye(e,n){return e?n==="x"?[e.left,e.right]:[e.top,e.bottom]:[]}function ke(e,n){let o=[];for(let t of["x","y"]){let i=n.filter(r=>r.axis===t).map(r=>({pos:r.pos,gap:t==="x"?r.pos<e.left?e.left-r.pos:r.pos>e.right?r.pos-e.right:-1:r.pos<e.top?e.top-r.pos:r.pos>e.bottom?r.pos-e.bottom:-1})).filter(r=>r.gap>=0).sort((r,l)=>r.gap-l.gap)[0];if(i)if(t==="x"){let r=e.top+e.height/2,l=i.pos<e.left?i.pos:e.right,a=i.pos<e.left?e.left:i.pos;o.push({x1:l,y1:r,x2:a,y2:r,label:y(i.gap),axis:"x"})}else{let r=e.left+e.width/2,l=i.pos<e.top?i.pos:e.bottom,a=i.pos<e.top?e.top:i.pos;o.push({x1:r,y1:l,x2:r,y2:a,label:y(i.gap),axis:"y"})}}return o}function Ie(e,n){let o=[];for(let t of["x","y"]){let i=e.filter(r=>r.axis===t).map(r=>r.pos).sort((r,l)=>r-l);for(let r=1;r<i.length;r++){let l=i[r-1],a=i[r],f=a-l;f<.01||(t==="x"?o.push({x1:l,y1:n.y,x2:a,y2:n.y,label:y(f),axis:"x"}):o.push({x1:n.x,y1:l,x2:n.x,y2:a,label:y(f),axis:"y"}))}}return o}var O=3;function bt(e,n){return e.x<n.x+n.w+O&&n.x<e.x+e.w+O&&e.y<n.y+n.h+O&&n.y<e.y+e.h+O}function Ne(e,n,o=12){let t=(l,a)=>Math.min(Math.max(l,o),n.w-a-o),i=(l,a)=>Math.min(Math.max(l,o),n.h-a-o),r=[];for(let l of e){let a={...l,x:t(l.x,l.w),y:i(l.y,l.h)},f=!1;for(let M=0;M<16;M++){let x=r.find(h=>bt(h,a));if(!x)break;let A=a.axis==="x"?a.y:a.x;if(a.axis==="x"?a.y=i(f?x.y+x.h+O:x.y-a.h-O,a.h):a.x=t(f?x.x-a.w-O:x.x+x.w+O,a.w),(a.axis==="x"?a.y:a.x)===A){if(f)break;f=!0}}r.push(a)}return r}function vt(e){let n=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!n)return{x:1,y:1};let o=n[2].split(",").map(a=>parseFloat(a)),[t,i,r,l]=n[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(t??1,i??0)||1,y:Math.hypot(r??0,l??1)||1}}function Xe(e){let n=1,o=1;for(let t=e;t;t=Ae(t)){let i=vt(getComputedStyle(t).transform);n*=i.x,o*=i.y}return{x:n,y:o}}var C=(e,n)=>({light:e,dark:n}),we={accent:C("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:C("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:C("oklch(1 0 0)","oklch(0.264 0 0)"),fg:C("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:C("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:C("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:C("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:C("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)")},De=[C("oklch(1 0 0)","oklch(0.264 0 0)"),C("oklch(0.985 0 0)","oklch(0.293 0 0)"),C("oklch(0.967 0 0)","oklch(0.321 0 0)"),C("oklch(0.937 0 0)","oklch(0.348 0 0)"),C("oklch(0.922 0 0)","oklch(0.375 0 0)")],X={fg:C("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:C("oklch(0.556 0 0)","oklch(0.715 0 0)")};function Y(e){return`light-dark(${e.light}, ${e.dark})`}var G=e=>Y(De[e]??De[0]),kt=["0 1px 1px -0.5px","0 3px 3px -1.5px","0 6px 6px -3px","0 12px 12px -6px","0 24px 24px -12px","0 48px 48px -24px","0 96px 96px -48px"];function W(e,n){let o=Math.max(1,Math.min(8,Math.round(e))),t=kt.slice(0,o-1);if(!n){let f="oklch(0 0 0 / 0.06)";return[`0 0 0 1px ${f}`,...t.map(M=>`${M} ${f}`)].join(", ")}let i=[0,0,.01,.02,.02,.04,.04,.06][o-1],r=[.02,.02,.04,.04,.06,.06,.06,.06][o-1],l="oklch(0 0 0 / 0.18)",a=[`inset 0 0 0 1px oklch(1 0 0 / ${r})`];return i&&a.unshift(`inset 0 1px 0 0 oklch(1 0 0 / ${i})`),[...a,...t.map(f=>`${f} ${l}`)].join(", ")}var wt='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',E={title:13,body:12,tag:11,stack:wt},S={regular:400,medium:500,semibold:600},Ee="__align_font",Et="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function He(){if(document.getElementById(Ee))return;let e=document.createElement("link");e.id=Ee,e.rel="stylesheet",e.href=Et,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function ze(){document.getElementById(Ee)?.remove()}function Fe(e){let n=[`${S.medium} ${E.body}px Inter`];Promise.all(n.map(o=>document.fonts.load(o))).then(e,e)}function $e(e){let n={};for(let o of Object.keys(we))n[o]=e?we[o].dark:we[o].light;return n}function Ke(){return matchMedia("(prefers-color-scheme: dark)").matches}function de(e,n){return e.replace(/\)$/,` / ${n})`)}var _=16,$t=3,Mt=5,St=4,Me=(e,n)=>`
${e} { box-shadow: ${W(n,!1)}; }
@media (prefers-color-scheme: dark) {
  ${e} { box-shadow: ${W(n,!0)}; }
}`,Ct=`
.dock {
  /* On .dock, not :host \u2014 the host's inline all:initial outranks a :host rule,
     which would pin color-scheme to normal and resolve light-dark() to its
     light branch on a dark page. */
  color-scheme: light dark;
  position: fixed; left: ${_}px; top: 0; width: 340px;
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none; user-select: none;
  font-family: ${E.stack};
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
  font-size: ${E.body}px; line-height: 1.4;
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
${Me(".panel",$t)}
${Me(".dock[data-dragging] .panel",Mt)}

header {
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${E.title}px; font-weight: ${S.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${E.body}px; font-weight: ${S.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${E.tag}px; font-weight: ${S.medium};
  margin-left: 4px;
  color: ${Y(X.fg)};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${E.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${G(1)}; }

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
.region[data-level="1"] { background: ${G(1)}; }
.region[data-level="2"] { background: ${G(2)}; }
.region[data-level="3"] { background: ${G(3)}; }
.content { background: ${G(4)}; }
${Me(".region, .content",St)}

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
  font-size: ${E.tag}px; font-weight: ${S.medium};
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
`,ie=_,q=-1,re=!1;function Oe(e){let n=document.createElement("style");n.textContent=Ct,e.appendChild(n);let o=document.createElement("div");o.className="dock";let t=document.createElement("div");t.className="panel",o.appendChild(t),e.appendChild(o);let i=(d,v)=>Math.min(Math.max(d,_),Math.max(_,v-_));function r(){let d=o.offsetHeight||300;q<0&&(q=Math.max(_,innerHeight-d-_)),ie=i(ie,innerWidth-o.offsetWidth),q=i(q,innerHeight-d),o.style.transform=`translate(${ie-_}px, ${q}px)`}let l=null;function a(d){d.button===0&&(d.preventDefault(),d.stopPropagation(),l={x:d.clientX,y:d.clientY,dx:ie,dy:q},o.setAttribute("data-dragging",""),d.currentTarget.setPointerCapture(d.pointerId))}function f(d){l&&(ie=l.dx+(d.clientX-l.x),q=l.dy+(d.clientY-l.y),r())}function M(){l=null,o.removeAttribute("data-dragging")}addEventListener("resize",r);let x=null;function A(d){let v=document.createElement("div");return v.className="edge",v.textContent=d===0?"0":y(d),d===0&&v.setAttribute("data-zero",""),v}function h(d,v,Q,te){let[ne,z,c,s]=Q,p=document.createElement("div");p.className="region",p.setAttribute("data-level",String(v));let k=document.createElement("span");k.className="tag",k.textContent=d;let w=document.createElement("div");w.className="row";let u=document.createElement("div");u.className="fill",u.appendChild(te),w.append(A(s),u,A(z));let g=document.createElement("div");return g.className="head",g.append(k,A(ne)),p.append(g,w,A(c)),p}return{show(d){let v=Pe(d.el),[Q,te,ne,z]=v.border,[c,s,p,k]=v.padding,w=Xe(d.el),u=d.width/w.x,g=d.height/w.y,N=Math.abs(w.x-1)>.001||Math.abs(w.y-1)>.001,F=document.createElement("header"),ge=document.createElement("span");ge.className="name",ge.textContent=d.label;let xe=document.createElement("span");xe.className="size",xe.textContent=`${y(u)} \xD7 ${y(g)}`;let V=document.createElement("button");if(V.className="close",V.textContent="\xD7",V.title="close (B brings it back)",V.addEventListener("pointerdown",K=>K.stopPropagation()),V.addEventListener("click",K=>{K.stopPropagation(),re=!0,o.removeAttribute("data-open")}),F.append(ge,xe),N){let K=document.createElement("span");K.className="scale",K.textContent=`\xD7${y(w.x)}`,K.title=`renders at ${y(d.width)} \xD7 ${y(d.height)}`,F.appendChild(K)}F.appendChild(V),F.addEventListener("pointerdown",a),F.addEventListener("pointermove",f),F.addEventListener("pointerup",M),F.addEventListener("pointercancel",M);let ye=document.createElement("div");ye.className="content",ye.textContent=`${y(u-z-te-k-s)} \xD7 ${y(g-Q-ne-c-p)}`,t.replaceChildren(F,h("margin",1,v.margin,h("border",2,v.border,h("padding",3,v.padding,ye)))),x=d,r(),!re&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},hide(){x=null,o.removeAttribute("data-open")},toggle(){x&&(re=!re,re?o.removeAttribute("data-open"):(r(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",r),o.remove(),n.remove()}}}var Tt=[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure what is under the cursor"],["Click","lock an element"],["Right-click","add to, or drop from, the locked set"],["Drag the panel header","move the box model"],["B","hide or bring back the box model"],["R","rulers down the top and left edges"],["Drag from a rule","pull out a guide; drag it back to remove"],["V","vertical guide at the cursor"],["H","horizontal guide at the cursor"],["Hover a guide","distance from it to every locked element"],["Click a guide","keep those distances up; click again to release"],["Alt while placing","ignore snapping"],["Del","remove the guide under the cursor; Shift+Del for all"],["Esc","clear the locks, then close"]],le=16,We=E.tag+12,_e=8,Lt=`
.flag {
  position: fixed; top: ${le}px; right: ${le}px;
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${E.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${E.tag}px; font-weight: ${S.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${Y(X.fg)};
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
.flag .count { color: ${Y(X.muted)}; }
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: ${le+We+_e}px; right: ${le}px; width: 292px;
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${le*2+We+_e}px); overflow-y: auto;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${E.stack};
  font-synthesis: none;
  font-size: ${E.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${Y(X.fg)};
  background: ${G(0)};
  box-shadow: ${W(4,!1)};
  display: none;
}
@media (prefers-color-scheme: dark) {
  .help { box-shadow: ${W(4,!0)}; }
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
  font: inherit; font-weight: ${S.medium};
  border: 1px solid color-mix(in oklab, ${Y(X.fg)} 14%, transparent);
  background: ${G(2)};
}
.help dd { margin: 0; color: ${Y(X.muted)}; }
`;function je(e){let n=document.createElement("style");n.textContent=Lt,e.appendChild(n);let o=document.createElement("div");o.className="flag";let t=document.createElement("span");t.className="name",t.textContent="Align";let i=document.createElement("span");i.className="count",o.append(t,i);let r=document.createElement("div");r.className="help";let l=document.createElement("dl");for(let[a,f]of Tt){let M=document.createElement("dt"),x=document.createElement("kbd");x.textContent=a,M.appendChild(x);let A=document.createElement("dd");A.textContent=f,l.append(M,A)}return r.appendChild(l),o.addEventListener("click",a=>{a.stopPropagation(),r.toggleAttribute("data-open")}),e.append(o,r),{update(a){i.textContent=a>0?`${a} locked`:""},closeHelp(){let a=r.hasAttribute("data-open");return r.removeAttribute("data-open"),a},destroy(){o.remove(),r.remove(),n.remove()}}}var ue=5,Se=4,ae=12,Ue=.22,m=22,J=10,Bt=50,At=100;function qe(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let n=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",n.appendChild(o);let t=o.getContext("2d"),i={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,guides:[],liveGuide:null},r=$e(Ke()),l=0,a=matchMedia("(prefers-color-scheme: dark)"),f=()=>{r=$e(a.matches),z()};a.addEventListener("change",f),Fe(()=>z());function M(){let c=devicePixelRatio;o.width=Math.round(innerWidth*c),o.height=Math.round(innerHeight*c),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",t.setTransform(c,0,0,c,0,0),t.translate(.5,.5)}function x(c,s){t.strokeStyle=s,t.lineWidth=1,t.setLineDash([]),t.strokeRect(Math.round(c.left),Math.round(c.top),Math.round(c.width),Math.round(c.height))}function A(c){t.strokeStyle=de(r.measure,.7),t.lineWidth=1,t.setLineDash([2,2]),t.beginPath();for(let s of[c.left,c.right])t.moveTo(Math.round(s),0),t.lineTo(Math.round(s),innerHeight);for(let s of[c.top,c.bottom])t.moveTo(0,Math.round(s)),t.lineTo(innerWidth,Math.round(s));t.stroke(),t.setLineDash([])}function h(c){if(t.strokeStyle=r.measure,t.lineWidth=1,t.setLineDash([]),t.beginPath(),t.moveTo(Math.round(c.x1),Math.round(c.y1)),t.lineTo(Math.round(c.x2),Math.round(c.y2)),c.axis==="x")for(let s of[c.x1,c.x2])t.moveTo(Math.round(s),Math.round(c.y1)-ue),t.lineTo(Math.round(s),Math.round(c.y1)+ue);else for(let s of[c.y1,c.y2])t.moveTo(Math.round(c.x1)-ue,Math.round(s)),t.lineTo(Math.round(c.x1)+ue,Math.round(s));t.stroke()}function d(c){return t.font=`${S.medium} ${E.body}px ${E.stack}`,{w:t.measureText(c).width+Se*2,h:E.body+Se*2+2}}function v(c,s,p,k){t.font=`${S.medium} ${E.body}px ${E.stack}`,t.textBaseline="middle";let{w,h:u}=d(c),g=Math.min(Math.max(s,ae),innerWidth-w-ae),N=Math.min(Math.max(p,ae),innerHeight-u-ae);t.fillStyle=k,t.beginPath(),t.roundRect(g,N,w,u,4),t.fill(),t.fillStyle=r.surface,t.fillText(c,g+Se,N+u/2)}function Q(c,s,p,k,w=!1){let{w:u,h:g}=d(c);v(c,w?s-u/2:s,w?p-g/2:p,k)}function te(){let c=scrollX,s=scrollY;t.fillStyle=r.rulerBg,t.fillRect(-.5,-.5,innerWidth+1,m),t.fillRect(-.5,-.5,m,innerHeight+1),t.strokeStyle=r.rulerLine,t.lineWidth=1,t.setLineDash([]),t.font=`${S.regular} 9px ${E.stack}`,t.fillStyle=r.muted,t.save(),t.globalAlpha=.16,t.fillStyle=r.accent;for(let u of i.pinned)t.fillRect(u.left,-.5,u.width,m),t.fillRect(-.5,u.top,m,u.height);t.restore(),t.beginPath(),t.moveTo(-.5,m-.5),t.lineTo(innerWidth,m-.5),t.moveTo(m-.5,-.5),t.lineTo(m-.5,innerHeight),t.stroke();let p=u=>u%At===0?m:u%Bt===0?7:4;t.textBaseline="top",t.textAlign="left",t.beginPath();let k=Math.floor(c/J)*J;for(let u=k;u<c+innerWidth;u+=J){let g=Math.round(u-c);if(g<m)continue;let N=p(u);t.moveTo(g,m-N),t.lineTo(g,m),N===m&&(t.fillStyle=r.muted,t.fillText(String(u),g+3,3))}t.stroke(),t.beginPath();let w=Math.floor(s/J)*J;for(let u=w;u<s+innerHeight;u+=J){let g=Math.round(u-s);if(g<m)continue;let N=p(u);t.moveTo(m-N,g),t.lineTo(m,g),N===m&&(t.save(),t.translate(3,g-3),t.rotate(-Math.PI/2),t.fillStyle=r.muted,t.fillText(String(u),0,0),t.restore())}t.stroke(),i.cursor&&(t.strokeStyle=r.accent,t.beginPath(),t.moveTo(Math.round(i.cursor.x),-.5),t.lineTo(Math.round(i.cursor.x),m),t.moveTo(-.5,Math.round(i.cursor.y)),t.lineTo(m,Math.round(i.cursor.y)),t.stroke()),t.fillStyle=r.guide;for(let u of i.guides){let g=Math.round(oe(u));u.axis==="x"?t.fillRect(g-1,-.5,2,m):t.fillRect(-.5,g-1,m,2)}t.fillStyle=r.rulerBg,t.fillRect(-.5,-.5,m,m),t.strokeStyle=r.rulerLine,t.strokeRect(-.5,-.5,m,m)}function ne(){l=0,t.save(),t.setTransform(1,0,0,1,0,0),t.clearRect(0,0,o.width,o.height),t.restore();for(let s of i.pinned)x(s,r.accent);i.hover&&(A(i.hover),x(i.hover,i.pinned.length?de(r.accent,.7):r.accent));for(let s of i.guides){let p=i.liveGuide?.id===s.id;t.strokeStyle=s.locked||p?r.guide:de(r.guide,.55),t.lineWidth=1,t.setLineDash(s.locked?[]:[4,4]),t.beginPath();let k=Math.round(oe(s));s.axis==="x"?(t.moveTo(k,0),t.lineTo(k,innerHeight)):(t.moveTo(0,k),t.lineTo(innerWidth,k)),t.stroke()}for(let s of i.lines)t.globalAlpha=s.faded?Ue:1,h(s);t.globalAlpha=1;let c=i.lines.map(s=>{let p=(s.x1+s.x2)/2,k=(s.y1+s.y2)/2,{w,h:u}=d(s.label);return s.axis==="x"?{x:p-w/2,y:k-16-u/2,w,h:u,axis:s.axis}:{x:p+26-w/2,y:k-u/2,w,h:u,axis:s.axis}});if(Ne(c,{w:innerWidth,h:innerHeight},ae).forEach((s,p)=>{let k=i.lines[p];t.globalAlpha=k.faded?Ue:1,v(k.label,s.x,s.y,r.measure)}),t.globalAlpha=1,i.hover&&i.cursor){let{width:s,height:p}=i.hover;Q(`${y(s)} \xD7 ${y(p)}`,i.cursor.x+14,i.cursor.y+14,r.accent)}if(i.liveGuide){let s=i.liveGuide,p=Math.round(oe(s));Q(`${s.axis} ${y(s.at)}`,s.axis==="x"?p+6:30,s.axis==="x"?30:p+6,r.guide)}i.rulers&&te()}function z(){l||(l=requestAnimationFrame(ne))}return M(),{root:n,update(c){Object.assign(i,c),z()},resize(){M(),z()},destroy(){l&&cancelAnimationFrame(l),a.removeEventListener("change",f),e.remove()}}}var P,B=null,H=null,j=null,$=null,b=[],me=0,fe=!1,L=[],Pt=1,T=null,D=null,I=null,Rt=3,Z=22;function et(e,n){return fe?n<Z&&e>=Z?"y":e<Z&&n>=Z?"x":null:null}function tt(e,n,o,t){let i=U(n,o,P),r=e.axis==="x"?n:o,l=Ge(r,Ye(i,e.axis),t);e.at=l+(e.axis==="x"?scrollX:scrollY)}function nt(e,n,o,t){let i={id:Pt++,axis:e,at:0,locked:!1};return tt(i,n,o,t),L=[...L,i],i}function ot(e){L=L.filter(n=>n.id!==e.id),D?.id===e.id&&(D=null),T?.id===e.id&&(T=null)}function Gt(e){let n=P.hotkey.toLowerCase().split("+"),o=n[n.length-1];return e.key.toLowerCase()!==o||n.includes("shift")!==e.shiftKey||n.includes("alt")!==e.altKey?!1:(n.includes("mod")||n.includes("ctrl")||n.includes("cmd"))===(e.metaKey||e.ctrlKey)}function he(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function R(e){let n=b[b.length-1],o=$&&b.some(h=>h.el===$.el),t=L.map(he),i=!T&&D?D:null,r=L.filter(h=>h.locked||h.id===i?.id),l=!i&&o?$.el:null,a=i??l,f=i?he(i):null,M=[],x=(h,d)=>{for(let v of h)M.push(a&&!d?{...v,faded:!0}:v)},A=h=>!f||h.axis!==f.axis?!1:(h.axis==="x"?[h.x1,h.x2]:[h.y1,h.y2]).some(v=>Math.abs(v-f.pos)<.5);for(let[h,d]of Re(b))x(be(h,d),h.el===l||d.el===l);n&&$&&!o&&!i&&x(be(n,$),!0);for(let h of r)for(let d of b)x(ke(d,[he(h)]),h.id===i?.id||d.el===l);$&&!o&&!i&&L.length&&x(ke($,t),!0);for(let h of Ie(r.map(he),{x:innerWidth/2,y:innerHeight/2}))x([h],A(h));B?.update({hover:$,pinned:b,rulers:fe,guides:L,liveGuide:T??D,lines:M,...e?{cursor:e}:{}}),j?.update(b.length)}var pe=null;function it(e){if(pe={x:e.clientX,y:e.clientY},T){I&&Math.hypot(e.clientX-I.x,e.clientY-I.y)>Rt&&(I=null),I||(tt(T,e.clientX,e.clientY,e.altKey),L=[...L]),R({x:e.clientX,y:e.clientY});return}D=ve(L,e.clientX,e.clientY),$=U(e.clientX,e.clientY,P),R({x:e.clientX,y:e.clientY})}function rt(e){T&&(I?(T.locked=!T.locked,L=[...L]):(et(e.clientX,e.clientY)||e.clientX<Z||e.clientY<Z)&&ot(T),I=null,T=null,R({x:e.clientX,y:e.clientY}))}function lt(e){if(e.button!==0)return;let n=U(e.clientX,e.clientY,P);if(!n)return;let o=et(e.clientX,e.clientY);if(o){ee(e),I=null,T=nt(o,e.clientX,e.clientY,e.altKey),R({x:e.clientX,y:e.clientY});return}let t=ve(L,e.clientX,e.clientY);if(t){ee(e),T=t,I={x:e.clientX,y:e.clientY},R({x:e.clientX,y:e.clientY});return}ee(e),j?.closeHelp(),b=[n],$=n,H?.show(n),R({x:e.clientX,y:e.clientY})}function at(e){let n=U(e.clientX,e.clientY,P);if(!n)return;ee(e),j?.closeHelp();let o=b.findIndex(i=>i.el===n.el);b=o>=0?b.filter((i,r)=>r!==o):[...b,n],$=n;let t=b[b.length-1];t?H?.show(t):H?.hide(),R({x:e.clientX,y:e.clientY})}function st(e){U(e.clientX,e.clientY,P)&&ee(e)}function ct(e){U(e.clientX,e.clientY,P)&&ee(e)}function ee(e){e.preventDefault(),e.stopPropagation()}function Qe(e,n){return e.left===n.left&&e.top===n.top&&e.width===n.width&&e.height===n.height}var Ve=0,Je=0;function dt(){me=requestAnimationFrame(dt);let n=b.filter(l=>l.el.isConnected).map(l=>ce(l.el)),o=$&&$.el.isConnected?ce($.el):null;if(!(scrollX!==Ve||scrollY!==Je||n.length!==b.length||n.some((l,a)=>!Qe(l,b[a]))||$===null!=(o===null)||$!==null&&o!==null&&!Qe($,o)))return;Ve=scrollX,Je=scrollY,b=n,$=o;let r=b[b.length-1];r?H?.show(r):H?.hide(),R()}function ut(){B?.resize()}function Yt(){B||(He(),B=qe(),H=Oe(B.root),j=je(B.root),j.update(0),addEventListener("mousemove",it),addEventListener("mousedown",lt,{capture:!0}),addEventListener("mouseup",rt,{capture:!0}),addEventListener("click",st,{capture:!0}),addEventListener("auxclick",ct,{capture:!0}),addEventListener("contextmenu",at,{capture:!0}),addEventListener("resize",ut),me=requestAnimationFrame(dt),R())}function Ce(){removeEventListener("mousemove",it),removeEventListener("mousedown",lt,{capture:!0}),removeEventListener("mouseup",rt,{capture:!0}),removeEventListener("click",st,{capture:!0}),removeEventListener("auxclick",ct,{capture:!0}),removeEventListener("contextmenu",at,{capture:!0}),removeEventListener("resize",ut),cancelAnimationFrame(me),me=0,j?.destroy(),j=null,H?.destroy(),H=null,B?.destroy(),B=null,ze(),$=null,b=[],T=null,I=null,D=null}function Ze(e){if(Gt(e))e.preventDefault(),B?Ce():Yt();else if(B&&pe&&(e.key.toLowerCase()===P.guideKeys.vertical||e.key.toLowerCase()===P.guideKeys.horizontal)){e.preventDefault();let n=e.key.toLowerCase()===P.guideKeys.vertical?"x":"y";nt(n,pe.x,pe.y,e.altKey),R()}else if(B&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(L=[],D=null,T=null,I=null):D&&ot(D),R();else if(B&&e.key.toLowerCase()===P.rulerKey)e.preventDefault(),fe=!fe,R();else if(B&&e.key.toLowerCase()===P.panelKey)e.preventDefault(),H?.toggle();else if(e.key==="Escape"&&B){if(j?.closeHelp())return;b.length?(b=[],H?.hide(),R()):Ce()}}function en(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,P=Le(e),addEventListener("keydown",Ze,{capture:!0});let n=import.meta.hot;n&&n.dispose(()=>{Ce(),removeEventListener("keydown",Ze,{capture:!0}),delete window.__align})}export{en as initAlign};
