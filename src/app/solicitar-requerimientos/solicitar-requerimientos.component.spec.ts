import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarRequerimientosComponent } from './solicitar-requerimientos.component';

describe('SolicitarRequerimientosComponent', () => {
  let component: SolicitarRequerimientosComponent;
  let fixture: ComponentFixture<SolicitarRequerimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitarRequerimientosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarRequerimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
