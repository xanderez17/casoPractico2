import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudEmpresaComponent } from './solicitud-empresa.component';

describe('SolicitudEmpresaComponent', () => {
  let component: SolicitudEmpresaComponent;
  let fixture: ComponentFixture<SolicitudEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudEmpresaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
