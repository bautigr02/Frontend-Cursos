import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      num_aula: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      imagen: ['', [Validators.required,Validators.maxLength(255),Validators.pattern(/^https?:\/\/.+/)]],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }
  onSubmit(): void {
     if (this.cursoForm.valid) {
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
}