import { Component } from '@angular/core';
import { workshopList } from './workshop.mock';

@Component({
  selector: 'app-workshop-card',
  templateUrl: './workshop-card.component.html',
  styleUrls: ['./workshop-card.component.scss']
})
export class WorkshopCardComponent {
  workshopList = workshopList;

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

}
