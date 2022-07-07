import { Component, OnInit } from '@angular/core';
import { ResponsableService } from '../services/responsable.service';

@Component({
  selector: 'app-lista-responsableppp',
  templateUrl: './lista-responsableppp.component.html',
  styleUrls: ['./lista-responsableppp.component.css'],
})
export class ListaResponsablepppComponent implements OnInit {
  dataResponsable: any[];
  columnasResponsable: any[];

  constructor(private responsableppp: ResponsableService) {}

  ngOnInit(): void {
    this.columnasResponsable = [
      { field: 'IdResponsable', header: 'idResponsable' },
      { field: 'primer_nombre', header: 'Primer nombre' },
      { field: 'segundo_nombre', header: 'Segundo Nombre' },
      { field: 'primer_apellido', header: 'Primer apellido' },
      { field: 'segundo_apellido', header: 'Segundo Apellido' },
      { field: 'titulo', header: 'Titulo' },
      { field: 'carrera', header: 'Carrera' },
    ];
    this.obtenerResponsable();
  }

  obtenerResponsable(): void {
    this.responsableppp.getResponsables().then((value) => {
      this.dataResponsable = value['data'];
      console.log(this.dataResponsable);
    });
  }
}
