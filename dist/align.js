function te(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function Lo(e){return(e.split(",")[0]??"").trim().replace(/^['"]|['"]$/g,"")}function No(e){let o={100:"thin",200:"extralight",300:"light",400:"regular",500:"medium",600:"semibold",700:"bold",800:"extrabold",900:"black"}[e.trim()];return o?`${e} ${o}`:e}function lt(e){let t=getComputedStyle(e);return[{label:"family",value:Lo(t.fontFamily),px:NaN},{label:"size",value:t.fontSize,px:te(t.fontSize)},{label:"weight",value:No(t.fontWeight),px:NaN},{label:"line",value:t.lineHeight,px:te(t.lineHeight)},{label:"tracking",value:t.letterSpacing,px:te(t.letterSpacing)}]}function ln(e){let t="";for(let o of e.childNodes)o.nodeType===3&&(t+=o.nodeValue??"");return t.trim().replace(/\s+/g," ")}function ct(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:te(r)})}return o}function Ct(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function Ro(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function cn(e,t){if(t.length===0)return"";let o=[],n=0;for(let i of Ro(e)){let a=Ct(i,t);a.length?o.push(`${Go(i)} ${a.join(" ")}`):n+=1}if(o.length===0)return n===1?"its one number is not on the scale":`none of its ${n} numbers are on the scale`;let r=n===0?"":n===1?"  \xB7  1 more, not on the scale":`  \xB7  ${n} more, not on the scale`;return o.join("  \xB7  ")+r}function Go(e){return String(Math.round(e*100)/100)}function en(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(te)}function dn(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),l=a.display.includes("flex")||a.display.includes("grid"),c=n==="x"?a.columnGap:a.rowGap,b=l&&c!=="normal"?te(c):null,[w,S,u,h]=en(e),[x,C,A,g]=en(t),E=j=>Number.isFinite(j)?j:0,L=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,G=n==="x"?L?E(S)+E(g):E(C)+E(h):L?E(u)+E(x):E(A)+E(w);return{px:o,cssGap:b,margins:G,siblings:!0}}function un(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function pn(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}function et(e){let t=e.trim().toLowerCase();return t?t.startsWith("#")||/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(t)?!0:["black","white","transparent","currentcolor"].includes(t):!1}var ye;function tn(e){if(ye===void 0&&(ye=document.createElement("canvas").getContext("2d")),!ye)return"";ye.fillStyle="#000000",ye.fillStyle=e;let t=ye.fillStyle;return ye.fillStyle="#ffffff",ye.fillStyle=e,t===ye.fillStyle?String(t):""}function dt(e,t){let o=tn(e);return o?t.filter(n=>et(n.value)&&tn(n.value)===o).map(n=>n.name).sort():[]}function mn(e){let t=getComputedStyle(e),o=[],n=(r,i)=>{let a=i.trim();!a||a==="transparent"||/rgba?\([^)]*,\s*0\s*\)$/.test(a)||o.push({label:r,value:a})};return n("text",t.color),n("background",t.backgroundColor),o}function Po(e,t,o){let n=r=>typeof CSS<"u"&&CSS.escape?CSS.escape(r):r.replace(/[^\w-]/g,"\\$&");return t?`#${n(t)}`:o.length?e+o.map(r=>`.${n(r)}`).join(""):e}function tt(e){let t=typeof e.className=="string"?e.className.trim().split(/\s+/).filter(Boolean):[];return Po(e.tagName.toLowerCase(),e.id,t)}function hn(e){let t=tt(e);if(!/[.#]/.test(t))return 0;try{return document.querySelectorAll(t).length}catch{return 0}}function Do(e){if(!e)return"inline <style>";let t=e.split("?")[0]??e;try{let o=new URL(t,"http://x").pathname;return decodeURI(o).replace(/^\//,"")||t}catch{return t}}var Bo=["width","height","padding","margin","border-width","gap","font-size","line-height","letter-spacing","color","background-color"];function Oo(e){for(let t=0;t<e.length;t+=1){let o=e.item(t);if(Bo.some(n=>o===n||o.startsWith(`${n}-`)))return!0}return!1}function fn(e){let t=[],o=new Set,n=(r,i)=>{for(let a of Array.from(r)){if(a instanceof CSSMediaRule){matchMedia(a.conditionText).matches&&n(a.cssRules,i);continue}if(a instanceof CSSSupportsRule){CSS.supports(a.conditionText)&&n(a.cssRules,i);continue}let l=a.cssRules;if(l&&!(a instanceof CSSStyleRule)){n(l,i);continue}if(!(a instanceof CSSStyleRule))continue;let c=!1;try{c=e.matches(a.selectorText)}catch{continue}if(!c||!Oo(a.style))continue;let b=`${a.selectorText}|${i}`;o.has(b)||(o.add(b),t.push({selector:a.selectorText,file:i}))}};for(let r of Array.from(document.styleSheets)){if(r.ownerNode instanceof Element&&r.ownerNode.hasAttribute("data-align-ignore"))continue;let i;try{i=r.cssRules}catch{continue}n(i,Do(r.href))}return t.reverse()}function nn(e){if(!e||e==="none")return[];let t=e.trim().split(/\s+/),o=[];for(let n of t){if(!n.endsWith("px"))return[];let r=Number.parseFloat(n);if(!Number.isFinite(r))return[];o.push(r)}return o}function on(e,t,o){let n=0;for(let r=0;r<e.length;r+=1){let i=n+e[r];if(o<i+.5)return r;n=i+t}return-1}function Io(e,t){let o=t==="rtl";return e.startsWith("vertical")||e.startsWith("sideways")?{inline:"y",inlineReversed:e==="sideways-lr"?!o:o,blockReversed:e==="vertical-rl"||e==="sideways-rl"}:{inline:"x",inlineReversed:o,blockReversed:!1}}function rn(e,t,o,n,r){return r?t-n:o-e}function gn(e){let t=e.parentElement,o=0;for(;t&&getComputedStyle(t).display==="contents";)t=t.parentElement,o+=1;if(!t)return null;let n=getComputedStyle(t),r=getComputedStyle(e),i=n.display,a=[];if(o>0&&a.push({label:"through",value:o===1?"a display: contents parent":`${o} display: contents parents`}),r.position==="absolute"||r.position==="fixed")return a.push({label:"placed by",value:`${r.position}, not by the parent`}),{display:i,rows:a};if(r.float!=="none")return a.push({label:"placed by",value:`float: ${r.float}`}),{display:i,rows:a};let l=i.includes("flex"),c=i.includes("grid");if(!l&&!c)return a.push({label:"flow",value:i}),{display:i,rows:a};let b=an(n.rowGap==="normal"?"0px":n.rowGap),w=an(n.columnGap==="normal"?"0px":n.columnGap),S=b===w?b:`row ${b} \xB7 column ${w}`;if(l){let F=n.flexDirection;a.push({label:"direction",value:n.flexWrap==="nowrap"?F:`${F} \xB7 ${n.flexWrap}`}),a.push({label:"justify",value:n.justifyContent}),a.push({label:"align",value:n.alignItems}),a.push({label:"gap",value:S});let s=`${r.flexGrow} ${r.flexShrink} ${r.flexBasis}`;return s!=="0 1 auto"&&a.push({label:"this child",value:`flex: ${s}`}),r.alignSelf!=="auto"&&a.push({label:"align-self",value:r.alignSelf}),{display:i,rows:a}}let u=nn(n.gridTemplateColumns),h=nn(n.gridTemplateRows);u.length&&a.push({label:"columns",value:`${u.length} \xB7 ${u.map(St).join(" ")}`}),h.length&&a.push({label:"rows",value:`${h.length} \xB7 ${h.map(St).join(" ")}`}),a.push({label:"gap",value:S});let x=t.getBoundingClientRect(),C=e.getBoundingClientRect(),A={left:x.left+te(n.borderLeftWidth)+te(n.paddingLeft),right:x.right-te(n.borderRightWidth)-te(n.paddingRight),top:x.top+te(n.borderTopWidth)+te(n.paddingTop),bottom:x.bottom-te(n.borderBottomWidth)-te(n.paddingBottom)},g=Io(n.writingMode,n.direction),E=(F,s)=>F==="x"?rn(A.left,A.right,C.left,C.right,s):rn(A.top,A.bottom,C.top,C.bottom,s),L=g.inline==="x"?"y":"x",G=te(n.columnGap==="normal"?"0":n.columnGap),j=te(n.rowGap==="normal"?"0":n.rowGap),ee=on(u,G,E(g.inline,g.inlineReversed)),V=on(h,j,E(L,g.blockReversed)),O=[];return ee>=0&&O.push(`column ${ee+1} of ${u.length}`),V>=0&&O.push(`row ${V+1} of ${h.length}`),O.length&&a.push({label:"this child",value:O.join(" \xB7 ")}),{display:i,rows:a}}function an(e){return e.endsWith("px")?St(Number.parseFloat(e)):e}function St(e){return String(Math.round(e*100)/100)}var bn=["display","position","width","height","padding","margin","border-width","border-style","border-radius","font-family","font-size","font-weight","font-style","line-height","letter-spacing","text-transform","text-align","color","background-color","border-color","opacity","flex-direction","justify-content","align-items","gap","flex-grow","flex-shrink","flex-basis","align-self","box-shadow","overflow","text-overflow","white-space"];function Ho(e,t){let o=[];for(let n of bn){let r=e[n]??"",i=t[n]??"";r!==i&&o.push({prop:n,a:r,b:i})}return o}function sn(e){let t=getComputedStyle(e),o={};for(let n of bn)o[n]=t.getPropertyValue(n);return o}function xn(e,t){return Ho(sn(e),sn(t))}var Fo={ignore:"",grid:null,hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"},theme:"auto"};function wn(e={}){return{...Fo,...e}}var yn=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function vn(e){return e.ignore?`${yn}, ${e.ignore}`:yn}function _(e){return String(Math.round(e*100)/100)}function zo(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function mt(e){let t=e.getBoundingClientRect();return{el:e,label:zo(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height,scale:He(e)}}function kn(e,t){let o=(n,r)=>Math.abs(n-r)<.001;return o(e.scale.x,t.scale.x)&&o(e.scale.y,t.scale.y)?e.scale:{x:1,y:1}}function $n(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function Ae(e,t,o){let n=vn(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=$n(r);return r&&r!==document.documentElement?mt(r):null}var ut=e=>parseFloat(e)||0;function Tt(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[ut(n),ut(r),ut(i),ut(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function Wo(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function _o(e,t){let o=kn(e,t),n=t.left+t.width/2,r=t.top+t.height/2;return[{x1:e.left,y1:r,x2:t.left,y2:r,label:_((t.left-e.left)/o.x),axis:"x"},{x1:t.right,y1:r,x2:e.right,y2:r,label:_((e.right-t.right)/o.x),axis:"x"},{x1:n,y1:e.top,x2:n,y2:t.top,label:_((t.top-e.top)/o.y),axis:"y"},{x1:n,y1:t.bottom,x2:n,y2:e.bottom,label:_((e.bottom-t.bottom)/o.y),axis:"y"}]}function pt(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function ht(e,t){let o=[],n=kn(e,t),r=e.left<t.right&&t.left<e.right,i=e.top<t.bottom&&t.top<e.bottom;if(r&&i){let[a,l]=Wo(e,t);return _o(a,l)}if(!r){let[a,l]=e.right<=t.left?[e,t]:[t,e],c=i?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:a.right,y1:c,x2:l.left,y2:c,label:`${_((l.left-a.right)/n.x)}`,axis:"x"}),o.push(...pt(a.right,a.top,a.bottom,c,"x")),o.push(...pt(l.left,l.top,l.bottom,c,"x"))}if(!i){let[a,l]=e.bottom<=t.top?[e,t]:[t,e],c=r?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:c,y1:a.bottom,x2:c,y2:l.top,label:`${_((l.top-a.bottom)/n.y)}`,axis:"y"}),o.push(...pt(a.bottom,a.left,a.right,c,"y")),o.push(...pt(l.top,l.left,l.right,c,"y"))}return o}function Xo(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function Mt(e){let t=Xo(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var Ko=5,Yo=8;function nt(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function At(e,t,o){let n=null,r=Ko;for(let i of e){let a=Math.abs(nt(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function En(e,t,o){if(o)return{at:e,what:""};let n=null,r=Yo;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function Sn(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function Lt(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,l=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:l,y2:i,label:_(r.gap/e.scale.x),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,l=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:l,label:_(r.gap/e.scale.y),axis:"y"})}}return o}function Cn(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],l=r[i],c=l-a;c<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:l,y2:t.y,label:_(c),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:l,label:_(c),axis:"y"}))}}return o}var ke=3;function jo(e,t){return e.x<t.x+t.w+ke&&t.x<e.x+e.w+ke&&e.y<t.y+t.h+ke&&t.y<e.y+e.h+ke}function Tn(e,t,o=12){let n=(a,l)=>Math.min(Math.max(a,o),t.w-l-o),r=(a,l)=>Math.min(Math.max(a,o),t.h-l-o),i=[];for(let a of e){let l={...a,x:n(a.x,a.w),y:r(a.y,a.h)},c=!1;for(let b=0;b<16;b++){let w=i.find(u=>jo(u,l));if(!w)break;let S=l.axis==="x"?l.y:l.x;if(l.axis==="x"?l.y=r(c?w.y+w.h+ke:w.y-l.h-ke,l.h):l.x=n(c?w.x-l.w-ke:w.x+w.w+ke,l.w),(l.axis==="x"?l.y:l.x)===S){if(c)break;c=!0}}i.push(l)}return i}function Mn(e,t){let{columns:o,gutter:n,margin:r}=e;if(o<=0)return[];let i=e.maxWidth>0?Math.min(e.maxWidth,t):t,a=Math.max(0,(t-i)/2),c=(Math.max(0,i-r*2)-n*(o-1))/o;if(c<=0)return[];let b=[];for(let w=0;w<o;w+=1)b.push({left:a+r+w*(c+n),width:c});return b}function An(e,t){return e*t>=8?e:0}function Uo(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(l=>parseFloat(l)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function He(e){let t=1,o=1;for(let n=e;n;n=$n(n)){let r=Uo(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var pe=(e,t)=>({light:e,dark:t}),Nt={accent:pe("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:pe("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:pe("oklch(1 0 0)","oklch(0.264 0 0)"),fg:pe("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:pe("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:pe("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:pe("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:pe("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)"),pixelLine:pe("oklch(0.205 0 0 / 0.14)","oklch(0.97 0 0 / 0.14)")};function Nn(e){return`light-dark(${e.light}, ${e.dark})`}var le=Nn(pe("#fafafa","#1a1a1a"));function Fe(e,t=e){return Nn(pe(`rgb(0 0 0 / ${t})`,`rgb(255 255 255 / ${e})`))}var Ln=[0,.07,.08,.1,.12,.15,.2];function X(e){let t=Ln[Math.max(0,Math.min(Ln.length-1,e))];return t===0?le:Fe(t)}var k={primary:Fe(.9),secondary:Fe(.6),tertiary:Fe(.46,.55),disabled:Fe(.22,.26)},re=Fe(.12),we="0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)",Rn="0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)",I=22,$e=36,N={tight:4,base:8,roomy:12,edge:16},H={exit:"160ms cubic-bezier(0.3, 0, 1, 1)",ui:"160ms cubic-bezier(0.2, 0, 0, 1)"},Vo='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',M={title:13,body:12,tag:11,stack:Vo},Y={regular:400,medium:500,semibold:600},Rt="__align_font",qo="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function Gn(){if(document.getElementById(Rt))return;let e=document.createElement("link");e.id=Rt,e.rel="stylesheet",e.href=qo,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function Pn(){document.getElementById(Rt)?.remove()}function Dn(e){let t=[`${Y.medium} ${M.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function Pt(e){let t={};for(let o of Object.keys(Nt))t[o]=e?Nt[o].dark:Nt[o].light;return t}var Gt=null;function Bn(e){Gt=e==="auto"?null:e}function Dt(){if(Gt)return Gt==="dark";let e=document.documentElement,t=getComputedStyle(e).colorScheme;if(/dark/.test(t)&&!/light/.test(t))return!0;if(/light/.test(t)&&!/dark/.test(t))return!1;for(let o of[document.body,e]){if(!o)continue;let n=Jo(getComputedStyle(o).backgroundColor);if(n!==null)return n<.5}return matchMedia("(prefers-color-scheme: dark)").matches}function Jo(e){let t=/^rgba?\(([^)]+)\)$/.exec(e.trim());if(!t)return null;let o=t[1].split(/[\s,/]+/).filter(Boolean).map(Number),[n,r,i,a=1]=o;return n===void 0||r===void 0||i===void 0||a<.5?null:(.2126*n+.7152*r+.0722*i)/255}function ze(e,t){return e.replace(/\)$/,` / ${t})`)}var Qo=`
`,ge=16,Zo=`
.dock {
  /* No color-scheme here: the overlay sets it inline on the shadow host, from
     what the page actually looks like rather than what the machine prefers, and
     it inherits down. Declaring 'light dark' again would undo that and hand
     light-dark() back to the media query. */
  position: fixed; left: ${ge}px; top: 0;
  /* Clamped to the window. A narrow viewport is not an edge case for this
     tool, it is the case it exists for: you make the window 375px wide
     precisely to check a mobile layout, and a readout that hangs off the
     screen there is useless exactly when you reached for it. */
  width: min(340px, calc(100vw - ${ge*2}px));
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none;
  /* Not the whole panel: only the header is a drag surface, and making the
     numbers unselectable means the one thing you might want to paste into a
     stylesheet cannot be picked up by hand. Copy covers the whole reading; a
     selection covers the one value you actually wanted. */
  user-select: none;
  font-family: ${M.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${k.primary};
  --muted: ${k.secondary};
  --border: ${re};
}
.panel {
  padding: 10px; border-radius: 0;
  /* Five sections now \u2014 box, tokens, styled by, matches, colour \u2014 and on a
     laptop that is taller than the window. place() clamps the position but
     cannot rescue a panel taller than the screen, so it scrolls instead. */
  max-height: calc(100vh - ${ge*2}px);
  overflow-y: auto; overscroll-behavior: contain;
  font-size: ${M.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${le};

  box-shadow: ${we};

  /* The one animation in the tool: a panel that must land exactly, so the
     Fluid spring.moderate tier at 160ms, critically damped. */
  opacity: 0;
  transform: translateY(4px) scale(0.98);
  transform-origin: bottom left;
  transition: opacity ${H.exit}, transform ${H.exit},
              box-shadow ${H.exit};
}
/* Held out of the way. Not display:none, so reopening does not replay the
   entrance animation for something that was already there. */
.dock[data-away] { visibility: hidden; pointer-events: none; }
.dock[data-open] .panel {
  pointer-events: auto;
  opacity: 1;
  transform: none;
  /* Slow in, faster out. Both come from the tokens now: the panel had been
     carrying hard-coded curves from the design system the theme replaced. */
  transition: opacity ${H.ui}, transform ${H.ui},
              box-shadow ${H.ui};
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
.dock[data-dragging] .panel { box-shadow: ${Rn}; }
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${M.title}px; font-weight: ${Y.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${M.body}px; font-weight: ${Y.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${M.tag}px; font-weight: ${Y.medium};
  margin-left: 4px;
  color: ${k.primary};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${M.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${X(1)}; }

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
  padding: ${N.base}px;
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
  font-size: ${M.tag}px; font-weight: ${Y.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${Y.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${Y.regular}; }
.row { display: flex; align-items: center; gap: ${N.tight}px; margin: ${N.tight}px 0; }
.row > .edge { flex: 0 0 20px; }
.row > .fill { flex: 1 1 auto; min-width: 0; }

/* Type and tokens sit under the box, in the same muted register as the band
   labels \u2014 they annotate the measurement rather than competing with it. */
.readout {
  user-select: text;
  margin-top: ${N.base}px; padding-top: ${N.base}px;
  border-top: 1px solid var(--border);
}
.readout-tag { position: static; margin-bottom: ${N.tight}px; }
/* One grid for the whole section rather than one per row, so every key in a
   section shares a column and the column sizes to the longest key in it. A
   fixed 62px was right until a diff started printing 'background-color', which
   it broke across two lines mid-word. The 62px floor keeps the rhythm the
   other sections already had. */
.readout-rows {
  display: grid; grid-template-columns: minmax(62px, max-content) 1fr;
  gap: 0 ${N.base}px; align-items: baseline;
  font-size: ${M.tag}px; line-height: 1.5;
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
  font-size: ${M.body}px;
  /* Several of these wrap \u2014 a diff value, a rule file, a token list \u2014 and a
     lone short word on the last line reads as a mistake. */
  text-wrap: pretty;
}
.content {
  border-radius: 0; padding: ${N.roomy}px ${N.base}px;
  text-align: center; font-weight: ${Y.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,ot=ge,Le=-1,We=!1;function On(e){let t=document.createElement("style");t.textContent=Zo,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);let r=!1;function i(g,E){let L=document.createElement("div");L.className="readout";let G=document.createElement("div");G.className="tag readout-tag",G.textContent=g,L.appendChild(G);let j=document.createElement("div");j.className="readout-rows",L.appendChild(j);for(let[ee,V]of E){let O=document.createElement("div");O.className="readout-row";let F=document.createElement("span");F.className="readout-key",F.textContent=ee;let s=document.createElement("span");s.className="readout-value",s.textContent=V,O.append(F,s),j.appendChild(O)}return L}e.appendChild(o);let a=(g,E)=>Math.min(Math.max(g,ge),Math.max(ge,E-ge));function l(){let g=o.offsetHeight||300;Le<0&&(Le=Math.max(ge,innerHeight-g-ge)),ot=a(ot,innerWidth-o.offsetWidth),Le=a(Le,innerHeight-g),o.style.transform=`translate(${ot-ge}px, ${Le}px)`}let c=null;function b(g){g.button===0&&(g.preventDefault(),g.stopPropagation(),c={x:g.clientX,y:g.clientY,dx:ot,dy:Le},o.setAttribute("data-dragging",""),g.currentTarget.setPointerCapture(g.pointerId))}function w(g){c&&(ot=c.dx+(g.clientX-c.x),Le=c.dy+(g.clientY-c.y),l())}function S(){c=null,o.removeAttribute("data-dragging")}addEventListener("resize",l);let u=null,h=[],x;function C(g){let E=document.createElement("div");return E.className="edge",E.textContent=g===0?"0":_(g),g===0&&E.setAttribute("data-zero",""),E}function A(g,E,L,G){let[j,ee,V,O]=L,F=document.createElement("div");F.className="region",F.setAttribute("data-level",String(E));let s=document.createElement("span");s.className="tag",s.textContent=g;let m=document.createElement("div");m.className="row";let d=document.createElement("div");d.className="fill",d.appendChild(G),m.append(C(O),d,C(ee));let v=document.createElement("div");return v.className="head",v.append(s,C(j)),F.append(v,m,C(V)),F}return{show(g,E=[],L){h=E,x=L;let G=Tt(g.el),[j,ee,V,O]=G.border,[F,s,m,d]=G.padding,v=He(g.el),y=g.width/v.x,f=g.height/v.y,$=Math.abs(v.x-1)>.001||Math.abs(v.y-1)>.001,P=document.createElement("header"),Oe=document.createElement("span");Oe.className="name",Oe.textContent=g.label;let z=document.createElement("span");z.className="size",z.textContent=`${_(y)} \xD7 ${_(f)}`;let Q=document.createElement("button");if(Q.className="close",Q.textContent="\xD7",Q.title="close (B brings it back)",Q.addEventListener("pointerdown",D=>D.stopPropagation()),Q.addEventListener("click",D=>{D.stopPropagation(),We=!0,o.removeAttribute("data-open")}),P.append(Oe,z),$){let D=document.createElement("span");D.className="scale",D.textContent=`\xD7${_(v.x)}`,D.title=`renders at ${_(g.width)} \xD7 ${_(g.height)}`,P.appendChild(D)}P.appendChild(Q),P.addEventListener("pointerdown",b),P.addEventListener("pointermove",w),P.addEventListener("pointerup",S),P.addEventListener("pointercancel",S);let ae=document.createElement("div");ae.className="content",ae.textContent=`${_(y-O-ee-d-s)} \xD7 ${_(f-j-V-F-m)}`,ae.title=ae.textContent;let se=[P,A("margin",1,G.margin,A("border",2,G.border,A("padding",3,G.padding,ae)))];if(r){let D=ln(g.el),p=lt(g.el);se.push(p.length&&D?i("type",p.map(T=>[T.label,T.value])):i("type",[["","nothing of its own to set type on"]]))}if(L&&L.el!==g.el&&L.el.isConnected){let D=xn(L.el,g.el).map(q=>[q.prop,`${q.a||"\u2014"} \u2192 ${q.b||"\u2014"}`]),p=D.slice(0,10);D.length>p.length&&p.push(["",`and ${D.length-p.length} more`]);let T=L.label===g.label?"the one locked before":L.label;se.push(i(`differs from ${T}`,p.length?p:[["","nothing in the properties it compares"]]))}let he=gn(g.el);if(he&&he.rows.length&&se.push(i(`laid out by ${he.display}`,he.rows.map(D=>[D.label,D.value]))),E.length){let D=E.map(T=>[_(T.px),T.detail]),p=pn(E.map(T=>T.px));p&&D.push(["",p]),se.push(i("gaps",D))}let K=ct(g.el),Je=cn([y,f,...G.margin,...G.border,...G.padding,...r?lt(g.el).map(D=>D.px):[]],K);Je&&se.push(i("tokens",[["",Je]]));let Ie=fn(g.el);Ie.length&&se.push(i("styled by",Ie.slice(0,4).map(D=>[D.selector,D.file])));let Qe=hn(g.el);Qe>1&&se.push(i("matches",[["",`${Qe} elements share ${tt(g.el)}`]]));let Me=K.filter(D=>et(D.value));if(Me.length){let D=mn(g.el).map(({label:p,value:T})=>{let q=dt(T,Me);return[p,q.length?`${T}  ${q.join(" ")}`:`${T}  \u2014`]});D.length&&se.push(i("colour",D))}n.replaceChildren(...se),u=g,l(),!We&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},showsType:()=>r,isOpen:()=>!We&&u!==null,toggleType(){r=!r,u&&this.show(u,h,x)},asText(){if(!u)return"";let g=Tt(u.el),E=He(u.el),L=u.width/E.x,G=u.height/E.y,j=V=>V.map(O=>_(O)).join(" "),ee=[`${u.label}  ${_(L)} \xD7 ${_(G)}`,`margin   ${j(g.margin)}`,`border   ${j(g.border)}`,`padding  ${j(g.padding)}`];if(r)for(let V of lt(u.el))ee.push(`${V.label.padEnd(8)} ${V.value}`);return ee.join(Qo)},hide(){u=null,o.removeAttribute("data-open")},setHidden(g){o.toggleAttribute("data-away",g)},toggle(){u&&(We=!We,We?o.removeAttribute("data-open"):(l(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",l),o.remove(),t.remove()}}}function In(e=20,t=1e3){let o=[];return{push(n,r,i=Date.now()){let a=o[o.length-1];if(a&&r!==""&&a.tag===r&&i-a.at<=t){a.at=i;return}o.push({state:n,tag:r,at:i}),o.length>e&&o.shift()},pop(){return o.pop()?.state??null},peek(){return o[o.length-1]?.state??null},depth(){return o.length},clear(){o.length=0}}}var er="0 0 24 24";var R=e=>({path:e}),Ee=(e,t,o,n,r)=>({rect:[e,t,o,n,r]}),tr={rulers:[R("M2 8V4"),R("M22 8V4"),R("M22 6H2"),Ee(2,12,20,8,2),R("M6 15v-3"),R("M10 15v-3"),R("M14 15v-3"),R("M18 15v-3")],xray:[R("M3 7V5a2 2 0 0 1 2-2h2"),R("M17 3h2a2 2 0 0 1 2 2v2"),R("M21 17v2a2 2 0 0 1-2 2h-2"),R("M7 21H5a2 2 0 0 1-2-2v-2")],grid:[Ee(3,3,18,18,2),R("M9 3v18"),R("M15 3v18")],pixels:[Ee(3,3,18,18,2),R("M3 9h18"),R("M3 15h18"),R("M9 3v18"),R("M15 3v18")],type:[R("M12 4v16"),R("M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"),R("M9 20h6")],panel:[Ee(3,3,18,18,2),Ee(8,8,8,8,1)],freeze:[Ee(14,3,5,18,1),Ee(5,3,5,18,1)],copy:[Ee(8,8,14,14,2),R("M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2")],pick:[R("m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12"),R("m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z"),R("m2 22 .414-.414")],hide:[R("M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"),R("M14.084 14.158a3 3 0 0 1-4.242-4.242"),R("M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"),R("m2 2 20 20")],undo:[R("M9 14 4 9l5-5"),R("M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11")],edit:[R("M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"),R("m15 5 4 4")],check:[R("M20 6 9 17l-5-5")],cross:[R("M18 6 6 18"),R("m6 6 12 12")]},Bt="http://www.w3.org/2000/svg";function Ne(e,t=16){let o=document.createElementNS(Bt,"svg");o.setAttribute("viewBox",er),o.setAttribute("width",String(t)),o.setAttribute("height",String(t)),o.setAttribute("fill","none"),o.setAttribute("stroke","currentColor"),o.setAttribute("stroke-width","2"),o.setAttribute("stroke-linecap","round"),o.setAttribute("stroke-linejoin","round"),o.setAttribute("aria-hidden","true");for(let n of tr[e])if("rect"in n){let[r,i,a,l,c]=n.rect,b=document.createElementNS(Bt,"rect");b.setAttribute("x",String(r)),b.setAttribute("y",String(i)),b.setAttribute("width",String(a)),b.setAttribute("height",String(l)),b.setAttribute("rx",String(c)),o.appendChild(b)}else{let r=document.createElementNS(Bt,"path");r.setAttribute("d",n.path),o.appendChild(r)}return o}var nr=[{title:"Pointing at things",rows:[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure whatever is under the cursor"],["Click","lock an element, so it keeps measuring after the pointer leaves"],["Right-click","add another to the locked set, or drop one from it. Two locked also gets you a diff"],["Drag the panel header","move the box model out of your way"],["Esc","clear the locks, then close the tool"]]},{title:"Guides",rows:[["Drag from a rule","pull out a guide; drag it back into the rule to throw it away"],["V  /  H","drop a vertical or horizontal guide at the cursor"],["Hover a guide","its distance to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the guide you last touched. Shift for 10px"],["L","pin a guide, so it cannot be moved or deleted by accident"],["Ctrl/Cmd while placing","ignore snapping"],["Del","remove the guide under the cursor. Shift+Del for all of them"]]}],de=N.edge,Ot=24,or=900,rt=$e,it=N.base,rr=`
.flag {
  position: fixed; top: ${de}px; right: ${de}px;
  display: flex; align-items: center; gap: 8px;
  transition: top ${H.ui};
  padding: ${($e-Ot)/2}px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${M.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${M.tag}px; font-weight: ${Y.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${k.primary};
  background: ${le};
  box-shadow: ${we};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
/* No negative tracking: it is 11px, and tightening is what large text wants.
   Small text reads better at zero or a hair positive. */
.flag .name { letter-spacing: 0; }
/* The rulers draw a gutter along the top edge, and the badge sits in it. Step
   down out of the way rather than covering the ticks the rulers exist to show. */
.flag[data-rulers] { top: ${de+I}px; }
.help[data-rulers] { top: ${de+I+rt+it}px; }
.flag:hover { background: ${X(1)}; }
.flag .count { color: ${k.secondary}; }

/* A layers bar, not a palette. Switches, then the one control that changes the
   page, then the things that happen once. */
.tools { display: flex; align-items: center; gap: 2px; }
.sep {
  width: 1px; align-self: stretch; margin: 0 4px;
  background: ${re};
}
.tool {
  width: ${Ot}px; height: ${Ot}px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; cursor: pointer;
  font: inherit; font-size: ${M.tag}px; font-weight: ${Y.medium};
  color: ${k.tertiary};
}
/* Both glyphs occupy the same cell so one can cross-fade into the other; a
   swap would jump, and the point is to be noticed without being a movement. */
.tool > svg { grid-area: 1 / 1; transition: opacity ${H.ui}; }
.tool > .ack { opacity: 0; }
.tool[data-ack] > .ack { opacity: 1; }
.tool[data-ack] > .glyph { opacity: 0; }
.tool:hover { background: ${X(2)}; color: ${k.primary}; }
/* On the press, not on the release. Waiting for the click to acknowledge a
   button is the difference between a control that answers and one that lags,
   and it costs one rule. */
.tool:active { background: ${X(4)}; color: ${k.primary}; }
.tool:focus-visible { outline: 1px solid ${k.primary}; outline-offset: -1px; }
/* On is the film, not a colour: the three hues each already mean something on
   the canvas, and a fourth here would say nothing. */
.tool[data-on] { background: ${X(4)}; color: ${k.primary}; }
/*
 * Armed reads differently from on, deliberately. Every other toggle draws
 * something over the page; this one lets the page be rewritten, and a tool that
 * can do that while looking exactly like one that cannot is the problem the
 * arming design exists to avoid. It inverts rather than taking a hue: red
 * already means a measurement here, and a second meaning for it would cost
 * more than the emphasis is worth.
 */
.tool[data-tool='edit'][data-on] {
  background: ${k.primary};
  color: ${le};
}

/* The badge steps down out of the ruler gutter, and that step is decoration:
   under reduced motion it should simply be in the right place. */
@media (prefers-reduced-motion: reduce) {
  .flag { transition: none; }
}
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: ${de+rt+it}px; right: ${de}px;
  /* 368 plus two insets is 400, so this was the first thing to hang off the
     left edge of a phone-width window. */
  /* The padding is in the subtraction because these boxes are content-box:
     without it the clamp lets the panel sit flush against the far edge with
     no inset at all, which reads as broken rather than as tight. */
  width: min(368px, calc(100vw - ${de*2+N.base*2}px));
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${de*2+rt+it}px); overflow-y: auto;
  padding: ${N.base}px; border-radius: 0;
  user-select: none;
  font-family: ${M.stack};
  font-synthesis: none;
  font-size: ${M.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${k.primary};
  background: ${le};
  box-shadow: ${we};
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
  transition: opacity ${H.ui}, transform ${H.ui}, visibility 0s linear 160ms;
}
.help[data-open] {
  opacity: 1; visibility: visible; pointer-events: auto;
  transform: none;
  transition: opacity ${H.ui}, transform ${H.ui}, visibility 0s;
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
  align-items: baseline; gap: ${N.tight}px ${N.base}px; margin: 0;
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
  color: ${k.tertiary}; line-height: 0;
}
.help h4 {
  grid-column: 1 / -1; margin: 10px 0 2px;
  font-size: ${M.tag}px; font-weight: ${Y.semibold};
  color: ${k.tertiary};
}
.help h4:first-child { margin-top: 0; }
.help kbd {
  display: inline-block; padding: 3px 5px;
  font: inherit; font-weight: ${Y.medium};
  border: 1px solid ${re};
  background: ${X(2)};
}
/* These run to three lines, and a one-word last line reads as a mistake. */
.help dd { margin: 0; color: ${k.secondary}; text-wrap: pretty; }
`,It=[{name:"rulers",label:"Rulers",key:"R",toggle:!0,what:"a scale down the top and left edges, in page pixels \u2014 and the gutters you drag guides out of"},{name:"xray",label:"X-ray",key:"X",toggle:!0,what:"outline every element at once, to see the boxes a layout is really made of"},{name:"grid",label:"Column grid",key:"G",toggle:!0,what:"the grid your design is built on, columns filled and gutters left empty. Needs one configured"},{name:"pixels",label:"Pixel grid",key:"K",toggle:!0,what:"a ten-pixel lattice over the page, to read an offset off without measuring it"},{name:"type",label:"Type",key:"T",toggle:!0,what:"add size, weight, line height and tracking to the panel, each checked against your scale"},{name:"panel",label:"Box model",key:"B",toggle:!0,what:"the readout itself \u2014 margins, borders, padding, what places the element, what styles it"},{name:"hide",label:"Hide",key:"\\",toggle:!0,what:"everything drawn, out of the way for a moment. Your locks, guides and layers all survive it"},{name:"freeze",label:"Freeze",key:"F",toggle:!0,what:"hold every animation and transition where it stands, so a moving thing can be measured"},{name:"copy",label:"Copy",key:"C",toggle:!1,what:"put everything in the panel on the clipboard as text"},{name:"pick",label:"Colour",key:"P",toggle:!1,what:"sample a colour from anywhere on screen and match it against your palette"},{name:"edit",label:"Edit",key:"E",toggle:!0,what:"let the panel change the page. Off until you say so, shown while it is on, and everything goes back when you turn it off"},{name:"undo",label:"Undo",key:"Ctrl/Cmd + Z",toggle:!1,what:"step back through the guides \u2014 a whole run of nudges counts as one"}];function Hn(e,t){let o=document.createElement("style");o.textContent=rr,e.appendChild(o);let n=document.createElement("div");n.className="flag";let r=document.createElement("span");r.className="name",r.textContent="Align";let i=document.createElement("span");i.className="count";let a=new Map,l=new Map,c=document.createElement("div");c.className="tools";for(let h of It){if(h.name==="freeze"||h.name==="copy"){let A=document.createElement("span");A.className="sep",c.appendChild(A)}let x=document.createElement("button");x.type="button",x.className="tool",x.dataset.tool=h.name;let C=Ne(h.name);C.classList.add("glyph"),x.appendChild(C),x.setAttribute("aria-label",h.label),x.title=`${h.label}  \xB7  ${h.key}
${h.what}`,h.toggle||x.setAttribute("data-once",""),x.addEventListener("click",A=>{A.stopPropagation(),t(h.name)}),a.set(h.name,x),c.appendChild(x)}n.append(r,c,i);let b=document.createElement("div");b.className="help";let w=document.createElement("dl");function S(h){let x=document.createElement("h4");x.textContent=h,w.appendChild(x)}function u(h,x,C){let A=document.createElement("span");A.className="glyph",C&&A.appendChild(Ne(C,14));let g=document.createElement("dt"),E=document.createElement("kbd");E.textContent=h,g.appendChild(E);let L=document.createElement("dd");L.textContent=x,w.append(A,g,L)}S("The bar, left to right");for(let h of It)u(h.key,`${h.label} \u2014 ${h.what}`,h.name);for(let h of nr){S(h.title);for(let[x,C]of h.rows)u(x,C)}return b.appendChild(w),n.addEventListener("click",h=>{h.stopPropagation(),b.toggleAttribute("data-open")}),e.append(n,b),{acknowledge(h,x){let C=a.get(h);if(!C)return;clearTimeout(l.get(h)),C.querySelector(".ack")?.remove();let A=Ne(x?"check":"cross");A.classList.add("ack"),C.appendChild(A),requestAnimationFrame(()=>C.setAttribute("data-ack",x?"yes":"no")),l.set(h,setTimeout(()=>{C.removeAttribute("data-ack"),setTimeout(()=>C.querySelector(".ack")?.remove(),200)},or))},update(h,x){i.textContent=h>0?`${h} locked`:"";let C=x.rulers&&!x.hide;n.toggleAttribute("data-rulers",C),b.toggleAttribute("data-rulers",C);for(let E of It)E.toggle&&a.get(E.name)?.toggleAttribute("data-on",x[E.name]===!0);let A=a.get("copy");A&&(A.disabled=!x.canCopy);let g=a.get("undo");g&&(g.disabled=!x.canUndo)},closeHelp(){let h=b.hasAttribute("data-open");return b.removeAttribute("data-open"),h},destroy(){for(let h of l.values())clearTimeout(h);n.remove(),b.remove(),o.remove()}}}function Fn(e,t=0,o=0){return Math.min(100,Math.max(...[e,t,o].map(n=>{let[r,i="0"]=String(n).toLowerCase().split("e");return Math.max(0,(r.split(".")[1]?.length??0)-Number(i))})))}function Ht(e,t,o,n){let r=o??-1/0,i=n??1/0,a=Math.max(r,Math.min(i,e));if(a===r||a===i||!Number.isFinite(t)||t<=0)return a;let l=o??0,c=l+Math.round((a-l)/t)*t;return Math.max(r,Math.min(i,Number(c.toPrecision(14))))}var ir=.03125;function ar(e,t,o){let n=(e-t)/(o-t),r=Math.round(n*10)/10;return Math.abs(n-r)<=ir?t+r*(o-t):e}var sr=32,lr=8,cr=200;function zn(e,t){let o=Math.max(0,e-sr);return t*lr*Math.sqrt(Math.min(o/cr,1))}function ft(e,t,o){return o===t?0:(e-t)/(o-t)*100}function Wn(e,t,o){let n=Math.max(0,Math.min(1,e));return t+n*(o-t)}function dr(e,t,o,n,r,i=!1){if(e==="Home")return o;if(e==="End")return n;let a=["ArrowRight","ArrowUp","PageUp"].includes(e)?1:["ArrowLeft","ArrowDown","PageDown"].includes(e)?-1:0;if(!a)return;if(!(r>0)||n<=o)return o;let l=e.startsWith("Page")||i?10:1,c=(t-o)/r,b=o+(a>0?Math.floor(c+1e-9)+l:Math.ceil(c-1e-9)-l)*r;return Math.max(o,Math.min(n,Number(b.toPrecision(14))))}function ur(e,t,o){let n=(t-e)/o;return n<=10&&Number.isFinite(n)&&n>1?Array.from({length:Math.round(n)-1},(r,i)=>(i+1)*o/(t-e)*100):Array.from({length:9},(r,i)=>(i+1)*10)}function _n(e,t,o=0,n=0){let r=Fn(t,o,n),i=Math.max(r,Math.min(4,Fn(e)));return!Number.isFinite(t)||t<=0?i:Ht(e,t,o,n)===e?r:i}function pr(e,t,o,n){return(o-t)/n<=10?Math.max(t,Math.min(o,t+Math.round((e-t)/n)*n)):ar(e,t,o)}var mr={stiffness:300,damping:25,mass:.8},hr={stiffness:220,damping:22,mass:1};function Xn(e,t,o,n,r){let i=(-r.stiffness*(e-o)-r.damping*t)/r.mass,a=t+i*n;return{x:e+a*n,v:a}}function Kn(e,t,o,n=.01){return Math.abs(e-o)<n&&Math.abs(t)<n}var fr=0,gr=.5,br=.9,xr=.1,yr=3,wr=800,Yn=8,gt=3,vr=20,Un=10,Ft=12,kr=`
.sl {
  position: relative;
  height: ${$e}px;
  overflow: hidden;
  background: ${X(1)};
  border-radius: 0;
  cursor: pointer;
  user-select: none;
  touch-action: none;
}
.sl:focus-visible { outline: 2px solid ${k.secondary}; outline-offset: -2px; }

/* Behind everything, and scaled rather than resized: a width change is layout,
   a transform is not, and this moves on every pointer event of a drag. */
.sl-fill {
  position: absolute; inset: 0;
  transform-origin: left center;
  transform: scaleX(0);
  background: ${X(3)};
  transition: background ${H.ui};
  pointer-events: none;
}
.sl[data-awake] .sl-fill { background: ${X(5)}; }

.sl-marks { position: absolute; inset: 0; pointer-events: none; }
.sl-mark {
  position: absolute; top: 50%;
  width: 1px; height: 8px;
  transform: translate(-50%, -50%);
  background: transparent;
  transition: background ${H.ui};
}
.sl[data-awake] .sl-mark { background: ${re}; }

.sl-handle {
  position: absolute; top: 50%; left: 0;
  width: ${gt}px; height: ${vr}px;
  background: ${k.primary};
  pointer-events: none;
  opacity: ${fr};
  /* Two transitions, two jobs: opacity and the squash are eased, the position
     is not \u2014 it is written every frame and must not lag the pointer. */
  transition: opacity ${H.ui}, scale ${H.ui};
  scale: 0.25 1;
}
.sl[data-awake] .sl-handle { opacity: ${gr}; scale: 1 1; }
.sl[data-dragging] .sl-handle { opacity: ${br}; }
.sl[data-dodge] .sl-handle { opacity: ${xr}; scale: 1 0.75; }

.sl-label, .sl-value {
  position: absolute; top: 50%;
  transform: translateY(-50%);
  font-size: ${M.body}px; font-weight: ${Y.medium};
  line-height: 1;
  white-space: nowrap;
  transition: color ${H.ui};
}
.sl-label { left: ${Un}px; color: ${k.secondary}; pointer-events: none; }
.sl-value {
  right: ${Ft}px;
  color: ${k.secondary};
  /* Inter has tabular figures, so the number stops shifting as it changes
     without loading a second face for it. */
  font-variant-numeric: tabular-nums;
  pointer-events: auto;
  border-bottom: 1px solid transparent;
  padding-bottom: 1px;
}
.sl[data-awake] .sl-value { color: ${k.primary}; }
/* Only after the hover delay: the underline is the promise that a click here
   edits rather than seeks, and it must not appear during a drag. */
.sl-value[data-editable] { border-bottom-color: ${k.secondary}; cursor: text; }

.sl-input {
  position: absolute; right: ${Ft}px; top: 50%;
  transform: translateY(-50%);
  width: 5ch;
  padding: 0 0 1px; border: 0;
  border-bottom: 1px solid ${k.secondary};
  background: none; outline: none;
  text-align: right;
  font: inherit;
  font-size: ${M.body}px; font-weight: ${Y.medium};
  font-variant-numeric: tabular-nums;
  color: ${k.primary};
}
`,jn="align-slider";function $r(e){if(e.querySelector(`#${jn}`))return;let t=document.createElement("style");t.id=jn,t.textContent=kr,e.appendChild(t)}function Vn(e,t){$r(e);let o=t.min??0,n=t.max??1,r=t.step??.01,i=t.value,a=document.createElement("div");a.className="sl",a.tabIndex=0,a.setAttribute("role","slider"),a.setAttribute("aria-label",t.label),a.setAttribute("aria-valuemin",String(o)),a.setAttribute("aria-valuemax",String(n));let l=document.createElement("div");l.className="sl-fill";let c=document.createElement("div");c.className="sl-marks";for(let p of ur(o,n,r)){let T=document.createElement("div");T.className="sl-mark",T.style.left=`${p}%`,c.appendChild(T)}let b=document.createElement("div");b.className="sl-handle";let w=document.createElement("span");w.className="sl-label",w.textContent=t.label;let S=document.createElement("span");S.className="sl-value",a.append(c,l,b,w,S);let u=ft(i,o,n),h=0,x=null,C=0,A=0;function g(){return a.offsetWidth}function E(){l.style.transform=`scaleX(${u/100})`;let p=g(),T=u/100*p,q=Math.max(gt,Math.min(p-gt,T))-gt/2;b.style.transform=`translate(${q}px, -50%)`;let fe=!1;if(p>0){let Ze=Un+w.offsetWidth+Yn,ve=p-Ft-S.offsetWidth-Yn;fe=T<Ze||T>ve}a.toggleAttribute("data-dodge",fe)}function L(){let p=_n(i,r,o,n);S.textContent=t.unit?`${i.toFixed(p)}${t.unit}`:i.toFixed(p),a.setAttribute("aria-valuenow",String(i)),a.setAttribute("aria-valuetext",S.textContent)}function G(){C&&cancelAnimationFrame(C),C=0,x=null,h=0}function j(){return typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches}function ee(p,T=mr){if(j()){G(),u=p,E();return}if(x=p,A=performance.now(),C)return;let q=fe=>{let Ze=Math.min((fe-A)/1e3,.03333333333333333);if(A=fe,x===null){C=0;return}let ve=Xn(u,h,x,Ze,T);if(u=ve.x,h=ve.v,E(),Kn(u,h,x)){u=x,h=0,x=null,C=0,E();return}C=requestAnimationFrame(q)};C=requestAnimationFrame(q)}function V(p,T){let q=Ht(p,r,o,n),fe=q!==i;i=q,L(),T?ee(ft(i,o,n)):(G(),u=ft(i,o,n),E()),fe&&t.onChange(i)}let O=null,F=!0,s=null,m=1,d=0,v=0;function y(p){if(d=p,p===0){a.style.width="",a.style.transform="";return}a.style.width=`calc(100% + ${Math.abs(p)}px)`,a.style.transform=p<0?`translateX(${p}px)`:""}function f(){if(d===0)return;if(j()){y(0),a.style.width="",a.style.transform="";return}let p=0,T=performance.now(),q=fe=>{let Ze=Math.min((fe-T)/1e3,.03333333333333333);T=fe;let ve=Xn(d,p,0,Ze,hr);if(p=ve.v,y(ve.x),Kn(ve.x,p,0,.05)){y(0),a.style.width="",a.style.transform="",v=0;return}v=requestAnimationFrame(q)};v=requestAnimationFrame(q)}function $(p){if(!s)return 0;let T=g();return T<=0?0:(p-s.left)/m/T}let P=p=>{if(!(K||p.button!==0)){p.preventDefault();try{a.setPointerCapture(p.pointerId)}catch{}O={x:p.clientX,y:p.clientY},F=!0,s=a.getBoundingClientRect(),m=He(a).x||1,a.setAttribute("data-awake","")}},Oe=p=>{if(!O)return;let T=p.clientX-O.x,q=p.clientY-O.y;F&&Math.hypot(T,q)>yr&&(F=!1,a.setAttribute("data-dragging","")),!(F||!s)&&(j()||(p.clientX<s.left?y(zn(s.left-p.clientX,-1)):p.clientX>s.right?y(zn(p.clientX-s.right,1)):d!==0&&y(0)),G(),V(Wn($(p.clientX),o,n),!1))},z=p=>{O&&(F&&V(pr(Wn($(p.clientX),o,n),o,n,r),!0),t.onCommit?.(i),f(),O=null,a.removeAttribute("data-dragging"),ae||a.removeAttribute("data-awake"))},Q=()=>{O&&(y(0),a.style.width="",a.style.transform="",O=null,a.removeAttribute("data-dragging"),ae||a.removeAttribute("data-awake"))},ae=!1,se=()=>{ae=!0,a.setAttribute("data-awake","")},he=()=>{ae=!1,O||a.removeAttribute("data-awake")},K=null,Je=!1,Ie=0;function Qe(){if(K)return;K=document.createElement("input"),K.className="sl-input",K.type="text",K.setAttribute("aria-label",`${t.label} value`),K.value=i.toFixed(_n(i,r,o,n)),S.style.display="none",a.appendChild(K),K.focus(),K.select();let p=T=>{if(K){if(T){let q=parseFloat(K.value);Number.isFinite(q)&&(V(Math.max(o,Math.min(n,q)),!0),t.onCommit?.(i))}K.remove(),K=null,S.style.display="",Me(!1),a.focus()}};K.addEventListener("keydown",T=>{T.stopPropagation(),T.key==="Enter"?(T.preventDefault(),p(!0)):T.key==="Escape"&&(T.preventDefault(),p(!1))}),K.addEventListener("blur",()=>p(!0)),K.addEventListener("pointerdown",T=>T.stopPropagation())}function Me(p){Je=p,S.toggleAttribute("data-editable",p)}S.addEventListener("pointerenter",()=>{K||O||(Ie=window.setTimeout(()=>Me(!0),wr))}),S.addEventListener("pointerleave",()=>{clearTimeout(Ie),K||Me(!1)}),S.addEventListener("pointerdown",p=>{Je&&(p.stopPropagation(),p.preventDefault(),Qe())});let D=p=>{if(p.target!==a||p.altKey||p.metaKey||p.ctrlKey)return;let T=dr(p.key,i,o,n,r,p.shiftKey);if(T===void 0){if(p.key!=="Enter")return;p.preventDefault(),p.stopPropagation(),Me(!0),Qe();return}p.preventDefault(),p.stopPropagation(),V(T,!1),t.onCommit?.(i)};return a.addEventListener("pointerdown",P),a.addEventListener("pointermove",Oe),a.addEventListener("pointerup",z),a.addEventListener("pointercancel",Q),a.addEventListener("lostpointercapture",Q),a.addEventListener("pointerenter",se),a.addEventListener("pointerleave",he),a.addEventListener("keydown",D),L(),requestAnimationFrame(E),{el:a,set(p){i=Ht(p,r,o,n),L(),G(),u=ft(i,o,n),E()},destroy(){G(),v&&cancelAnimationFrame(v),clearTimeout(Ie),a.remove()}}}function Se(e,t){return getComputedStyle(e).getPropertyValue(t).trim()}function Er(e,t){let o=parseFloat(e);if(e.endsWith("px")&&Number.isFinite(o)){let r=Ct(o,t)[0];if(r)return r}return et(e)?dt(e,t)[0]??null:null}function Sr(e){if(e.length===0)return"";let t=new Map;for(let n of e){let r=t.get(n.selector)??[];r.push(n),t.set(n.selector,r)}let o=["These changes were made live in the browser and are not in the source yet.","Apply them, preferring the named token wherever one is given.",""];for(let[n,r]of t){o.push(`${n} {`);for(let i of r){let a=i.token?`var(${i.token})`:i.to,l=i.token?`  /* ${i.to}, was ${i.from} */`:`  /* was ${i.from} */`;o.push(`  ${i.prop}: ${a};${l}`)}o.push("}","")}return o.join(`
`).trimEnd()}function qn(){let e=new Map,t=!1;function o(r){let i=e.get(r);if(i)return i;let a=new Map;return e.set(r,a),a}function n(r,i,a){let l=r.style;a.inline?l.setProperty(i,a.inline):l.removeProperty(i)}return{get armed(){return t},arm(){t=!0},disarm(){let r=this.revertAll();return t=!1,r},set(r,i,a){if(!t)return;let l=o(r);l.has(i)||l.set(i,{inline:r.style.getPropertyValue(i),computed:Se(r,i)}),r.style.setProperty(i,a)},revert(r,i){let a=e.get(r),l=a?.get(i);!a||!l||(n(r,i,l),a.delete(i),a.size===0&&e.delete(r))},revertAll(){let r=0;for(let[i,a]of e)for(let[l,c]of a)n(i,l,c),r+=1;return e.clear(),r},touched(r,i){return e.get(r)?.has(i)??!1},touchedProps(r){return[...e.get(r)?.keys()??[]].sort()},changes(){let r=[];for(let[i,a]of e)for(let[l,c]of a)r.push({el:i,prop:l,from:c.computed,to:Se(i,l)});return r},asPrompt(){let r=[];for(let[i,a]of e){let l=ct(i),c=tt(i);for(let[b,w]of a){let S=Se(i,b);S!==w.computed&&r.push({selector:c,prop:b,from:w.computed,to:S,token:Er(S,l)})}}return Sr(r)}}}var zt=["top","right","bottom","left"],Cr=["border-top-left-radius","border-top-right-radius","border-bottom-right-radius","border-bottom-left-radius"],Tr=[{name:"Type",specs:[{prop:"font-size",label:"Size",kind:"length",min:8,max:96,step:1,unit:"px"},{prop:"font-weight",label:"Weight",kind:"number",min:100,max:900,step:100},{prop:"line-height",label:"Line height",kind:"length",min:0,max:96,step:1,unit:"px"},{prop:"letter-spacing",label:"Tracking",kind:"length",min:-4,max:12,step:.1,unit:"px"},{prop:"font-style",label:"Style",kind:"choice",options:["normal","italic"],more:!0},{prop:"text-align",label:"Align",kind:"choice",options:["start","center","end","justify"],more:!0},{prop:"text-transform",label:"Case",kind:"choice",options:["none","uppercase","lowercase","capitalize"],more:!0},{prop:"text-decoration-line",label:"Decoration",kind:"choice",options:["none","underline","line-through"],more:!0}]},{name:"Colour",specs:[{prop:"color",label:"Text",kind:"colour"},{prop:"background-color",label:"Background",kind:"colour"},{prop:"border-color",label:"Border",kind:"colour",more:!0},{prop:"opacity",label:"Opacity",kind:"number",min:0,max:1,step:.01}]},{name:"Box",specs:[{prop:"padding",label:"Padding",kind:"length",min:0,max:128,step:1,unit:"px",sides:zt.map(e=>`padding-${e}`)},{prop:"margin",label:"Margin",kind:"length",min:-64,max:128,step:1,unit:"px",sides:zt.map(e=>`margin-${e}`)},{prop:"width",label:"Width",kind:"length",min:0,max:1600,step:1,unit:"px",more:!0},{prop:"height",label:"Height",kind:"length",min:0,max:1200,step:1,unit:"px",more:!0},{prop:"box-sizing",label:"Sizing",kind:"choice",options:["content-box","border-box"]}]},{name:"Border",specs:[{prop:"border-width",label:"Width",kind:"length",min:0,max:24,step:1,unit:"px",sides:zt.map(e=>`border-${e}-width`)},{prop:"border-style",label:"Style",kind:"choice",options:["none","solid","dashed","dotted"]},{prop:"border-radius",label:"Radius",kind:"length",min:0,max:64,step:1,unit:"px",sides:Cr}]},{name:"Layout",specs:[{prop:"display",label:"Display",kind:"choice",options:["block","flex","grid","inline-flex","inline-block","none"]},{prop:"flex-direction",label:"Direction",kind:"choice",options:["row","column","row-reverse","column-reverse"],more:!0},{prop:"justify-content",label:"Justify",kind:"choice",options:["flex-start","center","flex-end","space-between"],more:!0},{prop:"align-items",label:"Align",kind:"choice",options:["stretch","flex-start","center","flex-end"],more:!0},{prop:"flex-wrap",label:"Wrap",kind:"choice",options:["nowrap","wrap"],more:!0},{prop:"gap",label:"Gap",kind:"length",min:0,max:96,step:1,unit:"px"}]}];function Jn(e){let t=parseFloat(e);return Number.isFinite(t)?t:0}function Mr(e){let t=/^rgba?\(([^)]+)\)$/.exec(e.trim());if(!t)return/^#[0-9a-f]{6}$/i.test(e.trim())?e.trim():"#000000";let[o,n,r]=t[1].split(/[\s,/]+/).filter(Boolean).map(Number);if(o===void 0||n===void 0||r===void 0)return"#000000";let i=a=>Math.max(0,Math.min(255,Math.round(a))).toString(16).padStart(2,"0");return`#${i(o)}${i(n)}${i(r)}`}var Ar=320,Lr=`
.edit-dock {
  position: fixed;
  top: ${N.edge}px;
  left: ${N.edge}px;
  width: ${Ar}px;
  max-height: calc(100vh - ${N.edge*2}px);
  display: none;
  flex-direction: column;
  pointer-events: auto;
  font-family: ${M.stack};
  font-synthesis: none;
  font-size: ${M.body}px;
  font-weight: ${Y.regular};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${k.primary};
  background: ${le};
  box-shadow: ${we};
}
.edit-dock[data-open] { display: flex; }

.edit-head {
  display: flex; align-items: center; gap: ${N.base}px;
  flex: none;
  height: ${$e}px;
  padding: 0 ${N.base}px 0 ${N.roomy}px;
  border-bottom: 1px solid ${re};
}
.edit-title { font-size: ${M.title}px; font-weight: ${Y.semibold}; }
.edit-subject {
  flex: 1; min-width: 0;
  color: ${k.tertiary};
  font-size: ${M.tag}px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  text-align: right;
}
/*
 * The gutter is reserved whether or not it is needed.
 *
 * Without it the scrollbar appears the moment the content is a row too tall,
 * takes about fifteen pixels off the width, and every row reflows under it \u2014
 * which is why the values were being clipped at the right edge on exactly the
 * elements that had enough properties to scroll.
 */
.edit-body {
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  padding: ${N.base}px;
}
/* Nothing a control does may push the panel wider than the panel. */
.edit-line > * { min-width: 0; }

.edit-group + .edit-group { margin-top: ${N.roomy}px; }
.edit-group-name {
  display: block;
  margin: 0 0 ${N.tight}px 2px;
  font-size: ${M.tag}px; font-weight: ${Y.medium};
  letter-spacing: 0.04em; text-transform: uppercase;
  color: ${k.tertiary};
}
.edit-rows { display: grid; gap: 6px; }

/* A row the tool has written. The bar is on the leading edge so a column of
   rows shows at a glance which of them are the tool's doing and which are the
   page's, without a word of text per row. */
.edit-row { position: relative; }
.edit-row[data-touched]::before {
  content: '';
  position: absolute; left: -${N.base}px; top: 0; bottom: 0;
  width: 2px;
  background: ${k.primary};
}

.edit-line {
  display: flex; align-items: center; gap: ${N.base}px;
  min-height: ${$e}px;
  padding: 0 10px;
  background: ${X(1)};
}
.edit-label {
  flex: none; width: 88px;
  color: ${k.secondary};
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.edit-field { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; }

/* Choice: one button per value, the current one filled. Buttons rather than a
   select, because a select hides every option until you open it and the whole
   value of these is seeing the alternatives. */
.edit-choice { display: flex; flex-wrap: wrap; gap: 2px; }
.edit-opt {
  padding: 5px 7px; border: 0; border-radius: 0;
  background: ${X(2)}; color: ${k.secondary};
  font: inherit; font-size: ${M.tag}px; cursor: pointer;
  transition: background ${H.ui}, color ${H.ui};
}
.edit-opt:hover { background: ${X(4)}; color: ${k.primary}; }
.edit-opt[data-on] { background: ${k.primary}; color: ${le}; }

.edit-swatch {
  flex: none; width: 22px; height: 22px;
  padding: 0; border: 0; border-radius: 0;
  box-shadow: inset 0 0 0 1px ${re};
  cursor: pointer;
}
.edit-hex {
  flex: 1; min-width: 0;
  height: 24px; padding: 0 6px;
  border: 1px solid ${re}; border-radius: 0;
  background: ${X(1)}; color: ${k.primary};
  font: inherit; font-size: ${M.tag}px;
  font-variant-numeric: tabular-nums;
}
.edit-hex:focus-visible { outline: 2px solid ${k.secondary}; outline-offset: -2px; }

.edit-sides { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; }
.edit-sides > * { min-width: 0; }

.edit-linked {
  width: 24px; height: 24px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; color: ${k.tertiary};
  cursor: pointer;
}
.edit-linked[data-on] { background: ${X(4)}; color: ${k.primary}; }
.edit-linked:focus-visible { outline: 2px solid ${k.secondary}; outline-offset: -2px; }

.edit-revert {
  width: 22px; height: 22px;
  display: none; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; color: ${k.tertiary};
  cursor: pointer;
}
.edit-row[data-touched] .edit-revert { display: grid; }
.edit-revert:hover { color: ${k.primary}; }
.edit-revert:focus-visible { outline: 2px solid ${k.secondary}; outline-offset: -2px; }

.edit-more {
  width: 100%; margin-top: ${N.tight}px;
  padding: 6px; border: 0; border-radius: 0;
  background: none; color: ${k.tertiary};
  font: inherit; font-size: ${M.tag}px; cursor: pointer;
  text-align: left;
}
.edit-more:hover { color: ${k.primary}; }

.edit-foot {
  flex: none;
  display: flex; align-items: center; gap: ${N.base}px;
  padding: ${N.base}px;
  border-top: 1px solid ${re};
}
.edit-count { flex: 1; color: ${k.tertiary}; font-size: ${M.tag}px; }
.edit-action {
  padding: 7px 10px; border: 0; border-radius: 0;
  background: ${X(3)}; color: ${k.primary};
  font: inherit; font-size: ${M.tag}px; font-weight: ${Y.medium};
  cursor: pointer;
  transition: background ${H.ui};
}
.edit-action:hover { background: ${X(5)}; }
.edit-action:disabled { color: ${k.disabled}; cursor: default; background: ${X(1)}; }
.edit-action:focus-visible { outline: 2px solid ${k.secondary}; outline-offset: -2px; }

.edit-empty {
  padding: ${N.roomy}px;
  color: ${k.tertiary};
}
`;function Qn(e,t){let o=document.createElement("style");o.textContent=Lr,e.appendChild(o);let n=document.createElement("div");n.className="edit-dock";let r=document.createElement("div");r.className="edit-head";let i=document.createElement("span");i.className="edit-title",i.textContent="Edit";let a=document.createElement("span");a.className="edit-subject",r.append(i,a);let l=document.createElement("div");l.className="edit-body";let c=document.createElement("div");c.className="edit-foot";let b=document.createElement("span");b.className="edit-count";let w=document.createElement("button");w.type="button",w.className="edit-action",w.textContent="Copy as prompt";let S=document.createElement("button");S.type="button",S.className="edit-action",S.textContent="Revert all",c.append(b,S,w),n.append(r,l,c),e.appendChild(n);let u=null,h=!1,x=!1,C=[],A=new Set;function g(){let s=t.changes().length;b.textContent=s===0?"No changes":`${s} change${s===1?"":"s"}`,w.disabled=s===0,S.disabled=s===0}function E(){if(u){for(let s of C){let d=(s.spec.sides??[s.spec.prop]).some(v=>t.touched(u,v));s.el.toggleAttribute("data-touched",d)}g()}}function L(s,m){u&&(t.set(u,s,m),E())}function G(s,m,d){let v=Vn(e,{label:d,value:u?Jn(Se(u,m)):0,min:s.min??0,max:s.max??100,step:s.step??1,...s.unit?{unit:s.unit}:{},onChange:y=>{let f=`${y}${s.unit??""}`;if(s.sides&&A.has(s.prop)){for(let $ of s.sides)L($,f);for(let $ of C)if($.spec.prop===s.prop)for(let P of $.sliders)P.set(y)}else L(m,f)}});return{el:v.el,slider:v,sync:()=>{u&&v.set(Jn(Se(u,m)))}}}function j(s){let m=document.createElement("div");m.className="edit-choice";let d=[];for(let y of s.options??[]){let f=document.createElement("button");f.type="button",f.className="edit-opt",f.textContent=y,f.addEventListener("click",()=>{L(s.prop,y),v()}),d.push(f),m.appendChild(f)}function v(){let y=u?Se(u,s.prop):"";for(let f of d)f.toggleAttribute("data-on",f.textContent===y)}return{el:m,sync:v}}function ee(s){let m=document.createElement("div");m.className="edit-field";let d=document.createElement("input");d.type="color",d.className="edit-swatch",d.setAttribute("aria-label",`${s.label} colour`);let v=document.createElement("input");v.type="text",v.className="edit-hex",v.spellcheck=!1,v.setAttribute("aria-label",`${s.label} colour, as hex`),d.addEventListener("input",()=>{v.value=d.value,L(s.prop,d.value)}),v.addEventListener("change",()=>{let f=v.value.trim();if(!/^#?[0-9a-f]{3}$|^#?[0-9a-f]{6}$/i.test(f)){y();return}let $=f.startsWith("#")?f:`#${f}`;d.value=$.length===4?`#${$[1]}${$[1]}${$[2]}${$[2]}${$[3]}${$[3]}`:$,L(s.prop,d.value)});function y(){let f=u?Se(u,s.prop):"",$=Mr(f);d.value=$,v.value=$}return m.append(d,v),{el:m,sync:y}}function V(s){let m=document.createElement("div");m.className="edit-row";let d=document.createElement("div");d.className="edit-line";let v=document.createElement("span");v.className="edit-label",v.textContent=s.label;let y=document.createElement("div");y.className="edit-field";let f=[],$=[];if(s.sides){let z=document.createElement("div");z.className="edit-sides",z.style.flex="1";for(let ae of s.sides){let se=ae.split("-").filter(K=>K!=="border"&&K!=="radius"&&K!=="width").pop()??ae,he=G(s,ae,se);f.push(he.slider),$.push(he.sync),z.appendChild(he.el)}let Q=document.createElement("button");Q.type="button",Q.className="edit-linked",Q.setAttribute("aria-label",`Link all four ${s.label.toLowerCase()} values`),Q.title="Change all four together",Q.appendChild(Ne("copy",13)),Q.addEventListener("click",()=>{A.has(s.prop)?A.delete(s.prop):A.add(s.prop),Q.toggleAttribute("data-on",A.has(s.prop))}),y.append(z,Q)}else if(s.kind==="choice"){let z=j(s);$.push(z.sync),y.appendChild(z.el)}else if(s.kind==="colour"){let z=ee(s);$.push(z.sync),z.el.style.flex="1",y.appendChild(z.el)}else{let z=G(s,s.prop,s.label);f.push(z.slider),$.push(z.sync),z.el.style.flex="1",y.appendChild(z.el)}let P=document.createElement("button");return P.type="button",P.className="edit-revert",P.setAttribute("aria-label",`Revert ${s.label.toLowerCase()}`),P.title="Put this back",P.appendChild(Ne("undo",13)),P.addEventListener("click",()=>{if(u){for(let z of s.sides??[s.prop])t.revert(u,z);for(let z of $)z();E()}}),!s.sides&&(s.kind==="choice"||s.kind==="colour")&&d.appendChild(v),d.append(y,P),m.appendChild(d),{spec:s,el:m,sliders:f,sync:()=>{for(let z of $)z()}}}function O(){for(let m of C)for(let d of m.sliders)d.destroy();if(C.length=0,l.textContent="",!u){let m=document.createElement("p");m.className="edit-empty",m.textContent="Click an element to lock it, then change it here.",l.appendChild(m),g();return}for(let m of Tr){let d=m.specs.filter($=>x||!$.more);if(d.length===0)continue;let v=document.createElement("section");v.className="edit-group";let y=document.createElement("span");y.className="edit-group-name",y.textContent=m.name;let f=document.createElement("div");f.className="edit-rows";for(let $ of d){let P=V($);C.push(P),f.appendChild(P.el)}v.append(y,f),l.appendChild(v)}let s=document.createElement("button");s.type="button",s.className="edit-more",s.textContent=x?"Fewer properties":"More properties",s.addEventListener("click",()=>{x=!x,O()}),l.appendChild(s);for(let m of C)m.sync();E()}S.addEventListener("click",()=>{t.revertAll();for(let s of C)s.sync();E()}),w.addEventListener("click",()=>{let s=t.asPrompt();s&&navigator.clipboard?.writeText(s).catch(()=>{})});function F(){n.toggleAttribute("data-open",h)}return{show(s){u=s,a.textContent=s?s.tagName.toLowerCase()+(s.id?`#${s.id}`:""):"",O()},setArmed(s){h=s,F(),s&&O()},refresh(){for(let s of C)s.sync();E()},asText(){return t.asPrompt()},destroy(){for(let s of C)for(let m of s.sliders)m.destroy();C.length=0,n.remove(),o.remove()}}}var bt=5,Wt=4,at=12,Zn=.22,_e=10,Nr=50,Rr=100;function eo(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,hidden:!1,grid:null,pixels:!1,guides:[],liveGuide:null,activeGuide:null},i=Pt(Dt()),a=0,l=null;function c(){let s=Dt();s!==l&&(l=s,i=Pt(s),e.style.colorScheme=s?"dark":"light",F())}c();let b=matchMedia("(prefers-color-scheme: dark)"),w=()=>c();b.addEventListener("change",w);let S=new MutationObserver(()=>c());function u(){S.disconnect(),S.observe(document.documentElement,{attributes:!0}),document.body&&S.observe(document.body,{attributes:!0})}u(),Dn(()=>F());function h(){let s=devicePixelRatio;o.width=Math.round(innerWidth*s),o.height=Math.round(innerHeight*s),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(s,0,0,s,0,0),n.translate(.5,.5)}let x=s=>Math.round(s)-.5;function C(s,m){n.strokeStyle=m,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(s.left),Math.round(s.top),Math.round(s.width),Math.round(s.height))}function A(s){n.strokeStyle=ze(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let m of[s.left,s.right])n.moveTo(Math.round(m),0),n.lineTo(Math.round(m),innerHeight);for(let m of[s.top,s.bottom])n.moveTo(0,Math.round(m)),n.lineTo(innerWidth,Math.round(m));n.stroke(),n.setLineDash([])}function g(s){if(n.strokeStyle=s.extension?ze(i.measure,.55):i.measure,n.lineWidth=1,n.setLineDash(s.extension?[3,3]:[]),n.beginPath(),n.moveTo(Math.round(s.x1),Math.round(s.y1)),n.lineTo(Math.round(s.x2),Math.round(s.y2)),s.extension){n.stroke();return}if(s.axis==="x")for(let m of[s.x1,s.x2])n.moveTo(Math.round(m),Math.round(s.y1)-bt),n.lineTo(Math.round(m),Math.round(s.y1)+bt);else for(let m of[s.y1,s.y2])n.moveTo(Math.round(s.x1)-bt,Math.round(m)),n.lineTo(Math.round(s.x1)+bt,Math.round(m));n.stroke()}function E(s){return n.font=`${Y.medium} ${M.body}px ${M.stack}`,{w:n.measureText(s).width+Wt*2,h:M.body+Wt*2+2}}function L(s,m,d,v){n.font=`${Y.medium} ${M.body}px ${M.stack}`,n.textBaseline="middle";let{w:y,h:f}=E(s),$=x(Math.min(Math.max(m,at),innerWidth-y-at)),P=x(Math.min(Math.max(d,at),innerHeight-f-at));n.fillStyle=v,n.beginPath(),n.roundRect($,P,Math.ceil(y),f,4),n.fill(),n.fillStyle=i.surface,n.fillText(s,$+Wt,P+f/2)}function G(s,m,d,v,y=!1){let{w:f,h:$}=E(s);L(s,y?m-f/2:m,y?d-$/2:d,v)}function j(){let s=scrollX,m=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,I),n.fillRect(-.5,-.5,I,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${Y.regular} 9px ${M.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let f of r.pinned)n.fillRect(x(f.left),-.5,Math.round(f.width),I),n.fillRect(-.5,x(f.top),I,Math.round(f.height));n.restore(),n.beginPath(),n.moveTo(-.5,I-.5),n.lineTo(innerWidth,I-.5),n.moveTo(I-.5,-.5),n.lineTo(I-.5,innerHeight),n.stroke();let d=f=>f%Rr===0?I:f%Nr===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let v=Math.floor(s/_e)*_e;for(let f=v;f<s+innerWidth;f+=_e){let $=Math.round(f-s);if($<I)continue;let P=d(f);n.moveTo($,I-P),n.lineTo($,I),P===I&&(n.fillStyle=i.muted,n.fillText(String(f),$+3,3))}n.stroke(),n.beginPath();let y=Math.floor(m/_e)*_e;for(let f=y;f<m+innerHeight;f+=_e){let $=Math.round(f-m);if($<I)continue;let P=d(f);n.moveTo(I-P,$),n.lineTo(I,$),P===I&&(n.save(),n.translate(3,$-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(f),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),I),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo(I,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let f of r.guides){let $=Math.round(nt(f));f.axis==="x"?n.fillRect($-1,-.5,2,I):n.fillRect(-.5,$-1,I,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,I,I),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,I,I)}function ee(){let s=An(10,1);if(s){n.strokeStyle=i.pixelLine,n.lineWidth=1,n.setLineDash([]),n.beginPath();for(let m=0;m<=innerWidth;m+=s)n.moveTo(m,0),n.lineTo(m,innerHeight);for(let m=0;m<=innerHeight;m+=s)n.moveTo(0,m),n.lineTo(innerWidth,m);n.stroke()}}function V(s){let m=Mn(s,document.documentElement.clientWidth);n.fillStyle=ze(i.measure,.08);for(let d of m)n.fillRect(x(d.left),-.5,Math.round(d.width),innerHeight+1)}function O(){if(a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore(),r.hidden)return;(r.pixels||r.grid)&&(n.save(),r.rulers&&(n.beginPath(),n.rect(I,I,innerWidth,innerHeight),n.clip()),r.pixels&&ee(),r.grid&&V(r.grid),n.restore());for(let d of r.pinned)C(d,i.accent);r.hover&&(A(r.hover),C(r.hover,r.pinned.length?ze(i.accent,.7):i.accent));for(let d of r.guides){let v=r.liveGuide?.id===d.id;n.strokeStyle=d.locked||v?i.guide:ze(i.guide,.55),n.lineWidth=d.pinned?2:1,n.setLineDash(d.locked?[]:[4,4]),n.beginPath();let y=Math.round(nt(d));if(d.axis==="x"?(n.moveTo(y,0),n.lineTo(y,innerHeight)):(n.moveTo(0,y),n.lineTo(innerWidth,y)),n.stroke(),r.activeGuide===d.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let f=7;d.axis==="x"?(n.moveTo(y,0),n.lineTo(y,f),n.moveTo(y,innerHeight-f),n.lineTo(y,innerHeight)):(n.moveTo(0,y),n.lineTo(f,y),n.moveTo(innerWidth-f,y),n.lineTo(innerWidth,y)),n.stroke()}}for(let d of r.lines)n.globalAlpha=d.faded?Zn:1,g(d);n.globalAlpha=1;let s=r.lines.filter(d=>d.label!==""),m=s.map(d=>{let v=(d.x1+d.x2)/2,y=(d.y1+d.y2)/2,{w:f,h:$}=E(d.label);return d.axis==="x"?{x:v-f/2,y:y-16-$/2,w:f,h:$,axis:d.axis}:{x:v+26-f/2,y:y-$/2,w:f,h:$,axis:d.axis}});if(Tn(m,{w:innerWidth,h:innerHeight},at).forEach((d,v)=>{let y=s[v];n.globalAlpha=y.faded?Zn:1,L(y.label,d.x,d.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:d,height:v,scale:y}=r.hover;G(`${_(d/y.x)} \xD7 ${_(v/y.y)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let d=r.liveGuide,v=Math.round(nt(d));G([`${d.axis} ${_(d.at)}`,d.caught,d.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),d.axis==="x"?v+6:30,d.axis==="x"?30:v+6,i.guide)}r.rulers&&j()}function F(){a||(a=requestAnimationFrame(O))}return h(),{root:t,update(s){Object.assign(r,s),F()},resize(){h(),F()},destroy(){a&&cancelAnimationFrame(a),b.removeEventListener("change",w),S.disconnect(),e.remove()}}}function Gr(e){let t=e.trim().replace(/^#/,""),o=t.length===3?t.split("").map(n=>n+n).join(""):t;return/^[0-9a-f]{6}$/i.test(o)?{r:parseInt(o.slice(0,2),16),g:parseInt(o.slice(2,4),16),b:parseInt(o.slice(4,6),16)}:null}function Pr({r:e,g:t,b:o}){let n=r=>Math.round(r).toString(16).padStart(2,"0");return`#${n(e)}${n(t)}${n(o)}`}function Dr({r:e,g:t,b:o}){return`rgb(${Math.round(e)} ${Math.round(t)} ${Math.round(o)})`}function Re(e,t){return String(Number(e.toFixed(t)))}function Br({r:e,g:t,b:o}){let n=e/255,r=t/255,i=o/255,a=Math.max(n,r,i),l=Math.min(n,r,i),c=(a+l)/2,b=a-l,w=0,S=0;return b!==0&&(S=b/(1-Math.abs(2*c-1)),a===n?w=(r-i)/b%6:a===r?w=(i-n)/b+2:w=(n-r)/b+4,w*=60,w<0&&(w+=360)),`hsl(${Re(w,1)} ${Re(S*100,1)}% ${Re(c*100,1)}%)`}function _t(e){let t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4}function Or(e){let t=_t(e.r),o=_t(e.g),n=_t(e.b),r=.4122214708*t+.5363325363*o+.0514459929*n,i=.2119034982*t+.6806995451*o+.1073969566*n,a=.0883024619*t+.2817188376*o+.6299787005*n,l=Math.cbrt(r),c=Math.cbrt(i),b=Math.cbrt(a),w=.2104542553*l+.793617785*c-.0040720468*b,S=1.9779984951*l-2.428592205*c+.4505937099*b,u=.0259040371*l+.7827717662*c-.808675766*b,h=Math.sqrt(S*S+u*u),x=Math.atan2(u,S)*180/Math.PI;return x<0&&(x+=360),h<1e-4?`oklch(${Re(w,4)} 0 0)`:`oklch(${Re(w,4)} ${Re(h,4)} ${Re(x,2)})`}function to(e){let t=Gr(e);return t?[{label:"hex",value:Pr(t)},{label:"rgb",value:Dr(t)},{label:"hsl",value:Br(t)},{label:"oklch",value:Or(t)}]:[]}var Ir=`
.picker {
  /* Under the badge, from the badge's own numbers. */
  position: fixed; top: ${de+rt+it}px; right: ${de}px;
  width: min(200px, calc(100vw - ${de*2+N.base*2}px));
  padding: ${N.base}px; border-radius: 0;
  user-select: none;
  font-family: ${M.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${M.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${k.primary};
  background: ${le};
  box-shadow: ${we};
  /*
   * It comes from the button that opened it. The card is parked directly under
   * the toolbar and the colour button is at its right end, so an origin in the
   * top right corner is that button \u2014 the card grows out of the control you
   * pressed rather than arriving from nowhere.
   *
   * Visibility rather than display, which cannot be transitioned; delayed out
   * by the duration on close so the fade finishes before it stops existing.
   * The same treatment the key list gets, because it is the same shape.
   */
  opacity: 0; visibility: hidden; pointer-events: none;
  transform: scale(0.98) translateY(-4px);
  transform-origin: top right;
  transition: opacity ${H.ui}, transform ${H.ui}, visibility 0s linear 160ms;
}
.picker[data-open] {
  opacity: 1; visibility: visible; pointer-events: auto;
  transform: none;
  transition: opacity ${H.ui}, transform ${H.ui}, visibility 0s;
}
@media (prefers-reduced-motion: reduce) {
  /* The fade says it arrived; the travel and the scale are decoration. */
  .picker { transform: none; transition: opacity 120ms linear, visibility 0s linear 120ms; }
  .picker[data-open] { transition: opacity 120ms linear, visibility 0s; }
}
.picker .swatch {
  height: 40px; margin-bottom: 8px;
  border: 1px solid ${re};
}
/* Each row copies itself, so the whole row is the target rather than the text. */
.picker button {
  display: grid; grid-template-columns: 34px 1fr;
  gap: 8px; align-items: baseline;
  width: 100%; padding: 3px 4px; margin: 0;
  border: 0; background: none; cursor: pointer;
  font: inherit; text-align: left;
  color: ${k.primary};
}
.picker button:hover { background: ${X(2)}; }
.picker button:focus-visible { outline: 1px solid ${k.primary}; outline-offset: -1px; }
.picker .k { color: ${k.secondary}; }
.picker .v { overflow-wrap: anywhere; }
.picker .hint {
  margin-top: 6px; padding-top: 6px;
  border-top: 1px solid ${re};
  color: ${k.secondary};
}
`;function no(e){let t=document.createElement("style");t.textContent=Ir,e.appendChild(t);let o=document.createElement("div");o.className="picker",e.appendChild(o);let n=document.createElement("div");n.className="swatch";let r=document.createElement("div");r.className="hint";function i(a){n.style.background=a;let l=to(a).map(({label:c,value:b})=>{let w=document.createElement("button");w.type="button";let S=document.createElement("span");S.className="k",S.textContent=c;let u=document.createElement("span");return u.className="v",u.textContent=b,w.append(S,u),w.addEventListener("click",h=>{h.stopPropagation(),navigator.clipboard?.writeText(b).then(()=>{r.textContent=`copied ${c}`},()=>{r.textContent="clipboard refused"})}),w});r.textContent="click a row to copy",o.replaceChildren(n,...l,r),o.setAttribute("data-open","")}return{async open(){let a=window.EyeDropper;if(!a){o.replaceChildren(Object.assign(document.createElement("div"),{className:"hint",textContent:"this browser has no eyedropper"})),o.setAttribute("data-open","");return}try{let{sRGBHex:l}=await new a().open();i(l)}catch{}},close(){let a=o.hasAttribute("data-open");return o.removeAttribute("data-open"),a},destroy(){o.remove(),t.remove()}}}var Xt="__align_freeze",Hr=`
[data-align-frozen] *:not([data-align-ignore]):not([data-align-ignore] *) {
  animation-play-state: paused !important;
}
`,Kt=!1,xt=[],yt=[];function oo(e){let t=e;for(;t;){if(t instanceof Element&&t.hasAttribute("data-align-ignore"))return!0;let o=t.getRootNode();if(t=o instanceof ShadowRoot?o.host:t.parentNode??null,t===document)return!1}return!1}function wt(){return Kt}function Yt(e){if(e!==Kt){if(Kt=e,!e){document.documentElement.removeAttribute("data-align-frozen"),document.getElementById(Xt)?.remove();for(let t of xt)try{t.play()}catch{}for(let t of yt)t.play().catch(()=>{});xt=[],yt=[];return}if(!document.getElementById(Xt)){let t=document.createElement("style");t.id=Xt,t.textContent=Hr,t.setAttribute("data-align-ignore",""),document.head.appendChild(t)}document.documentElement.setAttribute("data-align-frozen",""),xt=[];try{for(let t of document.getAnimations()){if(t.playState!=="running")continue;let o=t.effect?.target??null;oo(o)||(t.pause(),xt.push(t))}}catch{}yt=[];for(let t of Array.from(document.querySelectorAll("video")))t.paused||oo(t)||(t.pause(),yt.push(t))}}var jt="__align_xray",Fr=`
[data-align-xray] * { outline: 1px solid rgb(128 128 128 / 0.55) !important; }
[data-align-xray] [data-align-ignore],
[data-align-xray] [data-align-ignore] * { outline: none !important; }
`;function Ut(e){let t=document.documentElement;if(!e){t.removeAttribute("data-align-xray"),document.getElementById(jt)?.remove();return}if(!document.getElementById(jt)){let o=document.createElement("style");o.id=jt,o.textContent=Fr,o.setAttribute("data-align-ignore",""),document.head.appendChild(o)}t.setAttribute("data-align-xray","")}var Vt="align-ui";function ro(e){try{return localStorage.getItem(e)}catch{return null}}function io(e,t){try{localStorage.setItem(e,t)}catch{}}function ao(e){let t="/";try{t=location.pathname||"/"}catch{}return`${Vt}:${e}::${t}`}function zr(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function so(){let e=ro(ao("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(zr).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function lo(e){io(ao("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function vt(e){return ro(`${Vt}:${e}`)==="1"}function kt(e,t){io(`${Vt}:${e}`,t?"1":"0")}var ne,W=null,ie=null,be=null,qe=null,Te=null,Ge=qn(),De=!1,Ye=vt("grid"),je=vt("pixels"),J=null,B=[],Et=0,Be=vt("rulers"),U=[],bo=1,co=!1,xe=null,Xe=!1,Pe=In();function Wr(){return U.map(e=>({...e}))}function Ue(e=""){Pe.push(Wr(),e)}function uo(){return U.find(e=>e.id===xe)??null}function Ce(e){U=e,lo(U)}var Z=null,me=null,ue=null,_r=3,Ke=22;function xo(e,t){return Be?t<Ke&&e>=Ke?"y":e<Ke&&t>=Ke?"x":null:null}function Jt(e){return e.ctrlKey||e.metaKey}function yo(e,t,o,n){let r=Ae(t,o,ne),i=e.axis==="x"?t:o,a=U.filter(c=>c.id!==e.id).map(c=>({axis:c.axis,at:st(c).pos})),l=En(i,Sn(r,e.axis,a),n);e.at=l.at+(e.axis==="x"?scrollX:scrollY),e.caught=l.what}function wo(e,t,o,n){let r={id:bo++,axis:e,at:0,locked:!1,caught:"",pinned:!1};yo(r,t,o,n);let i=U.find(a=>a.axis===r.axis&&Math.abs(a.at-r.at)<.5);return i?(xe=i.id,i):(Ue(),Ce([...U,r]),xe=r.id,r)}function vo(e){e.pinned||(Ue(),Ce(U.filter(t=>t.id!==e.id)),me?.id===e.id&&(me=null),Z?.id===e.id&&(Z=null))}function Xr(e){let t=ne.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function st(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function Qt(){return B.length>=2?B[B.length-2]:void 0}function Zt(){if(B.length<2)return[];let e=[];for(let[t,o]of Mt(B))for(let n of ht(t,o)){if(n.extension||!n.label)continue;let r=dn(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:un(r)})}return e}function oe(e){let t=B[B.length-1],o=J&&B.some(u=>u.el===J.el),n=U.map(st),r=!Z&&me?me:null,i=U.filter(u=>u.locked||u.id===r?.id),a=!r&&o?J.el:null,l=r??a,c=r?st(r):null,b=[],w=(u,h)=>{for(let x of u)b.push(l&&!h?{...x,faded:!0}:x)},S=u=>!c||u.axis!==c.axis?!1:(u.axis==="x"?[u.x1,u.x2]:[u.y1,u.y2]).some(x=>Math.abs(x-c.pos)<.5);for(let[u,h]of Mt(B))w(ht(u,h),u.el===a||h.el===a);t&&J&&!o&&!r&&w(ht(t,J),!0);for(let u of i)for(let h of B)w(Lt(h,[st(u)]),u.id===r?.id||h.el===a);J&&!o&&!r&&U.length&&w(Lt(J,n),!0);for(let u of Cn(i.map(st),{x:innerWidth/2,y:innerHeight/2}))w([u],S(u));W?.update({hover:J,pinned:B,rulers:Be,hidden:Xe,grid:Ye&&ne.grid?ne.grid:null,pixels:je,guides:U,liveGuide:Z??me,activeGuide:xe,lines:b,...e?{cursor:e}:{}}),be?.update(B.length,{edit:Ge.armed,rulers:Be,xray:De,grid:Ye,pixels:je,freeze:wt(),type:ie?.showsType()??!1,hide:Xe,canCopy:B.length>0,canUndo:Pe.depth()>0,panel:ie?.isOpen()??!1})}function Kr(){let e=ie?.asText()??"";if(!e)return;let t=n=>be?.acknowledge("copy",n),o=navigator.clipboard?.writeText(e);o?o.then(()=>t(!0),()=>t(!1)):t(!1)}function Yr(e,t){return e.length===t.length&&e.every((o,n)=>{let r=t[n];return o.id===r.id&&o.axis===r.axis&&o.at===r.at&&o.locked===r.locked&&o.pinned===r.pinned})}function jr(){for(;Pe.depth()>0&&Yr(Pe.peek(),U);)Pe.pop();let e=Pe.pop();e&&(Ce(e),me=null,Z=null,ue=null,e.some(t=>t.id===xe)||(xe=null))}function ce(e){switch(e){case"rulers":Be=!Be,kt("rulers",Be);break;case"xray":De=!De,Ut(De);break;case"grid":Ye=!Ye,kt("grid",Ye);break;case"pixels":je=!je,kt("pixels",je);break;case"freeze":Yt(!wt());break;case"type":ie?.toggleType();break;case"panel":ie?.toggle();break;case"hide":Xe=!Xe,ie?.setHidden(Xe),Xe&&qe?.close();break;case"copy":Kr();break;case"pick":qe?.open();break;case"edit":if(Ge.armed){let t=Ge.disarm();be?.acknowledge("edit",t>=0)}else Ge.arm();Te?.setArmed(Ge.armed),B.length&&oe();break;case"undo":jr();break}oe()}var $t=null;function ko(e){if($t={x:e.clientX,y:e.clientY},Z){ue&&Math.hypot(e.clientX-ue.x,e.clientY-ue.y)>_r&&(ue=null),!ue&&!Z.pinned&&(yo(Z,e.clientX,e.clientY,Jt(e)),Ce([...U])),oe({x:e.clientX,y:e.clientY});return}me=At(U,e.clientX,e.clientY),J=Ae(e.clientX,e.clientY,ne),oe({x:e.clientX,y:e.clientY})}function $o(e){Z&&(ue?(Z.locked=!Z.locked,xe=Z.id,Ce([...U])):(xo(e.clientX,e.clientY)||e.clientX<Ke||e.clientY<Ke)&&vo(Z),ue=null,Z=null,oe({x:e.clientX,y:e.clientY}))}function Eo(e){if(e.button!==0)return;let t=Ae(e.clientX,e.clientY,ne);if(!t)return;let o=xo(e.clientX,e.clientY);if(o){Ve(e),ue=null,Z=wo(o,e.clientX,e.clientY,Jt(e)),oe({x:e.clientX,y:e.clientY});return}let n=At(U,e.clientX,e.clientY);if(n){Ve(e),Ue(),xe=n.id,Z=n,ue={x:e.clientX,y:e.clientY},oe({x:e.clientX,y:e.clientY});return}Ve(e),be?.closeHelp(),B=[t],J=t,ie?.show(t,Zt(),Qt()),Te?.show(t.el),oe({x:e.clientX,y:e.clientY})}function So(e){let t=Ae(e.clientX,e.clientY,ne);if(!t)return;Ve(e),be?.closeHelp();let o=B.findIndex(r=>r.el===t.el);B=o>=0?B.filter((r,i)=>i!==o):[...B,t],J=t;let n=B[B.length-1];n?ie?.show(n,Zt(),Qt()):ie?.hide(),Te?.show(n?.el??null),oe({x:e.clientX,y:e.clientY})}function Co(e){Ae(e.clientX,e.clientY,ne)&&Ve(e)}function To(e){Ae(e.clientX,e.clientY,ne)&&Ve(e)}function Ve(e){e.preventDefault(),e.stopPropagation()}function po(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var mo=0,ho=0;function Mo(){Et=requestAnimationFrame(Mo);let t=B.filter(l=>l.el.isConnected).map(l=>mt(l.el)),o=J&&J.el.isConnected?mt(J.el):null;if(!(scrollX!==mo||scrollY!==ho||t.length!==B.length||t.some((l,c)=>!po(l,B[c]))||J===null!=(o===null)||J!==null&&o!==null&&!po(J,o)))return;mo=scrollX,ho=scrollY,B=t,J=o;let i=B[B.length-1],a=Ur();a!==fo&&(fo=a,i?ie?.show(i,Zt(),Qt()):ie?.hide(),Te?.show(i?.el??null)),oe()}var fo="";function Ur(){let e=B[0];return e?B.map(t=>[t.label,Math.round(t.width*100),Math.round(t.height*100),Math.round((t.left-e.left)*100),Math.round((t.top-e.top)*100)].join(",")).join(";"):""}function Ao(){W?.resize()}function Vr(){co||(co=!0,U=so().map(e=>({...e,id:bo++}))),!W&&(Gn(),W=eo(),ie=On(W.root),be=Hn(W.root,ce),Te=Qn(W.root,Ge),qe=no(W.root),be.update(0,{rulers:Be,xray:De,grid:Ye,pixels:je,freeze:wt(),type:!1,panel:!1,hide:!1,edit:!1,canCopy:!1,canUndo:!1}),addEventListener("mousemove",ko),addEventListener("mousedown",Eo,{capture:!0}),addEventListener("mouseup",$o,{capture:!0}),addEventListener("click",Co,{capture:!0}),addEventListener("auxclick",To,{capture:!0}),addEventListener("contextmenu",So,{capture:!0}),addEventListener("resize",Ao),Et=requestAnimationFrame(Mo),oe())}function qt(){removeEventListener("mousemove",ko),removeEventListener("mousedown",Eo,{capture:!0}),removeEventListener("mouseup",$o,{capture:!0}),removeEventListener("click",Co,{capture:!0}),removeEventListener("auxclick",To,{capture:!0}),removeEventListener("contextmenu",So,{capture:!0}),removeEventListener("resize",Ao),cancelAnimationFrame(Et),Et=0,be?.destroy(),Te?.destroy(),Te=null,qe?.destroy(),qe=null,De&&(De=!1,Ut(!1)),Yt(!1),Ge.disarm(),be=null,ie?.destroy(),ie=null,W?.destroy(),W=null,Pn(),J=null,B=[],Z=null,ue=null,me=null}function qr(e){let t=e.composedPath?.()[0]??e.target;return!t||typeof t!="object"||!("tagName"in t)?!1:t.isContentEditable?!0:t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT"}function go(e){if(Xr(e))e.preventDefault(),W?qt():Vr();else if(!qr(e)){if(W&&$t&&(e.key.toLowerCase()===ne.guideKeys.vertical||e.key.toLowerCase()===ne.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===ne.guideKeys.vertical?"x":"y";wo(t,$t.x,$t.y,Jt(e)),oe()}else if(W&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(U.some(t=>!t.pinned)&&Ue(),Ce(U.filter(t=>t.pinned)),me=null,Z=null,ue=null,U.some(t=>t.id===xe)||(xe=null)):me&&vo(me),oe();else if(W&&e.key.startsWith("Arrow")){let t=uo(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;Ue(`nudge:${t.id}`);let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",Ce([...U]),oe()}else if(W&&e.key.toLowerCase()==="g"){e.preventDefault(),ce("grid");return}else if(W&&e.key.toLowerCase()==="k"){e.preventDefault(),ce("pixels");return}else if(W&&e.key==="\\"){e.preventDefault(),ce("hide");return}else if(W&&e.key.toLowerCase()==="e"){e.preventDefault(),ce("edit");return}else if(W&&e.key.toLowerCase()==="f"){e.preventDefault(),ce("freeze");return}else if(W&&e.key.toLowerCase()==="x"){e.preventDefault(),ce("xray");return}else if(W&&e.key.toLowerCase()==="p"){e.preventDefault(),ce("pick");return}else if(W&&e.key.toLowerCase()==="t"){e.preventDefault(),ce("type");return}else if(W&&e.key.toLowerCase()==="c"){e.preventDefault(),ce("copy");return}else if(W&&e.key.toLowerCase()==="l"){let t=uo();if(!t)return;e.preventDefault(),Ue(),t.pinned=!t.pinned,Ce([...U]),oe()}else if(W&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){if(Pe.depth()===0)return;e.preventDefault(),ce("undo");return}else if(W&&e.key.toLowerCase()===ne.rulerKey){e.preventDefault(),ce("rulers");return}else if(W&&e.key.toLowerCase()===ne.panelKey){e.preventDefault(),ce("panel");return}else if(e.key==="Escape"&&W){if(qe?.close()||be?.closeHelp())return;B.length?(B=[],ie?.hide(),Te?.show(null),oe()):qt()}}}function Yi(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,ne=wn(e),Bn(ne.theme),addEventListener("keydown",go,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{qt(),removeEventListener("keydown",go,{capture:!0}),delete window.__align})}export{Yi as initAlign};
