import { Routes } from "@angular/router";

export default [
  {
    path: '',
    loadComponent: () => import('../cuentas-list/cuentas-list.component'),
  },

  {
    path: '**',
    redirectTo: '',
  },
] as Routes
