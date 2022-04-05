import { Component, DoCheck, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, DoCheck {
  public identity!: any;
  public title: string;
  public url: string;

  constructor(private route: ActivatedRoute, private router: Router,
    private userService: UserService, private titleService: Title) {
    this.title = 'Social-Network-Project';
    this.url = GLOBAL.url;
    this.titleService.setTitle(this.title);
  }

  // Logout user
  public lougout(): void {
    // Clear user identity and token from local storage
    localStorage.clear();
    //  Clear user identity variable
    this.identity = null;
    // Redirect to login page
    this.router.navigate(['/']);
  }

  // With any change in components, refresh variables
  public ngDoCheck(): void {
    // Call User Service to get user identity if available in global component
    this.identity = this.userService.getIdentity();
  }

  public ngOnInit():void {
    // Call User Service to get user identity if available in global component
    this.identity = this.userService.getIdentity();
  }
}

