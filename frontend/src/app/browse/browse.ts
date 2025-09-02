import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

interface Movie {
  id: number;
  title: string;
  poster?: string;
  genre: string;
  year: number;
}

@Component({
  selector: 'app-browse',
  imports: [CommonModule, Header, Footer],
  templateUrl: './browse.html',
  styleUrl: './browse.css'
})
export class Browse {
  // Sample movies data
  movies: Movie[] = [
    { id: 1, title: 'Action Movie 1', genre: 'Action', year: 2023 },
    { id: 2, title: 'Comedy Movie 1', genre: 'Comedy', year: 2022 },
    { id: 3, title: 'Drama Movie 1', genre: 'Drama', year: 2021 },
    { id: 4, title: 'Thriller Movie 1', genre: 'Thriller', year: 2023 },
    { id: 5, title: 'Romance Movie 1', genre: 'Romance', year: 2022 },
    { id: 6, title: 'Sci-Fi Movie 1', genre: 'Sci-Fi', year: 2021 },
    { id: 7, title: 'Horror Movie 1', genre: 'Horror', year: 2023 },
    { id: 8, title: 'Adventure Movie 1', genre: 'Adventure', year: 2022 },
    { id: 9, title: 'Animation Movie 1', genre: 'Animation', year: 2021 },
    { id: 10, title: 'Documentary Movie 1', genre: 'Documentary', year: 2023 },
    { id: 11, title: 'Fantasy Movie 1', genre: 'Fantasy', year: 2022 },
    { id: 12, title: 'Mystery Movie 1', genre: 'Mystery', year: 2021 },
  ];

  genres: string[] = ['All', 'Action', 'Comedy', 'Drama', 'Thriller', 'Romance', 'Sci-Fi', 'Horror', 'Adventure', 'Animation', 'Documentary', 'Fantasy', 'Mystery'];

  selectedGenre: string = 'All';

  get filteredMovies(): Movie[] {
    if (this.selectedGenre === 'All') {
      return this.movies;
    }
    return this.movies.filter(movie => movie.genre === this.selectedGenre);
  }

  selectGenre(genre: string) {
    this.selectedGenre = genre;
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}
