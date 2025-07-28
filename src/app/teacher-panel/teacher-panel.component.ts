import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-teacher-panel',
  templateUrl: './teacher-panel.component.html',
  styleUrls: ['./teacher-panel.component.scss']
})
export class TeacherPanelComponent implements OnInit {
  cursos: any[] = [];
  user: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.user = this.authService.getUser();

    if (!this.user || this.user.rol !== 'docente') {
      console.error('Usuario no válido o no es docente');
      return;
    }

    if (!this.user.dni) {
      console.error('DNI no encontrado en usuario');
      return;
    }

    this.http.get<any[]>(`http://localhost:3000/api/docente/cursos/${this.user.dni}`)
      .subscribe({
        next: (cursos) => {
          this.cursos = cursos;
        },
        error: (err) => {
          console.error('Error al obtener cursos:', err);
        }
      });
  }
}
