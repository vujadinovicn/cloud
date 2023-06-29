import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Credentials, CognitoService } from '../services/cognito.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { usernameRegexValidator } from '../validators/user/userValidator';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {

  isVisible = false;

  credentials: Credentials;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, usernameRegexValidator]),
    password: new FormControl('', [Validators.required])
  })

  constructor(private router: Router,
              private cognitoService: CognitoService,
              private snackBar: MatSnackBar) {
    this.credentials = {} as Credentials;
  }

  public signIn(): void {
    console.log("tu")
    if (this.loginForm.valid) {
      let c = {username: this.loginForm.value.username!, password: this.loginForm.value.password!}
      this.cognitoService.signIn(c).then((data) => {
        console.log(data);
        console.log(data.getSignInUserSession().getAccessToken().getJwtToken());
        localStorage.setItem('user', JSON.stringify(data.getSignInUserSession().getIdToken().getJwtToken()));
        this.cognitoService.setLoggedIn(true);
        this.cognitoService.loggedIn = true;
        this.router.navigate(['homepage']);
      }).catch((err) => {
        console.log(err);
        this.snackBar.open(err.message, "", {
          duration: 2700, panelClass: ['snack-bar-back-error']
        });
      });
    }

    
  }

}