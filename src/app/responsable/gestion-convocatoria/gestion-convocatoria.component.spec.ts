import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionConvocatoriaComponent } from './gestion-convocatoria.component';

describe('GestionConvocatoriaComponent', () => {
  let component: GestionConvocatoriaComponent;
  let fixture: ComponentFixture<GestionConvocatoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionConvocatoriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionConvocatoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
