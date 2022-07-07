import { AnyForUntypedForms } from "@angular/forms";
import { Empresa } from "../services/empresa";
import { Persona } from "./Persona";

export class PersonalEmpresa{
idPersonal:any;
cargo:any;
sueldo:any;
empresa:Empresa =new Empresa();
persona:Persona = new Persona();
}