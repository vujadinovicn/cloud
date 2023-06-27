import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from '../infrastructure/app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/infrastructure/material.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { HomepageComponent } from './homepage/homepage.component';
import { TokenInterceptor } from './interceptor/token-interceptor';
import { CommonModule } from '@angular/common';
import { CreateFolderDialogComponent } from './create-folder-dialog/create-folder-dialog.component';
import { FileDetailsDialogComponent } from './file-details-dialog/file-details-dialog.component';
import { FileUpdateComponent } from './file-update/file-update.component';
import { ShareWithOthersFormComponent } from './share-with-others-form/share-with-others-form.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    FileUploadComponent,
    HomepageComponent,
    CreateFolderDialogComponent,
    FileDetailsDialogComponent,
    FileUpdateComponent,
    ShareWithOthersFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,

  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline', hideRequiredMarker: 'true' }},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
