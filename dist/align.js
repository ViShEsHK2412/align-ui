function fe(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function An(e){return(e.split(",")[0]??"").trim().replace(/^['"]|['"]$/g,"")}function Nn(e){let o={100:"thin",200:"extralight",300:"light",400:"regular",500:"medium",600:"semibold",700:"bold",800:"extrabold",900:"black"}[e.trim()];return o?`${e} ${o}`:e}function Ge(e){let t=getComputedStyle(e);return[{label:"family",value:An(t.fontFamily),px:NaN},{label:"size",value:t.fontSize,px:fe(t.fontSize)},{label:"weight",value:Nn(t.fontWeight),px:NaN},{label:"line",value:t.lineHeight,px:fe(t.lineHeight)},{label:"tracking",value:t.letterSpacing,px:fe(t.letterSpacing)}]}function $t(e){let t="";for(let o of e.childNodes)o.nodeType===3&&(t+=o.nodeValue??"");return t.trim().replace(/\s+/g," ")}function Ct(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:fe(r)})}return o}function Bn(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function Dn(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function Tt(e,t){return t.length===0?"":Dn(e).map(o=>{let n=Bn(o,t);return n.length?`${o} ${n.join(" ")}`:`${o} \u2014`}).join("  \xB7  ")}function St(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(fe)}function Mt(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),l=a.display.includes("flex")||a.display.includes("grid"),c=n==="x"?a.columnGap:a.rowGap,y=l&&c!=="normal"?fe(c):null,[d,g,u,S]=St(e),[A,m,M,L]=St(t),G=I=>Number.isFinite(I)?I:0,W=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,K=n==="x"?W?G(g)+G(L):G(m)+G(S):W?G(u)+G(A):G(M)+G(d);return{px:o,cssGap:y,margins:K,siblings:!0}}function Lt(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function Rt(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}function Ue(e){let t=e.trim().toLowerCase();return t?t.startsWith("#")||/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(t)?!0:["black","white","transparent","currentcolor"].includes(t):!1}var Q;function Et(e){if(Q===void 0&&(Q=document.createElement("canvas").getContext("2d")),!Q)return"";Q.fillStyle="#000000",Q.fillStyle=e;let t=Q.fillStyle;return Q.fillStyle="#ffffff",Q.fillStyle=e,t===Q.fillStyle?String(t):""}function Gt(e,t){let o=Et(e);return o?t.filter(n=>Ue(n.value)&&Et(n.value)===o).map(n=>n.name).sort():[]}function At(e){let t=getComputedStyle(e),o=[],n=(r,i)=>{let a=i.trim();!a||a==="transparent"||/rgba?\([^)]*,\s*0\s*\)$/.test(a)||o.push({label:r,value:a})};return n("text",t.color),n("background",t.backgroundColor),o}function In(e,t,o){let n=r=>typeof CSS<"u"&&CSS.escape?CSS.escape(r):r.replace(/[^\w-]/g,"\\$&");return t?`#${n(t)}`:o.length?e+o.map(r=>`.${n(r)}`).join(""):e}function qe(e){let t=typeof e.className=="string"?e.className.trim().split(/\s+/).filter(Boolean):[];return In(e.tagName.toLowerCase(),e.id,t)}function Nt(e){let t=qe(e);if(!/[.#]/.test(t))return 0;try{return document.querySelectorAll(t).length}catch{return 0}}function Pn(e){if(!e)return"inline <style>";let t=e.split("?")[0]??e;try{let o=new URL(t,"http://x").pathname;return decodeURI(o).replace(/^\//,"")||t}catch{return t}}var On=["width","height","padding","margin","border-width","gap","font-size","line-height","letter-spacing","color","background-color"];function zn(e){for(let t=0;t<e.length;t+=1){let o=e.item(t);if(On.some(n=>o===n||o.startsWith(`${n}-`)))return!0}return!1}function Bt(e){let t=[],o=new Set,n=(r,i)=>{for(let a of Array.from(r)){if(a instanceof CSSMediaRule){matchMedia(a.conditionText).matches&&n(a.cssRules,i);continue}if(a instanceof CSSSupportsRule){CSS.supports(a.conditionText)&&n(a.cssRules,i);continue}let l=a.cssRules;if(l&&!(a instanceof CSSStyleRule)){n(l,i);continue}if(!(a instanceof CSSStyleRule))continue;let c=!1;try{c=e.matches(a.selectorText)}catch{continue}if(!c||!zn(a.style))continue;let y=`${a.selectorText}|${i}`;o.has(y)||(o.add(y),t.push({selector:a.selectorText,file:i}))}};for(let r of Array.from(document.styleSheets)){if(r.ownerNode instanceof Element&&r.ownerNode.hasAttribute("data-align-ignore"))continue;let i;try{i=r.cssRules}catch{continue}n(i,Pn(r.href))}return t.reverse()}var Fn={ignore:"",grid:null,hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function It(e={}){return{...Fn,...e}}var Dt=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function Pt(e){return e.ignore?`${Dt}, ${e.ignore}`:Dt}function w(e){return String(Math.round(e*100)/100)}function Hn(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function Be(e){let t=e.getBoundingClientRect();return{el:e,label:Hn(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height,scale:Ie(e)}}function Ot(e,t){let o=(n,r)=>Math.abs(n-r)<.001;return o(e.scale.x,t.scale.x)&&o(e.scale.y,t.scale.y)?e.scale:{x:1,y:1}}function zt(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function se(e,t,o){let n=Pt(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=zt(r);return r&&r!==document.documentElement?Be(r):null}var Ae=e=>parseFloat(e)||0;function Ve(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[Ae(n),Ae(r),Ae(i),Ae(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function Wn(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function Xn(e,t){let o=Ot(e,t),n=t.left+t.width/2,r=t.top+t.height/2;return[{x1:e.left,y1:r,x2:t.left,y2:r,label:w((t.left-e.left)/o.x),axis:"x"},{x1:t.right,y1:r,x2:e.right,y2:r,label:w((e.right-t.right)/o.x),axis:"x"},{x1:n,y1:e.top,x2:n,y2:t.top,label:w((t.top-e.top)/o.y),axis:"y"},{x1:n,y1:t.bottom,x2:n,y2:e.bottom,label:w((e.bottom-t.bottom)/o.y),axis:"y"}]}function Ne(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function De(e,t){let o=[],n=Ot(e,t),r=e.left<t.right&&t.left<e.right,i=e.top<t.bottom&&t.top<e.bottom;if(r&&i){let[a,l]=Wn(e,t);return Xn(a,l)}if(!r){let[a,l]=e.right<=t.left?[e,t]:[t,e],c=i?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:a.right,y1:c,x2:l.left,y2:c,label:`${w((l.left-a.right)/n.x)}`,axis:"x"}),o.push(...Ne(a.right,a.top,a.bottom,c,"x")),o.push(...Ne(l.left,l.top,l.bottom,c,"x"))}if(!i){let[a,l]=e.bottom<=t.top?[e,t]:[t,e],c=r?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:c,y1:a.bottom,x2:c,y2:l.top,label:`${w((l.top-a.bottom)/n.y)}`,axis:"y"}),o.push(...Ne(a.bottom,a.left,a.right,c,"y")),o.push(...Ne(l.top,l.left,l.right,c,"y"))}return o}function Yn(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function Je(e){let t=Yn(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var Kn=5,_n=8;function Ee(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function Qe(e,t,o){let n=null,r=Kn;for(let i of e){let a=Math.abs(Ee(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function Ft(e,t,o){if(o)return{at:e,what:""};let n=null,r=_n;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function Ht(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function Ze(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,l=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:l,y2:i,label:w(r.gap),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,l=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:l,label:w(r.gap),axis:"y"})}}return o}function Wt(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],l=r[i],c=l-a;c<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:l,y2:t.y,label:w(c),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:l,label:w(c),axis:"y"}))}}return o}var te=3;function jn(e,t){return e.x<t.x+t.w+te&&t.x<e.x+e.w+te&&e.y<t.y+t.h+te&&t.y<e.y+e.h+te}function Xt(e,t,o=12){let n=(a,l)=>Math.min(Math.max(a,o),t.w-l-o),r=(a,l)=>Math.min(Math.max(a,o),t.h-l-o),i=[];for(let a of e){let l={...a,x:n(a.x,a.w),y:r(a.y,a.h)},c=!1;for(let y=0;y<16;y++){let d=i.find(u=>jn(u,l));if(!d)break;let g=l.axis==="x"?l.y:l.x;if(l.axis==="x"?l.y=r(c?d.y+d.h+te:d.y-l.h-te,l.h):l.x=n(c?d.x-l.w-te:d.x+d.w+te,l.w),(l.axis==="x"?l.y:l.x)===g){if(c)break;c=!0}}i.push(l)}return i}function Yt(e,t){let{columns:o,gutter:n,margin:r}=e;if(o<=0)return[];let i=e.maxWidth>0?Math.min(e.maxWidth,t):t,a=Math.max(0,(t-i)/2),c=(Math.max(0,i-r*2)-n*(o-1))/o;if(c<=0)return[];let y=[];for(let d=0;d<o;d+=1)y.push({left:a+r+d*(c+n),width:c});return y}function Kt(e,t){return e*t>=8?e:0}function Un(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(l=>parseFloat(l)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function Ie(e){let t=1,o=1;for(let n=e;n;n=zt(n)){let r=Un(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var j=(e,t)=>({light:e,dark:t}),et={accent:j("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:j("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:j("oklch(1 0 0)","oklch(0.264 0 0)"),fg:j("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:j("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:j("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:j("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:j("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)"),pixelLine:j("oklch(0.205 0 0 / 0.14)","oklch(0.97 0 0 / 0.14)")};function jt(e){return`light-dark(${e.light}, ${e.dark})`}var Z=jt(j("#fafafa","#1a1a1a"));function $e(e){return jt(j(`rgb(0 0 0 / ${e})`,`rgb(255 255 255 / ${e})`))}var _t=[0,.07,.08,.1,.12,.15,.2];function Y(e){let t=_t[Math.max(0,Math.min(_t.length-1,e))];return t===0?Z:$e(t)}var N={primary:$e(.9),secondary:$e(.6),tertiary:$e(.4)},ne=$e(.12),ce="0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)",Ut="0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)",b=22;var qn='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',k={title:13,body:12,tag:11,stack:qn},O={regular:400,medium:500,semibold:600},tt="__align_font",Vn="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function qt(){if(document.getElementById(tt))return;let e=document.createElement("link");e.id=tt,e.rel="stylesheet",e.href=Vn,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function Vt(){document.getElementById(tt)?.remove()}function Jt(e){let t=[`${O.medium} ${k.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function nt(e){let t={};for(let o of Object.keys(et))t[o]=e?et[o].dark:et[o].light;return t}function ot(){let e=document.documentElement,t=getComputedStyle(e).colorScheme;if(/dark/.test(t)&&!/light/.test(t))return!0;if(/light/.test(t)&&!/dark/.test(t))return!1;for(let o of[document.body,e]){if(!o)continue;let n=Jn(getComputedStyle(o).backgroundColor);if(n!==null)return n<.5}return matchMedia("(prefers-color-scheme: dark)").matches}function Jn(e){let t=/^rgba?\(([^)]+)\)$/.exec(e.trim());if(!t)return null;let o=t[1].split(/[\s,/]+/).filter(Boolean).map(Number),[n,r,i,a=1]=o;return n===void 0||r===void 0||i===void 0||a<.5?null:(.2126*n+.7152*r+.0722*i)/255}function he(e,t){return e.replace(/\)$/,` / ${t})`)}var Qn=`
`,ee=16,Zn=`
.dock {
  /* No color-scheme here: the overlay sets it inline on the shadow host, from
     what the page actually looks like rather than what the machine prefers, and
     it inherits down. Declaring 'light dark' again would undo that and hand
     light-dark() back to the media query. */
  position: fixed; left: ${ee}px; top: 0; width: 340px;
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none; user-select: none;
  font-family: ${k.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${N.primary};
  --muted: ${N.secondary};
  --border: ${ne};
}
.panel {
  padding: 10px; border-radius: 0;
  /* Five sections now \u2014 box, tokens, styled by, matches, colour \u2014 and on a
     laptop that is taller than the window. place() clamps the position but
     cannot rescue a panel taller than the screen, so it scrolls instead. */
  max-height: calc(100vh - ${ee*2}px);
  overflow-y: auto; overscroll-behavior: contain;
  font-size: ${k.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${Z};

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
  /* Stays put while the body scrolls: it is also the drag handle, and a handle
     you have to scroll back up to find is not a handle. */
  position: sticky; top: -10px; z-index: 1;
  background: ${Z};
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] .panel { box-shadow: ${Ut}; }
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${k.title}px; font-weight: ${O.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${k.body}px; font-weight: ${O.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${k.tag}px; font-weight: ${O.medium};
  margin-left: 4px;
  color: ${N.primary};
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
  font-size: ${k.tag}px; font-weight: ${O.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${O.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${O.regular}; }
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
  text-align: center; font-weight: ${O.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,Ce=ee,ue=-1,ge=!1;function Qt(e){let t=document.createElement("style");t.textContent=Zn,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);let r=!1;function i(m,M){let L=document.createElement("div");L.className="readout";let G=document.createElement("div");G.className="tag readout-tag",G.textContent=m,L.appendChild(G);for(let[W,K]of M){let I=document.createElement("div");I.className="readout-row";let X=document.createElement("span");X.className="readout-key",X.textContent=W;let s=document.createElement("span");s.className="readout-value",s.textContent=K,I.append(X,s),L.appendChild(I)}return L}e.appendChild(o);let a=(m,M)=>Math.min(Math.max(m,ee),Math.max(ee,M-ee));function l(){let m=o.offsetHeight||300;ue<0&&(ue=Math.max(ee,innerHeight-m-ee)),Ce=a(Ce,innerWidth-o.offsetWidth),ue=a(ue,innerHeight-m),o.style.transform=`translate(${Ce-ee}px, ${ue}px)`}let c=null;function y(m){m.button===0&&(m.preventDefault(),m.stopPropagation(),c={x:m.clientX,y:m.clientY,dx:Ce,dy:ue},o.setAttribute("data-dragging",""),m.currentTarget.setPointerCapture(m.pointerId))}function d(m){c&&(Ce=c.dx+(m.clientX-c.x),ue=c.dy+(m.clientY-c.y),l())}function g(){c=null,o.removeAttribute("data-dragging")}addEventListener("resize",l);let u=null;function S(m){let M=document.createElement("div");return M.className="edge",M.textContent=m===0?"0":w(m),m===0&&M.setAttribute("data-zero",""),M}function A(m,M,L,G){let[W,K,I,X]=L,s=document.createElement("div");s.className="region",s.setAttribute("data-level",String(M));let f=document.createElement("span");f.className="tag",f.textContent=m;let p=document.createElement("div");p.className="row";let v=document.createElement("div");v.className="fill",v.appendChild(G),p.append(S(X),v,S(K));let x=document.createElement("div");return x.className="head",x.append(f,S(W)),s.append(x,p,S(I)),s}return{show(m,M=[]){let L=Ve(m.el),[G,W,K,I]=L.border,[X,s,f,p]=L.padding,v=Ie(m.el),x=m.width/v.x,h=m.height/v.y,C=Math.abs(v.x-1)>.001||Math.abs(v.y-1)>.001,P=document.createElement("header"),Ke=document.createElement("span");Ke.className="name",Ke.textContent=m.label;let _e=document.createElement("span");_e.className="size",_e.textContent=`${w(x)} \xD7 ${w(h)}`;let me=document.createElement("button");if(me.className="close",me.textContent="\xD7",me.title="close (B brings it back)",me.addEventListener("pointerdown",T=>T.stopPropagation()),me.addEventListener("click",T=>{T.stopPropagation(),ge=!0,o.removeAttribute("data-open")}),P.append(Ke,_e),C){let T=document.createElement("span");T.className="scale",T.textContent=`\xD7${w(v.x)}`,T.title=`renders at ${w(m.width)} \xD7 ${w(m.height)}`,P.appendChild(T)}P.appendChild(me),P.addEventListener("pointerdown",y),P.addEventListener("pointermove",d),P.addEventListener("pointerup",g),P.addEventListener("pointercancel",g);let je=document.createElement("div");je.className="content",je.textContent=`${w(x-I-W-p-s)} \xD7 ${w(h-G-K-X-f)}`;let ae=[P,A("margin",1,L.margin,A("border",2,L.border,A("padding",3,L.padding,je)))];if(r){let T=$t(m.el),le=Ge(m.el);ae.push(le.length&&T?i("type",le.map(_=>[_.label,_.value])):i("type",[["","nothing of its own to set type on"]]))}if(M.length){let T=M.map(_=>[w(_.px),_.detail]),le=Rt(M.map(_=>_.px));le&&T.push(["",le]),ae.push(i("gaps",T))}let xt=Ct(m.el),yt=Tt([x,h,...L.margin,...L.border,...L.padding,...r?Ge(m.el).map(T=>T.px):[]],xt);yt&&ae.push(i("tokens",[["",yt]]));let bt=Bt(m.el);bt.length&&ae.push(i("styled by",bt.slice(0,4).map(T=>[T.selector,T.file])));let vt=Nt(m.el);vt>1&&ae.push(i("matches",[["",`${vt} elements share ${qe(m.el)}`]]));let wt=xt.filter(T=>Ue(T.value));if(wt.length){let T=At(m.el).map(({label:le,value:_})=>{let kt=Gt(_,wt);return[le,kt.length?`${_}  ${kt.join(" ")}`:`${_}  \u2014`]});T.length&&ae.push(i("colour",T))}n.replaceChildren(...ae),u=m,l(),!ge&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},showsType:()=>r,isOpen:()=>!ge&&u!==null,toggleType(){r=!r,u&&this.show(u)},asText(){if(!u)return"";let m=Ve(u.el),M=Ie(u.el),L=u.width/M.x,G=u.height/M.y,W=I=>I.map(X=>w(X)).join(" "),K=[`${u.label}  ${w(L)} \xD7 ${w(G)}`,`margin   ${W(m.margin)}`,`border   ${W(m.border)}`,`padding  ${W(m.padding)}`];if(r)for(let I of Ge(u.el))K.push(`${I.label.padEnd(8)} ${I.value}`);return K.join(Qn)},hide(){u=null,o.removeAttribute("data-open")},toggle(){u&&(ge=!ge,ge?o.removeAttribute("data-open"):(l(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",l),o.remove(),t.remove()}}}var eo=[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure what is under the cursor"],["Click","lock an element"],["Right-click","add to, or drop from, the locked set"],["Drag the panel header","move the box model"],["B","hide or bring back the box model"],["R","rulers down the top and left edges"],["Drag from a rule","pull out a guide; drag it back to remove"],["V","vertical guide at the cursor"],["H","horizontal guide at the cursor"],["Hover a guide","distance from it to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the last guide you touched; Shift for 10px"],["L","pin that guide so it cannot be moved or deleted"],["Ctrl/Cmd + Z","bring back the guides you just deleted"],["T","type and token readout for the locked element"],["F","freeze the page so a moving thing can be measured"],["G","your column grid, if one is configured"],["K","a ten-pixel texture to read against"],["X","x-ray: outline every element on the page"],["P","pick a colour from anywhere on screen"],["C","copy the numbers in the panel"],["Ctrl/Cmd while placing","ignore snapping"],["Del","remove the guide under the cursor; Shift+Del for all"],["Esc","clear the locks, then close"]],de=16,rt=k.tag+12,it=8,to=`
.flag {
  position: fixed; top: ${de}px; right: ${de}px;
  display: flex; align-items: center; gap: 8px;
  transition: top 160ms cubic-bezier(0.19, 1, 0.22, 1);
  padding: 6px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${k.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${k.tag}px; font-weight: ${O.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${N.primary};
  background: ${Z};
  box-shadow: ${ce};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
/* The rulers draw a gutter along the top edge, and the badge sits in it. Step
   down out of the way rather than covering the ticks the rulers exist to show. */
.flag[data-rulers] { top: ${de+b}px; }
.help[data-rulers] { top: ${de+b+rt+it}px; }
.flag:hover { background: ${Y(1)}; }
.flag .count { color: ${N.secondary}; }

/* A layers bar, not a palette. Switches, then the one control that changes the
   page, then the things that happen once. */
.tools { display: flex; align-items: center; gap: 2px; }
.sep {
  width: 1px; align-self: stretch; margin: 0 4px;
  background: ${ne};
}
.tool {
  width: 20px; height: 20px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; cursor: pointer;
  font: inherit; font-size: ${k.tag}px; font-weight: ${O.medium};
  color: ${N.tertiary};
}
.tool:hover { background: ${Y(2)}; color: ${N.primary}; }
.tool:focus-visible { outline: 1px solid ${N.primary}; outline-offset: -1px; }
/* On is the film, not a colour: the three hues each already mean something on
   the canvas, and a fourth here would say nothing. */
.tool[data-on] { background: ${Y(4)}; color: ${N.primary}; }
.tool[data-once]:active { background: ${Y(4)}; }
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: ${de+rt+it}px; right: ${de}px; width: 292px;
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${de*2+rt+it}px); overflow-y: auto;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${k.stack};
  font-synthesis: none;
  font-size: ${k.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${N.primary};
  background: ${Z};
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
  font: inherit; font-weight: ${O.medium};
  border: 1px solid ${ne};
  background: ${Y(2)};
}
.help dd { margin: 0; color: ${N.secondary}; }
`,Zt=[{name:"rulers",label:"R",title:"rulers down the top and left edges",toggle:!0},{name:"xray",label:"X",title:"outline every element on the page",toggle:!0},{name:"grid",label:"G",title:"your column grid, if one is configured",toggle:!0},{name:"pixels",label:"K",title:"a ten-pixel texture to read against",toggle:!0},{name:"type",label:"T",title:"type and token readout",toggle:!0},{name:"panel",label:"B",title:"the box model panel",toggle:!0},{name:"freeze",label:"F",title:"hold the page still",toggle:!0},{name:"copy",label:"C",title:"copy the numbers in the panel",toggle:!1},{name:"pick",label:"P",title:"pick a colour from anywhere on screen",toggle:!1},{name:"undo",label:"\u21BA",title:"bring back the guides you just deleted",toggle:!1}];function en(e,t){let o=document.createElement("style");o.textContent=to,e.appendChild(o);let n=document.createElement("div");n.className="flag";let r=document.createElement("span");r.className="name",r.textContent="Align";let i=document.createElement("span");i.className="count";let a=new Map,l=document.createElement("div");l.className="tools";for(let d of Zt){if(d.name==="freeze"||d.name==="copy"){let u=document.createElement("span");u.className="sep",l.appendChild(u)}let g=document.createElement("button");g.type="button",g.className="tool",g.textContent=d.label,g.title=`${d.title}  \xB7  ${d.name==="undo"?"Ctrl/Cmd+Z":d.label}`,d.toggle||g.setAttribute("data-once",""),g.addEventListener("click",u=>{u.stopPropagation(),t(d.name)}),a.set(d.name,g),l.appendChild(g)}n.append(r,l,i);let c=document.createElement("div");c.className="help";let y=document.createElement("dl");for(let[d,g]of eo){let u=document.createElement("dt"),S=document.createElement("kbd");S.textContent=d,u.appendChild(S);let A=document.createElement("dd");A.textContent=g,y.append(u,A)}return c.appendChild(y),n.addEventListener("click",d=>{d.stopPropagation(),c.toggleAttribute("data-open")}),e.append(n,c),{update(d,g){i.textContent=d>0?`${d} locked`:"",n.toggleAttribute("data-rulers",g.rulers),c.toggleAttribute("data-rulers",g.rulers);for(let u of Zt)u.toggle&&a.get(u.name)?.toggleAttribute("data-on",g[u.name]===!0)},closeHelp(){let d=c.hasAttribute("data-open");return c.removeAttribute("data-open"),d},destroy(){n.remove(),c.remove(),o.remove()}}}var Pe=5,at=4,Te=12,tn=.22,xe=10,no=50,oo=100;function nn(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,grid:null,pixels:!1,guides:[],liveGuide:null,activeGuide:null},i=nt(ot()),a=0;function l(){let s=ot();i=nt(s),e.style.colorScheme=s?"dark":"light",X()}l();let c=matchMedia("(prefers-color-scheme: dark)"),y=()=>l();c.addEventListener("change",y),Jt(()=>X());function d(){let s=devicePixelRatio;o.width=Math.round(innerWidth*s),o.height=Math.round(innerHeight*s),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(s,0,0,s,0,0),n.translate(.5,.5)}let g=s=>Math.round(s)-.5;function u(s,f){n.strokeStyle=f,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(s.left),Math.round(s.top),Math.round(s.width),Math.round(s.height))}function S(s){n.strokeStyle=he(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let f of[s.left,s.right])n.moveTo(Math.round(f),0),n.lineTo(Math.round(f),innerHeight);for(let f of[s.top,s.bottom])n.moveTo(0,Math.round(f)),n.lineTo(innerWidth,Math.round(f));n.stroke(),n.setLineDash([])}function A(s){if(n.strokeStyle=s.extension?he(i.measure,.55):i.measure,n.lineWidth=1,n.setLineDash(s.extension?[3,3]:[]),n.beginPath(),n.moveTo(Math.round(s.x1),Math.round(s.y1)),n.lineTo(Math.round(s.x2),Math.round(s.y2)),s.extension){n.stroke();return}if(s.axis==="x")for(let f of[s.x1,s.x2])n.moveTo(Math.round(f),Math.round(s.y1)-Pe),n.lineTo(Math.round(f),Math.round(s.y1)+Pe);else for(let f of[s.y1,s.y2])n.moveTo(Math.round(s.x1)-Pe,Math.round(f)),n.lineTo(Math.round(s.x1)+Pe,Math.round(f));n.stroke()}function m(s){return n.font=`${O.medium} ${k.body}px ${k.stack}`,{w:n.measureText(s).width+at*2,h:k.body+at*2+2}}function M(s,f,p,v){n.font=`${O.medium} ${k.body}px ${k.stack}`,n.textBaseline="middle";let{w:x,h}=m(s),C=g(Math.min(Math.max(f,Te),innerWidth-x-Te)),P=g(Math.min(Math.max(p,Te),innerHeight-h-Te));n.fillStyle=v,n.beginPath(),n.roundRect(C,P,Math.ceil(x),h,4),n.fill(),n.fillStyle=i.surface,n.fillText(s,C+at,P+h/2)}function L(s,f,p,v,x=!1){let{w:h,h:C}=m(s);M(s,x?f-h/2:f,x?p-C/2:p,v)}function G(){let s=scrollX,f=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,b),n.fillRect(-.5,-.5,b,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${O.regular} 9px ${k.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let h of r.pinned)n.fillRect(g(h.left),-.5,Math.round(h.width),b),n.fillRect(-.5,g(h.top),b,Math.round(h.height));n.restore(),n.beginPath(),n.moveTo(-.5,b-.5),n.lineTo(innerWidth,b-.5),n.moveTo(b-.5,-.5),n.lineTo(b-.5,innerHeight),n.stroke();let p=h=>h%oo===0?b:h%no===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let v=Math.floor(s/xe)*xe;for(let h=v;h<s+innerWidth;h+=xe){let C=Math.round(h-s);if(C<b)continue;let P=p(h);n.moveTo(C,b-P),n.lineTo(C,b),P===b&&(n.fillStyle=i.muted,n.fillText(String(h),C+3,3))}n.stroke(),n.beginPath();let x=Math.floor(f/xe)*xe;for(let h=x;h<f+innerHeight;h+=xe){let C=Math.round(h-f);if(C<b)continue;let P=p(h);n.moveTo(b-P,C),n.lineTo(b,C),P===b&&(n.save(),n.translate(3,C-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(h),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),b),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo(b,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let h of r.guides){let C=Math.round(Ee(h));h.axis==="x"?n.fillRect(C-1,-.5,2,b):n.fillRect(-.5,C-1,b,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,b,b),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,b,b)}function W(){let s=Kt(10,1);if(s){n.strokeStyle=i.pixelLine,n.lineWidth=1,n.setLineDash([]),n.beginPath();for(let f=0;f<=innerWidth;f+=s)n.moveTo(f,0),n.lineTo(f,innerHeight);for(let f=0;f<=innerHeight;f+=s)n.moveTo(0,f),n.lineTo(innerWidth,f);n.stroke()}}function K(s){let f=Yt(s,document.documentElement.clientWidth);n.fillStyle=he(i.measure,.08);for(let p of f)n.fillRect(g(p.left),-.5,Math.round(p.width),innerHeight+1)}function I(){a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore(),r.pixels&&W(),r.grid&&K(r.grid);for(let p of r.pinned)u(p,i.accent);r.hover&&(S(r.hover),u(r.hover,r.pinned.length?he(i.accent,.7):i.accent));for(let p of r.guides){let v=r.liveGuide?.id===p.id;n.strokeStyle=p.locked||v?i.guide:he(i.guide,.55),n.lineWidth=p.pinned?2:1,n.setLineDash(p.locked?[]:[4,4]),n.beginPath();let x=Math.round(Ee(p));if(p.axis==="x"?(n.moveTo(x,0),n.lineTo(x,innerHeight)):(n.moveTo(0,x),n.lineTo(innerWidth,x)),n.stroke(),r.activeGuide===p.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let h=7;p.axis==="x"?(n.moveTo(x,0),n.lineTo(x,h),n.moveTo(x,innerHeight-h),n.lineTo(x,innerHeight)):(n.moveTo(0,x),n.lineTo(h,x),n.moveTo(innerWidth-h,x),n.lineTo(innerWidth,x)),n.stroke()}}for(let p of r.lines)n.globalAlpha=p.faded?tn:1,A(p);n.globalAlpha=1;let s=r.lines.filter(p=>p.label!==""),f=s.map(p=>{let v=(p.x1+p.x2)/2,x=(p.y1+p.y2)/2,{w:h,h:C}=m(p.label);return p.axis==="x"?{x:v-h/2,y:x-16-C/2,w:h,h:C,axis:p.axis}:{x:v+26-h/2,y:x-C/2,w:h,h:C,axis:p.axis}});if(Xt(f,{w:innerWidth,h:innerHeight},Te).forEach((p,v)=>{let x=s[v];n.globalAlpha=x.faded?tn:1,M(x.label,p.x,p.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:p,height:v,scale:x}=r.hover;L(`${w(p/x.x)} \xD7 ${w(v/x.y)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let p=r.liveGuide,v=Math.round(Ee(p));L([`${p.axis} ${w(p.at)}`,p.caught,p.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),p.axis==="x"?v+6:30,p.axis==="x"?30:v+6,i.guide)}r.rulers&&G()}function X(){a||(a=requestAnimationFrame(I))}return d(),{root:t,update(s){Object.assign(r,s),X()},resize(){d(),X()},destroy(){a&&cancelAnimationFrame(a),c.removeEventListener("change",y),e.remove()}}}function ro(e){let t=e.trim().replace(/^#/,""),o=t.length===3?t.split("").map(n=>n+n).join(""):t;return/^[0-9a-f]{6}$/i.test(o)?{r:parseInt(o.slice(0,2),16),g:parseInt(o.slice(2,4),16),b:parseInt(o.slice(4,6),16)}:null}function io({r:e,g:t,b:o}){let n=r=>Math.round(r).toString(16).padStart(2,"0");return`#${n(e)}${n(t)}${n(o)}`}function ao({r:e,g:t,b:o}){return`rgb(${Math.round(e)} ${Math.round(t)} ${Math.round(o)})`}function pe(e,t){return String(Number(e.toFixed(t)))}function lo({r:e,g:t,b:o}){let n=e/255,r=t/255,i=o/255,a=Math.max(n,r,i),l=Math.min(n,r,i),c=(a+l)/2,y=a-l,d=0,g=0;return y!==0&&(g=y/(1-Math.abs(2*c-1)),a===n?d=(r-i)/y%6:a===r?d=(i-n)/y+2:d=(n-r)/y+4,d*=60,d<0&&(d+=360)),`hsl(${pe(d,1)} ${pe(g*100,1)}% ${pe(c*100,1)}%)`}function lt(e){let t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4}function so(e){let t=lt(e.r),o=lt(e.g),n=lt(e.b),r=.4122214708*t+.5363325363*o+.0514459929*n,i=.2119034982*t+.6806995451*o+.1073969566*n,a=.0883024619*t+.2817188376*o+.6299787005*n,l=Math.cbrt(r),c=Math.cbrt(i),y=Math.cbrt(a),d=.2104542553*l+.793617785*c-.0040720468*y,g=1.9779984951*l-2.428592205*c+.4505937099*y,u=.0259040371*l+.7827717662*c-.808675766*y,S=Math.sqrt(g*g+u*u),A=Math.atan2(u,g)*180/Math.PI;return A<0&&(A+=360),S<1e-4?`oklch(${pe(d,4)} 0 0)`:`oklch(${pe(d,4)} ${pe(S,4)} ${pe(A,2)})`}function on(e){let t=ro(e);return t?[{label:"hex",value:io(t)},{label:"rgb",value:ao(t)},{label:"hsl",value:lo(t)},{label:"oklch",value:so(t)}]:[]}var co=`
.picker {
  position: fixed; top: 46px; right: 16px; width: 200px;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${k.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${k.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${N.primary};
  background: ${Z};
  box-shadow: ${ce};
  display: none;
}
.picker[data-open] { display: block; }
.picker .swatch {
  height: 40px; margin-bottom: 8px;
  border: 1px solid ${ne};
}
/* Each row copies itself, so the whole row is the target rather than the text. */
.picker button {
  display: grid; grid-template-columns: 34px 1fr;
  gap: 8px; align-items: baseline;
  width: 100%; padding: 3px 4px; margin: 0;
  border: 0; background: none; cursor: pointer;
  font: inherit; text-align: left;
  color: ${N.primary};
}
.picker button:hover { background: ${Y(2)}; }
.picker button:focus-visible { outline: 1px solid ${N.primary}; outline-offset: -1px; }
.picker .k { color: ${N.secondary}; }
.picker .v { overflow-wrap: anywhere; }
.picker .hint {
  margin-top: 6px; padding-top: 6px;
  border-top: 1px solid ${ne};
  color: ${N.secondary};
}
`;function rn(e){let t=document.createElement("style");t.textContent=co,e.appendChild(t);let o=document.createElement("div");o.className="picker",e.appendChild(o);let n=document.createElement("div");n.className="swatch";let r=document.createElement("div");r.className="hint";function i(a){n.style.background=a;let l=on(a).map(({label:c,value:y})=>{let d=document.createElement("button");d.type="button";let g=document.createElement("span");g.className="k",g.textContent=c;let u=document.createElement("span");return u.className="v",u.textContent=y,d.append(g,u),d.addEventListener("click",S=>{S.stopPropagation(),navigator.clipboard?.writeText(y).then(()=>{r.textContent=`copied ${c}`},()=>{r.textContent="clipboard refused"})}),d});r.textContent="click a row to copy",o.replaceChildren(n,...l,r),o.setAttribute("data-open","")}return{async open(){let a=window.EyeDropper;if(!a){o.replaceChildren(Object.assign(document.createElement("div"),{className:"hint",textContent:"this browser has no eyedropper"})),o.setAttribute("data-open","");return}try{let{sRGBHex:l}=await new a().open();i(l)}catch{}},close(){let a=o.hasAttribute("data-open");return o.removeAttribute("data-open"),a},destroy(){o.remove(),t.remove()}}}var st="__align_freeze",uo=`
[data-align-frozen] *:not([data-align-ignore]):not([data-align-ignore] *) {
  animation-play-state: paused !important;
}
`,ct=!1,Oe=[],ze=[];function an(e){let t=e;for(;t;){if(t instanceof Element&&t.hasAttribute("data-align-ignore"))return!0;let o=t.getRootNode();if(t=o instanceof ShadowRoot?o.host:t.parentNode??null,t===document)return!1}return!1}function Me(){return ct}function Fe(e){if(e!==ct){if(ct=e,!e){document.documentElement.removeAttribute("data-align-frozen"),document.getElementById(st)?.remove();for(let t of Oe)try{t.play()}catch{}for(let t of ze)t.play().catch(()=>{});Oe=[],ze=[];return}if(!document.getElementById(st)){let t=document.createElement("style");t.id=st,t.textContent=uo,t.setAttribute("data-align-ignore",""),document.head.appendChild(t)}document.documentElement.setAttribute("data-align-frozen",""),Oe=[];try{for(let t of document.getAnimations()){if(t.playState!=="running")continue;let o=t.effect?.target??null;an(o)||(t.pause(),Oe.push(t))}}catch{}ze=[];for(let t of Array.from(document.querySelectorAll("video")))t.paused||an(t)||(t.pause(),ze.push(t))}}var ut="__align_xray",po=`
[data-align-xray] * { outline: 1px solid rgb(128 128 128 / 0.55) !important; }
[data-align-xray] [data-align-ignore],
[data-align-xray] [data-align-ignore] * { outline: none !important; }
`;function He(e){let t=document.documentElement;if(!e){t.removeAttribute("data-align-xray"),document.getElementById(ut)?.remove();return}if(!document.getElementById(ut)){let o=document.createElement("style");o.id=ut,o.textContent=po,o.setAttribute("data-align-ignore",""),document.head.appendChild(o)}t.setAttribute("data-align-xray","")}var dt="align-ui";function ln(e){try{return localStorage.getItem(e)}catch{return null}}function sn(e,t){try{localStorage.setItem(e,t)}catch{}}function cn(e){let t="/";try{t=location.pathname||"/"}catch{}return`${dt}:${e}::${t}`}function mo(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function un(){let e=ln(cn("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(mo).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function dn(e){sn(cn("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function We(e){return ln(`${dt}:${e}`)==="1"}function Le(e,t){sn(`${dt}:${e}`,t?"1":"0")}var H,E=null,F=null,ie=null,ke=null,q=!1,be=We("grid"),ve=We("pixels"),B=null,$=[],Ye=0,V=We("rulers"),R=[],ft=1,pn=!1,Se=null,oe=null;function mn(){return R.find(e=>e.id===Se)??null}function re(e){R=e,dn(R)}var z=null,J=null,U=null,fo=3,ye=22;function yn(e,t){return V?t<ye&&e>=ye?"y":e<ye&&t>=ye?"x":null:null}function ht(e){return e.ctrlKey||e.metaKey}function bn(e,t,o,n){let r=se(t,o,H),i=e.axis==="x"?t:o,a=R.filter(c=>c.id!==e.id).map(c=>({axis:c.axis,at:Re(c).pos})),l=Ft(i,Ht(r,e.axis,a),n);e.at=l.at+(e.axis==="x"?scrollX:scrollY),e.caught=l.what}function vn(e,t,o,n){let r={id:ft++,axis:e,at:0,locked:!1,caught:"",pinned:!1};return bn(r,t,o,n),re([...R,r]),r}function wn(e){e.pinned||(oe=[e],re(R.filter(t=>t.id!==e.id)),J?.id===e.id&&(J=null),z?.id===e.id&&(z=null))}function ho(e){let t=H.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function Re(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function gt(){if($.length<2)return[];let e=[];for(let[t,o]of Je($))for(let n of De(t,o)){if(n.extension||!n.label)continue;let r=Mt(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:Lt(r)})}return e}function D(e){let t=$[$.length-1],o=B&&$.some(u=>u.el===B.el),n=R.map(Re),r=!z&&J?J:null,i=R.filter(u=>u.locked||u.id===r?.id),a=!r&&o?B.el:null,l=r??a,c=r?Re(r):null,y=[],d=(u,S)=>{for(let A of u)y.push(l&&!S?{...A,faded:!0}:A)},g=u=>!c||u.axis!==c.axis?!1:(u.axis==="x"?[u.x1,u.x2]:[u.y1,u.y2]).some(A=>Math.abs(A-c.pos)<.5);for(let[u,S]of Je($))d(De(u,S),u.el===a||S.el===a);t&&B&&!o&&!r&&d(De(t,B),!0);for(let u of i)for(let S of $)d(Ze(S,[Re(u)]),u.id===r?.id||S.el===a);B&&!o&&!r&&R.length&&d(Ze(B,n),!0);for(let u of Wt(i.map(Re),{x:innerWidth/2,y:innerHeight/2}))d([u],g(u));E?.update({hover:B,pinned:$,rulers:V,grid:be&&H.grid?H.grid:null,pixels:ve,guides:R,liveGuide:z??J,activeGuide:Se,lines:y,...e?{cursor:e}:{}}),ie?.update($.length,{rulers:V,xray:q,grid:be,pixels:ve,freeze:Me(),type:F?.showsType()??!1,panel:F?.isOpen()??!1})}function kn(){let e=F?.asText()??"";e&&navigator.clipboard?.writeText(e).catch(()=>{})}function Sn(){!oe||oe.length===0||(re([...R,...oe.map(e=>({...e,id:ft++}))]),oe=null)}function pt(e){switch(e){case"rulers":V=!V,Le("rulers",V);break;case"xray":q=!q,He(q);break;case"grid":be=!be,Le("grid",be);break;case"pixels":ve=!ve,Le("pixels",ve);break;case"freeze":Fe(!Me());break;case"type":F?.toggleType();break;case"panel":F?.toggle();break;case"copy":kn();break;case"pick":ke?.open();break;case"undo":Sn();break}D()}var Xe=null;function En(e){if(Xe={x:e.clientX,y:e.clientY},z){U&&Math.hypot(e.clientX-U.x,e.clientY-U.y)>fo&&(U=null),!U&&!z.pinned&&(bn(z,e.clientX,e.clientY,ht(e)),re([...R])),D({x:e.clientX,y:e.clientY});return}J=Qe(R,e.clientX,e.clientY),B=se(e.clientX,e.clientY,H),D({x:e.clientX,y:e.clientY})}function $n(e){z&&(U?(z.locked=!z.locked,Se=z.id,re([...R])):(yn(e.clientX,e.clientY)||e.clientX<ye||e.clientY<ye)&&wn(z),U=null,z=null,D({x:e.clientX,y:e.clientY}))}function Cn(e){if(e.button!==0)return;let t=se(e.clientX,e.clientY,H);if(!t)return;let o=yn(e.clientX,e.clientY);if(o){we(e),U=null,z=vn(o,e.clientX,e.clientY,ht(e)),D({x:e.clientX,y:e.clientY});return}let n=Qe(R,e.clientX,e.clientY);if(n){we(e),Se=n.id,z=n,U={x:e.clientX,y:e.clientY},D({x:e.clientX,y:e.clientY});return}we(e),ie?.closeHelp(),$=[t],B=t,F?.show(t,gt()),D({x:e.clientX,y:e.clientY})}function Tn(e){let t=se(e.clientX,e.clientY,H);if(!t)return;we(e),ie?.closeHelp();let o=$.findIndex(r=>r.el===t.el);$=o>=0?$.filter((r,i)=>i!==o):[...$,t],B=t;let n=$[$.length-1];n?F?.show(n,gt()):F?.hide(),D({x:e.clientX,y:e.clientY})}function Mn(e){se(e.clientX,e.clientY,H)&&we(e)}function Ln(e){se(e.clientX,e.clientY,H)&&we(e)}function we(e){e.preventDefault(),e.stopPropagation()}function fn(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var hn=0,gn=0;function Rn(){Ye=requestAnimationFrame(Rn);let t=$.filter(a=>a.el.isConnected).map(a=>Be(a.el)),o=B&&B.el.isConnected?Be(B.el):null;if(!(scrollX!==hn||scrollY!==gn||t.length!==$.length||t.some((a,l)=>!fn(a,$[l]))||B===null!=(o===null)||B!==null&&o!==null&&!fn(B,o)))return;hn=scrollX,gn=scrollY,$=t,B=o;let i=$[$.length-1];i?F?.show(i,gt()):F?.hide(),D()}function Gn(){E?.resize()}function go(){pn||(pn=!0,R=un().map(e=>({...e,id:ft++}))),!E&&(qt(),E=nn(),F=Qt(E.root),ie=en(E.root,pt),ke=rn(E.root),ie.update(0,{rulers:V,xray:q,grid:be,pixels:ve,freeze:Me(),type:!1,panel:!1}),addEventListener("mousemove",En),addEventListener("mousedown",Cn,{capture:!0}),addEventListener("mouseup",$n,{capture:!0}),addEventListener("click",Mn,{capture:!0}),addEventListener("auxclick",Ln,{capture:!0}),addEventListener("contextmenu",Tn,{capture:!0}),addEventListener("resize",Gn),Ye=requestAnimationFrame(Rn),D())}function mt(){removeEventListener("mousemove",En),removeEventListener("mousedown",Cn,{capture:!0}),removeEventListener("mouseup",$n,{capture:!0}),removeEventListener("click",Mn,{capture:!0}),removeEventListener("auxclick",Ln,{capture:!0}),removeEventListener("contextmenu",Tn,{capture:!0}),removeEventListener("resize",Gn),cancelAnimationFrame(Ye),Ye=0,ie?.destroy(),ke?.destroy(),ke=null,q&&(q=!1,He(!1)),Fe(!1),ie=null,F?.destroy(),F=null,E?.destroy(),E=null,Vt(),B=null,$=[],z=null,U=null,J=null}function xn(e){if(ho(e))e.preventDefault(),E?mt():go();else if(E&&Xe&&(e.key.toLowerCase()===H.guideKeys.vertical||e.key.toLowerCase()===H.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===H.guideKeys.vertical?"x":"y";vn(t,Xe.x,Xe.y,ht(e)),D()}else if(E&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(oe=R.filter(t=>!t.pinned),re(R.filter(t=>t.pinned)),J=null,z=null,U=null,R.some(t=>t.id===Se)||(Se=null)):J&&wn(J),D();else if(E&&e.key.startsWith("Arrow")){let t=mn(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",re([...R]),D()}else if(E&&e.key.toLowerCase()==="g"){e.preventDefault(),pt("grid");return}else if(E&&e.key.toLowerCase()==="k"){e.preventDefault(),pt("pixels");return}else if(E&&e.key.toLowerCase()==="f")e.preventDefault(),Fe(!Me()),D();else if(E&&e.key.toLowerCase()==="x")e.preventDefault(),q=!q,He(q);else if(E&&e.key.toLowerCase()==="p")e.preventDefault(),ke?.open();else if(E&&e.key.toLowerCase()==="t")e.preventDefault(),F?.toggleType();else if(E&&e.key.toLowerCase()==="c")e.preventDefault(),kn();else if(E&&e.key.toLowerCase()==="l"){let t=mn();if(!t)return;e.preventDefault(),t.pinned=!t.pinned,re([...R]),D()}else if(E&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){if(!oe||oe.length===0)return;e.preventDefault(),Sn(),D()}else if(E&&e.key.toLowerCase()===H.rulerKey)e.preventDefault(),V=!V,Le("rulers",V),D();else if(E&&e.key.toLowerCase()===H.panelKey)e.preventDefault(),F?.toggle();else if(e.key==="Escape"&&E){if(ke?.close()||ie?.closeHelp())return;$.length?($=[],F?.hide(),D()):mt()}}function qo(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,H=It(e),addEventListener("keydown",xn,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{mt(),removeEventListener("keydown",xn,{capture:!0}),delete window.__align})}export{qo as initAlign};
