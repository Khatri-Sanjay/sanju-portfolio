import{C as F,E as b,F as v,G as p,H as $,I as c,K as I,L as E,M as h,N as L,O as N,P as R,Q as P}from"./chunk-OVMOFTWO.js";import{a as A}from"./chunk-WY3PID6X.js";import{a as w}from"./chunk-INXHUJVL.js";import{a as C}from"./chunk-BIHYJGA6.js";import{G as a,aa as O,f as y,fa as B,ga as f,o as d,q as o,v as i}from"./chunk-V2OWRJG2.js";import{a as m,b as u}from"./chunk-66YHNWRR.js";var T=class l{constructor(t){this.firestore=t}static API=w.baseApiUrl;getApi(){return l.API}http=f(C);toastrService=f(A);errorSubject=new y;COLLECTION_NAME="blogs";createBlog(t){try{let e=p(this.firestore,this.COLLECTION_NAME),r=c(e),s=u(m({},t),{createdAt:new Date,updatedAt:new Date,comments:[]});return d(L(r,s)).pipe(i(()=>r.id),a(n=>(console.error("Error creating blog:",n),o(()=>new Error(`Failed to create blog: ${n.message}`)))))}catch(e){return o(()=>new Error(`Failed to create blog: ${e.message}`))}}getAllBlogs(t=1,e=10){try{let r=p(this.firestore,this.COLLECTION_NAME),s=[E("createdAt","desc"),I(e)];t>1&&s.push(N((t-1)*e));let n=h(r,...s);return b(n,{idField:"postId"}).pipe(i(g=>g),a(g=>(console.error("Error fetching blogs:",g),o(()=>new Error(`Failed to fetch blogs: ${g.message}`)))))}catch(r){return o(()=>new Error(`Failed to fetch blogs: ${r.message}`))}}getBlogById(t){try{let e=c(this.firestore,`${this.COLLECTION_NAME}/${t}`);return v(e,{idField:"postId"}).pipe(i(r=>r),a(r=>(console.error("Error fetching blog:",r),o(()=>new Error(`Failed to fetch blog: ${r.message}`)))))}catch(e){return o(()=>new Error(`Failed to fetch blog: ${e.message}`))}}updateBlog(t,e){try{let r=c(this.firestore,`${this.COLLECTION_NAME}/${t}`),s=u(m({},e),{updatedAt:new Date});return d(R(r,s)).pipe(a(n=>(console.error("Error updating blog:",n),o(()=>new Error(`Failed to update blog: ${n.message}`)))))}catch(r){return o(()=>new Error(`Failed to update blog: ${r.message}`))}}deleteBlog(t){try{let e=c(this.firestore,`${this.COLLECTION_NAME}/${t}`);return d($(e)).pipe(a(r=>(console.error("Error deleting blog:",r),o(()=>new Error(`Failed to delete blog: ${r.message}`)))))}catch(e){return o(()=>new Error(`Failed to delete blog: ${e.message}`))}}searchBlogsByTag(t){try{let e=p(this.firestore,this.COLLECTION_NAME),r=h(e,P("tags","array-contains",t),E("createdAt","desc"));return b(r,{idField:"postId"}).pipe(i(s=>s),a(s=>(console.error("Error searching blogs:",s),o(()=>new Error(`Failed to search blogs: ${s.message}`)))))}catch(e){return o(()=>new Error(`Failed to search blogs: ${e.message}`))}}static \u0275fac=function(e){return new(e||l)(B(F))};static \u0275prov=O({token:l,factory:l.\u0275fac,providedIn:"root"})};export{T as a};
