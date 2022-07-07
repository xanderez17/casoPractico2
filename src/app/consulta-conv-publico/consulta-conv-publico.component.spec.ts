import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaConvPublicoComponent } from './consulta-conv-publico.component';

describe('ConsultaConvPublicoComponent', () => {
  let component: ConsultaConvPublicoComponent;
  let fixture: ComponentFixture<ConsultaConvPublicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaConvPublicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaConvPublicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
