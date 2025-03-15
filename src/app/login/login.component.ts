import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isErrorVisible = false;

  ValidarUsuario(){
       this.isErrorVisible = !this.isErrorVisible;
      }
}
