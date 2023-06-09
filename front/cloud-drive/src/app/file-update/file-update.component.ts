import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileMetaData, LambdaService } from './../services/lambda.service';
import { UtilService } from '../services/util.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-file-update',
  templateUrl: './file-update.component.html',
  styleUrls: ['./file-update.component.css']
})
export class FileUpdateComponent implements OnInit {
  

  constructor(private lambdaService: LambdaService,
    private utilService: UtilService,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar) { }

  form = new FormGroup({
    name: new FormControl('', [Validators.required,]),
    description: new FormControl('', [Validators.required,]),
    tag: new FormControl('', [Validators.required,]),
  }, [])

  tags: String[] = []
  size: String = '0kb'

  profileImgPath: string = "";
  file: File = {} as File;
  path: string = '';

  fileDetails: FileMetaData = {} as FileMetaData;

  ngOnInit(): void {
    this.form.controls['name'].disable();

    this.utilService.recieveCurrentPath().subscribe((value) => {
      this.path = value;
    })

    this.utilService.recieveClickedFile().subscribe((file) => {
      console.log(file);
      let filenameToSend = file;
      this.lambdaService.readFileDetails(filenameToSend).subscribe({
        next: (value: FileMetaData) => {
          console.log(value);
          this.fileDetails = value;
          this.form.controls['name'].setValue(this.fileDetails.id.split('/')[this.fileDetails.id.split('/').length - 1]);
          this.form.controls['description'].setValue(this.fileDetails.description);
          this.tags = this.fileDetails.tags;
          this.size = this.fileDetails.size + 'kb';

        },
        error: (err) => {
          console.log(err);
          this.router.navigate(['/homepage']);
        },
      })
    })
  }


  onImageSelect(event: any){
    if (event.target.files){
      var reader = new FileReader();
      this.file = event.target.files[0];
      reader.readAsDataURL(this.file);
      reader.onload=(e: any)=>{
        this.profileImgPath = reader.result as string;
      }
      // this.form.controls['name'].setValue(this.file.name);
      this.size = Math.round(this.file.size/1024).toString() + 'kB';
    }
  }


  remove_tag(name: String): void {
    this.tags = this.tags.filter(item => item != name);
  }

  add_tag(): void {
    if (this.form.value.tag) {
      if (!this.tags.includes(this.form.value.tag)) {
        this.tags.push(this.form.value.tag)
      }  
    }
  }

  save(): any{
    this.updateMetadata().subscribe((res: any) => {
      console.log(res);
    });
    // this.updateContent().subscribe((res: any) => {
    //   console.log(res);
    // });
  }

  updateMetadata(): Observable<any>{
    const options: any = {
      responseType: 'json',
    };

    let s = this.fileDetails.size;
    if (this.profileImgPath != "") {
      s = this.file.size;
    }
    let o = {
      id: this.fileDetails.id,
      name: this.form.value.name,
      lastModified:  this.fileDetails.lastModified,
      type: this.fileDetails.type, 
      size: s,
      createdAt: this.fileDetails.createdAt,
      description: this.form.value.description,
      tags: this.tags
    }
    console.log(o);
    return this.http.post<any>(environment.apiGateway + '/metadata', o, options);
  }

  updateContent(): Observable<any> {
    console.log(this.path +  this.form.controls['name'].value);
    const options: any = {
      responseType: 'json',
    };
    return this.http.post<any>(environment.apiGateway + "/file?filename=" + this.path +  this.form.controls['name'].value, this.profileImgPath, options);
  }

  updateFile() {
    let s = this.fileDetails.size;
    if (this.profileImgPath != "") {
      s = this.file.size;
    }
    let o = {
      id: this.fileDetails.id,
      name: this.fileDetails.name,
      lastModified:  this.fileDetails.lastModified,
      type: this.fileDetails.type, 
      size: s,
      createdAt: this.fileDetails.createdAt,
      description: this.form.value.description,
      tags: this.tags,
      content: this.profileImgPath
    }
    this.lambdaService.updateFileT(o).subscribe({
      next: (value: any)  => {
        console.log(value);
        this.snackBar.open("Successfully updated file!", "", {
          duration: 2700,
        });
      },
      error: (err) => {
        console.log(err);
        this.snackBar.open(err.error, "", {
          duration: 2700,
        });
      },
    })
  }

}
