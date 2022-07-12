import { Component, OnInit } from '@angular/core';
import { TutorEmpresarialService } from 'src/app/services/tutor-empresarial.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PersonaService } from 'src/app/services/persona.service';
import { ActaReunionService } from 'src/app/services/acta-reunion.service';
import { SolicitudAlumnoService } from 'src/app/services/solicitud-alumno.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import { Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import swal from 'sweetalert2';
import { ResponsablepppService } from 'src/app/services/responsableppp.service';
import { CertificadoEmpresaService } from 'src/app/services/certificadoEmpresa.service';
import { CertificadoEmpresa } from 'src/app/models/CertificadoEmpresa';
import { TutorE } from 'src/app/models/TutorE';
import { ThisReceiver } from '@angular/compiler';

function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}


@Component({
  selector: 'app-generar-certificado-empresa',
  templateUrl: './generar-certificado-empresa.component.html',
  styleUrls: ['./generar-certificado-empresa.component.css']
})
export class GenerarCertificadoEmpresaComponent implements OnInit {


  public listaTutorEmpresarial: Array<any> = [];
  public listaActaReunion: Array<any> = [];
  public listaPersona: Array<any> = [];
  public listasolicitudAlumnos: Array<any> = [];
  public listaResponsablesPPP: Array<any> = [];


  public cedula: String;
  public base64Output: string;
  public datoAFecha: any;



  public dialogoGuardaryGenerar: boolean;
  public dialogoGuardarxd: boolean;

  public datoCarrera: String;
  public datoNombreEstudiante: String;
  public datoCedulaEstudiante: String;
  public datoNumeroHoras: String;
  public datoNombreTuEmpresarial: String;
  public datoCedulaTempresarial: String;
  public datoEmpresa: String;
  public datoIdPersonalxd: String;
  public datoIdAlumno: String;

  formGuardar: FormGroup;
  formGuardarxd: FormGroup;

  certificadoEmpresa: CertificadoEmpresa = new CertificadoEmpresa();
  tutorE: TutorE = new TutorE();



  constructor(
    private personaService: PersonaService,
    private tutorEmpresarialService: TutorEmpresarialService,
    private actaReunionService: ActaReunionService,
    private solicitudAlumnoService: SolicitudAlumnoService,
    private responsablePPPService: ResponsablepppService,
    private certificadoEmpresaService: CertificadoEmpresaService,
    private router: Router, private route: ActivatedRoute,

  ) { }


  ngOnInit(): void {
    this.listarPersona();
    this.listarTutorEmpresarial();
    this.listarActaReunion();
    this.listarSolicitudAlumnos();
    this.listarResponsablesPPP();
    this.cedula = this.route.snapshot.paramMap.get('cedula');
    this.capturarFecha();

  }




  //METODOS LISTAR
  listarTutorEmpresarial() {
    this.tutorEmpresarialService.getTutorEmpresarial().subscribe((resp: any) => {
      console.log("lista tutores");
      console.log(resp.data)
      this.listaTutorEmpresarial = resp.data
    }
    )
  }

  listarActaReunion() {

    this.actaReunionService.getActaReunion().subscribe((resp: any) => {
      console.log(resp.data)
      this.listaActaReunion = resp.data
    }
    )
  }

  listarSolicitudAlumnos() {
    this.solicitudAlumnoService.getSolicitudAlumno().subscribe((resp: any) => {
      console.log(resp.data)
      this.listasolicitudAlumnos = resp.data
    }
    )
  }

  listarResponsablesPPP() {
    this.responsablePPPService.getResponsablesMFrank().subscribe((resp: any) => {
      console.log(resp.data)
      this.listaResponsablesPPP = resp.data
    }
    )
  }


