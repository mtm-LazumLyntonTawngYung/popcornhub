import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../core/services/auth.service';

interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
  suggestions?: MovieSuggestion[];
}

interface MovieSuggestion {
  id: number;
  title: string;
  poster: string;
  year: number;
  rating: number;
}

@Component({
  selector: 'app-movie-chat-bubble',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-chat-bubble.component.html',
  styleUrl: './movie-chat-bubble.component.css'
})
export class MovieChatBubbleComponent implements OnInit {
  isOpen = false;
  userInput = '';
  isTyping = false;
  private chatHistorySubject = new BehaviorSubject<ChatMessage[]>([]);
  chatHistory$: Observable<ChatMessage[]> = this.chatHistorySubject.asObservable();

  private messageId = 0;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    // Initial welcome message
    this.addMessage('ai', 'Hello! I\'m your movie assistant. Ask me for recommendations, search for titles, or find similar movies!');
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const userMessage = this.userInput.trim();
    this.addMessage('user', userMessage);
    this.userInput = '';

    // Call AI API
    this.callAIAPI(userMessage);
  }

  private addMessage(type: 'user' | 'ai', text: string, suggestions?: MovieSuggestion[]) {
    const message: ChatMessage = {
      id: ++this.messageId,
      type,
      text,
      timestamp: new Date(),
      suggestions
    };
    const currentHistory = this.chatHistorySubject.value;
    this.chatHistorySubject.next([...currentHistory, message]);
  }

  private callAIAPI(userMessage: string) {
    this.isTyping = true;

    const headers: { [key: string]: string } = {};
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      headers['X-User-ID'] = currentUser.uid;
    }

    this.http.post<{ text: string; suggestions?: MovieSuggestion[] }>(
      `${environment.apiUrl}/api/ai-chat`,
      { message: userMessage },
      { headers }
    ).subscribe({
      next: (response) => {
        this.isTyping = false;
        this.addMessage('ai', response.text, response.suggestions);
      },
      error: (error) => {
        this.isTyping = false;
        console.error('AI API error:', error);
        this.addMessage('ai', 'Sorry, I\'m having trouble connecting right now. Please try again later.');
      }
    });
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}