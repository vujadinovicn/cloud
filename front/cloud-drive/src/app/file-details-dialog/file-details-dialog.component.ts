import { Component, Inject, OnInit } from '@angular/core';
import { File, LambdaService } from './../services/lambda.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as saveAs from 'file-saver';

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

  download() {
    console.log("tu")
    this.lambdaService.downloadFile(this.fileDetails.id).subscribe({
      next: (value) => {
        console.log(value);
        console.log("download succ")
        const fileContent = value;

        const decodedBytes = atob(fileContent);
        const decodedArray = new Uint8Array(decodedBytes.length);
        for (let i = 0; i < decodedBytes.length; i++) {
          decodedArray[i] = decodedBytes.charCodeAt(i);
        }

        const blob = new Blob([decodedArray], { type: 'application/octet-stream' });

        saveAs(blob, this.fileDetails.name);
        //TODO: DODATI TOAST
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  close() {
    this.dialogRef.close();
  }

}
