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
  {path: 'all-courses', component: AllCoursesComponent},
  {path: 'all-workshops', component: AllWorkshopsComponent},
  {path: 'course-info', component: CourseInfoComponent}, // Resta aplicar coleccion y luego sera 'course-info/:id'
  {path: 'workshop-info', component: WorkshopInfoComponent} // Resta aplicar coleccion y luego sera 'workshop-info/:id'
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
