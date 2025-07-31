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
}
