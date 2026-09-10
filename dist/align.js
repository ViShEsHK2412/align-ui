function ue(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function Wo(e){return(e.split(",")[0]??"").trim().replace(/^['"]|['"]$/g,"")}function _o(e){let o={100:"thin",200:"extralight",300:"light",400:"regular",500:"medium",600:"semibold",700:"bold",800:"extrabold",900:"black"}[e.trim()];return o?`${e} ${o}`:e}function lt(e){let t=getComputedStyle(e);return[{label:"family",value:Wo(t.fontFamily),px:NaN},{label:"size",value:t.fontSize,px:ue(t.fontSize)},{label:"weight",value:_o(t.fontWeight),px:NaN},{label:"line",value:t.lineHeight,px:ue(t.lineHeight)},{label:"tracking",value:t.letterSpacing,px:ue(t.letterSpacing)}]}function hn(e){let t="";for(let o of e.childNodes)o.nodeType===3&&(t+=o.nodeValue??"");return t.trim().replace(/\s+/g," ")}function ct(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:ue(r)})}return o}function At(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function Xo(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function mn(e,t){if(t.length===0)return"";let o=[],n=0;for(let i of Xo(e)){let a=At(i,t);a.length?o.push(`${Yo(i)} ${a.join(" ")}`):n+=1}if(o.length===0)return n===1?"its one number is not on the scale":`none of its ${n} numbers are on the scale`;let r=n===0?"":n===1?"  \xB7  1 more, not on the scale":`  \xB7  ${n} more, not on the scale`;return o.join("  \xB7  ")+r}function Yo(e){return String(Math.round(e*100)/100)}function an(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(ue)}function fn(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),l=a.display.includes("flex")||a.display.includes("grid"),d=n==="x"?a.columnGap:a.rowGap,v=l&&d!=="normal"?ue(d):null,[k,S,u,b]=an(e),[$,y,G,c]=an(t),x=ee=>Number.isFinite(ee)?ee:0,L=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,Y=n==="x"?L?x(S)+x(c):x(y)+x(b):L?x(u)+x($):x(G)+x(k);return{px:o,cssGap:v,margins:Y,siblings:!0}}function gn(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function bn(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}function et(e){let t=e.trim().toLowerCase();return t?t.startsWith("#")||/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(t)?!0:["black","white","transparent","currentcolor"].includes(t):!1}var Ae;function sn(e){if(Ae===void 0&&(Ae=document.createElement("canvas").getContext("2d")),!Ae)return"";Ae.fillStyle="#000000",Ae.fillStyle=e;let t=Ae.fillStyle;return Ae.fillStyle="#ffffff",Ae.fillStyle=e,t===Ae.fillStyle?String(t):""}function dt(e,t){let o=sn(e);return o?t.filter(n=>et(n.value)&&sn(n.value)===o).map(n=>n.name).sort():[]}function yn(e){let t=getComputedStyle(e),o=[],n=(r,i)=>{let a=i.trim();!a||a==="transparent"||/rgba?\([^)]*,\s*0\s*\)$/.test(a)||o.push({label:r,value:a})};return n("text",t.color),n("background",t.backgroundColor),o}function Ko(e,t,o){let n=r=>typeof CSS<"u"&&CSS.escape?CSS.escape(r):r.replace(/[^\w-]/g,"\\$&");return t?`#${n(t)}`:o.length?e+o.map(r=>`.${n(r)}`).join(""):e}function tt(e){let t=typeof e.className=="string"?e.className.trim().split(/\s+/).filter(Boolean):[];return Ko(e.tagName.toLowerCase(),e.id,t)}function xn(e){let t=tt(e);if(!/[.#]/.test(t))return 0;try{return document.querySelectorAll(t).length}catch{return 0}}function jo(e){if(!e)return"inline <style>";let t=e.split("?")[0]??e;try{let o=new URL(t,"http://x").pathname;return decodeURI(o).replace(/^\//,"")||t}catch{return t}}var Uo=["width","height","padding","margin","border-width","gap","font-size","line-height","letter-spacing","color","background-color"];function Vo(e){for(let t=0;t<e.length;t+=1){let o=e.item(t);if(Uo.some(n=>o===n||o.startsWith(`${n}-`)))return!0}return!1}function wn(e){let t=[],o=new Set,n=(r,i)=>{for(let a of Array.from(r)){if(a instanceof CSSMediaRule){matchMedia(a.conditionText).matches&&n(a.cssRules,i);continue}if(a instanceof CSSSupportsRule){CSS.supports(a.conditionText)&&n(a.cssRules,i);continue}let l=a.cssRules;if(l&&!(a instanceof CSSStyleRule)){n(l,i);continue}if(!(a instanceof CSSStyleRule))continue;let d=!1;try{d=e.matches(a.selectorText)}catch{continue}if(!d||!Vo(a.style))continue;let v=`${a.selectorText}|${i}`;o.has(v)||(o.add(v),t.push({selector:a.selectorText,file:i}))}};for(let r of Array.from(document.styleSheets)){if(r.ownerNode instanceof Element&&r.ownerNode.hasAttribute("data-align-ignore"))continue;let i;try{i=r.cssRules}catch{continue}n(i,jo(r.href))}return t.reverse()}function ln(e){if(!e||e==="none")return[];let t=e.trim().split(/\s+/),o=[];for(let n of t){if(!n.endsWith("px"))return[];let r=Number.parseFloat(n);if(!Number.isFinite(r))return[];o.push(r)}return o}function cn(e,t,o){let n=0;for(let r=0;r<e.length;r+=1){let i=n+e[r];if(o<i+.5)return r;n=i+t}return-1}function qo(e,t){let o=t==="rtl";return e.startsWith("vertical")||e.startsWith("sideways")?{inline:"y",inlineReversed:e==="sideways-lr"?!o:o,blockReversed:e==="vertical-rl"||e==="sideways-rl"}:{inline:"x",inlineReversed:o,blockReversed:!1}}function dn(e,t,o,n,r){return r?t-n:o-e}function vn(e){let t=e.parentElement,o=0;for(;t&&getComputedStyle(t).display==="contents";)t=t.parentElement,o+=1;if(!t)return null;let n=getComputedStyle(t),r=getComputedStyle(e),i=n.display,a=[];if(o>0&&a.push({label:"through",value:o===1?"a display: contents parent":`${o} display: contents parents`}),r.position==="absolute"||r.position==="fixed")return a.push({label:"placed by",value:`${r.position}, not by the parent`}),{display:i,rows:a};if(r.float!=="none")return a.push({label:"placed by",value:`float: ${r.float}`}),{display:i,rows:a};let l=i.includes("flex"),d=i.includes("grid");if(!l&&!d)return a.push({label:"flow",value:i}),{display:i,rows:a};let v=un(n.rowGap==="normal"?"0px":n.rowGap),k=un(n.columnGap==="normal"?"0px":n.columnGap),S=v===k?v:`row ${v} \xB7 column ${k}`;if(l){let J=n.flexDirection;a.push({label:"direction",value:n.flexWrap==="nowrap"?J:`${J} \xB7 ${n.flexWrap}`}),a.push({label:"justify",value:n.justifyContent}),a.push({label:"align",value:n.alignItems}),a.push({label:"gap",value:S});let g=`${r.flexGrow} ${r.flexShrink} ${r.flexBasis}`;return g!=="0 1 auto"&&a.push({label:"this child",value:`flex: ${g}`}),r.alignSelf!=="auto"&&a.push({label:"align-self",value:r.alignSelf}),{display:i,rows:a}}let u=ln(n.gridTemplateColumns),b=ln(n.gridTemplateRows);u.length&&a.push({label:"columns",value:`${u.length} \xB7 ${u.map(Tt).join(" ")}`}),b.length&&a.push({label:"rows",value:`${b.length} \xB7 ${b.map(Tt).join(" ")}`}),a.push({label:"gap",value:S});let $=t.getBoundingClientRect(),y=e.getBoundingClientRect(),G={left:$.left+ue(n.borderLeftWidth)+ue(n.paddingLeft),right:$.right-ue(n.borderRightWidth)-ue(n.paddingRight),top:$.top+ue(n.borderTopWidth)+ue(n.paddingTop),bottom:$.bottom-ue(n.borderBottomWidth)-ue(n.paddingBottom)},c=qo(n.writingMode,n.direction),x=(J,g)=>J==="x"?dn(G.left,G.right,y.left,y.right,g):dn(G.top,G.bottom,y.top,y.bottom,g),L=c.inline==="x"?"y":"x",Y=ue(n.columnGap==="normal"?"0":n.columnGap),ee=ue(n.rowGap==="normal"?"0":n.rowGap),le=cn(u,Y,x(c.inline,c.inlineReversed)),oe=cn(b,ee,x(L,c.blockReversed)),j=[];return le>=0&&j.push(`column ${le+1} of ${u.length}`),oe>=0&&j.push(`row ${oe+1} of ${b.length}`),j.length&&a.push({label:"this child",value:j.join(" \xB7 ")}),{display:i,rows:a}}function un(e){return e.endsWith("px")?Tt(Number.parseFloat(e)):e}function Tt(e){return String(Math.round(e*100)/100)}var kn=["display","position","width","height","padding","margin","border-width","border-style","border-radius","font-family","font-size","font-weight","font-style","line-height","letter-spacing","text-transform","text-align","color","background-color","border-color","opacity","flex-direction","justify-content","align-items","gap","flex-grow","flex-shrink","flex-basis","align-self","box-shadow","overflow","text-overflow","white-space"];function Jo(e,t){let o=[];for(let n of kn){let r=e[n]??"",i=t[n]??"";r!==i&&o.push({prop:n,a:r,b:i})}return o}function pn(e){let t=getComputedStyle(e),o={};for(let n of kn)o[n]=t.getPropertyValue(n);return o}function $n(e,t){return Jo(pn(e),pn(t))}var Qo={ignore:"",grid:null,hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"},theme:"auto"};function Sn(e={}){return{...Qo,...e}}var En=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function Cn(e){return e.ignore?`${En}, ${e.ignore}`:En}function Q(e){return String(Math.round(e*100)/100)}function Zo(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function ht(e){let t=e.getBoundingClientRect();return{el:e,label:Zo(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height,scale:Le(e)}}function Mn(e,t){let o=(n,r)=>Math.abs(n-r)<.001;return o(e.scale.x,t.scale.x)&&o(e.scale.y,t.scale.y)?e.scale:{x:1,y:1}}function Tn(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function Be(e,t,o){let n=Cn(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=Tn(r);return r&&r!==document.documentElement?ht(r):null}var ut=e=>parseFloat(e)||0;function Lt(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[ut(n),ut(r),ut(i),ut(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function er(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function tr(e,t){let o=Mn(e,t),n=t.left+t.width/2,r=t.top+t.height/2;return[{x1:e.left,y1:r,x2:t.left,y2:r,label:Q((t.left-e.left)/o.x),axis:"x"},{x1:t.right,y1:r,x2:e.right,y2:r,label:Q((e.right-t.right)/o.x),axis:"x"},{x1:n,y1:e.top,x2:n,y2:t.top,label:Q((t.top-e.top)/o.y),axis:"y"},{x1:n,y1:t.bottom,x2:n,y2:e.bottom,label:Q((e.bottom-t.bottom)/o.y),axis:"y"}]}function pt(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function mt(e,t){let o=[],n=Mn(e,t),r=e.left<t.right&&t.left<e.right,i=e.top<t.bottom&&t.top<e.bottom;if(r&&i){let[a,l]=er(e,t);return tr(a,l)}if(!r){let[a,l]=e.right<=t.left?[e,t]:[t,e],d=i?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:a.right,y1:d,x2:l.left,y2:d,label:`${Q((l.left-a.right)/n.x)}`,axis:"x"}),o.push(...pt(a.right,a.top,a.bottom,d,"x")),o.push(...pt(l.left,l.top,l.bottom,d,"x"))}if(!i){let[a,l]=e.bottom<=t.top?[e,t]:[t,e],d=r?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:d,y1:a.bottom,x2:d,y2:l.top,label:`${Q((l.top-a.bottom)/n.y)}`,axis:"y"}),o.push(...pt(a.bottom,a.left,a.right,d,"y")),o.push(...pt(l.top,l.left,l.right,d,"y"))}return o}function nr(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function Nt(e){let t=nr(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var or=5,rr=8;function nt(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function Rt(e,t,o){let n=null,r=or;for(let i of e){let a=Math.abs(nt(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function An(e,t,o){if(o)return{at:e,what:""};let n=null,r=rr;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function Ln(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function Pt(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,l=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:l,y2:i,label:Q(r.gap/e.scale.x),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,l=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:l,label:Q(r.gap/e.scale.y),axis:"y"})}}return o}function Nn(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],l=r[i],d=l-a;d<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:l,y2:t.y,label:Q(d),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:l,label:Q(d),axis:"y"}))}}return o}var Re=3;function ir(e,t){return e.x<t.x+t.w+Re&&t.x<e.x+e.w+Re&&e.y<t.y+t.h+Re&&t.y<e.y+e.h+Re}function Rn(e,t,o=12){let n=(a,l)=>Math.min(Math.max(a,o),t.w-l-o),r=(a,l)=>Math.min(Math.max(a,o),t.h-l-o),i=[];for(let a of e){let l={...a,x:n(a.x,a.w),y:r(a.y,a.h)},d=!1;for(let v=0;v<16;v++){let k=i.find(u=>ir(u,l));if(!k)break;let S=l.axis==="x"?l.y:l.x;if(l.axis==="x"?l.y=r(d?k.y+k.h+Re:k.y-l.h-Re,l.h):l.x=n(d?k.x-l.w-Re:k.x+k.w+Re,l.w),(l.axis==="x"?l.y:l.x)===S){if(d)break;d=!0}}i.push(l)}return i}function Pn(e,t){let{columns:o,gutter:n,margin:r}=e;if(o<=0)return[];let i=e.maxWidth>0?Math.min(e.maxWidth,t):t,a=Math.max(0,(t-i)/2),d=(Math.max(0,i-r*2)-n*(o-1))/o;if(d<=0)return[];let v=[];for(let k=0;k<o;k+=1)v.push({left:a+r+k*(d+n),width:d});return v}function Gn(e,t){return e*t>=8?e:0}function ar(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(l=>parseFloat(l)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function Le(e){let t=1,o=1;for(let n=e;n;n=Tn(n)){let r=ar(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var Ee=(e,t)=>({light:e,dark:t}),Gt={accent:Ee("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:Ee("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:Ee("oklch(1 0 0)","oklch(0.264 0 0)"),fg:Ee("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:Ee("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:Ee("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:Ee("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:Ee("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)"),pixelLine:Ee("oklch(0.205 0 0 / 0.14)","oklch(0.97 0 0 / 0.14)")};function Bn(e){return`light-dark(${e.light}, ${e.dark})`}var ge=Bn(Ee("#fafafa","#1a1a1a"));function _e(e,t=e){return Bn(Ee(`rgb(0 0 0 / ${t})`,`rgb(255 255 255 / ${e})`))}var In=[0,.07,.08,.1,.12,.15,.2];function D(e){let t=In[Math.max(0,Math.min(In.length-1,e))];return t===0?ge:_e(t)}var w={primary:_e(.9),secondary:_e(.6),tertiary:_e(.46,.55),disabled:_e(.22,.26)},de=_e(.12),Ne="0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)",Dn="0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)",K=22,Pe=36,z={tight:4,base:8,roomy:12,edge:16},H={exit:"160ms cubic-bezier(0.3, 0, 1, 1)",ui:"160ms cubic-bezier(0.2, 0, 0, 1)"},sr='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',T={title:13,body:12,tag:11,stack:sr},V={regular:400,medium:500,semibold:600},It="__align_font",lr="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function Hn(){if(document.getElementById(It))return;let e=document.createElement("link");e.id=It,e.rel="stylesheet",e.href=lr,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function On(){document.getElementById(It)?.remove()}function zn(e){let t=[`${V.medium} ${T.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function Dt(e){let t={};for(let o of Object.keys(Gt))t[o]=e?Gt[o].dark:Gt[o].light;return t}var Bt=null;function Fn(e){Bt=e==="auto"?null:e}function Ht(){if(Bt)return Bt==="dark";let e=document.documentElement,t=getComputedStyle(e).colorScheme;if(/dark/.test(t)&&!/light/.test(t))return!0;if(/light/.test(t)&&!/dark/.test(t))return!1;for(let o of[document.body,e]){if(!o)continue;let n=cr(getComputedStyle(o).backgroundColor);if(n!==null)return n<.5}return matchMedia("(prefers-color-scheme: dark)").matches}function cr(e){let t=/^rgba?\(([^)]+)\)$/.exec(e.trim());if(!t)return null;let o=t[1].split(/[\s,/]+/).filter(Boolean).map(Number),[n,r,i,a=1]=o;return n===void 0||r===void 0||i===void 0||a<.5?null:(.2126*n+.7152*r+.0722*i)/255}function Xe(e,t){return e.replace(/\)$/,` / ${t})`)}var dr=`
`,Ce=16,ur=`
.dock {
  /* No color-scheme here: the overlay sets it inline on the shadow host, from
     what the page actually looks like rather than what the machine prefers, and
     it inherits down. Declaring 'light dark' again would undo that and hand
     light-dark() back to the media query. */
  position: fixed; left: ${Ce}px; top: 0;
  /* Clamped to the window. A narrow viewport is not an edge case for this
     tool, it is the case it exists for: you make the window 375px wide
     precisely to check a mobile layout, and a readout that hangs off the
     screen there is useless exactly when you reached for it. */
  width: min(340px, calc(100vw - ${Ce*2}px));
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none;
  /* Not the whole panel: only the header is a drag surface, and making the
     numbers unselectable means the one thing you might want to paste into a
     stylesheet cannot be picked up by hand. Copy covers the whole reading; a
     selection covers the one value you actually wanted. */
  user-select: none;
  font-family: ${T.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${w.primary};
  --muted: ${w.secondary};
  --border: ${de};
}
.panel {
  padding: 10px; border-radius: 0;
  /* Five sections now \u2014 box, tokens, styled by, matches, colour \u2014 and on a
     laptop that is taller than the window. place() clamps the position but
     cannot rescue a panel taller than the screen, so it scrolls instead. */
  max-height: calc(100vh - ${Ce*2}px);
  overflow-y: auto; overscroll-behavior: contain;
  font-size: ${T.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${ge};

  box-shadow: ${Ne};

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
  background: ${ge};
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] .panel { box-shadow: ${Dn}; }
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${T.title}px; font-weight: ${V.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${T.body}px; font-weight: ${V.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${T.tag}px; font-weight: ${V.medium};
  margin-left: 4px;
  color: ${w.primary};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${T.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${D(1)}; }

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
  padding: ${z.base}px;
}
.region[data-level="1"] { background: ${D(1)}; }
.region[data-level="2"] { background: ${D(2)}; }
.region[data-level="3"] { background: ${D(3)}; }
.content { background: ${D(4)}; }

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
  font-size: ${T.tag}px; font-weight: ${V.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${V.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${V.regular}; }
.row { display: flex; align-items: center; gap: ${z.tight}px; margin: ${z.tight}px 0; }
.row > .edge { flex: 0 0 20px; }
.row > .fill { flex: 1 1 auto; min-width: 0; }

/* Type and tokens sit under the box, in the same muted register as the band
   labels \u2014 they annotate the measurement rather than competing with it. */
.readout {
  user-select: text;
  margin-top: ${z.base}px; padding-top: ${z.base}px;
  border-top: 1px solid var(--border);
}
.readout-tag { position: static; margin-bottom: ${z.tight}px; }
/* One grid for the whole section rather than one per row, so every key in a
   section shares a column and the column sizes to the longest key in it. A
   fixed 62px was right until a diff started printing 'background-color', which
   it broke across two lines mid-word. The 62px floor keeps the rhythm the
   other sections already had. */
.readout-rows {
  display: grid; grid-template-columns: minmax(62px, max-content) 1fr;
  gap: 0 ${z.base}px; align-items: baseline;
  font-size: ${T.tag}px; line-height: 1.5;
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
  font-size: ${T.body}px;
  /* Several of these wrap \u2014 a diff value, a rule file, a token list \u2014 and a
     lone short word on the last line reads as a mistake. */
  text-wrap: pretty;
}
.content {
  border-radius: 0; padding: ${z.roomy}px ${z.base}px;
  text-align: center; font-weight: ${V.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,ot=Ce,De=-1,Ye=!1;function Wn(e){let t=document.createElement("style");t.textContent=ur,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);let r=!1;function i(c,x){let L=document.createElement("div");L.className="readout";let Y=document.createElement("div");Y.className="tag readout-tag",Y.textContent=c,L.appendChild(Y);let ee=document.createElement("div");ee.className="readout-rows",L.appendChild(ee);for(let[le,oe]of x){let j=document.createElement("div");j.className="readout-row";let J=document.createElement("span");J.className="readout-key",J.textContent=le;let g=document.createElement("span");g.className="readout-value",g.textContent=oe,j.append(J,g),ee.appendChild(j)}return L}e.appendChild(o);let a=(c,x)=>Math.min(Math.max(c,Ce),Math.max(Ce,x-Ce));function l(){let c=o.offsetHeight||300;De<0&&(De=Math.max(Ce,innerHeight-c-Ce)),ot=a(ot,innerWidth-o.offsetWidth),De=a(De,innerHeight-c),o.style.transform=`translate(${ot-Ce}px, ${De}px)`}let d=null;function v(c){c.button===0&&(c.preventDefault(),c.stopPropagation(),d={x:c.clientX,y:c.clientY,dx:ot,dy:De},o.setAttribute("data-dragging",""),c.currentTarget.setPointerCapture(c.pointerId))}function k(c){d&&(ot=d.dx+(c.clientX-d.x),De=d.dy+(c.clientY-d.y),l())}function S(){d=null,o.removeAttribute("data-dragging")}addEventListener("resize",l);let u=null,b=[],$;function y(c){let x=document.createElement("div");return x.className="edge",x.textContent=c===0?"0":Q(c),c===0&&x.setAttribute("data-zero",""),x}function G(c,x,L,Y){let[ee,le,oe,j]=L,J=document.createElement("div");J.className="region",J.setAttribute("data-level",String(x));let g=document.createElement("span");g.className="tag",g.textContent=c;let A=document.createElement("div");A.className="row";let E=document.createElement("div");E.className="fill",E.appendChild(Y),A.append(y(j),E,y(le));let F=document.createElement("div");return F.className="head",F.append(g,y(ee)),J.append(F,A,y(oe)),J}return{show(c,x=[],L){b=x,$=L;let Y=Lt(c.el),[ee,le,oe,j]=Y.border,[J,g,A,E]=Y.padding,F=Le(c.el),s=c.width/F.x,h=c.height/F.y,f=Math.abs(F.x-1)>.001||Math.abs(F.y-1)>.001,C=document.createElement("header"),B=document.createElement("span");B.className="name",B.textContent=c.label;let R=document.createElement("span");R.className="size",R.textContent=`${Q(s)} \xD7 ${Q(h)}`;let I=document.createElement("button");if(I.className="close",I.textContent="\xD7",I.title="close (B brings it back)",I.addEventListener("pointerdown",P=>P.stopPropagation()),I.addEventListener("click",P=>{P.stopPropagation(),Ye=!0,o.removeAttribute("data-open")}),C.append(B,R),f){let P=document.createElement("span");P.className="scale",P.textContent=`\xD7${Q(F.x)}`,P.title=`renders at ${Q(c.width)} \xD7 ${Q(c.height)}`,C.appendChild(P)}C.appendChild(I),C.addEventListener("pointerdown",v),C.addEventListener("pointermove",k),C.addEventListener("pointerup",S),C.addEventListener("pointercancel",S);let _=document.createElement("div");_.className="content",_.textContent=`${Q(s-j-le-E-g)} \xD7 ${Q(h-ee-oe-J-A)}`,_.title=_.textContent;let O=[C,G("margin",1,Y.margin,G("border",2,Y.border,G("padding",3,Y.padding,_)))];if(r){let P=hn(c.el),m=lt(c.el);O.push(m.length&&P?i("type",m.map(M=>[M.label,M.value])):i("type",[["","nothing of its own to set type on"]]))}if(L&&L.el!==c.el&&L.el.isConnected){let P=$n(L.el,c.el).map(Z=>[Z.prop,`${Z.a||"\u2014"} \u2192 ${Z.b||"\u2014"}`]),m=P.slice(0,10);P.length>m.length&&m.push(["",`and ${P.length-m.length} more`]);let M=L.label===c.label?"the one locked before":L.label;O.push(i(`differs from ${M}`,m.length?m:[["","nothing in the properties it compares"]]))}let W=vn(c.el);if(W&&W.rows.length&&O.push(i(`laid out by ${W.display}`,W.rows.map(P=>[P.label,P.value]))),x.length){let P=x.map(M=>[Q(M.px),M.detail]),m=bn(x.map(M=>M.px));m&&P.push(["",m]),O.push(i("gaps",P))}let U=ct(c.el),N=mn([s,h,...Y.margin,...Y.border,...Y.padding,...r?lt(c.el).map(P=>P.px):[]],U);N&&O.push(i("tokens",[["",N]]));let re=wn(c.el);re.length&&O.push(i("styled by",re.slice(0,4).map(P=>[P.selector,P.file])));let ie=xn(c.el);ie>1&&O.push(i("matches",[["",`${ie} elements share ${tt(c.el)}`]]));let ce=U.filter(P=>et(P.value));if(ce.length){let P=yn(c.el).map(({label:m,value:M})=>{let Z=dt(M,ce);return[m,Z.length?`${M}  ${Z.join(" ")}`:`${M}  \u2014`]});P.length&&O.push(i("colour",P))}n.replaceChildren(...O),u=c,l(),!Ye&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},showsType:()=>r,isOpen:()=>!Ye&&u!==null,toggleType(){r=!r,u&&this.show(u,b,$)},asText(){if(!u)return"";let c=Lt(u.el),x=Le(u.el),L=u.width/x.x,Y=u.height/x.y,ee=oe=>oe.map(j=>Q(j)).join(" "),le=[`${u.label}  ${Q(L)} \xD7 ${Q(Y)}`,`margin   ${ee(c.margin)}`,`border   ${ee(c.border)}`,`padding  ${ee(c.padding)}`];if(r)for(let oe of lt(u.el))le.push(`${oe.label.padEnd(8)} ${oe.value}`);return le.join(dr)},hide(){u=null,o.removeAttribute("data-open")},setHidden(c){o.toggleAttribute("data-away",c)},toggle(){u&&(Ye=!Ye,Ye?o.removeAttribute("data-open"):(l(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",l),o.remove(),t.remove()}}}function _n(e=20,t=1e3){let o=[];return{push(n,r,i=Date.now()){let a=o[o.length-1];if(a&&r!==""&&a.tag===r&&i-a.at<=t){a.at=i;return}o.push({state:n,tag:r,at:i}),o.length>e&&o.shift()},pop(){return o.pop()?.state??null},peek(){return o[o.length-1]?.state??null},depth(){return o.length},clear(){o.length=0}}}var pr="0 0 24 24";var p=(e,t)=>t===void 0?{path:e}:{path:e,fade:t},te=(e,t,o,n,r,i)=>i===void 0?{rect:[e,t,o,n,r]}:{rect:[e,t,o,n,r],fade:i},hr={rulers:[p("M2 8V4"),p("M22 8V4"),p("M22 6H2"),te(2,12,20,8,2),p("M6 15v-3"),p("M10 15v-3"),p("M14 15v-3"),p("M18 15v-3")],xray:[p("M3 7V5a2 2 0 0 1 2-2h2"),p("M17 3h2a2 2 0 0 1 2 2v2"),p("M21 17v2a2 2 0 0 1-2 2h-2"),p("M7 21H5a2 2 0 0 1-2-2v-2")],grid:[te(3,3,18,18,2),p("M9 3v18"),p("M15 3v18")],pixels:[te(3,3,18,18,2),p("M3 9h18"),p("M3 15h18"),p("M9 3v18"),p("M15 3v18")],type:[p("M12 4v16"),p("M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"),p("M9 20h6")],panel:[te(3,3,18,18,2),te(8,8,8,8,1)],freeze:[te(14,3,5,18,1),te(5,3,5,18,1)],copy:[te(8,8,14,14,2),p("M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2")],pick:[p("m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12"),p("m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z"),p("m2 22 .414-.414")],hide:[p("M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"),p("M14.084 14.158a3 3 0 0 1-4.242-4.242"),p("M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"),p("m2 2 20 20")],undo:[p("M9 14 4 9l5-5"),p("M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11")],edit:[p("M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"),p("m15 5 4 4")],sideTop:[p("M4 5h16v14H4z",.3),p("M4 5h16")],sideRight:[p("M4 5h16v14H4z",.3),p("M20 5v14")],sideBottom:[p("M4 5h16v14H4z",.3),p("M4 19h16")],sideLeft:[p("M4 5h16v14H4z",.3),p("M4 5v14")],fontSize:[p("M12 4v16"),p("M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"),p("M9 20h6")],fontWeight:[p("M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8")],lineHeight:[p("M3 5h18",.35),p("M3 19h18",.35),p("M12 8v8")],tracking:[p("M5 5v14",.35),p("M19 5v14",.35),p("M8 12h8")],italic:[p("M19 4h-9"),p("M14 20H5"),p("m15 4-4 16")],textAlign:[p("M21 6H3"),p("M15 12H3"),p("M17 18H3")],textCase:[p("M3.5 13h6"),p("m2 16 4.5-9 4.5 9"),p("M18 16V7"),p("m14 11 4-4 4 4")],underline:[p("M6 4v6a6 6 0 0 0 12 0V4"),p("M4 20h16")],textColour:[p("m6 16 6-12 6 12",.35),p("M8 12h8",.35),p("M4 20h16")],backgroundColour:[te(3,3,18,18,2),p("M3 12h18",.35),p("M12 3v18",.35)],borderColour:[te(3,3,18,18,2),te(8,8,8,8,1,.35)],opacity:[p("M12 3a9 9 0 0 0 0 18z"),p("M12 3a9 9 0 0 1 0 18",.35)],padding:[te(3,3,18,18,2,.35),te(7,7,10,10,1)],margin:[te(3,3,18,18,2),te(7,7,10,10,1,.35)],boxSizing:[te(3,3,18,18,2),p("M7 7h10v10H7z",.35)],widthIcon:[p("M2 12h20"),p("m6 8-4 4 4 4"),p("m18 8 4 4-4 4")],heightIcon:[p("M12 2v20"),p("m8 6 4-4 4 4"),p("m8 18 4 4 4-4")],borderWidth:[te(3,3,18,18,2),p("M3 3h18")],borderStyle:[p("M3 12h4"),p("M10 12h4"),p("M17 12h4")],borderRadius:[p("M21 21V9a6 6 0 0 0-6-6H3")],gap:[te(3,4,7,16,1,.35),te(14,4,7,16,1,.35),p("M12 8v8")],flexDirection:[p("M12 5v14"),p("m8 9 4-4 4 4"),p("m8 15 4 4 4-4")],justify:[p("M4 4v16",.35),p("M20 4v16",.35),te(8,8,8,8,1)],alignItems:[p("M4 4h16",.35),p("M4 20h16",.35),te(8,8,8,8,1)],flexWrap:[p("M3 7h13a4 4 0 0 1 0 8H8"),p("m11 12-3 3 3 3")],shadow:[te(3,3,14,14,2),p("M21 9v10a2 2 0 0 1-2 2H9",.35)],backdrop:[te(3,3,18,18,2),p("M7 12h10",.35),p("M7 8h10",.35),p("M7 16h10",.35)],arrowUp:[p("m5 12 7-7 7 7"),p("M12 19V5")],arrowDown:[p("M12 5v14"),p("m19 12-7 7-7-7")],link:[p("M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"),p("M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71")],check:[p("M20 6 9 17l-5-5")],cross:[p("M18 6 6 18"),p("m6 6 12 12")]},Ot="http://www.w3.org/2000/svg";function be(e,t=16){let o=document.createElementNS(Ot,"svg");o.setAttribute("viewBox",pr),o.setAttribute("width",String(t)),o.setAttribute("height",String(t)),o.setAttribute("fill","none"),o.setAttribute("stroke","currentColor"),o.setAttribute("stroke-width","2"),o.setAttribute("stroke-linecap","round"),o.setAttribute("stroke-linejoin","round"),o.setAttribute("aria-hidden","true");for(let n of hr[e])if("rect"in n){let[r,i,a,l,d]=n.rect,v=document.createElementNS(Ot,"rect");v.setAttribute("x",String(r)),v.setAttribute("y",String(i)),v.setAttribute("width",String(a)),v.setAttribute("height",String(l)),v.setAttribute("rx",String(d)),n.fade!==void 0&&v.setAttribute("opacity",String(n.fade)),o.appendChild(v)}else{let r=document.createElementNS(Ot,"path");r.setAttribute("d",n.path),n.fade!==void 0&&r.setAttribute("opacity",String(n.fade)),o.appendChild(r)}return o}var mr=[{title:"Pointing at things",rows:[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure whatever is under the cursor"],["Click","lock an element, so it keeps measuring after the pointer leaves"],["Right-click","add another to the locked set, or drop one from it. Two locked also gets you a diff"],["Drag the panel header","move the box model out of your way"],["Esc","clear the locks, then close the tool"]]},{title:"Guides",rows:[["Drag from a rule","pull out a guide; drag it back into the rule to throw it away"],["V  /  H","drop a vertical or horizontal guide at the cursor"],["Hover a guide","its distance to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the guide you last touched. Shift for 10px"],["L","pin a guide, so it cannot be moved or deleted by accident"],["Ctrl/Cmd while placing","ignore snapping"],["Del","remove the guide under the cursor. Shift+Del for all of them"]]}],ke=z.edge,zt=24,fr=900,rt=Pe,it=z.base,gr=`
.flag {
  position: fixed; top: ${ke}px; right: ${ke}px;
  display: flex; align-items: center; gap: 8px;
  transition: top ${H.ui};
  padding: ${(Pe-zt)/2}px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${T.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${T.tag}px; font-weight: ${V.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${w.primary};
  background: ${ge};
  box-shadow: ${Ne};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
/* No negative tracking: it is 11px, and tightening is what large text wants.
   Small text reads better at zero or a hair positive. */
.flag .name { letter-spacing: 0; }
/* The rulers draw a gutter along the top edge, and the badge sits in it. Step
   down out of the way rather than covering the ticks the rulers exist to show. */
.flag[data-rulers] { top: ${ke+K}px; }
.help[data-rulers] { top: ${ke+K+rt+it}px; }
.flag:hover { background: ${D(1)}; }
.flag .count { color: ${w.secondary}; }

/* A layers bar, not a palette. Switches, then the one control that changes the
   page, then the things that happen once. */
.tools { display: flex; align-items: center; gap: 2px; }
.sep {
  width: 1px; align-self: stretch; margin: 0 4px;
  background: ${de};
}
.tool {
  width: ${zt}px; height: ${zt}px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; cursor: pointer;
  font: inherit; font-size: ${T.tag}px; font-weight: ${V.medium};
  color: ${w.tertiary};
}
/* Both glyphs occupy the same cell so one can cross-fade into the other; a
   swap would jump, and the point is to be noticed without being a movement. */
.tool > svg { grid-area: 1 / 1; transition: opacity ${H.ui}; }
.tool > .ack { opacity: 0; }
.tool[data-ack] > .ack { opacity: 1; }
.tool[data-ack] > .glyph { opacity: 0; }
.tool:hover { background: ${D(2)}; color: ${w.primary}; }
/* On the press, not on the release. Waiting for the click to acknowledge a
   button is the difference between a control that answers and one that lags,
   and it costs one rule. */
.tool:active { background: ${D(4)}; color: ${w.primary}; }
.tool:focus-visible { outline: 1px solid ${w.primary}; outline-offset: -1px; }
/* On is the film, not a colour: the three hues each already mean something on
   the canvas, and a fourth here would say nothing. */
.tool[data-on] { background: ${D(4)}; color: ${w.primary}; }
/*
 * Armed reads differently from on, deliberately. Every other toggle draws
 * something over the page; this one lets the page be rewritten, and a tool that
 * can do that while looking exactly like one that cannot is the problem the
 * arming design exists to avoid. It inverts rather than taking a hue: red
 * already means a measurement here, and a second meaning for it would cost
 * more than the emphasis is worth.
 */
.tool[data-tool='edit'][data-on] {
  background: ${w.primary};
  color: ${ge};
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
  position: fixed; top: ${ke+rt+it}px; right: ${ke}px;
  /* 368 plus two insets is 400, so this was the first thing to hang off the
     left edge of a phone-width window. */
  /* The padding is in the subtraction because these boxes are content-box:
     without it the clamp lets the panel sit flush against the far edge with
     no inset at all, which reads as broken rather than as tight. */
  width: min(368px, calc(100vw - ${ke*2+z.base*2}px));
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${ke*2+rt+it}px); overflow-y: auto;
  padding: ${z.base}px; border-radius: 0;
  user-select: none;
  font-family: ${T.stack};
  font-synthesis: none;
  font-size: ${T.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${w.primary};
  background: ${ge};
  box-shadow: ${Ne};
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
  align-items: baseline; gap: ${z.tight}px ${z.base}px; margin: 0;
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
  color: ${w.tertiary}; line-height: 0;
}
.help h4 {
  grid-column: 1 / -1; margin: 10px 0 2px;
  font-size: ${T.tag}px; font-weight: ${V.semibold};
  color: ${w.tertiary};
}
.help h4:first-child { margin-top: 0; }
.help kbd {
  display: inline-block; padding: 3px 5px;
  font: inherit; font-weight: ${V.medium};
  border: 1px solid ${de};
  background: ${D(2)};
}
/* These run to three lines, and a one-word last line reads as a mistake. */
.help dd { margin: 0; color: ${w.secondary}; text-wrap: pretty; }
`,Ft=[{name:"rulers",label:"Rulers",key:"R",toggle:!0,what:"a scale down the top and left edges, in page pixels \u2014 and the gutters you drag guides out of"},{name:"xray",label:"X-ray",key:"X",toggle:!0,what:"outline every element at once, to see the boxes a layout is really made of"},{name:"grid",label:"Column grid",key:"G",toggle:!0,what:"the grid your design is built on, columns filled and gutters left empty. Needs one configured"},{name:"pixels",label:"Pixel grid",key:"K",toggle:!0,what:"a ten-pixel lattice over the page, to read an offset off without measuring it"},{name:"type",label:"Type",key:"T",toggle:!0,what:"add size, weight, line height and tracking to the panel, each checked against your scale"},{name:"panel",label:"Box model",key:"B",toggle:!0,what:"the readout itself \u2014 margins, borders, padding, what places the element, what styles it"},{name:"hide",label:"Hide",key:"\\",toggle:!0,what:"everything drawn, out of the way for a moment. Your locks, guides and layers all survive it"},{name:"freeze",label:"Freeze",key:"F",toggle:!0,what:"hold every animation and transition where it stands, so a moving thing can be measured"},{name:"copy",label:"Copy",key:"C",toggle:!1,what:"put everything in the panel on the clipboard as text"},{name:"pick",label:"Colour",key:"P",toggle:!1,what:"sample a colour from anywhere on screen and match it against your palette"},{name:"edit",label:"Edit",key:"E",toggle:!0,what:"let the panel change the page. Off until you say so, shown while it is on, and everything goes back when you turn it off"},{name:"undo",label:"Undo",key:"Ctrl/Cmd + Z",toggle:!1,what:"step back through the guides \u2014 a whole run of nudges counts as one"}];function Xn(e,t){let o=document.createElement("style");o.textContent=gr,e.appendChild(o);let n=document.createElement("div");n.className="flag";let r=document.createElement("span");r.className="name",r.textContent="Align";let i=document.createElement("span");i.className="count";let a=new Map,l=new Map,d=document.createElement("div");d.className="tools";for(let b of Ft){if(b.name==="freeze"||b.name==="copy"){let G=document.createElement("span");G.className="sep",d.appendChild(G)}let $=document.createElement("button");$.type="button",$.className="tool",$.dataset.tool=b.name;let y=be(b.name);y.classList.add("glyph"),$.appendChild(y),$.setAttribute("aria-label",b.label),$.title=`${b.label}  \xB7  ${b.key}
${b.what}`,b.toggle||$.setAttribute("data-once",""),$.addEventListener("click",G=>{G.stopPropagation(),t(b.name)}),a.set(b.name,$),d.appendChild($)}n.append(r,d,i);let v=document.createElement("div");v.className="help";let k=document.createElement("dl");function S(b){let $=document.createElement("h4");$.textContent=b,k.appendChild($)}function u(b,$,y){let G=document.createElement("span");G.className="glyph",y&&G.appendChild(be(y,14));let c=document.createElement("dt"),x=document.createElement("kbd");x.textContent=b,c.appendChild(x);let L=document.createElement("dd");L.textContent=$,k.append(G,c,L)}S("The bar, left to right");for(let b of Ft)u(b.key,`${b.label} \u2014 ${b.what}`,b.name);for(let b of mr){S(b.title);for(let[$,y]of b.rows)u($,y)}return v.appendChild(k),n.addEventListener("click",b=>{b.stopPropagation(),v.toggleAttribute("data-open")}),e.append(n,v),{acknowledge(b,$){let y=a.get(b);if(!y)return;clearTimeout(l.get(b)),y.querySelector(".ack")?.remove();let G=be($?"check":"cross");G.classList.add("ack"),y.appendChild(G),requestAnimationFrame(()=>y.setAttribute("data-ack",$?"yes":"no")),l.set(b,setTimeout(()=>{y.removeAttribute("data-ack"),setTimeout(()=>y.querySelector(".ack")?.remove(),200)},fr))},update(b,$){i.textContent=b>0?`${b} locked`:"";let y=$.rulers&&!$.hide;n.toggleAttribute("data-rulers",y),v.toggleAttribute("data-rulers",y);for(let x of Ft)x.toggle&&a.get(x.name)?.toggleAttribute("data-on",$[x.name]===!0);let G=a.get("copy");G&&(G.disabled=!$.canCopy);let c=a.get("undo");c&&(c.disabled=!$.canUndo)},closeHelp(){let b=v.hasAttribute("data-open");return v.removeAttribute("data-open"),b},destroy(){for(let b of l.values())clearTimeout(b);n.remove(),v.remove(),o.remove()}}}var br=2,yr=3;function xr(e,t,o,n,r=1){let i=e+t/br,a=r>0?Math.round(i/r)*r:i;return Math.max(o,Math.min(n,Number(a.toPrecision(12))))}function wr(e,t,o){let n=/^\s*(-?\d*\.?\d+)\s*(px|rem|em|%)?\s*$/i.exec(e);if(!n)return null;let r=parseFloat(n[1]);return Number.isFinite(r)?Math.max(t,Math.min(o,r)):null}function Yn(e){return String(Math.round(e*100)/100)}var vr=`
.scrub {
  display: flex; align-items: center; gap: 6px;
  min-width: 0;
  height: 28px;
  padding: 0 8px;
  border: 0; border-radius: 0;
  background: ${D(1)};
  color: ${w.primary};
  font: inherit;
  font-size: ${T.body}px; font-weight: ${V.regular};
  font-variant-numeric: tabular-nums;
  line-height: 1;
  text-align: left;
  user-select: none;
  touch-action: none;
  transition: background ${H.ui};
}
.scrub[data-axis='x'] { cursor: ew-resize; }
.scrub[data-axis='y'] { cursor: ns-resize; }
.scrub:hover { background: ${D(3)}; }
.scrub[data-scrubbing] { background: ${D(5)}; }
.scrub:focus-visible { outline: 2px solid ${w.secondary}; outline-offset: -2px; }

/* The glyph is the label, so it must not shrink when the number grows. */
.scrub-glyph { flex: none; display: grid; place-items: center; color: ${w.tertiary}; }
.scrub-text {
  flex: none;
  color: ${w.tertiary};
  font-size: ${T.tag}px;
  white-space: nowrap;
}
.scrub-value {
  flex: 1; min-width: 0;
  text-align: right;
  white-space: nowrap; overflow: hidden;
}

.scrub-input {
  flex: 1; min-width: 0; width: 100%;
  padding: 0; border: 0;
  background: none; outline: none;
  color: ${w.primary};
  font: inherit;
  font-size: ${T.body}px;
  font-variant-numeric: tabular-nums;
  text-align: right;
}
.scrub-input:focus { box-shadow: inset 0 -1px ${de}; }
`,Kn="align-scrub";function kr(e){if(e.querySelector(`#${Kn}`))return;let t=document.createElement("style");t.id=Kn,t.textContent=vr,e.appendChild(t)}function jn(e,t){kr(e);let o=t.min??0,n=t.max??9999,r=t.step??1,i=t.axis??"x",a=t.value,l=document.createElement("button");if(l.type="button",l.className="scrub",l.dataset.axis=i,l.setAttribute("aria-label",t.label),l.title=`${t.label}. Drag to change, click to type.`,t.glyph){let c=document.createElement("span");c.className="scrub-glyph",c.appendChild(be(t.glyph,14)),l.appendChild(c)}else if(t.text){let c=document.createElement("span");c.className="scrub-text",c.textContent=t.text,l.appendChild(c)}let d=document.createElement("span");d.className="scrub-value",l.appendChild(d);function v(){d.textContent=Yn(a),l.setAttribute("aria-valuenow",String(a))}function k(c,x){let L=Math.max(o,Math.min(n,c));L!==a&&(a=L,v(),t.onChange(a)),x||t.onCommit?.(a)}let S=null,u=!1,b=1;l.addEventListener("pointerdown",c=>{if(!(y||c.button!==0)){c.preventDefault(),c.stopPropagation();try{l.setPointerCapture(c.pointerId)}catch{}S={x:c.clientX,y:c.clientY,value:a},u=!1,b=(i==="x"?Le(l).x:Le(l).y)||1,l.setAttribute("data-scrubbing","")}}),l.addEventListener("pointermove",c=>{if(!S)return;let x=i==="x"?(c.clientX-S.x)/b:(c.clientY-S.y)/b;!u&&Math.abs(x)>yr&&(u=!0),u&&k(xr(S.value,x,o,n,r),!0)});let $=c=>{if(S){try{l.releasePointerCapture(c.pointerId)}catch{}S=null,l.removeAttribute("data-scrubbing"),u&&t.onCommit?.(a)}};l.addEventListener("pointerup",$),l.addEventListener("pointercancel",$);let y=null;function G(){if(y)return;y=document.createElement("input"),y.className="scrub-input",y.type="text",y.value=Yn(a),y.setAttribute("aria-label",`${t.label}, as a number`),d.style.display="none",l.appendChild(y),y.focus(),y.select();let c=x=>{if(y){if(x){let L=wr(y.value,o,n);L!==null&&k(L,!1)}y.remove(),y=null,d.style.display="",l.focus()}};y.addEventListener("keydown",x=>{x.stopPropagation(),x.key==="Enter"?(x.preventDefault(),c(!0)):x.key==="Escape"&&(x.preventDefault(),c(!1))}),y.addEventListener("blur",()=>c(!0)),y.addEventListener("pointerdown",x=>x.stopPropagation())}return l.addEventListener("click",c=>{if(c.stopPropagation(),u){u=!1;return}G()}),l.addEventListener("keydown",c=>{if(c.target!==l||c.altKey||c.metaKey||c.ctrlKey)return;let x=c.shiftKey?10:1;c.key==="ArrowUp"||c.key==="ArrowRight"?(c.preventDefault(),c.stopPropagation(),k(a+r*x,!1)):c.key==="ArrowDown"||c.key==="ArrowLeft"?(c.preventDefault(),c.stopPropagation(),k(a-r*x,!1)):c.key==="Enter"&&(c.preventDefault(),c.stopPropagation(),G())}),v(),{el:l,set(c){a=Math.max(o,Math.min(n,c)),v()},destroy(){y?.remove(),l.remove()}}}function Un(e,t=0,o=0){return Math.min(100,Math.max(...[e,t,o].map(n=>{let[r,i="0"]=String(n).toLowerCase().split("e");return Math.max(0,(r.split(".")[1]?.length??0)-Number(i))})))}function Wt(e,t,o,n){let r=o??-1/0,i=n??1/0,a=Math.max(r,Math.min(i,e));if(a===r||a===i||!Number.isFinite(t)||t<=0)return a;let l=o??0,d=l+Math.round((a-l)/t)*t;return Math.max(r,Math.min(i,Number(d.toPrecision(14))))}var $r=.03125;function Er(e,t,o){let n=(e-t)/(o-t),r=Math.round(n*10)/10;return Math.abs(n-r)<=$r?t+r*(o-t):e}var Sr=32,Cr=8,Mr=200;function Vn(e,t){let o=Math.max(0,e-Sr);return t*Cr*Math.sqrt(Math.min(o/Mr,1))}function ft(e,t,o){return o===t?0:(e-t)/(o-t)*100}function qn(e,t,o){let n=Math.max(0,Math.min(1,e));return t+n*(o-t)}function Tr(e,t,o,n,r,i=!1){if(e==="Home")return o;if(e==="End")return n;let a=["ArrowRight","ArrowUp","PageUp"].includes(e)?1:["ArrowLeft","ArrowDown","PageDown"].includes(e)?-1:0;if(!a)return;if(!(r>0)||n<=o)return o;let l=e.startsWith("Page")||i?10:1,d=(t-o)/r,v=o+(a>0?Math.floor(d+1e-9)+l:Math.ceil(d-1e-9)-l)*r;return Math.max(o,Math.min(n,Number(v.toPrecision(14))))}function Ar(e,t,o){let n=(t-e)/o;return n<=10&&Number.isFinite(n)&&n>1?Array.from({length:Math.round(n)-1},(r,i)=>(i+1)*o/(t-e)*100):Array.from({length:9},(r,i)=>(i+1)*10)}function Jn(e,t,o=0,n=0){let r=Un(t,o,n),i=Math.max(r,Math.min(4,Un(e)));return!Number.isFinite(t)||t<=0?i:Wt(e,t,o,n)===e?r:i}function Lr(e,t,o,n){return(o-t)/n<=10?Math.max(t,Math.min(o,t+Math.round((e-t)/n)*n)):Er(e,t,o)}var Nr={stiffness:300,damping:25,mass:.8},Rr={stiffness:220,damping:22,mass:1};function Qn(e,t,o,n,r){let i=(-r.stiffness*(e-o)-r.damping*t)/r.mass,a=t+i*n;return{x:e+a*n,v:a}}function Zn(e,t,o,n=.01){return Math.abs(e-o)<n&&Math.abs(t)<n}var Pr=0,Gr=.5,Ir=.9,Br=.1,Dr=3,Hr=800,eo=8,gt=3,Or=20,no=10,_t=12,zr=`
.sl {
  position: relative;
  height: ${Pe}px;
  overflow: hidden;
  background: ${D(1)};
  border-radius: 0;
  cursor: pointer;
  user-select: none;
  touch-action: none;
}
.sl:focus-visible { outline: 2px solid ${w.secondary}; outline-offset: -2px; }

/* Behind everything, and scaled rather than resized: a width change is layout,
   a transform is not, and this moves on every pointer event of a drag. */
.sl-fill {
  position: absolute; inset: 0;
  transform-origin: left center;
  transform: scaleX(0);
  background: ${D(3)};
  transition: background ${H.ui};
  pointer-events: none;
}
.sl[data-awake] .sl-fill { background: ${D(5)}; }

.sl-marks { position: absolute; inset: 0; pointer-events: none; }
.sl-mark {
  position: absolute; top: 50%;
  width: 1px; height: 8px;
  transform: translate(-50%, -50%);
  background: transparent;
  transition: background ${H.ui};
}
.sl[data-awake] .sl-mark { background: ${de}; }

.sl-handle {
  position: absolute; top: 50%; left: 0;
  width: ${gt}px; height: ${Or}px;
  background: ${w.primary};
  pointer-events: none;
  opacity: ${Pr};
  /* Two transitions, two jobs: opacity and the squash are eased, the position
     is not \u2014 it is written every frame and must not lag the pointer. */
  transition: opacity ${H.ui}, scale ${H.ui};
  scale: 0.25 1;
}
.sl[data-awake] .sl-handle { opacity: ${Gr}; scale: 1 1; }
.sl[data-dragging] .sl-handle { opacity: ${Ir}; }
.sl[data-dodge] .sl-handle { opacity: ${Br}; scale: 1 0.75; }

.sl-label, .sl-value {
  position: absolute; top: 50%;
  transform: translateY(-50%);
  font-size: ${T.body}px; font-weight: ${V.medium};
  line-height: 1;
  white-space: nowrap;
  transition: color ${H.ui};
}
.sl-label { left: ${no}px; color: ${w.secondary}; pointer-events: none; }
.sl-value {
  right: ${_t}px;
  color: ${w.secondary};
  /* Inter has tabular figures, so the number stops shifting as it changes
     without loading a second face for it. */
  font-variant-numeric: tabular-nums;
  pointer-events: auto;
  border-bottom: 1px solid transparent;
  padding-bottom: 1px;
}
.sl[data-awake] .sl-value { color: ${w.primary}; }
/* Only after the hover delay: the underline is the promise that a click here
   edits rather than seeks, and it must not appear during a drag. */
.sl-value[data-editable] { border-bottom-color: ${w.secondary}; cursor: text; }

.sl-input {
  position: absolute; right: ${_t}px; top: 50%;
  transform: translateY(-50%);
  width: 5ch;
  padding: 0 0 1px; border: 0;
  border-bottom: 1px solid ${w.secondary};
  background: none; outline: none;
  text-align: right;
  font: inherit;
  font-size: ${T.body}px; font-weight: ${V.medium};
  font-variant-numeric: tabular-nums;
  color: ${w.primary};
}
`,to="align-slider";function Fr(e){if(e.querySelector(`#${to}`))return;let t=document.createElement("style");t.id=to,t.textContent=zr,e.appendChild(t)}function bt(e,t){Fr(e);let o=t.min??0,n=t.max??1,r=t.step??.01,i=t.value,a=document.createElement("div");a.className="sl",a.tabIndex=0,a.setAttribute("role","slider"),a.setAttribute("aria-label",t.label),a.setAttribute("aria-valuemin",String(o)),a.setAttribute("aria-valuemax",String(n));let l=document.createElement("div");l.className="sl-fill";let d=document.createElement("div");d.className="sl-marks";for(let m of Ar(o,n,r)){let M=document.createElement("div");M.className="sl-mark",M.style.left=`${m}%`,d.appendChild(M)}let v=document.createElement("div");v.className="sl-handle";let k=document.createElement("span");k.className="sl-label",k.textContent=t.label;let S=document.createElement("span");S.className="sl-value",a.append(d,l,v,k,S);let u=ft(i,o,n),b=0,$=null,y=0,G=0;function c(){return a.offsetWidth}function x(){l.style.transform=`scaleX(${u/100})`;let m=c(),M=u/100*m,Z=Math.max(gt,Math.min(m-gt,M))-gt/2;v.style.transform=`translate(${Z}px, -50%)`;let we=!1;if(m>0){let ve=no+k.offsetWidth+eo,fe=m-_t-S.offsetWidth-eo;we=M<ve||M>fe}a.toggleAttribute("data-dodge",we)}function L(){let m=Jn(i,r,o,n);S.textContent=t.unit?`${i.toFixed(m)}${t.unit}`:i.toFixed(m),a.setAttribute("aria-valuenow",String(i)),a.setAttribute("aria-valuetext",S.textContent)}function Y(){y&&cancelAnimationFrame(y),y=0,$=null,b=0}function ee(){return typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches}function le(m,M=Nr){if(ee()){Y(),u=m,x();return}if($=m,G=performance.now(),y)return;let Z=we=>{let ve=Math.min((we-G)/1e3,.03333333333333333);if(G=we,$===null){y=0;return}let fe=Qn(u,b,$,ve,M);if(u=fe.x,b=fe.v,x(),Zn(u,b,$)){u=$,b=0,$=null,y=0,x();return}y=requestAnimationFrame(Z)};y=requestAnimationFrame(Z)}function oe(m,M){let Z=Wt(m,r,o,n),we=Z!==i;i=Z,L(),M?le(ft(i,o,n)):(Y(),u=ft(i,o,n),x()),we&&t.onChange(i)}let j=null,J=!0,g=null,A=1,E=0,F=0;function s(m){if(E=m,m===0){a.style.width="",a.style.transform="";return}a.style.width=`calc(100% + ${Math.abs(m)}px)`,a.style.transform=m<0?`translateX(${m}px)`:""}function h(){if(E===0)return;if(ee()){s(0),a.style.width="",a.style.transform="";return}let m=0,M=performance.now(),Z=we=>{let ve=Math.min((we-M)/1e3,.03333333333333333);M=we;let fe=Qn(E,m,0,ve,Rr);if(m=fe.v,s(fe.x),Zn(fe.x,m,0,.05)){s(0),a.style.width="",a.style.transform="",F=0;return}F=requestAnimationFrame(Z)};F=requestAnimationFrame(Z)}function f(m){if(!g)return 0;let M=c();return M<=0?0:(m-g.left)/A/M}let C=m=>{if(!(U||m.button!==0)){m.preventDefault();try{a.setPointerCapture(m.pointerId)}catch{}j={x:m.clientX,y:m.clientY},J=!0,g=a.getBoundingClientRect(),A=Le(a).x||1,a.setAttribute("data-awake","")}},B=m=>{if(!j)return;let M=m.clientX-j.x,Z=m.clientY-j.y;J&&Math.hypot(M,Z)>Dr&&(J=!1,a.setAttribute("data-dragging","")),!(J||!g)&&(ee()||(m.clientX<g.left?s(Vn(g.left-m.clientX,-1)):m.clientX>g.right?s(Vn(m.clientX-g.right,1)):E!==0&&s(0)),Y(),oe(qn(f(m.clientX),o,n),!1))},R=m=>{j&&(J&&oe(Lr(qn(f(m.clientX),o,n),o,n,r),!0),t.onCommit?.(i),h(),j=null,a.removeAttribute("data-dragging"),_||a.removeAttribute("data-awake"))},I=()=>{j&&(s(0),a.style.width="",a.style.transform="",j=null,a.removeAttribute("data-dragging"),_||a.removeAttribute("data-awake"))},_=!1,O=()=>{_=!0,a.setAttribute("data-awake","")},W=()=>{_=!1,j||a.removeAttribute("data-awake")},U=null,N=!1,re=0;function ie(){if(U)return;U=document.createElement("input"),U.className="sl-input",U.type="text",U.setAttribute("aria-label",`${t.label} value`),U.value=i.toFixed(Jn(i,r,o,n)),S.style.display="none",a.appendChild(U),U.focus(),U.select();let m=M=>{if(U){if(M){let Z=parseFloat(U.value);Number.isFinite(Z)&&(oe(Math.max(o,Math.min(n,Z)),!0),t.onCommit?.(i))}U.remove(),U=null,S.style.display="",ce(!1),a.focus()}};U.addEventListener("keydown",M=>{M.stopPropagation(),M.key==="Enter"?(M.preventDefault(),m(!0)):M.key==="Escape"&&(M.preventDefault(),m(!1))}),U.addEventListener("blur",()=>m(!0)),U.addEventListener("pointerdown",M=>M.stopPropagation())}function ce(m){N=m,S.toggleAttribute("data-editable",m)}S.addEventListener("pointerenter",()=>{U||j||(re=window.setTimeout(()=>ce(!0),Hr))}),S.addEventListener("pointerleave",()=>{clearTimeout(re),U||ce(!1)}),S.addEventListener("pointerdown",m=>{N&&(m.stopPropagation(),m.preventDefault(),ie())});let P=m=>{if(m.target!==a||m.altKey||m.metaKey||m.ctrlKey)return;let M=Tr(m.key,i,o,n,r,m.shiftKey);if(M===void 0){if(m.key!=="Enter")return;m.preventDefault(),m.stopPropagation(),ce(!0),ie();return}m.preventDefault(),m.stopPropagation(),oe(M,!1),t.onCommit?.(i)};return a.addEventListener("pointerdown",C),a.addEventListener("pointermove",B),a.addEventListener("pointerup",R),a.addEventListener("pointercancel",I),a.addEventListener("lostpointercapture",I),a.addEventListener("pointerenter",O),a.addEventListener("pointerleave",W),a.addEventListener("keydown",P),L(),requestAnimationFrame(x),{el:a,set(m){i=Wt(m,r,o,n),L(),Y(),u=ft(i,o,n),x()},destroy(){Y(),F&&cancelAnimationFrame(F),clearTimeout(re),a.remove()}}}function ye(e,t){return getComputedStyle(e).getPropertyValue(t).trim()}function Wr(e,t){let o=parseFloat(e);if(e.endsWith("px")&&Number.isFinite(o)){let r=At(o,t)[0];if(r)return r}return et(e)?dt(e,t)[0]??null:null}function _r(e){if(e.length===0)return"";let t=new Map;for(let n of e){let r=t.get(n.selector)??[];r.push(n),t.set(n.selector,r)}let o=["These changes were made live in the browser and are not in the source yet.","Apply them, preferring the named token wherever one is given.",""];for(let[n,r]of t){o.push(`${n} {`);for(let i of r){let a=i.token?`var(${i.token})`:i.to,l=i.token?`  /* ${i.to}, was ${i.from} */`:`  /* was ${i.from} */`;o.push(`  ${i.prop}: ${a};${l}`)}o.push("}","")}return o.join(`
`).trimEnd()}function oo(){let e=new Map,t=!1;function o(r){let i=e.get(r);if(i)return i;let a=new Map;return e.set(r,a),a}function n(r,i,a){let l=r.style;a.inline?l.setProperty(i,a.inline):l.removeProperty(i)}return{get armed(){return t},arm(){t=!0},disarm(){let r=this.revertAll();return t=!1,r},set(r,i,a){if(!t)return;let l=o(r);l.has(i)||l.set(i,{inline:r.style.getPropertyValue(i),computed:ye(r,i)}),r.style.setProperty(i,a)},revert(r,i){let a=e.get(r),l=a?.get(i);!a||!l||(n(r,i,l),a.delete(i),a.size===0&&e.delete(r))},revertAll(){let r=0;for(let[i,a]of e)for(let[l,d]of a)n(i,l,d),r+=1;return e.clear(),r},touched(r,i){return e.get(r)?.has(i)??!1},touchedProps(r){return[...e.get(r)?.keys()??[]].sort()},changes(){let r=[];for(let[i,a]of e)for(let[l,d]of a)r.push({el:i,prop:l,from:d.computed,to:ye(i,l)});return r},asPrompt(){let r=[];for(let[i,a]of e){let l=ct(i),d=tt(i);for(let[v,k]of a){let S=ye(i,v);S!==k.computed&&r.push({selector:d,prop:v,from:k.computed,to:S,token:Wr(S,l)})}}return _r(r)}}}var ro={x:0,y:2,blur:8,spread:0,colour:"rgba(0, 0, 0, 0.2)",inset:!1};function Xr(e,t){let o=[],n=0,r="";for(let i of e){if(i==="("?n+=1:i===")"&&(n-=1),i===t&&n===0){o.push(r.trim()),r="";continue}r+=i}return r.trim()&&o.push(r.trim()),o.filter(Boolean)}function Yr(e){let t=e.trim();if(!t||t==="none")return null;let o=t,n=/(^|\s)inset(\s|$)/.test(o);n&&(o=o.replace(/(^|\s)inset(\s|$)/," ").trim());let r=[];o=o.replace(/[a-z-]+\([^)]*\)/gi,d=>(r.push(d),`\0${r.length-1}`));let i=o.split(/\s+/).filter(Boolean).map(d=>d.startsWith("\0")?r[Number(d.slice(1))]:d),a=[],l=[];for(let d of i)/^-?\d*\.?\d+(px|em|rem|%)?$/.test(d)?a.push(parseFloat(d)):l.push(d);return a.length<2?null:{x:a[0]??0,y:a[1]??0,blur:a[2]??0,spread:a[3]??0,colour:l[0]??"rgba(0, 0, 0, 0.2)",inset:n}}function io(e){return!e||e.trim()==="none"?[]:Xr(e,",").map(Yr).filter(t=>t!==null)}function Kr(e){let t=`${e.x}px ${e.y}px ${e.blur}px ${e.spread}px ${e.colour}`;return e.inset?`inset ${t}`:t}function ao(e){return e.length===0?"none":e.map(Kr).join(", ")}function Xt(e,t,o){let n=[...e];if(t<0||t>=n.length||o<0||o>=n.length)return n;let[r]=n.splice(t,1);return r!==void 0&&n.splice(o,0,r),n}function Yt(e){let t=/blur\(\s*(-?\d*\.?\d+)px\s*\)/i.exec(e||"");return t?parseFloat(t[1]):0}function so(e){return e<=0?"none":`blur(${e}px)`}var Kt=["top","right","bottom","left"],jr=["border-top-left-radius","border-top-right-radius","border-bottom-right-radius","border-bottom-left-radius"],Ur=[{name:"Type",specs:[{prop:"font-size",label:"Size",kind:"length",glyph:"fontSize",min:8,max:96,step:1,unit:"px"},{prop:"font-weight",label:"Weight",kind:"number",glyph:"fontWeight",min:100,max:900,step:100},{prop:"line-height",label:"Line height",kind:"length",glyph:"lineHeight",min:0,max:96,step:1,unit:"px"},{prop:"letter-spacing",label:"Tracking",kind:"length",glyph:"tracking",min:-4,max:12,step:.1,unit:"px"},{prop:"font-style",label:"Style",kind:"choice",glyph:"italic",options:["normal","italic"],more:!0},{prop:"text-align",label:"Align",kind:"choice",glyph:"textAlign",options:["start","center","end","justify"],more:!0},{prop:"text-transform",label:"Case",kind:"choice",glyph:"textCase",options:["none","uppercase","lowercase","capitalize"],more:!0},{prop:"text-decoration-line",label:"Decoration",kind:"choice",glyph:"underline",options:["none","underline","line-through"],more:!0}]},{name:"Colour",specs:[{prop:"color",label:"Text",kind:"colour",glyph:"textColour"},{prop:"background-color",label:"Background",kind:"colour",glyph:"backgroundColour"},{prop:"border-color",label:"Border",kind:"colour",glyph:"borderColour",more:!0},{prop:"opacity",label:"Opacity",kind:"number",glyph:"opacity",min:0,max:1,step:.01}]},{name:"Box",specs:[{prop:"padding",label:"Padding",kind:"length",glyph:"padding",min:0,max:128,step:1,unit:"px",sides:Kt.map(e=>`padding-${e}`)},{prop:"margin",label:"Margin",kind:"length",glyph:"margin",min:-64,max:128,step:1,unit:"px",sides:Kt.map(e=>`margin-${e}`)},{prop:"width",label:"Width",kind:"length",glyph:"widthIcon",min:0,max:1600,step:1,unit:"px",more:!0},{prop:"height",label:"Height",kind:"length",glyph:"heightIcon",min:0,max:1200,step:1,unit:"px",more:!0},{prop:"box-sizing",label:"Sizing",kind:"choice",glyph:"boxSizing",options:["content-box","border-box"]}]},{name:"Border",specs:[{prop:"border-width",label:"Width",kind:"length",glyph:"borderWidth",min:0,max:24,step:1,unit:"px",sides:Kt.map(e=>`border-${e}-width`)},{prop:"border-style",label:"Style",kind:"choice",glyph:"borderStyle",options:["none","solid","dashed","dotted"]},{prop:"border-radius",label:"Radius",kind:"length",glyph:"borderRadius",min:0,max:64,step:1,unit:"px",sides:jr}]},{name:"Effects",specs:[{prop:"box-shadow",label:"Shadow",kind:"shadow",glyph:"shadow"},{prop:"backdrop-filter",label:"Backdrop blur",kind:"blur",glyph:"backdrop",min:0,max:40,step:1,unit:"px",more:!0}]},{name:"Layout",specs:[{prop:"display",label:"Display",kind:"choice",glyph:"boxSizing",options:["block","flex","grid","inline-flex","inline-block","none"]},{prop:"flex-direction",label:"Direction",kind:"choice",glyph:"flexDirection",options:["row","column","row-reverse","column-reverse"],more:!0},{prop:"justify-content",label:"Justify",kind:"choice",glyph:"justify",options:["flex-start","center","flex-end","space-between"],more:!0},{prop:"align-items",label:"Align",kind:"choice",glyph:"alignItems",options:["stretch","flex-start","center","flex-end"],more:!0},{prop:"flex-wrap",label:"Wrap",kind:"choice",glyph:"flexWrap",options:["nowrap","wrap"],more:!0},{prop:"gap",label:"Gap",kind:"length",glyph:"gap",min:0,max:96,step:1,unit:"px"}]}];function yt(e){let t=parseFloat(e);return Number.isFinite(t)?t:0}function lo(e){let t=/^rgba?\(([^)]+)\)$/.exec(e.trim());if(!t)return/^#[0-9a-f]{6}$/i.test(e.trim())?e.trim():"#000000";let[o,n,r]=t[1].split(/[\s,/]+/).filter(Boolean).map(Number);if(o===void 0||n===void 0||r===void 0)return"#000000";let i=a=>Math.max(0,Math.min(255,Math.round(a))).toString(16).padStart(2,"0");return`#${i(o)}${i(n)}${i(r)}`}var Vr=320,qr=`
/*
 * The reset the shadow root does not come with.
 *
 * The host sets all:initial, which stops the page's styles leaking in and also
 * means there is no box-sizing rule at all, so padding and borders are added
 * outside a flex-computed width. The hex field's 12px of padding and 2px of
 * border did exactly that: the colour rows measured 306px inside a 294px
 * column and hung past every other row in the panel.
 *
 * Scoped to the dock so it cannot reach the page.
 */
.edit-dock, .edit-dock * { box-sizing: border-box; }

.edit-dock {
  position: fixed;
  top: ${z.edge}px;
  left: ${z.edge}px;
  width: ${Vr}px;
  max-height: calc(100vh - ${z.edge*2}px);
  overflow: hidden;
  display: none;
  flex-direction: column;
  pointer-events: auto;
  font-family: ${T.stack};
  font-synthesis: none;
  font-size: ${T.body}px;
  font-weight: ${V.regular};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${w.primary};
  background: ${ge};
  box-shadow: ${Ne};
}
.edit-dock[data-open] { display: flex; }

/*
 * The panel is summoned by a keystroke you meant, so it arrives rather than
 * appears. 160ms on the UI curve, an 8px rise and a fade: enough to say where
 * it came from, short enough that arming twice in a row never feels slow.
 *
 * @starting-style animates the first frame after display changes, with no
 * keyframes to restart and nothing to clean up.
 */
@starting-style {
  .edit-dock[data-open] { opacity: 0; translate: 0 8px; }
}
.edit-dock {
  opacity: 1;
  translate: 0 0;
  transition: opacity ${H.ui}, translate ${H.ui}, display ${H.ui} allow-discrete;
}

/* The bar that says the tool wrote this row. Worth a fade: it is the panel
   admitting to something, and it should be noticed without being a movement. */
.edit-row::before { transition: opacity ${H.ui}; }

@media (prefers-reduced-motion: reduce) {
  .edit-dock { transition: opacity ${H.ui}; translate: none; }
  @starting-style { .edit-dock[data-open] { translate: none; } }
  .edit-opt:active, .edit-mini:active, .edit-add:active,
  .edit-action:active, .edit-revert:active { scale: 1; }
}

.edit-head {
  display: flex; align-items: center; gap: ${z.base}px;
  flex: none;
  height: ${Pe}px;
  padding: 0 ${z.base}px 0 ${z.roomy}px;
  border-bottom: 1px solid ${de};
}
.edit-title { font-size: ${T.title}px; font-weight: ${V.semibold}; }
.edit-subject {
  flex: 1; min-width: 0;
  color: ${w.tertiary};
  font-size: ${T.tag}px;
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
  /*
   * A flex item's min-height is auto, so it refuses to shrink below its own
   * content and overflow-y never has anything to scroll. The panel
   * grew past its max-height instead, and a wheel over it fell through to the
   * page \u2014 which made every group below the fold unreachable. Same shape as
   * the min-width: auto that broke the colour popover in the lab.
   */
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
  /*
   * Present but not part of the design until you reach for it. The panel is
   * mostly a column of controls, and a permanent light bar down its edge reads
   * as one more thing to look at.
   */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  transition: scrollbar-color ${H.ui};
  padding: ${z.base}px;
}
.edit-body:hover, .edit-body:focus-within {
  scrollbar-color: ${D(6)} transparent;
}
/* WebKit does not read scrollbar-color, so it gets the same thing said twice. */
.edit-body::-webkit-scrollbar { width: 8px; }
.edit-body::-webkit-scrollbar-track { background: transparent; }
.edit-body::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 0;
  transition: background ${H.ui};
}
.edit-body:hover::-webkit-scrollbar-thumb,
.edit-body:focus-within::-webkit-scrollbar-thumb { background: ${D(6)}; }
/* Nothing a control does may push the panel wider than the panel. */
.edit-line > * { min-width: 0; }

/*
 * Three times the gap inside a group. Ambiguous spacing is a functional bug,
 * not an ugly one: at 12px against a 6px row gap, a group's name read as
 * belonging to the rows above it as easily as the ones below.
 */
.edit-group + .edit-group { margin-top: 24px; }
/*
 * The section, and the label inside it, were both 11px and two pixels apart,
 * and the child was the brighter of the two. Hierarchy inverted.
 *
 * They are the same size and the same colour now, and told apart by weight,
 * case and tracking, which is what carries emphasis without making the
 * important thing large or the subordinate thing unreadable.
 */
.edit-group-name {
  display: block;
  margin: 0 0 ${z.base}px 2px;
  font-size: ${T.tag}px; font-weight: ${V.semibold};
  letter-spacing: 0.04em; text-transform: uppercase;
  color: ${w.secondary};
}
/*
 * minmax(0, 1fr), not 1fr.
 *
 * A grid track sized 1fr still refuses to go below its content's min-content
 * width, so one row whose contents will not shrink drags the whole column
 * wider than the panel. That is what made the colour rows 306px inside a 294px
 * column and hang past every other row: an input carries an intrinsic width
 * from its size attribute, and the track grew to fit it.
 */
.edit-rows { display: grid; grid-template-columns: minmax(0, 1fr); gap: ${z.base}px; }

/*
 * A row the tool has written shows its revert control and nothing else.
 *
 * There was a bar down the leading edge as well, which said the same thing
 * twice: the revert arrow only appears on a touched row, so it already marks
 * which rows are the tool's doing, and it is a control rather than a stripe.
 * Two marks for one fact is noise in a panel with twenty rows in it.
 */
.edit-row { position: relative; }

.edit-line {
  display: flex; align-items: center; gap: ${z.base}px;
  min-height: ${Pe}px;
  padding: 0 10px;
  background: ${D(1)};
}
.edit-glyph {
  flex: none;
  display: grid; place-items: center;
  width: 15px; height: 15px;
  color: ${w.tertiary};
}

.edit-label {
  flex: none; width: 74px;
  color: ${w.secondary};
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.edit-field { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; }

/* Choice: one button per value, the current one filled. Buttons rather than a
   select, because a select hides every option until you open it and the whole
   value of these is seeing the alternatives. */
/*
 * A segmented control: the options share the row rather than huddling at the
 * left with the rest of it empty. Nothing was ever going to fill that space,
 * so it read as a control that had failed to lay itself out.
 *
 * They wrap when there are too many to fit, and a wrapped row shares its own
 * width, so six display values come out as two even rows rather than four and
 * a ragged two.
 */
/* The group has to grow before its buttons can share anything: it is itself a
   flex item, and a flex item is content-sized until told otherwise. */
.edit-choice { flex: 1; min-width: 0; display: flex; flex-wrap: wrap; gap: 2px; }
.edit-choice .edit-opt { flex: 1 1 auto; }
.edit-opt {
  /* 24px is WCAG's AA floor and these were 21 by a padding accident. */
  min-height: 24px;
  padding: 5px 8px; border: 0; border-radius: 0;
  background: ${D(2)}; color: ${w.secondary};
  font: inherit; font-size: ${T.tag}px; cursor: pointer;
  transition: background ${H.ui}, color ${H.ui};
}
.edit-opt:hover { background: ${D(4)}; color: ${w.primary}; }
.edit-opt:active { scale: 0.96; }
.edit-opt:focus-visible { outline: 2px solid ${w.secondary}; outline-offset: -2px; }
.edit-opt[data-on] { background: ${w.primary}; color: ${ge}; }

.edit-swatch {
  flex: none; width: 24px; height: 24px;
  padding: 0; border: 0; border-radius: 0;
  box-shadow: inset 0 0 0 1px ${de};
  cursor: pointer;
}
.edit-hex {
  flex: 1; min-width: 0;
  height: 24px; padding: 0 6px;
  border: 1px solid ${de}; border-radius: 0;
  background: ${D(1)}; color: ${w.primary};
  font: inherit; font-size: ${T.tag}px;
  font-variant-numeric: tabular-nums;
}
.edit-hex:focus-visible { outline: 2px solid ${w.secondary}; outline-offset: -2px; }

.edit-row-name {
  display: flex; align-items: center; gap: 6px;
  /* Half the gap between rows, so the name binds to its own control rather
     than floating between two of them. */
  margin: 0 0 ${z.tight}px 10px;
  color: ${w.secondary};
  font-size: ${T.tag}px; font-weight: ${V.regular};
}
.edit-row-name .edit-glyph { color: ${w.tertiary}; }
/* Two columns of badges. They size to their own digits, so the grid can be
   tight without anything being clipped. */
.edit-sides { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; }

/* A shadow is a list, so its row is a block rather than a line. */
.edit-line-block { display: block; padding: ${z.base}px 10px; }
.edit-stack { display: grid; gap: 6px; }
.edit-layer { background: ${D(2)}; padding: 6px; }
.edit-layer-head {
  display: flex; align-items: center; gap: 4px;
  margin-bottom: 4px;
}
.edit-layer-name {
  flex: 1; min-width: 0;
  /*
   * Secondary, not tertiary. Tertiary is measured against the ground and
   * clears 4.61:1 there; on this card it is a film over a film and falls to
   * 4.20:1. The constraint is written down in theme.ts and this is the first
   * place in the panel that actually meets it.
   */
  color: ${w.secondary};
  font-size: ${T.tag}px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.edit-layer-head .edit-swatch { width: 24px; height: 24px; }
.edit-mini {
  flex: none;
  display: grid; place-items: center;
  width: 24px; height: 24px;
  padding: 0; border: 0; border-radius: 0;
  background: ${D(3)}; color: ${w.secondary};
  font: inherit; font-size: ${T.tag}px; line-height: 1;
  cursor: pointer;
}
.edit-mini:hover:not(:disabled) { background: ${D(5)}; color: ${w.primary}; }
.edit-mini:active:not(:disabled) { scale: 0.96; }
.edit-mini:disabled { color: ${w.disabled}; cursor: default; }
.edit-mini:focus-visible { outline: 2px solid ${w.secondary}; outline-offset: -2px; }
.edit-add {
  width: 100%;
  padding: 7px; border: 0; border-radius: 0;
  background: ${D(2)}; color: ${w.secondary};
  font: inherit; font-size: ${T.tag}px; cursor: pointer;
}
.edit-add:hover { background: ${D(4)}; color: ${w.primary}; }
.edit-add:active { scale: 0.96; }
.edit-add:focus-visible { outline: 2px solid ${w.secondary}; outline-offset: -2px; }
.edit-sides > * { min-width: 0; }

.edit-linked {
  width: 24px; height: 24px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; color: ${w.tertiary};
  cursor: pointer;
}
.edit-linked[data-on] { background: ${D(4)}; color: ${w.primary}; }
.edit-linked:focus-visible { outline: 2px solid ${w.secondary}; outline-offset: -2px; }

.edit-revert {
  width: 24px; height: 24px;
  display: none; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; color: ${w.tertiary};
  cursor: pointer;
}
.edit-row[data-touched] .edit-revert { display: grid; }
.edit-revert:hover { color: ${w.primary}; }
.edit-revert:active { scale: 0.96; }
.edit-revert:focus-visible { outline: 2px solid ${w.secondary}; outline-offset: -2px; }

.edit-more {
  width: 100%; margin-top: ${z.tight}px;
  padding: 6px; border: 0; border-radius: 0;
  background: none; color: ${w.tertiary};
  font: inherit; font-size: ${T.tag}px; cursor: pointer;
  text-align: left;
}
.edit-more:hover { color: ${w.primary}; }

.edit-foot {
  flex: none;
  display: flex; align-items: center; gap: ${z.base}px;
  padding: ${z.base}px;
  border-top: 1px solid ${de};
}
.edit-count { flex: 1; color: ${w.tertiary}; font-size: ${T.tag}px; }
.edit-action {
  padding: 7px 10px; border: 0; border-radius: 0;
  background: ${D(3)}; color: ${w.primary};
  font: inherit; font-size: ${T.tag}px; font-weight: ${V.medium};
  cursor: pointer;
  transition: background ${H.ui};
}
.edit-action:hover { background: ${D(5)}; }
.edit-action:active:not(:disabled) { scale: 0.96; }
.edit-action:disabled { color: ${w.disabled}; cursor: default; background: ${D(1)}; }
.edit-action:focus-visible { outline: 2px solid ${w.secondary}; outline-offset: -2px; }

.edit-empty {
  padding: ${z.roomy}px;
  color: ${w.tertiary};
}
`;function co(e,t){let o=document.createElement("style");o.textContent=qr,e.appendChild(o);let n=document.createElement("div");n.className="edit-dock",n.setAttribute("role","region"),n.setAttribute("aria-label","Edit the locked element");let r=document.createElement("div");r.className="edit-head";let i=document.createElement("span");i.className="edit-title",i.textContent="Edit";let a=document.createElement("span");a.className="edit-subject",r.append(i,a);let l=document.createElement("div");l.className="edit-body";let d=document.createElement("div");d.className="edit-foot";let v=document.createElement("span");v.className="edit-count";let k=document.createElement("button");k.type="button",k.className="edit-action",k.textContent="Copy as prompt";let S=document.createElement("button");S.type="button",S.className="edit-action",S.textContent="Revert all",d.append(v,S,k),n.append(r,l,d),e.appendChild(n);let u=null,b=!1,$=!1,y=[],G=new Set;function c(){let s=t.changes().length;v.textContent=s===0?"No changes":`${s} change${s===1?"":"s"}`,k.disabled=s===0,S.disabled=s===0}function x(){if(u){for(let s of y){let f=(s.spec.sides??[s.spec.prop]).some(C=>t.touched(u,C));s.el.toggleAttribute("data-touched",f)}c()}}function L(s,h){u&&(t.set(u,s,h),x())}function Y(s,h,f){let C=bt(e,{label:f,value:u?yt(ye(u,h)):0,min:s.min??0,max:s.max??100,step:s.step??1,...s.unit?{unit:s.unit}:{},onChange:B=>{let R=`${B}${s.unit??""}`;if(s.sides&&G.has(s.prop)){for(let I of s.sides)L(I,R);for(let I of y)if(I.spec.prop===s.prop)for(let _ of I.sliders)_.set(B)}else L(h,R)}});return{el:C.el,slider:C,sync:()=>{u&&C.set(yt(ye(u,h)))}}}function ee(s,h,f){let C=/(^|\s)(top|bottom)(\s|$)/.test(f),B=f==="top"?"sideTop":f==="right"?"sideRight":f==="bottom"?"sideBottom":f==="left"?"sideLeft":void 0,R=jn(e,{label:`${s.label} ${f}`,value:u?yt(ye(u,h)):0,min:s.min??0,max:s.max??999,step:s.step??1,axis:C?"y":"x",...B?{glyph:B}:{text:f},onChange:I=>{let _=`${I}${s.unit??""}`;if(G.has(s.prop)&&s.sides){for(let O of s.sides)L(O,_);for(let O of y)if(O.spec.prop===s.prop)for(let W of O.scrubs)W.set(I)}else L(h,_)}});return{el:R.el,scrub:R,sync:()=>{u&&R.set(yt(ye(u,h)))}}}function le(s){let h=document.createElement("div");h.className="edit-choice",h.setAttribute("role","group"),h.setAttribute("aria-label",s.label);let f=[];for(let B of s.options??[]){let R=document.createElement("button");R.type="button",R.className="edit-opt",R.textContent=B,R.addEventListener("click",()=>{L(s.prop,B),C()}),f.push(R),h.appendChild(R)}function C(){let B=u?ye(u,s.prop):"";for(let R of f){let I=R.textContent===B;R.toggleAttribute("data-on",I),R.setAttribute("aria-pressed",String(I))}}return{el:h,sync:C}}function oe(s){let h=document.createElement("div");h.className="edit-field";let f=document.createElement("input");f.type="color",f.className="edit-swatch",f.setAttribute("aria-label",`${s.label} colour`);let C=document.createElement("input");C.type="text",C.className="edit-hex",C.spellcheck=!1,C.setAttribute("aria-label",`${s.label} colour, as hex`),f.addEventListener("input",()=>{C.value=f.value,L(s.prop,f.value)}),C.addEventListener("change",()=>{let R=C.value.trim();if(!/^#?[0-9a-f]{3}$|^#?[0-9a-f]{6}$/i.test(R)){B();return}let I=R.startsWith("#")?R:`#${R}`;f.value=I.length===4?`#${I[1]}${I[1]}${I[2]}${I[2]}${I[3]}${I[3]}`:I,L(s.prop,f.value)});function B(){let R=u?ye(u,s.prop):"",I=lo(R);f.value=I,C.value=I}return h.append(f,C),{el:h,sync:B}}function j(s){let h=document.createElement("div");h.className="edit-stack";let f=[],C=[];function B(){L(s.prop,ao(f))}function R(){for(let O of C)O.destroy();C=[],h.textContent="",f.forEach((O,W)=>{let U=document.createElement("div");U.className="edit-layer";let N=document.createElement("div");N.className="edit-layer-head";let re=document.createElement("span");re.className="edit-layer-name",re.textContent=`Layer ${W+1}`;let ie=document.createElement("input");ie.type="color",ie.className="edit-swatch",ie.setAttribute("aria-label",`Layer ${W+1} colour`),ie.value=lo(O.colour),ie.addEventListener("input",()=>{f[W]={...O,colour:ie.value},O=f[W],B()});let ce=document.createElement("button");ce.type="button",ce.className="edit-opt",ce.textContent="inset",ce.toggleAttribute("data-on",O.inset),ce.addEventListener("click",()=>{f[W]={...O,inset:!O.inset},O=f[W],ce.toggleAttribute("data-on",O.inset),B()});let P=document.createElement("button");P.type="button",P.className="edit-mini",P.setAttribute("aria-label",`Move layer ${W+1} up`),P.appendChild(be("arrowUp",12)),P.disabled=W===0,P.addEventListener("click",()=>{f=Xt(f,W,W-1),B(),R()});let m=document.createElement("button");m.type="button",m.className="edit-mini",m.setAttribute("aria-label",`Move layer ${W+1} down`),m.appendChild(be("arrowDown",12)),m.disabled=W===f.length-1,m.addEventListener("click",()=>{f=Xt(f,W,W+1),B(),R()});let M=document.createElement("button");M.type="button",M.className="edit-mini",M.setAttribute("aria-label",`Remove layer ${W+1}`),M.appendChild(be("cross",12)),M.addEventListener("click",()=>{f=f.filter((ve,fe)=>fe!==W),B(),R()}),N.append(re,ie,ce,P,m,M);let Z=document.createElement("div");Z.className="edit-sides";let we=[{key:"x",label:"x",min:-64,max:64},{key:"y",label:"y",min:-64,max:64},{key:"blur",label:"blur",min:0,max:96},{key:"spread",label:"spread",min:-32,max:32}];for(let ve of we){let fe=bt(e,{label:ve.label,value:O[ve.key],min:ve.min,max:ve.max,step:1,unit:"px",onChange:Fo=>{f[W]={...f[W],[ve.key]:Fo},O=f[W],B()}});C.push(fe),Z.appendChild(fe.el)}U.append(N,Z),h.appendChild(U)});let _=document.createElement("button");_.type="button",_.className="edit-add",_.textContent=f.length===0?"Add a shadow":"Add another layer",_.addEventListener("click",()=>{f=[...f,{...ro}],B(),R()}),h.appendChild(_)}function I(){f=u?io(ye(u,s.prop)):[],R()}return{el:h,sync:I,sliders:[]}}function J(s){let h=bt(e,{label:s.label,value:u?Yt(ye(u,s.prop)):0,min:s.min??0,max:s.max??40,step:s.step??1,unit:s.unit??"px",onChange:f=>L(s.prop,so(f))});return{el:h.el,slider:h,sync:()=>{u&&h.set(Yt(ye(u,s.prop)))}}}function g(s){let h=document.createElement("div");h.className="edit-row";let f=document.createElement("div");f.className="edit-line";let C=document.createElement("span");C.className="edit-label",C.textContent=s.label;let B=document.createElement("div");B.className="edit-field";let R=[],I=[],_=[];if(s.sides){let N=document.createElement("div");N.className="edit-sides",N.style.flex="1";for(let ie of s.sides){let ce=ie.split("-").filter(m=>m!=="border"&&m!=="radius"&&m!=="width"&&m!=="padding"&&m!=="margin").join(" ")||ie,P=ee(s,ie,ce);I.push(P.scrub),_.push(P.sync),N.appendChild(P.el)}let re=document.createElement("button");re.type="button",re.className="edit-linked",re.setAttribute("aria-label",`Link all four ${s.label.toLowerCase()} values`),re.title="Change all four together",re.appendChild(be("link",13)),re.setAttribute("aria-pressed","false"),re.addEventListener("click",()=>{G.has(s.prop)?G.delete(s.prop):G.add(s.prop);let ie=G.has(s.prop);re.toggleAttribute("data-on",ie),re.setAttribute("aria-pressed",String(ie))}),B.append(N,re)}else if(s.kind==="shadow"){let N=j(s);_.push(N.sync),N.el.style.flex="1",B.appendChild(N.el)}else if(s.kind==="blur"){let N=J(s);R.push(N.slider),_.push(N.sync),N.el.style.flex="1",B.appendChild(N.el)}else if(s.kind==="choice"){let N=le(s);_.push(N.sync),B.appendChild(N.el)}else if(s.kind==="colour"){let N=oe(s);_.push(N.sync),N.el.style.flex="1",B.appendChild(N.el)}else{let N=Y(s,s.prop,s.label);R.push(N.slider),_.push(N.sync),N.el.style.flex="1",B.appendChild(N.el)}let O=document.createElement("button");O.type="button",O.className="edit-revert",O.setAttribute("aria-label",`Revert ${s.label.toLowerCase()}`),O.title="Put this back",O.appendChild(be("undo",13)),O.addEventListener("click",()=>{if(u){for(let N of s.sides??[s.prop])t.revert(u,N);for(let N of _)N();x()}}),s.kind==="shadow"&&f.classList.add("edit-line-block");let W=document.createElement("span");W.className="edit-glyph",W.appendChild(be(s.glyph,15));let U=!s.sides&&s.kind==="colour";if(U&&f.prepend(W,C),s.sides||s.kind==="shadow"||s.kind==="choice"){let N=document.createElement("span");N.className="edit-row-name",N.append(W,document.createTextNode(s.label)),h.appendChild(N)}return!U&&!s.sides&&s.kind!=="shadow"&&s.kind!=="choice"&&f.appendChild(W),f.append(B,O),h.appendChild(f),{spec:s,el:h,sliders:R,scrubs:I,sync:()=>{for(let N of _)N()}}}function A(){for(let h of y){for(let f of h.sliders)f.destroy();for(let f of h.scrubs)f.destroy()}if(y.length=0,l.textContent="",!u){let h=document.createElement("p");h.className="edit-empty",h.textContent="Click an element to lock it, then change it here.",l.appendChild(h),c();return}for(let h of Ur){let f=h.specs.filter(I=>$||!I.more);if(f.length===0)continue;let C=document.createElement("section");C.className="edit-group";let B=document.createElement("span");B.className="edit-group-name",B.textContent=h.name;let R=document.createElement("div");R.className="edit-rows";for(let I of f){let _=g(I);y.push(_),R.appendChild(_.el)}C.append(B,R),l.appendChild(C)}let s=document.createElement("button");s.type="button",s.className="edit-more",s.textContent=$?"Fewer properties":"More properties",s.addEventListener("click",()=>{$=!$,A()}),l.appendChild(s);for(let h of y)h.sync();x()}S.addEventListener("click",()=>{t.revertAll();for(let s of y)s.sync();x()});let E=0;k.addEventListener("click",()=>{let s=t.asPrompt();if(!s)return;let h=C=>{k.textContent=C,clearTimeout(E),E=window.setTimeout(()=>{k.textContent="Copy as prompt"},900)},f=navigator.clipboard;if(!f){h("No clipboard");return}f.writeText(s).then(()=>h("Copied"),()=>h("Blocked"))});function F(){n.toggleAttribute("data-open",b)}return{show(s){if(s===u){for(let h of y)h.sync();x();return}u=s,a.textContent=s?s.tagName.toLowerCase()+(s.id?`#${s.id}`:""):"",A()},setArmed(s){b=s,F(),s&&A()},refresh(){for(let s of y)s.sync();x()},asText(){return t.asPrompt()},destroy(){for(let s of y){for(let h of s.sliders)h.destroy();for(let h of s.scrubs)h.destroy()}y.length=0,n.remove(),o.remove()}}}var xt=5,jt=4,at=12,uo=.22,Ke=10,Jr=50,Qr=100;function po(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,hidden:!1,grid:null,pixels:!1,guides:[],liveGuide:null,activeGuide:null},i=Dt(Ht()),a=0,l=null;function d(){let g=Ht();g!==l&&(l=g,i=Dt(g),e.style.colorScheme=g?"dark":"light",J())}d();let v=matchMedia("(prefers-color-scheme: dark)"),k=()=>d();v.addEventListener("change",k);let S=new MutationObserver(()=>d());function u(){S.disconnect(),S.observe(document.documentElement,{attributes:!0}),document.body&&S.observe(document.body,{attributes:!0})}u(),zn(()=>J());function b(){let g=devicePixelRatio;o.width=Math.round(innerWidth*g),o.height=Math.round(innerHeight*g),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(g,0,0,g,0,0),n.translate(.5,.5)}let $=g=>Math.round(g)-.5;function y(g,A){n.strokeStyle=A,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(g.left),Math.round(g.top),Math.round(g.width),Math.round(g.height))}function G(g){n.strokeStyle=Xe(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let A of[g.left,g.right])n.moveTo(Math.round(A),0),n.lineTo(Math.round(A),innerHeight);for(let A of[g.top,g.bottom])n.moveTo(0,Math.round(A)),n.lineTo(innerWidth,Math.round(A));n.stroke(),n.setLineDash([])}function c(g){if(n.strokeStyle=g.extension?Xe(i.measure,.55):i.measure,n.lineWidth=1,n.setLineDash(g.extension?[3,3]:[]),n.beginPath(),n.moveTo(Math.round(g.x1),Math.round(g.y1)),n.lineTo(Math.round(g.x2),Math.round(g.y2)),g.extension){n.stroke();return}if(g.axis==="x")for(let A of[g.x1,g.x2])n.moveTo(Math.round(A),Math.round(g.y1)-xt),n.lineTo(Math.round(A),Math.round(g.y1)+xt);else for(let A of[g.y1,g.y2])n.moveTo(Math.round(g.x1)-xt,Math.round(A)),n.lineTo(Math.round(g.x1)+xt,Math.round(A));n.stroke()}function x(g){return n.font=`${V.medium} ${T.body}px ${T.stack}`,{w:n.measureText(g).width+jt*2,h:T.body+jt*2+2}}function L(g,A,E,F){n.font=`${V.medium} ${T.body}px ${T.stack}`,n.textBaseline="middle";let{w:s,h}=x(g),f=$(Math.min(Math.max(A,at),innerWidth-s-at)),C=$(Math.min(Math.max(E,at),innerHeight-h-at));n.fillStyle=F,n.beginPath(),n.roundRect(f,C,Math.ceil(s),h,4),n.fill(),n.fillStyle=i.surface,n.fillText(g,f+jt,C+h/2)}function Y(g,A,E,F,s=!1){let{w:h,h:f}=x(g);L(g,s?A-h/2:A,s?E-f/2:E,F)}function ee(){let g=scrollX,A=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,K),n.fillRect(-.5,-.5,K,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${V.regular} 9px ${T.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let h of r.pinned)n.fillRect($(h.left),-.5,Math.round(h.width),K),n.fillRect(-.5,$(h.top),K,Math.round(h.height));n.restore(),n.beginPath(),n.moveTo(-.5,K-.5),n.lineTo(innerWidth,K-.5),n.moveTo(K-.5,-.5),n.lineTo(K-.5,innerHeight),n.stroke();let E=h=>h%Qr===0?K:h%Jr===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let F=Math.floor(g/Ke)*Ke;for(let h=F;h<g+innerWidth;h+=Ke){let f=Math.round(h-g);if(f<K)continue;let C=E(h);n.moveTo(f,K-C),n.lineTo(f,K),C===K&&(n.fillStyle=i.muted,n.fillText(String(h),f+3,3))}n.stroke(),n.beginPath();let s=Math.floor(A/Ke)*Ke;for(let h=s;h<A+innerHeight;h+=Ke){let f=Math.round(h-A);if(f<K)continue;let C=E(h);n.moveTo(K-C,f),n.lineTo(K,f),C===K&&(n.save(),n.translate(3,f-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(h),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),K),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo(K,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let h of r.guides){let f=Math.round(nt(h));h.axis==="x"?n.fillRect(f-1,-.5,2,K):n.fillRect(-.5,f-1,K,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,K,K),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,K,K)}function le(){let g=Gn(10,1);if(g){n.strokeStyle=i.pixelLine,n.lineWidth=1,n.setLineDash([]),n.beginPath();for(let A=0;A<=innerWidth;A+=g)n.moveTo(A,0),n.lineTo(A,innerHeight);for(let A=0;A<=innerHeight;A+=g)n.moveTo(0,A),n.lineTo(innerWidth,A);n.stroke()}}function oe(g){let A=Pn(g,document.documentElement.clientWidth);n.fillStyle=Xe(i.measure,.08);for(let E of A)n.fillRect($(E.left),-.5,Math.round(E.width),innerHeight+1)}function j(){if(a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore(),r.hidden)return;(r.pixels||r.grid)&&(n.save(),r.rulers&&(n.beginPath(),n.rect(K,K,innerWidth,innerHeight),n.clip()),r.pixels&&le(),r.grid&&oe(r.grid),n.restore());for(let E of r.pinned)y(E,i.accent);r.hover&&(G(r.hover),y(r.hover,r.pinned.length?Xe(i.accent,.7):i.accent));for(let E of r.guides){let F=r.liveGuide?.id===E.id;n.strokeStyle=E.locked||F?i.guide:Xe(i.guide,.55),n.lineWidth=E.pinned?2:1,n.setLineDash(E.locked?[]:[4,4]),n.beginPath();let s=Math.round(nt(E));if(E.axis==="x"?(n.moveTo(s,0),n.lineTo(s,innerHeight)):(n.moveTo(0,s),n.lineTo(innerWidth,s)),n.stroke(),r.activeGuide===E.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let h=7;E.axis==="x"?(n.moveTo(s,0),n.lineTo(s,h),n.moveTo(s,innerHeight-h),n.lineTo(s,innerHeight)):(n.moveTo(0,s),n.lineTo(h,s),n.moveTo(innerWidth-h,s),n.lineTo(innerWidth,s)),n.stroke()}}for(let E of r.lines)n.globalAlpha=E.faded?uo:1,c(E);n.globalAlpha=1;let g=r.lines.filter(E=>E.label!==""),A=g.map(E=>{let F=(E.x1+E.x2)/2,s=(E.y1+E.y2)/2,{w:h,h:f}=x(E.label);return E.axis==="x"?{x:F-h/2,y:s-16-f/2,w:h,h:f,axis:E.axis}:{x:F+26-h/2,y:s-f/2,w:h,h:f,axis:E.axis}});if(Rn(A,{w:innerWidth,h:innerHeight},at).forEach((E,F)=>{let s=g[F];n.globalAlpha=s.faded?uo:1,L(s.label,E.x,E.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:E,height:F,scale:s}=r.hover;Y(`${Q(E/s.x)} \xD7 ${Q(F/s.y)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let E=r.liveGuide,F=Math.round(nt(E));Y([`${E.axis} ${Q(E.at)}`,E.caught,E.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),E.axis==="x"?F+6:30,E.axis==="x"?30:F+6,i.guide)}r.rulers&&ee()}function J(){a||(a=requestAnimationFrame(j))}return b(),{root:t,update(g){Object.assign(r,g),J()},resize(){b(),J()},destroy(){a&&cancelAnimationFrame(a),v.removeEventListener("change",k),S.disconnect(),e.remove()}}}function Zr(e){let t=e.trim().replace(/^#/,""),o=t.length===3?t.split("").map(n=>n+n).join(""):t;return/^[0-9a-f]{6}$/i.test(o)?{r:parseInt(o.slice(0,2),16),g:parseInt(o.slice(2,4),16),b:parseInt(o.slice(4,6),16)}:null}function ei({r:e,g:t,b:o}){let n=r=>Math.round(r).toString(16).padStart(2,"0");return`#${n(e)}${n(t)}${n(o)}`}function ti({r:e,g:t,b:o}){return`rgb(${Math.round(e)} ${Math.round(t)} ${Math.round(o)})`}function He(e,t){return String(Number(e.toFixed(t)))}function ni({r:e,g:t,b:o}){let n=e/255,r=t/255,i=o/255,a=Math.max(n,r,i),l=Math.min(n,r,i),d=(a+l)/2,v=a-l,k=0,S=0;return v!==0&&(S=v/(1-Math.abs(2*d-1)),a===n?k=(r-i)/v%6:a===r?k=(i-n)/v+2:k=(n-r)/v+4,k*=60,k<0&&(k+=360)),`hsl(${He(k,1)} ${He(S*100,1)}% ${He(d*100,1)}%)`}function Ut(e){let t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4}function oi(e){let t=Ut(e.r),o=Ut(e.g),n=Ut(e.b),r=.4122214708*t+.5363325363*o+.0514459929*n,i=.2119034982*t+.6806995451*o+.1073969566*n,a=.0883024619*t+.2817188376*o+.6299787005*n,l=Math.cbrt(r),d=Math.cbrt(i),v=Math.cbrt(a),k=.2104542553*l+.793617785*d-.0040720468*v,S=1.9779984951*l-2.428592205*d+.4505937099*v,u=.0259040371*l+.7827717662*d-.808675766*v,b=Math.sqrt(S*S+u*u),$=Math.atan2(u,S)*180/Math.PI;return $<0&&($+=360),b<1e-4?`oklch(${He(k,4)} 0 0)`:`oklch(${He(k,4)} ${He(b,4)} ${He($,2)})`}function ho(e){let t=Zr(e);return t?[{label:"hex",value:ei(t)},{label:"rgb",value:ti(t)},{label:"hsl",value:ni(t)},{label:"oklch",value:oi(t)}]:[]}var ri=`
.picker {
  /* Under the badge, from the badge's own numbers. */
  position: fixed; top: ${ke+rt+it}px; right: ${ke}px;
  width: min(200px, calc(100vw - ${ke*2+z.base*2}px));
  padding: ${z.base}px; border-radius: 0;
  user-select: none;
  font-family: ${T.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${T.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${w.primary};
  background: ${ge};
  box-shadow: ${Ne};
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
  border: 1px solid ${de};
}
/* Each row copies itself, so the whole row is the target rather than the text. */
.picker button {
  display: grid; grid-template-columns: 34px 1fr;
  gap: 8px; align-items: baseline;
  width: 100%; padding: 3px 4px; margin: 0;
  border: 0; background: none; cursor: pointer;
  font: inherit; text-align: left;
  color: ${w.primary};
}
.picker button:hover { background: ${D(2)}; }
.picker button:focus-visible { outline: 1px solid ${w.primary}; outline-offset: -1px; }
.picker .k { color: ${w.secondary}; }
.picker .v { overflow-wrap: anywhere; }
.picker .hint {
  margin-top: 6px; padding-top: 6px;
  border-top: 1px solid ${de};
  color: ${w.secondary};
}
`;function mo(e){let t=document.createElement("style");t.textContent=ri,e.appendChild(t);let o=document.createElement("div");o.className="picker",e.appendChild(o);let n=document.createElement("div");n.className="swatch";let r=document.createElement("div");r.className="hint";function i(a){n.style.background=a;let l=ho(a).map(({label:d,value:v})=>{let k=document.createElement("button");k.type="button";let S=document.createElement("span");S.className="k",S.textContent=d;let u=document.createElement("span");return u.className="v",u.textContent=v,k.append(S,u),k.addEventListener("click",b=>{b.stopPropagation(),navigator.clipboard?.writeText(v).then(()=>{r.textContent=`copied ${d}`},()=>{r.textContent="clipboard refused"})}),k});r.textContent="click a row to copy",o.replaceChildren(n,...l,r),o.setAttribute("data-open","")}return{async open(){let a=window.EyeDropper;if(!a){o.replaceChildren(Object.assign(document.createElement("div"),{className:"hint",textContent:"this browser has no eyedropper"})),o.setAttribute("data-open","");return}try{let{sRGBHex:l}=await new a().open();i(l)}catch{}},close(){let a=o.hasAttribute("data-open");return o.removeAttribute("data-open"),a},destroy(){o.remove(),t.remove()}}}var Vt="__align_freeze",ii=`
[data-align-frozen] *:not([data-align-ignore]):not([data-align-ignore] *) {
  animation-play-state: paused !important;
}
`,qt=!1,wt=[],vt=[];function fo(e){let t=e;for(;t;){if(t instanceof Element&&t.hasAttribute("data-align-ignore"))return!0;let o=t.getRootNode();if(t=o instanceof ShadowRoot?o.host:t.parentNode??null,t===document)return!1}return!1}function kt(){return qt}function Jt(e){if(e!==qt){if(qt=e,!e){document.documentElement.removeAttribute("data-align-frozen"),document.getElementById(Vt)?.remove();for(let t of wt)try{t.play()}catch{}for(let t of vt)t.play().catch(()=>{});wt=[],vt=[];return}if(!document.getElementById(Vt)){let t=document.createElement("style");t.id=Vt,t.textContent=ii,t.setAttribute("data-align-ignore",""),document.head.appendChild(t)}document.documentElement.setAttribute("data-align-frozen",""),wt=[];try{for(let t of document.getAnimations()){if(t.playState!=="running")continue;let o=t.effect?.target??null;fo(o)||(t.pause(),wt.push(t))}}catch{}vt=[];for(let t of Array.from(document.querySelectorAll("video")))t.paused||fo(t)||(t.pause(),vt.push(t))}}var Qt="__align_xray",ai=`
[data-align-xray] * { outline: 1px solid rgb(128 128 128 / 0.55) !important; }
[data-align-xray] [data-align-ignore],
[data-align-xray] [data-align-ignore] * { outline: none !important; }
`;function Zt(e){let t=document.documentElement;if(!e){t.removeAttribute("data-align-xray"),document.getElementById(Qt)?.remove();return}if(!document.getElementById(Qt)){let o=document.createElement("style");o.id=Qt,o.textContent=ai,o.setAttribute("data-align-ignore",""),document.head.appendChild(o)}t.setAttribute("data-align-xray","")}var en="align-ui";function go(e){try{return localStorage.getItem(e)}catch{return null}}function bo(e,t){try{localStorage.setItem(e,t)}catch{}}function yo(e){let t="/";try{t=location.pathname||"/"}catch{}return`${en}:${e}::${t}`}function si(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function xo(){let e=go(yo("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(si).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function wo(e){bo(yo("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function $t(e){return go(`${en}:${e}`)==="1"}function Et(e,t){bo(`${en}:${e}`,t?"1":"0")}var pe,q=null,me=null,Me=null,Ze=null,Ie=null,Oe=oo(),Fe=!1,Ve=$t("grid"),qe=$t("pixels"),ae=null,X=[],Ct=0,We=$t("rulers"),ne=[],To=1,vo=!1,Te=null,je=!1,ze=_n();function li(){return ne.map(e=>({...e}))}function Je(e=""){ze.push(li(),e)}function ko(){return ne.find(e=>e.id===Te)??null}function Ge(e){ne=e,wo(ne)}var se=null,Se=null,$e=null,ci=3,Ue=22;function Ao(e,t){return We?t<Ue&&e>=Ue?"y":e<Ue&&t>=Ue?"x":null:null}function nn(e){return e.ctrlKey||e.metaKey}function Lo(e,t,o,n){let r=Be(t,o,pe),i=e.axis==="x"?t:o,a=ne.filter(d=>d.id!==e.id).map(d=>({axis:d.axis,at:st(d).pos})),l=An(i,Ln(r,e.axis,a),n);e.at=l.at+(e.axis==="x"?scrollX:scrollY),e.caught=l.what}function No(e,t,o,n){let r={id:To++,axis:e,at:0,locked:!1,caught:"",pinned:!1};Lo(r,t,o,n);let i=ne.find(a=>a.axis===r.axis&&Math.abs(a.at-r.at)<.5);return i?(Te=i.id,i):(Je(),Ge([...ne,r]),Te=r.id,r)}function Ro(e){e.pinned||(Je(),Ge(ne.filter(t=>t.id!==e.id)),Se?.id===e.id&&(Se=null),se?.id===e.id&&(se=null))}function di(e){let t=pe.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function st(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function on(){return X.length>=2?X[X.length-2]:void 0}function rn(){if(X.length<2)return[];let e=[];for(let[t,o]of Nt(X))for(let n of mt(t,o)){if(n.extension||!n.label)continue;let r=fn(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:gn(r)})}return e}function he(e){let t=X[X.length-1],o=ae&&X.some(u=>u.el===ae.el),n=ne.map(st),r=!se&&Se?Se:null,i=ne.filter(u=>u.locked||u.id===r?.id),a=!r&&o?ae.el:null,l=r??a,d=r?st(r):null,v=[],k=(u,b)=>{for(let $ of u)v.push(l&&!b?{...$,faded:!0}:$)},S=u=>!d||u.axis!==d.axis?!1:(u.axis==="x"?[u.x1,u.x2]:[u.y1,u.y2]).some($=>Math.abs($-d.pos)<.5);for(let[u,b]of Nt(X))k(mt(u,b),u.el===a||b.el===a);t&&ae&&!o&&!r&&k(mt(t,ae),!0);for(let u of i)for(let b of X)k(Pt(b,[st(u)]),u.id===r?.id||b.el===a);ae&&!o&&!r&&ne.length&&k(Pt(ae,n),!0);for(let u of Nn(i.map(st),{x:innerWidth/2,y:innerHeight/2}))k([u],S(u));q?.update({hover:ae,pinned:X,rulers:We,hidden:je,grid:Ve&&pe.grid?pe.grid:null,pixels:qe,guides:ne,liveGuide:se??Se,activeGuide:Te,lines:v,...e?{cursor:e}:{}}),Me?.update(X.length,{edit:Oe.armed,rulers:We,xray:Fe,grid:Ve,pixels:qe,freeze:kt(),type:me?.showsType()??!1,hide:je,canCopy:X.length>0,canUndo:ze.depth()>0,panel:me?.isOpen()??!1})}function ui(){let e=me?.asText()??"";if(!e)return;let t=n=>Me?.acknowledge("copy",n),o=navigator.clipboard?.writeText(e);o?o.then(()=>t(!0),()=>t(!1)):t(!1)}function pi(e,t){return e.length===t.length&&e.every((o,n)=>{let r=t[n];return o.id===r.id&&o.axis===r.axis&&o.at===r.at&&o.locked===r.locked&&o.pinned===r.pinned})}function hi(){for(;ze.depth()>0&&pi(ze.peek(),ne);)ze.pop();let e=ze.pop();e&&(Ge(e),Se=null,se=null,$e=null,e.some(t=>t.id===Te)||(Te=null))}function xe(e){switch(e){case"rulers":We=!We,Et("rulers",We);break;case"xray":Fe=!Fe,Zt(Fe);break;case"grid":Ve=!Ve,Et("grid",Ve);break;case"pixels":qe=!qe,Et("pixels",qe);break;case"freeze":Jt(!kt());break;case"type":me?.toggleType();break;case"panel":me?.toggle();break;case"hide":je=!je,me?.setHidden(je),je&&Ze?.close();break;case"copy":ui();break;case"pick":Ze?.open();break;case"edit":if(Oe.armed){let t=Oe.disarm();Me?.acknowledge("edit",t>=0)}else Oe.arm();Ie?.setArmed(Oe.armed),X.length&&he();break;case"undo":hi();break}he()}var St=null;function Po(e){if(St={x:e.clientX,y:e.clientY},se){$e&&Math.hypot(e.clientX-$e.x,e.clientY-$e.y)>ci&&($e=null),!$e&&!se.pinned&&(Lo(se,e.clientX,e.clientY,nn(e)),Ge([...ne])),he({x:e.clientX,y:e.clientY});return}Se=Rt(ne,e.clientX,e.clientY),ae=Be(e.clientX,e.clientY,pe),he({x:e.clientX,y:e.clientY})}function Go(e){se&&($e?(se.locked=!se.locked,Te=se.id,Ge([...ne])):(Ao(e.clientX,e.clientY)||e.clientX<Ue||e.clientY<Ue)&&Ro(se),$e=null,se=null,he({x:e.clientX,y:e.clientY}))}function Mt(e){let t=q?.root.host;return t?(e.composedPath?.()??[]).includes(t):!1}function Io(e){if(e.button!==0||Mt(e))return;let t=Be(e.clientX,e.clientY,pe);if(!t)return;let o=Ao(e.clientX,e.clientY);if(o){Qe(e),$e=null,se=No(o,e.clientX,e.clientY,nn(e)),he({x:e.clientX,y:e.clientY});return}let n=Rt(ne,e.clientX,e.clientY);if(n){Qe(e),Je(),Te=n.id,se=n,$e={x:e.clientX,y:e.clientY},he({x:e.clientX,y:e.clientY});return}Qe(e),Me?.closeHelp(),X=[t],ae=t,me?.show(t,rn(),on()),Ie?.show(t.el),he({x:e.clientX,y:e.clientY})}function Bo(e){if(Mt(e))return;let t=Be(e.clientX,e.clientY,pe);if(!t)return;Qe(e),Me?.closeHelp();let o=X.findIndex(r=>r.el===t.el);X=o>=0?X.filter((r,i)=>i!==o):[...X,t],ae=t;let n=X[X.length-1];n?me?.show(n,rn(),on()):me?.hide(),Ie?.show(n?.el??null),he({x:e.clientX,y:e.clientY})}function Do(e){Mt(e)||Be(e.clientX,e.clientY,pe)&&Qe(e)}function Ho(e){Mt(e)||Be(e.clientX,e.clientY,pe)&&Qe(e)}function Qe(e){e.preventDefault(),e.stopPropagation()}function $o(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var Eo=0,So=0;function Oo(){Ct=requestAnimationFrame(Oo);let t=X.filter(l=>l.el.isConnected).map(l=>ht(l.el)),o=ae&&ae.el.isConnected?ht(ae.el):null;if(!(scrollX!==Eo||scrollY!==So||t.length!==X.length||t.some((l,d)=>!$o(l,X[d]))||ae===null!=(o===null)||ae!==null&&o!==null&&!$o(ae,o)))return;Eo=scrollX,So=scrollY,X=t,ae=o;let i=X[X.length-1],a=mi();a!==Co&&(Co=a,i?me?.show(i,rn(),on()):me?.hide(),Ie?.show(i?.el??null)),he()}var Co="";function mi(){let e=X[0];return e?X.map(t=>[t.label,Math.round(t.width*100),Math.round(t.height*100),Math.round((t.left-e.left)*100),Math.round((t.top-e.top)*100)].join(",")).join(";"):""}function zo(){q?.resize()}function fi(){vo||(vo=!0,ne=xo().map(e=>({...e,id:To++}))),!q&&(Hn(),q=po(),me=Wn(q.root),Me=Xn(q.root,xe),Ie=co(q.root,Oe),Ze=mo(q.root),Me.update(0,{rulers:We,xray:Fe,grid:Ve,pixels:qe,freeze:kt(),type:!1,panel:!1,hide:!1,edit:!1,canCopy:!1,canUndo:!1}),addEventListener("mousemove",Po),addEventListener("mousedown",Io,{capture:!0}),addEventListener("mouseup",Go,{capture:!0}),addEventListener("click",Do,{capture:!0}),addEventListener("auxclick",Ho,{capture:!0}),addEventListener("contextmenu",Bo,{capture:!0}),addEventListener("resize",zo),Ct=requestAnimationFrame(Oo),he())}function tn(){removeEventListener("mousemove",Po),removeEventListener("mousedown",Io,{capture:!0}),removeEventListener("mouseup",Go,{capture:!0}),removeEventListener("click",Do,{capture:!0}),removeEventListener("auxclick",Ho,{capture:!0}),removeEventListener("contextmenu",Bo,{capture:!0}),removeEventListener("resize",zo),cancelAnimationFrame(Ct),Ct=0,Me?.destroy(),Ie?.destroy(),Ie=null,Ze?.destroy(),Ze=null,Fe&&(Fe=!1,Zt(!1)),Jt(!1),Oe.disarm(),Me=null,me?.destroy(),me=null,q?.destroy(),q=null,On(),ae=null,X=[],se=null,$e=null,Se=null}function gi(e){let t=e.composedPath?.()[0]??e.target;return!t||typeof t!="object"||!("tagName"in t)?!1:t.isContentEditable?!0:t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT"}function Mo(e){if(di(e))e.preventDefault(),q?tn():fi();else if(!gi(e)){if(q&&St&&(e.key.toLowerCase()===pe.guideKeys.vertical||e.key.toLowerCase()===pe.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===pe.guideKeys.vertical?"x":"y";No(t,St.x,St.y,nn(e)),he()}else if(q&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(ne.some(t=>!t.pinned)&&Je(),Ge(ne.filter(t=>t.pinned)),Se=null,se=null,$e=null,ne.some(t=>t.id===Te)||(Te=null)):Se&&Ro(Se),he();else if(q&&e.key.startsWith("Arrow")){let t=ko(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;Je(`nudge:${t.id}`);let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",Ge([...ne]),he()}else if(q&&e.key.toLowerCase()==="g"){e.preventDefault(),xe("grid");return}else if(q&&e.key.toLowerCase()==="k"){e.preventDefault(),xe("pixels");return}else if(q&&e.key==="\\"){e.preventDefault(),xe("hide");return}else if(q&&e.key.toLowerCase()==="e"){e.preventDefault(),xe("edit");return}else if(q&&e.key.toLowerCase()==="f"){e.preventDefault(),xe("freeze");return}else if(q&&e.key.toLowerCase()==="x"){e.preventDefault(),xe("xray");return}else if(q&&e.key.toLowerCase()==="p"){e.preventDefault(),xe("pick");return}else if(q&&e.key.toLowerCase()==="t"){e.preventDefault(),xe("type");return}else if(q&&e.key.toLowerCase()==="c"){e.preventDefault(),xe("copy");return}else if(q&&e.key.toLowerCase()==="l"){let t=ko();if(!t)return;e.preventDefault(),Je(),t.pinned=!t.pinned,Ge([...ne]),he()}else if(q&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){if(ze.depth()===0)return;e.preventDefault(),xe("undo");return}else if(q&&e.key.toLowerCase()===pe.rulerKey){e.preventDefault(),xe("rulers");return}else if(q&&e.key.toLowerCase()===pe.panelKey){e.preventDefault(),xe("panel");return}else if(e.key==="Escape"&&q){if(Ze?.close()||Me?.closeHelp())return;X.length?(X=[],me?.hide(),Ie?.show(null),he()):tn()}}}function xa(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,pe=Sn(e),Fn(pe.theme),addEventListener("keydown",Mo,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{tn(),removeEventListener("keydown",Mo,{capture:!0}),delete window.__align})}export{xa as initAlign};
