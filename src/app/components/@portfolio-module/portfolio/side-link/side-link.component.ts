import { Component, HostListener, OnInit } from '@angular/core';
import { PersonalDetails } from '../../../../@core/data/personal-details';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';

type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'github';

type AnimationState = 'initial' | 'expanded';

@Component({
  imports: [CommonModule],
  selector: 'app-side-link',
  standalone: true,
  styleUrl: './side-link.component.scss',
  templateUrl: './side-link.component.html',
  animations: [
    trigger('hoverAnimation', [
      state('initial', style({
        width: '50px',
        paddingRight: '15px'
      })),
      state('expanded', style({
        width: '160px',
        paddingRight: '25px' // Reduced padding to prevent excessive space
      })),
      transition('initial <=> expanded', animate('300ms ease'))
    ]),
    trigger('iconAnimation', [
      state('initial', style({
        transform: 'translateX(0)'
      })),
      state('expanded', style({
        transform: 'translateX(0)' // Keep icon in place instead of moving left
      })),
      transition('initial <=> expanded', animate('300ms ease'))
    ]),
    trigger('textAnimation', [
      state('initial', style({
        opacity: 0,
        visibility: 'hidden',
        transform: 'translateX(10px)'
      })),
      state('expanded', style({
        opacity: 1,
        visibility: 'visible',
        transform: 'translateX(45px)' // Adjust position to ensure text is properly placed
      })),
      transition('initial <=> expanded', animate('300ms ease'))
    ])
  ],
})
export class SideLinkComponent implements OnInit {

  socialLink = PersonalDetails.socialProfiles;
  isExpand = false;

  hoverStates: Record<SocialPlatform, AnimationState> = {
    facebook: 'initial',
    instagram: 'initial',
    linkedin: 'initial',
    github: 'initial'
  };

  isMobile: boolean = false;

  constructor() {}

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  onMouseEnter(platform: SocialPlatform) {
    if (!this.isMobile) {
      this.hoverStates[platform] = 'expanded';
      this.isExpand = true;
    }
  }

  onMouseLeave(platform: SocialPlatform) {
    this.hoverStates[platform] = 'initial';
    this.isExpand = false;
  }

  trackSocialClick(platform: SocialPlatform) {
    console.log(`Social click: ${platform}`);
  }
}
