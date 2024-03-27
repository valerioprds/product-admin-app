import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc
        .sendRecoveryEmail(this.form.value.email)
        .then((res) => {
          this.utilsSvc.presentToast({
            message: 'EMAIL ENVIADO CORRECTAMENTE',
            color: 'primary',
            duration: 1500,
            position: 'middle',
            icon: 'mail-outline',
          });
          // this.utilsSvc.routerLink('/auth');
          //this.form.reset();
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
}
