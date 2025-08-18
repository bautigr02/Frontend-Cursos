import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isErrorVisible = false;
  isSuccessVisible = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
        this.registerForm = this.fb.group({
          // Nombre: requerido, máximo 30 caracteres, solo letras
          nombre: [
            '',
            [
              Validators.required,
              Validators.maxLength(30),
              Validators.pattern('^[A-Za-z]+$')
            ]
          ],
          // Apellido: requerido, máximo 30 caracteres, solo letras
          apellido: [
            '',
            [
              Validators.required,
              Validators.maxLength(30),
              Validators.pattern('^[A-Za-z]+$')
            ]
          ],
          // Teléfono: requerido, máximo 15 dígitos, solo números
          telefono: [
            '',
            [
              Validators.required,
              Validators.maxLength(15),
              Validators.pattern('^[0-9]+$')
            ]
          ],
          // Email: requerido, máximo 60 caracteres y formato email
          email: [
            '',
            [
              Validators.required,
              Validators.email,
              Validators.maxLength(60)
            ]
          ],
          // Documento (DNI): requerido, máximo 10 dígitos, solo números
          dni: [
            '',
            [
              Validators.required,
              Validators.maxLength(10),
              Validators.pattern('^[0-9]+$')
            ]
          ],
          // Dirección: requerido, máximo 30 caracteres (puede incluir letras y números)
          direccion: [
            '',
            [
              Validators.required,
              Validators.maxLength(30)
            ]
          ],
          // Contraseña: requerido, máximo 15 caracteres
          password: [
            '',
            [
              Validators.required,
              Validators.maxLength(15)
            ]
          ]
        });
      }

onSubmit(): void {
  if (this.registerForm.valid) {
    console.log('Registro exitoso:', this.registerForm.value);
    this.http.post('http://localhost:3000/api/alumno', this.registerForm.value) //CAMBIAR
      .pipe(
        tap((response) => {console.log('Alumno creado exitosamente:', response)
          this.isSuccessVisible = true;
        }),
        catchError((error) => {
          console.log('Error al crear alumno:', error);
          this.isErrorVisible = true;
          this.registerForm.markAllAsTouched();
          return of(error); // Devuelve un Observable vacío para evitar que se rompa
        })
      )
      .subscribe();
   
     } else {
    this.isErrorVisible = true;
    this.isSuccessVisible = false;
    console.log('Formulario inválido.');
    this.registerForm.markAllAsTouched();
    }
  }
}