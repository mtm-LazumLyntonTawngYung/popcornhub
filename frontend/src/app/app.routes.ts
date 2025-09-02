import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./homepage/homepage').then(m => m.HomepageComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'browse',
    loadComponent: () => import('./browse/browse').then(m => m.Browse),
    canActivate: [AuthGuard]
  },
  {
    path: 'movie-list',
    loadComponent: () => import('./movie-list/movie-list').then(m => m.MovieList),
    canActivate: [AuthGuard]
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./movie-detail-page/movie-detail-page.component').then(m => m.MovieDetailPageComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./login-page/login-page.component').then(m => m.LoginPageComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile-page/profile-page').then(m => m.ProfilePage),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];
