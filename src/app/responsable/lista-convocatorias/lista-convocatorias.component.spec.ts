import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaConvocatoriasComponent } from './lista-convocatorias.component';

describe('ListaConvocatoriasComponent', () => {
  let component: ListaConvocatoriasComponent;
  let fixture: ComponentFixture<ListaConvocatoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaConvocatoriasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaConvocatoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
