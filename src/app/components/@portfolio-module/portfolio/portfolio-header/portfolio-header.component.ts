import {Component, HostListener, inject, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-portfolio-header',
  imports: [
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './portfolio-header.component.html',
  standalone: true,
  styleUrl: './portfolio-header.component.scss'
})
export class PortfolioHeaderComponent {
  isScrolled = false;

  router: Router = inject(Router);

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  openInNewTab() {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/portfolio/terminal']));
    window.open(url, '_blank');
  }
}
