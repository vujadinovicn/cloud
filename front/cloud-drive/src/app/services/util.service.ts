import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  // nema na pocetku / ima na kraju / i ne uzima se u obzir root, to na backu:
  // npr 'pictures/'
  private currentPath: BehaviorSubject<string>;
  private clickedFile: BehaviorSubject<String>;

  constructor() { 
    this.currentPath = new BehaviorSubject<string>('');
    this.clickedFile = new BehaviorSubject<String>('');
  }

  setCurrentPath(val: string) : void {
    this.currentPath.next(val);
  }

  recieveCurrentPath(): Observable<string> {
    return this.currentPath.asObservable();
  }

  setClickedFile(val: String) : void {
    this.clickedFile.next(val);
  }

  recieveClickedFile(): Observable<String> {
    return this.clickedFile.asObservable();
  }
}
