import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InformeVisita, Visita } from '../models/Visita';
import { InformeService } from '../services/Informe.service';
import swal from 'sweetalert2';

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
      observaciones: ['', Validators.required],
    });

    this.cols = [
      { field: 'fecha', header: 'Fecha' },
      { field: 'horainicio', header: 'Hora Inicio' },
      { field: 'horafin', header: 'Hora Fin' },
      { field: 'asunto', header: 'Asunto a tratar' },
      { field: 'observaciones', header: 'Observaciones' },
      { field: 'size', header: 'Acciones' },
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

  public limpiar(): void {
    this.informe.fecha = null;
    this.informe.horaInicio = null;
    this.informe.horaFin = null;
    this.informe.asunto = null;
    this.informe.observaciones = null;
  }
}
