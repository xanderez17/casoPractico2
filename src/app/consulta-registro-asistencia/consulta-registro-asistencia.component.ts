import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ActividadesDiariasService } from '../services/actividades-diarias.service';
import { Anexo9Service } from '../services/anexo9.service';
import { RegistroAsistenciaService } from '../services/registro-asistencia.service';
import swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActividadesDiarias } from '../models/actividades-diarias';
@Component({
  selector: 'app-consulta-registro-asistencia',
  templateUrl: './consulta-registro-asistencia.component.html',
  styleUrls: ['./consulta-registro-asistencia.component.css']
})
export class ConsultaRegistroAsistenciaComponent implements OnInit {
  public listaActividades: Array<any> = [];
  public listaAnexo9Datos: Array<any> = [];
  public listaRegistroActividades: Array<any> = [];
  actividadesDiarias: ActividadesDiarias = new ActividadesDiarias();
  public contador = 0;
  public cedulaAlumno: any;
  idalumnob:any;
  formValidacion: FormGroup;
  
  constructor(
    private router: Router, private route: ActivatedRoute,
    private actividadesDiariasService: ActividadesDiariasService,
    private anexo9Service: Anexo9Service,
    private registroAsistenciaService: RegistroAsistenciaService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.cedulaAlumno = this.route.snapshot.paramMap.get('cedula');
    this.listarActividades();
    this.listarregistroAsistencia();
    this.listarAnexo9();
    this.formValidacion = this.formBuilder.group({
      fecha: ['', Validators.required],
      numHoras: ['', Validators.required],
      horaLlegada: ['', Validators.required],
      horaSalida: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }


public listarActividades() {
  this.actividadesDiariasService.getInformeActividadesDiarias().subscribe((resp: any) => {
    console.log(resp.data)
    this.listaActividades = resp.data
  })
}
public listarregistroAsistencia() {
  this.registroAsistenciaService.getRegistoAsistencialista().subscribe((resp: any) => {
    console.log(resp.data)
    this.listaRegistroActividades = resp.data
  })
}
public listarAnexo9() {
  this.anexo9Service.getAnexo9lista().subscribe((resp: any) => {
    console.log(resp.data)
    this.listaAnexo9Datos = resp.data
  })
}
recibircedula(ced:any){
  this.idalumnob=ced;
}
}