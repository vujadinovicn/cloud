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
import { MatSnackBar } from '@angular/material/snack-bar';

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
  currentFolderFullPath:String = "";

  constructor(private router: Router,
    private cognitoService: CognitoService,
    private lambdaService: LambdaService,
    private utilService: UtilService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.loaded = false;
    this.utilService.recieveCurrentPath().subscribe((value) => {
      this.setPath(value);
      this.readContent();
    })
  }

  setPath(value: string) {
    this.path = value;
    console.log(this.path);
    this.navItems = this.path.split("/").slice(0, this.path.split("/").length-1);
  }

  navToFolder(token: String, index: number) {
    if (token == "Shared-root"){
      this.folders = [];
      this.files = [];
      this.utilService.setCurrentPath("");
      this.sharedWithMeClicked();
      return
    }
    
    console.log(this.path +" "+ token)
    if (this.path.split("/")[this.path.split("/").length-2] == token)
      return

    let folderName = "";
    this.folders = [];
    this.files = [];
    if (token != "Root" && token != "Shared-root") {
      for (let i = 0; i < index; i++)
      folderName += this.navItems[i] + "/";
      folderName += token;
    }
    
    if (!folderName.endsWith("/") && folderName != "")
      folderName += "/";
    if (token == "Root")
      this.currentFolderFullPath = "";
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
    console.log(folderName);
    this.currentFolderFullPath = folderName;
    if (folderName == "Root")
      this.currentFolderFullPath = "";
    this.folders = [];
    this.files = [];
    this.utilService.setCurrentPath(this.path + folderName.split('/')[folderName.split('/').length-2] + "/");
  }

  deleteFolder(folderName: String) {
    console.log("usao u delete")
    console.log(this.path);
    console.log(folderName)
    this.lambdaService.deleteFolder(folderName).subscribe({
      next: (value) => {
        console.log(value);
        this.snackBar.open("Successfully deleted folder!", "", {
          duration: 2700,
        });
      },
      error: (err) => {
        console.log(err);
        this.snackBar.open(err.error, "", {
          duration: 2700,
        });
      },
    })
  }

  deleteFile(fileName: String) {
    console.log("usao u delete")
    console.log(fileName)
    this.lambdaService.deleteFile(fileName).subscribe({
      next: (value) => {
        console.log(value);
        this.snackBar.open("Successfully deleted file!", "", {
          duration: 2700,
        });
      },
      error: (err) => {
        console.log(err);
        this.snackBar.open(err.error, "", {
          duration: 2700,
        });
      },
    })
  }

  readContent() {
    console.log(this.currentFolderFullPath);
    this.lambdaService.readCurrentFolderContent(this.currentFolderFullPath).subscribe({
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
    let filenameToSend = file;
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
    this.readSharedFolders();
  }

  readSharedFiles(){
    this.files = [];
    this.lambdaService.getSharedFilesByUsername().subscribe({
      next: (value: String[])  => {
        console.log(value)
        for (let str of value){
          if (!this.files.includes(str)) {
            this.files.push(str);
          }
        }
        
        console.log(this.files)
        console.log(this.folders)
      },
      error: (err) => {
        console.log(err);
        
      },
    })
  }

  readSharedFolders(){
    this.folders = [];
    this.lambdaService.getSharedFoldersByUsername().subscribe({
      next: (value: String[])  => {
        console.log(value)
        value.forEach(element=> {
          // if (element.endsWith("/"))
          //   this.folders.push(element);
          // else
            this.folders.push(element);
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
