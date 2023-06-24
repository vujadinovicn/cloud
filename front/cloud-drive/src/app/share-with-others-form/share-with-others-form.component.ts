import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileDetailsDialogComponent } from '../file-details-dialog/file-details-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LambdaService } from '../services/lambda.service';
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


  inviteForm = new FormGroup({
    username: new FormControl('', [Validators.required])
  });

  constructor(private lambdaService: LambdaService, private cognitoService: CognitoService,
    public dialogRef: MatDialogRef<ShareWithOthersFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  addUser() {
    this.lambdaService.getUserByUsername(this.inviteForm.value.username!).subscribe({
      next: (value) => {
        console.log(value);
        console.log("download succ");
        let user = value;
        if (this.usernamesInvited.indexOf(user.username) == -1) {
          if (!this.hasOthers) {
            this.showLinkedFriends();
          }
          this.usersInvited.push(user);
          this.usernamesInvited.push(user.username)
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

}
