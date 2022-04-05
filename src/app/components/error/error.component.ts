import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  public subtitle: string;
  public title: string;

  constructor() {
    this.title = "ERROR 404";
    this.subtitle = "Not Found";
  }

  public ngOnInit() {

  }
}