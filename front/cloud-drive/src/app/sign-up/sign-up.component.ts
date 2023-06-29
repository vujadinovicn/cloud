import { LambdaService } from './../services/lambda.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Credentials, CognitoService } from '../services/cognito.service';
import { dateAheadOfTodayValidator, hasLetterAndDigitValidator, nameRegexValidator, passwordRegexValidator, surnameRegexValidator, usernameRegexValidator } from '../validators/user/userValidator';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Account{
  name: string,
  surname: string,
  username: string,
  email: string,
  password: string,
  date: string
}

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
              private cognitoService: CognitoService,
              private lambdaService: LambdaService,
              private snackBar: MatSnackBar) {
    this.loading = false;
    this.isConfirm = false;
    this.credentials = {} as Credentials;
  }

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, nameRegexValidator]),
    surname: new FormControl('', [Validators.required, surnameRegexValidator]),
    username: new FormControl('', [Validators.required, usernameRegexValidator]),
    familyUsername: new FormControl('', []),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, hasLetterAndDigitValidator()]),
    date: new FormControl('', [Validators.required, dateAheadOfTodayValidator()])
  }, [])

  public signUp(): void {
    if (this.registerForm.valid) {
      this.loading = true;

      if (this.registerForm.value.familyUsername != "") {
        this.familyMemberSignUp();
        return;
      }
  
      this.lambdaSignUp();
    } else{
      this.snackBar.open("Check your inputs again!", "", {
        duration: 2700, panelClass: ['snack-bar-front-error']
      });
    }
  }

  lambdaSignUp() {
    let creds = {
      name: this.registerForm.value.name!,
      surname: this.registerForm.value.surname!,
      username: this.registerForm.value.username!,
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!,
      date: new Date(this.registerForm.value.date!).toISOString().split('T')[0]
    }

    this.lambdaService.register(creds).subscribe({
      next: (data) => {
        console.log("uspeo");
        this.loading = false;
        this.isConfirm = true;
        this.snackBar.open(data, "", {
          duration: 2700, panelClass: ['snack-bar-success']
        });
        this.router.navigate(['login'])
      }, error: (err) => {
        console.log(err);
        this.snackBar.open(err.message, "", {
          duration: 2700, panelClass: ['snack-bar-back-error']
        });
        this.loading = false;
      }
    });
  }

  // used in the first version, problem with foce password change so went to the lambda approach
  directCognitoSignUp() {
    this.cognitoService.signUp(
      {
        name: this.registerForm.value.name!,
        surname: this.registerForm.value.surname!,
        username: this.registerForm.value.username!,
        email: this.registerForm.value.email!,
        password: this.registerForm.value.password!,
        date: new Date(this.registerForm.value.date!).toISOString().split('T')[0]
      }
    )
    .subscribe({
      next: (data) => {
        console.log("uspeo");
        this.loading = false;
        this.isConfirm = true;
      }, error: (err) => {
        console.log(err);
        this.snackBar.open(err.error, "", {
          duration: 2000, panelClass: ['snack-bar-back-error']
        });
        this.loading = false;
      }
    });
  }

  familyMemberSignUp() {
    let signUpCreds = {
      name: this.registerForm.value.name!,
      surname: this.registerForm.value.surname!,
      username: this.registerForm.value.username!,
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!,
      date: new Date(this.registerForm.value.date!).toISOString().split('T')[0],
      familyUsername: this.registerForm.value.familyUsername!
    }

    this.lambdaService.registerFamilyMember(signUpCreds).subscribe({
      next: (value) => {
        console.log(value);
        this.snackBar.open("Your request to register as family member successfully sent. Check your email for request feedback shortly.", "", {
          duration: 2700, panelClass: ['snack-bar-success']
        });
      },
      error: (err) => {
        console.log(err);
        this.snackBar.open(err.error, "", {
          duration: 2700, panelClass: ['snack-bar-back-error']
        });
      }
    });
  }

}