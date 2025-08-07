import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
    private http: HttpClient
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


  //Solucionar
  onSubmit(): void {
    if (this.cursoForm.valid) {
      console.log('Formulario de curso enviado:', this.cursoForm.value);
      this.isErrorVisible = false;

      // Aquí puedes agregar la lógica para enviar los datos a tu API usando HttpClient
      // Por ejemplo:
      /*
      const cursoData = this.cursoForm.value;
      this.http.post('https://tu-api.com/cursos', cursoData)
        .pipe(
          tap(response => console.log('Respuesta de la API:', response)),
          catchError(error => {
            console.error('Error al enviar el formulario:', error);
            return new Observable<any>();
          })
        )
        .subscribe();
      */
    } else {
      console.log('Formulario inválido. Revisa los campos.');
      this.isErrorVisible = true;
    }
  }
}