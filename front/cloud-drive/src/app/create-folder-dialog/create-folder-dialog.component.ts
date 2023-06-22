import { LambdaService } from './../services/lambda.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-folder-dialog',
  templateUrl: './create-folder-dialog.component.html',
  styleUrls: ['./create-folder-dialog.component.css']
})
export class CreateFolderDialogComponent implements OnInit {

  folderName: FormControl =  new FormControl('', [Validators.required, Validators.pattern(/^\S+$/)]);

  constructor(public dialogRef: MatDialogRef<CreateFolderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lambdaService: LambdaService) { 

    }


  ngOnInit() {
  }

  createFolder() {
    if (this.folderName.valid) {
      this.lambdaService.createFolder(this.folderName.value).subscribe({
        next: (value) => {
          console.log(value);
          this.dialogRef.close();
        },
        error: (err) => {
          console.log(err);
        },
      })
    }
    
  }

  cancel() {
    this.dialogRef.close();
  }

}
