import{b as Q,d as q,f as Z,q as X}from"./chunk-KWC7ULRQ.js";import{c as w,d as f,f as m,h as y}from"./chunk-JAKLN4DN.js";import{j as U}from"./chunk-TAGXQ7SO.js";import{b as O}from"./chunk-7TFLVJLV.js";import"./chunk-GGSADDJF.js";import{i as $,j as G,k as R,n as Y,o as J}from"./chunk-4DR4DSTS.js";import{$a as b,$b as V,Ab as x,Hb as l,Ib as r,Jb as F,Nb as C,Rb as _,Sb as p,Wa as H,Wb as k,Xb as P,Yb as M,_b as u,ac as I,bb as a,bc as E,dc as N,ec as K,fa as L,fc as z,ic as A,jc as T,kc as D,lc as W,mb as j,na as h,oa as g,pb as B,sb as d,yb as s}from"./chunk-777UGNZZ.js";import"./chunk-QWWW7GFA.js";var S=class i{sanitizer=L(U);transform(e){return e&&this.sanitizer.bypassSecurityTrustHtml(e.replace(/\n/g,"<br>"))}static \u0275fac=function(t){return new(t||i)};static \u0275pipe=B({name:"lineBreak",type:i,pure:!0})};var ie=["outputContainer"],oe=["commandInput"],ee=i=>({color:i});function ae(i,e){if(i&1){let t=C();l(0,"div",16),_("click",function(){let o=h(t).$implicit,c=p(2);return g(c.changeTheme(o.key))}),u(1),r()}if(i&2){let t=e.$implicit,n=p(2);x("active",n.currentTheme===t.key),a(),I(" ",t.key," ")}}function re(i,e){if(i&1&&(l(0,"div",14),d(1,ae,2,3,"div",15),T(2,"keyvalue"),r()),i&2){let t=p();s("@slideDown",void 0),a(),s("ngForOf",D(2,2,t.themes))}}function se(i,e){if(i&1&&(l(0,"span",21),u(1),r()),i&2){let t=p(2);a(),E(" ",t.username,"","@portfolio",":~$ ")}}function le(i,e){if(i&1&&(l(0,"div",17)(1,"span",18),u(2),T(3,"date"),r(),d(4,se,2,2,"span",19),F(5,"span",20),T(6,"lineBreak"),r()),i&2){let t=e.$implicit,n=p();s("ngStyle",n.getLineStyles(t))("@lineAnimation",void 0),a(2),V(W(3,5,t.timestamp,"hh:mm:ss a")),a(2),s("ngIf",t.type==="command"),a(),s("innerHTML",D(6,8,t.text),H)}}function ce(i,e){if(i&1){let t=C();l(0,"div",24),_("click",function(){let o=h(t).$implicit,c=p(2);return c.currentInput=o,c.showSuggestions=!1,g(c.focusInput())}),u(1),r()}if(i&2){let t=e.$implicit,n=e.index,o=p(2);x("active",n===o.activeSuggestionIndex),a(),I(" ",t," ")}}function pe(i,e){if(i&1&&(l(0,"div",22),d(1,ce,2,3,"div",23),r()),i&2){let t=p();s("@slideUp",void 0),a(),s("ngForOf",t.suggestions)}}var me=[w("lineAnimation",[y(":enter",[m({opacity:0,transform:"translateY(-10px)"}),f("300ms ease-out",m({opacity:1,transform:"translateY(0)"}))])]),w("slideDown",[y(":enter",[m({opacity:0,transform:"translateY(-10px)"}),f("200ms ease-out",m({opacity:1,transform:"translateY(0)"}))]),y(":leave",[f("200ms ease-in",m({opacity:0,transform:"translateY(-10px)"}))])]),w("slideUp",[y(":enter",[m({opacity:0,transform:"translateY(10px)"}),f("200ms ease-out",m({opacity:1,transform:"translateY(0)"}))]),y(":leave",[f("200ms ease-in",m({opacity:0,transform:"translateY(10px)"}))])])],te=class i{outputContainer;commandInput;themes={dark:{background:"#1e1e1e",text:"#c5c8c6",promptColor:"#33cc33",borderColor:"#333",accentColor:"#0077cc"},synthwave:{background:"#2b213a",text:"#ff71ce",promptColor:"#05ffa1",borderColor:"#b967ff",accentColor:"#01cdfe"},github:{background:"#0d1117",text:"#c9d1d9",promptColor:"#58a6ff",borderColor:"#30363d",accentColor:"#238636"},monokai:{background:"#272822",text:"#f8f8f2",promptColor:"#a6e22e",borderColor:"#49483e",accentColor:"#fd971f"},light:{background:"#ffffff",text:"#333333",promptColor:"#0077cc",borderColor:"#cccccc",accentColor:"#28a745"}};username="guest";currentTheme="dark";currentInput="";outputLines=[];commandHistory=[];historyIndex=-1;showThemeMenu=!1;showSuggestions=!1;suggestions=[];activeSuggestionIndex=-1;commands=["help","about","projects","skills","contact","theme","clear","date","whoami","social","education","experience","achievements"];ngOnInit(){this.initializeTerminal()}ngAfterViewChecked(){}handleClick(e){e.target.closest(".theme-toggle")||(this.showThemeMenu=!1),this.focusInput()}handleGlobalKeydown(e){e.ctrlKey&&e.key==="l"&&(e.preventDefault(),this.clearOutput())}handleKeydown(e){switch(e.key){case"Enter":this.executeCommand();break;case"ArrowUp":e.preventDefault(),this.navigateHistory("up");break;case"ArrowDown":e.preventDefault(),this.navigateHistory("down");break;case"Tab":e.preventDefault(),this.handleTabCompletion();break;case"Escape":this.showSuggestions=!1;break;default:this.updateSuggestions()}}navigateHistory(e){e==="up"&&this.historyIndex<this.commandHistory.length-1?(this.historyIndex++,this.currentInput=this.commandHistory[this.historyIndex]):e==="down"&&this.historyIndex>-1&&(this.historyIndex--,this.currentInput=this.historyIndex===-1?"":this.commandHistory[this.historyIndex])}handleTabCompletion(){this.suggestions.length===1?(this.currentInput=this.suggestions[0],this.showSuggestions=!1):this.suggestions.length>1&&(this.activeSuggestionIndex=(this.activeSuggestionIndex+1)%this.suggestions.length,this.currentInput=this.suggestions[this.activeSuggestionIndex])}updateSuggestions(){if(!this.currentInput){this.showSuggestions=!1;return}this.suggestions=this.commands.filter(e=>e.startsWith(this.currentInput.toLowerCase())),this.showSuggestions=this.suggestions.length>0,this.activeSuggestionIndex=-1}getThemeStyles(){let e=this.themes[this.currentTheme];return{"background-color":e.background,color:e.text,"border-color":e.borderColor}}getLineStyles(e){let t=this.themes[this.currentTheme];switch(e.type){case"error":return{color:"#ff5f5f"};case"command":return{color:t.promptColor};case"system":return{color:t.accentColor};case"success":return{color:"#28a745"};default:return{color:t.text}}}toggleThemeMenu(){this.showThemeMenu=!this.showThemeMenu}changeTheme(e){this.themes[e]&&(this.currentTheme=e,this.saveTheme(),this.addOutput(`Theme changed to ${e}`,"success"),this.showThemeMenu=!1)}displayHelp(){this.addOutput(`
      Available commands:
      ------------------
      help        : Show this help message
      about       : Display information about me
      projects    : View my project portfolio
      skills      : List my technical skills
      contact     : Show contact information
      social      : Display social media links
      education   : Show educational background
      experience  : Display work experience
      achievements: List notable achievements
      theme       : Change terminal theme (usage: theme <name>)
      clear       : Clear terminal screen
      date        : Show current date and time
      whoami      : Display current user info

      Tips:
      - Use Tab for command completion
      - Up/Down arrows for command history
      - Ctrl+L to clear screen`,"output")}displayAbout(){this.addOutput(`
      About Me:
      ---------
      I'm a Full Stack Developer passionate about creating innovative web solutions.
      Currently working on modern web applications using Angular, Java.

      Core strengths:
      \u2022 Frontend Development (Angular, TypeScript, Bootstrap)
      \u2022 Backend Development (Java)
      \u2022 Database Design (MySql, MSSQL, Oracle)

      Always learning and exploring new technologies to build better solutions!`,"output")}displayProjects(){this.addOutput(`
      Project Portfolio:
      -----------------
      1. Terminal Portfolio Website
         \u2022 Interactive terminal-style portfolio built with Angular
         \u2022 Features: Theme switching, command history, tab completion
         \u2022 Technologies: Angular, TypeScript, CSS Animations

      2. E-Commerce Platform
         \u2022 Full-stack e-commerce solution with real-time inventory
         \u2022 Features: Admin dashboard, analytics
         \u2022 Technologies: HTML, CSS, JavaScript, PHP
    `,"output")}displaySkills(){this.addOutput(`
      Technical Skills:
      ---------------
      Frontend:
      \u2022 Angular (2+ through latest)
      \u2022 TypeScript/JavaScript
      \u2022 HTML5/CSS3/SASS
      \u2022 Material Design/ Bootstrap

      Backend:
      \u2022 Java
      \u2022 Spring Boot
      \u2022 RESTful APIs

      Database:
      \u2022 MySql
      \u2022 MSSQL
      \u2022 Oracle
      \u2022 Firebase

      DevOps & Tools:
      \u2022 Git/GitHub/GitLab
      \u2022 Bitbucket
    `,"output")}displayContact(){this.addOutput(`
      Contact Information:
      ------------------
      \u{1F4E7} Email: khatrisanjay804@gmail.com
      \u{1F517} LinkedIn: linkedin.com/in/khatri-sanjay/
      \u{1F4F1} Phone: +977-9861494803
      \u{1F310} Website: khatrisanjay.com.np

      Feel free to reach out for collaborations or opportunities!
    `,"output")}displaySocial(){this.addOutput(`
      Social Media Links:
      -----------------
      \u2022 GitHub: github.com/Khatri-Sanjay
      \u2022 LinkedIn: linkedin.com/in/khatri-sanjay
      \u2022 FaceBook: 'https://www.facebook.com/sanjaykhatri180410',
      \u2022 Instagram: 'https://www.instagram.com/_sanjay.khatri/',
    `,"output")}displayEducation(){this.addOutput(`
      Education:
      ---------
      \u{1F393} Bachelor in Computer Application
         \u2022 Tribhuvan University (TU)
         \u2022 Graduation Year: 2024
         \u2022 College: Aadim National College
         \u2022 Location: Chabahil, Kathmandu, Nepal

      \u{1F393} Higher Secondary Education in Computer Science
         \u2022 National Education Board
         \u2022 Graduation Year: 2019
         \u2022 College: Nobel Academy Secondary School
         \u2022 Location: New-Baneshwor, Kathmandu, Nepal

      \u{1F393} Secondary Education
         \u2022 Global Academy English School
         \u2022 Graduation Year: 2017
         \u2022 Location: Bhaktapur, Nepal
    `,"output")}displayExperience(){this.addOutput(`
      Work Experience:
      ----------------
      Software Developer | SB Solutions Pvt. Ltd. (Kathmandu, Nepal)
      Nov 2022 - Present
      \u2022 Engaged in the enhancement of the "Loan Management System," optimizing loan processes for various commercial banks.
      \u2022 Collaborated with cross-functional teams to enhance project efficiency and meet delivery timelines.
      \u2022 Possess proficiency in Angular, TypeScript, JavaScript, and the Java Spring Boot framework.
      \u2022 Applied diverse software development life cycle methodologies, with a particular emphasis on Agile Methodologies.
      \u2022 Specialized in manual testing, including the creation and execution of test cases.

      Software Developer Internship | Aadim Innovation (Chabahil, Kathmandu, Nepal)
      Nov 2022 - Present
      \u2022 Gained foundational knowledge in Angular, TypeScript, JavaScript, and various software development methodologies.
      \u2022 Integrated REST APIs to enhance data connectivity and communication.
      \u2022 Developed foundational skills in Angular, TypeScript, and JavaScript, providing a basis for practical application in development projects.
    `,"output")}displayAchievements(){this.addOutput(`
      Notable Achievements:
      ------------------
      \u2022 Coming Soon
    `,"output")}displayDate(){let t=new Date().toLocaleString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",timeZoneName:"short"});this.addOutput(`Current date and time: ${t}`,"output")}displayWhoami(){this.addOutput(`Current user: ${this.username}`,"output")}handleThemeCommand(e){if(!e.length){this.addOutput(`Available themes: ${Object.keys(this.themes).join(", ")}`,"output");return}let t=e[0];this.themes[t]?(this.currentTheme=t,this.saveTheme(),this.addOutput(`Theme changed to ${t}`,"success")):this.addOutput(`Theme '${t}' not found. Available themes: ${Object.keys(this.themes).join(", ")}`,"error")}initializeTerminal(){this.loadTheme(),this.addOutput('Welcome to my Sanjay terminal portfolio! Type "help" to see available commands.',"system"),this.focusInput(),this.displayWelcome()}displayWelcome(){this.addOutput(`
      <pre class="ascii-art" style="white-space: pre-wrap;">
        __        __   _                            _____
        \\ \\      / /__| | ___ ___  _ __ ___   ___  |_   _|__
         \\ \\ /\\ / / _ \\ |/ __/ _ \\| '_ \` _ \\ / _ \\   | |/ _ \\
          \\ V  V /  __/ | (_| (_) | | | | | |  __/   | | (_) |
         __\\_/\\_/ \\___|_|\\___\\___/|_| |_|_|_|\\___|   |_|\\___/ _             _
        / ___|  __ _ _ __  (_)_   _  |_   _|__ _ __ _ __ ___ (_)_ __   __ _| |
        \\___ \\ / _\` | '_ \\ | | | | |   | |/ _ \\ '__| '_ \` _ \\| | '_ \\ / _\` | |
         ___) | (_| | | | || | |_| |   | |  __/ |  | | | | | | | | | | (_| | |
        |____/ \\__,_|_| |_|/ |\\__,_|   |_|\\___|_|  |_| |_| |_|_|_| |_|\\__,_|_|
                         |__/

      </pre>
                      Welcome to Sanjay Khatri's Portfolio!
      ------------------------------------------------------------
      Type "help"     \u2192  See available commands.
      Type "about"    \u2192  Learn more about me.
      Type "projects" \u2192  Explore my work.
      Type "skills"   \u2192  Discover my expertise.
      ------------------------------------------------------------
    `,"output")}executeCommand(){if(!this.currentInput.trim())return;let e=this.currentInput.trim().toLowerCase();this.commandHistory.unshift(e),this.addOutput(this.currentInput,"command");let[t,...n]=e.split(" "),o=this.getCommandHandler(t);o?o(n):this.addOutput(`Command not found: ${t}. Type "help" for available commands.`,"error"),this.currentInput="",this.historyIndex=-1,this.showSuggestions=!1,this.focusInput(),this.scrollToBottom()}getCommandHandler(e){return{help:()=>this.displayHelp(),about:()=>this.displayAbout(),projects:()=>this.displayProjects(),skills:()=>this.displaySkills(),contact:()=>this.displayContact(),theme:n=>this.handleThemeCommand(n),clear:()=>this.clearOutput(),date:()=>this.displayDate(),whoami:()=>this.displayWhoami(),social:()=>this.displaySocial(),education:()=>this.displayEducation(),experience:()=>this.displayExperience(),achievements:()=>this.displayAchievements()}[e]||null}addOutput(e,t){this.outputLines.push({text:e,type:t,timestamp:new Date,id:this.outputLines.length})}clearOutput(){this.outputLines=[],this.addOutput("Terminal cleared.","system")}focusInput(){this.commandInput&&this.commandInput.nativeElement.focus()}scrollToBottom(){if(this.outputContainer){let e=this.outputContainer.nativeElement;e.scrollTop=e.scrollHeight}}loadTheme(){let e=O.getStorage().terminal_theme;e&&this.themes[e]&&(this.currentTheme=e)}saveTheme(){let e=O.getStorage();e.terminal_theme=this.currentTheme,O.setStorage(e)}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=j({type:i,selectors:[["app-terminal-portfolio"]],viewQuery:function(t,n){if(t&1&&(k(ie,5),k(oe,5)),t&2){let o;P(o=M())&&(n.outputContainer=o.first),P(o=M())&&(n.commandInput=o.first)}},hostBindings:function(t,n){t&1&&_("click",function(c){return n.handleClick(c)},!1,b)("keydown",function(c){return n.handleGlobalKeydown(c)},!1,b)},decls:17,vars:13,consts:[["outputContainer",""],["commandInput",""],[1,"terminal-container",3,"ngStyle"],[1,"terminal-header"],[1,"terminal-title"],[1,"theme-toggle",3,"click"],[1,"theme-icon"],["class","theme-menu",4,"ngIf"],[1,"terminal-output"],["class","output-line",3,"ngStyle",4,"ngFor","ngForOf"],[1,"terminal-input-container"],[1,"prompt",3,"ngStyle"],["type","text","autocomplete","off","spellcheck","false",1,"terminal-input",3,"ngModelChange","keydown","ngModel","ngStyle"],["class","suggestions-container",4,"ngIf"],[1,"theme-menu"],["class","theme-option",3,"active","click",4,"ngFor","ngForOf"],[1,"theme-option",3,"click"],[1,"output-line",3,"ngStyle"],[1,"timestamp"],["class","prompt",4,"ngIf"],[1,"text",3,"innerHTML"],[1,"prompt"],[1,"suggestions-container"],["class","suggestion",3,"active","click",4,"ngFor","ngForOf"],[1,"suggestion",3,"click"]],template:function(t,n){if(t&1){let o=C();l(0,"div",2)(1,"div",3)(2,"div",4),u(3,"Sanjay Terminal Portfolio"),r(),l(4,"div",5),_("click",function(){return h(o),g(n.toggleThemeMenu())}),l(5,"span",6),u(6,"\u{1F3A8}"),r(),d(7,re,3,4,"div",7),r()(),l(8,"div",8,0),d(10,le,7,10,"div",9),r(),l(11,"div",10)(12,"span",11),u(13),r(),l(14,"input",12,1),z("ngModelChange",function(v){return h(o),K(n.currentInput,v)||(n.currentInput=v),g(v)}),_("keydown",function(v){return h(o),g(n.handleKeydown(v))}),r()(),d(16,pe,2,2,"div",13),r()}t&2&&(s("ngStyle",n.getThemeStyles()),a(7),s("ngIf",n.showThemeMenu),a(3),s("ngForOf",n.outputLines),a(2),s("ngStyle",A(9,ee,n.themes[n.currentTheme].promptColor)),a(),E(" ",n.username,"","@portfolio:","~$ "),a(),N("ngModel",n.currentInput),s("ngStyle",A(11,ee,n.themes[n.currentTheme].text)),a(2),s("ngIf",n.showSuggestions))},dependencies:[X,Q,q,Z,$,R,G,Y,J,S],styles:[".terminal-container[_ngcontent-%COMP%]{width:100%;height:100vh;display:flex;flex-direction:column;border:1px solid;font-family:Fira Code,monospace;transition:all .3s ease}.terminal-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;padding:.5rem 1rem;border-bottom:1px solid}.terminal-header[_ngcontent-%COMP%]   .terminal-title[_ngcontent-%COMP%]{font-weight:700}.terminal-header[_ngcontent-%COMP%]   .theme-toggle[_ngcontent-%COMP%]{position:relative;cursor:pointer}.terminal-header[_ngcontent-%COMP%]   .theme-toggle[_ngcontent-%COMP%]   .theme-icon[_ngcontent-%COMP%]{padding:.25rem}.terminal-header[_ngcontent-%COMP%]   .theme-toggle[_ngcontent-%COMP%]   .theme-menu[_ngcontent-%COMP%]{position:absolute;right:0;top:100%;min-width:150px;border:1px solid;border-radius:4px;z-index:1000}.terminal-header[_ngcontent-%COMP%]   .theme-toggle[_ngcontent-%COMP%]   .theme-menu[_ngcontent-%COMP%]   .theme-option[_ngcontent-%COMP%]{padding:.5rem 1rem;transition:background-color .2s}.terminal-header[_ngcontent-%COMP%]   .theme-toggle[_ngcontent-%COMP%]   .theme-menu[_ngcontent-%COMP%]   .theme-option[_ngcontent-%COMP%]:hover{background-color:#ffffff1a}.terminal-header[_ngcontent-%COMP%]   .theme-toggle[_ngcontent-%COMP%]   .theme-menu[_ngcontent-%COMP%]   .theme-option.active[_ngcontent-%COMP%]{font-weight:700}.terminal-output[_ngcontent-%COMP%]{flex:1;overflow-y:auto;padding:1rem;font-size:.9rem;line-height:1.5}.terminal-output[_ngcontent-%COMP%]::-webkit-scrollbar{width:8px}.terminal-output[_ngcontent-%COMP%]::-webkit-scrollbar-track{background:transparent}.terminal-output[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background-color:#fff3;border-radius:4px}.terminal-output[_ngcontent-%COMP%]   .output-line[_ngcontent-%COMP%]{margin-bottom:.5rem;white-space:pre-wrap;word-wrap:break-word}.terminal-output[_ngcontent-%COMP%]   .output-line[_ngcontent-%COMP%]   .timestamp[_ngcontent-%COMP%]{opacity:.5;margin-right:.5rem;font-size:.8rem}.terminal-output[_ngcontent-%COMP%]   .output-line[_ngcontent-%COMP%]   .prompt[_ngcontent-%COMP%]{margin-right:.5rem}.terminal-input-container[_ngcontent-%COMP%]{display:flex;align-items:center;padding:1rem;border-top:1px solid}.terminal-input-container[_ngcontent-%COMP%]   .prompt[_ngcontent-%COMP%]{margin-right:.5rem;white-space:nowrap}.terminal-input-container[_ngcontent-%COMP%]   .terminal-input[_ngcontent-%COMP%]{flex:1;background:transparent;border:none;outline:none;font-family:inherit;font-size:inherit}.suggestions-container[_ngcontent-%COMP%]{position:absolute;bottom:100%;left:0;right:0;max-height:200px;overflow-y:auto;border:1px solid;border-bottom:none;border-radius:4px 4px 0 0}.suggestions-container[_ngcontent-%COMP%]   .suggestion[_ngcontent-%COMP%]{padding:.5rem 1rem;cursor:pointer;transition:background-color .2s}.suggestions-container[_ngcontent-%COMP%]   .suggestion[_ngcontent-%COMP%]:hover, .suggestions-container[_ngcontent-%COMP%]   .suggestion.active[_ngcontent-%COMP%]{background-color:#ffffff1a}"],data:{animation:me}})};export{te as TerminalPortfolioComponent};
