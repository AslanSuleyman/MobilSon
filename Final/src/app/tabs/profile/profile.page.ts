import { ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { IonSlides, MenuController } from '@ionic/angular';
import { Kayit } from 'src/app/models/kayit';
import { Post } from 'src/app/models/post';
import { FirebaseService } from 'src/app/services/firebase.service';
// import { FakerService } from 'src/app/shared/faker/faker.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})
export class ProfilePage {
  @ViewChild('slides') slide: IonSlides;
  // user = {
  //   full_name: '',
  //   nickname: '',
  //   image: '',
  //   status: '',
  //   online: false,
  //   isMobileOnline: true
  // };
  slidesOptions = {
    initialSlide: 1,
    autoHeight: true,
    speed: 1000,
    loop: false,
  };
  like = false;
  segment = 0;
  user;
  userInf;
  User: Kayit;
  Post: Post = new Post();
  Posts = [];
  postCount = 0;

  constructor(
    private menu: MenuController,
    private fbservice: FirebaseService
  ) // private fakerService: FakerService
  {}

  toggleMenu() {
    this.menu.toggle('profile');
  }

  toggleLike() {
    this.like = !this.like;
  }

  doRefresh(event) {
    setTimeout(() => {
      // this.getUser();
      event.target.complete();
    }, 500);
  }

  // getUser() {
  // this.fakerService.getFaker().then((faker) => {
  //   this.user.full_name = faker.name.findName();
  //   this.user.image = faker.internet.avatar();
  //   this.user.status = faker.lorem.word();
  //   this.user.online = faker.random.boolean();
  //   this.user.isMobileOnline = faker.random.boolean();
  //   this.user.nickname = this.user.full_name.toLocaleLowerCase().split(' ').join('_');
  // });
  // }
  ngOnInit(): void {
    // this.getUser();;
    var user = localStorage.getItem('user');
    if (user) {
      this.userInf = JSON.parse(localStorage.getItem('user'));
      this.getUser();
      this.getPostsCount()
    }
  }

  getUser() {
    this.fbservice.UserListeleByUID(this.userInf.uid).snapshotChanges().subscribe(data => {
      data.forEach(satir => {
        const y = { ...satir.payload.toJSON(), key: satir.key };
        this.User = y as Kayit;
        console.log(this.User);
        this.getLikedPosts();
      });
    })
  }

  getPostsCount(){
    this.fbservice.KayitListeleByUID(this.userInf.uid).snapshotChanges().subscribe(data => {
      
      data.forEach(satir => {
        const y = { ...satir.payload.toJSON(), key: satir.key };
        this.postCount++;
        
      });
    });
  }
  getLikedPosts() {
    // this.fbservice.KayitListele().snapshotChanges().pipe(
    //   map(changes =>
    //     changes.map(c =>
    //       ({ key: c.payload.key, ...c.payload.val() })
    //     )
    //   )
    // ).subscribe(data => {
    //   console.log(this.User.uid);
    //   console.log(data);
    //   data.forEach(element=>{
    //     if(element.likes){
    //       if(element.likes[this.User.uid]){
    //         this.Posts.push(element as Post);
    //       }
    //     }

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
          if (element.likes) {
            if (element.likes[this.User.uid]) {
              this.Posts.push(element as Post);
            }
          }
          console.log(this.Posts);
        });
      });
  }

  ionViewDidEnter() {
    this.menu.enable(true, 'profile');
  }

  ionViewDidLeave() {
    this.menu.enable(false, 'profile');
  }

  slideChanged(event) {
    this.slide.getActiveIndex().then((res) => {
      console.log(res);
      this.segment = res;
    });
  }
  segmentChanged(event) {
    this.slide.slideTo(event.detail.value);
  }
}
