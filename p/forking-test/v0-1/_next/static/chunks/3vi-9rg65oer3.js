(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,82926,e=>{"use strict";let t=e=>!!e&&e.nodeType===Node.ELEMENT_NODE,i=e=>{let i=((e,i)=>{let n=e;for(;t(n);){if(n.hasAttribute(i))return n;n=n.parentNode}return null})(e,"data-blok-c");if(!i)return null;let n=i.getAttribute("data-blok-c");return null===n?null:JSON.parse(n)},n=e=>document.querySelector(`[data-blok-uid="${e}"]`),l=e=>{let t=e.getBoundingClientRect();return t.top<0&&t.top+t.height>=0||t.top>=0&&t.top<=(window.innerHeight||document.documentElement.clientHeight)},o="data-blok-f",s=["text","textarea"],r=["number"];var d=Object.defineProperty,a=(e,t,i)=>{let n;return(n="symbol"!=typeof t?t+"":t)in e?d(e,n,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[n]=i};class h{constructor(e){a(this,"resolvedField"),a(this,"fieldSchemas"),a(this,"fieldValue"),a(this,"_originalChildNodes"),a(this,"onCommitCb"),this.resolvedField=null,this.fieldSchemas=null,this.onCommitCb=e,this.fieldValue=void 0,this._originalChildNodes=null}resetResolvedField(){this.resolvedField=null}onResolvedField(e){this.resolvedField=e}onFieldSchemas(e){this.fieldSchemas=e}onClick(e){this.resolvedField=(e=>{if(!(e instanceof Element))return null;let t=e.closest(`[${o}], [data-blok-c]`);if(!t)return null;let n=t.getAttribute(o);if(!n)return null;let l=null;try{l=i(t)}catch{return null}return null!=l&&l.id&&null!=l&&l.uid?{element:t,blok:l,field:n,key:(({storyId:e,blokUid:t,field:i})=>`${e}:${t}:${i}`)({storyId:l.id,blokUid:l.uid,field:n})}:null})(e)}getResolvedFieldSchema(){var e;if(!this.fieldSchemas||!this.resolvedField)return;let{field:t,blok:i}=this.resolvedField;return null==(e=this.fieldSchemas[i.name])?void 0:e[t]}onEditedBlok(e){var t,i;let n,l;if(!this.fieldSchemas||!Object.keys(this.fieldSchemas).length||!(null!=(t=this.resolvedField)&&t.field)||!(null!=(i=this.resolvedField)&&i.blok))return!1;let{blok:o}=this.resolvedField,{blok:d}=e,a=this.getResolvedFieldSchema();return d.uid===o.uid&&d.id===o.id&&!!a&&(n=a.type,!!(s.includes(n)||(l=a.type,r.includes(l))))&&(a.editable?"editable":"readonly")}onFieldValueChange(e){let t=e.target;(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement)&&(this.fieldValue=t.value)}activateTextEditing(){var e;if(!this.resolvedField)return null;let{element:t}=this.resolvedField,i=this.getResolvedFieldSchema(),n=(null==i?void 0:i.type)==="text",l=(null==i?void 0:i.type)==="textarea";if(n||l){let i=(null==(e=t.textContent)?void 0:e.trim())??"",l=getComputedStyle(t),o=document.createElement("textarea");o.rows=1,o.addEventListener("input",()=>{o.style.height="auto",o.style.height=`${o.scrollHeight}px`}),o.setAttribute("class","storyblok__field-overlay-input"),o.value=i,o.style.fontFamily=l.fontFamily,o.style.fontSize=l.fontSize,o.style.fontWeight=l.fontWeight,o.style.color="#1b2432",o.style.lineHeight=l.lineHeight,o.style.letterSpacing=l.letterSpacing,o.style.textAlign=l.textAlign,o.style.width="100%",o.style.whiteSpace="pre-wrap",o.style.overflowWrap="break-word",o.style.overflowY="auto",n&&(o.addEventListener("keydown",e=>{"Enter"===e.key&&(e.isComposing||229===Reflect.get(e,"keyCode")||e.preventDefault())}),o.addEventListener("input",()=>{let e=o.value.replace(/[\r\n]/g,"");e!==o.value&&(o.value=e)})),o.addEventListener("change",this.onFieldValueChange.bind(this)),o.addEventListener("input",this.onFieldValueChange.bind(this));let s=Array.from(t.childNodes);return this._originalChildNodes=s,t.textContent="",t.appendChild(o),o.style.height="auto",o.style.height=`${o.scrollHeight}px`,o.focus(),o}return null}removeEditElement(){if(!this.resolvedField)return;let{element:e}=this.resolvedField,t=e.querySelector("input, textarea");t&&(t.remove(),void 0!==this.fieldValue?(e.textContent=this.fieldValue,this.onCommitCb(this.fieldValue)):e.append(...this._originalChildNodes??[]),this._originalChildNodes=null,this.fieldValue=void 0)}cancelFieldEdit(){this.fieldValue=void 0,this.removeEditElement()}destroy(){this.removeEditElement(),this.resolvedField=null,this.fieldSchemas=null,this.onCommitCb=()=>{},this.fieldValue=void 0}}let c=e=>{let t={};try{let i=e.replace(/\\/g,"");t=JSON.parse(i)}catch{console.error("Error parsing json",e)}return t},u=e=>{let t="";return location.search.substr(1).split("&").forEach(i=>{let n=i.split("=");n[0]===e&&(t=decodeURIComponent(n[1]))}),t},m=(e,t,i)=>"string"!=typeof e?"":e.toString().replace(/([A-Z])/g," $1").trim().toLowerCase().replace(/[_-]/g," ").replace(/(?:^|\s)\S/g,function(e,t){return e.toUpperCase()}),b=e=>e&&e.display_name?e.display_name:m(e.name),p=e=>{let t=document.createElementNS("http://www.w3.org/2000/svg","svg");t.setAttribute("viewBox",e.viewBox),t.setAttribute("class",e.svgClass);let i=document.createElementNS(t.namespaceURI,"path");return i.setAttribute("d",e.path),i.setAttribute("fill",e.pathFill),i.setAttribute("transform",e.pathTransform?e.pathTransform:"translate(0 0)"),t.appendChild(i),t};var v=Object.defineProperty,f=(e,t,i)=>{let n;return(n="symbol"!=typeof t?t+"":t)in e?v(e,n,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[n]=i};let y=(e=>e)`
  @keyframes smoke {
    from {
      background-color: rgba(89, 197, 198, 0);
    }
    to {
      background-color: rgba(89, 197, 198, 0.5);
    }
  }

  .storyblok--outlined .storyblok__outline,
  .storyblok--outlined [data-blok-c] {
    outline: 1px dashed rgba(182, 186, 191, 0.5);
  }

  .storyblok--outlined .storyblok__outline[data-blok-focused='true'],
  .storyblok--outlined [data-blok-c][data-blok-focused='true'] {
    outline: 0;
  }

  .storyblok__hint {
    box-sizing: border-box;
    outline: 1px solid #05807f;
    pointer-events: none;
    position: absolute;
    transition: opacity 0.2s ease;
    z-index: 16777272;
  }

  .storyblok__highlight {
    background: rgba(89, 197, 198, 0.2);
    outline: 1px solid #05807f;
    pointer-events: none;
    position: absolute;
    transition: opacity 0.2s ease;
    z-index: 16777270;
  }

  .storyblok__overlay {
    box-shadow: 0 0 8px 2px rgba(34, 42, 69, 0.07);
    box-sizing: border-box;
    outline: 1px solid #05807f;
    pointer-events: none;
    position: absolute;
    z-index: 16777273;
  }

  .storyblok__field-overlay {
    border: 1px solid var(--border-brand_primary, #05807f);
    box-sizing: border-box;
    pointer-events: none;
    position: absolute;
    z-index: 16777274;
  }

  .storyblok__field-overlay-input {
    background: #c1ddfb;
    color: #1b2432;
    border: none;
    box-sizing: border-box;
    display: block;
    height: 100%;
    margin: 0;
    outline: none;
    padding: 0;
    resize: none;
    width: 100%;
  }

  .storyblok__field-overlay-bar {
    display: flex;
    gap: 5px;
    left: -1px;
    position: absolute;
    top: -25px;
  }

  .storyblok__field-overlay-label {
    align-items: center;
    background: var(--accent-background-green_cyan, #d7f4e3);
    border-radius: var(--radius-sm, 6px);
    color: var(--accent-content-green_cyan, #13523b);
    display: flex;
    font-family:
      -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, helvetica, arial,
      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    gap: 5px;
    letter-spacing: 0;
    line-height: 140%;
    opacity: 1;
    padding: 2px 6px;
    text-transform: capitalize;
    white-space: nowrap;
  }

  .storyblok__field-overlay-edit {
    align-items: center;
    background: #f7f8fa;
    border: 1px solid #dfe3e8;
    border-radius: var(--radius-sm, 6px);
    color: inherit;
    cursor: pointer;
    display: none;
    font-family:
      -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, helvetica, arial,
      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    font-size: 14px;
    font-weight: 500;
    line-height: 140%;
    padding: 2px 8px;
    pointer-events: auto;
    white-space: nowrap;
  }

  .storyblok__field-overlay-edit:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  .storyblok__overlay-menu {
    background-color: #05807f;
    border-radius: 5px;
    display: inline-flex;
    font-family:
      -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, helvetica, arial,
      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    height: 30px;
    left: -1px;
    pointer-events: auto;
    position: absolute;
    top: -40px;
  }

  .storyblok__overlay-menu--simple .storyblok__overlay-menu-btn {
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
  }

  .storyblok__overlay-menu-label {
    color: #fff;
    font-size: 14px;
    line-height: 30px;
    margin-right: 20px;
    max-width: 200px;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .storyblok__overlay-menu-label:first-child {
    margin-left: 20px;
  }

  .storyblok__overlay-menu-btn {
    align-items: center;
    background-color: transparent;
    border: 0;
    display: flex;
    justify-content: center;
    outline: none;
    padding: 0;
  }

  .storyblok__overlay-menu-btn:hover {
    background-color: #0d5454;
  }

  .storyblok__overlay-menu-btn-action {
    border-bottom-right-radius: 5px;
    border-left: 1px solid #fff;
    border-top-right-radius: 5px;
    height: inherit;
    margin: auto;
    margin-right: 0;
  }

  .storyblok__overlay-menu-btn-parent {
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
    cursor: pointer;
    margin: 0;
    width: auto;
  }

  .storyblok__overlay-menu-svg {
    box-sizing: border-box;
    cursor: pointer;
    height: 24px;
    margin: 0 3px;
    width: 24px;
  }

  .storyblok__overlay--bottom .storyblok__overlay-menu {
    bottom: -40px;
    top: auto;
  }

  .storyblok__overlay--clicked {
    animation-duration: 0.2s;
    animation-iteration-count: 1;
    animation-name: smoke;
  }

  .storyblok__actions-menu,
  .storyblok__breadcrumbs-menu {
    background-color: #fff;
    border: 1px solid #dfe3e8;
    border-radius: 5px;
    box-shadow: 0 2px 17px 3px rgba(34, 42, 69, 0.07);
    box-sizing: content-box;
    display: none;
    height: fit-content;
    min-width: 156px;
    overflow: hidden;
    padding: 11px 0;
    position: absolute;
    top: 25px;
    z-index: 2;
  }

  .storyblok__actions-menu hr,
  .storyblok__breadcrumbs-menu hr {
    background-color: #dfe3e8;
    border: 0;
    height: 1px;
    margin: 11px 0 11px 20px;
  }

  .storyblok__actions-menu__menu-item,
  .storyblok__breadcrumbs-menu__menu-item {
    align-items: center;
    appearance: none;
    background: #fff;
    border: 0;
    color: #1b243f;
    cursor: pointer;
    display: flex;
    font-family:
      -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, helvetica, arial,
      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    font-size: 14px;
    padding: 8px 20px;
    text-align: left;
    width: 100%;
  }

  .storyblok__actions-menu__menu-item--delete,
  .storyblok__breadcrumbs-menu__menu-item--delete {
    color: #c11c14;
    margin-bottom: 0;
  }

  .storyblok__actions-menu__menu-item--selected,
  .storyblok__breadcrumbs-menu__menu-item--selected {
    color: #05807f;
    cursor: default;
    margin-bottom: 0;
  }

  .storyblok__actions-menu__menu-item--selected:hover,
  .storyblok__breadcrumbs-menu__menu-item--selected:hover {
    background: transparent;
  }

  .storyblok__actions-menu__menu-item:hover,
  .storyblok__breadcrumbs-menu__menu-item:hover {
    background: #eff1f3;
  }

  .storyblok__actions-menu__menu-item:focus,
  .storyblok__breadcrumbs-menu__menu-item:focus {
    outline: none;
  }

  .storyblok__actions-menu {
    left: calc(100% - 20px);
  }

  .storyblok__breadcrumbs-menu {
    left: -10px;
  }
`,g="storyblok--outlined",E="storyblok-bridge-stylesheet",k="storyblok__hint",_="storyblok__highlight",B="storyblok__overlay",w="storyblok__overlay-menu",M="storyblok__actions-menu",C="storyblok__breadcrumbs-menu",x="storyblok__field-overlay",O=0;class F{constructor(e){f(this,"inlineEditing"),f(this,"fieldOverlay"),f(this,"fieldOverlayLabel"),f(this,"fieldOverlayEditBtn"),f(this,"_fieldOverlayText"),f(this,"_boundEditBtnClick"),f(this,"_onWindowDblClick"),f(this,"_isEditing"),f(this,"_fieldOverlayRafId"),f(this,"_onFieldEditorViewportChange"),f(this,"_fieldEditorRafId"),this.appVersion="v1",this.inEditor=!0,this.initialized=!1,this._isEditing=!1,this._fieldOverlayRafId=null,this._onFieldEditorViewportChange=null,this._fieldEditorRafId=null,this.currentUid=null,this.storyId="",this.componentNames={},this.outlineOnMoveInterval=null,this.calcInterval=null,this.canAddBlocks=!1,this.canMoveForward=!1,this.canMoveBackward=!1,this.canDeleteBlocks=!1,this.navigationBreadcrumbs=[],this.focusState=!1,this.actionsEnabled=!1,this.hinter=null,this.highlighter=null,this.overlay=null,this.componentBase=null,this.componentLabel=null,this.breadcrumbsButtonMenu=null,this.breadcrumbsMenu=null,this.actionsMenu=null,this.actionsMenuButton=null,this.actionsMenuItems=null,this.fieldOverlay=null,this.fieldOverlayLabel=null,this.fieldOverlayEditBtn=null,this._fieldOverlayText=null,this._boundEditBtnClick=null,this._decoratedElements=[],this._onMessage=null,this._onMouseMove=null,this._onWindowClick=null,this._onWindowDblClick=null,this.inlineEditing=new h(this.onCommit.bind(this)),this.events={input:[],change:[],published:[],unpublished:[],viewLiveVersion:[],enterEditmode:[],enterComponent:[],hoverComponent:[],highlightComponent:[],customEvent:[],pingBack:[],sessionReceived:[],editedBlok:[],deselectBlok:[],addedBlock:[],deletedBlock:[],movedBlock:[],duplicatedBlock:[],fieldEditorClosed:[]},this.config={customParent:null,resolveRelations:null,resolveLinks:null,preventClicks:!1,initOnlyOnce:!0,fallbackLang:null,...e},this.init()}get isInIframe(){return window.top!==window.self}get csProtocol(){let e=location.protocol.replace(":","");return"http"!==e&&"https"!==e&&(e="https"),e}get targetOrigin(){return this.config.customParent?this.config.customParent:"stage"===u("_storyblok_env")?`${this.csProtocol}://app-beta.storyblok.com`:`${this.csProtocol}://app.storyblok.com`}get lastBreadcrumbItem(){return this.navigationBreadcrumbs[this.navigationBreadcrumbs.length-1]||{}}isInEditor(){return this.inEditor}init(){null===document.body?console.error("Body tag not found. Please install the Storyblok bridge script inside the body tag"):this.config.initOnlyOnce&&document.querySelectorAll(`.${k}`).length>0||this.isInIframe&&(this.resetAllEvents(),this.addMessageListener(),this.outlineOnMove(),this.buildBridgeStyles(),this.on("enterEditmode",this.enterEditmode),this.isInIframe&&this.sendDataToEditor({action:"initialized",config:this.config}),this.initialized=!0,O+=1)}sendDataToEditor(e){window.parent.postMessage(e,this.targetOrigin)}buildBridgeStyles(){document.getElementById(E)?(this.hinter=document.querySelector(`.${k}`),this.highlighter=document.querySelector(`.${_}`),this.overlay=document.querySelector(`.${B}`),this.componentBase=document.querySelector(`.${w}`),this.breadcrumbsButtonMenu=document.querySelector(`.${w}-btn-parent`),this.breadcrumbsMenu=document.querySelector(`.${C}`),this.actionsMenuButton=document.querySelector(`.${w}-btn-action`),this.actionsMenu=document.querySelector(`.${M}`),this.componentLabel=document.querySelector(`.${w} > .${w}-label`),this.createActionsMenuItems()):(this.createBridgeStylesheet(),this.createHinter(),this.createHighlighter(),this.createOverlay(),this.createComponentContext())}createBridgeStylesheet(){let e=document.createElement("style");e.setAttribute("type","text/css"),e.id=E,"textContent"in e?e.textContent=y:e.styleSheet.cssText=y,document.getElementsByTagName("head")[0].appendChild(e)}createHinter(){this.hinter=document.createElement("div"),this.hinter.className=k,this.hideElement(this.hinter),document.body.appendChild(this.hinter)}createHighlighter(){this.highlighter=document.createElement("div"),this.highlighter.style.opacity=0,this.hideElement(this.highlighter),document.body.appendChild(this.highlighter)}createOverlay(){this.overlay=document.createElement("div"),this.overlay.setAttribute("class",B),this.overlay.setAttribute("id",B),this.hideElement(this.overlay),document.body.appendChild(this.overlay)}createFieldOverlay(){this.fieldOverlay=document.createElement("div"),this.fieldOverlay.setAttribute("class",x),this.fieldOverlay.setAttribute("id",x),this.fieldOverlayLabel=document.createElement("span"),this.fieldOverlayLabel.setAttribute("class",`${x}-label`);let e=p({viewBox:"0 0 24 24",svgClass:`${x}-icon`,path:"M6.66602 8.66663V6.66663H17.3327V8.66663M9.99935 17.3333H13.9993M11.9993 6.66663V17.3333",pathFill:"none"});e.setAttribute("width","20"),e.setAttribute("height","20");let t=e.querySelector("path");t&&(t.setAttribute("stroke","var(--accent-content-green_cyan, #13523B)"),t.setAttribute("stroke-width","1.5"),t.setAttribute("stroke-linecap","round"),t.setAttribute("stroke-linejoin","round")),this.fieldOverlayLabel.appendChild(e),this._fieldOverlayText=document.createTextNode(""),this.fieldOverlayLabel.appendChild(this._fieldOverlayText),this.fieldOverlayEditBtn=document.createElement("button"),this.fieldOverlayEditBtn.setAttribute("class",`${x}-edit`),this.fieldOverlayEditBtn.textContent="Edit",this._boundEditBtnClick=this.onFieldOverlayEditBtnClick.bind(this),this.fieldOverlayEditBtn.addEventListener("click",this._boundEditBtnClick);let i=document.createElement("div");i.setAttribute("class",`${x}-bar`),i.appendChild(this.fieldOverlayLabel),i.appendChild(this.fieldOverlayEditBtn),this.fieldOverlay.appendChild(i),this.hideElement(this.fieldOverlay),document.body.appendChild(this.fieldOverlay)}setFieldOverlayEditBtnVisibility(e){this.fieldOverlayEditBtn&&(this.fieldOverlayEditBtn.style.display=e?"flex":"none")}onCommit(e){var t,i;let n=this.inlineEditing.resolvedField;if(!this.initialized||!n)return;let l=u("_storyblok_lang"),o=null==(i=null==(t=this.inlineEditing.fieldSchemas)?void 0:t[n.blok.name])?void 0:i[n.field];this.sendDataToEditor({action:"fieldChange",fieldData:{blok:n.blok,fieldName:n.field,updatedText:e,...l?{language:l}:{},...null!=o&&o.translatable?{translatable:!0}:{}}})}openFieldEditor(){let e=this.inlineEditing.resolvedField,t=this.inlineEditing.getResolvedFieldSchema();if(!this.initialized||!e||!t)return;let{top:i,left:n,width:l,height:o}=e.element.getBoundingClientRect();this.sendDataToEditor({action:"openFieldEditor",fieldData:{blok:e.blok,fieldName:e.field,fieldType:t.type,rect:{top:i,left:n,width:l,height:o}}}),this._trackFieldEditorPosition(e.element,{blok:e.blok,fieldName:e.field})}_trackFieldEditorPosition(e,t){this.stopTrackingFieldEditor();let i=()=>{if(this._fieldEditorRafId=null,!this.initialized||!e.isConnected)return void this.stopTrackingFieldEditor();let{top:i,left:n,width:l,height:o}=e.getBoundingClientRect();this.sendDataToEditor({action:"fieldEditorPosition",fieldData:{...t,rect:{top:i,left:n,width:l,height:o}}})};this._onFieldEditorViewportChange=()=>{null===this._fieldEditorRafId&&(this._fieldEditorRafId=requestAnimationFrame(i))},window.addEventListener("scroll",this._onFieldEditorViewportChange,{capture:!0,passive:!0}),window.addEventListener("resize",this._onFieldEditorViewportChange)}stopTrackingFieldEditor(){this._onFieldEditorViewportChange&&(window.removeEventListener("scroll",this._onFieldEditorViewportChange,{capture:!0}),window.removeEventListener("resize",this._onFieldEditorViewportChange),this._onFieldEditorViewportChange=null),null!==this._fieldEditorRafId&&(cancelAnimationFrame(this._fieldEditorRafId),this._fieldEditorRafId=null)}_isFieldInlineEditable(e){if(!(null!=e&&e.editable))return!1;let t=u("_storyblok_lang");return!(t&&"default"!==t.toLowerCase()&&!e.translatable)}onFieldOverlayEditBtnClick(e){null==e||e.stopPropagation(),this._activateFieldEditing()}handleWindowDblClick(e){this.initialized&&(this.config.preventClicks&&(e.preventDefault(),e.stopPropagation()),this._activateFieldEditing())}_activateFieldEditing(){let e,t;if(this._isEditing||!this.inlineEditing.resolvedField)return;let i=this.inlineEditing.getResolvedFieldSchema();i&&this._isFieldInlineEditable(i)&&((e=i.type,s.includes(e))?this.startInlineEditing():(t=i.type,r.includes(t)&&this.openFieldEditor()))}startInlineEditing(){if(!this.inlineEditing.resolvedField)return;let{field:e,element:t}=this.inlineEditing.resolvedField,i=this.inlineEditing.activateTextEditing();null!==i&&(this._isEditing=!0,this.fieldOverlayEditBtn&&(this.fieldOverlayEditBtn.disabled=!0),i.addEventListener("blur",()=>{this._isEditing=!1,i.isConnected&&(this.inlineEditing.removeEditElement(),this.showFieldOverlay(e,t))}),i.addEventListener("keydown",i=>{i instanceof KeyboardEvent&&"Escape"===i.key&&(this._isEditing=!1,this.inlineEditing.cancelFieldEdit(),this.showFieldOverlay(e,t))}),null!==this._fieldOverlayRafId&&cancelAnimationFrame(this._fieldOverlayRafId),this._fieldOverlayRafId=requestAnimationFrame(()=>{this._fieldOverlayRafId=null,this.initialized&&(this.showFieldOverlay(e,t),this.setFieldOverlayEditBtnVisibility(!0))}))}showFieldOverlay(e,t){var i,n;if(!this.fieldOverlay||!this.fieldOverlayEditBtn)return;this._fieldOverlayText&&(this._fieldOverlayText.nodeValue=m(e));let{top:l,left:o,width:s,height:r}=this.getElementOffset(t);this.fieldOverlay.style.top=`${l}px`,this.fieldOverlay.style.left=`${o}px`,this.fieldOverlay.style.width=`${s}px`,this.fieldOverlay.style.height=`${r}px`,this.fieldOverlay.style.minHeight="5px";let d=null==(i=this.inlineEditing.resolvedField)?void 0:i.blok;if(this.inlineEditing.fieldSchemas&&d){let t=null==(n=this.inlineEditing.fieldSchemas[d.name])?void 0:n[e];this.fieldOverlayEditBtn.disabled=!this._isFieldInlineEditable(t)||this._isEditing}this.showElement(this.fieldOverlay)}calculateElementPosition(e,t){if(!t)return this.hideElement(e),!1;let i=n(t);if(i){let{left:t,top:n,width:l,height:o}=this.getElementOffset(i);if(e===this.overlay){let t=i.getBoundingClientRect().top;e.classList.toggle(`${B}--bottom`,t<=30)}return e.style.top=`${n}px`,e.style.left=`${t}px`,e.style.width=`${l}px`,e.style.height=`${o}px`,e.style.minHeight="5px",!0}return this.hideElement(e),!1}getElementOffset(e){let t=e.getBoundingClientRect(),i=window.pageXOffset||document.documentElement.scrollLeft,n=window.pageYOffset||document.documentElement.scrollTop;return{top:t.top+n,left:t.left+i,width:t.width,height:t.height}}resetAllEvents(){for(let e in this.events)this.events[e]=[]}addMessageListener(){window.addEventListener&&(this._onMessage&&window.removeEventListener("message",this._onMessage),this._onMessage=this.receiveMessageFromApp.bind(this),window.addEventListener("message",this._onMessage))}receiveMessageFromApp(e){e&&e.data&&e.data.action&&this.emit(e.data.action,e.data)}emit(e,...t){let i=this.events[e];if(!(!e||!i||!i.length))for(let e=0;e<i.length;e++)i[e].apply(this,t)}outlineOnMoveHandler(){document.body.classList.add(g);let e=()=>{document.body.classList.remove(g),this.hinter&&(this.hinter.style.opacity=0)};this.outlineOnMoveInterval&&clearTimeout(this.outlineOnMoveInterval),this.outlineOnMoveInterval=setTimeout(e,800)}outlineOnMove(){this._onMouseMove&&document.removeEventListener("mousemove",this._onMouseMove),this._onMouseMove=this.outlineOnMoveHandler.bind(this),document.addEventListener("mousemove",this._onMouseMove)}on(e,t){if(Array.isArray(e)){for(let i of e)this.subscribeEvent(i,t);return}this.subscribeEvent(e,t)}subscribeEvent(e,t){"input"===e&&(this.actionsEnabled=!0),-1===this.events[e].indexOf(t)&&this.events[e].push(t)}off(e,t){if(Array.isArray(e)){for(let i of e)this.unsubscribeEvent(i,t);return}this.unsubscribeEvent(e,t)}unsubscribeEvent(e,t){let i=this.events[e],n=i.indexOf(t);-1!==n&&(i.splice(n,1),"input"===e&&0===i.length&&(this.actionsEnabled=!1))}pingEditor(e){this.isInIframe?this.sendDataToEditor({action:"ping"}):(this.inEditor=!1,e(this)),this.on("pingBack",this.handlePingBack(e))}handlePingBack(e){return()=>{this.inEditor=!0,e(this)}}handleEditedBlok(e){var t;if(!this.initialized)return;this.navigationBreadcrumbs=e.breadcrumbs,this.canAddBlocks=e.canAddBlocks||!1,this.canMoveForward=e.canMoveForward||!1,this.canMoveBackward=e.canMoveBackward||!1,this.canDeleteBlocks=e.canDeleteBlocks||!1,this.updateComponentBase(e.blok);let i=this.inlineEditing.onEditedBlok(e);if(!1===i){let i=null==(t=this.inlineEditing.resolvedField)?void 0:t.blok,n=!!i&&(i.uid!==e.blok.uid||i.id!==e.blok.id);this.fieldOverlay&&!n&&this.hideElement(this.fieldOverlay)}else this.setFieldOverlayEditBtnVisibility(!0),this.fieldOverlayEditBtn&&(this.fieldOverlayEditBtn.disabled="readonly"===i||this._isEditing)}handleAddMoveBlok(e){if(!this.initialized)return;let t=n(`${this.storyId}-${e.blockId}`);t&&this.handleOpenBlok(t)}handleDeselectBlock(){this.initialized&&(document.querySelectorAll("[data-blok-focused]").forEach(e=>e.removeAttribute("data-blok-focused")),this.hideElement(this.overlay),this.fieldOverlay&&this.hideElement(this.fieldOverlay),this.inlineEditing.resetResolvedField(),this.setFieldOverlayEditBtnVisibility(!1),this.stopTrackingFieldEditor())}handleDuplicatedBlok(e){this.initialized&&(this.handleDeselectBlock(),setTimeout(()=>{if(!this.initialized)return;let t=n(`${this.storyId}-${e.blockId}`);t&&this.handleOpenBlok(t)},500))}handleWindowClick(e){if(this.initialized){if(this.config.preventClicks&&(e.preventDefault(),e.stopPropagation()),null!==this.inlineEditing.fieldSchemas){this.inlineEditing.onClick(e.target);let{resolvedField:t}=this.inlineEditing;null!=t&&t.field&&t.element?this.showFieldOverlay(t.field,t.element):this.fieldOverlay&&this.hideElement(this.fieldOverlay)}else this.fieldOverlay&&this.hideElement(this.fieldOverlay);this.handleOpenBlok(e.target,e)}}handleOpenBlok(e,t){let n=i(e);if(n){t&&n.uid!==this.currentUid&&(t.preventDefault(),t.stopPropagation()),this.currentUid=n.uid,this.storyId=n.id,this.openBlok(n);return}t&&this.toggleFocusElement(e,!0)}enterEditmode(e){var t,i,l;let o=(e=>{let t=[],i=document.createNodeIterator(e,NodeFilter.SHOW_COMMENT,()=>NodeFilter.FILTER_ACCEPT),n=null;for(;n=i.nextNode();)if(n.nodeValue&&n.nodeValue.indexOf("#storyblok#")>-1){let e=n.nodeValue.replace("#storyblok#",""),i=n,l=i.nextElementSibling||i.nextSibling,o=c(e);o&&t.push({options:o,el:l})}return t})(document.body);if(e&&"fieldSchemas"in e&&(this.inlineEditing.onFieldSchemas(e.fieldSchemas??null),null===this.fieldOverlay)){let e=document.querySelector(`.${x}`);if(e){this.fieldOverlay=e,this.fieldOverlayLabel=document.querySelector(`.${x}-label`),this.fieldOverlayEditBtn=document.querySelector(`.${x}-edit`),this._boundEditBtnClick&&(null==(t=this.fieldOverlayEditBtn)||t.removeEventListener("click",this._boundEditBtnClick)),this._boundEditBtnClick=this.onFieldOverlayEditBtnClick.bind(this),null==(i=this.fieldOverlayEditBtn)||i.addEventListener("click",this._boundEditBtnClick);let n=null==(l=this.fieldOverlayLabel)?void 0:l.lastChild;this._fieldOverlayText=(null==n?void 0:n.nodeType)===Node.TEXT_NODE?n:null}else this.createFieldOverlay()}e&&e.appVersion&&(this.appVersion=e.appVersion),e&&e.componentNames&&(this.componentNames=e.componentNames),this._decoratedElements=[];for(let e=0;e<o.length;e++){let t=o[e].el,i=o[e].options;if(!t||t.nodeType!==Node.ELEMENT_NODE)continue;i.name=this.componentNames[i.name]||i.name,t.setAttribute("data-blok-c",JSON.stringify(i)),t.setAttribute("data-blok-uid",`${i.id}-${i.uid}`);let n=null;t.offsetHeight<5&&(n=t.style.getPropertyValue("min-height"),t.style["min-height"]="5px"),t.classList.add("storyblok__outline"),this._decoratedElements.push({el:t,previousMinHeight:n})}if(this.on("addedBlock",this.handleAddMoveBlok),this.on("duplicatedBlock",this.handleDuplicatedBlok),this.on("movedBlock",this.handleAddMoveBlok),this.on("enterComponent",this.enterComponent),this.on("highlightComponent",this.highlightComponent),this.on("hoverComponent",this.hoverComponent),this.on("editedBlok",this.handleEditedBlok),this.on("deselectBlok",this.handleDeselectBlock),this.on("fieldEditorClosed",this.stopTrackingFieldEditor),e&&e.blockId&&this.config.setActiveBlock){let t=n(`${e.storyId}-${e.blockId}`);this.handleOpenBlok(t)}this._onWindowClick||(this._onWindowClick=this.handleWindowClick.bind(this)),window.addEventListener("click",this._onWindowClick),this._onWindowDblClick||(this._onWindowDblClick=this.handleWindowDblClick.bind(this)),window.addEventListener("dblclick",this._onWindowDblClick),null!==this.calcInterval&&window.clearInterval(this.calcInterval),this.calcInterval=window.setInterval(()=>{var e;if(this.calculateElementPosition(this.overlay,`${this.storyId}-${this.currentUid}`),null!==this.inlineEditing.fieldSchemas){let{resolvedField:t}=this.inlineEditing;null!=t&&t.field&&null!=(e=t.element)&&e.isConnected?this.showFieldOverlay(t.field,t.element):this.fieldOverlay&&this.hideElement(this.fieldOverlay)}},300)}highlightComponent(e){if(!this.initialized||!this.highlighter)return;this.highlighter.innerHTML="";let t=!1;for(let i=0;i<e.componentIds.length;i++){let o=`${e.storyId}-${e.componentIds[i]}`,s=n(o);if(s){let n=document.createElement("div");n.setAttribute("class",_),this.highlighter.appendChild(n),this.calculateElementPosition(n,o),t=!0,e.componentId===e.componentIds[i]&&!l(s)&&"u">typeof s.scrollIntoView&&s.scrollIntoView()}}this.highlighter.style.display=t?"block":"none",this.highlighter.style.opacity=+!!t}hoverComponent(e){this.initialized&&this.calculateElementPosition(this.hinter,`${e.storyId}-${e.componentId}`)&&(this.hinter.style.opacity=1,this.hinter.style.display="block")}toggleFocusElement(e,t=!1){let i;if(i=this.overlay,i.contains(e))return;let n=this.inlineEditing.resolvedField;if(this.handleDeselectBlock(),n&&null!=e&&e.contains(n.element)&&null!==this.inlineEditing.fieldSchemas&&(this.inlineEditing.onResolvedField(n),this.showFieldOverlay(n.field,n.element)),!t){e.setAttribute("data-blok-focused",!0),this.showFocusedElement(this.overlay),this.focusState=!1;return}this.focusState||this.sendDataToEditor({action:"noFocus"})}showFocusedElement(e){this.currentUid?(this.showElement(e),this.calculateElementPosition(e,`${this.storyId}-${this.currentUid}`)):this.hideElement(e)}handleBlokActions(e){this.sendDataToEditor({action:e,blok:this.lastBreadcrumbItem}),"addBlockBefore"===e||"addBlockAfter"===e||"copy"===e?this.hideElement(this.actionsMenu):this.hideElement(this.overlay),("moveForward"===e||"moveBackward"===e)&&(this.focusState=!0)}hideElement(e){e.style.display="none"}showElement(e){e.style.display="block"}toggleElement(e){"block"===e.style.display?this.hideElement(e):this.showElement(e)}enterComponent(e){if(!this.initialized)return;let t=n(`${e.storyId}-${e.componentId}`),l=i(t);l&&(this.hinter.style.opacity=0,this.hinter.style.display="none",this.currentUid=l.uid,this.storyId=l.id,this.scrollIntoView(t),this.handleEditedBlok(e))}scrollIntoView(e){e&&!l(e)&&"u">typeof e.scrollIntoView&&setTimeout(()=>{this.initialized&&e.scrollIntoView({behavior:"smooth",block:"start"})},100)}openBlok(e){this.sendDataToEditor({action:"edit",dataC:e,config:this.config})}createComponentContext(){this.createComponentBase(),this.createActionsMenu(),this.createActionsMenuItems(),this.createBreadcrumbsMenu(),this.createActionsMenuButton(),this.createBreadcrumbsMenuButton(),this.createComponentLabel(),this.createComponentButtonLabel()}createComponentBase(){this.componentBase=document.createElement("div"),this.componentBase.setAttribute("class",w),this.componentBase.setAttribute("id",w),this.overlay.append(this.componentBase)}createComponentLabel(){this.componentLabel=document.createElement("span"),this.componentLabel.setAttribute("class",`${w}-label`),this.componentBase.prepend(this.componentLabel)}createComponentButtonLabel(){let e=document.createElement("span");e.setAttribute("class",`${w}-label`),this.breadcrumbsButtonMenu.appendChild(e)}updateComponentLabel(e){document.querySelectorAll(`.${w}-label`).forEach(t=>t.innerText=this.componentNames[e.name]||b(e))}updateComponentBase(e){this.hideElement(this.actionsMenu),this.hideElement(this.breadcrumbsMenu),this.overlay.classList.add(`${B}--clicked`),setTimeout(()=>{this.initialized&&this.overlay.classList.remove(`${B}--clicked`)},400),this.navigationBreadcrumbs.length>1?(this.updateBreadcrumbsMenu(this.navigationBreadcrumbs),this.actionsEnabled?this.updateActionsMenu():(this.componentBase.setAttribute("class",`${w} ${w}--simple`),this.hideElement(this.actionsMenuButton)),this.hideElement(this.componentLabel)):(this.hideElement(this.breadcrumbsButtonMenu),this.hideElement(this.actionsMenuButton),this.showElement(this.componentLabel)),this.updateComponentLabel(e);let t=n(`${this.storyId}-${e.uid}`);t&&this.toggleFocusElement(t)}createBreadcrumbsMenuButton(){this.breadcrumbsButtonMenu=document.createElement("button"),this.breadcrumbsButtonMenu.setAttribute("class",`${w}-btn ${w}-btn-parent`),this.breadcrumbsButtonMenu.prepend(p({viewBox:"0 0 24 24",svgClass:`${w}-svg`,path:"M13.73 14.284l-2.197-2.216 2.197-2.217a1.051 1.051 0 000-1.477 1.03 1.03 0 00-1.465 0l-2.93 2.955a1.043 1.043 0 00-.287.554l-.014.123v.123c.014.247.115.489.301.677l2.93 2.956a1.03 1.03 0 001.465 0 1.051 1.051 0 000-1.478z",pathFill:"#ffffff"})),this.breadcrumbsButtonMenu.addEventListener("click",()=>{this.toggleElement(this.breadcrumbsMenu),this.hideElement(this.actionsMenu)}),this.componentBase.prepend(this.breadcrumbsButtonMenu)}createBreadcrumbsMenu(){this.breadcrumbsMenu=document.createElement("div"),this.breadcrumbsMenu.setAttribute("class",C),this.breadcrumbsMenu.setAttribute("id",C),this.componentBase.append(this.breadcrumbsMenu)}updateBreadcrumbsMenu(e){this.breadcrumbsMenu.innerHTML="";let t=[];for(let i=0;i<e.length;i++){t[i]=document.createElement("button"),t[i].innerHTML=b({display_name:this.componentNames[e[i].component],name:e[i].component});let n=e[i];t[i].addEventListener("click",e=>{e.stopPropagation(),this.currentUid=n._uid,this.openBlok({id:this.storyId,uid:n._uid,name:n.component})}),t[i].classList.add(`${C}__menu-item`),e[i]._uid===this.currentUid&&(t[i].classList.add(`${C}__menu-item--selected`),t[i].setAttribute("disabled",!0)),this.breadcrumbsMenu.appendChild(t[i]),this.breadcrumbsButtonMenu.style.display="flex"}}createActionsMenuButton(){this.actionsMenuButton=document.createElement("button"),this.actionsMenuButton.setAttribute("class",`${w}-btn ${w}-btn-action`),this.actionsMenuButton.setAttribute("aria-label","Block actions"),this.actionsMenuButton.prepend(p({viewBox:"0 0 24 24",svgClass:`${w}-svg`,path:"M7.5 11a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm10 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm-5 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3z",pathFill:"#ffffff"})),this.actionsMenuButton.addEventListener("click",()=>{this.toggleElement(this.actionsMenu),this.breadcrumbsMenu&&this.hideElement(this.breadcrumbsMenu)}),this.componentBase.append(this.actionsMenuButton)}createActionsMenuItems(){this.actionsMenuItems=[{eventFunction:()=>this.handleBlokActions.bind(this,"addBlockBefore"),innerHTML:"Add Block Before",order:0,show:()=>this.canAddBlocks},{eventFunction:()=>this.handleBlokActions.bind(this,"addBlockAfter"),innerHTML:"Add Block After",order:1,show:()=>this.canAddBlocks},{eventFunction:()=>this.handleBlokActions.bind(this,"duplicateBlock"),innerHTML:"Duplicate",order:2,show:()=>this.canAddBlocks},{eventFunction:()=>this.handleBlokActions.bind(this,"copy"),innerHTML:"Copy",order:3,show:()=>"v2"===this.appVersion},{separator:!0,order:4,show:()=>this.canAddBlocks&&this.canMoveForward||!!(this.canMoveBackward&&this.lastBreadcrumbItem._parentindex)},{eventFunction:()=>this.handleBlokActions.bind(this,"moveForward"),innerHTML:"Move Forward",order:5,show:()=>this.canMoveForward},{eventFunction:()=>this.handleBlokActions.bind(this,"moveBackward"),innerHTML:"Move Backward",order:6,show:()=>this.canMoveBackward&&this.lastBreadcrumbItem._parentindex},{separator:!0,order:7,show:()=>this.canAddBlocks&&this.canDeleteBlocks},{eventFunction:()=>this.handleBlokActions.bind(this,"deleteBlock"),className:`${M}__menu-item--delete`,innerHTML:"Delete",order:8,show:()=>this.canDeleteBlocks}]}createActionsMenu(){this.actionsMenu=document.createElement("div"),this.actionsMenu.setAttribute("class",M),this.actionsMenu.setAttribute("id",M),this.componentBase.append(this.actionsMenu)}updateActionsMenu(){this.actionsMenu.innerHTML="";let e=`${M}__menu-item`;this.actionsMenuItems.sort((e,t)=>e.order>t.order?1:t.order>e.order?-1:0).forEach(t=>{if(t.separator&&t.show())return void this.actionsMenu.appendChild(document.createElement("hr"));let i=document.createElement(t.element?t.element:"button");i.classList.add(e),t.className&&i.classList.add(t.className),i.innerHTML=t.innerHTML,t.eventFunction&&i.addEventListener(t.event?t.event:"click",t.eventFunction()),t.show()&&this.actionsMenu.appendChild(i)}),this.actionsMenuButton.style.display="flex"}destroy(){if(this._onMessage&&(window.removeEventListener("message",this._onMessage),this._onMessage=null),this._onMouseMove&&(document.removeEventListener("mousemove",this._onMouseMove),this._onMouseMove=null),this._onWindowClick&&(window.removeEventListener("click",this._onWindowClick),this._onWindowClick=null),this._onWindowDblClick&&(window.removeEventListener("dblclick",this._onWindowDblClick),this._onWindowDblClick=null),null!==this._fieldOverlayRafId&&(cancelAnimationFrame(this._fieldOverlayRafId),this._fieldOverlayRafId=null),this.stopTrackingFieldEditor(),this.outlineOnMoveInterval&&(clearTimeout(this.outlineOnMoveInterval),this.outlineOnMoveInterval=null),null!==this.calcInterval&&(clearInterval(this.calcInterval),this.calcInterval=null),this.initialized&&(O=Math.max(0,O-1)),this.initialized&&0===O){document&&document.body&&document.body.classList.remove(g);try{document.querySelectorAll("[data-blok-focused]").forEach(e=>e.removeAttribute("data-blok-focused"))}catch(e){console.error(e)}this._decoratedElements.forEach(({el:e,previousMinHeight:t})=>{e.removeAttribute("data-blok-c"),e.removeAttribute("data-blok-uid"),e.classList.remove("storyblok__outline"),null!==t&&(""===t?e.style.removeProperty("min-height"):e.style.setProperty("min-height",t),""===e.getAttribute("style")&&e.removeAttribute("style"))});let e=e=>{e&&e.parentNode&&e.parentNode.removeChild(e)};e(this.overlay),e(this.fieldOverlay),e(this.hinter),e(this.highlighter),this.fieldOverlayEditBtn&&this._boundEditBtnClick&&this.fieldOverlayEditBtn.removeEventListener("click",this._boundEditBtnClick),this.fieldOverlay=null,this.fieldOverlayLabel=null,this.fieldOverlayEditBtn=null,this._fieldOverlayText=null,this._boundEditBtnClick=null,e(document.getElementById(E))}this._decoratedElements=[],this.resetAllEvents(),this.inlineEditing.destroy(),this.hinter=null,this.highlighter=null,this.overlay=null,this.componentBase=null,this.componentLabel=null,this.breadcrumbsButtonMenu=null,this.breadcrumbsMenu=null,this.actionsMenu=null,this.actionsMenuButton=null,this.actionsMenuItems=null,this.currentUid=null,this.storyId="",this.navigationBreadcrumbs=[],this.canAddBlocks=!1,this.canMoveForward=!1,this.canMoveBackward=!1,this.canDeleteBlocks=!1,this.focusState=!1,this.actionsEnabled=!1,this.initialized=!1}}var I=Object.defineProperty,A=(e,t,i)=>{let n;return(n="symbol"!=typeof t?t+"":t)in e?I(e,n,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[n]=i};let L=e=>({tag:"success",value:e}),S=e=>({tag:"failure",error:e,path:[]}),$=Symbol("propertyAbsent"),T=Symbol("omitProperty"),z=e=>"string"==typeof e?L(e):S("Not a string");Object.entries({name:z,space:((...e)=>t=>{for(let i of e){let e=i(t);if("success"===e.tag)return L(e.value)}return S("No parser in the union matched")})(e=>e===$?L(T):S("not optional"),e=>typeof e>"u"?L(e):S("Not undefined"),z),uid:z,id:z}),e.s([],44362),e.i(44362),e.s(["default",0,class{constructor(e){A(this,"isInEditor"),A(this,"enterEditmode"),A(this,"pingEditor"),A(this,"on"),A(this,"off"),A(this,"destroy");const t=new F(e);this.isInEditor=()=>t.isInEditor(),this.enterEditmode=e=>{t.enterEditmode(e)},this.pingEditor=e=>{t.pingEditor(e)},this.on=(e,i)=>{t.on(e,i)},this.off=(e,i)=>{t.off(e,i)},this.destroy=()=>{t.destroy()}}}],82926)}]);