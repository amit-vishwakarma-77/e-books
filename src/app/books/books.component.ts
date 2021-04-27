import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HttpService } from '../http.service';
import { Observable, Subject, interval } from 'rxjs';
import { map, debounce, debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  notFound:boolean= false;
  genra: any = '';
  books: any[] = [];
  next: string = '';


  nextTrigger: boolean = true;
  searchTimer: Subject<any> = new Subject();

  constructor(private route: ActivatedRoute, private http: HttpService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.genra = paramMap.get('genra');
      this.getBooksForGenra(this.genra)
    });


    this.searchTimer
            .pipe(debounceTime(500))
            .subscribe((text) => {
                   this.triggerSearch(text);
                }
            );
  }

  getBooksForGenra(genra: string) {
    this.http.getBooks(genra).subscribe(data => {
      this.books = data.results;
      this.next = data.next;
    })
  }

  getNextPage(next: string) {
    this.http.getNextPage(next).subscribe(data => {

      let newBooks: any = data.results;

      for (let newBook of newBooks) {
        this.books.push(newBook);
      }
      this.next = data.next;
      this.nextTrigger = true;
    })
  }

  search(text: any) {
    console.log(text.value)
    this.searchTimer.next(text.value);
  }
  triggerSearch(text: string){
    this.http.search(text, this.genra).subscribe(data => {
      console.log(data);
      if(data.results.length == 0) this.notFound=true;
      this.books = data.results;
      this.next = data.next;
    })
  }

  openDoc(html:string, pdf:string, txt:string, zip:string){
    console.log(html, pdf, txt);
    if(html != undefined) window.open(html, "_blank");
    else if(pdf != undefined) window.open(pdf, "_blank");
    else if(txt != undefined) window.open(txt, "_blank");
    else if(zip != undefined){
       alert('No viewable version available');
      window.open(zip, "_blank");   
    } 
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e: any) {
    let elmnt: any = document.getElementById("body");
    let y = elmnt.scrollHeight;
    if (y < window.pageYOffset + screen.height + 250 && this.nextTrigger == true && this.next != null) {
      this.nextTrigger = false;
      this.getNextPage(this.next)
    }
  }


}
