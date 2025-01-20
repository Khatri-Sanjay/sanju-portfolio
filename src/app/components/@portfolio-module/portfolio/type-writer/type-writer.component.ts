import {Component, inject, NgZone, OnInit} from '@angular/core';

@Component({
  selector: 'app-type-writer',
  imports: [],
  templateUrl: './type-writer.component.html',
  standalone: true,
  styleUrl: './type-writer.component.scss'
})
export class TypeWriterComponent implements OnInit{
  titles: string[] = [
    'console.log("Lives in Kathmandu, Nepal");',
    'Console.Write("Creator of intuitive and user friendly solutions");',
    'npm install --save-dev sanju'
  ];

  typeText: string = '';
  private currentTitleIndex = 0;
  private currentCharIndex = 0;
  private typingForward = true;

  ngZone: NgZone = inject(NgZone);

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => this.startTypingEffect());
  }

  private startTypingEffect(): void {
    setInterval(() => {
      const currentTitle = this.titles[this.currentTitleIndex];
      const length = currentTitle.length;

      if (this.typingForward) {
        this.typeText = currentTitle.slice(0, this.currentCharIndex + 1);
        this.currentCharIndex++;
      } else {
        this.typeText = currentTitle.slice(0, this.currentCharIndex - 1);
        this.currentCharIndex--;
      }

      if (this.currentCharIndex === length + 1) {
        this.typingForward = false;
      } else if (this.currentCharIndex === 0) {
        this.typingForward = true;
        this.currentTitleIndex = (this.currentTitleIndex + 1) % this.titles.length;
      }

      this.ngZone.run(() => {});
    }, 100);
  }
}
