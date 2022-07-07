import { Component, OnInit } from '@angular/core';
import { InformeFinalAlumnoService } from '../services/informe-finalizacion-alumo.services';
import { SolicitudAlumnoService } from '../services/solicitud-alumno.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import { Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { Acreditacion } from '../models/Acreditacion';
import swal from 'sweetalert2';
import { AcreditacionService } from '../services/acreditacion.service';
import { PersonaService } from '../services/persona.service';

function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}

@Component({
  selector: 'app-informe-acreditacion',
  templateUrl: './informe-acreditacion.component.html',
  styleUrls: ['./informe-acreditacion.component.css']
})



export class InformeAcreditacionComponent implements OnInit {
  public informeFinalDatos: Array<any> = [];
  public solicitudes: Array<any> = [];
  public listaPersonas: Array<any> = [];
  public listaAcreditados: Array<any> = [];

  public cedula: String;
  public datoACedula: any;
  public datoANombre: any;
  public datoAHoras: any;
  public datoAFecha: any;
  public datoCorNombre: any;
  public cedulaCoordinador: any = "0273947110";

  public dialogoGuardaryGenerar: boolean;
  public base64Output: string;
  formGuardar: FormGroup;

  acreditacion: Acreditacion = new Acreditacion();

  constructor(
    private informeFinalAlumnoService: InformeFinalAlumnoService,
    private solicitudAlumnoService: SolicitudAlumnoService,
    private router: Router, private route: ActivatedRoute,
    private acreditacionService: AcreditacionService,
    private personasService: PersonaService,
  ) {

  }

  ngOnInit(): void {
    this.listarInformeFinalAcreditacion();
    this.listarSolicitudAlumnos();
    this.capturarFecha();
    this.listarPersonas();
    this.listarAcreditacion();
    this.cedula = this.route.snapshot.paramMap.get('cedula');
    this.acreditacion.vinculacion.docente.persona.cedula = "0273947110";
  }

  //Métodos de listar
  public listarInformeFinalAcreditacion() {
    this.informeFinalAlumnoService.getInformeFinalparaAcreditacion().subscribe((resp: any) => {
      console.log(resp.data)
      this.informeFinalDatos = resp.data
    })
  }


  listarSolicitudAlumnos() {
    this.solicitudAlumnoService.getSolicitudAlumno().subscribe((resp: any) => {
      console.log(resp.data)
      this.solicitudes = resp.data
    }
    )
  }

  public listarPersonas() {
    this.personasService.getPersonaTodo().subscribe((resp: any) => {
      console.log(resp.data)
      this.listaPersonas = resp.data
    }
    )
  }

  public listarAcreditacion(){
    this.acreditacionService.getAcreditacion().subscribe((resp: any) => {
      console.log(resp.data)
      this.listaAcreditados = resp.data
    }
    )
  }

  showDialogGuardar(ced: any, hor: any, nom: any) {
    this.datoACedula = ced;
    this.datoAHoras = hor;
    this.datoANombre = nom;
    this.acreditacion.alumno.persona.cedula = ced;
    this.dialogoGuardaryGenerar = true;
    this.capturarPersona();
  }

  capturarPersona() {
    for (var i = 0; i < this.listaPersonas.length; i++) {
      if (this.listaPersonas[i].cedula == this.cedula) {
        this.datoCorNombre = this.listaPersonas[i].primerNombre + ' ' + this.listaPersonas[i].primerApellido;
      }
    }
  }


  capturarFecha() {
    let date = new Date();
    this.datoAFecha = String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + date.getFullYear();
  }

  //Metodo para crear

  public create(): void {


    var docubas = this.acreditacion.documento;

    try {
      if(docubas.length !=0){
        this.acreditacionService.createAcreditacion(this.acreditacion).subscribe(
          Response => {
            swal.fire(
              'Enviado',
              `Acreditacion creado con exito!`,
              'success'
            )
            this.dialogoGuardaryGenerar = false;

            //location.reload();

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

    /*
    this.acreditacionService.createAcreditacion(this.acreditacion).subscribe(
      Response => {
        swal.fire(
          'Enviado',
          `Acreditacion creado con exito!`,
          'success'
        )
        this.dialogoGuardaryGenerar = false;
        location.reload();

      }
    )*/


    /*
    try {
      if (docubas.length != 0) {
        this.acreditacionService.createAcreditacion(this.acreditacion).subscribe(
          Response => {
            swal.fire(
              'Enviado',
              `Acreditacion creado con exito!`,
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
*/

  }


  //Metodo para subir documento en base 64
  onFileSelected(event) {
    this.convertFile(event.target.files[0]).subscribe(base64 => {
      this.base64Output = base64;
      this.acreditacion.documento = base64;
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

  //metodo para generar documento

  generate(nom) {

    var dced = this.datoACedula;
    var dho = this.datoAHoras;
    var noes = this.datoANombre;
    var nomcorr = this.datoCorNombre;

    var fech = this.datoAFecha;
    let arr = fech.split('/');
    var dia = arr[0];
    var mes = arr[1];
    var anio = arr[2];


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


    loadFile("https://backendg1c2.herokuapp.com/files/Informe-Acreditacion.docx", function (
      error,
      content
    ) {
      if (error) {
        throw error;
      }



      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
      doc.setData({
        rpp: nom,
        numestudiantes: "2501",
        cedula: dced,
        horas: dho,
        nombreestudiante: noes,
        dia: dia,
        mes: mes,
        anio: anio,
        nombrecoordinador: nomcorr,


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
      saveAs(out, "CertificadoDeAcreditacion.docx");
    });
  }

}
