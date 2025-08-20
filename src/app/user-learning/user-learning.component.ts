import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-user-learning',
  templateUrl: './user-learning.component.html',
  styleUrls: ['./user-learning.component.scss']
})
export class UserLearningComponent implements OnInit {
  cursos: any[] = [];
  ultimosTalleres: any[] = [];
  router: Router = new Router();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const dniStr = localStorage.getItem('dni') || sessionStorage.getItem('dni');
    if (!dniStr) {
      console.error('No hay DNI en storage');
      return;
    }
    const dni = Number(dniStr);

    // Obtener cursos del alumno
    this.userService.getCursosByAlumno(dni).subscribe(
      (data) => {
        this.cursos = data.map(curso => ({
          ...curso,
          estado: curso.estado !== null && curso.estado !== undefined ? Number(curso.estado) : null,
          nota_curso: curso.nota_curso !== null && curso.nota_curso !== undefined ? Number(curso.nota_curso) : null
        }));
      },
      (error) => { console.error('Error al obtener cursos:', error); }
    );

    // Obtener talleres del alumno
    this.userService.getTalleresByAlumno(dni).subscribe(
      (data) => { this.ultimosTalleres = data; },
      (error) => { console.error('Error al obtener talleres:', error); }
    );
  }
  
    puedeCancelar(fec_ini: string): boolean {
      // fec_ini debe ser un string tipo 'YYYY-MM-DD' o Date
      const fechaInicio = new Date(fec_ini);
      const hoy = new Date();
      return hoy < fechaInicio; // Puede cancelar hasta el día anterior al inicio

    }
    
cancelarInscripcion(curso: any){
  const dniStr = localStorage.getItem('dni') || sessionStorage.getItem('dni');
  if (!dniStr) {
    console.error('No hay DNI en storage');
    return;
  }
  const dni = Number(dniStr);

  if (confirm(`¿Seguro que deseas cancelar la inscripción a "${curso.nom_curso}"?`)) {
    this.userService.cancelarInscripcion(dni, curso.idcurso).subscribe(
      () => {
        curso.estado = 3;
        alert('Inscripción cancelada (marcada como finalizada).');
      },
      (error) => {
        alert('Error al cancelar la inscripción.');
        console.error('Error al cancelar inscripción:', error);
      }
    );
  }
}



verCertificado(curso: any) {
  const doc = new jsPDF('p', 'mm', 'a4');

  // Fondo blanco y borde dorado
  doc.setDrawColor(212, 175, 55); // dorado
  doc.setLineWidth(2);
  doc.rect(10, 10, 190, 277, 'S');

  // Título principal
  doc.setFont('times', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(40, 40, 40);
  doc.text('CERTIFICADO', 105, 50, { align: 'center' });

  // Subtítulo
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(18);
  doc.setTextColor(80, 80, 80);
  doc.text('De participación', 105, 62, { align: 'center' });

  // Texto de reconocimiento
  doc.setFontSize(13);
  doc.setTextColor(60, 60, 60);
  doc.text('El reconocimiento de graduación es para:', 105, 80, { align: 'center' });

  // Nombre del alumno (simula cursiva grande)
  doc.setFont('times', 'italic');
  doc.setFontSize(28);
  doc.setTextColor(0, 0, 0);
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{"nombre": "Alumno"}');
  doc.text(user.nombre + ' ' + user.apellido, 105, 95, { align: 'center' }); // <-- reemplaza por tu variable

  // Línea bajo el nombre
  doc.setDrawColor(0, 0, 0);
  doc.line(55, 98, 155, 98);

  // Texto descriptivo
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(
    'Por su dedicación y esfuerzo demostrado durante el cursado, la academia\n' +
    'CUR.SOFTWARE otorga el presente certificado en reconocimiento a la\n' +
    'participación y compromiso en el desarrollo de sus habilidades profesionales.',
    105, 110, { align: 'center' }
  );

  // Firmas
  doc.setFont('times', 'italic');
  doc.setFontSize(16);
  doc.text('Juan', 65, 170, { align: 'center' });
  doc.text(`${curso.nombre_docente}`, 145, 170, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Di Rector', 65, 176, { align: 'center' });
  doc.text(`${curso.apellido_docente}`, 145, 176, { align: 'center' });

  // Línea bajo firmas
  doc.line(45, 178, 85, 178);
  doc.line(125, 178, 165, 178);

  // Medalla (opcional: usa una imagen PNG de medalla dorada)
  // doc.addImage("C:/Users/User1/OneDrive/Escritorio/Facu/2023 (3ro)/Desarrollo Web/TP-CURSOS/Frontend-Cursos/src/assets/Icons/logo-1.png", 'PNG', 85, 185, 40, 40);

  // Fecha y curso
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Curso: ${curso.nom_curso}`, 105, 200, { align: 'center' });
  doc.text(`Periodo: ${formatFecha(curso.fec_ini)} a ${formatFecha(curso.fec_fin)}`, 105, 208, { align: 'center' });  
  doc.text(`Nota final: ${curso.nota_curso}`, 105, 216, { align: 'center' });
  doc.text(`Fecha de emisión: ${formatFecha(new Date().toLocaleDateString())}`, 105, 224, { align: 'center' });

  doc.save(`Certificado_${curso.nom_curso}.pdf`);
}
}

function formatFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-AR'); // o el formato que prefieras
}
