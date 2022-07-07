import {Component, OnInit, Pipe} from '@angular/core';
import {Solicitud_empresaService} from "../services/solicitud_empresa.service";
import {MessageService} from "primeng/api";
import {TokenService} from "../services/token.service";
import {ResponsableService} from "../services/responsable.service";
import {ResponsablepppService} from "../services/responsableppp.service";
import {ActividadesConvenioService} from "../services/actividades-convenio.service";
import {EmpleadoService} from "../services/empleado.service";
import {Observable, ReplaySubject} from "rxjs";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils";
import {saveAs} from "file-saver";
import {PersonaService} from "../services/persona.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";


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
  selector: 'app-solicitud-empresa',
  templateUrl: './solicitud-empresa.component.html',
  styleUrls: ['./solicitud-empresa.component.css']
})
export class SolicitudEmpresaComponent implements OnInit {

  dialogoResponsable: boolean;
  dialogoDatosGenerar: boolean;
  dataResponsable: any[];
  dataRowResponsable: any;
  ObjetoResponsable: any;
  columnasResponsable: any[];
  dataActividadesConvenio: any[];
  columnasActividades: any[];
  dataEmpresa: any[];
  objetoSolicitud: any;
  solicitud: any;
  base64Output: string;
  datosLogeado: any[];
  dataEmpleados: any[];
  empleado: any;
  formSolicitud: FormGroup;

  constructor(private _solicitudEmpresaCrud: Solicitud_empresaService,
              private _messageService: MessageService,
              private _tokenCrud: TokenService,
              private _crudResponsable: ResponsablepppService,
              private _crudActividades: ActividadesConvenioService,
              private _crudEmpleado: EmpleadoService,
              private _crudPersona: PersonaService,
              private formBuilder: FormBuilder
  ) {

    this.columnasSolicitudes = [
      {field: 'id_solicitud_empresa', header: 'Id Solicitud'},
      {field: 'fecha_emision', header: 'Fecha Emision'},
      {field: 'fecha_inicio', header: 'Fecha de incio'},
      {field: 'numero_alumnos', header: 'No Alumnos'},
      {field: 'pdf_solicitud', header: 'Documento'},
      {field: 'respuesta', header: 'Respuesta'},
      //{field: 'estado', header: 'Estado'},
      {field: 'empleado', header: 'Empleado que genero'},
      {field: 'responsable', header: 'Responsable PPP'},
      {field: 'eliminartS', header: 'Eliminar solicitud'},
    ];
    this.obtenerSolicitudes();

    this.columnasResponsable = [
      {field: 'id_responsableppp', header: 'Id'},
      {field: 'cedula', header: 'Cedula responsable'},
      {field: 'titulo', header: 'Titulo de responsable'},
      {field: 'abrev_titulo', header: 'Abrev titulo'},
      {field: 'nombre_carrera', header: 'Carrera a cargo'},
      {field: 'nombres_r', header: 'Nombres responsable'},
      {field: 'apellidos_r', header: 'Apellidos responsable'},
      {field: 'designarC', header: 'Dirigida ha'},
    ];


    this.columnasActividades = [
      {field: 'area', header: 'Area de activiadad'},
      {field: 'descripcion', header: 'Descripcion '},
    ];


    this.obtenerActividadesConvenio();
    this.cargarLogeado();
    this.obtenerEmpleado();
  }


  ngOnInit(): void {

    this.formSolicitud = this.formBuilder.group({
      fechaTentativa: ['', Validators.required],
      numeroEstudiantes: ['', Validators.required]
    });
  }

  //
  columnasSolicitudes: any[];

  dataSolicitudes: any[];


  obtenerSolicitudes(): void {
    this._solicitudEmpresaCrud.getSolicitudesEmpresa(this._tokenCrud.getUserName()).then(value => {
      this.dataSolicitudes = value['data'];
      this.mostarMensajeCorrecto('Se genero exitosamente listado de solicitudes generadas');
      console.log(this.dataSolicitudes);
    }).catch((err) => {
      this.mostrarMensajeError('No se genero listado de solicitudes');
    })
  }

  obtenerResponsables() {
    if (this.formSolicitud.valid) {
      let nombreDocumento: any = 'anexo1.' + this.empleado.primer_nombre + this.empleado.primer_apellido + '.docx';
      let fechaActual = new Date().toLocaleDateString();
      let fechacortada: any[] = fechaActual.split('/');
      let actividadesDoc: any[] = [];
      this.dataActividadesConvenio.forEach(value => {
        let des: any = {
          descripcion: value.descripcion
        }
        actividadesDoc.push(des);
      });
      console.log(actividadesDoc)
      let dataGeneral: any = {
        dia: fechacortada[0],
        mes: this.devolvermes(fechacortada[1]),
        año: fechacortada[2],
        titulo: this.dataActividadesConvenio[0].abrev_titulo,
        nombresrp: this.dataActividadesConvenio[0].nombresrp + ' ',
        apellidosrp: this.dataActividadesConvenio[0].apellidosrp,
        carrera: this.dataActividadesConvenio[0].carrera,
        empresa: this.dataEmpresa[0].nombreEmpresa,
        numestudiantes: this.formSolicitud.value.numeroEstudiantes,
        actividades: actividadesDoc,
        fechainicio: this.formSolicitud.value.fechaTentativa,
        nombreempleado: this.empleado.primer_nombre + ' ' + this.empleado.primer_apellido,
        cargo: this.empleado.cargo
      }
      this.generate(dataGeneral, 'https://backendg1c2.herokuapp.com/files/anexo1.docx', nombreDocumento);

    } else {
      this.mostrarMensajeError('NO PUEDE GENERAR EL DOCUMENTO POR QUE NO HA LLENADO LOS CAMPOS REQUERIDOS')
    }
  }


