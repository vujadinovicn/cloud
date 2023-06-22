import { LambdaService } from './../services/lambda.service';
import { CognitoService } from './../services/cognito.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UtilService } from '../services/util.service';
import { CreateFolderDialogComponent } from '../create-folder-dialog/create-folder-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  files: String[] = [];
  folders: String[] = [];
  path: string = '';
  purpleText: string = 'Root';

  constructor(private router: Router,
    private cognitoService: CognitoService,
    private lambdaService: LambdaService,
    private utilService: UtilService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.utilService.recieveCurrentPath().subscribe((value) => {
      
      this.readContent();
    })
  }

  setPath(value: string) {
    this.path = value;
    this.purpleText = "Root/" + this.path;
  }

  logout() {
    localStorage.removeItem('user');
    this.cognitoService.setLoggedIn(false);
    this.cognitoService.signOut();
    this.router.navigate(['login']);
  }

  openCreateFolderDialog() {
    this.dialog.open(CreateFolderDialogComponent);
  }

  readContent() {
    this.lambdaService.readCurrentFolderContent().subscribe({
      next: (value: String[])  => {
        this.folders = [];
        this.files = [];
        value.forEach(element=> {
          if (element.endsWith("/"))
            this.folders.push(element);
          else
            this.files.push(element);
        });
        console.log(this.files)
        console.log(this.folders)
      },
      error: (err) => {
        console.log(err);
        
      },
    })
  }

}
