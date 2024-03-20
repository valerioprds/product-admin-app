import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';

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
  ngOnInit() {
    console.log('AuthPage');
  }

  submit() {
    if (this.form.value) {
      this.firebaseSvc
        .signin(this.form.value as User)
        .then((res) => console.log(res));
    }
  } /* es una peticion asyncrona porque hay then que es una peticion
  que devuelve una promesa y tarda un pelin.
  permite realizar acciones basada en resultado
  de una operacion async como en este caso solicitud a una red....
  pero sin bloquear la ejecucion del codigo. */
}
