import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Kayit } from 'src/app/models/kayit';
import { Sonuc } from 'src/app/models/test';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  login: FormGroup;
  sonuc: Sonuc = new Sonuc();
  constructor(
    private fb: FormBuilder,
    private fbservice:FirebaseService,
    private router:Router,

  ) { }

  onLogin() {
    if (this.login.valid) {
      this.fbservice.OturumAc(this.login.value.email,this.login.value.password ).then(res => {
        if (res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
          this.router.navigateByUrl("/tabs/news");
          this.fbservice.successMessage('Giriş Başarılı','');
        }
  
      }, err => {
        this.fbservice.errorMessage('Bilgileriniz eksik veya hatalı, lütfen doğru kullanıcı ile giriş yaptığınızdan emin olun.', 'Giriş Yapılamadı.')
        console.log(JSON.stringify(err));
      })
    }
  }

  ngOnInit() {
    this.login = this.fb.group({
      email: this.fb.control('', [
        Validators.required,
        Validators.email
      ]),
      password: this.fb.control('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(150)
      ])
    });
  }

}
