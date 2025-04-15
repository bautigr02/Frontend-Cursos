import { Component } from '@angular/core';

@Component({
  selector: 'app-all-workshops',
  templateUrl: './all-workshops.component.html',
  styleUrls: ['./all-workshops.component.scss']
})
export class AllWorkshopsComponent {

  order: string = 'default';

  changeOrder(newOrder:string):void { 
    this.order = newOrder;
    console.log("Orden cambiado desde padre a: " + this.order);
  }
}
