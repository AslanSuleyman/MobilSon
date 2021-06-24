import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Kayit } from 'src/app/models/kayit';
import { Sonuc } from 'src/app/models/test';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  register: FormGroup;
  User: Kayit = new Kayit();
  sonuc: Sonuc = new Sonuc();
  constructor(private fb: FormBuilder, private fbservice: FirebaseService,private location:Location) {}

  onRegister() {
    this.User.username = this.register.value.name;
    this.User.mail = this.register.value.email;
    this.User.password = this.register.value.password;
    this.User.city = this.register.value.city
    if (this.register.valid) {
      this.fbservice.registerUser(this.User).then(
        (res) => {
          console.log(res);
          if (res.user) {
            res.user.updateProfile({
              displayName: this.User.username,
            });
            localStorage.setItem('user', JSON.stringify(res.user));
            this.User.uid = res.user.uid;
            this.fbservice.createUser(this.User);
            this.fbservice.successMessage(
              'Lütfen giriş yapınız.',
              'Kayıt Başarılı'
            );
            this.location.back();
          }
        },
        (err) => {
          this.fbservice.errorMessage(
            'Kayıt olma işleminiz başarısız sonuçlanmıştır.',
            'Bir Hata Oluştu'
          );
          console.log(JSON.stringify(err));
        }
      );
    }
  }

  ngOnInit() {
    this.register = this.fb.group(
      {
        name: this.fb.control('', [
          Validators.required,
          Validators.maxLength(150),
        ]),
        city: this.fb.control('', [
          Validators.required,
          Validators.maxLength(150),
        ]),
        email: this.fb.control('', [Validators.required, Validators.email]),
        password: this.fb.control('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(150),
        ]),
        password_confirm: this.fb.control('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(150),
        ]),
      },
      {
        validators: this.passwordConfirmMatchValidator,
      }
    );
  }

  passwordConfirmMatchValidator(g: FormGroup) {
    const password = g.get('password');
    const password_confirm = g.get('password_confirm');

    if (
      password_confirm.hasError('required') ||
      password_confirm.hasError('minlength')
    )
      return;

    if (password.value !== password_confirm.value) {
      password_confirm.setErrors({
        mismatch: true,
      });
    } else {
      password_confirm.setErrors(null);
    }
  }
}
