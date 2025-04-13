import { Component, OnInit } from '@angular/core';
import { Course, courseList } from '../course-card/course.mock';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.scss']
})
export class CourseInfoComponent implements OnInit{
  course?: Course;
  courseList: Course[] = courseList
  loading: boolean = true;

  constructor(private _route: ActivatedRoute  ) { }
  

  ngOnInit(): void {

    setTimeout(() => {
      this._route.params.subscribe(params => {
      this.course = this.courseList.find(course => course.id == params['id']);
      this.loading = false; 
    });
    }, 1500);
  }

}
