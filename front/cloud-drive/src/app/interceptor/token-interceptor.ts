import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import { throwError, Observable, BehaviorSubject, of, finalize } from "rxjs";
import { catchError, filter, take, switchMap } from "rxjs/operators";
import { MatSnackBar } from '@angular/material/snack-bar';
import { CognitoService } from '../services/cognito.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public snackBar: MatSnackBar,
    private router: Router,
    private cognito: CognitoService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('usaoooo')
    // this.cognito.loggedIn
    if (localStorage.getItem('user')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem('user')?.replace(/["]/g, '')}` 
        }
      });
      // console.log(request);
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error && error.status == 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(error);
        }
     })
    )
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    this.cognito.loggedIn = false;
    localStorage.removeItem('user');
    this.router.navigate(['login']);
    this.snackBar.open("Your access token has expired!", "", {
        duration: 2700, panelClass: ['snack-bar-back-error']
    });

    return next.handle(request);
  }
}
