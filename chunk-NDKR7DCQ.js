import{d as y,e as v}from"./chunk-J6CHASGP.js";import{a as w,b as S,c as s,d as x,e as F,g as E,i as L,j as k,p as N,r as z}from"./chunk-CH4SZA6X.js";import"./chunk-ZZG3LBGU.js";import{a as R}from"./chunk-OQRDK7ZY.js";import{a as T}from"./chunk-IQAZJNIV.js";import{k as O}from"./chunk-IG37ZYJW.js";import{$b as r,Ab as b,Bb as P,Db as p,Hb as t,Ib as o,Jb as l,Sb as h,ab as m,bb as f,jc as M,mb as _,sb as d,yb as g}from"./chunk-NC4VD6ZD.js";import{f as G,g as C}from"./chunk-TSRGIXR5.js";var c=G(R());var j=a=>({"background-color":a});function D(a,i){a&1&&(t(0,"span",10),r(1,"Please enter a valid email"),o())}function K(a,i){a&1&&(t(0,"span",10),r(1,"Password is required"),o())}function B(a,i){a&1&&(l(0,"i",24),r(1," Logging in... "))}function U(a,i){a&1&&r(0," Login ")}var A=class a{constructor(i,n){this.fb=i;this.router=n;this.loginForm=this.fb.group({email:["",[s.required,s.email]],password:["",[s.required,s.minLength(6)]],rememberMe:[!1]})}loginForm;isLoading=!1;showPassword=!1;secretKey=T.LOCAL_STORAGE_KEY;encryptedUsername=c.default.AES.encrypt("admin@admin.com",this.secretKey).toString();encryptedPassword=c.default.AES.encrypt("admin1234",this.secretKey).toString();decrypt(i){return c.default.AES.decrypt(i,this.secretKey).toString(c.default.enc.Utf8)}isFieldInvalid(i){let n=this.loginForm.get(i);return n?.invalid&&(n?.dirty||n?.touched)||!1}onSubmit(){return C(this,null,function*(){if(this.loginForm.valid){this.isLoading=!0;let{email:i,password:n}=this.loginForm.value;try{yield new Promise(I=>setTimeout(I,1500));let e=this.decrypt(this.encryptedUsername),u=this.decrypt(this.encryptedPassword);i===e&&n===u&&this.router.navigate(["admin/base/dashboard"])}catch(e){console.error("Login error:",e)}finally{this.isLoading=!1}}else Object.keys(this.loginForm.controls).forEach(i=>{let n=this.loginForm.get(i);n?.invalid&&n.markAsTouched()})})}static \u0275fac=function(n){return new(n||a)(f(N),f(y))};static \u0275cmp=_({type:a,selectors:[["app-login"]],decls:39,vars:15,consts:[[1,"auth-container"],[1,"auth-card"],[1,"auth-header"],[1,"subtitle"],[1,"auth-form",3,"ngSubmit","formGroup"],[1,"form-group"],["for","email"],[1,"input-container"],[1,"bi","bi-envelope"],["type","email","id","email","formControlName","email","placeholder","Enter your email"],[1,"error-message"],["for","password"],[1,"bi","bi-lock"],["id","password","formControlName","password","placeholder","Enter your password",3,"type"],["type","button",1,"toggle-password",3,"click"],[1,"bi"],[1,"form-footer"],[1,"remember-me"],["type","checkbox","id","remember","formControlName","rememberMe"],["for","remember"],["href","#",1,"forgot-password"],["type","submit",1,"submit-btn",3,"ngStyle","disabled"],[1,"auth-footer"],["routerLink","/auth/register"],[1,"bi","bi-arrow-clockwise","spinning"]],template:function(n,e){n&1&&(t(0,"div",0)(1,"div",1)(2,"div",2)(3,"h2"),r(4,"Welcome Back"),o(),t(5,"p",3),r(6,"Please enter your credentials to login"),o()(),t(7,"form",4),h("ngSubmit",function(){return e.onSubmit()}),t(8,"div",5)(9,"label",6),r(10,"Email"),o(),t(11,"div",7),l(12,"i",8)(13,"input",9),o(),d(14,D,2,0,"span",10),o(),t(15,"div",5)(16,"label",11),r(17,"Password"),o(),t(18,"div",7),l(19,"i",12)(20,"input",13),t(21,"button",14),h("click",function(){return e.showPassword=!e.showPassword}),l(22,"i",15),o()(),d(23,K,2,0,"span",10),o(),t(24,"div",16)(25,"div",17),l(26,"input",18),t(27,"label",19),r(28,"Remember me"),o()(),t(29,"a",20),r(30,"Forgot password?"),o()(),t(31,"button",21),d(32,B,2,0)(33,U,1,0),o()(),t(34,"div",22)(35,"p"),r(36,"Don't have an account? "),t(37,"a",23),r(38,"Sign up"),o()()()()()),n&2&&(m(7),g("formGroup",e.loginForm),m(6),b("error",e.isFieldInvalid("email")),m(),p(e.isFieldInvalid("email")?14:-1),m(6),b("error",e.isFieldInvalid("password")),g("type",e.showPassword?"text":"password"),m(2),P(e.showPassword?"bi-eye-slash":"bi-eye"),m(),p(e.isFieldInvalid("password")?23:-1),m(8),g("ngStyle",M(13,j,e.loginForm.invalid?"grey":""))("disabled",e.loginForm.invalid||e.isLoading),m(),p(e.isLoading?32:33))},dependencies:[z,E,S,w,x,F,L,k,v,O],styles:[".auth-container[_ngcontent-%COMP%]{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem;background:linear-gradient(135deg,#f6f7fb,#edf1f7)}.auth-card[_ngcontent-%COMP%]{background:#fff;border-radius:1rem;box-shadow:0 4px 24px #00000014;width:100%;max-width:440px;padding:2.5rem}.auth-header[_ngcontent-%COMP%]{text-align:center;margin-bottom:2rem}.auth-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:1.75rem;font-weight:600;color:#1a1f36;margin-bottom:.5rem}.auth-header[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%]{color:#6b7280;font-size:.875rem}.auth-form[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]{margin-bottom:1.25rem}.auth-form[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{display:block;font-size:.875rem;font-weight:500;color:#374151;margin-bottom:.5rem}.auth-form[_ngcontent-%COMP%]   .input-container[_ngcontent-%COMP%]{position:relative;display:flex;align-items:center}.auth-form[_ngcontent-%COMP%]   .input-container[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{position:absolute;left:1rem;color:#9ca3af;font-size:1.125rem}.auth-form[_ngcontent-%COMP%]   .input-container[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:100%;padding:.75rem 1rem .75rem 2.75rem;border:1px solid #e5e7eb;border-radius:.5rem;font-size:.875rem;transition:all .2s ease}.auth-form[_ngcontent-%COMP%]   .input-container[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]::placeholder{color:#9ca3af}.auth-form[_ngcontent-%COMP%]   .input-container[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus{outline:none;border-color:#2563eb;box-shadow:0 0 0 3px #2563eb1a}.auth-form[_ngcontent-%COMP%]   .input-container[_ngcontent-%COMP%]   input.error[_ngcontent-%COMP%]{border-color:#ef4444}.auth-form[_ngcontent-%COMP%]   .input-container[_ngcontent-%COMP%]   .toggle-password[_ngcontent-%COMP%]{position:absolute;right:3rem;bottom:2.3rem;background:none;border:none;color:#9ca3af;cursor:pointer;padding:0}.auth-form[_ngcontent-%COMP%]   .input-container[_ngcontent-%COMP%]   .toggle-password[_ngcontent-%COMP%]:hover{color:#6b7280}.auth-form[_ngcontent-%COMP%]   .error-message[_ngcontent-%COMP%]{display:block;color:#ef4444;font-size:.75rem;margin-top:.375rem}.form-footer[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;margin:1.5rem 0}.form-footer[_ngcontent-%COMP%]   .remember-me[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem}.form-footer[_ngcontent-%COMP%]   .remember-me[_ngcontent-%COMP%]   input[type=checkbox][_ngcontent-%COMP%]{width:1rem;height:1rem}.form-footer[_ngcontent-%COMP%]   .remember-me[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{font-size:.875rem;color:#4b5563;margin:0}.form-footer[_ngcontent-%COMP%]   .forgot-password[_ngcontent-%COMP%]{font-size:.875rem;color:#2563eb;text-decoration:none}.form-footer[_ngcontent-%COMP%]   .forgot-password[_ngcontent-%COMP%]:hover{text-decoration:underline}.terms-container[_ngcontent-%COMP%]{display:flex;align-items:flex-start;gap:.5rem;margin:1.5rem 0}.terms-container[_ngcontent-%COMP%]   input[type=checkbox][_ngcontent-%COMP%]{margin-top:.25rem}.terms-container[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{font-size:.875rem;color:#4b5563}.terms-container[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#2563eb;text-decoration:none}.terms-container[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{text-decoration:underline}.submit-btn[_ngcontent-%COMP%]{width:100%;padding:.875rem;background:#2563eb;color:#fff;border:none;border-radius:.5rem;font-size:.875rem;font-weight:500;display:flex;align-items:center;justify-content:center;gap:.5rem;cursor:pointer;transition:all}"]})};export{A as LoginComponent};
