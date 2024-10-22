import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ManuscriptViewerComponent } from './manuscript-viewer/manuscript-viewer.component';
import { TeamComponent } from './team/team.component';

const routes: Routes = [
  // {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'team', component: TeamComponent},
  {path: 'viewer', component: ManuscriptViewerComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
