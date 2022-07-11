import { Component, OnInit } from '@angular/core';
import { ConvenioService} from '../services/convenio.service';

@Component({
  selector: 'app-listarconvenios',
  templateUrl: './listarconvenios.component.html',
  styleUrls: ['./listarconvenios.component.css']
})
export class ListarconveniosComponent implements OnInit {
    searchText: any;
      public listaConvenios:Array<any>=[];
      constructor(private conveniosService:ConvenioService) { }

      ngOnInit(): void {
        this.listarConvenios();
      }

      public listarConvenios(){
        this.conveniosService.getConvenio().subscribe((resp: any)=>{
          console.log(resp.data)
          this.listaConvenios= resp.data
        })
      }
    }
