import { Component, Inject, OnInit } from '@angular/core';
import { File, LambdaService } from './../services/lambda.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-file-details-dialog',
  templateUrl: './file-details-dialog.component.html',
  styleUrls: ['./file-details-dialog.component.css']
})
export class FileDetailsDialogComponent implements OnInit {
  
  fileDetails: File = {} as File;

  constructor(public dialogRef: MatDialogRef<FileDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lambdaService: LambdaService) { }

  ngOnInit(): void {
    if (this.data.fileDetails) {
      this.fileDetails = this.data.fileDetails;
    }
  }

  delete() {
    console.log("usao u delete")
    this.lambdaService.deleteFile(this.fileDetails.id).subscribe({
      next: (value) => {
        console.log(value);
        console.log("deleted succ")
        //TODO: DODATI TOAST
        this.dialogRef.close();
      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  close() {
    this.dialogRef.close();
  }

}
