import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/api/cursos'; // URL del backend

  constructor(private http: HttpClient) {}

  // Obtener todos los cursos
  getCourses(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener un curso por ID
  getCourseById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear un curso
  createCurso(course: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, course);
  }

  // Actualizar un curso
  patchCurso(id: number, course: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, course);
  }

  
  // Eliminar un curso
  deleteCurso(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}