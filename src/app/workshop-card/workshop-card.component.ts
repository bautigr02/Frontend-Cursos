import { Component, Input, OnChanges } from '@angular/core';
import { Workshop, workshopList } from './workshop.mock';

@Component({
  selector: 'app-workshop-card',
  templateUrl: './workshop-card.component.html',
  styleUrls: ['./workshop-card.component.scss']
})
export class WorkshopCardComponent implements OnChanges{

  @Input() order:string = 'default';
  workshopList: Workshop[] = workshopList; // Objeto que contiene la lista de talleres
  color: string = ''; // Inicializa color de la dificultad
  
  ngOnChanges(): void {
    // Ordena la lista según el valor de `order`
    if (this.order === 'az') {
      this.workshopList.sort((a, b) => a.title.localeCompare(b.title));
      console.log("Ordenado por A-Z")
    } else {
      // Orden por defecto (puedes personalizarlo)
      this.workshopList.sort((a,b) => a.id - b.id);
      console.log("Ordenado por ID")
    }
  }

  // Convierte la dificultad numerica a texto
  getDifficultyLabel(difficulty: number): string {
    switch (difficulty) {
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
  getDifficultyColor(difficulty: number): string {
    switch (difficulty) {
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
