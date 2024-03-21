import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc
        .signIn(this.form.value as User)
        .then((res) => {
          console.log(res);

          this.getUserInfo(res.user.uid);
        })
        .catch((error) => {
          console.log(error);
          this.utilsSvc.presentToast({
            message: error.message,
            color: 'primary',
            duration: 2500,
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  } /* es una peticion asyncrona porque hay then que es una peticion
  que devuelve una promesa y tarda un pelin.
  permite realizar acciones basada en resultado
  de una operacion async como en este caso solicitud a una red....
  pero sin bloquear la ejecucion del codigo. */

  async getUserInfo(uid: string) {
    if (this.form.value) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`;

      this.firebaseSvc
        .getDocument(path)
        .then((user: User) => {
          // mantener datos del usuario en local y enroutar al home
          this.utilsSvc.saveInLocalStorage('user', user);

          this.utilsSvc.routerLink('/main/home');
          this.form.reset();
          this.utilsSvc.presentToast({
            message: `te damos la bienvenida ${user.name}`,
            color: 'primary',
            duration: 1500,
            position: 'middle',
            icon: 'person-circle-outline',
          });
        })
        .catch((error) => {
          console.log(error);
          this.utilsSvc.presentToast({
            message: error.message,
            color: 'primary',
            duration: 2500,
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }
}
