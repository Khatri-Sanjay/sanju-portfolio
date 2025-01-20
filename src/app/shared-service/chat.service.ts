import { Injectable, signal, computed } from '@angular/core';
import { LocalStorage, LocalStorageUtil } from '../@core/utils/local-storage-utils';

export interface ChatMessage {
  text: string;
  isBot: boolean;
  timestamp: Date;
  isTyping?: boolean;
  isDeleted?: boolean;
  messageType?: 'text' | 'image' | 'link' | 'code';
  sender?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chatVisible = signal(false);
  private minimized = signal(false);
  private maximized = signal(false);
  private messages = signal<ChatMessage[]>(this.getStoredMessages());
  private typing = signal(false);

  chatVisible$ = computed(() => this.chatVisible());
  minimized$ = computed(() => this.minimized());
  maximized$ = computed(() => this.maximized());
  messages$ = computed(() => this.messages());
  typing$ = computed(() => this.typing());

  constructor() {
    if (this.messages().length === 0) {
      this.sendBotInitialMessage();
    }
  }

  toggleChat() {
    this.chatVisible.set(!this.chatVisible());
    if (!this.chatVisible()) {
      this.minimized.set(false);
      this.maximized.set(false);
    }
  }

  toggleMinimize() {
    this.minimized.set(!this.minimized());
  }

  toggleMaximized() {
    this.maximized.set(!this.maximized());
  }

  async sendMessage(text: string, messageType: 'text' | 'image' | 'link' | 'code' = 'text') {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      text,
      isBot: false,
      timestamp: new Date(),
      messageType,
      sender: 'user'
    };

    this.messages.update(msgs => [...msgs, userMessage]);
    this.saveMessages();

    // After sending the user's message, trigger the bot response
    await this.simulateBotResponse(text);
  }

  private async simulateBotResponse(userMessage: string) {
    this.typing.set(true);

    // Bot "typing" message
    this.messages.update(msgs => [...msgs, {
      text: '',
      isBot: true,
      timestamp: new Date(),
      isTyping: true,
      sender: 'bot'
    }]);

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

    this.messages.update(msgs => msgs.slice(0, -1)); // Remove "typing" message

    const responses = this.getBotResponse(userMessage);

    this.messages.update(msgs => [...msgs, {
      text: responses,
      isBot: true,
      timestamp: new Date(),
      sender: 'bot',
      messageType: 'text'
    }]);

    this.typing.set(false);
    this.saveMessages();
  }

  private getBotResponse(userMessage: string): string {
    if (
      ['hello', 'helloo', 'hellooo', 'hy', 'hyy', 'hyyy', 'hi', 'hii', 'hiii'].includes(userMessage.toLowerCase())
    ) {
      return '👋 Hi! How can I help you today?';
    }
    else if (userMessage.toLowerCase() === 'help') {
      return 'Here are some commands you can use: \n- help: Show this help message\n- info: Get app info\n- clear: Clear chat history\n- joke: Receive a joke\n- quote: Receive a random quote';
    } else if (userMessage.toLowerCase() === 'info') {
      return 'This is a Portfolio Chat App v1.0 belongs to Sanju ';
    } else if (userMessage.toLowerCase() === 'about') {
      return 'This is a Portfolio Chat App v1.0 belongs to Sanju ';
    } else if (userMessage.toLowerCase() === 'clear') {
      this.clearChat();
      return 'Chat history cleared!';
    } else if (userMessage.toLowerCase() === 'joke') {
      return this.showRandomJoke();
    } else if (userMessage.toLowerCase() === 'quote') {
      return this.getRandomQuote();
    } else if (userMessage.toLowerCase().startsWith('quote')) {
      return this.getQuoteByCategory(userMessage.split(' ')[1]);
    }

    const genericResponses = [
      "I'm here to assist you!",
      "Let me look that up for you.",
      "How can I help further?",
      "Great question! Let me help with that."
    ];

    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
  }

  showRandomJoke() {
    let jokes: string[] = [
      "Why don't skeletons fight each other? They don't have the guts.",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "Why don't oysters donate to charity? Because they are shellfish.",
      "I used to play piano by ear, but now I use my hands.",
      "Why don’t programmers like nature? It has too many bugs."
    ];

    const randomIndex = Math.floor(Math.random() * jokes.length);
    return (jokes[randomIndex]);
  }

  private getRandomQuote(): string {
    const quotes = [
      "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt",
      "The purpose of our lives is to be happy. - Dalai Lama",
      "In the end, it's not the years in your life that count. It's the life in your years. - Abraham Lincoln"
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  private getQuoteByCategory(category: string): string {
    const quotes: { [key: string]: string } = {
      inspiration: "The only way to do great work is to love what you do. - Steve Jobs",
      life: "Life is what happens when you're busy making other plans. - John Lennon",
      success: "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
      love: "Love is not what you say, love is what you do. - Unknown"
    };

    // Normalize the category input to lowercase for consistent matching
    const normalizedCategory = category ? category.toLowerCase() : '';

    // Return the corresponding quote or a default message if category not found
    return quotes[normalizedCategory] || "Category not found! Please try: inspiration, life, success, or love.";
  }

  private sendBotInitialMessage() {
    this.messages.update(msgs => [
      ...msgs,
      {
        text: '👋 Hi! How can I help you today?',
        isBot: true,
        timestamp: new Date(),
        sender: 'bot',
        messageType: 'text'
      }
    ]);
    this.saveMessages();
  }

  private saveMessages() {
    const localStorage = LocalStorageUtil.getStorage();
    localStorage.chatMessages = JSON.stringify(this.messages());
    LocalStorageUtil.setStorage(localStorage);
  }

  private getStoredMessages(): ChatMessage[] {
    const stored = LocalStorageUtil.getStorage().chatMessages;
    return stored ? JSON.parse(stored) : [];
  }

  private clearChat() {
    this.messages.set([]);
    LocalStorageUtil.removeKey('chatMessages');
  }

  deleteMessage(index: number) {
    this.messages.update(msgs => {
      const updatedMessages = [...msgs];
      updatedMessages[index].isDeleted = true;
      return updatedMessages;
    });
    this.saveMessages();
  }
}
