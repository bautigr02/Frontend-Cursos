import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/alumno'; // URL del backend


  constructor(private http: HttpClient) { }

  // Obtener datos del usuario
  getUserData(dni: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${dni}`);
  }

  getCursosByAlumno(dni: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${dni}/cursos`);
  }

  getTalleresByAlumno(dni: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${dni}/talleres`);
  }

  getUltimosTalleresByAlumno(dni: number) {
    return this.http.get<any[]>(`http://localhost:3000/api/alumno/${dni}/talleres`);
  }
}
