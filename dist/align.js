var ht={ignore:"",hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function Le(e={}){return{...ht,...e}}var Te=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function Be(e){return e.ignore?`${Te}, ${e.ignore}`:Te}function b(e){return String(Math.round(e*100)/100)}function pt(e){let n=e.tagName.toLowerCase();e.id&&(n+=`#${e.id}`);let o=e.classList[0];return o&&(n+=`.${o}`),n.length>32?n.slice(0,31)+"\u2026":n}function ce(e){let n=e.getBoundingClientRect();return{el:e,label:pt(e),left:n.left,right:n.right,top:n.top,bottom:n.bottom,width:n.width,height:n.height}}function Ae(e){if(e.parentElement)return e.parentElement;let n=e.getRootNode();return n instanceof ShadowRoot?n.host:null}function j(e,n,o){let t=Be(o),i=document.elementFromPoint(e,n);for(;i?.shadowRoot;){let r=i.shadowRoot.elementFromPoint(e,n);if(!r||r===i)break;i=r}for(;i&&i.matches(t);)i=Ae(i);return i&&i!==document.documentElement?ce(i):null}var se=e=>parseFloat(e)||0;function Pe(e){let n=getComputedStyle(e),o=(t,i,r,l)=>[se(t),se(i),se(r),se(l)];return{padding:o(n.paddingTop,n.paddingRight,n.paddingBottom,n.paddingLeft),border:o(n.borderTopWidth,n.borderRightWidth,n.borderBottomWidth,n.borderLeftWidth),margin:o(n.marginTop,n.marginRight,n.marginBottom,n.marginLeft)}}function mt(e,n){return e.width*e.height>=n.width*n.height?[e,n]:[n,e]}function ft(e,n){let o=n.left+n.width/2,t=n.top+n.height/2;return[{x1:e.left,y1:t,x2:n.left,y2:t,label:b(n.left-e.left),axis:"x"},{x1:n.right,y1:t,x2:e.right,y2:t,label:b(e.right-n.right),axis:"x"},{x1:o,y1:e.top,x2:o,y2:n.top,label:b(n.top-e.top),axis:"y"},{x1:o,y1:n.bottom,x2:o,y2:e.bottom,label:b(e.bottom-n.bottom),axis:"y"}]}function be(e,n){let o=[],t=e.left<n.right&&n.left<e.right,i=e.top<n.bottom&&n.top<e.bottom;if(t&&i){let[r,l]=mt(e,n);return ft(r,l)}if(!t){let[r,l]=e.right<=n.left?[e,n]:[n,e],s=i?(Math.max(e.top,n.top)+Math.min(e.bottom,n.bottom))/2:(e.top+e.height/2+n.top+n.height/2)/2;o.push({x1:r.right,y1:s,x2:l.left,y2:s,label:`${b(l.left-r.right)}`,axis:"x"})}if(!i){let[r,l]=e.bottom<=n.top?[e,n]:[n,e],s=t?(Math.max(e.left,n.left)+Math.min(e.right,n.right))/2:(e.left+e.width/2+n.left+n.width/2)/2;o.push({x1:s,y1:r.bottom,x2:s,y2:l.top,label:`${b(l.top-r.bottom)}`,axis:"y"})}return o}function gt(e){if(e.length<2)return[...e];let n=t=>{let i=e.map(t);return Math.max(...i)-Math.min(...i)},o=n(t=>t.left+t.width/2)>=n(t=>t.top+t.height/2);return[...e].sort((t,i)=>o?t.left-i.left:t.top-i.top)}function Re(e){let n=gt(e),o=[];for(let t=1;t<n.length;t++)o.push([n[t-1],n[t]]);return o}var xt=5,yt=4;function oe(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function ve(e,n,o){let t=null,i=xt;for(let r of e){let l=Math.abs(oe(r)-(r.axis==="x"?n:o));l<=i&&(t=r,i=l)}return t}function Ge(e,n,o){if(o)return e;let t=e,i=yt;for(let r of n){let l=Math.abs(r-e);l<i&&(t=r,i=l)}return t}function Ye(e,n){return e?n==="x"?[e.left,e.right]:[e.top,e.bottom]:[]}function ke(e,n){let o=[];for(let t of["x","y"]){let i=n.filter(r=>r.axis===t).map(r=>({pos:r.pos,gap:t==="x"?r.pos<e.left?e.left-r.pos:r.pos>e.right?r.pos-e.right:-1:r.pos<e.top?e.top-r.pos:r.pos>e.bottom?r.pos-e.bottom:-1})).filter(r=>r.gap>=0).sort((r,l)=>r.gap-l.gap)[0];if(i)if(t==="x"){let r=e.top+e.height/2,l=i.pos<e.left?i.pos:e.right,s=i.pos<e.left?e.left:i.pos;o.push({x1:l,y1:r,x2:s,y2:r,label:b(i.gap),axis:"x"})}else{let r=e.left+e.width/2,l=i.pos<e.top?i.pos:e.bottom,s=i.pos<e.top?e.top:i.pos;o.push({x1:r,y1:l,x2:r,y2:s,label:b(i.gap),axis:"y"})}}return o}function Ie(e,n){let o=[];for(let t of["x","y"]){let i=e.filter(r=>r.axis===t).map(r=>r.pos).sort((r,l)=>r-l);for(let r=1;r<i.length;r++){let l=i[r-1],s=i[r],x=s-l;x<.01||(t==="x"?o.push({x1:l,y1:n.y,x2:s,y2:n.y,label:b(x),axis:"x"}):o.push({x1:n.x,y1:l,x2:n.x,y2:s,label:b(x),axis:"y"}))}}return o}var K=3;function bt(e,n){return e.x<n.x+n.w+K&&n.x<e.x+e.w+K&&e.y<n.y+n.h+K&&n.y<e.y+e.h+K}function Ne(e,n,o=12){let t=(l,s)=>Math.min(Math.max(l,o),n.w-s-o),i=(l,s)=>Math.min(Math.max(l,o),n.h-s-o),r=[];for(let l of e){let s={...l,x:t(l.x,l.w),y:i(l.y,l.h)},x=!1;for(let S=0;S<16;S++){let m=r.find(h=>bt(h,s));if(!m)break;let A=s.axis==="x"?s.y:s.x;if(s.axis==="x"?s.y=i(x?m.y+m.h+K:m.y-s.h-K,s.h):s.x=t(x?m.x-s.w-K:m.x+m.w+K,s.w),(s.axis==="x"?s.y:s.x)===A){if(x)break;x=!0}}r.push(s)}return r}function vt(e){let n=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!n)return{x:1,y:1};let o=n[2].split(",").map(s=>parseFloat(s)),[t,i,r,l]=n[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(t??1,i??0)||1,y:Math.hypot(r??0,l??1)||1}}function Xe(e){let n=1,o=1;for(let t=e;t;t=Ae(t)){let i=vt(getComputedStyle(t).transform);n*=i.x,o*=i.y}return{x:n,y:o}}var T=(e,n)=>({light:e,dark:n}),we={accent:T("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:T("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:T("oklch(1 0 0)","oklch(0.264 0 0)"),fg:T("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:T("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:T("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:T("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:T("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)")},De=[T("oklch(1 0 0)","oklch(0.264 0 0)"),T("oklch(0.985 0 0)","oklch(0.293 0 0)"),T("oklch(0.967 0 0)","oklch(0.321 0 0)"),T("oklch(0.937 0 0)","oklch(0.348 0 0)"),T("oklch(0.922 0 0)","oklch(0.375 0 0)")],X={fg:T("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:T("oklch(0.556 0 0)","oklch(0.715 0 0)")};function I(e){return`light-dark(${e.light}, ${e.dark})`}var Y=e=>I(De[e]??De[0]),kt=["0 1px 1px -0.5px","0 3px 3px -1.5px","0 6px 6px -3px","0 12px 12px -6px","0 24px 24px -12px","0 48px 48px -24px","0 96px 96px -48px"];function O(e,n){let o=Math.max(1,Math.min(8,Math.round(e))),t=kt.slice(0,o-1);if(!n){let x="oklch(0 0 0 / 0.06)";return[`0 0 0 1px ${x}`,...t.map(S=>`${S} ${x}`)].join(", ")}let i=[0,0,.01,.02,.02,.04,.04,.06][o-1],r=[.02,.02,.04,.04,.06,.06,.06,.06][o-1],l="oklch(0 0 0 / 0.18)",s=[`inset 0 0 0 1px oklch(1 0 0 / ${r})`];return i&&s.unshift(`inset 0 1px 0 0 oklch(1 0 0 / ${i})`),[...s,...t.map(x=>`${x} ${l}`)].join(", ")}var wt='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',k={title:13,body:12,tag:11,stack:wt},C={regular:400,medium:500,semibold:600},Ee="__align_font",Et="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function He(){if(document.getElementById(Ee))return;let e=document.createElement("link");e.id=Ee,e.rel="stylesheet",e.href=Et,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function ze(){document.getElementById(Ee)?.remove()}function Fe(e){let n=[`${C.medium} ${k.body}px Inter`];Promise.all(n.map(o=>document.fonts.load(o))).then(e,e)}function Me(e){let n={};for(let o of Object.keys(we))n[o]=e?we[o].dark:we[o].light;return n}function Ke(){return matchMedia("(prefers-color-scheme: dark)").matches}function de(e,n){return e.replace(/\)$/,` / ${n})`)}var W=16,Mt=3,$t=5,St=4,$e=(e,n)=>`
${e} { box-shadow: ${O(n,!1)}; }
@media (prefers-color-scheme: dark) {
  ${e} { box-shadow: ${O(n,!0)}; }
}`,Ct=`
.dock {
  /* On .dock, not :host \u2014 the host's inline all:initial outranks a :host rule,
     which would pin color-scheme to normal and resolve light-dark() to its
     light branch on a dark page. */
  color-scheme: light dark;
  position: fixed; left: ${W}px; top: 0; width: 340px;
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none; user-select: none;
  font-family: ${k.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${I(X.fg)};
  --muted: ${I(X.muted)};
  --border: color-mix(in oklab, var(--fg) 12%, transparent);
}
.panel {
  padding: 10px; border-radius: 0;
  font-size: ${k.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${Y(0)};

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
${$e(".panel",Mt)}
${$e(".dock[data-dragging] .panel",$t)}

header {
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${k.title}px; font-weight: ${C.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${k.body}px; font-weight: ${C.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${k.tag}px; font-weight: ${C.medium};
  margin-left: 4px;
  color: ${I(X.fg)};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${k.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${Y(1)}; }

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
.region[data-level="1"] { background: ${Y(1)}; }
.region[data-level="2"] { background: ${Y(2)}; }
.region[data-level="3"] { background: ${Y(3)}; }
.content { background: ${Y(4)}; }
${$e(".region, .content",St)}

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
  font-size: ${k.tag}px; font-weight: ${C.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${C.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${C.regular}; }
.row { display: flex; align-items: center; gap: 5px; margin: 6px 0; }
.row > .edge { flex: 0 0 22px; }
.row > .fill { flex: 1 1 auto; min-width: 0; }

.content {
  border-radius: 0; padding: 14px 8px;
  text-align: center; font-weight: ${C.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,ie=W,U=-1,re=!1;function Oe(e){let n=document.createElement("style");n.textContent=Ct,e.appendChild(n);let o=document.createElement("div");o.className="dock";let t=document.createElement("div");t.className="panel",o.appendChild(t),e.appendChild(o);let i=(d,y)=>Math.min(Math.max(d,W),Math.max(W,y-W));function r(){let d=o.offsetHeight||300;U<0&&(U=Math.max(W,innerHeight-d-W)),ie=i(ie,innerWidth-o.offsetWidth),U=i(U,innerHeight-d),o.style.transform=`translate(${ie-W}px, ${U}px)`}let l=null;function s(d){d.button===0&&(d.preventDefault(),d.stopPropagation(),l={x:d.clientX,y:d.clientY,dx:ie,dy:U},o.setAttribute("data-dragging",""),d.currentTarget.setPointerCapture(d.pointerId))}function x(d){l&&(ie=l.dx+(d.clientX-l.x),U=l.dy+(d.clientY-l.y),r())}function S(){l=null,o.removeAttribute("data-dragging")}addEventListener("resize",r);let m=null;function A(d){let y=document.createElement("div");return y.className="edge",y.textContent=d===0?"0":b(d),d===0&&y.setAttribute("data-zero",""),y}function h(d,y,q,Q){let[te,ne,z,c]=q,a=document.createElement("div");a.className="region",a.setAttribute("data-level",String(y));let f=document.createElement("span");f.className="tag",f.textContent=d;let p=document.createElement("div");p.className="row";let w=document.createElement("div");w.className="fill",w.appendChild(Q),p.append(A(c),w,A(ne));let u=document.createElement("div");return u.className="head",u.append(f,A(te)),a.append(u,p,A(z)),a}return{show(d){let y=Pe(d.el),[q,Q,te,ne]=y.border,[z,c,a,f]=y.padding,p=Xe(d.el),w=d.width/p.x,u=d.height/p.y,E=Math.abs(p.x-1)>.001||Math.abs(p.y-1)>.001,$=document.createElement("header"),ge=document.createElement("span");ge.className="name",ge.textContent=d.label;let xe=document.createElement("span");xe.className="size",xe.textContent=`${b(w)} \xD7 ${b(u)}`;let V=document.createElement("button");if(V.className="close",V.textContent="\xD7",V.title="close (B brings it back)",V.addEventListener("pointerdown",F=>F.stopPropagation()),V.addEventListener("click",F=>{F.stopPropagation(),re=!0,o.removeAttribute("data-open")}),$.append(ge,xe),E){let F=document.createElement("span");F.className="scale",F.textContent=`\xD7${b(p.x)}`,F.title=`renders at ${b(d.width)} \xD7 ${b(d.height)}`,$.appendChild(F)}$.appendChild(V),$.addEventListener("pointerdown",s),$.addEventListener("pointermove",x),$.addEventListener("pointerup",S),$.addEventListener("pointercancel",S);let ye=document.createElement("div");ye.className="content",ye.textContent=`${b(w-ne-Q-f-c)} \xD7 ${b(u-q-te-z-a)}`,t.replaceChildren($,h("margin",1,y.margin,h("border",2,y.border,h("padding",3,y.padding,ye)))),m=d,r(),!re&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},hide(){m=null,o.removeAttribute("data-open")},toggle(){m&&(re=!re,re?o.removeAttribute("data-open"):(r(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",r),o.remove(),n.remove()}}}var Tt=[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure what is under the cursor"],["Click","lock an element"],["Right-click","add to, or drop from, the locked set"],["Drag the panel header","move the box model"],["B","hide or bring back the box model"],["R","rulers down the top and left edges"],["Drag from a rule","pull out a guide; drag it back to remove"],["V","vertical guide at the cursor"],["H","horizontal guide at the cursor"],["Hover a guide","distance from it to every locked element"],["Click a guide","keep those distances up; click again to release"],["Alt while placing","ignore snapping"],["Del","remove the guide under the cursor; Shift+Del for all"],["Esc","clear the locks, then close"]],le=16,We=k.tag+12,_e=8,Lt=`
.flag {
  position: fixed; top: ${le}px; right: ${le}px;
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${k.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${k.tag}px; font-weight: ${C.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${I(X.fg)};
  background: ${Y(0)};
  box-shadow: ${O(3,!1)};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
.flag:hover { background: ${Y(1)}; }
@media (prefers-color-scheme: dark) {
  .flag { box-shadow: ${O(3,!0)}; }
}
.flag .count { color: ${I(X.muted)}; }
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
  font-family: ${k.stack};
  font-synthesis: none;
  font-size: ${k.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${I(X.fg)};
  background: ${Y(0)};
  box-shadow: ${O(4,!1)};
  display: none;
}
@media (prefers-color-scheme: dark) {
  .help { box-shadow: ${O(4,!0)}; }
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
  font: inherit; font-weight: ${C.medium};
  border: 1px solid color-mix(in oklab, ${I(X.fg)} 14%, transparent);
  background: ${Y(2)};
}
.help dd { margin: 0; color: ${I(X.muted)}; }
`;function je(e){let n=document.createElement("style");n.textContent=Lt,e.appendChild(n);let o=document.createElement("div");o.className="flag";let t=document.createElement("span");t.className="name",t.textContent="Align";let i=document.createElement("span");i.className="count",o.append(t,i);let r=document.createElement("div");r.className="help";let l=document.createElement("dl");for(let[s,x]of Tt){let S=document.createElement("dt"),m=document.createElement("kbd");m.textContent=s,S.appendChild(m);let A=document.createElement("dd");A.textContent=x,l.append(S,A)}return r.appendChild(l),o.addEventListener("click",s=>{s.stopPropagation(),r.toggleAttribute("data-open")}),e.append(o,r),{update(s){i.textContent=s>0?`${s} locked`:""},closeHelp(){let s=r.hasAttribute("data-open");return r.removeAttribute("data-open"),s},destroy(){o.remove(),r.remove(),n.remove()}}}var ue=5,Se=4,ae=12,Ue=.22,g=22,J=10,Bt=50,At=100;function qe(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let n=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",n.appendChild(o);let t=o.getContext("2d"),i={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,guides:[],liveGuide:null},r=Me(Ke()),l=0,s=matchMedia("(prefers-color-scheme: dark)"),x=()=>{r=Me(s.matches),z()};s.addEventListener("change",x),Fe(()=>z());function S(){let c=devicePixelRatio;o.width=Math.round(innerWidth*c),o.height=Math.round(innerHeight*c),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",t.setTransform(c,0,0,c,0,0),t.translate(.5,.5)}let m=c=>Math.round(c)-.5;function A(c,a){t.strokeStyle=a,t.lineWidth=1,t.setLineDash([]),t.strokeRect(Math.round(c.left),Math.round(c.top),Math.round(c.width),Math.round(c.height))}function h(c){t.strokeStyle=de(r.measure,.7),t.lineWidth=1,t.setLineDash([2,2]),t.beginPath();for(let a of[c.left,c.right])t.moveTo(Math.round(a),0),t.lineTo(Math.round(a),innerHeight);for(let a of[c.top,c.bottom])t.moveTo(0,Math.round(a)),t.lineTo(innerWidth,Math.round(a));t.stroke(),t.setLineDash([])}function d(c){if(t.strokeStyle=r.measure,t.lineWidth=1,t.setLineDash([]),t.beginPath(),t.moveTo(Math.round(c.x1),Math.round(c.y1)),t.lineTo(Math.round(c.x2),Math.round(c.y2)),c.axis==="x")for(let a of[c.x1,c.x2])t.moveTo(Math.round(a),Math.round(c.y1)-ue),t.lineTo(Math.round(a),Math.round(c.y1)+ue);else for(let a of[c.y1,c.y2])t.moveTo(Math.round(c.x1)-ue,Math.round(a)),t.lineTo(Math.round(c.x1)+ue,Math.round(a));t.stroke()}function y(c){return t.font=`${C.medium} ${k.body}px ${k.stack}`,{w:t.measureText(c).width+Se*2,h:k.body+Se*2+2}}function q(c,a,f,p){t.font=`${C.medium} ${k.body}px ${k.stack}`,t.textBaseline="middle";let{w,h:u}=y(c),E=m(Math.min(Math.max(a,ae),innerWidth-w-ae)),$=m(Math.min(Math.max(f,ae),innerHeight-u-ae));t.fillStyle=p,t.beginPath(),t.roundRect(E,$,Math.ceil(w),u,4),t.fill(),t.fillStyle=r.surface,t.fillText(c,E+Se,$+u/2)}function Q(c,a,f,p,w=!1){let{w:u,h:E}=y(c);q(c,w?a-u/2:a,w?f-E/2:f,p)}function te(){let c=scrollX,a=scrollY;t.fillStyle=r.rulerBg,t.fillRect(-.5,-.5,innerWidth+1,g),t.fillRect(-.5,-.5,g,innerHeight+1),t.strokeStyle=r.rulerLine,t.lineWidth=1,t.setLineDash([]),t.font=`${C.regular} 9px ${k.stack}`,t.fillStyle=r.muted,t.save(),t.globalAlpha=.16,t.fillStyle=r.accent;for(let u of i.pinned)t.fillRect(m(u.left),-.5,Math.round(u.width),g),t.fillRect(-.5,m(u.top),g,Math.round(u.height));t.restore(),t.beginPath(),t.moveTo(-.5,g-.5),t.lineTo(innerWidth,g-.5),t.moveTo(g-.5,-.5),t.lineTo(g-.5,innerHeight),t.stroke();let f=u=>u%At===0?g:u%Bt===0?7:4;t.textBaseline="top",t.textAlign="left",t.beginPath();let p=Math.floor(c/J)*J;for(let u=p;u<c+innerWidth;u+=J){let E=Math.round(u-c);if(E<g)continue;let $=f(u);t.moveTo(E,g-$),t.lineTo(E,g),$===g&&(t.fillStyle=r.muted,t.fillText(String(u),E+3,3))}t.stroke(),t.beginPath();let w=Math.floor(a/J)*J;for(let u=w;u<a+innerHeight;u+=J){let E=Math.round(u-a);if(E<g)continue;let $=f(u);t.moveTo(g-$,E),t.lineTo(g,E),$===g&&(t.save(),t.translate(3,E-3),t.rotate(-Math.PI/2),t.fillStyle=r.muted,t.fillText(String(u),0,0),t.restore())}t.stroke(),i.cursor&&(t.strokeStyle=r.accent,t.beginPath(),t.moveTo(Math.round(i.cursor.x),-.5),t.lineTo(Math.round(i.cursor.x),g),t.moveTo(-.5,Math.round(i.cursor.y)),t.lineTo(g,Math.round(i.cursor.y)),t.stroke()),t.fillStyle=r.guide;for(let u of i.guides){let E=Math.round(oe(u));u.axis==="x"?t.fillRect(E-1,-.5,2,g):t.fillRect(-.5,E-1,g,2)}t.fillStyle=r.rulerBg,t.fillRect(-.5,-.5,g,g),t.strokeStyle=r.rulerLine,t.strokeRect(-.5,-.5,g,g)}function ne(){l=0,t.save(),t.setTransform(1,0,0,1,0,0),t.clearRect(0,0,o.width,o.height),t.restore();for(let a of i.pinned)A(a,r.accent);i.hover&&(h(i.hover),A(i.hover,i.pinned.length?de(r.accent,.7):r.accent));for(let a of i.guides){let f=i.liveGuide?.id===a.id;t.strokeStyle=a.locked||f?r.guide:de(r.guide,.55),t.lineWidth=1,t.setLineDash(a.locked?[]:[4,4]),t.beginPath();let p=Math.round(oe(a));a.axis==="x"?(t.moveTo(p,0),t.lineTo(p,innerHeight)):(t.moveTo(0,p),t.lineTo(innerWidth,p)),t.stroke()}for(let a of i.lines)t.globalAlpha=a.faded?Ue:1,d(a);t.globalAlpha=1;let c=i.lines.map(a=>{let f=(a.x1+a.x2)/2,p=(a.y1+a.y2)/2,{w,h:u}=y(a.label);return a.axis==="x"?{x:f-w/2,y:p-16-u/2,w,h:u,axis:a.axis}:{x:f+26-w/2,y:p-u/2,w,h:u,axis:a.axis}});if(Ne(c,{w:innerWidth,h:innerHeight},ae).forEach((a,f)=>{let p=i.lines[f];t.globalAlpha=p.faded?Ue:1,q(p.label,a.x,a.y,r.measure)}),t.globalAlpha=1,i.hover&&i.cursor){let{width:a,height:f}=i.hover;Q(`${b(a)} \xD7 ${b(f)}`,i.cursor.x+14,i.cursor.y+14,r.accent)}if(i.liveGuide){let a=i.liveGuide,f=Math.round(oe(a));Q(`${a.axis} ${b(a.at)}`,a.axis==="x"?f+6:30,a.axis==="x"?30:f+6,r.guide)}i.rulers&&te()}function z(){l||(l=requestAnimationFrame(ne))}return S(),{root:n,update(c){Object.assign(i,c),z()},resize(){S(),z()},destroy(){l&&cancelAnimationFrame(l),s.removeEventListener("change",x),e.remove()}}}var R,P=null,H=null,_=null,M=null,v=[],me=0,fe=!1,B=[],Pt=1,L=null,D=null,N=null,Rt=3,Z=22;function et(e,n){return fe?n<Z&&e>=Z?"y":e<Z&&n>=Z?"x":null:null}function tt(e,n,o,t){let i=j(n,o,R),r=e.axis==="x"?n:o,l=Ge(r,Ye(i,e.axis),t);e.at=l+(e.axis==="x"?scrollX:scrollY)}function nt(e,n,o,t){let i={id:Pt++,axis:e,at:0,locked:!1};return tt(i,n,o,t),B=[...B,i],i}function ot(e){B=B.filter(n=>n.id!==e.id),D?.id===e.id&&(D=null),L?.id===e.id&&(L=null)}function Gt(e){let n=R.hotkey.toLowerCase().split("+"),o=n[n.length-1];return e.key.toLowerCase()!==o||n.includes("shift")!==e.shiftKey||n.includes("alt")!==e.altKey?!1:(n.includes("mod")||n.includes("ctrl")||n.includes("cmd"))===(e.metaKey||e.ctrlKey)}function he(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function G(e){let n=v[v.length-1],o=M&&v.some(h=>h.el===M.el),t=B.map(he),i=!L&&D?D:null,r=B.filter(h=>h.locked||h.id===i?.id),l=!i&&o?M.el:null,s=i??l,x=i?he(i):null,S=[],m=(h,d)=>{for(let y of h)S.push(s&&!d?{...y,faded:!0}:y)},A=h=>!x||h.axis!==x.axis?!1:(h.axis==="x"?[h.x1,h.x2]:[h.y1,h.y2]).some(y=>Math.abs(y-x.pos)<.5);for(let[h,d]of Re(v))m(be(h,d),h.el===l||d.el===l);n&&M&&!o&&!i&&m(be(n,M),!0);for(let h of r)for(let d of v)m(ke(d,[he(h)]),h.id===i?.id||d.el===l);M&&!o&&!i&&B.length&&m(ke(M,t),!0);for(let h of Ie(r.map(he),{x:innerWidth/2,y:innerHeight/2}))m([h],A(h));P?.update({hover:M,pinned:v,rulers:fe,guides:B,liveGuide:L??D,lines:S,...e?{cursor:e}:{}}),_?.update(v.length)}var pe=null;function it(e){if(pe={x:e.clientX,y:e.clientY},L){N&&Math.hypot(e.clientX-N.x,e.clientY-N.y)>Rt&&(N=null),N||(tt(L,e.clientX,e.clientY,e.altKey),B=[...B]),G({x:e.clientX,y:e.clientY});return}D=ve(B,e.clientX,e.clientY),M=j(e.clientX,e.clientY,R),G({x:e.clientX,y:e.clientY})}function rt(e){L&&(N?(L.locked=!L.locked,B=[...B]):(et(e.clientX,e.clientY)||e.clientX<Z||e.clientY<Z)&&ot(L),N=null,L=null,G({x:e.clientX,y:e.clientY}))}function lt(e){if(e.button!==0)return;let n=j(e.clientX,e.clientY,R);if(!n)return;let o=et(e.clientX,e.clientY);if(o){ee(e),N=null,L=nt(o,e.clientX,e.clientY,e.altKey),G({x:e.clientX,y:e.clientY});return}let t=ve(B,e.clientX,e.clientY);if(t){ee(e),L=t,N={x:e.clientX,y:e.clientY},G({x:e.clientX,y:e.clientY});return}ee(e),_?.closeHelp(),v=[n],M=n,H?.show(n),G({x:e.clientX,y:e.clientY})}function at(e){let n=j(e.clientX,e.clientY,R);if(!n)return;ee(e),_?.closeHelp();let o=v.findIndex(i=>i.el===n.el);v=o>=0?v.filter((i,r)=>r!==o):[...v,n],M=n;let t=v[v.length-1];t?H?.show(t):H?.hide(),G({x:e.clientX,y:e.clientY})}function st(e){j(e.clientX,e.clientY,R)&&ee(e)}function ct(e){j(e.clientX,e.clientY,R)&&ee(e)}function ee(e){e.preventDefault(),e.stopPropagation()}function Qe(e,n){return e.left===n.left&&e.top===n.top&&e.width===n.width&&e.height===n.height}var Ve=0,Je=0;function dt(){me=requestAnimationFrame(dt);let n=v.filter(l=>l.el.isConnected).map(l=>ce(l.el)),o=M&&M.el.isConnected?ce(M.el):null;if(!(scrollX!==Ve||scrollY!==Je||n.length!==v.length||n.some((l,s)=>!Qe(l,v[s]))||M===null!=(o===null)||M!==null&&o!==null&&!Qe(M,o)))return;Ve=scrollX,Je=scrollY,v=n,M=o;let r=v[v.length-1];r?H?.show(r):H?.hide(),G()}function ut(){P?.resize()}function Yt(){P||(He(),P=qe(),H=Oe(P.root),_=je(P.root),_.update(0),addEventListener("mousemove",it),addEventListener("mousedown",lt,{capture:!0}),addEventListener("mouseup",rt,{capture:!0}),addEventListener("click",st,{capture:!0}),addEventListener("auxclick",ct,{capture:!0}),addEventListener("contextmenu",at,{capture:!0}),addEventListener("resize",ut),me=requestAnimationFrame(dt),G())}function Ce(){removeEventListener("mousemove",it),removeEventListener("mousedown",lt,{capture:!0}),removeEventListener("mouseup",rt,{capture:!0}),removeEventListener("click",st,{capture:!0}),removeEventListener("auxclick",ct,{capture:!0}),removeEventListener("contextmenu",at,{capture:!0}),removeEventListener("resize",ut),cancelAnimationFrame(me),me=0,_?.destroy(),_=null,H?.destroy(),H=null,P?.destroy(),P=null,ze(),M=null,v=[],L=null,N=null,D=null}function Ze(e){if(Gt(e))e.preventDefault(),P?Ce():Yt();else if(P&&pe&&(e.key.toLowerCase()===R.guideKeys.vertical||e.key.toLowerCase()===R.guideKeys.horizontal)){e.preventDefault();let n=e.key.toLowerCase()===R.guideKeys.vertical?"x":"y";nt(n,pe.x,pe.y,e.altKey),G()}else if(P&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(B=[],D=null,L=null,N=null):D&&ot(D),G();else if(P&&e.key.toLowerCase()===R.rulerKey)e.preventDefault(),fe=!fe,G();else if(P&&e.key.toLowerCase()===R.panelKey)e.preventDefault(),H?.toggle();else if(e.key==="Escape"&&P){if(_?.closeHelp())return;v.length?(v=[],H?.hide(),G()):Ce()}}function en(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,R=Le(e),addEventListener("keydown",Ze,{capture:!0});let n=import.meta.hot;n&&n.dispose(()=>{Ce(),removeEventListener("keydown",Ze,{capture:!0}),delete window.__align})}export{en as initAlign};
