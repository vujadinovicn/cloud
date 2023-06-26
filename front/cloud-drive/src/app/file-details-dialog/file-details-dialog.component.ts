import { Component, Inject, OnInit } from '@angular/core';
import { FileMetaData, LambdaService } from './../services/lambda.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as saveAs from 'file-saver';
import { ShareWithOthersFormComponent } from '../share-with-others-form/share-with-others-form.component';

@Component({
  selector: 'app-file-details-dialog',
  templateUrl: './file-details-dialog.component.html',
  styleUrls: ['./file-details-dialog.component.css']
})
export class FileDetailsDialogComponent implements OnInit {
  
  fileDetails: FileMetaData = {} as FileMetaData;
  isSharedFile: boolean = false;

  constructor(public dialogRef: MatDialogRef<FileDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lambdaService: LambdaService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    if (this.data.fileDetails) {
      this.fileDetails = this.data.fileDetails;
    }
    if (this.data.isSharedFile) {
      this.isSharedFile = this.data.isSharedFile;
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
        saveAs(value, this.fileDetails.name);
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

  manageSharing(){
    this.dialog.open(ShareWithOthersFormComponent, {
      data: {fileDetails: this.fileDetails}
    });
  }

}
