import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-send-post',
  templateUrl: './send-post.page.html',
  styleUrls: ['./send-post.page.scss'],
})
export class SendPostPage implements OnInit {
 
  img:string;
  
  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private menu: MenuController,

    ) { }

  ngOnInit() {
    this.route.params.subscribe(res=>{
     if (res.img){
      this.img = res.img;
     }
    })
  }
  takePicture(event: Event) {

 this.menu.open('camera');
  }
}
