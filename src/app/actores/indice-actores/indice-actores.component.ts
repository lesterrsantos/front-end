import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { actorDTO } from '../actor';
import { ActoresService } from '../actores.service';

@Component({
  selector: 'app-indice-actores',
  templateUrl: './indice-actores.component.html',
  styleUrls: ['./indice-actores.component.css']
})
export class IndiceActoresComponent implements OnInit {

  constructor(private actoresService: ActoresService) { }

  actoresList: any;
  columnasAMostrar = ['id', 'nombre', 'acciones'];
  cantidadTotalRegistros: any;
  paginaActual = 1;
  cantidadRegistrosAMostrar = 10;

  ngOnInit(): void {
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
  }

  cargarRegistros(pagina: number, cantidadElementosAMostrar: number) {
    this.actoresService
      .obtenerTodos(pagina, cantidadElementosAMostrar)
      .subscribe({
        next: (respuesta: HttpResponse<actorDTO[]>) => {
          (this.actoresList = respuesta.body),
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
    this.actoresService.borrar(id).subscribe({
      next: () =>
        this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar),
      error: (e) => console.error(e),
      complete: () => undefined,
    });
  }

}
