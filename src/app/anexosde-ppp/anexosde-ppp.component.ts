import { Component, OnInit } from '@angular/core';
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-anexosde-ppp',
  templateUrl: './anexosde-ppp.component.html',
  styleUrls: ['./anexosde-ppp.component.css']
})
export class AnexosdePPPComponent implements OnInit {
 searchText: any;
  constructor() { }

  ngOnInit(): void {
  }

  descargarAnexo(pdf:any){
    let ruta = environment.URL_APP + 'files/'+ pdf + '.pdf';
    window.open(ruta);
  }

}
