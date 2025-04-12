export const workshopList:Workshop[] = [
  {id: 1, title: 'Angular', topics: ['Typescript','Components', 'Routing'], tools: ['VS Code','Angular CLI', 'Node.js'], date: '2023-08-21', startHour: '09:00', requirements: ['Basic HTML/CSS knowledge'], difficulty: 3, imageUrl: 'https://angular.io/assets/images/logos/angular/angular.png'},
  {id: 2, title: 'Javascript', topics: ['Introducción a Javascript','Variables y tipos de datos','Operadores','Condicionales','Ciclos'], tools: ['VS Code', 'Node.js'], date: '2023-09-21', startHour: '09:00', requirements: ['Basic HTML/CSS knowledge'], difficulty: 2, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/800px-Unofficial_JavaScript_logo_2.svg.png'},
  {id: 3, title: 'SQL', topics: ['Queries', 'Joins', 'Permisos'], tools: ['SQL Server', 'Woekbench'], date: '2023-09-15', startHour: '09:00', requirements: ['Excel', 'Diagrama Entidad-Relacion'], difficulty: 1, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Sql_data_base_with_logo.svg/1280px-Sql_data_base_with_logo.svg.png'},
  {id: 4, title: 'Ingles 1', topics: ['Verb to be', 'Vocabulary'], tools: [], date: '2023-10-01', startHour: '09:00', requirements: [], difficulty: 1, imageUrl: 'https://play-lh.googleusercontent.com/CiQRyDFN5z_XajKdf-idiJ-Kt_abvsgamIcmzCkoviLbQvAmeTIq0RFKIEyPVhn2XRY=w240-h480-rw'},
  {id: 5, title: 'Ingles 2', topics: ['Presente y Pasado', 'Vocabulary'], tools: [], date: '2023-10-01', startHour: '09:00', requirements: ['Ingles 1'], difficulty: 2, imageUrl: 'https://play-lh.googleusercontent.com/CiQRyDFN5z_XajKdf-idiJ-Kt_abvsgamIcmzCkoviLbQvAmeTIq0RFKIEyPVhn2XRY=w240-h480-rw'},
  {id: 6, title: 'Ingles 3', topics: ['Futuro', 'Vocabulary'], tools: [], date: '2023-10-01', startHour: '09:00', requirements: ['Ingles 2'], difficulty: 3, imageUrl: 'https://play-lh.googleusercontent.com/CiQRyDFN5z_XajKdf-idiJ-Kt_abvsgamIcmzCkoviLbQvAmeTIq0RFKIEyPVhn2XRY=w240-h480-rw'},
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