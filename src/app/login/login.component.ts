import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, switchMap, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isErrorVisible = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
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
    this.isErrorVisible = false;

    this.http.post('http://localhost:3000/api/login', { identifier, password }) // login de alumno
      .pipe(
        tap((response: any) => {
          if (response.user) {
            response.user.rol = 'alumno'; // 👈 importante
            this.authService.login(response.user);
            this.router.navigate(['/']);
          }
        }),
        catchError(error => {
          console.warn('No se encontró como alumno, intentando como docente...');

          // login de docente si alumno falla
          return this.http.post('http://localhost:3000/api/loginDocente', { identifier, password }).pipe(
            tap((response: any) => {
              if (response.user) {
                response.user.rol = 'docente'; // 👈 importante
                this.authService.login(response.user);
                this.router.navigate(['/']);
              }
            }),
            catchError(err => {
              console.error('Error en login docente:', err);
              this.isErrorVisible = true;
              return of(null);
            })
          );
        })
      )
      .subscribe();
  }
}