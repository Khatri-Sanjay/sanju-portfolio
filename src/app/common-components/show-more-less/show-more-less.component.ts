import {Component, computed, input, InputSignal, signal} from '@angular/core';

@Component({
  selector: 'app-show-more-less',
  standalone: true,
  imports: [],
  templateUrl: './show-more-less.component.html',
  styleUrl: './show-more-less.component.scss'
})
export class ShowMoreLessComponent {
// Input signals
  text = input.required<string>();
  wordLimit = input.required<number>();

  // State management
  showMore = signal<boolean>(false);

  // Computed values
  truncatedText = computed(() => {
    if (!this.text() || this.text().length <= this.wordLimit()) {
      return this.text();
    }
    return this.text().substring(0, this.wordLimit());
  });

  isTextTruncated = computed(() => {
    return this.text().length > this.wordLimit();
  });

  // Toggle function
  toggleShowMore(): void {
    this.showMore.update(current => !current);
  }
}
