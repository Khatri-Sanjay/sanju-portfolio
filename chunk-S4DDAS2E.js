import{d as n}from"./chunk-7EQR6UEB.js";import{b as c}from"./chunk-F5PBYKCM.js";import{ba as r,ga as i}from"./chunk-QZTINFOT.js";var o=class e{isAuthenticated(){return!!c.getStorage().userData}static \u0275fac=function(a){return new(a||e)};static \u0275prov=r({token:e,factory:e.\u0275fac,providedIn:"root"})};var u=class e{constructor(t,a){this.authService=t;this.router=a}canActivate(t,a){return this.checkAuth(t)}canActivateChild(t,a){return this.checkAuth(t)}checkAuth(t){return this.authService.isAuthenticated()?t.routeConfig?.path==="login"?(this.router.navigate(["admin/base/dashboard"]),!1):!0:t.routeConfig?.path!=="login"?(this.router.navigate(["auth/login"]),!1):!0}static \u0275fac=function(a){return new(a||e)(i(o),i(n))};static \u0275prov=r({token:e,factory:e.\u0275fac,providedIn:"root"})};export{u as a};
