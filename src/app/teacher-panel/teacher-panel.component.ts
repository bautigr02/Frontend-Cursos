import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TeacherService } from '../services/teacher.service';

@Component({
  selector: 'app-teacher-panel',
  templateUrl: './teacher-panel.component.html',
  styleUrls: ['./teacher-panel.component.scss']
})
export class TeacherPanelComponent implements OnInit {
  cursos: any[] = [];
  user: any;
  talleres: any[] = [];
  isEditing = false;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private teacherService: TeacherService,
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
       cursos.forEach((curso, index) => {
            if (!curso || !curso.idcurso) {
              console.warn('Curso inválido o sin idcurso:', curso);
              return;
            }

            this.http.get<any[]>(`http://localhost:3000/api/docente/cursos/talleres/${curso.idcurso}`)
              .subscribe({
                next: (talleres) => {
                  this.cursos[index].talleres = talleres;
                  console.log(`Talleres para el curso ${curso.idcurso}:`, talleres);
                },
                error: (err) => {
                  console.error(`Error al obtener talleres para el curso ${curso.idcurso}:`, err);
                }
              });
          });
      },
      error: (err) => {
        console.error('Error al obtener cursos:', err);
      }
    });
  }

 userBackup: any; // Backup de los datos del usuario antes de editar
  editarDatos() {
    this.isEditing = true;
    this.userBackup = { ...this.user };

  }

  guardarDatos() {
    console.log('Intentando guardar...');
    this.teacherService.updateDocente(this.user).subscribe(
      (data) => {
        this.isEditing = false;
        console.log('Datos del docente actualizados:', data);
      },
      (error) => {
        console.error('Error al guardar los datos:', error);
      }
    );
  }

  cancelarEdicion() { // Restaura los datos originales si el usuario cancela
    this.isEditing = false;
    if (this.userBackup) {
      this.user = { ...this.userBackup };
      console.log('Edición cancelada, datos restaurados:', this.user);
    }
  }


}
