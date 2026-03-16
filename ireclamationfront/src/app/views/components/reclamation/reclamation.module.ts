import { CommonModule, DatePipe } from "@angular/common";
import { EtatDossierComponent } from "./etat-dossier/etat-dossier.component";
import { EtatReclamationComponent } from "./etat-reclamation/etat-reclamation.component";
import { ReclamationComponent } from "./reclamation.component";
import { ServiceComponent } from "./service/service.component";
import { SourceComponent } from "./source/source.component";
import { TypeReclamationComponent } from "./type-reclamation/type-reclamation.component";
import { ReclamationRoutingModule } from "./reclamation-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { NgModule } from "@angular/core";
import { AddReclamationComponent } from './add-reclamation/add-reclamation.component';
import { DetailReclamationComponent } from './detail-reclamation/detail-reclamation.component';
import { HistoryReclamationComponent } from './history-reclamation/history-reclamation.component';
import { EditReclamationComponent } from './edit-reclamation/edit-reclamation.component';

@NgModule({
    declarations: [ReclamationComponent, TypeReclamationComponent, EtatDossierComponent, EtatReclamationComponent, SourceComponent, ServiceComponent, AddReclamationComponent, DetailReclamationComponent, HistoryReclamationComponent, EditReclamationComponent,],
    imports: [
      CommonModule,
      ReclamationRoutingModule,
      SharedModule
    ],
    providers: [
      DatePipe // Add DatePipe here
    ]
  })
  export class ReclamationModule { }