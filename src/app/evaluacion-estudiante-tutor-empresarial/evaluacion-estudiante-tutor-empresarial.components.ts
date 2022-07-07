import { Component, OnInit } from '@angular/core';
import { EvaluacionTEService } from '../services/evaluacionTE.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlumnosService } from '../services/alumnos.service';
import { evaluacionTE} from '../models/evaluacionTE';
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
  selector: 'app-eva-est-tut-empresarial',
  templateUrl: './evaluacion-estudiante-tutor-empresarial.components.html',

})
export class EvaluacionEstudianteTutorEmpresarialComponent implements OnInit {
  public nombreTutor:any="";
  public tutorEm: Array<any> = [];
   columnasTutorEm: any[];
   dialogoCrearEva: boolean;
   formEva: FormGroup;
   public alumnos: Array<any> = [];
   public id: String;
   public idd: String;
   evaluacionTe: evaluacionTE = new evaluacionTE();
   opcionA1;
   opcionB1;
   opcionC1;
   opcionD1;
   opcionE1;
   puntajeTotal: number;
   base64Output: string;
   registros: any;
   public cedula: String;
   public rol: String;

   constructor(
     private evaluacionService: EvaluacionTEService,
     private formBuilder: FormBuilder,
     private alumnoService: AlumnosService,
     private route: ActivatedRoute
   ) {}

   ngOnInit(): void {
     this.listarTutorEm();
     this.listarAlumnos();
     this.cedula = this.route.snapshot.paramMap.get('cedula');
     this.rol = this.route.snapshot.paramMap.get('rol');

     this.columnasTutorEm = [
       { field: 'idtuto', header: 'CI tutor' },
       { field: 'primer_nombr', header: 'Nombres del Tutor' },
       { field: 'segundo_apellid', header: 'Apellidos del Tutor' },
       { field: 'idalumn', header: 'CI Alumno' },
       { field: 'primer_nombre_alumn', header: 'Nombres del Alumno' },
       { field: 'segundo_apellido_alumn', header: 'Apellidos del Alumno' },
       { field: 'size', header: 'Acciones' },
     ];
     this.formEva = this.formBuilder.group({
       desde: ['', Validators.required],
       hasta: ['', Validators.required],
       numHoras: ['', Validators.required],
     });
   }

   Evaluacion(va: any, vat: any, nombre:any) {
     this.dialogoCrearEva = true;
     this.id = va;
     this.idd = vat;
     this.nombreTutor=nombre;
   }

   public listarTutorEm() {
     this.evaluacionService.getTutorEm().subscribe((resp: any) => {
       console.log(resp.data);
       this.tutorEm = resp.data;
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
       parseInt(this.opcionA1) +
       parseInt(this.opcionB1) +
       parseInt(this.opcionC1) +
       parseInt(this.opcionD1) +
       parseInt(this.opcionE1);
   }

   public create(pun: number): void {
     this.evaluacionTe.puntajeTotal = pun;

     var docubas = this.base64Output;

     if (this.formEva.invalid || docubas == 'undefined') {
       swal.fire(
         'Error de entrada',
         'Revise que los campos no esten vacios',
         'error'
       );
       return;
     }
     this.evaluacionTe.docEvaluacionTE = docubas;

     this.evaluacionService
       .createEvaluacion(this.evaluacionTe)
       .subscribe((Response) => {
         swal.fire('Enviado', `Evaluacion creada con exito!`, 'success');
         this.dialogoCrearEva = false;
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
     tutor,
   ) {
      var te=this.nombreTutor;
     if (this.formEva.invalid) {
       console.log(this.formEva);
       swal.fire(
         'Error de entrada',
         'Revise que los campos no esten vacios',
         'error'
       );
       return;
     }
     loadFile(
       'https://backendg1c2.herokuapp.com/files/anexo12.docx',
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
           tutor: te,
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
         saveAs(out, 'anexo12.docx');
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
