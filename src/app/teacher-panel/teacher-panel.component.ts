import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TeacherService } from '../services/teacher.service';
import { CourseService } from '../services/course.service';
import { WorkshopService } from '../services/workshop.service';

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
  isEditingCurso = false;
  isEditingTaller = false;
  curso: any;
  cursoSeleccionado: any;
  taller: any;
  tallerSeleccionado: any;
  alumno: any;
  alumnosInscritos: any[] = [];
  alumnosTaller: any[] = [];
  historialTalleres: any[] = [];
  isInsertarNota = false;
  alumnoSeleccionado: any;
  nuevaNota: number | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private teacherService: TeacherService,
    private CourseService: CourseService,
    private workshopService: WorkshopService
  ) {}


  //Solucionar
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

  //Edicion usuario Docente
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

  //Edicion Cursos

  cursoBackup: any; // Backup de los datos del curso antes de editar
  editarCurso(curso: any) {
    this.cursoBackup = { ...curso };
    this.cursoSeleccionado = curso;
    this.isEditingCurso = true;
  }

  guardarCursoModificado(){
    console.log('Intentando guardar curso modificado...');
    delete this.cursoSeleccionado.talleres; // Elimina talleres para evitar conflictos al enviar
  // Formatear fecha para SQL
  if (this.cursoSeleccionado.fec_ini) {
    this.cursoSeleccionado.fec_ini = this.cursoSeleccionado.fec_ini.slice(0, 10);
  }
  if (this.cursoSeleccionado.fec_fin) {
    this.cursoSeleccionado.fec_fin = this.cursoSeleccionado.fec_fin.slice(0, 10);
  }
    this.CourseService.patchCurso(this.cursoSeleccionado.idcurso,this.cursoSeleccionado).subscribe(  
      (data) => {
        this.isEditingCurso = false;
        this.cursoSeleccionado.talleres = this.cursoBackup.talleres;
        console.log('Curso actualizado:', data);
      },
      (error) => {
        console.error('Error al actualizar el curso:', error);
      }
    );
  }

  cancelarEdicionCurso() {
    this.isEditingCurso = false;
    if (this.cursoBackup) {
      this.cursoSeleccionado = { ...this.cursoBackup };
      console.log('Edición de curso cancelada, datos restaurados:', this.cursoSeleccionado);
    }
  }

  //Edicion Talleres
  tallerBackup: any; // Backup de los datos del taller antes de editar
  editarTaller(taller: any) {
    this.tallerBackup = { ...taller };
    this.tallerSeleccionado = taller;
    this.isEditingTaller = true;
  }

  guardarTallerModificado() {
    console.log('Intentando guardar taller modificado...');
    delete this.tallerSeleccionado.curso;
    if (this.tallerSeleccionado.fecha) {
    this.tallerSeleccionado.fecha = this.tallerSeleccionado.fecha.slice(0, 10);
  }
    this.workshopService.patchTaller(this.tallerSeleccionado.idtaller, this.tallerSeleccionado).subscribe(
      (data) => {
        this.isEditingTaller = false;
        this.tallerSeleccionado.curso = this.tallerBackup.curso;
        console.log('Taller actualizado:', data);
      },
      (error) => {
        console.error('Error al actualizar el taller:', error);
      }
    );
  }

  cancelarEdicionTaller() {
    this.isEditingTaller = false;
    if (this.tallerBackup) {
      this.tallerSeleccionado = { ...this.tallerBackup };
      console.log('Edición de taller cancelada, datos restaurados:', this.tallerSeleccionado);
    }
  }

  // Crear una funcion verAlumnos que te genere un listado de alumnos que estan inscriptos a un curso determinado
  verAlumnos(curso: any) {
    this.teacherService.getAlumnosByCursoId(curso.idcurso).subscribe(
      (alumnos) => {
        this.alumnosInscritos = alumnos;
        this.cursoSeleccionado = curso;
        console.log('Alumnos inscritos en el curso:', alumnos);
      },
      (error) => {
        console.error('Error al obtener alumnos inscritos:', error);
      }
    );
  }

  cerrarAlumnosInscritos(){
    this.alumnosInscritos = [];
  }
  
  verAlumnosTaller(taller: any) {
    this.teacherService.getAlumnosByTallerId(taller.idtaller).subscribe(
      (alumnos) => {
        this.alumnosTaller = alumnos;
        this.tallerSeleccionado = taller;
        console.log('Alumnos inscritos en el taller:', alumnos);
      },
      (error) => {
        console.error('Error al obtener alumnos inscritos:', error);
      }
    );
  }

  insertarNota(alumno: any) {
    this.alumnoSeleccionado = alumno;
    this.isInsertarNota = true;
  }

  agregarNota(alumno: any) {
    this.teacherService.insertNotaAlumno(alumno).subscribe(
      (response) => {
        console.log('Nota agregada:', response);
      },
      (error) => {
        console.error('Error al agregar nota:', error);
      }
    );
  }

  cancelarInsercionNota() {
    this.isInsertarNota = false;
    this.nuevaNota = null;
  }

  cerrarAlumnosInscritosTaller(){
    this.alumnosTaller = [];
  }

  //Historial de talleres x docente

  verHistorial(){
    this.teacherService.showTalleresHistorial(this.cursoSeleccionado.idcurso).subscribe(
      (historial) => {
        this.historialTalleres = historial;
        console.log('Historial de talleres:', historial);
      },
      (error) => {
        console.error('Error al obtener historial de talleres:', error);
      }
    );
  }
}
