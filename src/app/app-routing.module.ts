import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { AllCoursesComponent } from './all-courses/all-courses.component';
import { AllWorkshopsComponent } from './all-workshops/all-workshops.component';
import { CourseInfoComponent } from './course-info/course-info.component';
import { WorkshopInfoComponent } from './workshop-info/workshop-info.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'courses', component: AllCoursesComponent},
  {path: 'courses/:id', component: CourseInfoComponent}, // Pendiente de implementar el componente
  {path: 'workshops', component: AllWorkshopsComponent},
  {path: 'workshops/:id', component: WorkshopInfoComponent},
  {path: '**', redirectTo: '', pathMatch: 'full'}
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
