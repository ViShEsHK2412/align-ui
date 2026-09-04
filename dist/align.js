function Y(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function oo(e){return(e.split(",")[0]??"").trim().replace(/^['"]|['"]$/g,"")}function ro(e){let o={100:"thin",200:"extralight",300:"light",400:"regular",500:"medium",600:"semibold",700:"bold",800:"extrabold",900:"black"}[e.trim()];return o?`${e} ${o}`:e}function ze(e){let t=getComputedStyle(e);return[{label:"family",value:oo(t.fontFamily),px:NaN},{label:"size",value:t.fontSize,px:Y(t.fontSize)},{label:"weight",value:ro(t.fontWeight),px:NaN},{label:"line",value:t.lineHeight,px:Y(t.lineHeight)},{label:"tracking",value:t.letterSpacing,px:Y(t.letterSpacing)}]}function Kt(e){let t="";for(let o of e.childNodes)o.nodeType===3&&(t+=o.nodeValue??"");return t.trim().replace(/\s+/g," ")}function _t(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:Y(r)})}return o}function io(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function ao(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function jt(e,t){if(t.length===0)return"";let o=[],n=0;for(let i of ao(e)){let a=io(i,t);a.length?o.push(`${so(i)} ${a.join(" ")}`):n+=1}if(o.length===0)return n===1?"its one number is not on the scale":`none of its ${n} numbers are on the scale`;let r=n===0?"":n===1?"  \xB7  1 more, not on the scale":`  \xB7  ${n} more, not on the scale`;return o.join("  \xB7  ")+r}function so(e){return String(Math.round(e*100)/100)}function Pt(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(Y)}function Ut(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),s=a.display.includes("flex")||a.display.includes("grid"),u=n==="x"?a.columnGap:a.rowGap,m=s&&u!=="normal"?Y(u):null,[f,k,l,h]=Pt(e),[y,D,j,d]=Pt(t),b=P=>Number.isFinite(P)?P:0,L=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,G=n==="x"?L?b(k)+b(d):b(D)+b(h):L?b(l)+b(y):b(j)+b(f);return{px:o,cssGap:m,margins:G,siblings:!0}}function Vt(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function qt(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}function rt(e){let t=e.trim().toLowerCase();return t?t.startsWith("#")||/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(t)?!0:["black","white","transparent","currentcolor"].includes(t):!1}var se;function Ft(e){if(se===void 0&&(se=document.createElement("canvas").getContext("2d")),!se)return"";se.fillStyle="#000000",se.fillStyle=e;let t=se.fillStyle;return se.fillStyle="#ffffff",se.fillStyle=e,t===se.fillStyle?String(t):""}function Jt(e,t){let o=Ft(e);return o?t.filter(n=>rt(n.value)&&Ft(n.value)===o).map(n=>n.name).sort():[]}function Qt(e){let t=getComputedStyle(e),o=[],n=(r,i)=>{let a=i.trim();!a||a==="transparent"||/rgba?\([^)]*,\s*0\s*\)$/.test(a)||o.push({label:r,value:a})};return n("text",t.color),n("background",t.backgroundColor),o}function lo(e,t,o){let n=r=>typeof CSS<"u"&&CSS.escape?CSS.escape(r):r.replace(/[^\w-]/g,"\\$&");return t?`#${n(t)}`:o.length?e+o.map(r=>`.${n(r)}`).join(""):e}function it(e){let t=typeof e.className=="string"?e.className.trim().split(/\s+/).filter(Boolean):[];return lo(e.tagName.toLowerCase(),e.id,t)}function Zt(e){let t=it(e);if(!/[.#]/.test(t))return 0;try{return document.querySelectorAll(t).length}catch{return 0}}function co(e){if(!e)return"inline <style>";let t=e.split("?")[0]??e;try{let o=new URL(t,"http://x").pathname;return decodeURI(o).replace(/^\//,"")||t}catch{return t}}var uo=["width","height","padding","margin","border-width","gap","font-size","line-height","letter-spacing","color","background-color"];function po(e){for(let t=0;t<e.length;t+=1){let o=e.item(t);if(uo.some(n=>o===n||o.startsWith(`${n}-`)))return!0}return!1}function en(e){let t=[],o=new Set,n=(r,i)=>{for(let a of Array.from(r)){if(a instanceof CSSMediaRule){matchMedia(a.conditionText).matches&&n(a.cssRules,i);continue}if(a instanceof CSSSupportsRule){CSS.supports(a.conditionText)&&n(a.cssRules,i);continue}let s=a.cssRules;if(s&&!(a instanceof CSSStyleRule)){n(s,i);continue}if(!(a instanceof CSSStyleRule))continue;let u=!1;try{u=e.matches(a.selectorText)}catch{continue}if(!u||!po(a.style))continue;let m=`${a.selectorText}|${i}`;o.has(m)||(o.add(m),t.push({selector:a.selectorText,file:i}))}};for(let r of Array.from(document.styleSheets)){if(r.ownerNode instanceof Element&&r.ownerNode.hasAttribute("data-align-ignore"))continue;let i;try{i=r.cssRules}catch{continue}n(i,co(r.href))}return t.reverse()}function Ht(e){if(!e||e==="none")return[];let t=e.trim().split(/\s+/),o=[];for(let n of t){if(!n.endsWith("px"))return[];let r=Number.parseFloat(n);if(!Number.isFinite(r))return[];o.push(r)}return o}function zt(e,t,o){let n=0;for(let r=0;r<e.length;r+=1){let i=n+e[r];if(o<i+.5)return r;n=i+t}return-1}function ho(e,t){let o=t==="rtl";return e.startsWith("vertical")||e.startsWith("sideways")?{inline:"y",inlineReversed:e==="sideways-lr"?!o:o,blockReversed:e==="vertical-rl"||e==="sideways-rl"}:{inline:"x",inlineReversed:o,blockReversed:!1}}function Wt(e,t,o,n,r){return r?t-n:o-e}function tn(e){let t=e.parentElement,o=0;for(;t&&getComputedStyle(t).display==="contents";)t=t.parentElement,o+=1;if(!t)return null;let n=getComputedStyle(t),r=getComputedStyle(e),i=n.display,a=[];if(o>0&&a.push({label:"through",value:o===1?"a display: contents parent":`${o} display: contents parents`}),r.position==="absolute"||r.position==="fixed")return a.push({label:"placed by",value:`${r.position}, not by the parent`}),{display:i,rows:a};if(r.float!=="none")return a.push({label:"placed by",value:`float: ${r.float}`}),{display:i,rows:a};let s=i.includes("flex"),u=i.includes("grid");if(!s&&!u)return a.push({label:"flow",value:i}),{display:i,rows:a};let m=Xt(n.rowGap==="normal"?"0px":n.rowGap),f=Xt(n.columnGap==="normal"?"0px":n.columnGap),k=m===f?m:`row ${m} \xB7 column ${f}`;if(s){let B=n.flexDirection;a.push({label:"direction",value:n.flexWrap==="nowrap"?B:`${B} \xB7 ${n.flexWrap}`}),a.push({label:"justify",value:n.justifyContent}),a.push({label:"align",value:n.alignItems}),a.push({label:"gap",value:k});let c=`${r.flexGrow} ${r.flexShrink} ${r.flexBasis}`;return c!=="0 1 auto"&&a.push({label:"this child",value:`flex: ${c}`}),r.alignSelf!=="auto"&&a.push({label:"align-self",value:r.alignSelf}),{display:i,rows:a}}let l=Ht(n.gridTemplateColumns),h=Ht(n.gridTemplateRows);l.length&&a.push({label:"columns",value:`${l.length} \xB7 ${l.map(ot).join(" ")}`}),h.length&&a.push({label:"rows",value:`${h.length} \xB7 ${h.map(ot).join(" ")}`}),a.push({label:"gap",value:k});let y=t.getBoundingClientRect(),D=e.getBoundingClientRect(),j={left:y.left+Y(n.borderLeftWidth)+Y(n.paddingLeft),right:y.right-Y(n.borderRightWidth)-Y(n.paddingRight),top:y.top+Y(n.borderTopWidth)+Y(n.paddingTop),bottom:y.bottom-Y(n.borderBottomWidth)-Y(n.paddingBottom)},d=ho(n.writingMode,n.direction),b=(B,c)=>B==="x"?Wt(j.left,j.right,D.left,D.right,c):Wt(j.top,j.bottom,D.top,D.bottom,c),L=d.inline==="x"?"y":"x",G=Y(n.columnGap==="normal"?"0":n.columnGap),P=Y(n.rowGap==="normal"?"0":n.rowGap),J=zt(l,G,b(d.inline,d.inlineReversed)),U=zt(h,P,b(L,d.blockReversed)),X=[];return J>=0&&X.push(`column ${J+1} of ${l.length}`),U>=0&&X.push(`row ${U+1} of ${h.length}`),X.length&&a.push({label:"this child",value:X.join(" \xB7 ")}),{display:i,rows:a}}function Xt(e){return e.endsWith("px")?ot(Number.parseFloat(e)):e}function ot(e){return String(Math.round(e*100)/100)}var nn=["display","position","width","height","padding","margin","border-width","border-style","border-radius","font-family","font-size","font-weight","font-style","line-height","letter-spacing","text-transform","text-align","color","background-color","border-color","opacity","flex-direction","justify-content","align-items","gap","flex-grow","flex-shrink","flex-basis","align-self","box-shadow","overflow","text-overflow","white-space"];function mo(e,t){let o=[];for(let n of nn){let r=e[n]??"",i=t[n]??"";r!==i&&o.push({prop:n,a:r,b:i})}return o}function Yt(e){let t=getComputedStyle(e),o={};for(let n of nn)o[n]=t.getPropertyValue(n);return o}function on(e,t){return mo(Yt(e),Yt(t))}var fo={ignore:"",grid:null,hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function an(e={}){return{...fo,...e}}var rn=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function sn(e){return e.ignore?`${rn}, ${e.ignore}`:rn}function T(e){return String(Math.round(e*100)/100)}function go(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function Ye(e){let t=e.getBoundingClientRect();return{el:e,label:go(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height,scale:_e(e)}}function ln(e,t){let o=(n,r)=>Math.abs(n-r)<.001;return o(e.scale.x,t.scale.x)&&o(e.scale.y,t.scale.y)?e.scale:{x:1,y:1}}function cn(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function ge(e,t,o){let n=sn(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=cn(r);return r&&r!==document.documentElement?Ye(r):null}var We=e=>parseFloat(e)||0;function at(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[We(n),We(r),We(i),We(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function xo(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function yo(e,t){let o=ln(e,t),n=t.left+t.width/2,r=t.top+t.height/2;return[{x1:e.left,y1:r,x2:t.left,y2:r,label:T((t.left-e.left)/o.x),axis:"x"},{x1:t.right,y1:r,x2:e.right,y2:r,label:T((e.right-t.right)/o.x),axis:"x"},{x1:n,y1:e.top,x2:n,y2:t.top,label:T((t.top-e.top)/o.y),axis:"y"},{x1:n,y1:t.bottom,x2:n,y2:e.bottom,label:T((e.bottom-t.bottom)/o.y),axis:"y"}]}function Xe(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function Ke(e,t){let o=[],n=ln(e,t),r=e.left<t.right&&t.left<e.right,i=e.top<t.bottom&&t.top<e.bottom;if(r&&i){let[a,s]=xo(e,t);return yo(a,s)}if(!r){let[a,s]=e.right<=t.left?[e,t]:[t,e],u=i?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:a.right,y1:u,x2:s.left,y2:u,label:`${T((s.left-a.right)/n.x)}`,axis:"x"}),o.push(...Xe(a.right,a.top,a.bottom,u,"x")),o.push(...Xe(s.left,s.top,s.bottom,u,"x"))}if(!i){let[a,s]=e.bottom<=t.top?[e,t]:[t,e],u=r?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:u,y1:a.bottom,x2:u,y2:s.top,label:`${T((s.top-a.bottom)/n.y)}`,axis:"y"}),o.push(...Xe(a.bottom,a.left,a.right,u,"y")),o.push(...Xe(s.top,s.left,s.right,u,"y"))}return o}function bo(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function st(e){let t=bo(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var wo=5,vo=8;function Ne(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function lt(e,t,o){let n=null,r=wo;for(let i of e){let a=Math.abs(Ne(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function un(e,t,o){if(o)return{at:e,what:""};let n=null,r=vo;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function dn(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function ct(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,s=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:s,y2:i,label:T(r.gap),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,s=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:s,label:T(r.gap),axis:"y"})}}return o}function pn(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],s=r[i],u=s-a;u<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:s,y2:t.y,label:T(u),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:s,label:T(u),axis:"y"}))}}return o}var de=3;function ko(e,t){return e.x<t.x+t.w+de&&t.x<e.x+e.w+de&&e.y<t.y+t.h+de&&t.y<e.y+e.h+de}function hn(e,t,o=12){let n=(a,s)=>Math.min(Math.max(a,o),t.w-s-o),r=(a,s)=>Math.min(Math.max(a,o),t.h-s-o),i=[];for(let a of e){let s={...a,x:n(a.x,a.w),y:r(a.y,a.h)},u=!1;for(let m=0;m<16;m++){let f=i.find(l=>ko(l,s));if(!f)break;let k=s.axis==="x"?s.y:s.x;if(s.axis==="x"?s.y=r(u?f.y+f.h+de:f.y-s.h-de,s.h):s.x=n(u?f.x-s.w-de:f.x+f.w+de,s.w),(s.axis==="x"?s.y:s.x)===k){if(u)break;u=!0}}i.push(s)}return i}function mn(e,t){let{columns:o,gutter:n,margin:r}=e;if(o<=0)return[];let i=e.maxWidth>0?Math.min(e.maxWidth,t):t,a=Math.max(0,(t-i)/2),u=(Math.max(0,i-r*2)-n*(o-1))/o;if(u<=0)return[];let m=[];for(let f=0;f<o;f+=1)m.push({left:a+r+f*(u+n),width:u});return m}function fn(e,t){return e*t>=8?e:0}function $o(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(s=>parseFloat(s)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function _e(e){let t=1,o=1;for(let n=e;n;n=cn(n)){let r=$o(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var ne=(e,t)=>({light:e,dark:t}),ut={accent:ne("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:ne("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:ne("oklch(1 0 0)","oklch(0.264 0 0)"),fg:ne("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:ne("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:ne("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:ne("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:ne("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)"),pixelLine:ne("oklch(0.205 0 0 / 0.14)","oklch(0.97 0 0 / 0.14)")};function xn(e){return`light-dark(${e.light}, ${e.dark})`}var le=xn(ne("#fafafa","#1a1a1a"));function Be(e,t=e){return xn(ne(`rgb(0 0 0 / ${t})`,`rgb(255 255 255 / ${e})`))}var gn=[0,.07,.08,.1,.12,.15,.2];function q(e){let t=gn[Math.max(0,Math.min(gn.length-1,e))];return t===0?le:Be(t)}var N={primary:Be(.9),secondary:Be(.6),tertiary:Be(.46,.55)},pe=Be(.12),xe="0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)",yn="0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)",v=22,pt=36,K={tight:4,base:8,roomy:12,edge:16},ee={exit:"160ms cubic-bezier(0.3, 0, 1, 1)",ui:"160ms cubic-bezier(0.2, 0, 0, 1)"},So='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',E={title:13,body:12,tag:11,stack:So},F={regular:400,medium:500,semibold:600},dt="__align_font",Eo="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function bn(){if(document.getElementById(dt))return;let e=document.createElement("link");e.id=dt,e.rel="stylesheet",e.href=Eo,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function wn(){document.getElementById(dt)?.remove()}function vn(e){let t=[`${F.medium} ${E.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function ht(e){let t={};for(let o of Object.keys(ut))t[o]=e?ut[o].dark:ut[o].light;return t}function mt(){let e=document.documentElement,t=getComputedStyle(e).colorScheme;if(/dark/.test(t)&&!/light/.test(t))return!0;if(/light/.test(t)&&!/dark/.test(t))return!1;for(let o of[document.body,e]){if(!o)continue;let n=Co(getComputedStyle(o).backgroundColor);if(n!==null)return n<.5}return matchMedia("(prefers-color-scheme: dark)").matches}function Co(e){let t=/^rgba?\(([^)]+)\)$/.exec(e.trim());if(!t)return null;let o=t[1].split(/[\s,/]+/).filter(Boolean).map(Number),[n,r,i,a=1]=o;return n===void 0||r===void 0||i===void 0||a<.5?null:(.2126*n+.7152*r+.0722*i)/255}function $e(e,t){return e.replace(/\)$/,` / ${t})`)}var To=`
`,ce=16,Mo=`
.dock {
  /* No color-scheme here: the overlay sets it inline on the shadow host, from
     what the page actually looks like rather than what the machine prefers, and
     it inherits down. Declaring 'light dark' again would undo that and hand
     light-dark() back to the media query. */
  position: fixed; left: ${ce}px; top: 0; width: 340px;
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none;
  /* Not the whole panel: only the header is a drag surface, and making the
     numbers unselectable means the one thing you might want to paste into a
     stylesheet cannot be picked up by hand. Copy covers the whole reading; a
     selection covers the one value you actually wanted. */
  user-select: none;
  font-family: ${E.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${N.primary};
  --muted: ${N.secondary};
  --border: ${pe};
}
.panel {
  padding: 10px; border-radius: 0;
  /* Five sections now \u2014 box, tokens, styled by, matches, colour \u2014 and on a
     laptop that is taller than the window. place() clamps the position but
     cannot rescue a panel taller than the screen, so it scrolls instead. */
  max-height: calc(100vh - ${ce*2}px);
  overflow-y: auto; overscroll-behavior: contain;
  font-size: ${E.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${le};

  box-shadow: ${xe};

  /* The one animation in the tool: a panel that must land exactly, so the
     Fluid spring.moderate tier at 160ms, critically damped. */
  opacity: 0;
  transform: translateY(4px) scale(0.98);
  transform-origin: bottom left;
  transition: opacity ${ee.exit}, transform ${ee.exit},
              box-shadow ${ee.exit};
}
.dock[data-open] .panel {
  pointer-events: auto;
  opacity: 1;
  transform: none;
  /* Slow in, faster out. Both come from the tokens now: the panel had been
     carrying hard-coded curves from the design system the theme replaced. */
  transition: opacity ${ee.ui}, transform ${ee.ui},
              box-shadow ${ee.ui};
}
@media (prefers-reduced-motion: reduce) {
  /* Fewer and gentler, not none: the fade aids comprehension, the travel does not. */
  .panel { transform: none; transition: opacity 120ms linear; }
}

header {
  /* Stays put while the body scrolls: it is also the drag handle, and a handle
     you have to scroll back up to find is not a handle. */
  position: sticky; top: -10px; z-index: 1;
  background: ${le};
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] .panel { box-shadow: ${yn}; }
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${E.title}px; font-weight: ${F.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${E.body}px; font-weight: ${F.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${E.tag}px; font-weight: ${F.medium};
  margin-left: 4px;
  color: ${N.primary};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${E.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${q(1)}; }

/* Each region is one step up Fluid's surface ladder. Depth is carried by the
   surface and its shadow \u2014 no borders, the same way the system's own nesting
   example reads. Generous, even insets so each surface has room to breathe. */
/*
 * Spacing here is 4 / 8 / 12, and that is a correction rather than a
 * preference. It was 5, 6, 10 and 14 \u2014 values picked one at a time, none of
 * which relate to each other. Four levels of nesting multiply that: every
 * region spent 20px of padding and every row 10px of gap plus 44px of edge
 * columns, so the innermost cell \u2014 the content size, the one number you opened
 * the panel to read \u2014 was squeezed to 83px and ellipsised, while each zero
 * beside it got a full cell. The same values on a scale give it back about 40%.
 */
.region {
  border-radius: 0;
  /* Symmetric. An extra-tall top to clear the label offset each box's centre
     from its parent's, and nesting compounded it until the side numbers were
     visibly staggered. The label shares the top number's line instead. */
  padding: ${K.base}px;
}
.region[data-level="1"] { background: ${q(1)}; }
.region[data-level="2"] { background: ${q(2)}; }
.region[data-level="3"] { background: ${q(3)}; }
.content { background: ${q(4)}; }

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
  font-size: ${E.tag}px; font-weight: ${F.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${F.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${F.regular}; }
.row { display: flex; align-items: center; gap: ${K.tight}px; margin: ${K.tight}px 0; }
.row > .edge { flex: 0 0 20px; }
.row > .fill { flex: 1 1 auto; min-width: 0; }

/* Type and tokens sit under the box, in the same muted register as the band
   labels \u2014 they annotate the measurement rather than competing with it. */
.readout {
  user-select: text;
  margin-top: ${K.base}px; padding-top: ${K.base}px;
  border-top: 1px solid var(--border);
}
.readout-tag { position: static; margin-bottom: ${K.tight}px; }
/* One grid for the whole section rather than one per row, so every key in a
   section shares a column and the column sizes to the longest key in it. A
   fixed 62px was right until a diff started printing 'background-color', which
   it broke across two lines mid-word. The 62px floor keeps the rhythm the
   other sections already had. */
.readout-rows {
  display: grid; grid-template-columns: minmax(62px, max-content) 1fr;
  gap: 0 ${K.base}px; align-items: baseline;
  font-size: ${E.tag}px; line-height: 1.5;
}
.readout-row { display: contents; }
.readout-key { color: var(--muted); white-space: nowrap; }
/* A row is a label and a reading, and only one of them is data. The label can
   sit at the 11px floor; the reading cannot \u2014 the theme's own rule is that
   anything you read a number from is 12px or larger, and half this panel's
   numbers live in these rows. Baseline alignment on the row already handles
   the two sizes meeting on one line. */
.readout-value {
  color: var(--fg); overflow-wrap: anywhere;
  font-size: ${E.body}px;
  /* Several of these wrap \u2014 a diff value, a rule file, a token list \u2014 and a
     lone short word on the last line reads as a mistake. */
  text-wrap: pretty;
}
.content {
  border-radius: 0; padding: ${K.roomy}px ${K.base}px;
  text-align: center; font-weight: ${F.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,Ie=ce,ye=-1,Se=!1;function kn(e){let t=document.createElement("style");t.textContent=Mo,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);let r=!1;function i(d,b){let L=document.createElement("div");L.className="readout";let G=document.createElement("div");G.className="tag readout-tag",G.textContent=d,L.appendChild(G);let P=document.createElement("div");P.className="readout-rows",L.appendChild(P);for(let[J,U]of b){let X=document.createElement("div");X.className="readout-row";let B=document.createElement("span");B.className="readout-key",B.textContent=J;let c=document.createElement("span");c.className="readout-value",c.textContent=U,X.append(B,c),P.appendChild(X)}return L}e.appendChild(o);let a=(d,b)=>Math.min(Math.max(d,ce),Math.max(ce,b-ce));function s(){let d=o.offsetHeight||300;ye<0&&(ye=Math.max(ce,innerHeight-d-ce)),Ie=a(Ie,innerWidth-o.offsetWidth),ye=a(ye,innerHeight-d),o.style.transform=`translate(${Ie-ce}px, ${ye}px)`}let u=null;function m(d){d.button===0&&(d.preventDefault(),d.stopPropagation(),u={x:d.clientX,y:d.clientY,dx:Ie,dy:ye},o.setAttribute("data-dragging",""),d.currentTarget.setPointerCapture(d.pointerId))}function f(d){u&&(Ie=u.dx+(d.clientX-u.x),ye=u.dy+(d.clientY-u.y),s())}function k(){u=null,o.removeAttribute("data-dragging")}addEventListener("resize",s);let l=null,h=[],y;function D(d){let b=document.createElement("div");return b.className="edge",b.textContent=d===0?"0":T(d),d===0&&b.setAttribute("data-zero",""),b}function j(d,b,L,G){let[P,J,U,X]=L,B=document.createElement("div");B.className="region",B.setAttribute("data-level",String(b));let c=document.createElement("span");c.className="tag",c.textContent=d;let g=document.createElement("div");g.className="row";let p=document.createElement("div");p.className="fill",p.appendChild(G),g.append(D(X),p,D(J));let C=document.createElement("div");return C.className="head",C.append(c,D(P)),B.append(C,g,D(U)),B}return{show(d,b=[],L){h=b,y=L;let G=at(d.el),[P,J,U,X]=G.border,[B,c,g,p]=G.padding,C=_e(d.el),w=d.width/C.x,x=d.height/C.y,A=Math.abs(C.x-1)>.001||Math.abs(C.y-1)>.001,W=document.createElement("header"),tt=document.createElement("span");tt.className="name",tt.textContent=d.label;let nt=document.createElement("span");nt.className="size",nt.textContent=`${T(w)} \xD7 ${T(x)}`;let ve=document.createElement("button");if(ve.className="close",ve.textContent="\xD7",ve.title="close (B brings it back)",ve.addEventListener("pointerdown",$=>$.stopPropagation()),ve.addEventListener("click",$=>{$.stopPropagation(),Se=!0,o.removeAttribute("data-open")}),W.append(tt,nt),A){let $=document.createElement("span");$.className="scale",$.textContent=`\xD7${T(C.x)}`,$.title=`renders at ${T(d.width)} \xD7 ${T(d.height)}`,W.appendChild($)}W.appendChild(ve),W.addEventListener("pointerdown",m),W.addEventListener("pointermove",f),W.addEventListener("pointerup",k),W.addEventListener("pointercancel",k);let Ge=document.createElement("div");Ge.className="content",Ge.textContent=`${T(w-X-J-p-c)} \xD7 ${T(x-P-U-B-g)}`,Ge.title=Ge.textContent;let ae=[W,j("margin",1,G.margin,j("border",2,G.border,j("padding",3,G.padding,Ge)))];if(r){let $=Kt(d.el),Q=ze(d.el);ae.push(Q.length&&$?i("type",Q.map(Z=>[Z.label,Z.value])):i("type",[["","nothing of its own to set type on"]]))}if(L&&L.el!==d.el&&L.el.isConnected){let $=on(L.el,d.el).map(ke=>[ke.prop,`${ke.a||"\u2014"} \u2192 ${ke.b||"\u2014"}`]),Q=$.slice(0,10);$.length>Q.length&&Q.push(["",`and ${$.length-Q.length} more`]);let Z=L.label===d.label?"the one locked before":L.label;ae.push(i(`differs from ${Z}`,Q.length?Q:[["","nothing in the properties it compares"]]))}let He=tn(d.el);if(He&&He.rows.length&&ae.push(i(`laid out by ${He.display}`,He.rows.map($=>[$.label,$.value]))),b.length){let $=b.map(Z=>[T(Z.px),Z.detail]),Q=qt(b.map(Z=>Z.px));Q&&$.push(["",Q]),ae.push(i("gaps",$))}let Nt=_t(d.el),Bt=jt([w,x,...G.margin,...G.border,...G.padding,...r?ze(d.el).map($=>$.px):[]],Nt);Bt&&ae.push(i("tokens",[["",Bt]]));let It=en(d.el);It.length&&ae.push(i("styled by",It.slice(0,4).map($=>[$.selector,$.file])));let Ot=Zt(d.el);Ot>1&&ae.push(i("matches",[["",`${Ot} elements share ${it(d.el)}`]]));let Dt=Nt.filter($=>rt($.value));if(Dt.length){let $=Qt(d.el).map(({label:Q,value:Z})=>{let ke=Jt(Z,Dt);return[Q,ke.length?`${Z}  ${ke.join(" ")}`:`${Z}  \u2014`]});$.length&&ae.push(i("colour",$))}n.replaceChildren(...ae),l=d,s(),!Se&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},showsType:()=>r,isOpen:()=>!Se&&l!==null,toggleType(){r=!r,l&&this.show(l,h,y)},asText(){if(!l)return"";let d=at(l.el),b=_e(l.el),L=l.width/b.x,G=l.height/b.y,P=U=>U.map(X=>T(X)).join(" "),J=[`${l.label}  ${T(L)} \xD7 ${T(G)}`,`margin   ${P(d.margin)}`,`border   ${P(d.border)}`,`padding  ${P(d.padding)}`];if(r)for(let U of ze(l.el))J.push(`${U.label.padEnd(8)} ${U.value}`);return J.join(To)},hide(){l=null,o.removeAttribute("data-open")},toggle(){l&&(Se=!Se,Se?o.removeAttribute("data-open"):(s(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",s),o.remove(),t.remove()}}}function $n(e=20,t=1e3){let o=[];return{push(n,r,i=Date.now()){let a=o[o.length-1];if(a&&r!==""&&a.tag===r&&i-a.at<=t){a.at=i;return}o.push({state:n,tag:r,at:i}),o.length>e&&o.shift()},pop(){return o.pop()?.state??null},depth(){return o.length},clear(){o.length=0}}}var Ro="0 0 24 24";var M=e=>({path:e}),he=(e,t,o,n,r)=>({rect:[e,t,o,n,r]}),Lo={rulers:[M("M2 8V4"),M("M22 8V4"),M("M22 6H2"),he(2,12,20,8,2),M("M6 15v-3"),M("M10 15v-3"),M("M14 15v-3"),M("M18 15v-3")],xray:[M("M3 7V5a2 2 0 0 1 2-2h2"),M("M17 3h2a2 2 0 0 1 2 2v2"),M("M21 17v2a2 2 0 0 1-2 2h-2"),M("M7 21H5a2 2 0 0 1-2-2v-2")],grid:[he(3,3,18,18,2),M("M9 3v18"),M("M15 3v18")],pixels:[he(3,3,18,18,2),M("M3 9h18"),M("M3 15h18"),M("M9 3v18"),M("M15 3v18")],type:[M("M12 4v16"),M("M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"),M("M9 20h6")],panel:[he(3,3,18,18,2),he(8,8,8,8,1)],freeze:[he(14,3,5,18,1),he(5,3,5,18,1)],copy:[he(8,8,14,14,2),M("M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2")],pick:[M("m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12"),M("m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z"),M("m2 22 .414-.414")],undo:[M("M9 14 4 9l5-5"),M("M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11")]},ft="http://www.w3.org/2000/svg";function gt(e,t=16){let o=document.createElementNS(ft,"svg");o.setAttribute("viewBox",Ro),o.setAttribute("width",String(t)),o.setAttribute("height",String(t)),o.setAttribute("fill","none"),o.setAttribute("stroke","currentColor"),o.setAttribute("stroke-width","2"),o.setAttribute("stroke-linecap","round"),o.setAttribute("stroke-linejoin","round"),o.setAttribute("aria-hidden","true");for(let n of Lo[e])if("rect"in n){let[r,i,a,s,u]=n.rect,m=document.createElementNS(ft,"rect");m.setAttribute("x",String(r)),m.setAttribute("y",String(i)),m.setAttribute("width",String(a)),m.setAttribute("height",String(s)),m.setAttribute("rx",String(u)),o.appendChild(m)}else{let r=document.createElementNS(ft,"path");r.setAttribute("d",n.path),o.appendChild(r)}return o}var Ao=[{title:"Pointing at things",rows:[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure whatever is under the cursor"],["Click","lock an element, so it keeps measuring after the pointer leaves"],["Right-click","add another to the locked set, or drop one from it. Two locked also gets you a diff"],["Drag the panel header","move the box model out of your way"],["Esc","clear the locks, then close the tool"]]},{title:"Guides",rows:[["Drag from a rule","pull out a guide; drag it back into the rule to throw it away"],["V  /  H","drop a vertical or horizontal guide at the cursor"],["Hover a guide","its distance to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the guide you last touched. Shift for 10px"],["L","pin a guide, so it cannot be moved or deleted by accident"],["Ctrl/Cmd while placing","ignore snapping"],["Del","remove the guide under the cursor. Shift+Del for all of them"]]}],be=K.edge,xt=24,yt=pt,bt=K.base,Go=`
.flag {
  position: fixed; top: ${be}px; right: ${be}px;
  display: flex; align-items: center; gap: 8px;
  transition: top ${ee.ui};
  padding: ${(pt-xt)/2}px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${E.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${E.tag}px; font-weight: ${F.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${N.primary};
  background: ${le};
  box-shadow: ${xe};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
/* No negative tracking: it is 11px, and tightening is what large text wants.
   Small text reads better at zero or a hair positive. */
.flag .name { letter-spacing: 0; }
/* The rulers draw a gutter along the top edge, and the badge sits in it. Step
   down out of the way rather than covering the ticks the rulers exist to show. */
.flag[data-rulers] { top: ${be+v}px; }
.help[data-rulers] { top: ${be+v+yt+bt}px; }
.flag:hover { background: ${q(1)}; }
.flag .count { color: ${N.secondary}; }

/* A layers bar, not a palette. Switches, then the one control that changes the
   page, then the things that happen once. */
.tools { display: flex; align-items: center; gap: 2px; }
.sep {
  width: 1px; align-self: stretch; margin: 0 4px;
  background: ${pe};
}
.tool {
  width: ${xt}px; height: ${xt}px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; cursor: pointer;
  font: inherit; font-size: ${E.tag}px; font-weight: ${F.medium};
  color: ${N.tertiary};
}
.tool:hover { background: ${q(2)}; color: ${N.primary}; }
/* On the press, not on the release. Waiting for the click to acknowledge a
   button is the difference between a control that answers and one that lags,
   and it costs one rule. */
.tool:active { background: ${q(4)}; color: ${N.primary}; }
.tool:focus-visible { outline: 1px solid ${N.primary}; outline-offset: -1px; }
/* On is the film, not a colour: the three hues each already mean something on
   the canvas, and a fourth here would say nothing. */
.tool[data-on] { background: ${q(4)}; color: ${N.primary}; }

/* The badge steps down out of the ruler gutter, and that step is decoration:
   under reduced motion it should simply be in the right place. */
@media (prefers-reduced-motion: reduce) {
  .flag { transition: none; }
}
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: ${be+yt+bt}px; right: ${be}px; width: 368px;
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${be*2+yt+bt}px); overflow-y: auto;
  padding: ${K.base}px; border-radius: 0;
  user-select: none;
  font-family: ${E.stack};
  font-synthesis: none;
  font-size: ${E.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${N.primary};
  background: ${le};
  box-shadow: ${xe};
  /*
   * It grows out of the badge that opens it, rather than appearing whole.
   * transform-origin at the top right is the badge's corner, so the list and
   * the thing you pressed to get it stay visibly connected \u2014 the one place in
   * this tool where something opens *from* somewhere.
   *
   * Visibility rather than display, because display cannot be transitioned;
   * it is delayed out by the duration on close so the fade finishes first.
   */
  opacity: 0; visibility: hidden; pointer-events: none;
  transform: scale(0.98) translateY(-4px);
  transform-origin: top right;
  transition: opacity ${ee.ui}, transform ${ee.ui}, visibility 0s linear 160ms;
}
.help[data-open] {
  opacity: 1; visibility: visible; pointer-events: auto;
  transform: none;
  transition: opacity ${ee.ui}, transform ${ee.ui}, visibility 0s;
}
@media (prefers-reduced-motion: reduce) {
  /* The fade says it arrived; the travel and the scale are decoration. */
  .help { transform: none; transition: opacity 120ms linear, visibility 0s linear 120ms; }
  .help[data-open] { transition: opacity 120ms linear, visibility 0s; }
}
/* Baselines, not boxes. A key sits in a bordered chip and its description does
   not, so aligning the two boxes puts the key's text 4px below the first line
   of the text it labels \u2014 right on one-line rows by luck, wrong on every row
   that wraps. Aligning on the baseline is right on both. */
.help dl {
  display: grid; grid-template-columns: 16px auto 1fr;
  /* Baseline alignment already buys each wrapped row 4px of separation, so
     the gap stays where it was rather than pushing the list off the screen. */
  align-items: baseline; gap: ${K.tight}px ${K.base}px; margin: 0;
}
.help dt { justify-self: start; }
/* The icon column: present for the rows that have a button, blank for the rows
   that are gestures. Blank rather than absent, so the keys stay in one column
   down the whole list instead of stepping in and out. */
.help .glyph {
  justify-self: center;
  /* Not centred: a wrapped description makes the row tall, and an icon
     floating halfway down it reads as belonging to the line it is level with
     rather than to the row it is in. Level with the first line. */
  align-self: start; margin-top: 1px;
  color: ${N.tertiary}; line-height: 0;
}
.help h4 {
  grid-column: 1 / -1; margin: 10px 0 2px;
  font-size: ${E.tag}px; font-weight: ${F.semibold};
  color: ${N.tertiary};
}
.help h4:first-child { margin-top: 0; }
.help kbd {
  display: inline-block; padding: 3px 5px;
  font: inherit; font-weight: ${F.medium};
  border: 1px solid ${pe};
  background: ${q(2)};
}
/* These run to three lines, and a one-word last line reads as a mistake. */
.help dd { margin: 0; color: ${N.secondary}; text-wrap: pretty; }
`,wt=[{name:"rulers",label:"Rulers",key:"R",toggle:!0,what:"a scale down the top and left edges, in page pixels \u2014 and the gutters you drag guides out of"},{name:"xray",label:"X-ray",key:"X",toggle:!0,what:"outline every element at once, to see the boxes a layout is really made of"},{name:"grid",label:"Column grid",key:"G",toggle:!0,what:"the grid your design is built on, columns filled and gutters left empty. Needs one configured"},{name:"pixels",label:"Pixel grid",key:"K",toggle:!0,what:"a ten-pixel lattice over the page, to read an offset off without measuring it"},{name:"type",label:"Type",key:"T",toggle:!0,what:"add size, weight, line height and tracking to the panel, each checked against your scale"},{name:"panel",label:"Box model",key:"B",toggle:!0,what:"the readout itself \u2014 margins, borders, padding, what places the element, what styles it"},{name:"freeze",label:"Freeze",key:"F",toggle:!0,what:"hold every animation and transition where it stands, so a moving thing can be measured"},{name:"copy",label:"Copy",key:"C",toggle:!1,what:"put everything in the panel on the clipboard as text"},{name:"pick",label:"Colour",key:"P",toggle:!1,what:"sample a colour from anywhere on screen and match it against your palette"},{name:"undo",label:"Undo",key:"Ctrl/Cmd + Z",toggle:!1,what:"step back through the guides \u2014 a whole run of nudges counts as one"}];function Sn(e,t){let o=document.createElement("style");o.textContent=Go,e.appendChild(o);let n=document.createElement("div");n.className="flag";let r=document.createElement("span");r.className="name",r.textContent="Align";let i=document.createElement("span");i.className="count";let a=new Map,s=document.createElement("div");s.className="tools";for(let l of wt){if(l.name==="freeze"||l.name==="copy"){let y=document.createElement("span");y.className="sep",s.appendChild(y)}let h=document.createElement("button");h.type="button",h.className="tool",h.appendChild(gt(l.name)),h.setAttribute("aria-label",l.label),h.title=`${l.label}  \xB7  ${l.key}
${l.what}`,l.toggle||h.setAttribute("data-once",""),h.addEventListener("click",y=>{y.stopPropagation(),t(l.name)}),a.set(l.name,h),s.appendChild(h)}n.append(r,s,i);let u=document.createElement("div");u.className="help";let m=document.createElement("dl");function f(l){let h=document.createElement("h4");h.textContent=l,m.appendChild(h)}function k(l,h,y){let D=document.createElement("span");D.className="glyph",y&&D.appendChild(gt(y,14));let j=document.createElement("dt"),d=document.createElement("kbd");d.textContent=l,j.appendChild(d);let b=document.createElement("dd");b.textContent=h,m.append(D,j,b)}f("The bar, left to right");for(let l of wt)k(l.key,`${l.label} \u2014 ${l.what}`,l.name);for(let l of Ao){f(l.title);for(let[h,y]of l.rows)k(h,y)}return u.appendChild(m),n.addEventListener("click",l=>{l.stopPropagation(),u.toggleAttribute("data-open")}),e.append(n,u),{update(l,h){i.textContent=l>0?`${l} locked`:"",n.toggleAttribute("data-rulers",h.rulers),u.toggleAttribute("data-rulers",h.rulers);for(let y of wt)y.toggle&&a.get(y.name)?.toggleAttribute("data-on",h[y.name]===!0)},closeHelp(){let l=u.hasAttribute("data-open");return u.removeAttribute("data-open"),l},destroy(){n.remove(),u.remove(),o.remove()}}}var je=5,vt=4,Oe=12,En=.22,Ee=10,No=50,Bo=100;function Cn(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,grid:null,pixels:!1,guides:[],liveGuide:null,activeGuide:null},i=ht(mt()),a=0,s=null;function u(){let c=mt();c!==s&&(s=c,i=ht(c),e.style.colorScheme=c?"dark":"light",B())}u();let m=matchMedia("(prefers-color-scheme: dark)"),f=()=>u();m.addEventListener("change",f);let k=new MutationObserver(()=>u());function l(){k.disconnect(),k.observe(document.documentElement,{attributes:!0}),document.body&&k.observe(document.body,{attributes:!0})}l(),vn(()=>B());function h(){let c=devicePixelRatio;o.width=Math.round(innerWidth*c),o.height=Math.round(innerHeight*c),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(c,0,0,c,0,0),n.translate(.5,.5)}let y=c=>Math.round(c)-.5;function D(c,g){n.strokeStyle=g,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(c.left),Math.round(c.top),Math.round(c.width),Math.round(c.height))}function j(c){n.strokeStyle=$e(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let g of[c.left,c.right])n.moveTo(Math.round(g),0),n.lineTo(Math.round(g),innerHeight);for(let g of[c.top,c.bottom])n.moveTo(0,Math.round(g)),n.lineTo(innerWidth,Math.round(g));n.stroke(),n.setLineDash([])}function d(c){if(n.strokeStyle=c.extension?$e(i.measure,.55):i.measure,n.lineWidth=1,n.setLineDash(c.extension?[3,3]:[]),n.beginPath(),n.moveTo(Math.round(c.x1),Math.round(c.y1)),n.lineTo(Math.round(c.x2),Math.round(c.y2)),c.extension){n.stroke();return}if(c.axis==="x")for(let g of[c.x1,c.x2])n.moveTo(Math.round(g),Math.round(c.y1)-je),n.lineTo(Math.round(g),Math.round(c.y1)+je);else for(let g of[c.y1,c.y2])n.moveTo(Math.round(c.x1)-je,Math.round(g)),n.lineTo(Math.round(c.x1)+je,Math.round(g));n.stroke()}function b(c){return n.font=`${F.medium} ${E.body}px ${E.stack}`,{w:n.measureText(c).width+vt*2,h:E.body+vt*2+2}}function L(c,g,p,C){n.font=`${F.medium} ${E.body}px ${E.stack}`,n.textBaseline="middle";let{w,h:x}=b(c),A=y(Math.min(Math.max(g,Oe),innerWidth-w-Oe)),W=y(Math.min(Math.max(p,Oe),innerHeight-x-Oe));n.fillStyle=C,n.beginPath(),n.roundRect(A,W,Math.ceil(w),x,4),n.fill(),n.fillStyle=i.surface,n.fillText(c,A+vt,W+x/2)}function G(c,g,p,C,w=!1){let{w:x,h:A}=b(c);L(c,w?g-x/2:g,w?p-A/2:p,C)}function P(){let c=scrollX,g=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,v),n.fillRect(-.5,-.5,v,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${F.regular} 9px ${E.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let x of r.pinned)n.fillRect(y(x.left),-.5,Math.round(x.width),v),n.fillRect(-.5,y(x.top),v,Math.round(x.height));n.restore(),n.beginPath(),n.moveTo(-.5,v-.5),n.lineTo(innerWidth,v-.5),n.moveTo(v-.5,-.5),n.lineTo(v-.5,innerHeight),n.stroke();let p=x=>x%Bo===0?v:x%No===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let C=Math.floor(c/Ee)*Ee;for(let x=C;x<c+innerWidth;x+=Ee){let A=Math.round(x-c);if(A<v)continue;let W=p(x);n.moveTo(A,v-W),n.lineTo(A,v),W===v&&(n.fillStyle=i.muted,n.fillText(String(x),A+3,3))}n.stroke(),n.beginPath();let w=Math.floor(g/Ee)*Ee;for(let x=w;x<g+innerHeight;x+=Ee){let A=Math.round(x-g);if(A<v)continue;let W=p(x);n.moveTo(v-W,A),n.lineTo(v,A),W===v&&(n.save(),n.translate(3,A-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(x),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),v),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo(v,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let x of r.guides){let A=Math.round(Ne(x));x.axis==="x"?n.fillRect(A-1,-.5,2,v):n.fillRect(-.5,A-1,v,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,v,v),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,v,v)}function J(){let c=fn(10,1);if(c){n.strokeStyle=i.pixelLine,n.lineWidth=1,n.setLineDash([]),n.beginPath();for(let g=0;g<=innerWidth;g+=c)n.moveTo(g,0),n.lineTo(g,innerHeight);for(let g=0;g<=innerHeight;g+=c)n.moveTo(0,g),n.lineTo(innerWidth,g);n.stroke()}}function U(c){let g=mn(c,document.documentElement.clientWidth);n.fillStyle=$e(i.measure,.08);for(let p of g)n.fillRect(y(p.left),-.5,Math.round(p.width),innerHeight+1)}function X(){a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore(),(r.pixels||r.grid)&&(n.save(),r.rulers&&(n.beginPath(),n.rect(v,v,innerWidth,innerHeight),n.clip()),r.pixels&&J(),r.grid&&U(r.grid),n.restore());for(let p of r.pinned)D(p,i.accent);r.hover&&(j(r.hover),D(r.hover,r.pinned.length?$e(i.accent,.7):i.accent));for(let p of r.guides){let C=r.liveGuide?.id===p.id;n.strokeStyle=p.locked||C?i.guide:$e(i.guide,.55),n.lineWidth=p.pinned?2:1,n.setLineDash(p.locked?[]:[4,4]),n.beginPath();let w=Math.round(Ne(p));if(p.axis==="x"?(n.moveTo(w,0),n.lineTo(w,innerHeight)):(n.moveTo(0,w),n.lineTo(innerWidth,w)),n.stroke(),r.activeGuide===p.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let x=7;p.axis==="x"?(n.moveTo(w,0),n.lineTo(w,x),n.moveTo(w,innerHeight-x),n.lineTo(w,innerHeight)):(n.moveTo(0,w),n.lineTo(x,w),n.moveTo(innerWidth-x,w),n.lineTo(innerWidth,w)),n.stroke()}}for(let p of r.lines)n.globalAlpha=p.faded?En:1,d(p);n.globalAlpha=1;let c=r.lines.filter(p=>p.label!==""),g=c.map(p=>{let C=(p.x1+p.x2)/2,w=(p.y1+p.y2)/2,{w:x,h:A}=b(p.label);return p.axis==="x"?{x:C-x/2,y:w-16-A/2,w:x,h:A,axis:p.axis}:{x:C+26-x/2,y:w-A/2,w:x,h:A,axis:p.axis}});if(hn(g,{w:innerWidth,h:innerHeight},Oe).forEach((p,C)=>{let w=c[C];n.globalAlpha=w.faded?En:1,L(w.label,p.x,p.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:p,height:C,scale:w}=r.hover;G(`${T(p/w.x)} \xD7 ${T(C/w.y)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let p=r.liveGuide,C=Math.round(Ne(p));G([`${p.axis} ${T(p.at)}`,p.caught,p.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),p.axis==="x"?C+6:30,p.axis==="x"?30:C+6,i.guide)}r.rulers&&P()}function B(){a||(a=requestAnimationFrame(X))}return h(),{root:t,update(c){Object.assign(r,c),B()},resize(){h(),B()},destroy(){a&&cancelAnimationFrame(a),m.removeEventListener("change",f),k.disconnect(),e.remove()}}}function Io(e){let t=e.trim().replace(/^#/,""),o=t.length===3?t.split("").map(n=>n+n).join(""):t;return/^[0-9a-f]{6}$/i.test(o)?{r:parseInt(o.slice(0,2),16),g:parseInt(o.slice(2,4),16),b:parseInt(o.slice(4,6),16)}:null}function Oo({r:e,g:t,b:o}){let n=r=>Math.round(r).toString(16).padStart(2,"0");return`#${n(e)}${n(t)}${n(o)}`}function Do({r:e,g:t,b:o}){return`rgb(${Math.round(e)} ${Math.round(t)} ${Math.round(o)})`}function we(e,t){return String(Number(e.toFixed(t)))}function Po({r:e,g:t,b:o}){let n=e/255,r=t/255,i=o/255,a=Math.max(n,r,i),s=Math.min(n,r,i),u=(a+s)/2,m=a-s,f=0,k=0;return m!==0&&(k=m/(1-Math.abs(2*u-1)),a===n?f=(r-i)/m%6:a===r?f=(i-n)/m+2:f=(n-r)/m+4,f*=60,f<0&&(f+=360)),`hsl(${we(f,1)} ${we(k*100,1)}% ${we(u*100,1)}%)`}function kt(e){let t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4}function Fo(e){let t=kt(e.r),o=kt(e.g),n=kt(e.b),r=.4122214708*t+.5363325363*o+.0514459929*n,i=.2119034982*t+.6806995451*o+.1073969566*n,a=.0883024619*t+.2817188376*o+.6299787005*n,s=Math.cbrt(r),u=Math.cbrt(i),m=Math.cbrt(a),f=.2104542553*s+.793617785*u-.0040720468*m,k=1.9779984951*s-2.428592205*u+.4505937099*m,l=.0259040371*s+.7827717662*u-.808675766*m,h=Math.sqrt(k*k+l*l),y=Math.atan2(l,k)*180/Math.PI;return y<0&&(y+=360),h<1e-4?`oklch(${we(f,4)} 0 0)`:`oklch(${we(f,4)} ${we(h,4)} ${we(y,2)})`}function Tn(e){let t=Io(e);return t?[{label:"hex",value:Oo(t)},{label:"rgb",value:Do(t)},{label:"hsl",value:Po(t)},{label:"oklch",value:Fo(t)}]:[]}var Ho=`
.picker {
  position: fixed; top: 46px; right: 16px; width: 200px;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${E.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${E.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${N.primary};
  background: ${le};
  box-shadow: ${xe};
  display: none;
}
.picker[data-open] { display: block; }
.picker .swatch {
  height: 40px; margin-bottom: 8px;
  border: 1px solid ${pe};
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
.picker button:hover { background: ${q(2)}; }
.picker button:focus-visible { outline: 1px solid ${N.primary}; outline-offset: -1px; }
.picker .k { color: ${N.secondary}; }
.picker .v { overflow-wrap: anywhere; }
.picker .hint {
  margin-top: 6px; padding-top: 6px;
  border-top: 1px solid ${pe};
  color: ${N.secondary};
}
`;function Mn(e){let t=document.createElement("style");t.textContent=Ho,e.appendChild(t);let o=document.createElement("div");o.className="picker",e.appendChild(o);let n=document.createElement("div");n.className="swatch";let r=document.createElement("div");r.className="hint";function i(a){n.style.background=a;let s=Tn(a).map(({label:u,value:m})=>{let f=document.createElement("button");f.type="button";let k=document.createElement("span");k.className="k",k.textContent=u;let l=document.createElement("span");return l.className="v",l.textContent=m,f.append(k,l),f.addEventListener("click",h=>{h.stopPropagation(),navigator.clipboard?.writeText(m).then(()=>{r.textContent=`copied ${u}`},()=>{r.textContent="clipboard refused"})}),f});r.textContent="click a row to copy",o.replaceChildren(n,...s,r),o.setAttribute("data-open","")}return{async open(){let a=window.EyeDropper;if(!a){o.replaceChildren(Object.assign(document.createElement("div"),{className:"hint",textContent:"this browser has no eyedropper"})),o.setAttribute("data-open","");return}try{let{sRGBHex:s}=await new a().open();i(s)}catch{}},close(){let a=o.hasAttribute("data-open");return o.removeAttribute("data-open"),a},destroy(){o.remove(),t.remove()}}}var $t="__align_freeze",zo=`
[data-align-frozen] *:not([data-align-ignore]):not([data-align-ignore] *) {
  animation-play-state: paused !important;
}
`,St=!1,Ue=[],Ve=[];function Rn(e){let t=e;for(;t;){if(t instanceof Element&&t.hasAttribute("data-align-ignore"))return!0;let o=t.getRootNode();if(t=o instanceof ShadowRoot?o.host:t.parentNode??null,t===document)return!1}return!1}function De(){return St}function qe(e){if(e!==St){if(St=e,!e){document.documentElement.removeAttribute("data-align-frozen"),document.getElementById($t)?.remove();for(let t of Ue)try{t.play()}catch{}for(let t of Ve)t.play().catch(()=>{});Ue=[],Ve=[];return}if(!document.getElementById($t)){let t=document.createElement("style");t.id=$t,t.textContent=zo,t.setAttribute("data-align-ignore",""),document.head.appendChild(t)}document.documentElement.setAttribute("data-align-frozen",""),Ue=[];try{for(let t of document.getAnimations()){if(t.playState!=="running")continue;let o=t.effect?.target??null;Rn(o)||(t.pause(),Ue.push(t))}}catch{}Ve=[];for(let t of Array.from(document.querySelectorAll("video")))t.paused||Rn(t)||(t.pause(),Ve.push(t))}}var Et="__align_xray",Wo=`
[data-align-xray] * { outline: 1px solid rgb(128 128 128 / 0.55) !important; }
[data-align-xray] [data-align-ignore],
[data-align-xray] [data-align-ignore] * { outline: none !important; }
`;function Je(e){let t=document.documentElement;if(!e){t.removeAttribute("data-align-xray"),document.getElementById(Et)?.remove();return}if(!document.getElementById(Et)){let o=document.createElement("style");o.id=Et,o.textContent=Wo,o.setAttribute("data-align-ignore",""),document.head.appendChild(o)}t.setAttribute("data-align-xray","")}var Ct="align-ui";function Ln(e){try{return localStorage.getItem(e)}catch{return null}}function An(e,t){try{localStorage.setItem(e,t)}catch{}}function Gn(e){let t="/";try{t=location.pathname||"/"}catch{}return`${Ct}:${e}::${t}`}function Xo(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function Nn(){let e=Ln(Gn("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(Xo).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function Bn(e){An(Gn("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function Qe(e){return Ln(`${Ct}:${e}`)==="1"}function Pe(e,t){An(`${Ct}:${e}`,t?"1":"0")}var V,R=null,_=null,fe=null,Ae=null,re=!1,Te=Qe("grid"),Me=Qe("pixels"),O=null,S=[],et=0,ie=Qe("rulers"),I=[],Wn=1,In=!1,ue=null,Rt=$n();function Yo(){return I.map(e=>({...e}))}function Re(e=""){Rt.push(Yo(),e)}function On(){return I.find(e=>e.id===ue)??null}function me(e){I=e,Bn(I)}var z=null,oe=null,te=null,Ko=3,Ce=22;function Xn(e,t){return ie?t<Ce&&e>=Ce?"y":e<Ce&&t>=Ce?"x":null:null}function Lt(e){return e.ctrlKey||e.metaKey}function Yn(e,t,o,n){let r=ge(t,o,V),i=e.axis==="x"?t:o,a=I.filter(u=>u.id!==e.id).map(u=>({axis:u.axis,at:Fe(u).pos})),s=un(i,dn(r,e.axis,a),n);e.at=s.at+(e.axis==="x"?scrollX:scrollY),e.caught=s.what}function Kn(e,t,o,n){let r={id:Wn++,axis:e,at:0,locked:!1,caught:"",pinned:!1};return Re(),Yn(r,t,o,n),me([...I,r]),ue=r.id,r}function _n(e){e.pinned||(Re(),me(I.filter(t=>t.id!==e.id)),oe?.id===e.id&&(oe=null),z?.id===e.id&&(z=null))}function _o(e){let t=V.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function Fe(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function At(){return S.length>=2?S[S.length-2]:void 0}function Gt(){if(S.length<2)return[];let e=[];for(let[t,o]of st(S))for(let n of Ke(t,o)){if(n.extension||!n.label)continue;let r=Ut(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:Vt(r)})}return e}function H(e){let t=S[S.length-1],o=O&&S.some(l=>l.el===O.el),n=I.map(Fe),r=!z&&oe?oe:null,i=I.filter(l=>l.locked||l.id===r?.id),a=!r&&o?O.el:null,s=r??a,u=r?Fe(r):null,m=[],f=(l,h)=>{for(let y of l)m.push(s&&!h?{...y,faded:!0}:y)},k=l=>!u||l.axis!==u.axis?!1:(l.axis==="x"?[l.x1,l.x2]:[l.y1,l.y2]).some(y=>Math.abs(y-u.pos)<.5);for(let[l,h]of st(S))f(Ke(l,h),l.el===a||h.el===a);t&&O&&!o&&!r&&f(Ke(t,O),!0);for(let l of i)for(let h of S)f(ct(h,[Fe(l)]),l.id===r?.id||h.el===a);O&&!o&&!r&&I.length&&f(ct(O,n),!0);for(let l of pn(i.map(Fe),{x:innerWidth/2,y:innerHeight/2}))f([l],k(l));R?.update({hover:O,pinned:S,rulers:ie,grid:Te&&V.grid?V.grid:null,pixels:Me,guides:I,liveGuide:z??oe,activeGuide:ue,lines:m,...e?{cursor:e}:{}}),fe?.update(S.length,{rulers:ie,xray:re,grid:Te,pixels:Me,freeze:De(),type:_?.showsType()??!1,panel:_?.isOpen()??!1})}function jn(){let e=_?.asText()??"";e&&navigator.clipboard?.writeText(e).catch(()=>{})}function Un(){let e=Rt.pop();e&&(me(e),oe=null,z=null,te=null,e.some(t=>t.id===ue)||(ue=null))}function Tt(e){switch(e){case"rulers":ie=!ie,Pe("rulers",ie);break;case"xray":re=!re,Je(re);break;case"grid":Te=!Te,Pe("grid",Te);break;case"pixels":Me=!Me,Pe("pixels",Me);break;case"freeze":qe(!De());break;case"type":_?.toggleType();break;case"panel":_?.toggle();break;case"copy":jn();break;case"pick":Ae?.open();break;case"undo":Un();break}H()}var Ze=null;function Vn(e){if(Ze={x:e.clientX,y:e.clientY},z){te&&Math.hypot(e.clientX-te.x,e.clientY-te.y)>Ko&&(te=null),!te&&!z.pinned&&(Yn(z,e.clientX,e.clientY,Lt(e)),me([...I])),H({x:e.clientX,y:e.clientY});return}oe=lt(I,e.clientX,e.clientY),O=ge(e.clientX,e.clientY,V),H({x:e.clientX,y:e.clientY})}function qn(e){z&&(te?(z.locked=!z.locked,ue=z.id,me([...I])):(Xn(e.clientX,e.clientY)||e.clientX<Ce||e.clientY<Ce)&&_n(z),te=null,z=null,H({x:e.clientX,y:e.clientY}))}function Jn(e){if(e.button!==0)return;let t=ge(e.clientX,e.clientY,V);if(!t)return;let o=Xn(e.clientX,e.clientY);if(o){Le(e),te=null,z=Kn(o,e.clientX,e.clientY,Lt(e)),H({x:e.clientX,y:e.clientY});return}let n=lt(I,e.clientX,e.clientY);if(n){Le(e),Re(),ue=n.id,z=n,te={x:e.clientX,y:e.clientY},H({x:e.clientX,y:e.clientY});return}Le(e),fe?.closeHelp(),S=[t],O=t,_?.show(t,Gt(),At()),H({x:e.clientX,y:e.clientY})}function Qn(e){let t=ge(e.clientX,e.clientY,V);if(!t)return;Le(e),fe?.closeHelp();let o=S.findIndex(r=>r.el===t.el);S=o>=0?S.filter((r,i)=>i!==o):[...S,t],O=t;let n=S[S.length-1];n?_?.show(n,Gt(),At()):_?.hide(),H({x:e.clientX,y:e.clientY})}function Zn(e){ge(e.clientX,e.clientY,V)&&Le(e)}function eo(e){ge(e.clientX,e.clientY,V)&&Le(e)}function Le(e){e.preventDefault(),e.stopPropagation()}function Dn(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var Pn=0,Fn=0;function to(){et=requestAnimationFrame(to);let t=S.filter(s=>s.el.isConnected).map(s=>Ye(s.el)),o=O&&O.el.isConnected?Ye(O.el):null;if(!(scrollX!==Pn||scrollY!==Fn||t.length!==S.length||t.some((s,u)=>!Dn(s,S[u]))||O===null!=(o===null)||O!==null&&o!==null&&!Dn(O,o)))return;Pn=scrollX,Fn=scrollY,S=t,O=o;let i=S[S.length-1],a=jo();a!==Hn&&(Hn=a,i?_?.show(i,Gt(),At()):_?.hide()),H()}var Hn="";function jo(){let e=S[0];return e?S.map(t=>[t.label,Math.round(t.width*100),Math.round(t.height*100),Math.round((t.left-e.left)*100),Math.round((t.top-e.top)*100)].join(",")).join(";"):""}function no(){R?.resize()}function Uo(){In||(In=!0,I=Nn().map(e=>({...e,id:Wn++}))),!R&&(bn(),R=Cn(),_=kn(R.root),fe=Sn(R.root,Tt),Ae=Mn(R.root),fe.update(0,{rulers:ie,xray:re,grid:Te,pixels:Me,freeze:De(),type:!1,panel:!1}),addEventListener("mousemove",Vn),addEventListener("mousedown",Jn,{capture:!0}),addEventListener("mouseup",qn,{capture:!0}),addEventListener("click",Zn,{capture:!0}),addEventListener("auxclick",eo,{capture:!0}),addEventListener("contextmenu",Qn,{capture:!0}),addEventListener("resize",no),et=requestAnimationFrame(to),H())}function Mt(){removeEventListener("mousemove",Vn),removeEventListener("mousedown",Jn,{capture:!0}),removeEventListener("mouseup",qn,{capture:!0}),removeEventListener("click",Zn,{capture:!0}),removeEventListener("auxclick",eo,{capture:!0}),removeEventListener("contextmenu",Qn,{capture:!0}),removeEventListener("resize",no),cancelAnimationFrame(et),et=0,fe?.destroy(),Ae?.destroy(),Ae=null,re&&(re=!1,Je(!1)),qe(!1),fe=null,_?.destroy(),_=null,R?.destroy(),R=null,wn(),O=null,S=[],z=null,te=null,oe=null}function zn(e){if(_o(e))e.preventDefault(),R?Mt():Uo();else if(R&&Ze&&(e.key.toLowerCase()===V.guideKeys.vertical||e.key.toLowerCase()===V.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===V.guideKeys.vertical?"x":"y";Kn(t,Ze.x,Ze.y,Lt(e)),H()}else if(R&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(Re(),me(I.filter(t=>t.pinned)),oe=null,z=null,te=null,I.some(t=>t.id===ue)||(ue=null)):oe&&_n(oe),H();else if(R&&e.key.startsWith("Arrow")){let t=On(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;Re(`nudge:${t.id}`);let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",me([...I]),H()}else if(R&&e.key.toLowerCase()==="g"){e.preventDefault(),Tt("grid");return}else if(R&&e.key.toLowerCase()==="k"){e.preventDefault(),Tt("pixels");return}else if(R&&e.key.toLowerCase()==="f")e.preventDefault(),qe(!De()),H();else if(R&&e.key.toLowerCase()==="x")e.preventDefault(),re=!re,Je(re);else if(R&&e.key.toLowerCase()==="p")e.preventDefault(),Ae?.open();else if(R&&e.key.toLowerCase()==="t")e.preventDefault(),_?.toggleType();else if(R&&e.key.toLowerCase()==="c")e.preventDefault(),jn();else if(R&&e.key.toLowerCase()==="l"){let t=On();if(!t)return;e.preventDefault(),Re(),t.pinned=!t.pinned,me([...I]),H()}else if(R&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){if(Rt.depth()===0)return;e.preventDefault(),Un(),H()}else if(R&&e.key.toLowerCase()===V.rulerKey)e.preventDefault(),ie=!ie,Pe("rulers",ie),H();else if(R&&e.key.toLowerCase()===V.panelKey)e.preventDefault(),_?.toggle();else if(e.key==="Escape"&&R){if(Ae?.close()||fe?.closeHelp())return;S.length?(S=[],_?.hide(),H()):Mt()}}function Ar(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,V=an(e),addEventListener("keydown",zn,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{Mt(),removeEventListener("keydown",zn,{capture:!0}),delete window.__align})}export{Ar as initAlign};
