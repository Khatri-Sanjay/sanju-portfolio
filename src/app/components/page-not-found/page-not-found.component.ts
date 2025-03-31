import { Component, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent implements OnDestroy {
  isAdminPageNotFound = false;
  private destroy$ = new Subject<void>();  // 🔹 Cleanup memory leaks

  constructor(private router: Router, private location: Location) {
    this.isAdminPageNotFound = this.router.url.includes('/admin/base/404');

    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isAdminPageNotFound = event.url.includes('/admin/base/404');
      }
    });
  }

  goHome(): void {
    this.router.navigateByUrl(this.isAdminPageNotFound ? '/admin/base/dashboard' : '/');
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
