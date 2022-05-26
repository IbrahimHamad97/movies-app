import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Movie } from "../movie.model";
import { MoviesService } from "../movie.services";

@Component({
  selector: 'app-movie-create',
  templateUrl: './movie-add.component.html',
  styleUrls: ['./movie-add.component.css'],
})

export class MovieCreateComponent implements OnInit {
  enteredTitle = ''
  enteredContent = ''
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private movieID: string;
  movie: Movie;

  constructor(public moviesService: MoviesService,
     public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(5)]}),
      'content': new FormControl(null, {validators: [Validators.required, Validators.minLength(5)]}),
      'image': new FormControl(null, {validators: [Validators.required]})
    });
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has("movieId")) {
          this.mode = 'edit';
          this.movieID = paramMap.get("movieId");
          this.moviesService.getMovie(this.movieID).subscribe(movieData => {
            this.movie = {id: movieData._id, title: movieData.title,
               content: movieData.content, imagePath: movieData.imagePath,
                creator: movieData.creator, rating: movieData.rating,
                ratingsList: movieData.ratingsList};
            this.form.setValue({'title': this.movie.title,
             'content': this.movie.content, 'image': this.movie.imagePath});
          });
        }
        else {
          this.mode = 'create';
          this.movieID = null;
        }
      });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({'image': file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveMovie() {
    if (this.form.invalid){
      return;
    }
    if (this.mode === 'create') {
      this.moviesService.addMovie(this.form.value.title, this.form.value.content, this.form.value.image);
    }
    else {
      this.moviesService.updateMovie(this.movieID, this.form.value.title,
         this.form.value.content, this.form.value.image, this.movie.rating, this.movie.ratingsList);
    }
    this.form.reset();
  }

}
