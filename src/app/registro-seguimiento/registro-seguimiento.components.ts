import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroSeguimientoService } from '../services/registro-seguimiento.service'
import { AlumnosService } from '../services/alumnos.service';
import { TutorE } from '../models/TutorE';
import { left } from '@popperjs/core';
import { TutorA } from '../models/TutorA';
import { TutorAService } from '../services/tutorA.service';
import { ActividadesCronograma } from '../models/ActividadesCronograma';
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import { empty, Observable, ReplaySubject } from 'rxjs';
import { Empresa } from '../services/empresa';
import { TokenService } from '../services/token.service';
import { SolicitudAlumnoService } from '../services/solicitud-alumno.service';
import { RegistroAsistenciaService } from '../services/registro-asistencia.service';
import Swal from 'sweetalert2';
import { ActividadesDiariasService } from '../services/actividades-diarias.service';
import { CronogramaService } from '../services/cronograma.service';
import { ActividadesCronogramaService } from '../services/actividades-cronograma.service';
import { Cronograma } from '../models/Cronograma';
import { environment } from 'src/environments/environment';


function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}
@Component({
  selector: 'app-info-reg-seguimiento',
  templateUrl: './registro-seguimiento.components.html',
  styleUrls: ['./registro-seguimiento.component.css']

})
export class RegistroSeguimientoAlumnoComponent implements OnInit {
  public ListaActividadesCronograma: any[] = new Array<any>();
  public Listatutoresac: Array<any> = [];

  estudiante: any;
  tutoracademico: any;
  tutora: TutorA = new TutorA();
  cronograma: any;
  base64Output : string;
  formCronograma: FormGroup;
  newCronograma: Cronograma;
  formActC:FormGroup;
  documentacion: boolean;
  editar: boolean;
  actCronoEdit: ActividadesCronograma = new ActividadesCronograma();
  soli: any;
  docAnexo: any;
  solicitudes: any[] = new Array<any>();
  registroAsistencia: any;
  actividadesDiarias: any[] = new Array<any>();
  actividadesCronograma: any[] = new Array<any>();


