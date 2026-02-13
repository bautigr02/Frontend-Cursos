import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CourseWorkshopService } from '../services/course-workshop.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})

export class CourseFormComponent implements OnInit {
  cursoForm!: FormGroup;
  isErrorVisible = false;

  constructor(
    private fb: FormBuilder,
    private Router: Router,
    private CourseWorkshopService: CourseWorkshopService,
     private authService: AuthService
  ) {} 

  ngOnInit(): void {
    this.cursoForm = this.fb.group({
      nom_curso: ['', [Validators.required, Validators.maxLength(45)]],
      fec_ini: ['', Validators.required],
      fec_fin: ['', Validators.required],
      num_aula: ['', [Validators.required, Validators.pattern('^[0-9]+$'),
        Validators.min(1), Validators.max(5) //Solo 5 Aulas disponibles
      ]],
      imagen: ['', [Validators.required,Validators.maxLength(255),Validators.pattern(/^https?:\/\/.+/)]],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]]
    }, { validators: this.fechaFinPosteriorValidator });
  }
  onSubmit(): void {
     if (this.cursoForm.valid) {
      this.CourseWorkshopService.clearData(); //Evitar datos previos
      const cursoParaCrear = this.cursoForm.value;
        //Agrega datos faltantes al curso
        cursoParaCrear.estado = '1'; //Suponemos que ya fue aprobado por la direccion para habilitar el curso.
        const dniDocenteLogueado = this.authService.getDniDocenteLogueado(); 
          cursoParaCrear.dni_docente = dniDocenteLogueado;
        this.CourseWorkshopService.setCurso(cursoParaCrear);
        this.isErrorVisible = false;
        this.Router.navigate(['/workshop-form']);
        
    }
  else{
    console.log('Formulario no válido. Por favor, revisa los campos.');
    this.isErrorVisible = true;
    }
  }

  private fechaFinPosteriorValidator = (control: AbstractControl): ValidationErrors | null => {
    const fecIni = control.get('fec_ini')?.value;
    const fecFin = control.get('fec_fin')?.value;

    if (!fecIni || !fecFin) return null; // required validators handle empties

    const inicio = new Date(fecIni + 'T00:00:00');
    const fin = new Date(fecFin + 'T00:00:00');
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) {
      return { fechaInvalida: true };
    }

    if (inicio < hoy) {
      return { inicioPasado: true };
    }

    return fin > inicio ? null : { finAnterior: true };
  };
}