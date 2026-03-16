import { NgModule } from "@angular/core";
import { ReclamationComponent } from "./reclamation.component";
import { TypeReclamationComponent } from "./type-reclamation/type-reclamation.component";
import { ServiceComponent } from "./service/service.component";
import { SourceComponent } from "./source/source.component";
import { EtatReclamationComponent } from "./etat-reclamation/etat-reclamation.component";
import { RouterModule } from "@angular/router";
import { UsersComponent } from "../users/users.component";
import { AdherentComponent } from "../adherent/adherent.component";
import { AddReclamationComponent } from "./add-reclamation/add-reclamation.component";
import { DetailReclamationComponent } from "./detail-reclamation/detail-reclamation.component";
import { HistoryReclamationComponent } from "./history-reclamation/history-reclamation.component";
import { EditReclamationComponent } from "./edit-reclamation/edit-reclamation.component";
import { ResetPasswordComponent } from "../reset-password/reset-password.component";
import { UserDashboardComponent } from "../user-dashboard/user-dashboard.component";

@NgModule({
    imports: [RouterModule.forChild([
      { path: '', component: ReclamationComponent },
      { path: 'TypeReclamation', component: TypeReclamationComponent },
      { path: 'services', component: ServiceComponent },
      { path: 'sources', component: SourceComponent },
      { path: 'users', component: UsersComponent },
      { path: 'resetPassword/:userId', component: ResetPasswordComponent },
      { path: 'userDashboard/:userId', component: UserDashboardComponent },
      { path: 'adherents', component: AdherentComponent },
      { path: 'addReclamation', component: AddReclamationComponent },
      { path: 'editReclamation/:reclamationId', component: EditReclamationComponent },
      { path: 'detailReclamation/:reclamationId', component: DetailReclamationComponent },
      { path: 'historyReclamation/:reclamationId', component: HistoryReclamationComponent },
      { path: 'etatReclamation', component: EtatReclamationComponent },
      { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
  })
  export class ReclamationRoutingModule { }