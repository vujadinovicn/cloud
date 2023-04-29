import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Credentials, CognitoService } from '../cognito.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {

  loading: boolean;
  credentials: Credentials;

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