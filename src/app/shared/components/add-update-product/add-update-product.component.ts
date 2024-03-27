import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {
  @Input() product: Product;
  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', Validators.required),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl(null, [Validators.required, Validators.min(0)]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;

  ngOnInit(): void {
    this.user = this.utilsSvc.getFromLocalStorage('user');

    /* cuando modificamos un producto hay que meter los valores de estos
    productos dentro del formulario */
    if (this.product) this.form.setValue(this.product);
  }

  /* seleccionar o tomar una imagen  */

  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del producto'))
      .dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {
      if (this.product) this.updateProduct();
      else this.createProduct();
    }
  }

  /* convertir valores string a tipo number */
  setNumberInputs() {
    let { soldUnits, price } = this.form.controls;
    if (soldUnits.value) soldUnits.setValue(parseFloat(soldUnits.value));
    if (price.value) price.setValue(parseFloat(price.value));
  }

  /* crear producto */
  async createProduct() {
    let path = `users/${this.user.uid}/products`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    /* subir imagen y obtnere URL  */
    let dataUrl = this.form.value.image;
    let imagePath = `${this.user.uid}/${Date.now()}`;
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);

    delete this.form.value.id;

    this.firebaseSvc
      .addDocument(path, this.form.value)
      .then(async (res) => {
        this.utilsSvc.dismissModal({ success: true });

        this.utilsSvc.presentToast({
          message: 'Producto creado exitosamente',
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
  /* actualizar producto */
  async updateProduct() {
    let path = `users/${this.user.uid}/products/${this.product.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    /* al cambiar la imagen se sube la nueva y obtengo la url,
    pero soloamente si cambio la imagen  */
    if (this.form.value.image !== this.product.image) {
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.product.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }

    delete this.form.value.id;

    this.firebaseSvc
      .updateDocument(path, this.form.value)
      .then(async (res) => {
        console.log('respuesta desde updateProduct ', res);

        this.utilsSvc.dismissModal({ success: true });

        this.utilsSvc.presentToast({
          message: 'Producto actualizado exitosamente',
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
