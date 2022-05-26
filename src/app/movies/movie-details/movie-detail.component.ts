import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Movie } from "../movie.model";
import { MoviesService } from "../movie.services";


@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailsComponent implements OnInit {
  private movieID: string;
  movie: Movie;

  constructor(public moviesService: MoviesService,
    public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.movieID = paramMap.get("movieId");
      this.moviesService.getMovie(this.movieID).subscribe(movieData => {
        this.movie = {id: movieData._id, title: movieData.title,
           content: movieData.content, imagePath: movieData.imagePath,
            creator: movieData.creator};
      });
    })
  }

}
