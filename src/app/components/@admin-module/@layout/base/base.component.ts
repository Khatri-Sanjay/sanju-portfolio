import {Component, inject, NgZone, PLATFORM_ID, signal} from '@angular/core';
import {SidebarService} from './sidebar/sidebar.service';
import {FooterComponent} from './footer/footer.component';
import {Router, RouterOutlet} from '@angular/router';
import {SidebarComponent} from './sidebar/sidebar.component';
import {isPlatformBrowser} from '@angular/common';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-utils';
import {HeaderComponent} from './header/header.component';
import {interval, Subject, takeUntil} from 'rxjs';
import {BreadcrumbsComponent} from "../../../../common-components/breadcrumbs/breadcrumbs.component";

@Component({
  selector: 'app-base',
    imports: [
        FooterComponent,
        RouterOutlet,
        SidebarComponent,
        HeaderComponent,
        BreadcrumbsComponent
    ],
  templateUrl: './base.component.html',
  standalone: true,
  styleUrl: './base.component.scss'
})
export class BaseComponent {
  isExpanded = true;
  userFullName = 'Sanjay Khatri';
  roleTitle = 'Super Admin';
  showDropdown: boolean = false;
  storage = LocalStorageUtil.getStorage();

  router: Router = inject(Router);

  constructor(private sidebarService: SidebarService) {
    this.sidebarService.isExpanded$.subscribe(
      (isExpanded) => this.isExpanded = isExpanded
    );
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  viewProfile() {

  }

  logout() {
    this.router.navigate(['/login']);
  }

  currentYear = new Date().getFullYear();

  private readonly ngZone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private destroy$ = new Subject<void>();

  displayedText = signal('');
  isTyping = signal(false);

  readonly text = 'Designed & Powered by Sanjay Khatri';
  readonly typingSpeed = 100;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startTyping();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private startTyping(): void {
    this.ngZone.runOutsideAngular(() => {
      let index = 0;
      this.isTyping.set(true);

      const typingInterval = interval(this.typingSpeed)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          if (index < this.text.length) {
            this.ngZone.run(() => {
              this.displayedText.update(value => value + this.text.charAt(index));
            });
            index++;
          } else {
            typingInterval.unsubscribe();
            this.ngZone.run(() => {
              this.isTyping.set(false);
            });

            setTimeout(() => {
              this.ngZone.run(() => {
                this.displayedText.set('');
                this.startTyping();
              });
            }, 5000);
          }
        });
    });
  }
}
