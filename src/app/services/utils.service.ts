import { Injectable, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  loadingCtrl = inject(LoadingController);


  // ======== loading ==========


  loading() {
    return this.loadingCtrl.create({spinner: 'crescent'})
  }
}
