import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, DoCheck {

  public title: string;

  constructor() {
    this.title = 'Private Messages';
  }

  public ngDoCheck(): void {

  }

  public ngOnInit(): void {
  }


}
