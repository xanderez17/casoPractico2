import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InformeFinal } from '../models/InformeFinal';
import { InformeFinalAlumnoService } from '../services/informe-finalizacion-alumo.services';
import { AlumnosService } from '../services/alumnos.service';
import { SolicitudAlumnoService } from '../services/solicitud-alumno.service';
import { TutorEmpresarialService } from '../services/tutor-empresarial.service';
import { RegistroAsistenciaService } from '../services/registro-asistencia.service';
import { ActividadesDiariasService } from '../services/actividades-diarias.service';
import { Anexo9Service } from '../services/anexo9.service';
import { TutorAService } from '../services/tutorA.service';
import { ActaReunionService } from '../services/acta-reunion.service';
import { Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from "file-saver";
import Docxtemplater from "docxtemplater";
import swal from 'sweetalert2';


function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}

@Component({
  selector: 'app-info-seguimiento',
  templateUrl: './informe-finalizacion-alumo.components.html',
  styleUrls: ['./informe-finalizacion-alumno.components.css']

})
export class InformeFinalAlumnoComponent implements OnInit {
  //Variables
  public informeFinalDatos: Array<any> = [];
  public alumnosDatos: Array<any> = [];
  public solicitudAlumnosDatos: Array<any> = [];
  public TutorEmpresarialDatos: Array<any> = [];
  public TutorAcademicoDatos: Array<any> = [];
  public ActaReunionDatos: Array<any> = [];
  public listaRegistroActividades: Array<any> = [];
  public listaActividades: Array<any> = [];
  public listaAnexo9Datos: Array<any> = [];

  informeFinal: InformeFinal = new InformeFinal();


  public base64Output: string;
  public cedula: String;
  public areaEmpresa: String;
  public vava: any;
  public datoActividadDocumento: String = "";
  public valor: Array<any> = [1];
  public identificador:any=0;

  formGuardar: FormGroup;

  public dialogoGuardaryGenerar: boolean;
  public dialogoEliminar: boolean;


  //constructor y OnInit
  constructor(
    private router: Router, private route: ActivatedRoute,
    private informeFinalAlumnoService: InformeFinalAlumnoService,
    private alumnoService: AlumnosService,
    private solicitudAlumnoService: SolicitudAlumnoService,
    private tutorEmpresarialService: TutorEmpresarialService,
    private tutorAcademicoService: TutorAService,
    private actaReunionService: ActaReunionService,
    private registroAsistenciaService: RegistroAsistenciaService,
    private actividadesDiariasService: ActividadesDiariasService,
    private anexo9Service: Anexo9Service
  ) { }


  ngOnInit(): void {
    this.cedula = this.route.snapshot.paramMap.get('cedula');
    this.areaEmpresa = 'Desarrollo';
    this.capturarFecha();
    this.listarInformeFinal();
    this.listarDetalladaAlumnos();
    this.listarSolicitudAlumnos();
    this.listarTutorEmpresarial();
    this.listarTutorAcademico();
    this.listarActaReunion();
    this.listarActividades();
    this.listarAnexo9();
  }




  //Métodos de listar
  public listarInformeFinal() {
    this.informeFinalAlumnoService.getInformeFinalAlumno().subscribe((resp: any) => {
      console.log(resp.data)
      this.informeFinalDatos = resp.data
    })
  }

  public listarDetalladaAlumnos() {
    this.alumnoService.getDetalleAlumnos().subscribe((resp: any) => {
      console.log(resp.data)
      this.alumnosDatos = resp.data
    })
  }

