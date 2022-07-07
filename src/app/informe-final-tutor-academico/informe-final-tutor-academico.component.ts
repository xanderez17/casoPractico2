import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmptyError, Observable, ReplaySubject } from 'rxjs';
import Swal from 'sweetalert2';
import { Actividades } from '../models/actividades';
import { Alumno } from '../models/Alumno';
import { Docente } from '../models/Docente';
import { Empleado } from '../models/Empleado';
import { ActaReunionService } from '../services/actaReunion.service';
import { AlumnosService } from '../services/alumnos.service';
import { DocenteService } from '../services/docente.service';
import { Empresa } from '../services/empresa';
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import {saveAs} from "file-saver";
import Docxtemplater from "docxtemplater";
import { TableModule } from 'primeng/table';
import { TutorA } from '../models/TutorA';
import { TutorAService } from '../services/tutorA.service';
import { EmpresaService } from '../services/empresa.service';
import { InformeFinalAlumnoService } from '../services/informe-finalizacion-alumo.services';
import { InformeFinal } from '../models/InformeFinal';

@Component({
  selector: 'app-informe-final-tutor-academico',
  templateUrl: './informe-final-tutor-academico.component.html',
  styleUrls: ['./informe-final-tutor-academico.component.css']
})
export class InformeFinalTutorAcademicoComponent implements OnInit {

  docentes : Docente[];
  docentePPP: any;

  informeFinal: InformeFinal;

  empresas : Empresa[];
  empresaPPP: any;

  alumnos : Alumno[];
  alumnoPPP: any;

  d:String;
  formActa: FormGroup;

  hinicio:Date ;
  hfinal:Date ;

  tutorA: Docente[];
  tutor : TutorA;
  tutord: any;

  actividadselec: Actividades;

  objetoSolicitud: any;
  solicitud: any;
  base64Output: string;

