import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "./auth/auth.guard";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { MovieDetailsComponent } from "./movies/movie-details/movie-detail.component";
import { MovieCreateComponent } from './movies/movies-add/movie-add.component';
import { MovieListComponent } from './movies/movies-list/movieList.component';

const routes: Routes = [
  {path: '', component: MovieListComponent},
  {path: 'create', component: MovieCreateComponent, canActivate: [AuthGuard]},
  {path: 'edit/:movieId', component: MovieCreateComponent, canActivate: [AuthGuard]},
  {path: 'view/:movieId', component: MovieDetailsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule {}
