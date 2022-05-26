import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";

import { Movie } from "../movie.model";
import { MoviesService } from "../movie.services";


@Component({
  selector: 'app-movieList',
  templateUrl: './movieList.component.html',
  styleUrls: ['./movieList.component.css'],
})
export class MovieListComponent implements OnInit {
  movies: Movie [] = [];
  private _moviesSub: Subscription;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;
  userId: string;

  constructor(public moviesService: MoviesService,
     private authService: AuthService) {}

  ngOnInit() {
      this.moviesService.getMovies();
      this.userId = this.authService.getUserId();
      this._moviesSub = this.moviesService.getMovieUpdatedListener()
      .subscribe((movies: Movie[]) => {
        this.movies = movies;
      });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(movieID: string) {
    this.moviesService.deleteMovie(movieID);
  }

  ngOnDestroy() {
    this._moviesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
