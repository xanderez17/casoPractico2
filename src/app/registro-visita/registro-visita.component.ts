import { Component, OnInit } from '@angular/core';
import { InformeVisita, Visita } from '../models/Visita';
import { RegistroVisitaService } from '../services/registro-visita.service';
import swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InformeService } from '../services/Informe.service';
import { TutorAService } from '../services/tutorA.service';
import { Router, RouterLink } from '@angular/router';
import { AlumnosService } from '../services/alumnos.service';
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import Docxtemplater from 'docxtemplater';
import { Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs';

function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}

@Component({
  selector: 'app-registro-visita',
  templateUrl: './registro-visita.component.html',
  styleUrls: ['./registro-visita.component.css'],
})
export class RegistroVisitaComponent implements OnInit {
  public registrotutor: Array<any> = [];
  public registrovisita: Array<any> = [];
  public alumnos: Array<any> = [];
  registro: Visita = new Visita();
  informe: InformeVisita = new InformeVisita();
  formInforme: FormGroup;
  dataTutor: any[];
  columnasTutor: any[];
  dialogoPasos: boolean;
  registros: any;
  public id: String;
  //el de abajo es el tutor
  public idd: String;
  public nombreTutor: String;

  base64Output: string;

  constructor(
    private tutorA: RegistroVisitaService,
    private formBuilder: FormBuilder,
    private registrov: RegistroVisitaService,
    private alumnoService: AlumnosService,
    private informeserv: InformeService,
    private visitaI: RegistroVisitaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listarTutorAcademico();
    this.listarAlumnos();

    this.formInforme = this.formBuilder.group({
      fecha: ['', Validators.required],
      horainicio: ['', Validators.required],
      horafin: ['', Validators.required],
      asunto: ['', Validators.required],
      observaciones: ['', Validators.required],
    });

    this.columnasTutor = [
      { field: 'idtutor', header: 'Cédula Tutor' },
      { field: 'primer_nombre', header: 'Nombre TutorA' },
      { field: 'segundo_apellido', header: 'Apellido TutorA' },
      { field: 'idalumno', header: 'Cédula Alumno' },
      { field: 'primer_nombre_alumno', header: 'Nombre Alumno' },
      { field: 'segundo_apellido_alumno', header: 'Apellido Alumno' },
      { field: 'size', header: 'Generar' },
    ];
    this.ngOnInitd();
  }

  ngOnInitd(): void {
    this.listarVisita();
  }

  miEvaluacion(va: any, vat: any, tu: any) {
    this.dialogoPasos = true;
    this.id = va;
    this.idd = vat;
    this.registro.alumno.idAlumno = vat;
    this.nombreTutor = tu;
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
  public listarAlumnos() {
    this.alumnoService.getlistaAlumnos().subscribe((resp: any) => {
      console.log(resp.data);
      this.alumnos = resp.data;
    });
  }
  public create(ide: any, obs: any): void {
    this.registro.alumno.idAlumno = ide;
    this.registro.observaciones = obs;

    var docubas = this.base64Output;
    this.registro.docRegistroVisita = docubas;

    this.registrov
      .createVisita(this.registro)
      .then((Response) => {
        this.registros = Response['data'];
        console.log(this.registros[0].idRegistroVisitaE);
        swal.fire(
          'Registrado el Informe !GUARDE LA VISITA PORFAVOR!',
          ``,
          'success'
        );
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
    this.dialogoPasos = false;
  }

  //Generar documento
  generate(
    sig,
    estu: any,
    cic: any,
    fec,
    hori,
    horf,
    asunt: any,
    obser: any,
    obserg: any
  ) {
    var lala = this.nombreTutor;
    if (this.formInforme.invalid) {
      console.log(this.formInforme);
      swal.fire(
        'Error de entrada',
        'Revise que los campos no esten vacios',
        'error'
      );
      return;
    }
    loadFile(
      'https://backendg1c2.herokuapp.com/files/anexo11.docx',
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
          siglas: sig,
          tutor: lala,
          estudiante: estu,
          ciclo: cic,
          periodo: 'Mayo 2022 - Diciembre 2022',
          fecha: fec,
          inicio: hori,
          fin: horf,
          asunto: asunt,
          observación: obser,
          observaciong: obserg,
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
        saveAs(out, 'anexo11.docx');
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
  public limpiar(): void {
    this.informe.fecha = null;
    this.informe.horaInicio = null;
    this.informe.horaFin = null;
    this.informe.asunto = null;
    this.informe.observaciones = null;
  }
}
