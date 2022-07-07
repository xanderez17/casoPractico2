import { registroA } from "./RegistroAsistencia";
export class ActividadesDiarias{

    idActividadesD:any;
    fecha:String;
    horaLlegada:String;
    horaSalida:String;
    descripcion:String;
    numHoras:number;
    registroA:registroA;

    constructor(){
        this.registroA = new registroA();
    }

}