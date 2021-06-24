import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsPage } from './news.page';
import { NewsPageRoutingModule } from './news-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { PipeModule } from 'src/app/pipes/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    NewsPageRoutingModule,
    PipeModule,
    SharedModule
  ],
  declarations: [NewsPage]
})
export class NewsPageModule { }
