import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  // ===== Cerrar Sesion =====
  signOut() {
    this.firebaseSvc.signOut();
  }

  // ===== agregar o acutalizar un producto

  addUpdateProduct() {
    this.utilSvc.presentModal({
      component: AddUpdateProductComponent,
    });
  }
}
