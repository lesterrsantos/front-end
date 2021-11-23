import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { parsearErroresAPI } from 'src/app/utilidades/utilidades';
import { actorCreacionDTO, actorDTO } from '../actor';
import { ActoresService } from '../actores.service';

@Component({
  selector: 'app-editar-actor',
  templateUrl: './editar-actor.component.html',
  styleUrls: ['./editar-actor.component.css'],
})
export class EditarActorComponent implements OnInit {
  constructor(
    private router: Router,
    private actoresService: ActoresService,
    private activatedRoute: ActivatedRoute
  ) {}

  editarActorModelo!: actorDTO;
  errores: string[] = [];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.actoresService.obtenerPorId(params['id']).subscribe({
        next: (actor) => (this.editarActorModelo = actor),
        error: (e) => this.router.navigate(['/actores']),
        complete: () => undefined,
      });
    });
  }

  guardarCambios(actor: actorCreacionDTO) {
    this.actoresService.editarActor(this.editarActorModelo.id, actor).subscribe({
      next: () => this.router.navigate(['/actores']),
      error: (e) => this.errores = parsearErroresAPI(e),
      complete: () => undefined,
    });

    this.router.navigate(['/actores']);
  }
}
