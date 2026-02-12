import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('RegisterComponent (Test Unitario)', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;

// A pesar de marcarse en rojo, toBeTruthy y toBeFalsy funcionan correctamente.

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, RouterTestingModule.withRoutes([])]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Validacion del formulario
  it('Formulario invalido cuando hay campos vacios', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('Formulario invalido si el nombre tiene numeros', () => {
    const nombre = component.registerForm.controls['nombre'];
    nombre.setValue('Juan123');
    expect(nombre.valid).toBeFalsy();
  });

  it('Formulario invalido si el telefono tiene letras', () => {
    const telefono = component.registerForm.controls['telefono'];
    telefono.setValue('ABC1234567');
    expect(telefono.valid).toBeFalsy();
  });

  it('Formulario invalido si el telefono no tiene entre 7 y 15 caracteres', () => {
    const telefono = component.registerForm.controls['telefono'];
    telefono.setValue('123456');
    expect(telefono.valid).toBeFalsy();
  });

  it('Formulario invalido si el DNI tiene letras', () => {
    const dni = component.registerForm.controls['dni'];
    dni.setValue('ABC1234567');
    expect(dni.valid).toBeFalsy();
  });

  it('Formulario invalido si el DNI no tiene 8 caracteres', () => {
    const dni = component.registerForm.controls['dni'];
    dni.setValue('1234567');
    expect(dni.valid).toBeFalsy();
  });

  it('Validación Email: debe validar formato correcto', () => {
    const email = component.registerForm.controls['email'];
    email.setValue('correo_no_valido');
    expect(email.hasError('email')).toBeTruthy();
    
    email.setValue('test@dominio.com');
    expect(email.valid).toBeTruthy();
  });

  it('Debe mostrar error si el formulario es inválido al hacer onSubmit', () => {
    component.onSubmit();
    expect(component.isErrorVisible).toBeTrue();
    expect(component.isSuccessVisible).toBeFalse();
  });

  it('Debe marcar todos los campos como "touched" al intentar enviar un formulario inválido', () => {
    component.onSubmit();
    const nombre = component.registerForm.get('nombre');
    expect(nombre?.touched).toBeTrue();
  });

});
