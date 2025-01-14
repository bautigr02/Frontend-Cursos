import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isMenuVisible = false;

  toggleMenu() {
      this.isMenuVisible = !this.isMenuVisible;
  }

  sesionIniciada = false;
  opcionesUsuario(){
    this.sesionIniciada = !this.sesionIniciada; //Por el momento es para probar como se ve la version con la sesion iniciada
  }
}

