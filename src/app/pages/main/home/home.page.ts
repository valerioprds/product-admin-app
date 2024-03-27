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
  utilsSvc = inject(UtilsService);

  products: Product[] = [];

  // ===== Cerrar Sesion =====
  /* signOut() {
    this.firebaseSvc.signOut();
  } */

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
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
        this.products = res;
        sub.unsubscribe();
      },
    });
  }

  // ===== agregar o acutalizar un producto

  async addUpdateProduct(product?: Product) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product },
    });

    if (success) this.getProducts();
  }

  /* confirmar la eliminacion producto */

  async confirmDeleteProduct(product: Product) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Producto',
      mode:'ios',
      message: '¿Seguro?',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Si, Eliminar',
          handler: () => {
            this.deleteProduct(product);
          },
        },
      ],
    });
  }

  /* eliminar Producto */
  async deleteProduct(product: Product) {
    let path = `users/${this.user().uid}/products/${product.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = await this.firebaseSvc.getFilePath(product.image);
    await this.firebaseSvc.deleteFile(imagePath);

    this.firebaseSvc
      .deleteDocument(path)
      .then(async (res) => {
        console.log('respuesta desde updateProduct ', res);

        this.products = this.products.filter((p) => p.id !== product.id); // devolver la lista de productos pero si el producto que le estoy pasando especificamente
        this.utilsSvc.presentToast({
          message: 'Producto eliminado exitosamente',
          color: 'success',
          duration: 500,
          position: 'middle',
          icon: 'checkmark-circle-outline',
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
