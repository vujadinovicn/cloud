import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileDetailsDialogComponent } from '../file-details-dialog/file-details-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileMetaData, FolderMetaData, LambdaService } from '../services/lambda.service';
import { CognitoService } from '../services/cognito.service';

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
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if (!this.data.isFolder) {
      this.isFolder = this.data.isFolder;
      this.fileDetails = this.data.fileDetails;
    } else {
      this.isFolder = true;
      this.folderName = this.data.folderName;
      this.lambdaService.readFolderDetails(this.folderName).subscribe({
        next: (value) => {
          console.log(value);
          this.folderDetails = value;
        },
        error: (err) => {
          console.log(err);
        },
      })
    }
    this.addUsersFromDb();
  }

  addUsersFromDb(){
    for (let user in this.fileDetails.sharedWith){
      this.addUser(user);
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
    for (let username of this.usernamesInvited){
      this.fileDetails.sharedWith.push(username);
    }
    //this.fileDetails.sharedWith = this.usernamesInvited.slice();
    console.log(this.usernamesInvited);
    console.log(this.fileDetails);
    this.lambdaService.updateFile(this.fileDetails).subscribe({
      next: (value) => {
        console.log(value);
        this.dialogRef.close();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

}
