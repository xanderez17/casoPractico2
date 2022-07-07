import {Component, OnInit} from '@angular/core';
import {Solicitud_empresaService} from "../../services/solicitud_empresa.service";
import {TokenService} from "../../services/token.service";
import {ConvocatoriaService} from "../../services/convocatoria.service";
import {MessageService} from "primeng/api";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AsignaturaService} from "../../services/asignatura.service";
import {ActividadesConvenioService} from "../../services/actividades-convenio.service";
import {Observable, ReplaySubject} from "rxjs";
import {ResponsableService} from "../../services/responsable.service";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import {saveAs} from "file-saver";
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
  selector: 'app-gestion-convocatoria',
  templateUrl: './gestion-convocatoria.component.html',
  styleUrls: ['./gestion-convocatoria.component.css']
})
export class GestionConvocatoriaComponent implements OnInit {

  //ARCHIVOS BASE
  base64Output: string;

  //DATA PARA RECIBIR DATOS
  dataSolicitudes: any[];
  dataConvocatorias: any[];
  dataAsignaturas: any[];
  dataRowSolicitud: any;
  dataRowAsignatura: any;
  dataRonwConvocatoria: any;
  ObjetoSolicitud: any;
  ObjetoAsignatura: any;
  ObjetoConvocatoria: any;
  asiganturas: any[] = [];
  dataActividades: any[];
  dataResponsable: any[];
  soliEmp: any;
  actividades: any[] = [];
  asign: any[] = [];
  numConv: any;


  //COLUMNAS DE TABLAS
  columnaSolicitud: any[];
  columasAsignaturas: any[];
  columnasConvocatorias: any[];
  asignColum: any[];
  columnasActividades: any[];


  dialogoDatos: boolean;
  dialogoConvocatorias: boolean;

  formConvocataria: FormGroup;

  constructor(private _crudSolicitudes: Solicitud_empresaService,
              private _tokenService: TokenService,
              private _convocatoriaService: ConvocatoriaService,
              private _messageService: MessageService,
              private formBuilder: FormBuilder,
              private _crudAsignaturas: AsignaturaService,
              private _crudActividades: ActividadesConvenioService,
              private _crudResponsable: ResponsableService
  ) {

    this.columnaSolicitud = [
      {field: 'pdf_solicitud', header: 'Documento'},
      {field: 'id_solicitud_empresa', header: 'ID'},
      {field: 'nombre_empresa', header: 'Empresa'},
      {field: 'fecha_emision', header: 'F.Emisión'},
      {field: 'fecha_inicio', header: 'F.Inicio'},
      {field: 'nombre_emp', header: 'Nombre Emp'},
      {field: 'apellido_emp', header: 'Apellido Emp'},
      {field: 'generar_conv', header: 'Generar'}
    ];

    this.columasAsignaturas = [
      {field: 'nombreAsignatura', header: 'Nombre Asignatura'},
      {field: 'anadirA', header: 'Anadir asignatura'},
      {field: 'quitarA', header: 'Remover asignatura'},
    ];

    this.columnasActividades = [
      {field: 'area', header: 'Area de activiadad'},
      {field: 'descripcion', header: 'Descripcion '},
    ];

    this.asignColum = [
      {field: 'nombreAsignatura', header: 'Nombre Asignatura'},
    ]

    this.columnasConvocatorias=[
      {field: 'doc_convocatoria', header: 'Documento'},
      {field: 'id_convocatoria', header: 'ID'},
      {field: 'estado', header: 'Estado convocatoria'},
      {field: 'fecha_emision', header: 'F.Emisión'},
      {field: 'fecha_maxima', header: 'F.Maxima'},
      {field: 'nombre_convocatoria', header: 'Nombre Convocatoria'},
      {field: 'nombre_empresa', header: 'Empresa'},
      {field: 'eliminarC', header: 'Eliminar convocatoria'}
    ]


  }

  ngOnInit(): void {

    this.formConvocataria = this.formBuilder.group({
      fechaMaxima: ['', Validators.required],
      ciclos: ['', Validators.required]
    });

    this.obtenerSolicitudes();

  }

  obtenerAsignaturas(): void {
    this._crudAsignaturas.getAsignaturas().then(value => {
      this.dataAsignaturas = value['data'];
    }).catch((errr) => {
      this.mostrarMensajeError('ERRO AL LISTAR ASIGNATURAS');
    })
  }

