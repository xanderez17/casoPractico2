import {Component, OnInit, Inject} from '@angular/core';
import {AlumnosService} from 'src/app/services/alumnos.service';
import {FormBuilder, FormGroup} from "@angular/forms";
import {DocenteService} from "../services/docente.service";
import {ConfirmationService, LazyLoadEvent, MessageService} from "primeng/api";
import {TutorAService} from "../services/tutorA.service";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import {saveAs} from "file-saver";
import Docxtemplater from "docxtemplater";
import {EmpresaService} from "../services/empresa.service";
import {Observable, ReplaySubject} from "rxjs";
import { toBase64String } from '@angular/compiler/src/output/source_map';


function loadFile(url: any, callback: any) {
  PizZipUtils.getBinaryContent(url, callback);
}

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@Component({
  selector: 'app-desig-tutor-academico',
  templateUrl: './desig-tutor-academico.component.html',
  styleUrls: ['./desig-tutor-academico.component.css'],
})
export class DesigTutorAcademicoComponent implements OnInit {


  constructor(private _alumnoCrud: AlumnosService,
              private _formBuilder: FormBuilder,
              private _docenteCrud: DocenteService,
              private _tutorACrud: TutorAService,
              private _empresasCrud: EmpresaService,
              private _messageService: MessageService) {
  }

  //ARCHIVOS BASE
  base64Output: string;


  //DATAS PARA RECIBIR DATOS
  dataDocentes: any[];
  dataTutores: any[];
  dataRowAlumno: any;
  dataAlumnos: any[];
  dataRowDocente: any;
  dataRowTutor: any;
  ObjetoAlumno: any;
  ObjetoDocente: any;
  ObjetoTutor: any;
  tutor: any;

  //COLUMNAS DE TABLAS
  columnasEstudiantes: any[];
  conlumnasDocentes: any[];
  columnasTutoresA: any[];

  //DIALOGOS Y FORMS PARA HACER VISIBLES DIALOGOS Y CONTROLAR INGRESO DE DATOS
  dialogoAsignar: boolean;
  formTutor: FormGroup;
  dialogoPasos: boolean;
  dialogoAlumnos: boolean;




  ngOnInit(): void {
    this.columnasEstudiantes = [
      {field: 'cedula', header: 'Cedula'},
      {field: 'nombres', header: 'Primer nombre'},
      {field: 'apellidos', header: 'Segundo Nombre'},
      {field: 'ciclo', header: 'Primer apellido'},
      {field: 'paralelo', header: 'Segundo Apellido'},
      {field: 'promedio', header: 'Correo'},
      {field: 'carrera', header: 'Carrera'},
      {field: 'nombre_empresa', header: 'Solicitud a empresa'},
      {field: 'aginarta', header: 'Asignar tutor'},

    ];

    this.conlumnasDocentes = [
      {field: 'cedula', header: 'Cedula'},
      {field: 'abrev_titulo', header: 'Abrv. Titulo'},
      {field: 'titulo', header: 'Titulo'},
      {field: 'primer_nombre', header: 'Primer nombre'},
      {field: 'segundo_nombre', header: 'Segundo Nombre'},
      {field: 'primer_apellido', header: 'Primer apellido'},
      {field: 'segundo_apellido', header: 'Segundo Apellido'},
      {field: 'correo', header: 'Correo'},
      {field: 'designarC', header: 'Designar como tutor'}
    ];

    this.columnasTutoresA=[
      {field: 'id_tutor_academico', header: 'Id tutor'},
      {field: 'a_nombres', header: 'Nombres alumno'},
      {field: 'a_apellidos', header: 'Apellidos alumno'},
      {field: 'd_nombres', header: 'Nombres docente'},
      {field: 'd_apellidos', header: 'Apellidos docente'},
      {field: 'doc_asignacion', header: 'Documento'},
      {field: 'eliminarta', header: 'Eliminar tutor'},
    ];

    this.obtenerListaTutores();
  }

  obtenerListaTutores():void{
    this._tutorACrud.getTutoresAcademicosVista().then(value => {
      this.dataTutores=value['data'];
      this.mostarMensajeCorrecto(value['mensaje']);
      console.log(this.dataTutores);
    }).catch((err)=>{
      this.mostrarMensajeError('El listado de tutores no se genero exitosamente');
    })
  }

