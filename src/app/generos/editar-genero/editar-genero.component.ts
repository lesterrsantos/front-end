import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { parsearErroresAPI } from 'src/app/utilidades/utilidades';
import { generoCreacionDTO, generoDTO } from '../genero';
import { GenerosService } from '../generos.service';

@Component({
  selector: 'app-editar-genero',
  templateUrl: './editar-genero.component.html',
  styleUrls: ['./editar-genero.component.css'],
})
export class EditarGeneroComponent implements OnInit {
  constructor(
    private router: Router,
    private generosService: GenerosService,
    private activatedRoute: ActivatedRoute
  ) {}

  editarGeneroModelo!: generoDTO;
  errores: string[] = [];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.generosService.obtenerPorId(params['id']).subscribe({
        next: (genero) => (this.editarGeneroModelo = genero),
        error: (e) => this.router.navigate(['/generos']),
        complete: () => undefined,
      });
    });
  }

  guardarCambios(genero: generoCreacionDTO) {
    this.generosService.editar(this.editarGeneroModelo.id, genero).subscribe({
      next: () => this.router.navigate(['/generos']),
      error: (e) => this.errores = parsearErroresAPI(e),
      complete: () => undefined,
    });
  }
}
