import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {ResumeTypeTwoComponent} from './resume-type-two/resume-type-two.component';
import {ResumeTypeOneComponent} from './resume-type-one/resume-type-one.component';

@Component({
  selector: 'app-resume',
  imports: [
    ResumeTypeOneComponent,
    ResumeTypeTwoComponent
  ],
  templateUrl: './resume.component.html',
  standalone: true,
  styleUrl: './resume.component.scss'
})
export class ResumeComponent implements AfterViewInit{
  @ViewChild('resumeTypeTabs') tabContainer!: ElementRef;

  ngAfterViewInit() {
    this.setupTabScrolling();
  }

  // Optional: Add smooth horizontal scrolling for tabs on mobile
  setupTabScrolling() {
    const tabContainer = this.tabContainer.nativeElement;

    tabContainer.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      tabContainer.scrollLeft += e.deltaY;
    }, { passive: false });
  }

  // Optional: Track which tab is active
  onTabChange(event: any) {
    const activeTabId = event.target.id;
    console.log(`Active tab: ${activeTabId}`);
    // You can add additional logic here
  }
}
