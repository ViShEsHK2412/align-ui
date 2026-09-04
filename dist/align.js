function Y(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function no(e){return(e.split(",")[0]??"").trim().replace(/^['"]|['"]$/g,"")}function oo(e){let o={100:"thin",200:"extralight",300:"light",400:"regular",500:"medium",600:"semibold",700:"bold",800:"extrabold",900:"black"}[e.trim()];return o?`${e} ${o}`:e}function Fe(e){let t=getComputedStyle(e);return[{label:"family",value:no(t.fontFamily),px:NaN},{label:"size",value:t.fontSize,px:Y(t.fontSize)},{label:"weight",value:oo(t.fontWeight),px:NaN},{label:"line",value:t.lineHeight,px:Y(t.lineHeight)},{label:"tracking",value:t.letterSpacing,px:Y(t.letterSpacing)}]}function Yt(e){let t="";for(let o of e.childNodes)o.nodeType===3&&(t+=o.nodeValue??"");return t.trim().replace(/\s+/g," ")}function Kt(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:Y(r)})}return o}function ro(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function io(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function _t(e,t){if(t.length===0)return"";let o=[],n=0;for(let i of io(e)){let a=ro(i,t);a.length?o.push(`${ao(i)} ${a.join(" ")}`):n+=1}if(o.length===0)return n===1?"its one number is not on the scale":`none of its ${n} numbers are on the scale`;let r=n===0?"":n===1?"  \xB7  1 more, not on the scale":`  \xB7  ${n} more, not on the scale`;return o.join("  \xB7  ")+r}function ao(e){return String(Math.round(e*100)/100)}function Dt(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(Y)}function jt(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),s=a.display.includes("flex")||a.display.includes("grid"),u=n==="x"?a.columnGap:a.rowGap,f=s&&u!=="normal"?Y(u):null,[m,k,l,h]=Dt(e),[y,D,_,d]=Dt(t),b=P=>Number.isFinite(P)?P:0,L=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,G=n==="x"?L?b(k)+b(d):b(D)+b(h):L?b(l)+b(y):b(_)+b(m);return{px:o,cssGap:f,margins:G,siblings:!0}}function Ut(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function Vt(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}function ot(e){let t=e.trim().toLowerCase();return t?t.startsWith("#")||/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(t)?!0:["black","white","transparent","currentcolor"].includes(t):!1}var ie;function Pt(e){if(ie===void 0&&(ie=document.createElement("canvas").getContext("2d")),!ie)return"";ie.fillStyle="#000000",ie.fillStyle=e;let t=ie.fillStyle;return ie.fillStyle="#ffffff",ie.fillStyle=e,t===ie.fillStyle?String(t):""}function qt(e,t){let o=Pt(e);return o?t.filter(n=>ot(n.value)&&Pt(n.value)===o).map(n=>n.name).sort():[]}function Jt(e){let t=getComputedStyle(e),o=[],n=(r,i)=>{let a=i.trim();!a||a==="transparent"||/rgba?\([^)]*,\s*0\s*\)$/.test(a)||o.push({label:r,value:a})};return n("text",t.color),n("background",t.backgroundColor),o}function so(e,t,o){let n=r=>typeof CSS<"u"&&CSS.escape?CSS.escape(r):r.replace(/[^\w-]/g,"\\$&");return t?`#${n(t)}`:o.length?e+o.map(r=>`.${n(r)}`).join(""):e}function rt(e){let t=typeof e.className=="string"?e.className.trim().split(/\s+/).filter(Boolean):[];return so(e.tagName.toLowerCase(),e.id,t)}function Qt(e){let t=rt(e);if(!/[.#]/.test(t))return 0;try{return document.querySelectorAll(t).length}catch{return 0}}function lo(e){if(!e)return"inline <style>";let t=e.split("?")[0]??e;try{let o=new URL(t,"http://x").pathname;return decodeURI(o).replace(/^\//,"")||t}catch{return t}}var co=["width","height","padding","margin","border-width","gap","font-size","line-height","letter-spacing","color","background-color"];function uo(e){for(let t=0;t<e.length;t+=1){let o=e.item(t);if(co.some(n=>o===n||o.startsWith(`${n}-`)))return!0}return!1}function Zt(e){let t=[],o=new Set,n=(r,i)=>{for(let a of Array.from(r)){if(a instanceof CSSMediaRule){matchMedia(a.conditionText).matches&&n(a.cssRules,i);continue}if(a instanceof CSSSupportsRule){CSS.supports(a.conditionText)&&n(a.cssRules,i);continue}let s=a.cssRules;if(s&&!(a instanceof CSSStyleRule)){n(s,i);continue}if(!(a instanceof CSSStyleRule))continue;let u=!1;try{u=e.matches(a.selectorText)}catch{continue}if(!u||!uo(a.style))continue;let f=`${a.selectorText}|${i}`;o.has(f)||(o.add(f),t.push({selector:a.selectorText,file:i}))}};for(let r of Array.from(document.styleSheets)){if(r.ownerNode instanceof Element&&r.ownerNode.hasAttribute("data-align-ignore"))continue;let i;try{i=r.cssRules}catch{continue}n(i,lo(r.href))}return t.reverse()}function zt(e){if(!e||e==="none")return[];let t=e.trim().split(/\s+/),o=[];for(let n of t){if(!n.endsWith("px"))return[];let r=Number.parseFloat(n);if(!Number.isFinite(r))return[];o.push(r)}return o}function Ft(e,t,o){let n=0;for(let r=0;r<e.length;r+=1){let i=n+e[r];if(o<i+.5)return r;n=i+t}return-1}function po(e,t){let o=t==="rtl";return e.startsWith("vertical")||e.startsWith("sideways")?{inline:"y",inlineReversed:e==="sideways-lr"?!o:o,blockReversed:e==="vertical-rl"||e==="sideways-rl"}:{inline:"x",inlineReversed:o,blockReversed:!1}}function Ht(e,t,o,n,r){return r?t-n:o-e}function en(e){let t=e.parentElement,o=0;for(;t&&getComputedStyle(t).display==="contents";)t=t.parentElement,o+=1;if(!t)return null;let n=getComputedStyle(t),r=getComputedStyle(e),i=n.display,a=[];if(o>0&&a.push({label:"through",value:o===1?"a display: contents parent":`${o} display: contents parents`}),r.position==="absolute"||r.position==="fixed")return a.push({label:"placed by",value:`${r.position}, not by the parent`}),{display:i,rows:a};if(r.float!=="none")return a.push({label:"placed by",value:`float: ${r.float}`}),{display:i,rows:a};let s=i.includes("flex"),u=i.includes("grid");if(!s&&!u)return a.push({label:"flow",value:i}),{display:i,rows:a};let f=Wt(n.rowGap==="normal"?"0px":n.rowGap),m=Wt(n.columnGap==="normal"?"0px":n.columnGap),k=f===m?f:`row ${f} \xB7 column ${m}`;if(s){let B=n.flexDirection;a.push({label:"direction",value:n.flexWrap==="nowrap"?B:`${B} \xB7 ${n.flexWrap}`}),a.push({label:"justify",value:n.justifyContent}),a.push({label:"align",value:n.alignItems}),a.push({label:"gap",value:k});let c=`${r.flexGrow} ${r.flexShrink} ${r.flexBasis}`;return c!=="0 1 auto"&&a.push({label:"this child",value:`flex: ${c}`}),r.alignSelf!=="auto"&&a.push({label:"align-self",value:r.alignSelf}),{display:i,rows:a}}let l=zt(n.gridTemplateColumns),h=zt(n.gridTemplateRows);l.length&&a.push({label:"columns",value:`${l.length} \xB7 ${l.map(nt).join(" ")}`}),h.length&&a.push({label:"rows",value:`${h.length} \xB7 ${h.map(nt).join(" ")}`}),a.push({label:"gap",value:k});let y=t.getBoundingClientRect(),D=e.getBoundingClientRect(),_={left:y.left+Y(n.borderLeftWidth)+Y(n.paddingLeft),right:y.right-Y(n.borderRightWidth)-Y(n.paddingRight),top:y.top+Y(n.borderTopWidth)+Y(n.paddingTop),bottom:y.bottom-Y(n.borderBottomWidth)-Y(n.paddingBottom)},d=po(n.writingMode,n.direction),b=(B,c)=>B==="x"?Ht(_.left,_.right,D.left,D.right,c):Ht(_.top,_.bottom,D.top,D.bottom,c),L=d.inline==="x"?"y":"x",G=Y(n.columnGap==="normal"?"0":n.columnGap),P=Y(n.rowGap==="normal"?"0":n.rowGap),q=Ft(l,G,b(d.inline,d.inlineReversed)),j=Ft(h,P,b(L,d.blockReversed)),X=[];return q>=0&&X.push(`column ${q+1} of ${l.length}`),j>=0&&X.push(`row ${j+1} of ${h.length}`),X.length&&a.push({label:"this child",value:X.join(" \xB7 ")}),{display:i,rows:a}}function Wt(e){return e.endsWith("px")?nt(Number.parseFloat(e)):e}function nt(e){return String(Math.round(e*100)/100)}var tn=["display","position","width","height","padding","margin","border-width","border-style","border-radius","font-family","font-size","font-weight","font-style","line-height","letter-spacing","text-transform","text-align","color","background-color","border-color","opacity","flex-direction","justify-content","align-items","gap","flex-grow","flex-shrink","flex-basis","align-self","box-shadow","overflow","text-overflow","white-space"];function ho(e,t){let o=[];for(let n of tn){let r=e[n]??"",i=t[n]??"";r!==i&&o.push({prop:n,a:r,b:i})}return o}function Xt(e){let t=getComputedStyle(e),o={};for(let n of tn)o[n]=t.getPropertyValue(n);return o}function nn(e,t){return ho(Xt(e),Xt(t))}var fo={ignore:"",grid:null,hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function rn(e={}){return{...fo,...e}}var on=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function an(e){return e.ignore?`${on}, ${e.ignore}`:on}function T(e){return String(Math.round(e*100)/100)}function mo(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function Xe(e){let t=e.getBoundingClientRect();return{el:e,label:mo(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height,scale:Ke(e)}}function sn(e,t){let o=(n,r)=>Math.abs(n-r)<.001;return o(e.scale.x,t.scale.x)&&o(e.scale.y,t.scale.y)?e.scale:{x:1,y:1}}function ln(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function me(e,t,o){let n=an(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=ln(r);return r&&r!==document.documentElement?Xe(r):null}var He=e=>parseFloat(e)||0;function it(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[He(n),He(r),He(i),He(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function go(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function xo(e,t){let o=sn(e,t),n=t.left+t.width/2,r=t.top+t.height/2;return[{x1:e.left,y1:r,x2:t.left,y2:r,label:T((t.left-e.left)/o.x),axis:"x"},{x1:t.right,y1:r,x2:e.right,y2:r,label:T((e.right-t.right)/o.x),axis:"x"},{x1:n,y1:e.top,x2:n,y2:t.top,label:T((t.top-e.top)/o.y),axis:"y"},{x1:n,y1:t.bottom,x2:n,y2:e.bottom,label:T((e.bottom-t.bottom)/o.y),axis:"y"}]}function We(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function Ye(e,t){let o=[],n=sn(e,t),r=e.left<t.right&&t.left<e.right,i=e.top<t.bottom&&t.top<e.bottom;if(r&&i){let[a,s]=go(e,t);return xo(a,s)}if(!r){let[a,s]=e.right<=t.left?[e,t]:[t,e],u=i?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:a.right,y1:u,x2:s.left,y2:u,label:`${T((s.left-a.right)/n.x)}`,axis:"x"}),o.push(...We(a.right,a.top,a.bottom,u,"x")),o.push(...We(s.left,s.top,s.bottom,u,"x"))}if(!i){let[a,s]=e.bottom<=t.top?[e,t]:[t,e],u=r?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:u,y1:a.bottom,x2:u,y2:s.top,label:`${T((s.top-a.bottom)/n.y)}`,axis:"y"}),o.push(...We(a.bottom,a.left,a.right,u,"y")),o.push(...We(s.top,s.left,s.right,u,"y"))}return o}function yo(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function at(e){let t=yo(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var bo=5,wo=8;function Ge(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function st(e,t,o){let n=null,r=bo;for(let i of e){let a=Math.abs(Ge(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function cn(e,t,o){if(o)return{at:e,what:""};let n=null,r=wo;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function un(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function lt(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,s=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:s,y2:i,label:T(r.gap),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,s=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:s,label:T(r.gap),axis:"y"})}}return o}function dn(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],s=r[i],u=s-a;u<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:s,y2:t.y,label:T(u),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:s,label:T(u),axis:"y"}))}}return o}var ue=3;function vo(e,t){return e.x<t.x+t.w+ue&&t.x<e.x+e.w+ue&&e.y<t.y+t.h+ue&&t.y<e.y+e.h+ue}function pn(e,t,o=12){let n=(a,s)=>Math.min(Math.max(a,o),t.w-s-o),r=(a,s)=>Math.min(Math.max(a,o),t.h-s-o),i=[];for(let a of e){let s={...a,x:n(a.x,a.w),y:r(a.y,a.h)},u=!1;for(let f=0;f<16;f++){let m=i.find(l=>vo(l,s));if(!m)break;let k=s.axis==="x"?s.y:s.x;if(s.axis==="x"?s.y=r(u?m.y+m.h+ue:m.y-s.h-ue,s.h):s.x=n(u?m.x-s.w-ue:m.x+m.w+ue,s.w),(s.axis==="x"?s.y:s.x)===k){if(u)break;u=!0}}i.push(s)}return i}function hn(e,t){let{columns:o,gutter:n,margin:r}=e;if(o<=0)return[];let i=e.maxWidth>0?Math.min(e.maxWidth,t):t,a=Math.max(0,(t-i)/2),u=(Math.max(0,i-r*2)-n*(o-1))/o;if(u<=0)return[];let f=[];for(let m=0;m<o;m+=1)f.push({left:a+r+m*(u+n),width:u});return f}function fn(e,t){return e*t>=8?e:0}function ko(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(s=>parseFloat(s)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function Ke(e){let t=1,o=1;for(let n=e;n;n=ln(n)){let r=ko(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var ee=(e,t)=>({light:e,dark:t}),ct={accent:ee("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:ee("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:ee("oklch(1 0 0)","oklch(0.264 0 0)"),fg:ee("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:ee("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:ee("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:ee("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:ee("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)"),pixelLine:ee("oklch(0.205 0 0 / 0.14)","oklch(0.97 0 0 / 0.14)")};function gn(e){return`light-dark(${e.light}, ${e.dark})`}var ae=gn(ee("#fafafa","#1a1a1a"));function Ne(e,t=e){return gn(ee(`rgb(0 0 0 / ${t})`,`rgb(255 255 255 / ${e})`))}var mn=[0,.07,.08,.1,.12,.15,.2];function V(e){let t=mn[Math.max(0,Math.min(mn.length-1,e))];return t===0?ae:Ne(t)}var N={primary:Ne(.9),secondary:Ne(.6),tertiary:Ne(.46,.55)},de=Ne(.12),ge="0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)",xn="0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)",v=22,dt=36;var se={expand:"400ms cubic-bezier(0.19, 1, 0.22, 1)",enter:"500ms cubic-bezier(0.34, 1.2, 0.64, 1)",exit:"160ms cubic-bezier(0.3, 0, 1, 1)",ui:"160ms cubic-bezier(0.2, 0, 0, 1)"},So='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',E={title:13,body:12,tag:11,stack:So},z={regular:400,medium:500,semibold:600},ut="__align_font",$o="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function yn(){if(document.getElementById(ut))return;let e=document.createElement("link");e.id=ut,e.rel="stylesheet",e.href=$o,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function bn(){document.getElementById(ut)?.remove()}function wn(e){let t=[`${z.medium} ${E.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function pt(e){let t={};for(let o of Object.keys(ct))t[o]=e?ct[o].dark:ct[o].light;return t}function ht(){let e=document.documentElement,t=getComputedStyle(e).colorScheme;if(/dark/.test(t)&&!/light/.test(t))return!0;if(/light/.test(t)&&!/dark/.test(t))return!1;for(let o of[document.body,e]){if(!o)continue;let n=Eo(getComputedStyle(o).backgroundColor);if(n!==null)return n<.5}return matchMedia("(prefers-color-scheme: dark)").matches}function Eo(e){let t=/^rgba?\(([^)]+)\)$/.exec(e.trim());if(!t)return null;let o=t[1].split(/[\s,/]+/).filter(Boolean).map(Number),[n,r,i,a=1]=o;return n===void 0||r===void 0||i===void 0||a<.5?null:(.2126*n+.7152*r+.0722*i)/255}function ke(e,t){return e.replace(/\)$/,` / ${t})`)}var Co=`
`,le=16,To=`
.dock {
  /* No color-scheme here: the overlay sets it inline on the shadow host, from
     what the page actually looks like rather than what the machine prefers, and
     it inherits down. Declaring 'light dark' again would undo that and hand
     light-dark() back to the media query. */
  position: fixed; left: ${le}px; top: 0; width: 340px;
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
  --border: ${de};
}
.panel {
  padding: 10px; border-radius: 0;
  /* Five sections now \u2014 box, tokens, styled by, matches, colour \u2014 and on a
     laptop that is taller than the window. place() clamps the position but
     cannot rescue a panel taller than the screen, so it scrolls instead. */
  max-height: calc(100vh - ${le*2}px);
  overflow-y: auto; overscroll-behavior: contain;
  font-size: ${E.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${ae};

  box-shadow: ${ge};

  /* The one animation in the tool: a panel that must land exactly, so the
     Fluid spring.moderate tier at 160ms, critically damped. */
  opacity: 0;
  transform: translateY(4px) scale(0.98);
  transform-origin: bottom left;
  transition: opacity ${se.exit}, transform ${se.exit},
              box-shadow ${se.exit};
}
.dock[data-open] .panel {
  pointer-events: auto;
  opacity: 1;
  transform: none;
  /* Slow in, faster out. Both come from the tokens now: the panel had been
     carrying hard-coded curves from the design system the theme replaced. */
  transition: opacity ${se.ui}, transform ${se.ui},
              box-shadow ${se.ui};
}
@media (prefers-reduced-motion: reduce) {
  /* Fewer and gentler, not none: the fade aids comprehension, the travel does not. */
  .panel { transform: none; transition: opacity 120ms linear; }
}

header {
  /* Stays put while the body scrolls: it is also the drag handle, and a handle
     you have to scroll back up to find is not a handle. */
  position: sticky; top: -10px; z-index: 1;
  background: ${ae};
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] .panel { box-shadow: ${xn}; }
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${E.title}px; font-weight: ${z.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${E.body}px; font-weight: ${z.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${E.tag}px; font-weight: ${z.medium};
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
.close:hover { color: var(--fg); background: ${V(1)}; }

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
  padding: 8px;
}
.region[data-level="1"] { background: ${V(1)}; }
.region[data-level="2"] { background: ${V(2)}; }
.region[data-level="3"] { background: ${V(3)}; }
.content { background: ${V(4)}; }

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
  font-size: ${E.tag}px; font-weight: ${z.medium};
  letter-spacing: 0.01em; line-height: 1;
  color: var(--muted);
}
.edge {
  text-align: center; font-weight: ${z.medium}; line-height: 1;
  white-space: nowrap; color: var(--fg);
}
.edge[data-zero] { color: var(--muted); font-weight: ${z.regular}; }
.row { display: flex; align-items: center; gap: 4px; margin: 4px 0; }
.row > .edge { flex: 0 0 20px; }
.row > .fill { flex: 1 1 auto; min-width: 0; }

/* Type and tokens sit under the box, in the same muted register as the band
   labels \u2014 they annotate the measurement rather than competing with it. */
.readout {
  user-select: text;
  margin-top: 8px; padding-top: 8px;
  border-top: 1px solid var(--border);
}
.readout-tag { position: static; margin-bottom: 4px; }
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
  border-radius: 0; padding: 12px 8px;
  text-align: center; font-weight: ${z.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,Be=le,xe=-1,Se=!1;function vn(e){let t=document.createElement("style");t.textContent=To,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);let r=!1;function i(d,b){let L=document.createElement("div");L.className="readout";let G=document.createElement("div");G.className="tag readout-tag",G.textContent=d,L.appendChild(G);let P=document.createElement("div");P.className="readout-rows",L.appendChild(P);for(let[q,j]of b){let X=document.createElement("div");X.className="readout-row";let B=document.createElement("span");B.className="readout-key",B.textContent=q;let c=document.createElement("span");c.className="readout-value",c.textContent=j,X.append(B,c),P.appendChild(X)}return L}e.appendChild(o);let a=(d,b)=>Math.min(Math.max(d,le),Math.max(le,b-le));function s(){let d=o.offsetHeight||300;xe<0&&(xe=Math.max(le,innerHeight-d-le)),Be=a(Be,innerWidth-o.offsetWidth),xe=a(xe,innerHeight-d),o.style.transform=`translate(${Be-le}px, ${xe}px)`}let u=null;function f(d){d.button===0&&(d.preventDefault(),d.stopPropagation(),u={x:d.clientX,y:d.clientY,dx:Be,dy:xe},o.setAttribute("data-dragging",""),d.currentTarget.setPointerCapture(d.pointerId))}function m(d){u&&(Be=u.dx+(d.clientX-u.x),xe=u.dy+(d.clientY-u.y),s())}function k(){u=null,o.removeAttribute("data-dragging")}addEventListener("resize",s);let l=null,h=[],y;function D(d){let b=document.createElement("div");return b.className="edge",b.textContent=d===0?"0":T(d),d===0&&b.setAttribute("data-zero",""),b}function _(d,b,L,G){let[P,q,j,X]=L,B=document.createElement("div");B.className="region",B.setAttribute("data-level",String(b));let c=document.createElement("span");c.className="tag",c.textContent=d;let g=document.createElement("div");g.className="row";let p=document.createElement("div");p.className="fill",p.appendChild(G),g.append(D(X),p,D(q));let C=document.createElement("div");return C.className="head",C.append(c,D(P)),B.append(C,g,D(j)),B}return{show(d,b=[],L){h=b,y=L;let G=it(d.el),[P,q,j,X]=G.border,[B,c,g,p]=G.padding,C=Ke(d.el),w=d.width/C.x,x=d.height/C.y,A=Math.abs(C.x-1)>.001||Math.abs(C.y-1)>.001,W=document.createElement("header"),et=document.createElement("span");et.className="name",et.textContent=d.label;let tt=document.createElement("span");tt.className="size",tt.textContent=`${T(w)} \xD7 ${T(x)}`;let we=document.createElement("button");if(we.className="close",we.textContent="\xD7",we.title="close (B brings it back)",we.addEventListener("pointerdown",S=>S.stopPropagation()),we.addEventListener("click",S=>{S.stopPropagation(),Se=!0,o.removeAttribute("data-open")}),W.append(et,tt),A){let S=document.createElement("span");S.className="scale",S.textContent=`\xD7${T(C.x)}`,S.title=`renders at ${T(d.width)} \xD7 ${T(d.height)}`,W.appendChild(S)}W.appendChild(we),W.addEventListener("pointerdown",f),W.addEventListener("pointermove",m),W.addEventListener("pointerup",k),W.addEventListener("pointercancel",k);let Ae=document.createElement("div");Ae.className="content",Ae.textContent=`${T(w-X-q-p-c)} \xD7 ${T(x-P-j-B-g)}`,Ae.title=Ae.textContent;let re=[W,_("margin",1,G.margin,_("border",2,G.border,_("padding",3,G.padding,Ae)))];if(r){let S=Yt(d.el),J=Fe(d.el);re.push(J.length&&S?i("type",J.map(Q=>[Q.label,Q.value])):i("type",[["","nothing of its own to set type on"]]))}if(L&&L.el!==d.el&&L.el.isConnected){let S=nn(L.el,d.el).map(ve=>[ve.prop,`${ve.a||"\u2014"} \u2192 ${ve.b||"\u2014"}`]),J=S.slice(0,10);S.length>J.length&&J.push(["",`and ${S.length-J.length} more`]);let Q=L.label===d.label?"the one locked before":L.label;re.push(i(`differs from ${Q}`,J.length?J:[["","nothing in the properties it compares"]]))}let ze=en(d.el);if(ze&&ze.rows.length&&re.push(i(`laid out by ${ze.display}`,ze.rows.map(S=>[S.label,S.value]))),b.length){let S=b.map(Q=>[T(Q.px),Q.detail]),J=Vt(b.map(Q=>Q.px));J&&S.push(["",J]),re.push(i("gaps",S))}let Gt=Kt(d.el),Nt=_t([w,x,...G.margin,...G.border,...G.padding,...r?Fe(d.el).map(S=>S.px):[]],Gt);Nt&&re.push(i("tokens",[["",Nt]]));let Bt=Zt(d.el);Bt.length&&re.push(i("styled by",Bt.slice(0,4).map(S=>[S.selector,S.file])));let It=Qt(d.el);It>1&&re.push(i("matches",[["",`${It} elements share ${rt(d.el)}`]]));let Ot=Gt.filter(S=>ot(S.value));if(Ot.length){let S=Jt(d.el).map(({label:J,value:Q})=>{let ve=qt(Q,Ot);return[J,ve.length?`${Q}  ${ve.join(" ")}`:`${Q}  \u2014`]});S.length&&re.push(i("colour",S))}n.replaceChildren(...re),l=d,s(),!Se&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},showsType:()=>r,isOpen:()=>!Se&&l!==null,toggleType(){r=!r,l&&this.show(l,h,y)},asText(){if(!l)return"";let d=it(l.el),b=Ke(l.el),L=l.width/b.x,G=l.height/b.y,P=j=>j.map(X=>T(X)).join(" "),q=[`${l.label}  ${T(L)} \xD7 ${T(G)}`,`margin   ${P(d.margin)}`,`border   ${P(d.border)}`,`padding  ${P(d.padding)}`];if(r)for(let j of Fe(l.el))q.push(`${j.label.padEnd(8)} ${j.value}`);return q.join(Co)},hide(){l=null,o.removeAttribute("data-open")},toggle(){l&&(Se=!Se,Se?o.removeAttribute("data-open"):(s(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",s),o.remove(),t.remove()}}}function kn(e=20,t=1e3){let o=[];return{push(n,r,i=Date.now()){let a=o[o.length-1];if(a&&r!==""&&a.tag===r&&i-a.at<=t){a.at=i;return}o.push({state:n,tag:r,at:i}),o.length>e&&o.shift()},pop(){return o.pop()?.state??null},depth(){return o.length},clear(){o.length=0}}}var Mo="0 0 24 24";var M=e=>({path:e}),pe=(e,t,o,n,r)=>({rect:[e,t,o,n,r]}),Ro={rulers:[M("M2 8V4"),M("M22 8V4"),M("M22 6H2"),pe(2,12,20,8,2),M("M6 15v-3"),M("M10 15v-3"),M("M14 15v-3"),M("M18 15v-3")],xray:[M("M3 7V5a2 2 0 0 1 2-2h2"),M("M17 3h2a2 2 0 0 1 2 2v2"),M("M21 17v2a2 2 0 0 1-2 2h-2"),M("M7 21H5a2 2 0 0 1-2-2v-2")],grid:[pe(3,3,18,18,2),M("M9 3v18"),M("M15 3v18")],pixels:[pe(3,3,18,18,2),M("M3 9h18"),M("M3 15h18"),M("M9 3v18"),M("M15 3v18")],type:[M("M12 4v16"),M("M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"),M("M9 20h6")],panel:[pe(3,3,18,18,2),pe(8,8,8,8,1)],freeze:[pe(14,3,5,18,1),pe(5,3,5,18,1)],copy:[pe(8,8,14,14,2),M("M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2")],pick:[M("m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12"),M("m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z"),M("m2 22 .414-.414")],undo:[M("M9 14 4 9l5-5"),M("M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11")]},ft="http://www.w3.org/2000/svg";function mt(e,t=16){let o=document.createElementNS(ft,"svg");o.setAttribute("viewBox",Mo),o.setAttribute("width",String(t)),o.setAttribute("height",String(t)),o.setAttribute("fill","none"),o.setAttribute("stroke","currentColor"),o.setAttribute("stroke-width","2"),o.setAttribute("stroke-linecap","round"),o.setAttribute("stroke-linejoin","round"),o.setAttribute("aria-hidden","true");for(let n of Ro[e])if("rect"in n){let[r,i,a,s,u]=n.rect,f=document.createElementNS(ft,"rect");f.setAttribute("x",String(r)),f.setAttribute("y",String(i)),f.setAttribute("width",String(a)),f.setAttribute("height",String(s)),f.setAttribute("rx",String(u)),o.appendChild(f)}else{let r=document.createElementNS(ft,"path");r.setAttribute("d",n.path),o.appendChild(r)}return o}var Lo=[{title:"Pointing at things",rows:[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure whatever is under the cursor"],["Click","lock an element, so it keeps measuring after the pointer leaves"],["Right-click","add another to the locked set, or drop one from it. Two locked also gets you a diff"],["Drag the panel header","move the box model out of your way"],["Esc","clear the locks, then close the tool"]]},{title:"Guides",rows:[["Drag from a rule","pull out a guide; drag it back into the rule to throw it away"],["V  /  H","drop a vertical or horizontal guide at the cursor"],["Hover a guide","its distance to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the guide you last touched. Shift for 10px"],["L","pin a guide, so it cannot be moved or deleted by accident"],["Ctrl/Cmd while placing","ignore snapping"],["Del","remove the guide under the cursor. Shift+Del for all of them"]]}],ye=16,gt=24,xt=dt,yt=8,Ao=`
.flag {
  position: fixed; top: ${ye}px; right: ${ye}px;
  display: flex; align-items: center; gap: 8px;
  transition: top ${se.ui};
  padding: ${(dt-gt)/2}px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${E.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${E.tag}px; font-weight: ${z.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${N.primary};
  background: ${ae};
  box-shadow: ${ge};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
/* No negative tracking: it is 11px, and tightening is what large text wants.
   Small text reads better at zero or a hair positive. */
.flag .name { letter-spacing: 0; }
/* The rulers draw a gutter along the top edge, and the badge sits in it. Step
   down out of the way rather than covering the ticks the rulers exist to show. */
.flag[data-rulers] { top: ${ye+v}px; }
.help[data-rulers] { top: ${ye+v+xt+yt}px; }
.flag:hover { background: ${V(1)}; }
.flag .count { color: ${N.secondary}; }

/* A layers bar, not a palette. Switches, then the one control that changes the
   page, then the things that happen once. */
.tools { display: flex; align-items: center; gap: 2px; }
.sep {
  width: 1px; align-self: stretch; margin: 0 4px;
  background: ${de};
}
.tool {
  width: ${gt}px; height: ${gt}px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; cursor: pointer;
  font: inherit; font-size: ${E.tag}px; font-weight: ${z.medium};
  color: ${N.tertiary};
}
.tool:hover { background: ${V(2)}; color: ${N.primary}; }
/* On the press, not on the release. Waiting for the click to acknowledge a
   button is the difference between a control that answers and one that lags,
   and it costs one rule. */
.tool:active { background: ${V(4)}; color: ${N.primary}; }
.tool:focus-visible { outline: 1px solid ${N.primary}; outline-offset: -1px; }
/* On is the film, not a colour: the three hues each already mean something on
   the canvas, and a fourth here would say nothing. */
.tool[data-on] { background: ${V(4)}; color: ${N.primary}; }

/* The badge steps down out of the ruler gutter, and that step is decoration:
   under reduced motion it should simply be in the right place. */
@media (prefers-reduced-motion: reduce) {
  .flag { transition: none; }
}
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: ${ye+xt+yt}px; right: ${ye}px; width: 368px;
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${ye*2+xt+yt}px); overflow-y: auto;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${E.stack};
  font-synthesis: none;
  font-size: ${E.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${N.primary};
  background: ${ae};
  box-shadow: ${ge};
  display: none;
}
.help[data-open] { display: block; }
/* Baselines, not boxes. A key sits in a bordered chip and its description does
   not, so aligning the two boxes puts the key's text 4px below the first line
   of the text it labels \u2014 right on one-line rows by luck, wrong on every row
   that wraps. Aligning on the baseline is right on both. */
.help dl {
  display: grid; grid-template-columns: 16px auto 1fr;
  /* Baseline alignment already buys each wrapped row 4px of separation, so
     the gap stays where it was rather than pushing the list off the screen. */
  align-items: baseline; gap: 6px 10px; margin: 0;
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
  font-size: ${E.tag}px; font-weight: ${z.semibold};
  color: ${N.tertiary};
}
.help h4:first-child { margin-top: 0; }
.help kbd {
  display: inline-block; padding: 3px 5px;
  font: inherit; font-weight: ${z.medium};
  border: 1px solid ${de};
  background: ${V(2)};
}
/* These run to three lines, and a one-word last line reads as a mistake. */
.help dd { margin: 0; color: ${N.secondary}; text-wrap: pretty; }
`,bt=[{name:"rulers",label:"Rulers",key:"R",toggle:!0,what:"a scale down the top and left edges, in page pixels \u2014 and the gutters you drag guides out of"},{name:"xray",label:"X-ray",key:"X",toggle:!0,what:"outline every element at once, to see the boxes a layout is really made of"},{name:"grid",label:"Column grid",key:"G",toggle:!0,what:"the grid your design is built on, columns filled and gutters left empty. Needs one configured"},{name:"pixels",label:"Pixel grid",key:"K",toggle:!0,what:"a ten-pixel lattice over the page, to read an offset off without measuring it"},{name:"type",label:"Type",key:"T",toggle:!0,what:"add size, weight, line height and tracking to the panel, each checked against your scale"},{name:"panel",label:"Box model",key:"B",toggle:!0,what:"the readout itself \u2014 margins, borders, padding, what places the element, what styles it"},{name:"freeze",label:"Freeze",key:"F",toggle:!0,what:"hold every animation and transition where it stands, so a moving thing can be measured"},{name:"copy",label:"Copy",key:"C",toggle:!1,what:"put everything in the panel on the clipboard as text"},{name:"pick",label:"Colour",key:"P",toggle:!1,what:"sample a colour from anywhere on screen and match it against your palette"},{name:"undo",label:"Undo",key:"Ctrl/Cmd + Z",toggle:!1,what:"step back through the guides \u2014 a whole run of nudges counts as one"}];function Sn(e,t){let o=document.createElement("style");o.textContent=Ao,e.appendChild(o);let n=document.createElement("div");n.className="flag";let r=document.createElement("span");r.className="name",r.textContent="Align";let i=document.createElement("span");i.className="count";let a=new Map,s=document.createElement("div");s.className="tools";for(let l of bt){if(l.name==="freeze"||l.name==="copy"){let y=document.createElement("span");y.className="sep",s.appendChild(y)}let h=document.createElement("button");h.type="button",h.className="tool",h.appendChild(mt(l.name)),h.setAttribute("aria-label",l.label),h.title=`${l.label}  \xB7  ${l.key}
${l.what}`,l.toggle||h.setAttribute("data-once",""),h.addEventListener("click",y=>{y.stopPropagation(),t(l.name)}),a.set(l.name,h),s.appendChild(h)}n.append(r,s,i);let u=document.createElement("div");u.className="help";let f=document.createElement("dl");function m(l){let h=document.createElement("h4");h.textContent=l,f.appendChild(h)}function k(l,h,y){let D=document.createElement("span");D.className="glyph",y&&D.appendChild(mt(y,14));let _=document.createElement("dt"),d=document.createElement("kbd");d.textContent=l,_.appendChild(d);let b=document.createElement("dd");b.textContent=h,f.append(D,_,b)}m("The bar, left to right");for(let l of bt)k(l.key,`${l.label} \u2014 ${l.what}`,l.name);for(let l of Lo){m(l.title);for(let[h,y]of l.rows)k(h,y)}return u.appendChild(f),n.addEventListener("click",l=>{l.stopPropagation(),u.toggleAttribute("data-open")}),e.append(n,u),{update(l,h){i.textContent=l>0?`${l} locked`:"",n.toggleAttribute("data-rulers",h.rulers),u.toggleAttribute("data-rulers",h.rulers);for(let y of bt)y.toggle&&a.get(y.name)?.toggleAttribute("data-on",h[y.name]===!0)},closeHelp(){let l=u.hasAttribute("data-open");return u.removeAttribute("data-open"),l},destroy(){n.remove(),u.remove(),o.remove()}}}var _e=5,wt=4,Ie=12,$n=.22,$e=10,Go=50,No=100;function En(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,grid:null,pixels:!1,guides:[],liveGuide:null,activeGuide:null},i=pt(ht()),a=0,s=null;function u(){let c=ht();c!==s&&(s=c,i=pt(c),e.style.colorScheme=c?"dark":"light",B())}u();let f=matchMedia("(prefers-color-scheme: dark)"),m=()=>u();f.addEventListener("change",m);let k=new MutationObserver(()=>u());function l(){k.disconnect(),k.observe(document.documentElement,{attributes:!0}),document.body&&k.observe(document.body,{attributes:!0})}l(),wn(()=>B());function h(){let c=devicePixelRatio;o.width=Math.round(innerWidth*c),o.height=Math.round(innerHeight*c),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(c,0,0,c,0,0),n.translate(.5,.5)}let y=c=>Math.round(c)-.5;function D(c,g){n.strokeStyle=g,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(c.left),Math.round(c.top),Math.round(c.width),Math.round(c.height))}function _(c){n.strokeStyle=ke(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let g of[c.left,c.right])n.moveTo(Math.round(g),0),n.lineTo(Math.round(g),innerHeight);for(let g of[c.top,c.bottom])n.moveTo(0,Math.round(g)),n.lineTo(innerWidth,Math.round(g));n.stroke(),n.setLineDash([])}function d(c){if(n.strokeStyle=c.extension?ke(i.measure,.55):i.measure,n.lineWidth=1,n.setLineDash(c.extension?[3,3]:[]),n.beginPath(),n.moveTo(Math.round(c.x1),Math.round(c.y1)),n.lineTo(Math.round(c.x2),Math.round(c.y2)),c.extension){n.stroke();return}if(c.axis==="x")for(let g of[c.x1,c.x2])n.moveTo(Math.round(g),Math.round(c.y1)-_e),n.lineTo(Math.round(g),Math.round(c.y1)+_e);else for(let g of[c.y1,c.y2])n.moveTo(Math.round(c.x1)-_e,Math.round(g)),n.lineTo(Math.round(c.x1)+_e,Math.round(g));n.stroke()}function b(c){return n.font=`${z.medium} ${E.body}px ${E.stack}`,{w:n.measureText(c).width+wt*2,h:E.body+wt*2+2}}function L(c,g,p,C){n.font=`${z.medium} ${E.body}px ${E.stack}`,n.textBaseline="middle";let{w,h:x}=b(c),A=y(Math.min(Math.max(g,Ie),innerWidth-w-Ie)),W=y(Math.min(Math.max(p,Ie),innerHeight-x-Ie));n.fillStyle=C,n.beginPath(),n.roundRect(A,W,Math.ceil(w),x,4),n.fill(),n.fillStyle=i.surface,n.fillText(c,A+wt,W+x/2)}function G(c,g,p,C,w=!1){let{w:x,h:A}=b(c);L(c,w?g-x/2:g,w?p-A/2:p,C)}function P(){let c=scrollX,g=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,v),n.fillRect(-.5,-.5,v,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${z.regular} 9px ${E.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let x of r.pinned)n.fillRect(y(x.left),-.5,Math.round(x.width),v),n.fillRect(-.5,y(x.top),v,Math.round(x.height));n.restore(),n.beginPath(),n.moveTo(-.5,v-.5),n.lineTo(innerWidth,v-.5),n.moveTo(v-.5,-.5),n.lineTo(v-.5,innerHeight),n.stroke();let p=x=>x%No===0?v:x%Go===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let C=Math.floor(c/$e)*$e;for(let x=C;x<c+innerWidth;x+=$e){let A=Math.round(x-c);if(A<v)continue;let W=p(x);n.moveTo(A,v-W),n.lineTo(A,v),W===v&&(n.fillStyle=i.muted,n.fillText(String(x),A+3,3))}n.stroke(),n.beginPath();let w=Math.floor(g/$e)*$e;for(let x=w;x<g+innerHeight;x+=$e){let A=Math.round(x-g);if(A<v)continue;let W=p(x);n.moveTo(v-W,A),n.lineTo(v,A),W===v&&(n.save(),n.translate(3,A-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(x),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),v),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo(v,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let x of r.guides){let A=Math.round(Ge(x));x.axis==="x"?n.fillRect(A-1,-.5,2,v):n.fillRect(-.5,A-1,v,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,v,v),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,v,v)}function q(){let c=fn(10,1);if(c){n.strokeStyle=i.pixelLine,n.lineWidth=1,n.setLineDash([]),n.beginPath();for(let g=0;g<=innerWidth;g+=c)n.moveTo(g,0),n.lineTo(g,innerHeight);for(let g=0;g<=innerHeight;g+=c)n.moveTo(0,g),n.lineTo(innerWidth,g);n.stroke()}}function j(c){let g=hn(c,document.documentElement.clientWidth);n.fillStyle=ke(i.measure,.08);for(let p of g)n.fillRect(y(p.left),-.5,Math.round(p.width),innerHeight+1)}function X(){a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore(),(r.pixels||r.grid)&&(n.save(),r.rulers&&(n.beginPath(),n.rect(v,v,innerWidth,innerHeight),n.clip()),r.pixels&&q(),r.grid&&j(r.grid),n.restore());for(let p of r.pinned)D(p,i.accent);r.hover&&(_(r.hover),D(r.hover,r.pinned.length?ke(i.accent,.7):i.accent));for(let p of r.guides){let C=r.liveGuide?.id===p.id;n.strokeStyle=p.locked||C?i.guide:ke(i.guide,.55),n.lineWidth=p.pinned?2:1,n.setLineDash(p.locked?[]:[4,4]),n.beginPath();let w=Math.round(Ge(p));if(p.axis==="x"?(n.moveTo(w,0),n.lineTo(w,innerHeight)):(n.moveTo(0,w),n.lineTo(innerWidth,w)),n.stroke(),r.activeGuide===p.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let x=7;p.axis==="x"?(n.moveTo(w,0),n.lineTo(w,x),n.moveTo(w,innerHeight-x),n.lineTo(w,innerHeight)):(n.moveTo(0,w),n.lineTo(x,w),n.moveTo(innerWidth-x,w),n.lineTo(innerWidth,w)),n.stroke()}}for(let p of r.lines)n.globalAlpha=p.faded?$n:1,d(p);n.globalAlpha=1;let c=r.lines.filter(p=>p.label!==""),g=c.map(p=>{let C=(p.x1+p.x2)/2,w=(p.y1+p.y2)/2,{w:x,h:A}=b(p.label);return p.axis==="x"?{x:C-x/2,y:w-16-A/2,w:x,h:A,axis:p.axis}:{x:C+26-x/2,y:w-A/2,w:x,h:A,axis:p.axis}});if(pn(g,{w:innerWidth,h:innerHeight},Ie).forEach((p,C)=>{let w=c[C];n.globalAlpha=w.faded?$n:1,L(w.label,p.x,p.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:p,height:C,scale:w}=r.hover;G(`${T(p/w.x)} \xD7 ${T(C/w.y)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let p=r.liveGuide,C=Math.round(Ge(p));G([`${p.axis} ${T(p.at)}`,p.caught,p.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),p.axis==="x"?C+6:30,p.axis==="x"?30:C+6,i.guide)}r.rulers&&P()}function B(){a||(a=requestAnimationFrame(X))}return h(),{root:t,update(c){Object.assign(r,c),B()},resize(){h(),B()},destroy(){a&&cancelAnimationFrame(a),f.removeEventListener("change",m),k.disconnect(),e.remove()}}}function Bo(e){let t=e.trim().replace(/^#/,""),o=t.length===3?t.split("").map(n=>n+n).join(""):t;return/^[0-9a-f]{6}$/i.test(o)?{r:parseInt(o.slice(0,2),16),g:parseInt(o.slice(2,4),16),b:parseInt(o.slice(4,6),16)}:null}function Io({r:e,g:t,b:o}){let n=r=>Math.round(r).toString(16).padStart(2,"0");return`#${n(e)}${n(t)}${n(o)}`}function Oo({r:e,g:t,b:o}){return`rgb(${Math.round(e)} ${Math.round(t)} ${Math.round(o)})`}function be(e,t){return String(Number(e.toFixed(t)))}function Do({r:e,g:t,b:o}){let n=e/255,r=t/255,i=o/255,a=Math.max(n,r,i),s=Math.min(n,r,i),u=(a+s)/2,f=a-s,m=0,k=0;return f!==0&&(k=f/(1-Math.abs(2*u-1)),a===n?m=(r-i)/f%6:a===r?m=(i-n)/f+2:m=(n-r)/f+4,m*=60,m<0&&(m+=360)),`hsl(${be(m,1)} ${be(k*100,1)}% ${be(u*100,1)}%)`}function vt(e){let t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4}function Po(e){let t=vt(e.r),o=vt(e.g),n=vt(e.b),r=.4122214708*t+.5363325363*o+.0514459929*n,i=.2119034982*t+.6806995451*o+.1073969566*n,a=.0883024619*t+.2817188376*o+.6299787005*n,s=Math.cbrt(r),u=Math.cbrt(i),f=Math.cbrt(a),m=.2104542553*s+.793617785*u-.0040720468*f,k=1.9779984951*s-2.428592205*u+.4505937099*f,l=.0259040371*s+.7827717662*u-.808675766*f,h=Math.sqrt(k*k+l*l),y=Math.atan2(l,k)*180/Math.PI;return y<0&&(y+=360),h<1e-4?`oklch(${be(m,4)} 0 0)`:`oklch(${be(m,4)} ${be(h,4)} ${be(y,2)})`}function Cn(e){let t=Bo(e);return t?[{label:"hex",value:Io(t)},{label:"rgb",value:Oo(t)},{label:"hsl",value:Do(t)},{label:"oklch",value:Po(t)}]:[]}var zo=`
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
  background: ${ae};
  box-shadow: ${ge};
  display: none;
}
.picker[data-open] { display: block; }
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
  color: ${N.primary};
}
.picker button:hover { background: ${V(2)}; }
.picker button:focus-visible { outline: 1px solid ${N.primary}; outline-offset: -1px; }
.picker .k { color: ${N.secondary}; }
.picker .v { overflow-wrap: anywhere; }
.picker .hint {
  margin-top: 6px; padding-top: 6px;
  border-top: 1px solid ${de};
  color: ${N.secondary};
}
`;function Tn(e){let t=document.createElement("style");t.textContent=zo,e.appendChild(t);let o=document.createElement("div");o.className="picker",e.appendChild(o);let n=document.createElement("div");n.className="swatch";let r=document.createElement("div");r.className="hint";function i(a){n.style.background=a;let s=Cn(a).map(({label:u,value:f})=>{let m=document.createElement("button");m.type="button";let k=document.createElement("span");k.className="k",k.textContent=u;let l=document.createElement("span");return l.className="v",l.textContent=f,m.append(k,l),m.addEventListener("click",h=>{h.stopPropagation(),navigator.clipboard?.writeText(f).then(()=>{r.textContent=`copied ${u}`},()=>{r.textContent="clipboard refused"})}),m});r.textContent="click a row to copy",o.replaceChildren(n,...s,r),o.setAttribute("data-open","")}return{async open(){let a=window.EyeDropper;if(!a){o.replaceChildren(Object.assign(document.createElement("div"),{className:"hint",textContent:"this browser has no eyedropper"})),o.setAttribute("data-open","");return}try{let{sRGBHex:s}=await new a().open();i(s)}catch{}},close(){let a=o.hasAttribute("data-open");return o.removeAttribute("data-open"),a},destroy(){o.remove(),t.remove()}}}var kt="__align_freeze",Fo=`
[data-align-frozen] *:not([data-align-ignore]):not([data-align-ignore] *) {
  animation-play-state: paused !important;
}
`,St=!1,je=[],Ue=[];function Mn(e){let t=e;for(;t;){if(t instanceof Element&&t.hasAttribute("data-align-ignore"))return!0;let o=t.getRootNode();if(t=o instanceof ShadowRoot?o.host:t.parentNode??null,t===document)return!1}return!1}function Oe(){return St}function Ve(e){if(e!==St){if(St=e,!e){document.documentElement.removeAttribute("data-align-frozen"),document.getElementById(kt)?.remove();for(let t of je)try{t.play()}catch{}for(let t of Ue)t.play().catch(()=>{});je=[],Ue=[];return}if(!document.getElementById(kt)){let t=document.createElement("style");t.id=kt,t.textContent=Fo,t.setAttribute("data-align-ignore",""),document.head.appendChild(t)}document.documentElement.setAttribute("data-align-frozen",""),je=[];try{for(let t of document.getAnimations()){if(t.playState!=="running")continue;let o=t.effect?.target??null;Mn(o)||(t.pause(),je.push(t))}}catch{}Ue=[];for(let t of Array.from(document.querySelectorAll("video")))t.paused||Mn(t)||(t.pause(),Ue.push(t))}}var $t="__align_xray",Ho=`
[data-align-xray] * { outline: 1px solid rgb(128 128 128 / 0.55) !important; }
[data-align-xray] [data-align-ignore],
[data-align-xray] [data-align-ignore] * { outline: none !important; }
`;function qe(e){let t=document.documentElement;if(!e){t.removeAttribute("data-align-xray"),document.getElementById($t)?.remove();return}if(!document.getElementById($t)){let o=document.createElement("style");o.id=$t,o.textContent=Ho,o.setAttribute("data-align-ignore",""),document.head.appendChild(o)}t.setAttribute("data-align-xray","")}var Et="align-ui";function Rn(e){try{return localStorage.getItem(e)}catch{return null}}function Ln(e,t){try{localStorage.setItem(e,t)}catch{}}function An(e){let t="/";try{t=location.pathname||"/"}catch{}return`${Et}:${e}::${t}`}function Wo(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function Gn(){let e=Rn(An("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(Wo).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function Nn(e){Ln(An("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function Je(e){return Rn(`${Et}:${e}`)==="1"}function De(e,t){Ln(`${Et}:${e}`,t?"1":"0")}var U,R=null,K=null,fe=null,Le=null,ne=!1,Ce=Je("grid"),Te=Je("pixels"),O=null,$=[],Ze=0,oe=Je("rulers"),I=[],Hn=1,Bn=!1,ce=null,Mt=kn();function Xo(){return I.map(e=>({...e}))}function Me(e=""){Mt.push(Xo(),e)}function In(){return I.find(e=>e.id===ce)??null}function he(e){I=e,Nn(I)}var H=null,te=null,Z=null,Yo=3,Ee=22;function Wn(e,t){return oe?t<Ee&&e>=Ee?"y":e<Ee&&t>=Ee?"x":null:null}function Rt(e){return e.ctrlKey||e.metaKey}function Xn(e,t,o,n){let r=me(t,o,U),i=e.axis==="x"?t:o,a=I.filter(u=>u.id!==e.id).map(u=>({axis:u.axis,at:Pe(u).pos})),s=cn(i,un(r,e.axis,a),n);e.at=s.at+(e.axis==="x"?scrollX:scrollY),e.caught=s.what}function Yn(e,t,o,n){let r={id:Hn++,axis:e,at:0,locked:!1,caught:"",pinned:!1};return Me(),Xn(r,t,o,n),he([...I,r]),ce=r.id,r}function Kn(e){e.pinned||(Me(),he(I.filter(t=>t.id!==e.id)),te?.id===e.id&&(te=null),H?.id===e.id&&(H=null))}function Ko(e){let t=U.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function Pe(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function Lt(){return $.length>=2?$[$.length-2]:void 0}function At(){if($.length<2)return[];let e=[];for(let[t,o]of at($))for(let n of Ye(t,o)){if(n.extension||!n.label)continue;let r=jt(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:Ut(r)})}return e}function F(e){let t=$[$.length-1],o=O&&$.some(l=>l.el===O.el),n=I.map(Pe),r=!H&&te?te:null,i=I.filter(l=>l.locked||l.id===r?.id),a=!r&&o?O.el:null,s=r??a,u=r?Pe(r):null,f=[],m=(l,h)=>{for(let y of l)f.push(s&&!h?{...y,faded:!0}:y)},k=l=>!u||l.axis!==u.axis?!1:(l.axis==="x"?[l.x1,l.x2]:[l.y1,l.y2]).some(y=>Math.abs(y-u.pos)<.5);for(let[l,h]of at($))m(Ye(l,h),l.el===a||h.el===a);t&&O&&!o&&!r&&m(Ye(t,O),!0);for(let l of i)for(let h of $)m(lt(h,[Pe(l)]),l.id===r?.id||h.el===a);O&&!o&&!r&&I.length&&m(lt(O,n),!0);for(let l of dn(i.map(Pe),{x:innerWidth/2,y:innerHeight/2}))m([l],k(l));R?.update({hover:O,pinned:$,rulers:oe,grid:Ce&&U.grid?U.grid:null,pixels:Te,guides:I,liveGuide:H??te,activeGuide:ce,lines:f,...e?{cursor:e}:{}}),fe?.update($.length,{rulers:oe,xray:ne,grid:Ce,pixels:Te,freeze:Oe(),type:K?.showsType()??!1,panel:K?.isOpen()??!1})}function _n(){let e=K?.asText()??"";e&&navigator.clipboard?.writeText(e).catch(()=>{})}function jn(){let e=Mt.pop();e&&(he(e),te=null,H=null,Z=null,e.some(t=>t.id===ce)||(ce=null))}function Ct(e){switch(e){case"rulers":oe=!oe,De("rulers",oe);break;case"xray":ne=!ne,qe(ne);break;case"grid":Ce=!Ce,De("grid",Ce);break;case"pixels":Te=!Te,De("pixels",Te);break;case"freeze":Ve(!Oe());break;case"type":K?.toggleType();break;case"panel":K?.toggle();break;case"copy":_n();break;case"pick":Le?.open();break;case"undo":jn();break}F()}var Qe=null;function Un(e){if(Qe={x:e.clientX,y:e.clientY},H){Z&&Math.hypot(e.clientX-Z.x,e.clientY-Z.y)>Yo&&(Z=null),!Z&&!H.pinned&&(Xn(H,e.clientX,e.clientY,Rt(e)),he([...I])),F({x:e.clientX,y:e.clientY});return}te=st(I,e.clientX,e.clientY),O=me(e.clientX,e.clientY,U),F({x:e.clientX,y:e.clientY})}function Vn(e){H&&(Z?(H.locked=!H.locked,ce=H.id,he([...I])):(Wn(e.clientX,e.clientY)||e.clientX<Ee||e.clientY<Ee)&&Kn(H),Z=null,H=null,F({x:e.clientX,y:e.clientY}))}function qn(e){if(e.button!==0)return;let t=me(e.clientX,e.clientY,U);if(!t)return;let o=Wn(e.clientX,e.clientY);if(o){Re(e),Z=null,H=Yn(o,e.clientX,e.clientY,Rt(e)),F({x:e.clientX,y:e.clientY});return}let n=st(I,e.clientX,e.clientY);if(n){Re(e),Me(),ce=n.id,H=n,Z={x:e.clientX,y:e.clientY},F({x:e.clientX,y:e.clientY});return}Re(e),fe?.closeHelp(),$=[t],O=t,K?.show(t,At(),Lt()),F({x:e.clientX,y:e.clientY})}function Jn(e){let t=me(e.clientX,e.clientY,U);if(!t)return;Re(e),fe?.closeHelp();let o=$.findIndex(r=>r.el===t.el);$=o>=0?$.filter((r,i)=>i!==o):[...$,t],O=t;let n=$[$.length-1];n?K?.show(n,At(),Lt()):K?.hide(),F({x:e.clientX,y:e.clientY})}function Qn(e){me(e.clientX,e.clientY,U)&&Re(e)}function Zn(e){me(e.clientX,e.clientY,U)&&Re(e)}function Re(e){e.preventDefault(),e.stopPropagation()}function On(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var Dn=0,Pn=0;function eo(){Ze=requestAnimationFrame(eo);let t=$.filter(s=>s.el.isConnected).map(s=>Xe(s.el)),o=O&&O.el.isConnected?Xe(O.el):null;if(!(scrollX!==Dn||scrollY!==Pn||t.length!==$.length||t.some((s,u)=>!On(s,$[u]))||O===null!=(o===null)||O!==null&&o!==null&&!On(O,o)))return;Dn=scrollX,Pn=scrollY,$=t,O=o;let i=$[$.length-1],a=_o();a!==zn&&(zn=a,i?K?.show(i,At(),Lt()):K?.hide()),F()}var zn="";function _o(){let e=$[0];return e?$.map(t=>[t.label,Math.round(t.width*100),Math.round(t.height*100),Math.round((t.left-e.left)*100),Math.round((t.top-e.top)*100)].join(",")).join(";"):""}function to(){R?.resize()}function jo(){Bn||(Bn=!0,I=Gn().map(e=>({...e,id:Hn++}))),!R&&(yn(),R=En(),K=vn(R.root),fe=Sn(R.root,Ct),Le=Tn(R.root),fe.update(0,{rulers:oe,xray:ne,grid:Ce,pixels:Te,freeze:Oe(),type:!1,panel:!1}),addEventListener("mousemove",Un),addEventListener("mousedown",qn,{capture:!0}),addEventListener("mouseup",Vn,{capture:!0}),addEventListener("click",Qn,{capture:!0}),addEventListener("auxclick",Zn,{capture:!0}),addEventListener("contextmenu",Jn,{capture:!0}),addEventListener("resize",to),Ze=requestAnimationFrame(eo),F())}function Tt(){removeEventListener("mousemove",Un),removeEventListener("mousedown",qn,{capture:!0}),removeEventListener("mouseup",Vn,{capture:!0}),removeEventListener("click",Qn,{capture:!0}),removeEventListener("auxclick",Zn,{capture:!0}),removeEventListener("contextmenu",Jn,{capture:!0}),removeEventListener("resize",to),cancelAnimationFrame(Ze),Ze=0,fe?.destroy(),Le?.destroy(),Le=null,ne&&(ne=!1,qe(!1)),Ve(!1),fe=null,K?.destroy(),K=null,R?.destroy(),R=null,bn(),O=null,$=[],H=null,Z=null,te=null}function Fn(e){if(Ko(e))e.preventDefault(),R?Tt():jo();else if(R&&Qe&&(e.key.toLowerCase()===U.guideKeys.vertical||e.key.toLowerCase()===U.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===U.guideKeys.vertical?"x":"y";Yn(t,Qe.x,Qe.y,Rt(e)),F()}else if(R&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(Me(),he(I.filter(t=>t.pinned)),te=null,H=null,Z=null,I.some(t=>t.id===ce)||(ce=null)):te&&Kn(te),F();else if(R&&e.key.startsWith("Arrow")){let t=In(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;Me(`nudge:${t.id}`);let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",he([...I]),F()}else if(R&&e.key.toLowerCase()==="g"){e.preventDefault(),Ct("grid");return}else if(R&&e.key.toLowerCase()==="k"){e.preventDefault(),Ct("pixels");return}else if(R&&e.key.toLowerCase()==="f")e.preventDefault(),Ve(!Oe()),F();else if(R&&e.key.toLowerCase()==="x")e.preventDefault(),ne=!ne,qe(ne);else if(R&&e.key.toLowerCase()==="p")e.preventDefault(),Le?.open();else if(R&&e.key.toLowerCase()==="t")e.preventDefault(),K?.toggleType();else if(R&&e.key.toLowerCase()==="c")e.preventDefault(),_n();else if(R&&e.key.toLowerCase()==="l"){let t=In();if(!t)return;e.preventDefault(),Me(),t.pinned=!t.pinned,he([...I]),F()}else if(R&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){if(Mt.depth()===0)return;e.preventDefault(),jn(),F()}else if(R&&e.key.toLowerCase()===U.rulerKey)e.preventDefault(),oe=!oe,De("rulers",oe),F();else if(R&&e.key.toLowerCase()===U.panelKey)e.preventDefault(),K?.toggle();else if(e.key==="Escape"&&R){if(Le?.close()||fe?.closeHelp())return;$.length?($=[],K?.hide(),F()):Tt()}}function Lr(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,U=rn(e),addEventListener("keydown",Fn,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{Tt(),removeEventListener("keydown",Fn,{capture:!0}),delete window.__align})}export{Lr as initAlign};
