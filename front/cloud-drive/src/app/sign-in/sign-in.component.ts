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

  credentials: Credentials;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  constructor(private router: Router,
              private cognitoService: CognitoService) {
    this.credentials = {} as Credentials;
  }

  public signIn(): void {
    console.log("tu")
    if (this.loginForm.valid) {
      let c = {username: this.loginForm.value.username!, password: this.loginForm.value.password!}
      this.cognitoService.signIn(c)
      .subscribe({
        next: (data) => {
          console.log("logged in successfuly");
        }, 
        error: (err) => {
          console.log("login FAILED");
        }
      })
    }

    
  }

}