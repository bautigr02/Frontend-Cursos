import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;

  isErrorVisible = false;
  ValidarUsuario(){
       this.isErrorVisible = !this.isErrorVisible;
      }

  
      constructor(private fb: FormBuilder) {
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
          documento: [
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
          // Aquí podrías realizar la lógica para enviar los datos al servidor
        } else {
          this.ValidarUsuario()
          console.log('Formulario inválido');
          // Marca todos los campos como tocados para mostrar los mensajes de error
          this.registerForm.markAllAsTouched();
        }
      }
    }
