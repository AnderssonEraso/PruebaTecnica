import { computed, inject, Injectable, signal } from "@angular/core";
import { SupabaseService } from "../../shared/data-acces/supabase.service";
import { AuthService } from "../../auth/data-acces/auth.service";
import { __values } from "tslib";

export interface Cuenta {
  idcuenta: string;
  numerocuenta: string;
  tipocuenta: string;
  saldoactual: string;
  user_id: string;
}

interface CuentaState {
  cuentas: Cuenta[];
  loading: boolean;
  error: boolean;
}

@Injectable({ providedIn: 'root' })

export class CuentasService {

  private _supabaseClient = inject(SupabaseService).supabaseClient;
  private _authService = inject(AuthService);

  private _state = signal<CuentaState>({
    cuentas: [],
    loading: false,
    error: false
  });

  cuentas = computed(() => this._state().cuentas);
  loading = computed(() => this._state().loading);
  error = computed(() => this._state().error);


  async getAllCuentas() {
    try {
      this._state.update((state) => ({
        ...state,
        loading: true,
      }));
      const { data: { session } } = await this._authService.session();
      const { data } = await this._supabaseClient.from('cuentas').select().returns<Cuenta[]>();
      console.log(data);

      if (data) {
        this._state.update((state) => ({
          ...state,
          cuentas: data,
        }));
      }
    } catch (error) {
      this._state.update((state) => ({
        ...state,
        error: true,
      }));
    } finally {
      this._state.update((state) => ({
        ...state,
        loading: false,
      }));
    }
  }
  async insertCuenta(cuenta: { tipocuenta: string, saldoactual: string }) {
    try {
      const { data: { session } } = await this._authService.session();

      const response = await this._supabaseClient.from('cuentas').insert({
        user_id: session?.user.id,
        tipocuenta: cuenta.tipocuenta,
        saldoactual: cuenta.saldoactual,
      });
      console.log(response);
      this.getAllCuentas();
    } catch (error) {

    }

  }
  async updateCuenta(cuenta: { tipocuenta: string, saldoactual: string, idcuenta: string }) {
    try {
      await this._supabaseClient
        .from('cuentas')
        .update({
          tipocuenta: cuenta.tipocuenta,
          saldoactual: cuenta.saldoactual,
        })
        .eq('idcuenta', cuenta.idcuenta);
      this.getAllCuentas();
    } catch (error) {

    }
  }

  async deleteCuenta(idcuenta: string){
    try {
      await this._supabaseClient
        .from('cuentas')
        .delete()
        .eq('idcuenta', idcuenta);
      this.getAllCuentas();
    } catch (error) {

    }
  }
}
