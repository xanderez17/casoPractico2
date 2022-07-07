import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Empresa } from '../services/empresa';
import { EmpresaService } from '../services/empresa.service';
import swal from 'sweetalert2';
import { MessageService } from 'primeng/api';
import { ActividadesService } from '../services/actividades.service';
import { EmpleadoService } from '../services/empleado.service'
import { Actividades } from '../models/actividades';
import { TokenService } from '../services/token.service';
import { ConvenioService } from '../services/convenio.service';
import { Convenio } from '../models/Convenio';
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import { DatePipe } from '@angular/common';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {PersonaService} from "../services/persona.service";

function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}

@Component({
  selector: 'app-gestion-empresa',
  templateUrl: './gestion-empresa.component.html',
  styleUrls: ['./gestion-empresa.component.css'],
  providers: [MessageService]
})
export class GestionEmpresaComponent implements OnInit {

  //ACCESO
  roles: string[];
  isResponsable = false;
  isLogged = false;
  realRol: String;
  public personas: Array<any> = [];

  empresa: Empresa = new Empresa();
  formEmpresa: FormGroup;
  formActividades: FormGroup;
  formConvenio: FormGroup;
  cols: any[];
  colsAct: any[];


  dis: boolean;
  createConvenio: boolean;
  createActividades: boolean;
  refresh = true;

  empresas : Empresa[];
  actividad: Actividades = new Actividades();
  actividades: Actividades[] = new Array <Actividades>();
  gerente: any;
  convenio: Convenio = new Convenio();
  convenios: Convenio [];
  base64Output: string;



  showDialog() {
    this.empresa.direccion = null;
    this.empresa.idEmpresa = null;
    this.empresa.mision = null;
    this.empresa.vision = null;
    this.empresa.ruc = null;
    this.empresa.telefono = null;
    this.empresa.direccion = null;
    this.empresa.nombreEmpresa = null;
    this.dis = true;
  }
  showDialogEdit(emp:Empresa):void {
    this.dis= true;
    this.empresa = {
      idEmpresa: emp.idEmpresa,
      nombreEmpresa: emp.nombreEmpresa,
      direccion: emp.direccion,
      telefono : emp.telefono,
      mision:emp.mision,
      vision:emp.vision,
      ruc: emp.ruc,
      naturaleza: emp.naturaleza
    };
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private empresaservice: EmpresaService,
    public messageService: MessageService,
    private actividadesService: ActividadesService,
    private empleadoService: EmpleadoService,
    private tokenService: TokenService,
    private convenioService: ConvenioService,
    private _messageService: MessageService,
    private personaService: PersonaService
  ) { }

  ngOnInit(): void {

    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(rol => {
      if (rol === 'ROLE_RESPONSABLEPPP') {
        this.realRol = 'responsableppp';
        this.isResponsable = true;
      }

    })

    this.createConvenio=false;

    this.formEmpresa = this.formBuilder.group({
      ruc: ['', Validators.required],
      empresa: ['', Validators.required],
      mision: ['', Validators.required],
      vision: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],


    });

    this.formConvenio = this.formBuilder.group({
      duracion: ['', Validators.required],
      fechaEmision: ['', Validators.required],
    })

    this.formActividades = this.formBuilder.group({
      descripcion: ['', Validators.required]

    });

    this.colsAct = [
      { field: 'idActividad', header: 'Id' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'accion', header: 'Acciones' },
    ]

