import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-tools',
  imports: [],
  templateUrl: './tools.component.html',
  standalone: true,
  styleUrl: './tools.component.scss'
})
export class ToolsComponent implements OnInit{
  typedText: string = '';
  fullText: string = 'Tools Coming Soon...'; // The text that will be typed
  typingSpeed: number = 150; // Speed of typing in milliseconds

  ngOnInit() {
    this.startTypingEffect();
  }

  startTypingEffect() {
    let index = 0;
    const typingInterval = setInterval(() => {
      this.typedText += this.fullText.charAt(index);
      index++;
      if (index === this.fullText.length) {
        clearInterval(typingInterval); // Stop typing when finished
      }
    }, this.typingSpeed);
  }
}
