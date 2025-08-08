import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseWorkshopService } from '../services/course-workshop.service';
import { CourseService } from '../services/course.service';
import { WorkshopService } from '../services/workshop.service';
import { switchMap, forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workshop-form',
  templateUrl: './workshop-form.component.html',
  styleUrls: ['./workshop-form.component.scss'] 
})
export class WorkshopFormComponent implements OnInit {
  talleresAgregados: any[] = [];
  tallerForm!: FormGroup;
  isErrorVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private CourseWorkshopService: CourseWorkshopService,
    private courseService: CourseService,
    private WorkshopService: WorkshopService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tallerForm = this.fb.group({
      nom_taller: ['', [Validators.required, Validators.maxLength(45)]],
      fecha: ['', Validators.required],
      tematica: ['', [Validators.required, Validators.maxLength(30)]],
      herramienta: ['', [Validators.required, Validators.maxLength(30)]],
      hora_ini: ['', Validators.required],
      requisitos: ['', [Validators.required, Validators.maxLength(70)]],
      dificultad: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      imagen: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    });
  }

//Solucionar
  addTaller(): void {
    if (this.tallerForm.valid) {
      const nuevoTaller = this.tallerForm.value;
      this.talleresAgregados.push(nuevoTaller);
      this.CourseWorkshopService.addTaller(nuevoTaller);
      this.tallerForm.reset();
    }
  }
  onSubmit(): void {
    const cursoParaCrear = this.CourseWorkshopService.getCurso();
    const talleresParaCrear = this.CourseWorkshopService.getTalleres();

    if (!cursoParaCrear || talleresParaCrear.length === 0) {
      console.error('Faltan datos de curso o talleres para guardar.');
      return;
    }

    // 1. Crear el curso primero
    this.courseService.createCourse(cursoParaCrear).pipe(
      // 2. Usar switchMap para obtener el ID del curso y luego crear los talleres
      switchMap(responseCurso => {
        const idCursoCreado = responseCurso.id; // Asume que la API devuelve el ID
        
        // 3. Mapear cada taller a una petición de creación, agregando el ID del curso
          const peticionesTalleres = talleresParaCrear.map(taller => {
          const tallerConCursoId = { ...taller, idCurso: idCursoCreado };
          return this.WorkshopService.createWorkshop(tallerConCursoId);
        });
        
        // 4. Usar forkJoin para esperar a que todas las peticiones de talleres terminen
        return forkJoin(peticionesTalleres);
      })
    ).subscribe({
      next: (responseTalleres) => {
        console.log('Curso y talleres creados con éxito.');
        this.CourseWorkshopService.clearData(); // Limpiamos el servicio
        this.isErrorVisible = false;
        this.router.navigate(['/teacher-panel']); 
      },
      error: (error) => {
        console.error('Error en la creación:', error);
        this.isErrorVisible = true;
      }
    });
  }
}