    this.cols = [
      { field: 'ruc', header: 'Ruc' },
      { field: 'nombreEmpresa', header: 'Empresa' },
      { field: 'vision', header: 'Vision' },
      { field: 'mision', header: 'Mision' },
      { field: 'telefono', header: 'Telefono' },
      { field: 'direccion', header: 'Dirección' },
      { field: 'naturaleza', header: 'Naturaleza' },
      { field: 'size', header: 'Acciones' },
      { field: 'convenio', header: 'Convenio' },
      { field: 'documento', header: 'Documento' },

    ];
    this.listarEmpresas();
    this.listarConvenios();
  }




  editarEmpresa():void {
    if (this.formEmpresa.invalid) {
      console.log("invalido")
      return;
    }

    this.empresaservice.updateEmpresa(this.empresa).subscribe(empresa => {
      swal.fire('Empresa','Empresa editada con exito.','success')
      this.listarEmpresas();
    })
    this.dis = false;
  }

  listarEmpresas():void {
    this.empresaservice.getEmpresas().then(value => {
      this.empresas=value['data'];
      console.log(this.empresas)
    })
  }

  listarConvenios(){
    this.convenioService.getConvenios().subscribe(res=>{
        this.convenios = res['data'];
    })
  }

  hasConvenio(idEmpresa){
    var present: boolean = false
    this.convenios.forEach( value => {
      if(value.gerente.empresa.idEmpresa == idEmpresa){
        present = true;
        this.convenio = value;
      }
    })

    if(present){
      console.log("TIENE CONVENIO");

    }
    if(!present){
      console.log("NO TIENE CONVENIO");
      this.crearConvenio(idEmpresa);
    }
  }

  eliminarEmpresa(emp: Empresa): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Esta seguro que desea eliminar?',
      text: `¡No podrás revertir esto! eliminar a ${emp.nombreEmpresa}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar! ',
      cancelButtonText: ' No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.empresaservice.deleteEmpresa(emp.idEmpresa).subscribe(
          response => {
            this.empresas = this.empresas.filter(servi => servi !== emp)
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `La empresa  fue eliminada.`,
              'success'
            )
          }
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'La empresa no se elimino.',
          'error'
        )
      }
    })
  }

  getGerente (idEmpresa){

    this.empleadoService.getGerente(idEmpresa).then(value => {
      this.gerente=value['data'];
      if(this.gerente[0]){
        this.createConvenio = true
          console.log(this.gerente[0].persona.primerNombre);


      } else {
        console.log("NO TIENE GERENTE")


      }
    })


  }


  eliminarActividad(id){
    this.actividadesService.deleteActividad(id).then(res=>{
      console.log("Actividad eliminada");
      this.getActividades()
    })
  }

  getActividades(){
    this.actividadesService.getActividadesConvenio(this.convenio[0].idConvenio).subscribe(res => {
      this.actividades = res['data']
      console.log(this.actividades)
    })
  }

  agregarActividad(){
    if(this.formActividades.invalid){
      console.log("ACTIVIDAD ERROR")
    }else {
      this.actividad.convenio=this.convenio[0]
      this.actividadesService.createActividades(this.actividad).subscribe(res => {
        console.log(this.actividad)
        this.getActividades()
      })


    }

  }

  crearConvenio(id){

    this.getGerente(id);
  }

  guardarConvenio(){
    console.log(this.convenio.fechaEmision)
    this.convenioService.createConvenio2
          (this.convenio,this.gerente[0].persona.cedula,this.tokenService.getUserName()).then(res => {
            this.convenio = res['data']
            console.log(this.convenio);

          });

    this.createConvenio = false;
    this.createActividades = true;
  }


  updateVisibility(): void {
    this.refresh = false;
    setTimeout(() => this.refresh = true, 0);
  }

  cancelarConvenio(){
    this.actividades.forEach(value =>{
      this.actividadesService.deleteActividad(value.idActividad).then(res=>{
        console.log("ACTIVIDAD ELIMINADA");

      })
    })
    this.convenioService.deleteConvenios(this.convenio[0].idConvenio).subscribe(res => {
      console.log("CONVENIO ELIMINADO");
    })
  }

  generarDoc(){
    let nombreDocumento = 'convenio.docx'
    let fechaActual = new Date().toLocaleDateString();
    let fechacortada: any[] = fechaActual.split('/');
    let actividadesDoc: any[] = [];
    this.actividades.forEach(value => {
      console.log(value.descripcion);
      let des: any = {
        descripcion: value.descripcion
      }
      actividadesDoc.push(des);
    });

    console.log(actividadesDoc)

    let dataGeneral: any =  {
      dia: fechacortada[0],
      mes: this.devolvermes(fechacortada[1]),
      año: fechacortada[2],
      nombreEmpresa: this.convenio[0].gerente.empresa.nombreEmpresa,
      mision: this.convenio[0].gerente.empresa.mision,
      vision: this.convenio[0].gerente.empresa.vision,
      gerente: this.convenio[0].gerente.abrev_titulo+' '+this.convenio[0].gerente.persona.primerNombre +' '+this.convenio[0].gerente.persona.primerApellido,
      duracion: this.convenio[0].duracion,
      actividades: actividadesDoc,
      encargado: this.convenio[0].responsablePPP.docente.abrevTitulo+' '+ this.convenio[0].responsablePPP.docente.persona.primerNombre+' '+this.convenio[0].responsablePPP.docente.persona.primerApellido
    }

    this.generate(dataGeneral, environment.URL_APP+'files/convenio.docx', nombreDocumento);




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

  //SUBIR A LA BASE
  onFileSelected(event) {
    this.convertFile(event.files['0']).subscribe(base64 => {
      this.base64Output = base64;
      this.convenio[0].documento = this.base64Output;
      console.log(this.convenio[0]);

      this.mostarMensajeCorrecto('El archivo fue cargado con exito')
    });
  }

  updateConvenio(){
    this.convenioService.updateConvenio(this.convenio[0],this.convenio[0].idConvenio).subscribe(res=>{
      console.log("CONVENIO EDITADO CORRECTAMENTE");
      this.createActividades = false;
    })


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

  obtenerDocumento(idEmpresa){
    var present: boolean = false
    this.convenios.forEach( value => {
      if(value.gerente.empresa.idEmpresa == idEmpresa){
        present = true;
        this.convenio = value;
        console.log(this.convenio);

      }
    })

    if(present){
      console.log("TIENE CONVENIO");
      this.checkForMIMEType(this.convenio.documento)
    }
    if(!present){
      console.log("NO TIENE CONVENIO");
    }
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
