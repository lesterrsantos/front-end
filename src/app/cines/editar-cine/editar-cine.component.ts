import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { parsearErroresAPI } from 'src/app/utilidades/utilidades';
import { cineCreacionDTO, cineDTO } from '../cine';
import { CinesService } from '../cines.service';

@Component({
  selector: 'app-editar-cine',
  templateUrl: './editar-cine.component.html',
  styleUrls: ['./editar-cine.component.css'],
})
export class EditarCineComponent implements OnInit {
  constructor(
    private router: Router,
    private cinesService: CinesService,
    private activatedRoute: ActivatedRoute
  ) {}

  editarCineModelo!: cineDTO;
  errores: string[] = [];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.cinesService.obtenerPorId(params['id']).subscribe({
        next: (cine: cineDTO) => (this.editarCineModelo = cine),
        error: () => this.router.navigate(['/cines']),
        complete: () => undefined,
      });
    });
  }

  guardarCambios(cine: cineCreacionDTO) {
    this.cinesService.editar(this.editarCineModelo.id, cine).subscribe({
      next: () => this.router.navigate(['/cines']),
      error: (e: any) => (this.errores = parsearErroresAPI(e)),
      complete: () => undefined,
    });
  }
}
