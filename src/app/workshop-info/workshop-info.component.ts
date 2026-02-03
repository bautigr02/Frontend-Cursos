import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkshopService } from '../services/workshop.service';
import { UserService } from '../services/user.service';
import { forkJoin, of } from 'rxjs';
import { Location } from '@angular/common';
import { Taller } from '../interface/interface';

@Component({
  selector: 'app-workshop-info',
  templateUrl: './workshop-info.component.html',
  styleUrls: ['./workshop-info.component.scss']
})
export class WorkshopInfoComponent implements OnInit {
  workshop: Taller | any;
  loading: boolean = true;
  showModal: boolean = false;
  showCancellationModal: boolean = false;
  yaInscripto: boolean = false;
  mensajeError: string = '';
  user: any;
  talleresInscriptos: Taller[] = [];
  fechaActual: Date = new Date();
  userIsTeacher: boolean = false;

  constructor(
    private _route: ActivatedRoute, 
    private workshopService: WorkshopService,
    private userService: UserService,
    private location: Location
  ) { }
  
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    
    // Verificar si el usuario es docente
    this.userIsTeacher = this.user?.rol === 'docente';
    
    this._route.params.subscribe(params => {
      const workshopId = +params['id'];
      const dni = this.user?.dni || null;

      // Obtener simultáneamente: info del taller y talleres del alumno
      const workshopObs = this.workshopService.getWorkshopById(workshopId);
      const talleresAlumnoObs = dni ? this.userService.getTalleresByAlumno(dni) : of([]);

      forkJoin([workshopObs, talleresAlumnoObs]).subscribe(
        ([workshopData, talleresAlumno]) => {
          this.workshop = workshopData;
          this.talleresInscriptos = talleresAlumno;

          // Convertir fecha a Date
          if (typeof this.workshop.fecha === 'string') {
            this.workshop.fecha = new Date(this.workshop.fecha);
          }

          // Convertir tematica y requisitos a arrays
          if (typeof this.workshop.tematica === 'string') {
            this.workshop.tematica = this.workshop.tematica.split(',').map((item: string) => item.trim());
          }
          if (typeof this.workshop.requisitos === 'string') {
            this.workshop.requisitos = this.workshop.requisitos.split(',').map((item: string) => item.trim());
          }

          // Buscar inscripción del usuario a este taller
          const inscripcion = talleresAlumno.find((t: Taller) => t.idtaller === this.workshop.idtaller);
          
          if (inscripcion) {
            this.yaInscripto = inscripcion.estado === 1 || inscripcion.estado === 2;
            this.workshop.estado_inscripcion = inscripcion.estado;
            
            // Normalizar nota
            const nota = inscripcion.nota_taller;
            if (nota === null || nota === undefined || nota === '') {
              this.workshop.nota_taller = null;
            } else {
              const n = Number(nota);
              this.workshop.nota_taller = Number.isFinite(n) ? n : null;
            }
          } else {
            this.yaInscripto = false;
            this.workshop.estado_inscripcion = null;
            this.workshop.nota_taller = null;
          }

          this.loading = false;
          console.log('Workshop con nota:', this.workshop);
        },
        (error) => {
          console.error('Error al obtener datos:', error);
          this.loading = false;
        }
      );
    });
  }

  // Modal de inscripción
  openModal() {
      this.showModal = true;
  }

  confirmModal() {
    if (!this.user.dni) {
      alert('Debe iniciar sesión para inscribirse.');
      window.location.href = '/login'; // Redirigir al login si no hay usuario
      this.showModal = false;
      return;
    }

    this.userService.inscribirEnTaller(this.user.dni, this.workshop.idtaller).subscribe(
      () => {
        this.yaInscripto = true;
        this.showModal = false;
        alert('¡Inscripción al taller exitosa!');
      },
      (error) => {
        alert(error.error?.error || 'Error al inscribirse al taller');
        this.showModal = false;
      }
    );
  }

  cancelModal() {
    this.showModal = false;
  }

  // Modal de cancelación  
  openCancellationModal() {
    this.showCancellationModal = true;
  }

  confirmCancellationModal() {
    this.showCancellationModal = false;
    this.userService.cancelarInscripcionTaller(this.user.dni, this.workshop.idtaller).subscribe(
      () => {
        this.yaInscripto = false;
        this.showCancellationModal = false;
        alert('Inscripción cancelada correctamente.');
      },
      (error) => {
        alert('Error al cancelar la inscripción.');
        this.showCancellationModal = false;
      }
    );
  }

  closeCancellationModal() {
    this.showCancellationModal = false;
  }
 
  goBack(): void {
  this.location.back();
}
}