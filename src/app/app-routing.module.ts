import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { AllCoursesComponent } from './all-courses/all-courses.component';
import { AllWorkshopsComponent } from './all-workshops/all-workshops.component';
import { CourseInfoComponent } from './course-info/course-info.component';
import { WorkshopInfoComponent } from './workshop-info/workshop-info.component';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { UserLearningComponent } from './user-learning/user-learning.component';
import { TeacherPanelComponent } from './teacher-panel/teacher-panel.component';
import { CourseFormComponent } from './course-form/course-form.component';
import { WorkshopFormComponent } from './workshop-form/workshop-form.component';
import { authGuardGuard } from './AuthGuard/auth-guard.guard';
const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},

  //Alumnos
  {path: 'panel', component: UserPanelComponent,
    canActivate: [authGuardGuard],
    data: { roles: ['alumno']}
  },
  {path: 'learning', component: UserLearningComponent,
    canActivate: [authGuardGuard],
    data: { roles: ['alumno']}
  },

  //Ambos usuarios
  {path: 'courses', component: AllCoursesComponent},
  {path: 'courses/:id', component: CourseInfoComponent},
  {path: 'workshops', component: AllWorkshopsComponent},
  {path: 'workshops/:id', component: WorkshopInfoComponent},
  
  //Docentes
  {path: 'teacher-panel', component: TeacherPanelComponent,
    canActivate: [authGuardGuard],
    data: { roles: ['docente']}
  },
  {path:'course-form', component: CourseFormComponent,
    canActivate: [authGuardGuard],
    data: { roles: ['docente']}
  },
  {path:'workshop-form', component: WorkshopFormComponent,
    canActivate: [authGuardGuard],
    data: { roles: ['docente']}
  },
  {path: '**', redirectTo: '', pathMatch: 'full'}
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