  buscarDatoPaModificar() {
    for (var i = 0; i < this.listaTutorEmpresarial.length; i++) {


      if (this.listaTutorEmpresarial[i].idTutorEmpresarial == this.certificadoEmpresa.tutorE.idTutorEmpresarial) {

        this.tutorE.idTutorEmpresarial = this.listaTutorEmpresarial[i].idTutorEmpresarial;
        this.tutorE.docAsignacion = this.listaTutorEmpresarial[i].docAsignacion;
        this.tutorE.personalEmpresa.persona.cedula = this.cedula;
        this.tutorE.alumno.persona.cedula = this.datoIdAlumno;
        this.tutorE.control = "matutino1";

      }

    }
  }

  listarPersona() {
  }




  showGuarda(carrera: any, tutorE: any, estudiante: any, cedEstudiante: any, cedTutorE: any, horas: any, emp: any, idTu: any, idPer: any, idAlu: any) {


    this.datoCarrera = carrera;
    this.datoNombreEstudiante = estudiante;
    this.datoCedulaEstudiante = cedEstudiante;
    this.datoIdAlumno = cedEstudiante;
    this.datoIdPersonalxd = idPer;
    this.datoNumeroHoras = horas;
    this.datoNombreTuEmpresarial = tutorE;
    this.datoCedulaTempresarial = cedTutorE;
    this.datoEmpresa = emp;
    this.certificadoEmpresa.tutorE.idTutorEmpresarial = idTu;
    this.dialogoGuardaryGenerar = true;
    this.buscarDatoPaModificar();
  }

  //Metodo para subir documento en base 64
  onFileSelected(event) {
    this.convertFile(event.target.files[0]).subscribe(base64 => {
      this.base64Output = base64;
      //console.log(this.base64Output);
      //this.acreditacion.documento = base64;
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



  //
  //editar estado
  editaRegustro() {
    this.certificadoEmpresaService.createTuEmpresarial(this.tutorE).subscribe(
      Response => {
        location.reload();
        swal.fire(
          'Enviado',
          `Actividad creada con exito!`,
          'success'
        )

      }
    )
  }



  //metodo para generar documento

  generate() {

    var numPosibilidades = 100 - 70;
    var aleatorio = Math.random() * (numPosibilidades + 1);
    aleatorio = Math.floor(aleatorio);
    var nume= 70 + aleatorio;



    var carr = this.datoCarrera;
    var fech = this.datoAFecha;


    var noes = this.datoNombreEstudiante;
    var cedest = this.datoCedulaEstudiante;
    var nuhor = this.datoNumeroHoras;
    var nomtuem = this.datoNombreTuEmpresarial;
    var cedte = this.datoCedulaTempresarial;
    var emp = this.datoEmpresa;

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


    loadFile("https://backendg1c2.herokuapp.com/files/anexo12.1.docx", function (
      error,
      content
    ) {
      if (error) {
        throw error;
      }



      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
      doc.setData({

        numestudiantes: "2501",
        dia: dia,
        mes: mes,
        anio: anio,
        carrera_rp: carr,
        nom_est: noes,
        cedula_est: cedest,
        num_horas: nuhor,
        nombre_te: nomtuem,
        cedula_te: cedte,
        empresa: emp,
        carrera_est: carr,
        titutlo_r: 'LIC',
        nombre_rp: 'KARLA NIEVES',
        fecha_i: '30-05-2022',
        fecha_f: '15-07-2022',
        clfc: nume,
        descripcion: 'ASVAV',


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
      saveAs(out, "CertificadoAlumno.docx");
    });
  }

  create() {
    var docubas = this.base64Output;


    this.certificadoEmpresa.docCertificadoE = docubas;


    try {
      if (docubas.length != 0) {
        this.certificadoEmpresaService.createCertificado(this.certificadoEmpresa).subscribe(
          Response => {
            swal.fire(
              'Enviado',
              `Informe creada con exito!`,
              'success'
            )
            this.dialogoGuardaryGenerar = false;


          }
        )
      }
      this.editaRegustro();



    } catch (error) {
      swal.fire(
        'Error de entrada',
        'Seleccione documento',
        'error'
      )
      return;
    }

  }

  capturarFecha() {
    let date = new Date();
    this.datoAFecha = String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + date.getFullYear();
    this.certificadoEmpresa.fechaEmision = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  }

}
