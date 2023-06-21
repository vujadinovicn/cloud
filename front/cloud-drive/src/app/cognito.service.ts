import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import {Amplify, Auth } from 'aws-amplify';

import { environment } from '../environments/environment';
import { Account } from './sign-up/sign-up.component';


export interface Credentials{
  username: string,
  password: string
}

@Injectable({
  providedIn: 'root',
})
export class CognitoService {

  private authenticationSubject: BehaviorSubject<any>;
  public loggedIn: boolean = false;

  setLoggedIn(is: boolean) : void {
    this.authenticationSubject.next(is);
  }

  recieveLoggedIn(): Observable<boolean> {
    return this.authenticationSubject.asObservable();
  }


  constructor() {
    Amplify.configure({
      Auth: environment.cognito,
    });

    this.authenticationSubject = new BehaviorSubject<boolean>(false);
  }

  public signUp(account: Account): Observable<any> {
    console.log(account.date);
    const signUpParams = {
      username: account.username,
      password: account.password,
      attributes: {
      email: account.email,
      given_name: account.name,
      family_name: account.surname,
      birthdate: account.date }
      
    };
  
    return from(Auth.signUp(signUpParams));
  }

  // public confirmSignUp(credentials: Credentials): Observable<any> {
  //   return from(Auth.confirmSignUp(credentials.username, credentials.code));
  // }

  public signIn(credentials: Credentials): Promise<any> {
    return Auth.signIn(credentials.username, credentials.password);
    // .then((data) => {
    //   console.log(data);
    //   this.authenticationSubject.next(true);
    // });
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