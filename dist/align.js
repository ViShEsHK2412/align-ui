function W(e){let t=parseFloat(e);return Number.isFinite(t)?t:NaN}function Zn(e){return(e.split(",")[0]??"").trim().replace(/^['"]|['"]$/g,"")}function eo(e){let o={100:"thin",200:"extralight",300:"light",400:"regular",500:"medium",600:"semibold",700:"bold",800:"extrabold",900:"black"}[e.trim()];return o?`${e} ${o}`:e}function Oe(e){let t=getComputedStyle(e);return[{label:"family",value:Zn(t.fontFamily),px:NaN},{label:"size",value:t.fontSize,px:W(t.fontSize)},{label:"weight",value:eo(t.fontWeight),px:NaN},{label:"line",value:t.lineHeight,px:W(t.lineHeight)},{label:"tracking",value:t.letterSpacing,px:W(t.letterSpacing)}]}function zt(e){let t="";for(let o of e.childNodes)o.nodeType===3&&(t+=o.nodeValue??"");return t.trim().replace(/\s+/g," ")}function Wt(e){let t=getComputedStyle(e),o=[];for(let n of Array.from(t)){if(!n.startsWith("--"))continue;let r=t.getPropertyValue(n).trim();o.push({name:n,value:r,px:W(r)})}return o}function to(e,t){return Number.isFinite(e)?t.filter(o=>o.value.endsWith("px")&&Math.abs(o.px-e)<.01).map(o=>o.name).sort():[]}function no(e){let t=new Set,o=[];for(let n of e)!Number.isFinite(n)||n===0||t.has(n)||(t.add(n),o.push(n));return o}function Xt(e,t){return t.length===0?"":no(e).map(o=>{let n=to(o,t);return n.length?`${o} ${n.join(" ")}`:`${o} \u2014`}).join("  \xB7  ")}function Bt(e){let t=getComputedStyle(e);return[t.marginTop,t.marginRight,t.marginBottom,t.marginLeft].map(W)}function Yt(e,t,o,n){let r=e.parentElement,i=r!==null&&t.parentElement===r;if(!r||!i)return{px:o,cssGap:null,margins:0,siblings:!1};let a=getComputedStyle(r),s=a.display.includes("flex")||a.display.includes("grid"),c=n==="x"?a.columnGap:a.rowGap,f=s&&c!=="normal"?W(c):null,[g,k,l,h]=Bt(e),[y,d,E,M]=Bt(t),b=F=>Number.isFinite(F)?F:0,I=n==="x"?e.getBoundingClientRect().left<t.getBoundingClientRect().left:e.getBoundingClientRect().top<t.getBoundingClientRect().top,Y=n==="x"?I?b(k)+b(M):b(d)+b(h):I?b(l)+b(y):b(E)+b(g);return{px:o,cssGap:f,margins:Y,siblings:!0}}function Kt(e){if(!e.siblings)return"not siblings";let t=[];e.cssGap!==null&&t.push(`gap ${e.cssGap}`),(e.margins!==0||e.cssGap===null)&&t.push(`margins ${e.margins}`);let o=(e.cssGap??0)+e.margins;return Math.abs(o-e.px)>.5&&t.push("rest from layout"),t.join(" \xB7 ")}function _t(e){let t=new Map;for(let o of e)t.set(o,(t.get(o)??0)+1);return t.size<2?"":[...t.entries()].sort((o,n)=>n[1]-o[1]||o[0]-n[0]).map(([o,n])=>`${o} \xD7${n}`).join(" \xB7 ")}function Ze(e){let t=e.trim().toLowerCase();return t?t.startsWith("#")||/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(t)?!0:["black","white","transparent","currentcolor"].includes(t):!1}var ie;function It(e){if(ie===void 0&&(ie=document.createElement("canvas").getContext("2d")),!ie)return"";ie.fillStyle="#000000",ie.fillStyle=e;let t=ie.fillStyle;return ie.fillStyle="#ffffff",ie.fillStyle=e,t===ie.fillStyle?String(t):""}function jt(e,t){let o=It(e);return o?t.filter(n=>Ze(n.value)&&It(n.value)===o).map(n=>n.name).sort():[]}function Ut(e){let t=getComputedStyle(e),o=[],n=(r,i)=>{let a=i.trim();!a||a==="transparent"||/rgba?\([^)]*,\s*0\s*\)$/.test(a)||o.push({label:r,value:a})};return n("text",t.color),n("background",t.backgroundColor),o}function oo(e,t,o){let n=r=>typeof CSS<"u"&&CSS.escape?CSS.escape(r):r.replace(/[^\w-]/g,"\\$&");return t?`#${n(t)}`:o.length?e+o.map(r=>`.${n(r)}`).join(""):e}function et(e){let t=typeof e.className=="string"?e.className.trim().split(/\s+/).filter(Boolean):[];return oo(e.tagName.toLowerCase(),e.id,t)}function Vt(e){let t=et(e);if(!/[.#]/.test(t))return 0;try{return document.querySelectorAll(t).length}catch{return 0}}function ro(e){if(!e)return"inline <style>";let t=e.split("?")[0]??e;try{let o=new URL(t,"http://x").pathname;return decodeURI(o).replace(/^\//,"")||t}catch{return t}}var io=["width","height","padding","margin","border-width","gap","font-size","line-height","letter-spacing","color","background-color"];function ao(e){for(let t=0;t<e.length;t+=1){let o=e.item(t);if(io.some(n=>o===n||o.startsWith(`${n}-`)))return!0}return!1}function qt(e){let t=[],o=new Set,n=(r,i)=>{for(let a of Array.from(r)){if(a instanceof CSSMediaRule){matchMedia(a.conditionText).matches&&n(a.cssRules,i);continue}if(a instanceof CSSSupportsRule){CSS.supports(a.conditionText)&&n(a.cssRules,i);continue}let s=a.cssRules;if(s&&!(a instanceof CSSStyleRule)){n(s,i);continue}if(!(a instanceof CSSStyleRule))continue;let c=!1;try{c=e.matches(a.selectorText)}catch{continue}if(!c||!ao(a.style))continue;let f=`${a.selectorText}|${i}`;o.has(f)||(o.add(f),t.push({selector:a.selectorText,file:i}))}};for(let r of Array.from(document.styleSheets)){if(r.ownerNode instanceof Element&&r.ownerNode.hasAttribute("data-align-ignore"))continue;let i;try{i=r.cssRules}catch{continue}n(i,ro(r.href))}return t.reverse()}function Dt(e){if(!e||e==="none")return[];let t=e.trim().split(/\s+/),o=[];for(let n of t){if(!n.endsWith("px"))return[];let r=Number.parseFloat(n);if(!Number.isFinite(r))return[];o.push(r)}return o}function Ot(e,t,o){let n=0;for(let r=0;r<e.length;r+=1){let i=n+e[r];if(o<i+.5)return r;n=i+t}return-1}function so(e,t){let o=t==="rtl";return e.startsWith("vertical")||e.startsWith("sideways")?{inline:"y",inlineReversed:e==="sideways-lr"?!o:o,blockReversed:e==="vertical-rl"||e==="sideways-rl"}:{inline:"x",inlineReversed:o,blockReversed:!1}}function Pt(e,t,o,n,r){return r?t-n:o-e}function Jt(e){let t=e.parentElement,o=0;for(;t&&getComputedStyle(t).display==="contents";)t=t.parentElement,o+=1;if(!t)return null;let n=getComputedStyle(t),r=getComputedStyle(e),i=n.display,a=[];if(o>0&&a.push({label:"through",value:o===1?"a display: contents parent":`${o} display: contents parents`}),r.position==="absolute"||r.position==="fixed")return a.push({label:"placed by",value:`${r.position}, not by the parent`}),{display:i,rows:a};if(r.float!=="none")return a.push({label:"placed by",value:`float: ${r.float}`}),{display:i,rows:a};let s=i.includes("flex"),c=i.includes("grid");if(!s&&!c)return a.push({label:"flow",value:i}),{display:i,rows:a};let f=Ht(n.rowGap==="normal"?"0px":n.rowGap),g=Ht(n.columnGap==="normal"?"0px":n.columnGap),k=f===g?f:`row ${f} \xB7 column ${g}`;if(s){let _=n.flexDirection;a.push({label:"direction",value:n.flexWrap==="nowrap"?_:`${_} \xB7 ${n.flexWrap}`}),a.push({label:"justify",value:n.justifyContent}),a.push({label:"align",value:n.alignItems}),a.push({label:"gap",value:k});let u=`${r.flexGrow} ${r.flexShrink} ${r.flexBasis}`;return u!=="0 1 auto"&&a.push({label:"this child",value:`flex: ${u}`}),r.alignSelf!=="auto"&&a.push({label:"align-self",value:r.alignSelf}),{display:i,rows:a}}let l=Dt(n.gridTemplateColumns),h=Dt(n.gridTemplateRows);l.length&&a.push({label:"columns",value:`${l.length} \xB7 ${l.map(Qe).join(" ")}`}),h.length&&a.push({label:"rows",value:`${h.length} \xB7 ${h.map(Qe).join(" ")}`}),a.push({label:"gap",value:k});let y=t.getBoundingClientRect(),d=e.getBoundingClientRect(),E={left:y.left+W(n.borderLeftWidth)+W(n.paddingLeft),right:y.right-W(n.borderRightWidth)-W(n.paddingRight),top:y.top+W(n.borderTopWidth)+W(n.paddingTop),bottom:y.bottom-W(n.borderBottomWidth)-W(n.paddingBottom)},M=so(n.writingMode,n.direction),b=(_,u)=>_==="x"?Pt(E.left,E.right,d.left,d.right,u):Pt(E.top,E.bottom,d.top,d.bottom,u),I=M.inline==="x"?"y":"x",Y=W(n.columnGap==="normal"?"0":n.columnGap),F=W(n.rowGap==="normal"?"0":n.rowGap),V=Ot(l,Y,b(M.inline,M.inlineReversed)),K=Ot(h,F,b(I,M.blockReversed)),z=[];return V>=0&&z.push(`column ${V+1} of ${l.length}`),K>=0&&z.push(`row ${K+1} of ${h.length}`),z.length&&a.push({label:"this child",value:z.join(" \xB7 ")}),{display:i,rows:a}}function Ht(e){return e.endsWith("px")?Qe(Number.parseFloat(e)):e}function Qe(e){return String(Math.round(e*100)/100)}var Qt=["display","position","width","height","padding","margin","border-width","border-style","border-radius","font-family","font-size","font-weight","font-style","line-height","letter-spacing","text-transform","text-align","color","background-color","border-color","opacity","flex-direction","justify-content","align-items","gap","flex-grow","flex-shrink","flex-basis","align-self","box-shadow","overflow","text-overflow","white-space"];function lo(e,t){let o=[];for(let n of Qt){let r=e[n]??"",i=t[n]??"";r!==i&&o.push({prop:n,a:r,b:i})}return o}function Ft(e){let t=getComputedStyle(e),o={};for(let n of Qt)o[n]=t.getPropertyValue(n);return o}function Zt(e,t){return lo(Ft(e),Ft(t))}var co={ignore:"",grid:null,hotkey:"mod+shift+a",panelKey:"b",rulerKey:"r",guideKeys:{vertical:"v",horizontal:"h"}};function tn(e={}){return{...co,...e}}var en=["script","style","link","meta","head","title","noscript","nextjs-portal","[data-nextjs-toast]","[data-nextjs-dialog-overlay]","#webpack-dev-server-client-overlay","vite-error-overlay","[data-align-ignore]"].join(", ");function nn(e){return e.ignore?`${en}, ${e.ignore}`:en}function C(e){return String(Math.round(e*100)/100)}function uo(e){let t=e.tagName.toLowerCase();e.id&&(t+=`#${e.id}`);let o=e.classList[0];return o&&(t+=`.${o}`),t.length>32?t.slice(0,31)+"\u2026":t}function Fe(e){let t=e.getBoundingClientRect();return{el:e,label:uo(e),left:t.left,right:t.right,top:t.top,bottom:t.bottom,width:t.width,height:t.height,scale:We(e)}}function on(e,t){let o=(n,r)=>Math.abs(n-r)<.001;return o(e.scale.x,t.scale.x)&&o(e.scale.y,t.scale.y)?e.scale:{x:1,y:1}}function rn(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function me(e,t,o){let n=nn(o),r=document.elementFromPoint(e,t);for(;r?.shadowRoot;){let i=r.shadowRoot.elementFromPoint(e,t);if(!i||i===r)break;r=i}for(;r&&r.matches(n);)r=rn(r);return r&&r!==document.documentElement?Fe(r):null}var Pe=e=>parseFloat(e)||0;function tt(e){let t=getComputedStyle(e),o=(n,r,i,a)=>[Pe(n),Pe(r),Pe(i),Pe(a)];return{padding:o(t.paddingTop,t.paddingRight,t.paddingBottom,t.paddingLeft),border:o(t.borderTopWidth,t.borderRightWidth,t.borderBottomWidth,t.borderLeftWidth),margin:o(t.marginTop,t.marginRight,t.marginBottom,t.marginLeft)}}function po(e,t){return e.width*e.height>=t.width*t.height?[e,t]:[t,e]}function ho(e,t){let o=on(e,t),n=t.left+t.width/2,r=t.top+t.height/2;return[{x1:e.left,y1:r,x2:t.left,y2:r,label:C((t.left-e.left)/o.x),axis:"x"},{x1:t.right,y1:r,x2:e.right,y2:r,label:C((e.right-t.right)/o.x),axis:"x"},{x1:n,y1:e.top,x2:n,y2:t.top,label:C((t.top-e.top)/o.y),axis:"y"},{x1:n,y1:t.bottom,x2:n,y2:e.bottom,label:C((e.bottom-t.bottom)/o.y),axis:"y"}]}function He(e,t,o,n,r){let i=n<t?t:n>o?o:null;return i===null?[]:[r==="x"?{x1:e,y1:i,x2:e,y2:n,label:"",axis:"y",extension:!0}:{x1:i,y1:e,x2:n,y2:e,label:"",axis:"x",extension:!0}]}function ze(e,t){let o=[],n=on(e,t),r=e.left<t.right&&t.left<e.right,i=e.top<t.bottom&&t.top<e.bottom;if(r&&i){let[a,s]=po(e,t);return ho(a,s)}if(!r){let[a,s]=e.right<=t.left?[e,t]:[t,e],c=i?(Math.max(e.top,t.top)+Math.min(e.bottom,t.bottom))/2:(e.top+e.height/2+t.top+t.height/2)/2;o.push({x1:a.right,y1:c,x2:s.left,y2:c,label:`${C((s.left-a.right)/n.x)}`,axis:"x"}),o.push(...He(a.right,a.top,a.bottom,c,"x")),o.push(...He(s.left,s.top,s.bottom,c,"x"))}if(!i){let[a,s]=e.bottom<=t.top?[e,t]:[t,e],c=r?(Math.max(e.left,t.left)+Math.min(e.right,t.right))/2:(e.left+e.width/2+t.left+t.width/2)/2;o.push({x1:c,y1:a.bottom,x2:c,y2:s.top,label:`${C((s.top-a.bottom)/n.y)}`,axis:"y"}),o.push(...He(a.bottom,a.left,a.right,c,"y")),o.push(...He(s.top,s.left,s.right,c,"y"))}return o}function mo(e){if(e.length<2)return[...e];let t=n=>{let r=e.map(n);return Math.max(...r)-Math.min(...r)},o=t(n=>n.left+n.width/2)>=t(n=>n.top+n.height/2);return[...e].sort((n,r)=>o?n.left-r.left:n.top-r.top)}function nt(e){let t=mo(e),o=[];for(let n=1;n<t.length;n++)o.push([t[n-1],t[n]]);return o}var fo=5,go=8;function Re(e){return e.axis==="x"?e.at-scrollX:e.at-scrollY}function ot(e,t,o){let n=null,r=fo;for(let i of e){let a=Math.abs(Re(i)-(i.axis==="x"?t:o));a<=r&&(n=i,r=a)}return n}function an(e,t,o){if(o)return{at:e,what:""};let n=null,r=go;for(let i of t){let a=Math.abs(i.at-e);a>r||(a<r-.001||n!==null&&i.rank<n.rank)&&(n=i,r=a)}return n?{at:n.at,what:n.what}:{at:e,what:""}}function sn(e,t,o=[]){let n=[];if(e){let r=t==="x"?e.left:e.top,i=t==="x"?e.right:e.bottom;n.push({at:r,what:`${e.label} ${t==="x"?"left":"top"}`,rank:0}),n.push({at:i,what:`${e.label} ${t==="x"?"right":"bottom"}`,rank:0}),n.push({at:(r+i)/2,what:`${e.label} centre`,rank:1})}for(let r of o)r.axis===t&&n.push({at:r.at,what:"guide",rank:2});return n}function rt(e,t){let o=[];for(let n of["x","y"]){let r=t.filter(i=>i.axis===n).map(i=>({pos:i.pos,gap:n==="x"?i.pos<e.left?e.left-i.pos:i.pos>e.right?i.pos-e.right:-1:i.pos<e.top?e.top-i.pos:i.pos>e.bottom?i.pos-e.bottom:-1})).filter(i=>i.gap>=0).sort((i,a)=>i.gap-a.gap)[0];if(r)if(n==="x"){let i=e.top+e.height/2,a=r.pos<e.left?r.pos:e.right,s=r.pos<e.left?e.left:r.pos;o.push({x1:a,y1:i,x2:s,y2:i,label:C(r.gap),axis:"x"})}else{let i=e.left+e.width/2,a=r.pos<e.top?r.pos:e.bottom,s=r.pos<e.top?e.top:r.pos;o.push({x1:i,y1:a,x2:i,y2:s,label:C(r.gap),axis:"y"})}}return o}function ln(e,t){let o=[];for(let n of["x","y"]){let r=e.filter(i=>i.axis===n).map(i=>i.pos).sort((i,a)=>i-a);for(let i=1;i<r.length;i++){let a=r[i-1],s=r[i],c=s-a;c<.01||(n==="x"?o.push({x1:a,y1:t.y,x2:s,y2:t.y,label:C(c),axis:"x"}):o.push({x1:t.x,y1:a,x2:t.x,y2:s,label:C(c),axis:"y"}))}}return o}var ce=3;function xo(e,t){return e.x<t.x+t.w+ce&&t.x<e.x+e.w+ce&&e.y<t.y+t.h+ce&&t.y<e.y+e.h+ce}function cn(e,t,o=12){let n=(a,s)=>Math.min(Math.max(a,o),t.w-s-o),r=(a,s)=>Math.min(Math.max(a,o),t.h-s-o),i=[];for(let a of e){let s={...a,x:n(a.x,a.w),y:r(a.y,a.h)},c=!1;for(let f=0;f<16;f++){let g=i.find(l=>xo(l,s));if(!g)break;let k=s.axis==="x"?s.y:s.x;if(s.axis==="x"?s.y=r(c?g.y+g.h+ce:g.y-s.h-ce,s.h):s.x=n(c?g.x-s.w-ce:g.x+g.w+ce,s.w),(s.axis==="x"?s.y:s.x)===k){if(c)break;c=!0}}i.push(s)}return i}function un(e,t){let{columns:o,gutter:n,margin:r}=e;if(o<=0)return[];let i=e.maxWidth>0?Math.min(e.maxWidth,t):t,a=Math.max(0,(t-i)/2),c=(Math.max(0,i-r*2)-n*(o-1))/o;if(c<=0)return[];let f=[];for(let g=0;g<o;g+=1)f.push({left:a+r+g*(c+n),width:c});return f}function dn(e,t){return e*t>=8?e:0}function yo(e){let t=/matrix(3d)?\(([^)]+)\)/.exec(e||"");if(!t)return{x:1,y:1};let o=t[2].split(",").map(s=>parseFloat(s)),[n,r,i,a]=t[1]?[o[0],o[1],o[4],o[5]]:[o[0],o[1],o[2],o[3]];return{x:Math.hypot(n??1,r??0)||1,y:Math.hypot(i??0,a??1)||1}}function We(e){let t=1,o=1;for(let n=e;n;n=rn(n)){let r=yo(getComputedStyle(n).transform);t*=r.x,o*=r.y}return{x:t,y:o}}var ee=(e,t)=>({light:e,dark:t}),it={accent:ee("oklch(0.693 0.161 265.2)","oklch(0.693 0.161 265.2)"),measure:ee("oklch(0.637 0.208 25.3)","oklch(0.711 0.166 22.2)"),surface:ee("oklch(1 0 0)","oklch(0.264 0 0)"),fg:ee("oklch(0.205 0 0)","oklch(0.97 0 0)"),muted:ee("oklch(0.556 0 0)","oklch(0.715 0 0)"),guide:ee("oklch(0.62 0.13 195)","oklch(0.75 0.13 195)"),rulerBg:ee("oklch(1 0 0 / 0.92)","oklch(0.235 0 0 / 0.92)"),rulerLine:ee("oklch(0.205 0 0 / 0.28)","oklch(0.97 0 0 / 0.28)"),pixelLine:ee("oklch(0.205 0 0 / 0.14)","oklch(0.97 0 0 / 0.14)")};function hn(e){return`light-dark(${e.light}, ${e.dark})`}var ae=hn(ee("#fafafa","#1a1a1a"));function Le(e){return hn(ee(`rgb(0 0 0 / ${e})`,`rgb(255 255 255 / ${e})`))}var pn=[0,.07,.08,.1,.12,.15,.2];function q(e){let t=pn[Math.max(0,Math.min(pn.length-1,e))];return t===0?ae:Le(t)}var N={primary:Le(.9),secondary:Le(.6),tertiary:Le(.4)},ue=Le(.12),fe="0 2px 8px rgb(0 0 0 / 0.2), 0 4px 16px rgb(0 0 0 / 0.1)",mn="0 4px 12px rgb(0 0 0 / 0.24), 0 12px 32px rgb(0 0 0 / 0.16)",v=22,st=36;var bo='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',T={title:13,body:12,tag:11,stack:bo},O={regular:400,medium:500,semibold:600},at="__align_font",wo="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";function fn(){if(document.getElementById(at))return;let e=document.createElement("link");e.id=at,e.rel="stylesheet",e.href=wo,e.setAttribute("data-align-ignore",""),document.head.appendChild(e)}function gn(){document.getElementById(at)?.remove()}function xn(e){let t=[`${O.medium} ${T.body}px Inter`];Promise.all(t.map(o=>document.fonts.load(o))).then(e,e)}function lt(e){let t={};for(let o of Object.keys(it))t[o]=e?it[o].dark:it[o].light;return t}function ct(){let e=document.documentElement,t=getComputedStyle(e).colorScheme;if(/dark/.test(t)&&!/light/.test(t))return!0;if(/light/.test(t)&&!/dark/.test(t))return!1;for(let o of[document.body,e]){if(!o)continue;let n=vo(getComputedStyle(o).backgroundColor);if(n!==null)return n<.5}return matchMedia("(prefers-color-scheme: dark)").matches}function vo(e){let t=/^rgba?\(([^)]+)\)$/.exec(e.trim());if(!t)return null;let o=t[1].split(/[\s,/]+/).filter(Boolean).map(Number),[n,r,i,a=1]=o;return n===void 0||r===void 0||i===void 0||a<.5?null:(.2126*n+.7152*r+.0722*i)/255}function we(e,t){return e.replace(/\)$/,` / ${t})`)}var ko=`
`,se=16,So=`
.dock {
  /* No color-scheme here: the overlay sets it inline on the shadow host, from
     what the page actually looks like rather than what the machine prefers, and
     it inherits down. Declaring 'light dark' again would undo that and hand
     light-dark() back to the media query. */
  position: fixed; left: ${se}px; top: 0; width: 340px;
  /* An opacity:0 element still receives pointer events, and a closed panel
     parked over the page would silently swallow every hit test underneath. */
  pointer-events: none; user-select: none;
  font-family: ${T.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --fg: ${N.primary};
  --muted: ${N.secondary};
  --border: ${ue};
}
.panel {
  padding: 10px; border-radius: 0;
  /* Five sections now \u2014 box, tokens, styled by, matches, colour \u2014 and on a
     laptop that is taller than the window. place() clamps the position but
     cannot rescue a panel taller than the screen, so it scrolls instead. */
  max-height: calc(100vh - ${se*2}px);
  overflow-y: auto; overscroll-behavior: contain;
  font-size: ${T.body}px; line-height: 1.4;
  color: var(--fg);
  background: ${ae};

  box-shadow: ${fe};

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
  background: ${ae};
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 8px; margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  cursor: grab;
}
.dock[data-dragging] .panel { box-shadow: ${mn}; }
.dock[data-dragging] header { cursor: grabbing; }
header .name {
  flex: 1; min-width: 0;
  font-size: ${T.title}px; font-weight: ${O.semibold};
  line-height: 1.2;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
header .size {
  font-size: ${T.body}px; font-weight: ${O.medium};
  color: var(--muted);
}
/* Only present when the element sits under a transform, so the panel never
   claims a space it is not in. */
header .scale {
  font-size: ${T.tag}px; font-weight: ${O.medium};
  margin-left: 4px;
  color: ${N.primary};
}
/* Padded well past its glyph so it is comfortably clickable, and outside the
   header's drag gesture. */
.close {
  flex: none; margin: -6px -4px -6px 0; padding: 6px 8px;
  border: 0; background: none; cursor: pointer;
  font: inherit; font-size: ${T.body}px; line-height: 1;
  color: var(--muted);
}
.close:hover { color: var(--fg); background: ${q(1)}; }

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
  font-size: ${T.tag}px; font-weight: ${O.medium};
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
/* One grid for the whole section rather than one per row, so every key in a
   section shares a column and the column sizes to the longest key in it. A
   fixed 62px was right until a diff started printing 'background-color', which
   it broke across two lines mid-word. The 62px floor keeps the rhythm the
   other sections already had. */
.readout-rows {
  display: grid; grid-template-columns: minmax(62px, max-content) 1fr;
  gap: 0 8px; align-items: baseline;
  font-size: ${T.tag}px; line-height: 1.5;
}
.readout-row { display: contents; }
.readout-key { color: var(--muted); white-space: nowrap; }
.readout-value { color: var(--fg); overflow-wrap: anywhere; }
.content {
  border-radius: 0; padding: 14px 8px;
  text-align: center; font-weight: ${O.medium}; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--fg);
}
`,Ae=se,ge=-1,ve=!1;function yn(e){let t=document.createElement("style");t.textContent=So,e.appendChild(t);let o=document.createElement("div");o.className="dock";let n=document.createElement("div");n.className="panel",o.appendChild(n);let r=!1;function i(d,E){let M=document.createElement("div");M.className="readout";let b=document.createElement("div");b.className="tag readout-tag",b.textContent=d,M.appendChild(b);let I=document.createElement("div");I.className="readout-rows",M.appendChild(I);for(let[Y,F]of E){let V=document.createElement("div");V.className="readout-row";let K=document.createElement("span");K.className="readout-key",K.textContent=Y;let z=document.createElement("span");z.className="readout-value",z.textContent=F,V.append(K,z),I.appendChild(V)}return M}e.appendChild(o);let a=(d,E)=>Math.min(Math.max(d,se),Math.max(se,E-se));function s(){let d=o.offsetHeight||300;ge<0&&(ge=Math.max(se,innerHeight-d-se)),Ae=a(Ae,innerWidth-o.offsetWidth),ge=a(ge,innerHeight-d),o.style.transform=`translate(${Ae-se}px, ${ge}px)`}let c=null;function f(d){d.button===0&&(d.preventDefault(),d.stopPropagation(),c={x:d.clientX,y:d.clientY,dx:Ae,dy:ge},o.setAttribute("data-dragging",""),d.currentTarget.setPointerCapture(d.pointerId))}function g(d){c&&(Ae=c.dx+(d.clientX-c.x),ge=c.dy+(d.clientY-c.y),s())}function k(){c=null,o.removeAttribute("data-dragging")}addEventListener("resize",s);let l=null;function h(d){let E=document.createElement("div");return E.className="edge",E.textContent=d===0?"0":C(d),d===0&&E.setAttribute("data-zero",""),E}function y(d,E,M,b){let[I,Y,F,V]=M,K=document.createElement("div");K.className="region",K.setAttribute("data-level",String(E));let z=document.createElement("span");z.className="tag",z.textContent=d;let _=document.createElement("div");_.className="row";let u=document.createElement("div");u.className="fill",u.appendChild(b),_.append(h(V),u,h(Y));let x=document.createElement("div");return x.className="head",x.append(z,h(I)),K.append(x,_,h(F)),K}return{show(d,E=[],M){let b=tt(d.el),[I,Y,F,V]=b.border,[K,z,_,u]=b.padding,x=We(d.el),p=d.width/x.x,G=d.height/x.y,w=Math.abs(x.x-1)>.001||Math.abs(x.y-1)>.001,m=document.createElement("header"),R=document.createElement("span");R.className="name",R.textContent=d.label;let Q=document.createElement("span");Q.className="size",Q.textContent=`${C(p)} \xD7 ${C(G)}`;let be=document.createElement("button");if(be.className="close",be.textContent="\xD7",be.title="close (B brings it back)",be.addEventListener("pointerdown",S=>S.stopPropagation()),be.addEventListener("click",S=>{S.stopPropagation(),ve=!0,o.removeAttribute("data-open")}),m.append(R,Q),w){let S=document.createElement("span");S.className="scale",S.textContent=`\xD7${C(x.x)}`,S.title=`renders at ${C(d.width)} \xD7 ${C(d.height)}`,m.appendChild(S)}m.appendChild(be),m.addEventListener("pointerdown",f),m.addEventListener("pointermove",g),m.addEventListener("pointerup",k),m.addEventListener("pointercancel",k);let Je=document.createElement("div");Je.className="content",Je.textContent=`${C(p-V-Y-u-z)} \xD7 ${C(G-I-F-K-_)}`;let re=[m,y("margin",1,b.margin,y("border",2,b.border,y("padding",3,b.padding,Je)))];if(r){let S=zt(d.el),J=Oe(d.el);re.push(J.length&&S?i("type",J.map(j=>[j.label,j.value])):i("type",[["","nothing of its own to set type on"]]))}if(M&&M.el!==d.el&&M.el.isConnected){let S=Zt(M.el,d.el).map(j=>[j.prop,`${j.a||"\u2014"} \u2192 ${j.b||"\u2014"}`]),J=S.slice(0,10);S.length>J.length&&J.push(["",`and ${S.length-J.length} more`]),re.push(i(`differs from ${M.label}`,J.length?J:[["","nothing in the properties it compares"]]))}let De=Jt(d.el);if(De&&De.rows.length&&re.push(i(`laid out by ${De.display}`,De.rows.map(S=>[S.label,S.value]))),E.length){let S=E.map(j=>[C(j.px),j.detail]),J=_t(E.map(j=>j.px));J&&S.push(["",J]),re.push(i("gaps",S))}let Mt=Wt(d.el),Rt=Xt([p,G,...b.margin,...b.border,...b.padding,...r?Oe(d.el).map(S=>S.px):[]],Mt);Rt&&re.push(i("tokens",[["",Rt]]));let Lt=qt(d.el);Lt.length&&re.push(i("styled by",Lt.slice(0,4).map(S=>[S.selector,S.file])));let At=Vt(d.el);At>1&&re.push(i("matches",[["",`${At} elements share ${et(d.el)}`]]));let Gt=Mt.filter(S=>Ze(S.value));if(Gt.length){let S=Ut(d.el).map(({label:J,value:j})=>{let Nt=jt(j,Gt);return[J,Nt.length?`${j}  ${Nt.join(" ")}`:`${j}  \u2014`]});S.length&&re.push(i("colour",S))}n.replaceChildren(...re),l=d,s(),!ve&&requestAnimationFrame(()=>o.setAttribute("data-open",""))},showsType:()=>r,isOpen:()=>!ve&&l!==null,toggleType(){r=!r,l&&this.show(l)},asText(){if(!l)return"";let d=tt(l.el),E=We(l.el),M=l.width/E.x,b=l.height/E.y,I=F=>F.map(V=>C(V)).join(" "),Y=[`${l.label}  ${C(M)} \xD7 ${C(b)}`,`margin   ${I(d.margin)}`,`border   ${I(d.border)}`,`padding  ${I(d.padding)}`];if(r)for(let F of Oe(l.el))Y.push(`${F.label.padEnd(8)} ${F.value}`);return Y.join(ko)},hide(){l=null,o.removeAttribute("data-open")},toggle(){l&&(ve=!ve,ve?o.removeAttribute("data-open"):(s(),o.setAttribute("data-open","")))},destroy(){removeEventListener("resize",s),o.remove(),t.remove()}}}function bn(e=20,t=1e3){let o=[];return{push(n,r,i=Date.now()){let a=o[o.length-1];if(a&&r!==""&&a.tag===r&&i-a.at<=t){a.at=i;return}o.push({state:n,tag:r,at:i}),o.length>e&&o.shift()},pop(){return o.pop()?.state??null},depth(){return o.length},clear(){o.length=0}}}var $o="0 0 24 24";var L=e=>({path:e}),de=(e,t,o,n,r)=>({rect:[e,t,o,n,r]}),Eo={rulers:[L("M2 8V4"),L("M22 8V4"),L("M22 6H2"),de(2,12,20,8,2),L("M6 15v-3"),L("M10 15v-3"),L("M14 15v-3"),L("M18 15v-3")],xray:[L("M3 7V5a2 2 0 0 1 2-2h2"),L("M17 3h2a2 2 0 0 1 2 2v2"),L("M21 17v2a2 2 0 0 1-2 2h-2"),L("M7 21H5a2 2 0 0 1-2-2v-2")],grid:[de(3,3,18,18,2),L("M9 3v18"),L("M15 3v18")],pixels:[de(3,3,18,18,2),L("M3 9h18"),L("M3 15h18"),L("M9 3v18"),L("M15 3v18")],type:[L("M12 4v16"),L("M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"),L("M9 20h6")],panel:[de(3,3,18,18,2),de(8,8,8,8,1)],freeze:[de(14,3,5,18,1),de(5,3,5,18,1)],copy:[de(8,8,14,14,2),L("M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2")],pick:[L("m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12"),L("m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z"),L("m2 22 .414-.414")],undo:[L("M9 14 4 9l5-5"),L("M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11")]},ut="http://www.w3.org/2000/svg";function dt(e,t=16){let o=document.createElementNS(ut,"svg");o.setAttribute("viewBox",$o),o.setAttribute("width",String(t)),o.setAttribute("height",String(t)),o.setAttribute("fill","none"),o.setAttribute("stroke","currentColor"),o.setAttribute("stroke-width","2"),o.setAttribute("stroke-linecap","round"),o.setAttribute("stroke-linejoin","round"),o.setAttribute("aria-hidden","true");for(let n of Eo[e])if("rect"in n){let[r,i,a,s,c]=n.rect,f=document.createElementNS(ut,"rect");f.setAttribute("x",String(r)),f.setAttribute("y",String(i)),f.setAttribute("width",String(a)),f.setAttribute("height",String(s)),f.setAttribute("rx",String(c)),o.appendChild(f)}else{let r=document.createElementNS(ut,"path");r.setAttribute("d",n.path),o.appendChild(r)}return o}var Co=[{title:"Pointing at things",rows:[["Ctrl/Cmd + Shift + A","turn align on or off"],["Hover","measure whatever is under the cursor"],["Click","lock an element, so it keeps measuring after the pointer leaves"],["Right-click","add another to the locked set, or drop one from it. Two locked also gets you a diff"],["Drag the panel header","move the box model out of your way"],["Esc","clear the locks, then close the tool"]]},{title:"Guides",rows:[["Drag from a rule","pull out a guide; drag it back into the rule to throw it away"],["V  /  H","drop a vertical or horizontal guide at the cursor"],["Hover a guide","its distance to every locked element"],["Click a guide","keep those distances up; click again to release"],["Arrows","nudge the guide you last touched. Shift for 10px"],["L","pin a guide, so it cannot be moved or deleted by accident"],["Ctrl/Cmd while placing","ignore snapping"],["Del","remove the guide under the cursor. Shift+Del for all of them"]]}],xe=16,pt=24,ht=st,mt=8,To=`
.flag {
  position: fixed; top: ${xe}px; right: ${xe}px;
  display: flex; align-items: center; gap: 8px;
  transition: top 160ms cubic-bezier(0.19, 1, 0.22, 1);
  padding: ${(st-pt)/2}px 10px; border-radius: 0;
  pointer-events: auto; user-select: none; cursor: pointer;
  font-family: ${T.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${T.tag}px; font-weight: ${O.medium};
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  color: ${N.primary};
  background: ${ae};
  box-shadow: ${fe};
}
/* Scoped to .flag: this stylesheet shares a shadow root with the box model,
   which has a .name of its own \u2014 an unscoped rule restyled its header too. */
.flag .name { letter-spacing: -0.02em; }
/* The rulers draw a gutter along the top edge, and the badge sits in it. Step
   down out of the way rather than covering the ticks the rulers exist to show. */
.flag[data-rulers] { top: ${xe+v}px; }
.help[data-rulers] { top: ${xe+v+ht+mt}px; }
.flag:hover { background: ${q(1)}; }
.flag .count { color: ${N.secondary}; }

/* A layers bar, not a palette. Switches, then the one control that changes the
   page, then the things that happen once. */
.tools { display: flex; align-items: center; gap: 2px; }
.sep {
  width: 1px; align-self: stretch; margin: 0 4px;
  background: ${ue};
}
.tool {
  width: ${pt}px; height: ${pt}px;
  display: grid; place-items: center;
  padding: 0; border: 0; border-radius: 0;
  background: none; cursor: pointer;
  font: inherit; font-size: ${T.tag}px; font-weight: ${O.medium};
  color: ${N.tertiary};
}
.tool:hover { background: ${q(2)}; color: ${N.primary}; }
.tool:focus-visible { outline: 1px solid ${N.primary}; outline-offset: -1px; }
/* On is the film, not a colour: the three hues each already mean something on
   the canvas, and a fourth here would say nothing. */
.tool[data-on] { background: ${q(4)}; color: ${N.primary}; }
.tool[data-once]:active { background: ${q(4)}; }
/* With nothing locked the count is empty but still a flex item, so the gap
   before it padded the right side and the pill sat lopsided. */
.flag .count:empty { display: none; }

.help {
  position: fixed; top: ${xe+ht+mt}px; right: ${xe}px; width: 368px;
  /* Fifteen rows outgrow a short window, and a list you cannot reach the end
     of is worse than one you have to scroll. */
  max-height: calc(100vh - ${xe*2+ht+mt}px); overflow-y: auto;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${T.stack};
  font-synthesis: none;
  font-size: ${T.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${N.primary};
  background: ${ae};
  box-shadow: ${fe};
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
  font-size: ${T.tag}px; font-weight: ${O.semibold};
  color: ${N.tertiary};
}
.help h4:first-child { margin-top: 0; }
.help kbd {
  display: inline-block; padding: 3px 5px;
  font: inherit; font-weight: ${O.medium};
  border: 1px solid ${ue};
  background: ${q(2)};
}
.help dd { margin: 0; color: ${N.secondary}; }
`,ft=[{name:"rulers",label:"Rulers",key:"R",toggle:!0,what:"a scale down the top and left edges, in page pixels \u2014 and the gutters you drag guides out of"},{name:"xray",label:"X-ray",key:"X",toggle:!0,what:"outline every element at once, to see the boxes a layout is really made of"},{name:"grid",label:"Column grid",key:"G",toggle:!0,what:"the grid your design is built on, columns filled and gutters left empty. Needs one configured"},{name:"pixels",label:"Pixel grid",key:"K",toggle:!0,what:"a ten-pixel lattice over the page, to read an offset off without measuring it"},{name:"type",label:"Type",key:"T",toggle:!0,what:"add size, weight, line height and tracking to the panel, each checked against your scale"},{name:"panel",label:"Box model",key:"B",toggle:!0,what:"the readout itself \u2014 margins, borders, padding, what places the element, what styles it"},{name:"freeze",label:"Freeze",key:"F",toggle:!0,what:"hold every animation and transition where it stands, so a moving thing can be measured"},{name:"copy",label:"Copy",key:"C",toggle:!1,what:"put everything in the panel on the clipboard as text"},{name:"pick",label:"Colour",key:"P",toggle:!1,what:"sample a colour from anywhere on screen and match it against your palette"},{name:"undo",label:"Undo",key:"Ctrl/Cmd + Z",toggle:!1,what:"step back through the guides \u2014 a whole run of nudges counts as one"}];function wn(e,t){let o=document.createElement("style");o.textContent=To,e.appendChild(o);let n=document.createElement("div");n.className="flag";let r=document.createElement("span");r.className="name",r.textContent="Align";let i=document.createElement("span");i.className="count";let a=new Map,s=document.createElement("div");s.className="tools";for(let l of ft){if(l.name==="freeze"||l.name==="copy"){let y=document.createElement("span");y.className="sep",s.appendChild(y)}let h=document.createElement("button");h.type="button",h.className="tool",h.appendChild(dt(l.name)),h.setAttribute("aria-label",l.label),h.title=`${l.label}  \xB7  ${l.key}
${l.what}`,l.toggle||h.setAttribute("data-once",""),h.addEventListener("click",y=>{y.stopPropagation(),t(l.name)}),a.set(l.name,h),s.appendChild(h)}n.append(r,s,i);let c=document.createElement("div");c.className="help";let f=document.createElement("dl");function g(l){let h=document.createElement("h4");h.textContent=l,f.appendChild(h)}function k(l,h,y){let d=document.createElement("span");d.className="glyph",y&&d.appendChild(dt(y,14));let E=document.createElement("dt"),M=document.createElement("kbd");M.textContent=l,E.appendChild(M);let b=document.createElement("dd");b.textContent=h,f.append(d,E,b)}g("The bar, left to right");for(let l of ft)k(l.key,`${l.label} \u2014 ${l.what}`,l.name);for(let l of Co){g(l.title);for(let[h,y]of l.rows)k(h,y)}return c.appendChild(f),n.addEventListener("click",l=>{l.stopPropagation(),c.toggleAttribute("data-open")}),e.append(n,c),{update(l,h){i.textContent=l>0?`${l} locked`:"",n.toggleAttribute("data-rulers",h.rulers),c.toggleAttribute("data-rulers",h.rulers);for(let y of ft)y.toggle&&a.get(y.name)?.toggleAttribute("data-on",h[y.name]===!0)},closeHelp(){let l=c.hasAttribute("data-open");return c.removeAttribute("data-open"),l},destroy(){n.remove(),c.remove(),o.remove()}}}var Xe=5,gt=4,Ge=12,vn=.22,ke=10,Mo=50,Ro=100;function kn(){let e=document.createElement("div");e.id="__align_host",e.setAttribute("data-align-ignore",""),e.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;",document.documentElement.appendChild(e);let t=e.attachShadow({mode:"closed"}),o=document.createElement("canvas");o.style.cssText="position: fixed; inset: 0; pointer-events: none;",t.appendChild(o);let n=o.getContext("2d"),r={hover:null,pinned:[],lines:[],cursor:null,rulers:!1,grid:null,pixels:!1,guides:[],liveGuide:null,activeGuide:null},i=lt(ct()),a=0,s=null;function c(){let u=ct();u!==s&&(s=u,i=lt(u),e.style.colorScheme=u?"dark":"light",_())}c();let f=matchMedia("(prefers-color-scheme: dark)"),g=()=>c();f.addEventListener("change",g);let k=new MutationObserver(()=>c());function l(){k.disconnect(),k.observe(document.documentElement,{attributes:!0}),document.body&&k.observe(document.body,{attributes:!0})}l(),xn(()=>_());function h(){let u=devicePixelRatio;o.width=Math.round(innerWidth*u),o.height=Math.round(innerHeight*u),o.style.width=innerWidth+"px",o.style.height=innerHeight+"px",n.setTransform(u,0,0,u,0,0),n.translate(.5,.5)}let y=u=>Math.round(u)-.5;function d(u,x){n.strokeStyle=x,n.lineWidth=1,n.setLineDash([]),n.strokeRect(Math.round(u.left),Math.round(u.top),Math.round(u.width),Math.round(u.height))}function E(u){n.strokeStyle=we(i.measure,.7),n.lineWidth=1,n.setLineDash([2,2]),n.beginPath();for(let x of[u.left,u.right])n.moveTo(Math.round(x),0),n.lineTo(Math.round(x),innerHeight);for(let x of[u.top,u.bottom])n.moveTo(0,Math.round(x)),n.lineTo(innerWidth,Math.round(x));n.stroke(),n.setLineDash([])}function M(u){if(n.strokeStyle=u.extension?we(i.measure,.55):i.measure,n.lineWidth=1,n.setLineDash(u.extension?[3,3]:[]),n.beginPath(),n.moveTo(Math.round(u.x1),Math.round(u.y1)),n.lineTo(Math.round(u.x2),Math.round(u.y2)),u.extension){n.stroke();return}if(u.axis==="x")for(let x of[u.x1,u.x2])n.moveTo(Math.round(x),Math.round(u.y1)-Xe),n.lineTo(Math.round(x),Math.round(u.y1)+Xe);else for(let x of[u.y1,u.y2])n.moveTo(Math.round(u.x1)-Xe,Math.round(x)),n.lineTo(Math.round(u.x1)+Xe,Math.round(x));n.stroke()}function b(u){return n.font=`${O.medium} ${T.body}px ${T.stack}`,{w:n.measureText(u).width+gt*2,h:T.body+gt*2+2}}function I(u,x,p,G){n.font=`${O.medium} ${T.body}px ${T.stack}`,n.textBaseline="middle";let{w,h:m}=b(u),R=y(Math.min(Math.max(x,Ge),innerWidth-w-Ge)),Q=y(Math.min(Math.max(p,Ge),innerHeight-m-Ge));n.fillStyle=G,n.beginPath(),n.roundRect(R,Q,Math.ceil(w),m,4),n.fill(),n.fillStyle=i.surface,n.fillText(u,R+gt,Q+m/2)}function Y(u,x,p,G,w=!1){let{w:m,h:R}=b(u);I(u,w?x-m/2:x,w?p-R/2:p,G)}function F(){let u=scrollX,x=scrollY;n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,innerWidth+1,v),n.fillRect(-.5,-.5,v,innerHeight+1),n.strokeStyle=i.rulerLine,n.lineWidth=1,n.setLineDash([]),n.font=`${O.regular} 9px ${T.stack}`,n.fillStyle=i.muted,n.save(),n.globalAlpha=.16,n.fillStyle=i.accent;for(let m of r.pinned)n.fillRect(y(m.left),-.5,Math.round(m.width),v),n.fillRect(-.5,y(m.top),v,Math.round(m.height));n.restore(),n.beginPath(),n.moveTo(-.5,v-.5),n.lineTo(innerWidth,v-.5),n.moveTo(v-.5,-.5),n.lineTo(v-.5,innerHeight),n.stroke();let p=m=>m%Ro===0?v:m%Mo===0?7:4;n.textBaseline="top",n.textAlign="left",n.beginPath();let G=Math.floor(u/ke)*ke;for(let m=G;m<u+innerWidth;m+=ke){let R=Math.round(m-u);if(R<v)continue;let Q=p(m);n.moveTo(R,v-Q),n.lineTo(R,v),Q===v&&(n.fillStyle=i.muted,n.fillText(String(m),R+3,3))}n.stroke(),n.beginPath();let w=Math.floor(x/ke)*ke;for(let m=w;m<x+innerHeight;m+=ke){let R=Math.round(m-x);if(R<v)continue;let Q=p(m);n.moveTo(v-Q,R),n.lineTo(v,R),Q===v&&(n.save(),n.translate(3,R-3),n.rotate(-Math.PI/2),n.fillStyle=i.muted,n.fillText(String(m),0,0),n.restore())}n.stroke(),r.cursor&&(n.strokeStyle=i.accent,n.beginPath(),n.moveTo(Math.round(r.cursor.x),-.5),n.lineTo(Math.round(r.cursor.x),v),n.moveTo(-.5,Math.round(r.cursor.y)),n.lineTo(v,Math.round(r.cursor.y)),n.stroke()),n.fillStyle=i.guide;for(let m of r.guides){let R=Math.round(Re(m));m.axis==="x"?n.fillRect(R-1,-.5,2,v):n.fillRect(-.5,R-1,v,2)}n.fillStyle=i.rulerBg,n.fillRect(-.5,-.5,v,v),n.strokeStyle=i.rulerLine,n.strokeRect(-.5,-.5,v,v)}function V(){let u=dn(10,1);if(u){n.strokeStyle=i.pixelLine,n.lineWidth=1,n.setLineDash([]),n.beginPath();for(let x=0;x<=innerWidth;x+=u)n.moveTo(x,0),n.lineTo(x,innerHeight);for(let x=0;x<=innerHeight;x+=u)n.moveTo(0,x),n.lineTo(innerWidth,x);n.stroke()}}function K(u){let x=un(u,document.documentElement.clientWidth);n.fillStyle=we(i.measure,.08);for(let p of x)n.fillRect(y(p.left),-.5,Math.round(p.width),innerHeight+1)}function z(){a=0,n.save(),n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,o.width,o.height),n.restore(),(r.pixels||r.grid)&&(n.save(),r.rulers&&(n.beginPath(),n.rect(v,v,innerWidth,innerHeight),n.clip()),r.pixels&&V(),r.grid&&K(r.grid),n.restore());for(let p of r.pinned)d(p,i.accent);r.hover&&(E(r.hover),d(r.hover,r.pinned.length?we(i.accent,.7):i.accent));for(let p of r.guides){let G=r.liveGuide?.id===p.id;n.strokeStyle=p.locked||G?i.guide:we(i.guide,.55),n.lineWidth=p.pinned?2:1,n.setLineDash(p.locked?[]:[4,4]),n.beginPath();let w=Math.round(Re(p));if(p.axis==="x"?(n.moveTo(w,0),n.lineTo(w,innerHeight)):(n.moveTo(0,w),n.lineTo(innerWidth,w)),n.stroke(),r.activeGuide===p.id){n.lineWidth=3,n.setLineDash([]),n.beginPath();let m=7;p.axis==="x"?(n.moveTo(w,0),n.lineTo(w,m),n.moveTo(w,innerHeight-m),n.lineTo(w,innerHeight)):(n.moveTo(0,w),n.lineTo(m,w),n.moveTo(innerWidth-m,w),n.lineTo(innerWidth,w)),n.stroke()}}for(let p of r.lines)n.globalAlpha=p.faded?vn:1,M(p);n.globalAlpha=1;let u=r.lines.filter(p=>p.label!==""),x=u.map(p=>{let G=(p.x1+p.x2)/2,w=(p.y1+p.y2)/2,{w:m,h:R}=b(p.label);return p.axis==="x"?{x:G-m/2,y:w-16-R/2,w:m,h:R,axis:p.axis}:{x:G+26-m/2,y:w-R/2,w:m,h:R,axis:p.axis}});if(cn(x,{w:innerWidth,h:innerHeight},Ge).forEach((p,G)=>{let w=u[G];n.globalAlpha=w.faded?vn:1,I(w.label,p.x,p.y,i.measure)}),n.globalAlpha=1,r.hover&&r.cursor){let{width:p,height:G,scale:w}=r.hover;Y(`${C(p/w.x)} \xD7 ${C(G/w.y)}`,r.cursor.x+14,r.cursor.y+14,i.accent)}if(r.liveGuide){let p=r.liveGuide,G=Math.round(Re(p));Y([`${p.axis} ${C(p.at)}`,p.caught,p.pinned?"pinned":""].filter(Boolean).join(" \xB7 "),p.axis==="x"?G+6:30,p.axis==="x"?30:G+6,i.guide)}r.rulers&&F()}function _(){a||(a=requestAnimationFrame(z))}return h(),{root:t,update(u){Object.assign(r,u),_()},resize(){h(),_()},destroy(){a&&cancelAnimationFrame(a),f.removeEventListener("change",g),k.disconnect(),e.remove()}}}function Lo(e){let t=e.trim().replace(/^#/,""),o=t.length===3?t.split("").map(n=>n+n).join(""):t;return/^[0-9a-f]{6}$/i.test(o)?{r:parseInt(o.slice(0,2),16),g:parseInt(o.slice(2,4),16),b:parseInt(o.slice(4,6),16)}:null}function Ao({r:e,g:t,b:o}){let n=r=>Math.round(r).toString(16).padStart(2,"0");return`#${n(e)}${n(t)}${n(o)}`}function Go({r:e,g:t,b:o}){return`rgb(${Math.round(e)} ${Math.round(t)} ${Math.round(o)})`}function ye(e,t){return String(Number(e.toFixed(t)))}function No({r:e,g:t,b:o}){let n=e/255,r=t/255,i=o/255,a=Math.max(n,r,i),s=Math.min(n,r,i),c=(a+s)/2,f=a-s,g=0,k=0;return f!==0&&(k=f/(1-Math.abs(2*c-1)),a===n?g=(r-i)/f%6:a===r?g=(i-n)/f+2:g=(n-r)/f+4,g*=60,g<0&&(g+=360)),`hsl(${ye(g,1)} ${ye(k*100,1)}% ${ye(c*100,1)}%)`}function xt(e){let t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4}function Bo(e){let t=xt(e.r),o=xt(e.g),n=xt(e.b),r=.4122214708*t+.5363325363*o+.0514459929*n,i=.2119034982*t+.6806995451*o+.1073969566*n,a=.0883024619*t+.2817188376*o+.6299787005*n,s=Math.cbrt(r),c=Math.cbrt(i),f=Math.cbrt(a),g=.2104542553*s+.793617785*c-.0040720468*f,k=1.9779984951*s-2.428592205*c+.4505937099*f,l=.0259040371*s+.7827717662*c-.808675766*f,h=Math.sqrt(k*k+l*l),y=Math.atan2(l,k)*180/Math.PI;return y<0&&(y+=360),h<1e-4?`oklch(${ye(g,4)} 0 0)`:`oklch(${ye(g,4)} ${ye(h,4)} ${ye(y,2)})`}function Sn(e){let t=Lo(e);return t?[{label:"hex",value:Ao(t)},{label:"rgb",value:Go(t)},{label:"hsl",value:No(t)},{label:"oklch",value:Bo(t)}]:[]}var Io=`
.picker {
  position: fixed; top: 46px; right: 16px; width: 200px;
  padding: 10px; border-radius: 0;
  pointer-events: auto; user-select: none;
  font-family: ${T.stack};
  font-variant-numeric: tabular-nums;
  font-synthesis: none;
  font-size: ${T.tag}px; line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  color: ${N.primary};
  background: ${ae};
  box-shadow: ${fe};
  display: none;
}
.picker[data-open] { display: block; }
.picker .swatch {
  height: 40px; margin-bottom: 8px;
  border: 1px solid ${ue};
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
  border-top: 1px solid ${ue};
  color: ${N.secondary};
}
`;function $n(e){let t=document.createElement("style");t.textContent=Io,e.appendChild(t);let o=document.createElement("div");o.className="picker",e.appendChild(o);let n=document.createElement("div");n.className="swatch";let r=document.createElement("div");r.className="hint";function i(a){n.style.background=a;let s=Sn(a).map(({label:c,value:f})=>{let g=document.createElement("button");g.type="button";let k=document.createElement("span");k.className="k",k.textContent=c;let l=document.createElement("span");return l.className="v",l.textContent=f,g.append(k,l),g.addEventListener("click",h=>{h.stopPropagation(),navigator.clipboard?.writeText(f).then(()=>{r.textContent=`copied ${c}`},()=>{r.textContent="clipboard refused"})}),g});r.textContent="click a row to copy",o.replaceChildren(n,...s,r),o.setAttribute("data-open","")}return{async open(){let a=window.EyeDropper;if(!a){o.replaceChildren(Object.assign(document.createElement("div"),{className:"hint",textContent:"this browser has no eyedropper"})),o.setAttribute("data-open","");return}try{let{sRGBHex:s}=await new a().open();i(s)}catch{}},close(){let a=o.hasAttribute("data-open");return o.removeAttribute("data-open"),a},destroy(){o.remove(),t.remove()}}}var yt="__align_freeze",Do=`
[data-align-frozen] *:not([data-align-ignore]):not([data-align-ignore] *) {
  animation-play-state: paused !important;
}
`,bt=!1,Ye=[],Ke=[];function En(e){let t=e;for(;t;){if(t instanceof Element&&t.hasAttribute("data-align-ignore"))return!0;let o=t.getRootNode();if(t=o instanceof ShadowRoot?o.host:t.parentNode??null,t===document)return!1}return!1}function Ne(){return bt}function _e(e){if(e!==bt){if(bt=e,!e){document.documentElement.removeAttribute("data-align-frozen"),document.getElementById(yt)?.remove();for(let t of Ye)try{t.play()}catch{}for(let t of Ke)t.play().catch(()=>{});Ye=[],Ke=[];return}if(!document.getElementById(yt)){let t=document.createElement("style");t.id=yt,t.textContent=Do,t.setAttribute("data-align-ignore",""),document.head.appendChild(t)}document.documentElement.setAttribute("data-align-frozen",""),Ye=[];try{for(let t of document.getAnimations()){if(t.playState!=="running")continue;let o=t.effect?.target??null;En(o)||(t.pause(),Ye.push(t))}}catch{}Ke=[];for(let t of Array.from(document.querySelectorAll("video")))t.paused||En(t)||(t.pause(),Ke.push(t))}}var wt="__align_xray",Oo=`
[data-align-xray] * { outline: 1px solid rgb(128 128 128 / 0.55) !important; }
[data-align-xray] [data-align-ignore],
[data-align-xray] [data-align-ignore] * { outline: none !important; }
`;function je(e){let t=document.documentElement;if(!e){t.removeAttribute("data-align-xray"),document.getElementById(wt)?.remove();return}if(!document.getElementById(wt)){let o=document.createElement("style");o.id=wt,o.textContent=Oo,o.setAttribute("data-align-ignore",""),document.head.appendChild(o)}t.setAttribute("data-align-xray","")}var vt="align-ui";function Cn(e){try{return localStorage.getItem(e)}catch{return null}}function Tn(e,t){try{localStorage.setItem(e,t)}catch{}}function Mn(e){let t="/";try{t=location.pathname||"/"}catch{}return`${vt}:${e}::${t}`}function Po(e){if(typeof e!="object"||e===null)return!1;let t=e;return(t.axis==="x"||t.axis==="y")&&typeof t.at=="number"&&Number.isFinite(t.at)}function Rn(){let e=Cn(Mn("guides"));if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(Po).map(o=>({id:0,axis:o.axis,at:o.at,locked:o.locked===!0,pinned:o.pinned===!0,caught:typeof o.caught=="string"?o.caught:""})):[]}catch{return[]}}function Ln(e){Tn(Mn("guides"),JSON.stringify(e.map(t=>({axis:t.axis,at:t.at,locked:t.locked,pinned:t.pinned,caught:t.caught}))))}function Ue(e){return Cn(`${vt}:${e}`)==="1"}function Be(e,t){Tn(`${vt}:${e}`,t?"1":"0")}var U,A=null,X=null,he=null,Me=null,ne=!1,$e=Ue("grid"),Ee=Ue("pixels"),D=null,$=[],qe=0,oe=Ue("rulers"),B=[],Pn=1,An=!1,le=null,$t=bn();function Ho(){return B.map(e=>({...e}))}function Ce(e=""){$t.push(Ho(),e)}function Gn(){return B.find(e=>e.id===le)??null}function pe(e){B=e,Ln(B)}var H=null,te=null,Z=null,Fo=3,Se=22;function Hn(e,t){return oe?t<Se&&e>=Se?"y":e<Se&&t>=Se?"x":null:null}function Et(e){return e.ctrlKey||e.metaKey}function Fn(e,t,o,n){let r=me(t,o,U),i=e.axis==="x"?t:o,a=B.filter(c=>c.id!==e.id).map(c=>({axis:c.axis,at:Ie(c).pos})),s=an(i,sn(r,e.axis,a),n);e.at=s.at+(e.axis==="x"?scrollX:scrollY),e.caught=s.what}function zn(e,t,o,n){let r={id:Pn++,axis:e,at:0,locked:!1,caught:"",pinned:!1};return Ce(),Fn(r,t,o,n),pe([...B,r]),le=r.id,r}function Wn(e){e.pinned||(Ce(),pe(B.filter(t=>t.id!==e.id)),te?.id===e.id&&(te=null),H?.id===e.id&&(H=null))}function zo(e){let t=U.hotkey.toLowerCase().split("+"),o=t[t.length-1];return e.key.toLowerCase()!==o||t.includes("shift")!==e.shiftKey||t.includes("alt")!==e.altKey?!1:(t.includes("mod")||t.includes("ctrl")||t.includes("cmd"))===(e.metaKey||e.ctrlKey)}function Ie(e){return{axis:e.axis,pos:e.axis==="x"?e.at-scrollX:e.at-scrollY}}function Ct(){return $.length>=2?$[$.length-2]:void 0}function Tt(){if($.length<2)return[];let e=[];for(let[t,o]of nt($))for(let n of ze(t,o)){if(n.extension||!n.label)continue;let r=Yt(t.el,o.el,parseFloat(n.label),n.axis);e.push({px:r.px,detail:Kt(r)})}return e}function P(e){let t=$[$.length-1],o=D&&$.some(l=>l.el===D.el),n=B.map(Ie),r=!H&&te?te:null,i=B.filter(l=>l.locked||l.id===r?.id),a=!r&&o?D.el:null,s=r??a,c=r?Ie(r):null,f=[],g=(l,h)=>{for(let y of l)f.push(s&&!h?{...y,faded:!0}:y)},k=l=>!c||l.axis!==c.axis?!1:(l.axis==="x"?[l.x1,l.x2]:[l.y1,l.y2]).some(y=>Math.abs(y-c.pos)<.5);for(let[l,h]of nt($))g(ze(l,h),l.el===a||h.el===a);t&&D&&!o&&!r&&g(ze(t,D),!0);for(let l of i)for(let h of $)g(rt(h,[Ie(l)]),l.id===r?.id||h.el===a);D&&!o&&!r&&B.length&&g(rt(D,n),!0);for(let l of ln(i.map(Ie),{x:innerWidth/2,y:innerHeight/2}))g([l],k(l));A?.update({hover:D,pinned:$,rulers:oe,grid:$e&&U.grid?U.grid:null,pixels:Ee,guides:B,liveGuide:H??te,activeGuide:le,lines:f,...e?{cursor:e}:{}}),he?.update($.length,{rulers:oe,xray:ne,grid:$e,pixels:Ee,freeze:Ne(),type:X?.showsType()??!1,panel:X?.isOpen()??!1})}function Xn(){let e=X?.asText()??"";e&&navigator.clipboard?.writeText(e).catch(()=>{})}function Yn(){let e=$t.pop();e&&(pe(e),te=null,H=null,Z=null,e.some(t=>t.id===le)||(le=null))}function kt(e){switch(e){case"rulers":oe=!oe,Be("rulers",oe);break;case"xray":ne=!ne,je(ne);break;case"grid":$e=!$e,Be("grid",$e);break;case"pixels":Ee=!Ee,Be("pixels",Ee);break;case"freeze":_e(!Ne());break;case"type":X?.toggleType();break;case"panel":X?.toggle();break;case"copy":Xn();break;case"pick":Me?.open();break;case"undo":Yn();break}P()}var Ve=null;function Kn(e){if(Ve={x:e.clientX,y:e.clientY},H){Z&&Math.hypot(e.clientX-Z.x,e.clientY-Z.y)>Fo&&(Z=null),!Z&&!H.pinned&&(Fn(H,e.clientX,e.clientY,Et(e)),pe([...B])),P({x:e.clientX,y:e.clientY});return}te=ot(B,e.clientX,e.clientY),D=me(e.clientX,e.clientY,U),P({x:e.clientX,y:e.clientY})}function _n(e){H&&(Z?(H.locked=!H.locked,le=H.id,pe([...B])):(Hn(e.clientX,e.clientY)||e.clientX<Se||e.clientY<Se)&&Wn(H),Z=null,H=null,P({x:e.clientX,y:e.clientY}))}function jn(e){if(e.button!==0)return;let t=me(e.clientX,e.clientY,U);if(!t)return;let o=Hn(e.clientX,e.clientY);if(o){Te(e),Z=null,H=zn(o,e.clientX,e.clientY,Et(e)),P({x:e.clientX,y:e.clientY});return}let n=ot(B,e.clientX,e.clientY);if(n){Te(e),Ce(),le=n.id,H=n,Z={x:e.clientX,y:e.clientY},P({x:e.clientX,y:e.clientY});return}Te(e),he?.closeHelp(),$=[t],D=t,X?.show(t,Tt(),Ct()),P({x:e.clientX,y:e.clientY})}function Un(e){let t=me(e.clientX,e.clientY,U);if(!t)return;Te(e),he?.closeHelp();let o=$.findIndex(r=>r.el===t.el);$=o>=0?$.filter((r,i)=>i!==o):[...$,t],D=t;let n=$[$.length-1];n?X?.show(n,Tt(),Ct()):X?.hide(),P({x:e.clientX,y:e.clientY})}function Vn(e){me(e.clientX,e.clientY,U)&&Te(e)}function qn(e){me(e.clientX,e.clientY,U)&&Te(e)}function Te(e){e.preventDefault(),e.stopPropagation()}function Nn(e,t){return e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height}var Bn=0,In=0;function Jn(){qe=requestAnimationFrame(Jn);let t=$.filter(s=>s.el.isConnected).map(s=>Fe(s.el)),o=D&&D.el.isConnected?Fe(D.el):null;if(!(scrollX!==Bn||scrollY!==In||t.length!==$.length||t.some((s,c)=>!Nn(s,$[c]))||D===null!=(o===null)||D!==null&&o!==null&&!Nn(D,o)))return;Bn=scrollX,In=scrollY,$=t,D=o;let i=$[$.length-1],a=Wo();a!==Dn&&(Dn=a,i?X?.show(i,Tt(),Ct()):X?.hide()),P()}var Dn="";function Wo(){let e=$[0];return e?$.map(t=>[t.label,Math.round(t.width*100),Math.round(t.height*100),Math.round((t.left-e.left)*100),Math.round((t.top-e.top)*100)].join(",")).join(";"):""}function Qn(){A?.resize()}function Xo(){An||(An=!0,B=Rn().map(e=>({...e,id:Pn++}))),!A&&(fn(),A=kn(),X=yn(A.root),he=wn(A.root,kt),Me=$n(A.root),he.update(0,{rulers:oe,xray:ne,grid:$e,pixels:Ee,freeze:Ne(),type:!1,panel:!1}),addEventListener("mousemove",Kn),addEventListener("mousedown",jn,{capture:!0}),addEventListener("mouseup",_n,{capture:!0}),addEventListener("click",Vn,{capture:!0}),addEventListener("auxclick",qn,{capture:!0}),addEventListener("contextmenu",Un,{capture:!0}),addEventListener("resize",Qn),qe=requestAnimationFrame(Jn),P())}function St(){removeEventListener("mousemove",Kn),removeEventListener("mousedown",jn,{capture:!0}),removeEventListener("mouseup",_n,{capture:!0}),removeEventListener("click",Vn,{capture:!0}),removeEventListener("auxclick",qn,{capture:!0}),removeEventListener("contextmenu",Un,{capture:!0}),removeEventListener("resize",Qn),cancelAnimationFrame(qe),qe=0,he?.destroy(),Me?.destroy(),Me=null,ne&&(ne=!1,je(!1)),_e(!1),he=null,X?.destroy(),X=null,A?.destroy(),A=null,gn(),D=null,$=[],H=null,Z=null,te=null}function On(e){if(zo(e))e.preventDefault(),A?St():Xo();else if(A&&Ve&&(e.key.toLowerCase()===U.guideKeys.vertical||e.key.toLowerCase()===U.guideKeys.horizontal)){e.preventDefault();let t=e.key.toLowerCase()===U.guideKeys.vertical?"x":"y";zn(t,Ve.x,Ve.y,Et(e)),P()}else if(A&&(e.key==="Delete"||e.key==="Backspace"))e.preventDefault(),e.shiftKey?(Ce(),pe(B.filter(t=>t.pinned)),te=null,H=null,Z=null,B.some(t=>t.id===le)||(le=null)):te&&Wn(te),P();else if(A&&e.key.startsWith("Arrow")){let t=Gn(),o=e.key==="ArrowLeft"||e.key==="ArrowRight"?"x":"y";if(!t||t.axis!==o||(e.preventDefault(),t.pinned))return;Ce(`nudge:${t.id}`);let n=e.shiftKey?10:1;t.at+=e.key==="ArrowLeft"||e.key==="ArrowUp"?-n:n,t.caught="",pe([...B]),P()}else if(A&&e.key.toLowerCase()==="g"){e.preventDefault(),kt("grid");return}else if(A&&e.key.toLowerCase()==="k"){e.preventDefault(),kt("pixels");return}else if(A&&e.key.toLowerCase()==="f")e.preventDefault(),_e(!Ne()),P();else if(A&&e.key.toLowerCase()==="x")e.preventDefault(),ne=!ne,je(ne);else if(A&&e.key.toLowerCase()==="p")e.preventDefault(),Me?.open();else if(A&&e.key.toLowerCase()==="t")e.preventDefault(),X?.toggleType();else if(A&&e.key.toLowerCase()==="c")e.preventDefault(),Xn();else if(A&&e.key.toLowerCase()==="l"){let t=Gn();if(!t)return;e.preventDefault(),Ce(),t.pinned=!t.pinned,pe([...B]),P()}else if(A&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){if($t.depth()===0)return;e.preventDefault(),Yn(),P()}else if(A&&e.key.toLowerCase()===U.rulerKey)e.preventDefault(),oe=!oe,Be("rulers",oe),P();else if(A&&e.key.toLowerCase()===U.panelKey)e.preventDefault(),X?.toggle();else if(e.key==="Escape"&&A){if(Me?.close()||he?.closeHelp())return;$.length?($=[],X?.hide(),P()):St()}}function Cr(e={}){if(typeof window>"u"||window.__align)return;window.__align=!0,U=tn(e),addEventListener("keydown",On,{capture:!0});let t=import.meta.hot;t&&t.dispose(()=>{St(),removeEventListener("keydown",On,{capture:!0}),delete window.__align})}export{Cr as initAlign};
