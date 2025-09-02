import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      // Extend session on route access (only in browser)
      if (isPlatformBrowser(this.platformId)) {
        this.authService.extendSession();

        // Check if session is about to expire
        if (this.authService.isSessionExpiringSoon()) {
          console.warn('Session is about to expire. Consider refreshing or re-authenticating.');
          // You could show a warning toast here
        }
      }

      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}