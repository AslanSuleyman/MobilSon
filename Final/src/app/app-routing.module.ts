import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import  {AngularFireAuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard'

const redirectLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectLogin,
    },
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'bookmarks',
    loadChildren: () => import('./pages/bookmarks/bookmarks.module').then(m => m.BookmarksPageModule)
  },
  {
    path: 'stories',
    loadChildren: () => import('./pages/stories/stories.module').then(m => m.StoriesPageModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthPageModule)
  },
  {
    path: 'send-post/:img',
    loadChildren: () => import('./pages/send-post/send-post.module').then( m => m.SendPostPageModule)
  },
  {
    path: 'edit-profile/:img',
    loadChildren: () => import('./pages/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'edit-post',
    loadChildren: () => import('./pages/edit-post/edit-post.module').then( m => m.EditPostPageModule)
  },
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
