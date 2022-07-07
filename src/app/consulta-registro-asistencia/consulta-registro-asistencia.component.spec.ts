import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaRegistroAsistenciaComponent } from './consulta-registro-asistencia.component';

describe('ConsultaRegistroAsistenciaComponent', () => {
  let component: ConsultaRegistroAsistenciaComponent;
  let fixture: ComponentFixture<ConsultaRegistroAsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaRegistroAsistenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaRegistroAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
