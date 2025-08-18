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

  updateAlumno(user: any) {
    return this.http.patch(`http://localhost:3000/api/alumno/${user.dni}`, user);
  }

  cancelarInscripcion(dni: number, idCurso: number): Observable<any> {
  // PATCH: solo actualiza el campo estado
  return this.http.patch(`http://localhost:3000/api/inscripcion_curso/${dni}/${idCurso}`, { estado: 3 });
  }

  inscribirEnCurso(dni: number, idcurso: number) {
  return this.http.post('http://localhost:3000/api/inscripcion_curso', { dni, idcurso });
}

// Inscribirse a un taller
inscribirEnTaller(dni: number, idtaller: number) {
  return this.http.post('http://localhost:3000/api/inscripcion_taller', { dni, idtaller });
}

// Verificar si puede inscribirse a un taller
puedeInscribirseATaller(dni: number, idtaller: number) {
  return this.http.get(`http://localhost:3000/api/taller/${idtaller}/puede-inscribirse/${dni}`);
}
}
