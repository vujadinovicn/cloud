import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class LambdaService {

  path: string = '';

  constructor(private http: HttpClient, private utilService: UtilService) {
    this.utilService.recieveCurrentPath().subscribe((value) => {
      this.path = value;
    })
  }

  readCurrentFolderContent(): Observable<any> {
    const options: any = {
      responseType: 'json',
    };
    return this.http.get<any>(environment.apiGateway + "/content?foldername=" + this.path, options);
  }
}