  public cedulaAlumno: any;
  formValidacion: FormGroup;
  constructor(
    private router: Router, private route: ActivatedRoute,
    private registroSeguimientoService: RegistroSeguimientoService,
    private alumnosService: AlumnosService,
    private formBuilder: FormBuilder,
    private tutorService: TutorAService,
    private tokenService: TokenService,
    private soliAlumnoService: SolicitudAlumnoService,
    private registroAsistenciaService: RegistroAsistenciaService,
    private cronogramaService: CronogramaService,
    private actCronoService: ActividadesCronogramaService
  ) { 
    this.formActC = this.formBuilder.group({
      fechaFinalizacion: ['', Validators.required],
      fechaSeguimiento: ['', Validators.required],
      observacion: ['', Validators.required],
      porcentaje: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.documentacion = false;
    this.editar = false;
    this.getTutorAcademico();

  }


  buscarAlumno(alumno){
    this.soliAlumnoService.getSolicitudAlumno().subscribe(res=>{
       var listaSolicitudes:any[]=res['data'];
       listaSolicitudes.forEach(value=>{
        if(value.alumno.idAlumno == alumno.idAlumno){
          console.log(value.alumno)
          this.solicitudes.push(value)
        }
       })
    })
  }

  getTutorAcademico(){
    console.log("BUSCANDO TUTOR")
    
    this.tutorService.getTutoresAcademicos().then(res=>{
       this.Listatutoresac=res['data'];
       console.log(this.Listatutoresac)
       this.Listatutoresac.forEach(value=>{
          if(value.docente.persona.cedula == this.tokenService.getUserName()){
            this.tutoracademico=value;
            console.log(this.tutoracademico)
            this.buscarAlumno(value.alumno);
          }
       })
       console.log(this.solicitudes)
    })
  }

  getRegistroAsistencia(soli){
    this.cronograma=null;
    this.soli=soli;
    this.estudiante = this.soli.alumno;
    this.ListaActividadesCronograma = new Array<any>();
    this.registroAsistenciaService.getRegistoAsistencialista().subscribe(res=>{
      var registroAsistenciaList: any[] = res['data'];
      registroAsistenciaList.forEach(value=>{
        if(value.alumno.idAlumno == this.estudiante.idAlumno){
          var temporal = value;
          this.registroAsistencia = value;
          this.generarCronograma(this.estudiante);
          if(temporal ==null){
            Swal.fire({
              icon: 'info',
              title: 'Este estudiante no tiene un registro de Asistencia'
            })
            this.registroAsistencia = null;
          }
        } 
      })
    })
  }

  generarCronograma(estudiante){
    this.tutorService.getTutoresAcademicos().then(res=>{
      this.Listatutoresac=res['data'];
      
      this.Listatutoresac.forEach(value=>{
         if(value.alumno.idAlumno == estudiante.idAlumno){
           this.tutoracademico=value;
           console.log(this.tutoracademico)
         }
      })
      var temporalCronograma: any;
    this.cronogramaService.getCronogramas().then(res=>{
      var cronogramasList: any [] = res['data'];
      cronogramasList.forEach(value=>{
        if(value.tutorAcademico.docente.idDocente == this.tutoracademico.docente.idDocente 
          && value.tutorAcademico.alumno.idAlumno == estudiante.idAlumno){
            temporalCronograma = value;
            this.cronograma = value;
            console.log(this.cronograma)
            this.getActividadesCronograma(this.cronograma.idCronograma)
          }
      })

      if(temporalCronograma == null){
        this.newCronograma = new Cronograma();
        this.newCronograma.tutorAcademico = this.tutoracademico;
        this.cronogramaService.createCronograma(this.newCronograma).then(res=>{
          this.cronograma = res['data']
          this.cronograma = this.cronograma[0];
          console.log("SE GENERO UN CRONOGRAMA CON ID")
          console.log(this.cronograma[0].idCronograma)
          this.getActividadesCronograma(this.cronograma[0].idCronograma)
        })
      }

      

    })
   })
    
  }

  getActividadesCronograma(idcronograma){
    this.actCronoService.getActividadesByCronograma(idcronograma).then(res=>{
      this.ListaActividadesCronograma = res['data']
      console.log(this.ListaActividadesCronograma)
    })
  }

  dialogEditarAct(act){
    this.actCronoEdit = act;
    this.editar = true;
  }

  editarActCron(act){
    this.actCronoService.updateActividadesCronograma(act.id,act).then(res=>{
      console.log("SE EDITO LA ACTIVIDAD C");
      this.editar = false;
    })
  }

  updateCronograma(){
    if(this.docAnexo != null){
      this.cronograma.docCronograma = this.docAnexo;
      this.cronogramaService.updateActividadesCronograma(this.cronograma.idCronograma,this.cronograma).then(res=>{
        Swal.fire({
          icon: 'success',
          title: 'Se subió el archivo'
        })
        this.documentacion = false;
      })
    }
     
  }

  downloadCronograma(){
    if(this.cronograma.docCronograma != null){
      this.checkForMIMEType(this.cronograma.docCronograma);
    }
  }

 // DOCUMENTACION
 generarDocAnexo(){
  let nombreDocumento = 'anexo10.docx'
  let actividadesDoc: any[] = [];
  this.ListaActividadesCronograma.forEach(value => {
    let fechaSeguimientovale : any = new Date(value.fechaSeguimiento).toLocaleDateString();
    let fechaFinalizacionvale : any = new Date(value.fechaFinalizacion).toLocaleDateString();
    console.log(value);
    let des: any = {      
      
      fechaSeguimiento: fechaSeguimientovale,
      descripcion: value.actividadesDiarias.descripcion,
      fechaFinalizacion: fechaFinalizacionvale,
      porcentaje: value.porcentaje,
      observaciones: value.observacion
    }
    actividadesDoc.push(des);
  });
  
  

  let dataGeneral: any =  {

    carrera: this.tutoracademico.docente.carrera.nombre,
    estudiante: this.estudiante.persona.primerNombre +' '+this.estudiante.persona.primerApellido,
    empresa: this.soli.convocatoria.solicitudEmpresa.empleado.empresa.nombreEmpresa,
    tutorac: this.tutoracademico.docente.titulo+' '+this.tutoracademico.docente.persona.primerNombre+' '+this.tutoracademico.docente.persona.primerApellido,
    actividades: actividadesDoc
    
  }

  this.generate(dataGeneral, environment.URL_APP+'files/anexo10.docx', nombreDocumento);
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

  //Subir un archivo a la base

  onFileSelected(event) {
    this.convertFile(event.files['0']).subscribe(base64 => {
      this.base64Output = base64;
      this.docAnexo= this.base64Output;
      
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