import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workshop-form',
  templateUrl: './workshop-form.component.html',
  styleUrls: ['./workshop-form.component.scss'] // Asegurate de tener los estilos aplicados
})
export class WorkshopFormComponent implements OnInit {

  tallerForm!: FormGroup;
  isErrorVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
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

  onSubmit(): void {
    if (this.tallerForm.invalid) {
      this.isErrorVisible = true;
      return;
    }

    const tallerData = this.tallerForm.value;

    // 📌 Agregá acá el DNI del docente desde el usuario logueado
    // tallerData.dni_docente = this.authService.getCurrentUser()?.dni_docente;

    console.log('Taller enviado:', tallerData);

    // Acá podés hacer el POST a la API
    // this.tallerService.saveTaller(tallerData).subscribe(...)

    // Navegación o feedback al usuario
    this.router.navigate(['/teacher-panel']);
  }
}
