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
export class AuthPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
    console.log('AuthPage');
  }

  async submit() {
    if (this.form.value) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc
        .signin(this.form.value as User)
        .then((res) => console.log(res))
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
