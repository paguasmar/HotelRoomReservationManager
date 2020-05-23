import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ImageTestService {

  public snippet;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getData()
      .subscribe(data => {
        this.snippet = data;
      });
  }

  getData() {
    return this.http.get('/assets/config.json');
  }

}