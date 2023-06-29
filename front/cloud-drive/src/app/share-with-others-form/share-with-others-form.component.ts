import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileDetailsDialogComponent } from '../file-details-dialog/file-details-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileMetaData, FolderMetaData, LambdaService } from '../services/lambda.service';
import { CognitoService } from '../services/cognito.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-share-with-others-form',
  templateUrl: './share-with-others-form.component.html',
  styleUrls: ['./share-with-others-form.component.css']
})
export class ShareWithOthersFormComponent implements OnInit {

  hasOthers: boolean = false;
  usersInvited: any[] = [];
  usernamesInvited: any[] = [];

  isFolder: boolean = false;

  fileDetails: FileMetaData = {} as FileMetaData;

  folderName: string = '';
  folderDetails: FolderMetaData = {} as FolderMetaData;


  inviteForm = new FormGroup({
    username: new FormControl('', [Validators.required])
  });

  constructor(private lambdaService: LambdaService, private cognitoService: CognitoService,
    public dialogRef: MatDialogRef<ShareWithOthersFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.usernamesInvited = [];
    this.usersInvited = [];
    if (!this.data.isFolder) {
      this.isFolder = this.data.isFolder;
      this.fileDetails = this.data.fileDetails;
      console.log(this.fileDetails)
    } else {
      this.isFolder = true;
      this.folderName = this.data.folderName;
      this.lambdaService.readFolderDetails(this.folderName).subscribe({
        next: (value) => {
          console.log(value);
          this.folderDetails = value;
          this.addUsersFromDb();
        },
        error: (err) => {
          console.log(err);
          this.snackBar.open(err.error, "", {
            duration: 2700, panelClass: ['snack-bar-back-error']
          })
        },
      })
    }
    if (!this.isFolder){
      
      this.addUsersFromDb();
    }
  }

  addUsersFromDb(){
    if (!this.isFolder) {
      console.log(this.fileDetails.sharedWith)
      for (let user of this.fileDetails.sharedWith){
        this.addUser(user);
      }
    }
    else {
      for (let user of this.folderDetails.sharedWith){
        this.addUser(user);
      }
    }
  }

  addUserFromForm(){
    this.addUser(this.inviteForm.value.username!);
  }

  addUser(username: string) {
    this.lambdaService.getUserByUsername(username).subscribe({
      next: (value) => {
        console.log(value);
        let user = value;
        if (this.usernamesInvited.indexOf(username) == -1) {
          if (!this.hasOthers) {
            this.showLinkedFriends();
          }
          this.usersInvited.push(user);
          this.usernamesInvited.push(username)
        }
        else {
          
        }
      },
      error: (err) => {
        console.log(err);
        this.snackBar.open(err.error, "", {
          duration: 2700, panelClass: ['snack-bar-back-error']
        });
      },
    });
  }

  showLinkedFriends() {
    this.hasOthers = true;
  }

  removeuser(i: number) {
    this.usersInvited.splice(i, 1);
    this.usernamesInvited.splice(i,1);
  }

  shareData(){
    this.fileDetails.sharedWith = [];
    this.folderDetails.sharedWith = [];
    for (let username of this.usernamesInvited){
      if (this.isFolder) {
        this.folderDetails.sharedWith.push(username);
      }
      else {
        this.fileDetails.sharedWith.push(username);
      }
    }
    //this.fileDetails.sharedWith = this.usernamesInvited.slice();
    console.log(this.usernamesInvited);
    console.log(this.fileDetails);
    if (!this.isFolder) {
      this.lambdaService.updateFile(this.fileDetails).subscribe({
        next: (value) => {
          console.log("Successfully shared files!");
          this.snackBar.open("Successfully shared file!", "", {
            duration: 2700,
          });
          this.dialogRef.close();
          
        },
        error: (err) => {
          console.log(err);
          this.snackBar.open(err.error, "", {
            duration: 2700, panelClass: ['snack-bar-back-error']
          });
        },
      });
    }
    else {
      this.lambdaService.updateFolderMetadata(this.folderDetails).subscribe({
        next: (value) => {
          console.log(value);
          this.dialogRef.close();
          this.snackBar.open("Successfully shared folder!", "", {
            duration: 2700,
          });
        },
        error: (err) => {
          console.log(err);
          this.snackBar.open(err.error, "", {
            duration: 2700, panelClass: ['snack-bar-back-error']
          });
        },
      });
    }
  }

}
