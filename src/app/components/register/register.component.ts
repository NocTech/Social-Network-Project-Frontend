import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AlertService } from 'src/app/services/alert/alert.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public status!: string;
  public title: string;
  public user: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.title = 'Register';
    this.user = new User("", "", "", "", "", "", "ROLE_USER", "");
  }

  public ngOnInit() {

  }

  public onSubmit(form: any) {
    /*The subscribe method of Observable to take the response from the API*/
    this.userService.register(this.user).subscribe(
      {
        next: response => {
          //Check if the response comes with an user and an user _id
          if (response.user && response.user._id) {
            this.alertService.success('User created successfully');
            // this.status = 'success';
            //Reset all the form inputs
            form.reset();
          } else {
            this.alertService.error("User not created");
            // this.status = 'error';
          }
        },
        error: err => {
          this.alertService.error(err);
          // console.log('ERROR: ' + <any>error);
        }
      });
  }
}
