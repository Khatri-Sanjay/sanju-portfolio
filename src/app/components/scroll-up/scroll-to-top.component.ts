import {Component, HostListener, inject, signal} from '@angular/core';
import {DOCUMENT, NgIf} from '@angular/common';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-scroll-to-top',
  imports: [
    NgIf
  ],
  templateUrl: './scroll-to-top.component.html',
  standalone: true,
  styleUrl: './scroll-to-top.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in',
          style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]
})
export class ScrollToTopComponent {
  private document = inject(DOCUMENT);
  isVisible = signal(false);

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isVisible.set(window.pageYOffset > 300);
  }

  scrollToTop() {
    this.document.defaultView?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
