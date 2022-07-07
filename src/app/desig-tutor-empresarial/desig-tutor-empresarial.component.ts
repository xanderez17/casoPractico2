import {Component, OnInit} from '@angular/core';
import {TokenService} from "../services/token.service";
import {EmpleadoService} from "../services/empleado.service";
import {LazyLoadEvent, MessageService} from "primeng/api";
import {FormBuilder, FormGroup} from "@angular/forms";


import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import {saveAs} from "file-saver";
import Docxtemplater from "docxtemplater";
import {EmpresaService} from "../services/empresa.service";
import {Observable, ReplaySubject} from "rxjs";
import {toBase64String} from '@angular/compiler/src/output/source_map';
import {SolicitudAlumnoService} from "../services/solicitud-alumno.service";
import {TutorEmpresarialService} from "../services/tutor-empresarial.service";

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
  selector: 'app-desig-tutor-empresarial',
  templateUrl: './desig-tutor-empresarial.component.html',
  styleUrls: ['./desig-tutor-empresarial.component.css']
})
export class DesigTutorEmpresarialComponent implements OnInit {

  base64Output: string;

  dialogoGenerar: boolean;
  dialogoAlumnos: boolean;
  dialogoDatas: boolean;

  columnasTutores: any[];
  columnasEmpleados: any[];
  columasAlumnosSol: any[];


  dataTutores: any[];
  dataEmpleados: any[];
  dataLogeado: any;
  dataSolicitudesAlum: any[];
  datalog: any;
  documentoTutor: any;


  ObjetoTutor: any;
  ObjetoEmpleado: any;
  ObjetoAlumno: any;
  ObjetoLogeado: any;


  dataRowTutor: any;
  dataRowEmpleado: any;
  dataRowAlumno: any;

  constructor(private _formBuilder: FormBuilder,
              private _empresasCrud: EmpresaService,
              private _messageService: MessageService,
              private crudEmpleado: EmpleadoService,
              private _tokenService: TokenService,
              private _solCrud: SolicitudAlumnoService,
              private _crudTutorE: TutorEmpresarialService) {

    this.columnasTutores = [
      {field: 'id_tutor_empresarial', header: 'ID'},
      {field: 'a_nombres', header: 'Nom. Alumno'},
      {field: 'a_apellidos', header: 'Ape. Alumno'},
      {field: 'e_nombres', header: 'Nom. Empleado'},
      {field: 'e_apellidos', header: 'Apellido Empleado'},
      {field: 'doc_asignacion', header: 'Documento'},
      {field: 'nombre_empresa', header: 'Empresa'},
      {field: 'eliminarta', header: 'Eliminar tutor'},


    ];

    this.columnasEmpleados = [
      {field: 'id_personal', header: 'ID'},
      {field: 'cedula', header: 'Cedula '},
      {field: 'p_nombres', header: 'Nom. Empleado'},
      {field: 'p_apellidos', header: 'Ape. Empleado'},
      {field: 'abrev_titulo', header: 'Titulo'},
      {field: 'cargo', header: 'Cargo'},
      {field: 'designarC', header: 'Asignar'},
    ];

    this.columasAlumnosSol = [
      {field: 'id_alumno', header: 'ID'},
      {field: 'cedula', header: 'Cedula '},
      {field: 'a_nombres', header: 'Nom. Empleado'},
      {field: 'a_apellidos', header: 'Ape. Empleado'},
      {field: 'asignar', header: 'Asignar alumno'},
    ]


    this.obtenerEmpresaLogeado();
    this.obtenerEmpleadoLog();


  }


  ngOnInit(): void {
    this.obtenerEmpresaLogeado();
    this.obtenerEmpleadoLog();
  }


  obtenerEmpresaLogeado() {
    this.crudEmpleado.getEmpresaLogeado(this._tokenService.getUserName()).then(value => {
      this.dataLogeado = value['data'];
      console.log('empresa ->' + this.dataLogeado[0].idEmpresa);
      this.obtenerTutoresEmpresa();
    }).catch((err) => {
      console.log('ERRO ' + err);
    });

  }

  generarDesignacion() {
    this.dialogoGenerar = true;
    this.obtenerEmpleados();

  }


  obtenerEmpleados() {
    this.obtenerEmpresaLogeado();
    this.crudEmpleado.getEmpleadosEmpresa(this.dataLogeado[0].idEmpresa).then(value => {
      this.dataEmpleados = value['data'];
      console.log('EMPLADOS ->' + this.dataEmpleados)
      this.mostarMensajeCorrecto('Lista de empleados generada exitosamente');
    }).catch((err) => {
      console.log('error ' + err)
      this.mostrarMensajeError('Error al generar listado de empleados')
    });
  }


  obtenerTutoresEmpresa() {
    this.crudEmpleado.listarTutoresMios(this.dataLogeado[0].idEmpresa).then(value => {
      this.dataTutores = value['data'];
      console.log(this.dataTutores);
    }).catch((err) => {
      console.log('ERROR DE TUTORES ' + err)
    })
  }


  asignarTutor() {
    if (this.ObjetoEmpleado != null) {
      this.dialogoGenerar = false
      this.dialogoAlumnos = true;
      this._solCrud.listaSolicitudesAlumnosAprobados(this.dataLogeado[0].idEmpresa).then(value => {
        this.dataSolicitudesAlum = value['data'];
        this.mostarMensajeCorrecto('Lista de alumnos generada exitosamente')
      }).catch((err) => {
        this.mostrarMensajeError('Error al generar lista de alumnos')
      })
    } else {
      this.mostrarMensajeError('No ha clickeado sobre la fila para designar al emppleado')
    }
  }

