import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { WorkshopService } from '../services/workshop.service';
import { UserService } from '../services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.scss']
})
export class CourseInfoComponent implements OnInit{
  course: any;
  workshops: any[] = [];
  loading: boolean = true;
  showModal: boolean = false;
  showCancellationModal: boolean = false;
  yaInscripto: boolean = false;
  user: any;
  cursosInscriptos: any[] = [];
  fechaActual = new Date().toLocaleDateString('es-AR');


  constructor(
    private _route: ActivatedRoute, 
    private courseService: CourseService, 
    private workshopService: WorkshopService, 
    private userService: UserService,
    private location: Location
  ) { }
  
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');

    // Obtener el ID del curso desde la URL
    this._route.params.subscribe(params => {
      const courseId = +params['id']; // Convierte el ID a número
      const dni = user?.dni || null;
      this.getCourseInfo(courseId);
      this.getWorkshops(courseId);
    });
    /* Simulación de carga de datos
    setTimeout(() => {
      this._route.params.subscribe(params => {
      this.course = this.courseList.find(course => course.idcurso == params['id']);
      this.loading = false; 
    });
    }, 1500);
    */
    if (user && user.dni) {
      this.userService.getCursosByAlumno(user.dni).subscribe(
        (cursos) => {
          this.cursosInscriptos = cursos;
          // Si el curso actual está en la lista, ya está inscripto
          this.yaInscripto = !!cursos.find(c => c.idcurso === this.course.idcurso && c.estado !== 3);
        }
      );
    }
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

    // // Método para cancelar la inscripción
    // cancelarInscripcion(): void {
    //   const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    //   if (!user.dni || !this.course?.idcurso) {
    //     alert('Debe iniciar sesión para cancelar la inscripción en el curso.');
    //     return;
    //   }

    //   this.userService.cancelarInscripcion(user.dni, this.course.idcurso).subscribe(
    //     () => {
    //       this.yaInscripto = false;
    //       alert('¡Inscripción cancelada con éxito!');
    //     },
    //     (error) => {
    //       alert(error.error?.error || 'Error al cancelar la inscripción');
    //     }
    //   );
    // }

    // Modal de inscripción
    openModal(){
      this.showModal = true;
    }

    confirmModal(){
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    if (!user.dni || !this.course?.idcurso) {
      alert('Debe iniciar sesión para inscribirse.');
      this.showModal = false;
      window.location.href = '/login'; // Redirigir al login si no hay usuario
      return;
    } 
  
    this.userService.inscribirEnCurso(user.dni, this.course.idcurso).subscribe(
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
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  
  if (!user.dni || !this.course?.idcurso) {
    alert('Error: No se pudo obtener la información necesaria.');
    this.showCancellationModal = false;
    return;
  }

  this.userService.cancelarInscripcion(user.dni, this.course.idcurso).subscribe(
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
}