  enviarSolicitud() {
    if (this.solicitud != null) {

      let fechaActual = new Date().toLocaleDateString();
      let fechacortada: any[] = fechaActual.split('/');
      let pipefecha =  new DatePipe('en-US');
      let fecha=null;
      fecha=pipefecha.transform(Date.now(),'yyyy-MM-dd');
      console.log(fecha);
      let solicitud: any = {
        estado: false,
        fechaEmision: fecha,
        fechaInicio: this.formSolicitud.value.fechaTentativa,
        numeroAlumnos: this.formSolicitud.value.numeroEstudiantes,
        pdfSolicitud: this.base64Output,
        respuesta: null,
      }

      console.log('CEDULA DE EMPLEADO LOGEADO: ' + this._tokenCrud.getUserName());
      console.log('CEDULA DE RESPONSABLE  : ' + this.dataActividadesConvenio[0].cedula);
      console.log('OBJETO PARA GUARAR :' ,solicitud);
      let cedulaResponsables : any = this.dataActividadesConvenio[0].cedula;
      this._solicitudEmpresaCrud.createSolicitud(this._tokenCrud.getUserName(),cedulaResponsables, solicitud).then(value => {
        this.mostarMensajeCorrecto('SOLICITUD ENVIADA CORRECTAMENTE');
        this.formSolicitud.reset();
        this.dialogoResponsable = false;
        this.obtenerSolicitudes();
        console.log(value['data']);
      }).catch((err)=>{
        console.log(err)
        this.mostrarMensajeError('ERROR AL ENVIAR DOCUMENTO' +err.toString())
      })

    } else {
      this.mostrarMensajeError('NO PUEDE ENVIAR SOLICITUD POR QUE NO HA ADJUNTADO EL DOCUMENTO')
    }
  }

  anadirResponsable() {
    if (this.ObjetoResponsable != null) {
      console.log(this.ObjetoResponsable);

    } else {
      this.mostrarMensajeError('No puede continuar por que no seleccino ninguna fila');
    }
  }


  obtenerActividadesConvenio(): void {
    this._crudEmpleado.getEmpresaLogeado(this._tokenCrud.getUserName()).then(value => {
      this.dataEmpresa = value['data'];
      this._crudActividades.getActividadesEmpresaConvenio(this.dataEmpresa[0].idEmpresa).then(value1 => {
        this.dataActividadesConvenio = value1['data'];
        console.log(this.dataActividadesConvenio)
      })
    })
  }

  checkForMIMEType2() {
    var response = this.ObjetoResponsable['respuesta'];
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


  obtenerEmpleado() {
    this._crudEmpleado.getEmpleadosFiltrar().then(value => {
      this.dataEmpleados = value['data'];
      console.log(this.dataEmpleados)
      this.dataEmpleados.forEach(value1 => {
        if (value1.cedula == this._tokenCrud.getUserName()) {
          this.empleado = value1;
        }
      })
    })

  }


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

  desplegarResponsables() {
    this.dialogoResponsable = true;
  }


  eliminarSolicitud(): void{
    if(this.ObjetoResponsable!=null){
      this._solicitudEmpresaCrud.deleteSolicitud(this.ObjetoResponsable['id_solicitud_empresa']).then( value => {
        this.obtenerSolicitudes();
        this.mostarMensajeCorrecto(value['mensaje'])
      }).catch((err)=>{
        this.mostrarMensajeError('La solicitud no se puede borrar por que se encuentra en mas procesos')
      })
    }else{
      this.mostrarMensajeError('No puede elimar por que no ha clickeado sobre la fila')
    }
  }

  onRowSelectResponsable(event): void {
    this.ObjetoResponsable = null;
    if (event.data) {
      this.dataRowResponsable = event.data;
      this.ObjetoResponsable = {...this.dataRowResponsable};
    }
  }

  cargarLogeado() {
    this._crudPersona.getForPersona(this._tokenCrud.getUserName()).then(value => {
      this.datosLogeado = value['data'];

    })
  }

  onRowUnSelectResponsable(event): void {
    if (event.data) {
      this.dataRowResponsable = null;
      this.ObjetoResponsable = null;
    }
  }

  'https://backendg1c2.herokuapp.com/files/anexo1.docx'

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
    var response = this.ObjetoResponsable['pdf_solicitud'];
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

  onFileSelected(event) {
    this.convertFile(event.files['0']).subscribe(base64 => {
      this.base64Output = base64;
      this.solicitud = {
        pdfSolicitud: this.base64Output
      };
      this.mostarMensajeCorrecto('El archivo fue cargado con exito')
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
}
