import {Component, inject, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {animate, query, style, transition, trigger} from '@angular/animations';
import {Title} from '@angular/platform-browser';
import {filter} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            animate(
              '0.5s ease-in-out',
              style({ opacity: 1, transform: 'translateY(0)' })
            ),
          ],
          { optional: true }
        ),
        query(
          ':leave',
          [
            animate(
              '0.3s ease-in-out',
              style({ opacity: 0, transform: 'translateY(-20px)' })
            ),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ]
})
export class AppComponent implements OnInit{

  router: Router = inject(Router);
  titleService: Title = inject(Title);

  prepareRoute(outlet: any) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.router.routerState.root;
          let title = '';
          let description = '';
          while (route.firstChild) {
            route = route.firstChild;
            if (route.snapshot.data['title']) {
              title = route.snapshot.data['title'];
              description = route.snapshot.data['description'];
            }
          }
          this.titleService.setTitle(title || 'Default Title');
        })
      )
      .subscribe();
  }
}
