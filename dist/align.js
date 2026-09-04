function _(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function ro(e){return(e.split(",")[0]??"").trim().replace(/^['"]|['"]$/g,"")}function io(e){let o={100:"thin",200:"extralight",300:"light",400:"regular",500:"medium",600:"semibold",700:"bold",800:"extrabold",900:"black"}[e.trim()];return o?`${e} ${o}`:e}function Ye(e){let t=getComputedStyle(e);return[{label:"family",value:ro(t.fontFamily),px:NaN},{label:"size",value:t.fontSize,px:_(t.fontSize)},{label:"weight",value:io(t.fontWeight),px:NaN},{label:"line",value:t.lineHeight,px:_(t.lineHeight)},{label:"tracking",value:t.letterSpacing,px:_(t.letterSpacing)}]}function jt(e){let t="";for(let o of e.childNodes)o.nodeType===3&&(t+=o.nodeValue??"");return t.trim().replace(/\s+/g," ")}function Ut(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:_(r)})}return o}function ao(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function so(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function Vt(e,t){if(t.length===0)return"";let o=[],n=0;for(let i of so(e)){let a=ao(i,t);a.length?o.push(`${lo(i)} ${a.join(" ")}`):n+=1}if(o.length===0)return n===1?"its one number is not on the scale":`none of its ${n} numbers are on the scale`;let r=n===0?"":n===1?"  \xB7  1 more, not on the scale":`  \xB7  ${n} more, not on the scale`;return o.join("  \xB7  ")+r}function lo(e){return String(Math.round(e*100)/100)}function Ft(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(_)}function qt(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),s=a.display.includes("flex")||a.display.includes("grid"),c=n==="x"?a.columnGap:a.rowGap,f=s&&c!=="normal"?_(c):null,[g,E,p,d]=Ft(e),[m,k,M,u]=Ft(t),b=z=>Number.isFinite(z)?z:0,L=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,B=n==="x"?L?b(E)+b(u):b(k)+b(d):L?b(p)+b(m):b(M)+b(g);return{px:o,cssGap:f,margins:B,siblings:!0}}function Jt(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function Qt(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}function lt(e){let t=e.trim().toLowerCase();return t?t.startsWith("#")||/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(t)?!0:["black","white","transparent","currentcolor"].includes(t):!1}var ce;function zt(e){if(ce===void 0&&(ce=document.createElement("canvas").getContext("2d")),!ce)return"";ce.fillStyle="#000000",ce.fillStyle=e;let t=ce.fillStyle;return ce.fillStyle="#ffffff",ce.fillStyle=e,t===ce.fillStyle?String(t):""}function Zt(e,t){let o=zt(e);return o?t.filter(n=>lt(n.value)&&zt(n.value)===o).map(n=>n.name).sort():[]}function en(e){let t=getComputedStyle(e),o=[],n=(r,i)=>{let a=i.trim();!a||a==="transparent"||/rgba?\([^)]*,\s*0\s*\)$/.test(a)||o.push({label:r,value:a})};return n("text",t.color),n("background",t.backgroundColor),o}function co(e,t,o){let n=r=>typeof CSS<"u"&&CSS.escape?CSS.escape(r):r.replace(/[^\w-]/g,"\\$&");return t?`#${n(t)}`:o.length?e+o.map(r=>`.${n(r)}`).join(""):e}function ct(e){let t=typeof e.className=="string"?e.className.trim().split(/\s+/).filter(Boolean):[];return co(e.tagName.toLowerCase(),e.id,t)}function tn(e){let t=ct(e);if(!/[.#]/.test(t))return 0;try{return document.querySelectorAll(t).length}catch{return 0}}function uo(e){if(!e)return"inline <style>";let t=e.split("?")[0]??e;try{let o=new URL(t,"http://x").pathname;return decodeURI(o).replace(/^\//,"")||t}catch{return t}}var po=["width","height","padding","margin","border-width","gap","font-size","line-height","letter-spacing","color","background-color"];function ho(e){for(let t=0;t<e.length;t+=1){let o=e.item(t);if(po.some(n=>o===n||o.startsWith(`${n}-`)))return!0}return!1}function nn(e){let t=[],o=new Set,n=(r,i)=>{for(let a of Array.from(r)){if(a instanceof CSSMediaRule){matchMedia(a.conditionText).matches&&n(a.cssRules,i);continue}if(a instanceof CSSSupportsRule){CSS.supports(a.conditionText)&&n(a.cssRules,i);continue}let s=a.cssRules;if(s&&!(a instanceof CSSStyleRule)){n(s,i);continue}if(!(a instanceof CSSStyleRule))continue;let c=!1;try{c=e.matches(a.selectorText)}catch{continue}if(!c||!ho(a.style))continue;let f=`${a.selectorText}|${i}`;o.has(f)||(o.add(f),t.push({selector:a.selectorText,file:i}))}};for(let r of Array.from(document.styleSheets)){if(r.ownerNode instanceof Element&&r.ownerNode.hasAttribute("data-align-ignore"))continue;let i;try{i=r.cssRules}catch{continue}n(i,uo(r.href))}return t.reverse()}function Wt(e){if(!e||e==="none")return[];let t=e.trim().split(/\s+/),o=[];for(let n of t){if(!n.endsWith("px"))return[];let r=Number.parseFloat(n);if(!Number.isFinite(r))return[];o.push(r)}return o}function Xt(e,t,o){let n=0;for(let r=0;r<e.length;r+=1){let i=n+e[r];if(o<i+.5)return r;n=i+t}return-1}function fo(e,t){let o=t==="rtl";return e.startsWith("vertical")||e.startsWith("sideways")?{inline:"y",inlineReversed:e==="sideways-lr"?!o:o,blockReversed:e==="vertical-rl"||e==="sideways-rl"}:{inline:"x",inlineReversed:o,blockReversed:!1}}function Yt(e,t,o,n,r){return r?t-n:o-e}function on(e){let t=e.parentElement,o=0;for(;t&&getComputedStyle(t).display==="contents";)t=t.parentElement,o+=1;if(!t)return null;let n=getComputedStyle(t),r=getComputedStyle(e),i=n.display,a=[];if(o>0&&a.push({label:"through",value:o===1?"a display: contents parent":`${o} display: contents parents`}),r.position==="absolute"||r.position==="fixed")return a.push({label:"placed by",value:`${r.position}, not by the parent`}),{display:i,rows:a};if(r.float!=="none")return a.push({label:"placed by",value:`float: ${r.float}`}),{display:i,rows:a};let s=i.includes("flex"),c=i.includes("grid");if(!s&&!c)return a.push({label:"flow",value:i}),{display:i,rows:a};let f=Kt(n.rowGap==="normal"?"0px":n.rowGap),g=Kt(n.columnGap==="normal"?"0px":n.columnGap),E=f===g?f:`row ${f} \xB7 column ${g}`;if(s){let D=n.flexDirection;a.push({label:"direction",value:n.flexWrap==="nowrap"?D:`${D} \xB7 ${n.flexWrap}`}),a.push({label:"justify",value:n.justifyContent}),a.push({label:"align",value:n.alignItems}),a.push({label:"gap",value:E});let l=`${r.flexGrow} ${r.flexShrink} ${r.flexBasis}`;return l!=="0 1 auto"&&a.push({label:"this child",value:`flex: ${l}`}),r.alignSelf!=="auto"&&a.push({label:"align-self",value:r.alignSelf}),{display:i,rows:a}}let p=Wt(n.gridTemplateColumns),d=Wt(n.gridTemplateRows);p.length&&a.push({label:"columns",value:`${p.length} \xB7 ${p.map(st).join(" ")}`}),d.length&&a.push({label:"rows",value:`${d.length} \xB7 ${d.map(st).join(" ")}`}),a.push({label:"gap",value:E});let m=t.getBoundingClientRect(),k=e.getBoundingClientRect(),M={left:m.left+_(n.borderLeftWidth)+_(n.paddingLeft),right:m.right-_(n.borderRightWidth)-_(n.paddingRight),top:m.top+_(n.borderTopWidth)+_(n.paddingTop),bottom:m.bottom-_(n.borderBottomWidth)-_(n.paddingBottom)},u=fo(n.writingMode,n.direction),b=(D,l)=>D==="x"?Yt(M.left,M.right,k.left,k.right,l):Yt(M.top,M.bottom,k.top,k.bottom,l),L=u.inline==="x"?"y":"x",B=_(n.columnGap==="normal"?"0":n.columnGap),z=_(n.rowGap==="normal"?"0":n.rowGap),Q=Xt(p,B,b(u.inline,u.inlineReversed)),U=Xt(d,z,b(L,u.blockReversed)),K=[];return Q>=0&&K.push(`column ${Q+1} of ${p.length}`),U>=0&&K.push(`row ${U+1} of ${d.length}`),K.length&&a.push({label:"this child",value:K.join(" \xB7 ")}),{display:i,rows:a}}function Kt(e){return e.endsWith("px")?st(Number.parseFloat(e)):e}function st(e){return String(Math.round(e*100)/100)}var rn=["display","position","width","height","padding","margin","border-width","border-style","border-radius","font-family","font-size","font-weight","font-style","line-height","letter-spacing","text-transform","text-align","color","background-color","border-color","opacity","flex-direction","justify-content","align-items","gap","flex-grow","flex-shrink","flex-basis","align-self","box-shadow","overflow","text-overflow","white-space"];function mo(e,t){let o=[];for(let n of rn){let r=e[n]??"",i=t[n]??"";r!==i&&o.push({prop:n,a:r,b:i})}return o}function _t(e){let t=getComputedStyle(e),o={};for(let n of rn)o[n]=t.getPropertyValue(n);return o}function an(e,t){return mo(_t(e),_t(t))}var go={ignore:"",grid:null,hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"},theme:"auto"};function ln(e={}){return{...go,...e}}var sn=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function cn(e){return e.ignore?`${sn}, ${e.ignore}`:sn}function R(e){return String(Math.round(e*100)/100)}function yo(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function je(e){let t=e.getBoundingClientRect();return{el:e,label:yo(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height,scale:Ve(e)}}function un(e,t){let o=(n,r)=>Math.abs(n-r)<.001;return o(e.scale.x,t.scale.x)&&o(e.scale.y,t.scale.y)?e.scale:{x:1,y:1}}function dn(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function ge(e,t,o){let n=cn(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=dn(r);return r&&r!==document.documentElement?je(r):null}var Ke=e=>parseFloat(e)||0;function ut(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[Ke(n),Ke(r),Ke(i),Ke(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function xo(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function bo(e,t){let o=un(e,t),n=t.left+t.width/2,r=t.top+t.height/2;return[{x1:e.left,y1:r,x2:t.left,y2:r,label:R((t.left-e.left)/o.x),axis:"x"},{x1:t.right,y1:r,x2:e.right,y2:r,label:R((e.right-t.right)/o.x),axis:"x"},{x1:n,y1:e.top,x2:n,y2:t.top,label:R((t.top-e.top)/o.y),axis:"y"},{x1:n,y1:t.bottom,x2:n,y2:e.bottom,label:R((e.bottom-t.bottom)/o.y),axis:"y"}]}function _e(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function Ue(e,t){let o=[],n=un(e,t),r=e.left<t.right&&t.left<e.right,i=e.top<t.bottom&&t.top<e.bottom;if(r&&i){let[a,s]=xo(e,t);return bo(a,s)}if(!r){let[a,s]=e.right<=t.left?[e,t]:[t,e],c=i?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:a.right,y1:c,x2:s.left,y2:c,label:`${R((s.left-a.right)/n.x)}`,axis:"x"}),o.push(..._e(a.right,a.top,a.bottom,c,"x")),o.push(..._e(s.left,s.top,s.bottom,c,"x"))}if(!i){let[a,s]=e.bottom<=t.top?[e,t]:[t,e],c=r?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:c,y1:a.bottom,x2:c,y2:s.top,label:`${R((s.top-a.bottom)/n.y)}`,axis:"y"}),o.push(..._e(a.bottom,a.left,a.right,c,"y")),o.push(..._e(s.top,s.left,s.right,c,"y"))}return o}function wo(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function dt(e){let t=wo(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var vo=5,ko=8;function De(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function pt(e,t,o){let n=null,r=vo;for(let i of e){let a=Math.abs(De(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function pn(e,t,o){if(o)return{at:e,what:""};let n=null,r=ko;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function hn(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function ht(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,s=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:s,y2:i,label:R(r.gap),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,s=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:s,label:R(r.gap),axis:"y"})}}return o}function fn(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],s=r[i],c=s-a;c<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:s,y2:t.y,label:R(c),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:s,label:R(c),axis:"y"}))}}return o}var pe=3;function $o(e,t){return e.x<t.x+t.w+pe&&t.x<e.x+e.w+pe&&e.y<t.y+t.h+pe&&t.y<e.y+e.h+pe}function mn(e,t,o=12){let n=(a,s)=>Math.min(Math.max(a,o),t.w-s-o),r=(a,s)=>Math.min(Math.max(a,o),t.h-s-o),i=[];for(let a of e){let s={...a,x:n(a.x,a.w),y:r(a.y,a.h)},c=!1;for(let f=0;f<16;f++){let g=i.find(p=>$o(p,s));if(!g)break;let E=s.axis==="x"?s.y:s.x;if(s.axis==="x"?s.y=r(c?g.y+g.h+pe:g.y-s.h-pe,s.h):s.x=n(c?g.x-s.w-pe:g.x+g.w+pe,s.w),(s.axis==="x"?s.y:s.x)===E){if(c)break;c=!0}}i.push(s)}return i}function gn(e,t){let{columns:o,gutter:n,margin:r}=e;if(o<=0)return[];let i=e.maxWidth>0?Math.min(e.maxWidth,t):t,a=Math.max(0,(t-i)/2),c=(Math.max(0,i-r*2)-n*(o-1))/o;if(c<=0)return[];let f=[];for(let g=0;g<o;g+=1)f.push({left:a+r+g*(c+n),width:c});return f}function yn(e,t){return e*t>=8?e:0}function So(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(s=>parseFloat(s)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function Ve(e){let t=1,o=1;for(let n=e;n;n=dn(n)){let r=So(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var re=(e,t)=>({light:e,dark:t}),ft={accent:re("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:re("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:re("oklch(1 0 0)","oklch(0.264 0 0)"),fg:re("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:re("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:re("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:re("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:re("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)"),pixelLine:re("oklch(0.205 0 0 / 0.14)","oklch(0.97 0 0 / 0.14)")};function bn(e){return`light-dark(${e.light}, ${e.dark})`}var ue=bn(re("#fafafa","#1a1a1a"));function Ee(e,t=e){return bn(re(`rgb(0 0 0 / ${t})`,`rgb(255 255 255 / ${e})`))}var xn=[0,.07,.08,.1,.12,.15,.2];function J(e){let t=xn[Math.max(0,Math.min(xn.length-1,e))];return t===0?ue:Ee(t)}var O={primary:Ee(.9),secondary:Ee(.6),tertiary:Ee(.46,.55),disabled:Ee(.22,.26)},he=Ee(.12),ye="0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)",wn="0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)",$=22,yt=36,P={tight:4,base:8,roomy:12,edge:16},H={exit:"160ms cubic-bezier(0.3, 0, 1, 1)",ui:"160ms cubic-bezier(0.2, 0, 0, 1)"},Eo='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',C={title:13,body:12,tag:11,stack:Eo},W={regular:400,medium:500,semibold:600},mt="__align_font",To="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function vn(){if(document.getElementById(mt))return;let e=document.createElement("link");e.id=mt,e.rel="stylesheet",e.href=To,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function kn(){document.getElementById(mt)?.remove()}function $n(e){let t=[`${W.medium} ${C.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function xt(e){let t={};for(let o of Object.keys(ft))t[o]=e?ft[o].dark:ft[o].light;return t}var gt=null;function Sn(e){gt=e==="auto"?null:e}function bt(){if(gt)return gt==="dark";let e=document.documentElement,t=getComputedStyle(e).colorScheme;if(/dark/.test(t)&&!/light/.test(t))return!0;if(/light/.test(t)&&!/dark/.test(t))return!1;for(let o of[document.body,e]){if(!o)continue;let n=Co(getComputedStyle(o).backgroundColor);if(n!==null)return n<.5}return matchMedia("(prefers-color-scheme: dark)").matches}function Co(e){let t=/^rgba?\(([^)]+)\)$/.exec(e.trim());if(!t)return null;let o=t[1].split(/[\s,/]+/).filter(Boolean).map(Number),[n,r,i,a=1]=o;return n===void 0||r===void 0||i===void 0||a<.5?null:(.2126*n+.7152*r+.0722*i)/255}function Te(e,t){return e.replace(/\)$/,` / ${t})`)}var Mo=`
`,ae=16,Lo=`
.dock {
  /* No color-scheme here: the overlay sets it inline on the shadow host, from
     what the page actually looks like rather than what the machine prefers, and
     it inherits down. Declaring 'light dark' again would undo that and hand
     light-dark() back to the media query. */
  position: fixed; left: ${ae}px; top: 0;
  /* Clamped to the window. A narrow viewport is not an edge case for this
     tool, it is the case it exists for: you make the window 375px wide
     precisely to check a mobile layout, and a readout that hangs off the
     screen there is useless exactly when you reached for it. */
  width: min(340px, calc(100vw - ${ae*2}px));
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none;
  /* Not the whole panel: only the header is a drag surface, and making the
     numbers unselectable means the one thing you might want to paste into a
     stylesheet cannot be picked up by hand. Copy covers the whole reading; a
     selection covers the one value you actually wanted. */
  user-select: none;
  font-family: ${C.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${O.primary};
  --muted: ${O.secondary};
  --border: ${he};
}
.panel {
  padding: 10px; border-radius: 0;
  /* Five sections now \u2014 box, tokens, styled by, matches, colour \u2014 and on a
     laptop that is taller than the window. place() clamps the position but
     cannot rescue a panel taller than the screen, so it scrolls instead. */
  max-height: calc(100vh - ${ae*2}px);
  overflow-y: auto; overscroll-behavior: contain;
  font-size: ${C.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${ue};

  box-shadow: ${ye};

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
  background: ${ue};
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] .panel { box-shadow: ${wn}; }
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${C.title}px; font-weight: ${W.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${C.body}px; font-weight: ${W.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${C.tag}px; font-weight: ${W.medium};
  margin-left: 4px;
  color: ${O.primary};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${C.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${J(1)}; }

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
  padding: ${P.base}px;
}
.region[data-level="1"] { background: ${J(1)}; }
.region[data-level="2"] { background: ${J(2)}; }
.region[data-level="3"] { background: ${J(3)}; }
.content { background: ${J(4)}; }

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
  font-size: ${C.tag}px; font-weight: ${W.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${W.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${W.regular}; }
.row { display: flex; align-items: center; gap: ${P.tight}px; margin: ${P.tight}px 0; }
.row > .edge { flex: 0 0 20px; }
.row > .fill { flex: 1 1 auto; min-width: 0; }

/* Type and tokens sit under the box, in the same muted register as the band
   labels \u2014 they annotate the measurement rather than competing with it. */
.readout {
  user-select: text;
  margin-top: ${P.base}px; padding-top: ${P.base}px;
  border-top: 1px solid var(--border);
}
.readout-tag { position: static; margin-bottom: ${P.tight}px; }
/* One grid for the whole section rather than one per row, so every key in a
   section shares a column and the column sizes to the longest key in it. A
   fixed 62px was right until a diff started printing 'background-color', which
   it broke across two lines mid-word. The 62px floor keeps the rhythm the
   other sections already had. */
.readout-rows {
  display: grid; grid-template-columns: minmax(62px, max-content) 1fr;
  gap: 0 ${P.base}px; align-items: baseline;
  font-size: ${C.tag}px; line-height: 1.5;
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
  font-size: ${C.body}px;
  /* Several of these wrap \u2014 a diff value, a rule file, a token list \u2014 and a
     lone short word on the last line reads as a mistake. */
  text-wrap: pretty;
}
.content {
  border-radius: 0; padding: ${P.roomy}px ${P.base}px;
  text-align: center; font-weight: ${W.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,Pe=ae,xe=-1,Ce=!1;function En(e){let t=document.createElement("style");t.textContent=Lo,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);let r=!1;function i(u,b){let L=document.createElement("div");L.className="readout";let B=document.createElement("div");B.className="tag readout-tag",B.textContent=u,L.appendChild(B);let z=document.createElement("div");z.className="readout-rows",L.appendChild(z);for(let[Q,U]of b){let K=document.createElement("div");K.className="readout-row";let D=document.createElement("span");D.className="readout-key",D.textContent=Q;let l=document.createElement("span");l.className="readout-value",l.textContent=U,K.append(D,l),z.appendChild(K)}return L}e.appendChild(o);let a=(u,b)=>Math.min(Math.max(u,ae),Math.max(ae,b-ae));function s(){let u=o.offsetHeight||300;xe<0&&(xe=Math.max(ae,innerHeight-u-ae)),Pe=a(Pe,innerWidth-o.offsetWidth),xe=a(xe,innerHeight-u),o.style.transform=`translate(${Pe-ae}px, ${xe}px)`}let c=null;function f(u){u.button===0&&(u.preventDefault(),u.stopPropagation(),c={x:u.clientX,y:u.clientY,dx:Pe,dy:xe},o.setAttribute("data-dragging",""),u.currentTarget.setPointerCapture(u.pointerId))}function g(u){c&&(Pe=c.dx+(u.clientX-c.x),xe=c.dy+(u.clientY-c.y),s())}function E(){c=null,o.removeAttribute("data-dragging")}addEventListener("resize",s);let p=null,d=[],m;function k(u){let b=document.createElement("div");return b.className="edge",b.textContent=u===0?"0":R(u),u===0&&b.setAttribute("data-zero",""),b}function M(u,b,L,B){let[z,Q,U,K]=L,D=document.createElement("div");D.className="region",D.setAttribute("data-level",String(b));let l=document.createElement("span");l.className="tag",l.textContent=u;let y=document.createElement("div");y.className="row";let h=document.createElement("div");h.className="fill",h.appendChild(B),y.append(k(K),h,k(Q));let A=document.createElement("div");return A.className="head",A.append(l,k(z)),D.append(A,y,k(U)),D}return{show(u,b=[],L){d=b,m=L;let B=ut(u.el),[z,Q,U,K]=B.border,[D,l,y,h]=B.padding,A=Ve(u.el),w=u.width/A.x,x=u.height/A.y,G=Math.abs(A.x-1)>.001||Math.abs(A.y-1)>.001,Y=document.createElement("header"),it=document.createElement("span");it.className="name",it.textContent=u.label;let at=document.createElement("span");at.className="size",at.textContent=`${R(w)} \xD7 ${R(x)}`;let $e=document.createElement("button");if($e.className="close",$e.textContent="\xD7",$e.title="close (B brings it back)",$e.addEventListener("pointerdown",T=>T.stopPropagation()),$e.addEventListener("click",T=>{T.stopPropagation(),Ce=!0,o.removeAttribute("data-open")}),Y.append(it,at),G){let T=document.createElement("span");T.className="scale",T.textContent=`\xD7${R(A.x)}`,T.title=`renders at ${R(u.width)} \xD7 ${R(u.height)}`,Y.appendChild(T)}Y.appendChild($e),Y.addEventListener("pointerdown",f),Y.addEventListener("pointermove",g),Y.addEventListener("pointerup",E),Y.addEventListener("pointercancel",E);let Oe=document.createElement("div");Oe.className="content",Oe.textContent=`${R(w-K-Q-h-l)} \xD7 ${R(x-z-U-D-y)}`,Oe.title=Oe.textContent;let le=[Y,M("margin",1,B.margin,M("border",2,B.border,M("padding",3,B.padding,Oe)))];if(r){let T=jt(u.el),Z=Ye(u.el);le.push(Z.length&&T?i("type",Z.map(ee=>[ee.label,ee.value])):i("type",[["","nothing of its own to set type on"]]))}if(L&&L.el!==u.el&&L.el.isConnected){let T=an(L.el,u.el).map(Se=>[Se.prop,`${Se.a||"\u2014"} \u2192 ${Se.b||"\u2014"}`]),Z=T.slice(0,10);T.length>Z.length&&Z.push(["",`and ${T.length-Z.length} more`]);let ee=L.label===u.label?"the one locked before":L.label;le.push(i(`differs from ${ee}`,Z.length?Z:[["","nothing in the properties it compares"]]))}let Xe=on(u.el);if(Xe&&Xe.rows.length&&le.push(i(`laid out by ${Xe.display}`,Xe.rows.map(T=>[T.label,T.value]))),b.length){let T=b.map(ee=>[R(ee.px),ee.detail]),Z=Qt(b.map(ee=>ee.px));Z&&T.push(["",Z]),le.push(i("gaps",T))}let It=Ut(u.el),Ot=Vt([w,x,...B.margin,...B.border,...B.padding,...r?Ye(u.el).map(T=>T.px):[]],It);Ot&&le.push(i("tokens",[["",Ot]]));let Dt=nn(u.el);Dt.length&&le.push(i("styled by",Dt.slice(0,4).map(T=>[T.selector,T.file])));let Pt=tn(u.el);Pt>1&&le.push(i("matches",[["",`${Pt} elements share ${ct(u.el)}`]]));let Ht=It.filter(T=>lt(T.value));if(Ht.length){let T=en(u.el).map(({label:Z,value:ee})=>{let Se=Zt(ee,Ht);return[Z,Se.length?`${ee}  ${Se.join(" ")}`:`${ee}  \u2014`]});T.length&&le.push(i("colour",T))}n.replaceChildren(...le),p=u,s(),!Ce&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},showsType:()=>r,isOpen:()=>!Ce&&p!==null,toggleType(){r=!r,p&&this.show(p,d,m)},asText(){if(!p)return"";let u=ut(p.el),b=Ve(p.el),L=p.width/b.x,B=p.height/b.y,z=U=>U.map(K=>R(K)).join(" "),Q=[`${p.label}  ${R(L)} \xD7 ${R(B)}`,`margin   ${z(u.margin)}`,`border   ${z(u.border)}`,`padding  ${z(u.padding)}`];if(r)for(let U of Ye(p.el))Q.push(`${U.label.padEnd(8)} ${U.value}`);return Q.join(Mo)},hide(){p=null,o.removeAttribute("data-open")},setHidden(u){o.toggleAttribute("data-away",u)},toggle(){p&&(Ce=!Ce,Ce?o.removeAttribute("data-open"):(s(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",s),o.remove(),t.remove()}}}function Tn(e=20,t=1e3){let o=[];return{push(n,r,i=Date.now()){let a=o[o.length-1];if(a&&r!==""&&a.tag===r&&i-a.at<=t){a.at=i;return}o.push({state:n,tag:r,at:i}),o.length>e&&o.shift()},pop(){return o.pop()?.state??null},peek(){return o[o.length-1]?.state??null},depth(){return o.length},clear(){o.length=0}}}var Ao="0 0 24 24";var v=e=>({path:e}),fe=(e,t,o,n,r)=>({rect:[e,t,o,n,r]}),Ro={rulers:[v("M2 8V4"),v("M22 8V4"),v("M22 6H2"),fe(2,12,20,8,2),v("M6 15v-3"),v("M10 15v-3"),v("M14 15v-3"),v("M18 15v-3")],xray:[v("M3 7V5a2 2 0 0 1 2-2h2"),v("M17 3h2a2 2 0 0 1 2 2v2"),v("M21 17v2a2 2 0 0 1-2 2h-2"),v("M7 21H5a2 2 0 0 1-2-2v-2")],grid:[fe(3,3,18,18,2),v("M9 3v18"),v("M15 3v18")],pixels:[fe(3,3,18,18,2),v("M3 9h18"),v("M3 15h18"),v("M9 3v18"),v("M15 3v18")],type:[v("M12 4v16"),v("M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"),v("M9 20h6")],panel:[fe(3,3,18,18,2),fe(8,8,8,8,1)],freeze:[fe(14,3,5,18,1),fe(5,3,5,18,1)],copy:[fe(8,8,14,14,2),v("M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2")],pick:[v("m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12"),v("m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z"),v("m2 22 .414-.414")],hide:[v("M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"),v("M14.084 14.158a3 3 0 0 1-4.242-4.242"),v("M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"),v("m2 2 20 20")],undo:[v("M9 14 4 9l5-5"),v("M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11")],check:[v("M20 6 9 17l-5-5")],cross:[v("M18 6 6 18"),v("m6 6 12 12")]},wt="http://www.w3.org/2000/svg";function qe(e,t=16){let o=document.createElementNS(wt,"svg");o.setAttribute("viewBox",Ao),o.setAttribute("width",String(t)),o.setAttribute("height",String(t)),o.setAttribute("fill","none"),o.setAttribute("stroke","currentColor"),o.setAttribute("stroke-width","2"),o.setAttribute("stroke-linecap","round"),o.setAttribute("stroke-linejoin","round"),o.setAttribute("aria-hidden","true");for(let n of Ro[e])if("rect"in n){let[r,i,a,s,c]=n.rect,f=document.createElementNS(wt,"rect");f.setAttribute("x",String(r)),f.setAttribute("y",String(i)),f.setAttribute("width",String(a)),f.setAttribute("height",String(s)),f.setAttribute("rx",String(c)),o.appendChild(f)}else{let r=document.createElementNS(wt,"path");r.setAttribute("d",n.path),o.appendChild(r)}return o}var No=[{title:"Pointing at things",rows:[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure whatever is under the cursor"],["Click","lock an element, so it keeps measuring after the pointer leaves"],["Right-click","add another to the locked set, or drop one from it. Two locked also gets you a diff"],["Drag the panel header","move the box model out of your way"],["Esc","clear the locks, then close the tool"]]},{title:"Guides",rows:[["Drag from a rule","pull out a guide; drag it back into the rule to throw it away"],["V  /  H","drop a vertical or horizontal guide at the cursor"],["Hover a guide","its distance to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the guide you last touched. Shift for 10px"],["L","pin a guide, so it cannot be moved or deleted by accident"],["Ctrl/Cmd while placing","ignore snapping"],["Del","remove the guide under the cursor. Shift+Del for all of them"]]}],te=P.edge,vt=24,Go=900,He=yt,Fe=P.base,Bo=`
.flag {
  position: fixed; top: ${te}px; right: ${te}px;
  display: flex; align-items: center; gap: 8px;
  transition: top ${H.ui};
  padding: ${(yt-vt)/2}px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${C.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${C.tag}px; font-weight: ${W.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${O.primary};
  background: ${ue};
  box-shadow: ${ye};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
/* No negative tracking: it is 11px, and tightening is what large text wants.
   Small text reads better at zero or a hair positive. */
.flag .name { letter-spacing: 0; }
/* The rulers draw a gutter along the top edge, and the badge sits in it. Step
   down out of the way rather than covering the ticks the rulers exist to show. */
.flag[data-rulers] { top: ${te+$}px; }
.help[data-rulers] { top: ${te+$+He+Fe}px; }
.flag:hover { background: ${J(1)}; }
.flag .count { color: ${O.secondary}; }

/* A layers bar, not a palette. Switches, then the one control that changes the
   page, then the things that happen once. */
.tools { display: flex; align-items: center; gap: 2px; }
.sep {
  width: 1px; align-self: stretch; margin: 0 4px;
  background: ${he};
}
.tool {
  width: ${vt}px; height: ${vt}px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; cursor: pointer;
  font: inherit; font-size: ${C.tag}px; font-weight: ${W.medium};
  color: ${O.tertiary};
}
/* Both glyphs occupy the same cell so one can cross-fade into the other; a
   swap would jump, and the point is to be noticed without being a movement. */
.tool > svg { grid-area: 1 / 1; transition: opacity ${H.ui}; }
.tool > .ack { opacity: 0; }
.tool[data-ack] > .ack { opacity: 1; }
.tool[data-ack] > .glyph { opacity: 0; }
.tool:hover { background: ${J(2)}; color: ${O.primary}; }
/* On the press, not on the release. Waiting for the click to acknowledge a
   button is the difference between a control that answers and one that lags,
   and it costs one rule. */
.tool:active { background: ${J(4)}; color: ${O.primary}; }
.tool:focus-visible { outline: 1px solid ${O.primary}; outline-offset: -1px; }
/* On is the film, not a colour: the three hues each already mean something on
   the canvas, and a fourth here would say nothing. */
.tool[data-on] { background: ${J(4)}; color: ${O.primary}; }

/* The badge steps down out of the ruler gutter, and that step is decoration:
   under reduced motion it should simply be in the right place. */
@media (prefers-reduced-motion: reduce) {
  .flag { transition: none; }
}
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: ${te+He+Fe}px; right: ${te}px;
  /* 368 plus two insets is 400, so this was the first thing to hang off the
     left edge of a phone-width window. */
  /* The padding is in the subtraction because these boxes are content-box:
     without it the clamp lets the panel sit flush against the far edge with
     no inset at all, which reads as broken rather than as tight. */
  width: min(368px, calc(100vw - ${te*2+P.base*2}px));
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${te*2+He+Fe}px); overflow-y: auto;
  padding: ${P.base}px; border-radius: 0;
  user-select: none;
  font-family: ${C.stack};
  font-synthesis: none;
  font-size: ${C.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${O.primary};
  background: ${ue};
  box-shadow: ${ye};
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
  align-items: baseline; gap: ${P.tight}px ${P.base}px; margin: 0;
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
  color: ${O.tertiary}; line-height: 0;
}
.help h4 {
  grid-column: 1 / -1; margin: 10px 0 2px;
  font-size: ${C.tag}px; font-weight: ${W.semibold};
  color: ${O.tertiary};
}
.help h4:first-child { margin-top: 0; }
.help kbd {
  display: inline-block; padding: 3px 5px;
  font: inherit; font-weight: ${W.medium};
  border: 1px solid ${he};
  background: ${J(2)};
}
/* These run to three lines, and a one-word last line reads as a mistake. */
.help dd { margin: 0; color: ${O.secondary}; text-wrap: pretty; }
`,kt=[{name:"rulers",label:"Rulers",key:"R",toggle:!0,what:"a scale down the top and left edges, in page pixels \u2014 and the gutters you drag guides out of"},{name:"xray",label:"X-ray",key:"X",toggle:!0,what:"outline every element at once, to see the boxes a layout is really made of"},{name:"grid",label:"Column grid",key:"G",toggle:!0,what:"the grid your design is built on, columns filled and gutters left empty. Needs one configured"},{name:"pixels",label:"Pixel grid",key:"K",toggle:!0,what:"a ten-pixel lattice over the page, to read an offset off without measuring it"},{name:"type",label:"Type",key:"T",toggle:!0,what:"add size, weight, line height and tracking to the panel, each checked against your scale"},{name:"panel",label:"Box model",key:"B",toggle:!0,what:"the readout itself \u2014 margins, borders, padding, what places the element, what styles it"},{name:"hide",label:"Hide",key:"\\",toggle:!0,what:"everything drawn, out of the way for a moment. Your locks, guides and layers all survive it"},{name:"freeze",label:"Freeze",key:"F",toggle:!0,what:"hold every animation and transition where it stands, so a moving thing can be measured"},{name:"copy",label:"Copy",key:"C",toggle:!1,what:"put everything in the panel on the clipboard as text"},{name:"pick",label:"Colour",key:"P",toggle:!1,what:"sample a colour from anywhere on screen and match it against your palette"},{name:"undo",label:"Undo",key:"Ctrl/Cmd + Z",toggle:!1,what:"step back through the guides \u2014 a whole run of nudges counts as one"}];function Cn(e,t){let o=document.createElement("style");o.textContent=Bo,e.appendChild(o);let n=document.createElement("div");n.className="flag";let r=document.createElement("span");r.className="name",r.textContent="Align";let i=document.createElement("span");i.className="count";let a=new Map,s=new Map,c=document.createElement("div");c.className="tools";for(let d of kt){if(d.name==="freeze"||d.name==="copy"){let M=document.createElement("span");M.className="sep",c.appendChild(M)}let m=document.createElement("button");m.type="button",m.className="tool";let k=qe(d.name);k.classList.add("glyph"),m.appendChild(k),m.setAttribute("aria-label",d.label),m.title=`${d.label}  \xB7  ${d.key}
${d.what}`,d.toggle||m.setAttribute("data-once",""),m.addEventListener("click",M=>{M.stopPropagation(),t(d.name)}),a.set(d.name,m),c.appendChild(m)}n.append(r,c,i);let f=document.createElement("div");f.className="help";let g=document.createElement("dl");function E(d){let m=document.createElement("h4");m.textContent=d,g.appendChild(m)}function p(d,m,k){let M=document.createElement("span");M.className="glyph",k&&M.appendChild(qe(k,14));let u=document.createElement("dt"),b=document.createElement("kbd");b.textContent=d,u.appendChild(b);let L=document.createElement("dd");L.textContent=m,g.append(M,u,L)}E("The bar, left to right");for(let d of kt)p(d.key,`${d.label} \u2014 ${d.what}`,d.name);for(let d of No){E(d.title);for(let[m,k]of d.rows)p(m,k)}return f.appendChild(g),n.addEventListener("click",d=>{d.stopPropagation(),f.toggleAttribute("data-open")}),e.append(n,f),{acknowledge(d,m){let k=a.get(d);if(!k)return;clearTimeout(s.get(d)),k.querySelector(".ack")?.remove();let M=qe(m?"check":"cross");M.classList.add("ack"),k.appendChild(M),requestAnimationFrame(()=>k.setAttribute("data-ack",m?"yes":"no")),s.set(d,setTimeout(()=>{k.removeAttribute("data-ack"),setTimeout(()=>k.querySelector(".ack")?.remove(),200)},Go))},update(d,m){i.textContent=d>0?`${d} locked`:"";let k=m.rulers&&!m.hide;n.toggleAttribute("data-rulers",k),f.toggleAttribute("data-rulers",k);for(let b of kt)b.toggle&&a.get(b.name)?.toggleAttribute("data-on",m[b.name]===!0);let M=a.get("copy");M&&(M.disabled=!m.canCopy);let u=a.get("undo");u&&(u.disabled=!m.canUndo)},closeHelp(){let d=f.hasAttribute("data-open");return f.removeAttribute("data-open"),d},destroy(){for(let d of s.values())clearTimeout(d);n.remove(),f.remove(),o.remove()}}}var Je=5,$t=4,ze=12,Mn=.22,Me=10,Io=50,Oo=100;function Ln(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,hidden:!1,grid:null,pixels:!1,guides:[],liveGuide:null,activeGuide:null},i=xt(bt()),a=0,s=null;function c(){let l=bt();l!==s&&(s=l,i=xt(l),e.style.colorScheme=l?"dark":"light",D())}c();let f=matchMedia("(prefers-color-scheme: dark)"),g=()=>c();f.addEventListener("change",g);let E=new MutationObserver(()=>c());function p(){E.disconnect(),E.observe(document.documentElement,{attributes:!0}),document.body&&E.observe(document.body,{attributes:!0})}p(),$n(()=>D());function d(){let l=devicePixelRatio;o.width=Math.round(innerWidth*l),o.height=Math.round(innerHeight*l),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(l,0,0,l,0,0),n.translate(.5,.5)}let m=l=>Math.round(l)-.5;function k(l,y){n.strokeStyle=y,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(l.left),Math.round(l.top),Math.round(l.width),Math.round(l.height))}function M(l){n.strokeStyle=Te(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let y of[l.left,l.right])n.moveTo(Math.round(y),0),n.lineTo(Math.round(y),innerHeight);for(let y of[l.top,l.bottom])n.moveTo(0,Math.round(y)),n.lineTo(innerWidth,Math.round(y));n.stroke(),n.setLineDash([])}function u(l){if(n.strokeStyle=l.extension?Te(i.measure,.55):i.measure,n.lineWidth=1,n.setLineDash(l.extension?[3,3]:[]),n.beginPath(),n.moveTo(Math.round(l.x1),Math.round(l.y1)),n.lineTo(Math.round(l.x2),Math.round(l.y2)),l.extension){n.stroke();return}if(l.axis==="x")for(let y of[l.x1,l.x2])n.moveTo(Math.round(y),Math.round(l.y1)-Je),n.lineTo(Math.round(y),Math.round(l.y1)+Je);else for(let y of[l.y1,l.y2])n.moveTo(Math.round(l.x1)-Je,Math.round(y)),n.lineTo(Math.round(l.x1)+Je,Math.round(y));n.stroke()}function b(l){return n.font=`${W.medium} ${C.body}px ${C.stack}`,{w:n.measureText(l).width+$t*2,h:C.body+$t*2+2}}function L(l,y,h,A){n.font=`${W.medium} ${C.body}px ${C.stack}`,n.textBaseline="middle";let{w,h:x}=b(l),G=m(Math.min(Math.max(y,ze),innerWidth-w-ze)),Y=m(Math.min(Math.max(h,ze),innerHeight-x-ze));n.fillStyle=A,n.beginPath(),n.roundRect(G,Y,Math.ceil(w),x,4),n.fill(),n.fillStyle=i.surface,n.fillText(l,G+$t,Y+x/2)}function B(l,y,h,A,w=!1){let{w:x,h:G}=b(l);L(l,w?y-x/2:y,w?h-G/2:h,A)}function z(){let l=scrollX,y=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,$),n.fillRect(-.5,-.5,$,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${W.regular} 9px ${C.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let x of r.pinned)n.fillRect(m(x.left),-.5,Math.round(x.width),$),n.fillRect(-.5,m(x.top),$,Math.round(x.height));n.restore(),n.beginPath(),n.moveTo(-.5,$-.5),n.lineTo(innerWidth,$-.5),n.moveTo($-.5,-.5),n.lineTo($-.5,innerHeight),n.stroke();let h=x=>x%Oo===0?$:x%Io===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let A=Math.floor(l/Me)*Me;for(let x=A;x<l+innerWidth;x+=Me){let G=Math.round(x-l);if(G<$)continue;let Y=h(x);n.moveTo(G,$-Y),n.lineTo(G,$),Y===$&&(n.fillStyle=i.muted,n.fillText(String(x),G+3,3))}n.stroke(),n.beginPath();let w=Math.floor(y/Me)*Me;for(let x=w;x<y+innerHeight;x+=Me){let G=Math.round(x-y);if(G<$)continue;let Y=h(x);n.moveTo($-Y,G),n.lineTo($,G),Y===$&&(n.save(),n.translate(3,G-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(x),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),$),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo($,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let x of r.guides){let G=Math.round(De(x));x.axis==="x"?n.fillRect(G-1,-.5,2,$):n.fillRect(-.5,G-1,$,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,$,$),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,$,$)}function Q(){let l=yn(10,1);if(l){n.strokeStyle=i.pixelLine,n.lineWidth=1,n.setLineDash([]),n.beginPath();for(let y=0;y<=innerWidth;y+=l)n.moveTo(y,0),n.lineTo(y,innerHeight);for(let y=0;y<=innerHeight;y+=l)n.moveTo(0,y),n.lineTo(innerWidth,y);n.stroke()}}function U(l){let y=gn(l,document.documentElement.clientWidth);n.fillStyle=Te(i.measure,.08);for(let h of y)n.fillRect(m(h.left),-.5,Math.round(h.width),innerHeight+1)}function K(){if(a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore(),r.hidden)return;(r.pixels||r.grid)&&(n.save(),r.rulers&&(n.beginPath(),n.rect($,$,innerWidth,innerHeight),n.clip()),r.pixels&&Q(),r.grid&&U(r.grid),n.restore());for(let h of r.pinned)k(h,i.accent);r.hover&&(M(r.hover),k(r.hover,r.pinned.length?Te(i.accent,.7):i.accent));for(let h of r.guides){let A=r.liveGuide?.id===h.id;n.strokeStyle=h.locked||A?i.guide:Te(i.guide,.55),n.lineWidth=h.pinned?2:1,n.setLineDash(h.locked?[]:[4,4]),n.beginPath();let w=Math.round(De(h));if(h.axis==="x"?(n.moveTo(w,0),n.lineTo(w,innerHeight)):(n.moveTo(0,w),n.lineTo(innerWidth,w)),n.stroke(),r.activeGuide===h.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let x=7;h.axis==="x"?(n.moveTo(w,0),n.lineTo(w,x),n.moveTo(w,innerHeight-x),n.lineTo(w,innerHeight)):(n.moveTo(0,w),n.lineTo(x,w),n.moveTo(innerWidth-x,w),n.lineTo(innerWidth,w)),n.stroke()}}for(let h of r.lines)n.globalAlpha=h.faded?Mn:1,u(h);n.globalAlpha=1;let l=r.lines.filter(h=>h.label!==""),y=l.map(h=>{let A=(h.x1+h.x2)/2,w=(h.y1+h.y2)/2,{w:x,h:G}=b(h.label);return h.axis==="x"?{x:A-x/2,y:w-16-G/2,w:x,h:G,axis:h.axis}:{x:A+26-x/2,y:w-G/2,w:x,h:G,axis:h.axis}});if(mn(y,{w:innerWidth,h:innerHeight},ze).forEach((h,A)=>{let w=l[A];n.globalAlpha=w.faded?Mn:1,L(w.label,h.x,h.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:h,height:A,scale:w}=r.hover;B(`${R(h/w.x)} \xD7 ${R(A/w.y)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let h=r.liveGuide,A=Math.round(De(h));B([`${h.axis} ${R(h.at)}`,h.caught,h.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),h.axis==="x"?A+6:30,h.axis==="x"?30:A+6,i.guide)}r.rulers&&z()}function D(){a||(a=requestAnimationFrame(K))}return d(),{root:t,update(l){Object.assign(r,l),D()},resize(){d(),D()},destroy(){a&&cancelAnimationFrame(a),f.removeEventListener("change",g),E.disconnect(),e.remove()}}}function Do(e){let t=e.trim().replace(/^#/,""),o=t.length===3?t.split("").map(n=>n+n).join(""):t;return/^[0-9a-f]{6}$/i.test(o)?{r:parseInt(o.slice(0,2),16),g:parseInt(o.slice(2,4),16),b:parseInt(o.slice(4,6),16)}:null}function Po({r:e,g:t,b:o}){let n=r=>Math.round(r).toString(16).padStart(2,"0");return`#${n(e)}${n(t)}${n(o)}`}function Ho({r:e,g:t,b:o}){return`rgb(${Math.round(e)} ${Math.round(t)} ${Math.round(o)})`}function be(e,t){return String(Number(e.toFixed(t)))}function Fo({r:e,g:t,b:o}){let n=e/255,r=t/255,i=o/255,a=Math.max(n,r,i),s=Math.min(n,r,i),c=(a+s)/2,f=a-s,g=0,E=0;return f!==0&&(E=f/(1-Math.abs(2*c-1)),a===n?g=(r-i)/f%6:a===r?g=(i-n)/f+2:g=(n-r)/f+4,g*=60,g<0&&(g+=360)),`hsl(${be(g,1)} ${be(E*100,1)}% ${be(c*100,1)}%)`}function St(e){let t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4}function zo(e){let t=St(e.r),o=St(e.g),n=St(e.b),r=.4122214708*t+.5363325363*o+.0514459929*n,i=.2119034982*t+.6806995451*o+.1073969566*n,a=.0883024619*t+.2817188376*o+.6299787005*n,s=Math.cbrt(r),c=Math.cbrt(i),f=Math.cbrt(a),g=.2104542553*s+.793617785*c-.0040720468*f,E=1.9779984951*s-2.428592205*c+.4505937099*f,p=.0259040371*s+.7827717662*c-.808675766*f,d=Math.sqrt(E*E+p*p),m=Math.atan2(p,E)*180/Math.PI;return m<0&&(m+=360),d<1e-4?`oklch(${be(g,4)} 0 0)`:`oklch(${be(g,4)} ${be(d,4)} ${be(m,2)})`}function An(e){let t=Do(e);return t?[{label:"hex",value:Po(t)},{label:"rgb",value:Ho(t)},{label:"hsl",value:Fo(t)},{label:"oklch",value:zo(t)}]:[]}var Wo=`
.picker {
  /* Under the badge, from the badge's own numbers. */
  position: fixed; top: ${te+He+Fe}px; right: ${te}px;
  width: min(200px, calc(100vw - ${te*2+P.base*2}px));
  padding: ${P.base}px; border-radius: 0;
  user-select: none;
  font-family: ${C.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${C.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${O.primary};
  background: ${ue};
  box-shadow: ${ye};
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
  border: 1px solid ${he};
}
/* Each row copies itself, so the whole row is the target rather than the text. */
.picker button {
  display: grid; grid-template-columns: 34px 1fr;
  gap: 8px; align-items: baseline;
  width: 100%; padding: 3px 4px; margin: 0;
  border: 0; background: none; cursor: pointer;
  font: inherit; text-align: left;
  color: ${O.primary};
}
.picker button:hover { background: ${J(2)}; }
.picker button:focus-visible { outline: 1px solid ${O.primary}; outline-offset: -1px; }
.picker .k { color: ${O.secondary}; }
.picker .v { overflow-wrap: anywhere; }
.picker .hint {
  margin-top: 6px; padding-top: 6px;
  border-top: 1px solid ${he};
  color: ${O.secondary};
}
`;function Rn(e){let t=document.createElement("style");t.textContent=Wo,e.appendChild(t);let o=document.createElement("div");o.className="picker",e.appendChild(o);let n=document.createElement("div");n.className="swatch";let r=document.createElement("div");r.className="hint";function i(a){n.style.background=a;let s=An(a).map(({label:c,value:f})=>{let g=document.createElement("button");g.type="button";let E=document.createElement("span");E.className="k",E.textContent=c;let p=document.createElement("span");return p.className="v",p.textContent=f,g.append(E,p),g.addEventListener("click",d=>{d.stopPropagation(),navigator.clipboard?.writeText(f).then(()=>{r.textContent=`copied ${c}`},()=>{r.textContent="clipboard refused"})}),g});r.textContent="click a row to copy",o.replaceChildren(n,...s,r),o.setAttribute("data-open","")}return{async open(){let a=window.EyeDropper;if(!a){o.replaceChildren(Object.assign(document.createElement("div"),{className:"hint",textContent:"this browser has no eyedropper"})),o.setAttribute("data-open","");return}try{let{sRGBHex:s}=await new a().open();i(s)}catch{}},close(){let a=o.hasAttribute("data-open");return o.removeAttribute("data-open"),a},destroy(){o.remove(),t.remove()}}}var Et="__align_freeze",Xo=`
[data-align-frozen] *:not([data-align-ignore]):not([data-align-ignore] *) {
  animation-play-state: paused !important;
}
`,Tt=!1,Qe=[],Ze=[];function Nn(e){let t=e;for(;t;){if(t instanceof Element&&t.hasAttribute("data-align-ignore"))return!0;let o=t.getRootNode();if(t=o instanceof ShadowRoot?o.host:t.parentNode??null,t===document)return!1}return!1}function et(){return Tt}function Ct(e){if(e!==Tt){if(Tt=e,!e){document.documentElement.removeAttribute("data-align-frozen"),document.getElementById(Et)?.remove();for(let t of Qe)try{t.play()}catch{}for(let t of Ze)t.play().catch(()=>{});Qe=[],Ze=[];return}if(!document.getElementById(Et)){let t=document.createElement("style");t.id=Et,t.textContent=Xo,t.setAttribute("data-align-ignore",""),document.head.appendChild(t)}document.documentElement.setAttribute("data-align-frozen",""),Qe=[];try{for(let t of document.getAnimations()){if(t.playState!=="running")continue;let o=t.effect?.target??null;Nn(o)||(t.pause(),Qe.push(t))}}catch{}Ze=[];for(let t of Array.from(document.querySelectorAll("video")))t.paused||Nn(t)||(t.pause(),Ze.push(t))}}var Mt="__align_xray",Yo=`
[data-align-xray] * { outline: 1px solid rgb(128 128 128 / 0.55) !important; }
[data-align-xray] [data-align-ignore],
[data-align-xray] [data-align-ignore] * { outline: none !important; }
`;function Lt(e){let t=document.documentElement;if(!e){t.removeAttribute("data-align-xray"),document.getElementById(Mt)?.remove();return}if(!document.getElementById(Mt)){let o=document.createElement("style");o.id=Mt,o.textContent=Yo,o.setAttribute("data-align-ignore",""),document.head.appendChild(o)}t.setAttribute("data-align-xray","")}var At="align-ui";function Gn(e){try{return localStorage.getItem(e)}catch{return null}}function Bn(e,t){try{localStorage.setItem(e,t)}catch{}}function In(e){let t="/";try{t=location.pathname||"/"}catch{}return`${At}:${e}::${t}`}function Ko(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function On(){let e=Gn(In("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(Ko).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function Dn(e){Bn(In("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function tt(e){return Gn(`${At}:${e}`)==="1"}function nt(e,t){Bn(`${At}:${e}`,t?"1":"0")}var j,N=null,q=null,de=null,Ie=null,ve=!1,Re=tt("grid"),Ne=tt("pixels"),F=null,S=[],rt=0,ke=tt("rulers"),I=[],Kn=1,Pn=!1,se=null,Le=!1,we=Tn();function _o(){return I.map(e=>({...e}))}function Ge(e=""){we.push(_o(),e)}function Hn(){return I.find(e=>e.id===se)??null}function me(e){I=e,Dn(I)}var X=null,ie=null,oe=null,jo=3,Ae=22;function _n(e,t){return ke?t<Ae&&e>=Ae?"y":e<Ae&&t>=Ae?"x":null:null}function Nt(e){return e.ctrlKey||e.metaKey}function jn(e,t,o,n){let r=ge(t,o,j),i=e.axis==="x"?t:o,a=I.filter(c=>c.id!==e.id).map(c=>({axis:c.axis,at:We(c).pos})),s=pn(i,hn(r,e.axis,a),n);e.at=s.at+(e.axis==="x"?scrollX:scrollY),e.caught=s.what}function Un(e,t,o,n){let r={id:Kn++,axis:e,at:0,locked:!1,caught:"",pinned:!1};jn(r,t,o,n);let i=I.find(a=>a.axis===r.axis&&Math.abs(a.at-r.at)<.5);return i?(se=i.id,i):(Ge(),me([...I,r]),se=r.id,r)}function Vn(e){e.pinned||(Ge(),me(I.filter(t=>t.id!==e.id)),ie?.id===e.id&&(ie=null),X?.id===e.id&&(X=null))}function Uo(e){let t=j.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function We(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function Gt(){return S.length>=2?S[S.length-2]:void 0}function Bt(){if(S.length<2)return[];let e=[];for(let[t,o]of dt(S))for(let n of Ue(t,o)){if(n.extension||!n.label)continue;let r=qt(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:Jt(r)})}return e}function V(e){let t=S[S.length-1],o=F&&S.some(p=>p.el===F.el),n=I.map(We),r=!X&&ie?ie:null,i=I.filter(p=>p.locked||p.id===r?.id),a=!r&&o?F.el:null,s=r??a,c=r?We(r):null,f=[],g=(p,d)=>{for(let m of p)f.push(s&&!d?{...m,faded:!0}:m)},E=p=>!c||p.axis!==c.axis?!1:(p.axis==="x"?[p.x1,p.x2]:[p.y1,p.y2]).some(m=>Math.abs(m-c.pos)<.5);for(let[p,d]of dt(S))g(Ue(p,d),p.el===a||d.el===a);t&&F&&!o&&!r&&g(Ue(t,F),!0);for(let p of i)for(let d of S)g(ht(d,[We(p)]),p.id===r?.id||d.el===a);F&&!o&&!r&&I.length&&g(ht(F,n),!0);for(let p of fn(i.map(We),{x:innerWidth/2,y:innerHeight/2}))g([p],E(p));N?.update({hover:F,pinned:S,rulers:ke,hidden:Le,grid:Re&&j.grid?j.grid:null,pixels:Ne,guides:I,liveGuide:X??ie,activeGuide:se,lines:f,...e?{cursor:e}:{}}),de?.update(S.length,{rulers:ke,xray:ve,grid:Re,pixels:Ne,freeze:et(),type:q?.showsType()??!1,hide:Le,canCopy:S.length>0,canUndo:we.depth()>0,panel:q?.isOpen()??!1})}function Vo(){let e=q?.asText()??"";if(!e)return;let t=n=>de?.acknowledge("copy",n),o=navigator.clipboard?.writeText(e);o?o.then(()=>t(!0),()=>t(!1)):t(!1)}function qo(e,t){return e.length===t.length&&e.every((o,n)=>{let r=t[n];return o.id===r.id&&o.axis===r.axis&&o.at===r.at&&o.locked===r.locked&&o.pinned===r.pinned})}function Jo(){for(;we.depth()>0&&qo(we.peek(),I);)we.pop();let e=we.pop();e&&(me(e),ie=null,X=null,oe=null,e.some(t=>t.id===se)||(se=null))}function ne(e){switch(e){case"rulers":ke=!ke,nt("rulers",ke);break;case"xray":ve=!ve,Lt(ve);break;case"grid":Re=!Re,nt("grid",Re);break;case"pixels":Ne=!Ne,nt("pixels",Ne);break;case"freeze":Ct(!et());break;case"type":q?.toggleType();break;case"panel":q?.toggle();break;case"hide":Le=!Le,q?.setHidden(Le),Le&&Ie?.close();break;case"copy":Vo();break;case"pick":Ie?.open();break;case"undo":Jo();break}V()}var ot=null;function qn(e){if(ot={x:e.clientX,y:e.clientY},X){oe&&Math.hypot(e.clientX-oe.x,e.clientY-oe.y)>jo&&(oe=null),!oe&&!X.pinned&&(jn(X,e.clientX,e.clientY,Nt(e)),me([...I])),V({x:e.clientX,y:e.clientY});return}ie=pt(I,e.clientX,e.clientY),F=ge(e.clientX,e.clientY,j),V({x:e.clientX,y:e.clientY})}function Jn(e){X&&(oe?(X.locked=!X.locked,se=X.id,me([...I])):(_n(e.clientX,e.clientY)||e.clientX<Ae||e.clientY<Ae)&&Vn(X),oe=null,X=null,V({x:e.clientX,y:e.clientY}))}function Qn(e){if(e.button!==0)return;let t=ge(e.clientX,e.clientY,j);if(!t)return;let o=_n(e.clientX,e.clientY);if(o){Be(e),oe=null,X=Un(o,e.clientX,e.clientY,Nt(e)),V({x:e.clientX,y:e.clientY});return}let n=pt(I,e.clientX,e.clientY);if(n){Be(e),Ge(),se=n.id,X=n,oe={x:e.clientX,y:e.clientY},V({x:e.clientX,y:e.clientY});return}Be(e),de?.closeHelp(),S=[t],F=t,q?.show(t,Bt(),Gt()),V({x:e.clientX,y:e.clientY})}function Zn(e){let t=ge(e.clientX,e.clientY,j);if(!t)return;Be(e),de?.closeHelp();let o=S.findIndex(r=>r.el===t.el);S=o>=0?S.filter((r,i)=>i!==o):[...S,t],F=t;let n=S[S.length-1];n?q?.show(n,Bt(),Gt()):q?.hide(),V({x:e.clientX,y:e.clientY})}function eo(e){ge(e.clientX,e.clientY,j)&&Be(e)}function to(e){ge(e.clientX,e.clientY,j)&&Be(e)}function Be(e){e.preventDefault(),e.stopPropagation()}function Fn(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var zn=0,Wn=0;function no(){rt=requestAnimationFrame(no);let t=S.filter(s=>s.el.isConnected).map(s=>je(s.el)),o=F&&F.el.isConnected?je(F.el):null;if(!(scrollX!==zn||scrollY!==Wn||t.length!==S.length||t.some((s,c)=>!Fn(s,S[c]))||F===null!=(o===null)||F!==null&&o!==null&&!Fn(F,o)))return;zn=scrollX,Wn=scrollY,S=t,F=o;let i=S[S.length-1],a=Qo();a!==Xn&&(Xn=a,i?q?.show(i,Bt(),Gt()):q?.hide()),V()}var Xn="";function Qo(){let e=S[0];return e?S.map(t=>[t.label,Math.round(t.width*100),Math.round(t.height*100),Math.round((t.left-e.left)*100),Math.round((t.top-e.top)*100)].join(",")).join(";"):""}function oo(){N?.resize()}function Zo(){Pn||(Pn=!0,I=On().map(e=>({...e,id:Kn++}))),!N&&(vn(),N=Ln(),q=En(N.root),de=Cn(N.root,ne),Ie=Rn(N.root),de.update(0,{rulers:ke,xray:ve,grid:Re,pixels:Ne,freeze:et(),type:!1,panel:!1,hide:!1,canCopy:!1,canUndo:!1}),addEventListener("mousemove",qn),addEventListener("mousedown",Qn,{capture:!0}),addEventListener("mouseup",Jn,{capture:!0}),addEventListener("click",eo,{capture:!0}),addEventListener("auxclick",to,{capture:!0}),addEventListener("contextmenu",Zn,{capture:!0}),addEventListener("resize",oo),rt=requestAnimationFrame(no),V())}function Rt(){removeEventListener("mousemove",qn),removeEventListener("mousedown",Qn,{capture:!0}),removeEventListener("mouseup",Jn,{capture:!0}),removeEventListener("click",eo,{capture:!0}),removeEventListener("auxclick",to,{capture:!0}),removeEventListener("contextmenu",Zn,{capture:!0}),removeEventListener("resize",oo),cancelAnimationFrame(rt),rt=0,de?.destroy(),Ie?.destroy(),Ie=null,ve&&(ve=!1,Lt(!1)),Ct(!1),de=null,q?.destroy(),q=null,N?.destroy(),N=null,kn(),F=null,S=[],X=null,oe=null,ie=null}function er(e){let t=e.composedPath?.()[0]??e.target;return!t||typeof t!="object"||!("tagName"in t)?!1:t.isContentEditable?!0:t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT"}function Yn(e){if(Uo(e))e.preventDefault(),N?Rt():Zo();else if(!er(e)){if(N&&ot&&(e.key.toLowerCase()===j.guideKeys.vertical||e.key.toLowerCase()===j.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===j.guideKeys.vertical?"x":"y";Un(t,ot.x,ot.y,Nt(e)),V()}else if(N&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(I.some(t=>!t.pinned)&&Ge(),me(I.filter(t=>t.pinned)),ie=null,X=null,oe=null,I.some(t=>t.id===se)||(se=null)):ie&&Vn(ie),V();else if(N&&e.key.startsWith("Arrow")){let t=Hn(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;Ge(`nudge:${t.id}`);let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",me([...I]),V()}else if(N&&e.key.toLowerCase()==="g"){e.preventDefault(),ne("grid");return}else if(N&&e.key.toLowerCase()==="k"){e.preventDefault(),ne("pixels");return}else if(N&&e.key==="\\"){e.preventDefault(),ne("hide");return}else if(N&&e.key.toLowerCase()==="f"){e.preventDefault(),ne("freeze");return}else if(N&&e.key.toLowerCase()==="x"){e.preventDefault(),ne("xray");return}else if(N&&e.key.toLowerCase()==="p"){e.preventDefault(),ne("pick");return}else if(N&&e.key.toLowerCase()==="t"){e.preventDefault(),ne("type");return}else if(N&&e.key.toLowerCase()==="c"){e.preventDefault(),ne("copy");return}else if(N&&e.key.toLowerCase()==="l"){let t=Hn();if(!t)return;e.preventDefault(),Ge(),t.pinned=!t.pinned,me([...I]),V()}else if(N&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){if(we.depth()===0)return;e.preventDefault(),ne("undo");return}else if(N&&e.key.toLowerCase()===j.rulerKey){e.preventDefault(),ne("rulers");return}else if(N&&e.key.toLowerCase()===j.panelKey){e.preventDefault(),ne("panel");return}else if(e.key==="Escape"&&N){if(Ie?.close()||de?.closeHelp())return;S.length?(S=[],q?.hide(),V()):Rt()}}}function Pr(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,j=ln(e),Sn(j.theme),addEventListener("keydown",Yn,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{Rt(),removeEventListener("keydown",Yn,{capture:!0}),delete window.__align})}export{Pr as initAlign};