  obtenerAlumnos(): void {
    this._alumnoCrud.getAlumnosST().then(value => {
      this.dataAlumnos = value['data'];
      this.mostarMensajeCorrecto("Lista de alumnos generada exitosamente");
    })
      .catch(((err) => {
          this.mostrarMensajeError("Problema en listado de estudiantes");
        })
      );
  }

  eliminarTutor(): void{
    if(this.ObjetoTutor!=null){
      this._tutorACrud.deleteTutorAcademico(this.ObjetoTutor['id_tutor_academico']).then( value => {
        this.obtenerListaTutores();
        this.mostarMensajeCorrecto(value['mensaje'])
      }).catch((err)=>{
        this.mostrarMensajeError('El tutor no se puede borrar por que se encuentra en mas procesos')
      })
    }else{
      this.mostrarMensajeError('No puede elimar por que no ha clickeado sobre la fila')
    }
  }


  asignarTutor() {
    // this.dialogoAsginar.open(Dialog);
    this.dialogoAsignar = true;
    this.obtenerDocentes();
  }

  designarDocente() {
    if (this.dataRowAlumno != null) {
      if (this.dataRowDocente != null) {
        let docenteG: any;
        let alumnoG: any;
        this._docenteCrud.getDocenteCedula(this.dataRowDocente['cedula']).then(value => {
          docenteG = value['data'];
        });
        this._alumnoCrud.getAlumnoCedula(this.dataRowAlumno['cedula']).then(value => {
          alumnoG = value['data'];
        });
        let nombreDocumento: string = 'anexo6.' + this.dataRowDocente['primer_nombre'] + [this.dataRowDocente['primer_apellido']] + '.docx';
        let fechaActual = new Date().toLocaleDateString();
        let fechacortada: any[] = fechaActual.split('/');
        let datageneral: any = {
          dia: fechacortada[0],
          mes: this.devolvermes(fechacortada[1]),
          ano: fechacortada[2],
          tituloD: this.dataRowDocente['abrev_titulo'],
          datosE: this.dataRowAlumno['nombres'] + ' ' + this.dataRowAlumno['apellidos'],
          datosD: this.dataRowDocente['primer_nombre'] + ' ' + this.dataRowDocente['segundo_nombre'] + ' ' + this.dataRowDocente['primer_apellido'] + ' ' + this.dataRowDocente['segundo_apellido'],
          carrera: this.dataRowAlumno['carrera'],
          empresa: this.dataRowAlumno['nombre_empresa']
        };
        this.dialogoAsignar=false;
        this.dialogoPasos=true;
        this.generate(datageneral,'https://backendg1c2.herokuapp.com/files/anexo6.docx',nombreDocumento);
      } else {
        this.mostrarMensajeError('El docente no ha sido clickeado')
      }
    } else {
      this.mostrarMensajeError('El alumno no ha sido clickeado');
    }
  }

  crearTutorAcademico():void{
    this._tutorACrud.createTutorAcademico(this.dataRowDocente['cedula'], this.dataRowAlumno['cedula'], this.tutor).then(value => {
      this.mostarMensajeCorrecto(value['mensaje']);
      this.dialogoAsignar = false;
      this.dialogoPasos=false;
      this.dialogoAlumnos=false;
      this.obtenerListaTutores();
    }).catch((err) => {
      this.mostrarMensajeError("No se pudo designar tutor")
    });
  }

  obtenerDocentes(): void {
    this._docenteCrud.getDocentes().subscribe(value => {
      this.dataDocentes = value['data'];
      this.mostarMensajeCorrecto('Lista de docentes generada');
    })
  }

  generarDesignacion():void{
    this.dialogoAlumnos=true;
    this.obtenerAlumnos();
  }
  lazyLoad(event: LazyLoadEvent): void {
    setTimeout(() => {
      this.obtenerAlumnos();
    }, 0);
  }

//-> METODOS PARA CARGA DE MENSAJES

