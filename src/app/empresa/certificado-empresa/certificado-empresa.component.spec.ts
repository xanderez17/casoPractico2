import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificadoEmpresaComponent } from './certificado-empresa.component';

describe('CertificadoEmpresaComponent', () => {
  let component: CertificadoEmpresaComponent;
  let fixture: ComponentFixture<CertificadoEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificadoEmpresaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificadoEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
