import {Component, OnInit} from '@angular/core';
import { RouterLink} from '@angular/router';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Breadcrumb, BreadcrumbService} from './breadcrumb.service';
import {animate, style, transition, trigger} from '@angular/animations';

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
  styleUrl: './breadcrumbs.component.scss',
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class BreadcrumbsComponent implements OnInit{
  breadcrumbs: Breadcrumb[] = [];

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.breadcrumbService.breadcrumbs$.subscribe(
      breadcrumbs => this.breadcrumbs = breadcrumbs
    );
  }

  isLast(breadcrumb: Breadcrumb): boolean {
    return this.breadcrumbs.indexOf(breadcrumb) === this.breadcrumbs.length - 1;
  }
}
