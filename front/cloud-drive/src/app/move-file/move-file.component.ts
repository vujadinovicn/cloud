import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LambdaService } from '../services/lambda.service';


@Component({
  selector: 'app-move-file',
  templateUrl: './move-file.component.html',
  styleUrls: ['./move-file.component.css', '../share-with-others-form/share-with-others-form.component.css']
})
export class MoveFileComponent implements OnInit {

  folders : String[] = []

  selectedFolder: string = "";

  currentFilePath: string = "";
  
  constructor(public dialogRef: MatDialogRef<MoveFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lambdaService: LambdaService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.currentFilePath = this.data.filePath;
    this.lambdaService.getAllFilesByUsername().subscribe({
      next: (res) => {
        console.log(res);
        this.folders = res.ids;
        
      },
      error: (err) => {
        console.log(err);
        this.snackBar.open(err.error, "", {
          duration: 2700
        })
      },
    })
  }

  itemSelected(folder: any){
    this.selectedFolder = folder;
  }

}
