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

  updateAlumno(user: any) {
    return this.http.patch(`${this.apiUrl}/${user.dni}`, user);
  }

  // Inscribirse a un curso
  inscribirEnCurso(dni: number, idcurso: number) {
  return this.http.post('http://localhost:3000/api/inscripcion_curso', { dni, idcurso });
  }

  // Cancelar inscripción a un curso
  cancelarInscripcion(dni: number, idCurso: number): Observable<any> {
  // PATCH: solo actualiza el campo estado
  return this.http.patch(`http://localhost:3000/api/inscripcion_curso/${dni}/${idCurso}`, { estado: 3 });
  }

  // Inscribirse a un taller
  inscribirEnTaller(dni: number, idtaller: number) {
    return this.http.post('http://localhost:3000/api/inscripcion_taller', { dni, idtaller });
  }

  // Cancelar inscripción a un taller
  cancelarInscripcionTaller(dni: number, idtaller: number): Observable<any> {
    return this.http.patch(`http://localhost:3000/api/inscripcion_taller/${dni}/${idtaller}`, { estado: 3 });
  }
}
