import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Like } from 'src/app/models/like';
import { AlertService } from 'src/app/services/alert/alert.service';
import { GLOBAL } from 'src/app/services/global';
import { LikeService } from 'src/app/services/like.service';
import { PublicationService } from 'src/app/services/publication.service';
import { UserService } from 'src/app/services/user.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  providers: [UserService, PublicationService, LikeService, SidebarComponent]
})
export class TimelineComponent implements OnInit {
  public identity: any;
  public itemsPerPage: any;
  public liked!: boolean;
  //LIKES//
  //public likes: Like[];
  public likes!: any[];
  public loading: boolean;
  //Check if show or no button of Load More
  public noMore = false;
  public page: number;
  public pages: any;
  //public publications: Publication[];
  public publications!: any[];
  public showImage: any;
  public status!: string;
  public title: string;
  public token: any;
  public total: any;
  public url: string;

  constructor(
    private route: ActivatedRoute, private router: Router, private userService: UserService,
    private publicationService: PublicationService, private likeService: LikeService, public sidebar: SidebarComponent,
    private alertService: AlertService
  ) {

    this.title = 'Timeline';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    this.page = 1;
    this.loading = true;
  }

  public addLike(publicationId: any): void {
    let like = new Like('', this.identity._id, publicationId);
    this.likeService.addLike(this.token, like).subscribe({
      next: response => {
        if (response.like) {
          this.updateLikes();
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

  public deletePublication(id: any): void {
    if (window.confirm('Are sure you want to delete this item ?')) {
      this.publicationService.deletePublication(this.token, id).subscribe(
        {
          next: () => {
            this.refresh();
          },

          error: err => {
            let errorMessage = <any>err;
            if (errorMessage != null) {
              this.alertService.error(errorMessage);
            }
          }
        });
    } else {
      //Text to show if the user cancel the action
    }
  }

  public doLike(publication: any, event: any): void {
    if (publication.liked) {
      event.target.src = '../../../assets/images/empty-heart.png';
      this.quitLike(publication._id);
    }

    else if (!publication.liked) {
      event.target.src = '../../../assets/images/liked-heart.png';
      this.addLike(publication._id);
    }
  }

  public getLikes(publicationId: string): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      this.likeService.getLikes(this.token, publicationId).subscribe(
        {
          next: response => {
            if (response.likes) resolve(response.likes);
          },
          error: err => {
            reject(err);
          }
        });
    });
    return promise;
  }

  public getPublications(page: any, adding = false): void {
    this.publicationService.getPublications(this.token, page).subscribe(
      {
        next: response => {
          if (response.publications) {
            this.loading = false;
            this.total = response.total_items;
            this.pages = response.pages;
            this.itemsPerPage = response.items_per_page;

            if (!adding) {
              this.publications = response.publications;
            } else {
              //Array of current page publications
              let arrayA = this.publications;
              //New array of the request
              let arrayB = response.publications;
              //Concat the actual array of publications with the new 
              //array of request (wiht adding parameter) of the button
              this.publications = arrayA.concat(arrayB);

            }
            //UPDATE LIKES COUNTER AND HEART
            this.updateLikes();

            if (page > this.pages) {
              //this._router.navigate(['/timeline']);
            }
          } else {
            this.alertService.error("Error, try again later");
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

  // eslint-disable-next-line unused-imports/no-unused-vars
  public hideThisImage(id: any): void {
    this.showImage = 0;
  }

  public ngOnInit(): void {
    this.getPublications(this.page);
  }

  public quitLike(publicationId: any): void {
    this.likeService.deleteLike(this.token, publicationId).subscribe(
      {
        next: () => {
          this.updateLikes();
        },
        error: err => {
          let errorMessage = <any>err;
          this.alertService.error(errorMessage);
        }
      });
  }

  //This functions comes from the component child Sidebar (Output), when the button post publication is clicked
  // eslint-disable-next-line unused-imports/no-unused-vars
  public refresh(event = null): void {
    this.page = 1;
    this.getPublications(this.page);
    this.noMore = false;
  }

  public showThisImage(id: any): void {
    this.showImage = id;
  }

  public updateLikes(): void {
    this.publications.forEach((publication, index) => {
      // eslint-disable-next-line unused-imports/no-unused-vars
      let likes = this.getLikes(this.publications[index]._id)
        .then((value) => {
          //@ts-ignore
          this.likes = [].concat(value);

          Object.defineProperty(this.publications[index], 'likes', {
            value: this.likes,
            writable: true
          });

          Object.defineProperty(this.publications[index], 'liked', {
            value: false,
            writable: true
          });

          this.likes.forEach((like) => {
            if (like.user._id == this.identity._id) {
              this.publications[index].liked = true;
            }
          });

        }).catch(error => console.log(error));
    });
  }

  //The Button View More
  public viewMore(): void {
    this.page += 1;
    if (this.page == this.pages) {
      this.noMore = true;
    }
    this.getPublications(this.page, true);
  }


















}