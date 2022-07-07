import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, ReplaySubject } from 'rxjs';
import { ConvocatoriaService } from 'src/app/services/convocatoria.service';
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import { environment } from 'src/environments/environment';
import { SolicitudAlumnoService } from 'src/app/services/solicitud-alumno.service';
import { Solicitud_empresaService } from 'src/app/services/solicitud_empresa.service';
import Swal from 'sweetalert2';


function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}

@Component({
  selector: 'app-lista-convocatorias',
  templateUrl: './lista-convocatorias.component.html',
  styleUrls: ['./lista-convocatorias.component.css']
})
export class ListaConvocatoriasComponent implements OnInit {

  convocatorias: any[];

  documentacion: boolean;
  soliEstudiantes: boolean;
  subirArchivo: boolean;

  base64Output: string;

  solicitudEmpresa: any;

  estudiantes: any[] = new Array<any>();
  estudiantesAgregados: any[] = new Array<any>();

  docAnexo: any;

  solicitud: any;
  convocatoria: any;

  constructor(
    private convocatoriaService : ConvocatoriaService,
    private _messageService: MessageService,
    private soliAlumnoService: SolicitudAlumnoService,
    private soliEmpresaService: Solicitud_empresaService
  ) { }

  ngOnInit(): void {
    this.soliEstudiantes = false;
    this.documentacion = false;
    this.getConvocatorias();
  }

  getConvocatorias(){
    this.convocatoriaService.getConvocatoria().subscribe(res=>{
      this.convocatorias=res['data'];
      console.log(this.convocatorias)
      console.log("Convocatorias obtenidas");
      
    })
  }

  getRespuesta(conv){
    if(conv.solicitudEmpresa.respuesta == null){
      console.log("Todavía no se ha generado un documento de respuesta");
      Swal.fire({
        icon: 'info',
        title: 'Todavía no se ha generado un documento de respuesta'
      })
      
    } else {
      this.checkForMIMEType(conv.solicitudEmpresa.respuesta)
    }
  }

  generarRespuesta(conv){
    this.soliAlumnoService.getSolicitudAlumno().subscribe(res=>{
      var solicitudesGeneral: any[]
      solicitudesGeneral = res['data']

      solicitudesGeneral.forEach(value=>{
        if(value.convocatoria.idConvocatoria == conv.idConvocatoria){
          this.estudiantes.push(value)
        }
      })

      if(conv.solicitudEmpresa.respuesta == null){
        if(conv.estado == "CERRADA"){ 
          if(this.estudiantes.length<1){
            console.log("CONVOCATORIA DESIERTA")
            this.generarDocDesierta(conv)
            this.documentacion = true;
            this.solicitud = conv.solicitudEmpresa;
          } else {
            this.convocatoria = conv;
            this.solicitud = conv.solicitudEmpresa;
            this.soliEstudiantes = true;
          }
        } else {
          Swal.fire({
            icon: 'info',
            title: 'La convocatoria aún se encuentra abierta'
          })
          this.estudiantes = new Array<any>();
        }
      }
      if(conv.solicitudEmpresa.respuesta != null){
        console.log("YA TIENE UNA RESPUESTA REGISTRADA");
        Swal.fire({
          icon: 'info',
          title: 'Ya existe una respuesta registrada'
        })
      }

      
      console.log(this.estudiantes)
      //this.estudiantes = new Array <any>();
    })
  }

  updateSolicitud(){
    if(this.docAnexo != null){
      this.solicitud.respuesta = this.docAnexo
      this.soliEmpresaService.updateSolicitud(this.solicitud,this.solicitud.idSolicitudEmpresa).then(res=>{
        console.log("SOLICITUD EDITADA");
        
      })
    }
    this.documentacion = false;
    this.docAnexo = null;
    this.solicitud = null;
    this.convocatoria = null;
    this.salirListaEstudiantes();
    window.location.reload();
  }

  salirListaEstudiantes(){
    this.estudiantes = new Array <any>();
    this.estudiantesAgregados = new Array <any>();
    this.soliEstudiantes = false;
    this.convocatoria = null;
  }

  agregarSolicitud(soli){
    if(this.estudiantesAgregados.length<=this.convocatoria.solicitudEmpresa.numeroAlumnos-1){
      this.estudiantesAgregados.push(soli);
    this.estudiantes=this.estudiantes.filter((item)=>item!==soli);
    console.log(this.estudiantes);
    } else {
      console.log("YA SELECCIONO LOS ESTUDIANTES MáXIMOS");
      
    }
    
  }
  eliminarAgregado(soli){
    this.estudiantes.push(soli);
    this.estudiantesAgregados = this.estudiantesAgregados.filter((item)=>item!==soli);
  }

