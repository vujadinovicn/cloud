import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Credentials, CognitoService } from '../cognito.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {

  isVisible = false;

  loading: boolean;
  credentials: Credentials;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  constructor(private router: Router,
              private cognitoService: CognitoService) {
    this.loading = false;
    this.credentials = {} as Credentials;
  }

  public signIn(): void {
    let c = {username: "srk1", password:"nemanja123"}
    this.loading = true;
    this.cognitoService.signIn(c)
    .subscribe({
      next: (data) => {
        console.log("shajajsa");
        this.router.navigate(['/profile']);
      }, error: (err) => {
        this.loading = false;
      }
    })
  }

}