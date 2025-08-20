import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {
  private apiUrl = 'http://localhost:3000/api/talleres'; // URL del backend

  constructor(private http: HttpClient) {}
  // Obtener todos los talleres
  getWorkshops(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  // Obtener un taller por ID
  getWorkshopById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  // Crear un taller
  createTaller(workshop: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, workshop);
  }
  // Actualizar un taller
  updateWorkshop(id: number, workshop: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, workshop);
  }
  // Eliminar un taller
  deleteWorkshop(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  // Obtener talleres por curso
  getWorkshopsByCurso(idcurso: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/curso/${idcurso}`);
  }
}
