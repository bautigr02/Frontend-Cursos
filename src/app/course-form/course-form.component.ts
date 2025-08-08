import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseWorkshopService } from '../services/course-workshop.service';
import { Router } from '@angular/router';

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
    private CourseWorkshopService: CourseWorkshopService
  ) {} 

  ngOnInit(): void {
    this.cursoForm = this.fb.group({
      idcursoint: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      nom_curso: ['', [Validators.required, Validators.maxLength(45)]],
      fec_ini: ['', Validators.required],
      fec_fin: ['', Validators.required],
      estado: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      num_aula: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      dni_docente: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      imagen: ['', [Validators.required, Validators.maxLength(255), Validators.pattern('^https?://.*\\.(webp|jpeg|jpg|png|gif)$')]],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }
  onSubmit(): void {
     if (this.cursoForm.valid) {
      this.CourseWorkshopService.setCurso(this.cursoForm.value);
      this.Router.navigate(['/workshop-form']);
    }
  else{
    console.log('Formulario no válido. Por favor, revisa los campos.');
    this.isErrorVisible = true;
    }
  }
}