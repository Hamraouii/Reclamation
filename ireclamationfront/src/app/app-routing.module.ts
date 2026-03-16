import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './views/service/guard/auth.guard';
import { IsNotAuthGuard } from './views/service/guard/is-not-auth.guard';
import { NotfoundComponent } from './views/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';

const routes: Routes = [{
  path: 'app', component: AppLayoutComponent,
  canActivate: [AuthGuard],
  children: [
      { path: '', loadChildren: () => import('./views/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'Reclamation', loadChildren: () => import('./views/components/reclamation/reclamation.module').then(m => m.ReclamationModule) },
  ]
},
{
  path: 'auth',
  canActivate: [IsNotAuthGuard],
   loadChildren: () => import('./views/components/auth/auth.module').then(m => m.AuthModule)
},
{ path: 'notfound', component: NotfoundComponent },
{ path: '**', redirectTo: 'auth' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
