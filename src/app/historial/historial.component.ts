import { Component, OnInit } from '@angular/core';
import { HistorialService} from '../services/historial.services';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})

export class HistorialComponent implements OnInit {
   searchText: any;
  public historialC:Array<any>=[];
  constructor(private historialService:HistorialService) { }

  ngOnInit(): void {
    this.listarHistorial();
  }

  public listarHistorial(){
    this.historialService.getHistorial().subscribe((resp: any)=>{
      console.log(resp.data)
      this.historialC= resp.data
    })
  }
}