  guardarPrueba(){
    if(this.estudiantesAgregados.length!=this.convocatoria.solicitudEmpresa.numeroAlumnos){
      console.log("Necesita seleccionar los estudiantes requeridos");
      
    }
  }

  guardarSeleccion(){
    console.log(this.estudiantesAgregados);
    
    this.estudiantesAgregados.forEach(value=>{
      value.estado = "ACEPTADO"
      this.soliAlumnoService.updateSolicitudA(value,value.idSolicitudAlumno).then(res=>{
        console.log("Solicitud Aceptada");

        
      })
    })
    this.generarDocAnexo(this.convocatoria);
    this.soliEstudiantes= false;
    this.documentacion = true
  }





  //GENERACION DE DOCUMENTOS

  onFileSelected(event) {
    this.convertFile(event.files['0']).subscribe(base64 => {
      this.base64Output = base64;
      this.docAnexo= this.base64Output;
      
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

  mostarMensajeCorrecto(mensaje: String): void {
    this._messageService.add({
      severity: 'success',
      summary: 'Hecho',
      detail: 'Correcto: ' + mensaje,
      life: 3000,
    });
  }

  mostarMensajeInorrecto(mensaje: String): void {
    this._messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: ''+mensaje,
      life: 3000,
    });
  }


  generarDocDesierta(conv){
    let nombreDocumento = 'anexo3-1.docx'
    let fechaActual = new Date().toLocaleDateString();
    let fechacortada: any[] = fechaActual.split('/');
    let estudiantesDoc: any[] = [];
    console.log(conv.solicitudEmpresa.fechaEmision)
    let fechaEmision : Date = new Date(conv.solicitudEmpresa.fechaEmision);
    let fechaEmisionVale = fechaEmision.toLocaleDateString();
    this.estudiantes.forEach(value => {
      console.log(value);
      let des: any = {      
        cedula: value.cedula,
        nombreEstudiante: value.persona.primerNombre+' '+value.persona.primerApellido
      }
      estudiantesDoc.push(des);
    });
    
    console.log(estudiantesDoc)

    let dataGeneral: any =  {
      dia: fechacortada[0],
      mes: this.devolvermes(fechacortada[1]),
      ano: fechacortada[2],
      titulo: conv.solicitudEmpresa.empleado.abrev_titulo,
      nombreEmpleado: conv.solicitudEmpresa.empleado.persona.primerNombre + ' ' + conv.solicitudEmpresa.empleado.persona.primerApellido,
      cargo: conv.solicitudEmpresa.empleado.cargo,
      nombreEmpresa: conv.solicitudEmpresa.empleado.empresa.nombreEmpresa,
      fechaSolicitud: fechaEmisionVale,
      carrera: conv.solicitudEmpresa.carrera.nombre
      
    }

    this.generate(dataGeneral, environment.URL_APP+'files/anexo3-1.docx', nombreDocumento);
  }

  generarDocAnexo(conv){
    let nombreDocumento = 'anexo4.docx'
    let fechaActual = new Date().toLocaleDateString();
    let fechacortada: any[] = fechaActual.split('/');
    let estudiantesDoc: any[] = [];
    console.log(conv.solicitudEmpresa.fechaEmision)
    let fechaEmision : Date = new Date(conv.solicitudEmpresa.fechaEmision);
    let fechaEmisionVale = fechaEmision.toLocaleDateString();
    this.estudiantesAgregados.forEach(value => {
      console.log(value);
      let des: any = {      
        cedula: value.alumno.persona.cedula,
        nombre: value.alumno.persona.primerNombre + ' ' + value.alumno.persona.primerApellido
      }
      estudiantesDoc.push(des);
    });
    
    console.log(estudiantesDoc)

    let dataGeneral: any =  {
      dia: fechacortada[0],
      mes: this.devolvermes(fechacortada[1]),
      año: fechacortada[2],
      titulo: conv.solicitudEmpresa.empleado.abrev_titulo,
      empleado: conv.solicitudEmpresa.empleado.persona.primerNombre + ' ' + conv.solicitudEmpresa.empleado.persona.primerApellido,
      cargo: conv.solicitudEmpresa.empleado.cargo,
      nombreEmpresa: conv.solicitudEmpresa.empleado.empresa.nombreEmpresa,
      fechaSolicitud: fechaEmisionVale,
      carrera: conv.solicitudEmpresa.carrera.nombre,
      alumno: estudiantesDoc
      
    }

    this.generate(dataGeneral, environment.URL_APP+'files/anexo4.docx', nombreDocumento);
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

  checkForMIMEType(baseitem) {
    var response = baseitem;
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

}