  quitarAsignatura() {
    if (this.ObjetoAsignatura != null) {
      this.asiganturas.splice(this.asiganturas.indexOf(value => value.idAsignatura == this.ObjetoAsignatura.idAsignatura), 1);
      console.log(this.asiganturas);
    } else {
      this.mostrarMensajeError('NO HA SELECCIONADO LA FILA DE LA ASIGNATURA')
    }
  }

  anadirAsignatura() {
    if (this.ObjetoAsignatura != null) {
      this.asiganturas.push(this.ObjetoAsignatura);
      console.log(this.asiganturas);
    } else {
      this.mostrarMensajeError('NO HA SELECCIONADO LA FILA DE LA ASIGNATURA')
    }
  }

  obtenerActivadades() {
    this._crudActividades.getActividadesEmpresaConvenio(this.ObjetoSolicitud.id_empresa).then(value1 => {
      this.dataActividades = value1['data'];
      console.log(this.dataActividades)
    })
  }

  obtenerCovocatorias():void {
    this.dialogoConvocatorias=true;
    this._convocatoriaService.getConvocatoriasVista().then(value => {
      this.dataConvocatorias=value['data'];
      console.log(this.dataConvocatorias)
    }).catch((err)=>{
      this.mostrarMensajeError('NO GE LOGRO GENERAL EL LISTADO DE CONVOCATORIAS')
    })
  }

  obtenerSolicitudes(): void {
    this._crudSolicitudes.getSolicitudesResponsable().then(value => {
      this.dataSolicitudes = value['data'];
      console.log(this.dataSolicitudes)
      this.mostarMensajeCorrecto('Listado de solicitudes generado exitosamente')
    }).catch((err) => {
      this.mostrarMensajeError('ERROR AL GENERAR LISTADO DE SOLICITUDES')
    })
  }

  cargarDatos(): void {
    if (this.ObjetoSolicitud != null) {
      this.obtenerAsignaturas();
      this.obtenerActivadades();
      this.obtenerResponsable();
      this.dialogoDatos = true;
    } else {
      this.mostrarMensajeError('NO HA SELECCIONADO FILA,PARA PODER CARGAR LOS DATOS PREVIOS');
    }
  }

  onRowSelectSolicitud(event): void {
    this.ObjetoSolicitud = null;
    if (event.data) {
      this.dataRowSolicitud = event.data;
      this.ObjetoSolicitud = {...this.dataRowSolicitud};
      console.log(this.ObjetoSolicitud)
    }
  }

  onRowUnSelectSolicitud(event): void {
    if (event.data) {
      this.dataRowSolicitud = null;
    }
  }

  onRowSelectConvocatoria(event): void {
    this.ObjetoConvocatoria = null;
    if (event.data) {
      this.dataRonwConvocatoria = event.data;
      this.ObjetoConvocatoria = {...this.dataRonwConvocatoria};
      console.log(this.ObjetoConvocatoria)
    }
  }

  onRowUnSelectConvocatoria(event): void {
    if (event.data) {
      this.dataRonwConvocatoria = null;
      this.ObjetoConvocatoria=null;
    }
  }

  onRowSelectAsignatura(event): void {
    this.ObjetoAsignatura = null;
    if (event.data) {
      this.dataRowAsignatura = event.data;
      this.ObjetoAsignatura = {...this.dataRowAsignatura};
    }
  }


