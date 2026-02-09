import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = 'http://localhost:3000/api/docente'; // URL del backend

  constructor(private http: HttpClient) { }

  // Obtener datos del usuario
  
  updateDocente(user: any) {
    return this.http.patch(`${this.apiUrl}/${user.dni}`, user);
  }

  getCoursesByDocenteDni(dni: string): Observable<any[]> {
   return this.http.get<any[]>(`${this.apiUrl}/cursos/${dni}`);
  }

  getTalleresByCursoId(idcurso: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cursos/talleres/${idcurso}`);
  }

  getAlumnosByCursoId(idcurso: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cursos/alumnos/${idcurso}`);
  }

  getAlumnosByTallerId(idtaller: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/talleres/alumnos/${idtaller}`);
  }

  insertNotaAlumno(idtaller: number, dni:string, notaTaller: number) {
    return this.http.post(`${this.apiUrl}/talleres/alumnos/nota/${idtaller}/${dni}`, { notaTaller});
  }

  showTalleresHistorial(dni_docente: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/talleres/historial/${dni_docente}`);
  }
  
  getNotasByAlumnoInCurso(idalumno: string, idcurso: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/talleres/alumnos/nota/${idalumno}/${idcurso}`);
  }

  insertNotaCursoAlumno(idcurso: number, dni: string | number, notaCurso: number) {
  return this.http.post(`${this.apiUrl}/talleres/alumnos/nota/curso/${idcurso}/${dni}`,{notaCurso });
}

  isUserATeacher(userId: number): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`).pipe(
      map(teacher => !!teacher),
      catchError(() => of(false))
    );
  }

}
