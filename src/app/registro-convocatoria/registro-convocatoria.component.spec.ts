import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroConvocatoriaComponent } from './registro-convocatoria.component';

describe('RegistroConvocatoriaComponent', () => {
  let component: RegistroConvocatoriaComponent;
  let fixture: ComponentFixture<RegistroConvocatoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroConvocatoriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroConvocatoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
