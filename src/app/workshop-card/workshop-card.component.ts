import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { WorkshopService } from '../services/workshop.service';
// import { Workshop, workshopList } from './workshop.mock';

@Component({
  selector: 'app-workshop-card',
  templateUrl: './workshop-card.component.html',
  styleUrls: ['./workshop-card.component.scss']
})
export class WorkshopCardComponent implements OnInit, OnChanges{

  constructor(private workshopService: WorkshopService) {}

  @Input() order:string = 'default';

  workshopList: any[] = []; // Objeto que contiene la lista de talleres
  color: string = ''; // Inicializa color de la dificultad
  
  ngOnInit(): void {
    // Cargar los talleres desde el service -> desde el backend
    this.workshopService.getWorkshops().subscribe(
      (data) => {
        this.workshopList = data;
        console.log('Talleres obtenidos:', data);
      },
      (error) => {
        console.error('Error al obtener los talleres:', error);
      }
    );
  }

  ngOnChanges(): void {
    // Ordena la lista según el valor de `order`
    if (this.order === 'az') {
      this.workshopList.sort((a, b) => a.nom_taller.localeCompare(b.nom_taller));
      console.log("Ordenado por A-Z")
    } else {
      // Orden por defecto (puedes personalizarlo)
      this.workshopList.sort((a,b) => a.id - b.id);
      console.log("Ordenado por ID")
    }
  }

  // Convierte la dificultad numerica a texto
  getDifficultyLabel(dificultad: number): string {
    switch (dificultad) {
      case 1:
        return 'Principiante';
      case 2:
        return 'Intermedio';
      case 3:
        return 'Avanzado';
      default:
        return 'Desconocido'; 
    }
  }
  // Devuelve un color dependiendo de la dificultad
  getDifficultyColor(dificultad: number): string {
    switch (dificultad) {
      case 1:
        return 'green';
      case 2:
        return 'orange';
      case 3:
        return 'red';
      default:
        return 'gray'; 
    }
  }

}
