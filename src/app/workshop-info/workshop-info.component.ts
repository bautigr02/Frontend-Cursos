import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkshopService } from '../services/workshop.service';

@Component({
  selector: 'app-workshop-info',
  templateUrl: './workshop-info.component.html',
  styleUrls: ['./workshop-info.component.scss']
})
export class WorkshopInfoComponent implements OnInit {
  workshop: any;
  loading: boolean = true;
  showModal: boolean = false;
  
  constructor(private _route: ActivatedRoute, private workshopService: WorkshopService ) { }
  
  ngOnInit(): void {
    // Obtener el ID del taller desde la URL
    this._route.params.subscribe(params => {
      const workshopId = +params['id']; // Convierte el ID a número
      this.getWorkshopInfo(workshopId);
    });

/*  // Simulación de carga de datos
    setTimeout(() => {
      this._route.params.subscribe(params => {
      this.workshop = this.workshopList.find(workshop => workshop.id == params['id']);
      this.loading = false; 
    });
    }, 1500);
    */
  }
  getWorkshopInfo(id: number): void {
    this.workshopService.getWorkshopById(id).subscribe(
      (data) => {
        this.workshop = data;

        // Convierte tematica en array si es string
        if (typeof this.workshop.tematica === 'string') {
          this.workshop.tematica = this.workshop.tematica.split(',').map((item: string) => item.trim());
        }

        // Convierte requisitos en array si es string
        if (typeof this.workshop.requisitos === 'string') {
          this.workshop.requisitos = this.workshop.requisitos.split(',').map((item: string) => item.trim());
        }

        this.loading = false;
        console.log('Información del taller:', data);
      },
      (error) => {
        console.error('Error al obtener el taller:', error);
        this.loading = false;
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
