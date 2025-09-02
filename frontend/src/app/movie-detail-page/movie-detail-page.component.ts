import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

// Define interfaces for movie data
interface CastMember {
  name: string;
  role: string;
  image?: string;
}

interface RelatedMovie {
  id: number;
  title: string;
  poster: string;
  rating: number;
}

interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string[];
  rating: number;
  releaseYear: number;
  duration: string;
  director: string;
  cast: CastMember[];
  poster: string;
  trailerUrl: string;
  relatedMovies: RelatedMovie[];
  awards?: string[];
}

@Component({
  selector: 'app-movie-detail-page',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './movie-detail-page.component.html',
  styleUrls: ['./movie-detail-page.component.css']
})
export class MovieDetailPageComponent implements OnInit {
  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) {}

  // Placeholder movie data - replace with API call
  movie: Movie = {
    id: 1,
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
    genre: ['Sci-Fi', 'Action', 'Thriller'],
    rating: 8.8,
    releaseYear: 2010,
    duration: '148 min',
    director: 'Christopher Nolan',
    cast: [
      { name: 'Leonardo DiCaprio', role: 'Dom Cobb', image: 'https://via.placeholder.com/100x150/1a1a1a/ffffff?text=DiCaprio' },
      { name: 'Marion Cotillard', role: 'Mal Cobb', image: 'https://via.placeholder.com/100x150/1a1a1a/ffffff?text=Cotillard' },
      { name: 'Tom Hardy', role: 'Eames', image: 'https://via.placeholder.com/100x150/1a1a1a/ffffff?text=Hardy' }
    ],
    poster: 'https://via.placeholder.com/600x900/1a1a1a/ffffff?text=Inception+Poster',
    trailerUrl: 'https://www.youtube.com/embed/YoHD9XEInc0', // Placeholder YouTube embed URL
    relatedMovies: [
      { id: 2, title: 'Interstellar', poster: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Interstellar', rating: 8.6 },
      { id: 3, title: 'The Dark Knight', poster: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Dark+Knight', rating: 9.0 },
      { id: 4, title: 'Dunkirk', poster: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Dunkirk', rating: 7.9 }
    ],
    awards: ['Academy Award for Best Cinematography', 'Academy Award for Best Sound Mixing']
  };

  isInWatchlist: boolean = false;
  userRating: number = 0;

  get sanitizedTrailerUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.movie.trailerUrl);
  }

  ngOnInit() {
    // Fetch movie data from API based on route parameter
    this.route.params.subscribe(params => {
      const movieId = params['id'];
      this.loadMovie(movieId);
    });
  }

  // Implement API call to load movie details
  loadMovie(id: number) {
    // TODO: Replace with actual API service call
    // this.movieService.getMovie(id).subscribe(movie => this.movie = movie);
    console.log('Loading movie with ID:', id);
    // For now, keep the placeholder data
  }

  watchNow() {
    // TODO: Implement watch functionality - redirect to streaming service or player
    alert('Redirecting to watch ' + this.movie.title);
  }

  addToWatchlist() {
    // TODO: Implement add to watchlist API call
    this.isInWatchlist = !this.isInWatchlist;
    const action = this.isInWatchlist ? 'added to' : 'removed from';
    alert(`${this.movie.title} ${action} watchlist`);
  }

  share() {
    // TODO: Implement share functionality - open social media share dialog
    const url = window.location.href;
    navigator.share?.({
      title: this.movie.title,
      text: `Check out ${this.movie.title} on PopcornHub!`,
      url: url
    }).catch(() => {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(url);
      alert('Movie link copied to clipboard!');
    });
  }

  rateMovie(rating: number) {
    // TODO: Implement rating submission to API
    this.userRating = rating;
    alert(`You rated ${this.movie.title} ${rating} stars`);
  }

  // Helper method for star rating display
  getStars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.floor(rating) ? 1 : (i < rating ? 0.5 : 0));
  }
}