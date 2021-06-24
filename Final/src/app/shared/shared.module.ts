import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

/*
 * Other modules
 */
import { TranslateModule } from '@ngx-translate/core';
import { SelectMenuComponent } from './select-menu/select-menu.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ],
  declarations: [SelectMenuComponent],
  exports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    TranslateModule
  ],
  entryComponents: []
})
export class SharedModule { }
