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

  readCurrentFolderContent(fullPath: String): Observable<any> {
    const options: any = {
      responseType: 'json',
    };
    return this.http.get<any>(environment.apiGateway + "/folder?foldername=" + fullPath, options);
  }

  createFolder(name: string, folderMetaData: any): Observable<any> {
    const options: any = {
      responseType: 'json',
    };
    console.log(this.path)
    console.log(folderMetaData)
    return this.http.post<any>(environment.apiGateway + "/folder?foldername=" + this.path + name, folderMetaData, options);
  }

  createFile(file: any): Observable<any> {
    const options: any = {
      responseType: 'json',
    };
    console.log(file)
    return this.http.post<any>(environment.apiGateway + "/create-file", file, options);
  }

  updateFileT(file: any): Observable<any> {
    const options: any = {
      responseType: 'json',
    };
    console.log(file)
    return this.http.post<any>(environment.apiGateway + "/update-file", file, options);
  }

  deleteFolder(name: String): Observable<any> {
    const options: any = {
      responseType: 'json',
    };
    return this.http.delete<any>(environment.apiGateway + "/folder?foldername=" + name.slice(0, name.length-1), options);
  }

  deleteFile(name: String): Observable<any> {
    const options: any = {
      responseType: 'json',
    };
    return this.http.delete<any>(environment.apiGateway + "/file?filename=" + name, options);
  }

  readFileDetails(name: String): Observable<any> {
    const options: any = {
      responseType: 'json',
    };
    return this.http.get<any>(environment.apiGateway + "/file?filename=" + name, options);
  }

  readFolderDetails(name: String): Observable<any> {
    const options: any = {
      responseType: 'json',
    };
    return this.http.get<any>(environment.apiGateway + "/folder-metadata?foldername=" + this.path + name, options);
  }

  downloadFile(id: String): Observable<any> {
    return this.http.get<any>(environment.apiGateway + "/file-download?id=" + id);
  }

  getUserByUsername(username: String): Observable<any>{
    return this.http.get<any>(environment.apiGateway + "/user?username=" + username);
  }

  updateFile(file: any): Observable<any>{
    const options: any = {
      responseType: 'json',
    };
    return this.http.post<any>(environment.apiGateway + '/metadata', file, options);
  }

  updateFolderMetadata(folder: any): Observable<any>{
    const options: any = {
      responseType: 'json',
    };
    return this.http.post<any>(environment.apiGateway + '/metadata-folder', folder, options);
  }

  getSharedFilesByUsername(): Observable<any> {
    return this.http.get<any>(environment.apiGateway + "/shared-files");
  }

  getSharedFoldersByUsername(): Observable<any> {
    return this.http.get<any>(environment.apiGateway + "/shared-folders");
  }

  registerFamilyMember(creds: any): Observable<any> {
    return this.http.post<any>(environment.apiGateway + "/family-registration", creds);
  }

  sendFamilyInvitationAnswer(idDinamo: any, isAccepted: any): Observable<any>{
    const options: any = {
      responseType: 'json',
    };
    return this.http.put<any>(environment.apiGateway + '/family-invitation-answer?id_dinamo='+idDinamo+'&approval='+isAccepted, options);
  }

  getAllFilesByUsername(): Observable<any> {
    return this.http.get<any>(environment.apiGateway + "/all-files");
  }

  getAllFoldersByUsername(): Observable<any> {
    return this.http.get<any>(environment.apiGateway + "/all-folders");
  }

  register(creds: any): Observable<any> {
    return this.http.post<any>(environment.apiGateway + "/register", creds);
  }

  moveFile(data: any): Observable<any> {
    return this.http.post<any>(environment.apiGateway + "/move-file", data);
  }

  sendInvitationToFamily(email: string): Observable<any> {
    return this.http.post<any>(environment.apiGateway + "/family-invitation", {'family-email': email});
  }
}

export interface FileMetaData {
  id: string,
  createdAt: string,
  description: string,
  lastModified: string,
  name: string,
  size: number,
  tags: string[],
  type: string,
  sharedWith: string[]
}

export interface FolderMetaData {
  id: string,
  createdAt: string,
  lastModified: string,
  name: string,
  sharedWith: string[]
}

export interface FileContent {
  id: string,
  createdAt: string,
  description: string,
  lastModified: string,
  name: string,
  size: number,
  tags: string[],
  type: string,
  sharedWith: string[],
  content: string
}
