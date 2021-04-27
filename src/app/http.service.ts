import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getBooks(genra:string) {
    return this.http.get<any>('http://skunkworks.ignitesol.com:8000/books?topic=' + genra + '&mime_type=image/jpeg')
  }

  getNextPage(next:string){
    return this.http.get<any>(next);
  }

  search(text:string , genra:string){
    return  this.http.get<any>('http://skunkworks.ignitesol.com:8000/books?search=' + text +'&topic=' + genra + '&mime_type=image/jpeg')
  }


}
