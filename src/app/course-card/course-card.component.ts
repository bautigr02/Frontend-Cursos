import { Component } from '@angular/core';
import { courseList } from './course.mock';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent {

  courseList = courseList;

}
