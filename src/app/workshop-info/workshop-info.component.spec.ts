import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';

import { WorkshopInfoComponent } from './workshop-info.component';
import { WorkshopService } from '../services/workshop.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

// npm test -- --watch=false --include src/app/workshop-info/workshop-info.component.spec.ts

describe('WorkshopInfoComponent', () => {
  let component: WorkshopInfoComponent;
  let fixture: ComponentFixture<WorkshopInfoComponent>;

  let workshopServiceSpy: any;
  let userServiceSpy: any;
  let authServiceSpy: any;
  const routeStub = { params: of({ id: '1' }) };

  const mockWorkshop = {
    idtaller: 1,
    fecha: new Date().toISOString(),
    hora_ini: '12:30:00',
    estado_curso: 1,
    tematica: 'Tema1,Tema2',
    requisitos: '',
    herramienta: ''
  };

  beforeEach(async () => {
    workshopServiceSpy = jasmine.createSpyObj('WorkshopService', ['getWorkshopById']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getTalleresByAlumno', 'inscribirEnTaller', 'cancelarInscripcionTaller']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);

    workshopServiceSpy.getWorkshopById.and.returnValue(of(mockWorkshop));
    userServiceSpy.getTalleresByAlumno.and.returnValue(of([]));
    authServiceSpy.getUser.and.returnValue({ dni: '12345678', rol: 'alumno' });

    await TestBed.configureTestingModule({
      declarations: [WorkshopInfoComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: WorkshopService, useValue: workshopServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Location, useValue: { back: jasmine.createSpy('back') } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkshopInfoComponent);
    component = fixture.componentInstance;

    // Ensure template bindings that call slice/read length have safe values
    component.workshop = {
      idtaller: 1,
      fecha: new Date(),
      hora_ini: '12:30:00',
      estado_curso: 1,
      tematica: ['Tema1', 'Tema2'],
      requisitos: [],
      herramienta: []
    } as any;

    // Do one safe change detection so the component is stable for template
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('openModal should set showModal to true', () => {
    component.showModal = false;
    component.openModal();
    expect(component.showModal).toBeTrue();
  });

  it('puedeInscribirse returns true for future or today date when not inscripto', () => {
    const today = new Date();
    component.workshop = { fecha: today.toISOString(), estado_curso: 1 } as any;
    component.yaInscripto = false;
    expect(component.puedeInscribirse()).toBeTrue();
  });

  it('puedeInscribirse returns false for past date', () => {
    const past = new Date();
    past.setDate(past.getDate() - 10);
    component.workshop = { fecha: past.toISOString(), estado_curso: 1 } as any;
    component.yaInscripto = false;
    expect(component.puedeInscribirse()).toBeFalse();
  });

  it('confirmModal calls inscribirEnTaller and sets yaInscripto on success', () => {
    spyOn(window, 'alert');
    userServiceSpy.inscribirEnTaller.and.returnValue(of({}));
    component.user = { dni: '12345678' } as any;
    component.workshop = { idtaller: 1 } as any;
    component.showModal = true;
    component.confirmModal();
    expect(userServiceSpy.inscribirEnTaller).toHaveBeenCalledWith('12345678', 1);
    expect(component.yaInscripto).toBeTrue();
    expect(component.showModal).toBeFalse();
    expect(window.alert).toHaveBeenCalled();
  });

  it('confirmCancellationModal calls cancelarInscripcionTaller and clears yaInscripto', () => {
    spyOn(window, 'alert');
    userServiceSpy.cancelarInscripcionTaller.and.returnValue(of({}));
    component.user = { dni: '12345678' } as any;
    component.workshop = { idtaller: 1 } as any;
    component.showCancellationModal = true;
    component.yaInscripto = true;
    component.confirmCancellationModal();
    expect(userServiceSpy.cancelarInscripcionTaller).toHaveBeenCalledWith('12345678', 1);
    expect(component.yaInscripto).toBeFalse();
    expect(component.showCancellationModal).toBeFalse();
  });
});
