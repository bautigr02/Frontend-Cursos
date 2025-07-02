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
  isEditing = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    // Obtener el DNI del usuario desde sessionStorage
    const dniStr = sessionStorage.getItem('dni');
    if (!dniStr) {
      console.error('No hay DNI en localStorage');
      return;
    }
    // Valida de que el DNI sea válido
    const dni = Number(dniStr);
    if (!dni) {
      console.error('DNI inválido:', dniStr);
      return;
    }

    // Obtener los datos del usuario
    this.userService.getUserData(dni).subscribe(
      (data) => {
        this.user = data;
        console.log('Datos del usuario obtenidos:', data);
      },
      (error) => {
        console.error('Error al obtener los datos del usuario:', error);
      }
    );

    // Obtener los cursos del usuario
    this.userService.getCursosByAlumno(dni).subscribe(
      (data) => { this.cursos = data; },
      (error) => { console.error('Error al obtener cursos del alumno:', error); }
    );

    // Obtener los talleres del usuario
    this.userService.getTalleresByAlumno(dni).subscribe(
      (data) => { this.talleres = data; },
      (error) => { console.error('Error al obtener talleres del alumno:', error); }
    );
  }

  // Métodos para editar y guardar los datos del usuario
  userBackup: any; // Backup de los datos del usuario antes de editar
  editarDatos() {
    this.isEditing = true;
    this.userBackup = { ...this.user };

  }

  guardarDatos() {
    console.log('Intentando guardar...');
    this.userService.updateAlumno(this.user).subscribe(
      (data) => {
        this.isEditing = false;
        console.log('Datos del usuario actualizados:', data);
      },
      (error) => {
        console.error('Error al guardar los datos:', error);
      }
    );
  }

  cancelarEdicion() { // Restaura los datos originales si el usuario cancela
    this.isEditing = false;
    if (this.userBackup) {
      this.user = { ...this.userBackup };
      console.log('Edición cancelada, datos restaurados:', this.user);
    }
  }

}