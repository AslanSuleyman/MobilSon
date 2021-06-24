import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, MenuController, LoadingController } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@ionic-native/camera-preview/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { map, finalize } from "rxjs/operators";

import { Store, select } from '@ngrx/store';
import { selectTheme } from './shared/settings/settings.selectors';

import { Observable, SubscriptionLike } from 'rxjs';
import { actionSettingsChangeTheme } from './shared/settings/settings.actions';
// import { FakerService } from './shared/faker/faker.service';
import { async } from 'rxjs/internal/scheduler/async';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  theme$: Observable<boolean>;
  isDarkTheme = false;
  isCameraStart = false;
  isCameraFront = false;
  isCameraFlashMode = true;
  cameraFocusPosition = {
    top: 0,
    left: 0,
    show: false
  };

  cameraPreviewOpts: CameraPreviewOptions = {
    x: 0,
    y: 0,
    width: window.screen.width,
    height: window.screen.height,
    camera: 'rear',
    tapPhoto: false,
    tapFocus: false,
    previewDrag: false,
    toBack: true,
    alpha: 1
  };

  pictureOpts: CameraPreviewPictureOptions = {
    width: 1280,
    height: 1280,
    quality: 50
  };
  user;
  private subscriptions: SubscriptionLike[] = [];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private cameraPreview: CameraPreview,
    private screenOrientation: ScreenOrientation,

    private router: Router,

    private store: Store,
    private storage:AngularFireStorage,
    // private fakerService: FakerService,

    private menu: MenuController,
    public loadingController: LoadingController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    // this.translate.setDefaultLang('en');
    // this.fakerService.setLang('en');
    this.theme$ = this.store.pipe(select(selectTheme));
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);
      this.splashScreen.hide();
      this.screenOrientation.unlock();
    });
  }

  toggleDarkTheme() {
    this.store.dispatch(actionSettingsChangeTheme({ isDark: !this.isDarkTheme }));
  }

  async goToSettings() {
    const loading = await this.loadingController.create();
    await loading.present().then(() => {
      this.menu.close().then(() => {
        this.router.navigateByUrl('/tabs/profile/settings').then(async () => {
          await loading.dismiss();
        });
      });
    });
  }

  closeCameraSide(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    this.menu.close('camera');
  }

  onOpenCameraMenu() {
    this.isCameraStart = true;
    this.cameraPreviewOpts = { ...this.cameraPreviewOpts, camera: 'rear', width: window.screen.width, height: window.screen.height };

    this.cameraPreview.startCamera(this.cameraPreviewOpts).then(async (res) => {
      await this.cameraPreview.setFlashMode(this.isCameraFlashMode ? this.cameraPreview.FLASH_MODE.ON : this.cameraPreview.FLASH_MODE.OFF);
      console.log(res)
    },
      (err) => {
        console.log(err)
      });
  }

  onCloseCameraMenu() {
    this.isCameraStart = false;
    this.cameraPreview.stopCamera();
  }

  switchCamera(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    console.log('switchCamera');
    this.cameraPreview.switchCamera().then(async () => {
      this.isCameraFront = !this.isCameraFront;
      if (!this.isCameraFront) {
        await this.cameraPreview.setFlashMode(this.isCameraFlashMode ? this.cameraPreview.FLASH_MODE.ON : this.cameraPreview.FLASH_MODE.OFF);
      }
    });
  }

  uploadProgress$: Observable<number>
  downloadURL: Observable<string>;
  url ;
  takePicture(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    console.log('takePicture');
    var isProfile = localStorage.getItem('forProfile');
    // take a picture
    this.cameraPreview.takePicture(this.pictureOpts).then((imageData) => {
      const img = 'data:image/jpeg;base64,' + imageData;
      // console.log(img);
      var n = Date.now();
      const filePath = `PostImages/${n}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(`PostImages/${n}`, img);
      this.uploadProgress$ = task.percentageChanges();
      task
        
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(url => {
              if (url) {
                this.url = url;
              }
              this.router.navigate(['/send-post/',this.url]);
            });
          })
        )
        .subscribe(url => {
          if (url) {
          }
        });
    

      this.menu.close('camera');
    }, (err) => {
      console.log(err);
    });
  }

  switchFlashMode(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    console.log('switchFlashMode');
    this.isCameraFlashMode = !this.isCameraFlashMode;
    this.cameraPreview.setFlashMode(this.isCameraFlashMode ? this.cameraPreview.FLASH_MODE.ON : this.cameraPreview.FLASH_MODE.OFF);
  }

  getCameraFocusCoordinates(event) {
    this.cameraFocusPosition.top = event.clientY;
    this.cameraFocusPosition.left = event.clientX;
    this.cameraFocusPosition.show = false;
    this.cameraFocusPosition.show = true;

    console.log(this.cameraFocusPosition);

    this.cameraPreview.tapToFocus(event.clientX || 0, event.clientY || 0).finally(() => {
      setTimeout(() => {
        this.cameraFocusPosition.show = false;
      }, 400);
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.theme$.subscribe((isDark) => {
        this.isDarkTheme = isDark;
      })
    );
    this.user = JSON.parse(localStorage.getItem('user'));
    this.subscriptions.push(
      this.screenOrientation.onChange().subscribe(async () => {
        await this.cameraPreview.stopCamera();
        this.cameraPreviewOpts = { ...this.cameraPreviewOpts, width: window.screen.width, height: window.screen.height };

        this.cameraPreview.startCamera(this.cameraPreviewOpts).then(async (res) => {
          await this.cameraPreview.setFlashMode(this.isCameraFlashMode ? this.cameraPreview.FLASH_MODE.ON : this.cameraPreview.FLASH_MODE.OFF);
          console.log(res)
        },
          (err) => {
            console.log(err)
          });
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }
}
