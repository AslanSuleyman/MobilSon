import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabsPageRoutingModule } from './tabs-routing.module';
import { TabsPage } from './tabs.page';

import { SharedModule } from '../shared/shared.module';
import { PipeModule } from '../pipes/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    TabsPageRoutingModule,
    PipeModule.forRoot(),
    SharedModule
  ],
  declarations: [TabsPage],
})
export class TabsPageModule { }