  mostrarMensajeError(mensaje: String): void {
    this._messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Incorrecto: ' + mensaje,
      life: 3000,
    });
  }


  mostarMensajeCorrecto(mensaje: String): void {
    this._messageService.add({
      severity: 'success',
      summary: 'Hecho',
      detail: 'Correcto: ' + mensaje,
      life: 3000,
    });
  }

//->METODOS PARA OBTENER OBJETO DE LA FILA SELECCIONADA

  onRowSelectDocente(event): void {
    this.ObjetoDocente=null;
    if (event.data) {
      this.dataRowDocente = event.data;
      this.ObjetoDocente = {...this.dataRowDocente};
    }
  }

  onRowUnSelectDocente(event): void {
    if (event.data) {
      this.dataRowDocente = null;
    }
  }

  onRowSelectAlumno(event): void {
    this.ObjetoAlumno = null;
    if (event.data) {
      this.dataRowAlumno = event.data;
      this.ObjetoAlumno = {...this.dataRowAlumno};
    }
  }

  onRowUnSelectAlumno(event): void {
    if (event.data) {
      this.dataRowAlumno = null;
    }
  }

  onRowSelectTutor(event): void {
    this.ObjetoTutor = null;
    if (event.data) {
      this.dataRowTutor = event.data;
      this.ObjetoTutor = {...this.dataRowTutor};
    }
  }

  onRowUnSelectTutor(event): void {
    if (event.data) {
      this.dataRowTutor = null;
    }
  }


//-> DEPENDIENDO DE LA FECHA OBTENIDA SE SACA MES EN ESPANOL

  devolvermes(mes: any): any {
    switch (mes) {
      case '1':
        return 'enero'
        break;

      case '2':
        return 'febrero'
        break;

      case '3':
        return 'marzo'
        break;

      case '4':
        return 'abril'
        break;

      case '5':
        return 'mayo'
        break;

      case '6':
        return 'junio'
        break;

      case '7':
        return 'julio'
        break;

      case '8':
        return 'agosto'
        break;

      case '9':
        return 'septiembre'
        break;

      case '10':
        return 'octubre'
        break;

      case '11':
        return 'noviembre'
        break;

      case '12':
        return 'diciembre'
        break;
    }
  }

//-> PARA CARGA DE ARCHIVOS

  generate(nom: any, anexoRequerido: string, nombreDoc: string):void  {
    loadFile(anexoRequerido, function (
      error,
      content
    ) {
      if (error) {
        throw error;
      }
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {paragraphLoop: true, linebreaks: true});
      doc.setData({
        ...nom
      });
      try {
        doc.render();
      } catch (error) {
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

        //console.log(JSON.stringify({error: error}, replaceErrors));
        if (error.properties && error.properties.errors instanceof Array) {
          const errorMessages = error.properties.errors
            .map(function (error) {
              return error.properties.explanation;
            })
            .join("\n");
          //console.log("errorMessages", errorMessages);
        }
        throw error;
      }
      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      });
      // Output the document using Data-URI
      saveAs(out, nombreDoc);
    });
  }



  checkForMIMEType() {
    var response = this.ObjetoTutor['doc_asignacion'];
    console.log(response)
    var blob;
    if (response.mimetype == 'pdf') {

      blob = this.converBase64toBlob(response.content, 'application/pdf');
    } else if (response.mimetype == 'doc') {
      blob = this.converBase64toBlob(response.content, 'application/msword');
        }

    /* application/vnd.openxmlformats-officedocument.wordprocessingml.document */

    blob = this.converBase64toBlob(response, 'application/pdf');
    var blobURL = URL.createObjectURL(blob);
    window.open(blobURL);
  }
  converBase64toBlob(content, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = window.atob(content); //method which converts base64 to binary
    var byteArrays = [
    ];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, {
      type: contentType
    }); //statement which creates the blob
    return blob;
  }


  dataURLtoFile(dataurl: any, filename: any) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
  }

    onFileSelected(event) {
      this.convertFile(event.files['0']).subscribe(base64 => {
        this.base64Output = base64;
        this.tutor = {
          docAsignacion: this.base64Output
        };
        this.mostarMensajeCorrecto('El archivo fue cargado con exito')
      });
  }

  convertFile(file : File) : Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    console.log(result)
    return result;
  }


}
