import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionCronogramaComponent } from './notificacion-cronograma.component';

describe('NotificacionCronogramaComponent', () => {
  let component: NotificacionCronogramaComponent;
  let fixture: ComponentFixture<NotificacionCronogramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificacionCronogramaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacionCronogramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
