import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

interface Movie {
  id: number;
  title: string;
  poster?: string;
  rating?: number;
}

interface Category {
  name: string;
  movies: Movie[];
}

@Component({
  selector: 'app-homepage',
  imports: [CommonModule, RouterLink, Header, Footer],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class HomepageComponent {
  // TODO: Replace with API data
  featuredMovies: Movie[] = [
    { id: 1, title: 'Inception', rating: 4.8 },
    { id: 2, title: 'The Dark Knight', rating: 4.9 },
    { id: 3, title: 'Interstellar', rating: 4.7 },
    { id: 4, title: 'Pulp Fiction', rating: 4.6 },
    { id: 5, title: 'The Shawshank Redemption', rating: 4.9 },
    { id: 6, title: 'Forrest Gump', rating: 4.8 }
  ];

  categories: Category[] = [
    {
      name: 'Trending Now',
      movies: [
        { id: 7, title: 'Avatar: The Way of Water', rating: 4.5 },
        { id: 8, title: 'Top Gun: Maverick', rating: 4.7 },
        { id: 9, title: 'Spider-Man: No Way Home', rating: 4.6 },
        { id: 10, title: 'The Batman', rating: 4.4 },
        { id: 11, title: 'Doctor Strange 2', rating: 4.3 },
        { id: 12, title: 'Black Panther: Wakanda Forever', rating: 4.2 }
      ]
    },
    {
      name: 'New Releases',
      movies: [
        { id: 13, title: 'Guardians of the Galaxy Vol. 3', rating: 4.8 },
        { id: 14, title: 'Ant-Man and the Wasp: Quantumania', rating: 4.1 },
        { id: 15, title: 'Cocaine Bear', rating: 3.9 },
        { id: 16, title: 'Dungeons & Dragons', rating: 4.0 },
        { id: 17, title: 'The Super Mario Bros. Movie', rating: 4.3 },
        { id: 18, title: 'John Wick: Chapter 4', rating: 4.6 }
      ]
    },
    {
      name: 'Romantic Picks',
      movies: [
        { id: 19, title: 'The Notebook', rating: 4.5 },
        { id: 20, title: 'Pride & Prejudice', rating: 4.4 },
        { id: 21, title: 'La La Land', rating: 4.2 },
        { id: 22, title: 'Titanic', rating: 4.3 },
        { id: 23, title: 'Crazy Rich Asians', rating: 4.1 },
        { id: 24, title: 'To All the Boys I\'ve Loved Before', rating: 4.0 }
      ]
    },
    {
      name: 'Family Favorites',
      movies: [
        { id: 25, title: 'Finding Nemo', rating: 4.6 },
        { id: 26, title: 'Toy Story 4', rating: 4.5 },
        { id: 27, title: 'The Lion King', rating: 4.7 },
        { id: 28, title: 'Frozen', rating: 4.4 },
        { id: 29, title: 'Moana', rating: 4.3 },
        { id: 30, title: 'Inside Out', rating: 4.5 }
      ]
    },
    {
      name: 'Movie of the Week',
      movies: [
        { id: 31, title: 'The Shawshank Redemption', rating: 4.9 },
        { id: 32, title: 'The Godfather', rating: 4.8 },
        { id: 33, title: 'The Godfather: Part II', rating: 4.7 },
        { id: 34, title: 'The Dark Knight', rating: 4.9 },
        { id: 35, title: '12 Angry Men', rating: 4.6 },
        { id: 36, title: 'Schindler\'s List', rating: 4.8 }
      ]
    }
  ];

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }

  // TODO: Implement API integration methods
  loadFeaturedMovies() {
    // Fetch featured movies from API
    console.log('Loading featured movies...');
  }

  loadCategories() {
    // Fetch categories and movies from API
    console.log('Loading categories...');
  }

  onMovieClick(movie: Movie) {
    // Navigate to movie details or start playback
    console.log('Movie clicked:', movie);
  }

  onCategorySeeAll(category: Category) {
    // Navigate to category page
    console.log('See all for category:', category.name);
  }
}
