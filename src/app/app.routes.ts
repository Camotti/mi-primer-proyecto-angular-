import { Routes } from '@angular/router';
import { UsuarioComponent } from './usuario/usuario';


export const routes: Routes = [
  { path: 'usuarios', component: UsuarioComponent },
  { path: '', redirectTo: 'usuarios', pathMatch: 'full' } // Redirige al inicio a usuarios
];
