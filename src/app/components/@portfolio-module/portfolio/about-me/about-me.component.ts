import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {PersonalDetails} from '../../../../@core/data/personal-details';
import {skills} from '../../../../@core/data/skills';

@Component({
  selector: 'app-about-me',
  imports: [],
  standalone: true,
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.scss',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class AboutMeComponent implements OnInit {
  text: string = "Hello, I'm Sanjay Khatri";
  displayedText: string = '';
  typingSpeed: number = 100;
  isVisible: boolean = false;
  personalDetails = PersonalDetails;
  skills = skills.getWithOutCategory();

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const scrollPosition = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const aboutSection = document.querySelector('.about-section');

    if (aboutSection) {
      const aboutPosition = aboutSection.getBoundingClientRect().top + scrollPosition;
      this.isVisible = scrollPosition > aboutPosition - windowHeight / 1.3;
    }
  }

  ngOnInit() {
    this.startTyping();
  }

  startTyping() {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < this.text.length) {
        this.displayedText += this.text.charAt(index);
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, this.typingSpeed);
  }
}
