import { Alumno } from "./Alumno";
export class registroA{
    idRegistroAsistencia:Number;
    docRegistroA:string;
    alumno:Alumno;

    constructor(){
        this.alumno =new Alumno();
    }
}