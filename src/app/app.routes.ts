import { Routes } from '@angular/router';
import { ClimaComponent } from './components/clima/clima.component';
import { PeliculasComponent } from './components/peliculas/peliculas.component';

export const routes: Routes = [
  { path: '', redirectTo: 'clima', pathMatch: 'full' },
  { path: 'clima', component: ClimaComponent },
  { path: 'peliculas', component: PeliculasComponent }
];