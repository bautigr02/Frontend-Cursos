import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkshopService } from '../services/workshop.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-workshop-info',
  templateUrl: './workshop-info.component.html',
  styleUrls: ['./workshop-info.component.scss']
})
export class WorkshopInfoComponent implements OnInit {
  workshop: any;
  loading: boolean = true;
  showModal: boolean = false;
  yaInscripto: boolean = false;
  puedeInscribirse: boolean = false;
  mensajeError: string = '';
  user: any;
  
  constructor(
    private _route: ActivatedRoute, 
    private workshopService: WorkshopService,
    private userService: UserService
  ) { }
  
  ngOnInit(): void {
    // Obtener usuario logueado
    this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    
    this._route.params.subscribe(params => {
      const workshopId = +params['id'];
      this.getWorkshopInfo(workshopId);
    });
  }

  getWorkshopInfo(id: number): void {
    this.workshopService.getWorkshopById(id).subscribe(
      (data) => {
        this.workshop = data;

        // Convertir tematica y requisitos a arrays
        if (typeof this.workshop.tematica === 'string') {
          this.workshop.tematica = this.workshop.tematica.split(',').map((item: string) => item.trim());
        }
        if (typeof this.workshop.requisitos === 'string') {
          this.workshop.requisitos = this.workshop.requisitos.split(',').map((item: string) => item.trim());
        }

        // Verificar si puede inscribirse
        this.verificarInscripcion();
        
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener el taller:', error);
        this.loading = false;
      }
    );
  }

verificarInscripcion(): void {
  if (!this.user.dni) {
    this.puedeInscribirse = false;
    this.mensajeError = 'Debes estar logueado';
    return;
  }

  // Verificar fecha del taller
  const fechaTaller = new Date(this.workshop.fecha);
  const fechaActual = new Date();
  
  if (fechaActual >= fechaTaller) {
    this.puedeInscribirse = false;
    this.mensajeError = 'El taller ya pasó';
    return;
  }

  // Verificar si ya está inscripto (opcional: consulta al backend)
  this.verificarInscripcionPrevia();
}

verificarInscripcionPrevia(): void {
  // Obtener cursos del usuario para verificar si está inscripto al curso del taller
  this.userService.getCursosByAlumno(this.user.dni).subscribe(
    (cursos) => {
      const cursoDelTaller = cursos.find(curso => 
        curso.idcurso === this.workshop.idcurso && 
        (curso.estado === 1 || curso.estado === 2)
      );
      
      if (!cursoDelTaller) {
        this.puedeInscribirse = false;
        this.mensajeError = 'No inscripto al curso';
        return;
      }
      
      // Verificar talleres del usuario para ver si ya está inscripto
      this.userService.getTalleresByAlumno(this.user.dni).subscribe(
        (talleres) => {
          const yaInscriptoEnTaller = talleres.some(t => t.idtaller === this.workshop.idtaller);
          
          if (yaInscriptoEnTaller) {
            this.yaInscripto = true;
            this.puedeInscribirse = false;
          } else {
            this.puedeInscribirse = true;
          }
        },
        (error) => {
          console.error('Error al obtener talleres:', error);
          this.puedeInscribirse = true; // En caso de error, permitir intentar
        }
      );
    },
    (error) => {
      console.error('Error al obtener cursos:', error);
      this.puedeInscribirse = false;
      this.mensajeError = 'Error al verificar inscripción al curso';
    }
  );
}
  
  openModal() {
    if (this.puedeInscribirse) {
      this.showModal = true;
    }
  }

  confirmModal() {
    if (!this.user.dni) {
      alert('Debes estar logueado para inscribirte');
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
}