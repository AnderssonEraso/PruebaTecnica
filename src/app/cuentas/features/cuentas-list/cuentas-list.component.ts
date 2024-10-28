import { AfterViewInit, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/data-acces/auth.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cuenta, CuentasService } from '../../data-acces/cuentas.service';
interface CuentaForm {
  tipocuenta: FormControl<string | null>;
  saldoactual: FormControl<string | null>;
}
@Component({
  selector: 'app-cuentas-list',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cuentas-list.component.html',
  styles: ``
})
export default class CuentasListComponent implements AfterViewInit {
  private _authService = inject(AuthService);

  private _router = inject(Router);

  private _formBuilder = inject(FormBuilder);

  CuentasService = inject(CuentasService);
  CuentaSelected: Cuenta | null = null;

  form = this._formBuilder.group<CuentaForm>({
    tipocuenta: this._formBuilder.control(null, Validators.required),
    saldoactual: this._formBuilder.control(null, Validators.required),
  })

  async logOut() {
    await this._authService.signOut();
    this._router.navigateByUrl('/auth/log-in');
  }

  ngAfterViewInit() {
    this.CuentasService.getAllCuentas();
  }

  newCuenta() {
    if (this.form.invalid) return;

    if (this.CuentaSelected) {
      this.CuentasService.updateCuenta({
        tipocuenta: this.form.value.tipocuenta ?? '',
        saldoactual: this.form.value.saldoactual ?? '',
        idcuenta: this.CuentaSelected.idcuenta,
      });
    } else {

      this.CuentasService.insertCuenta({
        tipocuenta: this.form.value.tipocuenta ?? '',
        saldoactual: this.form.value.saldoactual ?? '',
      });
    }
    this.form.reset();
    this.CuentaSelected = null;

  }

  editCuenta(cuenta: Cuenta) {
    this.CuentaSelected = cuenta;
    console.log(this.CuentaSelected)
    this.form.setValue({
      tipocuenta: this.CuentaSelected.tipocuenta,
      saldoactual: this.CuentaSelected.saldoactual,
    });
  }
  deleteCuenta(cuenta:Cuenta){
  this.CuentasService.deleteCuenta(cuenta.idcuenta);
  }
}
