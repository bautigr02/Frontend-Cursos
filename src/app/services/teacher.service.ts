import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = 'http://localhost:3000/api/docente'; // URL del backend

  constructor(private http: HttpClient) { }

  // Obtener datos del usuario
  
  updateDocente(user: any) {
    return this.http.patch(`http://localhost:3000/api/docente/${user.dni}`, user);
  }

  getAlumnosByCursoId(idcurso: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cursos/alumnos/${idcurso}`);
  }

  getAlumnosByTallerId(idtaller: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/talleres/alumnos/${idtaller}`);
  }

  insertNotaAlumno(nota: any) {
    return this.http.post(`http://localhost:3000/api/docente/talleres/alumnos/nota`, nota);
  }

  showTalleresHistorial(idcurso: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/docente/talleres/historial/${idcurso}`);
  }
}
