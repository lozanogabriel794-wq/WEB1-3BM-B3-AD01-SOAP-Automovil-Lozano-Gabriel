import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Vehiculos } from './components/vehiculos/vehiculos';
import { Mantenimientos } from './components/mantenimientos/mantenimientos';
import { Categorias } from './components/categorias/categorias';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'categorias', component: Categorias },
  { path: 'vehiculos', component: Vehiculos },
  { path: 'mantenimientos', component: Mantenimientos }
];
