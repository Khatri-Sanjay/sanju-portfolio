import{Ab as a,Jb as r,Kb as c,Lb as g,_a as o,eb as i,pb as s}from"./chunk-QZTINFOT.js";import"./chunk-66YHNWRR.js";var l=class n{typedText="";fullText="Tools Coming Soon...";typingSpeed=150;ngOnInit(){this.startTypingEffect()}startTypingEffect(){let e=0,t=setInterval(()=>{this.typedText+=this.fullText.charAt(e),e++,e===this.fullText.length&&clearInterval(t)},this.typingSpeed)}static \u0275fac=function(t){return new(t||n)};static \u0275cmp=s({type:n,selectors:[["app-tools"]],decls:3,vars:1,consts:[[1,"tools-container"],[1,"coming-soon-message"],[3,"innerHTML"]],template:function(t,p){t&1&&(r(0,"div",0)(1,"div",1),g(2,"span",2),c()()),t&2&&(i(2),a("innerHTML",p.typedText,o))},styles:[".tools-container[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;height:100vh;background-color:#f7f7f7;position:relative;overflow:hidden}.coming-soon-message[_ngcontent-%COMP%]{font-size:2rem;font-weight:700;text-align:center;padding-right:10px;background:linear-gradient(90deg,tomato,#32cd32,#1e90ff,#ff1493);background-size:300% 300%;animation:_ngcontent-%COMP%_typingEffect 4s steps(30) 1s forwards,_ngcontent-%COMP%_moveGradient 8s ease infinite,_ngcontent-%COMP%_subtleGlow 2s ease-in-out infinite alternate;-webkit-background-clip:text;color:transparent;text-shadow:0 0 5px rgba(0,0,0,.2)}@keyframes _ngcontent-%COMP%_typingEffect{0%{width:0}to{width:100%}}@keyframes _ngcontent-%COMP%_moveGradient{0%{background-position:100% 50%}50%{background-position:0% 50%}to{background-position:100% 50%}}@keyframes _ngcontent-%COMP%_subtleGlow{0%{text-shadow:0 0 5px rgba(0,0,0,.2)}50%{text-shadow:0 0 10px rgba(255,255,255,.6),0 0 15px rgba(255,255,255,.3)}to{text-shadow:0 0 5px rgba(0,0,0,.2)}}@media (max-width: 768px){.coming-soon-message[_ngcontent-%COMP%]{font-size:1.5rem}}@media (max-width: 480px){.coming-soon-message[_ngcontent-%COMP%]{font-size:1.2rem}}"]})};export{l as ToolsComponent};
