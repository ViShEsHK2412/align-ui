function j(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function Kn(e){return(e.split(",")[0]??"").trim().replace(/^['"]|['"]$/g,"")}function _n(e){let o={100:"thin",200:"extralight",300:"light",400:"regular",500:"medium",600:"semibold",700:"bold",800:"extrabold",900:"black"}[e.trim()];return o?`${e} ${o}`:e}function Ne(e){let t=getComputedStyle(e);return[{label:"family",value:Kn(t.fontFamily),px:NaN},{label:"size",value:t.fontSize,px:j(t.fontSize)},{label:"weight",value:_n(t.fontWeight),px:NaN},{label:"line",value:t.lineHeight,px:j(t.lineHeight)},{label:"tracking",value:t.letterSpacing,px:j(t.letterSpacing)}]}function Nt(e){let t="";for(let o of e.childNodes)o.nodeType===3&&(t+=o.nodeValue??"");return t.trim().replace(/\s+/g," ")}function Bt(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:j(r)})}return o}function jn(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function Un(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function Dt(e,t){return t.length===0?"":Un(e).map(o=>{let n=jn(o,t);return n.length?`${o} ${n.join(" ")}`:`${o} \u2014`}).join("  \xB7  ")}function Tt(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(j)}function Ft(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),l=a.display.includes("flex")||a.display.includes("grid"),s=n==="x"?a.columnGap:a.rowGap,y=l&&s!=="normal"?j(s):null,[d,m,u,k]=Tt(e),[R,p,L,G]=Tt(t),b=F=>Number.isFinite(F)?F:0,A=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,H=n==="x"?A?b(m)+b(G):b(p)+b(k):A?b(u)+b(R):b(L)+b(d);return{px:o,cssGap:y,margins:H,siblings:!0}}function It(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function Ot(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}function Je(e){let t=e.trim().toLowerCase();return t?t.startsWith("#")||/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(t)?!0:["black","white","transparent","currentcolor"].includes(t):!1}var te;function Lt(e){if(te===void 0&&(te=document.createElement("canvas").getContext("2d")),!te)return"";te.fillStyle="#000000",te.fillStyle=e;let t=te.fillStyle;return te.fillStyle="#ffffff",te.fillStyle=e,t===te.fillStyle?String(t):""}function Pt(e,t){let o=Lt(e);return o?t.filter(n=>Je(n.value)&&Lt(n.value)===o).map(n=>n.name).sort():[]}function zt(e){let t=getComputedStyle(e),o=[],n=(r,i)=>{let a=i.trim();!a||a==="transparent"||/rgba?\([^)]*,\s*0\s*\)$/.test(a)||o.push({label:r,value:a})};return n("text",t.color),n("background",t.backgroundColor),o}function qn(e,t,o){let n=r=>typeof CSS<"u"&&CSS.escape?CSS.escape(r):r.replace(/[^\w-]/g,"\\$&");return t?`#${n(t)}`:o.length?e+o.map(r=>`.${n(r)}`).join(""):e}function Qe(e){let t=typeof e.className=="string"?e.className.trim().split(/\s+/).filter(Boolean):[];return qn(e.tagName.toLowerCase(),e.id,t)}function Ht(e){let t=Qe(e);if(!/[.#]/.test(t))return 0;try{return document.querySelectorAll(t).length}catch{return 0}}function Vn(e){if(!e)return"inline <style>";let t=e.split("?")[0]??e;try{let o=new URL(t,"http://x").pathname;return decodeURI(o).replace(/^\//,"")||t}catch{return t}}var Jn=["width","height","padding","margin","border-width","gap","font-size","line-height","letter-spacing","color","background-color"];function Qn(e){for(let t=0;t<e.length;t+=1){let o=e.item(t);if(Jn.some(n=>o===n||o.startsWith(`${n}-`)))return!0}return!1}function Wt(e){let t=[],o=new Set,n=(r,i)=>{for(let a of Array.from(r)){if(a instanceof CSSMediaRule){matchMedia(a.conditionText).matches&&n(a.cssRules,i);continue}if(a instanceof CSSSupportsRule){CSS.supports(a.conditionText)&&n(a.cssRules,i);continue}let l=a.cssRules;if(l&&!(a instanceof CSSStyleRule)){n(l,i);continue}if(!(a instanceof CSSStyleRule))continue;let s=!1;try{s=e.matches(a.selectorText)}catch{continue}if(!s||!Qn(a.style))continue;let y=`${a.selectorText}|${i}`;o.has(y)||(o.add(y),t.push({selector:a.selectorText,file:i}))}};for(let r of Array.from(document.styleSheets)){if(r.ownerNode instanceof Element&&r.ownerNode.hasAttribute("data-align-ignore"))continue;let i;try{i=r.cssRules}catch{continue}n(i,Vn(r.href))}return t.reverse()}function Mt(e){if(!e||e==="none")return[];let t=e.trim().split(/\s+/),o=[];for(let n of t){if(!n.endsWith("px"))return[];let r=Number.parseFloat(n);if(!Number.isFinite(r))return[];o.push(r)}return o}function Rt(e,t,o){let n=0;for(let r=0;r<e.length;r+=1){let i=n+e[r];if(o<i+.5)return r;n=i+t}return-1}function Xt(e){let t=e.parentElement;if(!t)return null;let o=getComputedStyle(t),n=getComputedStyle(e),r=o.display,i=[];if(n.position==="absolute"||n.position==="fixed")return i.push({label:"placed by",value:`${n.position}, not by the parent`}),{display:r,rows:i};if(n.float!=="none")return i.push({label:"placed by",value:`float: ${n.float}`}),{display:r,rows:i};let a=r.includes("flex"),l=r.includes("grid");if(!a&&!l)return i.push({label:"flow",value:r}),{display:r,rows:i};let s=Gt(o.rowGap==="normal"?"0px":o.rowGap),y=Gt(o.columnGap==="normal"?"0px":o.columnGap),d=s===y?s:`row ${s} \xB7 column ${y}`;if(a){let H=o.flexDirection;i.push({label:"direction",value:o.flexWrap==="nowrap"?H:`${H} \xB7 ${o.flexWrap}`}),i.push({label:"justify",value:o.justifyContent}),i.push({label:"align",value:o.alignItems}),i.push({label:"gap",value:d});let F=`${n.flexGrow} ${n.flexShrink} ${n.flexBasis}`;return F!=="0 1 auto"&&i.push({label:"this child",value:`flex: ${F}`}),n.alignSelf!=="auto"&&i.push({label:"align-self",value:n.alignSelf}),{display:r,rows:i}}let m=Mt(o.gridTemplateColumns),u=Mt(o.gridTemplateRows);m.length&&i.push({label:"columns",value:`${m.length} \xB7 ${m.map(Ve).join(" ")}`}),u.length&&i.push({label:"rows",value:`${u.length} \xB7 ${u.map(Ve).join(" ")}`}),i.push({label:"gap",value:d});let k=t.getBoundingClientRect(),R=e.getBoundingClientRect(),p=k.left+j(o.borderLeftWidth)+j(o.paddingLeft),L=k.top+j(o.borderTopWidth)+j(o.paddingTop),G=Rt(m,j(o.columnGap==="normal"?"0":o.columnGap),R.left-p),b=Rt(u,j(o.rowGap==="normal"?"0":o.rowGap),R.top-L),A=[];return G>=0&&A.push(`column ${G+1} of ${m.length}`),b>=0&&A.push(`row ${b+1} of ${u.length}`),A.length&&i.push({label:"this child",value:A.join(" \xB7 ")}),{display:r,rows:i}}function Gt(e){return e.endsWith("px")?Ve(Number.parseFloat(e)):e}function Ve(e){return String(Math.round(e*100)/100)}var Yt=["display","position","width","height","padding","margin","border-width","border-style","border-radius","font-family","font-size","font-weight","font-style","line-height","letter-spacing","text-transform","text-align","color","background-color","border-color","opacity","flex-direction","justify-content","align-items","gap","flex-grow","flex-shrink","flex-basis","align-self","box-shadow","overflow","text-overflow","white-space"];function Zn(e,t){let o=[];for(let n of Yt){let r=e[n]??"",i=t[n]??"";r!==i&&o.push({prop:n,a:r,b:i})}return o}function At(e){let t=getComputedStyle(e),o={};for(let n of Yt)o[n]=t.getPropertyValue(n);return o}function Kt(e,t){return Zn(At(e),At(t))}var eo={ignore:"",grid:null,hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function jt(e={}){return{...eo,...e}}var _t=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function Ut(e){return e.ignore?`${_t}, ${e.ignore}`:_t}function $(e){return String(Math.round(e*100)/100)}function to(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function Fe(e){let t=e.getBoundingClientRect();return{el:e,label:to(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height,scale:Oe(e)}}function qt(e,t){let o=(n,r)=>Math.abs(n-r)<.001;return o(e.scale.x,t.scale.x)&&o(e.scale.y,t.scale.y)?e.scale:{x:1,y:1}}function Vt(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function ue(e,t,o){let n=Ut(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=Vt(r);return r&&r!==document.documentElement?Fe(r):null}var Be=e=>parseFloat(e)||0;function Ze(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[Be(n),Be(r),Be(i),Be(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function no(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function oo(e,t){let o=qt(e,t),n=t.left+t.width/2,r=t.top+t.height/2;return[{x1:e.left,y1:r,x2:t.left,y2:r,label:$((t.left-e.left)/o.x),axis:"x"},{x1:t.right,y1:r,x2:e.right,y2:r,label:$((e.right-t.right)/o.x),axis:"x"},{x1:n,y1:e.top,x2:n,y2:t.top,label:$((t.top-e.top)/o.y),axis:"y"},{x1:n,y1:t.bottom,x2:n,y2:e.bottom,label:$((e.bottom-t.bottom)/o.y),axis:"y"}]}function De(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function Ie(e,t){let o=[],n=qt(e,t),r=e.left<t.right&&t.left<e.right,i=e.top<t.bottom&&t.top<e.bottom;if(r&&i){let[a,l]=no(e,t);return oo(a,l)}if(!r){let[a,l]=e.right<=t.left?[e,t]:[t,e],s=i?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:a.right,y1:s,x2:l.left,y2:s,label:`${$((l.left-a.right)/n.x)}`,axis:"x"}),o.push(...De(a.right,a.top,a.bottom,s,"x")),o.push(...De(l.left,l.top,l.bottom,s,"x"))}if(!i){let[a,l]=e.bottom<=t.top?[e,t]:[t,e],s=r?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:s,y1:a.bottom,x2:s,y2:l.top,label:`${$((l.top-a.bottom)/n.y)}`,axis:"y"}),o.push(...De(a.bottom,a.left,a.right,s,"y")),o.push(...De(l.top,l.left,l.right,s,"y"))}return o}function ro(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function et(e){let t=ro(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var io=5,ao=8;function Ee(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function tt(e,t,o){let n=null,r=io;for(let i of e){let a=Math.abs(Ee(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function Jt(e,t,o){if(o)return{at:e,what:""};let n=null,r=ao;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function Qt(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function nt(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,l=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:l,y2:i,label:$(r.gap),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,l=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:l,label:$(r.gap),axis:"y"})}}return o}function Zt(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],l=r[i],s=l-a;s<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:l,y2:t.y,label:$(s),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:l,label:$(s),axis:"y"}))}}return o}var ae=3;function lo(e,t){return e.x<t.x+t.w+ae&&t.x<e.x+e.w+ae&&e.y<t.y+t.h+ae&&t.y<e.y+e.h+ae}function en(e,t,o=12){let n=(a,l)=>Math.min(Math.max(a,o),t.w-l-o),r=(a,l)=>Math.min(Math.max(a,o),t.h-l-o),i=[];for(let a of e){let l={...a,x:n(a.x,a.w),y:r(a.y,a.h)},s=!1;for(let y=0;y<16;y++){let d=i.find(u=>lo(u,l));if(!d)break;let m=l.axis==="x"?l.y:l.x;if(l.axis==="x"?l.y=r(s?d.y+d.h+ae:d.y-l.h-ae,l.h):l.x=n(s?d.x-l.w-ae:d.x+d.w+ae,l.w),(l.axis==="x"?l.y:l.x)===m){if(s)break;s=!0}}i.push(l)}return i}function tn(e,t){let{columns:o,gutter:n,margin:r}=e;if(o<=0)return[];let i=e.maxWidth>0?Math.min(e.maxWidth,t):t,a=Math.max(0,(t-i)/2),s=(Math.max(0,i-r*2)-n*(o-1))/o;if(s<=0)return[];let y=[];for(let d=0;d<o;d+=1)y.push({left:a+r+d*(s+n),width:s});return y}function nn(e,t){return e*t>=8?e:0}function so(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(l=>parseFloat(l)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function Oe(e){let t=1,o=1;for(let n=e;n;n=Vt(n)){let r=so(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var q=(e,t)=>({light:e,dark:t}),ot={accent:q("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:q("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:q("oklch(1 0 0)","oklch(0.264 0 0)"),fg:q("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:q("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:q("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:q("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:q("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)"),pixelLine:q("oklch(0.205 0 0 / 0.14)","oklch(0.97 0 0 / 0.14)")};function rn(e){return`light-dark(${e.light}, ${e.dark})`}var ne=rn(q("#fafafa","#1a1a1a"));function Ce(e){return rn(q(`rgb(0 0 0 / ${e})`,`rgb(255 255 255 / ${e})`))}var on=[0,.07,.08,.1,.12,.15,.2];function K(e){let t=on[Math.max(0,Math.min(on.length-1,e))];return t===0?ne:Ce(t)}var B={primary:Ce(.9),secondary:Ce(.6),tertiary:Ce(.4)},le=Ce(.12),de="0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)",an="0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)",w=22;var co='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',E={title:13,body:12,tag:11,stack:co},P={regular:400,medium:500,semibold:600},rt="__align_font",uo="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function ln(){if(document.getElementById(rt))return;let e=document.createElement("link");e.id=rt,e.rel="stylesheet",e.href=uo,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function sn(){document.getElementById(rt)?.remove()}function cn(e){let t=[`${P.medium} ${E.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function it(e){let t={};for(let o of Object.keys(ot))t[o]=e?ot[o].dark:ot[o].light;return t}function at(){let e=document.documentElement,t=getComputedStyle(e).colorScheme;if(/dark/.test(t)&&!/light/.test(t))return!0;if(/light/.test(t)&&!/dark/.test(t))return!1;for(let o of[document.body,e]){if(!o)continue;let n=po(getComputedStyle(o).backgroundColor);if(n!==null)return n<.5}return matchMedia("(prefers-color-scheme: dark)").matches}function po(e){let t=/^rgba?\(([^)]+)\)$/.exec(e.trim());if(!t)return null;let o=t[1].split(/[\s,/]+/).filter(Boolean).map(Number),[n,r,i,a=1]=o;return n===void 0||r===void 0||i===void 0||a<.5?null:(.2126*n+.7152*r+.0722*i)/255}function ge(e,t){return e.replace(/\)$/,` / ${t})`)}var fo=`
`,oe=16,mo=`
.dock {
  /* No color-scheme here: the overlay sets it inline on the shadow host, from
     what the page actually looks like rather than what the machine prefers, and
     it inherits down. Declaring 'light dark' again would undo that and hand
     light-dark() back to the media query. */
  position: fixed; left: ${oe}px; top: 0; width: 340px;
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none; user-select: none;
  font-family: ${E.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${B.primary};
  --muted: ${B.secondary};
  --border: ${le};
}
.panel {
  padding: 10px; border-radius: 0;
  /* Five sections now \u2014 box, tokens, styled by, matches, colour \u2014 and on a
     laptop that is taller than the window. place() clamps the position but
     cannot rescue a panel taller than the screen, so it scrolls instead. */
  max-height: calc(100vh - ${oe*2}px);
  overflow-y: auto; overscroll-behavior: contain;
  font-size: ${E.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${ne};

  box-shadow: ${de};

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
  background: ${ne};
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] .panel { box-shadow: ${an}; }
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${E.title}px; font-weight: ${P.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${E.body}px; font-weight: ${P.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${E.tag}px; font-weight: ${P.medium};
  margin-left: 4px;
  color: ${B.primary};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${E.body}px; line-height: 1;
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
  font-size: ${E.tag}px; font-weight: ${P.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${P.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${P.regular}; }
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
/* One grid for the whole section rather than one per row, so every key in a
   section shares a column and the column sizes to the longest key in it. A
   fixed 62px was right until a diff started printing 'background-color', which
   it broke across two lines mid-word. The 62px floor keeps the rhythm the
   other sections already had. */
.readout-rows {
  display: grid; grid-template-columns: minmax(62px, max-content) 1fr;
  gap: 0 8px; align-items: baseline;
  font-size: ${E.tag}px; line-height: 1.5;
}
.readout-row { display: contents; }
.readout-key { color: var(--muted); white-space: nowrap; }
.readout-value { color: var(--fg); overflow-wrap: anywhere; }
.content {
  border-radius: 0; padding: 14px 8px;
  text-align: center; font-weight: ${P.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,Te=oe,pe=-1,xe=!1;function un(e){let t=document.createElement("style");t.textContent=mo,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);let r=!1;function i(p,L){let G=document.createElement("div");G.className="readout";let b=document.createElement("div");b.className="tag readout-tag",b.textContent=p,G.appendChild(b);let A=document.createElement("div");A.className="readout-rows",G.appendChild(A);for(let[H,F]of L){let Y=document.createElement("div");Y.className="readout-row";let c=document.createElement("span");c.className="readout-key",c.textContent=H;let h=document.createElement("span");h.className="readout-value",h.textContent=F,Y.append(c,h),A.appendChild(Y)}return G}e.appendChild(o);let a=(p,L)=>Math.min(Math.max(p,oe),Math.max(oe,L-oe));function l(){let p=o.offsetHeight||300;pe<0&&(pe=Math.max(oe,innerHeight-p-oe)),Te=a(Te,innerWidth-o.offsetWidth),pe=a(pe,innerHeight-p),o.style.transform=`translate(${Te-oe}px, ${pe}px)`}let s=null;function y(p){p.button===0&&(p.preventDefault(),p.stopPropagation(),s={x:p.clientX,y:p.clientY,dx:Te,dy:pe},o.setAttribute("data-dragging",""),p.currentTarget.setPointerCapture(p.pointerId))}function d(p){s&&(Te=s.dx+(p.clientX-s.x),pe=s.dy+(p.clientY-s.y),l())}function m(){s=null,o.removeAttribute("data-dragging")}addEventListener("resize",l);let u=null;function k(p){let L=document.createElement("div");return L.className="edge",L.textContent=p===0?"0":$(p),p===0&&L.setAttribute("data-zero",""),L}function R(p,L,G,b){let[A,H,F,Y]=G,c=document.createElement("div");c.className="region",c.setAttribute("data-level",String(L));let h=document.createElement("span");h.className="tag",h.textContent=p;let f=document.createElement("div");f.className="row";let M=document.createElement("div");M.className="fill",M.appendChild(b),f.append(k(Y),M,k(H));let x=document.createElement("div");return x.className="head",x.append(h,k(A)),c.append(x,f,k(F)),c}return{show(p,L=[],G){let b=Ze(p.el),[A,H,F,Y]=b.border,[c,h,f,M]=b.padding,x=Oe(p.el),g=p.width/x.x,C=p.height/x.y,J=Math.abs(x.x-1)>.001||Math.abs(x.y-1)>.001,ie=document.createElement("header"),je=document.createElement("span");je.className="name",je.textContent=p.label;let Ue=document.createElement("span");Ue.className="size",Ue.textContent=`${$(g)} \xD7 ${$(C)}`;let he=document.createElement("button");if(he.className="close",he.textContent="\xD7",he.title="close (B brings it back)",he.addEventListener("pointerdown",v=>v.stopPropagation()),he.addEventListener("click",v=>{v.stopPropagation(),xe=!0,o.removeAttribute("data-open")}),ie.append(je,Ue),J){let v=document.createElement("span");v.className="scale",v.textContent=`\xD7${$(x.x)}`,v.title=`renders at ${$(p.width)} \xD7 ${$(p.height)}`,ie.appendChild(v)}ie.appendChild(he),ie.addEventListener("pointerdown",y),ie.addEventListener("pointermove",d),ie.addEventListener("pointerup",m),ie.addEventListener("pointercancel",m);let qe=document.createElement("div");qe.className="content",qe.textContent=`${$(g-Y-H-M-h)} \xD7 ${$(C-A-F-c-f)}`;let ee=[ie,R("margin",1,b.margin,R("border",2,b.border,R("padding",3,b.padding,qe)))];if(r){let v=Nt(p.el),_=Ne(p.el);ee.push(_.length&&v?i("type",_.map(W=>[W.label,W.value])):i("type",[["","nothing of its own to set type on"]]))}if(G&&G.el!==p.el){let v=Kt(G.el,p.el).map(W=>[W.prop,`${W.a||"\u2014"} \u2192 ${W.b||"\u2014"}`]),_=v.slice(0,10);v.length>_.length&&_.push(["",`and ${v.length-_.length} more`]),ee.push(i(`differs from ${G.label}`,_.length?_:[["","nothing in the properties it compares"]]))}let Ae=Xt(p.el);if(Ae&&Ae.rows.length&&ee.push(i(`laid out by ${Ae.display}`,Ae.rows.map(v=>[v.label,v.value]))),L.length){let v=L.map(W=>[$(W.px),W.detail]),_=Ot(L.map(W=>W.px));_&&v.push(["",_]),ee.push(i("gaps",v))}let wt=Bt(p.el),kt=Dt([g,C,...b.margin,...b.border,...b.padding,...r?Ne(p.el).map(v=>v.px):[]],wt);kt&&ee.push(i("tokens",[["",kt]]));let St=Wt(p.el);St.length&&ee.push(i("styled by",St.slice(0,4).map(v=>[v.selector,v.file])));let $t=Ht(p.el);$t>1&&ee.push(i("matches",[["",`${$t} elements share ${Qe(p.el)}`]]));let Et=wt.filter(v=>Je(v.value));if(Et.length){let v=zt(p.el).map(({label:_,value:W})=>{let Ct=Pt(W,Et);return[_,Ct.length?`${W}  ${Ct.join(" ")}`:`${W}  \u2014`]});v.length&&ee.push(i("colour",v))}n.replaceChildren(...ee),u=p,l(),!xe&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},showsType:()=>r,isOpen:()=>!xe&&u!==null,toggleType(){r=!r,u&&this.show(u)},asText(){if(!u)return"";let p=Ze(u.el),L=Oe(u.el),G=u.width/L.x,b=u.height/L.y,A=F=>F.map(Y=>$(Y)).join(" "),H=[`${u.label}  ${$(G)} \xD7 ${$(b)}`,`margin   ${A(p.margin)}`,`border   ${A(p.border)}`,`padding  ${A(p.padding)}`];if(r)for(let F of Ne(u.el))H.push(`${F.label.padEnd(8)} ${F.value}`);return H.join(fo)},hide(){u=null,o.removeAttribute("data-open")},toggle(){u&&(xe=!xe,xe?o.removeAttribute("data-open"):(l(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",l),o.remove(),t.remove()}}}function dn(e=20,t=1e3){let o=[];return{push(n,r,i=Date.now()){let a=o[o.length-1];if(a&&r!==""&&a.tag===r&&i-a.at<=t){a.at=i;return}o.push({state:n,tag:r,at:i}),o.length>e&&o.shift()},pop(){return o.pop()?.state??null},depth(){return o.length},clear(){o.length=0}}}var ho=[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure what is under the cursor"],["Click","lock an element"],["Right-click","add to, or drop from, the locked set"],["Drag the panel header","move the box model"],["B","hide or bring back the box model"],["R","rulers down the top and left edges"],["Drag from a rule","pull out a guide; drag it back to remove"],["V","vertical guide at the cursor"],["H","horizontal guide at the cursor"],["Hover a guide","distance from it to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the last guide you touched; Shift for 10px"],["L","pin that guide so it cannot be moved or deleted"],["Ctrl/Cmd + Z","undo the last change \u2014 a run of nudges counts as one"],["T","type and token readout for the locked element"],["F","freeze the page so a moving thing can be measured"],["G","your column grid, if one is configured"],["K","a ten-pixel texture to read against"],["X","x-ray: outline every element on the page"],["P","pick a colour from anywhere on screen"],["C","copy the numbers in the panel"],["Ctrl/Cmd while placing","ignore snapping"],["Del","remove the guide under the cursor; Shift+Del for all"],["Esc","clear the locks, then close"]],fe=16,lt=E.tag+12,st=8,go=`
.flag {
  position: fixed; top: ${fe}px; right: ${fe}px;
  display: flex; align-items: center; gap: 8px;
  transition: top 160ms cubic-bezier(0.19, 1, 0.22, 1);
  padding: 6px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${E.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${E.tag}px; font-weight: ${P.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${B.primary};
  background: ${ne};
  box-shadow: ${de};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
/* The rulers draw a gutter along the top edge, and the badge sits in it. Step
   down out of the way rather than covering the ticks the rulers exist to show. */
.flag[data-rulers] { top: ${fe+w}px; }
.help[data-rulers] { top: ${fe+w+lt+st}px; }
.flag:hover { background: ${K(1)}; }
.flag .count { color: ${B.secondary}; }

/* A layers bar, not a palette. Switches, then the one control that changes the
   page, then the things that happen once. */
.tools { display: flex; align-items: center; gap: 2px; }
.sep {
  width: 1px; align-self: stretch; margin: 0 4px;
  background: ${le};
}
.tool {
  width: 20px; height: 20px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; cursor: pointer;
  font: inherit; font-size: ${E.tag}px; font-weight: ${P.medium};
  color: ${B.tertiary};
}
.tool:hover { background: ${K(2)}; color: ${B.primary}; }
.tool:focus-visible { outline: 1px solid ${B.primary}; outline-offset: -1px; }
/* On is the film, not a colour: the three hues each already mean something on
   the canvas, and a fourth here would say nothing. */
.tool[data-on] { background: ${K(4)}; color: ${B.primary}; }
.tool[data-once]:active { background: ${K(4)}; }
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: ${fe+lt+st}px; right: ${fe}px; width: 292px;
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${fe*2+lt+st}px); overflow-y: auto;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${E.stack};
  font-synthesis: none;
  font-size: ${E.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${B.primary};
  background: ${ne};
  box-shadow: ${de};
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
  font: inherit; font-weight: ${P.medium};
  border: 1px solid ${le};
  background: ${K(2)};
}
.help dd { margin: 0; color: ${B.secondary}; }
`,pn=[{name:"rulers",label:"R",title:"rulers down the top and left edges",toggle:!0},{name:"xray",label:"X",title:"outline every element on the page",toggle:!0},{name:"grid",label:"G",title:"your column grid, if one is configured",toggle:!0},{name:"pixels",label:"K",title:"a ten-pixel texture to read against",toggle:!0},{name:"type",label:"T",title:"type and token readout",toggle:!0},{name:"panel",label:"B",title:"the box model panel",toggle:!0},{name:"freeze",label:"F",title:"hold the page still",toggle:!0},{name:"copy",label:"C",title:"copy the numbers in the panel",toggle:!1},{name:"pick",label:"P",title:"pick a colour from anywhere on screen",toggle:!1},{name:"undo",label:"\u21BA",title:"undo the last change to the guides",toggle:!1}];function fn(e,t){let o=document.createElement("style");o.textContent=go,e.appendChild(o);let n=document.createElement("div");n.className="flag";let r=document.createElement("span");r.className="name",r.textContent="Align";let i=document.createElement("span");i.className="count";let a=new Map,l=document.createElement("div");l.className="tools";for(let d of pn){if(d.name==="freeze"||d.name==="copy"){let u=document.createElement("span");u.className="sep",l.appendChild(u)}let m=document.createElement("button");m.type="button",m.className="tool",m.textContent=d.label,m.title=`${d.title}  \xB7  ${d.name==="undo"?"Ctrl/Cmd+Z":d.label}`,d.toggle||m.setAttribute("data-once",""),m.addEventListener("click",u=>{u.stopPropagation(),t(d.name)}),a.set(d.name,m),l.appendChild(m)}n.append(r,l,i);let s=document.createElement("div");s.className="help";let y=document.createElement("dl");for(let[d,m]of ho){let u=document.createElement("dt"),k=document.createElement("kbd");k.textContent=d,u.appendChild(k);let R=document.createElement("dd");R.textContent=m,y.append(u,R)}return s.appendChild(y),n.addEventListener("click",d=>{d.stopPropagation(),s.toggleAttribute("data-open")}),e.append(n,s),{update(d,m){i.textContent=d>0?`${d} locked`:"",n.toggleAttribute("data-rulers",m.rulers),s.toggleAttribute("data-rulers",m.rulers);for(let u of pn)u.toggle&&a.get(u.name)?.toggleAttribute("data-on",m[u.name]===!0)},closeHelp(){let d=s.hasAttribute("data-open");return s.removeAttribute("data-open"),d},destroy(){n.remove(),s.remove(),o.remove()}}}var Pe=5,ct=4,Le=12,mn=.22,ye=10,xo=50,yo=100;function hn(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,grid:null,pixels:!1,guides:[],liveGuide:null,activeGuide:null},i=it(at()),a=0;function l(){let c=at();i=it(c),e.style.colorScheme=c?"dark":"light",Y()}l();let s=matchMedia("(prefers-color-scheme: dark)"),y=()=>l();s.addEventListener("change",y),cn(()=>Y());function d(){let c=devicePixelRatio;o.width=Math.round(innerWidth*c),o.height=Math.round(innerHeight*c),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(c,0,0,c,0,0),n.translate(.5,.5)}let m=c=>Math.round(c)-.5;function u(c,h){n.strokeStyle=h,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(c.left),Math.round(c.top),Math.round(c.width),Math.round(c.height))}function k(c){n.strokeStyle=ge(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let h of[c.left,c.right])n.moveTo(Math.round(h),0),n.lineTo(Math.round(h),innerHeight);for(let h of[c.top,c.bottom])n.moveTo(0,Math.round(h)),n.lineTo(innerWidth,Math.round(h));n.stroke(),n.setLineDash([])}function R(c){if(n.strokeStyle=c.extension?ge(i.measure,.55):i.measure,n.lineWidth=1,n.setLineDash(c.extension?[3,3]:[]),n.beginPath(),n.moveTo(Math.round(c.x1),Math.round(c.y1)),n.lineTo(Math.round(c.x2),Math.round(c.y2)),c.extension){n.stroke();return}if(c.axis==="x")for(let h of[c.x1,c.x2])n.moveTo(Math.round(h),Math.round(c.y1)-Pe),n.lineTo(Math.round(h),Math.round(c.y1)+Pe);else for(let h of[c.y1,c.y2])n.moveTo(Math.round(c.x1)-Pe,Math.round(h)),n.lineTo(Math.round(c.x1)+Pe,Math.round(h));n.stroke()}function p(c){return n.font=`${P.medium} ${E.body}px ${E.stack}`,{w:n.measureText(c).width+ct*2,h:E.body+ct*2+2}}function L(c,h,f,M){n.font=`${P.medium} ${E.body}px ${E.stack}`,n.textBaseline="middle";let{w:x,h:g}=p(c),C=m(Math.min(Math.max(h,Le),innerWidth-x-Le)),J=m(Math.min(Math.max(f,Le),innerHeight-g-Le));n.fillStyle=M,n.beginPath(),n.roundRect(C,J,Math.ceil(x),g,4),n.fill(),n.fillStyle=i.surface,n.fillText(c,C+ct,J+g/2)}function G(c,h,f,M,x=!1){let{w:g,h:C}=p(c);L(c,x?h-g/2:h,x?f-C/2:f,M)}function b(){let c=scrollX,h=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,w),n.fillRect(-.5,-.5,w,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${P.regular} 9px ${E.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let g of r.pinned)n.fillRect(m(g.left),-.5,Math.round(g.width),w),n.fillRect(-.5,m(g.top),w,Math.round(g.height));n.restore(),n.beginPath(),n.moveTo(-.5,w-.5),n.lineTo(innerWidth,w-.5),n.moveTo(w-.5,-.5),n.lineTo(w-.5,innerHeight),n.stroke();let f=g=>g%yo===0?w:g%xo===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let M=Math.floor(c/ye)*ye;for(let g=M;g<c+innerWidth;g+=ye){let C=Math.round(g-c);if(C<w)continue;let J=f(g);n.moveTo(C,w-J),n.lineTo(C,w),J===w&&(n.fillStyle=i.muted,n.fillText(String(g),C+3,3))}n.stroke(),n.beginPath();let x=Math.floor(h/ye)*ye;for(let g=x;g<h+innerHeight;g+=ye){let C=Math.round(g-h);if(C<w)continue;let J=f(g);n.moveTo(w-J,C),n.lineTo(w,C),J===w&&(n.save(),n.translate(3,C-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(g),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),w),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo(w,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let g of r.guides){let C=Math.round(Ee(g));g.axis==="x"?n.fillRect(C-1,-.5,2,w):n.fillRect(-.5,C-1,w,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,w,w),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,w,w)}function A(){let c=nn(10,1);if(c){n.strokeStyle=i.pixelLine,n.lineWidth=1,n.setLineDash([]),n.beginPath();for(let h=0;h<=innerWidth;h+=c)n.moveTo(h,0),n.lineTo(h,innerHeight);for(let h=0;h<=innerHeight;h+=c)n.moveTo(0,h),n.lineTo(innerWidth,h);n.stroke()}}function H(c){let h=tn(c,document.documentElement.clientWidth);n.fillStyle=ge(i.measure,.08);for(let f of h)n.fillRect(m(f.left),-.5,Math.round(f.width),innerHeight+1)}function F(){a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore(),r.pixels&&A(),r.grid&&H(r.grid);for(let f of r.pinned)u(f,i.accent);r.hover&&(k(r.hover),u(r.hover,r.pinned.length?ge(i.accent,.7):i.accent));for(let f of r.guides){let M=r.liveGuide?.id===f.id;n.strokeStyle=f.locked||M?i.guide:ge(i.guide,.55),n.lineWidth=f.pinned?2:1,n.setLineDash(f.locked?[]:[4,4]),n.beginPath();let x=Math.round(Ee(f));if(f.axis==="x"?(n.moveTo(x,0),n.lineTo(x,innerHeight)):(n.moveTo(0,x),n.lineTo(innerWidth,x)),n.stroke(),r.activeGuide===f.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let g=7;f.axis==="x"?(n.moveTo(x,0),n.lineTo(x,g),n.moveTo(x,innerHeight-g),n.lineTo(x,innerHeight)):(n.moveTo(0,x),n.lineTo(g,x),n.moveTo(innerWidth-g,x),n.lineTo(innerWidth,x)),n.stroke()}}for(let f of r.lines)n.globalAlpha=f.faded?mn:1,R(f);n.globalAlpha=1;let c=r.lines.filter(f=>f.label!==""),h=c.map(f=>{let M=(f.x1+f.x2)/2,x=(f.y1+f.y2)/2,{w:g,h:C}=p(f.label);return f.axis==="x"?{x:M-g/2,y:x-16-C/2,w:g,h:C,axis:f.axis}:{x:M+26-g/2,y:x-C/2,w:g,h:C,axis:f.axis}});if(en(h,{w:innerWidth,h:innerHeight},Le).forEach((f,M)=>{let x=c[M];n.globalAlpha=x.faded?mn:1,L(x.label,f.x,f.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:f,height:M,scale:x}=r.hover;G(`${$(f/x.x)} \xD7 ${$(M/x.y)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let f=r.liveGuide,M=Math.round(Ee(f));G([`${f.axis} ${$(f.at)}`,f.caught,f.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),f.axis==="x"?M+6:30,f.axis==="x"?30:M+6,i.guide)}r.rulers&&b()}function Y(){a||(a=requestAnimationFrame(F))}return d(),{root:t,update(c){Object.assign(r,c),Y()},resize(){d(),Y()},destroy(){a&&cancelAnimationFrame(a),s.removeEventListener("change",y),e.remove()}}}function bo(e){let t=e.trim().replace(/^#/,""),o=t.length===3?t.split("").map(n=>n+n).join(""):t;return/^[0-9a-f]{6}$/i.test(o)?{r:parseInt(o.slice(0,2),16),g:parseInt(o.slice(2,4),16),b:parseInt(o.slice(4,6),16)}:null}function vo({r:e,g:t,b:o}){let n=r=>Math.round(r).toString(16).padStart(2,"0");return`#${n(e)}${n(t)}${n(o)}`}function wo({r:e,g:t,b:o}){return`rgb(${Math.round(e)} ${Math.round(t)} ${Math.round(o)})`}function me(e,t){return String(Number(e.toFixed(t)))}function ko({r:e,g:t,b:o}){let n=e/255,r=t/255,i=o/255,a=Math.max(n,r,i),l=Math.min(n,r,i),s=(a+l)/2,y=a-l,d=0,m=0;return y!==0&&(m=y/(1-Math.abs(2*s-1)),a===n?d=(r-i)/y%6:a===r?d=(i-n)/y+2:d=(n-r)/y+4,d*=60,d<0&&(d+=360)),`hsl(${me(d,1)} ${me(m*100,1)}% ${me(s*100,1)}%)`}function ut(e){let t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4}function So(e){let t=ut(e.r),o=ut(e.g),n=ut(e.b),r=.4122214708*t+.5363325363*o+.0514459929*n,i=.2119034982*t+.6806995451*o+.1073969566*n,a=.0883024619*t+.2817188376*o+.6299787005*n,l=Math.cbrt(r),s=Math.cbrt(i),y=Math.cbrt(a),d=.2104542553*l+.793617785*s-.0040720468*y,m=1.9779984951*l-2.428592205*s+.4505937099*y,u=.0259040371*l+.7827717662*s-.808675766*y,k=Math.sqrt(m*m+u*u),R=Math.atan2(u,m)*180/Math.PI;return R<0&&(R+=360),k<1e-4?`oklch(${me(d,4)} 0 0)`:`oklch(${me(d,4)} ${me(k,4)} ${me(R,2)})`}function gn(e){let t=bo(e);return t?[{label:"hex",value:vo(t)},{label:"rgb",value:wo(t)},{label:"hsl",value:ko(t)},{label:"oklch",value:So(t)}]:[]}var $o=`
.picker {
  position: fixed; top: 46px; right: 16px; width: 200px;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${E.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${E.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${B.primary};
  background: ${ne};
  box-shadow: ${de};
  display: none;
}
.picker[data-open] { display: block; }
.picker .swatch {
  height: 40px; margin-bottom: 8px;
  border: 1px solid ${le};
}
/* Each row copies itself, so the whole row is the target rather than the text. */
.picker button {
  display: grid; grid-template-columns: 34px 1fr;
  gap: 8px; align-items: baseline;
  width: 100%; padding: 3px 4px; margin: 0;
  border: 0; background: none; cursor: pointer;
  font: inherit; text-align: left;
  color: ${B.primary};
}
.picker button:hover { background: ${K(2)}; }
.picker button:focus-visible { outline: 1px solid ${B.primary}; outline-offset: -1px; }
.picker .k { color: ${B.secondary}; }
.picker .v { overflow-wrap: anywhere; }
.picker .hint {
  margin-top: 6px; padding-top: 6px;
  border-top: 1px solid ${le};
  color: ${B.secondary};
}
`;function xn(e){let t=document.createElement("style");t.textContent=$o,e.appendChild(t);let o=document.createElement("div");o.className="picker",e.appendChild(o);let n=document.createElement("div");n.className="swatch";let r=document.createElement("div");r.className="hint";function i(a){n.style.background=a;let l=gn(a).map(({label:s,value:y})=>{let d=document.createElement("button");d.type="button";let m=document.createElement("span");m.className="k",m.textContent=s;let u=document.createElement("span");return u.className="v",u.textContent=y,d.append(m,u),d.addEventListener("click",k=>{k.stopPropagation(),navigator.clipboard?.writeText(y).then(()=>{r.textContent=`copied ${s}`},()=>{r.textContent="clipboard refused"})}),d});r.textContent="click a row to copy",o.replaceChildren(n,...l,r),o.setAttribute("data-open","")}return{async open(){let a=window.EyeDropper;if(!a){o.replaceChildren(Object.assign(document.createElement("div"),{className:"hint",textContent:"this browser has no eyedropper"})),o.setAttribute("data-open","");return}try{let{sRGBHex:l}=await new a().open();i(l)}catch{}},close(){let a=o.hasAttribute("data-open");return o.removeAttribute("data-open"),a},destroy(){o.remove(),t.remove()}}}var dt="__align_freeze",Eo=`
[data-align-frozen] *:not([data-align-ignore]):not([data-align-ignore] *) {
  animation-play-state: paused !important;
}
`,pt=!1,ze=[],He=[];function yn(e){let t=e;for(;t;){if(t instanceof Element&&t.hasAttribute("data-align-ignore"))return!0;let o=t.getRootNode();if(t=o instanceof ShadowRoot?o.host:t.parentNode??null,t===document)return!1}return!1}function Me(){return pt}function We(e){if(e!==pt){if(pt=e,!e){document.documentElement.removeAttribute("data-align-frozen"),document.getElementById(dt)?.remove();for(let t of ze)try{t.play()}catch{}for(let t of He)t.play().catch(()=>{});ze=[],He=[];return}if(!document.getElementById(dt)){let t=document.createElement("style");t.id=dt,t.textContent=Eo,t.setAttribute("data-align-ignore",""),document.head.appendChild(t)}document.documentElement.setAttribute("data-align-frozen",""),ze=[];try{for(let t of document.getAnimations()){if(t.playState!=="running")continue;let o=t.effect?.target??null;yn(o)||(t.pause(),ze.push(t))}}catch{}He=[];for(let t of Array.from(document.querySelectorAll("video")))t.paused||yn(t)||(t.pause(),He.push(t))}}var ft="__align_xray",Co=`
[data-align-xray] * { outline: 1px solid rgb(128 128 128 / 0.55) !important; }
[data-align-xray] [data-align-ignore],
[data-align-xray] [data-align-ignore] * { outline: none !important; }
`;function Xe(e){let t=document.documentElement;if(!e){t.removeAttribute("data-align-xray"),document.getElementById(ft)?.remove();return}if(!document.getElementById(ft)){let o=document.createElement("style");o.id=ft,o.textContent=Co,o.setAttribute("data-align-ignore",""),document.head.appendChild(o)}t.setAttribute("data-align-xray","")}var mt="align-ui";function bn(e){try{return localStorage.getItem(e)}catch{return null}}function vn(e,t){try{localStorage.setItem(e,t)}catch{}}function wn(e){let t="/";try{t=location.pathname||"/"}catch{}return`${mt}:${e}::${t}`}function To(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function kn(){let e=bn(wn("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(To).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function Sn(e){vn(wn("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function Ye(e){return bn(`${mt}:${e}`)==="1"}function Re(e,t){vn(`${mt}:${e}`,t?"1":"0")}var X,T=null,z=null,ce=null,$e=null,Q=!1,ve=Ye("grid"),we=Ye("pixels"),D=null,S=[],_e=0,Z=Ye("rulers"),N=[],Rn=1,$n=!1,re=null,xt=dn();function Lo(){return N.map(e=>({...e}))}function ke(e=""){xt.push(Lo(),e)}function En(){return N.find(e=>e.id===re)??null}function se(e){N=e,Sn(N)}var O=null,V=null,U=null,Mo=3,be=22;function Gn(e,t){return Z?t<be&&e>=be?"y":e<be&&t>=be?"x":null:null}function yt(e){return e.ctrlKey||e.metaKey}function An(e,t,o,n){let r=ue(t,o,X),i=e.axis==="x"?t:o,a=N.filter(s=>s.id!==e.id).map(s=>({axis:s.axis,at:Ge(s).pos})),l=Jt(i,Qt(r,e.axis,a),n);e.at=l.at+(e.axis==="x"?scrollX:scrollY),e.caught=l.what}function Nn(e,t,o,n){let r={id:Rn++,axis:e,at:0,locked:!1,caught:"",pinned:!1};return ke(),An(r,t,o,n),se([...N,r]),re=r.id,r}function Bn(e){e.pinned||(ke(),se(N.filter(t=>t.id!==e.id)),V?.id===e.id&&(V=null),O?.id===e.id&&(O=null))}function Ro(e){let t=X.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function Ge(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function bt(){return S.length>=2?S[S.length-2]:void 0}function vt(){if(S.length<2)return[];let e=[];for(let[t,o]of et(S))for(let n of Ie(t,o)){if(n.extension||!n.label)continue;let r=Ft(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:It(r)})}return e}function I(e){let t=S[S.length-1],o=D&&S.some(u=>u.el===D.el),n=N.map(Ge),r=!O&&V?V:null,i=N.filter(u=>u.locked||u.id===r?.id),a=!r&&o?D.el:null,l=r??a,s=r?Ge(r):null,y=[],d=(u,k)=>{for(let R of u)y.push(l&&!k?{...R,faded:!0}:R)},m=u=>!s||u.axis!==s.axis?!1:(u.axis==="x"?[u.x1,u.x2]:[u.y1,u.y2]).some(R=>Math.abs(R-s.pos)<.5);for(let[u,k]of et(S))d(Ie(u,k),u.el===a||k.el===a);t&&D&&!o&&!r&&d(Ie(t,D),!0);for(let u of i)for(let k of S)d(nt(k,[Ge(u)]),u.id===r?.id||k.el===a);D&&!o&&!r&&N.length&&d(nt(D,n),!0);for(let u of Zt(i.map(Ge),{x:innerWidth/2,y:innerHeight/2}))d([u],m(u));T?.update({hover:D,pinned:S,rulers:Z,grid:ve&&X.grid?X.grid:null,pixels:we,guides:N,liveGuide:O??V,activeGuide:re,lines:y,...e?{cursor:e}:{}}),ce?.update(S.length,{rulers:Z,xray:Q,grid:ve,pixels:we,freeze:Me(),type:z?.showsType()??!1,panel:z?.isOpen()??!1})}function Dn(){let e=z?.asText()??"";e&&navigator.clipboard?.writeText(e).catch(()=>{})}function Fn(){let e=xt.pop();e&&(se(e),V=null,O=null,U=null,e.some(t=>t.id===re)||(re=null))}function ht(e){switch(e){case"rulers":Z=!Z,Re("rulers",Z);break;case"xray":Q=!Q,Xe(Q);break;case"grid":ve=!ve,Re("grid",ve);break;case"pixels":we=!we,Re("pixels",we);break;case"freeze":We(!Me());break;case"type":z?.toggleType();break;case"panel":z?.toggle();break;case"copy":Dn();break;case"pick":$e?.open();break;case"undo":Fn();break}I()}var Ke=null;function In(e){if(Ke={x:e.clientX,y:e.clientY},O){U&&Math.hypot(e.clientX-U.x,e.clientY-U.y)>Mo&&(U=null),!U&&!O.pinned&&(An(O,e.clientX,e.clientY,yt(e)),se([...N])),I({x:e.clientX,y:e.clientY});return}V=tt(N,e.clientX,e.clientY),D=ue(e.clientX,e.clientY,X),I({x:e.clientX,y:e.clientY})}function On(e){O&&(U?(O.locked=!O.locked,re=O.id,se([...N])):(Gn(e.clientX,e.clientY)||e.clientX<be||e.clientY<be)&&Bn(O),U=null,O=null,I({x:e.clientX,y:e.clientY}))}function Pn(e){if(e.button!==0)return;let t=ue(e.clientX,e.clientY,X);if(!t)return;let o=Gn(e.clientX,e.clientY);if(o){Se(e),U=null,O=Nn(o,e.clientX,e.clientY,yt(e)),I({x:e.clientX,y:e.clientY});return}let n=tt(N,e.clientX,e.clientY);if(n){Se(e),ke(),re=n.id,O=n,U={x:e.clientX,y:e.clientY},I({x:e.clientX,y:e.clientY});return}Se(e),ce?.closeHelp(),S=[t],D=t,z?.show(t,vt(),bt()),I({x:e.clientX,y:e.clientY})}function zn(e){let t=ue(e.clientX,e.clientY,X);if(!t)return;Se(e),ce?.closeHelp();let o=S.findIndex(r=>r.el===t.el);S=o>=0?S.filter((r,i)=>i!==o):[...S,t],D=t;let n=S[S.length-1];n?z?.show(n,vt(),bt()):z?.hide(),I({x:e.clientX,y:e.clientY})}function Hn(e){ue(e.clientX,e.clientY,X)&&Se(e)}function Wn(e){ue(e.clientX,e.clientY,X)&&Se(e)}function Se(e){e.preventDefault(),e.stopPropagation()}function Cn(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var Tn=0,Ln=0;function Xn(){_e=requestAnimationFrame(Xn);let t=S.filter(a=>a.el.isConnected).map(a=>Fe(a.el)),o=D&&D.el.isConnected?Fe(D.el):null;if(!(scrollX!==Tn||scrollY!==Ln||t.length!==S.length||t.some((a,l)=>!Cn(a,S[l]))||D===null!=(o===null)||D!==null&&o!==null&&!Cn(D,o)))return;Tn=scrollX,Ln=scrollY,S=t,D=o;let i=S[S.length-1];i?z?.show(i,vt(),bt()):z?.hide(),I()}function Yn(){T?.resize()}function Go(){$n||($n=!0,N=kn().map(e=>({...e,id:Rn++}))),!T&&(ln(),T=hn(),z=un(T.root),ce=fn(T.root,ht),$e=xn(T.root),ce.update(0,{rulers:Z,xray:Q,grid:ve,pixels:we,freeze:Me(),type:!1,panel:!1}),addEventListener("mousemove",In),addEventListener("mousedown",Pn,{capture:!0}),addEventListener("mouseup",On,{capture:!0}),addEventListener("click",Hn,{capture:!0}),addEventListener("auxclick",Wn,{capture:!0}),addEventListener("contextmenu",zn,{capture:!0}),addEventListener("resize",Yn),_e=requestAnimationFrame(Xn),I())}function gt(){removeEventListener("mousemove",In),removeEventListener("mousedown",Pn,{capture:!0}),removeEventListener("mouseup",On,{capture:!0}),removeEventListener("click",Hn,{capture:!0}),removeEventListener("auxclick",Wn,{capture:!0}),removeEventListener("contextmenu",zn,{capture:!0}),removeEventListener("resize",Yn),cancelAnimationFrame(_e),_e=0,ce?.destroy(),$e?.destroy(),$e=null,Q&&(Q=!1,Xe(!1)),We(!1),ce=null,z?.destroy(),z=null,T?.destroy(),T=null,sn(),D=null,S=[],O=null,U=null,V=null}function Mn(e){if(Ro(e))e.preventDefault(),T?gt():Go();else if(T&&Ke&&(e.key.toLowerCase()===X.guideKeys.vertical||e.key.toLowerCase()===X.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===X.guideKeys.vertical?"x":"y";Nn(t,Ke.x,Ke.y,yt(e)),I()}else if(T&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(ke(),se(N.filter(t=>t.pinned)),V=null,O=null,U=null,N.some(t=>t.id===re)||(re=null)):V&&Bn(V),I();else if(T&&e.key.startsWith("Arrow")){let t=En(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;ke(`nudge:${t.id}`);let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",se([...N]),I()}else if(T&&e.key.toLowerCase()==="g"){e.preventDefault(),ht("grid");return}else if(T&&e.key.toLowerCase()==="k"){e.preventDefault(),ht("pixels");return}else if(T&&e.key.toLowerCase()==="f")e.preventDefault(),We(!Me()),I();else if(T&&e.key.toLowerCase()==="x")e.preventDefault(),Q=!Q,Xe(Q);else if(T&&e.key.toLowerCase()==="p")e.preventDefault(),$e?.open();else if(T&&e.key.toLowerCase()==="t")e.preventDefault(),z?.toggleType();else if(T&&e.key.toLowerCase()==="c")e.preventDefault(),Dn();else if(T&&e.key.toLowerCase()==="l"){let t=En();if(!t)return;e.preventDefault(),ke(),t.pinned=!t.pinned,se([...N]),I()}else if(T&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){if(xt.depth()===0)return;e.preventDefault(),Fn(),I()}else if(T&&e.key.toLowerCase()===X.rulerKey)e.preventDefault(),Z=!Z,Re("rulers",Z),I();else if(T&&e.key.toLowerCase()===X.panelKey)e.preventDefault(),z?.toggle();else if(e.key==="Escape"&&T){if($e?.close()||ce?.closeHelp())return;S.length?(S=[],z?.hide(),I()):gt()}}function pr(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,X=jt(e),addEventListener("keydown",Mn,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{gt(),removeEventListener("keydown",Mn,{capture:!0}),delete window.__align})}export{pr as initAlign};
