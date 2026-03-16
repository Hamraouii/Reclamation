import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { DashboardsRoutingModule } from './dashboard-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecByServiceComponent } from './rec-by-service/rec-by-service.component';
import { RecByTypeRecComponent } from './rec-by-type-rec/rec-by-type-rec.component';
import { RecByEtatComponent } from './rec-by-etat/rec-by-etat.component';
import { FilterRecComponent } from './filter-rec/filter-rec.component';
import { FilterRecByDossierComponent } from './filter-rec-by-dossier/filter-rec-by-dossier.component';
import { FilterRecByAffectedByComponent } from './filter-rec-by-affected-by/filter-rec-by-affected-by.component';
import { FilterRecByCreatedByComponent } from './filter-rec-by-created-by/filter-rec-by-created-by.component';
import { FilterRecByMACByComponent } from './filter-rec-by-macby/filter-rec-by-macby.component';
import { FilterRecByRegionComponent } from './filter-rec-by-region/filter-rec-by-region.component';
import { RecCountByTimePeriodComponent } from './rec-count-by-time-period/rec-count-by-time-period.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChartModule,
        SharedModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule, MessageModule,MessagesModule,
        DashboardsRoutingModule
    ],
    declarations: [DashboardComponent, RecByServiceComponent, RecByTypeRecComponent, RecByEtatComponent, FilterRecComponent, FilterRecByDossierComponent, FilterRecByAffectedByComponent, FilterRecByCreatedByComponent, FilterRecByMACByComponent, FilterRecByRegionComponent, RecCountByTimePeriodComponent]
})
export class DashboardModule { }
