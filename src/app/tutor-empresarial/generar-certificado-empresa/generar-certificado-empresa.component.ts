import { Component, OnInit } from '@angular/core';
import PizZipUtils from "pizzip/utils";
import {AlumnosService} from "../../services/alumnos.service";
import {FormBuilder} from "@angular/forms";
import {MessageService} from "primeng/api";

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
  selector: 'app-generar-certificado-empresa',
  templateUrl: './generar-certificado-empresa.component.html',
  styleUrls: ['./generar-certificado-empresa.component.css']
})
export class GenerarCertificadoEmpresaComponent implements OnInit {

  //ARCHIVOS BASE
  base64Output: string;

  //DATA PARA RECIBIR DATOS
  dataAlumnos: any[];
  dataRowAlumno: any;
  ObjetoAlumno: any;

  //COLUMNAS DE TABLAS
  columnasEstudiantes: any[];

  constructor(
    private alumnoService: AlumnosService,
    private formBuilder: FormBuilder,
    private _messageService: MessageService
  ) { }


  ngOnInit(): void {
    this.columnasEstudiantes = [
      {field: 'cedula', header: 'Cedula'},
      {field: 'nombres', header: 'Primer nombre'},
      {field: 'apellidos', header: 'Segundo Nombre'},
      {field: 'ciclo', header: 'Primer apellido'},
      {field: 'paralelo', header: 'Segundo Apellido'},
      {field: 'promedio', header: 'Correo'},
      {field: 'carrera', header: 'Carrera'},
    ];
  }

  // METODOS PARA CARGA DE MENSAJES

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

}
