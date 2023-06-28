import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LambdaService } from '../services/lambda.service';
import { UtilService } from '../services/util.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-invite-family-dialog',
  templateUrl: './invite-family-dialog.component.html',
  styleUrls: ['./invite-family-dialog.component.css']
})
export class InviteFamilyDialogComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
    
  constructor(public dialogRef: MatDialogRef<InviteFamilyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lambdaService: LambdaService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  inviteFamily() {
    if (this.email.valid) {
      this.lambdaService.sendInvitationToFamily(this.email.value!).subscribe({
        next: (value) => {
          this.snackBar.open(value, "", {
            duration: 2000,
          });
          this.dialogRef.close();
        },
        error: (err) => {
          this.snackBar.open(err.error, "", {
            duration: 2000,
          });
        },
      })

    }
  }


  cancel() {
    this.dialogRef.close();
  }

}
