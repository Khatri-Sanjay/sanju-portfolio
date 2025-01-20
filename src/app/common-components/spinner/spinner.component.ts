import {Component, inject, Input, OnInit} from '@angular/core';
import {NgStyle} from '@angular/common';
import {SpinnerService} from './service/spinner.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent implements OnInit {
  isLoading = false;

  spinnerService: SpinnerService = inject(SpinnerService);

  ngOnInit() {
    this.spinnerService.loading$.subscribe(loading => {
      this.isLoading = loading;
    });
  }
}
