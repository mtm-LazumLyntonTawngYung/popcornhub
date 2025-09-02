import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';

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

    // Simulate AI response
    this.simulateAIResponse(userMessage);
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

  private simulateAIResponse(userMessage: string) {
    this.isTyping = true;

    // Simulate typing delay
    setTimeout(() => {
      this.isTyping = false;

      let response = '';
      let suggestions: MovieSuggestion[] | undefined;

      if (userMessage.toLowerCase().includes('recommend')) {
        response = 'Based on popular trends, here are some great recommendations:';
        suggestions = [
          { id: 1, title: 'The Shawshank Redemption', poster: 'https://via.placeholder.com/100x150/1a1a1a/ffffff?text=Shawshank', year: 1994, rating: 9.3 },
          { id: 2, title: 'Inception', poster: 'https://via.placeholder.com/100x150/1a1a1a/ffffff?text=Inception', year: 2010, rating: 8.8 },
          { id: 3, title: 'The Dark Knight', poster: 'https://via.placeholder.com/100x150/1a1a1a/ffffff?text=Dark+Knight', year: 2008, rating: 9.0 }
        ];
      } else if (userMessage.toLowerCase().includes('search') || userMessage.toLowerCase().includes('find')) {
        response = 'I found some movies matching your query:';
        suggestions = [
          { id: 4, title: 'Pulp Fiction', poster: 'https://via.placeholder.com/100x150/1a1a1a/ffffff?text=Pulp+Fiction', year: 1994, rating: 8.9 },
          { id: 5, title: 'Forrest Gump', poster: 'https://via.placeholder.com/100x150/1a1a1a/ffffff?text=Forrest+Gump', year: 1994, rating: 8.8 }
        ];
      } else if (userMessage.toLowerCase().includes('similar')) {
        response = 'Here are some similar movies you might enjoy:';
        suggestions = [
          { id: 6, title: 'Interstellar', poster: 'https://via.placeholder.com/100x150/1a1a1a/ffffff?text=Interstellar', year: 2014, rating: 8.6 },
          { id: 7, title: 'The Matrix', poster: 'https://via.placeholder.com/100x150/1a1a1a/ffffff?text=Matrix', year: 1999, rating: 8.7 }
        ];
      } else {
        response = 'I\'m here to help with movie recommendations, searches, and suggestions. What would you like to know?';
      }

      this.addMessage('ai', response, suggestions);

      // Placeholder for AI API integration
      // TODO: Replace with actual AI API call (e.g., OpenAI, custom recommendation API)
      // Example:
      // this.callAIAPI(userMessage).subscribe(aiResponse => {
      //   this.addMessage('ai', aiResponse.text, aiResponse.suggestions);
      // });
    }, 1500);
  }

  // Placeholder method for AI API integration
  private callAIAPI(message: string): Observable<{ text: string; suggestions?: MovieSuggestion[] }> {
    // TODO: Implement actual API call
    // Example with HttpClient:
    // return this.http.post<{ text: string; suggestions?: MovieSuggestion[] }>('/api/ai-chat', { message });
    throw new Error('AI API not implemented yet');
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}