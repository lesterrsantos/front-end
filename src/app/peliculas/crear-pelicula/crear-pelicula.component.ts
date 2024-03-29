import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MultipleSelectorModel } from 'src/app/utilidades/selector-multiple/MultipleSelectorModel';
import { parsearErroresAPI } from 'src/app/utilidades/utilidades';
import { PeliculaCreacionDTO } from '../pelicula';
import { PeliculasService } from '../peliculas.service';

@Component({
  selector: 'app-crear-pelicula',
  templateUrl: './crear-pelicula.component.html',
  styleUrls: ['./crear-pelicula.component.css'],
})
export class CrearPeliculaComponent implements OnInit {
  constructor(
    private peliculasService: PeliculasService,
    private router: Router
  ) {}

  errores: string[] = [];
  generosNoSeleccionados!: MultipleSelectorModel[];
  cinesNoSeleccionados!: MultipleSelectorModel[];

  ngOnInit(): void {
    this.peliculasService.postGet().subscribe({
      next: (resultado) => {
        this.generosNoSeleccionados = resultado.generos.map((genero) => {
          return <MultipleSelectorModel>{
            llave: genero.id,
            valor: genero.nombre,
          };
        });

        this.cinesNoSeleccionados = resultado.cines.map((cines) => {
          return <MultipleSelectorModel>{
            llave: cines.id,
            valor: cines.nombre,
          };
        });
      },
      error: (e) => (this.errores = parsearErroresAPI(e)),
      complete: () => undefined,
    });
  }

  guardarCambios(pelicula: PeliculaCreacionDTO) {
    this.peliculasService.crear(pelicula).subscribe({
      next: (id: number) => this.router.navigate(['pelicula' + id]),
      error: (e) => (this.errores = parsearErroresAPI(e)),
      complete: () => undefined,
    });
  }
}
