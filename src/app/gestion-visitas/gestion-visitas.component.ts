import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InformeVisita, Visita } from '../models/Visita';
import { InformeService } from '../services/Informe.service';
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import Docxtemplater from 'docxtemplater';
import { Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs';

function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}

@Component({
  selector: 'app-gestion-visitas',
  templateUrl: './gestion-visitas.component.html',
  styleUrls: ['./gestion-visitas.component.css'],
})
export class GestionVisitasComponent implements OnInit {
  informe: InformeVisita = new InformeVisita();
  formInforme: FormGroup;
  cols: any[];
  dis: boolean;
  informes: InformeVisita[];
  dataInformes: any[];
  base64Output: string;

  showDialog() {
    this.informe.idInformeVisita = null;
    this.informe.fecha = null;
    this.informe.horaInicio = null;
    this.informe.horaFin = null;
    this.informe.asunto = null;
    this.informe.actividades = null;
    this.informe.observaciones = null;
    this.dis = true;
  }

  showDialogEdit(informe: InformeVisita): void {
    this.dis = true;
    this.informe = {
      idInformeVisita: informe.idInformeVisita,
      fecha: informe.fecha,
      horaInicio: informe.horaInicio,
      horaFin: informe.horaFin,
      asunto: informe.asunto,
      actividades: informe.actividades,
      observaciones: informe.observaciones,
    };
  }

  constructor(
    private informeservice: InformeService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formInforme = this.formBuilder.group({
      fecha: ['', Validators.required],
      horainicio: ['', Validators.required],
      horafin: ['', Validators.required],
      asunto: ['', Validators.required],
      actividades: ['', Validators.required],
      observaciones: ['', Validators.required],
    });

    this.cols = [
      { field: 'fecha', header: 'Fecha' },
      { field: 'horainicio', header: 'Hora Inicio' },
      { field: 'horafin', header: 'Hora Fin' },
      { field: 'asunto', header: 'Asunto a tratar' },
      { field: 'actividades', header: 'Actividades' },
      { field: 'observaciones', header: 'Observaciones' },
      { field: 'size', header: 'Acciones' },
      { field: 'generar', header: 'Generar' },
    ];
    this.listarInfome();
  }
  listarInfome(): void {
    this.informeservice.getListaInforme().then((value) => {
      this.dataInformes = value['data'];
      console.log(this.dataInformes);
    });
  }

  editarInforme(): void {
    this.informeservice.updateInforme(this.informe).subscribe((informe) => {
      swal.fire('InformeVisita', 'Informe editado con exito.', 'success');
      this.listarInfome();
    });
    this.dis = false;
    this.limpiar();
  }
  eliminarInforme(infvisita: InformeVisita): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: 'Esta seguro que desea eliminar?',
        text: `¡No podrás revertir esto! eliminar el ${infvisita.asunto}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, Eliminar! ',
        cancelButtonText: ' No, Cancelar!',
        reverseButtons: true,
      })
      .then((resultt) => {
        if (resultt.isConfirmed) {
          this.informeservice
            .deleteInforme(infvisita.idInformeVisita)
            .subscribe((response) => {
              this.informes = this.informes.filter(
                (servii) => servii !== infvisita
              );
              swalWithBootstrapButtons.fire(
                'Eliminado!',
                `El informe fue eliminado.`,
                'success'
              );
            });
        } else if (
          /* Read more about handling dismissals below */
          resultt.dismiss === swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            'La empresa no se elimino.',
            'error'
          );
        }
      });
  }

  //Generar documento
  generate(
    tut: any,
    estu: any,
    nombreEm: any,
    empres: any,
    cic: any,
    asunt: any,
    obser: any,
    obserg: any,
    hori,
    horf,
    fec,
    sig
  ) {
    /* var empn=this.empresaNombre;
    var res=this.responsableNombre; */
    if (this.formInforme.invalid) {
      swal.fire(
        'Error de entrada',
        'Revise que los campos no esten vacios',
        'error'
      );
      return;
    }
    loadFile(
      'https://backendg1c2.herokuapp.com/files/anexo3.docx',
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
          siglas: sig,
          tutor: tut,
          estudiante: estu,
          nombreEmpresa: nombreEm,
          empresarial: empres,
          ciclo: cic,
          fecha: fec,
          inicio: hori,
          fin: horf,
          asunto: asunt,
          observación: obser,
          observaciong: obserg,
          periodo: 'Mayo 2022 - Diciembre 2022',
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
        saveAs(out, 'anexo11.docx');
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

  public limpiar(): void {
    this.informe.fecha = null;
    this.informe.horaInicio = null;
    this.informe.horaFin = null;
    this.informe.asunto = null;
    this.informe.actividades = null;
    this.informe.observaciones = null;
  }
}
