import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import {Amplify, Auth } from 'aws-amplify';

import { environment } from '../environments/environment';


export interface Credentials{
  username: string,
  password: string
}

@Injectable({
  providedIn: 'root',
})
export class CognitoService {

  private authenticationSubject: BehaviorSubject<any>;

  constructor() {
    Amplify.configure({
      Auth: environment.cognito,
    });

    this.authenticationSubject = new BehaviorSubject<boolean>(false);
  }

  public signUp(credentials: Credentials): Observable<any> {
    return from(Auth.signUp({
      username: credentials.username,
      password: credentials.password,
    }));
  }

  // public confirmSignUp(credentials: Credentials): Observable<any> {
  //   return from(Auth.confirmSignUp(credentials.username, credentials.code));
  // }

  public signIn(credentials: Credentials): Observable<any> {
    return from(Auth.signIn(credentials.username, credentials.password)
    .then(() => {
      this.authenticationSubject.next(true);
    }));
  }

  public signOut(): Observable<any> {
    return from(Auth.signOut()
    .then(() => {
      this.authenticationSubject.next(false);
    }));
  }

  // public isAuthenticated(): Promise<boolean> {
  //   if (this.authenticationSubject.value) {
  //     return Promise.resolve(true);
  //   } else {
  //     return this.getUser()
  //     .then((user: any) => {
  //       if (user) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     }).catch(() => {
  //       return false;
  //     });
  //   }
  // }

  public getUser(): Observable<any> {
    return from(Auth.currentUserInfo());
  }

  public updateUser(credentials: Credentials): Observable<any> {
    return from(Auth.currentUserPoolUser()
    .then((cognitoUser: any) => {
      return Auth.updateUserAttributes(cognitoUser, credentials);
    }));
  }

}