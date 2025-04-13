import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Workshop, workshopList } from '../workshop-card/workshop.mock';

@Component({
  selector: 'app-workshop-info',
  templateUrl: './workshop-info.component.html',
  styleUrls: ['./workshop-info.component.scss']
})
export class WorkshopInfoComponent implements OnInit {
  workshop?: Workshop;
  workshopList: Workshop[] = workshopList
  loading: boolean = true;
  
  constructor(private _route: ActivatedRoute  ) { }
  
  ngOnInit(): void {

    setTimeout(() => {
      this._route.params.subscribe(params => {
      this.workshop = this.workshopList.find(workshop => workshop.id == params['id']);
      this.loading = false; 
    });
    }, 1500);
  }
}
