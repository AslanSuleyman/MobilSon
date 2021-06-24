import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  img: string;
  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    targetWidth: 1280,
    targetHeight: 1280,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
  };

  constructor(
    private menu: MenuController,
    private route: ActivatedRoute,
    private camera: Camera,
    private file: File
  ) {}

  ngOnInit() {}

  takePicture() {
    this.camera.getPicture(this.options).then(
      (imageData) => {
        let filename = imageData.substring(imageData.lastIndexOf('/') + 1);
        let path = imageData.substring(0, imageData.lastIndexOf('/') + 1);
        this.file.readAsDataURL(path, filename).then((data) => {
          this.img = data;
        });
      },
      (err) => {
        // Handle error
      }
    );
  }

  save() {
    console.log('saved');
  }
}
