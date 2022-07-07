import { Component, OnInit } from '@angular/core';
import { InformeVisita, Visita } from '../models/Visita';
import { RegistroVisitaService } from '../services/registro-visita.service';
import swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InformeService } from '../services/Informe.service';
import { TutorAService } from '../services/tutorA.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro-visita',
  templateUrl: './registro-visita.component.html',
  styleUrls: ['./registro-visita.component.css'],
})
export class RegistroVisitaComponent implements OnInit {
  public registrotutor: Array<any> = [];
  public registrovisita: Array<any> = [];
  registro: Visita = new Visita();
  informe: InformeVisita = new InformeVisita();
  formInforme: FormGroup;
  dataTutor: any[];
  columnasTutor: any[];
  dialogoPasos: boolean;
  registros: any;

  constructor(
    private tutorA: RegistroVisitaService,
    private formBuilder: FormBuilder,
    private registrov: RegistroVisitaService,
    private informeserv: InformeService,
    private visitaI: RegistroVisitaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listarTutorAcademico();

    this.formInforme = this.formBuilder.group({
      fecha: ['', Validators.required],
      horainicio: ['', Validators.required],
      horafin: ['', Validators.required],
      asunto: ['', Validators.required],
      actividades: ['', Validators.required],
      observaciones: ['', Validators.required],
    });

    this.columnasTutor = [
      { field: 'idtutor', header: 'Idtutor' },
      { field: 'primer_nombre', header: 'Nombre del Tutor' },
      { field: 'segundo_apellido', header: 'Apellido del TutoraA' },
      { field: 'idalumno', header: 'IdAlumno' },
      { field: 'primer_nombre_alumno', header: 'Nombre del Alumno' },
      { field: 'segundo_apellido_alumno', header: 'Segundo Apellido' },
      { field: 'size', header: 'Acciones' },
    ];
    this.ngOnInitd();
  }

  ngOnInitd(): void {
    this.listarVisita();
  }

  public listarTutorAcademico() {
    this.tutorA.getTutorA().subscribe((resp: any) => {
      console.log(resp.data);
      this.registrotutor = resp.data;
    });
  }

  public listarVisita() {
    this.visitaI.getVisita().subscribe((resp: any) => {
      console.log(resp.data);
      this.registrovisita = resp.data;
    });
  }
  public create(ide: any): void {
    this.registro.alumno.idAlumno = ide;
    this.registrov
      .createVisita(this.registro)
      .then((Response) => {
        this.registros = Response['data'];
        console.log(this.registros[0].idRegistroVisitaE);
        swal.fire('LLene el Informe', ``, 'success');
      })
      .catch((err) => {});
  }

  public createInformeVisita(): void {
    //this.informe.idinforme.idVisita == idd;

    if (this.formInforme.invalid) {
      swal.fire(
        'Error de entrada',
        'Revise que los campos no esten vacios',
        'error'
      );
      return;
    }
    this.informe.registroVisitaEmpresa = this.registros[0];
    console.log(this.formInforme);
    this.informeserv.createInformeVisita(this.informe).subscribe((Response) => {
      console.log(Response);
      swal.fire(
        'InformeVisita Guardado',
        `InformeVisita creado con exito!`,
        'success'
      );
    });
  }
  public limpiar(): void {
    this.informe.fecha = null;
    this.informe.horaInicio = null;
    this.informe.horaFin = null;
    this.informe.asunto = null;
    this.informe.actividades = null;
    this.informe.observaciones = null;
  }
}
