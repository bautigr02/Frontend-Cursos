import { CanActivateFn } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user  = authService.getUser();

  if(!authService.isLoggedIn()){
    router.navigate(['/login']);
    return false;  
  }

  const expectedRole = route.data['roles'] as Array<string>;
  if (expectedRole && expectedRole.length > 0) {
    if(!user || !expectedRole.includes(user.rol)) {
      router.navigate(['/']);
      return false;
    }
  }
  return true;
};
