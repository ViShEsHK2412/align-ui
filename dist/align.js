var Qe={ignore:"",hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function ve(e={}){return{...Qe,...e}}var ye=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function ke(e){return e.ignore?`${ye}, ${e.ignore}`:ye}function f(e){return String(Math.round(e*100)/100)}function Ve(e){let n=e.tagName.toLowerCase();e.id&&(n+=`#${e.id}`);let i=e.classList[0];return i&&(n+=`.${i}`),n.length>32?n.slice(0,31)+"\u2026":n}function oe(e){let n=e.getBoundingClientRect();return{el:e,label:Ve(e),left:n.left,right:n.right,top:n.top,bottom:n.bottom,width:n.width,height:n.height}}function Je(e){if(e.parentElement)return e.parentElement;let n=e.getRootNode();return n instanceof ShadowRoot?n.host:null}function O(e,n,i){let t=ke(i),o=document.elementFromPoint(e,n);for(;o?.shadowRoot;){let r=o.shadowRoot.elementFromPoint(e,n);if(!r||r===o)break;o=r}for(;o&&o.matches(t);)o=Je(o);return o&&o!==document.documentElement?oe(o):null}var ne=e=>parseFloat(e)||0;function be(e){let n=getComputedStyle(e),i=(t,o,r,a)=>[ne(t),ne(o),ne(r),ne(a)];return{padding:i(n.paddingTop,n.paddingRight,n.paddingBottom,n.paddingLeft),border:i(n.borderTopWidth,n.borderRightWidth,n.borderBottomWidth,n.borderLeftWidth),margin:i(n.marginTop,n.marginRight,n.marginBottom,n.marginLeft)}}function Ze(e,n){return e.width*e.height>=n.width*n.height?[e,n]:[n,e]}function et(e,n){let i=n.left+n.width/2,t=n.top+n.height/2;return[{x1:e.left,y1:t,x2:n.left,y2:t,label:f(n.left-e.left),axis:"x"},{x1:n.right,y1:t,x2:e.right,y2:t,label:f(e.right-n.right),axis:"x"},{x1:i,y1:e.top,x2:i,y2:n.top,label:f(n.top-e.top),axis:"y"},{x1:i,y1:n.bottom,x2:i,y2:e.bottom,label:f(e.bottom-n.bottom),axis:"y"}]}function ue(e,n){let i=[],t=e.left<n.right&&n.left<e.right,o=e.top<n.bottom&&n.top<e.bottom;if(t&&o){let[r,a]=Ze(e,n);return et(r,a)}if(!t){let[r,a]=e.right<=n.left?[e,n]:[n,e],p=o?(Math.max(e.top,n.top)+Math.min(e.bottom,n.bottom))/2:(e.top+e.height/2+n.top+n.height/2)/2;i.push({x1:r.right,y1:p,x2:a.left,y2:p,label:`${f(a.left-r.right)}`,axis:"x"})}if(!o){let[r,a]=e.bottom<=n.top?[e,n]:[n,e],p=t?(Math.max(e.left,n.left)+Math.min(e.right,n.right))/2:(e.left+e.width/2+n.left+n.width/2)/2;i.push({x1:p,y1:r.bottom,x2:p,y2:a.top,label:`${f(a.top-r.bottom)}`,axis:"y"})}return i}function tt(e){if(e.length<2)return[...e];let n=t=>{let o=e.map(t);return Math.max(...o)-Math.min(...o)},i=n(t=>t.left+t.width/2)>=n(t=>t.top+t.height/2);return[...e].sort((t,o)=>i?t.left-o.left:t.top-o.top)}function we(e){let n=tt(e),i=[];for(let t=1;t<n.length;t++)i.push(...ue(n[t-1],n[t]));return i}var nt=5,ot=4;function Z(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function pe(e,n,i){let t=null,o=nt;for(let r of e){let a=Math.abs(Z(r)-(r.axis==="x"?n:i));a<=o&&(t=r,o=a)}return t}function Ee(e,n,i){if(i)return e;let t=e,o=ot;for(let r of n){let a=Math.abs(r-e);a<o&&(t=r,o=a)}return t}function Me(e,n){return e?n==="x"?[e.left,e.right]:[e.top,e.bottom]:[]}function $e(e,n){let i=[];for(let t of["x","y"]){let o=n.filter(r=>r.axis===t).map(r=>({pos:r.pos,gap:t==="x"?r.pos<e.left?e.left-r.pos:r.pos>e.right?r.pos-e.right:-1:r.pos<e.top?e.top-r.pos:r.pos>e.bottom?r.pos-e.bottom:-1})).filter(r=>r.gap>=0).sort((r,a)=>r.gap-a.gap)[0];if(o)if(t==="x"){let r=e.top+e.height/2,a=o.pos<e.left?o.pos:e.right,p=o.pos<e.left?e.left:o.pos;i.push({x1:a,y1:r,x2:p,y2:r,label:f(o.gap),axis:"x"})}else{let r=e.left+e.width/2,a=o.pos<e.top?o.pos:e.bottom,p=o.pos<e.top?e.top:o.pos;i.push({x1:r,y1:a,x2:r,y2:p,label:f(o.gap),axis:"y"})}}return i}var b=(e,n)=>({light:e,dark:n}),he={accent:b("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:b("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:b("oklch(1 0 0)","oklch(0.264 0 0)"),fg:b("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:b("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:b("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:b("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:b("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)")},Ce={margin:"light-dark(oklch(0.44 0.13 70), oklch(0.8 0.13 70))",border:"light-dark(oklch(0.44 0.16 250), oklch(0.8 0.13 250))",padding:"light-dark(oklch(0.44 0.13 150), oklch(0.8 0.13 150))",content:"light-dark(oklch(0.44 0 0), oklch(0.8 0 0))"},Se=[b("oklch(1 0 0)","oklch(0.264 0 0)"),b("oklch(0.985 0 0)","oklch(0.293 0 0)"),b("oklch(0.967 0 0)","oklch(0.321 0 0)"),b("oklch(0.937 0 0)","oklch(0.348 0 0)"),b("oklch(0.922 0 0)","oklch(0.375 0 0)")],Y={fg:b("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:b("oklch(0.556 0 0)","oklch(0.715 0 0)")};function R(e){return`light-dark(${e.light}, ${e.dark})`}var S=e=>R(Se[e]??Se[0]),rt=["0 1px 1px -0.5px","0 3px 3px -1.5px","0 6px 6px -3px","0 12px 12px -6px","0 24px 24px -12px","0 48px 48px -24px","0 96px 96px -48px"];function K(e,n){let i=Math.max(1,Math.min(8,Math.round(e))),t=rt.slice(0,i-1);if(!n){let T="oklch(0 0 0 / 0.06)";return[`0 0 0 1px ${T}`,...t.map(A=>`${A} ${T}`)].join(", ")}let o=[0,0,.01,.02,.02,.04,.04,.06][i-1],r=[.02,.02,.04,.04,.06,.06,.06,.06][i-1],a="oklch(0 0 0 / 0.18)",p=[`inset 0 0 0 1px oklch(1 0 0 / ${r})`];return o&&p.unshift(`inset 0 1px 0 0 oklch(1 0 0 / ${o})`),[...p,...t.map(T=>`${T} ${a}`)].join(", ")}var it='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',g={title:13,body:12,tag:11,stack:it},w={regular:400,medium:500,semibold:600},me="__align_font",lt="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function Te(){if(document.getElementById(me))return;let e=document.createElement("link");e.id=me,e.rel="stylesheet",e.href=lt,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function Be(){document.getElementById(me)?.remove()}function Le(e){let n=[`${w.medium} ${g.body}px Inter`];Promise.all(n.map(i=>document.fonts.load(i))).then(e,e)}function fe(e){let n={};for(let i of Object.keys(he))n[i]=e?he[i].dark:he[i].light;return n}function Ae(){return matchMedia("(prefers-color-scheme: dark)").matches}function re(e,n){return e.replace(/\)$/,` / ${n})`)}var z=16,at=3,st=5,Re=(e,n)=>`
${e} { box-shadow: ${K(n,!1)}; }
@media (prefers-color-scheme: dark) {
  ${e} { box-shadow: ${K(n,!0)}; }
}`,ct=`
.dock {
  /* On .dock, not :host \u2014 the host's inline all:initial outranks a :host rule,
     which would pin color-scheme to normal and resolve light-dark() to its
     light branch on a dark page. */
  color-scheme: light dark;
  position: fixed; left: ${z}px; top: 0; width: 340px;
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
${Re(".panel",at)}
${Re(".dock[data-dragging] .panel",st)}

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
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${g.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${S(1)}; }

/* Each region is one step up Fluid's surface ladder, so depth is carried by
   the surface itself and the numbers can stay full-contrast foreground. */
.region {
  position: relative; border-radius: 0;
  border: 1px solid var(--border);
  padding: 21px 6px 6px;
}
.region[data-level="1"] { background: ${S(1)}; }
.region[data-level="2"] { background: ${S(2)}; }
.region[data-level="3"] { background: ${S(3)}; }
.content { background: ${S(4)}; }

.tag {
  position: absolute; top: 5px; left: 7px;
  font-size: ${g.tag}px; font-weight: ${w.semibold};
  letter-spacing: 0.02em; line-height: 1; text-transform: lowercase;
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
  border-radius: 0; border: 1px solid var(--border); padding: 10px 6px;
  text-align: center; font-weight: ${w.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,ee=z,W=-1,te=!1;function Ie(e){let n=document.createElement("style");n.textContent=ct,e.appendChild(n);let i=document.createElement("div");i.className="dock";let t=document.createElement("div");t.className="panel",i.appendChild(t),e.appendChild(i);let o=(s,v)=>Math.min(Math.max(s,z),Math.max(z,v-z));function r(){let s=i.offsetHeight||300;W<0&&(W=Math.max(z,innerHeight-s-z)),ee=o(ee,innerWidth-i.offsetWidth),W=o(W,innerHeight-s),i.style.transform=`translate(${ee-z}px, ${W}px)`}let a=null;function p(s){s.button===0&&(s.preventDefault(),s.stopPropagation(),a={x:s.clientX,y:s.clientY,dx:ee,dy:W},i.setAttribute("data-dragging",""),s.currentTarget.setPointerCapture(s.pointerId))}function T(s){a&&(ee=a.dx+(s.clientX-a.x),W=a.dy+(s.clientY-a.y),r())}function A(){a=null,i.removeAttribute("data-dragging")}addEventListener("resize",r);let P=null;function G(s){let v=document.createElement("div");return v.className="edge",v.textContent=s===0?"0":f(s),s===0&&v.setAttribute("data-zero",""),v}function Q(s,v,V,D){let[l,c,y,X]=V,B=document.createElement("div");B.className="region",B.setAttribute("data-level",String(v));let d=document.createElement("span");d.className="tag",d.textContent=s,d.style.color=Ce[s];let u=document.createElement("div");u.className="row";let k=document.createElement("div");return k.className="fill",k.appendChild(D),u.append(G(X),k,G(c)),B.append(d,G(l),u,G(y)),B}return{show(s){let v=be(s.el),[V,D,l,c]=v.border,[y,X,B,d]=v.padding,u=document.createElement("header"),k=document.createElement("span");k.className="name",k.textContent=s.label;let J=document.createElement("span");J.className="size",J.textContent=`${f(s.width)} \xD7 ${f(s.height)}`;let N=document.createElement("button");N.className="close",N.textContent="\xD7",N.title="close (B brings it back)",N.addEventListener("pointerdown",de=>de.stopPropagation()),N.addEventListener("click",de=>{de.stopPropagation(),te=!0,i.removeAttribute("data-open")}),u.append(k,J,N),u.addEventListener("pointerdown",p),u.addEventListener("pointermove",T),u.addEventListener("pointerup",A),u.addEventListener("pointercancel",A);let _=document.createElement("div");_.className="content",_.textContent=`${f(s.width-c-D-d-X)} \xD7 ${f(s.height-V-l-y-B)}`,t.replaceChildren(u,Q("margin",1,v.margin,Q("border",2,v.border,Q("padding",3,v.padding,_)))),P=s,r(),!te&&requestAnimationFrame(()=>i.setAttribute("data-open",""))},hide(){P=null,i.removeAttribute("data-open")},toggle(){P&&(te=!te,te?i.removeAttribute("data-open"):(r(),i.setAttribute("data-open","")))},destroy(){removeEventListener("resize",r),i.remove(),n.remove()}}}var dt=[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure what is under the cursor"],["Click","lock an element"],["Right-click","add to, or drop from, the locked set"],["Drag the panel header","move the box model"],["B","hide or bring back the box model"],["R","rulers down the top and left edges"],["Drag from a rule","pull out a guide; drag it back to remove"],["V","vertical guide at the cursor"],["H","horizontal guide at the cursor"],["Alt while placing","ignore snapping"],["Del","remove the guide under the cursor; Shift+Del for all"],["Esc","clear the locks, then close"]],ut=`
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
  background: ${S(0)};
  box-shadow: ${K(3,!1)};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
.flag:hover { background: ${S(1)}; }
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
  background: ${S(0)};
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
  background: ${S(2)};
}
.help dd { margin: 0; align-self: center; color: ${R(Y.muted)}; }
`;function Pe(e){let n=document.createElement("style");n.textContent=ut,e.appendChild(n);let i=document.createElement("div");i.className="flag";let t=document.createElement("span");t.className="name",t.textContent="Align";let o=document.createElement("span");o.className="count",i.append(t,o);let r=document.createElement("div");r.className="help";let a=document.createElement("dl");for(let[p,T]of dt){let A=document.createElement("dt"),P=document.createElement("kbd");P.textContent=p,A.appendChild(P);let G=document.createElement("dd");G.textContent=T,a.append(A,G)}return r.appendChild(a),i.addEventListener("click",p=>{p.stopPropagation(),r.toggleAttribute("data-open")}),e.append(i,r),{update(p){o.textContent=p>0?`${p} locked`:""},closeHelp(){let p=r.hasAttribute("data-open");return r.removeAttribute("data-open"),p},destroy(){i.remove(),r.remove(),n.remove()}}}var ie=5,ge=4,le=12,h=22,j=10,pt=50,ht=100;function Ge(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let n=e.attachShadow({mode:"closed"}),i=document.createElement("canvas");i.style.cssText="position: fixed; inset: 0; pointer-events: none;",n.appendChild(i);let t=i.getContext("2d"),o={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,guides:[],liveGuide:null},r=fe(Ae()),a=0,p=matchMedia("(prefers-color-scheme: dark)"),T=()=>{r=fe(p.matches),D()};p.addEventListener("change",T),Le(()=>D());function A(){let l=devicePixelRatio;i.width=Math.round(innerWidth*l),i.height=Math.round(innerHeight*l),i.style.width=innerWidth+"px",i.style.height=innerHeight+"px",t.setTransform(l,0,0,l,0,0),t.translate(.5,.5)}function P(l,c){t.strokeStyle=c,t.lineWidth=1,t.setLineDash([]),t.strokeRect(Math.round(l.left),Math.round(l.top),Math.round(l.width),Math.round(l.height))}function G(l){t.strokeStyle=re(r.measure,.7),t.lineWidth=1,t.setLineDash([2,2]),t.beginPath();for(let c of[l.left,l.right])t.moveTo(Math.round(c),0),t.lineTo(Math.round(c),innerHeight);for(let c of[l.top,l.bottom])t.moveTo(0,Math.round(c)),t.lineTo(innerWidth,Math.round(c));t.stroke(),t.setLineDash([])}function Q(l){if(t.strokeStyle=r.measure,t.lineWidth=1,t.setLineDash([]),t.beginPath(),t.moveTo(Math.round(l.x1),Math.round(l.y1)),t.lineTo(Math.round(l.x2),Math.round(l.y2)),l.axis==="x")for(let c of[l.x1,l.x2])t.moveTo(Math.round(c),Math.round(l.y1)-ie),t.lineTo(Math.round(c),Math.round(l.y1)+ie);else for(let c of[l.y1,l.y2])t.moveTo(Math.round(l.x1)-ie,Math.round(c)),t.lineTo(Math.round(l.x1)+ie,Math.round(c));t.stroke()}function s(l,c,y,X,B=!1){t.font=`${w.medium} ${g.body}px ${g.stack}`,t.textBaseline="middle";let d=t.measureText(l).width+ge*2,u=g.body+ge*2+2,k=B?c-d/2:c,J=B?y-u/2:y,N=Math.min(Math.max(k,le),innerWidth-d-le),_=Math.min(Math.max(J,le),innerHeight-u-le);t.fillStyle=X,t.beginPath(),t.roundRect(N,_,d,u,4),t.fill(),t.fillStyle=r.surface,t.fillText(l,N+ge,_+u/2)}function v(){let l=scrollX,c=scrollY;t.fillStyle=r.rulerBg,t.fillRect(-.5,-.5,innerWidth+1,h),t.fillRect(-.5,-.5,h,innerHeight+1),t.strokeStyle=r.rulerLine,t.lineWidth=1,t.setLineDash([]),t.font=`${w.regular} 9px ${g.stack}`,t.fillStyle=r.muted,t.save(),t.globalAlpha=.16,t.fillStyle=r.accent;for(let d of o.pinned)t.fillRect(d.left,-.5,d.width,h),t.fillRect(-.5,d.top,h,d.height);t.restore(),t.beginPath(),t.moveTo(-.5,h-.5),t.lineTo(innerWidth,h-.5),t.moveTo(h-.5,-.5),t.lineTo(h-.5,innerHeight),t.stroke();let y=d=>d%ht===0?h:d%pt===0?7:4;t.textBaseline="top",t.textAlign="left",t.beginPath();let X=Math.floor(l/j)*j;for(let d=X;d<l+innerWidth;d+=j){let u=Math.round(d-l);if(u<h)continue;let k=y(d);t.moveTo(u,h-k),t.lineTo(u,h),k===h&&(t.fillStyle=r.muted,t.fillText(String(d),u+3,3))}t.stroke(),t.beginPath();let B=Math.floor(c/j)*j;for(let d=B;d<c+innerHeight;d+=j){let u=Math.round(d-c);if(u<h)continue;let k=y(d);t.moveTo(h-k,u),t.lineTo(h,u),k===h&&(t.save(),t.translate(3,u-3),t.rotate(-Math.PI/2),t.fillStyle=r.muted,t.fillText(String(d),0,0),t.restore())}t.stroke(),o.cursor&&(t.strokeStyle=r.accent,t.beginPath(),t.moveTo(Math.round(o.cursor.x),-.5),t.lineTo(Math.round(o.cursor.x),h),t.moveTo(-.5,Math.round(o.cursor.y)),t.lineTo(h,Math.round(o.cursor.y)),t.stroke()),t.fillStyle=r.guide;for(let d of o.guides){let u=Math.round(Z(d));d.axis==="x"?t.fillRect(u-1,-.5,2,h):t.fillRect(-.5,u-1,h,2)}t.fillStyle=r.rulerBg,t.fillRect(-.5,-.5,h,h),t.strokeStyle=r.rulerLine,t.strokeRect(-.5,-.5,h,h)}function V(){a=0,t.save(),t.setTransform(1,0,0,1,0,0),t.clearRect(0,0,i.width,i.height),t.restore();for(let l of o.pinned)P(l,r.accent);o.hover&&(G(o.hover),P(o.hover,o.pinned.length?re(r.accent,.7):r.accent));for(let l of o.guides){let c=o.liveGuide?.id===l.id;t.strokeStyle=c?r.guide:re(r.guide,.65),t.lineWidth=1,t.setLineDash([]),t.beginPath();let y=Math.round(Z(l));l.axis==="x"?(t.moveTo(y,0),t.lineTo(y,innerHeight)):(t.moveTo(0,y),t.lineTo(innerWidth,y)),t.stroke()}for(let l of o.lines)Q(l);for(let l of o.lines){let c=(l.x1+l.x2)/2,y=(l.y1+l.y2)/2;l.axis==="x"?s(l.label,c,y-16,r.measure,!0):s(l.label,c+26,y,r.measure,!0)}if(o.hover&&o.cursor){let{width:l,height:c}=o.hover;s(`${f(l)} \xD7 ${f(c)}`,o.cursor.x+14,o.cursor.y+14,r.accent)}if(o.liveGuide){let l=o.liveGuide,c=Math.round(Z(l));s(`${l.axis} ${f(l.at)}`,l.axis==="x"?c+6:30,l.axis==="x"?30:c+6,r.guide)}o.rulers&&v()}function D(){a||(a=requestAnimationFrame(V))}return A(),{root:n,update(l){Object.assign(o,l),D()},resize(){A(),D()},destroy(){a&&cancelAnimationFrame(a),p.removeEventListener("change",T),e.remove()}}}var M,E=null,I=null,H=null,x=null,m=[],se=0,ce=!1,C=[],mt=1,L=null,F=null,U=22;function De(e,n){return ce?n<U&&e>=U?"y":e<U&&n>=U?"x":null:null}function Ke(e,n,i,t){let o=O(n,i,M),r=e.axis==="x"?n:i,a=Ee(r,Me(o,e.axis),t);e.at=a+(e.axis==="x"?scrollX:scrollY)}function ze(e,n,i,t){let o={id:mt++,axis:e,at:0};return Ke(o,n,i,t),C=[...C,o],o}function He(e){C=C.filter(n=>n.id!==e.id),F?.id===e.id&&(F=null),L?.id===e.id&&(L=null)}function ft(e){let n=M.hotkey.toLowerCase().split("+"),i=n[n.length-1];return e.key.toLowerCase()!==i||n.includes("shift")!==e.shiftKey||n.includes("alt")!==e.altKey?!1:(n.includes("mod")||n.includes("ctrl")||n.includes("cmd"))===(e.metaKey||e.ctrlKey)}function $(e){let n=m[m.length-1],i=x&&m.some(o=>o.el===x.el),t=C.map(o=>({axis:o.axis,pos:o.axis==="x"?o.at-scrollX:o.at-scrollY}));E?.update({hover:x,pinned:m,rulers:ce,guides:C,liveGuide:L??F,lines:[...we(m),...n&&x&&!i?ue(n,x):[],...x&&C.length?$e(x,t):[]],...e?{cursor:e}:{}}),H?.update(m.length)}var ae=null;function Xe(e){if(ae={x:e.clientX,y:e.clientY},L){Ke(L,e.clientX,e.clientY,e.altKey),C=[...C],$({x:e.clientX,y:e.clientY});return}F=pe(C,e.clientX,e.clientY),x=O(e.clientX,e.clientY,M),$({x:e.clientX,y:e.clientY})}function Oe(e){L&&((De(e.clientX,e.clientY)||e.clientX<U||e.clientY<U)&&He(L),L=null,$({x:e.clientX,y:e.clientY}))}function We(e){if(e.button!==0)return;let n=O(e.clientX,e.clientY,M);if(!n)return;let i=De(e.clientX,e.clientY);if(i){q(e),L=ze(i,e.clientX,e.clientY,e.altKey),$({x:e.clientX,y:e.clientY});return}let t=pe(C,e.clientX,e.clientY);if(t){q(e),L=t,$({x:e.clientX,y:e.clientY});return}q(e),H?.closeHelp(),m=[n],x=n,I?.show(n),$({x:e.clientX,y:e.clientY})}function Fe(e){let n=O(e.clientX,e.clientY,M);if(!n)return;q(e),H?.closeHelp();let i=m.findIndex(o=>o.el===n.el);m=i>=0?m.filter((o,r)=>r!==i):[...m,n],x=n;let t=m[m.length-1];t?I?.show(t):I?.hide(),$({x:e.clientX,y:e.clientY})}function _e(e){O(e.clientX,e.clientY,M)&&q(e)}function je(e){O(e.clientX,e.clientY,M)&&q(e)}function q(e){e.preventDefault(),e.stopPropagation()}function Ne(e,n){return e.left===n.left&&e.top===n.top&&e.width===n.width&&e.height===n.height}function Ue(){se=requestAnimationFrame(Ue);let n=m.filter(r=>r.el.isConnected).map(r=>oe(r.el)),i=x&&x.el.isConnected?oe(x.el):null;if(!(n.length!==m.length||n.some((r,a)=>!Ne(r,m[a]))||x===null!=(i===null)||x!==null&&i!==null&&!Ne(x,i)))return;m=n,x=i;let o=m[m.length-1];o?I?.show(o):I?.hide(),$()}function qe(){E?.resize()}function gt(){E||(Te(),E=Ge(),I=Ie(E.root),H=Pe(E.root),H.update(0),addEventListener("mousemove",Xe),addEventListener("mousedown",We,{capture:!0}),addEventListener("mouseup",Oe,{capture:!0}),addEventListener("click",_e,{capture:!0}),addEventListener("auxclick",je,{capture:!0}),addEventListener("contextmenu",Fe,{capture:!0}),addEventListener("resize",qe),se=requestAnimationFrame(Ue),$())}function xe(){removeEventListener("mousemove",Xe),removeEventListener("mousedown",We,{capture:!0}),removeEventListener("mouseup",Oe,{capture:!0}),removeEventListener("click",_e,{capture:!0}),removeEventListener("auxclick",je,{capture:!0}),removeEventListener("contextmenu",Fe,{capture:!0}),removeEventListener("resize",qe),cancelAnimationFrame(se),se=0,H?.destroy(),H=null,I?.destroy(),I=null,E?.destroy(),E=null,Be(),x=null,m=[],L=null,F=null}function Ye(e){if(ft(e))e.preventDefault(),E?xe():gt();else if(E&&ae&&(e.key.toLowerCase()===M.guideKeys.vertical||e.key.toLowerCase()===M.guideKeys.horizontal)){e.preventDefault();let n=e.key.toLowerCase()===M.guideKeys.vertical?"x":"y";ze(n,ae.x,ae.y,e.altKey),$()}else if(E&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?C=[]:F&&He(F),$();else if(E&&e.key.toLowerCase()===M.rulerKey)e.preventDefault(),ce=!ce,$();else if(E&&e.key.toLowerCase()===M.panelKey)e.preventDefault(),I?.toggle();else if(e.key==="Escape"&&E){if(H?.closeHelp())return;m.length?(m=[],I?.hide(),$()):xe()}}function Gt(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,M=ve(e),addEventListener("keydown",Ye,{capture:!0});let n=import.meta.hot;n&&n.dispose(()=>{xe(),removeEventListener("keydown",Ye,{capture:!0}),delete window.__align})}export{Gt as initAlign};
