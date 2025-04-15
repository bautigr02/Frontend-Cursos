import { Component } from '@angular/core';

@Component({
  selector: 'app-all-courses',
  templateUrl: './all-courses.component.html',
  styleUrls: ['./all-courses.component.scss']
})
export class AllCoursesComponent {
  order: string = 'default';

  changeOrder(newOrder:string):void { 
    this.order = newOrder;
    console.log("Orden cambiado desde padre a: " + this.order);
  }
}
