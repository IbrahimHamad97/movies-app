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
  private url = "http://localhost:3000/api/movies";
  private movieRatings = [];
  private totalRating: number = 0;

  constructor(private _http: HttpClient, private router: Router) {}

  getMovies() {
    this._http.get<{message: string, movies: any}>(this.url)
    .pipe(map((movieData) => {
      return movieData.movies.map((movie) => {
        return {
          title: movie.title,
          content: movie.content,
          id: movie._id,
          imagePath: movie.imagePath,
          creator: movie.creator,
          rating: movie.rating,
          ratingList: movie.ratingList
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
      imagePath: string, creator: string, rating: number, ratingsList: Array<any>}>
    (this.url + '/' + movieId);
  }

  getMovieRate() {
    return this._http.get<{rating: number}>
    (this.url);
  }

  getMovieRaters(movieId: string) {
    return this._http.get<{ratingsList: Array<any>}>
    (this.url + '/' + movieId);
  }

  addMovie(title: string, content: string, image: File) {
    const movieData = new FormData();
    movieData.append('title', title);
    movieData.append('content', content);
    movieData.append("image", image, title);
    this._http.post<{message: string, movie: Movie}>
    (this.url, movieData)
    .subscribe(responseData => {
      const movie: Movie = {id: responseData.movie.id, title: title,
         content: content, imagePath: responseData.movie.imagePath, creator: null
        , rating: 0, ratingsList: []}
      const id = responseData.movie.id;
      movie.id = id;
      this.movies.push(movie);
      this._updatedMovies.next([...this.movies]);
      this.router.navigate(['/']);
    });
  }

  updateMovie(id: string, title: string, content: string, image: File | string
    , rating: number, ratingsList: Array<any>) {
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
        creator: null,
        rating: rating,
        ratingsList: ratingsList
      }
    }
    this._http.put(this.url + '/' + id, movieData)
    .subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  deleteMovie(movieId: string) {
    this._http.delete(this.url + '/' + movieId)
    .subscribe(() => {
      const updatedMovies = this.movies.filter(movie => movie.id !== movieId);
      this.movies = updatedMovies;
      this._updatedMovies.next([...this.movies]);
    })
  }

  rateMovie(movieID: string, rateValue: number, userId: string) {
    this.getMovieRaters(movieID).subscribe((data) => {
      this.movieRatings = data.ratingsList;
      const rater = this.movieRatings.find(movie => movie.rater === userId);
      if (rater) {
        const newRatings = this.movieRatings.filter(movie => movie.rater !== userId);
        newRatings.push({
          "rated": rateValue,
          "rater": userId
        });
        newRatings.forEach((rating) => {
          this.totalRating = this.totalRating + rating.rated;
        })
        this.totalRating = this.totalRating / newRatings.length;
        this._http.patch(this.url + '/' + movieID, {
          "rating": this.totalRating,
          "ratingsList": newRatings
        })
        .subscribe(() => {})
      }
      else {
        this.movieRatings.push({
          "rated": rateValue,
          "rater": userId
        });
        this.movieRatings.forEach((rating) => {
          this.totalRating = this.totalRating + rating.rated;
        })
        this.totalRating = this.totalRating / this.movieRatings.length;
        this._http.patch(this.url + '/' + movieID, {
          "rating": this.totalRating,
          "ratingsList": this.movieRatings
        })
        .subscribe(() => {})
      }
    });
  }
}