  onRowUnSelectAsignatura(event): void {
    if (event.data) {
      this.dataRowAsignatura = null;
      this.ObjetoAsignatura = null;
    }
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

  checkForMIMEType() {
    if (this.ObjetoSolicitud != null) {
      var response = this.ObjetoSolicitud['pdf_solicitud'];
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
    } else {
      this.mostrarMensajeError('NO HA DADO CLICK SOBRE LA FILA DE LA CUAL QUIERE VER EL DOCUMENTO')
    }

  }


  checkForMIMEType2() {
    if (this.ObjetoConvocatoria != null) {
      var response = this.ObjetoConvocatoria['doc_convocatoria'];
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
    } else {
      this.mostrarMensajeError('NO HA DADO CLICK SOBRE LA FILA DE LA CUAL QUIERE VER EL DOCUMENTO')
    }

  }

  obtenerResponsable(): void {
    this._crudResponsable.getResponsableUnico(this._tokenService.getUserName()).then(value => {
      this.dataResponsable = value['data'];
    }).catch((err) => {
      this.mostrarMensajeError('No se obtuvo el responsable');
    })
  }


  borrarConvocatoria():void {
    if(this.ObjetoConvocatoria !=null){
      this._convocatoriaService.deleteConvocatoria(this.ObjetoConvocatoria.id_convocatoria).then(value => {
        this.dialogoConvocatorias=false;
        this.obtenerCovocatorias();
        this.mostarMensajeCorrecto('La convocatoria fue emitida correctamente')
      }).catch((err)=>{
        this.mostrarMensajeError('No se puede borrar esta convocatoria, por que se encuentra en otros procesos')
      })
    }else{
      this.mostrarMensajeError('No puede eliminar convocatoria por que no ha dado clic sobre la fila')
    }
  }

  getDescAct() {
    this._crudActividades.getActividadesEmpresaConvenio(this.ObjetoSolicitud.id_empresa).then(value => {
      this.dataActividades = value['data'];
      this.dataActividades.forEach(value1 => {
        let desc: any = {
          descripcion: value1.descripcion
        }
        console.log(desc)
        this.actividades.push(desc);
      })
    });
  }

  getNomAsig() {
    this.asiganturas.forEach(valueAsig => {
      let asig: any = {
        nombre: valueAsig.nombreAsignatura
      }
      console.log(asig)
      this.asign.push(asig)
    })
  }

  lanzarConvocatoria(): void {

    if (this.ObjetoSolicitud != null) {
      this.getDescAct();
      this.getNomAsig();
      this.obtenerResponsable();
      let numC;
      this._convocatoriaService.getNumConv().subscribe((resp: any) => {
        this.numConv = resp['data'];
        numC = this.numConv.find(x => {
          return x;
        })
        console.log(this.numConv)
        console.log(numC)


        console.log(numC + 'VER SI ENTRA')

        let fechaActual = new Date().toLocaleDateString();
        let fechacortada: any[] = fechaActual.split('/');
        //DATA DOCUMENTO
        let dataGeneral: any = {
          abrevCarrera: this.ObjetoSolicitud.abreviatura,
          anio: fechacortada[2],
          num_conv: numC,
          dia: fechacortada[0],
          mes: this.devolvermes(fechacortada[1]),
          ciclo: this.formConvocataria.value.ciclos,
          actividades: this.actividades,
          asignaturas: this.asign,
          fechaMaxima: this.formConvocataria.value.fechaMaxima,
          nombresrp: this.dataResponsable[0].nombres_r,
          apellidosrp: this.dataResponsable[0].apellidos_r,
          carrera: this.ObjetoSolicitud.carrera,
          empresa: this.ObjetoSolicitud.nombre_empresa
        };
        let nombreDocumento: string = 'anexo2.' + this.dataResponsable[0].nombres_r + this.dataResponsable[0].apellidos_r + '.docx';
        this.generate(dataGeneral, 'https://backendg1c2.herokuapp.com/files/anexo2.docx', nombreDocumento);
      });
    } else {
      this.mostrarMensajeError('No se pudo lanzar la convocatoria')
    }
  }


  crearAnexo2(): void {
    if (this.base64Output != null) {
      let fechaActual = new Date().toLocaleDateString();
      let fechacortada: any[] = fechaActual.split('/');
      let pipefecha =  new DatePipe('en-US');
      let fecha = null;
      fecha=pipefecha.transform(Date.now(),'yyyy-MM-dd');
      let pdfConv: any = {
        docConvocatoria: this.base64Output,
        fechaEmision: fecha,
        fechaMaxima: this.formConvocataria.value.fechaMaxima,
        nombreConvocatoria: 'CONVOCATORIA - ' + this.ObjetoSolicitud.abreviatura + fechacortada[2]
      }
      this._convocatoriaService.createConvocatoria(this.ObjetoSolicitud.id_solicitud_empresa, pdfConv).then(value => {
        this.formConvocataria.reset();
        this.dialogoDatos = false;
        this.mostarMensajeCorrecto('Su convocatoria ha sido lanzada');
        this.obtenerSolicitudes();
      }).catch((err)=>{
        this.mostrarMensajeError('No se ha guardado la convocatoria')
      });

    } else {
      this.mostrarMensajeError('No se pudo generar el documento');
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
      this.soliEmp = {
        docSoliEmp: this.base64Output
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
