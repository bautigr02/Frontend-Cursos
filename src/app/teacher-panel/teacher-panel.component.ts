import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TeacherService } from '../services/teacher.service';
import { CourseService } from '../services/course.service';
import { WorkshopService } from '../services/workshop.service';
import {Curso, Taller, Docente, Alumno, InscripcionTaller} from '../interface/interface';

interface CursoConTalleres extends Curso {
  talleres?: Taller[];
}

@Component({
  selector: 'app-teacher-panel',
  templateUrl: './teacher-panel.component.html',
  styleUrls: ['./teacher-panel.component.scss']
})
export class TeacherPanelComponent implements OnInit {
  cursos: CursoConTalleres[] = [];
  user: Docente | null = null;
  talleres: Taller[] = [];
  curso: Curso | null = null;
  cursoSeleccionado: CursoConTalleres | null = null;
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
  alumnosInscritosTaller: any[] = [];
  tallerParaAlumnos: any = null;
  totalSinCalificar: number = 0;

  isEditing = false;
  isEditingCurso = false;
  isEditingTaller = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private teacherService: TeacherService,
    private CourseService: CourseService,
    private workshopService: WorkshopService
  ) {}


  ngOnInit(): void {
    this.user = this.authService.getUser() as Docente;

    if (!this.user || (this.user as any).rol !== 'docente') {
      console.error('Usuario no válido o no es docente');
      return;
    }

    if (!this.user.dni) {
      console.error('DNI no encontrado en usuario');
      return;
    }

    // Obtener cursos y talleres asociados al docente
    this.teacherService.getCoursesByDocenteDni(this.user.dni as any)
      .subscribe({
        next: (cursos: Curso[]) => {
          //Cargamos aquellos cursos no hayan finalizado(fecha limite + 10 dias)
          this.cursos = cursos.filter((curso) => {
            if (!curso.fec_fin || curso.estado === 4) return false;
          
          
            const fechaLimite = new Date(curso.fec_fin); 
            fechaLimite.setDate(fechaLimite.getDate() + 10);
            return fechaLimite >= this.fechaActual;
          });
          
          this.cursos.forEach((curso,index)=>{
            this.teacherService.getTalleresByCursoId(curso.idcurso as number).subscribe({
              next:(talleres: Taller[]) =>{
                const talleresFiltrados = talleres.filter((taller) => {
                  if (!taller.fecha) return false;

                  const fechaLimiteTaller = new Date(taller.fecha);
                  fechaLimiteTaller.setDate(fechaLimiteTaller.getDate() + 10);
                  return fechaLimiteTaller >= this.fechaActual;
                });
                this.cursos[index].talleres = talleresFiltrados;
                console.log("Talleres para curso ", curso.idcurso, talleresFiltrados);
                this.alertaAlumnosSinCalificar(talleresFiltrados);
              },
            error: (err) =>{
              console.error ("error al obtener talleres", err);
            }
          });
        });
        setTimeout(() => {
          if (this.totalSinCalificar > 0) {
            alert(`Tiene ${this.totalSinCalificar} alumnos sin calificar en talleres finalizados.`);
            this.totalSinCalificar = 0;
          } else if (this.totalSinCalificar === 0) {
            console.log('No hay alumnos sin calificar en talleres finalizados.');
          }
        }, 1800);
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
    fechaLimite.setDate(fechaLimite.getDate() + 10);

    hoy.setHours(0, 0, 0, 0);
    fechaLimite.setHours(23, 59, 59, 999);

    return fechaLimite >= hoy ;
  }

  //Alerta/notificacion de que hay alumnos sin calificar en un taller finalizado
  alertaAlumnosSinCalificar(talleres: Taller[]) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const talleresPasados = talleres.filter(taller =>
    {
      const fechaTaller = new Date(taller.fecha); 
      return fechaTaller < hoy;
    });
      if (talleresPasados.length === 0) return;

      talleresPasados.forEach(taller => {
        this.teacherService.getAlumnosByTallerId(taller.idtaller).subscribe({
          next: (alumnos) => {
            const sinNota = alumnos.filter((a: any) => a.nota_taller === null || a.nota_taller === undefined);
            this.totalSinCalificar += sinNota.length;
          }
        });
      });
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
    if (!this.cursoSeleccionado) return;

    console.log('Intentando guardar curso modificado...');
    const cursoAEnviar = {...this.cursoSeleccionado };

    delete cursoAEnviar.talleres;
    // Formatear fecha para SQL
  // Formatear fecha para SQL
  if (cursoAEnviar.fec_ini) {
    cursoAEnviar.fec_ini = (cursoAEnviar.fec_ini as string).slice(0, 10);
  }
  if (cursoAEnviar.fec_fin) {
    cursoAEnviar.fec_fin = (cursoAEnviar.fec_fin as string).slice(0, 10);
  }
    this.CourseService.patchCurso(cursoAEnviar.idcurso as number, cursoAEnviar).subscribe(  
      (data) => {
        this.isEditingCurso = false;
        if (this.cursoBackup && this.cursoSeleccionado) {
          this.cursoSeleccionado.talleres = this.cursoBackup.talleres;
        }
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

  //Cancela el curso cambiando el estado a 4.
  cancelarCurso(curso: any) { 
    const fecIni = new Date(curso.fec_ini);
    const fechaActual = new Date();

    if (curso.estado !== 1 || fechaActual >= fecIni) {
      alert('El curso no puede ser cancelado. Solo los cursos activos que no hayan iniciado pueden ser cancelados.');
      return;
    }

    if (curso.estado === 1 && fechaActual < fecIni) {
      if (confirm(`¿Estás seguro de que deseas cancelar el curso "${curso.nom_curso}"? Esta acción no se puede deshacer.`)) {
        this.CourseService.desactivarCurso(curso.idcurso).subscribe({
          next: () => {
            curso.estado = 4; // Actualiza el estado del curso a "cancelado" en la interfaz
            console.log(`Curso con ID ${curso.idcurso} cancelado.`);
            this.ngOnInit();
          },
          error: (error) => {
            console.error('Error al cancelar el curso:', error);
            alert('Ocurrió un error al cancelar el curso.');
          }
        });
      }
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
    console.log('Taller seleccionado para edición:', this.tallerSeleccionado);
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
  verAlumnosTaller(taller: any, curso: any) {
    this.alumnosInscritosTaller = [];
    this.tallerParaAlumnos = taller ;
    this.cursoSeleccionado = curso;

    this.teacherService.getAlumnosByTallerId(taller.idtaller).subscribe(
      (alumnos: any[]) => {
        this.alumnosInscritosTaller = alumnos;

        if (this.alumnosInscritosTaller.length > 0) {
          console.log('Alumnos inscritos en el taller:', this.alumnosInscritosTaller);
        }
      },
      (error) => {
        console.error('Error al obtener alumnos inscritos:', error);
      }
    );
  }

  
  cerrarAlumnosInscritosTaller(){
    this.alumnosInscritosTaller = [];
    this.tallerParaAlumnos = null;
  }


  puedeAgregarNotaFinal(curso: any): boolean {
  if (!curso?.fec_fin) return false;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fechaFin = new Date(curso.fec_fin + 'T00:00:00');
  const fechaLimite = new Date(fechaFin);

  fechaLimite.setDate(fechaLimite.getDate() + 10); // sumar 10 días

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
  insertarNota(alumno: any, taller: any, curso: any) {
    this.alumnoSeleccionado = alumno;
    this.tallerSeleccionado = taller;
    this.cursoSeleccionado = curso;
    this.isInsertarNota = true;
    this.nuevaNota = null;
  }

  // Inserta la nota del alumno en el taller seleccionado
  agregarNota(alumno: any) {
  this.teacherService.insertNotaAlumno(this.tallerSeleccionado.idtaller, alumno.dni, this.nuevaNota as number
  ).subscribe(
    (response) => {
      console.log('Nota agregada:', response);
      this.isInsertarNota = false;

      this.agregarNotaFinalAutomatica(alumno,this.cursoSeleccionado);
      this.verAlumnosTaller(this.tallerSeleccionado, this.cursoSeleccionado);
    },
    (error) => {
      console.error('Error al agregar nota:', error);
    }
  );
}

  agregarNotaFinalAutomatica(alumno: any, curso: any): void {
    const totalTalleresCurso = curso.talleres ? curso.talleres.length : 0;
    if (totalTalleresCurso === 0) return;

    this.teacherService.getNotasByAlumnoInCurso(alumno.dni, curso.idcurso).subscribe({
      next: (notas: any[]) => {
        const sumaNotas = notas.reduce((sum: number, n: any) => sum + (n.nota_taller || 0), 0);

        const promedio = sumaNotas / totalTalleresCurso;

        this.teacherService.insertNotaCursoAlumno(curso.idcurso, alumno.dni, promedio).subscribe({
          next: () => {
            alumno.notaFinal = promedio;
            console.log(`Sincronización exitosa: Nota final ${promedio}`);
            
            if (notas.length < totalTalleresCurso) {
              alert(`Nota actualizada, pero atención: faltan calificar ${totalTalleresCurso - notas.length} talleres para este alumno.`);
            }
          }
        });
      }
    });
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
  // 10 días en milisegundos
  const diezDias = 10 * 24 * 60 * 60 * 1000;
  // Mostrar si hoy es igual a fecha fin o está dentro de los 10 días posteriores
  return (
    hoy.toDateString() === fechaFin.toDateString() ||
    (hoy > fechaFin && diff <= diezDias)
  );
}

//Colocar nota final de un alumno en curso de forma MANUAL x si el docente quisiera editar la nota
  insertarNotaFinalAlumno( dni: number, nuevaNota: any, idcurso: number) {
    console.log('Insertando nota final:', { dni, nuevaNota, idcurso });
    this.teacherService.insertNotaCursoAlumno(idcurso, dni, nuevaNota).subscribe(
      (response) => {
        console.log('Nota final insertada:', response);
        this.insertarNotaFinal = false;
        this.alumnoSeleccionado.notaFinal = nuevaNota;
        this.nuevaNota = null;
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

  //Historial de talleres x docente

  verHistorial(){
    if (!this.user) return;
    this.teacherService.showTalleresHistorial(this.user.dni.toString()).subscribe(
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
