import{a as D,b as $}from"./chunk-KQOL6FOB.js";import{d as O}from"./chunk-W4KLRBDY.js";import{a as j}from"./chunk-U45NOCXC.js";import{a as F}from"./chunk-6ISKYHQZ.js";import"./chunk-7QMT4KPZ.js";import"./chunk-INXHUJVL.js";import"./chunk-YV3YPEEL.js";import{h as M,n as L}from"./chunk-7RVFBW4V.js";import{Db as f,Ib as _,Jb as B,Kb as x,Lb as C,Mb as n,Nb as o,Ob as m,Sb as I,Wb as h,Xb as c,cb as y,fc as a,gc as d,hb as r,hc as k,ja as g,pc as P,qc as S,ra as u,rc as T,sa as v,sb as w,sc as E,xb as b}from"./chunk-HFT7XNML.js";import"./chunk-66YHNWRR.js";var H=i=>({"liked-post":i}),z=i=>({liked:i}),N=(i,t)=>t.postId;function R(i,t){if(i&1&&m(0,"img",11),i&2){let e=c().$implicit;f("src",e.imageUrl,y)("alt",e.title)}}function U(i,t){i&1&&(n(0,"div",12)(1,"span"),a(2,"Blog"),o()())}function q(i,t){i&1&&(n(0,"div",13),a(1,"\u2764\uFE0F"),o())}function K(i,t){if(i&1&&(n(0,"span",28),a(1),o()),i&2){let e=t.$implicit;r(),k(" ",e," ")}}function Y(i,t){if(i&1&&(n(0,"span",29),a(1),o()),i&2){let e=c().$implicit;r(),k(" +",e.tags.length-5," more ")}}function G(i,t){if(i&1){let e=I();n(0,"div",8)(1,"article",9),h("dblclick",function(){let p=u(e).$implicit,l=c();return v(l.handleDoubleClick(p))}),n(2,"div",10),b(3,R,1,2,"img",11)(4,U,3,0,"div",12)(5,q,2,0,"div",13),n(6,"div",14)(7,"button",15),m(8,"i",16),o()()(),n(9,"div",17)(10,"div",18)(11,"div",19),m(12,"img",20),o(),n(13,"div",21)(14,"h6",22),a(15),o(),n(16,"div",23)(17,"span"),a(18),S(19,"convertToStandardDateTime"),S(20,"date"),o()()()(),n(21,"h5",24),a(22),o(),n(23,"p",25),a(24),o(),n(25,"div",26)(26,"div",27),x(27,K,2,1,"span",28,B),b(29,Y,2,1,"span",29),o(),n(30,"div",30)(31,"div",31)(32,"button",32),h("click",function(p){let l=u(e).$implicit,V=c();return v(V.handleLikeClick(l,p))}),m(33,"i",33),n(34,"span"),a(35),o()(),n(36,"button",34),m(37,"i",35),n(38,"span"),a(39),o()()(),n(40,"a",36),h("click",function(){let p=u(e).$implicit,l=c();return v(l.navigateToPost(p.postId))}),a(41," Read More "),o()()()()()()}if(i&2){let e=t.$implicit,s=c();r(),f("ngClass",P(17,H,s.likedPosts[e.postId])),r(2),_(e.imageUrl?3:4),r(2),_(s.animatingPosts[e.postId]?5:-1),r(10),d("Sanjay Khatri"),r(3),d(E(20,14,T(19,12,e.updatedAt),"medium")),r(4),d(e.title),r(2),d(e.description),r(3),C(e.tags.slice(0,5)),r(2),_(e.tags.length>5?29:-1),r(3),f("ngClass",P(19,z,s.likedPosts[e.postId])),r(),f("ngClass",s.likedPosts[e.postId]?"bi-heart-fill":"bi-heart"),r(2),d((e==null?null:e.likes)||0),r(4),d(e==null||e.comments==null?null:e.comments.length)}}var A=class i{posts=[];filterPost=[];blogService=g(D);router=g(O);toastrService=g(F);spinnerService=g(j);likedPosts={};animatingPosts={};searchTerm="";ngOnInit(){this.spinnerService.show(),this.blogService.getAllBlogs().subscribe(t=>{this.posts=t,this.filterPost=t,console.log("Blogs received:",t),this.spinnerService.hide()},t=>{this.spinnerService.hide(),console.error("Error fetching blogs:",t)},()=>{this.spinnerService.hide(),console.log("Blog request completed")})}onFilterPost(t){this.searchTerm=t.target.value.toLowerCase(),this.applyFilters()}applyFilters(){if(console.log("this.searchTerm",this.searchTerm),this.searchTerm.trim())this.filterPost=this.posts.filter(t=>t.title.toLowerCase().includes(this.searchTerm.toLowerCase())||t.description.toLowerCase().includes(this.searchTerm.toLowerCase()));else{debugger;this.filterPost=[...this.posts]}}navigateToPost(t){this.router.navigate(["/portfolio/post",t])}handleDoubleClick(t){this.likedPosts[t.postId]||(t.likes=(t.likes||0)+1,this.likedPosts[t.postId]=!0,this.showHeartAnimation(t.postId),this.updatePost(t))}handleLikeClick(t,e){e.stopPropagation(),this.likedPosts[t.postId]?(t.likes=Math.max(0,(t.likes||1)-1),this.likedPosts[t.postId]=!1):(t.likes=(t.likes||0)+1,this.likedPosts[t.postId]=!0,this.showButtonAnimation(t.postId)),this.updatePost(t)}showHeartAnimation(t){this.animatingPosts[t]=!0,setTimeout(()=>{this.animatingPosts[t]=!1},1e3)}showButtonAnimation(t){}updatePost(t){this.blogService.updateBlog(t.postId,t).subscribe({next:()=>{},error:e=>this.handleError(e,"Failed to update post."),complete:()=>this.spinnerService.hide()})}handleError(t,e){console.error(t),this.toastrService.error(e),this.spinnerService.hide()}static \u0275fac=function(e){return new(e||i)};static \u0275cmp=w({type:i,selectors:[["app-blog-list"]],decls:12,vars:0,consts:[[1,"container-fluid","container-lg","py-5","py-lg-5"],[1,"text-center","mb-4","mb-lg-5"],[1,"display-4","fw-bold","mb-3"],[1,"lead","text-muted","w-lg-75","mx-auto"],[1,"row","justify-content-center","mb-4"],[1,"col-12","col-md-6"],["type","text","placeholder","Search blog posts...","aria-label","Search blog posts",1,"form-control","search-input",3,"input"],[1,"row","row-cols-1","row-cols-md-2","row-cols-lg-3","g-4"],[1,"col"],[1,"card","h-100","shadow-sm","border-0","transition-hover","post-card",3,"dblclick","ngClass"],[1,"position-relative","image-container"],[1,"card-img-top","object-fit-cover",2,"height","200px",3,"src","alt"],[1,"placeholder-image","d-flex","justify-content-center","align-items-center",2,"height","200px","background-color","#f0f0f0","color","#888","font-size","24px","text-align","center"],[1,"floating-heart"],[1,"position-absolute","top-0","end-0","p-3"],[1,"btn","btn-light","btn-sm","rounded-circle","shadow-sm"],[1,"bi","bi-bookmark"],[1,"card-body","d-flex","flex-column"],[1,"d-flex","align-items-center","mb-3"],[1,"avatar"],["src","assets/image/sanjuprofile.png","alt","Profile Avatar"],[1,"ms-2"],[1,"mb-0","fw-semibold"],[1,"text-muted","small"],[1,"card-title","fw-bold","mb-3"],[1,"card-text","text-muted","flex-grow-1","truncate-text"],[1,"mt-3"],[1,"d-flex","flex-wrap","gap-2","mb-3"],[1,"badge","bg-primary","bg-opacity-10","text-primary","px-3","py-2","rounded-pill"],[1,"badge","bg-secondary","px-3","py-2","rounded-pill"],[1,"d-flex","justify-content-between","align-items-center"],[1,"d-flex","align-items-center","gap-3"],[1,"btn","btn-link","p-0","like-button",3,"click","ngClass"],[1,"bi",3,"ngClass"],[1,"btn","btn-link","text-muted","p-0"],[1,"bi","bi-chat","me-1"],[1,"btn","btn-primary","rounded-pill","px-4",3,"click"]],template:function(e,s){e&1&&(n(0,"div",0)(1,"header",1)(2,"h1",2),a(3,"Latest Blog Posts"),o(),n(4,"p",3),a(5,"Discover insightful articles and stay updated with our latest content"),o()(),n(6,"div",4)(7,"div",5)(8,"input",6),h("input",function(l){return s.onFilterPost(l)}),o()()(),n(9,"div",7),x(10,G,42,21,"div",8,N),o()()),e&2&&(r(10),C(s.filterPost))},dependencies:[L,$,M],styles:[".transition-hover[_ngcontent-%COMP%]{transition:transform .2s ease-in-out}.transition-hover[_ngcontent-%COMP%]:hover{transform:translateY(-5px)}.avatar[_ngcontent-%COMP%]{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#0984e3,#00b894);display:flex;align-items:center;justify-content:center;overflow:hidden;border:3px solid green;position:relative}.avatar[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;object-fit:cover;object-position:center}.like-button[_ngcontent-%COMP%]{position:relative;color:#888;transition:all .2s ease}.like-button.liked[_ngcontent-%COMP%]{color:#ed4956}.like-button.liked[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_heartBeat .5s ease-in-out}@keyframes _ngcontent-%COMP%_heartBeat{0%{transform:scale(1)}15%{transform:scale(1.3)}30%{transform:scale(.95)}45%{transform:scale(1.2)}60%{transform:scale(.95)}to{transform:scale(1)}}.image-container[_ngcontent-%COMP%]{position:relative;cursor:pointer;overflow:hidden}.floating-heart[_ngcontent-%COMP%]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:80px;opacity:0;color:#fff;text-shadow:0 0 10px rgba(0,0,0,.3);pointer-events:none;animation:_ngcontent-%COMP%_instagramHeart 1s ease-in-out forwards;z-index:10}@keyframes _ngcontent-%COMP%_instagramHeart{0%{opacity:0;transform:translate(-50%,-50%) scale(.5)}15%{opacity:.9;transform:translate(-50%,-50%) scale(1.2)}30%{opacity:1;transform:translate(-50%,-50%) scale(.9)}45%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}80%{opacity:.9;transform:translate(-50%,-50%) scale(1)}to{opacity:0;transform:translate(-50%,-50%) scale(1.5)}}.post-card[_ngcontent-%COMP%]{transition:all .3s ease}.post-card.liked-post[_ngcontent-%COMP%]{box-shadow:0 .5rem 1rem #ed49561a!important}.truncate-text[_ngcontent-%COMP%]{display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden}"]})};export{A as BlogListComponent};
