import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Publication } from 'src/app/models/publication';
import { AlertService } from 'src/app/services/alert/alert.service';
import { GLOBAL } from 'src/app/services/global';
import { PublicationService } from 'src/app/services/publication.service';
import { UploadService } from 'src/app/services/upload.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public filesToUpload!: Array<File>;
  public identity: any;
  public loading: boolean;
  public publication: any;
  //Output, Make the event available for the parent component
  @Output() public sent = new EventEmitter();
  public stats: any;
  public status: any;
  public token: any;
  public url: any;

  constructor(
    private userService: UserService,
    private publicationService: PublicationService,
    private route: ActivatedRoute,
    private router: Router,
    private uploadService: UploadService,
    private alertService: AlertService
  ) {
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.stats = this.getCounters();
    this.url = GLOBAL.url;
    this.publication = new Publication('', '', '', '', this.identity._id);
    this.loading = true;
  }


  public fileChangeEvent(fileInput: any): void {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  public getCounters(): void {
    this.userService.getCounters(this.identity._id).subscribe(
      {
        next: response => {
          this.stats = response;
        },
        error: err => {
          let errorMessage = <any>err;
          if (errorMessage != null) {
            this.alertService.error(errorMessage);
          }
        }
      });
  }

  public ngOnInit(): void {
    this.loading = false;
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  public onSubmit(form: any, $event: any): void {
    this.loading = true;
    this.publicationService.addPublication(this.token, this.publication).subscribe(
      {
        next: response => {
          if (response.publication) {

            if (this.filesToUpload && this.filesToUpload.length) {
              //UPLOAD IMAGE
              this.uploadService.makeFileRequest(this.url + 'upload-image-publication/' +
                response.publication._id, [], this.filesToUpload, this.token, 'image')
                .then((result: any) => {
                  this.publication.file = result.image;
                  this.loading = false;
                  this.alertService.success('Publication created successfully');
                  // this.toastr.success('Posted correctly');
                  this.getCounters();
                  form.reset();
                  this.router.navigate(['/timeline']);
                  // @ts-ignore
                  this.sent.emit({ send: 'true' });
                });
            } else {
              this.loading = false;
              this.alertService.success('Publication created successfully');
              this.getCounters();
              form.reset();
              this.router.navigate(['/timeline']);
              // @ts-ignore
              this.sent.emit({ send: 'true' });
            }
          } else {
            this.loading = false;
            // this.toastr.error('Not posted.');
            this.alertService.error('Publication not successfully');
          }
        },
        error: err => {
          let errorMessage = <any>err;
          if (errorMessage != null) {
            this.status = 'error';
          }
        }
      });
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  public sendPublication(event: any): void {
    this.sent.emit({ send: 'true' });

  }
}
