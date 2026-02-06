export interface Alumno {
    dni: number;
    nombre_alumno: string;
    apellido_alumno: string;
    direccion: string;
    telefono: string;
    email: string;
    contrasena: string;
}

export interface Docente {
    dni: number;
    nombre: string;
    apellido: string;
    direccion: string;
    telefono: string;
    email: string;
    contrasena: string;
}

export interface Aula {
    num_aula: number; 
    cant_alumnos: number;
}

export interface Curso {
    idcurso: number;
    nom_curso: string; 
    fec_ini: string;   // Recibido como string
    fec_fin: string;
    estado: number;
    num_aula: number;
    dni_docente: number;
    imagen: string;
    descripcion: string;
}

export interface Taller {
    idcurso: number;
    idtaller: number;
    nom_taller: string;
    fecha: string;      // Recibido como string
    tematica: string;
    herramienta: string;
    hora_ini: string;   // Recibido como string
    requisitos: string;
    dificultad: number;
    dni_docente: number;
    imagen: string;
}

export interface InscripcionCurso {
    idcurso: number;
    dni: number;
    fec_inscripcion: string;   // Recibido como string
    estado: number;
    nota_curso: string; 
}

export interface InscripcionTaller {
    idcurso: number;
    idtaller: number;
    dni: number;
    fec_inscripcion: string;
    estado: number;
    nota_taller: number; 
}