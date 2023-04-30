import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from 'src/app/sign-up/sign-up.component';
import { SignInComponent } from '../app/sign-in/sign-in.component';

const routes: Routes = [ 
  {path:'login', component: SignInComponent},
  {path: 'register', component: SignUpComponent},
  {path: '**', component: SignInComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
