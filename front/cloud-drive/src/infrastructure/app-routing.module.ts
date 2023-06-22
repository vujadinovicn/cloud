import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from 'src/app/sign-up/sign-up.component';
import { SignInComponent } from '../app/sign-in/sign-in.component';
import { FileUploadComponent } from 'src/app/file-upload/file-upload.component';
import { HomepageComponent } from 'src/app/homepage/homepage.component';

const routes: Routes = [ 
  {path:'', component: SignInComponent},
  {path:'login', component: SignInComponent},
  {path: 'register', component: SignUpComponent},
  {path: 'upload', component: FileUploadComponent},
  {path: 'homepage', component: HomepageComponent},
  {path: '**', component: SignInComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
