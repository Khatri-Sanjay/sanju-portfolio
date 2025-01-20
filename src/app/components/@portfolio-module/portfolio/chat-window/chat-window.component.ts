import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {FormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {ChatService} from '../../../../shared-service/chat.service';


interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

@Component({
  selector: 'app-chat-window',
  imports: [
    FormsModule,
    DatePipe
  ],
  templateUrl: './chat-window.component.html',
  standalone: true,
  styleUrl: './chat-window.component.scss',
  animations: [
    trigger('widgetAnimation', [
      state('void', style({
        transform: 'translateY(20px)',
        opacity: 0
      })),
      state('*', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('void <=> *', animate('200ms ease-out'))
    ])
  ],
})
export class ChatWindowComponent implements OnInit{

  @ViewChild('scrollContainer') private scrollContainer: ElementRef | undefined;
  currentMessage = '';

  chatService: ChatService = inject(ChatService);

  ngOnInit() {
    this.scrollToBottom();
  }

  async sendMessage() {
    this.scrollToBottom();
    if (this.currentMessage.trim()) {
      await this.chatService.sendMessage(this.currentMessage);
      this.currentMessage = '';
    }
  }

  isMinimized = false;
  isMaximized = false;

  minimize() {
    this.isMinimized = !this.isMinimized;
    if (this.isMaximized) {
      this.isMaximized = false;
      this.chatService.toggleMaximized();
    }
    this.chatService.toggleMinimize();
  }

  toggleMaximize() {
    this.isMaximized = !this.isMaximized;
    if (this.isMinimized) {
      this.isMinimized = false;
      this.chatService.toggleMinimize();
    }
    this.chatService.toggleMaximized();
  }

  close() {
    this.chatService.toggleChat();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 0);
  }
}
