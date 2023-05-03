import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  constructor(private http: HttpClient) { }

  profileImgPath: string = "";
  file: File = {} as File;

  ngOnInit(): void {
  }

  onImageSelect(event: any){
    if (event.target.files){
      var reader = new FileReader();
      this.file = event.target.files[0];
      reader.readAsDataURL(this.file);
      reader.onload=(e: any)=>{
        this.profileImgPath = reader.result as string;
      }
    }
  }


  save(): any{
    this.add().subscribe((res: any) => {
      console.log(res);
    });;
    this.edit().subscribe((res: any) => {
      console.log(res);
    }) 
  }

  add(): Observable<any> {
    const options: any = {
      responseType: 'json',
    };
    return this.http.post<any>(environment.apiGateway + "/file?filename=" + "iksdsi"+this.file.name, this.profileImgPath, options);
  }

  edit(): Observable<any>{
    const options: any = {
      responseType: 'json',
    };
    let o = {
      id: "ss",
      name: this.file.name,
      lastModified:  new Date().toISOString().split('T')[0],
      type: this.file.type, 
      size: this.file.size,
      createdAt: new Date().toISOString().split('T')[0],
      description: "aaabbababa",
      tags: ["a", "b", "c"]
    }
    return this.http.post<any>(environment.apiGateway + '/metadata', o, options);
  }

}
