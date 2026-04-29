import {Component, HostListener, OnInit, signal} from '@angular/core';
import { PersonalDetails } from '../../../../@core/data/personal-details';
import { animate, state, style, transition, trigger } from '@angular/animations';


type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'github';
type AnimationState = 'initial' | 'expanded';

interface SocialLink {
  faceBook: string;
  instagram: string;
  linkedIn: string;
  gitHub: string;
}

@Component({
  imports: [],
  selector: 'app-side-link',
  standalone: true,
  styleUrl: './side-link.component.scss',
  templateUrl: './side-link.component.html',
  animations: [
    trigger('hoverAnimation', [
      state('initial', style({
        width: '50px',
        paddingRight: '15px',
        transform: 'translateX(0)'
      })),
      state('expanded', style({
        width: '180px',
        paddingRight: '20px',
        transform: 'translateX(-10px)'
      })),
      transition('initial <=> expanded', animate('350ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
    trigger('iconAnimation', [
      state('initial', style({
        transform: 'translateX(0) scale(1)',
        marginRight: '0'
      })),
      state('expanded', style({
        transform: 'translateX(5px) scale(1.1)',
        marginRight: '15px'
      })),
      transition('initial <=> expanded', animate('350ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
    trigger('textAnimation', [
      state('initial', style({
        opacity: 0,
        visibility: 'hidden',
        transform: 'translateX(-20px)'
      })),
      state('expanded', style({
        opacity: 1,
        visibility: 'visible',
        transform: 'translateX(0)'
      })),
      transition('initial => expanded', animate('350ms 100ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded => initial', animate('250ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
})
export class SideLinkComponent implements OnInit {
  // Using Angular 19 signals for reactive state management
  socialLink = signal<SocialLink>(PersonalDetails.socialProfiles);
  isExpanded = signal<boolean>(false);
  isMobile = signal<boolean>(false);

  hoverStates = signal<Record<SocialPlatform, AnimationState>>({
    facebook: 'initial',
    instagram: 'initial',
    linkedin: 'initial',
    github: 'initial'
  });

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile.set(window.innerWidth < 768);
  }

  onMouseEnter(platform: SocialPlatform): void {
    if (!this.isMobile()) {
      // Update the specific platform's hover state
      this.hoverStates.update(states => ({
        ...states,
        [platform]: 'expanded'
      }));
      this.isExpanded.set(true);
    }
  }

  onMouseLeave(platform: SocialPlatform): void {
    if (!this.isMobile()) {
      // Reset the specific platform's hover state
      this.hoverStates.update(states => ({
        ...states,
        [platform]: 'initial'
      }));

      // Check if any other platform is still expanded
      const currentStates = this.hoverStates();
      const hasExpandedState = Object.values(currentStates).some(state => state === 'expanded');
      this.isExpanded.set(hasExpandedState);
    }
  }

  trackSocialClick(platform: SocialPlatform): void {
    console.log(`Social click tracked: ${platform}`);
    // Add your analytics tracking logic here
    // Example: this.analytics.track('social_link_click', { platform });
  }
}
