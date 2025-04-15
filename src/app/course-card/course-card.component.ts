import { Component, Input, OnChanges } from '@angular/core';
import { Course, courseList } from './course.mock';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent implements OnChanges{

  @Input() order:string = 'default';
  courseList: Course[] = courseList;

  ngOnChanges(): void {
    // Ordena la lista según el valor de `order`
    if (this.order === 'az') {
      this.courseList.sort((a, b) => a.title.localeCompare(b.title));
      console.log("Ordenado por A-Z")
    } else {
      // Orden por defecto (puedes personalizarlo)
      this.courseList.sort((a,b) => a.id - b.id);
      console.log("Ordenado por ID")
    }
  }

}
