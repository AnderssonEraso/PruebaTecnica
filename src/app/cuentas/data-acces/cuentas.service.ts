import { computed, inject, Injectable, signal } from "@angular/core";
import { SupabaseService } from "../../shared/data-acces/supabase.service";

interface Cuenta {
  idcuenta: string;
  numerocuenta: string;
  tipocuenta: string;
  saldoactual: string;
  id_user: string;
}

interface CuentaState {
  cuentas: Cuenta[];
  loading: boolean;
  error: boolean;
}

@Injectable({ providedIn: 'root' })

export class CuentasService {

  private _supabaseClient = inject(SupabaseService).supabaseClient;

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
}
