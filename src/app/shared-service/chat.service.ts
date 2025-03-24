import {computed, Injectable, signal} from '@angular/core';
import {LocalStorageUtil} from '../@core/utils/local-storage-utils';
import {environment} from '../../environment/environment';
import {TensorFlowService} from './tensor-flow.service';

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


  private readonly API_URL = environment.openRouter.URL;
  private readonly API_KEY = environment.openRouter.KEY;
  private readonly API_MODEL = environment.openRouter.MODEL;

  constructor(
    private tfService: TensorFlowService
  ) {
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

    await this.simulateBotResponse(text);
  }

  private async simulateBotResponse(userMessage: string) {
    this.typing.set(true);

    // Add "typing" indicator message
    this.messages.update(msgs => [
      ...msgs,
      { text: '', isBot: true, timestamp: new Date(), isTyping: true, sender: 'bot' }
    ]);

    let response: string | null = null;

    while (!response) {
      response = await this.getBotResponse(userMessage);
      if (!response) {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Wait and retry if response is empty
      }
    }

    this.messages.update(msgs => msgs.slice(0, -1));

    this.messages.update(msgs => [
      ...msgs,
      {
        text: response,
        isBot: true,
        timestamp: new Date(),
        sender: 'bot',
        messageType: 'text'
      }
    ]);

    this.typing.set(false);
    this.saveMessages();
  }

  private async getBotResponse(userMessage: string): Promise<string> {
    const lowerCaseMessage = userMessage.toLowerCase().trim();

    const commandResponses: { [key: string]: string | (() => string) } = {
      // 'hello': '👋 Hi! How can I help you today?',
      // 'hi': '👋 Hi! How can I help you today?',
      'help': `<p>Here are some commands you can use:
                    <br>- help: Show this help message
                    <br>- info: Get app info
                    <br>- clear: Clear chat history
                    <br>- joke: Receive a joke
                    <br>- quote: Receive a random quote
                    <br>- info: Information
                </p>`,
      'info': 'This is a Portfolio Chat App v1.0 belongs to Sanju.',
      'about': 'This is a Portfolio Chat App v1.0 belongs to Sanju.',
      // 'who are you': 'I am Sanjay Khatri, your friendly chatbot. How can I assist you today?',
      // 'how are you': 'I’m doing great, thanks for asking! How about you?',
      'clear': () => { this.clearChat(); return 'Chat history cleared!'; },
      'joke': () => this.getRandomJoke(),
      'quote': () => this.getRandomQuote(),
    };

    if (commandResponses[lowerCaseMessage]) {
      return typeof commandResponses[lowerCaseMessage] === 'function'
        ? (commandResponses[lowerCaseMessage] as () => string)()
        : commandResponses[lowerCaseMessage] as string;
    }

    if (lowerCaseMessage.startsWith('quote ')) {
      return this.getQuoteByCategory(lowerCaseMessage.split(' ')[1]);
    }

    // return await this.openRouterMessage(userMessage);
    return await this.tensorFlow(userMessage);
  }

  private getRandomJoke(): string {
    const jokes = [
      "Why don't skeletons fight each other? They don't have the guts.",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "Why don't oysters donate to charity? Because they are shellfish.",
      "I used to play piano by ear, but now I use my hands.",
      "Why don’t programmers like nature? It has too many bugs."
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
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

    return quotes[category.toLowerCase()] || "Category not found! Please try: inspiration, life, success, or love.";
  }

  private sendBotInitialMessage() {
    this.messages.update(msgs => [...msgs, {
      text: '👋 Hi! How can I help you today?',
      isBot: true,
      timestamp: new Date(),
      sender: 'bot',
      messageType: 'text'
    }]);
    this.saveMessages();
  }

  private saveMessages() {
    const storage = LocalStorageUtil.getStorage();
    storage.chatMessages = JSON.stringify(this.messages());
    LocalStorageUtil.setStorage(storage);
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

  private async fetchAIResponse(endpoint: string, body: any): Promise<any> {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API request failed: ${response.statusText}, Response Body: ${errorBody}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching AI response:", error);
      throw new Error("An error occurred while fetching AI response.");
    }
  }

  private async openRouterMessage(text: string): Promise<string> {
    const body = {
      model: this.API_MODEL,
      messages: [{ role: "user", content: text }]
    };

    try {
      const data = await this.fetchAIResponse(this.API_URL, body);
      console.log('Data from openRouterMessage:', data);
      return data.choices?.[0]?.message?.content || "No response from AI.";
    } catch (error) {
      return "An error occurred while fetching AI response.";
    }
  }

  private async huggingChatMessage(text: string): Promise<string> {
    const body = {
      inputs: text,
      parameters: { max_new_tokens: 30 }
    };

    try {
      const data = await this.fetchAIResponse(`${this.API_URL}/${this.API_MODEL}`, body);
      console.log('HuggingChat Response:', data);
      return data[0]?.generated_text || "No response from AI.";
    } catch (error) {
      return `An error occurred: ${error}`;
    }
  }

  private async tensorFlow(userMessage: string): Promise<string> {
    try {
      return await this.tfService.getResponse(userMessage); // Simply return the response without delay
    } catch (error) {
      console.error('Error getting response:', error);
      return 'Sorry, I encountered an error. Please try again later.';
    }
  }

}
