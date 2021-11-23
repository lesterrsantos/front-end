import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { generoDTO } from 'src/app/generos/genero';
import { GenerosService } from 'src/app/generos/generos.service';
import { PeliculaDTO } from '../pelicula';
import { PeliculasService } from '../peliculas.service';

@Component({
  selector: 'app-filtro-peliculas',
  templateUrl: './filtro-peliculas.component.html',
  styleUrls: ['./filtro-peliculas.component.css'],
})
export class FiltroPeliculasComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private generosService: GenerosService,
    private peliculasService: PeliculasService
  ) {}

  form!: FormGroup;

  generos: generoDTO[] = [];
  paginaActual = 1;
  cantidadElementosAMostrar = 10;
  cantidadElementos: any;

  peliculas!: PeliculaDTO[];

  formularioOriginal = {
    titulo: '',
    generoId: 0,
    proximosEstrenos: false,
    enCines: false,
  };

  ngOnInit(): void {
    this.generosService.obtenerTodos().subscribe((generos) => {
      this.generos = generos;

      this.form = this.formBuilder.group(this.formularioOriginal);
      this.leerValoresURL();
      this.buscarPeliculas(this.form.value);

      this.form.valueChanges.subscribe((valores) => {
        this.buscarPeliculas(valores);
        this.escribirParametrosBusquedaEnURL();
      });
    });

    /*    this.form = this.formBuilder.group(this.formularioOriginal);

    //leer los valores de la url para llenar el filtro de peliculas
    this.leerValoresURL();
    //aplicar el filtro de peliculas leido anteriormente
    this.buscarPeliculas(this.form.value);

    this.form.valueChanges.subscribe((valores) => {
      //console.log(valores);

      //resetear el valor de peliculas a su estado original cuando se borrar el filtro
      this.peliculas = this.peliculasOriginal;

      //aplicar filtro sobre las peliculas que estan en memoria
      this.buscarPeliculas(valores);

      //uso de query string para escribir en la ruta los parametros de la busqueda de peliculas
      this.escribirParametrosBusquedaEnURL();
    }); */
  }

  buscarPeliculas(valores: any) {
    valores.pagina = this.paginaActual;
    valores.recordsPorPagina = this.cantidadElementosAMostrar;
    this.peliculasService.filtrar(valores).subscribe((response) => {
      this.peliculas = response.body;
      this.escribirParametrosBusquedaEnURL();
      this.cantidadElementos = response.headers.get('cantidadTotalRegistros');
    });
  }

  limpiar() {
    this.form.patchValue(this.formularioOriginal);
  }

  //para escribir en la ruta via query string
  private escribirParametrosBusquedaEnURL() {
    var queryStrings = [];

    var valoresFormulario = this.form.value;

    if (valoresFormulario.titulo) {
      queryStrings.push(`titulo=${valoresFormulario.titulo}`);
    }

    if (valoresFormulario.generoId != '0') {
      queryStrings.push(`generoId=${valoresFormulario.generoId}`);
    }

    if (valoresFormulario.proximosEstrenos) {
      queryStrings.push(
        `proximosEstrenos=${valoresFormulario.proximosEstrenos}`
      );
    }

    if (valoresFormulario.enCines) {
      queryStrings.push(`enCines=${valoresFormulario.enCines}`);
    }

    this.location.replaceState('peliculas/buscar', queryStrings.join('&'));
  }

  //para leer los valores de la ruta y aplicar el filtro definido sobre las peliculas
  private leerValoresURL() {
    this.activatedRoute.queryParams.subscribe((params) => {
      var objeto: any = {};

      if (params['titulo']) {
        objeto.titulo = params['titulo'];
      }

      if (params['generoId']) {
        objeto.generoId = Number(params['generoId']);
      }

      if (params['proximosEstrenos']) {
        objeto.proximosEstrenos = params['proximosEstrenos'];
      }

      if (params['enCines']) {
        objeto.enCines = params['enCines'];
      }

      this.form.patchValue(objeto);
    });
  }

  paginatorUpdate(datos: PageEvent) {
    this.paginaActual = datos.pageIndex + 1;
    this.cantidadElementosAMostrar = datos.pageSize;
    this.buscarPeliculas(this.form.value);
  }
}
