import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaConvocatoriaComponent } from './consulta-convocatoria.component';

describe('ConsultaConvocatoriaComponent', () => {
  let component: ConsultaConvocatoriaComponent;
  let fixture: ComponentFixture<ConsultaConvocatoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaConvocatoriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaConvocatoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
