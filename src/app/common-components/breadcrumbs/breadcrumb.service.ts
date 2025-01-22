// breadcrumb.interface.ts
export interface Breadcrumb {
  label: string;
  url: string;
  icon?: string;  // Optional icon class (e.g., 'bi bi-house')
  params?: any;
  module?: string;
}

// breadcrumb.service.ts
import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import {BehaviorSubject, debounceTime, Observable} from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private readonly breadcrumbs = new BehaviorSubject<Breadcrumb[]>([]);
  readonly breadcrumbs$: Observable<Breadcrumb[]> = this.breadcrumbs.asObservable();

  private moduleIcons: { [key: string]: string } = {
    'portfolio': 'bi bi-collection',
    'auth': 'bi bi-shield-lock',
    'admin': 'bi bi-gear',
    'tools': 'bi bi-tools',
    'base': 'bi bi-grid',
    'dashboard': 'bi bi-speedometer2',
    'blogs': 'bi bi-pencil-square',
    'users': 'bi bi-people',
    'add-user': 'bi bi-pencil-square',
    'edit-user': 'bi bi-pencil-square',
    'add-blog': 'bi bi-pencil-square',
    'edit-blog': 'bi bi-pencil-square',
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      debounceTime(50),
      distinctUntilChanged()
    ).subscribe(() => {
      const breadcrumbs = this.buildBreadcrumbs(this.activatedRoute.root);
      this.breadcrumbs.next(breadcrumbs);
    });
  }

  private buildBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');

      if (routeURL !== '') {
        url += `/${routeURL}`;

        // Get module name from the route path
        const moduleName = this.getModuleName(url);

        // Get route data
        const routeData = child.snapshot.data;

        if (routeData['breadcrumb']) {
          const breadcrumb: Breadcrumb = {
            label: routeData['breadcrumb'],
            url: url,
            icon: routeData['icon'] || this.moduleIcons[routeURL] || this.moduleIcons[moduleName],
            module: moduleName
          };

          breadcrumbs.push(breadcrumb);
        }
      }

      return this.buildBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  private getModuleName(url: string): string {
    const segments = url.split('/').filter(segment => segment);
    return segments[0] || '';
  }

  // Method to manually update breadcrumb for dynamic content
  updateBreadcrumb(index: number, updates: Partial<Breadcrumb>) {
    const currentBreadcrumbs = this.breadcrumbs.value;
    if (currentBreadcrumbs[index]) {
      currentBreadcrumbs[index] = { ...currentBreadcrumbs[index], ...updates };
      this.breadcrumbs.next([...currentBreadcrumbs]);
    }
  }
}
