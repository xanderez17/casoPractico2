import { SolicitudEmpresa } from "./SolicitudEmpresa";

export class Convocatoria{
    idConvocatoria : any;
    nombreConvocatoria:any;
    fechaEmision:any;
    fechaMaxima:any;
    docConvocatoria:any;
    solicitudEmpresa:SolicitudEmpresa;

    constructor(){
       this.solicitudEmpresa = new SolicitudEmpresa();
    }
}
