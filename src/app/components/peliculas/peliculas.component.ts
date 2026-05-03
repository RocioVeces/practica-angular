import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-peliculas',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './peliculas.component.html'
})
export class PeliculasComponent implements OnInit {
  peliculas: any[] = [];
  apiUrl = 'http://localhost:3000/peliculas';
  modoEdicion = false;

  pelicula = { id: null, titulo: '', director: '', anio: '', genero: '' };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarPeliculas();
  }

  cargarPeliculas() {
    this.http.get<any[]>(this.apiUrl).subscribe(data => this.peliculas = data);
  }

  guardar() {
    if (this.modoEdicion) {
      this.http.put(`${this.apiUrl}/${this.pelicula.id}`, this.pelicula).subscribe(() => {
        this.cargarPeliculas();
        this.limpiar();
      });
    } else {
      this.http.post(this.apiUrl, this.pelicula).subscribe(() => {
        this.cargarPeliculas();
        this.limpiar();
      });
    }
  }

  editar(p: any) {
    this.pelicula = { ...p };
    this.modoEdicion = true;
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que quieres eliminar esta película?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => this.cargarPeliculas());
    }
  }

  limpiar() {
    this.pelicula = { id: null, titulo: '', director: '', anio: '', genero: '' };
    this.modoEdicion = false;
  }
}