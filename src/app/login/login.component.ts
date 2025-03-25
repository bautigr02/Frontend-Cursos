import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isErrorVisible = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      identifier: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9@._-]+$')
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]
    });
  }

  onSubmit(): void {
    const { identifier, password } = this.loginForm.value;
    console.log('Datos enviados:', { identifier, password });

    this.http.post('http://localhost:3000/api/login', { identifier, password })
      .pipe(
        tap((response: any) => {
          console.log('Login exitoso:', response);

          if (response.user) {
            this.authService.login(response.user); // Guardar usuario en AuthService
            console.log('Usuario guardado en AuthService y sessionStorage:', response.user);
            this.router.navigate(['/']);
          } else {
            console.error('No se recibió el objeto "user" en la respuesta');
          }
        }),
        catchError((error) => {
          console.error('Error en la petición:', error);
          this.isErrorVisible = true;
          return of(error);
        })
      )
      .subscribe();
  }
}