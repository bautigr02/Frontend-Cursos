export const workshopList:Workshop[] = [
  {id: 1, title: 'Angular', topics: ['Typescript','Components', 'Routing'], tools: ['VS Code','Angular CLI', 'Node.js'], date: '2023-10-01', startHour: '09:00', requirements: ['Basic HTML/CSS knowledge'], difficulty: 3, imageUrl: 'https://angular.io/assets/images/logos/angular/angular.png'},
  {id: 2, title: 'Javascript', topics: ['Introducción a Javascript','Variables y tipos de datos','Operadores','Condicionales','Ciclos'], tools: ['VS Code', 'Node.js'], date: '2023-10-01', startHour: '09:00', requirements: ['Basic HTML/CSS knowledge'], difficulty: 2, imageUrl: 'https://angular.io/assets/images/logos/angular/angular.png'},
  {id: 3, title: 'SQL', topics: ['Queries', 'Joins', 'Permisos'], tools: ['SQL Server', 'Woekbench'], date: '2023-10-01', startHour: '09:00', requirements: ['Excel', 'Diagrama Entidad-Relacion'], difficulty: 1, imageUrl: 'https://angular.io/assets/images/logos/angular/angular.png'},
  {id: 4, title: 'Ingles 1', topics: ['Verb to be', 'Vocabulary'], tools: [], date: '2023-10-01', startHour: '09:00', requirements: [], difficulty: 1, imageUrl: 'https://angular.io/assets/images/logos/angular/angular.png'},
  {id: 5, title: 'Ingles 2', topics: ['Presente y Pasado', 'Vocabulary'], tools: [], date: '2023-10-01', startHour: '09:00', requirements: [], difficulty: 1, imageUrl: 'https://angular.io/assets/images/logos/angular/angular.png'},
  {id: 6, title: 'Ingles 3', topics: ['Futuro', 'Vocabulary'], tools: [], date: '2023-10-01', startHour: '09:00', requirements: [], difficulty: 1, imageUrl: 'https://angular.io/assets/images/logos/angular/angular.png'},
]

export interface Workshop {
    id: number;
    title: string;
    topics: string[];
    tools: string[];
    date: string;
    startHour: string;
    requirements : string[];
    difficulty: number;
    imageUrl: string;
}