import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AlertService } from 'src/app/services/alert/alert.service';
import { GLOBAL } from 'src/app/services/global';
import { UploadService } from 'src/app/services/upload.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  public filesToUpload!: Array<File>;
  public identity;
  public status!: string;
  public title: string;
  public token;
  public url: string;
  public user: User;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService,
    private uploadService: UploadService, private alertService: AlertService) {
    this.title = 'Your Account';
    this.user = this.userService.getIdentity();
    this.identity = this.user;
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
  }

  public fileChangeEvent(fileInput: any): void {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  public ngOnInit(): void {
  }

  public onSubmit(): void {
    this.userService.updateUser(this.user).subscribe({
      next: response => {
        if (!response.user) {
          this.alertService.error('Error updating user');
        } else {
          this.alertService.success('User updated successfully');
          localStorage.setItem('identity', JSON.stringify(this.user));
          this.identity = this.user;

          //IMAGE UPLOAD
          this.uploadService.makeFileRequest(this.url + 'upload-image-user/' + this.user._id,
            [], this.filesToUpload, this.token, 'image').then((result: any) => {
              this.user.image = result.user.image;
              localStorage.setItem('identity', JSON.stringify(this.user));
            });
        }
      },
      error: err => {
        let errorMessage = <any>err;

        if (errorMessage != null) {
          this.alertService.error(errorMessage);
        }
      }
    });
  }
}