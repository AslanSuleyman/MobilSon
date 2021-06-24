import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Config, MenuController, PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/post';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SelectMenuComponent } from 'src/app/shared/select-menu/select-menu.component';
import { map, catchError } from 'rxjs/operators';

// import { FakerService } from '../../shared/faker/faker.service';
import { MusicController } from '../../shared/music-controller/music-controller.service';
import { CommentPost } from 'src/app/models/comment';

@Component({
  selector: 'app-news',
  templateUrl: 'news.page.html',
  styleUrls: ['news.page.scss'],
  animations: [
    trigger('listAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-10%)', opacity: 0 }),
        animate(
          '500ms ease-in',
          style({ transform: 'translateY(0%)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '500ms ease-in',
          style({ transform: 'translateY(-10%)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class NewsPage {
  stories: any[] = [];
  posts: any[] = [];
  Posts: Observable<Post>;
  activeSegment: FormControl = new FormControl('news');
  show: boolean = false;
  like: boolean = false;
  userInf :any;
  comment: CommentPost = new CommentPost();
  Comments = [];
  segments: any[] = [
    { title: 'News', value: 'news' },
    { title: 'Discover', value: 'discover' },
  ];

  activeDiscover: FormControl = new FormControl('for_you');
  discoverCategories: any[] = [
    { id: 'for_you' },
    { id: 'games' },
    { id: 'sports' },
    { id: 'it' },
    { id: 'photos' },
    { id: 'movies' },
    { id: 'travel' },
    { id: 'music' },
  ];

  musics: any[] = [
    { id: '6545421321', author: 'Silent Partner', song: 'Blue Skies' },
    { id: '7854235678', author: 'Kevin MacLeod', song: 'Life of Riley' },
    { id: '5612785349', author: 'Kevin MacLeod', song: 'Sneaky Snitch' },
  ];

  isIos: boolean;
  specialUID ;
  constructor(
    private config: Config,
    private menu: MenuController,
    private popoverController: PopoverController,
    // private fakerService: FakerService,
    private musicController: MusicController,
    private fbservice: FirebaseService
  ) {}
  ngOnInit(): void {
    this.isIos = this.config.get('mode') === 'ios';

    this.getList();

    var user = localStorage.getItem('user');
    if (user) {
      this.userInf = JSON.parse(localStorage.getItem('user'));
      this.specialUID = this.userInf.uid;
    }


  }

  doRefresh(event) {
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  toggleMenu() {
    this.menu.toggle('camera');
  }

  addLike(post) {
    // this.liked = !this.liked;
    if (post.likeCount && post.likes[this.userInf.uid]) {
      post.likeCount--;
      post.likes[this.userInf.uid] = null;
    } else {
      post.likeCount++;
      if (!post.likes) {
        post.likes = {};
      }
      post.likes[this.userInf.uid] = true;
    }
    this.fbservice.KayitDuzenle(post).then(res => {

    }, err => {
      console.log(JSON.stringify(err));
    })
  }
  getLikeStatus(post) {
    if (post.likes) {
      if (post.likes[this.specialUID])
        return true;
    } else {
      return false;
    }

  }
  toggleComment(item) {
    this.show = !this.show;
    this.fbservice.getComments(item.key).snapshotChanges().subscribe(res => {
      this.Comments = [];
      res.forEach(satir => {
        const y = { ...satir.payload.toJSON(), key: satir.key };
        this.Comments.push(y as CommentPost);
      });
    }
    )
  }

  async openSelect(trigger) {
    const popover = await this.popoverController.create({
      component: SelectMenuComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        trigger: trigger,
      },
      translucent: true,
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  getList() {
    //eğer uygulama ilk çalıştırıldığında cannot get hatası alıyorsanız bu fonksiyonun içini kapatıp çalıştırın uygulama webde açıldıktan sonra bu fonksiyonu açabilirsiniz.
    // this.fbservice.KayitListele().snapshotChanges().pipe(
    //   map(changes =>
    //     changes.map(c =>
    //       ({ key: c.payload.key, ...c.payload.val() })
    //     )
    //   )
    // ).subscribe(data => {
    //   this.Posts = data;

    //   this.Posts.forEach(element => {

    //     this.fbservice.UserListeleByUID(element.creator).snapshotChanges().subscribe(data => {
    //       data.forEach(satir => {
    //         const y = { ...satir.payload.toJSON() };
    //         if (y['city'])
    //           element.from = y['city'];

    //         element.creatorName = y['username'];
    //         this.fbservice.getPhotoByName(y['photo']).subscribe(url => {
    //           element.creatorPhoto = url;
    //         })
    //       });
    //     })
    //   })

    // })

    this.fbservice
      .KayitListele()
      .snapshotChanges()
      .subscribe((res) => {
        this.Posts = res.map((e) => {
          return {
            key: e.payload.key,
            ...e.payload.val(),
          } as Post;
        });
        this.Posts.forEach((element) => {
          this.fbservice
            .UserListeleByUID(element.creator)
            .snapshotChanges()
            .subscribe((data) => {
              data.forEach((satir) => {
                const y = { ...satir.payload.toJSON() };
                if (y['city']) element.from = y['city'];

                element.creatorName = y['username'];
                this.fbservice.getPhotoByName(y['photo']).subscribe((url) => {
                  element.creatorPhoto = url;
                });
              });
            });
        });
        console.log(this.Posts);
      });
  }

  ionViewDidEnter() {
    this.menu.enable(true, 'camera');
  }

  ionViewDidLeave() {
    this.menu.enable(false, 'camera');
  }
}
