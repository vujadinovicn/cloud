import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Credentials, CognitoService } from '../cognito.service';
import { dateAheadOfTodayValidator, hasLetterAndDigitValidator, nameRegexValidator, passwordRegexValidator, surnameRegexValidator, usernameRegexValidator } from '../validators/user/userValidator';

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
    name: new FormControl('', [Validators.required, nameRegexValidator]),
    surname: new FormControl('', [Validators.required, surnameRegexValidator]),
    username: new FormControl('', [Validators.required, usernameRegexValidator]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, passwordRegexValidator, hasLetterAndDigitValidator()]),
    date: new FormControl('', [Validators.required, dateAheadOfTodayValidator()])
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