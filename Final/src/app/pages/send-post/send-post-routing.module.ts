import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendPostPage } from './send-post.page';

const routes: Routes = [
  {
    path: '',
    component: SendPostPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendPostPageRoutingModule {}
