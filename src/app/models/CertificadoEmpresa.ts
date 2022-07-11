import { TutorE } from "./TutorE"

export class CertificadoEmpresa {
    idCertificadoEmpresa: any;
    fechaEmision: any;
    docCertificadoE: any;
    tutorE: TutorE;

    constructor() {
        this.tutorE = new TutorE();
    }

}