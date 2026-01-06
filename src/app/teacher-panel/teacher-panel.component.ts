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
  fechaActual: Date = new Date();
  insertarNotaFinal = false;
  mensajeEliminacion = false;

  cursoParaAlumnos: any = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private teacherService: TeacherService,
    private CourseService: CourseService,
    private workshopService: WorkshopService
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

    // Obtener cursos y talleres asociados al docente
    this.teacherService.getCoursesByDocenteDni(this.user.dni)
      .subscribe({
        next: (cursos) => {
          //Cargamos aquellos cursos no hayan finalizado(fecha limite + 10 dias)
          this.cursos = cursos.filter((curso: any) => {
          if (!curso || !curso.fec_fin) return false;
          
          const fechaLimite = new Date(curso.fec_fin); 
          fechaLimite.setDate(fechaLimite.getDate() + 10);
          return fechaLimite >= this.fechaActual;
          });
          
          this.cursos.forEach((curso,index)=>{
            this.teacherService.getTalleresByCursoId(curso.idcurso).subscribe({
              next:(talleres) =>{
                this.cursos[index].talleres = talleres;
              },
            error: (err) =>{
              console.error ("error al obtener talleres", err);
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

  esFechaFutura(fecha: string): boolean {
    if (!fecha) return false;

    const fechaTaller = new Date(fecha);
    const hoy = new Date();

    const fechaLimite = new Date(fechaTaller);
    fechaLimite.setDate(fechaLimite.getDate() + 7);

    hoy.setHours(0, 0, 0, 0);
    fechaLimite.setHours(23, 59, 59, 999);

    return fechaTaller >= hoy ;
  }

  // Guardar los datos modificados del docente
  guardarDatos() {
    console.log('Intentando guardar...');
    this.teacherService.updateDocente(this.user).subscribe(
      (data) => {
        this.isEditing = false;
        console.log('Datos del docente actualizados:', data);
        alert('Datos guardados con éxito.');
      },
      (error) => {
        console.error('Error al guardar los datos:', error);
        alert('Error al guardar los datos. Por favor, inténtelo de nuevo.');
      }
    );
  }

  //Cancelar edicion de los datos del docente
  cancelarEdicion() { // Restaura los datos originales si el usuario cancela
    this.isEditing = false;
    if (this.userBackup) {
      this.user = { ...this.userBackup };
      console.log('Edición cancelada, datos restaurados:', this.user);
      alert('Edición cancelada, los datos no fueron guardados.');
    }
  }

  //Edicion Cursos
  cursoBackup: any; // Backup de los datos del curso antes de editar
  editarCurso(curso: any) {
    this.cursoBackup = { ...curso };
    this.cursoSeleccionado = curso;
    this.isEditingCurso = true;
  }

  // Guardar los datos modificados del curso
  guardarCursoModificado(){
    console.log('Intentando guardar curso modificado...');
    delete this.cursoSeleccionado.talleres; // Elimina talleres para evitar conflictos al enviar
    delete this.cursoSeleccionado.fec_inicio; // Normaliza nombre de campo a fec_ini
    // Formatear fecha para SQL
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

  //Cancelar edicion de curso
  cancelarEdicionCurso() {
    this.isEditingCurso = false;
    if (this.cursoBackup) {
      this.cursoSeleccionado = { ...this.cursoBackup };
      console.log('Edición de curso cancelada, datos restaurados:', this.cursoSeleccionado);
    }
  }


  //Eliminar Curso
  //CONTROLAR TEMA ESTADO CURSO <--- MIRAR
  eliminarCurso(curso: any) {
    const fecIni = new Date(curso.fec_ini);
    const fechaActual = new Date(this.fechaActual);

  if (curso.estado == 1 || fecIni > fechaActual) {
   
    if (confirm(`¿Estás seguro de que deseas eliminar el curso "${curso.nom_curso}"? Esta acción no se puede deshacer.`)) {
      this.workshopService.deleteTalleresByCursoId(curso.idcurso).subscribe({
        next: () => {
          console.log(`Talleres del curso con ID ${curso.idcurso} eliminados.`);
          this.CourseService.deleteCurso(curso.idcurso).subscribe({
            next: () => {
              this.cursos = this.cursos.filter(c => c.idcurso !== curso.idcurso);
              console.log(`Curso con ID ${curso.idcurso} eliminado.`);
            },
            error: (error) => {
              console.error('Error al eliminar el curso:', error);
            }
          });
        },
        error: (error) => {
          console.error('Error al eliminar los talleres del curso:', error);
        }
      });
    }
  } else {
    this.mensajeEliminacion = true;
  }
}

  //Cerrar mensaje de no se puede eliminar curso
  cerrarMensajeEliminacion(){
    this.mensajeEliminacion = false;
  }

  //Edicion Talleres
  tallerBackup: any; // Backup de los datos del taller antes de editar
  editarTaller(taller: any) {
    this.tallerBackup = { ...taller };
    this.tallerSeleccionado = taller;
    this.isEditingTaller = true;
  }

  // Guardar los datos modificados del taller
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

  //Cancelar edicion de taller
  cancelarEdicionTaller() {
    this.isEditingTaller = false;
    if (this.tallerBackup) {
      this.tallerSeleccionado = { ...this.tallerBackup };
      console.log('Edición de taller cancelada, datos restaurados:', this.tallerSeleccionado);
    }
  }

  // Listado de alumnos que estan inscriptos a un curso determinado
verAlumnos(curso: any): void {
  this.alumnosInscritos = [];
  this.cursoParaAlumnos = curso;

  this.teacherService.getAlumnosByCursoId(curso.idcurso).subscribe(
    (alumnos: any[]) => {
      this.alumnosInscritos = alumnos;

      if (this.alumnosInscritos.length > 0) {
        console.log('Alumnos inscritos en el curso:', alumnos);
      }
    },
    (error: any) => {
      console.error('Error al obtener alumnos inscritos:', error);
    }
  );
}

  // Cerrar el listado de alumnos inscritos
  cerrarAlumnosInscritos(){
    this.cursoParaAlumnos = null;
    this.alumnosInscritos = [];
  }

  // Listado de alumnos que estan inscriptos a un taller determinado
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



  puedeAgregarNotaFinal(curso: any): boolean {
  if (!curso?.fec_fin) return false;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fechaFin = new Date(curso.fec_fin + 'T00:00:00');
  const fechaLimite = new Date(fechaFin);

  fechaLimite.setDate(fechaLimite.getDate() + 7); // sumar 7 días

  return hoy >= fechaFin && hoy <= fechaLimite;
  }

  puedeAgregarNotaTaller(taller: any): boolean {
    if (!taller?.fecha) return false;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaTaller = new Date(taller.fecha + 'T00:00:00');
    return hoy >= fechaTaller;
  } 
  // Habilita el formulario para insertar nota a un alumno
  insertarNota(alumno: any) {
    this.alumnoSeleccionado = alumno;
    this.isInsertarNota = true;
  }

  // Inserta la nota del alumno en el taller seleccionado
  agregarNota(alumno: any) {
  this.teacherService.insertNotaAlumno({
    dni: alumno.dni,
    nota_taller: this.nuevaNota,
    idtaller: this.tallerSeleccionado.idtaller
  }).subscribe(
    (response) => {
      console.log('Nota agregada:', response);
      this.isInsertarNota = false;
    },
    (error) => {
      console.error('Error al agregar nota:', error);
    }
  );
}

agregarNotaFinal(alumno: any): void {
  const curso = this.cursoSeleccionado;
  const totalTalleres = curso.talleres ? curso.talleres.length : 0;

  this.teacherService.getNotasByAlumnoInCurso(alumno.dni, curso.idcurso).subscribe(
    (notas: any[]) => {
      alumno.notas = notas;

      if (totalTalleres > 0) {
        const sumaNotas = alumno.notas.reduce((sum: number, nota: any) => sum + nota.nota_taller, 0);
        alumno.notaFinal = sumaNotas / totalTalleres;
      } else {
        alumno.notaFinal = null;
      }

      this.teacherService.insertNotaCursoAlumno({
        dni: alumno.dni,
        nota_curso: alumno.notaFinal,
        idcurso: curso.idcurso
      }).subscribe(
        () => {
          console.log(`Nota final actualizada para alumno ${alumno.dni}`);
        },
        (error: any) => {
          console.error('Error al insertar nota del alumno:', error);
        }
      );
    },
    (error: any) => {
      console.error('Error al obtener notas del alumno:', error);
    }
  );
}

  editarNotaFinal(alumno: any): void {
    this.insertarNotaFinal = true;
    this.alumnoSeleccionado = alumno;
    this.nuevaNota = alumno.notaFinal; // Asigna la nota actual para editar
  }

  puedeEditarNotaFinal(curso: any): boolean {
  const hoy = new Date();
  const fechaFin = new Date(curso.fec_fin);
  // Diferencia en milisegundos
  const diff = hoy.getTime() - fechaFin.getTime();
  // 7 días en milisegundos
  const sieteDias = 7 * 24 * 60 * 60 * 1000;
  // Mostrar si hoy es igual a fecha fin o está dentro de los 7 días posteriores
  return (
    hoy.toDateString() === fechaFin.toDateString() ||
    (hoy > fechaFin && diff <= sieteDias)
  );
}

  insertarNotaFinalAlumno( dni: number, nuevaNota: any, idcurso: number) {
    console.log('Insertando nota final:', { dni, nuevaNota, idcurso });
    this.teacherService.insertNotaCursoAlumno({
      dni: dni,
      nota_curso: nuevaNota,
      idcurso: idcurso
    }).subscribe(
      (response) => {
        console.log('Nota final insertada:', response);
      },
      (error) => {
        console.error('Error al insertar nota final:', error);
      }
    );
  }

  cancelarEdicionNotaFinal() {
    this.insertarNotaFinal = false;
    this.nuevaNota = null;
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
    this.teacherService.showTalleresHistorial(this.user.dni).subscribe(
      (historial) => {
        this.historialTalleres = historial;
        console.log('Historial de talleres:', historial);
      },
      (error) => {
        console.error('Error al obtener historial de talleres:', error);
      }
    );
  }

  cerrarHistorial(){
    this.historialTalleres = [];
  }

  // Método para verificar si un curso ya comenzó
  puedeEditarCurso(curso: any): boolean {
    if (!curso || !curso.fec_ini) return false;
    const fechaInicio = new Date(curso.fec_ini);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fechaInicio > hoy;
  }

  // Método para verificar si un taller ya comenzó
  puedeEditarTaller(taller: any): boolean {
    if (!taller || !taller.fecha) return false;
    const fechaTaller = new Date(taller.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fechaTaller > hoy;
  }

 
}
