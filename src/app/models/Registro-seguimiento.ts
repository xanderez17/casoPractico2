import { ActividadesDiarias } from "./actividades-diarias";
import { Cronograma } from "./Cronograma";

export class RegistroSeguimiento{
     id: any;

     numActividad:any;

    fechaSeguimiento:any;

    fechaFinalizacion:any;

    porcentaje:any;

    observacion:any;
    
    actividadesDiarias:ActividadesDiarias= new ActividadesDiarias();
    cronograma:Cronograma= new Cronograma();

}