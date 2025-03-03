import {Component, inject, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {animate, query, style, transition, trigger} from '@angular/animations';
import {Meta, Title} from '@angular/platform-browser';
import {filter} from 'rxjs';
import {map} from 'rxjs/operators';
import {SpinnerComponent} from './common-components/spinner/spinner.component';
import {PersonalDetails} from './@core/data/personal-details';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SpinnerComponent],
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
  metaService: Meta = inject(Meta);

  socialProfiles = PersonalDetails.socialProfiles;

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
          const formattedTitle = title?.trim().toLowerCase();
          const pageTitle = (formattedTitle !== 'home' && formattedTitle !== 'portfolio')
            ? `Sanjay Khatri - ${title}`
            : 'Sanjay Khatri';

          this.titleService.setTitle(pageTitle);
        })
      )
      .subscribe();

    this.setSocialMediaTags();

  }

  setSocialMediaTags() {
    const title = 'Sanjay Khatri | Frontend Developer | Angular Expert';
    const description = 'Explore my portfolio, projects, and skills in Angular and Java Spring Boot.';
    const imageUrl = 'https://khatrisanjay.com.np/assets/image/sanjay2.png';
    const websiteUrl = this.socialProfiles.personalWebsite;

    this.titleService.setTitle(title);

    this.metaService.updateTag({ name: 'description', content: description });

    // Open Graph (Facebook, LinkedIn)
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:image', content: imageUrl });
    this.metaService.updateTag({ property: 'og:url', content: websiteUrl });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });

    // Twitter Card
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: imageUrl });

    // Social Profile Links (Custom Meta)
    Object.entries(this.socialProfiles).forEach(([key, value]) => {
      if (value) {
        this.metaService.updateTag({ name: `profile:${key.toLowerCase()}`, content: value });
      }
    });

    // Schema.org JSON-LD for SEO
    this.addSchemaOrgJsonLd();
  }

  addSchemaOrgJsonLd() {
    const schemaJson = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Sanjay Khatri",
      "url": this.socialProfiles.personalWebsite,
      "sameAs": Object.values(this.socialProfiles).filter(link => link) // Only include non-empty values
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaJson);
    document.head.appendChild(script);
  }
}
