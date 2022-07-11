import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarconveniosComponent } from './listarconvenios.component';

describe('ListarconveniosComponent', () => {
  let component: ListarconveniosComponent;
  let fixture: ComponentFixture<ListarconveniosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarconveniosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarconveniosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
