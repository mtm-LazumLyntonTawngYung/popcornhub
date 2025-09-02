import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from '@angular/fire/auth';

interface Movie {
  id: string;
  title: string;
  poster: string;
  rating: number;
  year: number;
}

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  subscriptionStatus: string;
}

interface Settings {
  darkMode: boolean;
  language: string;
  emailNotifications: boolean;
}

@Component({
  selector: 'app-profile-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-page.html'
})
export class ProfilePage implements OnInit {
  user: User | null = null;
  userProfile: UserProfile = {
    name: '',
    email: '',
    avatar: '',
    subscriptionStatus: 'Free'
  };
  watchHistory: Movie[] = [
    // Placeholder data - replace with API call
    { id: '1', title: 'Inception', poster: 'https://via.placeholder.com/200x300', rating: 8.8, year: 2010 },
    { id: '2', title: 'The Dark Knight', poster: 'https://via.placeholder.com/200x300', rating: 9.0, year: 2008 },
    { id: '3', title: 'Interstellar', poster: 'https://via.placeholder.com/200x300', rating: 8.6, year: 2014 }
  ];
  watchlist: Movie[] = [
    // Placeholder data - replace with API call
    { id: '4', title: 'Pulp Fiction', poster: 'https://via.placeholder.com/200x300', rating: 8.9, year: 1994 },
    { id: '5', title: 'The Shawshank Redemption', poster: 'https://via.placeholder.com/200x300', rating: 9.3, year: 1994 }
  ];
  settings: Settings = {
    darkMode: true,
    language: 'en',
    emailNotifications: true
  };
  isEditingProfile = false;

  @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.userProfile = {
        name: this.user.displayName || '',
        email: this.user.email || '',
        avatar: this.user.photoURL || '',
        subscriptionStatus: 'Premium' // Placeholder - replace with actual subscription check
      };
    }
    // TODO: Load watch history and watchlist from API
    // this.loadWatchHistory();
    // this.loadWatchlist();
  }

  logout(): void {
    this.authService.logout();
  }

  toggleEditProfile(): void {
    this.isEditingProfile = !this.isEditingProfile;
  }

  saveProfile(): void {
    // TODO: Implement API call to update profile
    console.log('Saving profile:', this.userProfile);
    this.isEditingProfile = false;
  }

  onAvatarChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // TODO: Implement file upload to server
      const reader = new FileReader();
      reader.onload = (e) => {
        this.userProfile.avatar = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  openAvatarInput(): void {
    this.avatarInput.nativeElement.click();
  }

  removeFromWatchHistory(movieId: string): void {
    // TODO: Implement API call to remove from watch history
    this.watchHistory = this.watchHistory.filter(movie => movie.id !== movieId);
  }

  addToFavorites(movieId: string): void {
    // TODO: Implement API call to add to favorites
    console.log('Adding to favorites:', movieId);
  }

  removeFromWatchlist(movieId: string): void {
    // TODO: Implement API call to remove from watchlist
    this.watchlist = this.watchlist.filter(movie => movie.id !== movieId);
  }

  toggleDarkMode(): void {
    this.settings.darkMode = !this.settings.darkMode;
    // TODO: Implement theme switching logic
  }

  changeLanguage(): void {
    // TODO: Implement language change logic
    console.log('Changing language to:', this.settings.language);
  }

  saveSettings(): void {
    // TODO: Implement API call to save settings
    console.log('Saving settings:', this.settings);
  }

  // Placeholder methods for API integration
  private loadWatchHistory(): void {
    // TODO: Fetch watch history from API
  }

  private loadWatchlist(): void {
    // TODO: Fetch watchlist from API
  }

  trackByMovieId(index: number, movie: Movie): string {
    return movie.id;
  }
}
