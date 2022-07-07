import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ActividadesDiariasService } from '../services/actividades-diarias.service';
import { Anexo9Service } from '../services/anexo9.service';
import { RegistroAsistenciaService } from '../services/registro-asistencia.service';
import { SolicitudAlumnoService } from '../services/solicitud-alumno.service';
import swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActividadesDiarias } from '../models/actividades-diarias';
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import { registroA } from '../models/RegistroAsistencia';
import { Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs';

function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}


@Component({
  selector: 'app-registro-asistencia',
  templateUrl: './registro-asistencia.component.html',
  styleUrls: ['./registro-asistencia.component.css']
})



export class RegistroAsistenciaComponent implements OnInit {

  public listaActividades: Array<any> = [];
  public listaAnexo9Datos: Array<any> = [];
  public listaRegistroActividades: Array<any> = [];
  public listaSolicitudAlumno: Array<any> = [];

  actividadesDiarias: ActividadesDiarias = new ActividadesDiarias();
  registroA: registroA = new registroA();



  public dialogoMiRegistro: boolean;
  public dialogoGuardaryGenerar: boolean;
  public contador = 0;
  public dis: boolean;
  public cedulaAlumno: any;
  formValidacion: FormGroup;
  formGuardar: FormGroup;

  public datoEstudiante: any;
  public datoEmpresa: any;
  public datoTutor: any;
  public datoCarrera: any;
  public datoIdAlumno: any;
  public base64Output: string;
  public datoCapturaActividades: string = "";
  public c: number = 0;
  public c1: number = 1;

  showDialog(idRegiAsi: any) {
    this.dis = true;
    this.actividadesDiarias.registroA.idRegistroAsistencia = idRegiAsi;

  }

  showDialogGuardar(est: any, emp: any, tut: any, carr: any, idAlumno: any, regiId: any) {
    this.capturarActividades(idAlumno);
    this.datoIdAlumno = idAlumno;
    this.registroA.alumno.idAlumno = idAlumno;
    this.registroA.idRegistroAsistencia = regiId;
    this.dialogoGuardaryGenerar = true;
    this.datoEstudiante = est;
    this.datoEmpresa = emp;
    this.datoTutor = tut;
    this.datoCarrera = carr;

  }


