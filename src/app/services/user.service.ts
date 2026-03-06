import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/alumno`; // URL del backend


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
  return this.http.post(`${environment.apiUrl}/inscripcion_curso`, { dni, idcurso });
  }

  // Cancelar inscripción a un curso
  cancelarInscripcion(dni: number, idCurso: number): Observable<any> {
  // PATCH: solo actualiza el campo estado
  return this.http.patch(`${environment.apiUrl}/inscripcion_curso/${dni}/${idCurso}`,{});
  }

  // Inscribirse a un taller
  inscribirEnTaller(dni: number, idtaller: number) {
    return this.http.post(`${environment.apiUrl}/inscripcion_taller`, { dni, idtaller });
  }

  // Cancelar inscripción a un taller
  cancelarInscripcionTaller(dni: number, idtaller: number): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/inscripcion_taller/${dni}/${idtaller}`, {});
  }
}
