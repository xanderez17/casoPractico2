import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { CarreraService } from '../services/carrera.service';
import { ConvocatoriaService } from '../services/convocatoria.service';


@Component({
  selector: 'app-consulta-convocatoria',
  templateUrl: './consulta-convocatoria.component.html',
  styleUrls: ['./consulta-convocatoria.component.css']
})
export class ConsultaConvocatoriaComponent implements OnInit, DoCheck, OnDestroy {
  public carreraDatos: Array<any> = [];
  public convocatorias: Array<any> = [];


  opcionSeleccionado: string = '0';
  verSeleccion: string = 'TODAS LAS CARRERAS';
  filtro:string="TODAS LAS CARRERAS";
  public dialogoTa: string="visible";

  constructor(private carreraService: CarreraService,
    private convocatoriaService: ConvocatoriaService,) { }

  ngOnInit(): void {
    this.listarCarreras();
    this.listarConvocatorias();
    console.log("Componente iniciado");
  }

  capturarCarrera(visi:any) {
    this.verSeleccion = this.opcionSeleccionado;
    this.dialogoTa=visi;
    
  }

  ngDoCheck(): void {
    console.log("Componente iniciado")
  }

  ngOnDestroy(): void {
    console.log("Componente iniciado")
  }

  listarCarreras() {
    this.carreraService.getCarreras().subscribe((resp: any) => {
      console.log(resp.data)
      this.carreraDatos = resp.data
    }
    )
  }

  public listarConvocatorias() {
    this.convocatoriaService.getConvocatoria().subscribe((resp: any) => {
      console.log(resp.data)
      this.convocatorias = resp.data
    })
  }


}