  constructor(
    private router: Router, private route: ActivatedRoute,
    private actividadesDiariasService: ActividadesDiariasService,
    private anexo9Service: Anexo9Service,
    private registroAsistenciaService: RegistroAsistenciaService,
    private solicitudAlumnoService: SolicitudAlumnoService,
    private formBuilder: FormBuilder,
  ) { }

  
  ngOnInit(): void {
    this.cedulaAlumno = this.route.snapshot.paramMap.get('cedula');
    this.listarActividades();
    this.listarAnexo9();
    this.listarregistroAsistencia();
    this.listarSolicitudAlumnos();
    

    this.formValidacion = this.formBuilder.group({
      fecha: ['', Validators.required],
      numHoras: ['', Validators.required],
      horaLlegada: ['', Validators.required],
      horaSalida: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }

  

  capturarActividades(idAlumno: any) {

    this.datoIdAlumno = idAlumno;

    for (var i = 0; i < this.listaActividades.length; i++) {
      if (this.listaActividades[i].registroA.alumno.idAlumno == this.datoIdAlumno) {
        this.c = this.c + 1;
      }
    }




    for (var i = 0; i < this.listaActividades.length; i++) {
      if (this.listaActividades[i].registroA.alumno.idAlumno == this.datoIdAlumno) {
        if (this.c1 == this.c) {
          let arr = this.listaActividades[i].fecha.split('T');
          this.datoCapturaActividades = this.datoCapturaActividades + "FECHA: " + arr[0] + "     ENTRADA: " + this.listaActividades[i].horaLlegada +
            "     SALIDA: " + this.listaActividades[i].horaSalida + "     HORAS: " + this.listaActividades[i].numHoras + "     FIRMA:  ______________" + "\n" +
            "ACTIVIDAD: " + this.listaActividades[i].descripcion + "\n";

        } else {
          let arr = this.listaActividades[i].fecha.split('T');
          this.datoCapturaActividades = this.datoCapturaActividades + "FECHA: " + arr[0] + "     ENTRADA: " + this.listaActividades[i].horaLlegada +
            "     SALIDA: " + this.listaActividades[i].horaSalida + "     HORAS: " + this.listaActividades[i].numHoras + "     FIRMA:  ______________" + "\n" +
            "ACTIVIDAD: " + this.listaActividades[i].descripcion + "\n" + "___________________________________________________________________________________" + "\n";
          this.c1++;
        }

      }
    }
    this.c1 = 1;
    this.c = 0;


  }




  //metodos de listar
  public listarActividades() {
    this.actividadesDiariasService.getInformeActividadesDiarias().subscribe((resp: any) => {
      console.log(resp.data)
      this.listaActividades = resp.data
    })
  }


  public listarAnexo9() {
    this.anexo9Service.getAnexo9lista().subscribe((resp: any) => {
      console.log(resp.data)
      this.listaAnexo9Datos = resp.data
    })
  }

  public listarregistroAsistencia() {
    this.registroAsistenciaService.getRegistoAsistencialista().subscribe((resp: any) => {
      console.log(resp.data)
      this.listaRegistroActividades = resp.data
    })
  }

  //LISTAR SOLICITUDES
  listarSolicitudAlumnos() {
    this.solicitudAlumnoService.getSolicitudAlumno().subscribe((resp: any) => {
      console.log(resp.data)
      this.listaSolicitudAlumno = resp.data
    }
    )
  }


  //Metodo de crear actividades

  public create(): void {

    if (this.formValidacion.invalid) {
      swal.fire(
        'Error de entrada',
        'Revise que los campos no esten vacios',
        'error'
      )
      return;
    }


    this.actividadesDiariasService.createregistroActividades(this.actividadesDiarias).subscribe(
      Response => {
        swal.fire(
          'Enviado',
          `Actividad creada con exito!`,
          'success'
        )
        this.listarActividades();
        this.limpiar();

      }
    )

  }


  limpiar() {
    this.actividadesDiarias.fecha = null;
    this.actividadesDiarias.numHoras = null;
    this.actividadesDiarias.horaLlegada = null;
    this.actividadesDiarias.horaSalida = null;
    this.actividadesDiarias.descripcion = null;
  }




  //Metodo de borrar

  borrarActividad(id: any) {

    swal.fire({
      title: '¿Estas seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, borrar!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.actividadesDiariasService.deleteActividad(id).subscribe(

          Response => {
            this.listaActividades = this.listaActividades.filter(servi => servi !== id)

            swal.fire(
              'Borrado!',
              'Su actividad ha sido eliminada.',
              'success'
            )
            this.listarActividades();
          }
        )



      }
    })
  }

  //metodo editar

  editarRegistro() {

    try {
      if (this.registroA.docRegistroA.length != 0) {
        this.registroAsistenciaService.updateReAsistencia(this.registroA).subscribe(registroA => {
          swal.fire('Registro documento', 'El documento se ha subido con exito.', 'success')
          location.reload();
        })
      }

    } catch (error) {
      swal.fire(
        'Error de entrada',
        'Revise que los campos no esten vacios',
        'error'
      )
    }




  }



  //Metodo para subir documento en base 64
  onFileSelected(event) {
    this.convertFile(event.target.files[0]).subscribe(base64 => {
      this.base64Output = base64;
      this.registroA.docRegistroA = base64;

    });
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    console.log(result)
    return result;
  }




  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //metodo generar documento

  generate(est: any, emp: any, tut: any, car: any) {
    var actido = this.datoCapturaActividades;

    loadFile("https://backendg1c2.herokuapp.com/files/anexo9v.docx", function (
      error,
      content
    ) {
      if (error) {
        throw error;
      }


      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
      doc.setData(
        {


          estudiante: est.toUpperCase(),
          empresa: emp.toUpperCase(),
          NombreTutor: tut.toUpperCase(),
          carrera: car.toUpperCase(),
          actividades: actido,


        });
      try {
        // Se reemplaza en el documento: {rpp} -> John, {numestudiantes} -> Doe ....
        doc.render();
      } catch (error) {
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
        function replaceErrors(key, value) {
          if (value instanceof Error) {
            return Object.getOwnPropertyNames(value).reduce(function (
              error,
              key
            ) {
              error[key] = value[key];
              return error;
            },
              {});
          }
          return value;
        }
        console.log(JSON.stringify({ error: error }, replaceErrors));

        if (error.properties && error.properties.errors instanceof Array) {
          const errorMessages = error.properties.errors
            .map(function (error) {
              return error.properties.explanation;
            })
            .join("\n");
          console.log("errorMessages", errorMessages);

        }
        throw error;
      }
      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      });
      // Output the document using Data-URI
      location.reload();
      saveAs(out, "anexo9.docx");
    });
    //location.reload();
  }




}