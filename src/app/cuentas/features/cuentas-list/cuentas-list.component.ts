import { AfterViewInit, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/data-acces/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CuentasService } from '../../data-acces/cuentas.service';

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

  CuentasService = inject(CuentasService);

  async logOut() {
    await this._authService.signOut();
    this._router.navigateByUrl('/auth/log-in');
  }

  ngAfterViewInit() {
    this.CuentasService.getAllCuentas();
  }

}
