import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CourseWorkshopService {
  private cursoTemporal: any;
  private talleresTemporales: any[] = [];

 
  constructor() { }

   setCurso(curso: any): void {
    this.cursoTemporal = curso;
  }

  addTaller(taller: any): void {
    this.talleresTemporales.push(taller);
  }

  getCurso(): any {
    return this.cursoTemporal;
  }

  getTalleres(): any[] {
    return this.talleresTemporales;
  }

  clearData(): void {
    this.cursoTemporal = null;
    this.talleresTemporales = [];
  }
}
