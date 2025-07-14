import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-learning',
  templateUrl: './user-learning.component.html',
  styleUrls: ['./user-learning.component.scss']
})
export class UserLearningComponent implements OnInit {
  cursos: any[] = [];
  ultimosTalleres: any[] = [];

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
      (data) => { this.cursos = data; },
      (error) => { console.error('Error al obtener cursos:', error); }
    );

    // Obtener últimos talleres del alumno
    this.userService.getUltimosTalleresByAlumno(dni).subscribe(
      (data) => { this.ultimosTalleres = data; },
      (error) => { console.error('Error al obtener talleres:', error); }
    );
  }
    puedeCancelar(fec_ini: string): boolean {
      // fec_ini debe ser un string tipo 'YYYY-MM-DD' o Date
      const fechaInicio = new Date(fec_ini);
      const hoy = new Date();
      // Puede cancelar hasta el día anterior al inicio
      return hoy < fechaInicio;
    }
    
    cancelarInscripcion(curso: any) {
      // Lógica para cancelar inscripción
      alert('Inscripción cancelada para ' + curso.nom_curso);
    }
    
    verTalleres(curso: any) {
      // Lógica para ver talleres
      alert('Ver talleres de ' + curso.nom_curso);
    }
    
    verCertificado(curso: any) {
      // Lógica para ver certificado
      alert('Ver certificado de ' + curso.nom_curso);
    }
}