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
  navItems: String[] = [];

  constructor(private router: Router,
    private cognitoService: CognitoService,
    private lambdaService: LambdaService,
    private utilService: UtilService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.utilService.recieveCurrentPath().subscribe((value) => {
      this.setPath(value);
      this.readContent();
    })
  }

  setPath(value: string) {
    this.path = value;
    console.log(this.path);
    this.purpleText = "Root/" + this.path;
    this.navItems = this.path.split("/").slice(1);
  }

  navToFolder(token: String, index: number) {
    let folderName = "";
    this.folders = [];
    this.files = [];
    if (token != "Root") {
      for (let i = 0; i < index; i++)
      folderName += this.navItems[i] + "/";
      folderName += token;
    }
    this.utilService.setCurrentPath(folderName);
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

  openFolder(folderName: String) {
    this.folders = [];
    this.files = [];
    this.utilService.setCurrentPath(this.path + folderName.split('/')[folderName.split('/').length-2] + "/");
  }

  deleteFolder(folderName: String) {
    console.log("usao u delete")
    this.lambdaService.deleteFolder(folderName).subscribe({
      next: (value) => {
        console.log(value);
      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  readContent() {
    this.lambdaService.readCurrentFolderContent().subscribe({
      next: (value: String[])  => {
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
