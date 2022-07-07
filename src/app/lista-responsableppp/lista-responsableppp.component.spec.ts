import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaResponsablepppComponent } from './lista-responsableppp.component';

describe('ListaResponsablepppComponent', () => {
  let component: ListaResponsablepppComponent;
  let fixture: ComponentFixture<ListaResponsablepppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaResponsablepppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaResponsablepppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
