function Ce(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function ze(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:Ce(r)})}return o}function Kt(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function _t(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function Xe(e,t){return t.length===0?"":_t(e).map(o=>{let n=Kt(o,t);return n.length?`${o} ${n.join(" ")}`:`${o} \u2014`}).join("  \xB7  ")}function We(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(Ce)}function Ke(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),s=a.display.includes("flex")||a.display.includes("grid"),g=n==="x"?a.columnGap:a.rowGap,A=s&&g!=="normal"?Ce(g):null,[x,N,m,C]=We(e),[d,S,E,H]=We(t),L=p=>Number.isFinite(p)?p:0,F=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,l=n==="x"?F?L(N)+L(H):L(S)+L(C):F?L(m)+L(d):L(E)+L(x);return{px:o,cssGap:A,margins:l,siblings:!0}}function _e(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function je(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}var jt={ignore:"",hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function qe(e={}){return{...jt,...e}}var Ue=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function Je(e){return e.ignore?`${Ue}, ${e.ignore}`:Ue}function v(e){return String(Math.round(e*100)/100)}function Ut(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function ye(e){let t=e.getBoundingClientRect();return{el:e,label:Ut(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height}}function Ve(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function J(e,t,o){let n=Je(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=Ve(r);return r&&r!==document.documentElement?ye(r):null}var ge=e=>parseFloat(e)||0;function Qe(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[ge(n),ge(r),ge(i),ge(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function qt(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function Jt(e,t){let o=t.left+t.width/2,n=t.top+t.height/2;return[{x1:e.left,y1:n,x2:t.left,y2:n,label:v(t.left-e.left),axis:"x"},{x1:t.right,y1:n,x2:e.right,y2:n,label:v(e.right-t.right),axis:"x"},{x1:o,y1:e.top,x2:o,y2:t.top,label:v(t.top-e.top),axis:"y"},{x1:o,y1:t.bottom,x2:o,y2:e.bottom,label:v(e.bottom-t.bottom),axis:"y"}]}function xe(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function be(e,t){let o=[],n=e.left<t.right&&t.left<e.right,r=e.top<t.bottom&&t.top<e.bottom;if(n&&r){let[i,a]=qt(e,t);return Jt(i,a)}if(!n){let[i,a]=e.right<=t.left?[e,t]:[t,e],s=r?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:i.right,y1:s,x2:a.left,y2:s,label:`${v(a.left-i.right)}`,axis:"x"}),o.push(...xe(i.right,i.top,i.bottom,s,"x")),o.push(...xe(a.left,a.top,a.bottom,s,"x"))}if(!r){let[i,a]=e.bottom<=t.top?[e,t]:[t,e],s=n?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:s,y1:i.bottom,x2:s,y2:a.top,label:`${v(a.top-i.bottom)}`,axis:"y"}),o.push(...xe(i.bottom,i.left,i.right,s,"y")),o.push(...xe(a.top,a.left,a.right,s,"y"))}return o}function Vt(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function Le(e){let t=Vt(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var Qt=5,Zt=8;function ie(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function Ge(e,t,o){let n=null,r=Qt;for(let i of e){let a=Math.abs(ie(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function Ze(e,t,o){if(o)return{at:e,what:""};let n=null,r=Zt;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function et(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function Be(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,s=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:s,y2:i,label:v(r.gap),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,s=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:s,label:v(r.gap),axis:"y"})}}return o}function tt(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],s=r[i],g=s-a;g<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:s,y2:t.y,label:v(g),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:s,label:v(g),axis:"y"}))}}return o}var j=3;function en(e,t){return e.x<t.x+t.w+j&&t.x<e.x+e.w+j&&e.y<t.y+t.h+j&&t.y<e.y+e.h+j}function nt(e,t,o=12){let n=(a,s)=>Math.min(Math.max(a,o),t.w-s-o),r=(a,s)=>Math.min(Math.max(a,o),t.h-s-o),i=[];for(let a of e){let s={...a,x:n(a.x,a.w),y:r(a.y,a.h)},g=!1;for(let A=0;A<16;A++){let x=i.find(m=>en(m,s));if(!x)break;let N=s.axis==="x"?s.y:s.x;if(s.axis==="x"?s.y=r(g?x.y+x.h+j:x.y-s.h-j,s.h):s.x=n(g?x.x-s.w-j:x.x+x.w+j,s.w),(s.axis==="x"?s.y:s.x)===N){if(g)break;g=!0}}i.push(s)}return i}function tn(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(s=>parseFloat(s)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function ot(e){let t=1,o=1;for(let n=e;n;n=Ve(n)){let r=tn(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var Y=(e,t)=>({light:e,dark:t}),Ae={accent:Y("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:Y("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:Y("oklch(1 0 0)","oklch(0.264 0 0)"),fg:Y("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:Y("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:Y("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:Y("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:Y("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)")};function it(e){return`light-dark(${e.light}, ${e.dark})`}var ee=it(Y("#fafafa","#1a1a1a"));function ae(e){return it(Y(`rgb(0 0 0 / ${e})`,`rgb(255 255 255 / ${e})`))}var rt=[0,.07,.08,.1,.12,.15,.2];function X(e){let t=rt[Math.max(0,Math.min(rt.length-1,e))];return t===0?ee:ae(t)}var K={primary:ae(.9),secondary:ae(.6),tertiary:ae(.4)},ve=ae(.12),se="0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)",at="0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)";var nn='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',k={title:13,body:12,tag:11,stack:nn},G={regular:400,medium:500,semibold:600},Ne="__align_font",on="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function st(){if(document.getElementById(Ne))return;let e=document.createElement("link");e.id=Ne,e.rel="stylesheet",e.href=on,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function lt(){document.getElementById(Ne)?.remove()}function ct(e){let t=[`${G.medium} ${k.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function Re(e){let t={};for(let o of Object.keys(Ae))t[o]=e?Ae[o].dark:Ae[o].light;return t}function ut(){return matchMedia("(prefers-color-scheme: dark)").matches}function le(e,t){return e.replace(/\)$/,` / ${t})`)}var U=16,rn=`
.dock {
  /* On .dock, not :host \u2014 the host's inline all:initial outranks a :host rule,
     which would pin color-scheme to normal and resolve light-dark() to its
     light branch on a dark page. */
  color-scheme: light dark;
  position: fixed; left: ${U}px; top: 0; width: 340px;
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none; user-select: none;
  font-family: ${k.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${K.primary};
  --muted: ${K.secondary};
  --border: ${ve};
}
.panel {
  padding: 10px; border-radius: 0;
  font-size: ${k.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${ee};

  box-shadow: ${se};

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

header {
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] .panel { box-shadow: ${at}; }
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${k.title}px; font-weight: ${G.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${k.body}px; font-weight: ${G.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${k.tag}px; font-weight: ${G.medium};
  margin-left: 4px;
  color: ${K.primary};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${k.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${X(1)}; }

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
.region[data-level="1"] { background: ${X(1)}; }
.region[data-level="2"] { background: ${X(2)}; }
.region[data-level="3"] { background: ${X(3)}; }
.content { background: ${X(4)}; }

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
  font-size: ${k.tag}px; font-weight: ${G.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${G.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${G.regular}; }
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
  font-size: ${k.tag}px; line-height: 1.5;
}
.readout-key { color: var(--muted); }
.readout-value { color: var(--fg); overflow-wrap: anywhere; }
.content {
  border-radius: 0; padding: 14px 8px;
  text-align: center; font-weight: ${G.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,ce=U,V=-1,ue=!1;function dt(e){let t=document.createElement("style");t.textContent=rn,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);function r(d,S){let E=document.createElement("div");E.className="readout";let H=document.createElement("div");H.className="tag readout-tag",H.textContent=d,E.appendChild(H);for(let[L,F]of S){let l=document.createElement("div");l.className="readout-row";let p=document.createElement("span");p.className="readout-key",p.textContent=L;let c=document.createElement("span");c.className="readout-value",c.textContent=F,l.append(p,c),E.appendChild(l)}return E}e.appendChild(o);let i=(d,S)=>Math.min(Math.max(d,U),Math.max(U,S-U));function a(){let d=o.offsetHeight||300;V<0&&(V=Math.max(U,innerHeight-d-U)),ce=i(ce,innerWidth-o.offsetWidth),V=i(V,innerHeight-d),o.style.transform=`translate(${ce-U}px, ${V}px)`}let s=null;function g(d){d.button===0&&(d.preventDefault(),d.stopPropagation(),s={x:d.clientX,y:d.clientY,dx:ce,dy:V},o.setAttribute("data-dragging",""),d.currentTarget.setPointerCapture(d.pointerId))}function A(d){s&&(ce=s.dx+(d.clientX-s.x),V=s.dy+(d.clientY-s.y),a())}function x(){s=null,o.removeAttribute("data-dragging")}addEventListener("resize",a);let N=null;function m(d){let S=document.createElement("div");return S.className="edge",S.textContent=d===0?"0":v(d),d===0&&S.setAttribute("data-zero",""),S}function C(d,S,E,H){let[L,F,l,p]=E,c=document.createElement("div");c.className="region",c.setAttribute("data-level",String(S));let w=document.createElement("span");w.className="tag",w.textContent=d;let h=document.createElement("div");h.className="row";let u=document.createElement("div");u.className="fill",u.appendChild(H),h.append(m(p),u,m(F));let f=document.createElement("div");return f.className="head",f.append(w,m(L)),c.append(f,h,m(l)),c}return{show(d,S=[]){let E=Qe(d.el),[H,L,F,l]=E.border,[p,c,w,h]=E.padding,u=ot(d.el),f=d.width/u.x,P=d.height/u.y,zt=Math.abs(u.x-1)>.001||Math.abs(u.y-1)>.001,_=document.createElement("header"),Se=document.createElement("span");Se.className="name",Se.textContent=d.label;let $e=document.createElement("span");$e.className="size",$e.textContent=`${v(f)} \xD7 ${v(P)}`;let Z=document.createElement("button");if(Z.className="close",Z.textContent="\xD7",Z.title="close (B brings it back)",Z.addEventListener("pointerdown",O=>O.stopPropagation()),Z.addEventListener("click",O=>{O.stopPropagation(),ue=!0,o.removeAttribute("data-open")}),_.append(Se,$e),zt){let O=document.createElement("span");O.className="scale",O.textContent=`\xD7${v(u.x)}`,O.title=`renders at ${v(d.width)} \xD7 ${v(d.height)}`,_.appendChild(O)}_.appendChild(Z),_.addEventListener("pointerdown",g),_.addEventListener("pointermove",A),_.addEventListener("pointerup",x),_.addEventListener("pointercancel",x);let Me=document.createElement("div");Me.className="content",Me.textContent=`${v(f-l-L-h-c)} \xD7 ${v(P-H-F-p-w)}`;let Te=[_,C("margin",1,E.margin,C("border",2,E.border,C("padding",3,E.padding,Me)))];if(S.length){let O=S.map(fe=>[v(fe.px),fe.detail]),Ye=je(S.map(fe=>fe.px));Ye&&O.push(["",Ye]),Te.push(r("gaps",O))}let Xt=ze(d.el),De=Xe([f,P,...E.margin,...E.border,...E.padding],Xt);De&&Te.push(r("tokens",[["",De]])),n.replaceChildren(...Te),N=d,a(),!ue&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},hide(){N=null,o.removeAttribute("data-open")},toggle(){N&&(ue=!ue,ue?o.removeAttribute("data-open"):(a(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",a),o.remove(),t.remove()}}}var an=[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure what is under the cursor"],["Click","lock an element"],["Right-click","add to, or drop from, the locked set"],["Drag the panel header","move the box model"],["B","hide or bring back the box model"],["R","rulers down the top and left edges"],["Drag from a rule","pull out a guide; drag it back to remove"],["V","vertical guide at the cursor"],["H","horizontal guide at the cursor"],["Hover a guide","distance from it to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the last guide you touched; Shift for 10px"],["L","pin that guide so it cannot be moved or deleted"],["Ctrl/Cmd while placing","ignore snapping"],["Del","remove the guide under the cursor; Shift+Del for all"],["Esc","clear the locks, then close"]],de=16,pt=k.tag+12,mt=8,sn=`
.flag {
  position: fixed; top: ${de}px; right: ${de}px;
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${k.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${k.tag}px; font-weight: ${G.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${K.primary};
  background: ${ee};
  box-shadow: ${se};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
.flag:hover { background: ${X(1)}; }
.flag .count { color: ${K.secondary}; }
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: ${de+pt+mt}px; right: ${de}px; width: 292px;
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${de*2+pt+mt}px); overflow-y: auto;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${k.stack};
  font-synthesis: none;
  font-size: ${k.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${K.primary};
  background: ${ee};
  box-shadow: ${se};
  display: none;
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
  font: inherit; font-weight: ${G.medium};
  border: 1px solid ${ve};
  background: ${X(2)};
}
.help dd { margin: 0; color: ${K.secondary}; }
`;function ht(e){let t=document.createElement("style");t.textContent=sn,e.appendChild(t);let o=document.createElement("div");o.className="flag";let n=document.createElement("span");n.className="name",n.textContent="Align";let r=document.createElement("span");r.className="count",o.append(n,r);let i=document.createElement("div");i.className="help";let a=document.createElement("dl");for(let[s,g]of an){let A=document.createElement("dt"),x=document.createElement("kbd");x.textContent=s,A.appendChild(x);let N=document.createElement("dd");N.textContent=g,a.append(A,N)}return i.appendChild(a),o.addEventListener("click",s=>{s.stopPropagation(),i.toggleAttribute("data-open")}),e.append(o,i),{update(s){r.textContent=s>0?`${s} locked`:""},closeHelp(){let s=i.hasAttribute("data-open");return i.removeAttribute("data-open"),s},destroy(){o.remove(),i.remove(),t.remove()}}}var we=5,Fe=4,pe=12,ft=.22,y=22,te=10,ln=50,cn=100;function gt(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,guides:[],liveGuide:null,activeGuide:null},i=Re(ut()),a=0,s=matchMedia("(prefers-color-scheme: dark)"),g=()=>{i=Re(s.matches),F()};s.addEventListener("change",g),ct(()=>F());function A(){let l=devicePixelRatio;o.width=Math.round(innerWidth*l),o.height=Math.round(innerHeight*l),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(l,0,0,l,0,0),n.translate(.5,.5)}let x=l=>Math.round(l)-.5;function N(l,p){n.strokeStyle=p,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(l.left),Math.round(l.top),Math.round(l.width),Math.round(l.height))}function m(l){n.strokeStyle=le(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let p of[l.left,l.right])n.moveTo(Math.round(p),0),n.lineTo(Math.round(p),innerHeight);for(let p of[l.top,l.bottom])n.moveTo(0,Math.round(p)),n.lineTo(innerWidth,Math.round(p));n.stroke(),n.setLineDash([])}function C(l){if(n.strokeStyle=l.extension?le(i.measure,.55):i.measure,n.lineWidth=1,n.setLineDash(l.extension?[3,3]:[]),n.beginPath(),n.moveTo(Math.round(l.x1),Math.round(l.y1)),n.lineTo(Math.round(l.x2),Math.round(l.y2)),l.extension){n.stroke();return}if(l.axis==="x")for(let p of[l.x1,l.x2])n.moveTo(Math.round(p),Math.round(l.y1)-we),n.lineTo(Math.round(p),Math.round(l.y1)+we);else for(let p of[l.y1,l.y2])n.moveTo(Math.round(l.x1)-we,Math.round(p)),n.lineTo(Math.round(l.x1)+we,Math.round(p));n.stroke()}function d(l){return n.font=`${G.medium} ${k.body}px ${k.stack}`,{w:n.measureText(l).width+Fe*2,h:k.body+Fe*2+2}}function S(l,p,c,w){n.font=`${G.medium} ${k.body}px ${k.stack}`,n.textBaseline="middle";let{w:h,h:u}=d(l),f=x(Math.min(Math.max(p,pe),innerWidth-h-pe)),P=x(Math.min(Math.max(c,pe),innerHeight-u-pe));n.fillStyle=w,n.beginPath(),n.roundRect(f,P,Math.ceil(h),u,4),n.fill(),n.fillStyle=i.surface,n.fillText(l,f+Fe,P+u/2)}function E(l,p,c,w,h=!1){let{w:u,h:f}=d(l);S(l,h?p-u/2:p,h?c-f/2:c,w)}function H(){let l=scrollX,p=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,y),n.fillRect(-.5,-.5,y,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${G.regular} 9px ${k.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let u of r.pinned)n.fillRect(x(u.left),-.5,Math.round(u.width),y),n.fillRect(-.5,x(u.top),y,Math.round(u.height));n.restore(),n.beginPath(),n.moveTo(-.5,y-.5),n.lineTo(innerWidth,y-.5),n.moveTo(y-.5,-.5),n.lineTo(y-.5,innerHeight),n.stroke();let c=u=>u%cn===0?y:u%ln===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let w=Math.floor(l/te)*te;for(let u=w;u<l+innerWidth;u+=te){let f=Math.round(u-l);if(f<y)continue;let P=c(u);n.moveTo(f,y-P),n.lineTo(f,y),P===y&&(n.fillStyle=i.muted,n.fillText(String(u),f+3,3))}n.stroke(),n.beginPath();let h=Math.floor(p/te)*te;for(let u=h;u<p+innerHeight;u+=te){let f=Math.round(u-p);if(f<y)continue;let P=c(u);n.moveTo(y-P,f),n.lineTo(y,f),P===y&&(n.save(),n.translate(3,f-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(u),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),y),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo(y,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let u of r.guides){let f=Math.round(ie(u));u.axis==="x"?n.fillRect(f-1,-.5,2,y):n.fillRect(-.5,f-1,y,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,y,y),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,y,y)}function L(){a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore();for(let c of r.pinned)N(c,i.accent);r.hover&&(m(r.hover),N(r.hover,r.pinned.length?le(i.accent,.7):i.accent));for(let c of r.guides){let w=r.liveGuide?.id===c.id;n.strokeStyle=c.locked||w?i.guide:le(i.guide,.55),n.lineWidth=c.pinned?2:1,n.setLineDash(c.locked?[]:[4,4]),n.beginPath();let h=Math.round(ie(c));if(c.axis==="x"?(n.moveTo(h,0),n.lineTo(h,innerHeight)):(n.moveTo(0,h),n.lineTo(innerWidth,h)),n.stroke(),r.activeGuide===c.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let u=7;c.axis==="x"?(n.moveTo(h,0),n.lineTo(h,u),n.moveTo(h,innerHeight-u),n.lineTo(h,innerHeight)):(n.moveTo(0,h),n.lineTo(u,h),n.moveTo(innerWidth-u,h),n.lineTo(innerWidth,h)),n.stroke()}}for(let c of r.lines)n.globalAlpha=c.faded?ft:1,C(c);n.globalAlpha=1;let l=r.lines.filter(c=>c.label!==""),p=l.map(c=>{let w=(c.x1+c.x2)/2,h=(c.y1+c.y2)/2,{w:u,h:f}=d(c.label);return c.axis==="x"?{x:w-u/2,y:h-16-f/2,w:u,h:f,axis:c.axis}:{x:w+26-u/2,y:h-f/2,w:u,h:f,axis:c.axis}});if(nt(p,{w:innerWidth,h:innerHeight},pe).forEach((c,w)=>{let h=l[w];n.globalAlpha=h.faded?ft:1,S(h.label,c.x,c.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:c,height:w}=r.hover;E(`${v(c)} \xD7 ${v(w)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let c=r.liveGuide,w=Math.round(ie(c));E([`${c.axis} ${v(c.at)}`,c.caught,c.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),c.axis==="x"?w+6:30,c.axis==="x"?30:w+6,i.guide)}r.rulers&&H()}function F(){a||(a=requestAnimationFrame(L))}return A(),{root:t,update(l){Object.assign(r,l),F()},resize(){A(),F()},destroy(){a&&cancelAnimationFrame(a),s.removeEventListener("change",g),e.remove()}}}var Ie="align-ui";function xt(e){try{return localStorage.getItem(e)}catch{return null}}function yt(e,t){try{localStorage.setItem(e,t)}catch{}}function bt(e){let t="/";try{t=location.pathname||"/"}catch{}return`${Ie}:${e}::${t}`}function un(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function vt(){let e=xt(bt("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(un).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function wt(e){yt(bt("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function kt(e){return xt(`${Ie}:${e}`)==="1"}function Et(e,t){yt(`${Ie}:${e}`,t?"1":"0")}var I,B=null,z=null,q=null,$=null,b=[],Ee=0,he=kt("rulers"),M=[],Gt=1,St=!1,re=null;function $t(){return M.find(e=>e.id===re)??null}function Q(e){M=e,wt(M)}var T=null,W=null,D=null,dn=3,ne=22;function Bt(e,t){return he?t<ne&&e>=ne?"y":e<ne&&t>=ne?"x":null:null}function He(e){return e.ctrlKey||e.metaKey}function At(e,t,o,n){let r=J(t,o,I),i=e.axis==="x"?t:o,a=M.filter(g=>g.id!==e.id).map(g=>({axis:g.axis,at:me(g).pos})),s=Ze(i,et(r,e.axis,a),n);e.at=s.at+(e.axis==="x"?scrollX:scrollY),e.caught=s.what}function Nt(e,t,o,n){let r={id:Gt++,axis:e,at:0,locked:!1,caught:"",pinned:!1};return At(r,t,o,n),Q([...M,r]),r}function Rt(e){e.pinned||(Q(M.filter(t=>t.id!==e.id)),W?.id===e.id&&(W=null),T?.id===e.id&&(T=null))}function pn(e){let t=I.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function me(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function Oe(){if(b.length<2)return[];let e=[];for(let[t,o]of Le(b))for(let n of be(t,o)){if(n.extension||!n.label)continue;let r=Ke(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:_e(r)})}return e}function R(e){let t=b[b.length-1],o=$&&b.some(m=>m.el===$.el),n=M.map(me),r=!T&&W?W:null,i=M.filter(m=>m.locked||m.id===r?.id),a=!r&&o?$.el:null,s=r??a,g=r?me(r):null,A=[],x=(m,C)=>{for(let d of m)A.push(s&&!C?{...d,faded:!0}:d)},N=m=>!g||m.axis!==g.axis?!1:(m.axis==="x"?[m.x1,m.x2]:[m.y1,m.y2]).some(d=>Math.abs(d-g.pos)<.5);for(let[m,C]of Le(b))x(be(m,C),m.el===a||C.el===a);t&&$&&!o&&!r&&x(be(t,$),!0);for(let m of i)for(let C of b)x(Be(C,[me(m)]),m.id===r?.id||C.el===a);$&&!o&&!r&&M.length&&x(Be($,n),!0);for(let m of tt(i.map(me),{x:innerWidth/2,y:innerHeight/2}))x([m],N(m));B?.update({hover:$,pinned:b,rulers:he,guides:M,liveGuide:T??W,activeGuide:re,lines:A,...e?{cursor:e}:{}}),q?.update(b.length)}var ke=null;function Ft(e){if(ke={x:e.clientX,y:e.clientY},T){D&&Math.hypot(e.clientX-D.x,e.clientY-D.y)>dn&&(D=null),!D&&!T.pinned&&(At(T,e.clientX,e.clientY,He(e)),Q([...M])),R({x:e.clientX,y:e.clientY});return}W=Ge(M,e.clientX,e.clientY),$=J(e.clientX,e.clientY,I),R({x:e.clientX,y:e.clientY})}function It(e){T&&(D?(T.locked=!T.locked,re=T.id,Q([...M])):(Bt(e.clientX,e.clientY)||e.clientX<ne||e.clientY<ne)&&Rt(T),D=null,T=null,R({x:e.clientX,y:e.clientY}))}function Pt(e){if(e.button!==0)return;let t=J(e.clientX,e.clientY,I);if(!t)return;let o=Bt(e.clientX,e.clientY);if(o){oe(e),D=null,T=Nt(o,e.clientX,e.clientY,He(e)),R({x:e.clientX,y:e.clientY});return}let n=Ge(M,e.clientX,e.clientY);if(n){oe(e),re=n.id,T=n,D={x:e.clientX,y:e.clientY},R({x:e.clientX,y:e.clientY});return}oe(e),q?.closeHelp(),b=[t],$=t,z?.show(t,Oe()),R({x:e.clientX,y:e.clientY})}function Ht(e){let t=J(e.clientX,e.clientY,I);if(!t)return;oe(e),q?.closeHelp();let o=b.findIndex(r=>r.el===t.el);b=o>=0?b.filter((r,i)=>i!==o):[...b,t],$=t;let n=b[b.length-1];n?z?.show(n,Oe()):z?.hide(),R({x:e.clientX,y:e.clientY})}function Ot(e){J(e.clientX,e.clientY,I)&&oe(e)}function Dt(e){J(e.clientX,e.clientY,I)&&oe(e)}function oe(e){e.preventDefault(),e.stopPropagation()}function Mt(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var Tt=0,Ct=0;function Yt(){Ee=requestAnimationFrame(Yt);let t=b.filter(a=>a.el.isConnected).map(a=>ye(a.el)),o=$&&$.el.isConnected?ye($.el):null;if(!(scrollX!==Tt||scrollY!==Ct||t.length!==b.length||t.some((a,s)=>!Mt(a,b[s]))||$===null!=(o===null)||$!==null&&o!==null&&!Mt($,o)))return;Tt=scrollX,Ct=scrollY,b=t,$=o;let i=b[b.length-1];i?z?.show(i,Oe()):z?.hide(),R()}function Wt(){B?.resize()}function mn(){St||(St=!0,M=vt().map(e=>({...e,id:Gt++}))),!B&&(st(),B=gt(),z=dt(B.root),q=ht(B.root),q.update(0),addEventListener("mousemove",Ft),addEventListener("mousedown",Pt,{capture:!0}),addEventListener("mouseup",It,{capture:!0}),addEventListener("click",Ot,{capture:!0}),addEventListener("auxclick",Dt,{capture:!0}),addEventListener("contextmenu",Ht,{capture:!0}),addEventListener("resize",Wt),Ee=requestAnimationFrame(Yt),R())}function Pe(){removeEventListener("mousemove",Ft),removeEventListener("mousedown",Pt,{capture:!0}),removeEventListener("mouseup",It,{capture:!0}),removeEventListener("click",Ot,{capture:!0}),removeEventListener("auxclick",Dt,{capture:!0}),removeEventListener("contextmenu",Ht,{capture:!0}),removeEventListener("resize",Wt),cancelAnimationFrame(Ee),Ee=0,q?.destroy(),q=null,z?.destroy(),z=null,B?.destroy(),B=null,lt(),$=null,b=[],T=null,D=null,W=null}function Lt(e){if(pn(e))e.preventDefault(),B?Pe():mn();else if(B&&ke&&(e.key.toLowerCase()===I.guideKeys.vertical||e.key.toLowerCase()===I.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===I.guideKeys.vertical?"x":"y";Nt(t,ke.x,ke.y,He(e)),R()}else if(B&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(Q(M.filter(t=>t.pinned)),W=null,T=null,D=null,M.some(t=>t.id===re)||(re=null)):W&&Rt(W),R();else if(B&&e.key.startsWith("Arrow")){let t=$t(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",Q([...M]),R()}else if(B&&e.key.toLowerCase()==="l"){let t=$t();if(!t)return;e.preventDefault(),t.pinned=!t.pinned,Q([...M]),R()}else if(B&&e.key.toLowerCase()===I.rulerKey)e.preventDefault(),he=!he,Et("rulers",he),R();else if(B&&e.key.toLowerCase()===I.panelKey)e.preventDefault(),z?.toggle();else if(e.key==="Escape"&&B){if(q?.closeHelp())return;b.length?(b=[],z?.hide(),R()):Pe()}}function Pn(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,I=qe(e),addEventListener("keydown",Lt,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{Pe(),removeEventListener("keydown",Lt,{capture:!0}),delete window.__align})}export{Pn as initAlign};
