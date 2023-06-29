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
    this.folders = [];
    this.currentFilePath = this.data.filePath;
    this.lambdaService.getAllFoldersByUsername().subscribe({
      next: (res) => {
        console.log(res);
        for( let id of res.ids) {
          this.folders.push(id['S'])
        }

        
      },
      error: (err) => {
        console.log(err);
        this.snackBar.open(err.error, "", {
          duration: 2700, panelClass: ['snack-bar-back-error']
        })
      },
    })
  }

  itemSelected(folder: any){
    this.selectedFolder = folder;
  }

  move() {
    if (this.selectedFolder != "") {
        console.log(this.selectedFolder)
        console.log(this.currentFilePath)
        let data = {
          filePath: this.currentFilePath,
          folderPath: this.selectedFolder
        }
        this.lambdaService.moveFile(data).subscribe({
          next: (res) => {
            console.log(res);
            this.snackBar.open("Successfully moved file!", "", {
              duration: 2700, panelClass: ['snack-bar-success']
            });
            this.dialogRef.close();
          },
          error: (err) => {
            console.log(err);
            this.snackBar.open(err.error, "", {
              duration: 2700, panelClass: ['snack-bar-back-error']
            })
          },
        })
    }
    else {
      this.snackBar.open("Please, select folder.", "", {
        duration: 2700, panelClass: ['snack-bar-front-error']
      })
    }
  }

}
