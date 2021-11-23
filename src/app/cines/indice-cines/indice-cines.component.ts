import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { cineDTO } from '../cine';
import { CinesService } from '../cines.service';

@Component({
  selector: 'app-indice-cines',
  templateUrl: './indice-cines.component.html',
  styleUrls: ['./indice-cines.component.css']
})
export class IndiceCinesComponent implements OnInit {

  constructor(private cinesService: CinesService) {}

  cinesList: any;
  columnasAMostrar = ['id', 'nombre', 'acciones'];
  cantidadTotalRegistros: any;
  paginaActual = 1;
  cantidadRegistrosAMostrar = 10;

  ngOnInit(): void {
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
  }

  cargarRegistros(pagina: number, cantidadElementosAMostrar: number) {
    this.cinesService
      .obtenerTodos(pagina, cantidadElementosAMostrar)
      .subscribe({
        next: (respuesta: HttpResponse<cineDTO[]>) => {
          (this.cinesList = respuesta.body),
            console.log(respuesta.headers.get('cantidadTotalRegistros'));
          this.cantidadTotalRegistros = respuesta.headers.get(
            'cantidadTotalRegistros'
          );
        },
        error: (e) => console.error(e),
        complete: () => undefined,
      });
  }

  actualizarPaginacion(datos: PageEvent) {
    this.paginaActual = datos.pageIndex + 1;
    this.cantidadRegistrosAMostrar = datos.pageSize;
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
  }

  borrar(id: number) {
    this.cinesService.borrar(id).subscribe({
      next: () =>
        this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar),
      error: (e: any) => console.error(e),
      complete: () => undefined,
    });
  }

}
