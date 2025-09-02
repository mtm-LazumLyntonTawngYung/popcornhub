import { Component, OnInit, Inject, PLATFORM_ID, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-header-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-bar.component.html',
  styleUrls: []
})
export class HeaderBarComponent implements OnInit {
  @Input() user: { name: string; avatarUrl: string } | null = null;
  @Input() notifications: any[] = [];

  @Output() onLogout = new EventEmitter<void>();
  @Output() onProfile = new EventEmitter<void>();
  @Output() onWatchHistory = new EventEmitter<void>();
  @Output() onMyList = new EventEmitter<void>();
  @Output() onLanguageChange = new EventEmitter<string>();
  @Output() onThemeToggle = new EventEmitter<boolean>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {}

  // Theme management
  isDarkMode = false; // TODO: Load from localStorage or backend

  // Language management
  currentLanguage = 'EN'; // TODO: Load from localStorage or backend
  languages = ['EN', 'ES', 'FR'];

  // Dropdown states
  isLanguageDropdownOpen = false;
  isUserMenuOpen = false;
  isGenresDropdownOpen = false;
  isMobileMenuOpen = false;

  // Navigation links
  navLinks = [
    { label: 'Home', route: '/', active: true },
    { label: 'Movies', route: '/movies', active: false },
    { label: 'Series', route: '/series', active: false },
    { label: 'Genres', route: '/genres', active: false, hasDropdown: true },
    { label: 'New & Trending', route: '/trending', active: false },
    { label: 'My List', route: '/my-list', active: false, highlight: false }
  ];

  genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'];

  ngOnInit() {
    // TODO: Initialize theme, language, and auth status from services
    this.loadTheme();
    this.loadLanguage();
    this.updateMyListHighlight();
  }

  // Theme toggle
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.onThemeToggle.emit(this.isDarkMode);
    // TODO: Apply theme to document and save to localStorage/backend
    this.applyTheme();
  }

  private loadTheme() {
    // TODO: Load theme from localStorage or backend
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      this.isDarkMode = savedTheme === 'dark';
    }
    this.applyTheme();
  }

  private applyTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const root = document.documentElement;
      if (this.isDarkMode) {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }

  // Language switcher
  changeLanguage(lang: string) {
    this.currentLanguage = lang;
    this.isLanguageDropdownOpen = false;
    this.onLanguageChange.emit(lang);
    // TODO: Save language to localStorage/backend and reload translations
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('language', lang);
    }
  }

  private loadLanguage() {
    // TODO: Load language from localStorage or backend
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('language') || 'EN';
      this.currentLanguage = savedLang;
    }
  }

  // Dropdown toggles
  toggleLanguageDropdown() {
    this.isLanguageDropdownOpen = !this.isLanguageDropdownOpen;
    this.closeOtherDropdowns('language');
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    this.closeOtherDropdowns('user');
  }

  toggleGenresDropdown() {
    this.isGenresDropdownOpen = !this.isGenresDropdownOpen;
    this.closeOtherDropdowns('genres');
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  private closeOtherDropdowns(except: string) {
    if (except !== 'language') this.isLanguageDropdownOpen = false;
    if (except !== 'user') this.isUserMenuOpen = false;
    if (except !== 'genres') this.isGenresDropdownOpen = false;
  }

  // Navigation
  setActiveLink(index: number) {
    this.navLinks.forEach((link, i) => link.active = i === index);
  }

  // User actions
  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.onLogout.emit();
    // TODO: Call logout service and update auth status
    console.log('User logged out');
  }

  profile() {
    this.onProfile.emit();
  }

  watchHistory() {
    this.onWatchHistory.emit();
  }

  myList() {
    this.onMyList.emit();
  }

  // Search
  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    // TODO: Implement search functionality
    console.log('Search query:', query);
  }

  // Notifications
  get notificationCount(): number {
    return this.notifications.length;
  }

  // Update My List highlight based on user data
  private updateMyListHighlight() {
    // TODO: Check if user has items in My List from API
    if (this.user) {
      this.navLinks.find(link => link.label === 'My List')!.highlight = true; // Placeholder logic
    }
  }
}