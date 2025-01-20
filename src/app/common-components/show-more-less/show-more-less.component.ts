import {Component, input, InputSignal, signal} from '@angular/core';

@Component({
  selector: 'app-show-more-less',
  standalone: true,
  imports: [],
  templateUrl: './show-more-less.component.html',
  styleUrl: './show-more-less.component.scss'
})
export class ShowMoreLessComponent {

  text: InputSignal<string> = input.required<string>();
  wordLimit: InputSignal<number> = input.required<number>();

  showMore: boolean | false | undefined;

  constructor() {
  }

  ngOnInit(): void {
  }

  showMoreLess() {
    this.showMore = true
  }
}
