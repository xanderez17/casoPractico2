import { Component, OnInit } from '@angular/core';
import { Alumno } from '../models/Alumno';
import { ConvocatoriaService } from '../services/convocatoria.service';
import { SolicitudAlumnoService } from '../services/solicitud-alumno.service';

@Component({
  selector: 'app-consultasppp',
  templateUrl: './consultasppp.component.html',
  styleUrls: ['./consultasppp.component.scss']
})
export class ConsultaspppComponent implements OnInit {

  convocatorias: Array<any>=[];
  alumnosolicitud: Array<any>=[];

  selectEst : Alumno[];

  constructor(
    private convocatoriaService: ConvocatoriaService, 
    private solicitudalumnoservice : SolicitudAlumnoService
    ) { }

  ngOnInit(): void {
    this.listarConvocatoria();
    this.listarSolicitudAlumnos();
  }

  listarConvocatoria(){
    this.convocatoriaService.getConvocatoria().subscribe((resp: any)=>{
      console.log(resp.data)
      this.convocatorias = resp.data
      })
  }

  listarSolicitudAlumnos(){
    this.solicitudalumnoservice.getSolicitudAlumno().subscribe((resp: any)=>{
      console.log(resp.data)
      this.alumnosolicitud = resp.data
      })
  }
}
