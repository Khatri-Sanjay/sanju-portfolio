import {Component, Inject, inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {SidebarService} from '../sidebar/sidebar.service';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {isPlatformBrowser} from '@angular/common';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-utils';
import {SessionStorageUtil} from '../../../../../@core/utils/session-storage-utils';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
  selector: 'app-header',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  private router = inject(Router);

  // State management using signals
  isDarkMode = signal(false);
  isOnline = signal(true);
  unreadNotifications = signal(3);
  searchResults = signal<any[]>([]);
  notifications = signal<any[]>([]);
  userAvatar = signal('../../assets/image/sanjuprofile.png');

  // Component state
  isExpanded = true;
  userFullName = LocalStorageUtil.getStorage()?.userData?.name;
  userEmail = LocalStorageUtil.getStorage()?.userData?.email;
  roleTitle = LocalStorageUtil.getStorage()?.userData?.role;
  showDropdown = false;
  showNotifications = false;
  isSearchFocused = false;
  searchQuery = '';
  private isBrowser: boolean;

  isMobile = signal<boolean>(false);

  constructor(
    private sidebarService: SidebarService,
    @Inject(PLATFORM_ID) platformId: Object,
    private breakpointObserver: BreakpointObserver
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.sidebarService.isExpanded$.subscribe(
      (isExpanded) => this.isExpanded = isExpanded
    );

    this.breakpointObserver.observe([Breakpoints.HandsetPortrait])
      .subscribe(result => {
        this.isMobile.set(result.matches);
      });

    this.initializeNotifications();
  }

  ngOnInit() {

    this.initializeTheme();
  }

  private initializeNotifications() {
    this.notifications.set([
      {
        id: 1,
        type: 'info',
        icon: 'bi bi-info-circle',
        title: 'New Update Available',
        message: 'A new software update is available for download.',
        time: '2 hours ago',
        read: false
      },
      {
        id: 2,
        type: 'success',
        icon: 'bi bi-check-circle',
        title: 'Project Completed',
        message: 'Your project has been successfully completed.',
        time: '5 hours ago',
        read: false
      },
      {
        id: 3,
        type: 'warning',
        icon: 'bi bi-exclamation-circle',
        title: 'Storage Warning',
        message: 'Your storage is almost full. Please free up some space.',
        time: '1 day ago',
        read: false
      }
    ]);
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  toggleTheme() {
    this.isDarkMode.update(value => !value);
    if (this.isBrowser) {
      document.body.classList.toggle('dark-mode');
    }
  }

  private initializeTheme() {
    if (this.isBrowser) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.set(prefersDark);
      if (prefersDark) {
        document.body.classList.add('dark-mode');
      }
    }
  }

  handleSearchBlur() {
    setTimeout(() => {
      this.isSearchFocused = false;
    }, 200);
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  markAllAsRead() {
    this.notifications.update(notifications =>
      notifications.map(notification => ({ ...notification, read: true }))
    );
    this.unreadNotifications.set(0);
    this.toggleNotifications();
  }

  handleImageError() {
    this.userAvatar.set('/assets/img/default-avatar.png');
  }

  viewProfile() {
    this.router.navigate(['/profile']);
    this.showDropdown = false;
  }

  openSettings() {
    this.router.navigate(['/settings']);
    this.showDropdown = false;
  }

  openHelp() {
    this.router.navigate(['/help']);
    this.showDropdown = false;
  }

  onMouseLeave() {
    setTimeout( () => {
      this.showDropdown = false;
    }, 3000)
  }

  logout() {
    LocalStorageUtil.clearStorage();
    SessionStorageUtil.clearStorage();
    this.router.navigate(['/auth/login']);
    this.showDropdown = false;
  }
}
