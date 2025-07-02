import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})
export class UserPanelComponent implements OnInit {

  user: any;
  cursos: any[] = [];
  talleres: any[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    const dniStr = sessionStorage.getItem('dni');
    if (!dniStr) {
      console.error('No hay DNI en localStorage');
      return;
    }
    const dni = Number(dniStr);
    if (!dni) {
      console.error('DNI inválido:', dniStr);
      return;
    }
    this.userService.getUserData(dni).subscribe(
      (data) => {
        this.user = data;
        console.log('Datos del usuario obtenidos:', data);
      },
      (error) => {
        console.error('Error al obtener los datos del usuario:', error);
      }
    );

    this.userService.getCursosByAlumno(dni).subscribe(
      (data) => { this.cursos = data; },
      (error) => { console.error('Error al obtener cursos del alumno:', error); }
    );

    this.userService.getTalleresByAlumno(dni).subscribe(
      (data) => { this.talleres = data; },
      (error) => { console.error('Error al obtener talleres del alumno:', error); }
    );
  }
}