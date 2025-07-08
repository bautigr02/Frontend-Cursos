import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { WorkshopService } from '../services/workshop.service';

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

  constructor(
    private _route: ActivatedRoute, 
    private courseService: CourseService, 
    private workshopService: WorkshopService
  ) { }
  
  ngOnInit(): void {
     // Obtener el ID del curso desde la URL
    this._route.params.subscribe(params => {
      const courseId = +params['id']; // Convierte el ID a número
      this.getCourseInfo(courseId);
      this.getWorkshops(courseId);

    });
/*   // Simulación de carga de datos
    setTimeout(() => {
      this._route.params.subscribe(params => {
      this.course = this.courseList.find(course => course.idcurso == params['id']);
      this.loading = false; 
    });
    }, 1500);
*/

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

    

    // Métodos para manejar el modal
    openModal(){
      this.showModal = true;
    }
    confirmModal(){
      this.showModal = false;
    }
    cancelModal(){
      this.showModal = false;
    }
  }
