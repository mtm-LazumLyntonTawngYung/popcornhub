import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { MovieChatBubbleComponent } from '../movie-chat-bubble/movie-chat-bubble.component';

interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string;
  rating: number;
  poster: string;
  description: string;
  trailer?: string;
}

@Component({
  selector: 'app-movie-list',
  imports: [CommonModule, FormsModule, Header, Footer, MovieChatBubbleComponent],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css'
})
export class MovieList implements OnInit {
  movies: Movie[] = [
    { id: 1, title: 'Inception', year: 2010, genre: 'Sci-Fi', rating: 8.8, poster: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Inception', description: 'A thief who steals corporate secrets through dream-sharing technology.' },
    { id: 2, title: 'The Dark Knight', year: 2008, genre: 'Action', rating: 9.0, poster: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Dark+Knight', description: 'Batman faces the Joker in a battle for Gotham\'s soul.' },
    { id: 3, title: 'Interstellar', year: 2014, genre: 'Sci-Fi', rating: 8.6, poster: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Interstellar', description: 'A team of explorers travel through a wormhole in space.' },
    { id: 4, title: 'Pulp Fiction', year: 1994, genre: 'Crime', rating: 8.9, poster: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Pulp+Fiction', description: 'The lives of two mob hitmen intertwine with those of a boxer and a pair of diner bandits.' },
    { id: 5, title: 'The Shawshank Redemption', year: 1994, genre: 'Drama', rating: 9.3, poster: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Shawshank', description: 'Two imprisoned men bond over a number of years.' },
    { id: 6, title: 'The Godfather', year: 1972, genre: 'Crime', rating: 9.2, poster: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Godfather', description: 'The aging patriarch of an organized crime dynasty transfers control to his reluctant son.' },
    { id: 7, title: 'Forrest Gump', year: 1994, genre: 'Drama', rating: 8.8, poster: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Forrest+Gump', description: 'The presidencies of Kennedy and Johnson, Vietnam, Watergate, and other events unfold from the perspective of an Alabama man.' },
    { id: 8, title: 'The Matrix', year: 1999, genre: 'Sci-Fi', rating: 8.7, poster: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Matrix', description: 'A computer hacker learns about the true nature of reality.' },
    { id: 9, title: 'Titanic', year: 1997, genre: 'Romance', rating: 7.8, poster: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Titanic', description: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.' },
    { id: 10, title: 'Avatar', year: 2009, genre: 'Sci-Fi', rating: 7.8, poster: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Avatar', description: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.' },
    { id: 11, title: 'The Avengers', year: 2012, genre: 'Action', rating: 8.0, poster: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Avengers', description: 'Earth\'s mightiest heroes must come together and learn to fight as a team.' },
    { id: 12, title: 'Jurassic Park', year: 1993, genre: 'Adventure', rating: 8.1, poster: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Jurassic+Park', description: 'A pragmatic paleontologist visiting an almost complete theme park is tasked with protecting a couple of kids after a power failure causes the park\'s cloned dinosaurs to run loose.' }
  ];

  filteredMovies: Movie[] = [];
  watchlist: Movie[] = [];
  genres: string[] = ['All', 'Action', 'Adventure', 'Crime', 'Drama', 'Romance', 'Sci-Fi'];
  selectedGenres: string[] = ['All'];
  sortBy: string = 'title';
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 12;
  featuredMovies: Movie[] = this.movies.slice(0, 3); // Top 3 for featured

  ngOnInit() {
    this.filteredMovies = [...this.movies];
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.movies];

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        movie.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filter by genres
    if (!this.selectedGenres.includes('All')) {
      filtered = filtered.filter(movie => this.selectedGenres.includes(movie.genre));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'title': return a.title.localeCompare(b.title);
        case 'year': return b.year - a.year;
        case 'rating': return b.rating - a.rating;
        default: return 0;
      }
    });

    this.filteredMovies = filtered;
    this.currentPage = 1; // Reset to first page
  }

  getPaginatedMovies(): Movie[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredMovies.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredMovies.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  toggleGenre(genre: string) {
    if (genre === 'All') {
      this.selectedGenres = ['All'];
    } else {
      this.selectedGenres = this.selectedGenres.filter(g => g !== 'All');
      if (this.selectedGenres.includes(genre)) {
        this.selectedGenres = this.selectedGenres.filter(g => g !== genre);
        if (this.selectedGenres.length === 0) {
          this.selectedGenres = ['All'];
        }
      } else {
        this.selectedGenres.push(genre);
      }
    }
    this.applyFilters();
  }

  addToWatchlist(movie: Movie) {
    if (!this.watchlist.find(m => m.id === movie.id)) {
      this.watchlist.push(movie);
    }
  }

  isInWatchlist(movie: Movie): boolean {
    return this.watchlist.some(m => m.id === movie.id);
  }

  playTrailer(movie: Movie) {
    // Placeholder for trailer functionality
    alert(`Playing trailer for ${movie.title}`);
  }
}
