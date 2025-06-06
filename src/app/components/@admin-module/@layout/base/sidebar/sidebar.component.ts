import {Component, HostListener, Inject, inject, OnDestroy, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';
import { SidebarService } from './sidebar.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {filter} from 'rxjs';

interface MenuItemBase {
  id: string;
  label: string;
  icon: string;
  path: string;
}

interface MenuItemWithBadge extends MenuItemBase {
  badge: {
    text: string;
    variant: string;
  };
  children?: never;
}

interface MenuItemWithChildren extends MenuItemBase {
  children: MenuItemBase[];
  badge?: never;
}

interface MenuItemBasic extends MenuItemBase {
  badge?: never;
  children?: never;
}

type MenuItem = MenuItemWithBadge | MenuItemWithChildren | MenuItemBasic;

interface MenuSection {
  title: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [
    trigger('submenuAnimation', [
      state('void', style({
        height: '0',
        opacity: '0'
      })),
      state('*', style({
        height: '*',
        opacity: '1'
      })),
      transition('void <=> *', [
        animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ])
    ])
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {
  private sidebarService = inject(SidebarService);
  private isBrowser: boolean;

  isExpanded = signal(true);
  isMobileExpanded = signal(false);
  userName = 'Sanjay Khatri';
  userRole = 'Super Admin';
  userAvatar = '../../assets/image/sanjuprofile.png';
  expandedMenus: string[] = [];
  private readonly resizeHandler: () => void;

  menuSections = signal<MenuSection[]>([
    {
      title: 'Main Menu',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'bi-grid-fill',
          path: 'dashboard',
          badge: {
            text: 'New',
            variant: 'primary'
          }
        },
        {
          id: 'users',
          label: 'Users',
          icon: 'bi bi-person-lines-fill',
          path: '',
          children: [
            {
              id: 'users-list',
              label: 'User List',
              icon: 'bi bi-person-lines-fill',
              path: 'users',
            },
            {
              id: 'add-user',
              label: 'Add User',
              icon: 'bi bi-person-plus',
              path: 'add-user'
            }
          ]
        },
        {
          id: 'blogs',
          label: 'Blogs',
          icon: 'bi bi-newspaper',
          path: '',
          children: [
            {
              id: 'blog-list',
              label: 'Blog List',
              icon: 'bi bi-file-earmark-text',
              path: 'blogs',
            },
            {
              id: 'add-blog',
              label: 'Add Blog',
              icon: 'bi bi-pencil-square',
              path: 'add-blog'
            }
          ]
        },
      ]
    },
    {
      title: 'Apps',
      items: [
        {
          id: 'finance-tracker',
          label: 'Finance Tracker',
          icon: 'bi bi-wallet',
          path: 'finance-tracker'
        },
        {
          id: 'expense-tracker',
          label: 'Expense Tracker',
          icon: 'bi bi-wallet',
          path: 'expense-tracker'
        },
        {
          id: 'achievement-list',
          label: 'Achievement',
          icon: 'bi bi-wallet',
          path: 'achievement-list'
        },
        {
          id: 'calendar',
          label: 'Calendar',
          icon: 'bi-calendar-event',
          path: 'calendar'
        },
        {
          id: 'messages',
          label: 'Messages',
          icon: 'bi-chat-dots',
          path: 'messages',
          badge: {
            text: '3',
            variant: 'success'
          }
        }
      ]
    }
  ]);

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = window.innerWidth;
    if (width > 768) {
      this.isExpanded.set(true);
    } else if (this.isExpanded) {
      this.isExpanded.set(false);
    }
  }

  constructor(@Inject(PLATFORM_ID) platformId: Object,
              private router: Router) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.resizeHandler = this.handleResize.bind(this);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.handleResize();
    });
    this.handleResize();
  }

  ngOnInit() {
    this.sidebarService.isExpanded$.subscribe(
      expanded => this.isExpanded.set(expanded)
    );

    if (this.isBrowser) {
      window.addEventListener('resize', this.resizeHandler);
      this.handleResize();
    }
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  handleSubmenuClick(item: MenuItem) {
    if ('children' in item) {
      const index = this.expandedMenus.indexOf(item.id);
      if (index === -1) {
        this.expandedMenus.push(item.id);
      } else {
        this.expandedMenus.splice(index, 1);
      }
    }
  }

  handleMenuClick(item: MenuItem) {
    console.log('item::', item);
    if (this.hasChildren(item)) {
      this.handleSubmenuClick(item);
    } else {
      this.handleSubmenuClick(item);
    }
  }

  hasChildren(item: MenuItem): item is MenuItemWithChildren {
    return 'children' in item && Array.isArray(item.children);
  }

  hasBadge(item: MenuItem): item is MenuItemWithBadge {
    return 'badge' in item && item.badge !== undefined;
  }

  handleImageError() {
    this.userAvatar = '/assets/img/default-avatar.png';
  }

  private handleResize() {
    if (this.isBrowser && window.innerWidth <= 768) {
      this.isExpanded.set(false);
    }
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }
}
