import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SendPostPageRoutingModule } from './send-post-routing.module';

import { SendPostPage } from './send-post.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SendPostPageRoutingModule
  ],
  declarations: [SendPostPage]
})
export class SendPostPageModule {}
