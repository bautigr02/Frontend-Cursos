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
    if (user) {
      this.userSubject.next(JSON.parse(user)); 
    }
  }

  // Método para iniciar sesión
  login(user: any): void {
    sessionStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);  
  }

  // Método para cerrar sesión
  logout(): void {
    sessionStorage.removeItem('user'); 
    this.userSubject.next(null);  
  }

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return this.userSubject.getValue() !== null;
  }
   
  getUser(): any {  //Lo deberiamos eliminar ¿?
    return this.userSubject.getValue();
  }

  getDniDocenteLogueado(): string | null {
    const user = this.userSubject.getValue();
    return user ? user.dni : null; 
  }
}