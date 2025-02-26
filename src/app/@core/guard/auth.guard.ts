import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild
} from '@angular/router';
import { AuthService } from '../../shared-service/@api-services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkAuth(route);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkAuth(route);
  }

  private checkAuth(route: ActivatedRouteSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      if (route.routeConfig?.path === 'login') {
        this.router.navigate(['admin/base/dashboard']);
        return false;
      }
      return true;
    }

    if (route.routeConfig?.path !== 'login') {
      this.router.navigate(['auth/login']);
      return false;
    }

    return true;
  }
}
