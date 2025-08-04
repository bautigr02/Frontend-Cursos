import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-learning',
  templateUrl: './user-learning.component.html',
  styleUrls: ['./user-learning.component.scss']
})
export class UserLearningComponent implements OnInit {
  cursos: any[] = [];
  ultimosTalleres: any[] = [];
  router: Router = new Router();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const dniStr = localStorage.getItem('dni') || sessionStorage.getItem('dni');
    if (!dniStr) {
      console.error('No hay DNI en storage');
      return;
    }
    const dni = Number(dniStr);

    // Obtener cursos del alumno
    this.userService.getCursosByAlumno(dni).subscribe(
      (data) => {
        this.cursos = data.map(curso => ({
          ...curso,
          estado: curso.estado !== null && curso.estado !== undefined ? Number(curso.estado) : null,
          nota_curso: curso.nota_curso !== null && curso.nota_curso !== undefined ? Number(curso.nota_curso) : null
        }));
      },
      (error) => { console.error('Error al obtener cursos:', error); }
    );

    // Obtener talleres del alumno
    this.userService.getUltimosTalleresByAlumno(dni).subscribe(
      (data) => { this.ultimosTalleres = data; },
      (error) => { console.error('Error al obtener talleres:', error); }
    );
  }
  
    puedeCancelar(fec_ini: string): boolean {
      // fec_ini debe ser un string tipo 'YYYY-MM-DD' o Date
      const fechaInicio = new Date(fec_ini);
      const hoy = new Date();
      return hoy < fechaInicio; // Puede cancelar hasta el día anterior al inicio

    }
    
cancelarInscripcion(curso: any){
  const dniStr = localStorage.getItem('dni') || sessionStorage.getItem('dni');
  if (!dniStr) {
    console.error('No hay DNI en storage');
    return;
  }
  const dni = Number(dniStr);

  if (confirm(`¿Seguro que deseas cancelar la inscripción a "${curso.nom_curso}"?`)) {
    this.userService.cancelarInscripcion(dni, curso.idcurso).subscribe(
      () => {
        curso.estado = 3;
        alert('Inscripción cancelada (marcada como finalizada).');
      },
      (error) => {
        alert('Error al cancelar la inscripción.');
        console.error('Error al cancelar inscripción:', error);
      }
    );
  }
}
/*
    verTalleres(curso: any) {
      // Navegar a talleres del curso que esta cursando - Hecho con routerLink temporalmente
    }
*/
    verCertificado(curso: any) {
      // Lógica para ver certificado
      alert('Ver certificado de ' + curso.nom_curso);
    }
}