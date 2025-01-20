import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from '@angular/router';
import {filter} from 'rxjs';
import {NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-breadcrumbs',
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    RouterLink
  ],
  templateUrl: './breadcrumbs.component.html',
  standalone: true,
  styleUrl: './breadcrumbs.component.scss'
})
export class BreadcrumbsComponent implements OnInit{
  breadcrumbs: Array<{ label: string, url: string }> = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
      });
  }

  createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Array<{ label: string, url: string }> = []): Array<{ label: string, url: string }> {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      const nextUrl = `${url}/${routeURL}`;
      if (child.snapshot.data['breadcrumb'] && nextUrl) {
        breadcrumbs.push({ label: child.snapshot.data['breadcrumb'] || routeURL, url: nextUrl });
      }

      return this.createBreadcrumbs(child, nextUrl, breadcrumbs);
    }

    return breadcrumbs;
  }
}
