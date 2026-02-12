import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AllCoursesComponent } from './all-courses/all-courses.component';
import { AllWorkshopsComponent } from './all-workshops/all-workshops.component';
import { CourseCardComponent } from './course-card/course-card.component';
import { WorkshopCardComponent } from './workshop-card/workshop-card.component';
import { CourseInfoComponent } from './course-info/course-info.component';
import { WorkshopInfoComponent } from './workshop-info/workshop-info.component';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { UserLearningComponent } from './user-learning/user-learning.component';
import { TeacherPanelComponent } from './teacher-panel/teacher-panel.component';
import { CourseFormComponent } from './course-form/course-form.component';
import { WorkshopFormComponent } from './workshop-form/workshop-form.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AllCoursesComponent,
    AllWorkshopsComponent,
    CourseCardComponent,
    WorkshopCardComponent,
    CourseInfoComponent,
    WorkshopInfoComponent,
    UserPanelComponent,
    UserLearningComponent,
    TeacherPanelComponent,
    CourseFormComponent,
    WorkshopFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
