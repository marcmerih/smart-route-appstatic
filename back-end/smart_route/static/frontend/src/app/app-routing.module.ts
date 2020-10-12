import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountsComponent } from './accounts/accounts.component';
import { RoutesComponent } from './routes/routes.component';
import { ProfileCreationComponent } from './accounts/profile-creation/profile-creation.component';

const routes: Routes = [
  {
    path: 'route',
    component: RoutesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
