import{Injectable} from "@angular/core";
import {ConsultaEstadoComponent} from "../consulta-estado/consulta-estado.component";
import {Convocatoria} from "../models/Convocatoria";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";


@Injectable({  providedIn: 'root'})
export class ConEstadoService{

  headers= new HttpHeaders().append('Content-type','application/json');

  constructor(private http: HttpClient) { }

// retorna el array completa incluyendo el mensaje que se genero y estado

  getConvocatorias(): Promise<any[]>
  {
    return this.http.get<any[]>(
      environment.URL_APP+'GestionConvocatoria/ListaConvocatoria'
    ).toPromise();
  }


  // //filtrar por id convocatoria
  // getConvocatoriasId(id:bigint): Convocatoria {
  //   let convocatorias = this.getConvocatorias();
  //   let convocatoria = convocatorias.filter(convo => convo.id == id)
  //
  //   return convocatoria;
  // }
}
