import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinner],
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent {
  loginForm: FormGroup;
  signupForm: FormGroup;
  forgotPasswordForm: FormGroup;
  isSignupMode = false;
  isForgotPasswordMode = false;
  forgotPasswordSuccess = false;
  loginError: string = '';
  signupError: string = '';
  resetError: string = '';
  isLoadingLogin: boolean = false;
  isLoadingSignup: boolean = false;
  isLoadingForgot: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value ? null : { mismatch: true };
  }

  async onLogin() {
    if (this.loginForm.valid) {
      try {
        this.loginError = '';
        this.isLoadingLogin = true;
        const { email, password } = this.loginForm.value;
        await this.authService.login(email, password);
        this.router.navigate(['/']);
      } catch (error: any) {
        this.loginError = this.getErrorMessage(error.code);
      } finally {
        this.isLoadingLogin = false;
      }
    }
  }

  async onSignup() {
    if (this.signupForm.valid) {
      try {
        this.signupError = '';
        this.isLoadingSignup = true;
        const { email, password } = this.signupForm.value;
        await this.authService.register(email, password);
        this.router.navigate(['/']);
      } catch (error: any) {
        this.signupError = this.getErrorMessage(error.code);
      } finally {
        this.isLoadingSignup = false;
      }
    }
  }

  async onForgotPassword() {
    if (this.forgotPasswordForm.valid) {
      try {
        this.resetError = '';
        const { email } = this.forgotPasswordForm.value;
        await this.authService.resetPassword(email);
        this.forgotPasswordSuccess = true;
      } catch (error: any) {
        this.resetError = this.getErrorMessage(error.code);
      }
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  }

  private getSocialAuthErrorMessage(errorCode: string, provider: string): string {
    switch (errorCode) {
      case 'auth/popup-closed-by-user':
        return `Sign in with ${provider} was cancelled.`;
      case 'auth/popup-blocked':
        return `Popup was blocked. Please allow popups for this site and try again.`;
      case 'auth/cancelled-popup-request':
        return `Sign in request was cancelled.`;
      case 'auth/account-exists-with-different-credential':
        return `An account already exists with the same email but different sign-in credentials. Try signing in with a different method.`;
      case 'auth/operation-not-allowed':
        return `${provider} sign-in is not enabled. Please contact support.`;
      case 'auth/operation-not-supported-in-this-environment':
        return `${provider} sign-in is not supported in this environment.`;
      default:
        return `Failed to sign in with ${provider}. Please try again.`;
    }
  }

  async onSocialAuth(provider: string) {
    try {
      this.loginError = '';
      this.signupError = '';
      let result;
      if (provider === 'google') {
        result = await this.authService.signInWithGoogle();
      } else if (provider === 'facebook') {
        result = await this.authService.signInWithFacebook();
      } else {
        throw new Error('Unsupported provider');
      }
      this.router.navigate(['/']);
    } catch (error: any) {
      const errorMessage = this.getSocialAuthErrorMessage(error.code, provider);
      if (this.isSignupMode) {
        this.signupError = errorMessage;
      } else {
        this.loginError = errorMessage;
      }
    }
  }

  toggleSignupMode() {
    this.isSignupMode = !this.isSignupMode;
    this.isForgotPasswordMode = false;
    this.forgotPasswordSuccess = false;
  }

  toggleForgotPasswordMode() {
    this.isForgotPasswordMode = !this.isForgotPasswordMode;
    this.forgotPasswordSuccess = false;
  }
}