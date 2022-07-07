import {Component, DoCheck, OnDestroy, OnInit} from '@angular/core';
import {Convocatoria} from "../models/Convocatoria";
import { HistorialService} from '../services/historial.services';

@Component({
  selector: 'app-consulta-estado',
  templateUrl: './consulta-estado.component.html',
  styleUrls: ['./consulta-estado.component.css']
})

export class ConsultaEstadoComponent implements OnInit {

  searchText: any;
  public ConsultaEstado:Array<any>=[];
  constructor(private historialService:HistorialService) { }

  ngOnInit(): void {
    this.listarConsultaEstado();
  }

  public listarConsultaEstado(){
    this.historialService.getHistorial().subscribe((resp: any)=>{
      console.log(resp.data)
      this.ConsultaEstado= resp.data
    })
  }
}
