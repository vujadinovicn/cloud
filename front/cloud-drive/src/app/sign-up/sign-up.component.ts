import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Credentials, CognitoService } from '../cognito.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {

  loading: boolean;
  isConfirm: boolean;
  credentials: Credentials;
  isVisible: boolean = false;

  constructor(private router: Router,
              private cognitoService: CognitoService) {
    this.loading = false;
    this.isConfirm = false;
    this.credentials = {} as Credentials;
  }

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required])
  }, [])

  public signUp(): void {
    this.loading = true;
    console.log(this.registerForm.value.date);
    this.cognitoService.signUp(this.credentials)
    .subscribe({
      next: (data) => {
        this.loading = false;
        this.isConfirm = true;
      }, error: (err) => {
        this.loading = false;
      }
    });
  }

  // public confirmSignUp(): void {
  //   this.loading = true;
  //   this.cognitoService.confirmSignUp(this.credentials)
  //   .then(() => {
  //     this.router.navigate(['/signIn']);
  //   }).catch(() => {
  //     this.loading = false;
  //   });
  // }

}