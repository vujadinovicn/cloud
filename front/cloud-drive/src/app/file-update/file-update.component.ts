import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-file-update',
  templateUrl: './file-update.component.html',
  styleUrls: ['./file-update.component.css']
})
export class FileUpdateComponent implements OnInit {

  constructor() { }

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

  ngOnInit(): void {
    this.form.controls['name'].disable();
  }


  onImageSelect(event: any){
    if (event.target.files){
      var reader = new FileReader();
      this.file = event.target.files[0];
      reader.readAsDataURL(this.file);
      reader.onload=(e: any)=>{
        this.profileImgPath = reader.result as string;
      }
      this.form.controls['name'].setValue(this.file.name);
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

}
