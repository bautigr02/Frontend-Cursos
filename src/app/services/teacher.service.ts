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

  getCoursesByDocenteDni(dni: string): Observable<any[]> {
   return this.http.get<any[]>(`http://localhost:3000/api/docente/cursos/${dni}`);
  }

  getTalleresByCursoId(idcurso: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/docente/cursos/talleres/${idcurso}`);
  }

  getAlumnosByCursoId(idcurso: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cursos/alumnos/${idcurso}`);
  }

  getAlumnosByTallerId(idtaller: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/talleres/alumnos/${idtaller}`);
  }

  insertNotaAlumno(nota: any) {
    const { dni, nota_taller, idtaller } = nota;
    return this.http.post(`http://localhost:3000/api/docente/talleres/alumnos/nota`, { dni, nota_taller, idtaller });
  }

  showTalleresHistorial(dni_docente: string): Observable<any[]> {
  return this.http.get<any[]>(`http://localhost:3000/api/docente/talleres/historial/${dni_docente}`);
  }
  
  getNotasByAlumnoInCurso(idalumno: string, idcurso: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/docente/talleres/alumnos/nota/${idalumno}/${idcurso}`);
  }

  insertNotaCursoAlumno(nota: any) {
  const { dni, nota_curso, idcurso } = nota;
  return this.http.post(`http://localhost:3000/api/docente/talleres/alumnos/nota/curso/${idcurso}`,{ dni, nota_curso });
}

}
