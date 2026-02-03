import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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
  isSuccessVisible: boolean = false;
  totalTalleres: number = 0;

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
      dificultad: ['', [Validators.required, Validators.min(0), Validators.max(3), Validators.pattern(/^(0|1|2|3)$/)]],
      imagen: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    }, { validators: this.fechaDentroDeCursoValidator });
  }

  addTaller(): void {
    this.isErrorVisible = false;

    if (!this.tallerForm.valid) {
      this.tallerForm.markAllAsTouched();
      alert('Formulario de taller no válido. Por favor, revisa los campos.');
      this.isErrorVisible = true;
      return;
    }
      const nuevoTaller = {...this.tallerForm.value};
      this.totalTalleres++;
      nuevoTaller.dificultad = Number(nuevoTaller.dificultad); // Convierte dificultad a numero para evitar problema de tipo de dato
      this.talleresAgregados.push(nuevoTaller);
      this.CourseWorkshopService.addTaller(nuevoTaller); //Agrega el taller a la lista en el service
      this.tallerForm.reset();
      this.isErrorVisible = false;
      alert('Taller agregado correctamente.');
  }
  onSubmit(): void {
    const cursoParaCrear = this.CourseWorkshopService.getCurso();
    const talleresParaCrear = this.CourseWorkshopService.getTalleres();

    console.log('Curso a enviar:', cursoParaCrear);
    console.log('Talleres a enviar:', talleresParaCrear);

    if (!cursoParaCrear || talleresParaCrear.length === 0) {
      console.error('Faltan datos de curso o talleres para guardar.');
      alert('Faltan datos de curso o talleres para guardar.');
      return;
    }

    //Crear el curso
    this.courseService.createCurso(cursoParaCrear).pipe(
      //SwitchMap para obtener el ID del curso y luego crear los talleres
      switchMap(responseCurso => {
        const idCursoCreado = responseCurso.id || responseCurso.idcurso;
        const dniDocente = cursoParaCrear.dni_docente;
        console.log('Curso creado con éxito:', responseCurso);
        
        // Mapea cada taller a una petición de creación, agregando el ID del curso
          const peticionesTalleres = talleresParaCrear.map(taller => {
            const tallerConCursoId = { ...taller, idcurso: idCursoCreado, dni_docente: dniDocente };
            return this.WorkshopService.createTaller(tallerConCursoId);
        });
        
        //forkJoin para esperar a que todas las peticiones de talleres terminen
        return forkJoin(peticionesTalleres);
      })
    ).subscribe({
      next: (responseTalleres) => {
        console.log('Curso y talleres creados con éxito.');
        console.log('Respuesta de los talleres:', responseTalleres);
        alert('Curso y talleres creados con éxito.');

        this.CourseWorkshopService.clearData(); 
        this.talleresAgregados = [];
        this.totalTalleres = 0;
        this.isErrorVisible = false;
        this.isSuccessVisible = true;
        this.router.navigate(['/teacher-panel']); 
      },
      error: (error) => {
        console.error('Error en la creación:', error);
        alert('Error en la creación del curso o talleres. Por favor, intenta de nuevo.');
        this.isErrorVisible = true;
        this.CourseWorkshopService.clearData();
        this.talleresAgregados = [];
        this.totalTalleres = 0;
      }
    });
  }

  private fechaDentroDeCursoValidator = (control: AbstractControl): ValidationErrors | null => {
    const fecha = control.get('fecha')?.value;
    const curso = this.CourseWorkshopService.getCurso();
    if (!curso) return null;

    const { fec_ini, fec_fin } = curso;
    if (!fecha || !fec_ini || !fec_fin) return null;

    const fechaTaller = new Date(fecha);
    const inicio = new Date(fec_ini);
    const fin = new Date(fec_fin);

    if (Number.isNaN(fechaTaller.getTime()) || Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) {
      return { fechaInvalida: true };
    }

    const dentroDeRango = fechaTaller >= inicio && fechaTaller <= fin;
    return dentroDeRango ? null : { fueraDeRango: true };
  };
}
