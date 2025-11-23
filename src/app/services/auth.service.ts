import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable(); 

  constructor() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user &&token) {
      this.userSubject.next(JSON.parse(user)); 
    }
  }

  // Método para iniciar sesión
  login(resp: { user: any; token: string }): void {
    localStorage.setItem('user', JSON.stringify(resp.user));
    localStorage.setItem('token', resp.token);
    this.userSubject.next(resp.user);
  }
  // Método para cerrar sesión
  logout(): void {
    sessionStorage.removeItem('user'); 
    localStorage.removeItem('token');
    this.userSubject.next(null);  
  }

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
   
  getUser(): any {  //Lo deberiamos eliminar ¿?
    return this.userSubject.getValue();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  // Existe para course-form.component.ts
  getDniDocenteLogueado(): string | null {
    const user = this.userSubject.getValue();
    return user ? user.dni : null; 
  }
}