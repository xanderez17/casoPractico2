import { Component, OnInit } from '@angular/core';
import { EvaluacionTAService } from '../services/evaluacionTA.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlumnosService } from '../services/alumnos.service';
import { evaluacionTA } from '../models/evaluacionTA';
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import Docxtemplater from 'docxtemplater';
import { Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}

@Component({
  selector: 'app-evaluacion-estudiante-tutor-academico',
  templateUrl: './evaluacion-estudiante-tutor-academico.component.html',
  styleUrls: ['./evaluacion-estudiante-tutor-academico.component.css'],
})
export class EvaluacionEstudianteTutorAcademicoComponent implements OnInit {
  public tutorE: Array<any> = [];
  columnasTutorE: any[];
  dialogoCrearEvaluacion: boolean;
  formEvaluacion: FormGroup;
  public alumnos: Array<any> = [];
  public id: String;
  //el de abajo es el tutor
  public idd: String;
  evaluacionTa: evaluacionTA = new evaluacionTA();
  opcionA;
  opcionB;
  opcionC;
  opcionD;
  opcionE;
  puntajeTotal: number;
  base64Output: string;
  registros: any;
  public cedula: String;
  public rol: String;
  public nombreTutor:String;

  constructor(
    private evaluacionService: EvaluacionTAService,
    private formBuilder: FormBuilder,
    private alumnoService: AlumnosService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.listarTutorA();
    this.listarAlumnos();
    this.cedula = this.route.snapshot.paramMap.get('cedula');
    this.rol = this.route.snapshot.paramMap.get('rol');

    this.columnasTutorE = [
      { field: 'idtuto', header: 'Idtutor' },
      { field: 'primer_nombr', header: 'Nombre del Tutor' },
      { field: 'segundo_apellid', header: 'Apellido del Tutor' },
      { field: 'idalumn', header: 'IdAlumno' },
      { field: 'primer_nombre_alumn', header: 'Nombre del Alumno' },
      { field: 'segundo_apellido_alumn', header: 'Segundo Apellido' },
      { field: 'size', header: 'Acciones' },
    ];
    this.formEvaluacion = this.formBuilder.group({
      desde: ['', Validators.required],
      hasta: ['', Validators.required],
      numHoras: ['', Validators.required],
    });
  }

  miEvaluacion(va: any, vat: any,tu:any) {
    this.dialogoCrearEvaluacion = true;
    this.id = va;
    this.idd = vat;
    this.evaluacionTa.tutorAcademico.idTutorAcademico=vat;
    this.nombreTutor=tu;
  }

  public listarTutorA() {
    this.evaluacionService.getTutorA().subscribe((resp: any) => {
      console.log(resp.data);
      this.tutorE = resp.data;
    });
  }

  public listarAlumnos() {
    this.alumnoService.getlistaAlumnos().subscribe((resp: any) => {
      console.log(resp.data);
      this.alumnos = resp.data;
    });
  }
  sumar() {
    this.puntajeTotal =
      parseInt(this.opcionA) +
      parseInt(this.opcionB) +
      parseInt(this.opcionC) +
      parseInt(this.opcionD) +
      parseInt(this.opcionE);
  }

  public create(pun: number): void {
    this.evaluacionTa.puntajeTotal = pun;

    var docubas = this.base64Output;

    if (this.formEvaluacion.invalid || docubas == 'undefined') {
      swal.fire(
        'Error de entrada',
        'Revise que los campos no esten vacios',
        'error'
      );
      return;
    }
    this.evaluacionTa.docEvaluacionTA = docubas;

    this.evaluacionService
      .createEvaluacion(this.evaluacionTa)
      .subscribe((Response) => {
        swal.fire('Enviado', `Evaluacion creada con exito!`, 'success');
        this.dialogoCrearEvaluacion = false;
      });
  }
  //Generar documento
  generate(
    cedE: any,
    nomE: any,
    emp,
    carr,
    desE: any,
    hasE: any,
    opc1E: any,
    opc2E: any,
    opc3E: any,
    opc4E: any,
    opc5E: any,
    puntajeto: any,
    hor,
    tutorE
  ) {
  var lala=this.nombreTutor;
    if (this.formEvaluacion.invalid) {
      console.log(this.formEvaluacion);
      swal.fire(
        'Error de entrada',
        'Revise que los campos no esten vacios',
        'error'
      );
      return;
    }
    loadFile(
      'https://backendg1c2.herokuapp.com/files/anexo14.docx',
      function (error, content) {
        if (error) {
          throw error;
        }
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });
        doc.setData({
          ced: cedE,
          est: nomE,
          emp: emp,
          carre: carr,
          des: desE,
          has: hasE,
          opc1: opc1E,
          opc2: opc2E,
          opc3: opc3E,
          opc4: opc4E,
          opc5: opc5E,
          puntajet: puntajeto,
          hor: hor,
          tutor: lala,
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
              .join('\n');
            console.log('errorMessages', errorMessages);
          }
          throw error;
        }
        const out = doc.getZip().generate({
          type: 'blob',
          mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });
        // Output the document using Data-URI
        saveAs(out, 'anexo14.docx');
      }
    );
  }

  //Convertir a base 64 un documento

  onFileSelected(event) {
    this.convertFile(event.target.files[0]).subscribe((base64) => {
      this.base64Output = base64;
    });
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) =>
      result.next(btoa(event.target.result.toString()));
    return result;
  }
}
