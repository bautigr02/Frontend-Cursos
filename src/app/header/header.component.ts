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

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.sesionIniciada = !!user;
      console.log('Estado de sesión actualizado:', this.sesionIniciada);
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