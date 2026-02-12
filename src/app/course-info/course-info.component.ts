import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { WorkshopService } from '../services/workshop.service';
import { UserService } from '../services/user.service';
import { Location } from '@angular/common';
import {Curso, Taller} from '../interface/interface';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.scss']
})
export class CourseInfoComponent implements OnInit{
  course: Curso | any;
  workshops: Taller[] = [];
  loading: boolean = true;
  showModal: boolean = false;
  showCancellationModal: boolean = false;
  yaInscripto: boolean = false;
  user: any;
  cursosInscriptos: Curso[] = [];
  fechaActual = new Date().toLocaleDateString('es-AR');
  userIsTeacher: boolean = false;


  constructor(
    private _route: ActivatedRoute, 
    private courseService: CourseService, 
    private workshopService: WorkshopService, 
    private userService: UserService,
    private authService: AuthService,
    private location: Location
  ) { }
  
  ngOnInit(): void {
    this.user = this.authService.getUser();
    // Verificar si el usuario es docente
    this.userIsTeacher = this.user?.rol === 'docente';
    // Obtener el ID del curso desde la URL
    this._route.params.subscribe(params => {
      const courseId = +params['id']; // Convierte el ID a número
      const dni = this.user?.dni || null;
      this.getCourseInfo(courseId);
      this.getWorkshops(courseId);

      if(this.user?.dni) {
        this.userService.getCursosByAlumno(this.user.dni).subscribe(
          (cursos) => {
            this.cursosInscriptos = cursos;
            const inscripto = cursos.find(c => Number(c.idcurso) === courseId && Number(c.estado_inscripcion) === 1);
            this.yaInscripto = !!inscripto;
         });
        }
     });
  }

    getCourseInfo(id: number): void {
      this.courseService.getCourseById(id).subscribe(
        (data) => {
          this.course = data;
          this.loading = false;
          console.log('Información del curso:', data);
        },
        (error) => {
          console.error('Error al obtener el curso:', error);
          this.loading = false;
        }
      );
    }
    getWorkshops(idcurso: number): void {
      this.workshopService.getWorkshopsByCurso(idcurso).subscribe(
        (data) => {
          this.workshops = data;
        },
        (error) => {
          this.workshops = [];
        }
      );
    }

    // Modal de inscripción
    openModal(){
      this.showModal = true;
    }

    confirmModal(){
    if (!this.user?.dni || !this.course?.idcurso) {
      alert('Debe iniciar sesión para inscribirse.');
      this.showModal = false;
      window.location.href = '/login'; // Redirigir al login si no hay usuario
      return;
    } 
  
    this.userService.inscribirEnCurso(this.user.dni, this.course.idcurso).subscribe(
      () => {
        this.yaInscripto = true;
        this.showModal = false;
        alert('¡Inscripción exitosa!');
      },
      (error) => {
        alert(error.error?.error || 'Error al inscribirse');
        this.showModal = false;
      }
    );
  }

  cancelModal(){
    this.showModal = false;
  }
  
  // Modal de cancelación  
  openCancellationModal() {
    this.showCancellationModal = true;
  }

  confirmCancellationModal() {  
  if (!this.user?.dni || !this.course?.idcurso) {
    alert('Error: No se pudo obtener la información necesaria.');
    this.showCancellationModal = false;
    return;
  }

  this.userService.cancelarInscripcion(this.user.dni, this.course.idcurso).subscribe(
    () => {
      this.yaInscripto = false;
      this.showCancellationModal = false;
      alert('Inscripción cancelada correctamente.');
    },
    (error) => {
      alert(error.error?.error || 'Error al cancelar la inscripción.');
      this.showCancellationModal = false;
    }
  );
}

  closeCancellationModal() {
    this.showCancellationModal = false;
  }

  goBack(): void {
  this.location.back();
  }

  // El metodo debe formatear las fechas para que coincidan los formatos y no haya problemas al comparar
  // fechaActual es del tipo 'dd/MM/yyyy' y course.fec_ini es del tipo 'yyyy-MM-ddTHH:mm:ss' Acomodar eso
  yaComenzo(): boolean {
    if (!this.course) {
      return false;
    }
    const fechaActual = new Date();
    const fechaCurso = new Date(this.course.fec_ini);
    return (fechaCurso < fechaActual);
  }
}