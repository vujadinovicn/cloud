import { LambdaService } from './../services/lambda.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-create-folder-dialog',
  templateUrl: './create-folder-dialog.component.html',
  styleUrls: ['./create-folder-dialog.component.css']
})
export class CreateFolderDialogComponent implements OnInit {

  folderName: FormControl =  new FormControl('', [Validators.required, Validators.pattern(/^\S+$/)]);
  path: string = '';

  constructor(public dialogRef: MatDialogRef<CreateFolderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lambdaService: LambdaService,
    private utilService: UtilService) { 

    }


  ngOnInit() {
    this.utilService.recieveCurrentPath().subscribe((value) => {
      this.path = value;
    })
  }

  createFolder() {
    if (this.folderName.valid) {
      let o = {
        id: this.path + this.folderName.value + '/',
        name: this.folderName.value,
        lastModified:  new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0],
      }
      this.lambdaService.createFolder(this.folderName.value, o).subscribe({
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
