function Ge(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function qe(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:Ge(r)})}return o}function Qt(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function Zt(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function Je(e,t){return t.length===0?"":Zt(e).map(o=>{let n=Qt(o,t);return n.length?`${o} ${n.join(" ")}`:`${o} \u2014`}).join("  \xB7  ")}function je(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(Ge)}function Ve(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),s=a.display.includes("flex")||a.display.includes("grid"),g=n==="x"?a.columnGap:a.rowGap,R=s&&g!=="normal"?Ge(g):null,[x,N,m,T]=je(e),[d,S,E,D]=je(t),L=p=>Number.isFinite(p)?p:0,I=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,l=n==="x"?I?L(N)+L(D):L(S)+L(T):I?L(m)+L(d):L(E)+L(x);return{px:o,cssGap:R,margins:l,siblings:!0}}function Qe(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function Ze(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}function Be(e){let t=e.trim().toLowerCase();return t?t.startsWith("#")||/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(t)?!0:["black","white","transparent","currentcolor"].includes(t):!1}var X;function Ue(e){if(X===void 0&&(X=document.createElement("canvas").getContext("2d")),!X)return"";X.fillStyle="#000000",X.fillStyle=e;let t=X.fillStyle;return X.fillStyle="#ffffff",X.fillStyle=e,t===X.fillStyle?String(t):""}function et(e,t){let o=Ue(e);return o?t.filter(n=>Be(n.value)&&Ue(n.value)===o).map(n=>n.name).sort():[]}function tt(e){let t=getComputedStyle(e),o=[],n=(r,i)=>{let a=i.trim();!a||a==="transparent"||/rgba?\([^)]*,\s*0\s*\)$/.test(a)||o.push({label:r,value:a})};return n("text",t.color),n("background",t.backgroundColor),o}var en={ignore:"",hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function ot(e={}){return{...en,...e}}var nt=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function rt(e){return e.ignore?`${nt}, ${e.ignore}`:nt}function v(e){return String(Math.round(e*100)/100)}function tn(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function we(e){let t=e.getBoundingClientRect();return{el:e,label:tn(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height}}function it(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function Q(e,t,o){let n=rt(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=it(r);return r&&r!==document.documentElement?we(r):null}var be=e=>parseFloat(e)||0;function at(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[be(n),be(r),be(i),be(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function nn(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function on(e,t){let o=t.left+t.width/2,n=t.top+t.height/2;return[{x1:e.left,y1:n,x2:t.left,y2:n,label:v(t.left-e.left),axis:"x"},{x1:t.right,y1:n,x2:e.right,y2:n,label:v(e.right-t.right),axis:"x"},{x1:o,y1:e.top,x2:o,y2:t.top,label:v(t.top-e.top),axis:"y"},{x1:o,y1:t.bottom,x2:o,y2:e.bottom,label:v(e.bottom-t.bottom),axis:"y"}]}function ve(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function ke(e,t){let o=[],n=e.left<t.right&&t.left<e.right,r=e.top<t.bottom&&t.top<e.bottom;if(n&&r){let[i,a]=nn(e,t);return on(i,a)}if(!n){let[i,a]=e.right<=t.left?[e,t]:[t,e],s=r?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:i.right,y1:s,x2:a.left,y2:s,label:`${v(a.left-i.right)}`,axis:"x"}),o.push(...ve(i.right,i.top,i.bottom,s,"x")),o.push(...ve(a.left,a.top,a.bottom,s,"x"))}if(!r){let[i,a]=e.bottom<=t.top?[e,t]:[t,e],s=n?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:s,y1:i.bottom,x2:s,y2:a.top,label:`${v(a.top-i.bottom)}`,axis:"y"}),o.push(...ve(i.bottom,i.left,i.right,s,"y")),o.push(...ve(a.top,a.left,a.right,s,"y"))}return o}function rn(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function Ae(e){let t=rn(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var an=5,sn=8;function se(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function Re(e,t,o){let n=null,r=an;for(let i of e){let a=Math.abs(se(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function st(e,t,o){if(o)return{at:e,what:""};let n=null,r=sn;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function lt(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function Ne(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,s=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:s,y2:i,label:v(r.gap),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,s=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:s,label:v(r.gap),axis:"y"})}}return o}function ct(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],s=r[i],g=s-a;g<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:s,y2:t.y,label:v(g),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:s,label:v(g),axis:"y"}))}}return o}var q=3;function ln(e,t){return e.x<t.x+t.w+q&&t.x<e.x+e.w+q&&e.y<t.y+t.h+q&&t.y<e.y+e.h+q}function ut(e,t,o=12){let n=(a,s)=>Math.min(Math.max(a,o),t.w-s-o),r=(a,s)=>Math.min(Math.max(a,o),t.h-s-o),i=[];for(let a of e){let s={...a,x:n(a.x,a.w),y:r(a.y,a.h)},g=!1;for(let R=0;R<16;R++){let x=i.find(m=>ln(m,s));if(!x)break;let N=s.axis==="x"?s.y:s.x;if(s.axis==="x"?s.y=r(g?x.y+x.h+q:x.y-s.h-q,s.h):s.x=n(g?x.x-s.w-q:x.x+x.w+q,s.w),(s.axis==="x"?s.y:s.x)===N){if(g)break;g=!0}}i.push(s)}return i}function cn(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(s=>parseFloat(s)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function dt(e){let t=1,o=1;for(let n=e;n;n=it(n)){let r=cn(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var W=(e,t)=>({light:e,dark:t}),Fe={accent:W("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:W("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:W("oklch(1 0 0)","oklch(0.264 0 0)"),fg:W("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:W("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:W("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:W("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:W("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)")};function mt(e){return`light-dark(${e.light}, ${e.dark})`}var ne=mt(W("#fafafa","#1a1a1a"));function le(e){return mt(W(`rgb(0 0 0 / ${e})`,`rgb(255 255 255 / ${e})`))}var pt=[0,.07,.08,.1,.12,.15,.2];function K(e){let t=pt[Math.max(0,Math.min(pt.length-1,e))];return t===0?ne:le(t)}var _={primary:le(.9),secondary:le(.6),tertiary:le(.4)},Ee=le(.12),ce="0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)",ft="0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)";var un='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',k={title:13,body:12,tag:11,stack:un},B={regular:400,medium:500,semibold:600},Ie="__align_font",dn="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function ht(){if(document.getElementById(Ie))return;let e=document.createElement("link");e.id=Ie,e.rel="stylesheet",e.href=dn,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function gt(){document.getElementById(Ie)?.remove()}function xt(e){let t=[`${B.medium} ${k.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function Oe(e){let t={};for(let o of Object.keys(Fe))t[o]=e?Fe[o].dark:Fe[o].light;return t}function yt(){return matchMedia("(prefers-color-scheme: dark)").matches}function ue(e,t){return e.replace(/\)$/,` / ${t})`)}var J=16,pn=`
.dock {
  /* On .dock, not :host \u2014 the host's inline all:initial outranks a :host rule,
     which would pin color-scheme to normal and resolve light-dark() to its
     light branch on a dark page. */
  color-scheme: light dark;
  position: fixed; left: ${J}px; top: 0; width: 340px;
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none; user-select: none;
  font-family: ${k.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${_.primary};
  --muted: ${_.secondary};
  --border: ${Ee};
}
.panel {
  padding: 10px; border-radius: 0;
  font-size: ${k.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${ne};

  box-shadow: ${ce};

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
.dock[data-dragging] .panel { box-shadow: ${ft}; }
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${k.title}px; font-weight: ${B.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${k.body}px; font-weight: ${B.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${k.tag}px; font-weight: ${B.medium};
  margin-left: 4px;
  color: ${_.primary};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${k.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${K(1)}; }

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
.region[data-level="1"] { background: ${K(1)}; }
.region[data-level="2"] { background: ${K(2)}; }
.region[data-level="3"] { background: ${K(3)}; }
.content { background: ${K(4)}; }

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
  font-size: ${k.tag}px; font-weight: ${B.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${B.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${B.regular}; }
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
  text-align: center; font-weight: ${B.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,de=J,Z=-1,pe=!1;function bt(e){let t=document.createElement("style");t.textContent=pn,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);function r(d,S){let E=document.createElement("div");E.className="readout";let D=document.createElement("div");D.className="tag readout-tag",D.textContent=d,E.appendChild(D);for(let[L,I]of S){let l=document.createElement("div");l.className="readout-row";let p=document.createElement("span");p.className="readout-key",p.textContent=L;let c=document.createElement("span");c.className="readout-value",c.textContent=I,l.append(p,c),E.appendChild(l)}return E}e.appendChild(o);let i=(d,S)=>Math.min(Math.max(d,J),Math.max(J,S-J));function a(){let d=o.offsetHeight||300;Z<0&&(Z=Math.max(J,innerHeight-d-J)),de=i(de,innerWidth-o.offsetWidth),Z=i(Z,innerHeight-d),o.style.transform=`translate(${de-J}px, ${Z}px)`}let s=null;function g(d){d.button===0&&(d.preventDefault(),d.stopPropagation(),s={x:d.clientX,y:d.clientY,dx:de,dy:Z},o.setAttribute("data-dragging",""),d.currentTarget.setPointerCapture(d.pointerId))}function R(d){s&&(de=s.dx+(d.clientX-s.x),Z=s.dy+(d.clientY-s.y),a())}function x(){s=null,o.removeAttribute("data-dragging")}addEventListener("resize",a);let N=null;function m(d){let S=document.createElement("div");return S.className="edge",S.textContent=d===0?"0":v(d),d===0&&S.setAttribute("data-zero",""),S}function T(d,S,E,D){let[L,I,l,p]=E,c=document.createElement("div");c.className="region",c.setAttribute("data-level",String(S));let w=document.createElement("span");w.className="tag",w.textContent=d;let f=document.createElement("div");f.className="row";let u=document.createElement("div");u.className="fill",u.appendChild(D),f.append(m(p),u,m(I));let h=document.createElement("div");return h.className="head",h.append(w,m(L)),c.append(h,f,m(l)),c}return{show(d,S=[]){let E=at(d.el),[D,L,I,l]=E.border,[p,c,w,f]=E.padding,u=dt(d.el),h=d.width/u.x,P=d.height/u.y,Vt=Math.abs(u.x-1)>.001||Math.abs(u.y-1)>.001,j=document.createElement("header"),Me=document.createElement("span");Me.className="name",Me.textContent=d.label;let Te=document.createElement("span");Te.className="size",Te.textContent=`${v(h)} \xD7 ${v(P)}`;let te=document.createElement("button");if(te.className="close",te.textContent="\xD7",te.title="close (B brings it back)",te.addEventListener("pointerdown",G=>G.stopPropagation()),te.addEventListener("click",G=>{G.stopPropagation(),pe=!0,o.removeAttribute("data-open")}),j.append(Me,Te),Vt){let G=document.createElement("span");G.className="scale",G.textContent=`\xD7${v(u.x)}`,G.title=`renders at ${v(d.width)} \xD7 ${v(d.height)}`,j.appendChild(G)}j.appendChild(te),j.addEventListener("pointerdown",g),j.addEventListener("pointermove",R),j.addEventListener("pointerup",x),j.addEventListener("pointercancel",x);let Le=document.createElement("div");Le.className="content",Le.textContent=`${v(h-l-L-f-c)} \xD7 ${v(P-D-I-p-w)}`;let xe=[j,T("margin",1,E.margin,T("border",2,E.border,T("padding",3,E.padding,Le)))];if(S.length){let G=S.map(U=>[v(U.px),U.detail]),ye=Ze(S.map(U=>U.px));ye&&G.push(["",ye]),xe.push(r("gaps",G))}let ze=qe(d.el),Xe=Je([h,P,...E.margin,...E.border,...E.padding],ze);Xe&&xe.push(r("tokens",[["",Xe]]));let Ke=ze.filter(G=>Be(G.value));if(Ke.length){let G=tt(d.el).map(({label:ye,value:U})=>{let _e=et(U,Ke);return[ye,_e.length?`${U}  ${_e.join(" ")}`:`${U}  \u2014`]});G.length&&xe.push(r("colour",G))}n.replaceChildren(...xe),N=d,a(),!pe&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},hide(){N=null,o.removeAttribute("data-open")},toggle(){N&&(pe=!pe,pe?o.removeAttribute("data-open"):(a(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",a),o.remove(),t.remove()}}}var mn=[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure what is under the cursor"],["Click","lock an element"],["Right-click","add to, or drop from, the locked set"],["Drag the panel header","move the box model"],["B","hide or bring back the box model"],["R","rulers down the top and left edges"],["Drag from a rule","pull out a guide; drag it back to remove"],["V","vertical guide at the cursor"],["H","horizontal guide at the cursor"],["Hover a guide","distance from it to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the last guide you touched; Shift for 10px"],["L","pin that guide so it cannot be moved or deleted"],["Ctrl/Cmd while placing","ignore snapping"],["Del","remove the guide under the cursor; Shift+Del for all"],["Esc","clear the locks, then close"]],me=16,vt=k.tag+12,wt=8,fn=`
.flag {
  position: fixed; top: ${me}px; right: ${me}px;
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${k.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${k.tag}px; font-weight: ${B.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${_.primary};
  background: ${ne};
  box-shadow: ${ce};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
.flag:hover { background: ${K(1)}; }
.flag .count { color: ${_.secondary}; }
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: ${me+vt+wt}px; right: ${me}px; width: 292px;
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${me*2+vt+wt}px); overflow-y: auto;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${k.stack};
  font-synthesis: none;
  font-size: ${k.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color-scheme: light dark;
  color: ${_.primary};
  background: ${ne};
  box-shadow: ${ce};
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
  font: inherit; font-weight: ${B.medium};
  border: 1px solid ${Ee};
  background: ${K(2)};
}
.help dd { margin: 0; color: ${_.secondary}; }
`;function kt(e){let t=document.createElement("style");t.textContent=fn,e.appendChild(t);let o=document.createElement("div");o.className="flag";let n=document.createElement("span");n.className="name",n.textContent="Align";let r=document.createElement("span");r.className="count",o.append(n,r);let i=document.createElement("div");i.className="help";let a=document.createElement("dl");for(let[s,g]of mn){let R=document.createElement("dt"),x=document.createElement("kbd");x.textContent=s,R.appendChild(x);let N=document.createElement("dd");N.textContent=g,a.append(R,N)}return i.appendChild(a),o.addEventListener("click",s=>{s.stopPropagation(),i.toggleAttribute("data-open")}),e.append(o,i),{update(s){r.textContent=s>0?`${s} locked`:""},closeHelp(){let s=i.hasAttribute("data-open");return i.removeAttribute("data-open"),s},destroy(){o.remove(),i.remove(),t.remove()}}}var Se=5,Pe=4,fe=12,Et=.22,y=22,oe=10,hn=50,gn=100;function St(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,guides:[],liveGuide:null,activeGuide:null},i=Oe(yt()),a=0,s=matchMedia("(prefers-color-scheme: dark)"),g=()=>{i=Oe(s.matches),I()};s.addEventListener("change",g),xt(()=>I());function R(){let l=devicePixelRatio;o.width=Math.round(innerWidth*l),o.height=Math.round(innerHeight*l),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(l,0,0,l,0,0),n.translate(.5,.5)}let x=l=>Math.round(l)-.5;function N(l,p){n.strokeStyle=p,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(l.left),Math.round(l.top),Math.round(l.width),Math.round(l.height))}function m(l){n.strokeStyle=ue(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let p of[l.left,l.right])n.moveTo(Math.round(p),0),n.lineTo(Math.round(p),innerHeight);for(let p of[l.top,l.bottom])n.moveTo(0,Math.round(p)),n.lineTo(innerWidth,Math.round(p));n.stroke(),n.setLineDash([])}function T(l){if(n.strokeStyle=l.extension?ue(i.measure,.55):i.measure,n.lineWidth=1,n.setLineDash(l.extension?[3,3]:[]),n.beginPath(),n.moveTo(Math.round(l.x1),Math.round(l.y1)),n.lineTo(Math.round(l.x2),Math.round(l.y2)),l.extension){n.stroke();return}if(l.axis==="x")for(let p of[l.x1,l.x2])n.moveTo(Math.round(p),Math.round(l.y1)-Se),n.lineTo(Math.round(p),Math.round(l.y1)+Se);else for(let p of[l.y1,l.y2])n.moveTo(Math.round(l.x1)-Se,Math.round(p)),n.lineTo(Math.round(l.x1)+Se,Math.round(p));n.stroke()}function d(l){return n.font=`${B.medium} ${k.body}px ${k.stack}`,{w:n.measureText(l).width+Pe*2,h:k.body+Pe*2+2}}function S(l,p,c,w){n.font=`${B.medium} ${k.body}px ${k.stack}`,n.textBaseline="middle";let{w:f,h:u}=d(l),h=x(Math.min(Math.max(p,fe),innerWidth-f-fe)),P=x(Math.min(Math.max(c,fe),innerHeight-u-fe));n.fillStyle=w,n.beginPath(),n.roundRect(h,P,Math.ceil(f),u,4),n.fill(),n.fillStyle=i.surface,n.fillText(l,h+Pe,P+u/2)}function E(l,p,c,w,f=!1){let{w:u,h}=d(l);S(l,f?p-u/2:p,f?c-h/2:c,w)}function D(){let l=scrollX,p=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,y),n.fillRect(-.5,-.5,y,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${B.regular} 9px ${k.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let u of r.pinned)n.fillRect(x(u.left),-.5,Math.round(u.width),y),n.fillRect(-.5,x(u.top),y,Math.round(u.height));n.restore(),n.beginPath(),n.moveTo(-.5,y-.5),n.lineTo(innerWidth,y-.5),n.moveTo(y-.5,-.5),n.lineTo(y-.5,innerHeight),n.stroke();let c=u=>u%gn===0?y:u%hn===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let w=Math.floor(l/oe)*oe;for(let u=w;u<l+innerWidth;u+=oe){let h=Math.round(u-l);if(h<y)continue;let P=c(u);n.moveTo(h,y-P),n.lineTo(h,y),P===y&&(n.fillStyle=i.muted,n.fillText(String(u),h+3,3))}n.stroke(),n.beginPath();let f=Math.floor(p/oe)*oe;for(let u=f;u<p+innerHeight;u+=oe){let h=Math.round(u-p);if(h<y)continue;let P=c(u);n.moveTo(y-P,h),n.lineTo(y,h),P===y&&(n.save(),n.translate(3,h-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(u),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),y),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo(y,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let u of r.guides){let h=Math.round(se(u));u.axis==="x"?n.fillRect(h-1,-.5,2,y):n.fillRect(-.5,h-1,y,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,y,y),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,y,y)}function L(){a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore();for(let c of r.pinned)N(c,i.accent);r.hover&&(m(r.hover),N(r.hover,r.pinned.length?ue(i.accent,.7):i.accent));for(let c of r.guides){let w=r.liveGuide?.id===c.id;n.strokeStyle=c.locked||w?i.guide:ue(i.guide,.55),n.lineWidth=c.pinned?2:1,n.setLineDash(c.locked?[]:[4,4]),n.beginPath();let f=Math.round(se(c));if(c.axis==="x"?(n.moveTo(f,0),n.lineTo(f,innerHeight)):(n.moveTo(0,f),n.lineTo(innerWidth,f)),n.stroke(),r.activeGuide===c.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let u=7;c.axis==="x"?(n.moveTo(f,0),n.lineTo(f,u),n.moveTo(f,innerHeight-u),n.lineTo(f,innerHeight)):(n.moveTo(0,f),n.lineTo(u,f),n.moveTo(innerWidth-u,f),n.lineTo(innerWidth,f)),n.stroke()}}for(let c of r.lines)n.globalAlpha=c.faded?Et:1,T(c);n.globalAlpha=1;let l=r.lines.filter(c=>c.label!==""),p=l.map(c=>{let w=(c.x1+c.x2)/2,f=(c.y1+c.y2)/2,{w:u,h}=d(c.label);return c.axis==="x"?{x:w-u/2,y:f-16-h/2,w:u,h,axis:c.axis}:{x:w+26-u/2,y:f-h/2,w:u,h,axis:c.axis}});if(ut(p,{w:innerWidth,h:innerHeight},fe).forEach((c,w)=>{let f=l[w];n.globalAlpha=f.faded?Et:1,S(f.label,c.x,c.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:c,height:w}=r.hover;E(`${v(c)} \xD7 ${v(w)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let c=r.liveGuide,w=Math.round(se(c));E([`${c.axis} ${v(c.at)}`,c.caught,c.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),c.axis==="x"?w+6:30,c.axis==="x"?30:w+6,i.guide)}r.rulers&&D()}function I(){a||(a=requestAnimationFrame(L))}return R(),{root:t,update(l){Object.assign(r,l),I()},resize(){R(),I()},destroy(){a&&cancelAnimationFrame(a),s.removeEventListener("change",g),e.remove()}}}var De="align-ui";function $t(e){try{return localStorage.getItem(e)}catch{return null}}function Ct(e,t){try{localStorage.setItem(e,t)}catch{}}function Mt(e){let t="/";try{t=location.pathname||"/"}catch{}return`${De}:${e}::${t}`}function xn(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function Tt(){let e=$t(Mt("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(xn).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function Lt(e){Ct(Mt("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function Gt(e){return $t(`${De}:${e}`)==="1"}function Bt(e,t){Ct(`${De}:${e}`,t?"1":"0")}var O,A=null,z=null,V=null,$=null,b=[],Ce=0,ge=Gt("rulers"),C=[],Pt=1,At=!1,ae=null;function Rt(){return C.find(e=>e.id===ae)??null}function ee(e){C=e,Lt(C)}var M=null,Y=null,H=null,yn=3,re=22;function Dt(e,t){return ge?t<re&&e>=re?"y":e<re&&t>=re?"x":null:null}function We(e){return e.ctrlKey||e.metaKey}function Ht(e,t,o,n){let r=Q(t,o,O),i=e.axis==="x"?t:o,a=C.filter(g=>g.id!==e.id).map(g=>({axis:g.axis,at:he(g).pos})),s=st(i,lt(r,e.axis,a),n);e.at=s.at+(e.axis==="x"?scrollX:scrollY),e.caught=s.what}function Wt(e,t,o,n){let r={id:Pt++,axis:e,at:0,locked:!1,caught:"",pinned:!1};return Ht(r,t,o,n),ee([...C,r]),r}function Yt(e){e.pinned||(ee(C.filter(t=>t.id!==e.id)),Y?.id===e.id&&(Y=null),M?.id===e.id&&(M=null))}function bn(e){let t=O.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function he(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function Ye(){if(b.length<2)return[];let e=[];for(let[t,o]of Ae(b))for(let n of ke(t,o)){if(n.extension||!n.label)continue;let r=Ve(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:Qe(r)})}return e}function F(e){let t=b[b.length-1],o=$&&b.some(m=>m.el===$.el),n=C.map(he),r=!M&&Y?Y:null,i=C.filter(m=>m.locked||m.id===r?.id),a=!r&&o?$.el:null,s=r??a,g=r?he(r):null,R=[],x=(m,T)=>{for(let d of m)R.push(s&&!T?{...d,faded:!0}:d)},N=m=>!g||m.axis!==g.axis?!1:(m.axis==="x"?[m.x1,m.x2]:[m.y1,m.y2]).some(d=>Math.abs(d-g.pos)<.5);for(let[m,T]of Ae(b))x(ke(m,T),m.el===a||T.el===a);t&&$&&!o&&!r&&x(ke(t,$),!0);for(let m of i)for(let T of b)x(Ne(T,[he(m)]),m.id===r?.id||T.el===a);$&&!o&&!r&&C.length&&x(Ne($,n),!0);for(let m of ct(i.map(he),{x:innerWidth/2,y:innerHeight/2}))x([m],N(m));A?.update({hover:$,pinned:b,rulers:ge,guides:C,liveGuide:M??Y,activeGuide:ae,lines:R,...e?{cursor:e}:{}}),V?.update(b.length)}var $e=null;function zt(e){if($e={x:e.clientX,y:e.clientY},M){H&&Math.hypot(e.clientX-H.x,e.clientY-H.y)>yn&&(H=null),!H&&!M.pinned&&(Ht(M,e.clientX,e.clientY,We(e)),ee([...C])),F({x:e.clientX,y:e.clientY});return}Y=Re(C,e.clientX,e.clientY),$=Q(e.clientX,e.clientY,O),F({x:e.clientX,y:e.clientY})}function Xt(e){M&&(H?(M.locked=!M.locked,ae=M.id,ee([...C])):(Dt(e.clientX,e.clientY)||e.clientX<re||e.clientY<re)&&Yt(M),H=null,M=null,F({x:e.clientX,y:e.clientY}))}function Kt(e){if(e.button!==0)return;let t=Q(e.clientX,e.clientY,O);if(!t)return;let o=Dt(e.clientX,e.clientY);if(o){ie(e),H=null,M=Wt(o,e.clientX,e.clientY,We(e)),F({x:e.clientX,y:e.clientY});return}let n=Re(C,e.clientX,e.clientY);if(n){ie(e),ae=n.id,M=n,H={x:e.clientX,y:e.clientY},F({x:e.clientX,y:e.clientY});return}ie(e),V?.closeHelp(),b=[t],$=t,z?.show(t,Ye()),F({x:e.clientX,y:e.clientY})}function _t(e){let t=Q(e.clientX,e.clientY,O);if(!t)return;ie(e),V?.closeHelp();let o=b.findIndex(r=>r.el===t.el);b=o>=0?b.filter((r,i)=>i!==o):[...b,t],$=t;let n=b[b.length-1];n?z?.show(n,Ye()):z?.hide(),F({x:e.clientX,y:e.clientY})}function jt(e){Q(e.clientX,e.clientY,O)&&ie(e)}function Ut(e){Q(e.clientX,e.clientY,O)&&ie(e)}function ie(e){e.preventDefault(),e.stopPropagation()}function Nt(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var Ft=0,It=0;function qt(){Ce=requestAnimationFrame(qt);let t=b.filter(a=>a.el.isConnected).map(a=>we(a.el)),o=$&&$.el.isConnected?we($.el):null;if(!(scrollX!==Ft||scrollY!==It||t.length!==b.length||t.some((a,s)=>!Nt(a,b[s]))||$===null!=(o===null)||$!==null&&o!==null&&!Nt($,o)))return;Ft=scrollX,It=scrollY,b=t,$=o;let i=b[b.length-1];i?z?.show(i,Ye()):z?.hide(),F()}function Jt(){A?.resize()}function vn(){At||(At=!0,C=Tt().map(e=>({...e,id:Pt++}))),!A&&(ht(),A=St(),z=bt(A.root),V=kt(A.root),V.update(0),addEventListener("mousemove",zt),addEventListener("mousedown",Kt,{capture:!0}),addEventListener("mouseup",Xt,{capture:!0}),addEventListener("click",jt,{capture:!0}),addEventListener("auxclick",Ut,{capture:!0}),addEventListener("contextmenu",_t,{capture:!0}),addEventListener("resize",Jt),Ce=requestAnimationFrame(qt),F())}function He(){removeEventListener("mousemove",zt),removeEventListener("mousedown",Kt,{capture:!0}),removeEventListener("mouseup",Xt,{capture:!0}),removeEventListener("click",jt,{capture:!0}),removeEventListener("auxclick",Ut,{capture:!0}),removeEventListener("contextmenu",_t,{capture:!0}),removeEventListener("resize",Jt),cancelAnimationFrame(Ce),Ce=0,V?.destroy(),V=null,z?.destroy(),z=null,A?.destroy(),A=null,gt(),$=null,b=[],M=null,H=null,Y=null}function Ot(e){if(bn(e))e.preventDefault(),A?He():vn();else if(A&&$e&&(e.key.toLowerCase()===O.guideKeys.vertical||e.key.toLowerCase()===O.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===O.guideKeys.vertical?"x":"y";Wt(t,$e.x,$e.y,We(e)),F()}else if(A&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(ee(C.filter(t=>t.pinned)),Y=null,M=null,H=null,C.some(t=>t.id===ae)||(ae=null)):Y&&Yt(Y),F();else if(A&&e.key.startsWith("Arrow")){let t=Rt(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",ee([...C]),F()}else if(A&&e.key.toLowerCase()==="l"){let t=Rt();if(!t)return;e.preventDefault(),t.pinned=!t.pinned,ee([...C]),F()}else if(A&&e.key.toLowerCase()===O.rulerKey)e.preventDefault(),ge=!ge,Bt("rulers",ge),F();else if(A&&e.key.toLowerCase()===O.panelKey)e.preventDefault(),z?.toggle();else if(e.key==="Escape"&&A){if(V?.closeHelp())return;b.length?(b=[],z?.hide(),F()):He()}}function Xn(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,O=ot(e),addEventListener("keydown",Ot,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{He(),removeEventListener("keydown",Ot,{capture:!0}),delete window.__align})}export{Xn as initAlign};
