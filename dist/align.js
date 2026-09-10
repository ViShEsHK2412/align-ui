function ce(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function Wo(e){return(e.split(",")[0]??"").trim().replace(/^['"]|['"]$/g,"")}function _o(e){let o={100:"thin",200:"extralight",300:"light",400:"regular",500:"medium",600:"semibold",700:"bold",800:"extrabold",900:"black"}[e.trim()];return o?`${e} ${o}`:e}function lt(e){let t=getComputedStyle(e);return[{label:"family",value:Wo(t.fontFamily),px:NaN},{label:"size",value:t.fontSize,px:ce(t.fontSize)},{label:"weight",value:_o(t.fontWeight),px:NaN},{label:"line",value:t.lineHeight,px:ce(t.lineHeight)},{label:"tracking",value:t.letterSpacing,px:ce(t.letterSpacing)}]}function mn(e){let t="";for(let o of e.childNodes)o.nodeType===3&&(t+=o.nodeValue??"");return t.trim().replace(/\s+/g," ")}function ct(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:ce(r)})}return o}function At(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function Xo(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function hn(e,t){if(t.length===0)return"";let o=[],n=0;for(let i of Xo(e)){let a=At(i,t);a.length?o.push(`${Yo(i)} ${a.join(" ")}`):n+=1}if(o.length===0)return n===1?"its one number is not on the scale":`none of its ${n} numbers are on the scale`;let r=n===0?"":n===1?"  \xB7  1 more, not on the scale":`  \xB7  ${n} more, not on the scale`;return o.join("  \xB7  ")+r}function Yo(e){return String(Math.round(e*100)/100)}function an(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(ce)}function fn(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),l=a.display.includes("flex")||a.display.includes("grid"),d=n==="x"?a.columnGap:a.rowGap,v=l&&d!=="normal"?ce(d):null,[w,S,u,g]=an(e),[k,b,G,c]=an(t),y=Z=>Number.isFinite(Z)?Z:0,N=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,X=n==="x"?N?y(S)+y(c):y(b)+y(g):N?y(u)+y(k):y(G)+y(w);return{px:o,cssGap:v,margins:X,siblings:!0}}function gn(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function bn(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}function et(e){let t=e.trim().toLowerCase();return t?t.startsWith("#")||/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(t)?!0:["black","white","transparent","currentcolor"].includes(t):!1}var Me;function sn(e){if(Me===void 0&&(Me=document.createElement("canvas").getContext("2d")),!Me)return"";Me.fillStyle="#000000",Me.fillStyle=e;let t=Me.fillStyle;return Me.fillStyle="#ffffff",Me.fillStyle=e,t===Me.fillStyle?String(t):""}function dt(e,t){let o=sn(e);return o?t.filter(n=>et(n.value)&&sn(n.value)===o).map(n=>n.name).sort():[]}function yn(e){let t=getComputedStyle(e),o=[],n=(r,i)=>{let a=i.trim();!a||a==="transparent"||/rgba?\([^)]*,\s*0\s*\)$/.test(a)||o.push({label:r,value:a})};return n("text",t.color),n("background",t.backgroundColor),o}function Ko(e,t,o){let n=r=>typeof CSS<"u"&&CSS.escape?CSS.escape(r):r.replace(/[^\w-]/g,"\\$&");return t?`#${n(t)}`:o.length?e+o.map(r=>`.${n(r)}`).join(""):e}function tt(e){let t=typeof e.className=="string"?e.className.trim().split(/\s+/).filter(Boolean):[];return Ko(e.tagName.toLowerCase(),e.id,t)}function xn(e){let t=tt(e);if(!/[.#]/.test(t))return 0;try{return document.querySelectorAll(t).length}catch{return 0}}function jo(e){if(!e)return"inline <style>";let t=e.split("?")[0]??e;try{let o=new URL(t,"http://x").pathname;return decodeURI(o).replace(/^\//,"")||t}catch{return t}}var Uo=["width","height","padding","margin","border-width","gap","font-size","line-height","letter-spacing","color","background-color"];function Vo(e){for(let t=0;t<e.length;t+=1){let o=e.item(t);if(Uo.some(n=>o===n||o.startsWith(`${n}-`)))return!0}return!1}function wn(e){let t=[],o=new Set,n=(r,i)=>{for(let a of Array.from(r)){if(a instanceof CSSMediaRule){matchMedia(a.conditionText).matches&&n(a.cssRules,i);continue}if(a instanceof CSSSupportsRule){CSS.supports(a.conditionText)&&n(a.cssRules,i);continue}let l=a.cssRules;if(l&&!(a instanceof CSSStyleRule)){n(l,i);continue}if(!(a instanceof CSSStyleRule))continue;let d=!1;try{d=e.matches(a.selectorText)}catch{continue}if(!d||!Vo(a.style))continue;let v=`${a.selectorText}|${i}`;o.has(v)||(o.add(v),t.push({selector:a.selectorText,file:i}))}};for(let r of Array.from(document.styleSheets)){if(r.ownerNode instanceof Element&&r.ownerNode.hasAttribute("data-align-ignore"))continue;let i;try{i=r.cssRules}catch{continue}n(i,jo(r.href))}return t.reverse()}function ln(e){if(!e||e==="none")return[];let t=e.trim().split(/\s+/),o=[];for(let n of t){if(!n.endsWith("px"))return[];let r=Number.parseFloat(n);if(!Number.isFinite(r))return[];o.push(r)}return o}function cn(e,t,o){let n=0;for(let r=0;r<e.length;r+=1){let i=n+e[r];if(o<i+.5)return r;n=i+t}return-1}function qo(e,t){let o=t==="rtl";return e.startsWith("vertical")||e.startsWith("sideways")?{inline:"y",inlineReversed:e==="sideways-lr"?!o:o,blockReversed:e==="vertical-rl"||e==="sideways-rl"}:{inline:"x",inlineReversed:o,blockReversed:!1}}function dn(e,t,o,n,r){return r?t-n:o-e}function vn(e){let t=e.parentElement,o=0;for(;t&&getComputedStyle(t).display==="contents";)t=t.parentElement,o+=1;if(!t)return null;let n=getComputedStyle(t),r=getComputedStyle(e),i=n.display,a=[];if(o>0&&a.push({label:"through",value:o===1?"a display: contents parent":`${o} display: contents parents`}),r.position==="absolute"||r.position==="fixed")return a.push({label:"placed by",value:`${r.position}, not by the parent`}),{display:i,rows:a};if(r.float!=="none")return a.push({label:"placed by",value:`float: ${r.float}`}),{display:i,rows:a};let l=i.includes("flex"),d=i.includes("grid");if(!l&&!d)return a.push({label:"flow",value:i}),{display:i,rows:a};let v=un(n.rowGap==="normal"?"0px":n.rowGap),w=un(n.columnGap==="normal"?"0px":n.columnGap),S=v===w?v:`row ${v} \xB7 column ${w}`;if(l){let q=n.flexDirection;a.push({label:"direction",value:n.flexWrap==="nowrap"?q:`${q} \xB7 ${n.flexWrap}`}),a.push({label:"justify",value:n.justifyContent}),a.push({label:"align",value:n.alignItems}),a.push({label:"gap",value:S});let h=`${r.flexGrow} ${r.flexShrink} ${r.flexBasis}`;return h!=="0 1 auto"&&a.push({label:"this child",value:`flex: ${h}`}),r.alignSelf!=="auto"&&a.push({label:"align-self",value:r.alignSelf}),{display:i,rows:a}}let u=ln(n.gridTemplateColumns),g=ln(n.gridTemplateRows);u.length&&a.push({label:"columns",value:`${u.length} \xB7 ${u.map(Mt).join(" ")}`}),g.length&&a.push({label:"rows",value:`${g.length} \xB7 ${g.map(Mt).join(" ")}`}),a.push({label:"gap",value:S});let k=t.getBoundingClientRect(),b=e.getBoundingClientRect(),G={left:k.left+ce(n.borderLeftWidth)+ce(n.paddingLeft),right:k.right-ce(n.borderRightWidth)-ce(n.paddingRight),top:k.top+ce(n.borderTopWidth)+ce(n.paddingTop),bottom:k.bottom-ce(n.borderBottomWidth)-ce(n.paddingBottom)},c=qo(n.writingMode,n.direction),y=(q,h)=>q==="x"?dn(G.left,G.right,b.left,b.right,h):dn(G.top,G.bottom,b.top,b.bottom,h),N=c.inline==="x"?"y":"x",X=ce(n.columnGap==="normal"?"0":n.columnGap),Z=ce(n.rowGap==="normal"?"0":n.rowGap),ae=cn(u,X,y(c.inline,c.inlineReversed)),te=cn(g,Z,y(N,c.blockReversed)),K=[];return ae>=0&&K.push(`column ${ae+1} of ${u.length}`),te>=0&&K.push(`row ${te+1} of ${g.length}`),K.length&&a.push({label:"this child",value:K.join(" \xB7 ")}),{display:i,rows:a}}function un(e){return e.endsWith("px")?Mt(Number.parseFloat(e)):e}function Mt(e){return String(Math.round(e*100)/100)}var kn=["display","position","width","height","padding","margin","border-width","border-style","border-radius","font-family","font-size","font-weight","font-style","line-height","letter-spacing","text-transform","text-align","color","background-color","border-color","opacity","flex-direction","justify-content","align-items","gap","flex-grow","flex-shrink","flex-basis","align-self","box-shadow","overflow","text-overflow","white-space"];function Jo(e,t){let o=[];for(let n of kn){let r=e[n]??"",i=t[n]??"";r!==i&&o.push({prop:n,a:r,b:i})}return o}function pn(e){let t=getComputedStyle(e),o={};for(let n of kn)o[n]=t.getPropertyValue(n);return o}function $n(e,t){return Jo(pn(e),pn(t))}var Qo={ignore:"",grid:null,hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"},theme:"auto"};function Sn(e={}){return{...Qo,...e}}var En=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function Cn(e){return e.ignore?`${En}, ${e.ignore}`:En}function J(e){return String(Math.round(e*100)/100)}function Zo(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function mt(e){let t=e.getBoundingClientRect();return{el:e,label:Zo(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height,scale:Ae(e)}}function Tn(e,t){let o=(n,r)=>Math.abs(n-r)<.001;return o(e.scale.x,t.scale.x)&&o(e.scale.y,t.scale.y)?e.scale:{x:1,y:1}}function Mn(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function De(e,t,o){let n=Cn(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=Mn(r);return r&&r!==document.documentElement?mt(r):null}var ut=e=>parseFloat(e)||0;function Lt(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[ut(n),ut(r),ut(i),ut(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function er(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function tr(e,t){let o=Tn(e,t),n=t.left+t.width/2,r=t.top+t.height/2;return[{x1:e.left,y1:r,x2:t.left,y2:r,label:J((t.left-e.left)/o.x),axis:"x"},{x1:t.right,y1:r,x2:e.right,y2:r,label:J((e.right-t.right)/o.x),axis:"x"},{x1:n,y1:e.top,x2:n,y2:t.top,label:J((t.top-e.top)/o.y),axis:"y"},{x1:n,y1:t.bottom,x2:n,y2:e.bottom,label:J((e.bottom-t.bottom)/o.y),axis:"y"}]}function pt(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function ht(e,t){let o=[],n=Tn(e,t),r=e.left<t.right&&t.left<e.right,i=e.top<t.bottom&&t.top<e.bottom;if(r&&i){let[a,l]=er(e,t);return tr(a,l)}if(!r){let[a,l]=e.right<=t.left?[e,t]:[t,e],d=i?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:a.right,y1:d,x2:l.left,y2:d,label:`${J((l.left-a.right)/n.x)}`,axis:"x"}),o.push(...pt(a.right,a.top,a.bottom,d,"x")),o.push(...pt(l.left,l.top,l.bottom,d,"x"))}if(!i){let[a,l]=e.bottom<=t.top?[e,t]:[t,e],d=r?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:d,y1:a.bottom,x2:d,y2:l.top,label:`${J((l.top-a.bottom)/n.y)}`,axis:"y"}),o.push(...pt(a.bottom,a.left,a.right,d,"y")),o.push(...pt(l.top,l.left,l.right,d,"y"))}return o}function nr(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function Nt(e){let t=nr(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var or=5,rr=8;function nt(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function Rt(e,t,o){let n=null,r=or;for(let i of e){let a=Math.abs(nt(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function An(e,t,o){if(o)return{at:e,what:""};let n=null,r=rr;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function Ln(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function Pt(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,l=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:l,y2:i,label:J(r.gap/e.scale.x),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,l=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:l,label:J(r.gap/e.scale.y),axis:"y"})}}return o}function Nn(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],l=r[i],d=l-a;d<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:l,y2:t.y,label:J(d),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:l,label:J(d),axis:"y"}))}}return o}var Ne=3;function ir(e,t){return e.x<t.x+t.w+Ne&&t.x<e.x+e.w+Ne&&e.y<t.y+t.h+Ne&&t.y<e.y+e.h+Ne}function Rn(e,t,o=12){let n=(a,l)=>Math.min(Math.max(a,o),t.w-l-o),r=(a,l)=>Math.min(Math.max(a,o),t.h-l-o),i=[];for(let a of e){let l={...a,x:n(a.x,a.w),y:r(a.y,a.h)},d=!1;for(let v=0;v<16;v++){let w=i.find(u=>ir(u,l));if(!w)break;let S=l.axis==="x"?l.y:l.x;if(l.axis==="x"?l.y=r(d?w.y+w.h+Ne:w.y-l.h-Ne,l.h):l.x=n(d?w.x-l.w-Ne:w.x+w.w+Ne,l.w),(l.axis==="x"?l.y:l.x)===S){if(d)break;d=!0}}i.push(l)}return i}function Pn(e,t){let{columns:o,gutter:n,margin:r}=e;if(o<=0)return[];let i=e.maxWidth>0?Math.min(e.maxWidth,t):t,a=Math.max(0,(t-i)/2),d=(Math.max(0,i-r*2)-n*(o-1))/o;if(d<=0)return[];let v=[];for(let w=0;w<o;w+=1)v.push({left:a+r+w*(d+n),width:d});return v}function Gn(e,t){return e*t>=8?e:0}function ar(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(l=>parseFloat(l)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function Ae(e){let t=1,o=1;for(let n=e;n;n=Mn(n)){let r=ar(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var $e=(e,t)=>({light:e,dark:t}),Gt={accent:$e("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:$e("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:$e("oklch(1 0 0)","oklch(0.264 0 0)"),fg:$e("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:$e("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:$e("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:$e("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:$e("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)"),pixelLine:$e("oklch(0.205 0 0 / 0.14)","oklch(0.97 0 0 / 0.14)")};function Dn(e){return`light-dark(${e.light}, ${e.dark})`}var fe=Dn($e("#fafafa","#1a1a1a"));function _e(e,t=e){return Dn($e(`rgb(0 0 0 / ${t})`,`rgb(255 255 255 / ${e})`))}var Bn=[0,.07,.08,.1,.12,.15,.2];function I(e){let t=Bn[Math.max(0,Math.min(Bn.length-1,e))];return t===0?fe:_e(t)}var x={primary:_e(.9),secondary:_e(.6),tertiary:_e(.46,.55),disabled:_e(.22,.26)},le=_e(.12),Le="0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)",In="0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)",Y=22,Re=36,z={tight:4,base:8,roomy:12,edge:16},O={exit:"160ms cubic-bezier(0.3, 0, 1, 1)",ui:"160ms cubic-bezier(0.2, 0, 0, 1)"},sr='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',M={title:13,body:12,tag:11,stack:sr},U={regular:400,medium:500,semibold:600},Bt="__align_font",lr="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function On(){if(document.getElementById(Bt))return;let e=document.createElement("link");e.id=Bt,e.rel="stylesheet",e.href=lr,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function Hn(){document.getElementById(Bt)?.remove()}function zn(e){let t=[`${U.medium} ${M.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function It(e){let t={};for(let o of Object.keys(Gt))t[o]=e?Gt[o].dark:Gt[o].light;return t}var Dt=null;function Fn(e){Dt=e==="auto"?null:e}function Ot(){if(Dt)return Dt==="dark";let e=document.documentElement,t=getComputedStyle(e).colorScheme;if(/dark/.test(t)&&!/light/.test(t))return!0;if(/light/.test(t)&&!/dark/.test(t))return!1;for(let o of[document.body,e]){if(!o)continue;let n=cr(getComputedStyle(o).backgroundColor);if(n!==null)return n<.5}return matchMedia("(prefers-color-scheme: dark)").matches}function cr(e){let t=/^rgba?\(([^)]+)\)$/.exec(e.trim());if(!t)return null;let o=t[1].split(/[\s,/]+/).filter(Boolean).map(Number),[n,r,i,a=1]=o;return n===void 0||r===void 0||i===void 0||a<.5?null:(.2126*n+.7152*r+.0722*i)/255}function Xe(e,t){return e.replace(/\)$/,` / ${t})`)}var dr=`
`,Se=16,ur=`
.dock {
  /* No color-scheme here: the overlay sets it inline on the shadow host, from
     what the page actually looks like rather than what the machine prefers, and
     it inherits down. Declaring 'light dark' again would undo that and hand
     light-dark() back to the media query. */
  position: fixed; left: ${Se}px; top: 0;
  /* Clamped to the window. A narrow viewport is not an edge case for this
     tool, it is the case it exists for: you make the window 375px wide
     precisely to check a mobile layout, and a readout that hangs off the
     screen there is useless exactly when you reached for it. */
  width: min(340px, calc(100vw - ${Se*2}px));
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

  --fg: ${x.primary};
  --muted: ${x.secondary};
  --border: ${le};
}
.panel {
  padding: 10px; border-radius: 0;
  /* Five sections now \u2014 box, tokens, styled by, matches, colour \u2014 and on a
     laptop that is taller than the window. place() clamps the position but
     cannot rescue a panel taller than the screen, so it scrolls instead. */
  max-height: calc(100vh - ${Se*2}px);
  overflow-y: auto; overscroll-behavior: contain;
  font-size: ${M.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${fe};

  box-shadow: ${Le};

  /* The one animation in the tool: a panel that must land exactly, so the
     Fluid spring.moderate tier at 160ms, critically damped. */
  opacity: 0;
  transform: translateY(4px) scale(0.98);
  transform-origin: bottom left;
  transition: opacity ${O.exit}, transform ${O.exit},
              box-shadow ${O.exit};
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
  transition: opacity ${O.ui}, transform ${O.ui},
              box-shadow ${O.ui};
}
@media (prefers-reduced-motion: reduce) {
  /* Fewer and gentler, not none: the fade aids comprehension, the travel does not. */
  .panel { transform: none; transition: opacity 120ms linear; }
}

header {
  /* Stays put while the body scrolls: it is also the drag handle, and a handle
     you have to scroll back up to find is not a handle. */
  position: sticky; top: -10px; z-index: 1;
  background: ${fe};
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] .panel { box-shadow: ${In}; }
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${M.title}px; font-weight: ${U.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${M.body}px; font-weight: ${U.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${M.tag}px; font-weight: ${U.medium};
  margin-left: 4px;
  color: ${x.primary};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${M.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${I(1)}; }

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
.region[data-level="1"] { background: ${I(1)}; }
.region[data-level="2"] { background: ${I(2)}; }
.region[data-level="3"] { background: ${I(3)}; }
.content { background: ${I(4)}; }

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
  font-size: ${M.tag}px; font-weight: ${U.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${U.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${U.regular}; }
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
  border-radius: 0; padding: ${z.roomy}px ${z.base}px;
  text-align: center; font-weight: ${U.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,ot=Se,Ie=-1,Ye=!1;function Wn(e){let t=document.createElement("style");t.textContent=ur,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);let r=!1;function i(c,y){let N=document.createElement("div");N.className="readout";let X=document.createElement("div");X.className="tag readout-tag",X.textContent=c,N.appendChild(X);let Z=document.createElement("div");Z.className="readout-rows",N.appendChild(Z);for(let[ae,te]of y){let K=document.createElement("div");K.className="readout-row";let q=document.createElement("span");q.className="readout-key",q.textContent=ae;let h=document.createElement("span");h.className="readout-value",h.textContent=te,K.append(q,h),Z.appendChild(K)}return N}e.appendChild(o);let a=(c,y)=>Math.min(Math.max(c,Se),Math.max(Se,y-Se));function l(){let c=o.offsetHeight||300;Ie<0&&(Ie=Math.max(Se,innerHeight-c-Se)),ot=a(ot,innerWidth-o.offsetWidth),Ie=a(Ie,innerHeight-c),o.style.transform=`translate(${ot-Se}px, ${Ie}px)`}let d=null;function v(c){c.button===0&&(c.preventDefault(),c.stopPropagation(),d={x:c.clientX,y:c.clientY,dx:ot,dy:Ie},o.setAttribute("data-dragging",""),c.currentTarget.setPointerCapture(c.pointerId))}function w(c){d&&(ot=d.dx+(c.clientX-d.x),Ie=d.dy+(c.clientY-d.y),l())}function S(){d=null,o.removeAttribute("data-dragging")}addEventListener("resize",l);let u=null,g=[],k;function b(c){let y=document.createElement("div");return y.className="edge",y.textContent=c===0?"0":J(c),c===0&&y.setAttribute("data-zero",""),y}function G(c,y,N,X){let[Z,ae,te,K]=N,q=document.createElement("div");q.className="region",q.setAttribute("data-level",String(y));let h=document.createElement("span");h.className="tag",h.textContent=c;let A=document.createElement("div");A.className="row";let $=document.createElement("div");$.className="fill",$.appendChild(X),A.append(b(K),$,b(ae));let F=document.createElement("div");return F.className="head",F.append(h,b(Z)),q.append(F,A,b(te)),q}return{show(c,y=[],N){g=y,k=N;let X=Lt(c.el),[Z,ae,te,K]=X.border,[q,h,A,$]=X.padding,F=Ae(c.el),s=c.width/F.x,p=c.height/F.y,m=Math.abs(F.x-1)>.001||Math.abs(F.y-1)>.001,C=document.createElement("header"),D=document.createElement("span");D.className="name",D.textContent=c.label;let P=document.createElement("span");P.className="size",P.textContent=`${J(s)} \xD7 ${J(p)}`;let B=document.createElement("button");if(B.className="close",B.textContent="\xD7",B.title="close (B brings it back)",B.addEventListener("pointerdown",R=>R.stopPropagation()),B.addEventListener("click",R=>{R.stopPropagation(),Ye=!0,o.removeAttribute("data-open")}),C.append(D,P),m){let R=document.createElement("span");R.className="scale",R.textContent=`\xD7${J(F.x)}`,R.title=`renders at ${J(c.width)} \xD7 ${J(c.height)}`,C.appendChild(R)}C.appendChild(B),C.addEventListener("pointerdown",v),C.addEventListener("pointermove",w),C.addEventListener("pointerup",S),C.addEventListener("pointercancel",S);let W=document.createElement("div");W.className="content",W.textContent=`${J(s-K-ae-$-h)} \xD7 ${J(p-Z-te-q-A)}`,W.title=W.textContent;let H=[C,G("margin",1,X.margin,G("border",2,X.border,G("padding",3,X.padding,W)))];if(r){let R=mn(c.el),f=lt(c.el);H.push(f.length&&R?i("type",f.map(T=>[T.label,T.value])):i("type",[["","nothing of its own to set type on"]]))}if(N&&N.el!==c.el&&N.el.isConnected){let R=$n(N.el,c.el).map(Q=>[Q.prop,`${Q.a||"\u2014"} \u2192 ${Q.b||"\u2014"}`]),f=R.slice(0,10);R.length>f.length&&f.push(["",`and ${R.length-f.length} more`]);let T=N.label===c.label?"the one locked before":N.label;H.push(i(`differs from ${T}`,f.length?f:[["","nothing in the properties it compares"]]))}let j=vn(c.el);if(j&&j.rows.length&&H.push(i(`laid out by ${j.display}`,j.rows.map(R=>[R.label,R.value]))),y.length){let R=y.map(T=>[J(T.px),T.detail]),f=bn(y.map(T=>T.px));f&&R.push(["",f]),H.push(i("gaps",R))}let E=ct(c.el),ne=hn([s,p,...X.margin,...X.border,...X.padding,...r?lt(c.el).map(R=>R.px):[]],E);ne&&H.push(i("tokens",[["",ne]]));let se=wn(c.el);se.length&&H.push(i("styled by",se.slice(0,4).map(R=>[R.selector,R.file])));let pe=xn(c.el);pe>1&&H.push(i("matches",[["",`${pe} elements share ${tt(c.el)}`]]));let oe=E.filter(R=>et(R.value));if(oe.length){let R=yn(c.el).map(({label:f,value:T})=>{let Q=dt(T,oe);return[f,Q.length?`${T}  ${Q.join(" ")}`:`${T}  \u2014`]});R.length&&H.push(i("colour",R))}n.replaceChildren(...H),u=c,l(),!Ye&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},showsType:()=>r,isOpen:()=>!Ye&&u!==null,toggleType(){r=!r,u&&this.show(u,g,k)},asText(){if(!u)return"";let c=Lt(u.el),y=Ae(u.el),N=u.width/y.x,X=u.height/y.y,Z=te=>te.map(K=>J(K)).join(" "),ae=[`${u.label}  ${J(N)} \xD7 ${J(X)}`,`margin   ${Z(c.margin)}`,`border   ${Z(c.border)}`,`padding  ${Z(c.padding)}`];if(r)for(let te of lt(u.el))ae.push(`${te.label.padEnd(8)} ${te.value}`);return ae.join(dr)},hide(){u=null,o.removeAttribute("data-open")},setHidden(c){o.toggleAttribute("data-away",c)},toggle(){u&&(Ye=!Ye,Ye?o.removeAttribute("data-open"):(l(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",l),o.remove(),t.remove()}}}function _n(e=20,t=1e3){let o=[];return{push(n,r,i=Date.now()){let a=o[o.length-1];if(a&&r!==""&&a.tag===r&&i-a.at<=t){a.at=i;return}o.push({state:n,tag:r,at:i}),o.length>e&&o.shift()},pop(){return o.pop()?.state??null},peek(){return o[o.length-1]?.state??null},depth(){return o.length},clear(){o.length=0}}}var pr="0 0 24 24";var L=(e,t)=>t===void 0?{path:e}:{path:e,fade:t},Pe=(e,t,o,n,r)=>({rect:[e,t,o,n,r]}),mr={rulers:[L("M2 8V4"),L("M22 8V4"),L("M22 6H2"),Pe(2,12,20,8,2),L("M6 15v-3"),L("M10 15v-3"),L("M14 15v-3"),L("M18 15v-3")],xray:[L("M3 7V5a2 2 0 0 1 2-2h2"),L("M17 3h2a2 2 0 0 1 2 2v2"),L("M21 17v2a2 2 0 0 1-2 2h-2"),L("M7 21H5a2 2 0 0 1-2-2v-2")],grid:[Pe(3,3,18,18,2),L("M9 3v18"),L("M15 3v18")],pixels:[Pe(3,3,18,18,2),L("M3 9h18"),L("M3 15h18"),L("M9 3v18"),L("M15 3v18")],type:[L("M12 4v16"),L("M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"),L("M9 20h6")],panel:[Pe(3,3,18,18,2),Pe(8,8,8,8,1)],freeze:[Pe(14,3,5,18,1),Pe(5,3,5,18,1)],copy:[Pe(8,8,14,14,2),L("M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2")],pick:[L("m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12"),L("m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z"),L("m2 22 .414-.414")],hide:[L("M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"),L("M14.084 14.158a3 3 0 0 1-4.242-4.242"),L("M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"),L("m2 2 20 20")],undo:[L("M9 14 4 9l5-5"),L("M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11")],edit:[L("M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"),L("m15 5 4 4")],sideTop:[L("M4 5h16v14H4z",.3),L("M4 5h16")],sideRight:[L("M4 5h16v14H4z",.3),L("M20 5v14")],sideBottom:[L("M4 5h16v14H4z",.3),L("M4 19h16")],sideLeft:[L("M4 5h16v14H4z",.3),L("M4 5v14")],arrowUp:[L("m5 12 7-7 7 7"),L("M12 19V5")],arrowDown:[L("M12 5v14"),L("m19 12-7 7-7-7")],link:[L("M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"),L("M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71")],check:[L("M20 6 9 17l-5-5")],cross:[L("M18 6 6 18"),L("m6 6 12 12")]},Ht="http://www.w3.org/2000/svg";function we(e,t=16){let o=document.createElementNS(Ht,"svg");o.setAttribute("viewBox",pr),o.setAttribute("width",String(t)),o.setAttribute("height",String(t)),o.setAttribute("fill","none"),o.setAttribute("stroke","currentColor"),o.setAttribute("stroke-width","2"),o.setAttribute("stroke-linecap","round"),o.setAttribute("stroke-linejoin","round"),o.setAttribute("aria-hidden","true");for(let n of mr[e])if("rect"in n){let[r,i,a,l,d]=n.rect,v=document.createElementNS(Ht,"rect");v.setAttribute("x",String(r)),v.setAttribute("y",String(i)),v.setAttribute("width",String(a)),v.setAttribute("height",String(l)),v.setAttribute("rx",String(d)),o.appendChild(v)}else{let r=document.createElementNS(Ht,"path");r.setAttribute("d",n.path),n.fade!==void 0&&r.setAttribute("opacity",String(n.fade)),o.appendChild(r)}return o}var hr=[{title:"Pointing at things",rows:[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure whatever is under the cursor"],["Click","lock an element, so it keeps measuring after the pointer leaves"],["Right-click","add another to the locked set, or drop one from it. Two locked also gets you a diff"],["Drag the panel header","move the box model out of your way"],["Esc","clear the locks, then close the tool"]]},{title:"Guides",rows:[["Drag from a rule","pull out a guide; drag it back into the rule to throw it away"],["V  /  H","drop a vertical or horizontal guide at the cursor"],["Hover a guide","its distance to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the guide you last touched. Shift for 10px"],["L","pin a guide, so it cannot be moved or deleted by accident"],["Ctrl/Cmd while placing","ignore snapping"],["Del","remove the guide under the cursor. Shift+Del for all of them"]]}],ve=z.edge,zt=24,fr=900,rt=Re,it=z.base,gr=`
.flag {
  position: fixed; top: ${ve}px; right: ${ve}px;
  display: flex; align-items: center; gap: 8px;
  transition: top ${O.ui};
  padding: ${(Re-zt)/2}px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${M.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${M.tag}px; font-weight: ${U.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${x.primary};
  background: ${fe};
  box-shadow: ${Le};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
/* No negative tracking: it is 11px, and tightening is what large text wants.
   Small text reads better at zero or a hair positive. */
.flag .name { letter-spacing: 0; }
/* The rulers draw a gutter along the top edge, and the badge sits in it. Step
   down out of the way rather than covering the ticks the rulers exist to show. */
.flag[data-rulers] { top: ${ve+Y}px; }
.help[data-rulers] { top: ${ve+Y+rt+it}px; }
.flag:hover { background: ${I(1)}; }
.flag .count { color: ${x.secondary}; }

/* A layers bar, not a palette. Switches, then the one control that changes the
   page, then the things that happen once. */
.tools { display: flex; align-items: center; gap: 2px; }
.sep {
  width: 1px; align-self: stretch; margin: 0 4px;
  background: ${le};
}
.tool {
  width: ${zt}px; height: ${zt}px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; cursor: pointer;
  font: inherit; font-size: ${M.tag}px; font-weight: ${U.medium};
  color: ${x.tertiary};
}
/* Both glyphs occupy the same cell so one can cross-fade into the other; a
   swap would jump, and the point is to be noticed without being a movement. */
.tool > svg { grid-area: 1 / 1; transition: opacity ${O.ui}; }
.tool > .ack { opacity: 0; }
.tool[data-ack] > .ack { opacity: 1; }
.tool[data-ack] > .glyph { opacity: 0; }
.tool:hover { background: ${I(2)}; color: ${x.primary}; }
/* On the press, not on the release. Waiting for the click to acknowledge a
   button is the difference between a control that answers and one that lags,
   and it costs one rule. */
.tool:active { background: ${I(4)}; color: ${x.primary}; }
.tool:focus-visible { outline: 1px solid ${x.primary}; outline-offset: -1px; }
/* On is the film, not a colour: the three hues each already mean something on
   the canvas, and a fourth here would say nothing. */
.tool[data-on] { background: ${I(4)}; color: ${x.primary}; }
/*
 * Armed reads differently from on, deliberately. Every other toggle draws
 * something over the page; this one lets the page be rewritten, and a tool that
 * can do that while looking exactly like one that cannot is the problem the
 * arming design exists to avoid. It inverts rather than taking a hue: red
 * already means a measurement here, and a second meaning for it would cost
 * more than the emphasis is worth.
 */
.tool[data-tool='edit'][data-on] {
  background: ${x.primary};
  color: ${fe};
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
  position: fixed; top: ${ve+rt+it}px; right: ${ve}px;
  /* 368 plus two insets is 400, so this was the first thing to hang off the
     left edge of a phone-width window. */
  /* The padding is in the subtraction because these boxes are content-box:
     without it the clamp lets the panel sit flush against the far edge with
     no inset at all, which reads as broken rather than as tight. */
  width: min(368px, calc(100vw - ${ve*2+z.base*2}px));
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${ve*2+rt+it}px); overflow-y: auto;
  padding: ${z.base}px; border-radius: 0;
  user-select: none;
  font-family: ${M.stack};
  font-synthesis: none;
  font-size: ${M.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${x.primary};
  background: ${fe};
  box-shadow: ${Le};
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
  transition: opacity ${O.ui}, transform ${O.ui}, visibility 0s linear 160ms;
}
.help[data-open] {
  opacity: 1; visibility: visible; pointer-events: auto;
  transform: none;
  transition: opacity ${O.ui}, transform ${O.ui}, visibility 0s;
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
  color: ${x.tertiary}; line-height: 0;
}
.help h4 {
  grid-column: 1 / -1; margin: 10px 0 2px;
  font-size: ${M.tag}px; font-weight: ${U.semibold};
  color: ${x.tertiary};
}
.help h4:first-child { margin-top: 0; }
.help kbd {
  display: inline-block; padding: 3px 5px;
  font: inherit; font-weight: ${U.medium};
  border: 1px solid ${le};
  background: ${I(2)};
}
/* These run to three lines, and a one-word last line reads as a mistake. */
.help dd { margin: 0; color: ${x.secondary}; text-wrap: pretty; }
`,Ft=[{name:"rulers",label:"Rulers",key:"R",toggle:!0,what:"a scale down the top and left edges, in page pixels \u2014 and the gutters you drag guides out of"},{name:"xray",label:"X-ray",key:"X",toggle:!0,what:"outline every element at once, to see the boxes a layout is really made of"},{name:"grid",label:"Column grid",key:"G",toggle:!0,what:"the grid your design is built on, columns filled and gutters left empty. Needs one configured"},{name:"pixels",label:"Pixel grid",key:"K",toggle:!0,what:"a ten-pixel lattice over the page, to read an offset off without measuring it"},{name:"type",label:"Type",key:"T",toggle:!0,what:"add size, weight, line height and tracking to the panel, each checked against your scale"},{name:"panel",label:"Box model",key:"B",toggle:!0,what:"the readout itself \u2014 margins, borders, padding, what places the element, what styles it"},{name:"hide",label:"Hide",key:"\\",toggle:!0,what:"everything drawn, out of the way for a moment. Your locks, guides and layers all survive it"},{name:"freeze",label:"Freeze",key:"F",toggle:!0,what:"hold every animation and transition where it stands, so a moving thing can be measured"},{name:"copy",label:"Copy",key:"C",toggle:!1,what:"put everything in the panel on the clipboard as text"},{name:"pick",label:"Colour",key:"P",toggle:!1,what:"sample a colour from anywhere on screen and match it against your palette"},{name:"edit",label:"Edit",key:"E",toggle:!0,what:"let the panel change the page. Off until you say so, shown while it is on, and everything goes back when you turn it off"},{name:"undo",label:"Undo",key:"Ctrl/Cmd + Z",toggle:!1,what:"step back through the guides \u2014 a whole run of nudges counts as one"}];function Xn(e,t){let o=document.createElement("style");o.textContent=gr,e.appendChild(o);let n=document.createElement("div");n.className="flag";let r=document.createElement("span");r.className="name",r.textContent="Align";let i=document.createElement("span");i.className="count";let a=new Map,l=new Map,d=document.createElement("div");d.className="tools";for(let g of Ft){if(g.name==="freeze"||g.name==="copy"){let G=document.createElement("span");G.className="sep",d.appendChild(G)}let k=document.createElement("button");k.type="button",k.className="tool",k.dataset.tool=g.name;let b=we(g.name);b.classList.add("glyph"),k.appendChild(b),k.setAttribute("aria-label",g.label),k.title=`${g.label}  \xB7  ${g.key}
${g.what}`,g.toggle||k.setAttribute("data-once",""),k.addEventListener("click",G=>{G.stopPropagation(),t(g.name)}),a.set(g.name,k),d.appendChild(k)}n.append(r,d,i);let v=document.createElement("div");v.className="help";let w=document.createElement("dl");function S(g){let k=document.createElement("h4");k.textContent=g,w.appendChild(k)}function u(g,k,b){let G=document.createElement("span");G.className="glyph",b&&G.appendChild(we(b,14));let c=document.createElement("dt"),y=document.createElement("kbd");y.textContent=g,c.appendChild(y);let N=document.createElement("dd");N.textContent=k,w.append(G,c,N)}S("The bar, left to right");for(let g of Ft)u(g.key,`${g.label} \u2014 ${g.what}`,g.name);for(let g of hr){S(g.title);for(let[k,b]of g.rows)u(k,b)}return v.appendChild(w),n.addEventListener("click",g=>{g.stopPropagation(),v.toggleAttribute("data-open")}),e.append(n,v),{acknowledge(g,k){let b=a.get(g);if(!b)return;clearTimeout(l.get(g)),b.querySelector(".ack")?.remove();let G=we(k?"check":"cross");G.classList.add("ack"),b.appendChild(G),requestAnimationFrame(()=>b.setAttribute("data-ack",k?"yes":"no")),l.set(g,setTimeout(()=>{b.removeAttribute("data-ack"),setTimeout(()=>b.querySelector(".ack")?.remove(),200)},fr))},update(g,k){i.textContent=g>0?`${g} locked`:"";let b=k.rulers&&!k.hide;n.toggleAttribute("data-rulers",b),v.toggleAttribute("data-rulers",b);for(let y of Ft)y.toggle&&a.get(y.name)?.toggleAttribute("data-on",k[y.name]===!0);let G=a.get("copy");G&&(G.disabled=!k.canCopy);let c=a.get("undo");c&&(c.disabled=!k.canUndo)},closeHelp(){let g=v.hasAttribute("data-open");return v.removeAttribute("data-open"),g},destroy(){for(let g of l.values())clearTimeout(g);n.remove(),v.remove(),o.remove()}}}var br=2,yr=3;function xr(e,t,o,n,r=1){let i=e+t/br,a=r>0?Math.round(i/r)*r:i;return Math.max(o,Math.min(n,Number(a.toPrecision(12))))}function wr(e,t,o){let n=/^\s*(-?\d*\.?\d+)\s*(px|rem|em|%)?\s*$/i.exec(e);if(!n)return null;let r=parseFloat(n[1]);return Number.isFinite(r)?Math.max(t,Math.min(o,r)):null}function Yn(e){return String(Math.round(e*100)/100)}var vr=`
.scrub {
  display: flex; align-items: center; gap: 6px;
  min-width: 0;
  height: 28px;
  padding: 0 8px;
  border: 0; border-radius: 0;
  background: ${I(1)};
  color: ${x.primary};
  font: inherit;
  font-size: ${M.body}px; font-weight: ${U.regular};
  font-variant-numeric: tabular-nums;
  line-height: 1;
  text-align: left;
  user-select: none;
  touch-action: none;
  transition: background ${O.ui};
}
.scrub[data-axis='x'] { cursor: ew-resize; }
.scrub[data-axis='y'] { cursor: ns-resize; }
.scrub:hover { background: ${I(3)}; }
.scrub[data-scrubbing] { background: ${I(5)}; }
.scrub:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }

/* The glyph is the label, so it must not shrink when the number grows. */
.scrub-glyph { flex: none; display: grid; place-items: center; color: ${x.tertiary}; }
.scrub-text {
  flex: none;
  color: ${x.tertiary};
  font-size: ${M.tag}px;
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
  color: ${x.primary};
  font: inherit;
  font-size: ${M.body}px;
  font-variant-numeric: tabular-nums;
  text-align: right;
}
.scrub-input:focus { box-shadow: inset 0 -1px ${le}; }
`,Kn="align-scrub";function kr(e){if(e.querySelector(`#${Kn}`))return;let t=document.createElement("style");t.id=Kn,t.textContent=vr,e.appendChild(t)}function jn(e,t){kr(e);let o=t.min??0,n=t.max??9999,r=t.step??1,i=t.axis??"x",a=t.value,l=document.createElement("button");if(l.type="button",l.className="scrub",l.dataset.axis=i,l.setAttribute("aria-label",t.label),l.title=`${t.label}. Drag to change, click to type.`,t.glyph){let c=document.createElement("span");c.className="scrub-glyph",c.appendChild(we(t.glyph,14)),l.appendChild(c)}else if(t.text){let c=document.createElement("span");c.className="scrub-text",c.textContent=t.text,l.appendChild(c)}let d=document.createElement("span");d.className="scrub-value",l.appendChild(d);function v(){d.textContent=Yn(a),l.setAttribute("aria-valuenow",String(a))}function w(c,y){let N=Math.max(o,Math.min(n,c));N!==a&&(a=N,v(),t.onChange(a)),y||t.onCommit?.(a)}let S=null,u=!1,g=1;l.addEventListener("pointerdown",c=>{if(!(b||c.button!==0)){c.preventDefault(),c.stopPropagation();try{l.setPointerCapture(c.pointerId)}catch{}S={x:c.clientX,y:c.clientY,value:a},u=!1,g=(i==="x"?Ae(l).x:Ae(l).y)||1,l.setAttribute("data-scrubbing","")}}),l.addEventListener("pointermove",c=>{if(!S)return;let y=i==="x"?(c.clientX-S.x)/g:(c.clientY-S.y)/g;!u&&Math.abs(y)>yr&&(u=!0),u&&w(xr(S.value,y,o,n,r),!0)});let k=c=>{if(S){try{l.releasePointerCapture(c.pointerId)}catch{}S=null,l.removeAttribute("data-scrubbing"),u&&t.onCommit?.(a)}};l.addEventListener("pointerup",k),l.addEventListener("pointercancel",k);let b=null;function G(){if(b)return;b=document.createElement("input"),b.className="scrub-input",b.type="text",b.value=Yn(a),b.setAttribute("aria-label",`${t.label}, as a number`),d.style.display="none",l.appendChild(b),b.focus(),b.select();let c=y=>{if(b){if(y){let N=wr(b.value,o,n);N!==null&&w(N,!1)}b.remove(),b=null,d.style.display="",l.focus()}};b.addEventListener("keydown",y=>{y.stopPropagation(),y.key==="Enter"?(y.preventDefault(),c(!0)):y.key==="Escape"&&(y.preventDefault(),c(!1))}),b.addEventListener("blur",()=>c(!0)),b.addEventListener("pointerdown",y=>y.stopPropagation())}return l.addEventListener("click",c=>{if(c.stopPropagation(),u){u=!1;return}G()}),l.addEventListener("keydown",c=>{if(c.target!==l||c.altKey||c.metaKey||c.ctrlKey)return;let y=c.shiftKey?10:1;c.key==="ArrowUp"||c.key==="ArrowRight"?(c.preventDefault(),c.stopPropagation(),w(a+r*y,!1)):c.key==="ArrowDown"||c.key==="ArrowLeft"?(c.preventDefault(),c.stopPropagation(),w(a-r*y,!1)):c.key==="Enter"&&(c.preventDefault(),c.stopPropagation(),G())}),v(),{el:l,set(c){a=Math.max(o,Math.min(n,c)),v()},destroy(){b?.remove(),l.remove()}}}function Un(e,t=0,o=0){return Math.min(100,Math.max(...[e,t,o].map(n=>{let[r,i="0"]=String(n).toLowerCase().split("e");return Math.max(0,(r.split(".")[1]?.length??0)-Number(i))})))}function Wt(e,t,o,n){let r=o??-1/0,i=n??1/0,a=Math.max(r,Math.min(i,e));if(a===r||a===i||!Number.isFinite(t)||t<=0)return a;let l=o??0,d=l+Math.round((a-l)/t)*t;return Math.max(r,Math.min(i,Number(d.toPrecision(14))))}var $r=.03125;function Er(e,t,o){let n=(e-t)/(o-t),r=Math.round(n*10)/10;return Math.abs(n-r)<=$r?t+r*(o-t):e}var Sr=32,Cr=8,Tr=200;function Vn(e,t){let o=Math.max(0,e-Sr);return t*Cr*Math.sqrt(Math.min(o/Tr,1))}function ft(e,t,o){return o===t?0:(e-t)/(o-t)*100}function qn(e,t,o){let n=Math.max(0,Math.min(1,e));return t+n*(o-t)}function Mr(e,t,o,n,r,i=!1){if(e==="Home")return o;if(e==="End")return n;let a=["ArrowRight","ArrowUp","PageUp"].includes(e)?1:["ArrowLeft","ArrowDown","PageDown"].includes(e)?-1:0;if(!a)return;if(!(r>0)||n<=o)return o;let l=e.startsWith("Page")||i?10:1,d=(t-o)/r,v=o+(a>0?Math.floor(d+1e-9)+l:Math.ceil(d-1e-9)-l)*r;return Math.max(o,Math.min(n,Number(v.toPrecision(14))))}function Ar(e,t,o){let n=(t-e)/o;return n<=10&&Number.isFinite(n)&&n>1?Array.from({length:Math.round(n)-1},(r,i)=>(i+1)*o/(t-e)*100):Array.from({length:9},(r,i)=>(i+1)*10)}function Jn(e,t,o=0,n=0){let r=Un(t,o,n),i=Math.max(r,Math.min(4,Un(e)));return!Number.isFinite(t)||t<=0?i:Wt(e,t,o,n)===e?r:i}function Lr(e,t,o,n){return(o-t)/n<=10?Math.max(t,Math.min(o,t+Math.round((e-t)/n)*n)):Er(e,t,o)}var Nr={stiffness:300,damping:25,mass:.8},Rr={stiffness:220,damping:22,mass:1};function Qn(e,t,o,n,r){let i=(-r.stiffness*(e-o)-r.damping*t)/r.mass,a=t+i*n;return{x:e+a*n,v:a}}function Zn(e,t,o,n=.01){return Math.abs(e-o)<n&&Math.abs(t)<n}var Pr=0,Gr=.5,Br=.9,Dr=.1,Ir=3,Or=800,eo=8,gt=3,Hr=20,no=10,_t=12,zr=`
.sl {
  position: relative;
  height: ${Re}px;
  overflow: hidden;
  background: ${I(1)};
  border-radius: 0;
  cursor: pointer;
  user-select: none;
  touch-action: none;
}
.sl:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }

/* Behind everything, and scaled rather than resized: a width change is layout,
   a transform is not, and this moves on every pointer event of a drag. */
.sl-fill {
  position: absolute; inset: 0;
  transform-origin: left center;
  transform: scaleX(0);
  background: ${I(3)};
  transition: background ${O.ui};
  pointer-events: none;
}
.sl[data-awake] .sl-fill { background: ${I(5)}; }

.sl-marks { position: absolute; inset: 0; pointer-events: none; }
.sl-mark {
  position: absolute; top: 50%;
  width: 1px; height: 8px;
  transform: translate(-50%, -50%);
  background: transparent;
  transition: background ${O.ui};
}
.sl[data-awake] .sl-mark { background: ${le}; }

.sl-handle {
  position: absolute; top: 50%; left: 0;
  width: ${gt}px; height: ${Hr}px;
  background: ${x.primary};
  pointer-events: none;
  opacity: ${Pr};
  /* Two transitions, two jobs: opacity and the squash are eased, the position
     is not \u2014 it is written every frame and must not lag the pointer. */
  transition: opacity ${O.ui}, scale ${O.ui};
  scale: 0.25 1;
}
.sl[data-awake] .sl-handle { opacity: ${Gr}; scale: 1 1; }
.sl[data-dragging] .sl-handle { opacity: ${Br}; }
.sl[data-dodge] .sl-handle { opacity: ${Dr}; scale: 1 0.75; }

.sl-label, .sl-value {
  position: absolute; top: 50%;
  transform: translateY(-50%);
  font-size: ${M.body}px; font-weight: ${U.medium};
  line-height: 1;
  white-space: nowrap;
  transition: color ${O.ui};
}
.sl-label { left: ${no}px; color: ${x.secondary}; pointer-events: none; }
.sl-value {
  right: ${_t}px;
  color: ${x.secondary};
  /* Inter has tabular figures, so the number stops shifting as it changes
     without loading a second face for it. */
  font-variant-numeric: tabular-nums;
  pointer-events: auto;
  border-bottom: 1px solid transparent;
  padding-bottom: 1px;
}
.sl[data-awake] .sl-value { color: ${x.primary}; }
/* Only after the hover delay: the underline is the promise that a click here
   edits rather than seeks, and it must not appear during a drag. */
.sl-value[data-editable] { border-bottom-color: ${x.secondary}; cursor: text; }

.sl-input {
  position: absolute; right: ${_t}px; top: 50%;
  transform: translateY(-50%);
  width: 5ch;
  padding: 0 0 1px; border: 0;
  border-bottom: 1px solid ${x.secondary};
  background: none; outline: none;
  text-align: right;
  font: inherit;
  font-size: ${M.body}px; font-weight: ${U.medium};
  font-variant-numeric: tabular-nums;
  color: ${x.primary};
}
`,to="align-slider";function Fr(e){if(e.querySelector(`#${to}`))return;let t=document.createElement("style");t.id=to,t.textContent=zr,e.appendChild(t)}function bt(e,t){Fr(e);let o=t.min??0,n=t.max??1,r=t.step??.01,i=t.value,a=document.createElement("div");a.className="sl",a.tabIndex=0,a.setAttribute("role","slider"),a.setAttribute("aria-label",t.label),a.setAttribute("aria-valuemin",String(o)),a.setAttribute("aria-valuemax",String(n));let l=document.createElement("div");l.className="sl-fill";let d=document.createElement("div");d.className="sl-marks";for(let f of Ar(o,n,r)){let T=document.createElement("div");T.className="sl-mark",T.style.left=`${f}%`,d.appendChild(T)}let v=document.createElement("div");v.className="sl-handle";let w=document.createElement("span");w.className="sl-label",w.textContent=t.label;let S=document.createElement("span");S.className="sl-value",a.append(d,l,v,w,S);let u=ft(i,o,n),g=0,k=null,b=0,G=0;function c(){return a.offsetWidth}function y(){l.style.transform=`scaleX(${u/100})`;let f=c(),T=u/100*f,Q=Math.max(gt,Math.min(f-gt,T))-gt/2;v.style.transform=`translate(${Q}px, -50%)`;let ye=!1;if(f>0){let xe=no+w.offsetWidth+eo,he=f-_t-S.offsetWidth-eo;ye=T<xe||T>he}a.toggleAttribute("data-dodge",ye)}function N(){let f=Jn(i,r,o,n);S.textContent=t.unit?`${i.toFixed(f)}${t.unit}`:i.toFixed(f),a.setAttribute("aria-valuenow",String(i)),a.setAttribute("aria-valuetext",S.textContent)}function X(){b&&cancelAnimationFrame(b),b=0,k=null,g=0}function Z(){return typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches}function ae(f,T=Nr){if(Z()){X(),u=f,y();return}if(k=f,G=performance.now(),b)return;let Q=ye=>{let xe=Math.min((ye-G)/1e3,.03333333333333333);if(G=ye,k===null){b=0;return}let he=Qn(u,g,k,xe,T);if(u=he.x,g=he.v,y(),Zn(u,g,k)){u=k,g=0,k=null,b=0,y();return}b=requestAnimationFrame(Q)};b=requestAnimationFrame(Q)}function te(f,T){let Q=Wt(f,r,o,n),ye=Q!==i;i=Q,N(),T?ae(ft(i,o,n)):(X(),u=ft(i,o,n),y()),ye&&t.onChange(i)}let K=null,q=!0,h=null,A=1,$=0,F=0;function s(f){if($=f,f===0){a.style.width="",a.style.transform="";return}a.style.width=`calc(100% + ${Math.abs(f)}px)`,a.style.transform=f<0?`translateX(${f}px)`:""}function p(){if($===0)return;if(Z()){s(0),a.style.width="",a.style.transform="";return}let f=0,T=performance.now(),Q=ye=>{let xe=Math.min((ye-T)/1e3,.03333333333333333);T=ye;let he=Qn($,f,0,xe,Rr);if(f=he.v,s(he.x),Zn(he.x,f,0,.05)){s(0),a.style.width="",a.style.transform="",F=0;return}F=requestAnimationFrame(Q)};F=requestAnimationFrame(Q)}function m(f){if(!h)return 0;let T=c();return T<=0?0:(f-h.left)/A/T}let C=f=>{if(!(E||f.button!==0)){f.preventDefault();try{a.setPointerCapture(f.pointerId)}catch{}K={x:f.clientX,y:f.clientY},q=!0,h=a.getBoundingClientRect(),A=Ae(a).x||1,a.setAttribute("data-awake","")}},D=f=>{if(!K)return;let T=f.clientX-K.x,Q=f.clientY-K.y;q&&Math.hypot(T,Q)>Ir&&(q=!1,a.setAttribute("data-dragging","")),!(q||!h)&&(Z()||(f.clientX<h.left?s(Vn(h.left-f.clientX,-1)):f.clientX>h.right?s(Vn(f.clientX-h.right,1)):$!==0&&s(0)),X(),te(qn(m(f.clientX),o,n),!1))},P=f=>{K&&(q&&te(Lr(qn(m(f.clientX),o,n),o,n,r),!0),t.onCommit?.(i),p(),K=null,a.removeAttribute("data-dragging"),W||a.removeAttribute("data-awake"))},B=()=>{K&&(s(0),a.style.width="",a.style.transform="",K=null,a.removeAttribute("data-dragging"),W||a.removeAttribute("data-awake"))},W=!1,H=()=>{W=!0,a.setAttribute("data-awake","")},j=()=>{W=!1,K||a.removeAttribute("data-awake")},E=null,ne=!1,se=0;function pe(){if(E)return;E=document.createElement("input"),E.className="sl-input",E.type="text",E.setAttribute("aria-label",`${t.label} value`),E.value=i.toFixed(Jn(i,r,o,n)),S.style.display="none",a.appendChild(E),E.focus(),E.select();let f=T=>{if(E){if(T){let Q=parseFloat(E.value);Number.isFinite(Q)&&(te(Math.max(o,Math.min(n,Q)),!0),t.onCommit?.(i))}E.remove(),E=null,S.style.display="",oe(!1),a.focus()}};E.addEventListener("keydown",T=>{T.stopPropagation(),T.key==="Enter"?(T.preventDefault(),f(!0)):T.key==="Escape"&&(T.preventDefault(),f(!1))}),E.addEventListener("blur",()=>f(!0)),E.addEventListener("pointerdown",T=>T.stopPropagation())}function oe(f){ne=f,S.toggleAttribute("data-editable",f)}S.addEventListener("pointerenter",()=>{E||K||(se=window.setTimeout(()=>oe(!0),Or))}),S.addEventListener("pointerleave",()=>{clearTimeout(se),E||oe(!1)}),S.addEventListener("pointerdown",f=>{ne&&(f.stopPropagation(),f.preventDefault(),pe())});let R=f=>{if(f.target!==a||f.altKey||f.metaKey||f.ctrlKey)return;let T=Mr(f.key,i,o,n,r,f.shiftKey);if(T===void 0){if(f.key!=="Enter")return;f.preventDefault(),f.stopPropagation(),oe(!0),pe();return}f.preventDefault(),f.stopPropagation(),te(T,!1),t.onCommit?.(i)};return a.addEventListener("pointerdown",C),a.addEventListener("pointermove",D),a.addEventListener("pointerup",P),a.addEventListener("pointercancel",B),a.addEventListener("lostpointercapture",B),a.addEventListener("pointerenter",H),a.addEventListener("pointerleave",j),a.addEventListener("keydown",R),N(),requestAnimationFrame(y),{el:a,set(f){i=Wt(f,r,o,n),N(),X(),u=ft(i,o,n),y()},destroy(){X(),F&&cancelAnimationFrame(F),clearTimeout(se),a.remove()}}}function ge(e,t){return getComputedStyle(e).getPropertyValue(t).trim()}function Wr(e,t){let o=parseFloat(e);if(e.endsWith("px")&&Number.isFinite(o)){let r=At(o,t)[0];if(r)return r}return et(e)?dt(e,t)[0]??null:null}function _r(e){if(e.length===0)return"";let t=new Map;for(let n of e){let r=t.get(n.selector)??[];r.push(n),t.set(n.selector,r)}let o=["These changes were made live in the browser and are not in the source yet.","Apply them, preferring the named token wherever one is given.",""];for(let[n,r]of t){o.push(`${n} {`);for(let i of r){let a=i.token?`var(${i.token})`:i.to,l=i.token?`  /* ${i.to}, was ${i.from} */`:`  /* was ${i.from} */`;o.push(`  ${i.prop}: ${a};${l}`)}o.push("}","")}return o.join(`
`).trimEnd()}function oo(){let e=new Map,t=!1;function o(r){let i=e.get(r);if(i)return i;let a=new Map;return e.set(r,a),a}function n(r,i,a){let l=r.style;a.inline?l.setProperty(i,a.inline):l.removeProperty(i)}return{get armed(){return t},arm(){t=!0},disarm(){let r=this.revertAll();return t=!1,r},set(r,i,a){if(!t)return;let l=o(r);l.has(i)||l.set(i,{inline:r.style.getPropertyValue(i),computed:ge(r,i)}),r.style.setProperty(i,a)},revert(r,i){let a=e.get(r),l=a?.get(i);!a||!l||(n(r,i,l),a.delete(i),a.size===0&&e.delete(r))},revertAll(){let r=0;for(let[i,a]of e)for(let[l,d]of a)n(i,l,d),r+=1;return e.clear(),r},touched(r,i){return e.get(r)?.has(i)??!1},touchedProps(r){return[...e.get(r)?.keys()??[]].sort()},changes(){let r=[];for(let[i,a]of e)for(let[l,d]of a)r.push({el:i,prop:l,from:d.computed,to:ge(i,l)});return r},asPrompt(){let r=[];for(let[i,a]of e){let l=ct(i),d=tt(i);for(let[v,w]of a){let S=ge(i,v);S!==w.computed&&r.push({selector:d,prop:v,from:w.computed,to:S,token:Wr(S,l)})}}return _r(r)}}}var ro={x:0,y:2,blur:8,spread:0,colour:"rgba(0, 0, 0, 0.2)",inset:!1};function Xr(e,t){let o=[],n=0,r="";for(let i of e){if(i==="("?n+=1:i===")"&&(n-=1),i===t&&n===0){o.push(r.trim()),r="";continue}r+=i}return r.trim()&&o.push(r.trim()),o.filter(Boolean)}function Yr(e){let t=e.trim();if(!t||t==="none")return null;let o=t,n=/(^|\s)inset(\s|$)/.test(o);n&&(o=o.replace(/(^|\s)inset(\s|$)/," ").trim());let r=[];o=o.replace(/[a-z-]+\([^)]*\)/gi,d=>(r.push(d),`\0${r.length-1}`));let i=o.split(/\s+/).filter(Boolean).map(d=>d.startsWith("\0")?r[Number(d.slice(1))]:d),a=[],l=[];for(let d of i)/^-?\d*\.?\d+(px|em|rem|%)?$/.test(d)?a.push(parseFloat(d)):l.push(d);return a.length<2?null:{x:a[0]??0,y:a[1]??0,blur:a[2]??0,spread:a[3]??0,colour:l[0]??"rgba(0, 0, 0, 0.2)",inset:n}}function io(e){return!e||e.trim()==="none"?[]:Xr(e,",").map(Yr).filter(t=>t!==null)}function Kr(e){let t=`${e.x}px ${e.y}px ${e.blur}px ${e.spread}px ${e.colour}`;return e.inset?`inset ${t}`:t}function ao(e){return e.length===0?"none":e.map(Kr).join(", ")}function Xt(e,t,o){let n=[...e];if(t<0||t>=n.length||o<0||o>=n.length)return n;let[r]=n.splice(t,1);return r!==void 0&&n.splice(o,0,r),n}function Yt(e){let t=/blur\(\s*(-?\d*\.?\d+)px\s*\)/i.exec(e||"");return t?parseFloat(t[1]):0}function so(e){return e<=0?"none":`blur(${e}px)`}var Kt=["top","right","bottom","left"],jr=["border-top-left-radius","border-top-right-radius","border-bottom-right-radius","border-bottom-left-radius"],Ur=[{name:"Type",specs:[{prop:"font-size",label:"Size",kind:"length",min:8,max:96,step:1,unit:"px"},{prop:"font-weight",label:"Weight",kind:"number",min:100,max:900,step:100},{prop:"line-height",label:"Line height",kind:"length",min:0,max:96,step:1,unit:"px"},{prop:"letter-spacing",label:"Tracking",kind:"length",min:-4,max:12,step:.1,unit:"px"},{prop:"font-style",label:"Style",kind:"choice",options:["normal","italic"],more:!0},{prop:"text-align",label:"Align",kind:"choice",options:["start","center","end","justify"],more:!0},{prop:"text-transform",label:"Case",kind:"choice",options:["none","uppercase","lowercase","capitalize"],more:!0},{prop:"text-decoration-line",label:"Decoration",kind:"choice",options:["none","underline","line-through"],more:!0}]},{name:"Colour",specs:[{prop:"color",label:"Text",kind:"colour"},{prop:"background-color",label:"Background",kind:"colour"},{prop:"border-color",label:"Border",kind:"colour",more:!0},{prop:"opacity",label:"Opacity",kind:"number",min:0,max:1,step:.01}]},{name:"Box",specs:[{prop:"padding",label:"Padding",kind:"length",min:0,max:128,step:1,unit:"px",sides:Kt.map(e=>`padding-${e}`)},{prop:"margin",label:"Margin",kind:"length",min:-64,max:128,step:1,unit:"px",sides:Kt.map(e=>`margin-${e}`)},{prop:"width",label:"Width",kind:"length",min:0,max:1600,step:1,unit:"px",more:!0},{prop:"height",label:"Height",kind:"length",min:0,max:1200,step:1,unit:"px",more:!0},{prop:"box-sizing",label:"Sizing",kind:"choice",options:["content-box","border-box"]}]},{name:"Border",specs:[{prop:"border-width",label:"Width",kind:"length",min:0,max:24,step:1,unit:"px",sides:Kt.map(e=>`border-${e}-width`)},{prop:"border-style",label:"Style",kind:"choice",options:["none","solid","dashed","dotted"]},{prop:"border-radius",label:"Radius",kind:"length",min:0,max:64,step:1,unit:"px",sides:jr}]},{name:"Effects",specs:[{prop:"box-shadow",label:"Shadow",kind:"shadow"},{prop:"backdrop-filter",label:"Backdrop blur",kind:"blur",min:0,max:40,step:1,unit:"px",more:!0}]},{name:"Layout",specs:[{prop:"display",label:"Display",kind:"choice",options:["block","flex","grid","inline-flex","inline-block","none"]},{prop:"flex-direction",label:"Direction",kind:"choice",options:["row","column","row-reverse","column-reverse"],more:!0},{prop:"justify-content",label:"Justify",kind:"choice",options:["flex-start","center","flex-end","space-between"],more:!0},{prop:"align-items",label:"Align",kind:"choice",options:["stretch","flex-start","center","flex-end"],more:!0},{prop:"flex-wrap",label:"Wrap",kind:"choice",options:["nowrap","wrap"],more:!0},{prop:"gap",label:"Gap",kind:"length",min:0,max:96,step:1,unit:"px"}]}];function yt(e){let t=parseFloat(e);return Number.isFinite(t)?t:0}function lo(e){let t=/^rgba?\(([^)]+)\)$/.exec(e.trim());if(!t)return/^#[0-9a-f]{6}$/i.test(e.trim())?e.trim():"#000000";let[o,n,r]=t[1].split(/[\s,/]+/).filter(Boolean).map(Number);if(o===void 0||n===void 0||r===void 0)return"#000000";let i=a=>Math.max(0,Math.min(255,Math.round(a))).toString(16).padStart(2,"0");return`#${i(o)}${i(n)}${i(r)}`}var Vr=320,qr=`
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
  font-family: ${M.stack};
  font-synthesis: none;
  font-size: ${M.body}px;
  font-weight: ${U.regular};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${x.primary};
  background: ${fe};
  box-shadow: ${Le};
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
  transition: opacity ${O.ui}, translate ${O.ui}, display ${O.ui} allow-discrete;
}

/* The bar that says the tool wrote this row. Worth a fade: it is the panel
   admitting to something, and it should be noticed without being a movement. */
.edit-row::before { transition: opacity ${O.ui}; }

@media (prefers-reduced-motion: reduce) {
  .edit-dock { transition: opacity ${O.ui}; translate: none; }
  @starting-style { .edit-dock[data-open] { translate: none; } }
  .edit-opt:active, .edit-mini:active, .edit-add:active,
  .edit-action:active, .edit-revert:active { scale: 1; }
}

.edit-head {
  display: flex; align-items: center; gap: ${z.base}px;
  flex: none;
  height: ${Re}px;
  padding: 0 ${z.base}px 0 ${z.roomy}px;
  border-bottom: 1px solid ${le};
}
.edit-title { font-size: ${M.title}px; font-weight: ${U.semibold}; }
.edit-subject {
  flex: 1; min-width: 0;
  color: ${x.tertiary};
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
  transition: scrollbar-color ${O.ui};
  padding: ${z.base}px;
}
.edit-body:hover, .edit-body:focus-within {
  scrollbar-color: ${I(6)} transparent;
}
/* WebKit does not read scrollbar-color, so it gets the same thing said twice. */
.edit-body::-webkit-scrollbar { width: 8px; }
.edit-body::-webkit-scrollbar-track { background: transparent; }
.edit-body::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 0;
  transition: background ${O.ui};
}
.edit-body:hover::-webkit-scrollbar-thumb,
.edit-body:focus-within::-webkit-scrollbar-thumb { background: ${I(6)}; }
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
  font-size: ${M.tag}px; font-weight: ${U.semibold};
  letter-spacing: 0.04em; text-transform: uppercase;
  color: ${x.secondary};
}
.edit-rows { display: grid; gap: ${z.base}px; }

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
  min-height: ${Re}px;
  padding: 0 10px;
  background: ${I(1)};
}
.edit-label {
  flex: none; width: 88px;
  color: ${x.secondary};
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.edit-field { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; }

/* Choice: one button per value, the current one filled. Buttons rather than a
   select, because a select hides every option until you open it and the whole
   value of these is seeing the alternatives. */
.edit-choice { display: flex; flex-wrap: wrap; gap: 2px; }
.edit-opt {
  /* 24px is WCAG's AA floor and these were 21 by a padding accident. */
  min-height: 24px;
  padding: 5px 8px; border: 0; border-radius: 0;
  background: ${I(2)}; color: ${x.secondary};
  font: inherit; font-size: ${M.tag}px; cursor: pointer;
  transition: background ${O.ui}, color ${O.ui};
}
.edit-opt:hover { background: ${I(4)}; color: ${x.primary}; }
.edit-opt:active { scale: 0.96; }
.edit-opt:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }
.edit-opt[data-on] { background: ${x.primary}; color: ${fe}; }

.edit-swatch {
  flex: none; width: 24px; height: 24px;
  padding: 0; border: 0; border-radius: 0;
  box-shadow: inset 0 0 0 1px ${le};
  cursor: pointer;
}
.edit-hex {
  flex: 1; min-width: 0;
  height: 24px; padding: 0 6px;
  border: 1px solid ${le}; border-radius: 0;
  background: ${I(1)}; color: ${x.primary};
  font: inherit; font-size: ${M.tag}px;
  font-variant-numeric: tabular-nums;
}
.edit-hex:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }

.edit-row-name {
  display: block;
  /* Half the gap between rows, so the name binds to its own control rather
     than floating between two of them. */
  margin: 0 0 ${z.tight}px 10px;
  color: ${x.secondary};
  font-size: ${M.tag}px; font-weight: ${U.regular};
}
/* Two columns of badges. They size to their own digits, so the grid can be
   tight without anything being clipped. */
.edit-sides { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; }

/* A shadow is a list, so its row is a block rather than a line. */
.edit-line-block { display: block; padding: ${z.base}px 10px; }
.edit-stack { display: grid; gap: 6px; }
.edit-layer { background: ${I(2)}; padding: 6px; }
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
  color: ${x.secondary};
  font-size: ${M.tag}px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.edit-layer-head .edit-swatch { width: 24px; height: 24px; }
.edit-mini {
  flex: none;
  display: grid; place-items: center;
  width: 24px; height: 24px;
  padding: 0; border: 0; border-radius: 0;
  background: ${I(3)}; color: ${x.secondary};
  font: inherit; font-size: ${M.tag}px; line-height: 1;
  cursor: pointer;
}
.edit-mini:hover:not(:disabled) { background: ${I(5)}; color: ${x.primary}; }
.edit-mini:active:not(:disabled) { scale: 0.96; }
.edit-mini:disabled { color: ${x.disabled}; cursor: default; }
.edit-mini:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }
.edit-add {
  width: 100%;
  padding: 7px; border: 0; border-radius: 0;
  background: ${I(2)}; color: ${x.secondary};
  font: inherit; font-size: ${M.tag}px; cursor: pointer;
}
.edit-add:hover { background: ${I(4)}; color: ${x.primary}; }
.edit-add:active { scale: 0.96; }
.edit-add:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }
.edit-sides > * { min-width: 0; }

.edit-linked {
  width: 24px; height: 24px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; color: ${x.tertiary};
  cursor: pointer;
}
.edit-linked[data-on] { background: ${I(4)}; color: ${x.primary}; }
.edit-linked:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }

.edit-revert {
  width: 24px; height: 24px;
  display: none; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; color: ${x.tertiary};
  cursor: pointer;
}
.edit-row[data-touched] .edit-revert { display: grid; }
.edit-revert:hover { color: ${x.primary}; }
.edit-revert:active { scale: 0.96; }
.edit-revert:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }

.edit-more {
  width: 100%; margin-top: ${z.tight}px;
  padding: 6px; border: 0; border-radius: 0;
  background: none; color: ${x.tertiary};
  font: inherit; font-size: ${M.tag}px; cursor: pointer;
  text-align: left;
}
.edit-more:hover { color: ${x.primary}; }

.edit-foot {
  flex: none;
  display: flex; align-items: center; gap: ${z.base}px;
  padding: ${z.base}px;
  border-top: 1px solid ${le};
}
.edit-count { flex: 1; color: ${x.tertiary}; font-size: ${M.tag}px; }
.edit-action {
  padding: 7px 10px; border: 0; border-radius: 0;
  background: ${I(3)}; color: ${x.primary};
  font: inherit; font-size: ${M.tag}px; font-weight: ${U.medium};
  cursor: pointer;
  transition: background ${O.ui};
}
.edit-action:hover { background: ${I(5)}; }
.edit-action:active:not(:disabled) { scale: 0.96; }
.edit-action:disabled { color: ${x.disabled}; cursor: default; background: ${I(1)}; }
.edit-action:focus-visible { outline: 2px solid ${x.secondary}; outline-offset: -2px; }

.edit-empty {
  padding: ${z.roomy}px;
  color: ${x.tertiary};
}
`;function co(e,t){let o=document.createElement("style");o.textContent=qr,e.appendChild(o);let n=document.createElement("div");n.className="edit-dock",n.setAttribute("role","region"),n.setAttribute("aria-label","Edit the locked element");let r=document.createElement("div");r.className="edit-head";let i=document.createElement("span");i.className="edit-title",i.textContent="Edit";let a=document.createElement("span");a.className="edit-subject",r.append(i,a);let l=document.createElement("div");l.className="edit-body";let d=document.createElement("div");d.className="edit-foot";let v=document.createElement("span");v.className="edit-count";let w=document.createElement("button");w.type="button",w.className="edit-action",w.textContent="Copy as prompt";let S=document.createElement("button");S.type="button",S.className="edit-action",S.textContent="Revert all",d.append(v,S,w),n.append(r,l,d),e.appendChild(n);let u=null,g=!1,k=!1,b=[],G=new Set;function c(){let s=t.changes().length;v.textContent=s===0?"No changes":`${s} change${s===1?"":"s"}`,w.disabled=s===0,S.disabled=s===0}function y(){if(u){for(let s of b){let m=(s.spec.sides??[s.spec.prop]).some(C=>t.touched(u,C));s.el.toggleAttribute("data-touched",m)}c()}}function N(s,p){u&&(t.set(u,s,p),y())}function X(s,p,m){let C=bt(e,{label:m,value:u?yt(ge(u,p)):0,min:s.min??0,max:s.max??100,step:s.step??1,...s.unit?{unit:s.unit}:{},onChange:D=>{let P=`${D}${s.unit??""}`;if(s.sides&&G.has(s.prop)){for(let B of s.sides)N(B,P);for(let B of b)if(B.spec.prop===s.prop)for(let W of B.sliders)W.set(D)}else N(p,P)}});return{el:C.el,slider:C,sync:()=>{u&&C.set(yt(ge(u,p)))}}}function Z(s,p,m){let C=/(^|\s)(top|bottom)(\s|$)/.test(m),D=m==="top"?"sideTop":m==="right"?"sideRight":m==="bottom"?"sideBottom":m==="left"?"sideLeft":void 0,P=jn(e,{label:`${s.label} ${m}`,value:u?yt(ge(u,p)):0,min:s.min??0,max:s.max??999,step:s.step??1,axis:C?"y":"x",...D?{glyph:D}:{text:m},onChange:B=>{let W=`${B}${s.unit??""}`;if(G.has(s.prop)&&s.sides){for(let H of s.sides)N(H,W);for(let H of b)if(H.spec.prop===s.prop)for(let j of H.scrubs)j.set(B)}else N(p,W)}});return{el:P.el,scrub:P,sync:()=>{u&&P.set(yt(ge(u,p)))}}}function ae(s){let p=document.createElement("div");p.className="edit-choice",p.setAttribute("role","group"),p.setAttribute("aria-label",s.label);let m=[];for(let D of s.options??[]){let P=document.createElement("button");P.type="button",P.className="edit-opt",P.textContent=D,P.addEventListener("click",()=>{N(s.prop,D),C()}),m.push(P),p.appendChild(P)}function C(){let D=u?ge(u,s.prop):"";for(let P of m){let B=P.textContent===D;P.toggleAttribute("data-on",B),P.setAttribute("aria-pressed",String(B))}}return{el:p,sync:C}}function te(s){let p=document.createElement("div");p.className="edit-field";let m=document.createElement("input");m.type="color",m.className="edit-swatch",m.setAttribute("aria-label",`${s.label} colour`);let C=document.createElement("input");C.type="text",C.className="edit-hex",C.spellcheck=!1,C.setAttribute("aria-label",`${s.label} colour, as hex`),m.addEventListener("input",()=>{C.value=m.value,N(s.prop,m.value)}),C.addEventListener("change",()=>{let P=C.value.trim();if(!/^#?[0-9a-f]{3}$|^#?[0-9a-f]{6}$/i.test(P)){D();return}let B=P.startsWith("#")?P:`#${P}`;m.value=B.length===4?`#${B[1]}${B[1]}${B[2]}${B[2]}${B[3]}${B[3]}`:B,N(s.prop,m.value)});function D(){let P=u?ge(u,s.prop):"",B=lo(P);m.value=B,C.value=B}return p.append(m,C),{el:p,sync:D}}function K(s){let p=document.createElement("div");p.className="edit-stack";let m=[],C=[];function D(){N(s.prop,ao(m))}function P(){for(let H of C)H.destroy();C=[],p.textContent="",m.forEach((H,j)=>{let E=document.createElement("div");E.className="edit-layer";let ne=document.createElement("div");ne.className="edit-layer-head";let se=document.createElement("span");se.className="edit-layer-name",se.textContent=`Layer ${j+1}`;let pe=document.createElement("input");pe.type="color",pe.className="edit-swatch",pe.setAttribute("aria-label",`Layer ${j+1} colour`),pe.value=lo(H.colour),pe.addEventListener("input",()=>{m[j]={...H,colour:pe.value},H=m[j],D()});let oe=document.createElement("button");oe.type="button",oe.className="edit-opt",oe.textContent="inset",oe.toggleAttribute("data-on",H.inset),oe.addEventListener("click",()=>{m[j]={...H,inset:!H.inset},H=m[j],oe.toggleAttribute("data-on",H.inset),D()});let R=document.createElement("button");R.type="button",R.className="edit-mini",R.setAttribute("aria-label",`Move layer ${j+1} up`),R.appendChild(we("arrowUp",12)),R.disabled=j===0,R.addEventListener("click",()=>{m=Xt(m,j,j-1),D(),P()});let f=document.createElement("button");f.type="button",f.className="edit-mini",f.setAttribute("aria-label",`Move layer ${j+1} down`),f.appendChild(we("arrowDown",12)),f.disabled=j===m.length-1,f.addEventListener("click",()=>{m=Xt(m,j,j+1),D(),P()});let T=document.createElement("button");T.type="button",T.className="edit-mini",T.setAttribute("aria-label",`Remove layer ${j+1}`),T.appendChild(we("cross",12)),T.addEventListener("click",()=>{m=m.filter((xe,he)=>he!==j),D(),P()}),ne.append(se,pe,oe,R,f,T);let Q=document.createElement("div");Q.className="edit-sides";let ye=[{key:"x",label:"x",min:-64,max:64},{key:"y",label:"y",min:-64,max:64},{key:"blur",label:"blur",min:0,max:96},{key:"spread",label:"spread",min:-32,max:32}];for(let xe of ye){let he=bt(e,{label:xe.label,value:H[xe.key],min:xe.min,max:xe.max,step:1,unit:"px",onChange:Fo=>{m[j]={...m[j],[xe.key]:Fo},H=m[j],D()}});C.push(he),Q.appendChild(he.el)}E.append(ne,Q),p.appendChild(E)});let W=document.createElement("button");W.type="button",W.className="edit-add",W.textContent=m.length===0?"Add a shadow":"Add another layer",W.addEventListener("click",()=>{m=[...m,{...ro}],D(),P()}),p.appendChild(W)}function B(){m=u?io(ge(u,s.prop)):[],P()}return{el:p,sync:B,sliders:[]}}function q(s){let p=bt(e,{label:s.label,value:u?Yt(ge(u,s.prop)):0,min:s.min??0,max:s.max??40,step:s.step??1,unit:s.unit??"px",onChange:m=>N(s.prop,so(m))});return{el:p.el,slider:p,sync:()=>{u&&p.set(Yt(ge(u,s.prop)))}}}function h(s){let p=document.createElement("div");p.className="edit-row";let m=document.createElement("div");m.className="edit-line";let C=document.createElement("span");C.className="edit-label",C.textContent=s.label;let D=document.createElement("div");D.className="edit-field";let P=[],B=[],W=[];if(s.sides){let E=document.createElement("div");E.className="edit-sides",E.style.flex="1";for(let se of s.sides){let pe=se.split("-").filter(R=>R!=="border"&&R!=="radius"&&R!=="width"&&R!=="padding"&&R!=="margin").join(" ")||se,oe=Z(s,se,pe);B.push(oe.scrub),W.push(oe.sync),E.appendChild(oe.el)}let ne=document.createElement("button");ne.type="button",ne.className="edit-linked",ne.setAttribute("aria-label",`Link all four ${s.label.toLowerCase()} values`),ne.title="Change all four together",ne.appendChild(we("link",13)),ne.setAttribute("aria-pressed","false"),ne.addEventListener("click",()=>{G.has(s.prop)?G.delete(s.prop):G.add(s.prop);let se=G.has(s.prop);ne.toggleAttribute("data-on",se),ne.setAttribute("aria-pressed",String(se))}),D.append(E,ne)}else if(s.kind==="shadow"){let E=K(s);W.push(E.sync),E.el.style.flex="1",D.appendChild(E.el)}else if(s.kind==="blur"){let E=q(s);P.push(E.slider),W.push(E.sync),E.el.style.flex="1",D.appendChild(E.el)}else if(s.kind==="choice"){let E=ae(s);W.push(E.sync),D.appendChild(E.el)}else if(s.kind==="colour"){let E=te(s);W.push(E.sync),E.el.style.flex="1",D.appendChild(E.el)}else{let E=X(s,s.prop,s.label);P.push(E.slider),W.push(E.sync),E.el.style.flex="1",D.appendChild(E.el)}let H=document.createElement("button");if(H.type="button",H.className="edit-revert",H.setAttribute("aria-label",`Revert ${s.label.toLowerCase()}`),H.title="Put this back",H.appendChild(we("undo",13)),H.addEventListener("click",()=>{if(u){for(let E of s.sides??[s.prop])t.revert(u,E);for(let E of W)E();y()}}),s.kind==="shadow"&&m.classList.add("edit-line-block"),!s.sides&&s.kind==="colour"&&m.appendChild(C),s.sides||s.kind==="shadow"||s.kind==="choice"){let E=document.createElement("span");E.className="edit-row-name",E.textContent=s.label,p.appendChild(E)}return m.append(D,H),p.appendChild(m),{spec:s,el:p,sliders:P,scrubs:B,sync:()=>{for(let E of W)E()}}}function A(){for(let p of b){for(let m of p.sliders)m.destroy();for(let m of p.scrubs)m.destroy()}if(b.length=0,l.textContent="",!u){let p=document.createElement("p");p.className="edit-empty",p.textContent="Click an element to lock it, then change it here.",l.appendChild(p),c();return}for(let p of Ur){let m=p.specs.filter(B=>k||!B.more);if(m.length===0)continue;let C=document.createElement("section");C.className="edit-group";let D=document.createElement("span");D.className="edit-group-name",D.textContent=p.name;let P=document.createElement("div");P.className="edit-rows";for(let B of m){let W=h(B);b.push(W),P.appendChild(W.el)}C.append(D,P),l.appendChild(C)}let s=document.createElement("button");s.type="button",s.className="edit-more",s.textContent=k?"Fewer properties":"More properties",s.addEventListener("click",()=>{k=!k,A()}),l.appendChild(s);for(let p of b)p.sync();y()}S.addEventListener("click",()=>{t.revertAll();for(let s of b)s.sync();y()});let $=0;w.addEventListener("click",()=>{let s=t.asPrompt();if(!s)return;let p=C=>{w.textContent=C,clearTimeout($),$=window.setTimeout(()=>{w.textContent="Copy as prompt"},900)},m=navigator.clipboard;if(!m){p("No clipboard");return}m.writeText(s).then(()=>p("Copied"),()=>p("Blocked"))});function F(){n.toggleAttribute("data-open",g)}return{show(s){if(s===u){for(let p of b)p.sync();y();return}u=s,a.textContent=s?s.tagName.toLowerCase()+(s.id?`#${s.id}`:""):"",A()},setArmed(s){g=s,F(),s&&A()},refresh(){for(let s of b)s.sync();y()},asText(){return t.asPrompt()},destroy(){for(let s of b){for(let p of s.sliders)p.destroy();for(let p of s.scrubs)p.destroy()}b.length=0,n.remove(),o.remove()}}}var xt=5,jt=4,at=12,uo=.22,Ke=10,Jr=50,Qr=100;function po(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,hidden:!1,grid:null,pixels:!1,guides:[],liveGuide:null,activeGuide:null},i=It(Ot()),a=0,l=null;function d(){let h=Ot();h!==l&&(l=h,i=It(h),e.style.colorScheme=h?"dark":"light",q())}d();let v=matchMedia("(prefers-color-scheme: dark)"),w=()=>d();v.addEventListener("change",w);let S=new MutationObserver(()=>d());function u(){S.disconnect(),S.observe(document.documentElement,{attributes:!0}),document.body&&S.observe(document.body,{attributes:!0})}u(),zn(()=>q());function g(){let h=devicePixelRatio;o.width=Math.round(innerWidth*h),o.height=Math.round(innerHeight*h),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(h,0,0,h,0,0),n.translate(.5,.5)}let k=h=>Math.round(h)-.5;function b(h,A){n.strokeStyle=A,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(h.left),Math.round(h.top),Math.round(h.width),Math.round(h.height))}function G(h){n.strokeStyle=Xe(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let A of[h.left,h.right])n.moveTo(Math.round(A),0),n.lineTo(Math.round(A),innerHeight);for(let A of[h.top,h.bottom])n.moveTo(0,Math.round(A)),n.lineTo(innerWidth,Math.round(A));n.stroke(),n.setLineDash([])}function c(h){if(n.strokeStyle=h.extension?Xe(i.measure,.55):i.measure,n.lineWidth=1,n.setLineDash(h.extension?[3,3]:[]),n.beginPath(),n.moveTo(Math.round(h.x1),Math.round(h.y1)),n.lineTo(Math.round(h.x2),Math.round(h.y2)),h.extension){n.stroke();return}if(h.axis==="x")for(let A of[h.x1,h.x2])n.moveTo(Math.round(A),Math.round(h.y1)-xt),n.lineTo(Math.round(A),Math.round(h.y1)+xt);else for(let A of[h.y1,h.y2])n.moveTo(Math.round(h.x1)-xt,Math.round(A)),n.lineTo(Math.round(h.x1)+xt,Math.round(A));n.stroke()}function y(h){return n.font=`${U.medium} ${M.body}px ${M.stack}`,{w:n.measureText(h).width+jt*2,h:M.body+jt*2+2}}function N(h,A,$,F){n.font=`${U.medium} ${M.body}px ${M.stack}`,n.textBaseline="middle";let{w:s,h:p}=y(h),m=k(Math.min(Math.max(A,at),innerWidth-s-at)),C=k(Math.min(Math.max($,at),innerHeight-p-at));n.fillStyle=F,n.beginPath(),n.roundRect(m,C,Math.ceil(s),p,4),n.fill(),n.fillStyle=i.surface,n.fillText(h,m+jt,C+p/2)}function X(h,A,$,F,s=!1){let{w:p,h:m}=y(h);N(h,s?A-p/2:A,s?$-m/2:$,F)}function Z(){let h=scrollX,A=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,Y),n.fillRect(-.5,-.5,Y,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${U.regular} 9px ${M.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let p of r.pinned)n.fillRect(k(p.left),-.5,Math.round(p.width),Y),n.fillRect(-.5,k(p.top),Y,Math.round(p.height));n.restore(),n.beginPath(),n.moveTo(-.5,Y-.5),n.lineTo(innerWidth,Y-.5),n.moveTo(Y-.5,-.5),n.lineTo(Y-.5,innerHeight),n.stroke();let $=p=>p%Qr===0?Y:p%Jr===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let F=Math.floor(h/Ke)*Ke;for(let p=F;p<h+innerWidth;p+=Ke){let m=Math.round(p-h);if(m<Y)continue;let C=$(p);n.moveTo(m,Y-C),n.lineTo(m,Y),C===Y&&(n.fillStyle=i.muted,n.fillText(String(p),m+3,3))}n.stroke(),n.beginPath();let s=Math.floor(A/Ke)*Ke;for(let p=s;p<A+innerHeight;p+=Ke){let m=Math.round(p-A);if(m<Y)continue;let C=$(p);n.moveTo(Y-C,m),n.lineTo(Y,m),C===Y&&(n.save(),n.translate(3,m-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(p),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),Y),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo(Y,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let p of r.guides){let m=Math.round(nt(p));p.axis==="x"?n.fillRect(m-1,-.5,2,Y):n.fillRect(-.5,m-1,Y,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,Y,Y),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,Y,Y)}function ae(){let h=Gn(10,1);if(h){n.strokeStyle=i.pixelLine,n.lineWidth=1,n.setLineDash([]),n.beginPath();for(let A=0;A<=innerWidth;A+=h)n.moveTo(A,0),n.lineTo(A,innerHeight);for(let A=0;A<=innerHeight;A+=h)n.moveTo(0,A),n.lineTo(innerWidth,A);n.stroke()}}function te(h){let A=Pn(h,document.documentElement.clientWidth);n.fillStyle=Xe(i.measure,.08);for(let $ of A)n.fillRect(k($.left),-.5,Math.round($.width),innerHeight+1)}function K(){if(a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore(),r.hidden)return;(r.pixels||r.grid)&&(n.save(),r.rulers&&(n.beginPath(),n.rect(Y,Y,innerWidth,innerHeight),n.clip()),r.pixels&&ae(),r.grid&&te(r.grid),n.restore());for(let $ of r.pinned)b($,i.accent);r.hover&&(G(r.hover),b(r.hover,r.pinned.length?Xe(i.accent,.7):i.accent));for(let $ of r.guides){let F=r.liveGuide?.id===$.id;n.strokeStyle=$.locked||F?i.guide:Xe(i.guide,.55),n.lineWidth=$.pinned?2:1,n.setLineDash($.locked?[]:[4,4]),n.beginPath();let s=Math.round(nt($));if($.axis==="x"?(n.moveTo(s,0),n.lineTo(s,innerHeight)):(n.moveTo(0,s),n.lineTo(innerWidth,s)),n.stroke(),r.activeGuide===$.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let p=7;$.axis==="x"?(n.moveTo(s,0),n.lineTo(s,p),n.moveTo(s,innerHeight-p),n.lineTo(s,innerHeight)):(n.moveTo(0,s),n.lineTo(p,s),n.moveTo(innerWidth-p,s),n.lineTo(innerWidth,s)),n.stroke()}}for(let $ of r.lines)n.globalAlpha=$.faded?uo:1,c($);n.globalAlpha=1;let h=r.lines.filter($=>$.label!==""),A=h.map($=>{let F=($.x1+$.x2)/2,s=($.y1+$.y2)/2,{w:p,h:m}=y($.label);return $.axis==="x"?{x:F-p/2,y:s-16-m/2,w:p,h:m,axis:$.axis}:{x:F+26-p/2,y:s-m/2,w:p,h:m,axis:$.axis}});if(Rn(A,{w:innerWidth,h:innerHeight},at).forEach(($,F)=>{let s=h[F];n.globalAlpha=s.faded?uo:1,N(s.label,$.x,$.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:$,height:F,scale:s}=r.hover;X(`${J($/s.x)} \xD7 ${J(F/s.y)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let $=r.liveGuide,F=Math.round(nt($));X([`${$.axis} ${J($.at)}`,$.caught,$.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),$.axis==="x"?F+6:30,$.axis==="x"?30:F+6,i.guide)}r.rulers&&Z()}function q(){a||(a=requestAnimationFrame(K))}return g(),{root:t,update(h){Object.assign(r,h),q()},resize(){g(),q()},destroy(){a&&cancelAnimationFrame(a),v.removeEventListener("change",w),S.disconnect(),e.remove()}}}function Zr(e){let t=e.trim().replace(/^#/,""),o=t.length===3?t.split("").map(n=>n+n).join(""):t;return/^[0-9a-f]{6}$/i.test(o)?{r:parseInt(o.slice(0,2),16),g:parseInt(o.slice(2,4),16),b:parseInt(o.slice(4,6),16)}:null}function ei({r:e,g:t,b:o}){let n=r=>Math.round(r).toString(16).padStart(2,"0");return`#${n(e)}${n(t)}${n(o)}`}function ti({r:e,g:t,b:o}){return`rgb(${Math.round(e)} ${Math.round(t)} ${Math.round(o)})`}function Oe(e,t){return String(Number(e.toFixed(t)))}function ni({r:e,g:t,b:o}){let n=e/255,r=t/255,i=o/255,a=Math.max(n,r,i),l=Math.min(n,r,i),d=(a+l)/2,v=a-l,w=0,S=0;return v!==0&&(S=v/(1-Math.abs(2*d-1)),a===n?w=(r-i)/v%6:a===r?w=(i-n)/v+2:w=(n-r)/v+4,w*=60,w<0&&(w+=360)),`hsl(${Oe(w,1)} ${Oe(S*100,1)}% ${Oe(d*100,1)}%)`}function Ut(e){let t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4}function oi(e){let t=Ut(e.r),o=Ut(e.g),n=Ut(e.b),r=.4122214708*t+.5363325363*o+.0514459929*n,i=.2119034982*t+.6806995451*o+.1073969566*n,a=.0883024619*t+.2817188376*o+.6299787005*n,l=Math.cbrt(r),d=Math.cbrt(i),v=Math.cbrt(a),w=.2104542553*l+.793617785*d-.0040720468*v,S=1.9779984951*l-2.428592205*d+.4505937099*v,u=.0259040371*l+.7827717662*d-.808675766*v,g=Math.sqrt(S*S+u*u),k=Math.atan2(u,S)*180/Math.PI;return k<0&&(k+=360),g<1e-4?`oklch(${Oe(w,4)} 0 0)`:`oklch(${Oe(w,4)} ${Oe(g,4)} ${Oe(k,2)})`}function mo(e){let t=Zr(e);return t?[{label:"hex",value:ei(t)},{label:"rgb",value:ti(t)},{label:"hsl",value:ni(t)},{label:"oklch",value:oi(t)}]:[]}var ri=`
.picker {
  /* Under the badge, from the badge's own numbers. */
  position: fixed; top: ${ve+rt+it}px; right: ${ve}px;
  width: min(200px, calc(100vw - ${ve*2+z.base*2}px));
  padding: ${z.base}px; border-radius: 0;
  user-select: none;
  font-family: ${M.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${M.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${x.primary};
  background: ${fe};
  box-shadow: ${Le};
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
  transition: opacity ${O.ui}, transform ${O.ui}, visibility 0s linear 160ms;
}
.picker[data-open] {
  opacity: 1; visibility: visible; pointer-events: auto;
  transform: none;
  transition: opacity ${O.ui}, transform ${O.ui}, visibility 0s;
}
@media (prefers-reduced-motion: reduce) {
  /* The fade says it arrived; the travel and the scale are decoration. */
  .picker { transform: none; transition: opacity 120ms linear, visibility 0s linear 120ms; }
  .picker[data-open] { transition: opacity 120ms linear, visibility 0s; }
}
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
  color: ${x.primary};
}
.picker button:hover { background: ${I(2)}; }
.picker button:focus-visible { outline: 1px solid ${x.primary}; outline-offset: -1px; }
.picker .k { color: ${x.secondary}; }
.picker .v { overflow-wrap: anywhere; }
.picker .hint {
  margin-top: 6px; padding-top: 6px;
  border-top: 1px solid ${le};
  color: ${x.secondary};
}
`;function ho(e){let t=document.createElement("style");t.textContent=ri,e.appendChild(t);let o=document.createElement("div");o.className="picker",e.appendChild(o);let n=document.createElement("div");n.className="swatch";let r=document.createElement("div");r.className="hint";function i(a){n.style.background=a;let l=mo(a).map(({label:d,value:v})=>{let w=document.createElement("button");w.type="button";let S=document.createElement("span");S.className="k",S.textContent=d;let u=document.createElement("span");return u.className="v",u.textContent=v,w.append(S,u),w.addEventListener("click",g=>{g.stopPropagation(),navigator.clipboard?.writeText(v).then(()=>{r.textContent=`copied ${d}`},()=>{r.textContent="clipboard refused"})}),w});r.textContent="click a row to copy",o.replaceChildren(n,...l,r),o.setAttribute("data-open","")}return{async open(){let a=window.EyeDropper;if(!a){o.replaceChildren(Object.assign(document.createElement("div"),{className:"hint",textContent:"this browser has no eyedropper"})),o.setAttribute("data-open","");return}try{let{sRGBHex:l}=await new a().open();i(l)}catch{}},close(){let a=o.hasAttribute("data-open");return o.removeAttribute("data-open"),a},destroy(){o.remove(),t.remove()}}}var Vt="__align_freeze",ii=`
[data-align-frozen] *:not([data-align-ignore]):not([data-align-ignore] *) {
  animation-play-state: paused !important;
}
`,qt=!1,wt=[],vt=[];function fo(e){let t=e;for(;t;){if(t instanceof Element&&t.hasAttribute("data-align-ignore"))return!0;let o=t.getRootNode();if(t=o instanceof ShadowRoot?o.host:t.parentNode??null,t===document)return!1}return!1}function kt(){return qt}function Jt(e){if(e!==qt){if(qt=e,!e){document.documentElement.removeAttribute("data-align-frozen"),document.getElementById(Vt)?.remove();for(let t of wt)try{t.play()}catch{}for(let t of vt)t.play().catch(()=>{});wt=[],vt=[];return}if(!document.getElementById(Vt)){let t=document.createElement("style");t.id=Vt,t.textContent=ii,t.setAttribute("data-align-ignore",""),document.head.appendChild(t)}document.documentElement.setAttribute("data-align-frozen",""),wt=[];try{for(let t of document.getAnimations()){if(t.playState!=="running")continue;let o=t.effect?.target??null;fo(o)||(t.pause(),wt.push(t))}}catch{}vt=[];for(let t of Array.from(document.querySelectorAll("video")))t.paused||fo(t)||(t.pause(),vt.push(t))}}var Qt="__align_xray",ai=`
[data-align-xray] * { outline: 1px solid rgb(128 128 128 / 0.55) !important; }
[data-align-xray] [data-align-ignore],
[data-align-xray] [data-align-ignore] * { outline: none !important; }
`;function Zt(e){let t=document.documentElement;if(!e){t.removeAttribute("data-align-xray"),document.getElementById(Qt)?.remove();return}if(!document.getElementById(Qt)){let o=document.createElement("style");o.id=Qt,o.textContent=ai,o.setAttribute("data-align-ignore",""),document.head.appendChild(o)}t.setAttribute("data-align-xray","")}var en="align-ui";function go(e){try{return localStorage.getItem(e)}catch{return null}}function bo(e,t){try{localStorage.setItem(e,t)}catch{}}function yo(e){let t="/";try{t=location.pathname||"/"}catch{}return`${en}:${e}::${t}`}function si(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function xo(){let e=go(yo("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(si).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function wo(e){bo(yo("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function $t(e){return go(`${en}:${e}`)==="1"}function Et(e,t){bo(`${en}:${e}`,t?"1":"0")}var de,V=null,me=null,Ce=null,Ze=null,Be=null,He=oo(),Fe=!1,Ve=$t("grid"),qe=$t("pixels"),re=null,_=[],Ct=0,We=$t("rulers"),ee=[],Mo=1,vo=!1,Te=null,je=!1,ze=_n();function li(){return ee.map(e=>({...e}))}function Je(e=""){ze.push(li(),e)}function ko(){return ee.find(e=>e.id===Te)??null}function Ge(e){ee=e,wo(ee)}var ie=null,Ee=null,ke=null,ci=3,Ue=22;function Ao(e,t){return We?t<Ue&&e>=Ue?"y":e<Ue&&t>=Ue?"x":null:null}function nn(e){return e.ctrlKey||e.metaKey}function Lo(e,t,o,n){let r=De(t,o,de),i=e.axis==="x"?t:o,a=ee.filter(d=>d.id!==e.id).map(d=>({axis:d.axis,at:st(d).pos})),l=An(i,Ln(r,e.axis,a),n);e.at=l.at+(e.axis==="x"?scrollX:scrollY),e.caught=l.what}function No(e,t,o,n){let r={id:Mo++,axis:e,at:0,locked:!1,caught:"",pinned:!1};Lo(r,t,o,n);let i=ee.find(a=>a.axis===r.axis&&Math.abs(a.at-r.at)<.5);return i?(Te=i.id,i):(Je(),Ge([...ee,r]),Te=r.id,r)}function Ro(e){e.pinned||(Je(),Ge(ee.filter(t=>t.id!==e.id)),Ee?.id===e.id&&(Ee=null),ie?.id===e.id&&(ie=null))}function di(e){let t=de.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function st(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function on(){return _.length>=2?_[_.length-2]:void 0}function rn(){if(_.length<2)return[];let e=[];for(let[t,o]of Nt(_))for(let n of ht(t,o)){if(n.extension||!n.label)continue;let r=fn(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:gn(r)})}return e}function ue(e){let t=_[_.length-1],o=re&&_.some(u=>u.el===re.el),n=ee.map(st),r=!ie&&Ee?Ee:null,i=ee.filter(u=>u.locked||u.id===r?.id),a=!r&&o?re.el:null,l=r??a,d=r?st(r):null,v=[],w=(u,g)=>{for(let k of u)v.push(l&&!g?{...k,faded:!0}:k)},S=u=>!d||u.axis!==d.axis?!1:(u.axis==="x"?[u.x1,u.x2]:[u.y1,u.y2]).some(k=>Math.abs(k-d.pos)<.5);for(let[u,g]of Nt(_))w(ht(u,g),u.el===a||g.el===a);t&&re&&!o&&!r&&w(ht(t,re),!0);for(let u of i)for(let g of _)w(Pt(g,[st(u)]),u.id===r?.id||g.el===a);re&&!o&&!r&&ee.length&&w(Pt(re,n),!0);for(let u of Nn(i.map(st),{x:innerWidth/2,y:innerHeight/2}))w([u],S(u));V?.update({hover:re,pinned:_,rulers:We,hidden:je,grid:Ve&&de.grid?de.grid:null,pixels:qe,guides:ee,liveGuide:ie??Ee,activeGuide:Te,lines:v,...e?{cursor:e}:{}}),Ce?.update(_.length,{edit:He.armed,rulers:We,xray:Fe,grid:Ve,pixels:qe,freeze:kt(),type:me?.showsType()??!1,hide:je,canCopy:_.length>0,canUndo:ze.depth()>0,panel:me?.isOpen()??!1})}function ui(){let e=me?.asText()??"";if(!e)return;let t=n=>Ce?.acknowledge("copy",n),o=navigator.clipboard?.writeText(e);o?o.then(()=>t(!0),()=>t(!1)):t(!1)}function pi(e,t){return e.length===t.length&&e.every((o,n)=>{let r=t[n];return o.id===r.id&&o.axis===r.axis&&o.at===r.at&&o.locked===r.locked&&o.pinned===r.pinned})}function mi(){for(;ze.depth()>0&&pi(ze.peek(),ee);)ze.pop();let e=ze.pop();e&&(Ge(e),Ee=null,ie=null,ke=null,e.some(t=>t.id===Te)||(Te=null))}function be(e){switch(e){case"rulers":We=!We,Et("rulers",We);break;case"xray":Fe=!Fe,Zt(Fe);break;case"grid":Ve=!Ve,Et("grid",Ve);break;case"pixels":qe=!qe,Et("pixels",qe);break;case"freeze":Jt(!kt());break;case"type":me?.toggleType();break;case"panel":me?.toggle();break;case"hide":je=!je,me?.setHidden(je),je&&Ze?.close();break;case"copy":ui();break;case"pick":Ze?.open();break;case"edit":if(He.armed){let t=He.disarm();Ce?.acknowledge("edit",t>=0)}else He.arm();Be?.setArmed(He.armed),_.length&&ue();break;case"undo":mi();break}ue()}var St=null;function Po(e){if(St={x:e.clientX,y:e.clientY},ie){ke&&Math.hypot(e.clientX-ke.x,e.clientY-ke.y)>ci&&(ke=null),!ke&&!ie.pinned&&(Lo(ie,e.clientX,e.clientY,nn(e)),Ge([...ee])),ue({x:e.clientX,y:e.clientY});return}Ee=Rt(ee,e.clientX,e.clientY),re=De(e.clientX,e.clientY,de),ue({x:e.clientX,y:e.clientY})}function Go(e){ie&&(ke?(ie.locked=!ie.locked,Te=ie.id,Ge([...ee])):(Ao(e.clientX,e.clientY)||e.clientX<Ue||e.clientY<Ue)&&Ro(ie),ke=null,ie=null,ue({x:e.clientX,y:e.clientY}))}function Tt(e){let t=V?.root.host;return t?(e.composedPath?.()??[]).includes(t):!1}function Bo(e){if(e.button!==0||Tt(e))return;let t=De(e.clientX,e.clientY,de);if(!t)return;let o=Ao(e.clientX,e.clientY);if(o){Qe(e),ke=null,ie=No(o,e.clientX,e.clientY,nn(e)),ue({x:e.clientX,y:e.clientY});return}let n=Rt(ee,e.clientX,e.clientY);if(n){Qe(e),Je(),Te=n.id,ie=n,ke={x:e.clientX,y:e.clientY},ue({x:e.clientX,y:e.clientY});return}Qe(e),Ce?.closeHelp(),_=[t],re=t,me?.show(t,rn(),on()),Be?.show(t.el),ue({x:e.clientX,y:e.clientY})}function Do(e){if(Tt(e))return;let t=De(e.clientX,e.clientY,de);if(!t)return;Qe(e),Ce?.closeHelp();let o=_.findIndex(r=>r.el===t.el);_=o>=0?_.filter((r,i)=>i!==o):[..._,t],re=t;let n=_[_.length-1];n?me?.show(n,rn(),on()):me?.hide(),Be?.show(n?.el??null),ue({x:e.clientX,y:e.clientY})}function Io(e){Tt(e)||De(e.clientX,e.clientY,de)&&Qe(e)}function Oo(e){Tt(e)||De(e.clientX,e.clientY,de)&&Qe(e)}function Qe(e){e.preventDefault(),e.stopPropagation()}function $o(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var Eo=0,So=0;function Ho(){Ct=requestAnimationFrame(Ho);let t=_.filter(l=>l.el.isConnected).map(l=>mt(l.el)),o=re&&re.el.isConnected?mt(re.el):null;if(!(scrollX!==Eo||scrollY!==So||t.length!==_.length||t.some((l,d)=>!$o(l,_[d]))||re===null!=(o===null)||re!==null&&o!==null&&!$o(re,o)))return;Eo=scrollX,So=scrollY,_=t,re=o;let i=_[_.length-1],a=hi();a!==Co&&(Co=a,i?me?.show(i,rn(),on()):me?.hide(),Be?.show(i?.el??null)),ue()}var Co="";function hi(){let e=_[0];return e?_.map(t=>[t.label,Math.round(t.width*100),Math.round(t.height*100),Math.round((t.left-e.left)*100),Math.round((t.top-e.top)*100)].join(",")).join(";"):""}function zo(){V?.resize()}function fi(){vo||(vo=!0,ee=xo().map(e=>({...e,id:Mo++}))),!V&&(On(),V=po(),me=Wn(V.root),Ce=Xn(V.root,be),Be=co(V.root,He),Ze=ho(V.root),Ce.update(0,{rulers:We,xray:Fe,grid:Ve,pixels:qe,freeze:kt(),type:!1,panel:!1,hide:!1,edit:!1,canCopy:!1,canUndo:!1}),addEventListener("mousemove",Po),addEventListener("mousedown",Bo,{capture:!0}),addEventListener("mouseup",Go,{capture:!0}),addEventListener("click",Io,{capture:!0}),addEventListener("auxclick",Oo,{capture:!0}),addEventListener("contextmenu",Do,{capture:!0}),addEventListener("resize",zo),Ct=requestAnimationFrame(Ho),ue())}function tn(){removeEventListener("mousemove",Po),removeEventListener("mousedown",Bo,{capture:!0}),removeEventListener("mouseup",Go,{capture:!0}),removeEventListener("click",Io,{capture:!0}),removeEventListener("auxclick",Oo,{capture:!0}),removeEventListener("contextmenu",Do,{capture:!0}),removeEventListener("resize",zo),cancelAnimationFrame(Ct),Ct=0,Ce?.destroy(),Be?.destroy(),Be=null,Ze?.destroy(),Ze=null,Fe&&(Fe=!1,Zt(!1)),Jt(!1),He.disarm(),Ce=null,me?.destroy(),me=null,V?.destroy(),V=null,Hn(),re=null,_=[],ie=null,ke=null,Ee=null}function gi(e){let t=e.composedPath?.()[0]??e.target;return!t||typeof t!="object"||!("tagName"in t)?!1:t.isContentEditable?!0:t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT"}function To(e){if(di(e))e.preventDefault(),V?tn():fi();else if(!gi(e)){if(V&&St&&(e.key.toLowerCase()===de.guideKeys.vertical||e.key.toLowerCase()===de.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===de.guideKeys.vertical?"x":"y";No(t,St.x,St.y,nn(e)),ue()}else if(V&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(ee.some(t=>!t.pinned)&&Je(),Ge(ee.filter(t=>t.pinned)),Ee=null,ie=null,ke=null,ee.some(t=>t.id===Te)||(Te=null)):Ee&&Ro(Ee),ue();else if(V&&e.key.startsWith("Arrow")){let t=ko(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;Je(`nudge:${t.id}`);let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",Ge([...ee]),ue()}else if(V&&e.key.toLowerCase()==="g"){e.preventDefault(),be("grid");return}else if(V&&e.key.toLowerCase()==="k"){e.preventDefault(),be("pixels");return}else if(V&&e.key==="\\"){e.preventDefault(),be("hide");return}else if(V&&e.key.toLowerCase()==="e"){e.preventDefault(),be("edit");return}else if(V&&e.key.toLowerCase()==="f"){e.preventDefault(),be("freeze");return}else if(V&&e.key.toLowerCase()==="x"){e.preventDefault(),be("xray");return}else if(V&&e.key.toLowerCase()==="p"){e.preventDefault(),be("pick");return}else if(V&&e.key.toLowerCase()==="t"){e.preventDefault(),be("type");return}else if(V&&e.key.toLowerCase()==="c"){e.preventDefault(),be("copy");return}else if(V&&e.key.toLowerCase()==="l"){let t=ko();if(!t)return;e.preventDefault(),Je(),t.pinned=!t.pinned,Ge([...ee]),ue()}else if(V&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){if(ze.depth()===0)return;e.preventDefault(),be("undo");return}else if(V&&e.key.toLowerCase()===de.rulerKey){e.preventDefault(),be("rulers");return}else if(V&&e.key.toLowerCase()===de.panelKey){e.preventDefault(),be("panel");return}else if(e.key==="Escape"&&V){if(Ze?.close()||Ce?.closeHelp())return;_.length?(_=[],me?.hide(),Be?.show(null),ue()):tn()}}}function xa(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,de=Sn(e),Fn(de.theme),addEventListener("keydown",To,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{tn(),removeEventListener("keydown",To,{capture:!0}),delete window.__align})}export{xa as initAlign};
