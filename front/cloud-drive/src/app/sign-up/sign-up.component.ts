import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Credentials, CognitoService } from '../cognito.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {

  loading: boolean;
  isConfirm: boolean;
  credentials: Credentials;

  constructor(private router: Router,
              private cognitoService: CognitoService) {
    this.loading = false;
    this.isConfirm = false;
    this.credentials = {} as Credentials;
  }

  form = new FormGroup({
    username: new FormControl('',),
    password: new FormControl('',),
  }, [])

  public signUp(): void {
    this.loading = true;
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