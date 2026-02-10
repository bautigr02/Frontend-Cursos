import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import {Curso, Taller} from '../interface/interface';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})
export class UserPanelComponent implements OnInit {

  user: any;
  cursos: Curso[] = [];
  talleres: Taller[] = [];
  isEditing = false;

  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (!this.user) {
      console.error('No hay usuario logueado');
      return;
    }
    // Valida de que el DNI sea válido
    const dni = this.user.dni;
    if (!dni) {
      console.error('DNI inválido:', this.user.dni);
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
        alert('Datos guardados con éxito.');
      },
      (error) => {
        console.error('Error al guardar los datos:', error);
        alert('Error al guardar los datos. Por favor, inténtelo de nuevo.');
      }
    );
  }

  cancelarEdicion() { // Restaura los datos originales si el usuario cancela
    this.isEditing = false;
    if (this.userBackup) {
      this.user = { ...this.userBackup };
      console.log('Edición cancelada, datos restaurados:', this.user);
      alert('Edición cancelada, los datos no fueron guardados.');
    }
  }

}