  ObjetoResponsable: any;
  uploadedFiles: any[]=[];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private docenteservice: DocenteService,
    private alumnoservice: AlumnosService,
    private empresaservice: EmpresaService,
    private tutorAservicie: TutorAService,
    private informefinalservice:InformeFinalAlumnoService

  ){ }

  ngOnInit(): void {
    
    this.docentePPP = new Docente();
    this.alumnoPPP = new Alumno();
    this.tutor = new TutorA();
    this.tutord = new Docente();
    this.empresaPPP = new Empresa();
    this.informeFinal = new InformeFinal();
    this.formActa = this.formBuilder.group({
      fecha: ['', Validators.required],
      docente: ['', Validators.required],
      tutor: ['', Validators.required],
      alumno: ['', Validators.required],
      periodo: ['', Validators.required],
      horas: ['', Validators.required],
      notaA: ['', Validators.required],
      notaE: ['', Validators.required]

      
    });

    
    this.listaDocentes();
    this.listaEmpresas();
    this.listaTutoresAcademicos();
    this.listaAlumnos();
  }

  OnChangeReponsable(ev) {
    if (ev.value == null) {}else{
      this.d = ev.value.name;
      this.docentePPP = ev.value;
      this.tutor.docente = this.docentePPP;
    }

  }
  OnChangeEmpresa(ev) {
    if (ev.value == null) {}else{
      this.d = ev.value.name;
      this.empresaPPP = ev.value;
    }
  }

  OnChangeTutorA(ev) {
    if (ev.value == null) {}else{
      this.d = ev.value.name;
      this.tutord = ev.value;
    }
  }

  OnChangeAlumno(ev) {
    if (ev.value == null) {}else{
      this.d = ev.value.name;
      this.alumnoPPP = ev.value;
      this.informeFinal.alumno=ev.value;
    }
    this.alumnoservice.getAlumnoByCedula(this.alumnoPPP.cedula).subscribe((resp: any)=>{
      console.log(resp.data[0])
      this.informeFinal.alumno = resp.data[0];
      
    });
  }

  listaDocentes(){
    this.docenteservice.getDocentes().subscribe((resp: any)=>{
      console.log(resp.data)
      this.docentes = resp.data;
      this.docentePPP = this.docentes[0];
    }
    )
  }

  listaEmpresas(){
    this.empresaservice.getEmpresasNotificacion().subscribe((resp: any)=>{
      console.log(resp.data)
      this.empresas = resp.data
      this.empresaPPP= resp.data[0];
    }
    )
  }

  listaAlumnos(){
    this.alumnoservice.getAlumnos().then((resp: any)=>{
      console.log(resp.data)
      this.alumnos = resp.data
      this.alumnoPPP = this.alumnos[0];
    }
    )
  }

  listaTutoresAcademicos(){
    this.docenteservice.getDocentes().subscribe((resp: any)=>{
      console.log(resp.data)
      this.tutorA = resp.data;
      this.tutorA = resp.data[0];
    }
    )
  }

  public GenerarNotificacion():void{
    if (this.formActa.invalid) {
      Swal.fire(
        'Campos incompletos',
        'Revise que los campos anteriores no esten vacios',
        'error'
      )
      return;
    }
    var fecha=""+ this.formActa.get('fecha').value;
    var abrevR= this.tutord.abrev_titulo;
    var responsable= this.docentePPP.primer_nombre+" "+this.docentePPP.segundo_nombre+" "+this.docentePPP.primer_apellido+" "+this.docentePPP.segundo_apellido;
    var tutor= this.tutord.primer_nombre+" "+this.tutord.segundo_nombre+" "+this.tutord.primer_apellido+" "+this.tutord.segundo_apellido;
    var empresa=this.empresaPPP.nombreEmpresa;
    var alumno=this.alumnoPPP.primer_nombre+" "+this.alumnoPPP.segundo_nombre+" "+this.alumnoPPP.primer_apellido+" "+this.alumnoPPP.segundo_apellido;
    var carrera = this.docentePPP.carrera; 
    var ciclo=this.alumnoPPP.ciclo;
    var horas = this.formActa.get('horas').value;
    var periodo = this.formActa.get('periodo').value;
    var notaA = this.formActa.get('notaA').value;
    var notaE = (this.formActa.get('notaE').value);
    var naF =((this.formActa.get('notaA').value)*0.40).toString();
    var neF = ((this.formActa.get('notaE').value)*0.60).toString();
    var notaF = (((this.formActa.get('notaA').value)*0.40)+((this.formActa.get('notaE').value)*0.60));
    var estado;
    if ((((this.formActa.get('notaA').value)*0.40)+((this.formActa.get('notaE').value)*0.60))>70) {
      estado="APROBADA";
    }else{
      estado="NO APROBADAs";
    }
    

    this.generardocumento(fecha,abrevR,responsable,tutor,empresa,alumno,carrera,horas,periodo,notaA,notaE,naF,neF,notaF,ciclo,estado);
   
  }
  

  crearInformefinal(){
    
    this.informeFinal.docInformeFinal=this.formActa.get('fecha').value;
    if ((((this.formActa.get('notaA').value)*0.40)+((this.formActa.get('notaE').value)*0.60))>70) {
      this.informeFinal.estado="APROBADA";
    }else{
      this.informeFinal.estado="NO APROBADA";
    }
    
    console.log(this.informeFinal);
    this.informefinalservice.createInformeFinal(this.informeFinal).subscribe(
      Response => {
        Swal.fire('Informe final','Informe final cargado con exito','success');
        window.location.reload();
        console.log(Response);
      }
    )
  }
  

  generardocumento(
    fecha:String,
    abrevR :String,
    responsable:String, 
    tutor:String, 
    empresa:String, 
    alumno :String, 
    carrera:String, 
    horas:String, 
    periodo:String, 
    notaA:String, 
    notaE:String, 
    naF:String, 
    neF:String, 
    notaF:number, 
    ciclo:String,
    estado:String, ) {
    loadFile("https://backendg1c2.herokuapp.com/files/anexo15.docx", function(
      error,
      content
    ){
      if (error) {
        throw error;
      }
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true});
      doc.setData({
        fecha: fecha,
        abrevT: abrevR,
        responsable: responsable,
        tutor: tutor,
        empresa:empresa,
        alumno: alumno,
        carrera: carrera,
        horas: horas,
        periodo:periodo,
        notaA:notaA, 
        notaE:notaE,
        naF:naF, 
        neF:neF,
        notaF:notaF,
        ciclo: ciclo,
        estado:estado,
      });
      try {
        doc.render();
      } catch (error) {
        function replaceErrors(key, value) {
          if (value instanceof Error) {
            return Object.getOwnPropertyNames(value).reduce(function(
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
            .map(function(error) {
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
      saveAs(out, "anexo15" +fecha+alumno+".docx");
      
    });
    
  }

  // Subir archivos a la base de datos

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

      this.informeFinal.docInformeFinal=base64;
      this.crearInformefinal();
      
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

}
function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}