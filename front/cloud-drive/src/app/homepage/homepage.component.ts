import { LambdaService, FileMetaData } from './../services/lambda.service';
import { CognitoService } from './../services/cognito.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UtilService } from '../services/util.service';
import { CreateFolderDialogComponent } from '../create-folder-dialog/create-folder-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FileDetailsDialogComponent } from '../file-details-dialog/file-details-dialog.component';
import { ShareWithOthersFormComponent } from '../share-with-others-form/share-with-others-form.component';
import { InviteFamilyDialogComponent } from '../invite-family-dialog/invite-family-dialog.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  files: String[] = [];
  folders: String[] = [];
  path: string = '';
  navItems: String[] = [];
  loaded = false;

  constructor(private router: Router,
    private cognitoService: CognitoService,
    private lambdaService: LambdaService,
    private utilService: UtilService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loaded = false;
    this.utilService.recieveCurrentPath().subscribe((value) => {
      this.setPath(value);
      // this.readContent();
    })
  }

  setPath(value: string) {
    this.path = value;
    console.log(this.path);
    this.navItems = this.path.split("/").slice(0, this.path.split("/").length-1);
  }

  navToFolder(token: String, index: number) {
    console.log(this.path +" "+ token)
    if (this.path.split("/")[this.path.split("/").length-2] == token)
      return

    let folderName = "";
    this.folders = [];
    this.files = [];
    if (token != "Root") {
      for (let i = 0; i < index; i++)
      folderName += this.navItems[i] + "/";
      folderName += token;
    }
    if (!folderName.endsWith("/") && folderName != "")
      folderName += "/";
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

  openInviteFamilyDialog() {
    this.dialog.open(InviteFamilyDialogComponent);
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

  deleteFile(fileName: String) {
    console.log("usao u delete")
    this.lambdaService.deleteFile(fileName).subscribe({
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
        this.loaded = true;
      },
      error: (err) => {
        console.log(err);
        
      },
    })
  }

  openFileDetails(file: String) {
    let filenameToSend = file.split("/")[file.split("/").length-1]
    this.lambdaService.readFileDetails(filenameToSend).subscribe({
      next: (value: File) => {
        console.log(value);
        this.dialog.open(FileDetailsDialogComponent, {
          data: {
            fileDetails: value,
            isSharedFile: this.isSharedWithMeClicked
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  editFile(file: String) {
    this.utilService.setClickedFile(file);
    this.router.navigate(['/update'])
  }

  isSharedWithMeClicked: boolean = false;

  sharedWithMeClicked(){
    this.isSharedWithMeClicked = true;

    this.readSharedFiles();
  }

  readSharedFiles(){
    this.files = [];
    this.folders = [];
    this.lambdaService.getSharedFilesByUsername().subscribe({
      next: (value: String[])  => {
        console.log(value)
        value.forEach(element=> {
          // if (element.endsWith("/"))
          //   this.folders.push(element);
          // else
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


  manageSharing(name: String){
    this.dialog.open(ShareWithOthersFormComponent, {
      data: {folderName: name, isFolder: true}
    });
  }

}
