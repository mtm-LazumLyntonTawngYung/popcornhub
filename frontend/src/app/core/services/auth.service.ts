import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User | null = null;
  private authState = new BehaviorSubject<User | null>(null);
  private sessionTimeout: any;
  private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  constructor(private auth: Auth, @Inject(PLATFORM_ID) private platformId: Object) {
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
      this.authState.next(user);

      if (isPlatformBrowser(this.platformId)) {
        if (user) {
          this.setSessionData(user);
          this.startSessionTimer();
        } else {
          this.clearSessionData();
          this.clearSessionTimer();
        }
      }
    });

    // Check for existing session on app start (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      this.checkExistingSession();
    }
  }

  // Login with email and password
  async login(email: string, password: string): Promise<any> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Register new user
  async register(email: string, password: string): Promise<any> {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw error;
    }
  }

  // Send password reset email
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      throw error;
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.user;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.user !== null;
  }


  // Sign in with Google
  async signInWithGoogle(): Promise<any> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Sign in with Facebook
  async signInWithFacebook(): Promise<any> {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get auth state as observable
  getAuthState(): Observable<User | null> {
    return this.authState.asObservable();
  }

  // Session management methods
  private setSessionData(user: User): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const sessionData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      loginTime: Date.now(),
      provider: user.providerData[0]?.providerId || 'email'
    };
    localStorage.setItem('popcornHub_session', JSON.stringify(sessionData));
  }

  private clearSessionData(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem('popcornHub_session');
  }

  private checkExistingSession(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const sessionData = localStorage.getItem('popcornHub_session');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      const now = Date.now();
      const timeSinceLogin = now - session.loginTime;

      if (timeSinceLogin < this.SESSION_TIMEOUT) {
        // Session is still valid, start timer for remaining time
        this.startSessionTimer();
      } else {
        // Session expired, clear it
        this.clearSessionData();
      }
    }
  }

  private startSessionTimer(): void {
    this.clearSessionTimer();
    this.sessionTimeout = setTimeout(() => {
      this.autoLogout();
    }, this.SESSION_TIMEOUT);
  }

  private clearSessionTimer(): void {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = null;
    }
  }

  private async autoLogout(): Promise<void> {
    try {
      await this.logout();
      // You could emit an event or show a notification here
      console.log('Session expired. User automatically logged out.');
    } catch (error) {
      console.error('Error during auto logout:', error);
    }
  }

  // Get session data
  getSessionData(): any {
    if (!isPlatformBrowser(this.platformId)) return null;
    const sessionData = localStorage.getItem('popcornHub_session');
    return sessionData ? JSON.parse(sessionData) : null;
  }

  // Check if session is about to expire (within 5 minutes)
  isSessionExpiringSoon(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    const sessionData = this.getSessionData();
    if (!sessionData) return false;

    const now = Date.now();
    const timeSinceLogin = now - sessionData.loginTime;
    const timeUntilExpiry = this.SESSION_TIMEOUT - timeSinceLogin;

    return timeUntilExpiry < 5 * 60 * 1000; // 5 minutes
  }

  // Extend session (call this when user performs an action)
  extendSession(): void {
    if (this.user) {
      this.setSessionData(this.user);
      this.startSessionTimer();
    }
  }
}