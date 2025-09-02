import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: []
})
export class Header implements OnInit, OnDestroy {
  private authSubscription: Subscription = new Subscription();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private authService: AuthService
  ) {}

  // Theme management
  isDarkMode = false; // TODO: Load from localStorage or backend

  // Language management
  currentLanguage = 'EN'; // TODO: Load from localStorage or backend
  languages = ['EN', 'ES', 'FR'];

  // User authentication
  isLoggedIn = false;
  userAvatar = 'https://via.placeholder.com/32';
  userName = '';
  userEmail = '';

  // Dropdown states
  isLanguageDropdownOpen = false;
  isUserMenuOpen = false;
  isMobileMenuOpen = false;

  // Navigation links
  navLinks = [
    { label: 'Home', route: '/', active: true },
    { label: 'Movies', route: '/movie-list', active: false }
  ];


  ngOnInit() {
    this.loadTheme();
    this.loadLanguage();

    // Subscribe to authentication state changes
    this.authSubscription.add(
      this.authService.getAuthState().subscribe((user) => {
        this.isLoggedIn = !!user;
        if (user) {
          this.userName = user.displayName || user.email?.split('@')[0] || 'User';
          this.userEmail = user.email || '';
          this.userAvatar = user.photoURL || 'https://via.placeholder.com/32';
        } else {
          this.userName = '';
          this.userEmail = '';
          this.userAvatar = 'https://via.placeholder.com/32';
        }
      })
    );
  }

  // Theme toggle
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
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

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  private closeOtherDropdowns(except: string) {
    if (except !== 'language') this.isLanguageDropdownOpen = false;
    if (except !== 'user') this.isUserMenuOpen = false;
  }

  // Navigation
  setActiveLink(index: number) {
    this.navLinks.forEach((link, i) => link.active = i === index);
  }

  // User actions
  login() {
    this.router.navigate(['/login']);
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  // Search
  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    // TODO: Implement search functionality
    console.log('Search query:', query);
  }

}