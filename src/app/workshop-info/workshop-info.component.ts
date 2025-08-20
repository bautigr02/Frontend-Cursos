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
  showCancellationModal: boolean = false;
  yaInscripto: boolean = false;
  mensajeError: string = '';
  user: any;
  talleresInscriptos: any[] = [];
  fechaActual: Date = new Date();

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

    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    if (user && user.dni) {
      this.userService.getTalleresByAlumno(user.dni).subscribe(
        (talleres) => {
          this.talleresInscriptos = talleres;
          // Si el taller actual está en la lista, ya está inscripto
          this.yaInscripto = !!talleres.find(t => t.idtaller === this.workshop.idtaller && t.estado !== 3);
        }
      );
    }
  }

  getWorkshopInfo(id: number): void {
    this.workshopService.getWorkshopById(id).subscribe(
      (data) => {
        this.workshop = data;
        // Convertir fecha a objeto Date si es string
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

        // Verificar si puede inscribirse
        this.loading = false;
        console.log('Información del taller:', data);
      },
      (error) => {
        console.error('Error al obtener el taller:', error);
        this.loading = false;
      }
    );
  }

  // Modal de inscripción
  openModal() {
      this.showModal = true;
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
}