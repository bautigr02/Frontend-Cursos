import { Component, Input, OnChanges, OnInit } from '@angular/core';
//import { Course, courseList } from './course.mock';
import { CourseService } from '../services/course.service';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent implements OnInit, OnChanges{

  constructor(private courseService: CourseService) {}
  
  @Input() order:string = 'default';

  courseList: any[] = [];

  ngOnInit(): void {
    // Cargar los cursos desde el service -> desde el backend
    this.courseService.getCourses().subscribe(
      (data) => {
        this.courseList = data;
        console.log('Cursos obtenidos:', data);
      },
      (error) => {
        console.error('Error al obtener los cursos:', error);
      }
    );
  }

  ngOnChanges(): void {
    // Ordena la lista según el valor de `order`
    if (this.order === 'az') {
      this.courseList.sort((a, b) => a.nom_curso.localeCompare(b.nom_curso));
      console.log("Ordenado por A-Z")
    } else {
      // Orden por defecto (puedes personalizarlo)
      this.courseList.sort((a,b) => a.idcurso - b.idcurso);
      console.log("Ordenado por ID")
    }
  }

}
