import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule,ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import {LayoutModule, BreakpointObserver} from '@angular/cdk/layout';
import { CarreraService } from './services/carrera.service';
import { TokenService } from './services/token.service';
import { ChangeDetectorRef } from '@angular/core';
import { PersonaService } from './services/persona.service';
import { NotificacionesService} from './services/notificaciones.service'

import Swal from 'sweetalert2';
import { AlumnosService } from './services/alumnos.service';
import { SolicitudAlumnoService } from './services/solicitud-alumno.service';
import { RegistroAsistenciaService } from './services/registro-asistencia.service';
import { registroA } from './models/RegistroAsistencia';
import { Anexo9Service } from './services/anexo9.service';
import { TutorAService } from './services/tutorA.service';
import { TutorEmpresarialService } from './services/tutor-empresarial.service';
import { ActaReunionService } from './services/acta-reunion.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  public listaSolicitudAlumno: Array<any> = [];
  public alumnosDatos: Array<any> = [];
  public listaRegistroActividades: Array<any> = [];
  public listaAnexo9Datos: Array<any> = [];
  public TutorEmpresarialDatos: Array<any> = [];
  public TutorAcademicoDatos: Array<any> = [];
  public ActaReunionDatos: Array<any> = [];

  registroA: registroA = new registroA();

  public contro: boolean = false;
  public controVerificador: boolean = false;
  public idAlumnoo: any = 0;
  public cedula: any;

  @ViewChild(MatSidenav)
 sidenav: MatSidenav;
  title = 'casopractico-dos';
  loginForm!: FormGroup;
  roles: string[];
  bannoti:boolean;
  isUser = false;
  isAdmin = false;
  isDocente = false;
  isEstudiante = false;
  isResponsable = false;
  isTutorAcademico = false;
  isTutorEmpresarial = false;
  isEmpleado = false;
  isLogged = false;
  realRol: String;


  notificaciones: any[] = new Array <any>();
  notificacion: noti;

  public personas: Array<any> = []

  constructor(
    private observer: BreakpointObserver,
    private tokenService: TokenService,
    private changeDedectionRef: ChangeDetectorRef,
    private personaService: PersonaService,
    private alumnoService: AlumnosService,
    private solicitudAlumnoService: SolicitudAlumnoService,
    private registroAsistenciaService: RegistroAsistenciaService,
    private anexo9Service: Anexo9Service,
    private tutorEmpresarialService: TutorEmpresarialService,
    private tutorAcademicoService: TutorAService,
    private actaReunionService: ActaReunionService,
    private notificacionesService: NotificacionesService
  ) {



      console.log(this.tokenService.getUserName());


      this.personaService.getPersonasByCedula(
        this.tokenService.getUserName()
      ).subscribe((resp: any)=>{
        console.log(resp.data)
        this.personas = resp.data
      })

      console.log("PERSONA GENERADA")

    }

  ngOnInit(): void {
    this.listarDetalladaAlumnos();
    this.listarSolicitudAlumnos();
    this.listarregistroAsistencia();
    this.listarAnexo9();
    this.listarTutorEmpresarial();
    this.listarTutorAcademico();
    this.listarActaReunion();

    // Array de notifcaciones ejemplo

    this.changeDedectionRef.detectChanges();
    if(this.tokenService.getToken()){
      this.isLogged = true;
      this.getNotificaciones()

    }else {
      this.isLogged = false;
    }

    /* this.loginForm = new FormGroup({
       email: new FormControl('', [Validators.required, Validators.email]),
       password: new FormControl('', [Validators.required])
     }); */

    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(rol => {
      if (rol === 'ROLE_ADMIN') {
        this.realRol = 'admin';
        this.isAdmin = true;
      }
      if (rol === 'ROLE_DOCENTE') {
        this.realRol = 'docente';
        this.isDocente = true;
      }

      if (rol === 'ROLE_ESTUDIANTE') {
        this.realRol = 'estudiante';
        this.isEstudiante = true;
      }

      if (rol === 'ROLE_RESPONSABLEPPP') {
        this.realRol = 'responsableppp';
        this.isResponsable = true;
      }

      if (rol === 'ROLE_TUTORACADEMICO') {
        this.realRol = 'tacademico';
        this.isTutorAcademico = true;
      }

      if (rol === 'ROLE_TUTOREMPRESARIAL') {
        this.realRol = 'tempresarial';
        this.isTutorEmpresarial = true;
      }

      if (rol === 'ROLE_EMPLEADO') {
        this.realRol = 'empleado';
        this.isEmpleado = true;
      }
    });


  }

  onLogOut() {
    this.tokenService.logOut();
    window.location.replace('/');
  }

  getNotificaciones(){
    this.notificacionesService.getNotificaciones().then(res=>{
      var notigeneral: any[]= res['data'] ;
      notigeneral.forEach(value=>{
        if(value.persona.cedula == this.tokenService.getUserName()){
          this.notificaciones.push(value);
        }
      })
    })
  }

  deleteNotificacion(id){
    this.notificacionesService.deleteNotificacion(id).then(res=>{
      console.log('Notificacion eliminada');

    })
  }


  onLogIn() {
    window.location.replace('/')
  }

  ngAfterContentInit() {

    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }

  //FRANKLIN

  public listarDetalladaAlumnos() {
    this.alumnoService.getDetalleAlumnos().subscribe((resp: any) => {
      console.log(resp.data)
      this.alumnosDatos = resp.data
    })
  }

  listarSolicitudAlumnos() {
    this.solicitudAlumnoService.getSolicitudAlumno().subscribe((resp: any) => {
      console.log(resp.data)
      this.listaSolicitudAlumno = resp.data
    }
    )
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

  listarTutorEmpresarial() {
    this.tutorEmpresarialService.getTutorEmpresarial().subscribe((resp: any) => {
      console.log(resp.data)
      this.TutorEmpresarialDatos = resp.data
    }
    )
  }

  listarTutorAcademico() {
    this.tutorAcademicoService.getTutorAcademico().subscribe((resp: any) => {
      console.log(resp.data)
      this.TutorAcademicoDatos = resp.data
    }
    )
  }

  listarActaReunion() {

    this.actaReunionService.getActaReunion().subscribe((resp: any) => {
      console.log(resp.data)
      this.ActaReunionDatos = resp.data
    }
    )
  }

  verificarSolicitud(cedula: any) {

    this.cedula = cedula;

    for (var b = 0; b < this.alumnosDatos.length; b++) {
      if (cedula == this.alumnosDatos[b].cedula) {

        for (var a = 0; a < this.listaRegistroActividades.length; a++) {
          //this.registroA.alumno.idAlumno=this.alumnosDatos[b].id_alumno;
          if (this.listaRegistroActividades[a].alumno.idAlumno == this.alumnosDatos[b].id_alumno) {
            this.contro = true;
          }

        }
      }
    }

    this.registroA.alumno.persona.cedula=cedula;
    this.registroA.docRegistroA="Sin Documento";

    if (this.contro == false) {
      Swal.fire({
        title: '¿Desea crear una plantilla de registro de actividades?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Crear',
        denyButtonText: `No Crear`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.registroAsistenciaService.createReAsistencia(this.registroA).subscribe(
            Response => {
              Swal.fire(
                'Creado',
                `Plantilla creado con exito!`,
                'success'
              )
              //this.verificarRequisitosRegistroAsistencia();
              location.reload();
            }
          )

        } else if (result.isDenied) {

          Swal.fire('Plantilla no creada', '', 'info')
        }
      })

    } else {
      this.verificarRequisitosRegistroAsistencia();
    }

    //this.verificarRequisitosRegistroAsistencia();

  }



  verificarRequisitosRegistroAsistencia() {
    console.log("cedula: " + this.cedula);
    this.controVerificador = false;
    for (var a = 0; a < this.listaAnexo9Datos.length; a++) {
      if (this.listaAnexo9Datos[a].cedula_a == this.cedula) {

        for (var b = 0; b < this.listaSolicitudAlumno.length; b++) {

          if (this.listaSolicitudAlumno[b].alumno.idAlumno == this.listaAnexo9Datos[a].id_alumno) {
            this.controVerificador = true;
          } else {
            console.log("No cumple requisito solicitud alumno");
          }

        }

      } else {
        console.log("No esta en lista vista anexo 9");
      }
    }


    if (this.controVerificador == true) {
      console.log("Inicio registro actividades Anexo 9 exitoso");
    } else {
      this.mensajeError();
    }


  }

  verificarRequisitosInformeFinalA13(cedula: any) {

    this.cedula = cedula;
    this.controVerificador = false;
    console.log("cedula: " + this.cedula);

    for (var a = 0; a < this.alumnosDatos.length; a++) {

      if (this.alumnosDatos[a].cedula == cedula) {
        console.log("Alumno Datos Existoso");

        for (var b = 0; b < this.listaSolicitudAlumno.length; b++) {
          if (this.listaSolicitudAlumno[b].alumno.idAlumno == this.alumnosDatos[a].id_alumno) {
            console.log("Solicitud Alumno Exitoso");

            for (var c = 0; c < this.TutorEmpresarialDatos.length; c++) {
              if (this.TutorEmpresarialDatos[c].alumno.idAlumno == this.alumnosDatos[a].id_alumno) {
                console.log("Tutor empresarial exitoso");

                for (var d = 0; d < this.TutorAcademicoDatos.length; d++) {
                  if (this.TutorAcademicoDatos[d].alumno.idAlumno == this.alumnosDatos[a].id_alumno) {

                    for (var e = 0; e < this.ActaReunionDatos.length; e++) {
                      if (this.ActaReunionDatos[e].alumno.idAlumno == this.alumnosDatos[a].id_alumno) {
                        console.log("Acta reunion exitoso");

                        for (var f = 0; f < this.listaAnexo9Datos.length; f++) {


                          try {
                            if (this.listaAnexo9Datos[f].id_alumno == this.alumnosDatos[a].id_alumno) {
                              console.log("Anexo 9 datos");
                              this.controVerificador = true;
                            }
                          } catch (error) {
                            console.log("error");
                          }


                        }

                      }


                    }

                  }

                }

              }

            }


          }

        }

      }

    }

    if (this.controVerificador == true) {
      console.log("Inicio registro actividades Anexo 9 exitoso");
    } else {
      this.mensajeError();
    }


  }


  mensajeError() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Al parecer no cumples con los requisitos necesarios para esta seccion!',
    })
  }

}

interface noti {
  name: String;
  descripcion: String;
}
