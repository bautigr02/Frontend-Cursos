import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';  

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMenuVisible = false;
  sesionIniciada = false;
  esDocente = false;
  usuario: any = null;


  constructor(private router: Router, private authService: AuthService) {}

ngOnInit(): void {
  this.authService.user$.subscribe(user => {
    this.sesionIniciada = !!user;
    this.usuario = user;
    this.esDocente = user?.rol === 'docente';

    console.log('Estado de sesión actualizado:', {
      sesionIniciada: this.sesionIniciada,
      usuario: this.usuario,
      esDocente: this.esDocente
    });
  });
}


  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}