  listarSolicitudAlumnos() {
    this.solicitudAlumnoService.getSolicitudAlumno().subscribe((resp: any) => {
      console.log(resp.data)
      this.solicitudAlumnosDatos = resp.data
    }
    )
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

  public listarregistroAsistencia() {
    this.registroAsistenciaService.getRegistoAsistencialista().subscribe((resp: any) => {
      console.log(resp.data)
      this.listaRegistroActividades = resp.data
    })
  }

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


  //Metodo para crear

  public create(): void {

    var docubas = this.base64Output;

    this.informeFinal.fechaEmision = null;
    this.informeFinal.docInformeFinal = docubas;


    try {
      if (docubas.length != 0) {
        this.informeFinalAlumnoService.createInformeFinal(this.informeFinal).subscribe(
          Response => {
            swal.fire(
              'Enviado',
              `Informe creada con exito!`,
              'success'
            )
            this.dialogoGuardaryGenerar = false;
            location.reload();

          }
        )
      }


    } catch (error) {
      swal.fire(
        'Error de entrada',
        'Seleccione documento',
        'error'
      )
      return;
    }


  }


  //Metodo de borrar

  borrarInforme(id: any) {

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
        this.informeFinalAlumnoService.deleteInformeFinal(id).subscribe(

          Response => {
            this.informeFinalDatos = this.informeFinalDatos.filter(servi => servi !== id)

            swal.fire(
              'Borrado!',
              'Su actividad ha sido eliminada.',
              'success'
            )

            this.dialogoEliminar = false;
            location.reload();

          }
        )


      }
    })
  }

  //Metodo capturar fecha

  capturarFecha() {
    let date = new Date();
    this.informeFinal.fechaEmision = String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + date.getFullYear();
  }

  //metodo Dialogo

  showDialogGuardar(idAlumno: any) {
    this.informeFinal.alumno.idAlumno = idAlumno;
    var con = 0;
    this.dialogoEliminar = null;
    this.dialogoGuardaryGenerar = false;
    
    

    for (var i = 0; i < this.informeFinalDatos.length; i++) {

      if (this.informeFinalDatos[i].alumno.idAlumno == this.informeFinal.alumno.idAlumno) {
        this.identificador=this.informeFinal.alumno.idAlumno;
        //alert(this.informeFinal.alumno.idAlumno);
        //alert(this.identificador);
        con = 1;
        break;
      }

    }

    if (con == 1) {
      this.dialogoEliminar = true;

    } else {
      this.dialogoGuardaryGenerar = true;
    }

  }

  //metosdo para obtener actividades

  obtenerActividades(idregistro: any) {

    for (var c = 0; c < this.listaActividades.length; c++) {

      if (this.listaActividades[c].registroA.idRegistroAsistencia == idregistro) {

        this.datoActividadDocumento = this.datoActividadDocumento + "- " + this.listaActividades[c].descripcion + "\n";

        //alert(this.listaActividades[c].descripcion);
      }

    }
    //alert(this.datoActividadDocumento);

  }

  //Metodo para subir documento en base 64
  onFileSelected(event) {
    this.convertFile(event.target.files[0]).subscribe(base64 => {
      this.base64Output = base64;
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


  //Metodo para generar documento

  generate(nomEm: any, ubiEm: any, areEm: any, nomte: any, cedte: any, carte: any, telem: any, corte: any, nomEs: any, cedEs: any, cicEs: any, corEst: any, corEs: any, nomtac: any, cedtac: any, cortac: any, horpp: any, fein: any, fefi: any, consEmp: any, misEmpr: any, visEmpr: any, actPrin: any, prinEmp: any, conclu: any, idregistro: any) {
    this.datoActividadDocumento = "";
    this.obtenerActividades(idregistro);
    var ddac = this.datoActividadDocumento;


    var fech = this.informeFinal.fechaEmision;
    let arr = fech.split('/');
    var dia = arr[0];
    var mes = arr[1];
    var anio = arr[2];


    //fein fefi
    let arra = fein.split('T');
    fein = arra[0];

    let array = fefi.split('T');
    fefi = array[0];

    if (mes == 1) {
      mes = "Enero";
    } else {
      if (mes == 2) {
        mes = "Febrero";
      } else {
        if (mes == 3) {
          mes = "Marzo";
        } else {
          if (mes == 4) {
            mes = "Abril";
          } else {
            if (mes == 5) {
              mes = "Mayo";
            } else {
              if (mes == 6) {
                mes = "Junio";
              } else {
                if (mes == 7) {
                  mes = "Julio";
                } else {
                  if (mes == 8) {
                    mes = "Agoso";
                  } else {
                    if (mes == 9) {
                      mes = "Septiembre";
                    } else {
                      if (mes == 10) {
                        mes = "Octubre";
                      } else {
                        if (mes == 11) {
                          mes = "Noviembre";
                        } else {
                          mes = "Diciembre";
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

    if (actPrin == 0 || prinEmp == 0 || conclu == 0) {

      swal.fire(
        'Error de entrada',
        'Revise que los campos no esten vacios',
        'error'
      )
      return;


    } else {


      loadFile("https://backendg1c2.herokuapp.com/files/anexo13.docx", function (
        error,
        content
      ) {
        if (error) {
          throw error;
        }



        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
        doc.setData({

          nombreEmpresa: nomEm.toUpperCase(),
          ubicacionEmpresa: ubiEm.toUpperCase(),
          areaEmpresa: areEm.toUpperCase(),

          nombreTutorE: nomte.toUpperCase(),
          cedulaTutorE: cedte.toUpperCase(),
          cargoTutorE: carte.toUpperCase(),
          telefonoEmpresa: telem.toUpperCase(),
          correoTutorE: corte,

          nombreEstudiante: nomEs.toUpperCase(),
          cedulaEstudiante: cedEs,
          ciclo: cicEs.toUpperCase(),
          correoEstudiante: corEst,
          telefonoEstudiante: corEs.toUpperCase(),

          nombreTutorA: nomtac.toUpperCase(),
          cedulaTutorA: cedtac.toUpperCase(),
          correoTutorA: cortac,

          horasPPP: horpp,
          fechaInicio: fein,
          fechaFin: fefi,

          constitucionEmpresa: consEmp,
          misionEmpresa: misEmpr,
          visionEmpresa: visEmpr,

          actividadEmpresa: actPrin,
          principiosEmpresa: prinEmp,
          conclusion: conclu,
          dia: dia,
          mes: mes,
          anio: anio,

          DescripcionDetallada: ddac,

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
        saveAs(out, "anexo13.docx");
      });
    }

  }

}
