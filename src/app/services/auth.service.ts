import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable(); 

  constructor() {
    const user = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    if (user &&token) {
      this.userSubject.next(JSON.parse(user)); 
    }
  }

  // Método para iniciar sesión
  login(resp: { user: any; token: string }): void {
    sessionStorage.setItem('user', JSON.stringify(resp.user));
    sessionStorage.setItem('token', resp.token);
    this.userSubject.next(resp.user);
}
  // Método para cerrar sesión
  logout(): void {
    sessionStorage.removeItem('user'); 
    sessionStorage.removeItem('token');
    this.userSubject.next(null);  
  }

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    const token = sessionStorage.getItem('token');
    return !!token;
  }
   
  getUser(): any {  //Lo deberiamos eliminar ¿?
    return this.userSubject.getValue();
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }
  // Existe para course-form.component.ts
  getDniDocenteLogueado(): string | null {
    const user = this.userSubject.getValue();
    return user ? user.dni : null; 
  }
}