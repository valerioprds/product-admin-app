import { Component, OnInit, inject } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
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

  products: Product[] = [];

  // ===== Cerrar Sesion =====
  /* signOut() {
    this.firebaseSvc.signOut();
  } */

  user(): User {
    return this.utilSvc.getFromLocalStorage('user');
  }

/* sirve para ejecutar funcion cada vez que usuario entra a la pagina  */
  ionViewWillEnter() {
    this.getProducts();
  }

  /* obtener productos */

  getProducts() {
    let path = `users/${this.user().uid}/products`;
    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res
        sub.unsubscribe();
      },
    });
  }

  // ===== agregar o acutalizar un producto

  addUpdateProduct() {
    this.utilSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
    });
  }
}
