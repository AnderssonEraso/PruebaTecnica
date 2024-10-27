import { Injectable, inject } from '@angular/core';
import { SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { SupabaseService } from '../../shared/data-acces/supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _supabaseClient = inject(SupabaseService).supabaseClient;

  session() {
    return this._supabaseClient.auth.getSession();
  }

  signUp(credentials: SignUpWithPasswordCredentials) {
    return this._supabaseClient.auth.signUp(credentials);
  }

  logIn(credentials: SignUpWithPasswordCredentials) {
    return this._supabaseClient.auth.signInWithPassword(credentials);
  }

  signOut() {
    return this._supabaseClient.auth.signOut();
  }
}
