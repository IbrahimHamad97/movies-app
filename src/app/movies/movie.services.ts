import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { Movie } from "./movie.model";

// entire app using one instance
@Injectable({providedIn: 'root'})
export class MoviesService {
  private movies: Movie[] = [];
  private _updatedMovies = new Subject<Movie[]>();

  constructor(private _http: HttpClient, private router: Router) {}

  getMovies() {
    this._http.get<{message: string, movies: any}>("http://localhost:3000/api/movies")
    .pipe(map((movieData) => {
      return movieData.movies.map((movie) => {
        return {
          title: movie.title,
          content: movie.content,
          id: movie._id,
          imagePath: movie.imagePath,
          creator: movie.creator
        }
      });
    }))
    .subscribe((newMovies) => {
      this.movies = newMovies;
      this._updatedMovies.next([...this.movies]);
    });
  }

  getMovieUpdatedListener() {
    return this._updatedMovies.asObservable();
  }

  getMovie(movieId: string) {
    return this._http.get<{_id: string, title: string, content: string,
      imagePath: string, creator: string}>
    ("http://localhost:3000/api/movies/" + movieId);
  }

  addMovie(title: string, content: string, image: File) {
    const movieData = new FormData();
    movieData.append('title', title);
    movieData.append('content', content);
    movieData.append("image", image, title);
    this._http.post<{message: string, movie: Movie}>
    ("http://localhost:3000/api/movies", movieData)
    .subscribe(responseData => {
      const movie: Movie = {id: responseData.movie.id, title: title,
         content: content, imagePath: responseData.movie.imagePath, creator: null}
      const id = responseData.movie.id;
      movie.id = id;
      this.movies.push(movie);
      this._updatedMovies.next([...this.movies]);
      this.router.navigate(['/']);
    });
  }

  deleteMovie(movieId: string) {
    console.log(movieId)
    this._http.delete("http://localhost:3000/api/movies/" + movieId)
    .subscribe(() => {
      const updatedMovies = this.movies.filter(movie => movie.id !== movieId);
      this.movies = updatedMovies;
      this._updatedMovies.next([...this.movies]);
    })
  }

  updateMovie(id: string, title: string, content: string, image: File | string) {
    let movieData: Movie | FormData;
    if (typeof image === 'object'){
      movieData = new FormData();
      movieData.append("id", id);
      movieData.append('title', title);
      movieData.append('content', content);
      movieData.append("image", image, title);
    }
    else {
      movieData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      }
    }
    this._http.put("http://localhost:3000/api/movies/" + id, movieData)
    .subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
