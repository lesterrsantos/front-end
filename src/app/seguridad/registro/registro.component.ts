import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parsearErroresAPI } from 'src/app/utilidades/utilidades';
import { credencialesUsuario } from '../seguridad';
import { SeguridadService } from '../seguridad.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  constructor(private seguridadService: SeguridadService,
    private router: Router) { }

  ngOnInit(): void {
  }

  errores: string[] = [];

  registrar(credenciales: credencialesUsuario){
    this.seguridadService.registrar(credenciales)
    .subscribe({
      next: (respuesta) => {
        this.seguridadService.guardarToken(respuesta);
        this.router.navigate(['/']);
      },
      error: (e) => this.errores = parsearErroresAPI(e),
      complete: () => undefined,
    });
  }

}
function respuesta(respuesta: any) {
  throw new Error('Function not implemented.');
}