  generarData() {
    if (this.ObjetoAlumno != null) {
      this.dialogoAlumnos = false;
      this.dialogoDatas = true;
      console.log('EMPLEADO', this.ObjetoEmpleado)
      console.log('ALUMNO', this.ObjetoAlumno)
      this.armarDataParaAnexo();
    } else {
      this.mostrarMensajeError('No ha dado clic sobre la fila del alumno a designar');
    }
  }

  obtenerEmpleadoLog() {
    this.crudEmpleado.obtenerEmpleado(this._tokenService.getUserName()).then(value => {
      this.datalog = value['data']
      console.log(this.datalog)
    }).catch((err) => {
      console.log('ERROR EMPLEADO LOG ->', err);
    })
  }

  armarDataParaAnexo(): void {
    if (this.ObjetoAlumno != null) {
      let fechaActual = new Date().toLocaleDateString();
      let fechacortada: any[] = fechaActual.split('/');
      let dataGeneral: any = {
        dia: fechacortada[0],
        mes: this.devolvermes(fechacortada[1]),
        anio: fechacortada[2],
        titulorp: this.ObjetoAlumno.tit_rp,
        nombrerp: this.ObjetoAlumno.rp_nombres + ' ' + this.ObjetoAlumno.rp_apellidos,
        carrera: this.ObjetoAlumno.carrera_rp,
        tituloEmp: this.ObjetoEmpleado.abrev_titulo,
        nomEmp: this.ObjetoEmpleado.p_nombres + ' ' + this.ObjetoEmpleado.p_apellidos,
        cedulaemp: this.ObjetoEmpleado.cedula,
        nomEst: this.ObjetoAlumno.a_nombres + ' ' + this.ObjetoAlumno.a_apellidos,
        nombreLog: this.datalog[0].primer_nombre + ' ' + this.datalog[0].segundo_apellido + ' ' + this.datalog[0].primer_apellido + ' ' + this.datalog[0].segundo_apellido,
        cargoLog: this.datalog[0].cargo
      }
      let nombreDocumento: any = 'anexo5' + this.ObjetoEmpleado.p_nombres + '' + this.ObjetoEmpleado.p_apellidos + '.docx'
      this.generate(dataGeneral, 'https://backendg1c2.herokuapp.com/files/anexo5.docx', nombreDocumento);
    } else {
      this.mostrarMensajeError('NO SE PUEDE GENERAR EL ARCHIVO POR QUE NO SELECCIONADO FILAS')
    }
  }




  terminarDesignacion() {
    if (this.base64Output != null) {
      let tutorEmpresarial: any = {
        control: 'MONITOREAR AL ALUMNO EN SUS ACTIVIDADES',
        docAsignacion: this.base64Output
      }
      this._crudTutorE.createTutorEmpresarial(this.ObjetoEmpleado.cedula, this.ObjetoAlumno.cedula, tutorEmpresarial).then(value => {
        this.mostarMensajeCorrecto('LA DESIGNACION SE CREO CORRECTAMENTE');
        this.dialogoDatas = false;
        this.ObjetoAlumno = null;
        this.ObjetoEmpleado = null;
        this.obtenerEmpresaLogeado();
        this.obtenerEmpleadoLog();
        this.obtenerTutoresEmpresa();
      }).catch((err) => {
        this.mostrarMensajeError('ERROR AL CREAR DESIGNACION');
      })


    } else {
      this.mostrarMensajeError('NO PUEDE TERMINAR DESIGNACION POR QUE NO HA CARGADO EL ANEXO')
    }
  }


  eliminarTutorEmp():void{
    if(this.ObjetoTutor!=null){
      this._crudTutorE.deleteTutorEmpresarial(this.ObjetoTutor.id_tutor_empresarial).then(value => {
        this.mostarMensajeCorrecto('Tutor empresarial borrado correctamente');
        this.obtenerEmpresaLogeado();
        this.obtenerEmpleadoLog();
        this.obtenerTutoresEmpresa();
      }).catch((err)=>{
        this.mostrarMensajeError('No puede borrar este tutor por que se encuntra en mas procesos')
      })
    }else{
      this.mostrarMensajeError('NO PUEDE BORRRA POR QUE NO HA DADO CLICK SOBRE EL TUTOR')
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
      this.ObjetoTutor = null;
    }
  }

  onRowSelectEmpleado(event): void {
    this.ObjetoEmpleado = null;
    if (event.data) {
      this.dataRowEmpleado = event.data;
      this.ObjetoEmpleado = {...this.dataRowEmpleado};
    }
  }

  onRowUnSelectEmpleado(event): void {
    if (event.data) {
      this.dataRowEmpleado = null;
      this.ObjetoEmpleado = null;
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
      this.ObjetoAlumno = null;
    }
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

  generate(nom: any, anexoRequerido: string, nombreDoc: string): void {
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
    //console.log(response)
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
    var byteArrays = [];
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

  /*onFileSelected(event) {
    this.convertFile(event.files['0']).subscribe(base64 => {
      this.base64Output = base64;
      this.ObjetoTutor = {
        docAsignacion: this.base64Output
      };
      this.mostarMensajeCorrecto('El archivo fue cargado con exito')
    });
  }*/


  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    console.log(result)
    return result;
  }

  onFileSelected(event) {
    this.convertFile(event.files['0']).subscribe(base64 => {
      this.base64Output = base64;
      this.documentoTutor = {
        docAsignacion: this.base64Output
      };
      this.mostarMensajeCorrecto('El archivo fue cargado con exito')
    });
  }


}
