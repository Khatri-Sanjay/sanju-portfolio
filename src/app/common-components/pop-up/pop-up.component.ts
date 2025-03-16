import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-pop-up',
  imports: [
    NgIf,
    NgClass
  ],
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.scss'
})
export class PopUpComponent {
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to proceed?';
  @Input() isVisible: boolean = false;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md'; // Default size is 'md'


  @Output() confirm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit(); // Emit confirm event
    this.isVisible = false;
  }

  onClose() {
    this.close.emit(); // Emit close event
    this.isVisible = false;
  }

  getModalSizeClass(): string {
    switch (this.size) {
      case 'sm': return 'modal-sm';
      case 'lg': return 'modal-lg';
      case 'xl': return 'modal-xl';
      default: return '';
    }
  }
}
